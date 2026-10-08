/* =========================================================
   Dynamo Player — modules/context-menu/actions.js
   Action executor coordinating right-click menu commands.
   ========================================================= */

import { takeSnapshot } from './snapshot.js';
import { toggleStatsPanel } from './stats.js';

/**
 * Creates an action executor for context menu items.
 *
 * @param {object} params
 * @param {HTMLVideoElement} params.video - HTML5 video element
 * @param {HTMLElement} params.wrapper - Player wrapper element
 * @param {object} params.ICONS - SVG icons catalog
 * @param {Function} params.showToast - Toast notification function
 * @param {object} params.statsRef - Mutable reference holding stats panel state
 * @returns {Function} executeAction(action)
 */
export function createActionHandler({ video, wrapper, ICONS, showToast, statsRef }) {
  function toggleAmbient() {
    const ambientCanvas = wrapper.querySelector('.dynamo-ambient-canvas');
    if (!ambientCanvas) return;
    const isNowActive = !wrapper.classList.contains('ambient-active');
    wrapper.classList.toggle('ambient-active', isNowActive);
    showToast(isNowActive ? 'Ambient mode on' : 'Ambient mode off');
  }

  function togglePiP() {
    if (!document.pictureInPictureEnabled) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    } else {
      video.requestPictureInPicture().catch(() => {});
    }
  }

  return function executeAction(action) {
    switch (action) {
      case 'loop':
        video.loop = !video.loop;
        showToast(video.loop ? 'Loop enabled' : 'Loop disabled');
        break;

      case 'snapshot':
        takeSnapshot(video, showToast);
        break;

      case 'ambient':
        toggleAmbient();
        break;

      case 'pip':
        togglePiP();
        break;

      case 'stats':
        toggleStatsPanel({ wrapper, video, ICONS, statsRef });
        break;

      case 'about':
        showToast('⚡ Dynamo Player v1.9 — Aex Studios');
        break;
    }
  };
}
