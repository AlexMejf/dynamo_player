/* =========================================================
   Dynamo Player — modules/context-menu/snapshot.js
   Video frame capture and download with CORS fallback.
   ========================================================= */

import { formatTime } from '../utils.js';

/**
 * Captures the current video frame to a PNG image and initiates browser download.
 * Handles cross-origin restrictions gracefully.
 *
 * @param {HTMLVideoElement} video - HTML5 video element
 * @param {Function} [onToast] - Optional callback to notify the user
 */
export function takeSnapshot(video, onToast) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || video.clientWidth || 1280;
    canvas.height = video.videoHeight || video.clientHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        if (onToast) onToast('Could not capture frame');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const time = formatTime(Math.floor(video.currentTime)).replace(':', 'm') + 's';
      a.href = url;
      a.download = `dynamo-snapshot-${time}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (onToast) onToast('Snapshot downloaded');
    }, 'image/png');
  } catch (err) {
    console.warn('DynamoPlayer: Capture error (possible CORS block).', err);
    if (onToast) onToast('CORS prevented frame capture');
  }
}
