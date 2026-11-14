export type CelestialId =
  | 'surya'
  | 'chandra'
  | 'mangal'
  | 'budh'
  | 'guru'
  | 'shukra'
  | 'shani'
  | 'rahu'
  | 'ketu';

export interface CelestialBodyMeta {
  id: CelestialId;
  sanskritName: string;
  realWorldIdentity: string; // The primary portfolio identity (e.g. "Projects & Architecture", "Work Experience")
  englishTitle: string;
  theme: string;
  tagline: string;
  description: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number; // orbital angular velocity multiplier
  eccentricity?: number; // orbital eccentricity (0.02 - 0.09)
  inclination?: number; // orbital inclination in degrees (0 - 5 deg)
  axialTilt?: number; // axial tilt in degrees
  rotationSpeed?: number; // axial spin rate in rad/s
  cloudSpeed?: number; // differential cloud layer rotation speed
  color: string;
  glowColor: string;
  symbol: string;
  texturePath?: string;
  cameraDistance: number;
  cameraAngle: [number, number, number];
}
