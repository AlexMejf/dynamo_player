/* =========================================================
   Dynamo Player — modules/icons.js
   Centralizes SVG icons loaded from icons.json with a dynamic
   customization API (supports live runtime overrides).
   ========================================================= */

import defaultIcons from './icons.json';

function notifyIconChange(iconName, svg) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dynamo-icons-updated', {
      detail: { icon: iconName, svg, icons: DynamoIcons }
    }));
  }
}

// 1. Groups of aliases: each group contains all the names that refer to the same icon
const ALIAS_GROUPS = [
  ['fullscreen', 'maximize'],
  ['settings', 'config'],
  ['forward10', 'forward', 'fwd'],
  ['back10', 'backward', 'back'],
  ['pip', 'pictureInPicture', 'inPicture'],
  ['volumeHigh', 'volume', 'volHigh'],
  ['volumeLow', 'volLow'],
  ['volumeMute', 'mute', 'volMute']
];

// 2. Flattened map: each key points to all its sibling aliases
const ALIAS_MAP = {};
for (const group of ALIAS_GROUPS) {
  for (const key of group) {
    ALIAS_MAP[key] = group;
  }
}

const iconsStore = { ...defaultIcons };

const iconsProxyHandler = {
  get(target, prop) {
    if (prop in target) return target[prop];

    // If it has aliases, we look for the first available in target or defaultIcons
    const synonyms = ALIAS_MAP[prop] || [];
    for (const alias of synonyms) {
      if (alias in target) return target[alias];
      if (alias in defaultIcons) return defaultIcons[alias];
    }

    return defaultIcons[prop] || '';
  },

  set(target, prop, value) {
    target[prop] = value;

    // Automatically update all alias names
    const synonyms = ALIAS_MAP[prop];
    if (synonyms) {
      for (const alias of synonyms) {
        target[alias] = value;
      }
    }

    notifyIconChange(prop, value);
    return true;
  }
};

export const DynamoIcons = new Proxy(iconsStore, iconsProxyHandler);

export function setIcon(name, svg) {
  DynamoIcons[name] = svg;
}

export function setIcons(customIcons) {
  if (!customIcons || typeof customIcons !== 'object') return;
  Object.entries(customIcons).forEach(([key, val]) => {
    DynamoIcons[key] = val;
  });
}

export function resetIcons() {
  Object.keys(iconsStore).forEach(key => delete iconsStore[key]);
  Object.assign(iconsStore, defaultIcons);
  notifyIconChange('*', null);
}

export function getDefaultIcons() {
  return { ...defaultIcons };
}