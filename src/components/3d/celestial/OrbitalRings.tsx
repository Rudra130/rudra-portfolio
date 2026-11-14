import React, { useMemo } from 'react';
import * as THREE from 'three';
import { worldsData } from '../../../data/worlds';
import { useUniverseStore } from '../../../store/useUniverseStore';

function createEllipticalRibbonGeometry(
  radius: number,
  eccentricity: number,
  inclinationDeg: number,
  width: number = 0.65,
  segments: number = 180
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const incRad = (inclinationDeg * Math.PI) / 180;
  const sqrtE = Math.sqrt(Math.max(0, 1 - eccentricity * eccentricity));
  const sinInc = Math.sin(incRad);

  const positions: number[] = [];
  const indices: number[] = [];

  const rInner = radius - width;
  const rOuter = radius + width;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Inner ring vertex
    positions.push(
      rInner * cosT,
      rInner * sinInc * sinT,
      rInner * sqrtE * sinT
    );

    // Outer ring vertex
    positions.push(
      rOuter * cosT,
      rOuter * sinInc * sinT,
      rOuter * sqrtE * sinT
    );
  }

  for (let i = 0; i < segments; i++) {
    const p1 = i * 2;
    const p2 = p1 + 1;
    const p3 = p1 + 2;
    const p4 = p1 + 3;

    indices.push(p1, p2, p3);
    indices.push(p2, p4, p3);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export const OrbitalRings: React.FC = () => {
  const { hoveredWorldId, activeWorldId } = useUniverseStore();

  const rings = useMemo(() => {
    return worldsData
      .filter((w) => w.orbitRadius > 0)
      .map((world) => {
        const segments = 180;
        const e = world.eccentricity ?? 0.05;
        const incDeg = world.inclination ?? 0;
        const incRad = (incDeg * Math.PI) / 180;
        const sqrtE = Math.sqrt(Math.max(0, 1 - e * e));
        const sinInc = Math.sin(incRad);

        // 1. High-precision elliptical center line
        const points = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          points.push(
            new THREE.Vector3(
              world.orbitRadius * Math.cos(theta),
              world.orbitRadius * sinInc * Math.sin(theta),
              world.orbitRadius * sqrtE * Math.sin(theta)
            )
          );
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: world.color,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        });
        const line = new THREE.LineLoop(lineGeo, lineMat);

        // 2. High-precision matching elliptical ribbon geometry
        const ribbonGeo = createEllipticalRibbonGeometry(world.orbitRadius, e, incDeg, 0.65, segments);

        return {
          id: world.id,
          orbitRadius: world.orbitRadius,
          color: world.color,
          line,
          ribbonGeo,
        };
      });
  }, []);

  return (
    <group>
      {rings.map((ring) => {
        const isHighlighted = hoveredWorldId === ring.id || activeWorldId === ring.id;

        return (
          <group key={ring.id}>
            {/* 1. Core Crisp Elliptical Line */}
            <primitive object={ring.line} />

            {/* 2. Luminous Anti-Aliased Elliptical Ribbon Ring */}
            <mesh geometry={ring.ribbonGeo}>
              <meshBasicMaterial
                color={ring.color}
                transparent={true}
                opacity={isHighlighted ? 0.78 : 0.44}
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
