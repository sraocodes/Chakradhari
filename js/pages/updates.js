/* =========================================================
   Chakradhari — Updates page
   Renders event/gallery cards from js/data/updates-data.js and
   wires the lightbox for the first image of each. Not linked from
   navigation yet — see open-science.js for the sibling pattern.
   ========================================================= */
import './shared.js';
import { initLightbox } from '../core/lightbox.js';
import { updates } from '../data/updates-data.js';

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function renderUpdates() {
  const section = document.querySelector('#updates-list');
  const grid = document.querySelector('#updates-grid');
  if (!section || !grid) return;
  if (!updates.length) { section.classList.add('empty-hidden'); return; }

  grid.innerHTML = updates.map((u) => {
    const img = u.images && u.images[0];
    return `
    <article class="update-card">
      ${img ? `
      <button class="thumb" type="button" data-lightbox="${img.src}" data-lightbox-alt="${img.alt || ''}" data-lightbox-caption="${u.title}">
        <img src="${img.src}" alt="${img.alt || ''}" loading="lazy" />
      </button>` : ''}
      <div class="meta">
        <span class="date">${dateFmt.format(new Date(u.date))} — ${u.location}</span>
        <h3>${u.title}</h3>
        <p>${u.description}</p>
      </div>
    </article>`;
  }).join('');

  initLightbox();
}

renderUpdates();
