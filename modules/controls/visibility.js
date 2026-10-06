/* =========================================================
    Dynamo Player — modules/controls/visibility.js
    Inactivity timer and controls auto-hiding coordination.
   ========================================================= */

/**
 * Manages visibility and auto-hide behavior for controls and menus.
 * @param {object} params
 * @param {HTMLElement} params.wrapper
 * @param {HTMLVideoElement} params.video
 * @param {HTMLElement} [params.poster]
 * @param {HTMLElement} [params.menuContext]
 * @returns {object} Visibility controller methods
 */
export function initVisibility({ wrapper, video, poster, menuContext }) {
  let hideTimer = null;

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function isMenuOpen() {
    const isSettingsOpen = menuContext ? menuContext.classList.contains('active') : false;
    const isCtxOpen = wrapper.querySelector('.dynamo-ctx-menu')?.classList.contains('active');
    return Boolean(isSettingsOpen || isCtxOpen);
  }

  function showUI() {
    if (poster && poster.classList.contains('hidden')) {
      wrapper.classList.remove('hide-controls');
    }
  }

  function scheduleHide(delay = 2800) {
    clearHideTimer();
    if (isMenuOpen()) return;
    if (!video.paused && !video.ended) {
      hideTimer = setTimeout(() => {
        if (!video.paused && !video.ended && !isMenuOpen()) {
          wrapper.classList.add('hide-controls');
          wrapper.dispatchEvent(new CustomEvent('dynamo-close-menu'));
        }
      }, delay);
    }
  }

  // Mouse interaction
  wrapper.addEventListener('mousemove', () => {
    showUI();
    scheduleHide();
  });

  // Menu coordination
  const onMenuOpen = () => {
    showUI();
    clearHideTimer();
  };

  const onMenuClose = () => {
    scheduleHide();
  };

  wrapper.addEventListener('dynamo-menu-open', onMenuOpen);
  wrapper.addEventListener('dynamo-menu-close', onMenuClose);
  wrapper.addEventListener('dynamo-ctx-open', onMenuOpen);
  wrapper.addEventListener('dynamo-ctx-close', onMenuClose);

  return {
    showUI,
    scheduleHide,
    clearHideTimer,
    isMenuOpen
  };
}
