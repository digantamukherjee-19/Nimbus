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

## 🚀 Implemented Features

### 1. Character Introduction & Interactive Stage
- **Meet Nimbus Hero Section:** Eyebrow star log coordinates, bold headline, storybook intro, and primary CTAs.
- **Interactive Character Stage:** Scalable vector character art with gentle floating physics, orbital starlight rings, status chips, and subtle cursor parallax tracking on desktop.
- **"Make a tiny Wish" Action:** Spawns animated floating wish stars within the observatory, increments the live telemetry counter, and plays a synthesized chime.

### 2. Three Distinct Portfolio Projects
1. **Project 001 — Starsong Radio:**
   - A pocket-sized music box synthesized entirely with the **Web Audio API**.
   - Plays a calming 8-note pentatonic lullaby with gentle attack/decay envelopes.
   - Synchronized CSS sound wave visualizer bars and broadcast status indicator.
   - Respects the global audio toggle and never autoplays.
2. **Project 002 — Moonlight Bottles:**
   - Vintage apothecary jar capturing bottled moonlight for dark and wobbly nights.
   - Interactive cork toggle between glowing and sleeping states.
   - 4 selectable starlight hues: *Moon Gold*, *Star Blush*, *Dream Lavender*, and *Mint Glow*.
   - Includes full textual state readouts for colorblind accessibility.
3. **Project 003 — Dream Delivery Map:**
   - SVG constellation sky chart connecting **Cloud Bay → Little Moon → Home**.
   - Animated shooting star travels the flight path with step-by-step waypoint activations.
   - Updates observatory telemetry deliveries upon arrival.
   - Accessible reduced-motion fallback for instant comfort.

### 3. Origin Story — Interactive Scroll Chapters
- Three storybook scenes under 150 words each:
  - *Chapter 01: A Tiny Beginning*
  - *Chapter 02: The First Wish*
  - *Chapter 03: The Observatory*
- Gentle reveal animations triggered via `IntersectionObserver`.

### 4. Field Journal Character Sheet
- Three field-note cards detailing Nimbus’s identity, duties, and quirks.
- Interactive **“Tell Nimbus a happy story”** button that makes Nimbus sneeze a sparkling star with a cheerful sound effect!

### 5. Day Mode & Dream Mode Themes
- Built with CSS Custom Properties adhering to the hackathon design system:
  - **Day Mode:** Warm cream (`#fff8f1`), rich berry (`#a34063`), cocoa brown (`#5c4033`), soft blush (`#f5dce4`), and moon gold (`#e7bf70`).
  - **Dream Mode:** Deep midnight purple (`#201c34`), elevated card panel (`#302941`), soft lavender (`#44304e`), and moonlight accents (`#f4c7dc`).
- Persists user selection in `localStorage` with system dark-mode detection fallback.

### 6. Centralized Web Audio Sound System
- Default state: **Muted** (as required for web accessibility).
- Accessible Sound Toggle button in the sticky navigation header.
- Synthesized tones (sine-wave chimes, sparkly arpeggios, and lullaby).
- Clean oscillator garbage collection with zero memory leaks.

### 7. Hidden Easter Egg — Nimbus's Secret
- Discover a tiny glittering star in the hero constellation.
- Tapping the star 5 times reveals Nimbus’s secret message:
  > *“Even your smallest wish matters. Keep looking up. ♡”*
- Accompanied by a celebratory fanfare and cascading stardust.
- Fully keyboard-accessible dialog with `Escape` key dismissal.

### 8. The Starry Wall & Guestbook
- Local persistent wish wall where stargazers can whisper their name and a wish.
- Features quick prompt inspiration pills (*"Peaceful sleep"*, *"Gentle courage"*, *"Warm tea"*).
- Pre-seeded with cozy messages from animal friends (Pip the Field Mouse, Stella the Night Owl).
- Robust HTML escaping to prevent XSS injection.

### 9. Throttled Desktop Cursor Trail
- Starlight particles trail the cursor on desktop mice.
- Throttled to ~45ms, strictly limited to 20 concurrent particles, and promptly removed.
- Automatically disabled on touch devices and for visitors who prefer reduced motion.

---

## 🛠️ Technology Stack

- **HTML5:** Semantic landmark architecture (`header`, `main`, `section`, `nav`, `footer`), ARIA live regions, skip links.
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, responsive typography via `clamp()`, keyframe animations, `@media (prefers-reduced-motion: reduce)`.
- **Vanilla JavaScript (ES6+):** Zero external runtime dependencies. Native Web Audio API, IntersectionObserver, and LocalStorage.
- **Scalable Vector Graphics (SVG):** 100% custom vector illustrations crafted specifically for this project (crisp at all screen scales and 0% risk of broken image paths).

---

## 📂 Project Structure

```
/
├── index.html                   # Master semantic webpage
├── style.css                    # Design system, themes & animations
├── script.js                    # Web Audio, interactions & state manager
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

Because this project is built entirely with standard web technologies, you do not need to install complex build tools or large node_modules.

### Option 1: Direct File Open
Simply double-click `index.html` in your file explorer to open it in any modern browser.

### Option 2: Using Node.js (Recommended for full Web Audio / LocalStorage experience)
Run a local static server from the project directory:

```bash
# Using Node's built-in npx
npx serve .
# or
npx http-server -p 8080
```
Open `http://localhost:8080` in your browser.

---

## ☁️ Deployment Instructions

The site is ready for static deployment on any modern hosting provider:

### Deploying to GitHub Pages
1. Push this repository to GitHub.
2. In your repository, go to **Settings** → **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live within seconds!

### Deploying to Vercel
```bash
npx vercel
```
Or import the repository directly in the Vercel dashboard as an "Other" / static project.

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
