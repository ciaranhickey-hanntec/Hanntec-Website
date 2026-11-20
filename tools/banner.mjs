// LinkedIn company cover banner (1128 x 191, rendered at 2x) in the website's style.
// Usage: node tools/banner.mjs <output folder> <file:/// URL of assets/fonts> [file:/// URL of a photo]
// then screenshot <output folder>/linkedin-banner.html at 1128x191 with device scale factor 2.
// With a photo (the hero plant-room image) it matches the home page hero; without one it uses the line drawing.
import { mkdirSync, writeFileSync } from 'node:fs';
import { isoScene } from './lib.mjs';

const OUT = process.argv[2];
const FONTS = process.argv[3];
const PHOTO = process.argv[4];
mkdirSync(OUT, { recursive: true });

// The same order as the home page: the first two lead, the rest deliver.
const phases = [
  ['01', 'Advise', true],
  ['02', 'Prove the return', true],
  ['03', 'Design', false],
  ['04', 'Build', false],
  ['05', 'Commission', false],
];

const visual = PHOTO
  ? `<div class="photo"></div>`
  : `<div class="art">${isoScene().replace('class="iso is-animating"', 'class="iso"')}</div>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Hanntec LinkedIn banner</title>
<style>
@font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/barlow-condensed-700.woff2") format("woff2"); font-weight: 700; }
@font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/barlow-condensed-600.woff2") format("woff2"); font-weight: 600; }
@font-face { font-family: "Instrument Sans"; src: url("${FONTS}/instrument-sans.woff2") format("woff2"); font-weight: 400 700; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1128px; height: 191px; overflow: hidden; background: #061833; }
.banner {
  position: relative; width: 1128px; height: 191px; overflow: hidden; color: #fff;
  background:
    radial-gradient(460px 280px at 84% 55%, rgba(30, 100, 210, .45), transparent 72%),
    radial-gradient(300px 200px at 22% 120%, rgba(200, 20, 47, .16), transparent 70%),
    #061833;
  font-family: "Instrument Sans", Arial, sans-serif;
}
.banner::before {
  content: ""; position: absolute; inset: 0; z-index: 1;
  background-image: linear-gradient(rgba(141,184,247,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(141,184,247,.06) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 25%, #000 55%, transparent 75%);
}
/* photo on the right, washed into the navy like the website hero */
.photo {
  position: absolute; top: 0; right: 0; bottom: 0; width: 680px;
  background: url("${PHOTO || ''}") 50% 30% / cover no-repeat;
}
.photo::after {
  content: ""; position: absolute; inset: 0;
  background:
    linear-gradient(90deg, #061833 0%, rgba(6, 24, 51, .9) 22%, rgba(6, 24, 51, .45) 52%, rgba(6, 24, 51, .18) 100%),
    linear-gradient(0deg, rgba(6, 24, 51, .35), rgba(6, 24, 51, 0) 45%);
}
/* line drawing (when no photo is given), clear of the logo LinkedIn places bottom-left */
.art { position: absolute; right: 18px; top: 4px; bottom: 4px; display: flex; align-items: center; }
.iso { display: block; height: 183px; width: auto; }
.iso .grid { stroke: #8DB8F7; stroke-opacity: .12; stroke-width: 1; fill: none; }
.iso .shape { stroke: #8DB8F7; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
.iso .shape.thin { stroke-width: 1.1; stroke-opacity: .75; }
.iso text, .iso .dim { display: none; }
/* copy sits centre-left: clear of the logo on desktop, inside the crop on phones */
.copy { position: absolute; z-index: 2; left: 288px; top: 31px; }
.title { font: 700 50px/0.95 "Barlow Condensed", sans-serif; letter-spacing: -.005em; text-shadow: 0 2px 18px rgba(6, 24, 51, .5); }
.phases { display: flex; list-style: none; margin-top: 22px; }
.phases li { position: relative; padding: 13px 26px 0 0; border-top: 2px solid rgba(141,184,247,.45); }
.phases li:last-child { padding-right: 0; }
.phases li::before {
  content: ""; position: absolute; left: 0; top: -6px; width: 10px; height: 10px; border-radius: 50%;
  background: #061833; border: 2px solid #8DB8F7;
}
.phases li.lead { border-top-color: #FF4B64; }
.phases li.lead::before { background: #FF4B64; border-color: #FF4B64; }
.phases b { display: block; font: 600 11px/1 "Instrument Sans", sans-serif; letter-spacing: .12em; color: #8DB8F7; }
.phases li.lead b { color: #FF8A9A; }
.phases span { display: block; margin-top: 5px; font: 600 21px/1 "Barlow Condensed", sans-serif; color: #fff; white-space: nowrap; }
.site { position: absolute; z-index: 2; right: 22px; bottom: 12px; font: 600 12px/1 "Instrument Sans", sans-serif; color: #fff; letter-spacing: .03em; text-shadow: 0 1px 8px rgba(6, 24, 51, .8); }
</style></head>
<body>
<div class="banner">
  ${visual}
  <div class="copy">
    <h1 class="title">Engineering, start to finish.</h1>
    <ol class="phases">
      ${phases.map(([n, label, lead]) => `<li${lead ? ' class="lead"' : ''}><b>${n}</b><span>${label}</span></li>`).join('\n      ')}
    </ol>
  </div>
  <p class="site">hanntec.com</p>
</div>
</body></html>`;

writeFileSync(`${OUT}/linkedin-banner.html`, html);
console.log('wrote', `${OUT}/linkedin-banner.html`);
