import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { CelestialBodyMeta } from '../../../types/celestial';

// Shared live coordinate registry for 100% accurate camera tracking
export const celestialPositions: Record<string, [number, number, number]> = {
  surya: [0, 0, 0],
  budh: [16, 0, 0],
  shukra: [24, 0, 0],
  chandra: [33, 0, 0],
  mangal: [42, 0, 0],
  guru: [53, 0, 0],
  shani: [66, 0, 0],
  rahu: [80, 0, 0],
  ketu: [94, 0, 0],
};

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

  // Initialize starting coordinate
  useEffect(() => {
    const initX = Math.cos(initialAngle) * world.orbitRadius;
    const initZ = Math.sin(initialAngle) * world.orbitRadius;
    celestialPositions[world.id] = [initX, 0, initZ];
    if (groupRef.current) {
      groupRef.current.position.set(initX, 0, initZ);
    }
  }, [initialAngle, world.id, world.orbitRadius]);

  useFrame((_, delta) => {
    // When this planet is selected, freeze its orbital revolution so it stays fixed for camera focus!
    if (!isSelected) {
      const speedMultiplier = activeWorldId ? 0.2 : 1.0;
      angleRef.current += delta * world.orbitSpeed * 0.16 * speedMultiplier;
    }

    const x = Math.cos(angleRef.current) * world.orbitRadius;
    const z = Math.sin(angleRef.current) * world.orbitRadius;
    celestialPositions[world.id] = [x, 0, z];

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    // Always rotate planet on its own Y-axis for realistic 3D appearance
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
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
      {/* Inspection Keylight: Illuminates the planet brilliantly when selected */}
      {isSelected && (
        <directionalLight
          position={[2.5, 3.5, 5.0]}
          intensity={3.2}
          color="#fff8ee"
        />
      )}

      {/* Photorealistic Planetary Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[world.radius, 64, 64]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={world.id === 'budh' ? 0.85 : 0.55}
            metalness={world.id === 'budh' ? 0.15 : 0.05}
            emissive={world.glowColor}
            emissiveIntensity={isHovered || isSelected ? 0.3 : 0.05}
          />
        ) : (
          <meshStandardMaterial
            color={world.color}
            roughness={0.6}
            emissive={world.glowColor}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
          />
        )}
      </mesh>

      {/* Saturn's Iconic Rings with Alpha Division */}
      {world.id === 'shani' && (
        <mesh rotation={[-Math.PI / 3, 0.2, 0]}>
          <ringGeometry args={[world.radius * 1.35, world.radius * 2.5, 64]} />
          <meshStandardMaterial
            map={ringTexture || undefined}
            color="#e2d8b0"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.92}
            roughness={0.6}
          />
        </mesh>
      )}

      {/* Rahu Swirling Singularity Accretion Disk */}
      {world.id === 'rahu' && (
        <mesh rotation={[-Math.PI / 4, 0.1, 0]}>
          <ringGeometry args={[world.radius * 1.25, world.radius * 2.4, 48]} />
          <meshBasicMaterial
            color="#6366f1"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Ketu Ethereal Cometary Plume */}
      {world.id === 'ketu' && (
        <mesh scale={[1.4, 1.4, 3.0]}>
          <sphereGeometry args={[world.radius, 24, 24]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent={true}
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Atmospheric Rim Glow on Hover/Selection */}
      {(isHovered || isSelected) && (
        <mesh scale={[1.16, 1.16, 1.16]}>
          <sphereGeometry args={[world.radius, 32, 32]} />
          <meshBasicMaterial
            color={world.glowColor}
            transparent={true}
            opacity={0.38}
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
              isHovered
                ? 'bg-slate-900/90 border border-amber-400 text-amber-300 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-slate-950/60 text-slate-200 border border-white/10 opacity-90'
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
    rahuTex,
    ketuTex,
  ] = useLoader(THREE.TextureLoader, [
    '/textures/planets/mercury.jpg',
    '/textures/planets/venus.jpg',
    '/textures/planets/moon.jpg',
    '/textures/planets/mars.jpg',
    '/textures/planets/jupiter.jpg',
    '/textures/planets/saturn.jpg',
    '/textures/planets/saturn_ring_alpha.png',
    '/textures/planets/rahu.jpg',
    '/textures/planets/ketu.jpg',
  ]);

  const textureMap: Record<string, THREE.Texture> = {
    budh: mercuryTex,
    shukra: venusTex,
    chandra: moonTex,
    mangal: marsTex,
    guru: jupiterTex,
    shani: saturnTex,
    rahu: rahuTex,
    ketu: ketuTex,
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
