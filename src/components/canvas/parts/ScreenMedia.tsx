import { useVideoTexture, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ScreenMediaProps {
  url: string;
  type: 'image' | 'video';
}

export function ScreenMedia({ url, type }: ScreenMediaProps) {
  const texture = type === 'video' ? useVideoTexture(url, { loop: true, muted: true, autoplay: true }) : useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return <meshBasicMaterial map={texture} toneMapped={false} />;
}
