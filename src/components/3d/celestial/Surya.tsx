import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';

export const Surya: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);

  const { selectWorld, setHoveredWorld, hoveredWorldId, activeWorldId } = useUniverseStore();
  const isHovered = hoveredWorldId === 'surya';
  const isSelected = activeWorldId === 'surya';

  // Load photorealistic Sun texture
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/planets/sun.jpg');
  sunTexture.wrapS = THREE.RepeatWrapping;
  sunTexture.wrapT = THREE.ClampToEdgeWrapping;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.02;
      const pulse = 1 + Math.sin(Date.now() * 0.0015) * 0.02;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.rotation.y += delta * 0.015;
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
      {/* Generous Click Hitbox */}
      <mesh visible={false}>
        <sphereGeometry args={[11.0, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* Photorealistic Sun Sphere (Enlarged) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[9.0, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive="#f59e0b"
          emissiveIntensity={isHovered ? 2.5 : 1.9}
          roughness={0.4}
        />
      </mesh>

      {/* Fiery Solar Corona Shell */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[10.3, 36, 36]} />
        <meshBasicMaterial
          color="#ea580c"
          transparent={true}
          opacity={isHovered ? 0.45 : 0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Ethereal Atmosphere Aura */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[12.2, 36, 36]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent={true}
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Surya Contextual Label */}
      {!activeWorldId && (
        <Html position={[0, -11.5, 0]} center distanceFactor={65} className="select-none">
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectWorld('surya');
            }}
            className={`flex flex-col items-center whitespace-nowrap px-3.5 py-1.5 rounded-full text-center transition-all cursor-pointer pointer-events-auto ${
              isHovered || isSelected
                ? 'bg-slate-900/90 border border-amber-400 text-amber-300 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                : 'bg-slate-950/60 text-slate-200 border border-amber-500/20 shadow-md hover:border-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="text-xs font-display font-bold tracking-wide flex items-center gap-1.5">
              <span className="text-amber-400">☀️</span>
              <span>Surya</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              (Core Identity)
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
