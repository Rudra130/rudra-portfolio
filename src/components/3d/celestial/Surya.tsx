import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../../store/useUniverseStore';

export const Surya: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const flaresGroupRef = useRef<THREE.Group>(null);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);

  const { selectWorld, setHoveredWorld, hoveredWorldId, activeWorldId } = useUniverseStore();
  const isHovered = hoveredWorldId === 'surya';
  const isSelected = activeWorldId === 'surya';

  // Load photorealistic Sun texture
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/planets/sun.jpg');
  sunTexture.wrapS = THREE.RepeatWrapping;
  sunTexture.wrapT = THREE.ClampToEdgeWrapping;

  // Prominent solar flare prominence configurations
  const flareConfigs = useMemo(() => {
    return [
      { angle: 0.2, tilt: 0.1, radius: 4.8, tube: 0.45, speed: 1.2 },
      { angle: 1.3, tilt: -0.4, radius: 5.6, tube: 0.5, speed: 0.9 },
      { angle: 2.5, tilt: 0.3, radius: 4.2, tube: 0.4, speed: 1.4 },
      { angle: 3.7, tilt: -0.2, radius: 6.0, tube: 0.55, speed: 1.0 },
      { angle: 4.8, tilt: 0.5, radius: 4.6, tube: 0.42, speed: 1.3 },
      { angle: 5.8, tilt: -0.3, radius: 5.2, tube: 0.48, speed: 1.1 },
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

    // 1. Subtle, natural harmonic Sun core pulsation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.015;
      const pulse = 1.0 + 0.012 * Math.sin(time * 1.6) + 0.006 * Math.cos(time * 2.8);
      meshRef.current.scale.set(pulse, pulse, pulse);
    }

    // 2. Dual counter-rotating corona shells
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.z -= delta * 0.018;
      innerCoronaRef.current.rotation.y += delta * 0.012;
      const innerPulse = 1.0 + 0.02 * Math.sin(time * 2.0);
      innerCoronaRef.current.scale.set(innerPulse, innerPulse, innerPulse);
    }

    if (outerCoronaRef.current) {
      outerCoronaRef.current.rotation.z += delta * 0.022;
      outerCoronaRef.current.rotation.x -= delta * 0.015;
      const outerPulse = 1.0 + 0.028 * Math.cos(time * 1.4);
      outerCoronaRef.current.scale.set(outerPulse, outerPulse, outerPulse);
    }

    // 3. Dynamic solar flare prominence pulsation
    if (flaresGroupRef.current) {
      flaresGroupRef.current.rotation.y += delta * 0.015;
      const flareScale = 1.0 + 0.06 * Math.sin(time * 2.5);
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
        <sphereGeometry args={[25.0, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Photorealistic Sun Sphere (Enlarged to Radius 20.0 with Pulsing Core) */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={(e) => {
          e.stopPropagation();
          selectWorld('surya');
        }}
      >
        <sphereGeometry args={[20.0, 64, 64]} />
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
        <sphereGeometry args={[22.5, 36, 36]} />
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
        <sphereGeometry args={[26.5, 36, 36]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent={true}
          opacity={isHovered ? 0.22 : 0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Animated Coronal Solar Flare Prominence Arcs */}
      <group ref={flaresGroupRef}>
        {flareConfigs.map((cfg, idx) => {
          const posX = Math.cos(cfg.angle) * 19.5;
          const posZ = Math.sin(cfg.angle) * 19.5;
          const posY = Math.sin(cfg.tilt) * 12.0;

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

      {/* Surya Contextual Label */}
      {!activeWorldId && (
        <Html position={[0, -24.5, 0]} center distanceFactor={100} className="select-none">
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              selectWorld('surya');
            }}
            onClick={(e) => {
              e.stopPropagation();
              selectWorld('surya');
            }}
            className={`flex flex-col items-center whitespace-nowrap px-4 py-1.5 rounded-full text-center transition-all cursor-pointer pointer-events-auto ${
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
