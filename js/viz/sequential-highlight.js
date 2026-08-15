/* =========================================================
   Chakradhari — Sequential highlight
   The same "attention traveling through a small system" idea
   already used by the Approach cycle diagram, generalised into a
   reusable helper: cycle an .is-active class through a list of
   items while its container is on-screen. Used by work-principles,
   pillar-strip and carry-list — three existing lists that only
   needed a small nudge to feel alive, not new content.
   ========================================================= */
import { prefersReducedMotion, onVisible } from '../core/motion-controller.js';

export function initSequentialHighlight(containerSelector, itemSelector, step = 900) {
  if (prefersReducedMotion) return;

  document.querySelectorAll(containerSelector).forEach((container) => {
    const items = Array.from(container.querySelectorAll(itemSelector));
    if (items.length < 2) return;

    let idx = 0;
    let interval = null;

    function tick() {
      items.forEach((it) => it.classList.remove('is-active'));
      items[idx].classList.add('is-active');
      idx = (idx + 1) % items.length;
    }

    onVisible(container, {
      threshold: 0.4,
      enter: () => { if (!interval) { tick(); interval = setInterval(tick, step); } },
      exit: () => {
        clearInterval(interval);
        interval = null;
        items.forEach((it) => it.classList.remove('is-active'));
      },
    });
  });
}
