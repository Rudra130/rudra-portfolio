import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';

const noopRaycast = () => {};

function createSolarHaloTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
    grad.addColorStop(0.0, 'rgba(255, 251, 235, 0.95)');
    grad.addColorStop(0.18, 'rgba(253, 224, 71, 0.72)');
    grad.addColorStop(0.42, 'rgba(245, 158, 11, 0.34)');
    grad.addColorStop(0.72, 'rgba(234, 88, 12, 0.10)');
    grad.addColorStop(1.0, 'rgba(234, 88, 12, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const Surya: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const flaresGroupRef = useRef<THREE.Group>(null);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);

  const { selectWorld, setHoveredWorld, hoveredWorldId } = useUniverseStore();
  const isHovered = hoveredWorldId === 'surya';

  // Load photorealistic Sun texture
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/planets/sun.jpg');
  sunTexture.wrapS = THREE.RepeatWrapping;
  sunTexture.wrapT = THREE.ClampToEdgeWrapping;

  const haloTexture = useMemo(() => createSolarHaloTexture(), []);
  useEffect(() => () => haloTexture.dispose(), [haloTexture]);

  // Prominent solar flare prominence configurations (scaled proportionally to Sun radius 1.18)
  const flareConfigs = useMemo(() => {
    return [
      { angle: 0.2, tilt: 0.1, radius: 0.29, tube: 0.026, speed: 1.2 },
      { angle: 1.3, tilt: -0.4, radius: 0.34, tube: 0.028, speed: 0.9 },
      { angle: 2.5, tilt: 0.3, radius: 0.26, tube: 0.024, speed: 1.4 },
      { angle: 3.7, tilt: -0.2, radius: 0.36, tube: 0.03, speed: 1.0 },
      { angle: 4.8, tilt: 0.5, radius: 0.28, tube: 0.025, speed: 1.3 },
      { angle: 5.8, tilt: -0.3, radius: 0.31, tube: 0.027, speed: 1.1 },
    ];
  }, []);

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
        selectWorld('surya');
      }
    }
    downPosRef.current = null;
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Increased Sun core rotating speed & breathing pulsation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.055;
      const pulse = 1.0 + 0.015 * Math.sin(time * 2.2) + 0.008 * Math.cos(time * 3.5);
      meshRef.current.scale.set(pulse, pulse, pulse);
    }

    // 2. Dual counter-rotating corona shells (increased rotation speed)
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.z -= delta * 0.06;
      innerCoronaRef.current.rotation.y += delta * 0.045;
      const innerPulse = 1.0 + 0.025 * Math.sin(time * 2.5);
      innerCoronaRef.current.scale.set(innerPulse, innerPulse, innerPulse);
    }

    if (outerCoronaRef.current) {
      outerCoronaRef.current.rotation.z += delta * 0.07;
      outerCoronaRef.current.rotation.x -= delta * 0.045;
      const outerPulse = 1.0 + 0.032 * Math.cos(time * 2.0);
      outerCoronaRef.current.scale.set(outerPulse, outerPulse, outerPulse);
    }

    // 3. Dynamic solar flare prominence rotation and pulsation
    if (flaresGroupRef.current) {
      flaresGroupRef.current.rotation.y += delta * 0.055;
      const flareScale = 1.0 + 0.08 * Math.sin(time * 3.0);
      flaresGroupRef.current.scale.set(1.0, flareScale, 1.0);
    }
  });

  return (
    <group
      position={[0, 0, 0]}
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
      {/* Fully Raycastable Invisible Hitbox */}
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={(e) => {
          e.stopPropagation();
          selectWorld('surya');
        }}
      >
        <sphereGeometry args={[1.55, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Volumetric Radial Solar Bloom Halo */}
      <sprite scale={isHovered ? [8.2, 8.2, 1] : [7.0, 7.0, 1]} raycast={noopRaycast}>
        <spriteMaterial
          map={haloTexture}
          transparent={true}
          opacity={isHovered ? 0.94 : 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Photorealistic Sun Sphere (Proportionally scaled to 1.18 Three.js units with Pulsing Core) */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={(e) => {
          e.stopPropagation();
          selectWorld('surya');
        }}
      >
        <sphereGeometry args={[1.18, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive="#f59e0b"
          emissiveIntensity={isHovered ? 2.8 : 2.1}
          roughness={0.4}
        />
      </mesh>

      {/* Inner Fiery Solar Corona Shell (Counter-Rotating) */}
      <mesh ref={innerCoronaRef}>
        <sphereGeometry args={[1.32, 36, 36]} />
        <meshBasicMaterial
          color="#ea580c"
          transparent={true}
          opacity={isHovered ? 0.48 : 0.32}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Ethereal Atmosphere Aura (Forward-Rotating) */}
      <mesh ref={outerCoronaRef}>
        <sphereGeometry args={[1.56, 36, 36]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent={true}
          opacity={isHovered ? 0.16 : 0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Animated Coronal Solar Flare Prominence Arcs */}
      <group ref={flaresGroupRef}>
        {flareConfigs.map((cfg, idx) => {
          const posX = Math.cos(cfg.angle) * 1.15;
          const posZ = Math.sin(cfg.angle) * 1.15;
          const posY = Math.sin(cfg.tilt) * 0.72;

          return (
            <mesh
              key={idx}
              position={[posX, posY, posZ]}
              rotation={[cfg.tilt, cfg.angle, Math.PI / 4]}
            >
              <torusGeometry args={[cfg.radius, cfg.tube, 8, 28, Math.PI * 0.9]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#f97316' : '#fbbf24'}
                transparent={true}
                opacity={isHovered ? 0.75 : 0.52}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
