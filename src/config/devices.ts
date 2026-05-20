import type { DeviceSpec, DeviceId } from '../types';

// ─── Device Registry ─────────────────────────────────────────────────────────
// Dimensions: 1 world-unit ≈ 10mm.  Heights/widths match actual device specs.

export const DEVICES: Record<DeviceId, DeviceSpec> = {

  /* ── iPhone 15 ─────────────────────────────────────── */
  iphone15: {
    id: 'iphone15',
    label: 'iPhone 15',
    brand: 'Apple',
    os: 'ios',
    frameStyle: 'polished-aluminum',
    width: 2.82, height: 5.96, depth: 0.31, cornerRadius: 0.38,
    screenWidth: 2.56, screenHeight: 5.44,
    notch: 'dynamic-island', notchWidth: 0.72, notchHeight: 0.16,
    cameraBar: false, cameraBarWidth: 0, cameraBarHeight: 0,
    cameraModuleW: 1.10, cameraModuleH: 1.10, cameraModuleCornerR: 0.24,
    cameraModuleOffsetX: -0.52, cameraModuleOffsetY: 0.78,
    lenses: [
      { offsetX: -0.20, offsetY:  0.18, radius: 0.135 },
      { offsetX:  0.20, offsetY: -0.18, radius: 0.115 },
    ],
    defaultColor: '#3A3A3C',
    colors: [
      { label: 'Black',  hex: '#3A3A3C' },
      { label: 'Blue',   hex: '#3B5F8A', roughness: 0.25 },
      { label: 'Pink',   hex: '#C9948A', roughness: 0.25 },
      { label: 'Yellow', hex: '#D4B96A', roughness: 0.25 },
      { label: 'Green',  hex: '#5A8A6A', roughness: 0.25 },
    ],
  },

  /* ── iPhone 15 Pro ─────────────────────────────────── */
  'iphone15pro': {
    id: 'iphone15pro',
    label: 'iPhone 15 Pro',
    brand: 'Apple',
    os: 'ios',
    frameStyle: 'titanium',
    width: 2.84, height: 5.76, depth: 0.33, cornerRadius: 0.42,
    screenWidth: 2.58, screenHeight: 5.26,
    notch: 'dynamic-island', notchWidth: 0.72, notchHeight: 0.16,
    cameraBar: false, cameraBarWidth: 0, cameraBarHeight: 0,
    cameraModuleW: 1.30, cameraModuleH: 1.30, cameraModuleCornerR: 0.28,
    cameraModuleOffsetX: -0.55, cameraModuleOffsetY: 0.82,
    lenses: [
      { offsetX: -0.22, offsetY:  0.22, radius: 0.150 },
      { offsetX:  0.22, offsetY:  0.22, radius: 0.125 },
      { offsetX:  0.00, offsetY: -0.22, radius: 0.120 },
    ],
    defaultColor: '#A09A90',
    colors: [
      { label: 'Natural Titanium', hex: '#A09A90', roughness: 0.28 },
      { label: 'Black Titanium',   hex: '#2E2B28', roughness: 0.22 },
      { label: 'White Titanium',   hex: '#E4E2DF', roughness: 0.28 },
      { label: 'Desert Titanium',  hex: '#C8A87A', roughness: 0.28 },
    ],
  },

  /* ── iPad Pro 11" ──────────────────────────────────── */
  'ipad-pro': {
    id: 'ipad-pro',
    label: 'iPad Pro 11"',
    brand: 'Apple',
    os: 'ios',
    frameStyle: 'polished-aluminum',
    width: 5.20, height: 7.12, depth: 0.24, cornerRadius: 0.38,
    screenWidth: 4.80, screenHeight: 6.72,
    notch: 'punch-hole', notchWidth: 0.28, notchHeight: 0.28,
    cameraBar: false, cameraBarWidth: 0, cameraBarHeight: 0,
    cameraModuleW: 0.90, cameraModuleH: 0.90, cameraModuleCornerR: 0.20,
    cameraModuleOffsetX: 0.0, cameraModuleOffsetY: 0.60,
    lenses: [
      { offsetX: 0, offsetY: 0, radius: 0.16 },
    ],
    defaultColor: '#D6D3CF',
    colors: [
      { label: 'Silver',      hex: '#D6D3CF', roughness: 0.18 },
      { label: 'Space Black', hex: '#2A2A2C', roughness: 0.18 },
    ],
  },

  /* ── Samsung Galaxy S24 Ultra ──────────────────────── */
  'galaxy-s24-ultra': {
    id: 'galaxy-s24-ultra',
    label: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    os: 'android',
    frameStyle: 'titanium',
    width: 2.92, height: 6.32, depth: 0.34, cornerRadius: 0.28,
    screenWidth: 2.66, screenHeight: 5.92,
    notch: 'punch-hole', notchWidth: 0.20, notchHeight: 0.20,
    cameraBar: false, cameraBarWidth: 0, cameraBarHeight: 0,
    cameraModuleW: 1.05, cameraModuleH: 1.55, cameraModuleCornerR: 0.18,
    cameraModuleOffsetX: 0.52, cameraModuleOffsetY: 0.88,
    lenses: [
      { offsetX:  0.0,  offsetY:  0.44, radius: 0.14 },
      { offsetX:  0.0,  offsetY:  0.10, radius: 0.18 },
      { offsetX:  0.0,  offsetY: -0.30, radius: 0.14 },
    ],
    defaultColor: '#1C1C1E',
    colors: [
      { label: 'Titanium Black',  hex: '#1C1C1E', roughness: 0.22 },
      { label: 'Titanium Gray',   hex: '#8C8C90', roughness: 0.24 },
      { label: 'Titanium Violet', hex: '#514068', roughness: 0.24 },
      { label: 'Titanium Yellow', hex: '#C8A830', roughness: 0.24 },
      { label: 'Titanium Orange', hex: '#B85A28', roughness: 0.24 },
    ],
  },

  /* ── Google Pixel 8 Pro ─────────────────────────────── */
  'pixel-8-pro': {
    id: 'pixel-8-pro',
    label: 'Pixel 8 Pro',
    brand: 'Google',
    os: 'android',
    frameStyle: 'polished-aluminum',
    width: 2.96, height: 6.28, depth: 0.36, cornerRadius: 0.46,
    screenWidth: 2.68, screenHeight: 5.80,
    notch: 'punch-hole', notchWidth: 0.20, notchHeight: 0.20,
    cameraBar: true, cameraBarWidth: 2.96, cameraBarHeight: 0.58,
    cameraModuleW: 2.50, cameraModuleH: 0.52, cameraModuleCornerR: 0.26,
    cameraModuleOffsetX: 0.0, cameraModuleOffsetY: 0.74,
    lenses: [
      { offsetX: -0.70, offsetY: 0, radius: 0.155 },
      { offsetX:  0.00, offsetY: 0, radius: 0.175 },
      { offsetX:  0.70, offsetY: 0, radius: 0.135 },
    ],
    defaultColor: '#EAE4D8',
    colors: [
      { label: 'Porcelain', hex: '#EAE4D8', roughness: 0.30 },
      { label: 'Obsidian',  hex: '#1C1C1E', roughness: 0.20 },
      { label: 'Bay',       hex: '#4468A0', roughness: 0.28 },
      { label: 'Mint',      hex: '#A8CCBC', roughness: 0.28 },
    ],
  },

  /* ── Samsung Galaxy Tab S9 ─────────────────────────── */
  'galaxy-tab-s9': {
    id: 'galaxy-tab-s9',
    label: 'Galaxy Tab S9',
    brand: 'Samsung',
    os: 'android',
    frameStyle: 'polished-aluminum',
    width: 4.88, height: 7.10, depth: 0.26, cornerRadius: 0.36,
    screenWidth: 4.54, screenHeight: 6.72,
    notch: 'punch-hole', notchWidth: 0.22, notchHeight: 0.22,
    cameraBar: false, cameraBarWidth: 0, cameraBarHeight: 0,
    cameraModuleW: 0.75, cameraModuleH: 0.75, cameraModuleCornerR: 0.16,
    cameraModuleOffsetX: 0.0, cameraModuleOffsetY: 0.55,
    lenses: [
      { offsetX: 0, offsetY: 0, radius: 0.16 },
    ],
    defaultColor: '#3C3A36',
    colors: [
      { label: 'Graphite', hex: '#3C3A36', roughness: 0.18 },
      { label: 'Beige',    hex: '#D2C9BA', roughness: 0.20 },
      { label: 'Lime',     hex: '#B0CC88', roughness: 0.24 },
    ],
  },
};
