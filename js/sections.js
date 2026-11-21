/**
 * Dynamic Section Renderers & Interactions:
 * - F.R.I.D.A.Y. Experience Mission Logs + scroll-powered timeline
 * - E.D.I.T.H. Filterable Projects + AR targeting reticles + Target Analysis modal
 * - Ultron Skills Upgrade Lab (interactive SVG node topology + grouped proficiency modules)
 * - Vision About narrative & Education
 * - J.A.R.V.I.S. Contact Console (email copy + mailto hook for Shawarma egg)
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
    const looking = createEl('p', 'vision-looking-for', SITE_DATA.about.lookingFor);
    storyContainer.appendChild(looking);
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
   2. F.R.I.D.A.Y. // EXPERIENCE TIMELINE
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

  // Power on timeline nodes as the user scrolls
  const cards = container.querySelectorAll('.mission-card');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('is-powered'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-powered');
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((c) => io.observe(c));
}

/* ==========================================================================
   3. E.D.I.T.H. // PROJECTS & TARGET ANALYSIS MODAL
   ========================================================================== */
export function initProjectsSection() {
  const filterWrap = document.getElementById('edith-filters');
  const grid = document.getElementById('edith-grid');
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');

  if (!grid) return;

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

      card.innerHTML = `
        <span class="reticle reticle-tl" aria-hidden="true"></span>
        <span class="reticle reticle-tr" aria-hidden="true"></span>
        <span class="reticle reticle-bl" aria-hidden="true"></span>
        <span class="reticle reticle-br" aria-hidden="true"></span>
        <div class="target-top">
          <span class="target-code">${project.code}</span>
          <span class="target-lock-label" aria-hidden="true">LOCK ACQUIRED</span>
        </div>
        <h3 class="target-title">${project.title}</h3>
        <div class="target-metric">${project.metric}</div>
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

      // Touch tap locks reticle visibly without blocking button taps
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
   4. ULTRON // SKILLS UPGRADE LAB & NODE TOPOLOGY
   ========================================================================== */
export function initSkillsSection() {
  const grid = document.getElementById('ultron-skills-grid');
  const nav = document.getElementById('ultron-node-nav');
  if (!grid) return;

  let focusedModule = 'all';

  const renderModules = () => {
    grid.innerHTML = '';
    SITE_DATA.skills.forEach((group, idx) => {
      const card = createEl(
        'article',
        `skill-module${focusedModule === group.id ? ' is-highlighted' : ''}`
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

  if (nav) {
    nav.innerHTML = '';
    const allBtn = createEl('button', 'node-btn is-active', 'ALL NODES');
    allBtn.type = 'button';
    allBtn.setAttribute('aria-pressed', 'true');
    allBtn.addEventListener('click', () => {
      focusedModule = 'all';
      syncNodes(allBtn);
      renderModules();
    });
    nav.appendChild(allBtn);

    SITE_DATA.skills.forEach((group) => {
      const btn = createEl('button', 'node-btn', group.nodeLabel);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', `Highlight ${group.title} module`);
      btn.addEventListener('click', () => {
        focusedModule = group.id;
        syncNodes(btn);
        renderModules();
        const targetCard = grid.querySelector(`[data-module-id="${group.id}"]`);
        if (targetCard && window.innerWidth < 900) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
      nav.appendChild(btn);
    });

    function syncNodes(activeBtn) {
      nav.querySelectorAll('.node-btn').forEach((b) => {
        const isActive = b === activeBtn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
    }
  }

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
