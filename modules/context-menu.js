/* =========================================================
   Dynamo Player — modules/context-menu.js
   Right-click Context Menu with zero event-listener leaks.
   Follows the exact same Glassmorphism design tokens as
   the configuration menu.
   ========================================================= */

import { formatTime, ASPECT_MODES, setAspectRatio } from './utils.js';

/**
 * Builds and initializes the right-click context menu for the player.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {object} ICONS
 * @param {object} state
 */
export function buildContextMenu(video, wrapper, ICONS, state) {
  // ── 1. DOM ELEMENTS ──────────────────────────────────────────
  const ctxMenu = document.createElement('div');
  ctxMenu.className = 'dynamo-ctx-menu';
  wrapper.appendChild(ctxMenu);

  let activeAbort = null;
  let statsInterval = null;

  // ── 2. TOAST NOTIFICATION HELPER ─────────────────────────────
  function showToast(message) {
    let toast = wrapper.querySelector('.dynamo-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'dynamo-toast';
      wrapper.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('active');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('active');
    }, 1800);
  }

  // ── 3. CLOSE CONTEXT MENU ────────────────────────────────────
  function closeContextMenu() {
    if (!ctxMenu.classList.contains('active')) return;
    ctxMenu.classList.remove('active');

    // Clean up all ephemeral external listeners in one shot
    if (activeAbort) {
      activeAbort.abort();
      activeAbort = null;
    }
    wrapper.dispatchEvent(new CustomEvent('dynamo-ctx-close', { bubbles: true }));
  }

  // ── 4. RENDER MENU ITEMS ─────────────────────────────────────
  function renderMenu(view = 'main') {
    if (view === 'main') renderMain();
    else if (view === 'aspect') renderAspect();
  }

  function renderMain() {
    const isLooping = video.loop;
    const isPiPAvailable = document.pictureInPictureEnabled;
    const isAmbientActive = wrapper.classList.contains('ambient-active');
    const hasAmbientCanvas = !!wrapper.querySelector('.dynamo-ambient-canvas');
    const currentAspect = ASPECT_MODES.find(m => m.id === (state.aspectRatio || 'contain'))?.label || 'Fit (Original)';

    const pipItem = isPiPAvailable ? `
      <li class="dynamo-menu-item" data-action="pip">
        <span class="dynamo-ctx-item-left">
          <span class="dynamo-ctx-icon">${ICONS.pip}</span>
          <span>Picture in Picture</span>
        </span>
      </li>
    ` : '';

    const ambientItem = hasAmbientCanvas ? `
      <li class="dynamo-menu-item ${isAmbientActive ? 'selected' : ''}" data-action="ambient">
        <span class="dynamo-ctx-item-left">
          <span class="dynamo-ctx-icon">${ICONS.sparkles}</span>
          <span>Ambient mode</span>
        </span>
        <span class="val">${isAmbientActive ? ICONS.check : ''}</span>
      </li>
    ` : '';

    ctxMenu.innerHTML = `
      <ul class="dynamo-menu-list">
        <li class="dynamo-menu-item ${isLooping ? 'selected' : ''}" data-action="loop">
          <span class="dynamo-ctx-item-left">
            <span class="dynamo-ctx-icon">${ICONS.loop}</span>
            <span>Loop</span>
          </span>
          <span class="val">${isLooping ? ICONS.check : ''}</span>
        </li>
        <li class="dynamo-menu-item" data-target="aspect">
          <span class="dynamo-ctx-item-left">
            <span class="dynamo-ctx-icon">${ICONS.aspectRatio}</span>
            <span>Aspect ratio</span>
          </span>
          <span class="val">${currentAspect} <span style="font-size:16px;">&rsaquo;</span></span>
        </li>
        <li class="dynamo-menu-item" data-action="snapshot">
          <span class="dynamo-ctx-item-left">
            <span class="dynamo-ctx-icon">${ICONS.camera}</span>
            <span>Take snapshot</span>
          </span>
        </li>
        ${ambientItem}
        ${pipItem}
        <li class="dynamo-menu-item" data-action="stats">
          <span class="dynamo-ctx-item-left">
            <span class="dynamo-ctx-icon">${ICONS.chart}</span>
            <span>Technical stats</span>
          </span>
        </li>
        <li class="dynamo-menu-item" data-action="about">
          <span class="dynamo-ctx-item-left">
            <span class="dynamo-ctx-icon">${ICONS.info}</span>
            <span>About Dynamo Player</span>
          </span>
          <span class="val" style="font-size:11px;opacity:.7;">v1.8</span>
        </li>
      </ul>
    `;
  }

  function renderAspect() {
    const currentMode = state.aspectRatio || 'contain';
    const items = ASPECT_MODES.map(m =>
      `<li class="dynamo-menu-item ${currentMode === m.id ? 'selected' : ''}" data-mode="${m.id}">${m.label}</li>`
    ).join('');

    ctxMenu.innerHTML = `
      <div class="dynamo-menu-header" data-target="main"><span style="font-size:18px;">&lsaquo;</span> Aspect ratio</div>
      <ul class="dynamo-menu-list">${items}</ul>
    `;
  }

  // ── 5. OPEN CONTEXT MENU ─────────────────────────────────────
  function openContextMenu(clientX, clientY) {
    // Close other menus first
    wrapper.dispatchEvent(new CustomEvent('dynamo-close-menu'));
    closeContextMenu();

    // Prepare fresh AbortController for external listeners
    activeAbort = new AbortController();
    const { signal } = activeAbort;

    renderMenu();

    // Calculate clamped coordinates inside wrapper boundaries
    const rect = wrapper.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    ctxMenu.classList.add('active');
    const menuWidth = ctxMenu.offsetWidth || 260;
    const menuHeight = ctxMenu.offsetHeight || 250;

    if (x + menuWidth > rect.width) {
      x = Math.max(8, rect.width - menuWidth - 8);
    }
    if (y + menuHeight > rect.height) {
      y = Math.max(8, rect.height - menuHeight - 8);
    }

    ctxMenu.style.left = `${Math.max(8, x)}px`;
    ctxMenu.style.top = `${Math.max(8, y)}px`;

    // Bind outside click / keyboard dismiss with the signal
    document.addEventListener('pointerdown', (ev) => {
      if (!ctxMenu.contains(ev.target)) {
        closeContextMenu();
      }
    }, { signal, capture: true });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeContextMenu();
    }, { signal });

    window.addEventListener('resize', closeContextMenu, { signal });
    window.addEventListener('scroll', closeContextMenu, { signal, passive: true });

    wrapper.dispatchEvent(new CustomEvent('dynamo-ctx-open', { bubbles: true }));
  }

  // ── 6. RIGHT-CLICK TRIGGER ON WRAPPER ────────────────────────
  wrapper.addEventListener('contextmenu', (e) => {
    // If context click happened on progress slider or standard inputs, ignore
    if (e.target.tagName === 'INPUT') return;

    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY);
  });

  // ── 7. EVENT DELEGATION (SINGLE LISTENER FOR ACTIONS & NAVIGATION) ─
  ctxMenu.addEventListener('click', (e) => {
    // 1. Navigation to subview (e.g. data-target="aspect" or data-target="main")
    const targetItem = e.target.closest('[data-target]');
    if (targetItem) {
      e.stopPropagation();
      renderMenu(targetItem.dataset.target);
      return;
    }

    // 2. Aspect ratio selection (data-mode="...")
    const modeItem = e.target.closest('[data-mode]');
    if (modeItem) {
      e.stopPropagation();
      setAspectRatio(video, wrapper, state, modeItem.dataset.mode);
      closeContextMenu();
      return;
    }

    // 3. Regular actions (data-action="...")
    const actionItem = e.target.closest('[data-action]');
    if (actionItem) {
      e.stopPropagation();
      const action = actionItem.dataset.action;
      closeContextMenu();
      executeAction(action);
      return;
    }
  });

  // Listen to external close requests (e.g. video play, settings menu open)
  wrapper.addEventListener('dynamo-close-menu', closeContextMenu);

  // Sync aspect-change toast notification across all triggers (Settings, Context Menu, Gestures)
  wrapper.addEventListener('dynamo-aspect-change', (e) => {
    showToast(`Aspect: ${e.detail.label}`);
  });

  // ── 8. MOBILE PINCH-TO-ZOOM GESTURE ──────────────────────────
  let touchStartDist = 0;
  let touchHandled = false;

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchHandled = false;
    }
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && touchStartDist > 0 && !touchHandled) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = currentDist - touchStartDist;
      const isCover = (state.aspectRatio === 'cover') || wrapper.classList.contains('fit-cover');

      // Pinch outward (> 45px) -> Zoom to fill without distortion
      if (delta > 45 && !isCover) {
        setAspectRatio(video, wrapper, state, 'cover');
        touchHandled = true;
      }
      // Pinch inward (< -45px) -> Fit to contain
      else if (delta < -45 && isCover) {
        setAspectRatio(video, wrapper, state, 'contain');
        touchHandled = true;
      }
    }
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    touchStartDist = 0;
    touchHandled = false;
  }, { passive: true });

  // ── 9. ACTION EXECUTOR ───────────────────────────────────────
  function executeAction(action) {
    switch (action) {
      case 'loop':
        video.loop = !video.loop;
        showToast(video.loop ? 'Loop enabled' : 'Loop disabled');
        break;

      case 'snapshot':
        takeSnapshot();
        break;

      case 'ambient':
        toggleAmbient();
        break;

      case 'pip':
        togglePiP();
        break;

      case 'stats':
        toggleStatsPanel();
        break;

      case 'about':
        showToast('⚡ Dynamo Player v1.8 — Aex Studios');
        break;
    }
  }

  // ── 10. ACTION IMPLEMENTATIONS ───────────────────────────────

  function takeSnapshot() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || video.clientWidth || 1280;
      canvas.height = video.videoHeight || video.clientHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('Could not capture frame');
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
        showToast('Snapshot downloaded');
      }, 'image/png');
    } catch (err) {
      console.warn('DynamoPlayer: Capture error (possible CORS block).', err);
      showToast('CORS prevented frame capture');
    }
  }

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

  // ── 10. TECHNICAL STATS OVERLAY ("STATS FOR NERDS") ──────────
  function toggleStatsPanel() {
    let panel = wrapper.querySelector('.dynamo-stats-panel');
    if (panel) {
      panel.remove();
      if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
      }
      return;
    }

    panel = document.createElement('div');
    panel.className = 'dynamo-stats-panel';
    panel.innerHTML = `
      <div class="dynamo-stats-header">
        <span>Technical Stats</span>
        <button class="dynamo-stats-close">${ICONS.close}</button>
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

    panel.querySelector('.dynamo-stats-close').onclick = (e) => {
      e.stopPropagation();
      panel.remove();
      if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
      }
    };

    const updateStats = () => {
      if (!panel.parentElement) {
        clearInterval(statsInterval);
        statsInterval = null;
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
    statsInterval = setInterval(updateStats, 500);
  }
}
