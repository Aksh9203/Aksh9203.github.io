/**
 * Aksh Chauhan — Editorial Systems Portfolio Engine
 * Clean, lightweight, zero external dependencies.
 */

import { PORTFOLIO } from './data.js';

const THEME_KEY = 'aksh_theme';

/* ==========================================================================
   1. THEME (Warm Archival Light / Warm Obsidian Dark)
   ========================================================================== */
function setTheme(mode, persist = true) {
  const next = mode === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
  }
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const isDark = next === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.textContent = isDark ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', isDark ? 'Light — switch to light paper theme' : 'Dark — switch to dark obsidian theme');
  }
}

function initTheme() {
  let saved = 'light';
  try {
    saved = localStorage.getItem(THEME_KEY) || 'light';
  } catch (_) {}
  setTheme(saved, false);

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });
  }
}

/* ==========================================================================
   2. LIVE TEMPE, AZ CLOCK
   ========================================================================== */
function initClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: PORTFOLIO.profile.timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const tick = () => {
    try {
      el.textContent = `${fmt.format(new Date())} MST`;
    } catch (_) {
      el.textContent = 'MST';
    }
  };
  tick();
  setInterval(tick, 30000);
}

/* ==========================================================================
   3. TOAST FEEDBACK
   ========================================================================== */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2800);
}

/* ==========================================================================
   4. EXPANDABLE PROJECT ARCHITECTURAL LEDGER
   ========================================================================== */
function initProjects() {
  const filterWrap = document.getElementById('project-filters');
  const ledger = document.getElementById('project-ledger');
  if (!ledger) return;

  let activeFilter = 'all';
  let openId = PORTFOLIO.projects[0].id; // First flagship project open by default for immediate depth

  const render = () => {
    ledger.innerHTML = '';
    const items =
      activeFilter === 'all'
        ? PORTFOLIO.projects
        : PORTFOLIO.projects.filter((p) => p.categories.includes(activeFilter));

    items.forEach((p) => {
      const isOpen = openId === p.id;
      const article = document.createElement('article');
      article.className = `ledger-item${isOpen ? ' is-open' : ''}`;

      const flowHtml = p.flow
        .map((step, i, arr) =>
          i < arr.length - 1
            ? `<span class="flow-node">${step}</span><span class="flow-sep" aria-hidden="true">→</span>`
            : `<span class="flow-node">${step}</span>`
        )
        .join('');

      const tagsHtml = p.stack.map((s) => `<span class="tag">${s}</span>`).join('');

      article.innerHTML = `
        <button type="button" class="ledger-summary-btn" aria-expanded="${isOpen}" aria-controls="panel-${p.id}">
          <span class="ledger-num">${p.num}</span>
          <span class="ledger-title">${p.title}</span>
          <span class="ledger-metric">${p.metric}</span>
          <span class="ledger-toggle-icon" aria-hidden="true">${isOpen ? 'Close −' : 'Inspect +'}</span>
        </button>
        <div class="ledger-body" id="panel-${p.id}" ${isOpen ? '' : 'hidden'}>
          <div class="ledger-body-grid">
            <div>
              <p class="ledger-desc">${p.summary}</p>
              <dl class="ledger-kv">
                <div><dt>Constraint / Problem</dt><dd>${p.problem}</dd></div>
                <div><dt>Architecture</dt><dd>${p.solution}</dd></div>
                <div><dt>Outcome</dt><dd>${p.result}</dd></div>
              </dl>
              <div class="tag-row">${tagsHtml}</div>
              <div class="ledger-links">
                <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">${p.repoLabel} ↗</a>
              </div>
            </div>
            <div>
              <div class="flow-strip" aria-label="Request flow">${flowHtml}</div>
              <pre class="diagram-pre">${p.diagram}</pre>
            </div>
          </div>
        </div>
      `;

      article.querySelector('.ledger-summary-btn').addEventListener('click', () => {
        openId = openId === p.id ? null : p.id;
        render();
      });

      ledger.appendChild(article);
    });
  };

  if (filterWrap) {
    filterWrap.innerHTML = '';
    PORTFOLIO.projectFilters.forEach((f) => {
      const count =
        f.id === 'all'
          ? PORTFOLIO.projects.length
          : PORTFOLIO.projects.filter((p) => p.categories.includes(f.id)).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-pill${f.id === activeFilter ? ' is-active' : ''}`;
      btn.setAttribute('aria-pressed', String(f.id === activeFilter));
      btn.textContent = `${f.label} (${count})`;
      btn.addEventListener('click', () => {
        activeFilter = f.id;
        const nextList =
          activeFilter === 'all'
            ? PORTFOLIO.projects
            : PORTFOLIO.projects.filter((p) => p.categories.includes(activeFilter));
        openId = nextList[0] ? nextList[0].id : null;
        filterWrap.querySelectorAll('.filter-pill').forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        render();
      });
      filterWrap.appendChild(btn);
    });
  }

  render();
}

/* ==========================================================================
   5. EXPERIENCE, ABOUT & SKILLS HYDRATION
   ========================================================================== */
function initExperience() {
  const wrap = document.getElementById('exp-list');
  if (!wrap) return;
  wrap.innerHTML = '';

  PORTFOLIO.experience.forEach((role) => {
    const row = document.createElement('article');
    row.className = 'exp-row';
    const highlights = role.highlights
      .map((h) => `<span class="exp-highlight-chip">${h}</span>`)
      .join('');
    const bullets = role.bullets.map((b) => `<li>${b}</li>`).join('');
    const stack = role.stack.map((t) => `<span class="tag">${t}</span>`).join('');

    row.innerHTML = `
      <div>
        <div class="exp-dates">${role.dates}</div>
        <h3 class="exp-org">${role.org}</h3>
        <div class="exp-role">${role.role} · ${role.type}</div>
        <div class="exp-loc">${role.location}</div>
        <div class="exp-highlights">${highlights}</div>
      </div>
      <div>
        <ul class="exp-bullets">${bullets}</ul>
        <div class="tag-row">${stack}</div>
      </div>
    `;
    wrap.appendChild(row);
  });
}

function initAbout() {
  const copyWrap = document.getElementById('about-copy');
  const eduWrap = document.getElementById('edu-panel');

  if (copyWrap) {
    copyWrap.innerHTML = '';
    PORTFOLIO.about.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      copyWrap.appendChild(p);
    });
    const callout = document.createElement('p');
    callout.className = 'about-callout';
    callout.textContent = PORTFOLIO.about.lookingFor;
    copyWrap.appendChild(callout);
  }

  if (eduWrap) {
    eduWrap.innerHTML = '';
    PORTFOLIO.about.education.forEach((e) => {
      const div = document.createElement('div');
      div.className = 'edu-item';
      div.innerHTML = `
        <div class="edu-meta"><span>${e.dates} · ${e.location}</span><span class="edu-gpa">GPA ${e.gpa}</span></div>
        <h3 class="edu-school">${e.school}</h3>
        <div class="edu-degree">${e.degree}</div>
      `;
      eduWrap.appendChild(div);
    });
  }
}

function initSkills() {
  const wrap = document.getElementById('skills-spec');
  if (!wrap) return;
  wrap.innerHTML = '';
  PORTFOLIO.skills.forEach((group) => {
    const row = document.createElement('div');
    row.className = 'spec-row';
    const items = group.items.map((i) => `<span class="spec-chip">${i}</span>`).join('');
    row.innerHTML = `<div class="spec-label">${group.category}</div><div class="spec-items">${items}</div>`;
    wrap.appendChild(row);
  });
}

/* ==========================================================================
   6. EMAIL COPY, MOBILE DRAWER & QUICK JUMP (Cmd/Ctrl + K)
   ========================================================================== */
function initContactAndNav() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = PORTFOLIO.profile.email;
      const done = () => {
        copyBtn.textContent = 'Copied ✓';
        showToast(`Copied ${email}`);
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (menuBtn && drawer) {
    const toggle = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      drawer.hidden = !open;
    };
    menuBtn.addEventListener('click', () => toggle(menuBtn.getAttribute('aria-expanded') !== 'true'));
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  }

  // Active nav highlighting
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((a) => {
              const match = a.getAttribute('href') === `#${id}`;
              a.classList.toggle('is-active', match);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -55% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }
}

function initQuickJump() {
  const modal = document.getElementById('quick-modal');
  const input = document.getElementById('quick-input');
  const list = document.getElementById('quick-list');
  const closeBtn = document.getElementById('quick-close');
  const openBtns = document.querySelectorAll('[data-open-quick]');
  if (!modal || !input || !list) return;

  const actions = [
    { label: 'Selected Projects', hint: '#projects', run: () => jump('#projects') },
    { label: 'Work Experience (MindSpark · Axisray)', hint: '#experience', run: () => jump('#experience') },
    { label: 'About & Education (ASU M.S.)', hint: '#about', run: () => jump('#about') },
    { label: 'Technical Toolkit', hint: '#skills', run: () => jump('#skills') },
    { label: 'Contact & Links', hint: '#contact', run: () => jump('#contact') },
    {
      label: 'Download Resume (PDF)',
      hint: 'PDF ↓',
      run: () => {
        close();
        window.open(PORTFOLIO.profile.resumePath, '_blank', 'noopener');
      }
    },
    {
      label: 'Copy Email Address',
      hint: PORTFOLIO.profile.email,
      run: () => {
        close();
        if (navigator.clipboard) navigator.clipboard.writeText(PORTFOLIO.profile.email).catch(() => {});
        showToast(`Copied ${PORTFOLIO.profile.email}`);
      }
    },
    {
      label: 'Toggle Light / Dark Theme',
      hint: 'Paper / Obsidian',
      run: () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next, true);
        close();
      }
    }
  ];

  let prevFocus = null;
  let selectedIdx = 0;
  let visible = [...actions];

  function jump(selector) {
    close();
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = `index.html${selector}`;
  }

  function render(query = '') {
    const q = query.trim().toLowerCase();
    visible = actions.filter((a) => a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));
    selectedIdx = 0;
    list.innerHTML = '';
    visible.forEach((item, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `quick-item-btn${idx === selectedIdx ? ' is-selected' : ''}`;
      btn.innerHTML = `<span>${item.label}</span><span class="quick-item-hint">${item.hint}</span>`;
      btn.addEventListener('click', item.run);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function open() {
    prevFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.hidden = false;
    input.value = '';
    render('');
    setTimeout(() => input.focus(), 20);
  }

  function close() {
    modal.hidden = true;
    if (prevFocus && document.contains(prevFocus)) prevFocus.focus();
  }

  openBtns.forEach((b) => b.addEventListener('click', open));
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  input.addEventListener('input', (e) => render(e.target.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown' && visible.length) {
      e.preventDefault();
      selectedIdx = (selectedIdx + 1) % visible.length;
      syncSelection();
    } else if (e.key === 'ArrowUp' && visible.length) {
      e.preventDefault();
      selectedIdx = (selectedIdx - 1 + visible.length) % visible.length;
      syncSelection();
    } else if (e.key === 'Enter' && visible[selectedIdx]) {
      e.preventDefault();
      visible[selectedIdx].run();
    }
  });

  function syncSelection() {
    list.querySelectorAll('.quick-item-btn').forEach((btn, i) => {
      btn.classList.toggle('is-selected', i === selectedIdx);
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.hidden) open();
      else close();
    } else if (e.key === 'Escape' && !modal.hidden) {
      close();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initProjects();
  initExperience();
  initAbout();
  initSkills();
  initContactAndNav();
  initQuickJump();
});
