/* =========================================================
   Chakradhari — Open Science data
   Backs four visitor-facing categories on /open-science/: Watch,
   Read, Use, Reproduce. Only categories with real data (or, for
   Use, the "coming soon" state) render — js/pages/open-science.js
   builds no section for a category with nothing to show, rather
   than a "coming soon" placeholder. Populate as real, shippable
   work exists; no fake entries.

   Implemented now:
   channels:     { name, domain, description, href }               — Watch
   videos:       { title, domain, description, href }               — Watch
   repositories: { name, domain, summary, language, href,
                   docsHref?, version?, license? }                  — Use
   toolboxes:    { name, domain, summary, href,
                   docsHref?, version?, license? }                  — Use

   Shapes for categories not yet built (add the export + a render
   function in open-science.js, following the Watch/Use pattern,
   when the first real item exists):
   talks:           { title, event, date: 'YYYY-MM-DD', href? }      — Watch
   publications:    { title, venue, date: 'YYYY-MM-DD', href }       — Read
   technicalNotes:  { title, domain, summary, href }                 — Read
   demonstrations:  { title, domain, summary, href }                 — Reproduce
   datasets:        { title, domain, summary, href, license? }       — Reproduce
   ========================================================= */

export const channels = [
  {
    name: 'Compute Stories',
    domain: 'Science communication',
    description: 'Founder-led computational and scientific storytelling — accessible explanations of hard technical ideas.',
    href: 'https://www.youtube.com/@ComputeStories',
  },
  {
    name: 'Chakradhari ComputeTech',
    domain: 'Technical demonstrations',
    description: 'Technical demonstrations, scientific explainers and research discussions from the company.',
    href: 'https://www.youtube.com/@ChakradhariComputeTech',
  },
];

export const videos = [
  {
    title: 'Introducing Chakradhari',
    domain: 'Company overview',
    description: 'Scientific computing, domain AI and R&D — what Chakradhari builds and who it builds it for.',
    href: 'https://www.youtube.com/watch?v=nxiifKtDw9k',
  },
];

export const repositories = [];
export const toolboxes = [];
