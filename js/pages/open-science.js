/* =========================================================
   Chakradhari — Open Science page
   Renders Watch (channels + videos) and Use (repositories +
   toolboxes) from js/data/open-science-data.js. Read and Reproduce
   aren't built yet — there's nothing real to put in them; add a
   render function here, following this file's pattern, when that
   changes. Use always renders: real cards, or a restrained
   "coming soon" line — never a fake placeholder card. Watch stays
   out of the DOM entirely if both channels and videos are empty.
   ========================================================= */
import './shared.js';
import { channels, videos, repositories, toolboxes } from '../data/open-science-data.js';

const ICON_REPO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.9-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>';

function renderWatch() {
  const section = document.querySelector('#os-watch');
  const grid = document.querySelector('#os-watch-grid');
  if (!section || !grid) return;

  const items = [
    ...videos,
    ...channels.map((c) => ({ title: c.name, domain: c.domain, description: c.description, href: c.href })),
  ];
  if (!items.length) { section.classList.add('empty-hidden'); return; }

  grid.innerHTML = items.map((v) => `
    <article class="channel-media-card" data-tilt>
      <span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      <span class="content-badge">${v.domain}</span>
      <h3>${v.title}</h3>
      <p>${v.description}</p>
      <div class="meta-links"><a href="${v.href}" target="_blank" rel="noopener">Watch →</a></div>
    </article>
  `).join('');
}

function renderUse() {
  const grid = document.querySelector('#os-use-grid');
  const empty = document.querySelector('#os-use-empty');
  if (!grid) return;
  const items = [...repositories, ...toolboxes];

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = items.map((r) => {
    const meta = [r.language, r.version, r.license].filter(Boolean);
    return `
    <article class="tool-card" data-tilt>
      <div class="tool-top">
        <span class="content-badge">${r.domain}</span>
      </div>
      <h3>${r.name}</h3>
      <p>${r.summary}</p>
      ${meta.length ? `<div class="resource-links">${meta.map((m) => `<span>${m}</span>`).join('')}</div>` : ''}
      <div class="meta-links">
        <a href="${r.href}" target="_blank" rel="noopener">${ICON_REPO}Repository</a>
        ${r.docsHref ? `<a href="${r.docsHref}" target="_blank" rel="noopener">Docs</a>` : ''}
      </div>
    </article>`;
  }).join('');
}

renderWatch();
renderUse();
