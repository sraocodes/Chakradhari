/* =========================================================
   Chakradhari — Navigation
   Sticky header scroll state, mobile menu, active-section spy.
   Ported from the original app.js with unchanged behaviour, plus
   the active-link highlight now also applies to .active (styled
   in css/components/nav.css) rather than being spy-only decoration.
   ========================================================= */

export function initNav() {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 24) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('#nav a').forEach((a) => a.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  const sections = ['capabilities', 'work-with-us', 'about']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = new Map(
    Array.from(document.querySelectorAll('.nav a.nav-link'))
      .map((a) => [a.getAttribute('href').slice(1), a])
  );
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          const link = navLinks.get(e.target.id);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => spy.observe(s));
  }
}
