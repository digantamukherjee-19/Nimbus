/**
 * NIMBUS MOONWHISPER — THE MIDNIGHT OBSERVATORY
 * Master Interactive Controller
 *
 * Built with Vanilla JavaScript & Web Audio API
 * Accessible, performant, responsive, and cozy.
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

  // DOM Elements
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
    DOM.themeToggle.setAttribute('aria-pressed', isDream ? 'true' : 'false');

    if (isDream) {
      DOM.themeIcon.textContent = '☀️';
      DOM.themeLabel.textContent = 'Day Mode';
      if (announceChange) showToast('Dream Mode activated. Goodnight, stargazer.', '🌙');
    } else {
      DOM.themeIcon.textContent = '🌙';
      DOM.themeLabel.textContent = 'Dream Mode';
      if (announceChange) showToast('Day Mode activated. Morning clouds are soft.', '☀️');
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
  // 5. SOUND SYSTEM TOGGLE
  // =========================================================================

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    DOM.soundToggle.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');

    if (state.soundEnabled) {
      DOM.soundIcon.textContent = '🔔';
      DOM.soundLabel.textContent = 'Sound On';
      audio.init();
      audio.playChime();
      showToast('Celestial audio enabled! Soft bells and lullabies unlocked.', '🔔');
    } else {
      DOM.soundIcon.textContent = '🔇';
      DOM.soundLabel.textContent = 'Sound Off';
      audio.stopLullaby();
      stopLullabyUI();
      showToast('Sound muted. Peaceful quiet restored.', '🔇');
    }
  }

  // =========================================================================
  // 6. MOBILE NAVIGATION
  // =========================================================================

  function initNav() {
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
  // 7. HERO WISH MAKER & NIMBUS PARALLAX
  // =========================================================================

  function initHero() {
    DOM.heroWishBtn.addEventListener('click', () => {
      makeWish();
    });

    // Subtle pointer movement on desktop
    if (!state.prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
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
    // 1. Create a floating star element inside hero stage
    const star = document.createElement('span');
    star.className = 'spawned-wish-star';
    star.textContent = '✦';

    // Random placement around character
    const left = Math.floor(Math.random() * 70 + 15);
    const top = Math.floor(Math.random() * 60 + 20);

    star.style.left = `${left}%`;
    star.style.top = `${top}%`;

    DOM.heroWishLayer.appendChild(star);

    // Limit active spawned stars to prevent memory/DOM buildup
    const currentStars = DOM.heroWishLayer.querySelectorAll('.spawned-wish-star');
    if (currentStars.length > 15) {
      DOM.heroWishLayer.removeChild(currentStars[0]);
    }

    // Remove star after animation completes
    setTimeout(() => {
      if (star.parentNode) {
        star.parentNode.removeChild(star);
      }
    }, 3000);

    // 2. Play gentle chime
    audio.playChime();

    // 3. Increment telemetry stats
    state.starsMapped += 1;
    DOM.statStarsMapped.textContent = state.starsMapped;

    // 4. Show friendly notification
    showToast('A tiny wish was chartered into the constellation sky! ✨', '⭐');
  }

  // =========================================================================
  // 8. ODD QUIRK: SNEEZE A STAR
  // =========================================================================

  function initQuirk() {
    DOM.tellStoryBtn.addEventListener('click', () => {
      audio.playSparkleSneeze();

      // Trigger star burst around Nimbus
      makeWish();

      // Friendly character reaction
      showToast('Achoo! 🌟 Nimbus sneezed a sparkling star in joy! "What a lovely story!"', '⭐');
    });
  }

  // =========================================================================
  // 9. PROJECT 001: STARSONG RADIO
  // =========================================================================

  function initStarsongRadio() {
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
    DOM.toggleLullabyBtn.setAttribute('aria-pressed', 'true');
    DOM.lullabyBtnIcon.textContent = '⏹️';
    DOM.lullabyBtnLabel.textContent = 'Stop lullaby';

    DOM.projectStarsong.classList.add('is-active-lullaby');
    DOM.radioStatusDot.classList.add('is-playing');
    DOM.radioStatusText.textContent = 'Broadcasting: Pleiades Lullaby (88.5 FM)';

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
    DOM.toggleLullabyBtn.setAttribute('aria-pressed', 'false');
    DOM.lullabyBtnIcon.textContent = '🎵';
    DOM.lullabyBtnLabel.textContent = 'Play my lullaby';

    DOM.projectStarsong.classList.remove('is-active-lullaby');
    DOM.radioStatusDot.classList.remove('is-playing');
    DOM.radioStatusText.textContent = 'Tuned to Pleiades 92.4 FM · Standing by';
  }

  // =========================================================================
  // 10. PROJECT 002: MOONLIGHT BOTTLES
  // =========================================================================

  function initMoonlightBottles() {
    DOM.toggleBottleBtn.addEventListener('click', () => {
      state.bottleLit = !state.bottleLit;
      DOM.bottleStage.setAttribute('data-lit', state.bottleLit ? 'true' : 'false');
      DOM.toggleBottleBtn.setAttribute('aria-pressed', state.bottleLit ? 'true' : 'false');

      if (state.bottleLit) {
        DOM.bottleBtnIcon.textContent = '💡';
        DOM.bottleBtnLabel.textContent = 'Cork & Sleep (Turn Off)';
        DOM.bottleStatusDot.classList.add('is-lit');
        updateBottleStatusText();
        audio.playChime();
        showToast('Bottle uncorked! Warm moonlight fills the room.', '💡');
      } else {
        DOM.bottleBtnIcon.textContent = '✨';
        DOM.bottleBtnLabel.textContent = 'Uncork & Glow (Turn On)';
        DOM.bottleStatusDot.classList.remove('is-lit');
        DOM.bottleStatusText.textContent = 'State: Corked & Sleeping · Glow paused';
        showToast('Bottle corked. Starlight safely resting inside.', '🌙');
      }
    });

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

        // Ensure bottle is turned on when selecting a new color
        if (!state.bottleLit) {
          DOM.toggleBottleBtn.click();
        } else {
          updateBottleStatusText();
          audio.playChime();
        }
      });
    });
  }

  function updateBottleStatusText() {
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
    DOM.sendDreamBtn.addEventListener('click', () => {
      if (state.isDeliveringDream) return;
      deliverDream();
    });
  }

  function deliverDream() {
    state.isDeliveringDream = true;
    DOM.sendDreamBtn.disabled = true;
    DOM.mapStatusDot.classList.add('is-playing');

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

    // Reduced motion shortcut
    if (state.prefersReducedMotion) {
      waypoints.forEach((wp) => wp.chip.classList.add('is-active'));
      DOM.travelingStar.setAttribute('transform', waypoints[2].coord);
      finishDelivery(waypoints[2]);
      return;
    }

    // Step 1: Cloud Bay
    executeWaypointStep(waypoints, 0);
  }

  function executeWaypointStep(waypoints, index) {
    const wp = waypoints[index];

    // Update steps visual
    [DOM.stepBay, DOM.stepMoon, DOM.stepHome].forEach((c, idx) => {
      c.classList.toggle('is-active', idx <= index);
    });

    DOM.travelingStar.setAttribute('transform', wp.coord);
    DOM.mapStatusText.textContent = wp.status;
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
    state.dreamDeliveries += 1;
    DOM.statDreamDeliveries.textContent = String(state.dreamDeliveries).padStart(2, '0');

    setTimeout(() => {
      state.isDeliveringDream = false;
      DOM.sendDreamBtn.disabled = false;
      DOM.mapStatusDot.classList.remove('is-playing');
    }, 1500);
  }

  // =========================================================================
  // 12. ORIGIN STORY: INTERSECTION OBSERVER SCROLL
  // =========================================================================

  function initStoryChapters() {
    const chapters = document.querySelectorAll('.story-chapter');

    if ('IntersectionObserver' in window && !state.prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.2 }
      );

      chapters.forEach((ch) => observer.observe(ch));
    } else {
      chapters.forEach((ch) => ch.classList.add('is-visible'));
    }
  }

  // =========================================================================
  // 13. GUESTBOOK & WISH WALL
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
    let wishes = loadWishes();
    renderWishes(wishes);

    // Character counter
    DOM.wishTextInput.addEventListener('input', () => {
      DOM.charCounter.textContent = DOM.wishTextInput.value.length;
    });

    // Quick Inspiration Prompts
    DOM.quickPromptBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const promptText = btn.getAttribute('data-text');
        DOM.wishTextInput.value = promptText;
        DOM.charCounter.textContent = promptText.length;
        DOM.wishTextInput.focus();
      });
    });

    // Form submission
    DOM.wishForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = DOM.wishAuthorInput.value.trim();
      const text = DOM.wishTextInput.value.trim();

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

      // Increment stats
      state.starsMapped += 1;
      DOM.statStarsMapped.textContent = state.starsMapped;

      // Reset form
      DOM.wishAuthorInput.value = '';
      DOM.wishTextInput.value = '';
      DOM.charCounter.textContent = '0';

      // Feedback
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
    DOM.wishesList.innerHTML = '';
    DOM.wishCountPill.textContent = `${wishes.length} wishes recorded`;

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
  // 14. EASTER EGG — NIMBUS'S SECRET
  // =========================================================================

  function initEasterEgg() {
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

    // Close buttons & backdrop
    DOM.easterCloseBtn.addEventListener('click', closeEasterEgg);
    DOM.easterDismissBtn.addEventListener('click', closeEasterEgg);
    DOM.easterBackdrop.addEventListener('click', closeEasterEgg);

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
    DOM.easterDismissBtn.focus();

    // Spawn celebration sparkles
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        makeWish();
      }, i * 150);
    }
  }

  function closeEasterEgg() {
    DOM.easterModal.setAttribute('hidden', '');
    DOM.easterEggStar.focus();
  }

  // =========================================================================
  // 15. SPARKLE CURSOR TRAIL (DESKTOP BONUS)
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

      // Clean up promptly
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 600);
    });
  }

  // =========================================================================
  // 16. AMBIENT BACKGROUND STARS
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
  // 17. BACK TO TOP
  // =========================================================================

  function initBackToTop() {
    DOM.btnBackToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      DOM.heroWishBtn.focus();
    });
  }

  // =========================================================================
  // 18. INITIALIZATION BOOTSTRAP
  // =========================================================================

  function boot() {
    initTheme();
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

    // Event listener bindings
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.soundToggle.addEventListener('click', toggleSound);

    console.log(
      '%c✦ Nimbus Moonwhisper — The Midnight Observatory loaded peacefully. Good dreams start small! ♡',
      'color: #a34063; font-weight: bold; font-size: 13px;'
    );
  }

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
