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
    if (r < 1.30 || r > 48.0) discard;

    // Continuous 360-degree Cartesian swirl coords avoid any atan(-PI..PI) seam
    float angle = atan(xz.y, xz.x);
    float swirlAngle = angle + uTime * (0.20 / pow(max(r, 1.1), 0.62));
    vec2 swirlDir = vec2(cos(swirlAngle), sin(swirlAngle));
    vec2 swirlCoord = swirlDir * (r * 0.28);
    float cloudNoise = fbm(swirlCoord * 1.15);
    float cosmicWisps = fbm(xz * 0.16 + vec2(uTime * 0.015, -uTime * 0.01));
    float fineStreaks = noise(swirlDir * 2.2 + vec2(r * 1.8 + cloudNoise * 1.6));

    // Uniform high dust density matching near-Sun intensity across all of space
    float ringWave = 0.56 + 0.44 * sin(r * 3.4 + cloudNoise * 2.2);
    float innerFade = smoothstep(1.30, 1.88, r);
    float farEdgeFade = 1.0 - smoothstep(42.0, 48.0, r);

    float concentricPattern = (0.48 + 0.52 * ringWave) * (0.62 + 0.46 * cloudNoise + 0.24 * fineStreaks);
    float cosmicPattern = 0.60 + 0.55 * cosmicWisps + 0.22 * fineStreaks;
    float beltAccent = exp(-pow((r - 5.55) / 1.1, 2.0)) * 0.16;

    // Equal density across inner solar orbits and vast outer space
    float density = innerFade * farEdgeFade * (mix(cosmicPattern, concentricPattern, 0.55) + beltAccent);

    // Rich sunlit golden-taupe dust near Sun carrying smoothly into luminous cosmic dust everywhere
    vec3 solarAmber = vec3(0.96, 0.72, 0.36);
    vec3 warmDust = vec3(0.76, 0.63, 0.48);
    vec3 cosmicTaupe = mix(vec3(0.64, 0.55, 0.46), vec3(0.48, 0.52, 0.60), cosmicWisps * 0.55);

    vec3 baseCol = mix(solarAmber, warmDust, smoothstep(1.3, 4.2, r));
    baseCol = mix(baseCol, cosmicTaupe, smoothstep(7.0, 18.0, r));

    // Real-time analytic long radial shadows extending cleanly across all of space
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
          float coneHalfWidth = pr * (0.96 + 0.045 * along);
          float penumbra = pr * (0.28 + 0.095 * along);
          float shadowMask = 1.0 - smoothstep(max(0.0, coneHalfWidth - penumbra * 0.35), coneHalfWidth + penumbra, perp);
          float shadowReach = exp(-along * 0.045) * smoothstep(0.0, pr * 0.55, along);
          shadowFactor *= (1.0 - 0.80 * shadowMask * shadowReach);
        }
      }
    }

    vec3 finalColor = baseCol * (0.36 + 0.88 * shadowFactor);
    float alpha = clamp(density * (0.34 + 0.30 * shadowFactor), 0.0, 0.64);

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
    grad.addColorStop(0.35, 'rgba(255, 244, 214, 0.72)');
    grad.addColorStop(1.0, 'rgba(255, 244, 214, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Renders a uniform-density cosmic dust sea across the entire universe with
 * concentric swirling structure, real-time radial planetary shadows, and
 * area-uniform sunlit micro-dust grains.
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

  const diskGeo = useMemo(() => new THREE.RingGeometry(1.30, 48.0, 220, 8), []);

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

  // Uniform area-density micro-dust grains across the entire visible universe
  const particleCount = 5600;
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
    const dust = new THREE.Color('#d6bea3');
    const cool = new THREE.Color('#b6c2d1');
    const scratch = new THREE.Color();

    const rMinSq = 1.62 * 1.62;
    const rMaxSq = 30.0 * 30.0;

    for (let i = 0; i < particleCount; i++) {
      // Sample r proportional to sqrt(area) so visual grain density stays uniform everywhere
      const radius = Math.sqrt(rMinSq + rand() * (rMaxSq - rMinSq));
      const theta = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * 0.26;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      if (radius < 4.5) {
        scratch.copy(warm).lerp(dust, (radius - 1.35) / 3.15);
      } else {
        scratch.copy(dust).lerp(cool, Math.min(1, (radius - 4.5) / 16.0) * 0.55);
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
      dustPointsRef.current.rotation.y += clampedDelta * 0.022 * speedFactor;
    }
  });

  return (
    <group>
      {/* Universe-wide Uniform Cosmic Dust Disk with Real-Time Planetary Shadows */}
      <mesh
        geometry={diskGeo}
        material={diskMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.015, 0]}
        raycast={noopRaycast}
      />

      {/* Area-Uniform Sunlit Micro-Dust Speckles across Whole Space */}
      <points ref={dustPointsRef} raycast={noopRaycast}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.052}
          map={spriteTex}
          vertexColors
          transparent
          opacity={0.54}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
