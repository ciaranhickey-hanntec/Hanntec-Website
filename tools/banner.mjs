// LinkedIn company cover banner (1128 x 191, rendered at 2x) in the website's style.
import { mkdirSync, writeFileSync } from 'node:fs';
import { isoScene } from './lib.mjs';

const OUT = process.argv[2];
const FONTS = process.argv[3]; // absolute path to the site's assets/fonts folder, as a file:/// URL
mkdirSync(OUT, { recursive: true });

const art = isoScene().replace('class="iso is-animating"', 'class="iso"');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Hanntec LinkedIn banner</title>
<style>
@font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/barlow-condensed-700.woff2") format("woff2"); font-weight: 700; }
@font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/barlow-condensed-600.woff2") format("woff2"); font-weight: 600; }
@font-face { font-family: "Instrument Sans"; src: url("${FONTS}/instrument-sans.woff2") format("woff2"); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1128px; height: 191px; overflow: hidden; background: #061833; }
.banner {
  position: relative; width: 1128px; height: 191px; overflow: hidden; color: #fff;
  background: radial-gradient(520px 300px at 86% 50%, rgba(30, 100, 210, .42), transparent 72%), #061833;
  font-family: "Instrument Sans", Arial, sans-serif;
}
.banner::before {
  content: ""; position: absolute; inset: 0;
  background-image: linear-gradient(rgba(141,184,247,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(141,184,247,.07) 1px, transparent 1px);
  background-size: 24px 24px;
}
/* drawing on the right, clear of the logo that LinkedIn places bottom-left */
.art { position: absolute; right: 28px; top: 12px; bottom: 12px; display: flex; align-items: center; }
.iso { display: block; height: 167px; width: auto; }
.iso .grid { stroke: #8DB8F7; stroke-opacity: .13; stroke-width: 1; fill: none; }
.iso .shape { stroke: #8DB8F7; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
.iso .shape.thin { stroke-width: 1.1; stroke-opacity: .75; }
.iso text { display: none; }
.iso .dim { display: none; }
/* text sits centre-left: safe on desktop (logo bottom-left) and on mobile (sides cropped) */
.copy { position: absolute; left: 236px; top: 50%; transform: translateY(-50%); max-width: 600px; }
.title { font: 700 50px/0.95 "Barlow Condensed", sans-serif; letter-spacing: -.005em; }
.title span { color: #FF4B64; }
.rule { width: 56px; height: 4px; margin: 12px 0 11px; background: #C8142F; border-radius: 2px; }
.services { display: flex; gap: 18px; font-size: 14px; font-weight: 600; color: #D5E3FA; white-space: nowrap; }
.services li { list-style: none; position: relative; }
.services li + li::before { content: ""; position: absolute; left: -10px; top: 50%; width: 3px; height: 3px; margin-top: -1.5px; border-radius: 50%; background: #8DB8F7; }
.services { padding: 0; }
.site { margin-top: 10px; font: 600 13px/1 "Instrument Sans", sans-serif; color: #8DB8F7; letter-spacing: .02em; }
</style></head>
<body>
<div class="banner">
  <div class="art">${art}</div>
  <div class="copy">
    <h1 class="title">Engineering, start to finish.</h1>
    <div class="rule"></div>
    <ul class="services"><li>Engineering advisory</li><li>ROI analysis</li><li>Design</li><li>Construction</li><li>Commissioning</li></ul>
    <p class="site">hanntec.com</p>
  </div>
</div>
</body></html>`;

writeFileSync(`${OUT}/linkedin-banner.html`, html);
console.log('wrote', `${OUT}/linkedin-banner.html`);
