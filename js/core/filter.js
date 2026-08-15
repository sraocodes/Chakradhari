/* =========================================================
   Chakradhari — Filter toolbar
   Ported from the original app.js. Progressive enhancement: cards
   start visible, JS narrows by data-filter-target's dataset match.
   ========================================================= */

export function initFilters() {
  document.querySelectorAll('.filter-toolbar[data-filter-target]').forEach((toolbar) => {
    const cards = Array.from(document.querySelectorAll(toolbar.dataset.filterTarget));
    const buttons = Array.from(toolbar.querySelectorAll('.filter-pill'));
    if (!cards.length || !buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        cards.forEach((card) => {
          const match = filter === 'all' || card.dataset.domain === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  });
}
