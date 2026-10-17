# Nimbus Moonwhisper — The Midnight Observatory ☁️✨

> *“Good dreams start small.”*

A cozy, nostalgic character portfolio and interactive web experience created for the **“Baby’s First Website” Hackathon by haX.baby**.

Visit the observatory above the clouds to explore interactive starlight experiments, read field notes from a sleepy cloud astronomer, and whisper your own wish into the constellation sky.

---

## 🌟 The Character: Nimbus Moonwhisper

- **Species:** Tiny Cloud Spirit
- **Occupation:** Junior Dream Astronomer
- **Field Base:** The Midnight Observatory *(RA 19h 50m / DEC +08°52')*
- **Personality:** Gentle, curious, sleepy, imaginative, and kind.
- **Loves:** Collecting whispers and wishes, charting new constellations, and drinking warm chamomile dew.
- **Habits:** Frequently forgets where they left their miniature brass telescope.
- **Odd Quirk:** Sneezes a tiny sparkling star whenever someone tells them a happy story!

### Core Story
Nimbus was born on the quietest cloud in the sky. One evening, a little lost star asked for help finding its family. By connecting the stars into a constellation, Nimbus guided the star safely home. Inspired by this journey, Nimbus built a tiny observatory above the clouds to collect wishes, map dream delivery routes, compose soothing lullabies, and leave a warm light on for every sleepy traveler.

---

## 🧭 Multi-Page Architecture & Navigation

The website features an independent multi-page layout with a **permanently fixed navbar** that stays anchored at the top of the viewport across all pages. Each navigation option loads a dedicated, self-contained HTML page:

1. **Home (`index.html`):**
   - The main hero section with Nimbus's interactive character illustration.
   - Welcome message and introduction to the Midnight Observatory.
   - Primary calls to action: *“Meet Nimbus”*, *“Explore Projects”*, and *“Read the Story”*.
   - Observatory at a glance preview cards linking to the other pages.
   - Live telemetry status console and hidden Easter egg star.
2. **About Nimbus (`about.html`):**
   - Nimbus's complete character dossier and field journal.
   - Personality traits: curious, sleepy, gentle, and forgetful.
   - Three field-note observation cards with the interactive *"Tell Nimbus a happy story"* star-sneeze button.
   - Astronomer's pocket toolkit (brass telescope, starlight logbook, chamber of wishes).
3. **Projects (`projects.html`):**
   - Three interactive project showcases:
     - **Project 001 — Starsong Radio:** Web Audio API pocket lullaby synthesizer with animated sound wave visualizer bars.
     - **Project 002 — Moonlight Bottles:** Glowing apothecary jar with clickable cork on/off toggle and 4 selectable hue swatches (*Moon Gold*, *Star Blush*, *Dream Lavender*, *Mint Glow*).
     - **Project 003 — Dream Delivery Map:** SVG constellation sky chart (*Cloud Bay → Little Moon → Home*) with shooting star route animation and waypoint announcements.
4. **Story (`story.html`):**
   - Nimbus's origin story told across three quiet storybook scenes:
     - *Chapter 01: A Little Cloud*
     - *Chapter 02: The Lost Star*
     - *Chapter 03: The Midnight Observatory*
   - Illustrated scenes, constellation coordinates, and gentle animations.
   - The Starry Wish Wall & Guestbook with quick inspiration prompts and pre-seeded notes.

---

## 📌 Permanently Fixed Navbar Features

- **Fixed Viewport Lock:** Anchored at the top using `position: fixed; top: 0; left: 0; right: 0; z-index: 1000;`.
- **Content Clearance:** Added `padding-top: var(--header-height);` on `body` to ensure the navbar never obscures headings, buttons, or illustrations.
- **Active Page Highlight:** Highlights the current page with a distinct blush pill, berry font color, and bottom border indicator (`is-active` and `aria-current="page"`).
- **Click-Only Navigation:** Navigation changes only occur when explicitly clicking a link. Scrolling up or down never reveals another page.
- **Compact Desktop Controls:** Day/Dream theme toggle and Sound On/Off toggle are positioned as compact, circular icon buttons on desktop, expanding into labeled buttons in the mobile drawer.
- **Mobile Responsive Hamburger:** Collapsible drawer that automatically closes upon link selection or `Escape` key press.

---

## 🛠️ Technology Stack

- **HTML5:** 4 independent semantic pages (`index.html`, `about.html`, `projects.html`, `story.html`), ARIA live regions, skip links.
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, responsive typography via `clamp()`, fixed header lock, `@media (prefers-reduced-motion: reduce)`.
- **Vanilla JavaScript (ES6+):** Multi-page null-safe state manager, native **Web Audio API** synthesizer, `localStorage` persistence for themes, sound settings, and telemetry.
- **Scalable Vector Graphics (SVG):** 100% custom vector illustrations crafted specifically for this project (crisp at all screen scales with 0% risk of broken images).

---

## 📂 Project Structure

```text
/
├── index.html                   # Home page & Observatory preview
├── about.html                   # About Nimbus & Field Journal
├── projects.html                # 3 Interactive Starlight Experiments
├── story.html                   # Origin Story & Starry Wish Wall
├── style.css                    # Shared design system, fixed header & themes
├── script.js                    # Shared Web Audio & multi-page state manager
├── README.md                    # Project documentation & biography
└── assets/
    ├── favicon.svg              # Nimbus sleeping cloud favicon
    ├── nimbus-character.svg     # Full hero illustration of Nimbus
    ├── moonlight-bottle.svg     # Project 002 apothecary bottle art
    ├── starsong-radio.svg       # Project 001 vintage music box art
    └── observatory-dome.svg     # Chapter 03 Observatory dome art
```

---

## 💻 How to Run Locally

Because this project is built entirely with standard web technologies, you do not need to install complex build tools.

### Option 1: Direct File Open
Double-click `index.html` in your file explorer to open it in any modern browser.

### Option 2: Using Node.js (Recommended for full Web Audio / LocalStorage experience)
Run a local static server from the project directory:

```bash
# Using Node's built-in npx
npx serve .
# or
npx http-server -p 8080
```
Then navigate to `http://localhost:8080` in your browser.

---

## ☁️ Deployment Instructions

The site is ready for static deployment on any hosting provider:

### Deploying to GitHub Pages
1. Push this repository to GitHub.
2. In your repository, go to **Settings** → **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live within seconds!

### Deploying to Vercel
```bash
npx vercel
```
Or import the repository directly in the Vercel dashboard as a static website.

---

## ♿ Accessibility & Performance Auditing

- **Keyboard Navigable:** Every interactive element (theme toggle, sound toggle, project buttons, color swatches, secret star, and guestbook) is accessible via `Tab`, `Enter`, and `Space`.
- **High Contrast Focus Rings:** Distinct 3px outlines with adequate offset.
- **Reduced Motion Support:** Respects `prefers-reduced-motion: reduce` by halting animations, star drifting, and cursor trails.
- **WCAG AA Contrast Compliant:** Tested across both Day Mode and Dream Mode color palettes.
- **Zero Console Errors:** Clean startup with friendly observatory log message.

---

## 📜 Credits & License

- Designed and coded with love for the **haX.baby Hackathon 2026**.
- Dedicated to stargazers, sleepy spirits, and everyone whose good dreams start small.
- MIT License.
