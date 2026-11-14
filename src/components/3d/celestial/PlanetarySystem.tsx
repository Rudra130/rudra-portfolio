import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { CelestialBodyMeta } from '../../../types/celestial';

interface PlanetNodeProps {
  world: CelestialBodyMeta;
  initialAngle: number;
}

const PlanetNode: React.FC<PlanetNodeProps> = ({ world, initialAngle }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(initialAngle);

  const { selectWorld, setHoveredWorld, hoveredWorldId, activeWorldId } = useUniverseStore();
  const isHovered = hoveredWorldId === world.id;
  const isSelected = activeWorldId === world.id;

  useFrame((_, delta) => {
    // When a planet is selected, slow down the background orbit
    const speedFactor = activeWorldId ? 0.15 : 1.0;
    angleRef.current += delta * world.orbitSpeed * 0.15 * speedFactor;

    if (groupRef.current) {
      const x = Math.cos(angleRef.current) * world.orbitRadius;
      const z = Math.sin(angleRef.current) * world.orbitRadius;
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        selectWorld(world.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredWorld(world.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredWorld(null);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Planetary Mesh */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[world.radius, 32, 32]} />
        <meshStandardMaterial
          color={world.color}
          roughness={world.id === 'budh' ? 0.3 : 0.7}
          metalness={world.id === 'budh' ? 0.4 : 0.1}
          emissive={world.glowColor}
          emissiveIntensity={isHovered || isSelected ? 0.6 : 0.15}
        />
      </mesh>

      {/* Saturn's Rings (Shani) */}
      {world.id === 'shani' && (
        <mesh rotation={[-Math.PI / 3, 0.2, 0]}>
          <ringGeometry args={[world.radius * 1.4, world.radius * 2.3, 64]} />
          <meshStandardMaterial
            color="#d4af37"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
            roughness={0.5}
          />
        </mesh>
      )}

      {/* Rahu Accretion Disk (Shadow Singularity) */}
      {world.id === 'rahu' && (
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <ringGeometry args={[world.radius * 1.3, world.radius * 2.2, 48]} />
          <meshBasicMaterial
            color="#6366f1"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Ketu Cometary Tail Haze */}
      {world.id === 'ketu' && (
        <mesh scale={[1.4, 1.4, 2.5]}>
          <sphereGeometry args={[world.radius, 16, 16]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent={true}
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Atmospheric Hover Glow Aura */}
      {(isHovered || isSelected) && (
        <mesh scale={[1.25, 1.25, 1.25]}>
          <sphereGeometry args={[world.radius, 24, 24]} />
          <meshBasicMaterial
            color={world.glowColor}
            transparent={true}
            opacity={0.35}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 3D Contextual Label Tag (Identical to View 2 reference) */}
      <Html
        position={[0, world.radius + 1.2, 0]}
        center
        distanceFactor={60}
        className="pointer-events-none select-none transition-all duration-300"
      >
        <div
          className={`flex flex-col items-center whitespace-nowrap px-2.5 py-1 rounded-full text-center transition-all ${
            isHovered || isSelected
              ? 'bg-slate-900/90 border border-amber-400 text-amber-300 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'bg-slate-950/40 text-slate-300 border border-white/5 opacity-80'
          }`}
        >
          <span className="text-[11px] font-display font-semibold tracking-wide flex items-center gap-1">
            <span style={{ color: world.color }}>{world.symbol}</span>
            <span>{world.sanskritName}</span>
          </span>
          <span className="text-[9px] font-mono text-slate-400">
            ({world.theme})
          </span>
        </div>
      </Html>
    </group>
  );
};

export const PlanetarySystem: React.FC = () => {
  // Stagger initial angles so planets do not start clustered in a line
  const orbitingWorlds = worldsData.filter((w) => w.orbitRadius > 0);

  return (
    <group>
      {orbitingWorlds.map((world, idx) => {
        const initialAngle = (idx / orbitingWorlds.length) * Math.PI * 2;
        return <PlanetNode key={world.id} world={world} initialAngle={initialAngle} />;
      })}
    </group>
  );
};
