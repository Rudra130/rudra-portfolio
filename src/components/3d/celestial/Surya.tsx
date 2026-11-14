import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';

export const Surya: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { selectWorld, setHoveredWorld, hoveredWorldId } = useUniverseStore();
  const isHovered = hoveredWorldId === 'surya';

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 0.04;
      const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.03;
      glowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        selectWorld('surya');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredWorld('surya');
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredWorld(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Core Glowing Sun Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[6.0, 48, 48]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#f59e0b"
          emissiveIntensity={isHovered ? 2.8 : 2.2}
          roughness={0.2}
        />
      </mesh>

      {/* Volumetric Corona Flare Shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[6.8, 32, 32]} />
        <meshBasicMaterial
          color="#ea580c"
          transparent={true}
          opacity={isHovered ? 0.45 : 0.28}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Ethereal Glow Ring */}
      <mesh>
        <sphereGeometry args={[7.8, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent={true}
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
