import { describe, it, expect } from 'vitest';
import {
  WORLD_TO_SLUG,
  SLUG_TO_WORLD,
  getPathForWorld,
} from '../../src/utils/navigation';
import { CelestialId } from '../../src/types/celestial';

describe('Navigation & Clean URL Routing', () => {
  it('should map all 9 celestial worlds to clean SEO-friendly path slugs without #', () => {
    const celestialIds: CelestialId[] = [
      'surya',
      'budh',
      'shukra',
      'chandra',
      'mangal',
      'guru',
      'shani',
      'rahu',
      'ketu',
    ];

    celestialIds.forEach((id) => {
      const slug = WORLD_TO_SLUG[id];
      expect(slug).toBeDefined();
      expect(slug).not.toContain('#');
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it('should generate proper clean URL paths for overview and planet pages', () => {
    expect(getPathForWorld(null)).toBe('/universe');
    expect(getPathForWorld('mangal')).toBe('/universe/projects');
    expect(getPathForWorld('shani')).toBe('/universe/work-experience');
    expect(getPathForWorld('surya')).toBe('/universe/about');
    expect(getPathForWorld('budh')).toBe('/universe/skills');
    expect(getPathForWorld('guru')).toBe('/universe/education');
    expect(getPathForWorld('rahu')).toBe('/universe/generative-ai');
  });

  it('should bidirectionally resolve both semantic slugs and direct IDs', () => {
    expect(SLUG_TO_WORLD['projects']).toBe('mangal');
    expect(SLUG_TO_WORLD['mangal']).toBe('mangal');
    expect(SLUG_TO_WORLD['work-experience']).toBe('shani');
    expect(SLUG_TO_WORLD['shani']).toBe('shani');
    expect(SLUG_TO_WORLD['about']).toBe('surya');
    expect(SLUG_TO_WORLD['core-identity']).toBe('surya');
    expect(SLUG_TO_WORLD['skills']).toBe('budh');
    expect(SLUG_TO_WORLD['technical-skills']).toBe('budh');
  });
});
