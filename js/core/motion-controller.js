/* =========================================================
   Chakradhari — Motion controller
   One shared requestAnimationFrame driver (so N animated
   components cost one rAF loop, not N), a small IntersectionObserver
   helper for enter/exit gating, and the reduced-motion / device-tier
   flags every visual module should check before doing real work.
   hero.js keeps its own independent particle loop — it predates
   this module and is intentionally left untouched.
   ========================================================= */

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

export const isLowPowerDevice =
  isCoarsePointer ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  window.innerWidth < 720;

/* ---------- Shared rAF ticker ---------- */
const tickers = new Set();
let rafHandle = null;

function loop(t) {
  for (const fn of tickers) fn(t);
  rafHandle = tickers.size ? requestAnimationFrame(loop) : null;
}

export function registerTicker(fn) {
  tickers.add(fn);
  if (!rafHandle) rafHandle = requestAnimationFrame(loop);
  return () => tickers.delete(fn);
}

/* ---------- Visibility gating ---------- */
export function onVisible(el, { enter, exit, threshold = 0, rootMargin = '0px' } = {}) {
  if (!el || !('IntersectionObserver' in window)) {
    enter && enter();
    return () => {};
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) enter && enter(entry);
      else exit && exit(entry);
    });
  }, { threshold, rootMargin });
  io.observe(el);
  return () => io.disconnect();
}

/* ---------- Theme change broadcast ----------
   theme.js dispatches this on <html> whenever the active theme
   changes, so any module reading CSS custom properties for colors
   (rather than hardcoded hex) can re-read them without polling. */
export const THEME_CHANGE_EVENT = 'cctech:theme';
