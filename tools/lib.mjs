// Shared pieces for the Hanntec site generator: icons, hero drawing, page layout.

const ICON_PATHS = {
  // services
  roi: '<path d="M3 20.5h18M4.5 16l5-5 3.5 3L20 7M15.5 7H20v4.5"/>',
  advisory: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z"/>',
  design:'<circle cx="12" cy="4.6" r="1.6"/><path d="M12 6.2 6 20M12 6.2 18 20M8.6 14h6.8"/>',
  electrical: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  commissioning: '<path d="M4 17a8 8 0 0 1 16 0M12 17l4.5-5.5M3 20.5h18"/><circle cx="12" cy="17" r="1.2"/>',
  mechanical: '<circle cx="12" cy="12" r="6.2"/><circle cx="12" cy="12" r="2.4"/><path d="M12 3v2.8M12 18.2V21M3 12h2.8M18.2 12H21M5.6 5.6l2 2M16.4 16.4l2 2M18.4 5.6l-2 2M7.6 16.4l-2 2"/>',
  // sectors
  food: '<path d="M10 3h4M10.5 3v4l-2 3.2V20a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V10.2l-2-3.2V3M8.5 13h7"/>',
  agri: '<path d="M3 10.5 12 4l9 6.5V20H3zM9 20v-6h6v6M9 14l6 6M15 14l-6 6"/>',
  construction: '<path d="M4.5 16a7.5 7.5 0 0 1 15 0M3 16h18v3H3zM12 8.5V16"/>',
  energy: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9"/>',
  science: '<path d="M9.5 3h5M10.5 3v6L5.2 18A2 2 0 0 0 6.9 21h10.2a2 2 0 0 0 1.7-3L13.5 9V3M7.8 14.5h8.4"/>',
  hospitality: '<path d="M5 18a7 7 0 0 1 14 0M3 20.5h18M12 11V8.5M10.2 8.5h3.6"/>',
  health: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  // ui
  chevron: '<path d="M9 6l6 6-6 6"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<path d="M3 6h18v12H3zM3 7l9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V16M8 7.6v.1M12 16v-5.5M12 13c0-1.7 1-2.7 2.5-2.7S17 11.3 17 13v3"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  swap: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
};

export function icon(name, cls = 'icon') {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;
}

// ---------- Hero drawing: an isometric plant that draws itself in ----------

// mode: 'hero' (dark, animated, inline), 'wire' (blueprint drawing, standalone SVG), 'solid' (finished model, standalone SVG)
export function isoScene(opts = {}) {
  const mode = opts.mode || 'hero';
  const solid = mode === 'solid', wire = mode === 'wire';
  const BG = wire ? '#0B3A82' : '#061833';
  const s = 34;
  const C = Math.cos(Math.PI / 6);
  const pts = [];
  const Q = (x, y, z) => [(x - y) * C * s, (x + y) * 0.5 * s - z * s];
  const P = (x, y, z) => { const p = Q(x, y, z); pts.push(p); return p; };
  const n = (v) => v.toFixed(1);
  const pl = (a) => a.map((p) => `${n(p[0])},${n(p[1])}`).join(' ');
  const F = solid ? { top: '#FFFFFF', right: '#BFCDE2', left: '#DDE6F2' }
    : wire ? { top: BG, right: BG, left: BG }
      : { top: '#143B7A', right: '#0C2A5C', left: '#091F46' };
  const SKY = solid ? '#0B3A82' : '#8DB8F7';
  const RED = solid ? '#C8142F' : '#FF4B64';
  const HALO = solid ? '#EAF0F8' : BG;
  const WIN = solid ? '#A9C6EE' : 'none';
  const DOOR = solid ? '#6B7F9F' : 'none';
  const out = [];
  let k = 0;

  const poly = (a, fill, cls = 'shape') => `<polygon class="${cls}" pathLength="1" fill="${fill}" points="${pl(a)}"/>`;
  const rface = (X, y1, y2, z1, z2, fill = 'none') => poly([P(X, y1, z2), P(X, y2, z2), P(X, y2, z1), P(X, y1, z1)], fill, 'shape thin');
  const lface = (Y, x1, x2, z1, z2, fill = 'none') => poly([P(x1, Y, z2), P(x2, Y, z2), P(x2, Y, z1), P(x1, Y, z1)], fill, 'shape thin');
  const line = (a, b, cls = 'shape thin', style = '') => `<path class="${cls}" pathLength="1" fill="none" d="M${pl([a]).replace(',', ' ')}L${pl([b]).replace(',', ' ')}" ${style ? `style="${style}"` : ''}/>`;

  function box(x, y, z, w, d, h, detail = '', pal = F) {
    const T0 = P(x, y, z + h), T1 = P(x + w, y, z + h), T2 = P(x + w, y + d, z + h), T3 = P(x, y + d, z + h);
    const B1 = P(x + w, y, z), B2 = P(x + w, y + d, z), B3 = P(x, y + d, z);
    out.push(`<g class="obj" style="--i:${k++}">${poly([T3, T2, B2, B3], pal.left)}${poly([T1, T2, B2, B1], pal.right)}${poly([T0, T1, T2, T3], pal.top)}${detail}</g>`);
  }
  // Finished-model colours (solid mode only): blue roofs, pale walls, darker plinth
  const ROOF = solid ? { top: '#0B3A82', right: '#C3D1E5', left: '#E4EBF5' } : F;
  const PLINTH = solid ? { top: '#B3C3DB', right: '#8497B4', left: '#9CAECA' } : F;

  function cyl(cx, cy, z, r, h, bands = [], accent = '') {
    const [X, Yt] = P(cx, cy, z + h);
    const [, Yb] = P(cx, cy, z);
    const rx = 1.2247 * r * s, ry = 0.7071 * r * s;
    pts.push([X - rx, Yt - ry], [X + rx, Yb + ry]);
    let g = `<path class="shape" pathLength="1" fill="${F.right}" d="M${n(X - rx)},${n(Yt)}L${n(X - rx)},${n(Yb)}A${n(rx)},${n(ry)} 0 0 0 ${n(X + rx)},${n(Yb)}L${n(X + rx)},${n(Yt)}Z"/>`;
    bands.forEach((zb, i) => {
      const [, Yz] = P(cx, cy, z + zb);
      const st = accent && i === bands.length - 1 ? ` style="stroke:${RED};stroke-width:2.4"` : '';
      g += `<path class="shape thin" pathLength="1" fill="none"${st} d="M${n(X - rx)},${n(Yz)}A${n(rx)},${n(ry)} 0 0 0 ${n(X + rx)},${n(Yz)}"/>`;
    });
    g += `<ellipse class="shape" pathLength="1" fill="${F.top}" cx="${n(X)}" cy="${n(Yt)}" rx="${n(rx)}" ry="${n(ry)}"/>`;
    out.push(`<g class="obj" style="--i:${k++}">${g}</g>`);
  }

  function pipe(points, color, w = 6) {
    const d = points.map((p, i) => { const [X, Y] = P(...p); return `${i ? 'L' : 'M'}${n(X)},${n(Y)}`; }).join('');
    out.push(`<g class="obj" style="--i:${k++}"><path d="${d}" fill="none" stroke="${HALO}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path class="shape pipe" pathLength="1" d="${d}" fill="none" style="stroke:${color};stroke-width:${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`);
  }

  function post(x, y, z1, z2) {
    return line(P(x, y, z1), P(x, y, z2), 'shape thin');
  }

  function valve(x, y, z) {
    const [X, Y] = P(x, y, z + 0.8);
    const rx = 1.2247 * 0.5 * s, ry = 0.7071 * 0.5 * s;
    return `${line(P(x, y, z), P(x, y, z + 0.8), 'shape', `stroke:${RED}`)}<ellipse class="shape" pathLength="1" fill="none" style="stroke:${RED};stroke-width:2.6" cx="${n(X)}" cy="${n(Y)}" rx="${n(rx)}" ry="${n(ry)}"/>`;
  }

  // ----- ground grid (kept out of the bounding box)
  let grid = '';
  for (let i = -1; i <= 20; i++) {
    const a = Q(i, -2, 0), b = Q(i, 12, 0);
    grid += `M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}`;
  }
  for (let j = -2; j <= 12; j++) {
    const a = Q(-1, j, 0), b = Q(20, j, 0);
    grid += `M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}`;
  }

  // ----- main hall
  if (solid) box(-0.8, -0.8, -0.5, 19.4, 12.6, 0.5, '', PLINTH); // plinth, so the finished model sits on a base
  const door = lface(5, 4.3, 5.9, 0, 2.3, DOOR);
  const wins = lface(5, 1.7, 3.3, 1.5, 2.5, WIN) + lface(5, 6.7, 8.3, 1.5, 2.5, WIN);
  let ribs = '';
  for (let xi = 2; xi <= 8; xi++) ribs += line(P(xi, 0, 3.2), P(xi, 5, 3.2), 'shape thin', 'opacity:.35');
  box(1, 0, 0, 8, 5, 3.2, door + wins + ribs, ROOF);
  // roof plant
  cyl(2.6, 1.6, 3.2, 0.42, 3.4, [1.1, 2.2], true);
  box(5.2, 1.0, 3.2, 1.9, 1.3, 0.75);
  box(2.0, 3.1, 3.2, 1.3, 1.0, 0.5);
  // annex
  box(9, 1, 0, 2.6, 3, 2, lface(4, 9.6, 10.8, 0, 1.4, DOOR), ROOF);
  // tanks
  cyl(13.4, 2.8, 0, 1.15, 5.8, [1.5, 2.9, 4.3]);
  cyl(16.1, 1.5, 0, 1.0, 4.5, [1.5, 3.0]);

  // ----- pipe rack in front
  let posts = '';
  const RY = 10; // rack sits well in front of the hall so the drawing stays uncluttered
  [1.5, 4.5, 7.5, 10.5, 13.5].forEach((x) => { posts += post(x, RY, 0, 1.0); });
  out.push(`<g class="obj" style="--i:${k++}">${posts}</g>`);
  pipe([[1, RY, 1.0], [15.6, RY, 1.0]], SKY, 5);
  pipe([[1, RY, 1.5], [13.4, RY, 1.5], [13.4, 4.1, 1.5]], RED, 6);
  out.push(`<g class="obj" style="--i:${k++}">${valve(6.2, RY, 1.5)}</g>`);

  // ----- dimension line + callouts (drawing modes only)
  if (!solid) {
  const dimA = P(1, 6.0, 0), dimB = P(9, 6.0, 0);
  const t1a = P(1, 5.7, 0), t1b = P(1, 6.3, 0), t2a = P(9, 5.7, 0), t2b = P(9, 6.3, 0);
  const mid = P(5, 6.9, 0);
  const dim = `<g class="obj dim" style="--i:${k++}">
    <path class="shape thin" pathLength="1" fill="none" d="M${pl([dimA]).replace(',', ' ')}L${pl([dimB]).replace(',', ' ')}M${pl([t1a]).replace(',', ' ')}L${pl([t1b]).replace(',', ' ')}M${pl([t2a]).replace(',', ' ')}L${pl([t2b]).replace(',', ' ')}"/>
    <text transform="translate(${n(mid[0])} ${n(mid[1])}) rotate(30)" text-anchor="middle" font-size="14">24 000</text></g>`;
  out.push(dim);

  const aAnchor = Q(6.2, RY, 2.4), aCircle = [aAnchor[0] - 46, aAnchor[1] + 78];
  const bAnchor = Q(16.1, 1.5, 4.5), bCircle = [bAnchor[0] + 60, bAnchor[1] - 70];
  pts.push([aCircle[0] - 14, aCircle[1] + 14], [bCircle[0] + 14, bCircle[1] - 14]);
  out.push(`<g class="obj dim" style="--i:${k++}">
    <path class="shape thin" pathLength="1" fill="none" d="M${n(aAnchor[0])} ${n(aAnchor[1])}L${n(aCircle[0] + 10)} ${n(aCircle[1] - 8)}"/>
    <circle class="shape thin" pathLength="1" fill="none" cx="${n(aCircle[0])}" cy="${n(aCircle[1])}" r="13"/><text x="${n(aCircle[0])}" y="${n(aCircle[1] + 5)}" text-anchor="middle" font-size="14">A</text>
    <path class="shape thin" pathLength="1" fill="none" d="M${n(bAnchor[0])} ${n(bAnchor[1])}L${n(bCircle[0] - 10)} ${n(bCircle[1] + 8)}"/>
    <circle class="shape thin" pathLength="1" fill="none" cx="${n(bCircle[0])}" cy="${n(bCircle[1])}" r="13"/><text x="${n(bCircle[0])}" y="${n(bCircle[1] + 5)}" text-anchor="middle" font-size="14">B</text></g>`);
  }

  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const pad = 28;
  let x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
  let w = Math.max(...xs) - Math.min(...xs) + 2 * pad, h = Math.max(...ys) - Math.min(...ys) + 2 * pad;

  if (!wire && !solid) {
    return `<svg class="iso is-animating" viewBox="${n(x0)} ${n(y0)} ${n(w)} ${n(h)}" aria-hidden="true" focusable="false">
<path class="grid" d="${grid}" fill="none"/>
${out.join('\n')}
</svg>`;
  }

  // Standalone 4:3 picture for the before/after slider: same model, same framing, two renderings
  const ar = 4 / 3, margin = 1.12;
  w *= margin; h *= margin;
  if (w / h < ar) { const nw = h * ar; x0 -= (nw - w) / 2; w = nw; } else { const nh = w / ar; y0 -= (nh - h) / 2; h = nh; }
  const cx = Math.min(...xs) + (Math.max(...xs) - Math.min(...xs)) / 2, cy = Math.min(...ys) + (Math.max(...ys) - Math.min(...ys)) / 2;
  x0 = cx - w / 2; y0 = cy - h / 2;
  const style = solid
    ? '.shape{stroke:#0B3A82;stroke-opacity:.3;stroke-width:1.1;stroke-linejoin:round;stroke-linecap:round}.thin{stroke-opacity:.25}'
    : '.shape{stroke:#8DB8F7;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round}.thin{stroke-width:1.1;stroke-opacity:.8}text{fill:#8DB8F7;font:500 14px Arial,sans-serif}';
  const backdrop = solid
    ? `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" fill="#C9DBF4"/>`
    : `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" fill="#0B3A82"/><path d="${grid}" fill="none" stroke="#fff" stroke-opacity=".1"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(x0)} ${n(y0)} ${n(w)} ${n(h)}"><style>${style}</style>
${backdrop}
${out.join('\n')}
</svg>`;
}

// ---------- Page layout ----------

// file name for each page, used for canonical and share links ('' is the site root)
const FILES = { home: '', about: 'about.html', services: 'services.html', sectors: 'sectors.html', contact: 'contact.html', privacy: 'privacy.html', projects: 'projects.html' };
export { FILES };

const SITE = {
  url: 'https://www.hanntec.com/',
  name: 'Hanntec Engineering',
  phone: '087 912 2237',
  phoneHref: '+353879122237',
  email: 'jack@hanntec.com',
  address: ['Fews, Kilmacthomas', 'Co. Waterford, X42 YH04'],
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fews%2C+Kilmacthomas%2C+Co.+Waterford+X42+YH04',
  linkedin: 'https://www.linkedin.com/company/hanntec-engineering/',
};
export { SITE };

function header(active) {
  const cur = (k) => (active === k ? ' aria-current="page"' : '');
  return `<a class="skip" href="#main">Skip to main content</a>
<header class="site-header" data-header>
  <div class="wrap header-row">
    <a class="brand" href="index.html" aria-label="Hanntec Engineering home"><img class="brand__light" src="assets/img/logo-on-dark.png" alt="" width="423" height="125"><img class="brand__dark" src="assets/img/logo.png" alt="Hanntec Engineering" width="423" height="125"></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">Menu</span>${icon('menu', 'icon icon--open')}${icon('close', 'icon icon--close')}</button>
    <nav id="site-nav" class="nav" aria-label="Primary">
      <div class="has-menu">
        <button class="nav__link nav__link--menu" type="button" aria-expanded="false" aria-controls="menu-about"${active === 'about' ? ' data-current="true"' : ''}>About ${icon('chevronDown', 'icon icon--sm')}</button>
        <div class="menu" id="menu-about">
          <a href="about.html"${cur('about')}>About Hanntec</a>
          <a href="about.html#team">Meet the team</a>
          <a href="about.html#values">Core values</a>
        </div>
      </div>
      <a class="nav__link" href="services.html"${cur('services')}>Services</a>
      ${SITE.showProjects ? `<a class="nav__link" href="projects.html"${cur('projects')}>Projects</a>` : ''}
      <a class="nav__link" href="sectors.html"${cur('sectors')}>Sectors</a>
      <a class="btn btn--red btn--sm" href="contact.html"${cur('contact')}>Contact us</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a href="index.html" aria-label="Hanntec Engineering home"><img src="assets/img/logo-on-dark.png" alt="Hanntec Engineering" width="423" height="125"></a>
      <p>Engineering advice, analysis and delivery for industry across Ireland.</p>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <ul class="footer-list">
        <li><a href="about.html">About</a></li>
        <li><a href="about.html#team">Meet the team</a></li>
        <li><a href="services.html">Services</a></li>
        ${SITE.showProjects ? '<li><a href="projects.html">Projects</a></li>' : ''}
        <li><a href="sectors.html">Sectors</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Contact</h2>
      <ul class="footer-list">
        <li><a href="tel:${SITE.phoneHref}">${SITE.phone}</a></li>
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li>${SITE.address[0]},<br>${SITE.address[1]}</li>
        <li><a class="footer-social" href="${SITE.linkedin}" rel="noopener" target="_blank">${icon('linkedin')}<span>LinkedIn</span></a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-base">
    <p>&copy; <span data-year>2026</span> Hanntec Engineering Ltd. <a href="privacy.html">Privacy notice</a></p>
  </div>
</footer>`;
}

export function page({ title, desc, active, body, schema = '', path, noindex = false }) {
  const file = path ?? FILES[active];
  return `<!doctype html>
<html lang="en-IE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#061833">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE.url}${file ?? ''}">
<meta property="og:image" content="${SITE.url}assets/img/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
${file !== undefined && !noindex ? `<link rel="canonical" href="${SITE.url}${file}">` : '<meta name="robots" content="noindex">'}
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="stylesheet" href="assets/css/styles.css">${schema}
</head>
<body class="page-${active}">
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}
