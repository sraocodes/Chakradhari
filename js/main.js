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

initReveal();
initAssemble();
initNav();
initFilters();
initPointerCards();
initDomainCards();
initCycleDiagram();

const statementCanvas = document.querySelector('#statementField');
if (statementCanvas) createParticleField(statementCanvas, { colorRGB: '46,155,255', maxParticles: 26 });
