/* =========================================================
    Dynamo Player — modules/controls/template.js
    HTML construction for the bottom control bar.
   ========================================================= */

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
      <button class="dynamo-btn dynamo-play-btn" title="Play">${ICONS.play}</button>
      <button class="dynamo-btn dynamo-fwd-btn" title="Forward 10s">${ICONS.forward10}</button>
      <div class="dynamo-volume-group">
        <button class="dynamo-btn dynamo-mute-btn" title="Mute">${ICONS.volumeHigh}</button>
        <div class="dynamo-volume-slider">
          <input type="range" min="0" max="1" step="0.02" value="1" class="dynamo-vol-range">
        </div>
      </div>
      <span class="dynamo-spacer"></span>
      <button class="dynamo-btn dynamo-pip-btn" title="Picture in Picture">${ICONS.pip}</button>
      <button class="dynamo-btn dynamo-config-btn" title="Settings">${ICONS.config}</button>
      <span class="dynamo-time dynamo-time-display">0:00 / 0:00</span>
      <button class="dynamo-btn dynamo-fs-btn" title="Fullscreen">${ICONS.fullscreen}</button>
    </div>
  `;
  wrapper.appendChild(controls);
  return controls;
}
