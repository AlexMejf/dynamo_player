/* =========================================================
   Dynamo Player — modules/icons.js
   Centralizes SVG icons loaded from icons.json with a dynamic
   customization API (supports live runtime overrides).
   ========================================================= */

import defaultIcons from './icons.json';

// Broadcast icon changes to any live players on the page
function notifyIconChange(iconName, svg) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dynamo-icons-updated', {
      detail: { icon: iconName, svg, icons: DynamoIcons }
    }));
  }
}

// Internal icons store initialized with defaults
const iconsStore = { ...defaultIcons };

// Proxy handler to intercept assignments like controls['play'] = '<svg>...'
const iconsProxyHandler = {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    if (prop === 'maximize') {
      return target.fullscreen || defaultIcons.fullscreen || '';
    }
    return defaultIcons[prop] || '';
  },
  set(target, prop, value) {
    target[prop] = value;
    if (prop === 'fullscreen') {
      target.maximize = value;
    } else if (prop === 'maximize') {
      target.fullscreen = value;
    }
    notifyIconChange(prop, value);
    return true;
  }
};

export const DynamoIcons = new Proxy(iconsStore, iconsProxyHandler);

/**
 * Sets or overrides a single icon.
 * @param {string} name
 * @param {string} svg
 */
export function setIcon(name, svg) {
  DynamoIcons[name] = svg;
}

/**
 * Sets or overrides multiple icons at once.
 * @param {Object.<string, string>} customIcons
 */
export function setIcons(customIcons) {
  if (!customIcons || typeof customIcons !== 'object') return;
  Object.keys(customIcons).forEach(key => {
    DynamoIcons[key] = customIcons[key];
  });
}

/**
 * Resets all icons back to the original definitions in icons.json.
 */
export function resetIcons() {
  Object.keys(iconsStore).forEach(key => {
    delete iconsStore[key];
  });
  Object.assign(iconsStore, defaultIcons);
  notifyIconChange('*', null);
}

/**
 * Gets a copy of the default icons from icons.json.
 * @returns {Object.<string, string>}
 */
export function getDefaultIcons() {
  return { ...defaultIcons };
}
