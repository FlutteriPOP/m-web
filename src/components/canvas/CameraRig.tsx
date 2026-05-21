import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import type { CameraPreset } from '../../types';
import { CAMERA_PRESETS } from '../../config/ui';

CameraControls.install({ THREE });

interface CameraRigProps {
  preset: CameraPreset;
}

export function CameraRig({ preset }: CameraRigProps) {
  const { gl, camera } = useThree();
  const controls = useRef<CameraControls | null>(null);

  // Initialize camera controls
  useEffect(() => {
    if (!controls.current) {
      controls.current = new CameraControls(camera, gl.domElement);
      controls.current.minDistance = 5;
      controls.current.maxDistance = 22;
      controls.current.smoothTime = 0.4;
      controls.current.draggingSmoothTime = 0.25;
    }
  }, [camera, gl]);

  // Animate to preset position
  useEffect(() => {
    if (!controls.current) return;
    const p = CAMERA_PRESETS.find(c => c.key === preset);
    if (!p) return;
    controls.current.rotateTo(p.azimuth, p.polar, true);
    controls.current.dollyTo(p.distance, true);
  }, [preset]);

  // Frame-loop update
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
