/* =========================================================
    Dynamo Player — modules/controls/shortcuts.js
    Keyboard shortcuts (Space, ArrowLeft, ArrowRight).
   ========================================================= */

/**
 * Initializes keyboard shortcuts on the player wrapper.
 * @param {object} params
 * @param {HTMLElement} params.wrapper
 * @param {HTMLVideoElement} params.video
 * @param {Function} params.togglePlay
 */
export function initShortcuts({ wrapper, video, togglePlay }) {
  if (!wrapper) return;

  wrapper.setAttribute('tabindex', '0');

  wrapper.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (typeof togglePlay === 'function') togglePlay();
    } else if (e.code === 'ArrowRight') {
      video.currentTime += 5;
    } else if (e.code === 'ArrowLeft') {
      video.currentTime -= 5;
    }
  });
}
