// Case studies: project cards, the Projects page and one page per project.
// Content lives in content/case-studies.json; this file only turns it into HTML.
import { readFileSync } from 'node:fs';
import { icon } from './lib.mjs';

const esc = (s = '') => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const has = (v) => Array.isArray(v) ? v.some((x) => (typeof x === 'string' ? x.trim() : x && Object.values(x).some((y) => String(y).trim()))) : !!(v && String(v).trim());

export function loadCases(path) {
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const all = data.projects || [];
  const ids = new Set();
  for (const c of all) {
    if (!/^[a-z0-9-]+$/.test(c.id || '')) throw new Error(`case-studies.json: bad id "${c.id}" (use lowercase letters, numbers and dashes)`);
    if (ids.has(c.id)) throw new Error(`case-studies.json: id "${c.id}" is used twice`);
    ids.add(c.id);
  }
  const published = all.filter((c) => !c.draft);
  for (const c of published) {
    const missing = [['summary', c.summary], ['challenge', c.challenge], ['whatWeDid', c.whatWeDid], ['result', c.result], ['figures', c.figures]]
      .filter(([, v]) => !has(v)).map(([k]) => k);
    if (missing.length) console.warn(`warning: published project "${c.id}" has no ${missing.join(', ')}`);
  }
  return { all, published };
}

const webp = (src) => src.replace(/\.jpg$/, '.webp');
const pic = (src, alt = '') => `<picture><source srcset="${webp(src)}" type="image/webp"><img class="cover" src="${src}" alt="${esc(alt)}" loading="lazy" onerror="this.parentNode.remove()"></picture>`;
// slider images are read by the stylesheet (assets/css/), so paths are written relative to it
const fromCss = (src) => src.replace(/^assets\//, '../');
const bg = (src) => `image-set(url('${fromCss(webp(src))}') type('image/webp'), url('${fromCss(src)}') type('image/jpeg'))`;

// ---------- card used on the home page and the Projects page
export function caseCard(c, sectorName) {
  const fig = (c.figures || []).find((f) => has(f.value));
  return `<a class="case" href="case-${c.id}.html" data-sector="${c.sector}">
        <span class="case__media">${c.images?.card ? pic(c.images.card) : ''}</span>
        <span class="case__body">
          <span class="case__meta"><span>${esc(c.client)}</span>${sectorName ? `<span>${sectorName}</span>` : ''}</span>
          <span class="case__title">${esc(c.title)}</span>
          ${fig ? `<span class="case__figure"><strong>${esc(fig.value)}</strong> ${esc(fig.label)}</span>` : ''}
          <span class="svc__more">Read the project ${icon('arrow')}</span>
        </span>
      </a>`;
}

// ---------- one project page
export function casePage(c, { sectors, services, others, pageHero, ctaBand }) {
  const draft = !!c.draft;
  const prompt = (text) => (draft ? `<p class="prompt">${text}</p>` : '');
  const sector = sectors.find((s) => s.id === c.sector);
  const svcLinks = (c.services || []).map((id) => services.find((s) => s.id === id)).filter(Boolean)
    .map((s) => `<a href="services.html#${s.id}">${s.name}</a>`).join(', ');

  const facts = [
    ['Client', esc(c.client)], ['Sector', sector ? `<a href="sectors.html#${sector.id}">${sector.name}</a>` : ''],
    ['Location', esc(c.location)], ['Year', esc(c.year)], ['Services', svcLinks],
  ].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n      ');

  const im = c.images || {};
  const visual = im.before && im.after
    ? `<div class="compare compare--case" data-reveal style="--before: ${bg(im.before)}; --after: ${bg(im.after)};">
      <div class="compare__layer compare__after"></div>
      <div class="compare__layer compare__before"></div>
      <span class="compare__tag compare__tag--l">Before</span>
      <span class="compare__tag compare__tag--r">After</span>
      <div class="compare__bar"></div>
      <div class="compare__handle">${icon('swap')}</div>
      <input type="range" min="0" max="100" value="50" aria-label="Compare the site before and after">
    </div>`
    : im.card ? `<div class="media media--wide">${pic(im.card, c.title)}</div>` : '';

  const figures = (c.figures || []).filter((f) => has(f.value));
  const figuresHtml = figures.length
    ? `<ul class="figures">${figures.map((f) => `<li><strong>${esc(f.value)}</strong><span>${esc(f.label)}</span></li>`).join('')}</ul>`
    : prompt('Add 2 to 4 headline figures the client is happy to publish: cost or capex, payback period, energy or running-cost saving, downtime avoided, grant secured, programme met.');

  const did = (c.whatWeDid || []).filter(has);
  const q = c.quote || {};
  const gallery = (im.gallery || []).filter(Boolean);

  const blocks = [
    ['The challenge', has(c.challenge) ? `<p>${esc(c.challenge)}</p>` : prompt('What problem did the client have, and why did it matter to them (cost, capacity, compliance, downtime, energy)?')],
    ['What we did', did.length ? `<ul class="dashes">${did.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : prompt('List 3 to 5 things Hanntec did: the study or report, the design, what was built or installed, how it was commissioned.')],
    ['The result', has(c.result) ? `<p>${esc(c.result)}</p>` : prompt('What changed for the client? Use the figures above where you can.')],
  ].filter(([, html]) => html);
  const story = blocks.length ? `<section class="section section--sheet">
  <div class="wrap case-story">
    ${blocks.map(([h, html]) => `<div>
      <h2 class="h-display h-display--sm">${h}</h2>
      ${html}
    </div>`).join('\n    ')}
  </div>
</section>` : '';

  const body = `${pageHero(esc(c.title), has(c.summary) ? esc(c.summary) : (draft ? 'Add a one-sentence summary: what was built or improved, and the result.' : ''))}
${draft ? `<div class="preview-bar" role="note"><div class="wrap">Draft preview. This page is not linked from the site and is hidden from search engines. Fill in content/case-studies.json, set "draft" to false and rebuild to publish it.</div></div>` : ''}
<section class="section section--tight">
  <div class="wrap">
    ${facts ? `<dl class="facts">
      ${facts}
    </dl>` : ''}
    ${prompt('Add the location, the year, and which Hanntec services were used (roi, advisory, design, construction, electrical, mechanical, commissioning).')}
    ${visual}
    ${figuresHtml}
  </div>
</section>

${story}

${has(q.text) ? `<section class="section">
  <div class="wrap">
    <figure class="quote">
      <blockquote><p>${esc(q.text)}</p></blockquote>
      <figcaption>${esc(q.name)}${has(q.role) ? `, ${esc(q.role)}` : ''}</figcaption>
    </figure>
  </div>
</section>` : (draft ? `<section class="section"><div class="wrap">${prompt('Optional: a short quote from the client, with their name and role, if they are happy to be quoted.')}</div></section>` : '')}

${gallery.length ? `<section class="section section--tight">
  <div class="wrap gallery">
    ${gallery.map((g) => `<div class="media">${pic(g, c.title)}</div>`).join('\n    ')}
  </div>
</section>` : ''}

${others.length ? `<section class="section section--sheet">
  <div class="wrap">
    <h2 class="h-display h-display--sm">More projects</h2>
    <div class="cases">
      ${others.map((o) => caseCard(o, sectors.find((s) => s.id === o.sector)?.name)).join('\n      ')}
    </div>
  </div>
</section>` : ''}

${ctaBand('Planning something similar?', 'Tell us what you need and we’ll put the right engineers on it.')}`;
  return body;
}

// ---------- the Projects page
export function projectsPage(published, { sectors, pageHero, ctaBand }) {
  const used = sectors.filter((s) => published.some((c) => c.sector === s.id));
  const filter = published.length >= 4 && used.length > 1
    ? `<div class="filter" role="group" aria-label="Filter projects by sector">
      <button type="button" class="filter__btn" aria-pressed="true" data-filter="all">All</button>
      ${used.map((s) => `<button type="button" class="filter__btn" aria-pressed="false" data-filter="${s.id}">${s.name}</button>`).join('\n      ')}
    </div>` : '';
  return `${pageHero('Projects', 'Work we have delivered for clients across Ireland, from the business case to handover.')}

<section class="section">
  <div class="wrap">
    ${filter}
    <div class="cases" data-cases>
      ${published.map((c) => caseCard(c, sectors.find((s) => s.id === c.sector)?.name)).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand()}`;
}
