/* =========================================================
   Dynamo Player — modules/context-menu/gestures.js
   Immersive mobile pinch-to-zoom aspect ratio gestures handler.
   Fluid 60 FPS scaling, spring physics & cinematic glassmorphism badge.
   ========================================================= */

import { setAspectRatio } from '../utils.js';

const GESTURE_ICONS = {
  fill: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
  fit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="10" y1="14" x2="3" y2="21"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

/**
 * Retrieves or lazily creates the floating aspect ratio feedback badge.
 * @param {HTMLElement} wrapper
 * @returns {HTMLElement}
 */
function getPinchBadge(wrapper) {
  let badge = wrapper.querySelector('.dynamo-pinch-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'dynamo-pinch-badge';
    wrapper.appendChild(badge);
  }
  return badge;
}

/**
 * Updates the floating pinch badge text, icon, and visual state.
 * @param {HTMLElement} wrapper
 * @param {object} options
 */
function updatePinchBadge(wrapper, { icon, text, ready = false, success = false }) {
  const badge = getPinchBadge(wrapper);
  clearTimeout(badge._hideTimer);
  badge.innerHTML = `${icon}<span>${text}</span>`;
  badge.classList.add('active');
  badge.classList.toggle('ready', ready);
  badge.classList.toggle('success', success);
}

/**
 * Hides the floating pinch badge.
 * @param {HTMLElement} wrapper
 * @param {number} delay - Optional ms delay before fading out
 */
function hidePinchBadge(wrapper, delay = 0) {
  const badge = wrapper.querySelector('.dynamo-pinch-badge');
  if (!badge) return;
  clearTimeout(badge._hideTimer);
  if (delay <= 0) {
    badge.classList.remove('active', 'ready', 'success');
  } else {
    badge._hideTimer = setTimeout(() => {
      badge.classList.remove('active', 'ready', 'success');
    }, delay);
  }
}

/**
 * Initializes two-finger pinch-to-zoom gestures on mobile devices to toggle aspect ratio.
 * Outward pinch zooms smoothly to fill screen (cover); inward pinch restores fit (contain).
 * Features real-time 60 FPS scale tracking, container boundary clipping and spring snapping.
 *
 * @param {object} params
 * @param {HTMLElement} params.wrapper - Player wrapper element
 * @param {HTMLVideoElement} params.video - HTML5 video element
 * @param {object} params.state - Player state reference
 */
export function initPinchGestures({ wrapper, video, state }) {
  let touchStartDist = 0;
  let isPinching = false;
  let startMode = 'contain';
  let readyToCommit = false;

  // Prevent Safari iOS default viewport scaling gestures over the player
  wrapper.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  wrapper.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      // Don't intercept touches started directly on controls, menus, or interactive sliders
      if (e.target.closest('.dynamo-ctx-menu, .dynamo-menu-context, .dynamo-progress-wrap, input, button')) {
        return;
      }

      e.preventDefault();

      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (touchStartDist < 10) return;

      const isCover = (state.aspectRatio === 'cover') || wrapper.classList.contains('fit-cover');
      startMode = isCover ? 'cover' : 'contain';
      isPinching = true;
      readyToCommit = false;

      wrapper.classList.add('is-pinching');
      video.style.transition = 'none';
      video.style.transformOrigin = 'center center';
    }
  }, { passive: false });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isPinching || e.touches.length !== 2) return;
    e.preventDefault();

    const currentDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );

    const ratio = currentDist / touchStartDist;
    const delta = currentDist - touchStartDist;
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || wrapper.classList.contains('fullscreen'));

    if (startMode === 'contain') {
      // Pinch outward (Zoom In) to fill screen
      let scale = ratio >= 1
        ? 1 + (ratio - 1) * 0.88
        : 1 - (1 - ratio) * 0.35;
      scale = Math.min(Math.max(scale, 0.92), 1.6);

      // Subpixel boundary clipping keeps scaled video strictly within wrapper bounds
      if (scale > 1) {
        const inset = ((1 - 1 / scale) * 50).toFixed(3);
        const radius = isFullscreen ? 0 : Math.round(8 / scale);
        video.style.clipPath = `inset(${inset}% round ${radius}px)`;
      } else {
        video.style.clipPath = '';
      }
      video.style.transform = `scale(${scale.toFixed(4)})`;

      readyToCommit = (scale >= 1.13 || delta >= 36);
      updatePinchBadge(wrapper, {
        icon: GESTURE_ICONS.fill,
        text: readyToCommit ? 'Rellenar pantalla' : 'Zoom para rellenar',
        ready: readyToCommit
      });
    } else {
      // Pinch inward (Zoom Out) to restore original fit
      let scale = ratio <= 1
        ? 1 - (1 - ratio) * 0.88
        : 1 + (ratio - 1) * 0.35;
      scale = Math.min(Math.max(scale, 0.65), 1.12);

      video.style.clipPath = '';
      video.style.transform = `scale(${scale.toFixed(4)})`;

      readyToCommit = (scale <= 0.87 || delta <= -36);
      updatePinchBadge(wrapper, {
        icon: GESTURE_ICONS.fit,
        text: readyToCommit ? 'Ajustar a la pantalla' : 'Pellizca para ajustar',
        ready: readyToCommit
      });
    }
  }, { passive: false });

  function endPinch() {
    if (!isPinching) return;
    isPinching = false;
    touchStartDist = 0;
    wrapper.classList.remove('is-pinching');

    if (startMode === 'contain' && readyToCommit) {
      // Commit into Fill / Cover
      video.style.transition = 'transform 0.22s ease-out, clip-path 0.22s ease-out';
      video.style.transform = 'scale(1)';
      video.style.clipPath = '';
      setAspectRatio(video, wrapper, state, 'cover', { silent: true });

      updatePinchBadge(wrapper, {
        icon: GESTURE_ICONS.check,
        text: 'Rellenar pantalla',
        success: true
      });
      hidePinchBadge(wrapper, 1400);

      setTimeout(() => {
        if (!isPinching) {
          video.style.transition = '';
          video.style.transform = '';
          video.style.clipPath = '';
        }
      }, 250);
    } else if (startMode === 'cover' && readyToCommit) {
      // Commit into Fit / Contain
      video.style.transition = 'transform 0.22s ease-out';
      video.style.transform = 'scale(1)';
      video.style.clipPath = '';
      setAspectRatio(video, wrapper, state, 'contain', { silent: true });

      updatePinchBadge(wrapper, {
        icon: GESTURE_ICONS.check,
        text: 'Ajustado a la pantalla',
        success: true
      });
      hidePinchBadge(wrapper, 1400);

      setTimeout(() => {
        if (!isPinching) {
          video.style.transition = '';
          video.style.transform = '';
          video.style.clipPath = '';
        }
      }, 250);
    } else {
      // Aborted / Below threshold -> Spring back to original state
      video.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), clip-path 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)';
      video.style.transform = 'scale(1)';
      video.style.clipPath = '';
      hidePinchBadge(wrapper, 0);

      setTimeout(() => {
        if (!isPinching) {
          video.style.transition = '';
          video.style.transform = '';
          video.style.clipPath = '';
        }
      }, 260);
    }
  }

  wrapper.addEventListener('touchend', endPinch, { passive: true });
  wrapper.addEventListener('touchcancel', endPinch, { passive: true });
}
