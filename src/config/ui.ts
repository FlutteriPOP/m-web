import type { BgPreset, EnvPreset, CameraPreset } from '../types';

// ─── Background Presets ──────────────────────────────────────────────────────

export const BG_PRESETS: {
  key: BgPreset;
  label: string;
  color: string;
  cssClass: string;
}[] = [
  { key: 'dark',            label: 'Dark',        color: '#060912', cssClass: 'bg-[#060912]' },
  { key: 'midnight',        label: 'Midnight',    color: '#0a0a14', cssClass: 'bg-[#0a0a14]' },
  { key: 'white',           label: 'White',       color: '#f5f5f5', cssClass: 'bg-white' },
  { key: 'gradient-blue',   label: 'Ocean',       color: '#081840', cssClass: 'bg-gradient-to-br from-blue-950 to-indigo-900' },
  { key: 'gradient-purple', label: 'Cosmic',      color: '#0c0520', cssClass: 'bg-gradient-to-br from-purple-950 to-violet-900' },
  { key: 'transparent',     label: 'Transparent', color: 'transparent', cssClass: 'bg-[repeating-conic-gradient(#444_0%_25%,#2a2a2a_0%_50%)] bg-[length:14px_14px]' },
];

// ─── Environment Lighting Presets ────────────────────────────────────────────

export const ENV_PRESETS: {
  key: EnvPreset;
  label: string;
  description: string;
}[] = [
  { key: 'city',   label: 'City',   description: 'Urban ambient' },
  { key: 'studio', label: 'Studio', description: 'Soft box neutral' },
  { key: 'sunset', label: 'Sunset', description: 'Warm golden hour' },
  { key: 'dawn',   label: 'Dawn',   description: 'Soft morning light' },
  { key: 'night',  label: 'Night',  description: 'Dark moody' },
];

// ─── Camera Angle Presets ────────────────────────────────────────────────────

export const CAMERA_PRESETS: {
  key: CameraPreset;
  label: string;
  azimuth: number;
  polar: number;
  distance: number;
}[] = [
  { key: 'front',     label: 'Front',     azimuth: 0,             polar: Math.PI / 2,    distance: 11   },
  { key: 'iso-left',  label: 'Left Iso',  azimuth: -Math.PI / 5,  polar: Math.PI / 2.5,  distance: 12.5 },
  { key: 'iso-right', label: 'Right Iso', azimuth:  Math.PI / 5,  polar: Math.PI / 2.5,  distance: 12.5 },
  { key: 'top-tilt',  label: 'Top Tilt',  azimuth: 0,             polar: Math.PI / 4,    distance: 14   },
  { key: 'hero',      label: 'Hero',      azimuth:  Math.PI / 8,  polar: Math.PI / 2.8,  distance: 10.5 },
];

// ─── Animation Templates ─────────────────────────────────────────────────────

export const ANIMATION_TEMPLATES: {
  key: import('../types').TemplatePreset;
  label: string;
  duration: number; // in seconds
  description: string;
}[] = [
  { key: 'sweep', label: 'Cinematic Sweep', duration: 4, description: 'Sweeps from the side to the front, revealing the device.' },
  { key: 'zoom', label: 'Zoom Reveal', duration: 3.5, description: 'Quickly zooms in from a distance into a tight hero shot.' },
  { key: 'spin', label: '360° Spin', duration: 6, description: 'A smooth 360-degree orbit around the entire device.' },
];
