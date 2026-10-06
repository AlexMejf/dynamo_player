/* =========================================================
    Dynamo Player — modules/controls/pip.js
    Picture-in-Picture mode management.
   ========================================================= */

/**
 * Initializes Picture-in-Picture button if enabled and supported.
 * @param {object} params
 * @param {HTMLVideoElement} params.video
 * @param {HTMLElement} [params.pipBtn]
 * @returns {object} PiP controller
 */
export function initPip({ video, pipBtn }) {
  if (!pipBtn) return {};

  const pip = video.getAttribute('inPicture') === 'true';

  if (pip && document.pictureInPictureEnabled) {
    pipBtn.style.display = 'block';
    pipBtn.onclick = (e) => {
      e.stopPropagation();
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      } else {
        video.requestPictureInPicture().catch(() => {});
      }
    };
  }

  return {
    isPipSupported: Boolean(document.pictureInPictureEnabled)
  };
}
