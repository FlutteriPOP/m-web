import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import type { CameraPreset } from '../ui/Sidebar';

CameraControls.install({ THREE });

const PRESET_POSITIONS: Record<CameraPreset, { azimuth: number; polar: number; distance: number }> = {
  'front':     { azimuth: 0,              polar: Math.PI / 2,       distance: 10 },
  'iso-left':  { azimuth: -Math.PI / 5,   polar: Math.PI / 2.5,     distance: 11 },
  'iso-right': { azimuth: Math.PI / 5,    polar: Math.PI / 2.5,     distance: 11 },
  'top-tilt':  { azimuth: 0,              polar: Math.PI / 4,       distance: 12 },
  'hero':      { azimuth: Math.PI / 8,    polar: Math.PI / 2.8,     distance: 9.5 },
};

interface CameraRigProps {
  preset: CameraPreset;
}

export function CameraRig({ preset }: CameraRigProps) {
  const { gl, camera } = useThree();
  const controls = useRef<CameraControls | null>(null);

  useEffect(() => {
    if (!controls.current) {
      controls.current = new CameraControls(camera, gl.domElement);
      controls.current.minDistance = 5;
      controls.current.maxDistance = 20;
    }
  }, [camera, gl]);

  // Animate to preset
  useEffect(() => {
    if (!controls.current) return;
    const { azimuth, polar, distance } = PRESET_POSITIONS[preset];
    controls.current.rotateTo(azimuth, polar, true);
    controls.current.dollyTo(distance, true);
  }, [preset]);

  // Manual tick (CameraControls needs to be updated every frame)
  useEffect(() => {
    const clock = new THREE.Clock();
    let raf: number;
    const tick = () => {
      controls.current?.update(clock.getDelta());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
