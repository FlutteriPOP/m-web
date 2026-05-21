import React, { useState } from 'react';
import {
  Upload, Video, Palette,
  SlidersHorizontal, LayoutTemplate, Layers, ChevronDown,
  Square, RotateCcw, Camera, Sun, Smartphone
} from 'lucide-react';
import type { AppState, DeviceId, DeviceSpec } from '../../types';
import { DEVICES } from '../../config/devices';
import { BG_PRESETS, ENV_PRESETS, CAMERA_PRESETS, ANIMATION_TEMPLATES } from '../../config/ui';
import { useMediaUpload } from '../../hooks/useMediaUpload';

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onRecordToggle: () => void;
  isRecording: boolean;
  startTemplateRecording: (duration: number, template: string) => void;
}

type Tab = 'device' | 'scene' | 'templates' | 'export';

const allDevices = Object.values(DEVICES) as DeviceSpec[];
const iosDevices = allDevices.filter(d => d.os === 'ios');
const androidDevices = allDevices.filter(d => d.os === 'android');

export function Sidebar({ state, setState, onRecordToggle, isRecording, startTemplateRecording }: SidebarProps) {
  const [tab, setTab] = useState<Tab>('device');
  const { fileInputRef, openFilePicker, handleFileChange } = useMediaUpload(setState);

  const set = <K extends keyof AppState>(key: K, val: AppState[K]) =>
    setState(prev => ({ ...prev, [key]: val }));

  const handleDeviceChange = (id: DeviceId) => {
    const d = DEVICES[id];
    setState(prev => ({
      ...prev,
      deviceId: id,
      frameColor: d.colors[0]?.hex ?? d.defaultColor,
    }));
  };

  const updateRot = (axis: 0 | 1 | 2, val: number) => {
    const r = [...state.rotation] as [number, number, number];
    r[axis] = val;
    set('rotation', r);
  };

  const currentDevice = DEVICES[state.deviceId];
  const colorOptions = currentDevice.colors;

  return (
    <aside className="absolute left-4 top-16 bottom-4 w-[17.5rem] glass-panel rounded-2xl flex flex-col z-20 overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center gap-0.5 px-3 pt-3 pb-2 border-b border-white/5 flex-shrink-0">
        {(['device', 'scene', 'templates', 'export'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`tab-btn capitalize ${tab === t ? 'active' : ''}`}
          >{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 sidebar-scroll">

        {/* ══════════ DEVICE TAB ══════════ */}
        {tab === 'device' && (
          <div className="space-y-5 fade-up">
            <Section icon={<Smartphone size={13} />} title="iOS Devices">
              <div className="grid grid-cols-2 gap-1.5">
                {iosDevices.map(d => (
                  <DeviceCard key={d.id} device={d} active={state.deviceId === d.id}
                    onClick={() => handleDeviceChange(d.id)} />
                ))}
              </div>
            </Section>

            <Section icon={<Smartphone size={13} />} title="Android Devices">
              <div className="grid grid-cols-2 gap-1.5">
                {androidDevices.map(d => (
                  <DeviceCard key={d.id} device={d} active={state.deviceId === d.id}
                    onClick={() => handleDeviceChange(d.id)} />
                ))}
              </div>
            </Section>

            {colorOptions.length > 0 && (
              <Section icon={<Palette size={13} />} title="Frame Color">
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(({ label, hex }) => (
                    <button key={hex} onClick={() => set('frameColor', hex)} title={label}
                      className={`color-swatch ${state.frameColor === hex ? 'active' : ''}`}
                      style={{ background: hex }} />
                  ))}
                </div>
                <p className="text-[10px] text-white/25 mt-1">
                  {colorOptions.find(c => c.hex === state.frameColor)?.label ?? ''}
                </p>
              </Section>
            )}

            <Section icon={<Upload size={13} />} title="Screen Content">
              <button onClick={openFilePicker}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all text-xs font-medium text-white/60 hover:text-white flex items-center justify-center gap-2 mb-2"
              >
                <Upload size={12} />
                {state.mediaFileName
                  ? <span className="truncate max-w-[140px]">{state.mediaFileName}</span>
                  : 'Upload Image or Video'}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,video/mp4,video/webm"
                onChange={handleFileChange} className="hidden" />
              {/* Media Preview */}
              {state.mediaUrl && (
                state.mediaType === 'video' ? (
                  <video src={state.mediaUrl} controls autoPlay muted loop
                    className="w-full rounded-lg mb-2" />
                ) : (
                  <img src={state.mediaUrl} alt="Screen preview"
                    className="w-full rounded-lg mb-2" />
                )
              )}
            </Section>

            <Section icon={<LayoutTemplate size={13} />} title="Camera Angle">
              <div className="grid grid-cols-2 gap-1.5">
                {CAMERA_PRESETS.map(({ key, label }) => (
                  <button key={key} onClick={() => set('cameraPreset', key)}
                    className={`preset-btn rounded-lg px-2.5 py-2 text-[11px] font-medium text-white/60 flex items-center gap-1.5 ${state.cameraPreset === key ? 'active' : ''}`}
                  >
                    <span className="text-white/30"><Camera size={11} /></span>{label}
                  </button>
                ))}
              </div>
            </Section>

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
                    className="w-full cursor-pointer" />
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

        {/* ══════════ SCENE TAB ══════════ */}
        {tab === 'scene' && (
          <div className="space-y-5 fade-up">
            <Section icon={<Square size={13} />} title="Background">
              <div className="space-y-1">
                {BG_PRESETS.map(({ key, label, cssClass }) => (
                  <button key={key} onClick={() => set('bgPreset', key)}
                    className={`preset-btn w-full rounded-lg px-3 py-2 text-[11px] font-medium text-white/60 flex items-center gap-2.5 ${state.bgPreset === key ? 'active' : ''}`}
                  >
                    <div className={`w-4 h-4 rounded flex-shrink-0 ${cssClass} border border-white/10`} />
                    {label}
                    {state.bgPreset === key && <span className="ml-auto text-blue-400/60 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon={<Sun size={13} />} title="Lighting">
              <div className="space-y-1">
                {ENV_PRESETS.map(({ key, label }) => (
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
                    className="w-full cursor-pointer" />
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

        {/* ══════════ TEMPLATES TAB ══════════ */}
        {tab === 'templates' && (
          <div className="space-y-5 fade-up">
            <Section icon={<Video size={13} />} title="Animation Templates">
              <p className="text-[10px] text-white/30 leading-relaxed mb-3">
                Select a template to automatically generate a cinematic intro video of your mockup.
              </p>
              
              <div className="space-y-2">
                {ANIMATION_TEMPLATES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => set('activeTemplate', t.key)}
                    disabled={state.isGeneratingIntro}
                    className={`w-full text-left rounded-xl p-3 border transition-all ${
                      state.activeTemplate === t.key
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    } ${state.isGeneratingIntro ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-semibold ${state.activeTemplate === t.key ? 'text-blue-300' : 'text-white/70'}`}>
                        {t.label}
                      </span>
                      <span className="text-[10px] text-white/40">{t.duration}s</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-snug">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (state.activeTemplate === 'none') return;
                    const template = ANIMATION_TEMPLATES.find(t => t.key === state.activeTemplate);
                    if (!template) return;
                    
                    set('isGeneratingIntro', true);
                    startTemplateRecording(template.duration * 1000, template.key);
                    
                    setTimeout(() => {
                      set('isGeneratingIntro', false);
                      set('activeTemplate', 'none');
                    }, template.duration * 1000);
                  }}
                  disabled={state.activeTemplate === 'none' || state.isGeneratingIntro}
                  className={`w-full py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    state.isGeneratingIntro
                      ? 'bg-red-500/20 border-red-500/35 text-red-200'
                      : state.activeTemplate !== 'none'
                      ? 'bg-indigo-500/20 border-indigo-500/35 text-indigo-200 hover:bg-indigo-500/30'
                      : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {state.isGeneratingIntro ? (
                    <><span className="w-2.5 h-2.5 rounded-full bg-red-400 recording-dot" /> Generating Intro...</>
                  ) : (
                    <><Video size={14} /> Generate Intro Video</>
                  )}
                </button>
              </div>
            </Section>
          </div>
        )}

        {/* ══════════ EXPORT TAB ══════════ */}
        {tab === 'export' && (
          <div className="space-y-5 fade-up">
            <Section icon={<Video size={13} />} title="Record Video">
              <p className="text-[10px] text-white/30 leading-relaxed mb-3">
                Record an MP4 video while you interact with the 3D mockup. Orbit, zoom, and rotate during recording for dynamic showcase videos.
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
                <li>• Pick a <span className="text-white/50">Camera Angle</span> preset before recording</li>
                <li>• Enable <span className="text-white/50">Depth of Field</span> for cinematic blur</li>
                <li>• Orbit while recording for dynamic showcase videos</li>
                <li>• Videos are saved as <span className="text-white/50">MP4</span> format</li>
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
  device: DeviceSpec;
  active: boolean;
  onClick: () => void;
}) {
  const isTablet = device.id === 'ipad-pro' || device.id === 'galaxy-tab-s9';
  return (
    <button onClick={onClick}
      className={`preset-btn rounded-xl p-2.5 flex flex-col items-center gap-2 transition-all ${active ? 'active' : ''}`}
    >
      <div className="relative flex items-center justify-center" style={{ width: isTablet ? 36 : 24, height: isTablet ? 28 : 36 }}>
        <div className="rounded" style={{
          width: isTablet ? 34 : 22, height: isTablet ? 26 : 34,
          background: active ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.06)',
          border: `1.5px solid ${active ? 'rgba(79,142,247,0.6)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: isTablet ? 3 : 4,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: '2px',
            background: active ? 'rgba(79,142,247,0.15)' : 'rgba(0,0,0,0.4)',
            borderRadius: isTablet ? 2 : 3,
          }} />
          {!isTablet && (
            <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
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

function Section({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
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
