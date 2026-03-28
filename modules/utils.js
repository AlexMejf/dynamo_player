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