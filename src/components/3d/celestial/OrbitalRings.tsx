import React, { useMemo } from 'react';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';
import { useUniverseStore } from '../../../store/useUniverseStore';

export const OrbitalRings: React.FC = () => {
  const { hoveredWorldId, activeWorldId } = useUniverseStore();

  const rings = useMemo(() => {
    return worldsData
      .filter((w) => w.orbitRadius > 0)
      .map((world) => {
        // High-precision circle points for the core bright line
        const segments = 160;
        const points = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * world.orbitRadius, 0, Math.sin(theta) * world.orbitRadius));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: world.color,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
        });
        const line = new THREE.LineLoop(lineGeo, lineMat);

        return {
          id: world.id,
          orbitRadius: world.orbitRadius,
          color: world.color,
          line,
        };
      });
  }, []);

  return (
    <group>
      {rings.map((ring) => {
        const isHighlighted = hoveredWorldId === ring.id || activeWorldId === ring.id;

        return (
          <group key={ring.id}>
            {/* 1. Core Crisp Orbital Line */}
            <primitive object={ring.line} />

            {/* 2. Luminous Anti-Aliased Ribbon Ring for clear, bold visibility */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[ring.orbitRadius - 0.35, ring.orbitRadius + 0.35, 160]} />
              <meshBasicMaterial
                color={ring.color}
                transparent={true}
                opacity={isHighlighted ? 0.7 : 0.38}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
