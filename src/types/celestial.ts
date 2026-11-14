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
  englishTitle: string;
  theme: string;
  tagline: string;
  description: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number; // orbital angular velocity multiplier
  color: string;
  glowColor: string;
  symbol: string;
  texturePath?: string;
  cameraDistance: number;
  cameraAngle: [number, number, number];
}
