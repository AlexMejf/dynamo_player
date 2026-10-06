/* =========================================================
    Dynamo Player — modules/controls.js
    Main controls orchestrator and manager. Coordinates
    template, visibility, playback, progress, volume,
    fullscreen, PiP, shortcuts, preview, and overscreen.
   ========================================================= */

import { buildControls } from './controls/template.js';
import { buildOverscreen } from './controls/overscreen.js';
import { initVisibility } from './controls/visibility.js';
import { initPlayback } from './controls/playback.js';
import { initProgress, getRealDuration } from './controls/progress.js';
import { initProgressPreview } from './controls/preview.js';
import { initVolume } from './controls/volume.js';
import { initFullscreen } from './controls/fullscreen.js';
import { initPip } from './controls/pip.js';
import { initShortcuts } from './controls/shortcuts.js';

export {
  buildControls,
  buildOverscreen,
  initVisibility,
  initPlayback,
  initProgress,
  getRealDuration,
  initProgressPreview,
  initVolume,
  initFullscreen,
  initPip,
  initShortcuts
};

/**
 * Binds all event logic to the already inserted control elements.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {HTMLElement} controls
 * @param {object} ICONS
 * @param {object} state - Shared player state
 * @param {Function} loadVideoSource - To change quality from the menu
 * @returns {object} Controls elements and controllers
 */
export function bindControls(video, wrapper, controls, ICONS, state, loadVideoSource) {
  // --- DOM References ---
  const playBtn                  = controls.querySelector('.dynamo-play-btn');
  const muteBtn                  = controls.querySelector('.dynamo-mute-btn');
  const fsBtn                    = controls.querySelector('.dynamo-fs-btn');
  const pipBtn                   = controls.querySelector('.dynamo-pip-btn');
  const backBtn                  = controls.querySelector('.dynamo-back-btn');
  const fwdBtn                   = controls.querySelector('.dynamo-fwd-btn');
  const progressWrap             = controls.querySelector('.dynamo-progress-wrap');
  const progressFill             = controls.querySelector('.dynamo-progress-fill');
  const progressBuffer           = controls.querySelector('.dynamo-progress-buffer');
  const progressThumb            = controls.querySelector('.dynamo-progress-thumb');
  const timeDisplay              = controls.querySelector('.dynamo-time-display');
  const volRange                 = controls.querySelector('.dynamo-vol-range');
  const progressTooltip          = controls.querySelector('.dynamo-progress-tooltip');
  const progressPreviewContainer = controls.querySelector('.dynamo-progress-preview-container');
  const thumbBox                 = controls.querySelector('.dynamo-progress-thumb-box');

  const poster      = wrapper.querySelector('.dynamo-poster');
  const overlay     = wrapper.querySelector('.dynamo-overlay');
  const menuContext = wrapper.querySelector('.dynamo-menu-context');

  // 1. Inactivity & visibility manager
  const visibility = initVisibility({ wrapper, video, poster, menuContext });

  // 2. Progress / Seekbar manager
  const progress = initProgress({
    video,
    progressWrap,
    progressFill,
    progressBuffer,
    progressThumb,
    timeDisplay
  });

  // 3. Hover thumbnails preview
  initProgressPreview({
    video,
    progressWrap,
    progressTooltip,
    progressPreviewContainer,
    thumbBox
  });

  // 4. Playback manager
  const playback = initPlayback({
    video,
    wrapper,
    playBtn,
    backBtn,
    fwdBtn,
    poster,
    overlay,
    ICONS,
    visibility,
    onEnded: () => progress.cancelSeeking()
  });

  // 5. Volume manager
  const volume = initVolume({ video, volRange, muteBtn, ICONS });

  // 6. Fullscreen manager
  const fullscreen = initFullscreen({ wrapper, fsBtn, ICONS });

  // 7. Picture-in-Picture manager
  const pip = initPip({ video, pipBtn });

  // 8. Keyboard shortcuts
  initShortcuts({ wrapper, video, togglePlay: playback.togglePlay });

  return {
    progressWrap,
    progressFill,
    progressBuffer,
    progressThumb,
    timeDisplay,
    volRange,
    playBtn,
    muteBtn,
    fsBtn,
    pipBtn,
    backBtn,
    fwdBtn,
    controllers: {
      visibility,
      playback,
      progress,
      volume,
      fullscreen,
      pip
    }
  };
}