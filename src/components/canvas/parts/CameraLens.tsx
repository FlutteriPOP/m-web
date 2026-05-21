// Camera lens part — used by DeviceModel for each rear camera


interface CameraLensProps {
  radius?: number;
  offsetX?: number;
  offsetY?: number;
  z?: number;
}

export function CameraLens({ radius = 0.12, offsetX = 0, offsetY = 0, z = 0 }: CameraLensProps) {

  return (
    <group position={[offsetX, offsetY, z]}>
      {/* Outer chrome ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius + 0.012, radius + 0.012, 0.045, 48]} />
        <meshPhysicalMaterial
          color="#333"
          metalness={0.98}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      {/* Inner lens barrel */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.06, 48]} />
        <meshPhysicalMaterial
          color="#0a0a12"
          metalness={0.7}
          roughness={0.15}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Glass element - dark blue tint like real lenses */}
      <mesh position={[0, 0, 0.034]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, 0.008, 48]} />
        <meshPhysicalMaterial
          color="#0a1528"
          metalness={0.05}
          roughness={0.02}
          transmission={0.3}
          thickness={0.5}
          ior={1.8}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={2}
        />
      </mesh>

      {/* Specular highlight dot */}
      <mesh position={[radius * 0.2, radius * -0.2, 0.038]}>
        <sphereGeometry args={[radius * 0.12, 16, 16]} />
        <meshBasicMaterial color="#cce0ff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
