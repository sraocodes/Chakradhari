/* =========================================================
   Chakradhari — Hero animation
   A model graph resolves at the centre of orbiting data rings,
   observed by a scanning instrument and traced by a signal
   waveform. Communicates: open scientific work, computation and
   observation converge into applied R&D. Domain-neutral — no
   single subject (agriculture, AI, etc.) is implied.
   Built on GSAP. Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = document.getElementById('scene');
  if (!scene || typeof gsap === 'undefined') { staticFallback(); return; }

  const $ = (s, ctx = scene) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const edges = $$('.edge', scene);
  const mainEdge = $('#mainEdge');
  const crossLinks = $('#crossLinks');
  const nodes = $$('.node', scene);
  const core = $('#core');
  const coreGlow = $('#coreGlow');
  const ripples = $('#ripples');
  const instrument = $('#instrument');
  const instrumentBody = $('#instrumentBody');
  const beam = $('#beam');
  const connectors = $('#connectors');
  const waveTrack = $('#waveTrack');
  const chips = $$('.data-chip');
  const rings = $$('.ring', scene);

  // Attach points (svg coords) for node centres so scale resolves correctly.
  const nodeOrigins = ['264 186', '364 238', '347 347', '213 347', '193 239'];

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
    const g = document.getElementById('coreGlow'); if (g) g.setAttribute('opacity', '0.6');
    const c = document.getElementById('connectors'); if (c) c.setAttribute('opacity', '1');
    const i = document.getElementById('instrument'); if (i) i.setAttribute('opacity', '1');
    const x = document.getElementById('crossLinks'); if (x) x.setAttribute('opacity', '0.6');
    const r = document.getElementById('ripples'); if (r) r.setAttribute('opacity', '0.7');
    particles(true);
  }

  if (reduce) { staticFallback(); return; }

  // Initial hidden state
  gsap.set([mainEdge, ...edges], { visibility: 'visible' });
  prime(mainEdge);
  edges.forEach(prime);
  gsap.set(nodes, { scale: 0, opacity: 0 });
  nodes.forEach((n, i) => gsap.set(n, { svgOrigin: nodeOrigins[i] || '280 280' }));
  gsap.set(core, { scale: 0.4, opacity: 0, svgOrigin: '280 280' });
  gsap.set(coreGlow, { opacity: 0 });
  gsap.set(ripples, { opacity: 0 });
  gsap.set(instrument, { opacity: 0 });
  gsap.set(connectors, { opacity: 0 });
  gsap.set(crossLinks, { opacity: 0 });
  gsap.set(chips, { opacity: 0, y: 8, scale: 0.96 });
  gsap.set(waveTrack, { x: 0 });

  // Continuous ambient: rings breathe & slowly rotate around the graph
  gsap.to(rings[0], { rotation: 360, duration: 60, repeat: -1, ease: 'none', svgOrigin: '280 250' });
  gsap.to(rings[1], { rotation: -360, duration: 44, repeat: -1, ease: 'none', svgOrigin: '280 250' });

  const tl = gsap.timeline({ delay: 0.5, defaults: { ease: 'power2.out' } });

  tl
    // 1. model core appears and settles
    .to(core, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
    .to(core, { y: 4, duration: 0.3 }, '-=0.1')

    // 2. graph edges resolve
    .to(edges, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: 'power1.inOut' }, '-=0.1')

    // 3. primary edge draws, core dims into the graph
    .to(mainEdge, { strokeDashoffset: 0, duration: 1.0, ease: 'power1.inOut' }, '-=0.9')
    .to(core, { opacity: 0.15, duration: 0.5 }, '-=0.4')

    // 4. soft glow of activity
    .to(coreGlow, { opacity: 0.55, duration: 0.8 }, '-=0.6')

    // 5. model nodes resolve
    .to(nodes, { scale: 1, opacity: 1, duration: 0.55, stagger: 0.14, ease: 'back.out(1.7)' }, '-=0.5')

    // 6. graph texture: secondary cross-links fade in
    .to(crossLinks, { opacity: 0.6, duration: 0.6 }, '-=0.2')

    // 7. instrument arrives, signal field radiates outward
    .to(instrument, { opacity: 1, duration: 0.5 }, '-=0.3')
    .fromTo(instrumentBody, { x: -40 }, { x: 0, duration: 1.4, ease: 'sine.inOut' }, '<')
    .to(ripples, { opacity: 1, duration: 0.6 }, '-=0.9')

    // 8. connectors + data chips resolve around the graph
    .to(connectors, { opacity: 1, duration: 0.6 }, '-=0.4')
    .to(chips, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.6)' }, '-=0.3')

    // 9. settle into a gentle idle loop
    .add(idle);

  function idle() {
    // beam sweep
    gsap.to(beam, { opacity: 0.2, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // instrument drift
    gsap.to(instrumentBody, { x: 12, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // signal field breathing
    gsap.to(ripples, { opacity: 0.55, scale: 1.04, transformOrigin: '280px 280px',
      duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    // node drift
    gsap.to(nodes, { rotation: 2.5, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut',
      svgOrigin: '280 280', stagger: { each: 0.2, yoyo: true } });
    // chips float
    chips.forEach((c, i) => {
      gsap.to(c, { y: (i % 2 ? -6 : 6), duration: 2.4 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
    // signal trace scrolls continuously (seamless loop: track is two copies, width 480)
    if (waveTrack) {
      gsap.to(waveTrack, { x: -480, duration: 9, ease: 'none', repeat: -1 });
    }
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
