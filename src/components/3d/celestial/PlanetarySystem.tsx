import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { CelestialBodyMeta } from '../../../types/celestial';

interface PlanetProps {
  world: CelestialBodyMeta;
  initialAngle: number;
  texture: THREE.Texture | null;
  ringTexture?: THREE.Texture | null;
}

const IndividualPlanet: React.FC<PlanetProps> = ({
  world,
  initialAngle,
  texture,
  ringTexture,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(initialAngle);

  const { selectWorld, setHoveredWorld, hoveredWorldId, activeWorldId } = useUniverseStore();
  const isHovered = hoveredWorldId === world.id;
  const isSelected = activeWorldId === world.id;

  useFrame((_, delta) => {
    // Decelerate orbits during close inspection
    const speed = activeWorldId ? 0.08 : 0.8;
    angleRef.current += delta * world.orbitSpeed * 0.18 * speed;

    if (groupRef.current) {
      const x = Math.cos(angleRef.current) * world.orbitRadius;
      const z = Math.sin(angleRef.current) * world.orbitRadius;
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
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
      {/* Photorealistic Planetary Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[world.radius, 48, 48]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={world.id === 'budh' ? 0.8 : 0.55}
            metalness={world.id === 'budh' ? 0.2 : 0.05}
            emissive={world.glowColor}
            emissiveIntensity={isHovered || isSelected ? 0.35 : 0.05}
          />
        ) : world.id === 'rahu' ? (
          // Rahu: Shadow Singularity Core
          <meshStandardMaterial
            color="#020204"
            roughness={0.9}
            metalness={0.8}
            emissive="#4338ca"
            emissiveIntensity={isHovered ? 0.6 : 0.2}
          />
        ) : (
          // Ketu: Cometary Nucleus
          <meshStandardMaterial
            color="#0d9488"
            roughness={0.4}
            emissive="#14b8a6"
            emissiveIntensity={isHovered ? 0.8 : 0.4}
          />
        )}
      </mesh>

      {/* Saturn's Iconic Rings with Alpha Division */}
      {world.id === 'shani' && (
        <mesh rotation={[-Math.PI / 3, 0.2, 0]}>
          <ringGeometry args={[world.radius * 1.35, world.radius * 2.45, 64]} />
          <meshStandardMaterial
            map={ringTexture || undefined}
            color="#e2d8b0"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.9}
            roughness={0.6}
          />
        </mesh>
      )}

      {/* Rahu Swirling Ultraviolet Accretion Disk */}
      {world.id === 'rahu' && (
        <mesh rotation={[-Math.PI / 4, 0.1, 0]}>
          <ringGeometry args={[world.radius * 1.25, world.radius * 2.3, 48]} />
          <meshBasicMaterial
            color="#6366f1"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Ketu Ethereal Cometary Plume */}
      {world.id === 'ketu' && (
        <mesh scale={[1.4, 1.4, 3.2]}>
          <sphereGeometry args={[world.radius, 24, 24]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent={true}
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Atmospheric Rim Glow on Hover/Selection */}
      {(isHovered || isSelected) && (
        <mesh scale={[1.18, 1.18, 1.18]}>
          <sphereGeometry args={[world.radius, 32, 32]} />
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
      {!activeWorldId && (
        <Html
          position={[0, world.radius + 1.3, 0]}
          center
          distanceFactor={60}
          className="pointer-events-none select-none transition-all duration-300"
        >
          <div
            className={`flex flex-col items-center whitespace-nowrap px-3 py-1 rounded-full text-center transition-all ${
              isHovered || isSelected
                ? 'bg-slate-900/90 border border-amber-400 text-amber-300 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-slate-950/50 text-slate-200 border border-white/5 opacity-85'
            }`}
          >
            <span className="text-[11px] font-display font-semibold tracking-wide flex items-center gap-1.5">
              <span style={{ color: world.color }}>{world.symbol}</span>
              <span>{world.sanskritName}</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              ({world.theme})
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

export const PlanetarySystem: React.FC = () => {
  // Load real NASA 2K planetary textures
  const [
    mercuryTex,
    venusTex,
    moonTex,
    marsTex,
    jupiterTex,
    saturnTex,
    saturnRingTex,
  ] = useLoader(THREE.TextureLoader, [
    '/textures/planets/mercury.jpg',
    '/textures/planets/venus.jpg',
    '/textures/planets/moon.jpg',
    '/textures/planets/mars.jpg',
    '/textures/planets/jupiter.jpg',
    '/textures/planets/saturn.jpg',
    '/textures/planets/saturn_ring_alpha.png',
  ]);

  const textureMap: Record<string, THREE.Texture> = {
    budh: mercuryTex,
    shukra: venusTex,
    chandra: moonTex,
    mangal: marsTex,
    guru: jupiterTex,
    shani: saturnTex,
  };

  const orbitingWorlds = worldsData.filter((w) => w.orbitRadius > 0);

  return (
    <group>
      {orbitingWorlds.map((world, idx) => {
        const initialAngle = (idx / orbitingWorlds.length) * Math.PI * 2;
        return (
          <IndividualPlanet
            key={world.id}
            world={world}
            initialAngle={initialAngle}
            texture={textureMap[world.id] || null}
            ringTexture={world.id === 'shani' ? saturnRingTex : undefined}
          />
        );
      })}
    </group>
  );
};
