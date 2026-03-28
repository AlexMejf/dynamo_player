/**
 * Builds the ambient mode (dynamic video lighting effect).
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {string|null} thumbUrl
 */
export function buildAmbientMode(video, wrapper, thumbUrl) {
  const isAmbient = video.getAttribute('ambientMode') === 'true';
  if (!isAmbient) return;

  const ambientCanvas = document.createElement('canvas');
  ambientCanvas.className = 'dynamo-ambient-canvas';
  wrapper.prepend(ambientCanvas);

  const ambientCtx = ambientCanvas.getContext('2d', { alpha: false });
  let ambientId;

  // Small size = better performance
  ambientCanvas.width = 32;
  ambientCanvas.height = 18;

  const drawStaticAmbient = (sourceElement) => {
    try {
      ambientCtx.drawImage(sourceElement, 0, 0, ambientCanvas.width, ambientCanvas.height);
      wrapper.classList.add('ambient-active');
    } catch (e) {
      console.warn("DynamoPlayer: Ambient mode CORS block on static image.");
    }
  };

  const renderAmbient = () => {
    if (video.paused || video.ended) return;
    try {
      ambientCtx.drawImage(video, 0, 0, ambientCanvas.width, ambientCanvas.height);
    } catch (e) {}
    ambientId = requestAnimationFrame(renderAmbient);
  };

  // Initialization
  if (thumbUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  img.onload = () => drawStaticAmbient(img);
  img.onerror = () => console.warn("DynamoPlayer: Ambient mode thumb failed.");

  // Agregamos un timestamp para saltar el caché solo para el canvas
  const connector = thumbUrl.includes('?') ? '&' : '?';
  img.src = thumbUrl + connector + 't=' + new Date().getTime(); 
}

  video.addEventListener('pause', () => cancelAnimationFrame(ambientId));
  video.addEventListener('ended', () => cancelAnimationFrame(ambientId));
}