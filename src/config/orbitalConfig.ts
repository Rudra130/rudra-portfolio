import { CelestialId } from '../types/celestial';

/**
 * Logarithmically compressed semi-major radii specification in Three.js units.
 * Exactly as specified in requirements:
 * [2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9]
 */
export const SPEC_SEMI_MAJOR_RADII = [
  2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9,
] as const;

export interface OrbitalParameter {
  id: string;
  worldId: CelestialId | null;
  name: string;
  semiMajorAxis: number; // a
  eccentricity: number; // e
  semiMinorAxis: number; // b = a * sqrt(1 - e^2)
  focusOffset: number; // c = a * e
  inclinationDeg: number; // orbital tilt in degrees
  orbitSpeed: number; // base angular speed (rad/s)
  color: string;
  glowColor: string;
  planetRadius: number; // 3D sphere radius in Three.js units
  cameraDistance: number; // inspection camera distance
  isActiveWorld: boolean; // whether this orbit hosts an active portfolio world
}

export function computeSemiMinorAxis(a: number, e: number): number {
  return a * Math.sqrt(Math.max(0, 1 - e * e));
}

export function computeFocusOffset(a: number, e: number): number {
  return a * e;
}

/**
 * Centralized registry of all 8 planetary orbital parameters.
 * Semi-major axes are strictly drawn from SPEC_SEMI_MAJOR_RADII:
 * [2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9]
 */
export const ORBITAL_CONFIG: OrbitalParameter[] = [
  {
    id: 'budh',
    worldId: 'budh',
    name: 'Budh (Mercury)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[0], // 2.0
    eccentricity: 0.06,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[0], 0.06),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[0], 0.06),
    inclinationDeg: 3.2,
    orbitSpeed: 0.28,
    color: '#06b6d4',
    glowColor: '#22d3ee',
    planetRadius: 0.34,
    cameraDistance: 0.92,
    isActiveWorld: true,
  },
  {
    id: 'shukra',
    worldId: 'shukra',
    name: 'Shukra (Venus)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[1], // 3.1
    eccentricity: 0.03,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[1], 0.03),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[1], 0.03),
    inclinationDeg: 2.1,
    orbitSpeed: 0.22,
    color: '#ec4899',
    glowColor: '#f472b6',
    planetRadius: 0.45,
    cameraDistance: 1.18,
    isActiveWorld: true,
  },
  {
    id: 'earth_track',
    worldId: null,
    name: 'Earth Track',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[2], // 3.8
    eccentricity: 0.03,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[2], 0.03),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[2], 0.03),
    inclinationDeg: 1.5,
    orbitSpeed: 0.18,
    color: '#475569',
    glowColor: '#64748b',
    planetRadius: 0.40,
    cameraDistance: 1.05,
    isActiveWorld: false, // subtle celestial resonance ring
  },
  {
    id: 'mangal',
    worldId: 'mangal',
    name: 'Mangal (Mars)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[3], // 4.5
    eccentricity: 0.05,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[3], 0.05),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[3], 0.05),
    inclinationDeg: 1.85,
    orbitSpeed: 0.15,
    color: '#ef4444',
    glowColor: '#dc2626',
    planetRadius: 0.41,
    cameraDistance: 1.1,
    isActiveWorld: true,
  },
  {
    id: 'guru',
    worldId: 'guru',
    name: 'Guru (Jupiter)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[4], // 6.7
    eccentricity: 0.04,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[4], 0.04),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[4], 0.04),
    inclinationDeg: 1.3,
    orbitSpeed: 0.11,
    color: '#d97706',
    glowColor: '#f59e0b',
    planetRadius: 0.80,
    cameraDistance: 2.1,
    isActiveWorld: true,
  },
  {
    id: 'shani',
    worldId: 'shani',
    name: 'Shani (Saturn)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[5], // 7.8
    eccentricity: 0.04,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[5], 0.04),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[5], 0.04),
    inclinationDeg: 2.49,
    orbitSpeed: 0.08,
    color: '#a8a29e',
    glowColor: '#78716c',
    planetRadius: 0.62,
    cameraDistance: 1.75,
    isActiveWorld: true,
  },
  {
    id: 'rahu',
    worldId: 'rahu',
    name: 'Rahu (North Node / Frontier)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[6], // 9.1
    eccentricity: 0.035,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[6], 0.035),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[6], 0.035),
    inclinationDeg: 3.8,
    orbitSpeed: 0.06,
    color: '#6366f1',
    glowColor: '#4f46e5',
    planetRadius: 0.52,
    cameraDistance: 1.45,
    isActiveWorld: true,
  },
  {
    id: 'ketu',
    worldId: 'ketu',
    name: 'Ketu (South Node / Reflection)',
    semiMajorAxis: SPEC_SEMI_MAJOR_RADII[7], // 9.9
    eccentricity: 0.025,
    semiMinorAxis: computeSemiMinorAxis(SPEC_SEMI_MAJOR_RADII[7], 0.025),
    focusOffset: computeFocusOffset(SPEC_SEMI_MAJOR_RADII[7], 0.025),
    inclinationDeg: 4.2,
    orbitSpeed: 0.045,
    color: '#14b8a6',
    glowColor: '#0d9488',
    planetRadius: 0.46,
    cameraDistance: 1.3,
    isActiveWorld: true,
  },
];

/**
 * Look up an orbit configuration by world id.
 */
export function getOrbitConfigByWorldId(worldId: CelestialId): OrbitalParameter | undefined {
  return ORBITAL_CONFIG.find((o) => o.worldId === worldId);
}

/**
 * Calculates (x, y, z) 3D coordinate along a Keplerian elliptical orbit
 * with the Sun positioned at one focus: (0, 0, 0).
 *
 * Geometry:
 * - Geometric center is offset by -c along the major axis (X).
 * - Sun is located at focus (0, 0, 0).
 * - Perihelion (theta = 0): x = a - c = a*(1 - e). Distance to Sun = a*(1 - e).
 * - Aphelion (theta = PI): x = -a - c = -a*(1 + e). Distance to Sun = a*(1 + e).
 */
export function computeKeplerianOrbitPosition(
  orbit: OrbitalParameter,
  thetaRad: number,
  target: { x: number; y: number; z: number }
): void {
  const incRad = (orbit.inclinationDeg * Math.PI) / 180;
  const sinInc = Math.sin(incRad);
  const cosInc = Math.cos(incRad);

  const cosT = Math.cos(thetaRad);
  const sinT = Math.sin(thetaRad);

  // Focus-centered elliptical coordinates:
  // x = a * cos(theta) - c
  // z_flat = b * sin(theta)
  target.x = orbit.semiMajorAxis * cosT - orbit.focusOffset;
  target.y = orbit.semiMinorAxis * sinT * sinInc;
  target.z = orbit.semiMinorAxis * sinT * cosInc;
}

/**
 * Keplerian speed multiplier based on Kepler's Second Law:
 * Planets move faster near perihelion and slower near aphelion.
 *
 * In Keplerian motion, angular velocity is proportional to 1 / r^2:
 * speedFactor = (a / r)^2 * sqrt(1 - e^2)
 */
export function computeKeplerianSpeedMultiplier(
  orbit: OrbitalParameter,
  thetaRad: number
): number {
  const cosT = Math.cos(thetaRad);
  const sinT = Math.sin(thetaRad);

  const x = orbit.semiMajorAxis * cosT - orbit.focusOffset;
  const z = orbit.semiMinorAxis * sinT;
  const rSq = x * x + z * z;
  const r = Math.sqrt(rSq);

  if (r < 0.0001) return 1.0;

  const aOverR = orbit.semiMajorAxis / r;
  const factor = aOverR * aOverR * Math.sqrt(Math.max(0, 1 - orbit.eccentricity * orbit.eccentricity));
  return Math.max(0.3, Math.min(3.5, factor));
}

export interface AsteroidBeltConfig {
  innerSemiMajorAxis: number;
  outerSemiMajorAxis: number;
  eccentricity: number;
  inclinationDeg: number;
  verticalSpread: number;
  baseOrbitSpeed: number;
  count: number;
  minRadius: number;
  maxRadius: number;
}

/**
 * Main Asteroid Belt placed in the radial gap between Mangal (4.5) and Guru (6.7),
 * centered around the Sun focus (0, 0, 0) with Keplerian elliptical geometry.
 */
export const ASTEROID_BELT_CONFIG: AsteroidBeltConfig = {
  innerSemiMajorAxis: 5.14,
  outerSemiMajorAxis: 5.74,
  eccentricity: 0.045,
  inclinationDeg: 1.55,
  verticalSpread: 0.16,
  baseOrbitSpeed: 0.128,
  count: 900,
  minRadius: 0.015,
  maxRadius: 0.052,
};
