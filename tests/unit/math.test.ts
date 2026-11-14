import { describe, it, expect } from 'vitest';
import {
  calculateOrbitalPosition,
  computeEllipticalPosition,
  computeKeplerianVelocityMultiplier,
  clamp,
  lerp,
} from '../../src/utils/math';
import {
  SPEC_SEMI_MAJOR_RADII,
  ORBITAL_CONFIG,
  computeSemiMinorAxis,
  computeFocusOffset,
} from '../../src/config/orbitalConfig';

describe('Solar System — Orbital Spacing and Keplerian Geometry', () => {
  it('should implement the exact semi-major radii specification [2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9]', () => {
    expect(SPEC_SEMI_MAJOR_RADII).toEqual([2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9]);
    expect(ORBITAL_CONFIG.map((o) => o.semiMajorAxis)).toEqual([
      2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9,
    ]);
  });

  it('should calculate semi-minor axis b = a * sqrt(1 - e^2) for every orbit', () => {
    for (const orbit of ORBITAL_CONFIG) {
      const expectedB = orbit.semiMajorAxis * Math.sqrt(1 - orbit.eccentricity * orbit.eccentricity);
      expect(orbit.semiMinorAxis).toBeCloseTo(expectedB, 5);
      expect(computeSemiMinorAxis(orbit.semiMajorAxis, orbit.eccentricity)).toBeCloseTo(expectedB, 5);
    }
  });

  it('should calculate focus offset c = a * e for every orbit', () => {
    for (const orbit of ORBITAL_CONFIG) {
      const expectedC = orbit.semiMajorAxis * orbit.eccentricity;
      expect(orbit.focusOffset).toBeCloseTo(expectedC, 5);
      expect(computeFocusOffset(orbit.semiMajorAxis, orbit.eccentricity)).toBeCloseTo(expectedC, 5);
    }
  });

  it('should place the Sun at one focus (0, 0, 0) and center perihelion/aphelion accordingly', () => {
    const a = 10;
    const e = 0.2;
    const c = a * e; // 2.0

    // Perihelion (theta = 0): x = a - c = 10 - 2 = 8.0 = a*(1 - e)
    const periPos = calculateOrbitalPosition(a, 0, 0, e);
    expect(periPos[0]).toBeCloseTo(8.0);
    expect(periPos[1]).toBeCloseTo(0);
    expect(periPos[2]).toBeCloseTo(0);

    // Aphelion (theta = PI): x = -a - c = -10 - 2 = -12.0 = -a*(1 + e)
    const aphPos = calculateOrbitalPosition(a, Math.PI, 0, e);
    expect(aphPos[0]).toBeCloseTo(-12.0);
    expect(aphPos[1]).toBeCloseTo(0);
    expect(aphPos[2]).toBeCloseTo(0);
  });

  it('should obey Keplerian motion: faster at perihelion, slower at aphelion', () => {
    const a = 5.0;
    const e = 0.1;

    const perihelionSpeedFactor = computeKeplerianVelocityMultiplier(a, e, 0);
    const aphelionSpeedFactor = computeKeplerianVelocityMultiplier(a, e, Math.PI);

    // Speed at perihelion must be strictly greater than speed at aphelion
    expect(perihelionSpeedFactor).toBeGreaterThan(1.0);
    expect(aphelionSpeedFactor).toBeLessThan(1.0);
    expect(perihelionSpeedFactor).toBeGreaterThan(aphelionSpeedFactor);
  });

  it('should maintain consistent visible gaps between neighboring orbital paths without overlapping', () => {
    for (let i = 0; i < ORBITAL_CONFIG.length - 1; i++) {
      const inner = ORBITAL_CONFIG[i];
      const outer = ORBITAL_CONFIG[i + 1];

      // Check distance at 72 angles around the complete ellipse
      let minGap = Infinity;
      for (let step = 0; step < 72; step++) {
        const theta = (step / 72) * Math.PI * 2;
        const innerTarget = { x: 0, y: 0, z: 0 };
        const outerTarget = { x: 0, y: 0, z: 0 };

        computeEllipticalPosition(inner.semiMajorAxis, theta, inner.eccentricity, inner.inclinationDeg, innerTarget);
        computeEllipticalPosition(outer.semiMajorAxis, theta, outer.eccentricity, outer.inclinationDeg, outerTarget);

        const rInner = Math.hypot(innerTarget.x, innerTarget.z);
        const rOuter = Math.hypot(outerTarget.x, outerTarget.z);
        const gap = rOuter - rInner;

        if (gap < minGap) minGap = gap;
      }

      // Every neighboring orbit path has a strictly positive gap (no overlaps)
      expect(minGap).toBeGreaterThan(0.2);
    }
  });

  it('should clamp numbers correctly within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should lerp smoothly between numbers', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.1)).toBe(11);
  });
});
