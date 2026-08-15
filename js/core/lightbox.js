/* =========================================================
   Chakradhari — Lightbox
   Minimal, reusable full-screen image viewer. Call initLightbox()
   once per page; it wires any element matching the trigger
   selector (default: [data-lightbox]) found now or added later
   via refresh(). Used by the Updates page gallery.
   ========================================================= */

export function initLightbox({ triggerSelector = '[data-lightbox]' } = {}) {
  let overlay = document.querySelector('.lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <figure>
        <img alt="" />
        <figcaption></figcaption>
      </figure>`;
    document.body.appendChild(overlay);
  }
  const img = overlay.querySelector('img');
  const caption = overlay.querySelector('figcaption');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function open(src, alt, cap) {
    img.src = src;
    img.alt = alt || '';
    caption.textContent = cap || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) close(); });

  function wire(el) {
    el.addEventListener('click', () => {
      open(el.dataset.lightbox, el.dataset.lightboxAlt, el.dataset.lightboxCaption);
    });
  }

  function refresh() {
    document.querySelectorAll(triggerSelector).forEach(wire);
  }

  refresh();
  return { open, close, refresh };
}
