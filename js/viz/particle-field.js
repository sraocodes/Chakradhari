/* =========================================================
   Chakradhari — Ambient particle field
   A generic, sparse Canvas 2D particle drift for content bands
   (currently: the Statement band only — used once, deliberately,
   not as sitewide texture). Distinct from hero.js's own particle
   loop, which stays untouched. Driven by the shared motion-
   controller ticker so it doesn't run its own rAF loop, and paused
   via IntersectionObserver when off-screen.
   ========================================================= */
import { registerTicker, onVisible, isLowPowerDevice, prefersReducedMotion } from '../core/motion-controller.js';

export function createParticleField(canvas, { density = 14000, colorRGB = '46,155,255', maxParticles = 34 } = {}) {
  if (!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, pts = [];
  let running = false;
  let unregisterTicker = null;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();

  function seed() {
    const n = Math.min(maxParticles, isLowPowerDevice ? 14 : Math.round((w * h) / density));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.4,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      a: Math.random() * 0.35 + 0.12,
    }));
  }
  seed();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRGB},${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
      if (p.y < -4) p.y = h + 4; if (p.y > h + 4) p.y = -4;
    }
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); seed(); }, 200); });

  onVisible(canvas, {
    threshold: 0,
    enter: () => { if (!running) { running = true; unregisterTicker = registerTicker(draw); } },
    exit: () => { running = false; if (unregisterTicker) { unregisterTicker(); unregisterTicker = null; } },
  });
}
