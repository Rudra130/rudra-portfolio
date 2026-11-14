import { CelestialId } from '../types/celestial';

/**
 * Clean URL slug mapping for all celestial portfolio dimensions.
 * Maps celestial IDs to human-readable, professional, SEO-friendly path slugs.
 */
export const WORLD_TO_SLUG: Record<CelestialId, string> = {
  surya: 'about',
  budh: 'skills',
  shukra: 'design',
  mangal: 'projects',
  guru: 'education',
  shani: 'work-experience',
  rahu: 'generative-ai',
  ketu: 'philosophy',
};

/**
 * Bidirectional slug lookup supporting semantic aliases and direct IDs.
 */
export const SLUG_TO_WORLD: Record<string, CelestialId> = {
  // Primary semantic slugs
  about: 'surya',
  skills: 'budh',
  design: 'shukra',
  projects: 'mangal',
  education: 'guru',
  'work-experience': 'shani',
  'generative-ai': 'rahu',
  philosophy: 'ketu',

  // Common aliases & real-world identity variations
  'core-identity': 'surya',
  bio: 'surya',
  'technical-skills': 'budh',
  dsa: 'budh',
  'ui-ux': 'shukra',
  'ui-ux-design': 'shukra',
  'projects-architecture': 'mangal',
  certifications: 'guru',
  experience: 'shani',
  'ai-agents': 'rahu',
  reflection: 'ketu',

  // Direct celestial IDs
  surya: 'surya',
  budh: 'budh',
  shukra: 'shukra',
  mangal: 'mangal',
  guru: 'guru',
  shani: 'shani',
  rahu: 'rahu',
  ketu: 'ketu',
};

/**
 * Returns the clean path for a given world ID (or overview).
 */
export function getPathForWorld(worldId: CelestialId | null): string {
  if (!worldId) return '/portfolio';
  const slug = WORLD_TO_SLUG[worldId] || worldId;
  return `/portfolio/${slug}`;
}

/**
 * Updates browser history smoothly without hash.
 */
export function pushPath(path: string): void {
  if (typeof window !== 'undefined' && window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
}

/**
 * Replaces browser history without adding a new history entry.
 */
export function replacePath(path: string): void {
  if (typeof window !== 'undefined' && window.location.pathname !== path) {
    window.history.replaceState(null, '', path);
  }
}
