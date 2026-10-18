# Nimbus Moonwhisper — The Midnight Observatory

> *“Good dreams start small.”*

Welcome to **The Midnight Observatory**, an enchanting, cozy, and interactive character portfolio website handcrafted for the haX.baby “Baby’s First Website” hackathon.

The website follows **Nimbus Moonwhisper**, a gentle, curious, sleepy, and imaginative tiny cloud spirit who serves as the sky's resident **Junior Dream Astronomer**. Above the fluffy clouds, Nimbus collects quiet wishes, maps dream routes, weaves celestial lullabies, and ensures every wandering dreamer finds their way home.

---

## 🌟 Overview

The Midnight Observatory is built as a complete, multi-page, responsive web experience. It blends charming storybook aesthetics with modern frontend craftsmanship: transparent 3D character illustrations, synchronized audio players, ambient starfields, and client-side page routing that allows visitors to explore different pages without ever interrupting the soothing background lullaby.

---

## ✨ Features

- **Multi-Page Architecture with Fixed Navigation:**
  - **Home (`index.html`):** The grand observatory entrance featuring Nimbus's floating character stage, wish collector, live observatory telemetry console, atmosphere previews, and interactive secret compass easter egg.
  - **About Nimbus (`about.html`):** Official character dossier, field journal observation cards, personality profile (curious, sleepy, gentle, forgetful), equipment breakdown, and the legendary star-sneezing lore.
  - **Projects Workbench (`projects.html`):** Three distinct functional starlight experiments:
    1. **StarSong Radio & Lullaby Box:** Pocket celestial music box playing the mountain lullaby with real-time waveform visualizer, dynamic timers, interactive scrubber progress bar, and replay controls.
    2. **Midnight Lantern & Moonlight Bottles:** Interactive luminescence experiment with toggleable lamp states and four glowing color palettes (Stardust Gold, Nebula Mint, Twilight Lavender, Comet Rose).
    3. **Dream Delivery Map:** Multi-stop celestial route simulator tracing starlight journeys from Sleepy Bay across Crescent Moon to Home.
  - **Story (`story.html`):** Nimbus’s origin chronicle told across three illustrated chapters (*A Little Cloud*, *The Lost Star*, and *Building the Observatory*).
  - **Owner Profile (`owner.html`):** Dedicated creator profile introducing student developer **Diganta Mukherjee** with a circular portrait, personal bio, 8 skill badges, and social profiles.

- **Persistent Lullaby Playback Across Navigation:**
  - Features an authoritative singleton audio engine (`PersistentLullabyPlayer`) and a seamless client-side page router (`PageRouter`).
  - Visitors can navigate freely between Home, About, Projects, Story, and Owner without the lullaby stopping or restarting.
  - Fully synchronized with the global navbar button (`▶️ Lullaby` / `⏸️ Playing` / `🔄 Replay`).

- **Day & Dream Mode Theme Engine:**
  - **Day Mode:** Soft cream skies, warm peach stardust, and pastel cloud observatory backdrops.
  - **Dream Mode:** Deep midnight sky, glowing crescent moon, constellations, and celestial silhouettes.
  - Synchronized across all 5 pages via `localStorage` with zero visual flash on page loads.

- **Independent UI Sound Effects (Celestial Chimes):**
  - Muted by default (`Chimes Off`), independent from the lullaby music player.
  - Synthesized in real time using the native browser **Web Audio API** (soft pentatonic sine-wave chime bells).

- **Accessibility & Motion Design:**
  - High-contrast typography with frosted-glass card backdrops (`backdrop-filter: blur(8px)`).
  - Screen reader live announcer (`aria-live="polite"`), skip-to-content links, semantic HTML5 landmarks, and full keyboard navigation support.
  - Respects user preference for reduced motion (`prefers-reduced-motion`).

---

## 🛠️ Tech Stack

- **Markup:** Semantic HTML5 (accessible landmarks, dialog modals, forms, ARIA attributes).
- **Styling:** Vanilla CSS3 (Custom Properties / CSS Variables, Flexbox, CSS Grid, Fluid Typography with `clamp()`, SVG drop-shadow filters).
- **Interactivity & State:** Modern Vanilla JavaScript (ES2022, `fetch` + `DOMParser` PJAX page routing, `Audio` singleton, Web Audio API synthesizers).
- **Typography:** DM Serif Display & Fredoka (via Google Fonts with clean system fallbacks).
- **Icons & Graphics:** Inline Scalable Vector Graphics (SVG) and transparent PNG assets.

---

## 📁 Project Structure

```text
babyweb/
├── index.html               # Main entrance, hero character stage, live telemetry & previews
├── about.html               # Nimbus character dossier, personality traits & equipment
├── projects.html            # StarSong Radio, Midnight Lantern & Dream Delivery Map
├── story.html               # Origin story illustrated in three scrollable chapters
├── owner.html               # Owner profile page for Diganta Mukherjee
├── style.css                # Master stylesheet: theme variables, components, animations
├── script.js                # Core controller: audio engine, page router, theme & interactions
├── .gitattributes           # Git line-ending normalization rules
├── .gitignore               # Ignored system, temporary, and editor files
├── README.md                # Project documentation and guide
├── assets/
│   ├── favicon.svg          # Custom crescent moon and star vector favicon
│   └── images/              # Web-optimized assets
│       ├── nimbus-character.png    # Transparent 3D Nimbus character illustration
│       ├── observatory-light.png   # Daytime observatory backdrop
│       ├── observatory-dark.png    # Nighttime observatory backdrop
│       ├── lullaby-box.png         # StarSong Radio & Lullaby Box artwork
│       ├── midnight-lantern.png    # Midnight Lantern artwork
│       └── owner.jpg               # Circular profile photo of Diganta Mukherjee
├── photos/                  # High-resolution original source photography & artwork
│   ├── avatar.png           # Transparent character portrait (1024x1536 RGBA)
│   ├── light mode.png       # Original daytime observatory illustration
│   ├── dark mode.png        # Original nighttime observatory illustration
│   ├── box.png              # Original lullaby box illustration
│   ├── lantern.png          # Original lantern illustration
│   └── owner.jpg            # Original photo of Diganta Mukherjee
└── audio/
    └── the_mountain-lullaby-lullaby-music-576578.mp3  # Mountain lullaby audio track
```

---

## 🚀 Run Locally

The website is built with vanilla web technologies and requires no heavy build tools, compilers, or package managers to run.

### Option 1: Using Any Local Static Web Server (Recommended)

Running through a local web server allows seamless `fetch`-based page transitions and audio persistence without browser local-file CORS restrictions:

#### With Node.js:
```bash
# Using npx serve
npx serve .

# Or using http-server
npx http-server . -p 8080
```

#### With Python 3:
```bash
python -m http.server 8080
```

Then open your browser at `http://localhost:8080`.

### Option 2: Direct Browser Opening

You can also double-click `index.html` to open the website directly in any modern browser (Chrome, Edge, Firefox, Safari). If client-side `fetch` is restricted by your browser for `file://` URLs, the built-in router automatically falls back to standard page navigation so the website remains fully browsable!

---

## 🎵 Assets and Audio

- **Character Artwork & Backgrounds:** Located in `assets/images/` and `photos/`. All images use clean transparency and responsive `object-fit: contain` and `object-fit: cover` rules to adapt to any screen size.
- **Lullaby Track:** The soothing mountain lullaby is located at `audio/the_mountain-lullaby-lullaby-music-576578.mp3`. It is loaded on demand when the user presses Play and pauses politely without unexpected autoplay.

---

## 🌐 Deployment (GitHub Pages)

The website is 100% static and ready for instant zero-config deployment on **GitHub Pages**:

1. Push this repository to GitHub: `https://github.com/digantamukherjee-19/Nimbus.git`.
2. In your repository on GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and root `/` folder, then click **Save**.
5. GitHub Pages will build and deploy the site at:
   ```text
   https://digantamukherjee-19.github.io/Nimbus/
   ```

### Base-Path Compatibility
All asset references, stylesheet links, script tags, and internal hyperlinks use strictly **repository-relative paths** (`photos/...`, `assets/...`, `about.html`, etc.). This ensures that the entire website, its images, audio, and client-side page router function with 100% fidelity both at custom domain roots (`/`) and project sub-paths (`/Nimbus/`).

---

## 👤 Author

**Diganta Mukherjee**  
CSE Undergraduate Student · Creator & Developer

- **GitHub:** [@digantamukherjee-19](https://github.com/digantamukherjee-19)
- **LinkedIn:** [Diganta Mukherjee](https://www.linkedin.com/in/diganta-mukherjee-271268412?utm_source=share_via&utm_content=profile&utm_medium=member_android)

---

## 📄 License

*No formal license has been specified yet.*

---

## 🙏 Acknowledgements

- **haX.baby:** Inspiration and prompt for the "Baby's First Website" Hackathon 2026.
- **Google Fonts:** For the beautiful typefaces *DM Serif Display*, *Fredoka*, and *JetBrains Mono*.
- **The Mountain:** For the peaceful acoustic mountain lullaby audio track.
