import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { DeviceModel } from './DeviceModel';
import { CameraRig } from './CameraRig';
import { DEVICES } from '../../config/devices';
import type { AppState, BgPreset } from '../../types';
import * as THREE from 'three';

interface SceneProps {
  state: AppState;
}

function getBgColor(bg: BgPreset): string {
  switch (bg) {
    case 'white':           return '#f5f5f5';
    case 'midnight':        return '#0a0a14';
    case 'gradient-blue':   return '#0a1440';
    case 'gradient-purple': return '#100820';
    case 'transparent':     return '#00000000';
    default:                return '#060912';
  }
}

export function Scene({ state }: SceneProps) {
  const device = DEVICES[state.deviceId];
  const bgColor = getBgColor(state.bgPreset);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <div className="canvas-glow" />
      <Canvas
        camera={{ position: [0, 0, 12], fov: 42 }}
        gl={{
          preserveDrawingBuffer: true,
          alpha: state.bgPreset === 'transparent',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          antialias: true,
        }}
        shadows
      >
        <color attach="background" args={[bgColor]} />

        {/* Colored accent lights for gradient backgrounds */}
        {state.bgPreset === 'gradient-blue' && (
          <pointLight position={[-6, 4, 4]} intensity={3} color="#4466ff" />
        )}
        {state.bgPreset === 'gradient-purple' && (
          <pointLight position={[6, 4, 4]} intensity={3} color="#8844ff" />
        )}

        {/* Core Lighting Rig */}
        <ambientLight intensity={0.30} />
        <directionalLight
          position={[8, 14, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, -3, -4]} intensity={0.2} color="#6677cc" />
        <pointLight position={[0, 10, 6]} intensity={0.4} />
        {/* Rim light from behind for edge highlights */}
        <pointLight position={[0, 0, -8]} intensity={0.3} color="#aabbff" />

        <Suspense fallback={null}>
          <Environment preset={state.envPreset} />

          <DeviceModel
            device={device}
            frameColor={state.frameColor}
            mediaUrl={state.mediaUrl}
            mediaType={state.mediaType}
            rotation={state.rotation}
          />

          <ContactShadows
            position={[0, -(device.height / 2 + 0.5), 0]}
            opacity={state.bgPreset === 'white' ? 0.25 : 0.6}
            scale={20}
            blur={2.5}
            far={device.height / 2 + 1}
          />

          <EffectComposer>
            <Bloom
              intensity={state.bloomIntensity}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            {state.dofEnabled ? (
              <DepthOfField focusDistance={0} focalLength={0.06} bokehScale={4} />
            ) : <></>}
          </EffectComposer>

          <Preload all />
        </Suspense>

        <CameraRig 
          preset={state.cameraPreset}
          activeTemplate={state.activeTemplate}
          isGeneratingIntro={state.isGeneratingIntro}
        />
      </Canvas>
    </div>
  );
}
