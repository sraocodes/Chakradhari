/* =========================================================
   Chakradhari — Divider motion
   The node-pulse and radar-scan divider variants run a continuous
   idle animation (css/motion.css) gated by .is-visible so they're
   inert off-screen. The wave and mesh variants need no JS — they
   use the existing [data-assemble] / [data-assemble-line] reveal.
   ========================================================= */
import { onVisible } from '../core/motion-controller.js';

export function initDividerMotion() {
  document.querySelectorAll('.signal-divider--nodes, .signal-divider--radar').forEach((el) => {
    onVisible(el, {
      threshold: 0.2,
      enter: () => el.classList.add('is-visible'),
      exit: () => el.classList.remove('is-visible'),
    });
  });
}
