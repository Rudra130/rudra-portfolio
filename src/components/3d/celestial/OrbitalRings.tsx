import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ORBITAL_CONFIG, OrbitalParameter } from '../../../config/orbitalConfig';
import { useUniverseStore } from '../../../store/useUniverseStore';

/**
 * Creates a thin, anti-aliased elliptical ribbon geometry with the Sun
 * located at one focus (0, 0, 0).
 *
 * Ellipse equation around focus:
 * - b = a * sqrt(1 - e^2)
 * - c = a * e
 * - x = a * cos(theta) - c
 * - y = b * sin(theta) * sin(inclination)
 * - z = b * sin(theta) * cos(inclination)
 */
function createFocusCenteredEllipticalRibbon(
  orbit: OrbitalParameter,
  width: number = 0.024,
  segments: number = 240
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const incRad = (orbit.inclinationDeg * Math.PI) / 180;
  const sinInc = Math.sin(incRad);
  const cosInc = Math.cos(incRad);
  const sqrtE = Math.sqrt(Math.max(0, 1 - orbit.eccentricity * orbit.eccentricity));

  const aIn = orbit.semiMajorAxis - width * 0.5;
  const aOut = orbit.semiMajorAxis + width * 0.5;

  const bIn = aIn * sqrtE;
  const cIn = aIn * orbit.eccentricity;

  const bOut = aOut * sqrtE;
  const cOut = aOut * orbit.eccentricity;

  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Inner edge
    positions.push(
      aIn * cosT - cIn,
      bIn * sinT * sinInc,
      bIn * sinT * cosInc
    );

    // Outer edge
    positions.push(
      aOut * cosT - cOut,
      bOut * sinT * sinInc,
      bOut * sinT * cosInc
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

/**
 * Creates a thin, subtle core line loop centered around focus (0, 0, 0).
 */
function createFocusCenteredLine(
  orbit: OrbitalParameter,
  segments: number = 240
): THREE.LineLoop {
  const incRad = (orbit.inclinationDeg * Math.PI) / 180;
  const sinInc = Math.sin(incRad);
  const cosInc = Math.cos(incRad);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    points.push(
      new THREE.Vector3(
        orbit.semiMajorAxis * cosT - orbit.focusOffset,
        orbit.semiMinorAxis * sinT * sinInc,
        orbit.semiMinorAxis * sinT * cosInc
      )
    );
  }

  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({
    color: orbit.color,
    transparent: true,
    opacity: orbit.isActiveWorld ? 0.42 : 0.16,
    depthWrite: false,
  });

  return new THREE.LineLoop(lineGeo, lineMat);
}

export const OrbitalRings: React.FC = () => {
  const { hoveredWorldId, activeWorldId } = useUniverseStore();

  const rings = useMemo(() => {
    return ORBITAL_CONFIG.map((orbit) => {
      const ribbonGeo = createFocusCenteredEllipticalRibbon(orbit, 0.024, 240);
      const line = createFocusCenteredLine(orbit, 240);

      return {
        id: orbit.id,
        worldId: orbit.worldId,
        color: orbit.color,
        isActiveWorld: orbit.isActiveWorld,
        line,
        ribbonGeo,
      };
    });
  }, []);

  return (
    <group>
      {rings.map((ring) => {
        const isHighlighted =
          ring.worldId &&
          (hoveredWorldId === ring.worldId || activeWorldId === ring.worldId);

        return (
          <group key={ring.id}>
            {/* 1. Core Crisp Elliptical Line */}
            <primitive object={ring.line} />

            {/* 2. Luminous Anti-Aliased Elliptical Ribbon Ring */}
            <mesh geometry={ring.ribbonGeo}>
              <meshBasicMaterial
                color={ring.color}
                transparent={true}
                opacity={
                  isHighlighted
                    ? 0.85
                    : ring.isActiveWorld
                    ? 0.22
                    : 0.09
                }
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
