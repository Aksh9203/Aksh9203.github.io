/**
 * VisionQuest Portfolio Entry Point (ES Module)
 */

import {
  initTheme,
  initBootSequence,
  initHeroGreeting,
  initClock,
  initAiStatusObserver,
  initMobileNav
} from './hud.js';
import { initNeuralCore } from './neural-core.js';
import { initEasterEggs } from './eggs.js';
import { initCommandPalette } from './palette.js';
import {
  initAboutSection,
  initExperienceSection,
  initProjectsSection,
  initSkillsSection,
  initContactSection
} from './sections.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initBootSequence();
  initHeroGreeting();
  initClock();
  initMobileNav();

  // Hydrate content from centralized js/data.js
  initAboutSection();
  initExperienceSection();
  initProjectsSection();
  initSkillsSection();

  // Mount interactive 3D holographic neural sphere
  initNeuralCore();

  // Initialize modular easter eggs & J.A.R.V.I.S. command palette
  const eggApi = initEasterEggs();
  initCommandPalette({ eggApi });
  initContactSection({ onContactTriggered: () => eggApi.openShawarma() });

  // Observe active AI host sections & right-edge mind rail
  initAiStatusObserver();
});
