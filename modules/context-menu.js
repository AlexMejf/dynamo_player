/* =========================================================
   Dynamo Player — modules/context-menu.js
   Right-click Context Menu orchestrator with zero event-listener leaks.
   Follows the exact same Glassmorphism design tokens as
   the configuration menu.
   ========================================================= */

import { setAspectRatio } from './utils.js';
import {
  showToast,
  takeSnapshot,
  toggleStatsPanel,
  initPinchGestures,
  renderMainTemplate,
  renderAspectTemplate,
  createActionHandler
} from './context-menu/index.js';

export {
  showToast,
  takeSnapshot,
  toggleStatsPanel,
  initPinchGestures,
  renderMainTemplate,
  renderAspectTemplate,
  createActionHandler
};

/**
 * Builds and initializes the right-click context menu for the player.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLElement} wrapper
 * @param {object} ICONS
 * @param {object} state
 * @returns {object} Context menu element and methods
 */
export function buildContextMenu(video, wrapper, ICONS, state) {
  // ── 1. DOM ELEMENTS ──────────────────────────────────────────
  const ctxMenu = document.createElement('div');
  ctxMenu.className = 'dynamo-ctx-menu';
  wrapper.appendChild(ctxMenu);

  let activeAbort = null;
  const statsRef = { interval: null };

  const notifyToast = (msg) => showToast(wrapper, msg);

  // ── 2. CLOSE CONTEXT MENU ────────────────────────────────────
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

  // ── 3. RENDER MENU ITEMS ─────────────────────────────────────
  function renderMenu(view = 'main') {
    if (view === 'main') {
      ctxMenu.innerHTML = renderMainTemplate({ video, wrapper, ICONS, state });
    } else if (view === 'aspect') {
      ctxMenu.innerHTML = renderAspectTemplate({ state });
    }
  }

  // ── 4. OPEN CONTEXT MENU ─────────────────────────────────────
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

  // ── 5. RIGHT-CLICK TRIGGER ON WRAPPER ────────────────────────
  wrapper.addEventListener('contextmenu', (e) => {
    // If context click happened on progress slider or standard inputs, ignore
    if (e.target.tagName === 'INPUT') return;

    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY);
  });

  // ── 6. ACTIONS & EVENT DELEGATION ────────────────────────────
  const executeAction = createActionHandler({
    video,
    wrapper,
    ICONS,
    showToast: notifyToast,
    statsRef
  });

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
    if (e.detail?.silent) return;
    notifyToast(`Aspect: ${e.detail.label}`);
  });

  // ── 7. MOBILE PINCH-TO-ZOOM GESTURE ──────────────────────────
  initPinchGestures({ wrapper, video, state });

  return {
    ctxMenu,
    closeContextMenu,
    openContextMenu
  };
}
