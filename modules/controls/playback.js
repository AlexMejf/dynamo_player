/* =========================================================
    Dynamo Player — modules/controls/playback.js
    Play, pause, skip ±10s, overlay/video clicks and state sync.
   ========================================================= */

import { ripple } from '../utils.js';

/**
 * Manages playback actions and syncs player state.
 * @param {object} params
 * @param {HTMLVideoElement} params.video
 * @param {HTMLElement} params.wrapper
 * @param {HTMLElement} [params.playBtn]
 * @param {HTMLElement} [params.backBtn]
 * @param {HTMLElement} [params.fwdBtn]
 * @param {HTMLElement} [params.poster]
 * @param {HTMLElement} [params.overlay]
 * @param {object} params.ICONS
 * @param {object} params.visibility
 * @param {Function} [params.onEnded] - Callback when video ends
 * @returns {object} Playback controller
 */
export function initPlayback({
  video,
  wrapper,
  playBtn,
  backBtn,
  fwdBtn,
  poster,
  overlay,
  ICONS,
  visibility,
  onEnded
}) {
  const togglePlay = () => (video.paused ? video.play() : video.pause());

  // Direct element clicks
  if (overlay) {
    overlay.onclick = (e) => {
      e.stopPropagation();
      ripple(wrapper, wrapper.offsetWidth / 2, wrapper.offsetHeight / 2);
      togglePlay();
    };
  }

  video.onclick = (e) => {
    ripple(
      wrapper,
      e.clientX - wrapper.getBoundingClientRect().left,
      e.clientY - wrapper.getBoundingClientRect().top
    );
    togglePlay();
  };

  if (playBtn) playBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };
  if (backBtn) backBtn.onclick = (e) => { e.stopPropagation(); video.currentTime -= 10; };
  if (fwdBtn)  fwdBtn.onclick  = (e) => { e.stopPropagation(); video.currentTime += 10; };

  // Playback state events
  video.addEventListener('play', () => {
    wrapper.classList.add('is-playing');
    if (playBtn) {
      playBtn.innerHTML = ICONS.pause;
      playBtn.title = 'Pause';
    }
    if (poster) poster.classList.add('hidden');
    if (overlay) overlay.classList.remove('visible');
    wrapper.dispatchEvent(new CustomEvent('dynamo-close-menu'));
    if (visibility && typeof visibility.scheduleHide === 'function') {
      visibility.scheduleHide();
    }
  });

  video.addEventListener('pause', () => {
    if (visibility && typeof visibility.clearHideTimer === 'function') {
      visibility.clearHideTimer();
    }
    wrapper.classList.remove('is-playing', 'hide-controls');
    if (playBtn) {
      playBtn.innerHTML = ICONS.play;
      playBtn.title = 'Play';
    }
    if (overlay) overlay.classList.add('visible');
  });

  video.addEventListener('ended', () => {
    if (visibility && typeof visibility.clearHideTimer === 'function') {
      visibility.clearHideTimer();
    }
    if (typeof onEnded === 'function') onEnded();
    if (playBtn) {
      playBtn.innerHTML = ICONS.play;
      playBtn.title = 'Play';
    }
    if (overlay) overlay.classList.add('visible');
    wrapper.classList.remove('hide-controls', 'is-playing');
    wrapper.dispatchEvent(new CustomEvent('dynamo-close-menu'));
  });

  return {
    togglePlay
  };
}
