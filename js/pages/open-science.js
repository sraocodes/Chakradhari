/* =========================================================
   Chakradhari — Open Science page
   Renders tool cards and channel cards from js/data/open-science-data.js.
   Both grids stay out of the DOM entirely (not just visually
   hidden) when their array is empty, so there's never a visible
   "coming soon" placeholder — see css/pages/pages.css .empty-hidden.
   ========================================================= */
import './shared.js';
import { tools, channels } from '../data/open-science-data.js';

const ICON_REPO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.9-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>';

function renderTools() {
  const section = document.querySelector('#os-tools');
  const grid = document.querySelector('#os-tools-grid');
  if (!section || !grid) return;
  if (!tools.length) { section.classList.add('empty-hidden'); return; }

  grid.innerHTML = tools.map((t) => `
    <article class="tool-card" data-tilt>
      <div class="tool-top">
        <span class="content-badge">${t.domain}</span>
      </div>
      <h3>${t.title}</h3>
      <p>${t.summary}</p>
      ${t.links && t.links.length ? `<div class="meta-links">${t.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${ICON_REPO}${l.label}</a>`).join('')}</div>` : ''}
    </article>
  `).join('');
}

function renderChannels() {
  const section = document.querySelector('#os-channels');
  const grid = document.querySelector('#os-channels-grid');
  if (!section || !grid) return;
  if (!channels.length) { section.classList.add('empty-hidden'); return; }

  grid.innerHTML = channels.map((c) => `
    <article class="channel-media-card" data-tilt>
      <span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      <span class="content-badge">${c.domain}</span>
      <h3>${c.name}</h3>
      <p>${c.description}</p>
      <div class="meta-links"><a href="${c.href}" target="_blank" rel="noopener">Watch →</a></div>
    </article>
  `).join('');
}

renderTools();
renderChannels();
