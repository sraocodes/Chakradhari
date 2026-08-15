/* =========================================================
   Chakradhari — Domain card visibility gating
   The seven focus-card micro-visualizations (css/components/
   domain-viz.css) are pure CSS keyframe animations; this module
   only toggles .is-visible so they run while on-screen and pause
   otherwise, and stay quiet everywhere else on the page.
   ========================================================= */
import { onVisible } from '../core/motion-controller.js';

export function initDomainCards() {
  document.querySelectorAll('.focus-card').forEach((card) => {
    onVisible(card, {
      enter: () => card.classList.add('is-visible'),
      exit: () => card.classList.remove('is-visible'),
      threshold: 0.35,
    });
  });
}
