/* =========================================================
    Dynamo Player — modules/controls/preview.js
    Hover thumbnail preview and tooltip positioning.
   ========================================================= */

import { formatTime } from '../utils.js';

/**
 * Initializes hover thumbnail preview and tooltip over the progress bar.
 * @param {object} params
 * @param {HTMLVideoElement} params.video
 * @param {HTMLElement} [params.progressWrap]
 * @param {HTMLElement} [params.progressTooltip]
 * @param {HTMLElement} [params.progressPreviewContainer]
 * @param {HTMLElement} [params.thumbBox]
 */
export function initProgressPreview({
  video,
  progressWrap,
  progressTooltip,
  progressPreviewContainer,
  thumbBox
}) {
  if (!progressWrap) return;

  const needsAutoThumbs = video.getAttribute('autoThumbnails') === 'true';

  let hiddenVideo = null;
  let hiddenCanvas = null;
  let hiddenCtx = null;
  let isSeekingHidden = false;
  let lastSeekTime = 0;

  if (needsAutoThumbs) {
    hiddenVideo = document.createElement('video');
    hiddenVideo.preload = 'metadata';
    hiddenVideo.muted = true;
    if (video.crossOrigin) {
      hiddenVideo.crossOrigin = video.crossOrigin;
    }

    // Use current source for the ghost video
    hiddenVideo.src = video.src || video._currentSrc || '';

    video.addEventListener('loadstart', () => {
      if (hiddenVideo) {
        hiddenVideo.src = video.src || video._currentSrc || '';
      }
    });

    hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = 160;
    hiddenCanvas.height = 90;
    hiddenCtx = hiddenCanvas.getContext('2d', { alpha: false });

    if (thumbBox) thumbBox.appendChild(hiddenCanvas);
  } else {
    if (thumbBox) thumbBox.style.display = 'none';
  }

  progressWrap.addEventListener('mousemove', (e) => {
    if (!video.duration || isNaN(video.duration)) return;

    const rect = progressWrap.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    const hoverTime = pct * video.duration;

    if (progressTooltip) progressTooltip.textContent = formatTime(hoverTime);
    if (progressPreviewContainer) progressPreviewContainer.style.left = `${pct * 100}%`;

    if (needsAutoThumbs && hiddenVideo && hiddenVideo.readyState >= 2) {
      const now = Date.now();
      if (!isSeekingHidden && (now - lastSeekTime > 100)) {
        isSeekingHidden = true;
        lastSeekTime = now;
        hiddenVideo.currentTime = hoverTime;
        hiddenVideo.addEventListener('seeked', () => {
          try {
            hiddenCtx.drawImage(hiddenVideo, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
          } catch (error) {
            console.warn('DynamoPlayer: Thumbnail capture failed (CORS or render).');
          } finally {
            isSeekingHidden = false;
          }
        }, { once: true });
      }
    }
  });
}
