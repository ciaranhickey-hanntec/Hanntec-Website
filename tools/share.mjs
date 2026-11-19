// 1200x630 share image (shown when the site is linked on LinkedIn, Teams, WhatsApp etc.)
import { writeFileSync } from 'node:fs';
import { isoScene } from './lib.mjs';

const OUT = process.argv[2];
const FONTS = process.argv[3];
const LOGO = process.argv[4];
const art = isoScene().replace('class="iso is-animating"', 'class="iso"');

writeFileSync(`${OUT}/share.html`, `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/barlow-condensed-700.woff2") format("woff2"); font-weight: 700; }
@font-face { font-family: "Instrument Sans"; src: url("${FONTS}/instrument-sans.woff2") format("woff2"); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #061833; }
.c { position: relative; width: 1200px; height: 630px; color: #fff; font-family: "Instrument Sans", Arial, sans-serif; background: #061833; }
.c::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(141,184,247,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(141,184,247,.07) 1px, transparent 1px); background-size: 40px 40px; }
.art { position: absolute; right: 30px; bottom: 40px; width: 560px; }
.iso { display: block; width: 100%; height: auto; }
.iso .grid { stroke: #8DB8F7; stroke-opacity: .13; stroke-width: 1; fill: none; }
.iso .shape { stroke: #8DB8F7; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
.iso .shape.thin { stroke-width: 1.1; stroke-opacity: .75; }
.iso text, .iso .dim { display: none; }
.logo { position: absolute; left: 72px; top: 64px; width: 240px; }
.copy { position: absolute; left: 72px; top: 200px; width: 560px; }
h1 { font: 700 84px/.92 "Barlow Condensed", sans-serif; letter-spacing: -.01em; }
.rule { width: 72px; height: 5px; margin: 26px 0 22px; background: #C8142F; border-radius: 3px; }
p { font-size: 26px; line-height: 1.35; color: #D5E3FA; }
.site { position: absolute; left: 72px; bottom: 56px; font-weight: 600; font-size: 22px; color: #8DB8F7; }
</style></head><body><div class="c">
<img class="logo" src="${LOGO}" alt="">
<div class="art">${art}</div>
<div class="copy"><h1>Engineering, start to finish.</h1><div class="rule"></div><p>Engineering advisory, ROI analysis, design, construction and commissioning across Ireland.</p></div>
<div class="site">hanntec.com</div>
</div></body></html>`);
console.log('wrote share.html');
