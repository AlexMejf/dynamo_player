/* =========================================================
    Dynamo Player — modules/menu.js
    Contextual Settings Menu:
    Quality, Audio, Speed, and Subtitles.
   ========================================================= */

/**
 * Initializes the settings button and its popup menu.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} menuContext  - The .dynamo-menu-context div
 * @param {HTMLButtonElement} configBtn
 * @param {object} state             - Shared player state
 * @param {Function} loadVideoSource
 */
export function buildMenu(video, menuContext, configBtn, state, loadVideoSource) {

  configBtn.onclick = (e) => {
    e.stopPropagation();
    menuContext.classList.toggle('active');
    if (!menuContext.classList.contains('active')) return;

    // Pause while navigating the menu
    video.paused || video.pause();
    renderMenu('main');
  };

  // Close menu when clicking outside
  document.addEventListener('click', () => menuContext.classList.remove('active'));

  // -------------------------------------------------------
  // View Renderer
  // -------------------------------------------------------
  function renderMenu(view) {
    if (view === 'main')           renderMain();
    else if (view === 'quality')   renderQuality();
    else if (view === 'audio')     renderAudio();
    else if (view === 'speed')     renderSpeed();
    else if (view === 'subtitles') renderSubtitles();

    // "Back" Header — only in sub-views
    const header = menuContext.querySelector('.dynamo-menu-header');
    if (header) {
      header.onclick = (ev) => { ev.stopPropagation(); renderMenu(header.dataset.target); };
    }
  }

  // -------------------------------------------------------
  // Main View
  // -------------------------------------------------------
  function renderMain() {
    let currentQuality = 'Auto';
    if (state.hlsInstance && state.videoSources[0]?.isHlsLevel) {
      const found = state.videoSources.find(s => s.id === state.hlsInstance.currentLevel);
      currentQuality = found ? found.label : 'Auto';
    } else {
      const idx = state.videoSources.findIndex(s => (video._currentSrc || video.src).includes(s.src));
      if (idx !== -1) currentQuality = state.videoSources[idx].label;
    }

    const currentSpeed = video.playbackRate === 1 ? 'Normal' : `${video.playbackRate}x`;
    const currentAudioLabel = state.globalAudioTracks.find(a => a.id === state.activeAudioTrackId)?.label || 'Original';

    const audioRow = state.globalAudioTracks.length > 1 ? `
      <li class="dynamo-menu-item" data-target="audio">
        <span>Audio</span>
        <span class="val">${currentAudioLabel} <span style="font-size:16px;">&rsaquo;</span></span>
      </li>` : '';

    const subsRow = state.globalSubtitles.length > 0 ? `
      <li class="dynamo-menu-item" data-target="subtitles">
        <span>Subtitles</span>
        <span class="val">${state.activeSubtitleLabel} <span style="font-size:16px;">&rsaquo;</span></span>
      </li>` : '';

    menuContext.innerHTML = `
      <ul class="dynamo-menu-list">
        <li class="dynamo-menu-item" data-target="quality">
          <span>Quality</span>
          <span class="val">${currentQuality} <span style="font-size:16px;">&rsaquo;</span></span>
        </li>
        ${audioRow}
        <li class="dynamo-menu-item" data-target="speed">
          <span>Speed</span>
          <span class="val">${currentSpeed} <span style="font-size:16px;">&rsaquo;</span></span>
        </li>
        ${subsRow}
      </ul>
    `;

    menuContext.querySelectorAll('.dynamo-menu-item').forEach(item => {
      item.onclick = (ev) => { ev.stopPropagation(); renderMenu(item.dataset.target); };
    });
  }

  // -------------------------------------------------------
  // Quality View
  // -------------------------------------------------------
  function renderQuality() {
    let activeIndex = 0;
    if (state.hlsInstance && state.videoSources[0]?.isHlsLevel) {
      activeIndex = state.videoSources.findIndex(s => s.id === state.hlsInstance.currentLevel);
    } else {
      const currentSrc = video._currentSrc || video.src;
      activeIndex = state.videoSources.findIndex(s => currentSrc.includes(s.src));
    }

    const items = state.videoSources.map((source, idx) =>
      `<li class="dynamo-menu-item ${activeIndex === idx ? 'selected' : ''}" data-index="${idx}">${source.label}</li>`
    ).join('');

    menuContext.innerHTML = `
      <div class="dynamo-menu-header" data-target="main"><span style="font-size:18px;">&lsaquo;</span> Quality</div>
      <ul class="dynamo-menu-list">${items}</ul>
    `;

    menuContext.querySelectorAll('.dynamo-menu-item').forEach(item => {
      item.onclick = (ev) => {
        ev.stopPropagation();
        if (!item.dataset.index) return;

        const idx = parseInt(item.dataset.index);
        const newSource = state.videoSources[idx];

        if (newSource.isHlsLevel && state.hlsInstance) {
          state.hlsInstance.currentLevel = newSource.id; // Switch without reloading
        } else {
          const currentTime = video.currentTime;
          const wasPlaying = !video.paused;
          loadVideoSource(video, newSource.src, state, () => {});
          setTimeout(() => {
            video.currentTime = currentTime;
            if (wasPlaying) video.play();
          }, 150);
        }
        menuContext.classList.remove('active');
      };
    });
  }

  // -------------------------------------------------------
  // Audio View (HLS multi-audio only)
  // -------------------------------------------------------
  function renderAudio() {
    const items = state.globalAudioTracks.map(track =>
      `<li class="dynamo-menu-item ${state.activeAudioTrackId === track.id ? 'selected' : ''}" data-id="${track.id}">${track.label}</li>`
    ).join('');

    menuContext.innerHTML = `
      <div class="dynamo-menu-header" data-target="main"><span style="font-size:18px;">&lsaquo;</span> Audio Tracks</div>
      <ul class="dynamo-menu-list">${items}</ul>
    `;

    menuContext.querySelectorAll('.dynamo-menu-item').forEach(item => {
      item.onclick = (ev) => {
        ev.stopPropagation();
        if (state.hlsInstance) state.hlsInstance.audioTrack = parseInt(item.dataset.id);
        menuContext.classList.remove('active');
      };
    });
  }

  // -------------------------------------------------------
  // Speed View
  // -------------------------------------------------------
  function renderSpeed() {
    const speeds = [
      { val: 0.5, label: '0.5x' },
      { val: 0.75, label: '0.75x' },
      { val: 1, label: 'Normal' },
      { val: 1.25, label: '1.25x' },
      { val: 1.5, label: '1.5x' },
      { val: 2, label: '2x' }
    ];

    const items = speeds.map(s =>
      `<li class="dynamo-menu-item ${video.playbackRate === s.val ? 'selected' : ''}" data-val="${s.val}">${s.label}</li>`
    ).join('');

    menuContext.innerHTML = `
      <div class="dynamo-menu-header" data-target="main"><span style="font-size:18px;">&lsaquo;</span> Speed</div>
      <ul class="dynamo-menu-list">${items}</ul>
    `;

    menuContext.querySelectorAll('.dynamo-menu-item').forEach(item => {
      item.onclick = (ev) => {
        ev.stopPropagation();
        video.playbackRate = parseFloat(item.dataset.val);
        menuContext.classList.remove('active');
      };
    });
  }

  // -------------------------------------------------------
  // Subtitles View
  // -------------------------------------------------------
  function renderSubtitles() {
    let items = `
      <li class="dynamo-menu-item ${state.activeSubtitleLabel === 'Off' ? 'selected' : ''}"
          data-id="-1" data-label="Off">Off</li>
    `;

    state.globalSubtitles.forEach(sub => {
      const idAttr = sub.isHls ? `data-id="${sub.id}"` : '';
      items += `
        <li class="dynamo-menu-item ${state.activeSubtitleLabel === sub.label ? 'selected' : ''}"
            ${idAttr} data-label="${sub.label}">${sub.label}</li>
      `;
    });

    menuContext.innerHTML = `
      <div class="dynamo-menu-header" data-target="main"><span style="font-size:18px;">&lsaquo;</span> Captions</div>
      <ul class="dynamo-menu-list">${items}</ul>
    `;

    menuContext.querySelectorAll('.dynamo-menu-item').forEach(item => {
      item.onclick = (ev) => {
        ev.stopPropagation();
        // Delegate to the subtitles module
        setSubtitle(video, state, item.dataset.label, item.dataset.id);
        menuContext.classList.remove('active');
      };
    });
  }
}