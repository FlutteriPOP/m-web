// ─── All shared TypeScript types and interfaces ───────────────────────────────

export type OS = 'ios' | 'android';
export type NotchType = 'dynamic-island' | 'punch-hole' | 'none';
export type FrameStyle = 'polished-aluminum' | 'titanium' | 'matte-glass';
export type DeviceId =
  | 'iphone15'
  | 'iphone15pro'
  | 'ipad-pro'
  | 'galaxy-s24-ultra'
  | 'pixel-8-pro'
  | 'galaxy-tab-s9';

export type BgPreset = 'dark' | 'midnight' | 'white' | 'gradient-blue' | 'gradient-purple' | 'transparent';
export type EnvPreset = 'city' | 'studio' | 'sunset' | 'dawn' | 'night';
export type CameraPreset = 'front' | 'iso-left' | 'iso-right' | 'top-tilt' | 'hero';

/** Camera lens descriptor */
export interface LensConfig {
  offsetX: number;
  offsetY: number;
  radius: number;
}

/** Full device specification */
export interface DeviceSpec {
  id: DeviceId;
  label: string;
  brand: string;
  os: OS;
  frameStyle: FrameStyle;

  // Body dimensions (world-units; 1 unit ≈ 10 mm)
  width: number;
  height: number;
  depth: number;
  cornerRadius: number;

  // Screen
  screenWidth: number;
  screenHeight: number;
  notch: NotchType;
  notchWidth: number;
  notchHeight: number;

  // Back camera
  cameraBar: boolean;         // Pixel-style horizontal bar
  cameraBarWidth: number;
  cameraBarHeight: number;
  cameraModuleW: number;
  cameraModuleH: number;
  cameraModuleCornerR: number;
  cameraModuleOffsetX: number;
  cameraModuleOffsetY: number; // from top-center of back face
  lenses: LensConfig[];

  // Color palette
  defaultColor: string;
  colors: { label: string; hex: string; roughness?: number }[];
}

/** Global app state */
export interface AppState {
  deviceId: DeviceId;
  frameColor: string;
  rotation: [number, number, number];
  bgPreset: BgPreset;
  envPreset: EnvPreset;
  cameraPreset: CameraPreset;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  mediaFileName: string | null;
  bloomIntensity: number;
  dofEnabled: boolean;
}
