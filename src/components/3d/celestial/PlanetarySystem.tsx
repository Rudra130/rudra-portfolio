import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { CelestialBodyMeta } from '../../../types/celestial';
import { computeEllipticalPosition, computeKeplerianVelocityMultiplier } from '../../../utils/math';
import { SPEC_SEMI_MAJOR_RADII } from '../../../config/orbitalConfig';

// Shared live coordinate registry for 100% accurate camera tracking
export const celestialPositions: Record<string, [number, number, number]> = {
  surya: [0, 0, 0],
  budh: [SPEC_SEMI_MAJOR_RADII[0], 0, 0], // 2.0
  shukra: [SPEC_SEMI_MAJOR_RADII[1], 0, 0], // 3.1
  mangal: [SPEC_SEMI_MAJOR_RADII[3], 0, 0], // 4.5
  guru: [SPEC_SEMI_MAJOR_RADII[4], 0, 0], // 6.7
  shani: [SPEC_SEMI_MAJOR_RADII[5], 0, 0], // 7.8
  rahu: [SPEC_SEMI_MAJOR_RADII[6], 0, 0], // 9.1
  ketu: [SPEC_SEMI_MAJOR_RADII[7], 0, 0], // 9.9
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
  const cloudsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(initialAngle);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const glowScaleRef = useRef<number>(1.12);

  // Preallocated vector for zero allocation in useFrame
  const tempPos = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);

  const { selectWorld, setHoveredWorld, hoveredWorldId, activeWorldId, isOrbitPaused } =
    useUniverseStore();
  const isHovered = hoveredWorldId === world.id;
  const isSelected = activeWorldId === world.id;

  const hasAtmosphere = ['shukra', 'guru'].includes(world.id);

  // Ultra-reliable single-click handler that ignores minor sub-pixel drag but guarantees instant response
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    downPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    if (downPosRef.current) {
      const dx = e.clientX - downPosRef.current.x;
      const dy = e.clientY - downPosRef.current.y;
      if (Math.hypot(dx, dy) < 8) {
        selectWorld(world.id);
      }
    }
    downPosRef.current = null;
  };

  // Initialize starting coordinate
  useEffect(() => {
    computeEllipticalPosition(
      world.orbitRadius,
      initialAngle,
      world.eccentricity ?? 0.05,
      world.inclination ?? 0,
      tempPos
    );
    celestialPositions[world.id] = [tempPos.x, tempPos.y, tempPos.z];
    if (groupRef.current) {
      groupRef.current.position.set(tempPos.x, tempPos.y, tempPos.z);
    }
  }, [initialAngle, world.id, world.orbitRadius, world.eccentricity, world.inclination, tempPos]);

  useFrame((_, delta) => {
    // 1. Continuous Keplerian Elliptical Revolution
    // Planets move faster near perihelion and slower near aphelion (Kepler's Second Law)
    // If global pause is active or this specific world is selected, orbital revolution is halted
    if (!isOrbitPaused && !isSelected) {
      const speedMultiplier = activeWorldId ? 0.25 : 1.0;
      const keplerFactor = computeKeplerianVelocityMultiplier(
        world.orbitRadius,
        world.eccentricity ?? 0.05,
        angleRef.current
      );
      angleRef.current += delta * world.orbitSpeed * keplerFactor * speedMultiplier;
    }

    computeEllipticalPosition(
      world.orbitRadius,
      angleRef.current,
      world.eccentricity ?? 0.05,
      world.inclination ?? 0,
      tempPos
    );
    celestialPositions[world.id] = [tempPos.x, tempPos.y, tempPos.z];

    if (groupRef.current) {
      groupRef.current.position.set(tempPos.x, tempPos.y, tempPos.z);
    }

    // 2. Independent Axial Rotation (Increased rotating speed ~3.5x for visible, living spin)
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (world.rotationSpeed ?? 0.05) * 3.5;
    }

    // 3. Differential Cloud Layer Rotation
    if (cloudsRef.current) {
      const cloudSpeed = world.cloudSpeed ?? (world.rotationSpeed ?? 0.05) * 1.35;
      cloudsRef.current.rotation.y += delta * cloudSpeed * 3.5;
    }

    // 4. Smooth Atmospheric Glow Lerp on Hover/Selection
    const targetGlowScale = isHovered ? 1.25 : isSelected ? 1.18 : 1.12;
    glowScaleRef.current = THREE.MathUtils.lerp(glowScaleRef.current, targetGlowScale, delta * 6);
    if (glowRef.current) {
      glowRef.current.scale.setScalar(glowScaleRef.current);
    }
  });

  return (
    <group
      ref={groupRef}
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
      {/* Expanded Raycastable Hitbox (fully captures clicks on moving targets) */}
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={(e) => {
          e.stopPropagation();
          selectWorld(world.id);
        }}
      >
        <sphereGeometry args={[world.radius * 1.35, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Dedicated Inspection Keylight */}
      {isSelected && (
        <directionalLight
          position={[world.radius * 0.8, world.radius * 1.0, world.radius * 1.6]}
          intensity={4.0}
          color="#fffaf0"
        />
      )}

      {/* Axial Tilt Orienting Group */}
      <group rotation={[0, 0, ((world.axialTilt ?? 0) * Math.PI) / 180]}>
        {/* Photorealistic Planetary Sphere */}
        <mesh
          ref={meshRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={(e) => {
            e.stopPropagation();
            selectWorld(world.id);
          }}
        >
          <sphereGeometry args={[world.radius, 64, 64]} />
          {texture ? (
            <meshStandardMaterial
              map={texture}
              roughness={world.id === 'budh' ? 0.85 : 0.55}
              metalness={world.id === 'budh' ? 0.15 : 0.05}
              emissive={world.glowColor}
              emissiveIntensity={isHovered || isSelected ? 0.38 : 0.08}
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

        {/* Concentric Differential Cloud/Atmosphere Layer */}
        {hasAtmosphere && texture && (
          <mesh ref={cloudsRef} scale={[1.018, 1.018, 1.018]}>
            <sphereGeometry args={[world.radius, 48, 48]} />
            <meshStandardMaterial
              map={texture}
              transparent={true}
              opacity={world.id === 'shukra' ? 0.42 : 0.26}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              roughness={0.9}
            />
          </mesh>
        )}

        {/* Saturn's Iconic Rings with Alpha Division (tilted along Saturn's axial tilt) */}
        {world.id === 'shani' && (
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={(e) => {
              e.stopPropagation();
              selectWorld(world.id);
            }}
          >
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
          <mesh
            rotation={[-Math.PI / 4, 0.1, 0]}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={(e) => {
              e.stopPropagation();
              selectWorld(world.id);
            }}
          >
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
          <mesh
            scale={[1.4, 1.4, 3.0]}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={(e) => {
              e.stopPropagation();
              selectWorld(world.id);
            }}
          >
            <sphereGeometry args={[world.radius, 24, 24]} />
            <meshBasicMaterial
              color="#14b8a6"
              transparent={true}
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>

      {/* Atmospheric Fresnel Rim Glow on Hover/Selection */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[world.radius, 32, 32]} />
        <meshBasicMaterial
          color={world.glowColor}
          transparent={true}
          opacity={isHovered ? 0.58 : isSelected ? 0.42 : 0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export const PlanetarySystem: React.FC = () => {
  // Load real NASA 2K planetary textures
  const [
    mercuryTex,
    venusTex,
    marsTex,
    jupiterTex,
    saturnTex,
    saturnRingTex,
    rahuTex,
    ketuTex,
  ] = useLoader(THREE.TextureLoader, [
    '/textures/planets/mercury.jpg',
    '/textures/planets/venus.jpg',
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
