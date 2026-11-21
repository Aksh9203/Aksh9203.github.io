/**
 * Global HUD Controller:
 * - Vision / Ultron theme switching (CSS custom properties + localStorage)
 * - First-visit skippable J.A.R.V.I.S. boot sequence (<= 1.8s, reduced-motion safe)
 * - Scroll-spy active AI host status indicator + nav highlighting
 * - Live Phoenix/Tempe MST clock
 * - Accessible modal controller (focus trap, Esc, restore focus, aria-hidden)
 * - Toast notification & mobile nav menu
 */

import { SITE_DATA } from './data.js';

const THEME_KEY = 'vq_theme';
const BOOT_KEY = 'vq_boot_seen';

export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ==========================================================================
   1. THEME MANAGEMENT (Vision Mode default / Ultron Mode override)
   ========================================================================== */
export function getTheme() {
  return document.documentElement.dataset.theme === 'ultron' ? 'ultron' : 'vision';
}

export function setTheme(mode, { persist = true, announce = false } = {}) {
  const normalized = mode === 'ultron' ? 'ultron' : 'vision';
  document.documentElement.dataset.theme = normalized;
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, normalized);
    } catch (_) {}
  }

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    const isUltron = normalized === 'ultron';
    toggleBtn.setAttribute('aria-pressed', String(isUltron));
    toggleBtn.setAttribute(
      'aria-label',
      isUltron ? 'ULTRON mode — switch to Vision mode' : 'VISION mode — switch to Ultron mode'
    );
    const labelEl = toggleBtn.querySelector('.theme-label');
    if (labelEl) labelEl.textContent = isUltron ? 'ULTRON' : 'VISION';
  }

  if (announce) {
    showToast(
      normalized === 'ultron'
        ? 'ULTRON PROTOCOL ENGAGED // Crimson Tactical Mode'
        : 'VISION PROTOCOL RESTORED // Synthetic Default Mode'
    );
  }
  return normalized;
}

export function toggleTheme() {
  return setTheme(getTheme() === 'ultron' ? 'vision' : 'ultron', {
    persist: true,
    announce: true
  });
}

export function initTheme() {
  let saved = 'vision';
  try {
    saved = localStorage.getItem(THEME_KEY) || 'vision';
  } catch (_) {}
  setTheme(saved, { persist: false, announce: false });

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleTheme());
  }
}

/* ==========================================================================
   2. FIRST-VISIT J.A.R.V.I.S. BOOT SEQUENCE (<= 1.8s, non-blocking, skippable)
   ========================================================================== */
export function initBootSequence() {
  const overlay = document.getElementById('boot-overlay');
  if (!overlay) return;

  let seen = false;
  try {
    seen = localStorage.getItem(BOOT_KEY) === '1';
  } catch (_) {}

  if (seen || prefersReducedMotion()) {
    overlay.remove();
    return;
  }

  // Non-blocking overlay shown smoothly after initial frame so FCP isn't stalled
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('is-visible'));

  const dismiss = () => {
    if (overlay.dataset.dismissed === '1') return;
    overlay.dataset.dismissed = '1';
    try {
      localStorage.setItem(BOOT_KEY, '1');
    } catch (_) {}
    overlay.classList.remove('is-visible');
    overlay.classList.add('is-exiting');
    setTimeout(() => overlay.remove(), 300);
  };

  const skipBtn = document.getElementById('boot-skip-btn');
  if (skipBtn) skipBtn.addEventListener('click', dismiss);

  const onKey = (e) => {
    if (e.key === 'Escape') {
      dismiss();
      window.removeEventListener('keydown', onKey);
    }
  };
  window.addEventListener('keydown', onKey);

  // Guaranteed <= 1.8s auto-complete
  setTimeout(() => {
    window.removeEventListener('keydown', onKey);
    dismiss();
  }, 1750);
}

/* ==========================================================================
   3. TYPED HERO GREETING (respects prefers-reduced-motion)
   ========================================================================== */
export function initHeroGreeting() {
  const el = document.getElementById('jarvis-greeting');
  if (!el) return;
  const fullText = SITE_DATA.profile.greeting;
  if (prefersReducedMotion()) {
    el.textContent = fullText;
    return;
  }
  el.textContent = '';
  let idx = 0;
  const step = () => {
    if (idx <= fullText.length) {
      el.textContent = fullText.slice(0, idx);
      idx += 1;
      setTimeout(step, 26);
    }
  };
  setTimeout(step, 180);
}

/* ==========================================================================
   4. LIVE LOCAL TIME CLOCK (Phoenix / Tempe, AZ)
   ========================================================================== */
export function initClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_DATA.profile.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const update = () => {
    try {
      clockEl.textContent = `${formatter.format(new Date())} MST`;
    } catch (_) {
      clockEl.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. PERSISTENT AI STATUS INDICATOR & SCROLL-SPY NAVIGATION
   ========================================================================== */
export function initAiStatusObserver() {
  const sections = document.querySelectorAll('section[data-ai-host], footer[data-ai-host]');
  if (!sections.length) return;

  const statusText = document.getElementById('hud-ai-status-text');
  const statusPill = document.getElementById('hud-ai-status');
  const navLinks = document.querySelectorAll('.hud-nav-links a[href^="#"]');

  const setActiveHost = (sectionId) => {
    const host = SITE_DATA.aiHosts[sectionId] || SITE_DATA.aiHosts.hero;
    if (statusText) statusText.textContent = host.status;
    if (statusPill) {
      statusPill.dataset.host = host.id;
      statusPill.style.setProperty('--host-accent', `var(${host.accentVar})`);
    }
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('is-active', match);
      if (match) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if (!('IntersectionObserver' in window)) {
    setActiveHost('hero');
    return;
  }

  const ratios = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      let bestId = null;
      let bestRatio = 0;
      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      if (bestId) setActiveHost(bestId);
    },
    { threshold: [0.15, 0.35, 0.6], rootMargin: '-12% 0px -30% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   6. MOBILE NAV MENU TOGGLE
   ========================================================================== */
export function initMobileNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!btn || !drawer) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
    drawer.classList.toggle('is-open', open);
  };

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  drawer.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      btn.focus();
    }
  });
}

/* ==========================================================================
   7. ACCESSIBLE MODAL ENGINE (Focus Trap + Esc + Focus Restore)
   ========================================================================== */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const activeModals = [];

export function openDialog(overlayEl, { initialFocusEl = null, onClose = null } = {}) {
  if (!overlayEl) return;
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  overlayEl.hidden = false;
  overlayEl.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => overlayEl.classList.add('is-open'));
  document.body.style.overflow = 'hidden';

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog(overlayEl);
      return;
    }
    if (e.key === 'Tab') {
      const focusables = Array.from(overlayEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === overlayEl) closeDialog(overlayEl);
  };

  overlayEl.addEventListener('keydown', handleKeyDown);
  overlayEl.addEventListener('click', handleBackdrop);

  const entry = { overlayEl, previousFocus, handleKeyDown, handleBackdrop, onClose };
  activeModals.push(entry);

  setTimeout(() => {
    const target =
      initialFocusEl ||
      overlayEl.querySelector('[data-autofocus]') ||
      overlayEl.querySelector(FOCUSABLE_SELECTOR);
    if (target && typeof target.focus === 'function') target.focus();
  }, 30);
}

export function closeDialog(overlayEl) {
  const idx = activeModals.findIndex((m) => m.overlayEl === overlayEl);
  if (idx === -1) {
    if (overlayEl) {
      overlayEl.classList.remove('is-open');
      overlayEl.setAttribute('aria-hidden', 'true');
      overlayEl.hidden = true;
    }
    return;
  }

  const entry = activeModals.splice(idx, 1)[0];
  overlayEl.removeEventListener('keydown', entry.handleKeyDown);
  overlayEl.removeEventListener('click', entry.handleBackdrop);
  overlayEl.classList.remove('is-open');
  overlayEl.setAttribute('aria-hidden', 'true');

  if (!activeModals.length) {
    document.body.style.overflow = '';
  }

  setTimeout(() => {
    if (!overlayEl.classList.contains('is-open')) {
      overlayEl.hidden = true;
    }
  }, prefersReducedMotion() ? 0 : 200);

  if (typeof entry.onClose === 'function') entry.onClose();
  if (entry.previousFocus && document.contains(entry.previousFocus)) {
    entry.previousFocus.focus();
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATIONS (ARIA live region)
   ========================================================================== */
let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('hud-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3400);
}
