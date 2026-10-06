/* =========================================================
    Dynamo Player — modules/controls/fullscreen.js
    Fullscreen toggle and fullscreenchange state synchronization.
   ========================================================= */

/**
 * Initializes fullscreen button toggle and events.
 * @param {object} params
 * @param {HTMLElement} params.wrapper
 * @param {HTMLElement} [params.fsBtn]
 * @param {object} params.ICONS
 * @returns {object} Fullscreen controller
 */
export function initFullscreen({ wrapper, fsBtn, ICONS }) {
  if (!fsBtn) return {};

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  fsBtn.onclick = (e) => {
    e.stopPropagation();
    toggleFullscreen();
  };

  // Sync button icon and title on fullscreen state change (including Escape key)
  const onFullscreenChange = () => {
    const isFs = document.fullscreenElement === wrapper;
    fsBtn.innerHTML = isFs ? ICONS.exitFullscreen : (ICONS.fullscreen || ICONS.maximize);
    fsBtn.title = isFs ? 'Exit Fullscreen' : 'Fullscreen';
  };

  document.addEventListener('fullscreenchange', onFullscreenChange);

  return {
    toggleFullscreen
  };
}
