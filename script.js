/**
 * NIMBUS MOONWHISPER — THE MIDNIGHT OBSERVATORY
 * Master Interactive Controller
 *
 * Multi-page friendly, accessible, performant, responsive, and cozy.
 * Web Audio API synthesizer, state management across pages via localStorage.
 */

'use strict';

(function () {
  // =========================================================================
  // 1. STATE MANAGEMENT & DOM REFS
  // =========================================================================

  const state = {
    theme: 'day', // 'day' | 'dream'
    soundEnabled: false,
    starsMapped: 128,
    dreamDeliveries: 7,
    lullabyPlaying: false,
    bottleLit: true,
    bottleColor: 'gold',
    easterEggTaps: 0,
    easterEggMaxTaps: 5,
    isDeliveringDream: false,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // DOM Elements (queried safely per page)
  const DOM = {
    body: document.body,
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    themeLabel: document.getElementById('theme-label'),

    soundToggle: document.getElementById('sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    soundLabel: document.getElementById('sound-label'),

    navToggle: document.getElementById('nav-toggle'),
    siteNav: document.getElementById('site-nav'),
    navLinks: document.querySelectorAll('.nav-link'),

    heroWishBtn: document.getElementById('btn-hero-wish'),
    heroWishLayer: document.getElementById('hero-wish-layer'),
    heroStage: document.getElementById('hero-stage'),
    characterWrapper: document.getElementById('character-wrapper'),

    tellStoryBtn: document.getElementById('btn-tell-story'),

    // Project 001: Starsong Radio
    projectStarsong: document.getElementById('project-starsong'),
    toggleLullabyBtn: document.getElementById('btn-toggle-lullaby'),
    lullabyBtnIcon: document.getElementById('lullaby-btn-icon'),
    lullabyBtnLabel: document.getElementById('lullaby-btn-label'),
    radioStatusDot: document.getElementById('radio-status-dot'),
    radioStatusText: document.getElementById('radio-status-text'),

    // Project 002: Moonlight Bottles
    bottleStage: document.getElementById('bottle-stage'),
    toggleBottleBtn: document.getElementById('btn-toggle-bottle'),
    bottleBtnIcon: document.getElementById('bottle-btn-icon'),
    bottleBtnLabel: document.getElementById('bottle-btn-label'),
    bottleStatusDot: document.getElementById('bottle-status-dot'),
    bottleStatusText: document.getElementById('bottle-status-text'),
    paletteSwatches: document.querySelectorAll('.palette-swatch'),

    // Project 003: Dream Delivery Map
    sendDreamBtn: document.getElementById('btn-send-dream'),
    travelingStar: document.getElementById('traveling-star'),
    stepBay: document.getElementById('step-bay'),
    stepMoon: document.getElementById('step-moon'),
    stepHome: document.getElementById('step-home'),
    mapStatusDot: document.getElementById('map-status-dot'),
    mapStatusText: document.getElementById('map-status-text'),

    // Status Deck
    statStarsMapped: document.getElementById('stat-stars-mapped'),
    statDreamDeliveries: document.getElementById('stat-dream-deliveries'),

    // Guestbook & Wishes
    wishForm: document.getElementById('wish-form'),
    wishAuthorInput: document.getElementById('wish-author'),
    wishTextInput: document.getElementById('wish-text'),
    charCounter: document.getElementById('char-counter'),
    wishesList: document.getElementById('wishes-list'),
    wishCountPill: document.getElementById('wish-count-pill'),
    quickPromptBtns: document.querySelectorAll('.btn-prompt'),

    // Easter Egg
    easterEggStar: document.getElementById('easter-egg-star'),
    easterModal: document.getElementById('easter-modal'),
    easterBackdrop: document.getElementById('easter-backdrop'),
    easterCloseBtn: document.getElementById('easter-close-btn'),
    easterDismissBtn: document.getElementById('easter-dismiss-btn'),

    // Feedback
    toastShelf: document.getElementById('toast-shelf'),
    liveAnnouncer: document.getElementById('live-announcer'),
    btnBackToTop: document.getElementById('btn-back-to-top'),
    ambientStarfield: document.getElementById('ambient-starfield')
  };

  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER
  // =========================================================================

  class CelestialAudio {
    constructor() {
      this.ctx = null;
      this.activeOscillators = [];
      this.lullabyTimeout = null;
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

    playTone(freq, type = 'sine', duration = 0.3, volume = 0.15, when = 0) {
      if (!state.soundEnabled || !this.ctx) return null;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + when);

        // Soft ADSR envelope for cozy gentle tone (prevents clicks)
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
        console.warn('Audio playback error:', err);
        return null;
      }
    }

    playChime() {
      if (!state.soundEnabled) return;
      this.init();
      // Two-tone bell: E5 (659Hz) -> B5 (987Hz)
      this.playTone(659.25, 'sine', 0.4, 0.12, 0);
      this.playTone(987.77, 'sine', 0.6, 0.15, 0.12);
    }

    playSparkleSneeze() {
      if (!state.soundEnabled) return;
      this.init();
      // Sparkly ascending pentatonic arpeggio: C5, E5, G5, C6, E6
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, i) => {
        this.playTone(freq, 'sine', 0.25, 0.14, i * 0.08);
      });
    }

    playEasterEggFanfare() {
      if (!state.soundEnabled) return;
      this.init();
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, i) => {
        this.playTone(freq, 'sine', 0.5, 0.16, i * 0.12);
      });
    }

    playLullaby(onComplete) {
      if (!state.soundEnabled) return;
      this.init();
      this.stopLullaby();

      // Soothing music-box melody: E5, G5, A5, B5, G5, E5, D5, C5
      const lullabySequence = [
        { freq: 659.25, dur: 0.5, delay: 0 },
        { freq: 783.99, dur: 0.5, delay: 0.45 },
        { freq: 880.0, dur: 0.5, delay: 0.9 },
        { freq: 987.77, dur: 0.7, delay: 1.35 },
        { freq: 783.99, dur: 0.5, delay: 2.1 },
        { freq: 659.25, dur: 0.5, delay: 2.6 },
        { freq: 587.33, dur: 0.5, delay: 3.1 },
        { freq: 523.25, dur: 0.9, delay: 3.6 }
      ];

      lullabySequence.forEach((note) => {
        this.playTone(note.freq, 'sine', note.dur, 0.14, note.delay);
      });

      // Total sequence length is ~4.6 seconds
      this.lullabyTimeout = setTimeout(() => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 4700);
    }

    stopLullaby() {
      if (this.lullabyTimeout) {
        clearTimeout(this.lullabyTimeout);
        this.lullabyTimeout = null;
      }
      this.activeOscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (_) {}
      });
      this.activeOscillators = [];
    }
  }

  const audio = new CelestialAudio();

  // =========================================================================
  // 3. TOAST & ACCESSIBILITY ANNOUNCER
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
  // 4. DAY MODE & DREAM MODE (THEME SWITCHER)
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
        showToast('Dream Mode activated. Goodnight, stargazer.', '🌙');
      } else {
        showToast('Day Mode activated. Morning clouds are soft.', '☀️');
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
  // 5. SOUND SYSTEM TOGGLE & PERSISTENCE
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
      DOM.soundLabel.textContent = state.soundEnabled ? 'Sound On' : 'Sound Off';
    }

    if (showNotification) {
      if (state.soundEnabled) {
        showToast('Celestial audio enabled! Soft bells and lullabies unlocked.', '🔔');
      } else {
        showToast('Sound muted. Peaceful quiet restored.', '🔇');
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
      updateSoundUI(true);
    } else {
      audio.stopLullaby();
      stopLullabyUI();
      updateSoundUI(true);
    }
  }

  // =========================================================================
  // 6. TELEMETRY SYNCHRONIZATION
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

  // =========================================================================
  // 7. MOBILE NAVIGATION
  // =========================================================================

  function initNav() {
    if (!DOM.navToggle || !DOM.siteNav) return;

    DOM.navToggle.addEventListener('click', () => {
      const isOpen = DOM.siteNav.classList.toggle('is-open');
      DOM.navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    DOM.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        DOM.siteNav.classList.remove('is-open');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.siteNav.classList.contains('is-open')) {
        DOM.siteNav.classList.remove('is-open');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
        DOM.navToggle.focus();
      }
    });
  }

  // =========================================================================
  // 8. HERO WISH MAKER & NIMBUS PARALLAX
  // =========================================================================

  function initHero() {
    if (DOM.heroWishBtn) {
      DOM.heroWishBtn.addEventListener('click', () => {
        makeWish();
      });
    }

    // Subtle pointer movement on desktop
    if (DOM.heroStage && DOM.characterWrapper && !state.prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      DOM.heroStage.addEventListener('mousemove', (e) => {
        const rect = DOM.heroStage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        DOM.characterWrapper.style.transform = `translate(${x * 12}px, ${y * 12}px) rotate(${x * 3}deg)`;
      });

      DOM.heroStage.addEventListener('mouseleave', () => {
        DOM.characterWrapper.style.transform = '';
      });
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
  // 9. ODD QUIRK: SNEEZE A STAR
  // =========================================================================

  function initQuirk() {
    if (!DOM.tellStoryBtn) return;

    DOM.tellStoryBtn.addEventListener('click', () => {
      audio.playSparkleSneeze();
      incrementStarsMapped();
      showToast('Achoo! 🌟 Nimbus sneezed a sparkling star in joy! "What a lovely story!"', '⭐');
    });
  }

  // =========================================================================
  // 10. PROJECT 001: STARSONG RADIO
  // =========================================================================

  function initStarsongRadio() {
    if (!DOM.toggleLullabyBtn) return;

    DOM.toggleLullabyBtn.addEventListener('click', () => {
      if (state.lullabyPlaying) {
        stopLullaby();
      } else {
        startLullaby();
      }
    });
  }

  function startLullaby() {
    if (!state.soundEnabled) {
      toggleSound();
    }

    state.lullabyPlaying = true;
    if (DOM.toggleLullabyBtn) DOM.toggleLullabyBtn.setAttribute('aria-pressed', 'true');
    if (DOM.lullabyBtnIcon) DOM.lullabyBtnIcon.textContent = '⏹️';
    if (DOM.lullabyBtnLabel) DOM.lullabyBtnLabel.textContent = 'Stop lullaby';

    if (DOM.projectStarsong) DOM.projectStarsong.classList.add('is-active-lullaby');
    if (DOM.radioStatusDot) DOM.radioStatusDot.classList.add('is-playing');
    if (DOM.radioStatusText) DOM.radioStatusText.textContent = 'Broadcasting: Pleiades Lullaby (88.5 FM)';

    showToast('Playing Nimbus’s pocket lullaby... Listen closely. 🎵', '🎶');

    audio.playLullaby(() => {
      stopLullaby();
    });
  }

  function stopLullaby() {
    audio.stopLullaby();
    stopLullabyUI();
    showToast('Lullaby resting until next bedtime.', '🌙');
  }

  function stopLullabyUI() {
    state.lullabyPlaying = false;
    if (DOM.toggleLullabyBtn) DOM.toggleLullabyBtn.setAttribute('aria-pressed', 'false');
    if (DOM.lullabyBtnIcon) DOM.lullabyBtnIcon.textContent = '🎵';
    if (DOM.lullabyBtnLabel) DOM.lullabyBtnLabel.textContent = 'Play my lullaby';

    if (DOM.projectStarsong) DOM.projectStarsong.classList.remove('is-active-lullaby');
    if (DOM.radioStatusDot) DOM.radioStatusDot.classList.remove('is-playing');
    if (DOM.radioStatusText) DOM.radioStatusText.textContent = 'Tuned to Pleiades 92.4 FM · Standing by';
  }

  // =========================================================================
  // 11. PROJECT 002: MOONLIGHT BOTTLES
  // =========================================================================

  function initMoonlightBottles() {
    if (!DOM.toggleBottleBtn || !DOM.bottleStage) return;

    DOM.toggleBottleBtn.addEventListener('click', () => {
      state.bottleLit = !state.bottleLit;
      DOM.bottleStage.setAttribute('data-lit', state.bottleLit ? 'true' : 'false');
      DOM.toggleBottleBtn.setAttribute('aria-pressed', state.bottleLit ? 'true' : 'false');

      if (state.bottleLit) {
        if (DOM.bottleBtnIcon) DOM.bottleBtnIcon.textContent = '💡';
        if (DOM.bottleBtnLabel) DOM.bottleBtnLabel.textContent = 'Cork & Sleep (Turn Off)';
        if (DOM.bottleStatusDot) DOM.bottleStatusDot.classList.add('is-lit');
        updateBottleStatusText();
        audio.playChime();
        showToast('Bottle uncorked! Warm moonlight fills the room.', '💡');
      } else {
        if (DOM.bottleBtnIcon) DOM.bottleBtnIcon.textContent = '✨';
        if (DOM.bottleBtnLabel) DOM.bottleBtnLabel.textContent = 'Uncork & Glow (Turn On)';
        if (DOM.bottleStatusDot) DOM.bottleStatusDot.classList.remove('is-lit');
        if (DOM.bottleStatusText) DOM.bottleStatusText.textContent = 'State: Corked & Sleeping · Glow paused';
        showToast('Bottle corked. Starlight safely resting inside.', '🌙');
      }
    });

    if (DOM.paletteSwatches && DOM.paletteSwatches.length > 0) {
      DOM.paletteSwatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
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
        });
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
  // 12. PROJECT 003: DREAM DELIVERY MAP
  // =========================================================================

  function initDreamDelivery() {
    if (!DOM.sendDreamBtn || !DOM.travelingStar) return;

    DOM.sendDreamBtn.addEventListener('click', () => {
      if (state.isDeliveringDream) return;
      deliverDream();
    });
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
  // 13. ORIGIN STORY: INTERSECTION OBSERVER SCROLL
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
  // 14. GUESTBOOK & WISH WALL
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
      DOM.wishTextInput.addEventListener('input', () => {
        DOM.charCounter.textContent = DOM.wishTextInput.value.length;
      });
    }

    if (DOM.quickPromptBtns) {
      DOM.quickPromptBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const promptText = btn.getAttribute('data-text');
          if (DOM.wishTextInput) {
            DOM.wishTextInput.value = promptText;
            if (DOM.charCounter) DOM.charCounter.textContent = promptText.length;
            DOM.wishTextInput.focus();
          }
        });
      });
    }

    DOM.wishForm.addEventListener('submit', (e) => {
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
    });
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
  // 15. EASTER EGG — NIMBUS'S SECRET
  // =========================================================================

  function initEasterEgg() {
    if (!DOM.easterEggStar || !DOM.easterModal) return;

    DOM.easterEggStar.addEventListener('click', () => {
      state.easterEggTaps += 1;

      if (state.easterEggTaps < state.easterEggMaxTaps) {
        const remaining = state.easterEggMaxTaps - state.easterEggTaps;
        audio.playChime();
        showToast(`The star twinkles softly... (${remaining} more ${remaining === 1 ? 'tap' : 'taps'})`, '✦');
      } else {
        triggerEasterEgg();
      }
    });

    if (DOM.easterCloseBtn) DOM.easterCloseBtn.addEventListener('click', closeEasterEgg);
    if (DOM.easterDismissBtn) DOM.easterDismissBtn.addEventListener('click', closeEasterEgg);
    if (DOM.easterBackdrop) DOM.easterBackdrop.addEventListener('click', closeEasterEgg);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !DOM.easterModal.hasAttribute('hidden')) {
        closeEasterEgg();
      }
    });
  }

  function triggerEasterEgg() {
    state.easterEggTaps = 0;
    audio.playEasterEggFanfare();

    DOM.easterModal.removeAttribute('hidden');
    if (DOM.easterDismissBtn) DOM.easterDismissBtn.focus();

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        makeWish();
      }, i * 160);
    }
  }

  function closeEasterEgg() {
    if (DOM.easterModal) DOM.easterModal.setAttribute('hidden', '');
    if (DOM.easterEggStar) DOM.easterEggStar.focus();
  }

  // =========================================================================
  // 16. SPARKLE CURSOR TRAIL (DESKTOP BONUS)
  // =========================================================================

  function initCursorTrail() {
    if (state.prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let lastSparkleTime = 0;
    const sparkleThrottle = 45; // ms

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSparkleTime < sparkleThrottle) return;
      lastSparkleTime = now;

      const particle = document.createElement('span');
      particle.className = 'cursor-sparkle';
      particle.textContent = ['✦', '✧', '⋆'][Math.floor(Math.random() * 3)];
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 600);
    });
  }

  // =========================================================================
  // 17. AMBIENT BACKGROUND STARS
  // =========================================================================

  function initAmbientStars() {
    if (!DOM.ambientStarfield) return;

    const starCount = window.innerWidth < 768 ? 25 : 50;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('span');
      star.className = 'ambient-star';

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 3 + 1.5;
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 3;

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;

      DOM.ambientStarfield.appendChild(star);
    }
  }

  // =========================================================================
  // 18. BACK TO TOP
  // =========================================================================

  function initBackToTop() {
    if (!DOM.btnBackToTop) return;

    DOM.btnBackToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      const firstHeading = document.querySelector('h1, h2');
      if (firstHeading) firstHeading.focus();
    });
  }

  // =========================================================================
  // 19. INITIALIZATION BOOTSTRAP
  // =========================================================================

  function boot() {
    initTheme();
    initSound();
    initTelemetry();
    initNav();
    initHero();
    initQuirk();
    initStarsongRadio();
    initMoonlightBottles();
    initDreamDelivery();
    initStoryChapters();
    initGuestbook();
    initEasterEgg();
    initCursorTrail();
    initAmbientStars();
    initBackToTop();

    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener('click', toggleTheme);
    }
    if (DOM.soundToggle) {
      DOM.soundToggle.addEventListener('click', toggleSound);
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
