/**
 * Dynamic Section Renderers & Interactions:
 * - Vision: Warm editorial narrative & education plaques
 * - F.R.I.D.A.Y.: Mission debrief logs + scroll-powered vertical conduit
 * - E.D.I.T.H.: AR visor targeting reticles, live mouse crosshair, inline schematic pipeline & Target Analysis modal
 * - Ultron: Interactive SVG Neural Constellation synced with machined skill modules
 * - J.A.R.V.I.S. Comms: Direct uplink email copy/mailto + Shawarma hook
 */

import { SITE_DATA } from './data.js';
import { openDialog, closeDialog, showToast, prefersReducedMotion } from './hud.js';

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

/* ==========================================================================
   1. VISION // ABOUT & EDUCATION
   ========================================================================== */
export function initAboutSection() {
  const storyContainer = document.getElementById('vision-story');
  const eduContainer = document.getElementById('vision-education');

  if (storyContainer) {
    storyContainer.innerHTML = '';
    SITE_DATA.about.paragraphs.forEach((para) => {
      storyContainer.appendChild(createEl('p', 'vision-para', para));
    });
    storyContainer.appendChild(createEl('p', 'vision-looking-for', SITE_DATA.about.lookingFor));
  }

  if (eduContainer) {
    eduContainer.innerHTML = '';
    SITE_DATA.about.education.forEach((edu) => {
      const card = createEl('div', 'edu-card');
      card.innerHTML = `
        <div class="edu-top">
          <span class="edu-dates">${edu.dates}</span>
          <span class="edu-gpa">${edu.gpa}</span>
        </div>
        <h3 class="edu-school">${edu.school}</h3>
        <p class="edu-degree">${edu.degree}</p>
        <span class="edu-loc">${edu.location}</span>
      `;
      eduContainer.appendChild(card);
    });
  }
}

/* ==========================================================================
   2. F.R.I.D.A.Y. // EXPERIENCE MISSION LOGS
   ========================================================================== */
export function initExperienceSection() {
  const container = document.getElementById('friday-timeline');
  if (!container) return;

  container.innerHTML = '';
  SITE_DATA.experience.forEach((role) => {
    const item = createEl('article', 'mission-card');
    item.dataset.roleId = role.id;

    const metricsHtml = role.metrics
      .map((m) => `<span class="mission-metric">${m}</span>`)
      .join('');
    const bulletsHtml = role.bullets.map((b) => `<li>${b}</li>`).join('');
    const techHtml = role.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('');

    item.innerHTML = `
      <div class="timeline-node" aria-hidden="true"><span class="timeline-node-core"></span></div>
      <div class="mission-panel">
        <div class="mission-meta">
          <span class="mission-code">${role.code}</span>
          <span class="mission-status">${role.status}</span>
          <span class="mission-dates">${role.dates}</span>
        </div>
        <header class="mission-header">
          <div>
            <h3 class="mission-role">${role.role} <span class="mission-org">@ ${role.org}</span></h3>
            <p class="mission-loc">${role.type} · ${role.location}</p>
          </div>
        </header>
        <div class="mission-metrics" aria-label="Key impact metrics">${metricsHtml}</div>
        <ul class="mission-bullets">${bulletsHtml}</ul>
        <div class="tech-tag-row" aria-label="Technologies used">${techHtml}</div>
      </div>
    `;
    container.appendChild(item);
  });

  const cards = container.querySelectorAll('.mission-card');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('is-powered'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-powered');
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((c) => io.observe(c));
}

/* ==========================================================================
   3. E.D.I.T.H. // AR VISOR PROJECTS, INLINE SCHEMATICS & TARGET MODAL
   ========================================================================== */
export function initProjectsSection() {
  const filterWrap = document.getElementById('edith-filters');
  const grid = document.getElementById('edith-grid');
  const visor = document.getElementById('edith-visor-shell');
  const cursorEl = document.getElementById('edith-cursor-reticle');
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');

  if (!grid) return;

  // Live AR crosshair inside E.D.I.T.H. visor on desktop fine pointers
  if (
    visor &&
    cursorEl &&
    !prefersReducedMotion() &&
    window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches
  ) {
    visor.addEventListener(
      'pointermove',
      (e) => {
        const rect = visor.getBoundingClientRect();
        cursorEl.style.left = `${e.clientX - rect.left}px`;
        cursorEl.style.top = `${e.clientY - rect.top}px`;
        cursorEl.style.opacity = '1';
      },
      { passive: true }
    );
    visor.addEventListener(
      'pointerleave',
      () => {
        cursorEl.style.opacity = '0';
      },
      { passive: true }
    );
  }

  let activeFilter = 'all';

  const openTargetModal = (project) => {
    if (!modal) return;
    document.getElementById('pm-code').textContent = `${project.code} // TARGET ANALYSIS`;
    document.getElementById('pm-title').textContent = project.title;
    document.getElementById('pm-metric').textContent = project.metric;
    document.getElementById('pm-problem').textContent = project.problem;
    document.getElementById('pm-role').textContent = project.role;
    document.getElementById('pm-solution').textContent = project.solution;
    document.getElementById('pm-result').textContent = project.result;
    document.getElementById('pm-arch').textContent = project.architecture;

    const stackWrap = document.getElementById('pm-stack');
    stackWrap.innerHTML = '';
    project.stack.forEach((tech) => {
      stackWrap.appendChild(createEl('span', 'tech-tag', tech));
    });

    const repoLink = document.getElementById('pm-repo-link');
    repoLink.href = project.repoUrl;
    repoLink.textContent = `${project.repoLabel} ↗`;

    openDialog(modal, { initialFocusEl: closeBtn });
  };

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => closeDialog(modal));
  }

  const renderCards = () => {
    grid.innerHTML = '';
    const filtered =
      activeFilter === 'all'
        ? SITE_DATA.projects
        : SITE_DATA.projects.filter((p) => p.categories.includes(activeFilter));

    filtered.forEach((project) => {
      const card = createEl('article', 'target-card');
      card.tabIndex = 0;

      const stackPreview = project.stack
        .slice(0, 6)
        .map((t) => `<span class="tech-tag">${t}</span>`)
        .join('');

      const pipelineHtml = (project.pipeline || [])
        .map((step, i, arr) =>
          i < arr.length - 1
            ? `<span>${step}</span><span class="pipeline-arrow" aria-hidden="true">→</span>`
            : `<span>${step}</span>`
        )
        .join('');

      card.innerHTML = `
        <span class="reticle reticle-tl" aria-hidden="true"></span>
        <span class="reticle reticle-tr" aria-hidden="true"></span>
        <span class="reticle reticle-bl" aria-hidden="true"></span>
        <span class="reticle reticle-br" aria-hidden="true"></span>
        <div class="target-top">
          <span class="target-code">${project.code}</span>
          <span class="target-lock-label" aria-hidden="true">[ TARGET LOCKED ]</span>
        </div>
        <h3 class="target-title">${project.title}</h3>
        <div class="target-metric">${project.metric}</div>
        ${pipelineHtml ? `<div class="target-pipeline" aria-label="Architecture pipeline">${pipelineHtml}</div>` : ''}
        <p class="target-summary">${project.summary}</p>
        <dl class="target-brief">
          <div><dt>Problem</dt><dd>${project.problem}</dd></div>
          <div><dt>Result</dt><dd>${project.result}</dd></div>
        </dl>
        <div class="tech-tag-row">${stackPreview}</div>
        <div class="target-actions">
          <button type="button" class="btn-hud-primary target-analyze-btn">Target Analysis</button>
          <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-hud-ghost">${project.repoLabel} ↗</a>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        grid.querySelectorAll('.target-card.is-locked').forEach((c) => {
          if (c !== card) c.classList.remove('is-locked');
        });
        card.classList.toggle('is-locked');
      });

      card.querySelector('.target-analyze-btn').addEventListener('click', () => {
        openTargetModal(project);
      });

      grid.appendChild(card);
    });
  };

  if (filterWrap) {
    filterWrap.innerHTML = '';
    SITE_DATA.projectFilters.forEach((f) => {
      const count =
        f.id === 'all'
          ? SITE_DATA.projects.length
          : SITE_DATA.projects.filter((p) => p.categories.includes(f.id)).length;
      const btn = createEl('button', `filter-chip${f.id === activeFilter ? ' is-active' : ''}`);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(f.id === activeFilter));
      btn.textContent = `${f.label} (${count})`;
      btn.addEventListener('click', () => {
        activeFilter = f.id;
        filterWrap.querySelectorAll('.filter-chip').forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        renderCards();
      });
      filterWrap.appendChild(btn);
    });
  }

  renderCards();
}

/* ==========================================================================
   4. ULTRON // INTERACTIVE SVG NEURAL CONSTELLATION & SKILL MODULES
   ========================================================================== */
export function initSkillsSection() {
  const grid = document.getElementById('ultron-skills-grid');
  const nav = document.getElementById('ultron-node-nav');
  const svgWrap = document.getElementById('ultron-svg-wrap');
  if (!grid) return;

  let focusedModule = 'all';

  // Coordinates for 6 satellite nodes orbiting central ULTRON CORE (viewBox 960 x 210)
  const nodePositions = [
    { id: 'languages', x: 120, y: 54 },
    { id: 'cloud', x: 295, y: 156 },
    { id: 'frameworks', x: 350, y: 46 },
    { id: 'databases', x: 610, y: 46 },
    { id: 'aiml', x: 665, y: 156 },
    { id: 'concepts', x: 840, y: 54 }
  ];

  const renderConstellation = () => {
    if (!svgWrap) return;
    const cx = 480;
    const cy = 108;

    const edgesMarkup = nodePositions
      .map((pos) => {
        const active = focusedModule === 'all' || focusedModule === pos.id;
        return `<line class="constellation-edge${active ? ' is-active' : ''}" x1="${cx}" y1="${cy}" x2="${pos.x}" y2="${pos.y}" />`;
      })
      .join('');

    const crossLinks = `
      <line class="constellation-edge" x1="120" y1="54" x2="350" y2="46" stroke-dasharray="4 6" />
      <line class="constellation-edge" x1="295" y1="156" x2="665" y2="156" stroke-dasharray="4 6" />
      <line class="constellation-edge" x1="610" y1="46" x2="840" y2="54" stroke-dasharray="4 6" />
    `;

    const nodesMarkup = nodePositions
      .map((pos) => {
        const group = SITE_DATA.skills.find((s) => s.id === pos.id);
        const active = focusedModule === pos.id;
        const fill = active ? '#35101c' : '#120a10';
        const stroke = active ? '#f43f5e' : 'rgba(212,220,232,0.48)';
        return `
          <g class="constellation-node" data-node-id="${pos.id}" style="cursor:pointer;">
            <polygon points="${pos.x},${pos.y - 24} ${pos.x + 28},${pos.y - 10} ${pos.x + 28},${pos.y + 10} ${pos.x},${pos.y + 24} ${pos.x - 28},${pos.y + 10} ${pos.x - 28},${pos.y - 10}" fill="${fill}" stroke="${stroke}" stroke-width="${active ? 2.2 : 1.4}" />
            <text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" fill="#f1f6ff" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">${group ? group.nodeLabel : pos.id}</text>
          </g>
        `;
      })
      .join('');

    svgWrap.innerHTML = `
      <svg class="ultron-constellation" viewBox="0 0 960 210" aria-hidden="true">
        ${crossLinks}
        ${edgesMarkup}
        <g>
          <polygon points="${cx},${cy - 36} ${cx + 42},${cy - 17} ${cx + 42},${cy + 17} ${cx},${cy + 36} ${cx - 42},${cy + 17} ${cx - 42},${cy - 17}" fill="#1a090f" stroke="#f43f5e" stroke-width="2.2" />
          <polygon points="${cx},${cy - 30} ${cx + 35},${cy - 14} ${cx + 35},${cy + 14} ${cx},${cy + 30} ${cx - 35},${cy + 14} ${cx - 35},${cy - 14}" fill="rgba(244,63,94,0.18)" stroke="rgba(253,164,175,0.4)" stroke-width="1" />
          <text x="${cx}" y="${cy - 2}" text-anchor="middle" fill="#fda4af" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700">ULTRON</text>
          <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="#f1f6ff" font-family="JetBrains Mono, monospace" font-size="9">CORE</text>
        </g>
        ${nodesMarkup}
      </svg>
    `;

    svgWrap.querySelectorAll('.constellation-node').forEach((g) => {
      g.addEventListener('click', () => {
        const id = g.dataset.nodeId;
        selectModule(focusedModule === id ? 'all' : id);
      });
    });
  };

  const renderModules = () => {
    grid.innerHTML = '';
    SITE_DATA.skills.forEach((group, idx) => {
      const isHighlighted = focusedModule === group.id;
      const isDimmed = focusedModule !== 'all' && !isHighlighted;
      const card = createEl(
        'article',
        `skill-module${isHighlighted ? ' is-highlighted' : ''}${isDimmed ? ' is-dimmed' : ''}`
      );
      card.dataset.moduleId = group.id;

      const itemsHtml = group.items
        .map(
          (item) => `
          <li class="skill-row">
            <span class="skill-name">${item.name}</span>
            <span class="skill-tier tier-${item.level.toLowerCase()}">${item.level}</span>
          </li>`
        )
        .join('');

      card.innerHTML = `
        <header class="skill-module-head">
          <span class="skill-module-code">MOD // 0${idx + 1}</span>
          <h3 class="skill-module-title">${group.title}</h3>
        </header>
        <ul class="skill-list">${itemsHtml}</ul>
      `;
      grid.appendChild(card);
    });
  };

  const selectModule = (moduleId) => {
    focusedModule = moduleId;
    if (nav) {
      nav.querySelectorAll('.node-btn').forEach((b) => {
        const active = b.dataset.moduleTarget === moduleId;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    }
    renderConstellation();
    renderModules();
  };

  if (nav) {
    nav.innerHTML = '';
    const allBtn = createEl('button', 'node-btn is-active', 'ALL NODES');
    allBtn.type = 'button';
    allBtn.dataset.moduleTarget = 'all';
    allBtn.setAttribute('aria-pressed', 'true');
    allBtn.addEventListener('click', () => selectModule('all'));
    nav.appendChild(allBtn);

    SITE_DATA.skills.forEach((group) => {
      const btn = createEl('button', 'node-btn', group.nodeLabel);
      btn.type = 'button';
      btn.dataset.moduleTarget = group.id;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', `${group.nodeLabel} — ${group.title}`);
      btn.addEventListener('click', () => {
        selectModule(group.id);
        const targetCard = grid.querySelector(`[data-module-id="${group.id}"]`);
        if (targetCard && window.innerWidth < 900) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
      nav.appendChild(btn);
    });
  }

  renderConstellation();
  renderModules();
}

/* ==========================================================================
   5. J.A.R.V.I.S. // CONTACT CONSOLE
   ========================================================================== */
export function initContactSection({ onContactTriggered }) {
  const copyBtn = document.getElementById('copy-email-btn');
  const mailLink = document.getElementById('direct-email-link');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = SITE_DATA.profile.email;
      const done = () => {
        showToast(`Email copied: ${email}`);
        if (typeof onContactTriggered === 'function') onContactTriggered();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  if (mailLink) {
    mailLink.addEventListener('click', () => {
      if (typeof onContactTriggered === 'function') {
        setTimeout(() => onContactTriggered(), 350);
      }
    });
  }
}
