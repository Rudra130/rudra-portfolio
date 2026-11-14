import { describe, it, expect } from 'vitest';
import { calculateOrbitalPosition, clamp, lerp } from '../../src/utils/math';

describe('Math Utilities', () => {
  it('should return [0, 0, 0] for center orbit radius 0 (Surya)', () => {
    const pos = calculateOrbitalPosition(0, 0);
    expect(pos).toEqual([0, 0, 0]);
  });

  it('should calculate accurate orbital coordinates for non-zero radius', () => {
    const pos = calculateOrbitalPosition(20, 0);
    expect(pos[0]).toBeCloseTo(20);
    expect(pos[1]).toBeCloseTo(0);
    expect(pos[2]).toBeCloseTo(0);
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
