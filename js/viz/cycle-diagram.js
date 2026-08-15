/* =========================================================
   Chakradhari — Approach cycle diagram
   The four-node cycle (Discover / Model / Build / Protect) already
   gets a CSS hover state (css/sections.css). This adds a gentle
   idle sequence — one node highlighted at a time, roughly in step
   with the 7s orbital pulse already animating the ring — so the
   diagram reads as alive even before a visitor's cursor reaches it.
   Pauses off-screen and under reduced motion.
   ========================================================= */
import { prefersReducedMotion, onVisible } from '../core/motion-controller.js';

export function initCycleDiagram() {
  if (prefersReducedMotion) return;
  const diagram = document.querySelector('.cycle-diagram');
  if (!diagram) return;
  const nodes = Array.from(diagram.querySelectorAll('.cycle-node'));
  if (!nodes.length) return;

  let idx = 0;
  let interval = null;
  const STEP = 1750; // 7s ring pulse / 4 nodes

  function tick() {
    nodes.forEach((n) => n.classList.remove('is-active'));
    nodes[idx].classList.add('is-active');
    idx = (idx + 1) % nodes.length;
  }

  onVisible(diagram, {
    enter: () => { if (!interval) { tick(); interval = setInterval(tick, STEP); } },
    exit: () => { clearInterval(interval); interval = null; nodes.forEach((n) => n.classList.remove('is-active')); },
    threshold: 0.4,
  });

  // A visiting cursor takes priority over the idle sequence.
  diagram.addEventListener('pointerenter', () => { clearInterval(interval); interval = null; nodes.forEach((n) => n.classList.remove('is-active')); });
  diagram.addEventListener('pointerleave', () => {
    if (!interval && diagram.getBoundingClientRect().top < window.innerHeight) {
      tick(); interval = setInterval(tick, STEP);
    }
  });
}
