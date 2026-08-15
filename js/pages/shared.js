/* =========================================================
   Chakradhari — Subpage shared init
   The common core every /open-science/, /updates/, /partnerships/
   page needs: theme toggle, nav, reveals, pointer-reactive cards.
   No hero, no domain-viz, no particle field — those stay
   homepage-only. Each page's own script imports this first, then
   adds its page-specific rendering.
   ========================================================= */
import '../core/theme.js';
import { initReveal, initAssemble } from '../core/reveal.js';
import { initNav } from '../core/nav.js';
import { initPointerCards } from '../core/pointer-cards.js';

initReveal();
initAssemble();
initNav();
initPointerCards();
