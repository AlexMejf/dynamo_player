/* =========================================================
    Dynamo Player — modules/controls/progress.js
    Seekbar, scrubbing, buffer bar and time display logic.
   ========================================================= */

import { formatTime } from '../utils.js';

/**
 * Resolves the true playable duration (handles live streams / Infinity).
 * @param {HTMLVideoElement} video
 * @returns {number}
 */
export function getRealDuration(video) {
  if (video.duration === Infinity && video.seekable && video.seekable.length > 0) {
    return video.seekable.end(video.seekable.length - 1);
  }
  return video.duration;
}

/**
 * Initializes seekbar interactions, progress updates and time indicators.
 * @param {object} params
 * @param {HTMLVideoElement} params.video
 * @param {HTMLElement} [params.progressWrap]
 * @param {HTMLElement} [params.progressFill]
 * @param {HTMLElement} [params.progressBuffer]
 * @param {HTMLElement} [params.progressThumb]
 * @param {HTMLElement} [params.timeDisplay]
 * @returns {object} Progress controller
 */
export function initProgress({
  video,
  progressWrap,
  progressFill,
  progressBuffer,
  progressThumb,
  timeDisplay
}) {
  let isSeeking = false;

  function seek(e) {
    if (!progressWrap) return;
    const rect = progressWrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const realDuration = getRealDuration(video);
    if (realDuration && !isNaN(realDuration)) {
      const currentTime = pct * realDuration;
      video.currentTime = currentTime;
      if (progressFill) progressFill.style.width = pct * 100 + '%';
      if (progressThumb) progressThumb.style.left = pct * 100 + '%';
      if (timeDisplay) timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(realDuration)}`;
    }
  }

  const onWindowMouseMove = (e) => {
    if (isSeeking) seek(e);
  };

  const onWindowMouseUp = () => {
    if (isSeeking) {
      isSeeking = false;
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    }
  };

  const cancelSeeking = () => {
    onWindowMouseUp();
  };

  // Scrubbing start
  if (progressWrap) {
    progressWrap.addEventListener('mousedown', (e) => {
      isSeeking = true;
      seek(e);
      window.addEventListener('mousemove', onWindowMouseMove);
      window.addEventListener('mouseup', onWindowMouseUp);
    });
  }

  // Buffer updates
  video.addEventListener('progress', () => {
    if (video.duration > 0 && video.buffered.length > 0 && progressBuffer) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      progressBuffer.style.width = (bufferedEnd / video.duration) * 100 + '%';
    }
  });

  // Time updates
  video.addEventListener('timeupdate', () => {
    if (!isSeeking) {
      const realDuration = getRealDuration(video);
      if (realDuration && !isNaN(realDuration)) {
        const pct = (video.currentTime / realDuration) * 100 + '%';
        if (progressFill) progressFill.style.width = pct;
        if (progressThumb) progressThumb.style.left = pct;
        if (timeDisplay) {
          timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(realDuration)}`;
        }
      }
    }
  });

  return {
    getRealDuration: () => getRealDuration(video),
    seek,
    cancelSeeking,
    getIsSeeking: () => isSeeking
  };
}
