import React, { useState } from 'react';
import {
  Upload, Image as ImageIcon, Video, Palette,
  SlidersHorizontal, LayoutTemplate, Layers, ChevronDown,
  Monitor, Square, RotateCcw, Camera, Sun, Smartphone
} from 'lucide-react';
import { DEVICES, DEVICE_COLORS, type DeviceId } from '../../devices';

export type BgPreset = 'dark' | 'white' | 'gradient-blue' | 'gradient-purple' | 'transparent';
export type EnvPreset = 'city' | 'studio' | 'sunset' | 'dawn' | 'night';
export type CameraPreset = 'front' | 'iso-left' | 'iso-right' | 'top-tilt' | 'hero';

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

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onExportImage: () => void;
  onRecordToggle: () => void;
  isRecording: boolean;
}

const bgPresets: { key: BgPreset; label: string; style: string }[] = [
  { key: 'dark',            label: 'Dark',       style: 'bg-[#0d1117]' },
  { key: 'white',           label: 'White',      style: 'bg-white' },
  { key: 'gradient-blue',   label: 'Ocean',      style: 'bg-gradient-to-br from-blue-900 to-indigo-800' },
  { key: 'gradient-purple', label: 'Cosmic',     style: 'bg-gradient-to-br from-purple-950 to-indigo-900' },
  { key: 'transparent',     label: 'None (PNG)', style: 'bg-[repeating-conic-gradient(#555_0%_25%,#333_0%_50%)] bg-[length:12px_12px]' },
];

const envPresets: { key: EnvPreset; label: string }[] = [
  { key: 'city',   label: 'City'   },
  { key: 'studio', label: 'Studio' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'dawn',   label: 'Dawn'   },
  { key: 'night',  label: 'Night'  },
];

const cameraPresets: { key: CameraPreset; label: string; icon: React.ReactNode }[] = [
  { key: 'front',     label: 'Front',     icon: <Monitor size={13} /> },
  { key: 'iso-left',  label: 'Left Iso',  icon: <Square size={13} />  },
  { key: 'iso-right', label: 'Right Iso', icon: <Square size={13} style={{ transform: 'scaleX(-1)' }} /> },
  { key: 'top-tilt',  label: 'Top Tilt',  icon: <Layers size={13} />  },
  { key: 'hero',      label: 'Hero',      icon: <Camera size={13} />  },
];

type Tab = 'device' | 'environment' | 'export';

// Group devices by OS
const iosDevices = Object.values(DEVICES).filter(d => d.os === 'ios');
const androidDevices = Object.values(DEVICES).filter(d => d.os === 'android');

export function Sidebar({ state, setState, onExportImage, onRecordToggle, isRecording }: SidebarProps) {
  const [tab, setTab] = useState<Tab>('device');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const set = <K extends keyof AppState>(key: K, val: AppState[K]) =>
    setState(prev => ({ ...prev, [key]: val }));

  const handleDeviceChange = (id: DeviceId) => {
    const device = DEVICES[id];
    const colors = DEVICE_COLORS[id];
    setState(prev => ({
      ...prev,
      deviceId: id,
      frameColor: colors?.[0]?.hex ?? device.defaultColor,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (state.mediaUrl) URL.revokeObjectURL(state.mediaUrl);
    const url = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      mediaUrl: url,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      mediaFileName: file.name,
    }));
  };

  const updateRot = (axis: 0 | 1 | 2, val: number) => {
    const r = [...state.rotation] as [number, number, number];
    r[axis] = val;
    set('rotation', r);
  };

  const colorOptions = DEVICE_COLORS[state.deviceId] ?? [];

  return (
    <aside className="absolute left-4 top-16 bottom-4 w-[17.5rem] glass-panel rounded-2xl flex flex-col z-20 overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center gap-0.5 px-3 pt-3 pb-2 border-b border-white/5 flex-shrink-0">
        {(['device', 'environment', 'export'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab-btn capitalize ${tab === t ? 'active' : ''}`}
          >{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">

        {/* ══════════ DEVICE TAB ══════════ */}
        {tab === 'device' && (
          <div className="space-y-5 fade-up">

            {/* Device Selector */}
            <Section icon={<Smartphone size={13} />} title="iOS Devices">
              <div className="grid grid-cols-2 gap-1.5">
                {iosDevices.map(d => (
                  <DeviceCard
                    key={d.id} device={d}
                    active={state.deviceId === d.id}
                    onClick={() => handleDeviceChange(d.id)}
                  />
                ))}
              </div>
            </Section>

            <Section icon={<Smartphone size={13} />} title="Android Devices">
              <div className="grid grid-cols-2 gap-1.5">
                {androidDevices.map(d => (
                  <DeviceCard
                    key={d.id} device={d}
                    active={state.deviceId === d.id}
                    onClick={() => handleDeviceChange(d.id)}
                  />
                ))}
              </div>
            </Section>

            {/* Color Options */}
            {colorOptions.length > 0 && (
              <Section icon={<Palette size={13} />} title="Frame Color">
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(({ label, hex }) => (
                    <button
                      key={hex}
                      onClick={() => set('frameColor', hex)}
                      title={label}
                      className={`color-swatch ${state.frameColor === hex ? 'active' : ''}`}
                      style={{ background: hex }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/25 mt-1">
                  {colorOptions.find(c => c.hex === state.frameColor)?.label ?? ''}
                </p>
              </Section>
            )}

            {/* Screen Upload */}
            <Section icon={<Upload size={13} />} title="Screen Content">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all text-xs font-medium text-white/60 hover:text-white flex items-center justify-center gap-2"
              >
                <Upload size={12} />
                {state.mediaFileName
                  ? <span className="truncate max-w-[140px]">{state.mediaFileName}</span>
                  : 'Upload Image or Video'
                }
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,video/mp4,video/webm" onChange={handleFile} className="hidden" />
            </Section>

            {/* Camera Presets */}
            <Section icon={<LayoutTemplate size={13} />} title="Camera Angle">
              <div className="grid grid-cols-2 gap-1.5">
                {cameraPresets.map(({ key, label, icon }) => (
                  <button key={key} onClick={() => set('cameraPreset', key)}
                    className={`preset-btn rounded-lg px-2.5 py-2 text-[11px] font-medium text-white/60 flex items-center gap-1.5 ${state.cameraPreset === key ? 'active' : ''}`}
                  >
                    <span className="text-white/30">{icon}</span>{label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Manual Rotation */}
            <Section icon={<SlidersHorizontal size={13} />} title="Manual Rotation">
              {(['X', 'Y', 'Z'] as const).map((axis, i) => (
                <div key={axis} className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/35">
                    <span className="text-white/55 font-medium">{axis} Axis</span>
                    <span>{Math.round((state.rotation[i as 0|1|2] * 180) / Math.PI)}°</span>
                  </div>
                  <input type="range" min={-Math.PI} max={Math.PI} step={0.01}
                    value={state.rotation[i as 0|1|2]}
                    onChange={e => updateRot(i as 0|1|2, parseFloat(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              ))}
              <button onClick={() => set('rotation', [0, 0, 0])}
                className="mt-1 w-full flex items-center justify-center gap-1.5 text-[10px] text-white/25 hover:text-white/55 transition-colors"
              >
                <RotateCcw size={10} /> Reset
              </button>
            </Section>
          </div>
        )}

        {/* ══════════ ENVIRONMENT TAB ══════════ */}
        {tab === 'environment' && (
          <div className="space-y-5 fade-up">
            <Section icon={<Square size={13} />} title="Background">
              <div className="space-y-1">
                {bgPresets.map(({ key, label, style }) => (
                  <button key={key} onClick={() => set('bgPreset', key)}
                    className={`preset-btn w-full rounded-lg px-3 py-2 text-[11px] font-medium text-white/60 flex items-center gap-2.5 ${state.bgPreset === key ? 'active' : ''}`}
                  >
                    <div className={`w-4 h-4 rounded flex-shrink-0 ${style} border border-white/10`} />
                    {label}
                    {state.bgPreset === key && <span className="ml-auto text-blue-400/60 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon={<Sun size={13} />} title="Lighting">
              <div className="space-y-1">
                {envPresets.map(({ key, label }) => (
                  <button key={key} onClick={() => set('envPreset', key)}
                    className={`preset-btn w-full rounded-lg px-3 py-2 text-[11px] font-medium text-white/60 flex items-center gap-2 ${state.envPreset === key ? 'active' : ''}`}
                  >
                    {label}
                    {state.envPreset === key && <span className="ml-auto text-blue-400/60 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon={<Layers size={13} />} title="Post-Processing">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-white/35">
                    <span className="text-white/55 font-medium">Bloom</span>
                    <span>{state.bloomIntensity.toFixed(1)}</span>
                  </div>
                  <input type="range" min={0} max={3} step={0.1} value={state.bloomIntensity}
                    onChange={e => set('bloomIntensity', parseFloat(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/55">Depth of Field</span>
                  <button onClick={() => set('dofEnabled', !state.dofEnabled)}
                    className={`relative w-9 h-5 rounded-full transition-all ${state.dofEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${state.dofEnabled ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ══════════ EXPORT TAB ══════════ */}
        {tab === 'export' && (
          <div className="space-y-5 fade-up">
            <Section icon={<ImageIcon size={13} />} title="Export Image">
              <p className="text-[10px] text-white/30 leading-relaxed mb-3">
                Capture the current frame as a high-res PNG. Use "None" background for transparent export.
              </p>
              <button onClick={onExportImage}
                className="w-full py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/35 text-sm font-semibold text-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                <ImageIcon size={14} /> Export PNG
              </button>
            </Section>

            <Section icon={<Video size={13} />} title="Record Video">
              <p className="text-[10px] text-white/30 leading-relaxed mb-3">
                Record a WebM video while you interact with the 3D mockup.
              </p>
              <button onClick={onRecordToggle}
                className={`w-full py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isRecording
                    ? 'bg-red-500/20 border-red-500/35 text-red-200'
                    : 'bg-indigo-500/20 border-indigo-500/35 text-indigo-200 hover:bg-indigo-500/30'
                }`}
              >
                {isRecording
                  ? <><span className="w-2.5 h-2.5 rounded-full bg-red-400 recording-dot" /> Stop &amp; Save</>
                  : <><Video size={14} /> Start Recording</>
                }
              </button>
              {isRecording && (
                <div className="mt-2 flex items-center gap-2 text-[10px] text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 recording-dot" />
                  Recording — interact with the scene!
                </div>
              )}
            </Section>

            <Section icon={<ChevronDown size={13} />} title="Tips">
              <ul className="space-y-1.5 text-[10px] text-white/28 leading-relaxed">
                <li>• Pick a <span className="text-white/50">Camera Angle</span> preset before exporting</li>
                <li>• Enable <span className="text-white/50">Depth of Field</span> for cinematic blur</li>
                <li>• <span className="text-white/50">None</span> background = transparent PNG</li>
                <li>• Orbit while recording for dynamic showcase videos</li>
              </ul>
            </Section>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Sub-components ───────────────────────────────────────

function DeviceCard({ device, active, onClick }: {
  device: typeof DEVICES[DeviceId];
  active: boolean;
  onClick: () => void;
}) {
  const isTablet = device.id === 'ipad-pro' || device.id === 'galaxy-tab-s9';
  return (
    <button
      onClick={onClick}
      className={`preset-btn rounded-xl p-2.5 flex flex-col items-center gap-2 transition-all ${active ? 'active' : ''}`}
    >
      {/* Mini device silhouette */}
      <div className="relative flex items-center justify-center" style={{ width: isTablet ? 36 : 24, height: isTablet ? 28 : 36 }}>
        <div
          className="rounded"
          style={{
            width: isTablet ? 34 : 22,
            height: isTablet ? 26 : 34,
            background: active ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${active ? 'rgba(79,142,247,0.6)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: isTablet ? 3 : 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Screen area */}
          <div style={{
            position: 'absolute',
            inset: '2px',
            background: active ? 'rgba(79,142,247,0.15)' : 'rgba(0,0,0,0.4)',
            borderRadius: isTablet ? 2 : 3,
          }} />
          {/* Notch dot */}
          {!isTablet && (
            <div style={{
              position: 'absolute',
              top: 3, left: '50%', transform: 'translateX(-50%)',
              width: 5, height: 3,
              background: active ? 'rgba(79,142,247,0.8)' : 'rgba(255,255,255,0.2)',
              borderRadius: 2,
            }} />
          )}
        </div>
      </div>
      <div className="text-center">
        <div className={`text-[10px] font-semibold leading-tight ${active ? 'text-blue-300' : 'text-white/55'}`}>
          {device.label}
        </div>
        <div className="text-[9px] text-white/25 mt-0.5">{device.brand}</div>
      </div>
    </button>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
        <span className="text-white/20">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
