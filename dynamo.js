/*!
 * Dynamo Player v1.8
 * Main file — orchestrates all modules.
 * *
 */
import { DynamoIcons, setIcon, setIcons, resetIcons, getDefaultIcons } from './modules/icons.js';
import { injectCSS } from './modules/utils.js';
import { loadVideoSource } from './modules/hls-engine.js';
import { initSubtitles } from './modules/subtitles.js';
import { buildControls, bindControls, buildOverscreen } from './modules/controls.js';
import { buildMenu } from './modules/menu.js';
import { buildContextMenu } from './modules/context-menu.js';
import { buildAmbientMode } from './modules/ambient.js';


(function (global) {
  'use strict';

  /**
   * Initializes the player on a <video id="dynamoPlayer"> element.
   * @param {HTMLVideoElement} video
   */
  function initPlayer(video) {
    if (video._dynamoInit) return;
    video._dynamoInit = true;

    // Automatic fallback if CORS was enabled on the element but the remote source does not support it
    video.addEventListener('error', () => {
      if (video.crossOrigin) {
        console.warn('DynamoPlayer: CORS request failed on video source. Retrying in native no-cors mode...');
        const current = video.currentSrc || video.src || video._currentSrc;
        video.removeAttribute('crossorigin');
        video.crossOrigin = null;
        if (current) {
          video.src = current;
          video.load();
        }
      }
    });

    // ── 1. WRAPPER ────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'dynamo-wrapper';
    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);
    wrapper.classList.add('hide-controls');

    // ── 2. POSTER ─────────────────────────────────────────────
    const poster = document.createElement('div');
    poster.className = 'dynamo-poster';
    wrapper.appendChild(poster);

    // ── 3. LOADER ─────────────────────────────────────────────
    const loader = document.createElement('div');
    loader.className = 'dynamo-loader';
    loader.innerHTML = '<div class="dynamo-spinner"></div>';
    wrapper.appendChild(loader);

    const showLoader = () => {
      loader.classList.add('active');
      wrapper.classList.add('hide-controls');
      wrapper.dispatchEvent(new CustomEvent('dynamo-close-menu'));
      wrapper.querySelector('.dynamo-overscreen')?.classList.add('hidden');
    };
    const hideLoader = () => {
      loader.classList.remove('active');
      wrapper.classList.remove('hide-controls');
      wrapper.querySelector('.dynamo-overscreen')?.classList.remove('hidden');
    };
    video.addEventListener('waiting', showLoader);
    video.addEventListener('playing', hideLoader);

    // ── 4. CONTEXT MENU ────────────────────────────────────
    const menuContext = document.createElement('div');
    menuContext.className = 'dynamo-menu-context';
    wrapper.appendChild(menuContext);

    // ── 5. INITIAL OVERLAY ────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.className = 'dynamo-overlay visible';
    overlay.innerHTML = `<div class="dynamo-big-play">${DynamoIcons.play}</div>`;
    wrapper.appendChild(overlay);

    // ── 6. SHARED STATE ──────────────────────────────────
    const state = {
      videoSources:       [],
      globalSubtitles:    [],
      globalAudioTracks:  [],
      activeAudioTrackId: -1,
      activeSubtitleLabel: 'Off',
      hlsInstance:         null,
      aspectRatio:        'contain'
    };

    // ── 7. CONTROLS ──────────────────────────────────────────
    const controls = buildControls(wrapper, DynamoIcons);

    bindControls(video, wrapper, controls, DynamoIcons, state, loadVideoSource);

    buildOverscreen(wrapper, video, DynamoIcons);

    // ── 8. MENU ──────────────────────────────────────────────
    const configBtn = controls.querySelector('.dynamo-config-btn');
    buildMenu(video, menuContext, configBtn, state, loadVideoSource);

    // ── 9. AMBIENT MODE ──────────────────────────────────────
    const thumbUrl = video.getAttribute('poster');
    buildAmbientMode(video, wrapper, thumbUrl);

    // ── 10. CONTEXT MENU ──────────────────────────────────────
    buildContextMenu(video, wrapper, DynamoIcons, state);

    // ── 11. SOURCE LOADER ─────────────────────────────────────
    function applySource(source, posterUrl, autoPlay = false) {
      video.pause();

      if (state.hlsInstance) {
        try { state.hlsInstance.detachMedia(); } catch (e) {}
        state.hlsInstance.destroy();
        state.hlsInstance = null;
      }

      state.videoSources = [];
      state.globalSubtitles = [];
      state.globalAudioTracks = [];
      state.activeAudioTrackId = -1;
      state.activeSubtitleLabel = 'Off';
      video._subsInit = false;

      // Update poster
      if (posterUrl) {
        poster.style.backgroundImage = `url(${posterUrl})`;
        poster.classList.remove('hidden');
      } else {
        poster.style.backgroundImage = '';
        poster.classList.add('hidden');
      }

      overlay.classList.add('visible');
      wrapper.classList.remove('is-playing');
      wrapper.classList.add('hide-controls');

      // Reset controls UI state
      const playBtn = wrapper.querySelector('.dynamo-play-btn');
      if (playBtn) playBtn.innerHTML = DynamoIcons.play;
      const playOs = wrapper.querySelector('.play-pause-os');
      if (playOs) playOs.innerHTML = DynamoIcons.play;

      const progressFill = wrapper.querySelector('.dynamo-progress-fill');
      const progressThumb = wrapper.querySelector('.dynamo-progress-thumb');
      const timeDisplay = wrapper.querySelector('.dynamo-time-display');
      if (progressFill) progressFill.style.width = '0%';
      if (progressThumb) progressThumb.style.left = '0%';
      if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';

      const srcStr = source || '';
      if (srcStr) {
        try {
          const parsed = JSON.parse(srcStr);
          state.videoSources = parsed.videoSources || parsed.sources || [];
          state.globalSubtitles = parsed.globalSubtitles || parsed.subtitles || [];

          if (state.videoSources.length > 0) {
            loadVideoSource(
              video,
              state.videoSources[0].src,
              state,
              () => initSubtitles(video, state)
            );
          }
        } catch (e) {
          state.videoSources = [{ label: 'Default', src: srcStr }];
          loadVideoSource(video, srcStr, state, () => initSubtitles(video, state));
        }
      }

      if (autoPlay && srcStr) {
        setTimeout(() => {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              overlay.classList.remove('visible');
              poster.classList.add('hidden');
              wrapper.classList.add('is-playing');
              wrapper.classList.remove('hide-controls');
            }).catch(() => {
              overlay.classList.add('visible');
            });
          }
        }, 120);
      } else if (!posterUrl && srcStr && !srcStr.includes('.m3u8')) {
        // Fallback frame capture only when not autoplaying and no poster provided
        video.addEventListener('loadeddata', function capture() {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            poster.style.backgroundImage = `url(${canvas.toDataURL()})`;
            if (video.paused && !autoPlay) {
              poster.classList.remove('hidden');
            }
          } catch (e) {
            // CORS restriction or tainted canvas: keep poster hidden so native video frame is visible
            poster.style.backgroundImage = '';
            poster.classList.add('hidden');
          }
          video.removeEventListener('loadeddata', capture);
        }, { once: true });
      }
    }

    const rawSrc = video.getAttribute('data-src') || video.getAttribute('src');
    applySource(rawSrc, thumbUrl, false);

    // ── 12. LIVE ICON UPDATES ─────────────────────────────────
    function refreshIcons(iconName) {
      const match = (name) => !iconName || iconName === '*' || iconName === name;

      if (match('play')) {
        const bigPlay = wrapper.querySelector('.dynamo-big-play');
        if (bigPlay) bigPlay.innerHTML = DynamoIcons.play;
        if (video.paused) {
          const playBtn = wrapper.querySelector('.dynamo-play-btn');
          if (playBtn) playBtn.innerHTML = DynamoIcons.play;
          const playOs = wrapper.querySelector('.play-pause-os');
          if (playOs) playOs.innerHTML = DynamoIcons.play;
        }
      }
      if (match('pause') && !video.paused) {
        const playBtn = wrapper.querySelector('.dynamo-play-btn');
        if (playBtn) playBtn.innerHTML = DynamoIcons.pause;
        const playOs = wrapper.querySelector('.play-pause-os');
        if (playOs) playOs.innerHTML = DynamoIcons.pause;
      }
      if (match('back10')) {
        const backBtn = wrapper.querySelector('.dynamo-back-btn');
        if (backBtn) backBtn.innerHTML = DynamoIcons.back10;
        const backOs = wrapper.querySelector('.back-10-os');
        if (backOs) backOs.innerHTML = DynamoIcons.back10;
      }
      if (match('forward10')) {
        const fwdBtn = wrapper.querySelector('.dynamo-fwd-btn');
        if (fwdBtn) fwdBtn.innerHTML = DynamoIcons.forward10;
        const fwdOs = wrapper.querySelector('.fwd-10-os');
        if (fwdOs) fwdOs.innerHTML = DynamoIcons.forward10;
      }
      if (match('volumeHigh') || match('volumeLow') || match('volumeMute')) {
        const muteBtn = wrapper.querySelector('.dynamo-mute-btn');
        if (muteBtn) {
          muteBtn.innerHTML = (video.muted || video.volume === 0)
            ? DynamoIcons.volumeMute
            : (video.volume < 0.5 ? DynamoIcons.volumeLow : DynamoIcons.volumeHigh);
        }
      }
      if (match('fullscreen') || match('exitFullscreen') || match('maximize')) {
        const fsBtn = wrapper.querySelector('.dynamo-fs-btn');
        if (fsBtn) {
          fsBtn.innerHTML = document.fullscreenElement ? DynamoIcons.exitFullscreen : (DynamoIcons.fullscreen || DynamoIcons.maximize);
        }
      }
      if (match('config')) {
        const configBtn = wrapper.querySelector('.dynamo-config-btn');
        if (configBtn) configBtn.innerHTML = DynamoIcons.config;
      }
      if (match('pip')) {
        const pipBtn = wrapper.querySelector('.dynamo-pip-btn');
        if (pipBtn) pipBtn.innerHTML = DynamoIcons.pip;
      }
    }

    const onIconsUpdated = (e) => refreshIcons(e.detail?.icon);
    window.addEventListener('dynamo-icons-updated', onIconsUpdated);

    // Attach instance API to the video element
    video.dynamoPlayer = {
      loadSource: (src, poster, autoPlay = true) => applySource(src, poster, autoPlay),
      setIcons: (customIcons) => setIcons(customIcons),
      icons: DynamoIcons,
      refreshIcons: (name) => refreshIcons(name),
      getState: () => state,
      getWrapper: () => wrapper
    };
  }

  // ── STARTUP ──────────────────────────────────────────────────
  function init(target) {
    injectCSS();
    if (typeof target === 'string') {
      document.querySelectorAll(target).forEach(initPlayer);
    } else if (target instanceof HTMLElement) {
      initPlayer(target);
    } else if (target && target.forEach) {
      target.forEach(initPlayer);
    } else {
      document.querySelectorAll('video#dynamoPlayer, video.dynamo-player, video[data-dynamo]').forEach(initPlayer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

  // Public API
  global.DynamoPlayer = {
    init,
    loadSource: (target, src, poster, autoPlay = true) => {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el && el.dynamoPlayer) {
        el.dynamoPlayer.loadSource(src, poster, autoPlay);
      } else if (el) {
        if (src) el.setAttribute('data-src', src);
        if (poster) el.setAttribute('poster', poster);
        init(el);
      }
    },
    icons: DynamoIcons,
    controls: DynamoIcons, // Customization alias: controls['play'] = '<svg>'
    setIcon,
    setIcons,
    resetIcons,
    getDefaultIcons,
    version: typeof __VERSION__ !== 'undefined' ? __VERSION__ : '1.8.0',
  };

  // Expose global controls alias if not already taken, allowing controls['play'] = '<svg>'
  if (typeof global.controls === 'undefined') {
    global.controls = DynamoIcons;
  }

})(window);