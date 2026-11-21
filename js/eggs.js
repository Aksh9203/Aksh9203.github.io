/**
 * Modular MCU Easter Eggs (Engineering & Portfolio Flavor Only)
 * 7 self-contained anomalies tracked in localStorage with live HUD & footer indicators:
 * 1. Mind Stone (5x activate on Vision's gem)
 * 2. Infinity Stones Hunt (6 hidden geometric SVG stones + Snap animation)
 * 3. Protocol "3000" (type 3000 anywhere or run in palette)
 * 4. Command Palette Secrets ("jarvis, you up?", "avengers assemble", "i am iron man")
 * 5. Post-Credits Scene (linger at footer 4s or click button)
 * 6. Shawarma (triggered after copying/clicking email)
 * 7. Dev Console (styled J.A.R.V.I.S. DevTools greeting + window.JARVIS helper)
 */

import { SITE_DATA } from './data.js';
import { openDialog, closeDialog, showToast, prefersReducedMotion } from './hud.js';

const EGGS_KEY = 'vq_eggs_found';
const STONES_KEY = 'vq_stones_found';
const TOTAL_ANOMALIES = 7;

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (_) {
    return new Set();
  }
}

function saveSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch (_) {}
}

export function initEasterEggs() {
  const foundEggs = loadSet(EGGS_KEY);
  const foundStones = loadSet(STONES_KEY);

  const modal = document.getElementById('classified-modal');
  const closeBtn = document.getElementById('classified-modal-close');
  const anomalyEl = document.getElementById('anomaly-counter');
  const hudStoneBtn = document.getElementById('hud-stones-btn');
  const hudStoneCount = document.getElementById('hud-stones-count');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => closeDialog(modal));
  }

  const updateCounters = () => {
    const remaining = Math.max(0, TOTAL_ANOMALIES - foundEggs.size);
    if (anomalyEl) {
      if (foundEggs.size === 0) {
        anomalyEl.textContent = `J.A.R.V.I.S. detects ${TOTAL_ANOMALIES} anomalies on this site…`;
      } else if (remaining > 0) {
        anomalyEl.textContent = `J.A.R.V.I.S. detects ${remaining} ${remaining === 1 ? 'anomaly' : 'anomalies'} remaining (${foundEggs.size}/${TOTAL_ANOMALIES} catalogued)…`;
      } else {
        anomalyEl.textContent = `All ${TOTAL_ANOMALIES}/${TOTAL_ANOMALIES} anomalies catalogued. Archive synchronized.`;
      }
    }

    if (hudStoneBtn && hudStoneCount) {
      if (foundStones.size > 0) {
        hudStoneBtn.hidden = false;
        hudStoneCount.textContent = `${foundStones.size}/6`;
      }
    }
  };

  const recordEgg = (eggId) => {
    if (!foundEggs.has(eggId)) {
      foundEggs.add(eggId);
      saveSet(EGGS_KEY, foundEggs);
      updateCounters();
    }
  };

  const openClassified = ({ classification, host, title, quote, body = [], checklist = [], tags = [], stones = null, showActions = false }) => {
    if (!modal) return;
    document.getElementById('cm-class').textContent = classification;
    document.getElementById('cm-host').textContent = `HOST // ${host}`;
    document.getElementById('cm-title').textContent = title;

    const quoteEl = document.getElementById('cm-quote');
    quoteEl.textContent = quote || '';
    quoteEl.hidden = !quote;

    const contentEl = document.getElementById('cm-content');
    contentEl.innerHTML = '';

    body.forEach((para) => {
      const p = document.createElement('p');
      p.textContent = para;
      contentEl.appendChild(p);
    });

    if (checklist.length) {
      const ul = document.createElement('ul');
      ul.className = 'classified-list';
      checklist.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      contentEl.appendChild(ul);
    }

    if (stones) {
      const list = document.createElement('div');
      list.className = 'stones-dossier-grid';
      stones.forEach((st) => {
        const collected = foundStones.has(st.id);
        const card = document.createElement('div');
        card.className = `stone-dossier-card${collected ? ' is-collected' : ''}`;
        card.innerHTML = `
          <div class="stone-dossier-head">
            <span class="stone-dot" style="background:${st.color}"></span>
            <strong>${st.name}</strong>
            <span class="stone-state">${collected ? 'COLLECTED' : 'UNDISCOVERED'}</span>
          </div>
          <p>${collected || foundStones.size === 6 ? st.detail : `Signal detected near #${st.section} section.`}</p>
        `;
        list.appendChild(card);
      });
      contentEl.appendChild(list);
    }

    if (tags.length) {
      const tagRow = document.createElement('div');
      tagRow.className = 'tech-tag-row';
      tags.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        tagRow.appendChild(span);
      });
      contentEl.appendChild(tagRow);
    }

    const footerActions = document.getElementById('cm-actions');
    if (footerActions) {
      footerActions.hidden = !showActions;
    }

    openDialog(modal, { initialFocusEl: closeBtn });
  };

  /* ------------------------------------------------------------------------
     EGG 1: MIND STONE (5 clicks / activations on Vision's gem)
     ------------------------------------------------------------------------ */
  const openMindStone = () => {
    recordEgg('mind-stone');
    openClassified(SITE_DATA.eggs.mindStone);
  };

  const gemBtn = document.getElementById('mind-stone-btn');
  if (gemBtn) {
    let clicks = 0;
    let resetTimer = null;
    gemBtn.addEventListener('click', () => {
      clicks += 1;
      clearTimeout(resetTimer);
      gemBtn.classList.remove('is-pulsing');
      void gemBtn.offsetWidth;
      gemBtn.classList.add('is-pulsing');

      if (clicks < 5) {
        showToast(`Mind Stone resonance: ${clicks}/5…`);
        resetTimer = setTimeout(() => {
          clicks = 0;
        }, 4000);
      } else {
        clicks = 0;
        openMindStone();
      }
    });
  }

  /* ------------------------------------------------------------------------
     EGG 2: INFINITY STONES HUNT (6 hidden stones + Snap animation)
     ------------------------------------------------------------------------ */
  const triggerSnapEffect = (callback) => {
    if (prefersReducedMotion()) {
      callback();
      return;
    }
    const flash = document.createElement('div');
    flash.className = 'snap-flash-overlay';
    flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);
    requestAnimationFrame(() => flash.classList.add('is-active'));
    setTimeout(() => {
      flash.remove();
      callback();
    }, 680);
  };

  const openStonesOverview = () => {
    const data = SITE_DATA.eggs.infinityStones;
    const allFound = foundStones.size >= 6;
    if (allFound) recordEgg('infinity-stones');
    openClassified({
      classification: allFound
        ? data.classification
        : `INFINITY STONE SCANNER // ${foundStones.size} OF 6 COLLECTED`,
      host: data.host,
      title: allFound ? data.title : 'Anomalous Energy Signatures',
      quote: allFound
        ? data.quote
        : 'Six geometric stones are hidden across the synthetic hosts. Locate all six to unlock the full milestone dossier.',
      stones: data.stones
    });
  };

  document.querySelectorAll('[data-stone]').forEach((btn) => {
    const id = btn.dataset.stone;
    if (foundStones.has(id)) {
      btn.classList.add('is-collected');
      btn.setAttribute('aria-pressed', 'true');
    }

    btn.addEventListener('click', () => {
      if (foundStones.has(id)) {
        openStonesOverview();
        return;
      }

      foundStones.add(id);
      saveSet(STONES_KEY, foundStones);
      btn.classList.add('is-collected');
      btn.setAttribute('aria-pressed', 'true');
      updateCounters();

      const stoneMeta = SITE_DATA.eggs.infinityStones.stones.find((s) => s.id === id);
      if (foundStones.size >= 6) {
        recordEgg('infinity-stones');
        showToast('All 6 Infinity Stones collected… SNAP!');
        triggerSnapEffect(() => openStonesOverview());
      } else {
        showToast(
          `${stoneMeta ? stoneMeta.name : 'Stone'} acquired (${foundStones.size}/6)`
        );
      }
    });
  });

  if (hudStoneBtn) {
    hudStoneBtn.addEventListener('click', openStonesOverview);
  }

  /* ------------------------------------------------------------------------
     EGG 3: "3000" TYPED SEQUENCE (global key buffer + palette fallback)
     ------------------------------------------------------------------------ */
  const openProtocol3000 = () => {
    recordEgg('protocol-3000');
    openClassified(SITE_DATA.eggs.protocol3000);
  };

  let keyBuffer = '';
  let bufferReset = null;
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1) {
      keyBuffer = (keyBuffer + e.key).slice(-4);
      clearTimeout(bufferReset);
      bufferReset = setTimeout(() => {
        keyBuffer = '';
      }, 2500);
      if (keyBuffer === '3000') {
        keyBuffer = '';
        openProtocol3000();
      }
    }
  });

  /* ------------------------------------------------------------------------
     EGG 4: COMMAND PALETTE SECRETS
     ------------------------------------------------------------------------ */
  const openPaletteSecret = (cmdKey) => {
    const payload = SITE_DATA.eggs.paletteSecrets[cmdKey];
    if (!payload) return;
    recordEgg('palette-secrets');
    openClassified(payload);
  };

  /* ------------------------------------------------------------------------
     EGG 5: POST-CREDITS SCENE (Footer linger or explicit button)
     ------------------------------------------------------------------------ */
  const openPostCredits = () => {
    recordEgg('post-credits');
    openClassified({ ...SITE_DATA.eggs.postCredits, showActions: true });
  };

  const postCreditsBtn = document.getElementById('post-credits-btn');
  if (postCreditsBtn) {
    postCreditsBtn.addEventListener('click', openPostCredits);
  }

  const footer = document.getElementById('contact');
  if (footer && 'IntersectionObserver' in window && !prefersReducedMotion()) {
    let lingerTimer = null;
    let prompted = false;
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prompted && !foundEggs.has('post-credits')) {
            lingerTimer = setTimeout(() => {
              prompted = true;
              const banner = document.getElementById('post-credits-banner');
              if (banner) {
                banner.hidden = false;
                requestAnimationFrame(() => banner.classList.add('is-visible'));
              }
            }, 4200);
          } else {
            clearTimeout(lingerTimer);
          }
        });
      },
      { threshold: 0.6 }
    );
    footerObserver.observe(footer);
  }

  /* ------------------------------------------------------------------------
     EGG 6: SHAWARMA (after copying or clicking email)
     ------------------------------------------------------------------------ */
  const openShawarma = () => {
    recordEgg('shawarma');
    openClassified(SITE_DATA.eggs.shawarma);
  };

  /* ------------------------------------------------------------------------
     EGG 7: DEV CONSOLE GREETING FROM J.A.R.V.I.S.
     ------------------------------------------------------------------------ */
  const triggerDevConsole = (markFound = false) => {
    if (markFound) recordEgg('dev-console');
    console.log(
      '%c J.A.R.V.I.S. // SYNTHETIC NETWORK ONLINE ',
      'background:#0c121d;color:#38bdf8;font-family:monospace;font-size:14px;font-weight:bold;padding:6px 10px;border:1px solid #38bdf8;border-radius:4px;'
    );
    console.log(
      '%cGood evening, developer. Profile loaded: Aksh Chauhan (Backend · Cloud · GenAI).\n' +
        'Try Ctrl/Cmd + K and run: "jarvis, you up?", "avengers assemble", "i am iron man", or type "3000" anywhere.\n' +
        'Run JARVIS.scan() right here in DevTools to catalogue this console anomaly.',
      'color:#b4c2d9;font-family:monospace;font-size:12px;line-height:1.6;'
    );
  };

  // Expose safe DevTools helper
  window.JARVIS = {
    scan: () => {
      recordEgg('dev-console');
      console.log(
        '%c[J.A.R.V.I.S.] DevTools anomaly catalogued. Press Ctrl/Cmd + K and type "help" for all directives.',
        'color:#34d399;font-family:monospace;font-weight:bold;'
      );
      showToast('J.A.R.V.I.S. // DevTools anomaly catalogued!');
      return `${foundEggs.size}/${TOTAL_ANOMALIES} anomalies catalogued`;
    }
  };

  triggerDevConsole(false);
  updateCounters();

  return {
    openMindStone,
    openStonesOverview,
    openProtocol3000,
    openPaletteSecret,
    openPostCredits,
    openShawarma,
    triggerDevConsole
  };
}
