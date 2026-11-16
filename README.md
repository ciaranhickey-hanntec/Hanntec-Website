# Hanntec Engineering website (draft 2)

Plain HTML, CSS and a little JavaScript. No build step, no framework, and it can be hosted anywhere.
Open `index.html` in a browser to view it. If fonts look plain when opened by double-click, view it through any simple web server instead.

An earlier one-page draft is in `..\hanntec-website`. It has not been touched.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, services, process, sectors, before/after slider, recent work, client logos, call to action |
| `about.html` | About, **Meet the team** (`#team`), **Core values** (`#values`) |
| `services.html` | Design, Electrical installation & implementation, Commissioning, Mechanical installation & process engineering |
| `sectors.html` | Food & beverage, Agriculture, Construction, Energy/power/renewables, Life sciences, Hospitality, Healthcare |
| `contact.html` | Enquiry form and contact details |
| `privacy.html` | Draft privacy notice (have it reviewed before launch) |

The header and footer are repeated in each page, so change them in all six.

## Adding your own photos and video

Every photo slot shows a blueprint-style placeholder until a file with the right name is dropped in. No code changes needed.

| Slot | Put the file here |
| --- | --- |
| Hero photo (replaces the drawing) | `assets/img/hero/hero.jpg` (wide, about 2400 px) |
| Hero video (replaces the drawing) | `assets/video/hero.mp4` (short, silent, looping, under 8 MB) |
| Before/after slider | `assets/img/hero/before.jpg`, `assets/img/hero/after.jpg` (4:3, same framing for both) |
| Service tiles and service pages | `assets/img/services/design.jpg`, `electrical.jpg`, `commissioning.jpg`, `mechanical.jpg` |
| Sector tiles and sector pages | `assets/img/sectors/food-beverage.jpg`, `agriculture.jpg`, `construction.jpg`, `energy.jpg`, `life-sciences.jpg`, `hospitality.jpg`, `healthcare.jpg` |
| Team portraits (square, face centred) | `assets/img/team/jack-walshe.jpg`, `jackie-barden.jpg`, `niamh-kelly.jpg`, `aidan-armstrong.jpg`, `ciaran-hickey.jpg`, `niamh-walshe.jpg` |
| Home page project cards | `assets/img/projects/project-1.jpg`, `project-2.jpg`, `project-3.jpg` |
| Client logos | `assets/img/clients/client-1.png` to `client-6.png` (transparent PNGs) |

Photos should be about 1600 px wide and under 400 KB each. Text sits on a dark fade at the bottom of each tile, so most photos work. Add descriptive `alt` text in the HTML when a real photo replaces a placeholder.

## Settings (top of `assets/js/site.js`)

- `formEndpoint`: paste a form service address (for example a Formspree form URL) so enquiries arrive in your inbox. While empty, the form opens the visitor's email app with the enquiry ready to send.
- `linkedin`: each team member's LinkedIn profile address. Until set, the button opens a LinkedIn search for their name.

## Draft notes

Yellow and grey notes on the pages mark things to finish. The **Draft notes** button (bottom left) hides them so you can see the page as visitors will. Add `?final` to any page address to start with them hidden. Before launch, delete the button from each page and remove the `.draft` elements.

## Before launch

- [ ] Company registration number (a public listing shows 592547, so confirm it on the CRO) and registered office
- [ ] LinkedIn company page link (footer) and each person's profile link
- [ ] Confirm address and phone numbers (new office in Kilmacthomas?)
- [ ] Real photos, team portraits and bios; confirm Jack's title (signatures say "Operations", the old site said "Co-founder and Operations Director")
- [ ] Project cards: confirm the three descriptions, then add client names and logos only with permission
- [ ] "Certified by Safe Electric registered electricians" (services page): confirm it is still true
- [ ] Connect the contact form (`formEndpoint`) and send a test enquiry
- [ ] Privacy notice reviewed
- [ ] Decide what happens to the old site's Payment Portal and Terms & Conditions pages
- [ ] Hosting and domain: hanntec.com currently points at the old Squarespace site
- [ ] If Hanntec still installs security systems for clients, the Private Security Authority licence number must be shown wherever that work is advertised

## Design notes

- Dark hero with a drawing of a plant that draws itself in on load. Add `hero.jpg` or `hero.mp4` and it is replaced by your own media.
- Colours come from the logo: blue `#0B3A82` and red `#C8142F` (the logo red, brightened so it reads on dark). They are the first lines of `assets/css/styles.css`.
- The header is transparent over the dark hero and turns white once you scroll. `logo-white.png` is used over dark areas and `logo.png` over white.
- The red rounded square on inner page headers and team portraits echoes the boxed H in the logo.
- Fonts are Barlow Condensed (headlines) and Instrument Sans (body), both open licence, stored in `assets/fonts/`, so no Google Fonts requests are made.
- The before/after slider artwork is the same plant as the hero, drawn two ways, so the "drawing" and "built" sides match.
- `logo.png` is the supplied logo with a transparent background. The original is only 446 px wide, so a larger file or SVG would be sharper.
