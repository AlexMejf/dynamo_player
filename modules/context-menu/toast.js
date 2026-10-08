/* =========================================================
   Dynamo Player — modules/context-menu/toast.js
   Transient toast notification helper for player events.
   ========================================================= */

/**
 * Displays a transient toast notification within the player wrapper.
 *
 * @param {HTMLElement} wrapper - Player root wrapper element
 * @param {string} message - Notification text message
 */
export function showToast(wrapper, message) {
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
