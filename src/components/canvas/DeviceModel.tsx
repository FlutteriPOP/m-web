import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useVideoTexture, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { DeviceConfig } from '../../devices';

interface DeviceModelProps {
  device: DeviceConfig;
  frameColor: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  rotation: [number, number, number];
}

// Screen texture component – suspends until the texture/video is loaded.
// When a new URL is provided (new file uploaded), React re-suspends and swaps the texture.
function ScreenMedia({ url, type }: { url: string; type: 'image' | 'video' }) {
  const texture = type === 'video' ? useVideoTexture(url) : useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  // Ensure texture fills the screen plane properly
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}

function CameraLens({ radius = 0.1, offsetX = 0, offsetY = 0, z = 0 }: {
  radius?: number; offsetX?: number; offsetY?: number; z?: number;
}) {
  return (
    <group position={[offsetX, offsetY, z]}>
      {/* Lens barrel */}
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.06, 32]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Lens glass */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[radius * 0.75, radius * 0.75, 0.01, 32]} />
        <meshStandardMaterial color="#1a2a4a" metalness={0.1} roughness={0.05} transparent opacity={0.85} />
      </mesh>
      {/* Lens shine */}
      <mesh position={[radius * 0.25, 0.041, -radius * 0.25]}>
        <sphereGeometry args={[radius * 0.18, 8, 8]} />
        <meshBasicMaterial color="#aaccff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function DeviceModel({ device, frameColor, mediaUrl, mediaType, rotation }: DeviceModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const r = groupRef.current.rotation;
    r.x = THREE.MathUtils.lerp(r.x, rotation[0], 0.09);
    r.y = THREE.MathUtils.lerp(r.y, rotation[1], 0.09);
    r.z = THREE.MathUtils.lerp(r.z, rotation[2], 0.09);
  });

  const {
    width: W, height: H, depth: D, cornerRadius,
    screenWidth: SW, screenHeight: SH,
    notch, notchWidth, notchHeight,
    cameraModuleW, cameraModuleH, cameraModuleCorner, cameraCount,
    cameraOffsetX, cameraOffsetY,
    frameStyle,
  } = device;

  // Frame material: titanium has different look
  const frameMaterial = useMemo(() => {
    if (frameStyle === 'titanium') {
      return new THREE.MeshStandardMaterial({
        color: frameColor,
        metalness: 0.95,
        roughness: 0.25,
        envMapIntensity: 1.5,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: frameColor,
      metalness: 0.88,
      roughness: 0.15,
      envMapIntensity: 1.2,
    });
  }, [frameColor, frameStyle]);

  // Camera lens layout
  const lensPositions = useMemo(() => {
    // cameraCount ≤ 3; arrange in triangle or column depending on module shape
    const isHorizontalBar = cameraModuleW > cameraModuleH * 1.5;
    if (cameraCount === 1) return [[0, 0]];
    if (cameraCount === 2) {
      if (isHorizontalBar) return [[-0.22, 0], [0.22, 0]];
      return [[0, 0.22], [0, -0.22]];
    }
    // 3 lenses
    if (isHorizontalBar) return [[-0.44, 0], [0, 0], [0.44, 0]];
    return [[-0.22, 0.22], [0.22, 0.22], [0, -0.18]];
  }, [cameraCount, cameraModuleW, cameraModuleH]);

  const isTablet = device.id === 'ipad-pro' || device.id === 'galaxy-tab-s9';
  const cameraZ = -D / 2 - 0.06;

  return (
    <group ref={groupRef}>
      {/* ─── BODY FRAME ─── */}
      <RoundedBox
        args={[W, H, D]}
        radius={cornerRadius}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <primitive object={frameMaterial} attach="material" />
      </RoundedBox>

      {/* ─── SCREEN BEZEL (recessed inset) ─── */}
      <RoundedBox
        args={[SW + 0.08, SH + 0.1, D * 0.35]}
        radius={cornerRadius - 0.04}
        smoothness={6}
        position={[0, 0, D / 2 - 0.02]}
      >
        <meshStandardMaterial color="#080810" metalness={0.1} roughness={0.7} />
      </RoundedBox>

      {/* ─── SCREEN DISPLAY ─── */}
      <mesh position={[0, 0, D / 2 + 0.003]}>
        <planeGeometry args={[SW, SH]} />
        <React.Suspense fallback={<meshBasicMaterial color="#050508" />}>
          {mediaUrl && mediaType
            ? <ScreenMedia url={mediaUrl} type={mediaType} />
            : <meshStandardMaterial color="#050508" roughness={0.05} metalness={0.0} />
          }
        </React.Suspense>
      </mesh>

      {/* ─── SCREEN GLARE overlay ─── */}
      <mesh position={[SW * 0.1, SH * 0.2, D / 2 + 0.006]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[SW * 0.4, SH * 0.08]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.018} />
      </mesh>

      {/* ─── NOTCH / CUTOUT ─── */}
      {notch === 'dynamic-island' && (
        <mesh position={[0, SH / 2 - 0.2, D / 2 + 0.007]}>
          <capsuleGeometry args={[notchHeight / 2, notchWidth - notchHeight, 16, 16]} />
          <meshBasicMaterial color="#030305" />
        </mesh>
      )}
      {notch === 'pill-hole' && (
        <mesh position={[0, SH / 2 - (isTablet ? 0.35 : 0.22), D / 2 + 0.007]}>
          <circleGeometry args={[notchWidth / 2, 32]} />
          <meshBasicMaterial color="#030305" />
        </mesh>
      )}
      {notch === 'wide-notch' && (
        <mesh position={[0, SH / 2 - notchHeight / 2, D / 2 + 0.007]}>
          <planeGeometry args={[notchWidth, notchHeight]} />
          <meshBasicMaterial color="#030305" />
        </mesh>
      )}
      {notch === 'camera-bar' && (
        <RoundedBox
          args={[notchWidth, notchHeight, 0.06]}
          radius={notchHeight / 2}
          smoothness={4}
          position={[0, SH / 2 - notchHeight * 0.8, D / 2 + 0.005]}
        >
          <meshBasicMaterial color="#030305" />
        </RoundedBox>
      )}

      {/* ─── BACK CAMERA MODULE ─── */}
      {/* Camera bump base */}
      <RoundedBox
        args={[cameraModuleW, cameraModuleH, 0.1]}
        radius={cameraModuleCorner}
        smoothness={6}
        position={[cameraOffsetX, H / 2 + cameraOffsetY, cameraZ + 0.04]}
      >
        <meshStandardMaterial color={frameColor} metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Camera lenses */}
      {lensPositions.map(([lx, ly], i) => (
        <group
          key={i}
          position={[
            cameraOffsetX + lx,
            H / 2 + cameraOffsetY + ly,
            0,
          ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <CameraLens radius={0.12} z={cameraZ - 0.02} />
        </group>
      ))}

      {/* ─── SIDE BUTTONS ─── */}
      {/* Power/lock button (right side) */}
      <RoundedBox args={[0.05, 0.45, D * 0.7]} radius={0.02} position={[W / 2 + 0.025, H * 0.1, 0]}>
        <primitive object={frameMaterial} attach="material" />
      </RoundedBox>
      {/* Volume up (left side) */}
      <RoundedBox args={[0.05, 0.3, D * 0.7]} radius={0.02} position={[-W / 2 - 0.025, H * 0.15, 0]}>
        <primitive object={frameMaterial} attach="material" />
      </RoundedBox>
      {/* Volume down (left side) */}
      <RoundedBox args={[0.05, 0.3, D * 0.7]} radius={0.02} position={[-W / 2 - 0.025, H * 0.05, 0]}>
        <primitive object={frameMaterial} attach="material" />
      </RoundedBox>
      {/* Action/mute button (iPhone only, left above vol) */}
      {(device.id === 'iphone15' || device.id === 'iphone15pro') && (
        <RoundedBox args={[0.05, 0.2, D * 0.7]} radius={0.02} position={[-W / 2 - 0.025, H * 0.27, 0]}>
          <primitive object={frameMaterial} attach="material" />
        </RoundedBox>
      )}

      {/* ─── CHARGING PORT ─── */}
      <RoundedBox args={[0.22, 0.07, 0.14]} radius={0.03} position={[0, -H / 2 + 0.05, 0]}>
        <meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} />
      </RoundedBox>

      {/* ─── SPEAKER GRILLE DOTS ─── */}
      {[-0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18].map((x, i) => (
        <mesh key={i} position={[x, -H / 2 + 0.05, D / 2 + 0.001]}>
          <circleGeometry args={[0.018, 8]} />
          <meshStandardMaterial color="#222" roughness={1} />
        </mesh>
      ))}

      {/* Samsung S-Pen slot for S24 Ultra */}
      {device.id === 'galaxy-s24-ultra' && (
        <RoundedBox args={[0.08, 0.9, D * 0.9]} radius={0.04} position={[W / 2 - 0.04, -H / 2 + 0.5, 0]}>
          <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
        </RoundedBox>
      )}

      {/* Google Pixel camera bar highlight strip */}
      {device.id === 'pixel-8-pro' && (
        <RoundedBox
          args={[W + 0.04, 0.62, 0.06]}
          radius={0.06}
          position={[0, H / 2 - 0.75, cameraZ + 0.02]}
        >
          <meshStandardMaterial
            color={frameColor === '#D4E3FC' ? '#8EB0D8' : '#555'}
            metalness={0.7}
            roughness={0.25}
          />
        </RoundedBox>
      )}

      {/* iPad home indicator bar */}
      {isTablet && (
        <RoundedBox args={[0.8, 0.05, 0.02]} radius={0.025} position={[0, -SH / 2 + 0.15, D / 2 + 0.007]}>
          <meshBasicMaterial color="#444" />
        </RoundedBox>
      )}
    </group>
  );
}
