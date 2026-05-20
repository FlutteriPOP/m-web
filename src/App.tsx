import { useState, useRef, useEffect } from 'react';
import { Sidebar, type AppState } from './components/ui/Sidebar';
import { Scene } from './components/canvas/Scene';
import { DEVICES, DEVICE_COLORS } from './devices';
import { Download, Layers2 } from 'lucide-react';

const DEFAULT_STATE: AppState = {
  deviceId: 'iphone15pro',
  frameColor: DEVICE_COLORS['iphone15pro'][0].hex,
  rotation: [0.1, -0.3, 0],
  bgPreset: 'dark',
  envPreset: 'city',
  cameraPreset: 'hero',
  mediaUrl: null,
  mediaType: null,
  mediaFileName: null,
  bloomIntensity: 0.8,
  dofEnabled: false,
};

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => { if (state.mediaUrl) URL.revokeObjectURL(state.mediaUrl); };
  }, [state.mediaUrl]);

  const handleExportImage = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    const device = DEVICES[state.deviceId];
    link.download = `${device.label.replace(/\s/g, '-')}-mockup.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleRecordToggle = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    chunksRef.current = [];
    const stream = canvas.captureStream(30);
    const mr = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mr;
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const device = DEVICES[state.deviceId];
      link.download = `${device.label.replace(/\s/g, '-')}-mockup.webm`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    };
    mr.start();
    setIsRecording(true);
  };

  const currentDevice = DEVICES[state.deviceId];

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#060912' }}>
      {/* Top Bar */}
      <header className="top-bar absolute top-0 left-0 right-0 h-12 z-30 flex items-center px-5 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Layers2 size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">Mockup Studio</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/20">BETA</span>
        </div>

        {/* Active device badge */}
        <div className="ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/8">
          <span className={`w-1.5 h-1.5 rounded-full ${currentDevice.os === 'ios' ? 'bg-blue-400' : 'bg-green-400'}`} />
          <span className="text-[11px] text-white/50 font-medium">{currentDevice.label}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isRecording && (
            <div className="flex items-center gap-2 text-[11px] text-red-400 font-medium px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 recording-dot" /> Recording
            </div>
          )}
          <button onClick={handleExportImage}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/7 hover:bg-white/14 border border-white/10 text-white/65 hover:text-white text-xs font-medium transition-all"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </header>

      <Scene state={state} />

      <Sidebar
        state={state}
        setState={setState}
        onExportImage={handleExportImage}
        onRecordToggle={handleRecordToggle}
        isRecording={isRecording}
      />

      <div className="absolute bottom-4 right-5 text-[10px] text-white/16 font-medium select-none z-20">
        Drag to orbit · Scroll to zoom
      </div>
    </div>
  );
}
