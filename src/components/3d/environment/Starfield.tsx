import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export const Starfield: React.FC = () => {
  // Balanced star count for clean, uncluttered celestial ambiance
  const count = 750;

  const skyboxRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<{ uniforms: { uTime: { value: number } } } | null>(null);

  // Load cosmic deep space nebula background map (matching UI reference view 2)
  const bgTexture = useLoader(THREE.TextureLoader, '/textures/backgrounds/cosmic_nebula_bg.jpg');

  const [positions, colors, twinkleData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const twk = new Float32Array(count * 2);

    const palette = [
      new THREE.Color('#ffffff'), // pure white
      new THREE.Color('#cbd5e1'), // slate silver
      new THREE.Color('#7dd3fc'), // subtle cyan
      new THREE.Color('#fef08a'), // warm gold
      new THREE.Color('#f472b6'), // faint rose
    ];

    for (let i = 0; i < count; i++) {
      const radius = 35 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      // Twinkle phase (0..2PI) and speed (1.2..3.5 rad/s)
      twk[i * 2] = Math.random() * Math.PI * 2;
      twk[i * 2 + 1] = 1.2 + Math.random() * 2.3;
    }

    return [pos, col, twk];
  }, [count]);

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = { value: 0 };
    shaderRef.current = shader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       attribute vec2 aTwinkle;
       varying float vTwinkle;
       uniform float uTime;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <color_vertex>',
      `#include <color_vertex>
       float twk = sin(uTime * aTwinkle.y + aTwinkle.x);
       vTwinkle = 0.5 + 0.5 * twk;
       gl_PointSize = gl_PointSize * (0.8 + 0.45 * twk);`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
       varying float vTwinkle;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
       diffuseColor.a *= (0.45 + 0.55 * vTwinkle);`
    );
  };

  useFrame((state, delta) => {
    // 1. Celestial background rotation drift
    if (skyboxRef.current) {
      skyboxRef.current.rotation.y += delta * 0.0004;
    }

    // 2. Starfield slow multidimensional cosmic drift
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.0012;
      pointsRef.current.rotation.z += delta * 0.0006;
    }

    // 3. GPU twinkle clock update
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group>
      {/* Deep Space Milky Way Skybox Sphere */}
      <mesh ref={skyboxRef}>
        <sphereGeometry args={[120, 48, 48]} />
        <meshBasicMaterial
          map={bgTexture}
          side={THREE.BackSide}
          transparent={true}
          opacity={0.75}
        />
      </mesh>

      {/* Instanced 3D Subtle Starfield Particles with GPU Twinkling */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-aTwinkle"
            args={[twinkleData, 2]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          depthWrite={false}
          onBeforeCompile={onBeforeCompile}
        />
      </points>
    </group>
  );
};
