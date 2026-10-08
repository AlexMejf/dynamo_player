/* =========================================================
   Dynamo Player — modules/context-menu/stats.js
   Technical statistics overlay ("Stats for Nerds") manager.
   ========================================================= */

import { formatTime } from '../utils.js';

/**
 * Toggles the "Stats for Nerds" real-time technical diagnostics overlay.
 * Automatically manages periodic metric updates and clears timers on teardown.
 *
 * @param {object} params
 * @param {HTMLElement} params.wrapper - Root player wrapper element
 * @param {HTMLVideoElement} params.video - HTML5 video element
 * @param {object} params.ICONS - SVG icons catalog
 * @param {object} [params.statsRef] - Mutable ref holding active interval
 */
export function toggleStatsPanel({ wrapper, video, ICONS, statsRef }) {
  let panel = wrapper.querySelector('.dynamo-stats-panel');
  if (panel) {
    panel.remove();
    if (statsRef && statsRef.interval) {
      clearInterval(statsRef.interval);
      statsRef.interval = null;
    }
    return;
  }

  panel = document.createElement('div');
  panel.className = 'dynamo-stats-panel';
  panel.innerHTML = `
    <div class="dynamo-stats-header">
      <span>Technical Stats</span>
      <button class="dynamo-stats-close" aria-label="Close stats">${ICONS.close}</button>
    </div>
    <div class="dynamo-stats-body">
      <div class="dynamo-stats-row"><span>Resolution:</span><span class="dynamo-stat-res">-</span></div>
      <div class="dynamo-stats-row"><span>Viewport:</span><span class="dynamo-stat-vp">-</span></div>
      <div class="dynamo-stats-row"><span>Time:</span><span class="dynamo-stat-time">-</span></div>
      <div class="dynamo-stats-row"><span>Buffer:</span><span class="dynamo-stat-buf">-</span></div>
      <div class="dynamo-stats-row"><span>Dropped frames:</span><span class="dynamo-stat-drop">-</span></div>
      <div class="dynamo-stats-row"><span>Speed:</span><span class="dynamo-stat-rate">-</span></div>
      <div class="dynamo-stats-row"><span>Volume:</span><span class="dynamo-stat-vol">-</span></div>
    </div>
  `;
  wrapper.appendChild(panel);

  const cleanup = () => {
    panel.remove();
    if (statsRef && statsRef.interval) {
      clearInterval(statsRef.interval);
      statsRef.interval = null;
    }
  };

  const closeBtn = panel.querySelector('.dynamo-stats-close');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      cleanup();
    };
  }

  const updateStats = () => {
    if (!panel.parentElement) {
      if (statsRef && statsRef.interval) {
        clearInterval(statsRef.interval);
        statsRef.interval = null;
      }
      return;
    }

    // Resolution
    const resEl = panel.querySelector('.dynamo-stat-res');
    if (resEl) resEl.textContent = video.videoWidth ? `${video.videoWidth} × ${video.videoHeight}` : 'Unknown';

    // Viewport
    const vpEl = panel.querySelector('.dynamo-stat-vp');
    if (vpEl) vpEl.textContent = `${wrapper.clientWidth} × ${wrapper.clientHeight}`;

    // Time
    const timeEl = panel.querySelector('.dynamo-stat-time');
    if (timeEl) timeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;

    // Buffer
    const bufEl = panel.querySelector('.dynamo-stat-buf');
    if (bufEl) {
      let ahead = 0;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime && video.currentTime <= video.buffered.end(i)) {
          ahead = video.buffered.end(i) - video.currentTime;
          break;
        }
      }
      bufEl.textContent = `${ahead.toFixed(1)}s`;
    }

    // Dropped frames
    const dropEl = panel.querySelector('.dynamo-stat-drop');
    if (dropEl) {
      if (typeof video.getVideoPlaybackQuality === 'function') {
        const q = video.getVideoPlaybackQuality();
        dropEl.textContent = `${q.droppedVideoFrames} / ${q.totalVideoFrames}`;
      } else {
        dropEl.textContent = 'N/A';
      }
    }

    // Rate
    const rateEl = panel.querySelector('.dynamo-stat-rate');
    if (rateEl) rateEl.textContent = `${video.playbackRate}x`;

    // Volume
    const volEl = panel.querySelector('.dynamo-stat-vol');
    if (volEl) volEl.textContent = video.muted ? 'Muted' : `${Math.round(video.volume * 100)}%`;
  };

  updateStats();
  if (statsRef) {
    if (statsRef.interval) clearInterval(statsRef.interval);
    statsRef.interval = setInterval(updateStats, 500);
  }
}
