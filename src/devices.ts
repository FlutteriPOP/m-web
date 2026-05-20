// Device configuration registry.
// All dimensions are in Three.js world units (1 unit ≈ 10mm for scale)
// screenInset: distance from edge to screen

export type DeviceId =
  | 'iphone15'
  | 'iphone15pro'
  | 'ipad-pro'
  | 'galaxy-s24-ultra'
  | 'pixel-8-pro'
  | 'galaxy-tab-s9';

export type OS = 'ios' | 'android';
export type Notch = 'dynamic-island' | 'pill-hole' | 'none' | 'camera-bar' | 'wide-notch';

export interface DeviceConfig {
  id: DeviceId;
  label: string;
  brand: string;
  os: OS;
  // body proportions
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;
  // screen
  screenWidth: number;
  screenHeight: number;
  screenOffsetY: number; // vertical offset of screen center from body center
  notch: Notch;
  notchWidth: number;
  notchHeight: number;
  // camera
  cameraModuleW: number;
  cameraModuleH: number;
  cameraModuleCorner: number;
  cameraCount: number;
  cameraOffsetX: number; // from left edge (- = left side)
  cameraOffsetY: number; // from top edge
  // material
  defaultColor: string;
  frameStyle: 'flat' | 'rounded' | 'titanium';
}

export const DEVICES: Record<DeviceId, DeviceConfig> = {
  // ───── iOS ─────
  'iphone15': {
    id: 'iphone15',
    label: 'iPhone 15',
    brand: 'Apple',
    os: 'ios',
    width: 2.82,
    height: 5.96,
    depth: 0.31,
    cornerRadius: 0.38,
    screenWidth: 2.56,
    screenHeight: 5.44,
    screenOffsetY: 0,
    notch: 'dynamic-island',
    notchWidth: 0.7,
    notchHeight: 0.17,
    cameraModuleW: 1.0,
    cameraModuleH: 1.0,
    cameraModuleCorner: 0.22,
    cameraCount: 2,
    cameraOffsetX: -0.62,
    cameraOffsetY: -0.68,
    defaultColor: '#3A3A3C',
    frameStyle: 'flat',
  },

  'iphone15pro': {
    id: 'iphone15pro',
    label: 'iPhone 15 Pro',
    brand: 'Apple',
    os: 'ios',
    width: 2.84,
    height: 5.74,
    depth: 0.33,
    cornerRadius: 0.42,
    screenWidth: 2.56,
    screenHeight: 5.24,
    screenOffsetY: 0,
    notch: 'dynamic-island',
    notchWidth: 0.7,
    notchHeight: 0.17,
    cameraModuleW: 1.2,
    cameraModuleH: 1.2,
    cameraModuleCorner: 0.26,
    cameraCount: 3,
    cameraOffsetX: -0.6,
    cameraOffsetY: -0.66,
    defaultColor: '#4A3728',
    frameStyle: 'titanium',
  },

  'ipad-pro': {
    id: 'ipad-pro',
    label: 'iPad Pro 11"',
    brand: 'Apple',
    os: 'ios',
    width: 5.10,
    height: 7.00,
    depth: 0.24,
    cornerRadius: 0.36,
    screenWidth: 4.74,
    screenHeight: 6.60,
    screenOffsetY: 0,
    notch: 'pill-hole',
    notchWidth: 0.3,
    notchHeight: 0.3,
    cameraModuleW: 0.8,
    cameraModuleH: 0.8,
    cameraModuleCorner: 0.18,
    cameraCount: 1,
    cameraOffsetX: -0.0,
    cameraOffsetY: -0.5,
    defaultColor: '#D0D0D0',
    frameStyle: 'flat',
  },

  // ───── Android ─────
  'galaxy-s24-ultra': {
    id: 'galaxy-s24-ultra',
    label: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    os: 'android',
    width: 2.90,
    height: 6.30,
    depth: 0.34,
    cornerRadius: 0.30,
    screenWidth: 2.62,
    screenHeight: 5.86,
    screenOffsetY: 0,
    notch: 'pill-hole',
    notchWidth: 0.22,
    notchHeight: 0.22,
    cameraModuleW: 1.1,
    cameraModuleH: 1.5,
    cameraModuleCorner: 0.18,
    cameraCount: 3,
    cameraOffsetX: 0.0,
    cameraOffsetY: -0.80,
    defaultColor: '#1A1B1E',
    frameStyle: 'flat',
  },

  'pixel-8-pro': {
    id: 'pixel-8-pro',
    label: 'Pixel 8 Pro',
    brand: 'Google',
    os: 'android',
    width: 2.96,
    height: 6.28,
    depth: 0.36,
    cornerRadius: 0.44,
    screenWidth: 2.68,
    screenHeight: 5.78,
    screenOffsetY: 0,
    notch: 'pill-hole',
    notchWidth: 0.22,
    notchHeight: 0.22,
    cameraModuleW: 2.5,  // distinctive horizontal camera bar
    cameraModuleH: 0.55,
    cameraModuleCorner: 0.28,
    cameraCount: 3,
    cameraOffsetX: 0.0,
    cameraOffsetY: -0.68,
    defaultColor: '#D4E3FC',
    frameStyle: 'rounded',
  },

  'galaxy-tab-s9': {
    id: 'galaxy-tab-s9',
    label: 'Galaxy Tab S9',
    brand: 'Samsung',
    os: 'android',
    width: 4.86,
    height: 7.05,
    depth: 0.26,
    cornerRadius: 0.36,
    screenWidth: 4.52,
    screenHeight: 6.68,
    screenOffsetY: 0,
    notch: 'pill-hole',
    notchWidth: 0.24,
    notchHeight: 0.24,
    cameraModuleW: 0.7,
    cameraModuleH: 0.7,
    cameraModuleCorner: 0.15,
    cameraCount: 1,
    cameraOffsetX: 0.0,
    cameraOffsetY: -0.5,
    defaultColor: '#3B3A36',
    frameStyle: 'flat',
  },
};

export const DEVICE_COLORS: Record<string, { label: string; hex: string }[]> = {
  iphone15: [
    { label: 'Black',  hex: '#3A3A3C' },
    { label: 'Blue',   hex: '#2C4E6B' },
    { label: 'Pink',   hex: '#D4A0A0' },
    { label: 'Yellow', hex: '#EED87B' },
    { label: 'Green',  hex: '#7BAE8C' },
  ],
  'iphone15pro': [
    { label: 'Natural Titanium', hex: '#A09A90' },
    { label: 'Black Titanium',   hex: '#2A2420' },
    { label: 'White Titanium',   hex: '#E4E0DC' },
    { label: 'Desert Titanium',  hex: '#C4A882' },
  ],
  'ipad-pro': [
    { label: 'Silver', hex: '#D0D0D0' },
    { label: 'Space Black', hex: '#2A2A2A' },
  ],
  'galaxy-s24-ultra': [
    { label: 'Titanium Black',  hex: '#1A1B1E' },
    { label: 'Titanium Gray',   hex: '#8E8E90' },
    { label: 'Titanium Violet', hex: '#4E3D5C' },
    { label: 'Titanium Yellow', hex: '#E8D060' },
    { label: 'Titanium Orange', hex: '#C8622A' },
  ],
  'pixel-8-pro': [
    { label: 'Porcelain', hex: '#D4E3FC' },
    { label: 'Obsidian',  hex: '#1C1C1C' },
    { label: 'Bay',       hex: '#4A6FA5' },
    { label: 'Mint',      hex: '#B2D4C8' },
  ],
  'galaxy-tab-s9': [
    { label: 'Graphite', hex: '#3B3A36' },
    { label: 'Beige',    hex: '#D4C8B8' },
  ],
};
