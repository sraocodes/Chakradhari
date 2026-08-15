/* =========================================================
   Chakradhari — Scroll reveal system
   Ported from the original app.js with unchanged behaviour:
   [data-reveal] / [data-reveal-stagger] fade+rise into view once,
   staggered via transition-delay on stagger children.
   ========================================================= */
import { prefersReducedMotion } from './motion-controller.js';

export function initReveal() {
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (!revealTargets.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('in'));
    return;
  }

  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = i * 0.07 + 's';
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((el) => io.observe(el));
}

/* Same pattern for the newer [data-assemble] / [data-assemble-line]
   set-piece elements (signal dividers, mesh assemblies). Kept as a
   separate pass so it can be re-triggered per-section if needed. */
export function initAssemble() {
  const targets = document.querySelectorAll('[data-assemble], [data-assemble-line]');
  if (!targets.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach((el) => io.observe(el));
}
