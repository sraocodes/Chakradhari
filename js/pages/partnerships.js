/* =========================================================
   Chakradhari — Public collaborations page
   Renders only from js/data/partnerships-data.js — a strictly
   public, announced-only list, separate from the private/stealth
   relationships described on the homepage's Partnerships section.
   Not linked from navigation yet.
   ========================================================= */
import './shared.js';
import { collaborations } from '../data/partnerships-data.js';

const dateFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });

function renderCollaborations() {
  const section = document.querySelector('#collab-list-section');
  const list = document.querySelector('#collab-list');
  if (!section || !list) return;
  if (!collaborations.length) { section.classList.add('empty-hidden'); return; }

  list.innerHTML = collaborations.map((c) => `
    <div class="collab-item">
      <div>
        <div class="who">${c.institution}</div>
        <div class="what">${c.purpose}</div>
      </div>
      <div class="when">${dateFmt.format(new Date(c.date))}${c.href ? ` &middot; <a href="${c.href}" target="_blank" rel="noopener" class="card-link">Announcement →</a>` : ''}</div>
    </div>
  `).join('');
}

renderCollaborations();
