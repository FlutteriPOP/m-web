import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { DeviceSpec } from '../../types';
import { CameraLens } from './parts/CameraLens';
import { ScreenMedia } from './parts/ScreenMedia';

interface DeviceModelProps {
  device: DeviceSpec;
  frameColor: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  rotation: [number, number, number];
}

export function DeviceModel({ device, frameColor, mediaUrl, mediaType, rotation }: DeviceModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth rotation interpolation
  useFrame(() => {
    if (!groupRef.current) return;
    const r = groupRef.current.rotation;
    r.x = THREE.MathUtils.lerp(r.x, rotation[0], 0.08);
    r.y = THREE.MathUtils.lerp(r.y, rotation[1], 0.08);
    r.z = THREE.MathUtils.lerp(r.z, rotation[2], 0.08);
  });

  const { width: W, height: H, depth: D, cornerRadius: CR,
    screenWidth: SW, screenHeight: SH,
    notch, notchWidth, notchHeight,
    cameraModuleW, cameraModuleH, cameraModuleCornerR,
    cameraModuleOffsetX, cameraModuleOffsetY,
    cameraBar, cameraBarWidth, cameraBarHeight,
    frameStyle, lenses,
  } = device;

  const isTablet = device.id === 'ipad-pro' || device.id === 'galaxy-tab-s9';
  const backZ = -D / 2 - 0.04;

  // ── Frame material: PBR physical material per style ──
  const frameMat = useMemo(() => {
    const colorObj = device.colors.find(c => c.hex === frameColor);
    const rough = colorObj?.roughness ?? (frameStyle === 'titanium' ? 0.22 : 0.12);

    if (frameStyle === 'titanium') {
      return new THREE.MeshPhysicalMaterial({
        color: frameColor,
        metalness: 0.95,
        roughness: rough,
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        envMapIntensity: 1.6,
        reflectivity: 0.9,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: frameColor,
      metalness: 0.92,
      roughness: rough,
      clearcoat: 0.7,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.4,
      reflectivity: 0.85,
    });
  }, [frameColor, frameStyle, device.colors]);

  // ── Back glass material (iPhone-style frosted back) ──
  const backGlassMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: frameColor,
      metalness: 0.1,
      roughness: 0.35,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.8,
      reflectivity: 0.5,
    });
  }, [frameColor]);

  return (
    <group ref={groupRef}>

      {/* ─── FRAME BODY ─── */}
      <FlatRoundedBox args={[W, H, D]} radius={CR} castShadow receiveShadow>
        <primitive object={frameMat} attach="material" />
      </FlatRoundedBox>

      {/* ─── BACK GLASS PANEL (recessed) ─── */}
      <FlatRoundedBox
        args={[W - 0.06, H - 0.06, 0.02]}
        radius={CR - 0.03}
        bevel={0.005}
        position={[0, 0, -D / 2 + 0.005]}
      >
        <primitive object={backGlassMat} attach="material" />
      </FlatRoundedBox>

      {/* ─── SCREEN BEZEL (dark inset) ─── */}
      <FlatRoundedBox
        args={[SW + 0.06, SH + 0.06, D * 0.3]}
        radius={CR - 0.06}
        bevel={0.01}
        position={[0, 0, D / 2 - (D * 0.3) / 2 - 0.002]}
      >
        <meshStandardMaterial color="#050508" metalness={0.05} roughness={0.8} />
      </FlatRoundedBox>

      {/* ─── SCREEN CONTENT ─── */}
      <mesh position={[0, 0, D / 2 + 0.002]}>
        <planeGeometry args={[SW, SH]} />
        <React.Suspense fallback={<meshBasicMaterial color="#050508" />}>
          {mediaUrl && mediaType
            ? <ScreenMedia url={mediaUrl} type={mediaType} />
            : <meshStandardMaterial color="#050508" roughness={0.05} metalness={0.0} />
          }
        </React.Suspense>
      </mesh>

      {/* ─── SCREEN GLASS OVERLAY (gorilla glass simulation) ─── */}
      <mesh position={[0, 0, D / 2 + 0.005]}>
        <planeGeometry args={[SW, SH]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.02}
          metalness={0}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={0.6}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* ─── SUBTLE GLARE STRIPE ─── */}
      <mesh position={[SW * 0.12, SH * 0.18, D / 2 + 0.007]} rotation={[0, 0, 0.25]}>
        <planeGeometry args={[SW * 0.35, SH * 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.012} />
      </mesh>

      {/* ─── NOTCH / CUTOUT ─── */}
      {notch === 'dynamic-island' && (
        <group position={[0, SH / 2 - 0.22, D / 2 + 0.008]}>
          {/* Pill shape */}
          <mesh rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.001]}>
            <capsuleGeometry args={[notchHeight / 2, notchWidth - notchHeight, 8, 24]} />
            <meshBasicMaterial color="#020204" />
          </mesh>
          {/* Front camera dot */}
          <mesh position={[notchWidth * 0.28, 0, 0.001]}>
            <circleGeometry args={[0.032, 24]} />
            <meshPhysicalMaterial
              color="#0a1020"
              metalness={0}
              roughness={0.01}
              clearcoat={1}
              envMapIntensity={1.5}
            />
          </mesh>
        </group>
      )}
      {notch === 'punch-hole' && (
        <mesh position={[0, SH / 2 - (isTablet ? 0.38 : 0.24), D / 2 + 0.008]}>
          <circleGeometry args={[notchWidth / 2, 32]} />
          <meshPhysicalMaterial
            color="#020204"
            metalness={0}
            roughness={0.02}
            clearcoat={1}
            envMapIntensity={1}
          />
        </mesh>
      )}

      {/* ─── BACK CAMERA MODULE ─── */}
      {/* Module housing */}
      <FlatRoundedBox
        args={[cameraModuleW, cameraModuleH, 0.10]}
        radius={cameraModuleCornerR}
        bevel={0.015}
        position={[cameraModuleOffsetX, H / 2 - cameraModuleOffsetY, backZ + 0.05]}
      >
        <meshPhysicalMaterial
          color={frameColor}
          metalness={0.85}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
        />
      </FlatRoundedBox>

      {/* Individual lenses */}
      {lenses.map((lens, i) => (
        <group
          key={i}
          position={[
            cameraModuleOffsetX + lens.offsetX,
            H / 2 - cameraModuleOffsetY + lens.offsetY,
            backZ - 0.015,
          ]}
          rotation={[0, Math.PI, 0]}
        >
          <CameraLens radius={lens.radius} />
        </group>
      ))}

      {/* Flash LED (next to camera module) */}
      <mesh position={[
        cameraModuleOffsetX + cameraModuleW / 2 - 0.12,
        H / 2 - cameraModuleOffsetY - cameraModuleH / 2 + 0.12,
        backZ + 0.06,
      ]}>
        <circleGeometry args={[0.05, 24]} />
        <meshBasicMaterial color="#f8e8a0" transparent opacity={0.5} />
      </mesh>

      {/* ─── SIDE BUTTONS ─── */}
      {/* Power (right) */}
      <RoundedBox args={[0.04, 0.42, D * 0.68]} radius={0.018} position={[W / 2 + 0.02, H * 0.10, 0]}>
        <primitive object={frameMat} attach="material" />
      </RoundedBox>
      {/* Volume up (left) */}
      <RoundedBox args={[0.04, 0.28, D * 0.68]} radius={0.018} position={[-W / 2 - 0.02, H * 0.16, 0]}>
        <primitive object={frameMat} attach="material" />
      </RoundedBox>
      {/* Volume down (left) */}
      <RoundedBox args={[0.04, 0.28, D * 0.68]} radius={0.018} position={[-W / 2 - 0.02, H * 0.04, 0]}>
        <primitive object={frameMat} attach="material" />
      </RoundedBox>
      {/* Action/Mute button (iOS only) */}
      {(device.id === 'iphone15' || device.id === 'iphone15pro') && (
        <RoundedBox args={[0.04, 0.18, D * 0.68]} radius={0.018} position={[-W / 2 - 0.02, H * 0.28, 0]}>
          <primitive object={frameMat} attach="material" />
        </RoundedBox>
      )}

      {/* ─── CHARGING PORT (USB-C) ─── */}
      <RoundedBox args={[0.24, 0.065, 0.13]} radius={0.03} position={[0, -H / 2 + 0.04, 0]}>
        <meshPhysicalMaterial color="#111" metalness={0.6} roughness={0.3} clearcoat={0.3} />
      </RoundedBox>

      {/* ─── SPEAKER GRILLE ─── */}
      {Array.from({ length: 8 }, (_, i) => {
        const spacing = 0.052;
        const x = (i - 3.5) * spacing;
        return (
          <mesh key={`spk-${i}`} position={[x, -H / 2 + 0.04, D / 2 + 0.001]}>
            <circleGeometry args={[0.015, 8]} />
            <meshStandardMaterial color="#1a1a1a" roughness={1} />
          </mesh>
        );
      })}

      {/* ─── DEVICE-SPECIFIC DETAILS ─── */}
      {/* S-Pen slot (S24 Ultra) */}
      {device.id === 'galaxy-s24-ultra' && (
        <RoundedBox args={[0.07, 0.85, D * 0.88]} radius={0.035} position={[W / 2 - 0.035, -H / 2 + 0.48, 0]}>
          <meshPhysicalMaterial color={frameColor} metalness={0.8} roughness={0.28} clearcoat={0.3} />
        </RoundedBox>
      )}

      {/* Pixel camera bar */}
      {device.id === 'pixel-8-pro' && cameraBar && (
        <FlatRoundedBox
          args={[cameraBarWidth + 0.04, cameraBarHeight, 0.06]}
          radius={0.06}
          bevel={0.015}
          position={[0, H / 2 - cameraModuleOffsetY, backZ + 0.02]}
        >
          <meshPhysicalMaterial
            color={frameColor}
            metalness={0.75}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </FlatRoundedBox>
      )}

      {/* Home indicator bar (tablets) */}
      {isTablet && (
        <RoundedBox args={[0.8, 0.045, 0.001]} radius={0.022} position={[0, -SH / 2 + 0.14, D / 2 + 0.008]}>
          <meshBasicMaterial color="#444" />
        </RoundedBox>
      )}

      {/* Antenna lines on frame edges (subtle detail) */}
      {[H * 0.33, H * -0.33].map((y, i) => (
        <mesh key={`ant-${i}`} position={[W / 2 + 0.005, y, 0]}>
          <boxGeometry args={[0.01, 0.025, D * 0.4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Custom Geometry for flat rounded panels ──────────────────────────────────

function FlatRoundedBox({
  args: [width, height, depth],
  radius,
  position = [0, 0, 0],
  children,
  castShadow,
  receiveShadow,
  bevel = 0.015
}: any) {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    const w = width;
    const h = height;
    const r = Math.min(radius, width / 2, height / 2);
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const actualBevel = Math.min(bevel, depth / 2);
    const effDepth = Math.max(0.0001, depth - actualBevel * 2);

    const g = new THREE.ExtrudeGeometry(s, {
      depth: effDepth,
      bevelEnabled: actualBevel > 0,
      bevelSegments: 8,
      steps: 1,
      bevelSize: actualBevel,
      bevelThickness: actualBevel,
    });
    g.center();
    return g;
  }, [width, height, depth, radius, bevel]);

  return (
    <mesh position={position as [number, number, number]} castShadow={castShadow} receiveShadow={receiveShadow} geometry={geom}>
      {children}
    </mesh>
  );
}
