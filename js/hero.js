/* =========================================================
   Chakradhari — Hero animation
   Scientific observations, models and open tools gather around a
   physical system. Communicates: open scientific work can become
   serious applied R&D.
   Built on GSAP. Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = document.getElementById('scene');
  if (!scene || typeof gsap === 'undefined') { staticFallback(); return; }

  const $ = (s, ctx = scene) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const stem = $('#stem');
  const roots = $$('.root', scene);
  const leaves = $$('.leaf', scene);
  const seed = $('#seed');
  const plantGlow = $('#plantGlow');
  const ripples = $('#ripples');
  const satellite = $('#satellite');
  const satBody = $('#satBody');
  const beam = $('#beam');
  const connectors = $('#connectors');
  const chips = $$('.data-chip');
  const rings = $$('.ring', scene);

  // Attach points (svg coords) for model nodes so they resolve from their centers.
  const leafOrigins = ['232 330', '344 318', '280 246'];

  // Prime drawable strokes
  function prime(path) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    return len;
  }

  function staticFallback() {
    // Everything already drawn in the SVG markup; just reveal chips/glow.
    $$('.data-chip').forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; });
    const g = document.getElementById('plantGlow'); if (g) g.setAttribute('opacity', '0.6');
    const c = document.getElementById('connectors'); if (c) c.setAttribute('opacity', '1');
    const s = document.getElementById('satellite'); if (s) s.setAttribute('opacity', '1');
    particles(true);
  }

  if (reduce) { staticFallback(); return; }

  // Initial hidden state
  gsap.set([stem, ...roots], { visibility: 'visible' });
  prime(stem);
  roots.forEach(prime);
  gsap.set(leaves, { scale: 0, opacity: 0 });
  leaves.forEach((lf, i) => gsap.set(lf, { svgOrigin: leafOrigins[i] || '280 320' }));
  gsap.set(seed, { scale: 0.4, opacity: 0, svgOrigin: '280 392' });
  gsap.set(plantGlow, { opacity: 0 });
  gsap.set(ripples, { opacity: 0 });
  gsap.set(satellite, { opacity: 0 });
  gsap.set(connectors, { opacity: 0 });
  gsap.set(chips, { opacity: 0, y: 8, scale: 0.96 });

  // Continuous ambient: rings breathe & slowly rotate around the plant
  gsap.to(rings[0], { rotation: 360, duration: 60, repeat: -1, ease: 'none', svgOrigin: '280 250' });
  gsap.to(rings[1], { rotation: -360, duration: 44, repeat: -1, ease: 'none', svgOrigin: '280 250' });

  const tl = gsap.timeline({ delay: 0.5, defaults: { ease: 'power2.out' } });

  tl
    // 1. model core appears and settles into the computation layer
    .to(seed, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
    .to(seed, { y: 4, duration: 0.3 }, '-=0.1')

    // 2. dependency paths resolve
    .to(roots, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: 'power1.inOut' }, '-=0.1')

    // 3. model spine rises, core dims into the graph
    .to(stem, { strokeDashoffset: 0, duration: 1.0, ease: 'power1.inOut' }, '-=0.9')
    .to(seed, { opacity: 0.15, duration: 0.5 }, '-=0.4')

    // 4. soft glow of activity
    .to(plantGlow, { opacity: 0.55, duration: 0.8 }, '-=0.6')

    // 5. model nodes resolve
    .to(leaves, { scale: 1, opacity: 1, duration: 0.55, stagger: 0.14, ease: 'back.out(1.7)' }, '-=0.5')

    // 6. observations arrive and the physical system answers
    .to(satellite, { opacity: 1, duration: 0.5 }, '-=0.3')
    .fromTo(satBody, { x: -40 }, { x: 0, duration: 1.4, ease: 'sine.inOut' }, '<')
    .to(ripples, { opacity: 1, duration: 0.6 }, '-=0.9')

    // 7. connectors + data chips resolve around the plant
    .to(connectors, { opacity: 1, duration: 0.6 }, '-=0.4')
    .to(chips, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.6)' }, '-=0.3')

    // 8. settle into a gentle idle loop
    .add(idle);

  function idle() {
    // beam sweep
    gsap.to(beam, { opacity: 0.2, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // satellite drift
    gsap.to(satBody, { x: 12, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // ripple breathing
    gsap.to(ripples, { opacity: 0.55, scale: 1.04, transformOrigin: '280px 392px',
      duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // model marker drift
    gsap.to(leaves, { rotation: 2.5, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut',
      svgOrigin: '280 340', stagger: { each: 0.2, yoyo: true } });
    // chips float
    chips.forEach((c, i) => {
      gsap.to(c, { y: (i % 2 ? -6 : 6), duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
  }

  // ---------- Particle field (data signals drifting up) ----------
  particles(false);

  function particles(staticOnly) {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, pts = [];

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    const N = Math.round(Math.min(46, (w * h) / 9000));
    for (let i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.25 + 0.05),
        vx: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.5 + 0.15,
        blue: Math.random() > 0.35
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.blue
          ? `rgba(90,180,255,${p.a})`
          : `rgba(234,240,250,${p.a * 0.7})`;
        ctx.fill();
        if (!staticOnly) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
        }
      }
      if (!staticOnly) raf = requestAnimationFrame(draw);
    }
    let raf = requestAnimationFrame(draw);

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { size(); }, 200);
    });

    // Pause when off-screen to save cycles
    if (!staticOnly && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(canvas);
    }
  }
})();
