/**
 * Calculates (x, y, z) 3D coordinate along a Keplerian elliptical orbit
 * with the Sun situated at one focus at (0, 0, 0).
 *
 * Mathematical derivation:
 * - Semi-major axis: a
 * - Semi-minor axis: b = a * sqrt(1 - e^2)
 * - Focus offset: c = a * e
 * - Ellipse center is at (-c, 0, 0)
 * - Orbit revolves around the focus at (0, 0, 0)
 */
export function calculateOrbitalPosition(
  a: number,
  angleRad: number,
  inclinationDeg: number = 0,
  eccentricity: number = 0.05
): [number, number, number] {
  if (a === 0) return [0, 0, 0];

  const incRad = (inclinationDeg * Math.PI) / 180;
  const sinInc = Math.sin(incRad);
  const cosInc = Math.cos(incRad);

  const b = a * Math.sqrt(Math.max(0, 1 - eccentricity * eccentricity));
  const c = a * eccentricity;

  const cosT = Math.cos(angleRad);
  const sinT = Math.sin(angleRad);

  const x = a * cosT - c;
  const y = b * sinT * sinInc;
  const z = b * sinT * cosInc;

  return [x, y, z];
}

/**
 * High-performance vector-allocation-free calculation writing directly to a target object.
 * Implements Keplerian focus-centered elliptical geometry.
 */
export function computeEllipticalPosition(
  a: number,
  angleRad: number,
  eccentricity: number,
  inclinationDeg: number,
  target: { x: number; y: number; z: number }
): void {
  if (a === 0) {
    target.x = 0;
    target.y = 0;
    target.z = 0;
    return;
  }

  const incRad = (inclinationDeg * Math.PI) / 180;
  const sinInc = Math.sin(incRad);
  const cosInc = Math.cos(incRad);

  const b = a * Math.sqrt(Math.max(0, 1 - eccentricity * eccentricity));
  const c = a * eccentricity;

  const cosT = Math.cos(angleRad);
  const sinT = Math.sin(angleRad);

  target.x = a * cosT - c;
  target.y = b * sinT * sinInc;
  target.z = b * sinT * cosInc;
}

/**
 * Calculates instantaneous Keplerian angular velocity multiplier
 * according to Kepler's Second Law (equal areas in equal time):
 * dTheta/dt is proportional to (a / r)^2 * sqrt(1 - e^2)
 * - Faster near perihelion (r = a*(1-e))
 * - Slower near aphelion (r = a*(1+e))
 */
export function computeKeplerianVelocityMultiplier(
  a: number,
  eccentricity: number,
  angleRad: number
): number {
  if (a === 0 || eccentricity === 0) return 1.0;

  const b = a * Math.sqrt(Math.max(0, 1 - eccentricity * eccentricity));
  const c = a * eccentricity;

  const cosT = Math.cos(angleRad);
  const sinT = Math.sin(angleRad);

  const x = a * cosT - c;
  const z = b * sinT;
  const rSq = x * x + z * z;
  const r = Math.sqrt(rSq);

  if (r < 0.0001) return 1.0;

  const aOverR = a / r;
  const factor = aOverR * aOverR * Math.sqrt(Math.max(0, 1 - eccentricity * eccentricity));
  return Math.max(0.3, Math.min(3.5, factor));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
