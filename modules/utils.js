/* =========================================================
    Dynamo Player — modules/utils.js
    Reusable utility functions.
   ========================================================= */

import { rawStyle } from "./style.js";

/**
 * Converts seconds into a readable mm:ss or hh:mm:ss format.
 * @param {number} s - Total seconds
 * @returns {string}
 */
export function formatTime(s) {
  if (isNaN(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
}

/**
 * Creates and animates a ripple effect at (x, y) coordinates within the wrapper.
 * @param {HTMLElement} wrapper
 * @param {number} x
 * @param {number} y
 */
export function ripple(wrapper, x, y) {
  const el = document.createElement('div');
  el.className = 'dynamo-ripple';
  el.style.cssText = `width:80px;height:80px;left:${x - 40}px;top:${y - 40}px;`;
  wrapper.appendChild(el);
  setTimeout(() => el.remove(), 600);
}

/**
 * Injects the player's CSS into the document head if it doesn't already exist.
 */
export function injectCSS() {
  if (document.getElementById('dynamo-player-styles')) return;
  const style = document.createElement('style');
  style.id = 'dynamo-player-styles';
  style.textContent = rawStyle;
  document.head.appendChild(style);
}

/**
 * Supported aspect ratio and screen-fit modes.
 */
export const ASPECT_MODES = [
  { id: 'contain', label: 'Fit (Original)' },
  { id: 'cover',   label: 'Fill (Zoom)' },
  { id: '16-9',    label: '16:9' },
  { id: '4-3',     label: '4:3' }
];

/**
 * Applies the specified aspect ratio / fit mode to the video and wrapper.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {object} state
 * @param {string} mode - 'contain' | 'cover' | '16-9' | '4-3'
 * @returns {string} The active mode's human-readable label
 */
export function setAspectRatio(video, wrapper, state, mode, options = {}) {
  state.aspectRatio = mode;

  wrapper.classList.remove('fit-cover');
  wrapper.style.aspectRatio = '';
  if (video) {
    video.style.aspectRatio = '';
    video.style.objectFit = 'contain';
  }

  if (mode === 'cover') {
    wrapper.classList.add('fit-cover');
    if (video) video.style.objectFit = 'cover';
  } else if (mode === '16-9') {
    wrapper.style.aspectRatio = '16 / 9';
    if (video) video.style.aspectRatio = '16 / 9';
  } else if (mode === '4-3') {
    wrapper.style.aspectRatio = '4 / 3';
    if (video) video.style.aspectRatio = '4 / 3';
  }

  const found = ASPECT_MODES.find(m => m.id === mode);
  const label = found ? found.label : 'Fit';
  wrapper.dispatchEvent(new CustomEvent('dynamo-aspect-change', {
    detail: { mode, label, ...options },
    bubbles: true
  }));
  return label;
}