/**
 * Calculates (x, y, z) 3D coordinate along a stylized elliptical orbit
 */
export function calculateOrbitalPosition(
  orbitRadius: number,
  angleRad: number,
  inclinationDeg: number = 0,
  eccentricity: number = 0.05
): [number, number, number] {
  if (orbitRadius === 0) return [0, 0, 0];

  const incRad = (inclinationDeg * Math.PI) / 180;
  const x = orbitRadius * Math.cos(angleRad);
  const z = orbitRadius * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(angleRad);
  const y = orbitRadius * Math.sin(incRad) * Math.sin(angleRad);

  return [x, y, z];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
