/* =========================================================
    Dynamo Player — modules/hls-engine.js
    Video source management: HLS (.m3u8) and native MP4.
   ========================================================= */

/**
 * Initializes the HLS.js engine on the given <video> element.
 * Extracts qualities, audio tracks, and subtitles from the manifest.
 *
 * @param {HTMLVideoElement} video
 * @param {string} sourceUrl
 * @param {object} state - Shared player state { videoSources, globalSubtitles, globalAudioTracks, activeAudioTrackId, hlsInstance }
 * @param {Function} onSubtitlesReady - Callback to apply subtitles after parsing
 */
function initHlsEngine(video, sourceUrl, state, onSubtitlesReady) {
  if (typeof window.Hls === 'undefined' || !window.Hls.isSupported()) {
    // Fallback: Safari with native HLS support
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      video.addEventListener('loadedmetadata', onSubtitlesReady, { once: true });
    }
    return;
  }

  if (state.hlsInstance) state.hlsInstance.destroy();

  state.hlsInstance = new window.Hls();
  state.hlsInstance.loadSource(sourceUrl);
  state.hlsInstance.attachMedia(video);

  // Qualities extracted from the main manifest
  state.hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
    if (state.videoSources.length === 1 && data.levels && data.levels.length > 0) {
      state.videoSources = [
        { isHlsLevel: true, id: -1, label: 'Auto', src: sourceUrl },
        ...data.levels.map((l, idx) => ({
          isHlsLevel: true,
          id: idx,
          label: l.height ? `${l.height}p` : `Level ${idx + 1}`,
          src: sourceUrl
        }))
      ].reverse();
    }
    onSubtitlesReady();
  });

  // Multiple audio tracks
  state.hlsInstance.on(window.Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
    if (data.audioTracks && data.audioTracks.length > 1) {
      state.globalAudioTracks = data.audioTracks.map(t => ({
        id: t.id,
        label: t.name || t.lang || `Audio ${t.id}`
      }));
      state.activeAudioTrackId = state.hlsInstance.audioTrack;
    } else {
      state.globalAudioTracks = [];
    }
  });

  // Subtitles embedded in the stream
  state.hlsInstance.on(window.Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
    if (data.subtitleTracks && data.subtitleTracks.length > 0) {
      state.globalSubtitles = data.subtitleTracks.map(t => ({
        id: t.id,
        label: t.name || t.lang || `Subtitle ${t.id}`,
        isHls: true
      }));

      const defaultTrack = data.subtitleTracks.find(t => t.default);
      if (defaultTrack && state.activeSubtitleLabel === 'Off') {
        state.activeSubtitleLabel = defaultTrack.name || defaultTrack.lang;
        state.hlsInstance.subtitleTrack = defaultTrack.id;
      } else if (state.activeSubtitleLabel === 'Off') {
        state.hlsInstance.subtitleTrack = -1;
      }
    }
  });

  // Active audio synchronization
  state.hlsInstance.on(window.Hls.Events.AUDIO_TRACK_SWITCH_DONE, (event, data) => {
    state.activeAudioTrackId = data.id;
  });
}

/**
 * Loads the video URL intelligently:
 * - If it ends in .m3u8 → uses HLS (loading hls.js dynamically if needed)
 * - Otherwise → uses native src and clears HLS traces
 *
 * @param {HTMLVideoElement} video
 * @param {string} sourceUrl
 * @param {object} state - Shared player state
 * @param {Function} onSubtitlesReady
 */
export function loadVideoSource(video, sourceUrl, state, onSubtitlesReady) {
  video._currentSrc = sourceUrl;

  if (sourceUrl.includes('.m3u8')) {
    if (typeof window.Hls === 'undefined') {
      console.log('DynamoPlayer: Loading HLS engine dynamically...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.onload = () => initHlsEngine(video, sourceUrl, state, onSubtitlesReady);
      document.head.appendChild(script);
    } else {
      initHlsEngine(video, sourceUrl, state, onSubtitlesReady);
    }
  } else {
    // Native MP4/WebM source: clear HLS if it was active
    if (state.hlsInstance) {
      state.hlsInstance.destroy();
      state.hlsInstance = null;
      state.globalAudioTracks = [];
      state.activeAudioTrackId = -1;
      state.globalSubtitles = state.globalSubtitles.filter(sub => !sub.isHls);
    }
    video.src = sourceUrl;
    onSubtitlesReady();
  }
}

/**
 * Parses the data-src attribute from the <video> and returns { videoSources, globalSubtitles }.
 * Supports three formats:
 * 1. Simple URL:  "video.mp4"
 * 2. JSON Array:  [{ label, src }, ...]
 * 3. JSON Object: { sources: [...], subtitles: [...] }
 *
 * @param {string} rawSrc
 * @returns {{ videoSources: Array, globalSubtitles: Array }}
 */
