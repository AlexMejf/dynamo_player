/* =========================================================
   Dynamo Player — modules/context-menu/template.js
   HTML markup templates for the context menu and submenus.
   ========================================================= */

import { ASPECT_MODES } from '../utils.js';

/**
 * Generates the HTML markup for the main context menu.
 *
 * @param {object} params
 * @param {HTMLVideoElement} params.video - HTML5 video element
 * @param {HTMLElement} params.wrapper - Player wrapper element
 * @param {object} params.ICONS - SVG icons catalog
 * @param {object} params.state - Player state
 * @returns {string} HTML string
 */
export function renderMainTemplate({ video, wrapper, ICONS, state }) {
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

  return `
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
        <span class="val" style="font-size:11px;opacity:.7;">v1.9</span>
      </li>
    </ul>
  `;
}

/**
 * Generates the HTML markup for the aspect ratio submenu.
 *
 * @param {object} params
 * @param {object} params.state - Player state
 * @returns {string} HTML string
 */
export function renderAspectTemplate({ state }) {
  const currentMode = state.aspectRatio || 'contain';
  const items = ASPECT_MODES.map(m =>
    `<li class="dynamo-menu-item ${currentMode === m.id ? 'selected' : ''}" data-mode="${m.id}">${m.label}</li>`
  ).join('');

  return `
    <div class="dynamo-menu-header" data-target="main"><span style="font-size:18px;">&lsaquo;</span> Aspect ratio</div>
    <ul class="dynamo-menu-list">${items}</ul>
  `;
}
