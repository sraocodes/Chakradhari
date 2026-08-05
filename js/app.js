/* =========================================================
   Chakradhari — Site interactions
   Preloader · sticky header · mobile menu · scroll reveals
   ========================================================= */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Intro ----------
     The reveal and fade-out are CSS-driven (guaranteed, independent of JS).
     JS only removes the overlay from the tree once the fade completes. */
  const intro = document.getElementById('intro');
  if (intro) {
    const kill = () => { intro.style.display = 'none'; };
    intro.addEventListener('animationend', (e) => { if (e.animationName === 'introOut') kill(); });
    setTimeout(kill, 4200); // safety net
  }

  /* ---------- Sticky header state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
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
    document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Scroll reveals ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  if (reduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('in'));
  } else {
    // Stagger children via transition-delay
    document.querySelectorAll('[data-reveal-stagger]').forEach(group => {
      Array.from(group.children).forEach((child, i) => {
        child.style.transitionDelay = (i * 0.07) + 's';
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(el => io.observe(el));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = ['capabilities', 'approach', 'focus', 'team']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = new Map(
    Array.from(document.querySelectorAll('.nav a.nav-link'))
      .map(a => [a.getAttribute('href').slice(1), a])
  );
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const link = navLinks.get(e.target.id);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => spy.observe(s));
  }
})();
