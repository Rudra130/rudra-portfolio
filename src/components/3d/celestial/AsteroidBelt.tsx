import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ASTEROID_BELT_CONFIG } from '../../../config/orbitalConfig';
import { useUniverseStore } from '../../../store/useUniverseStore';
import {
  computeEllipticalPosition,
  computeKeplerianVelocityMultiplier,
} from '../../../utils/math';

/**
 * Deterministic PRNG (Mulberry32) so asteroid belt distribution and geometry
 * remain stable across renders.
 */
function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a low-poly irregular rocky geometry with seam-consistent vertex perturbation
 * so shared triangle vertices stay watertight while looking rugged and mineral-faceted.
 */
function createIrregularAsteroidGeometry(): THREE.BufferGeometry {
  const geo = new THREE.DodecahedronGeometry(1, 0);
  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const scaleByVertexKey = new Map<string, number>();
  const rand = createSeededRandom(13062026);

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`;

    let radialScale = scaleByVertexKey.get(key);
    if (radialScale === undefined) {
      radialScale = 0.74 + rand() * 0.44;
      scaleByVertexKey.set(key, radialScale);
    }

    posAttr.setXYZ(i, x * radialScale, y * radialScale, z * radialScale);
  }

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

const ASTEROID_PALETTE = [
  '#9c8f84', // Silicate stone
  '#b8a693', // Light regolith
  '#766f6a', // Carbonaceous chondrite
  '#c7a27c', // Iron-nickel bronze gleam
  '#94a3b8', // Metallic slate
  '#82756a', // Dusty basalt
];

interface AsteroidSimBuffers {
  semiMajorAxes: Float32Array;
  angles: Float32Array;
  yOffsets: Float32Array;
  orbitSpeeds: Float32Array;
  scalesX: Float32Array;
  scalesY: Float32Array;
  scalesZ: Float32Array;
  rotX: Float32Array;
  rotY: Float32Array;
  rotZ: Float32Array;
  spinX: Float32Array;
  spinY: Float32Array;
  spinZ: Float32Array;
  colors: THREE.Color[];
}

const noopRaycast = () => {};

/**
 * Renders the Main Asteroid Belt between Mangal (Mars) and Guru (Jupiter)
 * using a single GPU-instanced draw call with Keplerian elliptical revolution.
 */
export const AsteroidBelt: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { isOrbitPaused, activeWorldId } = useUniverseStore();

  const { count, innerSemiMajorAxis, outerSemiMajorAxis, eccentricity, inclinationDeg, verticalSpread, baseOrbitSpeed, minRadius, maxRadius } =
    ASTEROID_BELT_CONFIG;

  const geometry = useMemo(() => createIrregularAsteroidGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.88,
        metalness: 0.18,
        flatShading: true,
        emissive: '#473c32',
        emissiveIntensity: 0.28,
      }),
    []
  );

  // Preallocated scratch objects so useFrame performs zero heap allocations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);

  const sim = useMemo<AsteroidSimBuffers>(() => {
    const rand = createSeededRandom(424242);
    const semiMajorAxes = new Float32Array(count);
    const angles = new Float32Array(count);
    const yOffsets = new Float32Array(count);
    const orbitSpeeds = new Float32Array(count);
    const scalesX = new Float32Array(count);
    const scalesY = new Float32Array(count);
    const scalesZ = new Float32Array(count);
    const rotX = new Float32Array(count);
    const rotY = new Float32Array(count);
    const rotZ = new Float32Array(count);
    const spinX = new Float32Array(count);
    const spinY = new Float32Array(count);
    const spinZ = new Float32Array(count);
    const colors: THREE.Color[] = [];

    const midA = (innerSemiMajorAxis + outerSemiMajorAxis) * 0.5;
    const width = outerSemiMajorAxis - innerSemiMajorAxis;

    for (let i = 0; i < count; i++) {
      // Triangular distribution concentrates density softly toward belt center
      const t = (rand() + rand()) * 0.5;
      const a = innerSemiMajorAxis + t * width;
      semiMajorAxes[i] = a;

      angles[i] = rand() * Math.PI * 2;
      // Vertical Gaussian-like taper toward belt edges
      const edgeTaper = 1.0 - Math.abs(t - 0.5) * 0.7;
      yOffsets[i] = (rand() - 0.5) * verticalSpread * edgeTaper;

      // Inner belt rocks orbit slightly faster than outer belt rocks (Keplerian shear)
      const radialShear = Math.pow(midA / a, 1.5);
      orbitSpeeds[i] = baseOrbitSpeed * radialShear * (0.94 + rand() * 0.12);

      // Power-law size distribution: many small rocks + occasional larger boulders
      const sizeRoll = Math.pow(rand(), 2.2);
      const baseScale = minRadius + sizeRoll * (maxRadius - minRadius);
      scalesX[i] = baseScale * (0.75 + rand() * 0.65);
      scalesY[i] = baseScale * (0.6 + rand() * 0.55);
      scalesZ[i] = baseScale * (0.75 + rand() * 0.65);

      rotX[i] = rand() * Math.PI * 2;
      rotY[i] = rand() * Math.PI * 2;
      rotZ[i] = rand() * Math.PI * 2;

      spinX[i] = (rand() - 0.5) * 0.9;
      spinY[i] = (rand() - 0.5) * 0.9;
      spinZ[i] = (rand() - 0.5) * 0.9;

      const hex = ASTEROID_PALETTE[Math.floor(rand() * ASTEROID_PALETTE.length)];
      const col = new THREE.Color(hex);
      col.offsetHSL(0, 0, (rand() - 0.5) * 0.1);
      colors.push(col);
    }

    return {
      semiMajorAxes,
      angles,
      yOffsets,
      orbitSpeeds,
      scalesX,
      scalesY,
      scalesZ,
      rotX,
      rotY,
      rotZ,
      spinX,
      spinY,
      spinZ,
      colors,
    };
  }, [
    count,
    innerSemiMajorAxis,
    outerSemiMajorAxis,
    verticalSpread,
    baseOrbitSpeed,
    minRadius,
    maxRadius,
  ]);

  // Initialize instance transforms and per-rock colors once mounted
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      computeEllipticalPosition(
        sim.semiMajorAxes[i],
        sim.angles[i],
        eccentricity,
        inclinationDeg,
        tempPos
      );
      dummy.position.set(tempPos.x, tempPos.y + sim.yOffsets[i], tempPos.z);
      dummy.rotation.set(sim.rotX[i], sim.rotY[i], sim.rotZ[i]);
      dummy.scale.set(sim.scalesX[i], sim.scalesY[i], sim.scalesZ[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, sim.colors[i]);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, eccentricity, inclinationDeg, sim, dummy, tempPos]);

  // Dispose manually created geometry and material on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const clampedDelta = Math.min(delta, 0.05);
    const orbitMultiplier = isOrbitPaused ? 0 : activeWorldId ? 0.25 : 1.0;

    for (let i = 0; i < count; i++) {
      const a = sim.semiMajorAxes[i];

      if (orbitMultiplier > 0) {
        const keplerFactor = computeKeplerianVelocityMultiplier(
          a,
          eccentricity,
          sim.angles[i]
        );
        sim.angles[i] += clampedDelta * sim.orbitSpeeds[i] * keplerFactor * orbitMultiplier;
      }

      sim.rotX[i] += clampedDelta * sim.spinX[i];
      sim.rotY[i] += clampedDelta * sim.spinY[i];
      sim.rotZ[i] += clampedDelta * sim.spinZ[i];

      computeEllipticalPosition(a, sim.angles[i], eccentricity, inclinationDeg, tempPos);
      dummy.position.set(tempPos.x, tempPos.y + sim.yOffsets[i], tempPos.z);
      dummy.rotation.set(sim.rotX[i], sim.rotY[i], sim.rotZ[i]);
      dummy.scale.set(sim.scalesX[i], sim.scalesY[i], sim.scalesZ[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
      raycast={noopRaycast}
    />
  );
};
