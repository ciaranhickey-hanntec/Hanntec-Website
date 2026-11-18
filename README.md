# Hanntec Engineering website (draft 2)

Plain HTML, CSS and a little JavaScript. No build step, no framework, and it can be hosted anywhere.
Open `index.html` in a browser to view it. If fonts look plain when opened by double-click, view it through any simple web server instead.

An earlier one-page draft is in `..\hanntec-website`. It has not been touched.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, services, process, sectors, before/after slider, rotating client-logo wheel, call to action |
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
| Before/after slider | Already added (`hero/before.jpg`, `hero/after.jpg`, 1900x980, each showing the whole building, with the fence line at the same height). To change it, replace both with photos framed the same way |
| Service tiles and service pages | Already added: `services/design.jpg`, `electrical.jpg`, `commissioning.jpg`, `mechanical.jpg` (swap for sharper or own photos any time) |
| Sector tiles and sector pages | Already added (7 photos in ``sectors/``, named after each sector). Swap for sharper or own photos any time |
| Team portraits (square, face centred) | `assets/img/team/jack-walshe.jpg`, `jackie-barden.jpg`, `niamh-kelly.jpg`, `aidan-armstrong.jpg`, `ciaran-hickey.jpg`, `niamh-walshe.jpg` |

Photos should be about 1600 px wide and under 400 KB each. Text sits on a dark fade at the bottom of each tile, so most photos work. Add descriptive `alt` text in the HTML when a real photo replaces a placeholder.

## Settings (top of `assets/js/site.js`)

- `formEndpoint`: paste a form service address (for example a Formspree form URL) so enquiries arrive in your inbox. While empty, the form opens the visitor's email app with the enquiry ready to send.
- `linkedin`: each team member's LinkedIn profile address. Until set, the button opens a LinkedIn search for their name.

## Draft notes

Yellow and grey notes on the pages mark things to finish. The **Draft notes** button (bottom left) hides them so you can see the page as visitors will. Add `?final` to any page address to start with them hidden. Before launch, delete the button from each page and remove the `.draft` elements.

## Before launch

- [ ] Company registration number (a public listing shows 592547, so confirm it on the CRO) and registered office
- [ ] Each person's LinkedIn profile link (the company link is already set)
- [ ] Real photos, team portraits and bios; confirm Jack's title (signatures say "Operations", the old site said "Co-founder and Operations Director")
- [ ] Client logos (13 on the home page wheel): confirm each company is happy to be shown
- [ ] "Certified by Safe Electric registered electricians" (services page): confirm it is still true
- [ ] Connect the contact form (`formEndpoint`) and send a test enquiry
- [ ] Privacy notice reviewed
- [ ] Decide what happens to the old site's Payment Portal and Terms & Conditions pages
- [ ] Hosting and domain: hanntec.com currently points at the old Squarespace site
- [ ] If Hanntec still installs security systems for clients, the Private Security Authority licence number must be shown wherever that work is advertised

## Design notes

- Dark hero with a drawing of a plant that draws itself in on load. Add `hero.jpg` or `hero.mp4` and it is replaced by your own media.
- Colours come from the logo: blue `#0B3A82` and red `#C8142F` (the logo red, brightened so it reads on dark). They are the first lines of `assets/css/styles.css`.
- The header is transparent over the dark hero and turns white once you scroll. `logo-on-dark.png` (red H, lighter blue wordmark) is used over dark areas and `logo.png` (original colours) over white.
- The red rounded square on inner page headers and team portraits echoes the boxed H in the logo.
- Fonts are Barlow Condensed (headlines) and Instrument Sans (body), both open licence, stored in `assets/fonts/`, so no Google Fonts requests are made.
- The before/after slider is full width and uses two photos that each show the whole building, lined up on the fence line, with a soft blended edge and an eased divider.
- `logo.png` is the supplied logo with a transparent background. The original is only 446 px wide, so a larger file or SVG would be sharper.
