/*!
 * Dynamo Player v1.6.0
 * Main file — orchestrates all modules.
 * *
 */
import { DynamoIcons } from './modules/icons.js';
import {  injectCSS } from './modules/utils.js';
import { loadVideoSource } from './modules/hls-engine.js';
import { initSubtitles } from './modules/subtitles.js';
import { buildControls, bindControls, buildOverscreen } from './modules/controls.js';
import { buildMenu } from './modules/menu.js';
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

    if (!video.crossOrigin) video.crossOrigin = 'anonymous';

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
      document.querySelector('.dynamo-overscreen')?.classList.add('hidden');
    };
    const hideLoader = () => {
      loader.classList.remove('active');
      wrapper.classList.remove('hide-controls');
      document.querySelector('.dynamo-overscreen')?.classList.remove('hidden') ;
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
      hlsInstance:         null
    };

    // ── 7. SOURCE PARSING ───────────────────────────────────
    const rawSrc = video.getAttribute('data-src') || video.getAttribute('src');
    const thumbUrl = video.getAttribute('poster'); // Uses 'poster' which is the HTML5 standard

    if (rawSrc) {
      try {
        const parsed = JSON.parse(rawSrc);
        
        // Normalize names for compatibility with both formats
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
        // If not JSON, handle as a simple URL string
        state.videoSources = [{ label: 'Normal', src: rawSrc }];
        loadVideoSource(video, rawSrc, state, () => initSubtitles(video, state));
      }
    }

    // ── 8. POSTER / THUMBNAIL ─────────────────────────────────
    if (thumbUrl) {
      poster.style.backgroundImage = `url(${thumbUrl})`;
    } else {
      showLoader();
      video.addEventListener('loadeddata', () => {
        const originalTime = video.currentTime;
        video.currentTime = video.duration / 2 || 5;
        video.addEventListener('seeked', function capture() {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            poster.style.backgroundImage = `url(${canvas.toDataURL()})`;
          } catch (e) {
            console.warn('DynamoPlayer: CORS capture failed.');
          }
          video.currentTime = originalTime;
          hideLoader();
          video.removeEventListener('seeked', capture);
        }, { once: true });
      }, { once: true });
    }

    // ── 9. CONTROLS ──────────────────────────────────────────
    const controls = buildControls(wrapper, DynamoIcons);

    bindControls(video, wrapper, controls, DynamoIcons, state, loadVideoSource);

    buildOverscreen(wrapper, video, DynamoIcons);

    // ── 10. MENU ──────────────────────────────────────────────
    const configBtn = controls.querySelector('.dynamo-config-btn');
    buildMenu(video, menuContext, configBtn, state, loadVideoSource);

    // ── 11. AMBIENT MODE ──────────────────────────────────────
    buildAmbientMode(video, wrapper, thumbUrl);
  }

  // ── STARTUP ──────────────────────────────────────────────────
  function init() {
    injectCSS();
    document.querySelectorAll('video#dynamoPlayer').forEach(initPlayer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  global.DynamoPlayer = { init };

})(window);