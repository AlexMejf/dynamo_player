/* =========================================================
    Dynamo Player — modules/controls/overscreen.js
    Floating overscreen controls (Play/Pause, Skip ±10s).
   ========================================================= */

/**
 * Builds overscreen buttons (layered over the video) if the attribute is active.
 * @param {HTMLElement} wrapper
 * @param {HTMLVideoElement} video
 * @param {object} ICONS
 * @returns {HTMLElement|null} The .dynamo-overscreen element or null if not enabled
 */
export function buildOverscreen(wrapper, video, ICONS) {
  if (video.getAttribute('controlsOverscreen') !== 'true') return null;

  const overscreen = document.createElement('div');
  overscreen.className = 'dynamo-overscreen';
  overscreen.innerHTML = `
    <button class="dynamo-btn-os back-10-os">${ICONS.back10}</button>
    <button class="dynamo-btn-os play-pause-os">${ICONS.play}</button>
    <button class="dynamo-btn-os fwd-10-os">${ICONS.forward10}</button>
  `;
  wrapper.appendChild(overscreen);

  const btnPlayOs = overscreen.querySelector('.play-pause-os');
  video.addEventListener('play',  () => { btnPlayOs.innerHTML = ICONS.pause; });
  video.addEventListener('pause', () => { btnPlayOs.innerHTML = ICONS.play; });

  btnPlayOs.onclick = (e) => {
    e.stopPropagation();
    video.paused ? video.play() : video.pause();
  };
  overscreen.querySelector('.back-10-os').onclick = (e) => {
    e.stopPropagation();
    video.currentTime -= 10;
  };
  overscreen.querySelector('.fwd-10-os').onclick = (e) => {
    e.stopPropagation();
    video.currentTime += 10;
  };

  return overscreen;
}
