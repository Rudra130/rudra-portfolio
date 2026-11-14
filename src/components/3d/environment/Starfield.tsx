import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export const Starfield: React.FC = () => {
  const count = 3500;

  // Load cosmic deep space nebula background map (matching UI reference view 2)
  const bgTexture = useLoader(THREE.TextureLoader, '/textures/backgrounds/cosmic_nebula_bg.jpg');

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#ffffff'), // pure white
      new THREE.Color('#cbd5e1'), // slate silver
      new THREE.Color('#38bdf8'), // azure blue
      new THREE.Color('#fef08a'), // warm yellow
      new THREE.Color('#f472b6'), // faint rose
    ];

    for (let i = 0; i < count; i++) {
      const radius = 220 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  return (
    <group>
      {/* Deep Space Milky Way Skybox Sphere */}
      <mesh>
        <sphereGeometry args={[420, 48, 48]} />
        <meshBasicMaterial
          map={bgTexture}
          side={THREE.BackSide}
          transparent={true}
          opacity={0.85}
        />
      </mesh>

      {/* Instanced 3D Starfield Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
