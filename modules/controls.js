/* =========================================================
    Dynamo Player — modules/controls.js
    Control HTML construction and interaction logic:
    progress, volume, PiP, fullscreen, overscreen, and ambient.
   ========================================================= */

import { formatTime, ripple } from './utils.js';

/**
 * Builds and inserts the HTML for the bottom control bar.
 * @param {HTMLElement} wrapper
 * @param {object} ICONS - Object containing SVGs
 * @returns {HTMLElement} The .dynamo-controls element
 */
export function buildControls(wrapper, ICONS) {
  const controls = document.createElement('div');
  controls.className = 'dynamo-controls';
  controls.innerHTML = `
    <div class="dynamo-progress-wrap">
      <div class="dynamo-progress-track">
        <div class="dynamo-progress-buffer"></div>
        <div class="dynamo-progress-fill"></div>
      </div>
      <div class="dynamo-progress-thumb"></div>
      <div class="dynamo-progress-preview-container">
        <div class="dynamo-progress-thumb-box"></div>
        <div class="dynamo-progress-tooltip">0:00</div>
      </div>
    </div>
    <div class="dynamo-bottom">
      <button class="dynamo-btn dynamo-back-btn" title="Back 10s">${ICONS.back10}</button>
      <button class="dynamo-btn dynamo-play-btn">${ICONS.play}</button>
      <button class="dynamo-btn dynamo-fwd-btn" title="Forward 10s">${ICONS.forward10}</button>
      <div class="dynamo-volume-group">
        <button class="dynamo-btn dynamo-mute-btn">${ICONS.volumeHigh}</button>
        <div class="dynamo-volume-slider">
          <input type="range" min="0" max="1" step="0.02" value="1" class="dynamo-vol-range">
        </div>
      </div>
      <span class="dynamo-spacer"></span>
      <button class="dynamo-btn dynamo-pip-btn" title="Mini player">${ICONS.pip}</button>
      <button class="dynamo-btn dynamo-config-btn" title="Settings">${ICONS.config}</button>
      <span class="dynamo-time dynamo-time-display">0:00 / 0:00</span>
      <button class="dynamo-btn dynamo-fs-btn">${ICONS.fullscreen}</button>
    </div>
  `;
  wrapper.appendChild(controls);
  return controls;
}

/**
 * Builds overscreen buttons (layered over the video) if the attribute is active.
 * @param {HTMLElement} wrapper
 * @param {HTMLVideoElement} video
 * @param {object} ICONS
 */
export function buildOverscreen(wrapper, video, ICONS) {
  if (video.getAttribute('controlsOverscreen') !== 'true') return;

  const overscreen = document.createElement('div');
  overscreen.className = 'dynamo-overscreen';
  overscreen.innerHTML = `
    <button class="dynamo-btn-os back-10-os">${ICONS.back10}</button>
    <button class="dynamo-btn-os play-pause-os">${ICONS.play}</button>
    <button class="dynamo-btn-os fwd-10-os">${ICONS.forward10}</button>
  `;
  wrapper.appendChild(overscreen);

  const btnPlayOs = overscreen.querySelector('.play-pause-os');
  video.addEventListener('play',  () => btnPlayOs.innerHTML = ICONS.pause);
  video.addEventListener('pause', () => btnPlayOs.innerHTML = ICONS.play);

  btnPlayOs.onclick = (e) => { e.stopPropagation(); video.paused ? video.play() : video.pause(); };
  overscreen.querySelector('.back-10-os').onclick = (e) => { e.stopPropagation(); video.currentTime -= 10; };
  overscreen.querySelector('.fwd-10-os').onclick  = (e) => { e.stopPropagation(); video.currentTime += 10; };
}

/**
 * Binds all event logic to the already inserted control elements.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {HTMLElement} controls
 * @param {object} ICONS
 * @param {object} state - Shared player state
 * @param {Function} loadVideoSource - To change quality from the menu
 */
export function bindControls(video, wrapper, controls, ICONS, state, loadVideoSource) {
  // --- DOM References ---
  const playBtn        = controls.querySelector('.dynamo-play-btn');
  const muteBtn        = controls.querySelector('.dynamo-mute-btn');
  const fsBtn          = controls.querySelector('.dynamo-fs-btn');
  const pipBtn         = controls.querySelector('.dynamo-pip-btn');
  const backBtn        = controls.querySelector('.dynamo-back-btn');
  const fwdBtn         = controls.querySelector('.dynamo-fwd-btn');
  const progressWrap   = controls.querySelector('.dynamo-progress-wrap');
  const progressFill   = controls.querySelector('.dynamo-progress-fill');
  const progressBuffer = controls.querySelector('.dynamo-progress-buffer');
  const progressThumb  = controls.querySelector('.dynamo-progress-thumb');
  const timeDisplay    = controls.querySelector('.dynamo-time-display');
  const volRange       = controls.querySelector('.dynamo-vol-range');
  const progressTooltip          = controls.querySelector('.dynamo-progress-tooltip');
  const progressPreviewContainer = controls.querySelector('.dynamo-progress-preview-container');
  const thumbBox       = controls.querySelector('.dynamo-progress-thumb-box');

  let isSeeking = false;
  let hideTimer = null;
  let prevVolume = 1;

  // --- UI Helpers ---
  const poster = wrapper.querySelector('.dynamo-poster');
  const overlay = wrapper.querySelector('.dynamo-overlay');
  const menuContext = wrapper.querySelector('.dynamo-menu-context');

  const getRealDuration = () => {
    if (video.duration === Infinity && video.seekable && video.seekable.length > 0) {
      return video.seekable.end(video.seekable.length - 1);
    }
    return video.duration;
  };

  function showUI() {
    if (poster.classList.contains('hidden')) wrapper.classList.remove('hide-controls');
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    if (!video.paused) hideTimer = setTimeout(() => wrapper.classList.add('hide-controls'), 2800);
  }

  function seek(e) {
    const rect = progressWrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const realDuration = getRealDuration();
    if (realDuration && !isNaN(realDuration)) {
      const currentTime = pct * realDuration;
      video.currentTime = currentTime;
      progressFill.style.width = progressThumb.style.left = pct * 100 + '%';
      timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(realDuration)}`;
    }
  }

  const togglePlay = () => video.paused ? video.play() : video.pause();

  // --- Seekbar ---
  progressWrap.addEventListener('mousedown', (e) => { isSeeking = true; seek(e); });
  window.addEventListener('mousemove', (e) => { if (isSeeking) seek(e); });
  window.addEventListener('mouseup', () => { isSeeking = false; });

  // --- Buffer ---
  video.addEventListener('progress', () => {
    if (video.duration > 0 && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      progressBuffer.style.width = (bufferedEnd / video.duration) * 100 + '%';
    }
  });

  // --- Timeupdate ---
  video.addEventListener('timeupdate', () => {
    if (!isSeeking) {
      const realDuration = getRealDuration();
      if (realDuration && !isNaN(realDuration)) {
        const pct = (video.currentTime / realDuration) * 100 + '%';
        progressFill.style.width = progressThumb.style.left = pct;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(realDuration)}`;
      }
    }
  });

  // --- Playback state events ---
  video.addEventListener('play', () => {
    wrapper.classList.add('is-playing');
    playBtn.innerHTML = ICONS.pause;
    poster.classList.add('hidden');
    overlay.classList.remove('visible');
    menuContext.classList.remove('active');
    scheduleHide();
  });

  video.addEventListener('pause', () => {
    wrapper.classList.remove('is-playing');
    playBtn.innerHTML = ICONS.play;
    overlay.classList.add('visible');
    wrapper.classList.remove('hide-controls');
  });

  video.addEventListener('ended', () => {
    playBtn.innerHTML = ICONS.play;
    overlay.classList.add('visible');
    wrapper.classList.remove('hide-controls', 'is-playing');
  });

  // --- Buttons ---
  overlay.onclick = (e) => {
    e.stopPropagation();
    ripple(wrapper, wrapper.offsetWidth / 2, wrapper.offsetHeight / 2);
    togglePlay();
  };

  video.onclick = (e) => {
    ripple(wrapper, e.clientX - wrapper.getBoundingClientRect().left, e.clientY - wrapper.getBoundingClientRect().top);
    togglePlay();
  };

  video.addEventListener('contextmenu', (e) => e.preventDefault());

  playBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };
  backBtn.onclick = (e) => { e.stopPropagation(); video.currentTime -= 10; };
  fwdBtn.onclick  = (e) => { e.stopPropagation(); video.currentTime += 10; };

  // --- Volume ---
  volRange.oninput = (e) => {
    video.volume = e.target.value;
    video.muted = video.volume === 0;
    prevVolume = video.volume;
  };

  muteBtn.onclick = (e) => {
    e.stopPropagation();
    if (video.muted) { video.muted = false; video.volume = prevVolume; }
    else { prevVolume = video.volume; video.muted = true; }
  };

  video.addEventListener('volumechange', () => {
    volRange.value = video.muted ? 0 : video.volume;
    muteBtn.innerHTML = (video.muted || video.volume === 0)
      ? ICONS.volumeMute
      : (video.volume < 0.5 ? ICONS.volumeLow : ICONS.volumeHigh);
  });

  // --- Fullscreen ---
  fsBtn.onclick = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
      fsBtn.innerHTML = ICONS.exitFullscreen;
    } else {
      document.exitFullscreen();
      fsBtn.innerHTML = ICONS.fullscreen;
    }
  };

  // --- Picture-in-Picture ---
  const pip = video.getAttribute('inPicture') === 'true';
  if (pip && document.pictureInPictureEnabled) {
    pipBtn.style.display = 'block';
    pipBtn.onclick = (e) => {
      e.stopPropagation();
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else video.requestPictureInPicture().catch(() => {});
    };
  }

  // --- Show/hide controls ---
  wrapper.onmousemove = () => { showUI(); scheduleHide(); };
  wrapper.setAttribute('tabindex', '0');
  wrapper.onkeydown = (e) => {
    if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight') video.currentTime += 5;
    if (e.code === 'ArrowLeft')  video.currentTime -= 5;
  };

  // --- Progress bar thumbnails ---
  bindProgressPreview(video, progressWrap, progressTooltip, progressPreviewContainer, thumbBox);

  return { progressWrap, progressFill, progressBuffer, progressThumb, timeDisplay, volRange, playBtn, muteBtn, fsBtn, pipBtn, backBtn, fwdBtn };
}

/**
 * Thumbnail preview logic on seekbar hover.
 */
function bindProgressPreview(video, progressWrap, progressTooltip, progressPreviewContainer, thumbBox) {
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
    hiddenVideo.crossOrigin = 'anonymous';

    // Use the lowest quality source available for the ghost video
    hiddenVideo.src = video.src || video._currentSrc || '';

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

    progressTooltip.textContent = formatTime(hoverTime);
    progressPreviewContainer.style.left = `${pct * 100}%`;

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

/**
 * Initializes the Ambient Light effect if the attribute is active.
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {string} thumbUrl
 */
export function buildAmbientMode(video, wrapper, thumbUrl) {
  if (video.getAttribute('ambientMode') !== 'true') return;

  const ambientCanvas = document.createElement('canvas');
  ambientCanvas.className = 'dynamo-ambient-canvas';
  ambientCanvas.width = 32;
  ambientCanvas.height = 18;
  wrapper.prepend(ambientCanvas);

  const ambientCtx = ambientCanvas.getContext('2d', { alpha: false });
  let ambientId;

  const drawStaticAmbient = (sourceElement) => {
    try {
      ambientCtx.drawImage(sourceElement, 0, 0, ambientCanvas.width, ambientCanvas.height);
      wrapper.classList.add('ambient-active');
    } catch (e) {
      console.warn('DynamoPlayer: Ambient mode CORS block on static image.');
    }
  };

  const renderAmbient = () => {
    if (video.paused || video.ended) return;
    try {
      ambientCtx.drawImage(video, 0, 0, ambientCanvas.width, ambientCanvas.height);
    } catch (e) {}
    ambientId = requestAnimationFrame(renderAmbient);
  };

  if (thumbUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => drawStaticAmbient(img);
    img.src = thumbUrl;
  } else {
    video.addEventListener('loadeddata', () => {
      setTimeout(() => drawStaticAmbient(video), 200);
    }, { once: true });
  }

  video.addEventListener('play',  () => { wrapper.classList.add('ambient-active'); renderAmbient(); });
  video.addEventListener('pause', () => cancelAnimationFrame(ambientId));
  video.addEventListener('ended', () => cancelAnimationFrame(ambientId));
}