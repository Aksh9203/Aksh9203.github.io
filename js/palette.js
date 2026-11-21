/**
 * J.A.R.V.I.S. Command Palette (Ctrl/Cmd + K or HUD button)
 * Accessible dialog with keyboard navigation, standard commands, secret commands,
 * and `help` access to every easter egg for full keyboard/touch accessibility.
 */

import { SITE_DATA } from './data.js';
import { openDialog, closeDialog, toggleTheme, getTheme, showToast } from './hud.js';

export function initCommandPalette({ eggApi }) {
  const overlay = document.getElementById('palette-modal');
  const input = document.getElementById('palette-input');
  const listEl = document.getElementById('palette-list');
  const outputEl = document.getElementById('palette-output');
  const closeBtn = document.getElementById('palette-close-btn');
  const triggers = document.querySelectorAll('[data-open-palette]');

  if (!overlay || !input || !listEl || !outputEl) return;

  const navigateToSection = (selector, label) => {
    closeDialog(overlay);
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`J.A.R.V.I.S. // Routing to ${label}`);
    } else {
      window.location.href = `index.html${selector}`;
    }
  };

  const renderOutput = (title, lines, actionButtons = []) => {
    outputEl.hidden = false;
    outputEl.innerHTML = '';

    const head = document.createElement('div');
    head.className = 'palette-output-title';
    head.textContent = title;
    outputEl.appendChild(head);

    lines.forEach((line) => {
      const p = document.createElement('p');
      p.className = 'palette-output-line';
      p.textContent = line;
      outputEl.appendChild(p);
    });

    if (actionButtons.length) {
      const row = document.createElement('div');
      row.className = 'palette-output-actions';
      actionButtons.forEach((act) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hud-chip-btn';
        btn.textContent = act.label;
        btn.addEventListener('click', act.run);
        row.appendChild(btn);
      });
      outputEl.appendChild(row);
    }
  };

  const standardCommands = [
    {
      cmd: 'whoami',
      desc: 'Display profile summary, education & current role',
      run: () => {
        const { profile, about } = SITE_DATA;
        renderOutput(
          'J.A.R.V.I.S. // IDENTITY VERIFIED',
          [
            `${profile.name} — ${profile.title} (${profile.subtitle})`,
            `Location: ${profile.location} · Status: ${profile.availability}`,
            `Current: Software Developer @ MindSpark (AWS Serverless & GenAI)`,
            `Education: ${about.education[0].degree} @ ${about.education[0].school} (${about.education[0].dates}, ${about.education[0].gpa})`
          ],
          [
            { label: 'Jump to About (Vision)', run: () => navigateToSection('#about', 'Vision // About') },
            { label: 'Download Resume', run: () => window.open(SITE_DATA.profile.resumePath, '_blank', 'noopener') }
          ]
        );
      }
    },
    {
      cmd: 'projects',
      desc: 'Jump to E.D.I.T.H. Target Analysis (Projects)',
      run: () => navigateToSection('#projects', 'E.D.I.T.H. // Projects')
    },
    {
      cmd: 'experience',
      desc: 'Jump to F.R.I.D.A.Y. Mission Logs (Experience)',
      run: () => navigateToSection('#experience', 'F.R.I.D.A.Y. // Experience')
    },
    {
      cmd: 'skills',
      desc: 'Jump to Ultron Upgrade Lab (Skills)',
      run: () => navigateToSection('#skills', 'Ultron // Skills')
    },
    {
      cmd: 'resume',
      desc: 'Open / download Aksh_Chauhan_Resume.pdf',
      run: () => {
        const link = document.createElement('a');
        link.href = SITE_DATA.profile.resumePath;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        renderOutput('J.A.R.V.I.S. // RESUME DISPATCHED', [
          `Opening ${SITE_DATA.profile.resumePath} in a new tab.`
        ]);
      }
    },
    {
      cmd: 'contact',
      desc: 'Jump to J.A.R.V.I.S. Direct Uplink (Contact)',
      run: () => navigateToSection('#contact', 'J.A.R.V.I.S. // Contact')
    },
    {
      cmd: 'theme',
      desc: 'Toggle between Vision Mode and Ultron Mode',
      run: () => {
        const next = toggleTheme();
        renderOutput('SYSTEM THEME UPDATED', [
          `Active visual protocol: ${next === 'ultron' ? 'ULTRON MODE (Crimson Tactical)' : 'VISION MODE (Synthetic Default)'}.`
        ]);
      }
    },
    {
      cmd: 'help',
      desc: 'List all commands & accessible anomaly shortcuts',
      run: () => {
        renderOutput(
          'J.A.R.V.I.S. // COMMAND DIRECTORY & ACCESSIBLE ANOMALIES',
          [
            'Standard commands: whoami · projects · experience · skills · resume · contact · theme · help',
            'Keyboard & touch access to all hidden MCU anomalies below (no mouse-only tricks required):'
          ],
          [
            {
              label: '1. Mind Stone',
              run: () => {
                closeDialog(overlay);
                eggApi.openMindStone();
              }
            },
            {
              label: '2. Infinity Stones',
              run: () => {
                closeDialog(overlay);
                eggApi.openStonesOverview();
              }
            },
            {
              label: '3. Protocol 3000',
              run: () => {
                closeDialog(overlay);
                eggApi.openProtocol3000();
              }
            },
            {
              label: '4a. jarvis, you up?',
              run: () => {
                closeDialog(overlay);
                eggApi.openPaletteSecret('jarvis, you up?');
              }
            },
            {
              label: '4b. avengers assemble',
              run: () => {
                closeDialog(overlay);
                eggApi.openPaletteSecret('avengers assemble');
              }
            },
            {
              label: '4c. i am iron man',
              run: () => {
                closeDialog(overlay);
                eggApi.openPaletteSecret('i am iron man');
              }
            },
            {
              label: '5. Post-Credits',
              run: () => {
                closeDialog(overlay);
                eggApi.openPostCredits();
              }
            },
            {
              label: '6. Shawarma',
              run: () => {
                closeDialog(overlay);
                eggApi.openShawarma();
              }
            },
            {
              label: '7. Dev Console Ping',
              run: () => {
                eggApi.triggerDevConsole(true);
                renderOutput('DEV CONSOLE PING SENT', [
                  'J.A.R.V.I.S. transmitted the formatted banner to your browser DevTools console (F12).'
                ]);
              }
            }
          ]
        );
      }
    }
  ];

  let activeIndex = 0;
  let visibleCommands = [...standardCommands];

  const renderList = (query = '') => {
    const q = query.trim().toLowerCase();
    visibleCommands = standardCommands.filter(
      (item) => item.cmd.includes(q) || item.desc.toLowerCase().includes(q)
    );
    activeIndex = 0;
    listEl.innerHTML = '';

    if (!visibleCommands.length) {
      const li = document.createElement('li');
      li.className = 'palette-empty';
      li.textContent = `Press Enter to transmit "${query.trim()}" to J.A.R.V.I.S.…`;
      listEl.appendChild(li);
      return;
    }

    visibleCommands.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(index === activeIndex));

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `palette-item${index === activeIndex ? ' is-selected' : ''}`;
      btn.innerHTML = `<span class="palette-cmd">${item.cmd}</span><span class="palette-desc">${item.desc}</span>`;
      btn.addEventListener('click', () => item.run());
      btn.addEventListener('mouseenter', () => {
        activeIndex = index;
        updateHighlight();
      });

      li.appendChild(btn);
      listEl.appendChild(li);
    });
  };

  const updateHighlight = () => {
    const items = listEl.querySelectorAll('.palette-item');
    items.forEach((btn, idx) => {
      const selected = idx === activeIndex;
      btn.classList.toggle('is-selected', selected);
      btn.parentElement.setAttribute('aria-selected', String(selected));
    });
  };

  const executeRawCommand = (raw) => {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return;

    // Secret Easter Egg commands
    if (normalized === '3000') {
      closeDialog(overlay);
      eggApi.openProtocol3000();
      return;
    }

    if (SITE_DATA.eggs.paletteSecrets[normalized]) {
      closeDialog(overlay);
      eggApi.openPaletteSecret(normalized);
      return;
    }

    // Exact standard match
    const exact = standardCommands.find((c) => c.cmd === normalized);
    if (exact) {
      exact.run();
      return;
    }

    // Filtered top selection
    if (visibleCommands[activeIndex]) {
      visibleCommands[activeIndex].run();
      return;
    }

    renderOutput('UNKNOWN DIRECTIVE', [
      `Command "${raw.trim()}" not recognized. Type "help" for available directives and hidden anomalies.`,
      `Current theme: ${getTheme().toUpperCase()} MODE.`
    ]);
  };

  const openPalette = () => {
    input.value = '';
    outputEl.hidden = true;
    renderList('');
    openDialog(overlay, { initialFocusEl: input });
  };

  triggers.forEach((btn) => btn.addEventListener('click', openPalette));
  if (closeBtn) closeBtn.addEventListener('click', () => closeDialog(overlay));

  input.addEventListener('input', (e) => {
    renderList(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && visibleCommands.length) {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % visibleCommands.length;
      updateHighlight();
    } else if (e.key === 'ArrowUp' && visibleCommands.length) {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + visibleCommands.length) % visibleCommands.length;
      updateHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeRawCommand(input.value);
    }
  });

  // Global Cmd/Ctrl + K shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('is-open')) {
        closeDialog(overlay);
      } else {
        openPalette();
      }
    }
  });

  return { openPalette };
}
