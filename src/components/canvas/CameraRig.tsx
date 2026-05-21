import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import type { CameraPreset, TemplatePreset } from '../../types';
import { CAMERA_PRESETS, ANIMATION_TEMPLATES } from '../../config/ui';

CameraControls.install({ THREE });

interface CameraRigProps {
  preset: CameraPreset;
  activeTemplate: TemplatePreset;
  isGeneratingIntro: boolean;
}

export function CameraRig({ preset, activeTemplate, isGeneratingIntro }: CameraRigProps) {
  const { gl, camera } = useThree();
  const controls = useRef<CameraControls | null>(null);
  const animationStartTime = useRef<number | null>(null);

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

  // Handle template animation start
  useEffect(() => {
    if (isGeneratingIntro && activeTemplate !== 'none' && controls.current) {
      // Setup initial camera position before animating
      if (activeTemplate === 'sweep') {
        controls.current.setLookAt(-12, 2, 0, 0, 0, 0, false); // Start side
      } else if (activeTemplate === 'zoom') {
        controls.current.setLookAt(0, 2, 20, 0, 0, 0, false); // Start far away
      } else if (activeTemplate === 'spin') {
        controls.current.setLookAt(0, 4, 12, 0, 0, 0, false); // Start front slightly elevated
      }
      animationStartTime.current = performance.now();
    } else {
      animationStartTime.current = null;
    }
  }, [isGeneratingIntro, activeTemplate]);

  // Animate to preset position when NOT generating intro
  useEffect(() => {
    if (!controls.current || isGeneratingIntro) return;
    const p = CAMERA_PRESETS.find(c => c.key === preset);
    if (!p) return;
    controls.current.rotateTo(p.azimuth, p.polar, true);
    controls.current.dollyTo(p.distance, true);
  }, [preset, isGeneratingIntro]);

  // Frame-loop update
  useFrame((_, delta) => {
    if (controls.current) {
      if (isGeneratingIntro && activeTemplate !== 'none' && animationStartTime.current !== null) {
        // Disable user interaction during animation
        controls.current.enabled = false;
        
        const template = ANIMATION_TEMPLATES.find(t => t.key === activeTemplate);
        if (template) {
          const duration = template.duration * 1000;
          const elapsed = performance.now() - animationStartTime.current;
          const progress = Math.min(elapsed / duration, 1.0);
          
          // Easing function (easeInOutCubic)
          const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          if (activeTemplate === 'sweep') {
            const startAzimuth = -Math.PI / 2;
            const endAzimuth = 0;
            const startDist = 15;
            const endDist = 10;
            const polar = Math.PI / 2.2;
            controls.current.rotateTo(startAzimuth + (endAzimuth - startAzimuth) * ease, polar, false);
            controls.current.dollyTo(startDist + (endDist - startDist) * ease, false);
          } else if (activeTemplate === 'zoom') {
            const startDist = 20;
            const endDist = 8;
            const polar = Math.PI / 2;
            controls.current.rotateTo(0, polar, false);
            controls.current.dollyTo(startDist + (endDist - startDist) * ease, false);
          } else if (activeTemplate === 'spin') {
            const startAzimuth = 0;
            const endAzimuth = Math.PI * 2;
            const polar = Math.PI / 2.5;
            const dist = 11;
            // Use linear progress for smooth continuous spin
            controls.current.rotateTo(startAzimuth + (endAzimuth - startAzimuth) * progress, polar, false);
            controls.current.dollyTo(dist, false);
          }
        }
      } else {
        controls.current.enabled = true;
      }
      
      controls.current.update(delta);
    }
  });

  return null;
}
