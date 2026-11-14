import React, { useMemo } from 'react';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';

export const OrbitalRings: React.FC = () => {
  const lineObjects = useMemo(() => {
    return worldsData
      .filter((w) => w.orbitRadius > 0)
      .map((world) => {
        const segments = 128;
        const points = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * world.orbitRadius, 0, Math.sin(theta) * world.orbitRadius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: world.color,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        });
        const line = new THREE.LineLoop(geometry, material);
        return { id: world.id, line };
      });
  }, []);

  return (
    <group>
      {lineObjects.map((item) => (
        <primitive key={item.id} object={item.line} />
      ))}
    </group>
  );
};
