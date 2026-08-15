/* =========================================================
   Chakradhari — Theme toggle
   The actual dark/light DECISION for first paint already happened
   synchronously in the inline <head> script (before any CSS
   loads), to avoid a flash. This module only wires up the toggle
   button: persistence, the little scan-sweep animation, updating
   <meta name="theme-color">, and broadcasting a change event for
   any module that reads colors from CSS custom properties.
   ========================================================= */
import { THEME_CHANGE_EVENT } from './motion-controller.js';

const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const metaTheme = document.querySelector('meta[name="theme-color"]');

const THEME_COLOR = { dark: '#080B11', light: '#F7F6F2' };

// Enable the cross-fade transition only after first paint, so the
// initial theme never visibly animates in.
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('theme-ready')));

function currentTheme() {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyMeta(theme) {
  if (metaTheme) metaTheme.setAttribute('content', THEME_COLOR[theme]);
}
applyMeta(currentTheme());

function setTheme(theme, { persist = true } = {}) {
  root.setAttribute('data-theme', theme);
  applyMeta(theme);
  if (persist) {
    try { localStorage.setItem('cctech-theme', theme); } catch (_) {}
  }
  if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'light'));
  root.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
}

if (toggle) {
  toggle.setAttribute('aria-label', currentTheme() === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  toggle.setAttribute('aria-pressed', String(currentTheme() === 'light'));
  toggle.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    setTheme(next);
    toggle.setAttribute('aria-label', next === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.classList.remove('is-switching');
    // restart the sweep animation
    void toggle.offsetWidth;
    toggle.classList.add('is-switching');
  });
}

// Deliberately no prefers-color-scheme auto-switching: dark is the fixed
// default until the visitor explicitly clicks the toggle. The hero stays
// dark-locked regardless of theme, and silently flipping the rest of the
// page to light off an OS signal produced a jarring half-dark/half-light
// first impression — exactly what "preserve the opening experience" rules
// out. Light mode is opt-in only.
