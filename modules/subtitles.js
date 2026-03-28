/* =========================================================
    Dynamo Player — modules/subtitles.js
    Subtitle initialization and control (native and HLS).
   ========================================================= */

/**
 * Injects subtitles as <track> elements into the <video>
 * and applies visibility based on the active label.
 *
 * @param {HTMLVideoElement} video
 * @param {object} state - Shared state { globalSubtitles, activeSubtitleLabel }
 */
export function initSubtitles(video, state) {
  // Clear previous tracks (in case of quality changes)
  video.querySelectorAll('track').forEach(t => t.remove());

  if (state.globalSubtitles.length > 0) {
    state.globalSubtitles.forEach(sub => {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = sub.label;
      track.srclang = sub.srclang || '';
      track.src = sub.src;
      video.appendChild(track);

      // Set as default if applicable
      if (sub.default && state.activeSubtitleLabel === 'Off' && !video._subsInit) {
        state.activeSubtitleLabel = sub.label;
      }
    });
    video._subsInit = true;
  }

  // Apply visibility with a short delay (browser needs time to parse tracks)
  setTimeout(() => applySubtitleVisibility(video, state), 50);
}

/**
 * Iterates through the video's textTracks and shows only the one
 * matching state.activeSubtitleLabel.
 *
 * @param {HTMLVideoElement} video
 * @param {object} state
 */
function applySubtitleVisibility(video, state) {
  if (!video.textTracks) return;
  Array.from(video.textTracks).forEach(track => {
    track.mode = (track.label === state.activeSubtitleLabel) ? 'showing' : 'hidden';
  });
}

/**
 * Changes the active subtitle. Supports both hls.js managed 
 * subtitles and native browser subtitles.
 *
 * @param {HTMLVideoElement} video
 * @param {object} state
 * @param {string} selectedLabel - Subtitle label or 'Off'
 * @param {number|string} hlsId - Track ID in hls.js (-1 to turn off)
 */
function setSubtitle(video, state, selectedLabel, hlsId) {
  state.activeSubtitleLabel = selectedLabel;

  if (state.hlsInstance && state.globalSubtitles.some(s => s.isHls)) {
    state.hlsInstance.subtitleTrack = parseInt(hlsId);
  } else {
    applySubtitleVisibility(video, state);
  }
}