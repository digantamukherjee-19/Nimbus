/**
 * NIMBUS MOONWHISPER — THE MIDNIGHT OBSERVATORY
 * Master Interactive Controller & Persistent Audio Engine
 *
 * Multi-page friendly, accessible, responsive, and cozy.
 * Features:
 * - Persistent Lullaby Player (plays actual MP3 across page navigation)
 * - Seamless Page Router (PJAX / history.pushState navigation keeping audio alive)
 * - Synchronized Global Navbar & Lullaby Box controls
 * - Real-time progress bar with seeking and replay
 * - Independent sound-effects engine (Web Audio chimes for UI only)
 * - Shared Light & Dark Observatory themes with zero flash
 */

'use strict';

(function () {
  // =========================================================================
  // 1. GLOBAL STATE
  // =========================================================================

  const state = {
    theme: 'day', // 'day' | 'dream'
    soundEnabled: false, // UI sound effects (chimes) only
    starsMapped: 128,
    dreamDeliveries: 7,
    bottleLit: true,
    bottleColor: 'gold',
    easterEggTaps: 0,
    easterEggMaxTaps: 5,
    isDeliveringDream: false,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // DOM Elements dictionary
  const DOM = {
    // Shell elements (permanent across navigation)
    body: document.body,
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeLabel: document.getElementById('theme-label'),

    globalLullabyBtn: document.getElementById('global-lullaby-btn'),
    globalLullabyIcon: document.getElementById('global-lullaby-icon'),
    globalLullabyLabel: document.getElementById('global-lullaby-label'),
    globalMusicPulse: document.getElementById('global-music-pulse'),

    soundToggle: document.getElementById('sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    soundLabel: document.getElementById('sound-label'),

    navToggle: document.getElementById('nav-toggle'),
    siteNav: document.getElementById('site-nav'),
    navLinks: document.querySelectorAll('.site-nav .nav-link'),

    toastShelf: document.getElementById('toast-shelf'),
    liveAnnouncer: document.getElementById('live-announcer'),
    ambientStarfield: document.getElementById('ambient-starfield'),

    // Page-specific elements (refreshed on each page load/navigation)
    mainContent: document.getElementById('main-content'),
    heroWishBtn: null,
    heroWishLayer: null,
    heroStage: null,
    characterWrapper: null,
    tellStoryBtn: null,

    // Project 001: Starsong Radio & Lullaby Box
    projectStarsong: null,
    toggleLullabyBtn: null,
    replayLullabyBtn: null,
    lullabyBtnIcon: null,
    lullabyBtnLabel: null,
    lullabyTimeCurrent: null,
    lullabyTimeDuration: null,
    lullabyProgressContainer: null,
    lullabyProgressFill: null,
    lullabyProgressThumb: null,
    radioStatusDot: null,
    radioStatusText: null,

    // Project 002: Midnight Lantern & Moonlight Bottles
    bottleStage: null,
    toggleBottleBtn: null,
    bottleBtnIcon: null,
    bottleBtnLabel: null,
    bottleStatusDot: null,
    bottleStatusText: null,
    paletteSwatches: [],

    // Project 003: Dream Delivery Map
    sendDreamBtn: null,
    travelingStar: null,
    stepBay: null,
    stepMoon: null,
    stepHome: null,
    mapStatusDot: null,
    mapStatusText: null,

    // Status Deck
    statStarsMapped: null,
    statDreamDeliveries: null,

    // Guestbook & Wishes
    wishForm: null,
    wishAuthorInput: null,
    wishTextInput: null,
    charCounter: null,
    wishesList: null,
    wishCountPill: null,
    quickPromptBtns: [],

    // Easter Egg
    easterEggStar: null,
    easterModal: null,
    easterBackdrop: null,
    easterCloseBtn: null,
    easterDismissBtn: null,

    btnBackToTop: null
  };

  /**
   * Queries and caches page-specific DOM elements within <main id="main-content">
   */
  function queryPageDOM() {
    DOM.mainContent = document.getElementById('main-content');

    // Hero
    DOM.heroWishBtn = document.getElementById('btn-hero-wish');
    DOM.heroWishLayer = document.getElementById('hero-wish-layer');
    DOM.heroStage = document.getElementById('hero-stage');
    DOM.characterWrapper = document.getElementById('character-wrapper');
    DOM.tellStoryBtn = document.getElementById('btn-tell-story');

    // Project 001: Lullaby Box
    DOM.projectStarsong = document.getElementById('project-starsong');
    DOM.toggleLullabyBtn = document.getElementById('btn-toggle-lullaby');
    DOM.replayLullabyBtn = document.getElementById('btn-replay-lullaby');
    DOM.lullabyBtnIcon = document.getElementById('lullaby-btn-icon');
    DOM.lullabyBtnLabel = document.getElementById('lullaby-btn-label');
    DOM.lullabyTimeCurrent = document.getElementById('lullaby-time-current');
    DOM.lullabyTimeDuration = document.getElementById('lullaby-time-duration');
    DOM.lullabyProgressContainer = document.getElementById('lullaby-progress-container');
    DOM.lullabyProgressFill = document.getElementById('lullaby-progress-fill');
    DOM.lullabyProgressThumb = document.getElementById('lullaby-progress-thumb');
    DOM.radioStatusDot = document.getElementById('radio-status-dot');
    DOM.radioStatusText = document.getElementById('radio-status-text');

    // Project 002: Midnight Lantern
    DOM.bottleStage = document.getElementById('bottle-stage');
    DOM.toggleBottleBtn = document.getElementById('btn-toggle-bottle');
    DOM.bottleBtnIcon = document.getElementById('bottle-btn-icon');
    DOM.bottleBtnLabel = document.getElementById('bottle-btn-label');
    DOM.bottleStatusDot = document.getElementById('bottle-status-dot');
    DOM.bottleStatusText = document.getElementById('bottle-status-text');
    DOM.paletteSwatches = document.querySelectorAll('.palette-swatch');

    // Project 003: Dream Delivery Map
    DOM.sendDreamBtn = document.getElementById('btn-send-dream');
    DOM.travelingStar = document.getElementById('traveling-star');
    DOM.stepBay = document.getElementById('step-bay');
    DOM.stepMoon = document.getElementById('step-moon');
    DOM.stepHome = document.getElementById('step-home');
    DOM.mapStatusDot = document.getElementById('map-status-dot');
    DOM.mapStatusText = document.getElementById('map-status-text');

    // Status Deck
    DOM.statStarsMapped = document.getElementById('stat-stars-mapped');
    DOM.statDreamDeliveries = document.getElementById('stat-dream-deliveries');

    // Guestbook & Wishes
    DOM.wishForm = document.getElementById('wish-form');
    DOM.wishAuthorInput = document.getElementById('wish-author');
    DOM.wishTextInput = document.getElementById('wish-text');
    DOM.charCounter = document.getElementById('char-counter');
    DOM.wishesList = document.getElementById('wishes-list');
    DOM.wishCountPill = document.getElementById('wish-count-pill');
    DOM.quickPromptBtns = document.querySelectorAll('.btn-prompt');

    // Easter Egg
    DOM.easterEggStar = document.getElementById('easter-egg-star');
    DOM.easterModal = document.getElementById('easter-modal');
    DOM.easterBackdrop = document.getElementById('easter-backdrop');
    DOM.easterCloseBtn = document.getElementById('easter-close-btn');
    DOM.easterDismissBtn = document.getElementById('easter-dismiss-btn');

    DOM.btnBackToTop = document.getElementById('btn-back-to-top');
    DOM.navLinks = document.querySelectorAll('.site-nav .nav-link');
  }

  // =========================================================================
  // 2. PERSISTENT LULLABY AUDIO CONTROLLER (SINGLE SHARED INSTANCE)
  // =========================================================================

  class PersistentLullabyPlayer {
    constructor() {
      // Connect to user's actual audio file from audio/
      this.audioSrc = 'audio/the_mountain-lullaby-lullaby-music-576578.mp3';
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.src = this.audioSrc;
      this.listeners = new Set();
      this.hasError = false;

      this.audio.addEventListener('loadedmetadata', () => {
        this.notify();
      });

      this.audio.addEventListener('timeupdate', () => {
        this.notify();
      });

      this.audio.addEventListener('play', () => {
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.notify();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Lullaby audio track notice:', e);
        this.hasError = true;
        this.notify();
      });
    }

    get isPlaying() {
      return !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0;
    }

    get currentTime() {
      return this.audio.currentTime || 0;
    }

    get duration() {
      return this.audio.duration || 0;
    }

    get progress() {
      if (!this.duration) return 0;
      return Math.min(100, Math.max(0, (this.currentTime / this.duration) * 100));
    }

    get isEnded() {
      return this.audio.ended;
    }

    play() {
      if (this.isEnded) {
        this.audio.currentTime = 0;
      }
      return this.audio.play().catch((err) => {
        console.warn('Playback gesture or source notice:', err);
      });
    }

    pause() {
      this.audio.pause();
    }

    toggle() {
      if (this.isPlaying) {
        this.pause();
        showToast('Lullaby resting until next bedtime. 🌙', '🌙');
      } else {
        this.play();
        showToast('Playing your lullaby... Listen closely. 🎵', '🎶');
      }
    }

    replay() {
      this.audio.currentTime = 0;
      this.play();
      showToast('Replaying the mountain lullaby from the start! 🎵', '🔄');
    }

    seek(ratio) {
      if (this.duration) {
        this.audio.currentTime = Math.max(0, Math.min(this.duration, ratio * this.duration));
        this.notify();
      }
    }

    subscribe(callback) {
      this.listeners.add(callback);
      callback(this.getState());
      return () => this.listeners.delete(callback);
    }

    notify() {
      const stateData = this.getState();
      this.listeners.forEach((cb) => {
        try {
          cb(stateData);
        } catch (e) {
          console.error(e);
        }
      });
    }

    getState() {
      return {
        isPlaying: this.isPlaying,
        currentTime: this.currentTime,
        duration: this.duration,
        progress: this.progress,
        isEnded: this.isEnded,
        hasError: this.hasError,
        formattedCurrent: formatTime(this.currentTime),
        formattedDuration: this.duration ? formatTime(this.duration) : '--:--'
      };
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Authoritative single player instance that lives throughout user session
  const lullabyPlayer = new PersistentLullabyPlayer();

  // =========================================================================
  // 3. SEPARATE SOUND-EFFECTS SYNTHESIZER (WEB AUDIO CHIMES)
  // =========================================================================

  class CelestialAudio {
    constructor() {
      this.ctx = null;
      this.activeOscillators = [];
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.3, volume = 0.12, when = 0) {
      if (!state.soundEnabled || !this.ctx) return null;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + when);

        const startTime = this.ctx.currentTime + when;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);

        this.activeOscillators.push(osc);
        osc.onended = () => {
          const idx = this.activeOscillators.indexOf(osc);
          if (idx !== -1) this.activeOscillators.splice(idx, 1);
        };

        return osc;
      } catch (err) {
        return null;
      }
    }

    playChime() {
      if (!state.soundEnabled) return;
      this.init();
      // Two-tone celestial bell: E5 (659Hz) -> B5 (987Hz)
      this.playTone(659.25, 'sine', 0.4, 0.1, 0);
      this.playTone(987.77, 'sine', 0.6, 0.12, 0.12);
    }

    playSparkleSneeze() {
      if (!state.soundEnabled) return;
      this.init();
      // Ascending pentatonic twinkle
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, i) => {
        this.playTone(freq, 'sine', 0.22, 0.12, i * 0.07);
      });
    }

    playEasterEggFanfare() {
      if (!state.soundEnabled) return;
      this.init();
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, i) => {
        this.playTone(freq, 'sine', 0.45, 0.14, i * 0.1);
      });
    }
  }

  const audio = new CelestialAudio();

  // =========================================================================
  // 4. TOAST NOTIFICATIONS & LIVE ACCESSIBILITY ANNOUNCER
  // =========================================================================

  function announce(message) {
    if (DOM.liveAnnouncer) {
      DOM.liveAnnouncer.textContent = message;
    }
  }

  function showToast(message, icon = '✨') {
    announce(message);
    if (!DOM.toastShelf) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span aria-hidden="true">${icon}</span><span>${escapeHTML(message)}</span>`;

    DOM.toastShelf.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-fading');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 3200);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // =========================================================================
  // 5. GLOBAL THEME ENGINE (DAY & DREAM MODE)
  // =========================================================================

  function initTheme() {
    let savedTheme = 'day';
    try {
      savedTheme = localStorage.getItem('nimbus_theme');
    } catch (_) {}

    if (!savedTheme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dream' : 'day';
    }

    applyTheme(savedTheme, false);
  }

  function applyTheme(theme, announceChange = true) {
    state.theme = theme;
    DOM.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const isDream = theme === 'dream';
    if (DOM.themeToggle) {
      DOM.themeToggle.setAttribute('aria-pressed', isDream ? 'true' : 'false');
    }
    if (DOM.themeIcon) {
      DOM.themeIcon.textContent = isDream ? '☀️' : '🌙';
    }
    if (DOM.themeLabel) {
      DOM.themeLabel.textContent = isDream ? 'Day Mode' : 'Dream Mode';
    }

    if (announceChange) {
      if (isDream) {
        showToast('Dream Mode activated. Deep night skies above.', '🌙');
      } else {
        showToast('Day Mode activated. Gentle morning clouds.', '☀️');
      }
    }

    try {
      localStorage.setItem('nimbus_theme', theme);
    } catch (_) {}
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'day' ? 'dream' : 'day';
    applyTheme(nextTheme, true);
    audio.playChime();
  }

  // =========================================================================
  // 6. SOUND EFFECTS TOGGLE (INDEPENDENT FROM LULLABY)
  // =========================================================================

  function initSound() {
    let savedSound = false;
    try {
      savedSound = localStorage.getItem('nimbus_sound') === 'true';
    } catch (_) {}

    state.soundEnabled = savedSound;
    updateSoundUI(false);
  }

  function updateSoundUI(showNotification = true) {
    if (DOM.soundToggle) {
      DOM.soundToggle.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
    }
    if (DOM.soundIcon) {
      DOM.soundIcon.textContent = state.soundEnabled ? '🔔' : '🔇';
    }
    if (DOM.soundLabel) {
      DOM.soundLabel.textContent = state.soundEnabled ? 'Chimes On' : 'Chimes Off';
    }

    if (showNotification) {
      if (state.soundEnabled) {
        showToast('Celestial chimes enabled! Soft bell notes unlocked.', '🔔');
      } else {
        showToast('Celestial chimes muted.', '🔇');
      }
    }
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    try {
      localStorage.setItem('nimbus_sound', state.soundEnabled ? 'true' : 'false');
    } catch (_) {}

    if (state.soundEnabled) {
      audio.init();
      audio.playChime();
    }
    updateSoundUI(true);
  }

  // =========================================================================
  // 7. GLOBAL NAVBAR LULLABY PLAYER SYNCHRONIZATION
  // =========================================================================

  function initGlobalLullabyNavbar() {
    if (!DOM.globalLullabyBtn) return;

    DOM.globalLullabyBtn.addEventListener('click', () => {
      lullabyPlayer.toggle();
    });

    // Subscribe to persistent player state
    lullabyPlayer.subscribe((playerState) => {
      if (!DOM.globalLullabyBtn) return;

      const isPlaying = playerState.isPlaying;
      DOM.globalLullabyBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      DOM.globalLullabyBtn.classList.toggle('is-playing-music', isPlaying);

      if (isPlaying) {
        if (DOM.globalLullabyIcon) DOM.globalLullabyIcon.textContent = '⏸️';
        if (DOM.globalLullabyLabel) DOM.globalLullabyLabel.textContent = 'Playing';
        DOM.globalLullabyBtn.setAttribute('aria-label', 'Pause lullaby');
        DOM.globalLullabyBtn.setAttribute('title', 'Pause lullaby');
      } else if (playerState.isEnded) {
        if (DOM.globalLullabyIcon) DOM.globalLullabyIcon.textContent = '🔄';
        if (DOM.globalLullabyLabel) DOM.globalLullabyLabel.textContent = 'Replay';
        DOM.globalLullabyBtn.setAttribute('aria-label', 'Replay lullaby');
        DOM.globalLullabyBtn.setAttribute('title', 'Replay lullaby');
      } else {
        if (DOM.globalLullabyIcon) DOM.globalLullabyIcon.textContent = '▶️';
        if (DOM.globalLullabyLabel) DOM.globalLullabyLabel.textContent = 'Lullaby';
        DOM.globalLullabyBtn.setAttribute('aria-label', 'Play lullaby');
        DOM.globalLullabyBtn.setAttribute('title', 'Play lullaby');
      }
    });
  }

  // =========================================================================
  // 8. PROJECT 001: LULLABY BOX UI & PROGRESS SYNCHRONIZATION
  // =========================================================================

  function initLullabyBoxUI() {
    if (!DOM.toggleLullabyBtn) return;

    // Toggle Play/Pause button
    DOM.toggleLullabyBtn.onclick = () => {
      if (lullabyPlayer.isEnded) {
        lullabyPlayer.replay();
      } else {
        lullabyPlayer.toggle();
      }
    };

    // Replay button
    if (DOM.replayLullabyBtn) {
      DOM.replayLullabyBtn.onclick = () => {
        lullabyPlayer.replay();
      };
    }

    // Interactive progress bar seek
    if (DOM.lullabyProgressContainer) {
      const handleSeek = (e) => {
        const rect = DOM.lullabyProgressContainer.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (clientX === undefined) return;
        const clickX = clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        lullabyPlayer.seek(ratio);
      };

      DOM.lullabyProgressContainer.onclick = handleSeek;

      DOM.lullabyProgressContainer.onkeydown = (e) => {
        if (!lullabyPlayer.duration) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          lullabyPlayer.seek(Math.min(1, (lullabyPlayer.currentTime + 5) / lullabyPlayer.duration));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          lullabyPlayer.seek(Math.max(0, (lullabyPlayer.currentTime - 5) / lullabyPlayer.duration));
        }
      };
    }

    // Subscribe Lullaby Box UI to player updates
    lullabyPlayer.subscribe(updateLullabyBoxUI);
  }

  function updateLullabyBoxUI(playerState) {
    if (!DOM.toggleLullabyBtn) return;

    const isPlaying = playerState.isPlaying;

    // Play/Pause button
    DOM.toggleLullabyBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    if (isPlaying) {
      if (DOM.lullabyBtnIcon) DOM.lullabyBtnIcon.textContent = '⏸️';
      if (DOM.lullabyBtnLabel) DOM.lullabyBtnLabel.textContent = 'Pause lullaby';
    } else if (playerState.isEnded) {
      if (DOM.lullabyBtnIcon) DOM.lullabyBtnIcon.textContent = '🔄';
      if (DOM.lullabyBtnLabel) DOM.lullabyBtnLabel.textContent = 'Replay lullaby';
    } else {
      if (DOM.lullabyBtnIcon) DOM.lullabyBtnIcon.textContent = '▶️';
      if (DOM.lullabyBtnLabel) {
        DOM.lullabyBtnLabel.textContent = playerState.currentTime > 0 ? 'Resume lullaby' : 'Play lullaby';
      }
    }

    // Replay button visibility
    if (DOM.replayLullabyBtn) {
      DOM.replayLullabyBtn.style.display = playerState.currentTime > 0 || playerState.isEnded ? 'inline-flex' : 'none';
    }

    // Timers
    if (DOM.lullabyTimeCurrent) {
      DOM.lullabyTimeCurrent.textContent = playerState.formattedCurrent;
    }
    if (DOM.lullabyTimeDuration) {
      DOM.lullabyTimeDuration.textContent = playerState.formattedDuration;
    }

    // Progress bar
    if (DOM.lullabyProgressFill) {
      DOM.lullabyProgressFill.style.width = `${playerState.progress}%`;
    }
    if (DOM.lullabyProgressThumb) {
      DOM.lullabyProgressThumb.style.left = `${playerState.progress}%`;
    }
    if (DOM.lullabyProgressContainer) {
      DOM.lullabyProgressContainer.setAttribute('aria-valuenow', Math.round(playerState.progress));
    }

    // Status Line and Visualizer
    if (DOM.projectStarsong) {
      DOM.projectStarsong.classList.toggle('is-active-lullaby', isPlaying);
    }
    if (DOM.radioStatusDot) {
      DOM.radioStatusDot.classList.toggle('is-playing', isPlaying);
    }

    if (DOM.radioStatusText) {
      if (isPlaying) {
        DOM.radioStatusText.textContent = 'Playing your lullaby · 🎵';
      } else if (playerState.isEnded) {
        DOM.radioStatusText.textContent = 'Lullaby finished · Sweet dreams';
      } else if (playerState.currentTime > 0) {
        DOM.radioStatusText.textContent = 'Paused · Rest your eyes';
      } else {
        DOM.radioStatusText.textContent = 'Ready to dream · Press Play';
      }
    }
  }

  // =========================================================================
  // 9. SEAMLESS NAVIGATION ROUTER (KEEPS AUDIO PLAYING ACROSS PAGES)
  // =========================================================================

  const PageRouter = {
    init() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Ignore hash jumps, external, tel, mailto
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
          return;
        }

        // Check if internal navigation target
        const isInternalPage = href.endsWith('.html') || href === '/' || href.includes('.html#');
        const urlObj = new URL(link.href, window.location.href);

        if (urlObj.origin === window.location.origin && isInternalPage) {
          e.preventDefault();
          this.navigateTo(link.href);
        }
      });

      // Browser Back & Forward buttons
      window.addEventListener('popstate', () => {
        this.loadPage(window.location.href, false);
      });
    },

    async navigateTo(url) {
      if (url === window.location.href) return;
      await this.loadPage(url, true);
    },

    async loadPage(url, push = true) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const htmlText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const newMain = doc.querySelector('main#main-content');
        const currentMain = document.querySelector('main#main-content');

        if (newMain && currentMain) {
          // Update Document Title
          document.title = doc.title;

          // Swap main content without destroying window or audio!
          currentMain.innerHTML = newMain.innerHTML;

          // Update URL in browser bar
          if (push) {
            window.history.pushState({ url }, '', url);
          }

          // Update active navigation links
          const targetPath = new URL(url, window.location.origin).pathname.split('/').pop() || 'index.html';
          document.querySelectorAll('.site-nav .nav-link').forEach((navLink) => {
            const linkHref = navLink.getAttribute('href').split('/').pop() || 'index.html';
            const isActive = linkHref === targetPath;
            navLink.classList.toggle('is-active', isActive);
            if (isActive) {
              navLink.setAttribute('aria-current', 'page');
            } else {
              navLink.removeAttribute('aria-current');
            }
          });

          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'instant' });

          // Re-initialize all page-specific components in new DOM
          initPageComponents();

          // Close mobile menu if open
          if (DOM.siteNav && DOM.siteNav.classList.contains('is-open')) {
            DOM.siteNav.classList.remove('is-open');
            if (DOM.navToggle) DOM.navToggle.setAttribute('aria-expanded', 'false');
          }
        } else {
          window.location.href = url;
        }
      } catch (err) {
        console.warn('Router fetch fallback, navigating normally:', err);
        window.location.href = url;
      }
    }
  };

  // =========================================================================
  // 10. PROJECT 002: MIDNIGHT LANTERN & MOONLIGHT BOTTLES
  // =========================================================================

  function initMoonlightBottles() {
    if (!DOM.toggleBottleBtn || !DOM.bottleStage) return;

    DOM.toggleBottleBtn.onclick = () => {
      state.bottleLit = !state.bottleLit;
      DOM.bottleStage.setAttribute('data-lit', state.bottleLit ? 'true' : 'false');
      DOM.toggleBottleBtn.setAttribute('aria-pressed', state.bottleLit ? 'true' : 'false');

      if (state.bottleLit) {
        if (DOM.bottleBtnIcon) DOM.bottleBtnIcon.textContent = '💡';
        if (DOM.bottleBtnLabel) DOM.bottleBtnLabel.textContent = 'Extinguish Lantern (Turn Off)';
        if (DOM.bottleStatusDot) DOM.bottleStatusDot.classList.add('is-lit');
        updateBottleStatusText();
        audio.playChime();
        showToast('Lantern lit! Warm starlight fills the observatory.', '💡');
      } else {
        if (DOM.bottleBtnIcon) DOM.bottleBtnIcon.textContent = '✨';
        if (DOM.bottleBtnLabel) DOM.bottleBtnLabel.textContent = 'Light Lantern (Turn On)';
        if (DOM.bottleStatusDot) DOM.bottleStatusDot.classList.remove('is-lit');
        if (DOM.bottleStatusText) DOM.bottleStatusText.textContent = 'State: Extinguished & Sleeping · Glow paused';
        showToast('Lantern extinguished. Starlight safely resting inside.', '🌙');
      }
    };

    if (DOM.paletteSwatches && DOM.paletteSwatches.length > 0) {
      DOM.paletteSwatches.forEach((swatch) => {
        swatch.onclick = () => {
          DOM.paletteSwatches.forEach((s) => {
            s.classList.remove('is-active');
            s.setAttribute('aria-checked', 'false');
          });

          swatch.classList.add('is-active');
          swatch.setAttribute('aria-checked', 'true');

          state.bottleColor = swatch.getAttribute('data-color');
          DOM.bottleStage.setAttribute('data-glow', state.bottleColor);

          if (!state.bottleLit) {
            DOM.toggleBottleBtn.click();
          } else {
            updateBottleStatusText();
            audio.playChime();
          }
        };
      });
    }
  }

  function updateBottleStatusText() {
    if (!DOM.bottleStatusText) return;
    const colorNames = {
      gold: 'Moon Gold · 100% Warmth',
      blush: 'Star Blush · Gentle Solace',
      lavender: 'Dream Lavender · Deep Slumber',
      mint: 'Mint Glow · Refreshing Calm'
    };
    const desc = colorNames[state.bottleColor] || 'Pure Warmth';
    DOM.bottleStatusText.textContent = `State: Glowing (${desc})`;
  }

  // =========================================================================
  // 11. PROJECT 003: DREAM DELIVERY MAP
  // =========================================================================

  function initDreamDelivery() {
    if (!DOM.sendDreamBtn || !DOM.travelingStar) return;

    DOM.sendDreamBtn.onclick = () => {
      if (state.isDeliveringDream) return;
      deliverDream();
    };
  }

  function deliverDream() {
    state.isDeliveringDream = true;
    DOM.sendDreamBtn.disabled = true;
    if (DOM.mapStatusDot) DOM.mapStatusDot.classList.add('is-playing');

    const waypoints = [
      {
        name: 'Cloud Bay',
        coord: 'translate(50, 140)',
        chip: DOM.stepBay,
        status: 'Departed Cloud Bay with warm thoughts...',
        toast: 'Dream dispatched from Cloud Bay! 🚀'
      },
      {
        name: 'Little Moon',
        coord: 'translate(160, 68)',
        chip: DOM.stepMoon,
        status: 'Passing Little Moon! Lunar stardust refueled...',
        toast: 'Little Moon reached: Stardust sprinkled! 🌙'
      },
      {
        name: 'Home',
        coord: 'translate(280, 120)',
        chip: DOM.stepHome,
        status: 'Mission Complete: Safely delivered under sleepy pillows! ✨',
        toast: 'Dream delivered safely home! Sweet dreams. ♡'
      }
    ];

    if (state.prefersReducedMotion) {
      waypoints.forEach((wp) => {
        if (wp.chip) wp.chip.classList.add('is-active');
      });
      DOM.travelingStar.setAttribute('transform', waypoints[2].coord);
      finishDelivery(waypoints[2]);
      return;
    }

    executeWaypointStep(waypoints, 0);
  }

  function executeWaypointStep(waypoints, index) {
    const wp = waypoints[index];

    [DOM.stepBay, DOM.stepMoon, DOM.stepHome].forEach((c, idx) => {
      if (c) c.classList.toggle('is-active', idx <= index);
    });

    if (DOM.travelingStar) DOM.travelingStar.setAttribute('transform', wp.coord);
    if (DOM.mapStatusText) DOM.mapStatusText.textContent = wp.status;
    audio.playChime();

    if (index === 0) {
      showToast(wp.toast, '🚀');
    }

    if (index < waypoints.length - 1) {
      setTimeout(() => {
        executeWaypointStep(waypoints, index + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        finishDelivery(wp);
      }, 900);
    }
  }

  function finishDelivery(finalWp) {
    showToast(finalWp.toast, '✨');
    incrementDreamDeliveries();

    setTimeout(() => {
      state.isDeliveringDream = false;
      if (DOM.sendDreamBtn) DOM.sendDreamBtn.disabled = false;
      if (DOM.mapStatusDot) DOM.mapStatusDot.classList.remove('is-playing');
    }, 1500);
  }

  // =========================================================================
  // 12. HERO WISH MAKER & NIMBUS PARALLAX
  // =========================================================================

  function initHero() {
    if (DOM.heroWishBtn) {
      DOM.heroWishBtn.onclick = () => {
        makeWish();
      };
    }

    if (DOM.heroStage && DOM.characterWrapper && !state.prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      DOM.heroStage.onmousemove = (e) => {
        const rect = DOM.heroStage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        DOM.characterWrapper.style.transform = `translate(${x * 12}px, ${y * 12}px) rotate(${x * 3}deg)`;
      };

      DOM.heroStage.onmouseleave = () => {
        DOM.characterWrapper.style.transform = '';
      };
    }
  }

  function makeWish() {
    if (DOM.heroWishLayer) {
      const star = document.createElement('span');
      star.className = 'spawned-wish-star';
      star.textContent = '✦';

      const left = Math.floor(Math.random() * 70 + 15);
      const top = Math.floor(Math.random() * 60 + 20);

      star.style.left = `${left}%`;
      star.style.top = `${top}%`;

      DOM.heroWishLayer.appendChild(star);

      const currentStars = DOM.heroWishLayer.querySelectorAll('.spawned-wish-star');
      if (currentStars.length > 15) {
        DOM.heroWishLayer.removeChild(currentStars[0]);
      }

      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 3000);
    }

    audio.playChime();
    incrementStarsMapped();
    showToast('A tiny wish was chartered into the constellation sky! ✨', '⭐');
  }

  // =========================================================================
  // 13. ODD QUIRK: SNEEZE A STAR
  // =========================================================================

  function initQuirk() {
    if (!DOM.tellStoryBtn) return;

    DOM.tellStoryBtn.onclick = () => {
      audio.playSparkleSneeze();
      incrementStarsMapped();
      showToast('Achoo! 🌟 Nimbus sneezed a sparkling star in joy! "What a lovely story!"', '⭐');
    };
  }

  // =========================================================================
  // 14. STORY CHAPTERS SCROLL OBSERVER
  // =========================================================================

  function initStoryChapters() {
    const chapters = document.querySelectorAll('.story-chapter');
    if (chapters.length === 0) return;

    if ('IntersectionObserver' in window && !state.prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.15 }
      );

      chapters.forEach((ch) => observer.observe(ch));
    } else {
      chapters.forEach((ch) => ch.classList.add('is-visible'));
    }
  }

  // =========================================================================
  // 15. GUESTBOOK & WISH WALL
  // =========================================================================

  const defaultWishes = [
    {
      author: 'Pip the Field Mouse',
      wish: 'Wishing for quiet courage on my flight tomorrow.',
      date: 'Tonight'
    },
    {
      author: 'Stella the Night Owl',
      wish: 'Hoping every sleepy stargazer finds their favorite constellation.',
      date: 'Yesterday'
    },
    {
      author: 'Bramble the Hedgehog',
      wish: 'Sending warm apple tea wishes to Nimbus’s observatory.',
      date: '2 nights ago'
    }
  ];

  function initGuestbook() {
    if (!DOM.wishForm || !DOM.wishesList) return;

    let wishes = loadWishes();
    renderWishes(wishes);

    if (DOM.wishTextInput && DOM.charCounter) {
      DOM.wishTextInput.oninput = () => {
        DOM.charCounter.textContent = DOM.wishTextInput.value.length;
      };
    }

    if (DOM.quickPromptBtns) {
      DOM.quickPromptBtns.forEach((btn) => {
        btn.onclick = () => {
          const promptText = btn.getAttribute('data-text');
          if (DOM.wishTextInput) {
            DOM.wishTextInput.value = promptText;
            if (DOM.charCounter) DOM.charCounter.textContent = promptText.length;
            DOM.wishTextInput.focus();
          }
        };
      });
    }

    DOM.wishForm.onsubmit = (e) => {
      e.preventDefault();

      const author = DOM.wishAuthorInput ? DOM.wishAuthorInput.value.trim() : '';
      const text = DOM.wishTextInput ? DOM.wishTextInput.value.trim() : '';

      if (!author || !text) {
        showToast('Please whisper your name and a sweet wish first!', '✍️');
        return;
      }

      const newWish = {
        author: author,
        wish: text,
        date: 'Just now'
      };

      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes(wishes);

      incrementStarsMapped();

      if (DOM.wishAuthorInput) DOM.wishAuthorInput.value = '';
      if (DOM.wishTextInput) DOM.wishTextInput.value = '';
      if (DOM.charCounter) DOM.charCounter.textContent = '0';

      audio.playSparkleSneeze();
      showToast('Your wish has been pinned to Nimbus’s Starry Wall! 🌟', '⭐');
    };
  }

  function loadWishes() {
    try {
      const stored = localStorage.getItem('nimbus_guestbook_wishes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('nimbus_guestbook_wishes', JSON.stringify(wishes.slice(0, 30)));
    } catch (_) {}
  }

  function renderWishes(wishes) {
    if (!DOM.wishesList) return;
    DOM.wishesList.innerHTML = '';
    if (DOM.wishCountPill) {
      DOM.wishCountPill.textContent = `${wishes.length} wishes recorded`;
    }

    wishes.forEach((w) => {
      const item = document.createElement('div');
      item.className = 'wish-item';
      item.innerHTML = `
        <div class="wish-item-header">
          <span class="wish-author">⭐ ${escapeHTML(w.author)}</span>
          <span class="wish-time">${escapeHTML(w.date)}</span>
        </div>
        <p class="wish-body">“${escapeHTML(w.wish)}”</p>
      `;
      DOM.wishesList.appendChild(item);
    });
  }

  // =========================================================================
  // 16. EASTER EGG — NIMBUS'S SECRET
  // =========================================================================

  function initEasterEgg() {
    if (!DOM.easterEggStar || !DOM.easterModal) return;

    DOM.easterEggStar.onclick = () => {
      state.easterEggTaps += 1;

      if (state.easterEggTaps < state.easterEggMaxTaps) {
        const remaining = state.easterEggMaxTaps - state.easterEggTaps;
        audio.playChime();
        showToast(`The star twinkles softly... (${remaining} more ${remaining === 1 ? 'tap' : 'taps'})`, '✦');
      } else {
        triggerEasterEgg();
      }
    };

    if (DOM.easterCloseBtn) DOM.easterCloseBtn.onclick = closeEasterEgg;
    if (DOM.easterDismissBtn) DOM.easterDismissBtn.onclick = closeEasterEgg;
    if (DOM.easterBackdrop) DOM.easterBackdrop.onclick = closeEasterEgg;

    document.onkeydown = (e) => {
      if (e.key === 'Escape' && DOM.easterModal && !DOM.easterModal.hasAttribute('hidden')) {
        closeEasterEgg();
      }
    };
  }

  function triggerEasterEgg() {
    state.easterEggTaps = 0;
    audio.playEasterEggFanfare();

    if (DOM.easterModal) {
      DOM.easterModal.removeAttribute('hidden');
      DOM.easterModal.setAttribute('aria-hidden', 'false');
    }
    if (DOM.easterCloseBtn) {
      DOM.easterCloseBtn.focus();
    }

    incrementStarsMapped();
    incrementStarsMapped();
    incrementStarsMapped();

    spawnEasterEggSparkles();
    showToast('Secret discovered! Nimbus whispers a constellation secret. 🌌', '🎉');
  }

  function closeEasterEgg() {
    if (DOM.easterModal) {
      DOM.easterModal.setAttribute('hidden', '');
      DOM.easterModal.setAttribute('aria-hidden', 'true');
    }
    if (DOM.easterEggStar) {
      DOM.easterEggStar.focus();
    }
  }

  function spawnEasterEggSparkles() {
    const symbols = ['✦', '⭐', '✨', '☁️', '🌙'];
    for (let i = 0; i < 24; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('span');
        sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${Math.random() * 90 + 5}%`;
        sparkle.style.top = `${Math.random() * 80 + 10}%`;
        sparkle.style.fontSize = `${Math.floor(Math.random() * 18 + 14)}px`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '99999';
        sparkle.style.color = '#e7bf70';
        sparkle.style.animation = 'floatUpAndFade 2.5s ease-out forwards';

        document.body.appendChild(sparkle);
        setTimeout(() => {
          if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
        }, 2500);
      }, i * 70);
    }
  }

  // =========================================================================
  // 17. TELEMETRY & AMBIENT STARFIELD
  // =========================================================================

  function initTelemetry() {
    try {
      const savedStars = localStorage.getItem('nimbus_stars_mapped');
      if (savedStars) state.starsMapped = parseInt(savedStars, 10) || 128;

      const savedDeliveries = localStorage.getItem('nimbus_dream_deliveries');
      if (savedDeliveries) state.dreamDeliveries = parseInt(savedDeliveries, 10) || 7;
    } catch (_) {}

    if (DOM.statStarsMapped) DOM.statStarsMapped.textContent = state.starsMapped;
    if (DOM.statDreamDeliveries) {
      DOM.statDreamDeliveries.textContent = String(state.dreamDeliveries).padStart(2, '0');
    }
  }

  function incrementStarsMapped() {
    state.starsMapped += 1;
    if (DOM.statStarsMapped) DOM.statStarsMapped.textContent = state.starsMapped;
    try {
      localStorage.setItem('nimbus_stars_mapped', state.starsMapped);
    } catch (_) {}
  }

  function incrementDreamDeliveries() {
    state.dreamDeliveries += 1;
    if (DOM.statDreamDeliveries) {
      DOM.statDreamDeliveries.textContent = String(state.dreamDeliveries).padStart(2, '0');
    }
    try {
      localStorage.setItem('nimbus_dream_deliveries', state.dreamDeliveries);
    } catch (_) {}
  }

  function initAmbientStars() {
    if (!DOM.ambientStarfield) return;
    DOM.ambientStarfield.innerHTML = '';

    const starCount = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'ambient-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${3 + Math.random() * 3}s`;
      DOM.ambientStarfield.appendChild(star);
    }
  }

  // =========================================================================
  // 18. MOBILE NAV & BACK TO TOP
  // =========================================================================

  function initNav() {
    if (!DOM.navToggle || !DOM.siteNav) return;

    DOM.navToggle.onclick = () => {
      const isOpen = DOM.siteNav.classList.toggle('is-open');
      DOM.navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    DOM.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        DOM.siteNav.classList.remove('is-open');
        if (DOM.navToggle) DOM.navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.siteNav.classList.contains('is-open')) {
        DOM.siteNav.classList.remove('is-open');
        if (DOM.navToggle) {
          DOM.navToggle.setAttribute('aria-expanded', 'false');
          DOM.navToggle.focus();
        }
      }
    });
  }

  function initBackToTop() {
    if (!DOM.btnBackToTop) return;

    DOM.btnBackToTop.onclick = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const firstHeading = document.querySelector('h1, h2');
      if (firstHeading) firstHeading.focus();
    };
  }

  // =========================================================================
  // 19. PAGE COMPONENTS INITIALIZATION (RUNS ON INITIAL BOOT & AFTER ROUTING)
  // =========================================================================

  function initPageComponents() {
    queryPageDOM();
    initHero();
    initQuirk();
    initLullabyBoxUI();
    initMoonlightBottles();
    initDreamDelivery();
    initStoryChapters();
    initGuestbook();
    initEasterEgg();
    initTelemetry();
    initBackToTop();

    // Notify player to update fresh DOM elements with live playback status
    lullabyPlayer.notify();
  }

  // =========================================================================
  // 20. MASTER BOOTSTRAP
  // =========================================================================

  function boot() {
    initTheme();
    initSound();
    initNav();
    initGlobalLullabyNavbar();
    initAmbientStars();
    PageRouter.init();
    initPageComponents();

    if (DOM.themeToggle) {
      DOM.themeToggle.onclick = toggleTheme;
    }
    if (DOM.soundToggle) {
      DOM.soundToggle.onclick = toggleSound;
    }

    console.log(
      '%c✦ Nimbus Moonwhisper — The Midnight Observatory loaded peacefully. Good dreams start small! ♡',
      'color: #a34063; font-weight: bold; font-size: 13px;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
