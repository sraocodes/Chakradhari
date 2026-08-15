/* =========================================================
   Chakradhari — Intro dismissal (PROTECTED, unchanged logic)
   Kept as its own classic deferred script, loaded right after
   hero.js in exactly the same position it always was, because
   its timing is coupled to the #intro CSS animation
   (introOut / animationend) and a 4200ms safety net. Everything
   else that used to live in this file (sticky header, mobile
   menu, reveals, filters, active-nav spy) now lives in the
   modular js/core/* system loaded via js/main.js.
   ========================================================= */
(function () {
  const intro = document.getElementById('intro');
  if (intro) {
    if (document.documentElement.classList.contains('intro-seen')) {
      intro.style.display = 'none';
    } else {
      try {
        sessionStorage.setItem('cctech-intro-seen', '1');
      } catch (_) {}
      const kill = () => { intro.style.display = 'none'; };
      intro.addEventListener('animationend', (e) => { if (e.animationName === 'introOut') kill(); });
      setTimeout(kill, 4200); // safety net
    }
  }
})();
