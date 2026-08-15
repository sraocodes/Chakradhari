/* =========================================================
   Chakradhari — Homepage entry point
   Loads after gsap (classic global) and hero.js (untouched,
   protected). Everything here is additive: the opening hero
   sequence works identically with this script absent.
   ========================================================= */
import './core/theme.js';
import { initReveal, initAssemble } from './core/reveal.js';
import { initNav } from './core/nav.js';
import { initFilters } from './core/filter.js';
import { initPointerCards } from './core/pointer-cards.js';
import { initDomainCards } from './viz/domain-cards.js';
import { initCycleDiagram } from './viz/cycle-diagram.js';
import { createParticleField } from './viz/particle-field.js';
import { initDividerMotion } from './viz/dividers.js';
import { initSequentialHighlight } from './viz/sequential-highlight.js';

initReveal();
initAssemble();
initNav();
initFilters();
initPointerCards();
initDomainCards();
initCycleDiagram();
initDividerMotion();
initSequentialHighlight('.work-principles', 'span', 850);
initSequentialHighlight('.pillar-strip', 'article', 1400);
initSequentialHighlight('.carry-list', 'li', 700);

document.querySelectorAll('.field-canvas').forEach((canvas) => {
  createParticleField(canvas, { colorRGB: canvas.dataset.color || '46,155,255', maxParticles: 26 });
});
