/* =========================================================
    Dynamo Player — modules/controls/volume.js
    Volume range slider, mute toggling and state synchronization.
   ========================================================= */

/**
 * Initializes volume control slider and mute toggle button.
 * @param {object} params
 * @param {HTMLVideoElement} params.video
 * @param {HTMLInputElement} [params.volRange]
 * @param {HTMLElement} [params.muteBtn]
 * @param {object} params.ICONS
 * @returns {object} Volume controller
 */
export function initVolume({ video, volRange, muteBtn, ICONS }) {
  let prevVolume = 1;

  if (volRange) {
    volRange.oninput = (e) => {
      video.volume = parseFloat(e.target.value);
      video.muted = video.volume === 0;
      prevVolume = video.volume;
    };
  }

  if (muteBtn) {
    muteBtn.onclick = (e) => {
      e.stopPropagation();
      if (video.muted) {
        video.muted = false;
        video.volume = prevVolume > 0 ? prevVolume : 1;
      } else {
        prevVolume = video.volume;
        video.muted = true;
      }
    };
  }

  video.addEventListener('volumechange', () => {
    if (volRange) volRange.value = video.muted ? 0 : video.volume;
    const isMuted = video.muted || video.volume === 0;
    if (muteBtn) {
      muteBtn.title = isMuted ? 'Unmute' : 'Mute';
      muteBtn.innerHTML = isMuted
        ? ICONS.volumeMute
        : (video.volume < 0.5 ? ICONS.volumeLow : ICONS.volumeHigh);
    }
  });

  return {
    getPrevVolume: () => prevVolume,
    setPrevVolume: (val) => { prevVolume = val; }
  };
}
