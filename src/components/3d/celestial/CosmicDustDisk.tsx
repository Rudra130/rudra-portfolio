import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORBITAL_CONFIG } from '../../../config/orbitalConfig';
import { useUniverseStore } from '../../../store/useUniverseStore';
import { celestialPositions } from './PlanetarySystem';

const PLANET_IDS = ['budh', 'shukra', 'mangal', 'guru', 'shani', 'rahu', 'ketu'] as const;

const noopRaycast = () => {};

const DUST_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const DUST_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPlanetPos[7];
  uniform float uPlanetRadius[7];
  varying vec3 vWorldPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.04 + vec2(17.1, 31.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 xz = vWorldPos.xz;
    float r = length(xz);
    if (r < 1.02 || r > 46.0) discard;

    // Differential Keplerian swirl around Surya (0, 0, 0)
    float angle = atan(xz.y, xz.x);
    float swirlAngle = angle + uTime * (0.24 / pow(max(r, 1.1), 0.72));
    vec2 swirlCoord = vec2(cos(swirlAngle) * r * 0.34, sin(swirlAngle) * r * 0.34);
    float cloudNoise = fbm(swirlCoord * 1.15);
    float cosmicNebula = fbm(xz * 0.14 + vec2(uTime * 0.012, -uTime * 0.008));
    float fineStreaks = noise(vec2(r * 4.4 + cloudNoise * 1.8, swirlAngle * 3.0));

    // Concentric accretion rings inside the solar system transitioning into outer cosmic dust clouds
    float ringWave = 0.54 + 0.46 * sin(r * 3.6 + cloudNoise * 2.2);
    float innerZone = 1.0 - smoothstep(6.0, 13.0, r);
    float beltBoost = exp(-pow((r - 5.55) / 0.95, 2.0)) * 0.28;
    float innerBoost = exp(-pow((r - 2.55) / 1.5, 2.0)) * 0.34;

    float innerFade = smoothstep(1.02, 1.65, r);
    float farFade = 1.0 - smoothstep(34.0, 46.0, r);

    // Keep meaningful visible dust density across the whole universe viewport (not fading out at orbit 10)
    float radialFloor = 0.26 + 0.74 * exp(-max(0.0, r - 1.3) * 0.11);
    float concentricMix = mix(0.45 + 0.75 * cosmicNebula, (0.45 + 0.55 * ringWave) * (0.58 + 0.52 * cloudNoise + 0.22 * fineStreaks), 0.32 + 0.68 * innerZone);

    float density = innerFade * farFade * (radialFloor * concentricMix + beltBoost + innerBoost);

    // Warm golden solar scatter -> dusty silicate taupe -> deep indigo/teal/amber universe nebula dust
    vec3 solarAmber = vec3(0.98, 0.72, 0.35);
    vec3 warmDust = vec3(0.74, 0.60, 0.45);
    vec3 outerSlate = vec3(0.36, 0.44, 0.58);
    vec3 deepCosmosTint = mix(vec3(0.22, 0.28, 0.42), vec3(0.38, 0.30, 0.26), cosmicNebula);

    vec3 baseCol = mix(solarAmber, warmDust, smoothstep(1.4, 4.8, r));
    baseCol = mix(baseCol, outerSlate, smoothstep(6.2, 11.5, r));
    baseCol = mix(baseCol, deepCosmosTint, smoothstep(11.0, 22.0, r));

    // Real-time analytic long radial shadows cast outward from Surya across inner & outer dust
    float shadowFactor = 1.0;
    for (int i = 0; i < 7; i++) {
      vec2 pXZ = uPlanetPos[i].xz;
      float pDist = length(pXZ);
      if (pDist > 0.2 && r > pDist) {
        vec2 pDir = pXZ / pDist;
        vec2 rel = xz - pXZ;
        float along = dot(rel, pDir);
        if (along > 0.0) {
          float perp = abs(rel.x * (-pDir.y) + rel.y * pDir.x);
          float pr = uPlanetRadius[i];
          float coneHalfWidth = pr * (0.96 + 0.048 * along);
          float penumbra = pr * (0.30 + 0.10 * along);
          float shadowMask = 1.0 - smoothstep(max(0.0, coneHalfWidth - penumbra * 0.35), coneHalfWidth + penumbra, perp);
          float shadowReach = exp(-along * 0.085) * smoothstep(0.0, pr * 0.55, along);
          shadowFactor *= (1.0 - 0.78 * shadowMask * shadowReach);
        }
      }
    }

    vec3 finalColor = baseCol * (0.38 + 0.92 * shadowFactor);
    float alpha = clamp(density * (0.34 + 0.38 * shadowFactor), 0.0, 0.72);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function createSoftParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.35, 'rgba(255, 244, 214, 0.7)');
    grad.addColorStop(1.0, 'rgba(255, 244, 214, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Renders the universe-wide swirling cosmic dust disk with concentric solar
 * rings, real-time radial planetary shadows, and sunlit micro-dust specks.
 */
export const CosmicDustDisk: React.FC = () => {
  const dustPointsRef = useRef<THREE.Points>(null);
  const { isOrbitPaused, activeWorldId } = useUniverseStore();

  const planetRadii = useMemo(
    () =>
      PLANET_IDS.map((id) => ORBITAL_CONFIG.find((o) => o.worldId === id)?.planetRadius ?? 0.25),
    []
  );

  const planetVectors = useMemo(
    () => PLANET_IDS.map(() => new THREE.Vector3()),
    []
  );

  const diskGeo = useMemo(() => new THREE.RingGeometry(1.02, 46.0, 220, 8), []);

  const diskMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPlanetPos: { value: planetVectors },
          uPlanetRadius: { value: planetRadii },
        },
        vertexShader: DUST_VERTEX_SHADER,
        fragmentShader: DUST_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [planetVectors, planetRadii]
  );

  // Sunlit micro-dust grains dispersed across the full universe field
  const particleCount = 3200;
  const spriteTex = useMemo(() => createSoftParticleTexture(), []);

  const [particlePositions, particleColors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    let seed = 771199;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const warm = new THREE.Color('#fde68a');
    const dust = new THREE.Color('#cdb498');
    const cool = new THREE.Color('#94a3b8');
    const deep = new THREE.Color('#7dd3fc');
    const scratch = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const rRoll = rand();
      const radius =
        rRoll < 0.24
          ? 1.45 + rand() * 3.1
          : rRoll < 0.52
          ? 4.7 + rand() * 2.2
          : rRoll < 0.74
          ? 6.9 + rand() * 4.5
          : 11.4 + rand() * 22.0;
      const theta = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * (0.08 + Math.min(radius, 18) * 0.025);

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      if (radius < 3.6) {
        scratch.copy(warm).lerp(dust, (radius - 1.45) / 2.2);
      } else if (radius < 10.5) {
        scratch.copy(dust).lerp(cool, (radius - 3.6) / 6.9);
      } else {
        scratch.copy(cool).lerp(deep, Math.min(1, (radius - 10.5) / 18.0) * 0.5);
      }
      col[i * 3] = scratch.r;
      col[i * 3 + 1] = scratch.g;
      col[i * 3 + 2] = scratch.b;
    }
    return [pos, col];
  }, []);

  useEffect(() => {
    return () => {
      diskGeo.dispose();
      diskMat.dispose();
      spriteTex.dispose();
    };
  }, [diskGeo, diskMat, spriteTex]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const speedFactor = isOrbitPaused ? 0 : activeWorldId ? 0.25 : 1.0;

    diskMat.uniforms.uTime.value += clampedDelta * speedFactor;

    for (let i = 0; i < PLANET_IDS.length; i++) {
      const live = celestialPositions[PLANET_IDS[i]];
      if (live) {
        planetVectors[i].set(live[0], live[1], live[2]);
      }
    }

    if (dustPointsRef.current && speedFactor > 0) {
      dustPointsRef.current.rotation.y += clampedDelta * 0.028 * speedFactor;
    }
  });

  return (
    <group>
      {/* Universe-wide Swirling Accretion Dust Disk with Real-Time Planetary Shadows */}
      <mesh
        geometry={diskGeo}
        material={diskMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.015, 0]}
        raycast={noopRaycast}
      />

      {/* Sunlit Micro-Dust Speckles across Whole Universe */}
      <points ref={dustPointsRef} raycast={noopRaycast}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.058}
          map={spriteTex}
          vertexColors
          transparent
          opacity={0.58}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
