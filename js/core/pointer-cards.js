/* =========================================================
   Chakradhari — Pointer-reactive cards
   Two effects, both skipped on touch/coarse pointers and under
   prefers-reduced-motion since neither carries meaning without a
   hovering cursor:
   1. A gentle magnetic tilt on [data-tilt] cards, proportional to
      cursor position within the card.
   2. A cursor-tracked mesh reveal on .cap cards (Open Lab), driven
      by the --mx/--my custom properties css/components/cards.css
      already masks .cap-mesh with.
   ========================================================= */
import { prefersReducedMotion, isCoarsePointer } from './motion-controller.js';

const MAX_TILT = 6; // degrees

export function initPointerCards() {
  if (prefersReducedMotion || isCoarsePointer) return;

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    let frame = null;
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.classList.add('is-tilting');
        card.style.transform =
          `perspective(800px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg) translateZ(0)`;
      });
    });
    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.cap').forEach((cap) => {
    cap.addEventListener('pointermove', (e) => {
      const rect = cap.getBoundingClientRect();
      cap.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      cap.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}
