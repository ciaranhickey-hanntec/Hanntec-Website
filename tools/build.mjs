// Builds every page of the site. Run from the site folder:  node tools/build.mjs
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { icon, page, SITE, isoScene } from './lib.mjs';
import { loadCases, caseCard, casePage, projectsPage } from './cases.mjs';

const OUT = process.argv[2] || fileURLToPath(new URL('..', import.meta.url));
const cases = loadCases(`${OUT}/content/case-studies.json`);
SITE.showProjects = cases.published.length > 0;
const write = (rel, text) => {
  const full = `${OUT}/${rel}`;
  mkdirSync(full.substring(0, full.lastIndexOf('/')), { recursive: true });
  // Draft notes are not published: drop any element carrying the "draft" class
  if (rel.endsWith('.html')) text = text.replace(/<(p|span)\b[^>]*\bclass="(?:[^"]*\s)?draft(?:\s[^"]*)?"[^>]*>[\s\S]*?<\/\1>\s*/g, '');
  writeFileSync(full, text);
};

// ------------------------------------------------------------------ content

// Services are grouped by project phase, the way a client meets them (pre-project, design, build, commission).
const phases = [
  { id: 'phase-pre-project', name: 'Pre-project', lead: 'Get the decision right before the money is spent.' },
  { id: 'phase-design', name: 'Design', lead: 'Turn the decision into something that can be built.' },
  { id: 'phase-build', name: 'Build', lead: 'Managed, constructed and installed by one accountable team.' },
  { id: 'phase-commission', name: 'Commission', lead: 'Proven to work, documented and handed over.' },
];

// The two lead services come first (lead: true). The rest are the delivery services.
const services = [
  {
    id: 'roi', icon: 'roi', name: 'ROI analysis &amp; reporting', lead: true, phase: 'phase-pre-project',
    short: 'Know the payback before you commit the capital.',
    long: 'Before you commit capital, we put numbers on it. We model the cost, savings and payback of each option, and set it out in a report your board can act on.',
    points: ['Return on investment and payback models', 'Lifecycle cost and running-cost comparisons', 'Energy and economic modelling', 'Grant and funding assessments', 'Capital business cases and board-ready reports'],
    draftNote: 'Draft wording. Confirm these are the reports Hanntec wants to offer.',
  },
  {
    id: 'advisory', icon: 'advisory', name: 'Engineering advisory', lead: true, phase: 'phase-pre-project',
    short: 'Independent expert advice on what to build, and how.',
    long: 'Senior engineers on your side of the table. We help you define the project, weigh up the options and protect your interests, from first idea to final sign-off.',
    points: ['Feasibility and options studies', 'Project definition, budgets and specifications', 'Owner’s engineer: your representative through delivery', 'Risk and value management', 'Energy and sustainability advice', 'Asset management and maintenance strategy', 'Standards and compliance reviews'],
    draftNote: 'Draft wording. Confirm these are the advisory services Hanntec wants to offer.',
  },
  {
    id: 'design', icon: 'design', name: 'Design &amp; engineering', phase: 'phase-design',
    short: 'Concept to detailed drawings, ready to build.',
    long: 'From first sketch to issued-for-construction drawings, we design electrical, mechanical and process systems that are practical to install and easy to maintain.',
    points: ['Mechanical and electrical (M&amp;E) design', 'Process and pipework design', 'Building services engineering', 'Surveys and site assessments', 'Drawings, specifications and as-built records'],
  },
  {
    id: 'construction', icon: 'construction', name: 'Construction &amp; project management', phase: 'phase-build',
    short: 'Extensions, fit-outs and new builds, managed end to end.',
    long: 'We manage and deliver building works, from plant extensions and fit-outs to new facilities, with one team accountable for programme, cost, quality and safety.',
    points: ['Project and programme management', 'Procurement and contractor management', 'Extensions, new builds and fit-outs', 'Refurbishment and retrofit', 'Civil and structural works', 'Site and health and safety management'],
    draftNote: 'Draft wording. Confirm which construction and project management works Hanntec carries out.',
  },
  {
    id: 'electrical', icon: 'electrical', name: 'Electrical installation &amp; implementation', phase: 'phase-build',
    short: 'Power, lighting, fire safety and controls, installed and certified.',
    long: 'Registered electricians install and certify the system, then bring it into service. We implement the whole system, not just the cable.',
    points: ['Power distribution, lighting and containment', 'Fire detection and emergency lighting', 'Controls wiring and equipment connection', 'Data cabling, fibre and low-voltage systems', 'Testing, certification and handover'],
    note: 'Electrical works certified by Safe Electric registered electricians.',
  },
  {
    id: 'mechanical', icon: 'mechanical', name: 'Mechanical installation &amp; process engineering', phase: 'phase-build',
    short: 'Pipework, plant and process equipment, installed to specification.',
    long: 'We install and modify plant, pipework and process equipment to specification, including live-plant work where downtime is not an option.',
    points: ['Process pipework and stainless steel', 'HVAC and heat-pump systems', 'Plant installation, relocation and removal', 'Live-plant modifications with minimal disruption'],
  },
  {
    id: 'commissioning', icon: 'commissioning', name: 'Commissioning &amp; start-up', phase: 'phase-commission',
    short: 'Every system tested, proven and handed over properly.',
    long: 'We test every system against its specification, fix what we find, and document the result, so you take over something that works.',
    points: ['Commissioning planning and management', 'Functional and performance testing', 'Start-up support and operator training', 'Cable and fibre certification', 'Snagging and defect close-out', 'Handover documentation'],
  },
];

// A to Z index on the Services page. Each entry links to the service it belongs to.
const capabilities = [
  ['Asset management strategy', 'advisory'], ['Building services engineering', 'design'], ['Capital business cases', 'roi'],
  ['Civil and structural works', 'construction'], ['Commissioning management', 'commissioning'], ['Compliance reviews', 'advisory'],
  ['Controls wiring', 'electrical'], ['Data cabling and fibre', 'electrical'], ['Electrical installation', 'electrical'],
  ['Emergency lighting', 'electrical'], ['Energy and economic modelling', 'roi'], ['Energy and sustainability advice', 'advisory'],
  ['Extensions and fit-outs', 'construction'], ['Feasibility studies', 'advisory'], ['Fire detection', 'electrical'],
  ['Grant and funding assessments', 'roi'], ['Handover documentation', 'commissioning'], ['Heat-pump systems', 'mechanical'],
  ['HVAC', 'mechanical'], ['Lifecycle costing', 'roi'], ['Live-plant modifications', 'mechanical'],
  ['M&amp;E design', 'design'], ['Operator training', 'commissioning'], ['Options studies', 'advisory'],
  ['Owner’s engineer', 'advisory'], ['Payback modelling', 'roi'], ['Performance testing', 'commissioning'],
  ['Plant installation and relocation', 'mechanical'], ['Power distribution', 'electrical'], ['Process design', 'design'],
  ['Process pipework', 'mechanical'], ['Procurement', 'construction'], ['Project management', 'construction'],
  ['Refurbishment and retrofit', 'construction'], ['Risk and value management', 'advisory'], ['ROI analysis', 'roi'],
  ['Site surveys', 'design'], ['Specifications', 'design'], ['Start-up support', 'commissioning'],
];

const steps = [
  ['Pre-project', 'We help you define the project and prove the payback before you commit.'],
  ['Design', 'We design a system that is practical to build and maintain.'],
  ['Build', 'Our crews construct and install it safely and on programme.'],
  ['Commission', 'We test it, prove it and hand over a system that works.'],
];

// verb-led link labels instead of a generic "Explore"
const ctaLabel = {
  roi: 'See ROI analysis', advisory: 'See engineering advisory', design: 'See design &amp; engineering',
  construction: 'See construction', electrical: 'See electrical installation', mechanical: 'See mechanical &amp; process',
  commissioning: 'See commissioning',
};

// photo with a WebP version first and the JPEG as fallback
const pic = (src, alt = '', onerr = 'this.parentNode.remove()') => `<picture><source srcset="${src.replace(/\.jpg$/, '.webp')}" type="image/webp"><img class="cover" src="${src}" alt="${alt}" loading="lazy" onerror="${onerr}"></picture>`;

const sectors = [
  { id: 'food-beverage', icon: 'food', name: 'Food &amp; beverage', short: 'Process, electrical and mechanical works for food and drink producers.', long: 'Electrical, mechanical and process installations for food and drink producers, including live-plant extensions where uptime matters.', cls: 'sec--big' },
  { id: 'agriculture', icon: 'agri', name: 'Agriculture', short: 'Power, plant and process works for farms and agri-processing.', long: 'Electrical, mechanical and process works for farms, co-ops and agri-processing sites.' },
  { id: 'construction', icon: 'construction', name: 'Construction', short: 'Building works and M&amp;E for developers and main contractors.', long: 'Building works and M&amp;E design and installation for developers and main contractors, from extensions to new builds.' },
  { id: 'energy', icon: 'energy', name: 'Energy, power &amp; renewables', short: 'Efficient heating and power that replace fossil fuels.', long: 'Efficient heating, heat pumps and power systems that replace fossil-fuel plant and cut running costs.' },
  { id: 'life-sciences', icon: 'science', name: 'Life sciences', short: 'Controlled environments, commissioned to exacting standards.', long: 'Pharma, biotech and medical: controlled-environment installations and commissioning documented to exacting standards.' },
  { id: 'hospitality', icon: 'hospitality', name: 'Hospitality', short: 'Electrical, fire safety, heating and data for hotels and venues.', long: 'Hotels and venues: electrical, fire safety, heating and data delivered around live guests and events.', cls: 'sec--wide' },
  { id: 'healthcare', icon: 'health', name: 'Healthcare', short: 'Safe, compliant installations for hospitals and care settings.', long: 'Hospitals and care settings: power, life-safety and building systems installed with minimal disruption.', cls: 'sec--wide' },
];

const clients = [
  ['dawn-meats', 'Dawn Meats'], ['frs-direct', 'FRS Direct'], ['tirlan', 'Tirlán'], ['tramore-races', 'Tramore Races'],
  ['fbd-hotels', 'FBD Hotels & Resorts'], ['ifac', 'ifac'], ['morris', 'Morris’s Builders Providers & DIY'], ['hcs', 'hcs'],
  ['horizon', 'Horizon'], ['flahavans', 'Flahavan’s'], ['maryborough-hotel', 'Maryborough Hotel'], ['hallahans', 'Hallahans Family Pharmacy'],
  ['faithlegg', 'Faithlegg'],
];

// alt text for the sector photos (shown on the Sectors page)
const sectorAlt = {
  'food-beverage': 'A table laid with plates of fresh food',
  agriculture: 'Cattle grazing on green hillside pasture',
  construction: 'The new Tirlán Country Life building with its glazed entrance',
  energy: 'Wind turbines behind rows of solar panels',
  'life-sciences': 'Amber vials moving along a pharmaceutical filling line',
  hospitality: 'Row of beer taps on a bar counter',
  healthcare: 'Medical staff walking down a hospital corridor',
};

// alt text for the service photos (shown on the Services page)
const serviceAlt = {
  design: 'Engineers marking up building drawings on a table',
  electrical: 'Close-up of a wired electrical control panel',
  commissioning: 'Engineer checking plant-room pipework against a clipboard',
  mechanical: 'Steel gears resting on an engineering drawing',
  construction: 'Excavator bucket tipping soil on a building site',
  roi: 'Hand pointing at bar charts in a financial report on a tablet',
  advisory: 'Engineers reviewing technical drawings together around a table',
};

const team = [
  { slug: 'jack-walshe', name: 'Jack Walshe', creds: 'BEng MIEI', role: 'Operations', bio: 'Jack leads Hanntec’s operations and looks after clients from first enquiry to final handover.' },
  { slug: 'jackie-barden', name: 'Jackie Barden', creds: 'BSc.', role: 'Senior Project Engineer', bio: 'Jackie leads engineering projects from design through to commissioning.' },
  { slug: 'niamh-kelly', name: 'Niamh Kelly', creds: 'BAI', role: 'Project Engineer', bio: 'Niamh delivers Hanntec’s engineering projects, coordinating design, installation and commissioning.' },
  { slug: 'ciaran-hickey', name: 'Ciaran Hickey', creds: '', role: 'Engineering Assistant', bio: 'Ciaran supports the design and project teams with drawings, documentation and digital tools.' },
  { slug: 'niamh-walshe', name: 'Niamh Walshe', creds: '', role: 'Accounts', bio: 'Niamh looks after Hanntec’s accounts, keeping invoicing and payments running smoothly.' },
];

const values = [
  ['Relationships', 'Most of our work comes by recommendation. We keep it that way by looking after the people we work for.'],
  ['Challenging design', 'We question the brief and look for answers to problems our clients didn’t think had one.'],
  ['Flexibility', 'We are constantly evolving to meet our clients’ needs, and we are based to reach any site in Ireland.'],
  ['Innovation', 'Modern tools and methods, applied to practical, cost-effective results.'],
  ['Safety first', 'Every site, every task. Safe systems of work come before programme and price.'],
  ['Sustainability', 'Efficient systems and lower-carbon solutions, such as replacing fossil-fuel heating.'],
];

// ------------------------------------------------------------------ helpers

const initials = (n) => n.split(' ').map((w) => w[0]).join('');

const media = (src, ic, cls = '', alt = '', label = true) => `<div class="media ${cls}">
  ${icon(ic, 'media__icon')}
  ${pic(src, alt)}
  ${label ? `<span class="media__label draft">${src}</span>` : ''}
</div>`;

const ctaBand = (heading = 'Talk to us before you commit capital', text = 'We’ll help you get the decision right, then deliver it.', light = false) => `<section class="section ${light ? 'section--sheet' : 'section--blue'} cta">
  <div class="wrap cta__grid">
    <div>
      <h2 class="h-display h-display--lg">${heading}</h2>
      <p class="lead">${text}</p>
    </div>
    <div class="actions">
      <a class="btn btn--red" href="contact.html">Talk to an engineer</a>
      <a class="btn ${light ? 'btn--outline' : 'btn--ghost'}" href="tel:${SITE.phoneHref}">${icon('phone')}${SITE.phone}</a>
    </div>
  </div>
</section>`;

const pageHero = (title, lead) => `<section class="page-hero">
  <div class="wrap">
    <h1 class="page-hero__title">${title}</h1>
    <p class="page-hero__lead">${lead}</p>
  </div>
</section>`;

// ------------------------------------------------------------------ pages

const home = () => {
  const leadCards = services.filter((s) => s.lead).map((s) => `<a class="leadcard" href="services.html#${s.id}">
        <span class="leadcard__media">${pic(`assets/img/services/${s.id}.jpg`, '', "this.closest('.leadcard__media').remove()")}</span>
        <span class="leadcard__title">${s.name}</span>
        <span class="leadcard__text">${s.short}</span>
        <span class="leadcard__points">
          ${s.points.slice(0, 4).map((p) => `<span>${p}</span>`).join('\n          ')}
        </span>
        <span class="svc__more">${ctaLabel[s.id]} ${icon('arrow')}</span>
      </a>`).join('\n      ');

  const svc = services.filter((s) => !s.lead).map((s) => `<a class="svc svc--sm" href="services.html#${s.id}">
        ${pic(`assets/img/services/${s.id}.jpg`)}
        <span class="svc__body">
          <span class="svc__title">${s.name}</span>
          <span class="svc__text">${s.short}</span>
          <span class="svc__more">${ctaLabel[s.id]} ${icon('arrow')}</span>
        </span>
      </a>`).join('\n      ');

  const stepsHtml = steps.map(([t, d], i) => `<li>
        <span class="steps__n" aria-hidden="true">${i + 1}</span>
        <h3>${t}</h3>
        <p>${d}</p>
      </li>`).join('\n      ');

  const secs = sectors.map((s) => `<a class="sec ${s.cls || ''}" href="sectors.html#${s.id}">
        ${pic(`assets/img/sectors/${s.id}.jpg`)}
        <span class="sec__body">
          <span class="sec__title">${s.name}</span>
          <span class="sec__text">${s.short}</span>
        </span>
      </a>`).join('\n      ');

  const wheelItems = clients.map(([file, name], i) => `<li class="wheel__item" style="--i:${i}"><span class="wheel__card"><img src="assets/img/clients/${file}.png" alt="${name.replace(/&/g, '&amp;')}" loading="lazy" draggable="false"></span></li>`).join('\n        ');

  // Hero background: the looping plant-room video when its files are present, otherwise the line drawing.
  // The video is attached by site.js only on larger screens; phones and reduced-motion visitors get the poster.
  const HERO = { poster: 'assets/img/hero/hero-poster.webp', webm: 'assets/video/hero-plantroom.webm', mp4: 'assets/video/hero-plantroom.mp4' };
  const hasVideo = [HERO.poster, HERO.webm, HERO.mp4].every((f) => existsSync(`${OUT}/${f}`));
  const heroBg = hasVideo
    ? `<div class="hero__media" aria-hidden="true">
    <img class="hero__poster" src="${HERO.poster}" alt="" width="1280" height="720" fetchpriority="high" decoding="async">
    <video class="hero__video" muted loop playsinline preload="none" tabindex="-1" data-webm="${HERO.webm}" data-mp4="${HERO.mp4}"></video>
  </div>`
    : `<div class="hero__art">${isoScene()}</div>`;
  const heroToggle = hasVideo
    ? `<button class="hero__toggle" type="button" aria-pressed="false" aria-label="Pause background video" hidden>
    <svg class="hero__toggle-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></svg>
    <svg class="hero__toggle-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
  </button>`
    : '';

  const body = `<section class="hero${hasVideo ? ' hero--video' : ''}" data-hero>
  ${heroBg}
  <div class="wrap hero__inner">
    <h1 class="hero__title">Engineering, start to finish.</h1>
    <p class="hero__lead">We advise on what to build, prove the return, then design, build and commission it.</p>
    <div class="actions">
      <a class="btn btn--red" href="contact.html">Talk to an engineer</a>
      <a class="btn btn--ghost" href="services.html">Our services</a>
    </div>
  </div>
  ${heroToggle}
</section>

<section class="section" id="services">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">Decide with confidence</h2>
      <p class="lead">Before you commit capital, we help you choose the right project and prove it will pay back.</p>
    </div>
    <div class="lead-grid">
      ${leadCards}
    </div>

    <div class="section__head section__head--sub" id="delivery">
      <h2 class="h-display h-display--md">Then we deliver it</h2>
      <p class="lead">Design, construction, installation and commissioning, by the same team.</p>
    </div>
    <div class="svc-grid svc-grid--five">
      ${svc}
    </div>
  </div>
</section>

${cases.published.length ? `<section class="section section--sheet" id="projects">
  <div class="wrap">
    <div class="section__head section__head--row">
      <h2 class="h-display">Selected projects</h2>
      <a class="textlink" href="projects.html">All projects ${icon('arrow')}</a>
    </div>
    <div class="cases">
      ${[...cases.published].slice(0, 3).map((c) => caseCard(c, sectors.find((s) => s.id === c.sector)?.name)).join('\n      ')}
    </div>
  </div>
</section>

` : ''}<section class="section${cases.published.length ? '' : ' section--sheet'}" id="how">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">One team, first question to handover</h2>
      <p class="lead">You deal with the same people from the business case to the final sign-off.</p>
    </div>
    <ol class="steps steps--four">
      ${stepsHtml}
    </ol>
  </div>
</section>

<section class="section section--dark" id="sectors">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">Sectors</h2>
      <p class="lead">Different industries, the same standards.</p>
    </div>
    <div class="bento">
      ${secs}
    </div>
  </div>
</section>

<section class="section" id="transformation">
  <div class="wrap compare-wrap">
    <div class="compare-text">
      <h2 class="h-display">Tirlán Country Life, before and after</h2>
      <p class="lead">Drag across to compare the original store with the new building.</p>
      <a class="btn btn--outline" href="contact.html">Talk to an engineer</a>
      <p class="draft">Before and after photos: assets/img/hero/before.jpg and after.jpg (same framing). Check Tirl&aacute;n has agreed to the photos being used, and that you hold the rights to the street-view image.</p>
    </div>
    <div class="compare" data-reveal>
      <div class="compare__layer compare__after"></div>
      <div class="compare__layer compare__before"></div>
      <span class="compare__tag compare__tag--l">Before</span>
      <span class="compare__tag compare__tag--r">After</span>
      <div class="compare__bar"></div>
      <div class="compare__handle">${icon('swap')}</div>
      <input type="range" min="0" max="100" value="50" aria-label="Compare the building before and after" aria-describedby="compare-desc">
      <p class="sr-only" id="compare-desc">Before: the original Tirlán Country Life store, a brown steel shed behind a green fence. After: the new dark grey building on the same site, with a glazed, timber-framed entrance and the Tirlán Country Life sign.</p>
    </div>
  </div>
</section>

<section class="section section--sheet" id="clients">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">Who we work with</h2>
      <p class="lead">Businesses across Ireland that trust us with their projects.</p>
    </div>
    <div class="wheel" data-wheel role="group" aria-roledescription="carousel" aria-label="Companies we work with. Drag, or use the arrow keys, to turn the wheel." tabindex="0">
      <ul class="wheel__ring">
        ${wheelItems}
      </ul>
    </div>
    <div class="wheel__controls">
      <button class="wheel__btn" type="button" data-wheel-prev aria-label="Previous logo">${icon('chevron', 'icon icon--flip')}</button>
      <button class="wheel__btn wheel__btn--text" type="button" data-wheel-toggle>Pause</button>
      <button class="wheel__btn" type="button" data-wheel-next aria-label="Next logo">${icon('chevron')}</button>
    </div>
  </div>
</section>

${ctaBand()}`;

  const schema = `
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Hanntec Engineering Ltd', url: 'https://www.hanntec.com/',
    telephone: '+353 87 912 2237', email: SITE.email, areaServed: 'Ireland',
    address: { '@type': 'PostalAddress', streetAddress: 'Fews', addressLocality: 'Kilmacthomas', addressRegion: 'Co. Waterford', postalCode: 'X42 YH04', addressCountry: 'IE' },
  })}</script>`;

  return page({
    title: 'Hanntec Engineering | Engineering advisory, ROI analysis and project delivery, Waterford',
    desc: 'Hanntec Engineering advises on capital projects, proves the return on investment, then designs, builds and commissions them for industry across Ireland. Based in Kilmacthomas, Co. Waterford.',
    active: 'home', body, schema,
  });
};

const about = () => {
  const people = team.map((p) => `<li>
        <button class="person" type="button" data-profile="profile-${p.slug}">
          <span class="person__frame">
            <span class="person__photo">
              <span class="person__initials" aria-hidden="true">${initials(p.name)}</span>
              <img class="cover" src="assets/img/team/${p.slug}.jpg" alt="" loading="lazy" onerror="this.remove()">
            </span>
          </span>
          <span class="person__name">${p.name}${p.creds ? ` <span class="person__creds">${p.creds}</span>` : ''}</span>
          <span class="person__role">${p.role}</span>
          <span class="person__more">View profile ${icon('chevron')}</span>
        </button>
      </li>`).join('\n      ');

  const dialogs = team.map((p) => `<dialog class="profile" id="profile-${p.slug}" aria-labelledby="profile-${p.slug}-name">
  <form method="dialog"><button class="profile__close" aria-label="Close profile">${icon('close')}</button></form>
  <div class="profile__grid">
    <span class="person__frame person__frame--lg">
      <span class="person__photo">
        <span class="person__initials" aria-hidden="true">${initials(p.name)}</span>
        <img class="cover" src="assets/img/team/${p.slug}.jpg" alt="Photo of ${p.name}" onerror="this.remove()">
      </span>
    </span>
    <div>
      <h3 id="profile-${p.slug}-name">${p.name}${p.creds ? ` <span class="person__creds">${p.creds}</span>` : ''}</h3>
      <p class="profile__role">${p.role}, Hanntec Engineering</p>
      <p>${p.bio}</p>
      <p class="draft">Draft bio. Replace with the real one.</p>
      <a class="btn btn--outline btn--sm" href="#" data-linkedin="${p.slug}" rel="noopener" target="_blank">${icon('linkedin')}LinkedIn profile</a>
      <p class="draft">LinkedIn button is a placeholder until the profile link is added.</p>
    </div>
  </div>
</dialog>`).join('\n');

  const vals = values.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join('\n      ');

  const body = `${pageHero('About Hanntec', 'A multi-disciplinary engineering company in Kilmacthomas, Co. Waterford, working for industry across Ireland.')}

<section class="section">
  <div class="wrap split">
    <h2 class="h-display">Engineers who see the job through.</h2>
    <div class="prose">
      <p class="prose__lead">Hanntec Engineering helps companies decide what to build, proves the return, then designs, builds and commissions it. You deal with one team from the business case to handover.</p>
      <p>Our business has grown by word of mouth and repeat work, because we take real care over what we build. We find solutions to the problems our clients have, and to the ones they didn’t think had a solution.</p>
    </div>
  </div>
</section>

<section class="section section--sheet" id="team">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">Meet the team</h2>
      <p class="lead">The engineers and support team behind every project. Select a name to read more.</p>
    </div>
    <ul class="people">
      ${people}
    </ul>
    <p class="draft">Add portraits as assets/img/team/firstname-lastname.jpg (square, face centred). Initials show until then.</p>
  </div>
</section>

<section class="section section--blue" id="values">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">Core values</h2>
      <p class="lead">How we work, on every job.</p>
    </div>
    <ul class="values">
      ${vals}
    </ul>
  </div>
</section>

${ctaBand('Work with the team.', 'Tell us about your project and we’ll put the right engineers on it.', true)}

${dialogs}`;

  return page({
    title: 'About | Hanntec Engineering',
    desc: 'Meet the Hanntec Engineering team and our core values: relationships, challenging design, flexibility, innovation, safety and sustainability.',
    active: 'about', body,
  });
};

const servicesPage = () => {
  const item = (s, flip) => `<section class="service${flip ? ' service--flip' : ''}" id="${s.id}">
    <div class="service__text">
      <h3 class="h-display h-display--md">${s.name}</h3>
      <p class="lead">${s.long}</p>
      <ul class="dashes">
        ${s.points.map((p) => `<li>${p}</li>`).join('\n        ')}
      </ul>
      ${s.note ? `<p class="service__note">${s.note}</p>` : ''}
      ${s.draftNote ? `<p class="draft draft--field">${s.draftNote}</p>` : ''}
      <p><a class="btn btn--outline btn--sm" href="contact.html?service=${s.id}#enquiry">Ask about this service</a></p>
    </div>
    <div class="service__media">${media(`assets/img/services/${s.id}.jpg`, s.icon, '', serviceAlt[s.id] || '', !serviceAlt[s.id])}</div>
  </section>`;

  // lifecycle bar: the four phases with the services in each
  const lifecycle = phases.map((ph, i) => `<li>
        <span class="steps__n" aria-hidden="true">${i + 1}</span>
        <h3><a href="#${ph.id}">${ph.name}</a></h3>
        <p class="steps__links">
          ${services.filter((s) => s.phase === ph.id).map((s) => `<a href="#${s.id}">${s.name}</a>`).join('\n          ')}
        </p>
      </li>`).join('\n      ');

  let n = 0;
  const groups = phases.map((ph, i) => `<div class="services__group${i ? ' services__group--ruled' : ''}" id="${ph.id}">
    <h2 class="h-display">${ph.name}</h2>
    <p class="lead">${ph.lead}</p>
  </div>
  ${services.filter((s) => s.phase === ph.id).map((s) => item(s, n++ % 2 === 1)).join('\n  ')}`).join('\n  ');

  const caps = capabilities.map(([label, id]) => `<li><a href="#${id}">${label}</a></li>`).join('\n      ');

  const body = `${pageHero('Services', 'One team for the whole project, from the first question to the final handover.')}

<section class="section section--sheet section--tight">
  <div class="wrap">
    <h2 class="sr-only">Project lifecycle</h2>
    <ol class="steps steps--four">
      ${lifecycle}
    </ol>
  </div>
</section>

<div class="wrap services">
  ${groups}
</div>

<section class="section section--sheet" id="capabilities">
  <div class="wrap">
    <div class="section__head">
      <h2 class="h-display">All capabilities</h2>
      <p class="lead">Looking for something specific? Find it here.</p>
    </div>
    <ul class="cap-index">
      ${caps}
    </ul>
    <p class="draft draft--field">Draft list, built from the service descriptions above. Remove anything Hanntec does not offer.</p>
  </div>
</section>

${ctaBand()}`;
  return page({
    title: 'Services | Hanntec Engineering',
    desc: 'ROI analysis and reporting, engineering advisory, design and engineering, construction and project management, electrical and mechanical installation, and commissioning from Hanntec Engineering.',
    active: 'services', body,
  });
};

const sectorsPage = () => {
  const items = sectors.map((s) => `<article class="sector" id="${s.id}">
      ${media(`assets/img/sectors/${s.id}.jpg`, s.icon, 'media--wide', sectorAlt[s.id], false)}
      <h2 class="h-display h-display--sm">${s.name}</h2>
      <p>${s.long}</p>
      <a class="textlink" href="contact.html?sector=${s.id}#enquiry">Talk to us about ${s.name.toLowerCase()} ${icon('arrow')}</a>
    </article>`).join('\n    ');

  const body = `${pageHero('Sectors', 'Different industries, the same standards. Find yours below, or ask us about anything technical.')}

<section class="section">
  <div class="wrap sectors">
    ${items}
  </div>
</section>

${ctaBand('Engineering for other industries too', 'Tell us what you need and we’ll tell you how we can help.')}`;
  return page({
    title: 'Sectors | Hanntec Engineering',
    desc: 'Hanntec Engineering works in food and beverage, agriculture, construction, energy and renewables, life sciences, hospitality and healthcare.',
    active: 'sectors', body,
  });
};

const contactPage = () => {
  const needOpts = services.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
  const sectorOpts = sectors.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
  const body = `${pageHero('Contact us', 'Tell us about your project. We’ll come back to you quickly to talk it through or arrange a site visit.')}

<section class="section section--tight">
  <div class="wrap contact">
    <div class="contact__details">
      <ul class="details">
        <li>${icon('phone', 'icon icon--lg')}<div><span class="details__label">Phone</span><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></div></li>
        <li>${icon('mail', 'icon icon--lg')}<div><span class="details__label">Email</span><a href="mailto:${SITE.email}">${SITE.email}</a></div></li>
        <li>${icon('pin', 'icon icon--lg')}<div><span class="details__label">Address</span>${SITE.address[0]},<br>${SITE.address[1]}<br><a class="textlink" href="${SITE.mapUrl}" rel="noopener" target="_blank">Get directions ${icon('arrow')}</a></div></li>
      </ul>
      <div class="next">
        <h2 class="h-display h-display--sm">What happens next</h2>
        <ol class="next__steps">
          <li><strong>We reply</strong> by phone or email to talk through what you need.</li>
          <li><strong>We look at the site or drawings</strong> with you, where that helps.</li>
          <li><strong>You get a clear proposal</strong> setting out scope, programme and cost.</li>
        </ol>
        <p class="next__note">What you share with us is kept confidential.</p>
      </div>
    </div>

    <form class="form" id="enquiry" name="enquiry" method="POST" action="/thanks.html" data-netlify="true" netlify-honeypot="website" data-enquiry>
      <h2 class="h-display h-display--sm">Send an enquiry</h2>
      <input type="hidden" name="form-name" value="enquiry">
      <input type="hidden" name="subject" value="Website enquiry">
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required><p class="field__error" hidden></p></div>
      <div class="field"><label for="f-company">Company <span class="optional">(optional)</span></label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field-row">
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required><p class="field__error" hidden></p></div>
        <div class="field"><label for="f-phone">Phone <span class="optional">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="f-need">What do you need?</label><select id="f-need" name="need"><option value="">Not sure yet</option>${needOpts}</select></div>
        <div class="field"><label for="f-sector">Your sector</label><select id="f-sector" name="sector"><option value="">Other or not listed</option>${sectorOpts}</select></div>
      </div>
      <div class="field"><label for="f-message">How can we help?</label><textarea id="f-message" name="message" rows="5" required></textarea><p class="field__error" hidden></p></div>
      <div class="field field--check"><input id="f-consent" type="checkbox" required><label for="f-consent">I agree that Hanntec can use these details to reply to my enquiry. <a href="privacy.html">Privacy notice</a></label><p class="field__error" hidden></p></div>
      <p class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>
      <button class="btn btn--red" type="submit">Send enquiry</button>
      <p class="form__status" role="status" aria-live="polite"></p>
    </form>
    <div class="form form--done" data-enquiry-done tabindex="-1" hidden>
      ${icon('check', 'icon icon--xl')}
      <h2 class="h-display h-display--sm">Thanks<span data-enquiry-name></span>, we have your enquiry</h2>
      <p>It has gone straight to our engineers and we’ll come back to you shortly. A copy of what you sent is below.</p>
      <dl class="form__summary" data-enquiry-summary></dl>
      <p>If it’s urgent, call us on <a href="tel:${SITE.phoneHref}">${SITE.phone}</a>.</p>
    </div>
  </div>
</section>`;
  return page({
    title: 'Contact | Hanntec Engineering',
    desc: 'Contact Hanntec Engineering in Kilmacthomas, Co. Waterford. Call 087 912 2237, email jack@hanntec.com or send an enquiry.',
    active: 'contact', body,
  });
};

const privacyPage = () => {
  const body = `${pageHero('Privacy notice', 'How Hanntec Engineering handles the details you send us.')}
<section class="section section--tight">
  <div class="wrap prose prose--page">
    <p class="draft draft--field">Draft for review. Have it checked before the site goes live.</p>
    <h2>Who we are</h2>
    <p>Hanntec Engineering Ltd, Fews, Kilmacthomas, Co. Waterford, X42 YH04. Email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
    <h2>What we collect and why</h2>
    <p>When you use the enquiry form we collect your name, email address, any phone number and company you give us, and your message. We use these only to reply to your enquiry and to take the conversation forward, including preparing a quotation.</p>
    <h2>Our legal basis</h2>
    <p>We process your details because you asked us to get in touch, and because it is in our legitimate interest to respond to business enquiries.</p>
    <h2>Who sees it</h2>
    <p>Your enquiry goes to our team by email. We do not sell your details or use them for marketing you did not ask for.</p>
    <p>The enquiry form is run by Netlify, the company that hosts this website. Netlify stores each enquiry and emails it to us, acting only on our instructions. Netlify may handle data outside the European Economic Area, under safeguards approved by the European Commission. Our email provider acts on our instructions too.</p>
    <h2>How long we keep it</h2>
    <p>We keep enquiries for as long as needed to deal with them, and for a reasonable period after in case you get back in touch. Tell us if you want yours deleted sooner.</p>
    <h2>Your rights</h2>
    <p>You can ask to see, correct or delete the details we hold about you, and you can complain to the Data Protection Commission at <a href="https://www.dataprotection.ie" rel="noopener">dataprotection.ie</a>. Email us to make a request.</p>
    <h2>Cookies</h2>
    <p>This website does not use advertising or tracking cookies.</p>
  </div>
</section>`;
  return page({ title: 'Privacy notice | Hanntec Engineering', desc: 'How Hanntec Engineering handles the details you send through the enquiry form.', active: 'privacy', body });
};

// ------------------------------------------------------------------ write

write('index.html', home());
write('404.html', page({
  title: 'Page not found | Hanntec Engineering', desc: 'This page has moved or no longer exists.', active: '404',
  body: `${pageHero('Page not found', 'The page you were looking for has moved or no longer exists.')}
<section class="section section--tight">
  <div class="wrap">
    <div class="actions">
      <a class="btn btn--red" href="index.html">Go to the home page</a>
      <a class="btn btn--outline" href="contact.html">Talk to an engineer</a>
    </div>
  </div>
</section>`,
}));
write('about.html', about());

// ---------- case studies
const caseCtx = { sectors, services, pageHero, ctaBand };
if (cases.published.length) {
  write('projects.html', page({
    title: 'Projects | Hanntec Engineering',
    desc: 'Engineering projects delivered by Hanntec Engineering for clients across Ireland.',
    active: 'projects', body: projectsPage(cases.published, caseCtx),
  }));
}
for (const c of cases.all) {
  const others = cases.published.filter((o) => o.id !== c.id).slice(0, 3);
  write(`case-${c.id}.html`, page({
    title: `${c.title} | Projects | Hanntec Engineering`,
    desc: (c.summary || `${c.title} for ${c.client}, delivered by Hanntec Engineering.`).replace(/"/g, '&quot;'),
    active: 'projects', path: `case-${c.id}.html`, noindex: !!c.draft,
    body: casePage(c, { ...caseCtx, others }),
  }));
}

// ---------- sitemap (published pages only)
const urls = ['', 'about.html', 'services.html', 'sectors.html', 'contact.html', 'privacy.html',
  ...(cases.published.length ? ['projects.html'] : []), ...cases.published.map((c) => `case-${c.id}.html`)];
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
write('services.html', servicesPage());
write('sectors.html', sectorsPage());
write('contact.html', contactPage());
// shown after sending the enquiry form when JavaScript is off (the form's action); hidden from search engines
write('thanks.html', page({
  title: 'Thanks for your enquiry | Hanntec Engineering',
  desc: 'Your enquiry has been sent to Hanntec Engineering.',
  active: 'contact', path: 'thanks.html', noindex: true,
  body: `${pageHero('Thanks, we have your enquiry', 'It has gone straight to our engineers and we’ll come back to you shortly.')}
<section class="section section--tight">
  <div class="wrap prose prose--page">
    <p>If it’s urgent, call us on <a href="tel:${SITE.phoneHref}">${SITE.phone}</a> or email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
    <p><a class="btn btn--red" href="index.html">Back to the home page</a></p>
  </div>
</section>`,
}));
write('privacy.html', privacyPage());
write('assets/img/hero/before.svg', isoScene({ mode: 'wire' }));
write('assets/img/hero/after.svg', isoScene({ mode: 'solid' }));
console.log(`built ${9 + cases.all.length + (cases.published.length ? 1 : 0)} pages (${cases.published.length} published projects, ${cases.all.length - cases.published.length} drafts)`);
