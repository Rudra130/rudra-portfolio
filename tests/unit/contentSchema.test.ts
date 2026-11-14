import { describe, it, expect } from 'vitest';
import { profileData } from '../../src/data/profile';
import { worldsData } from '../../src/data/worlds';
import { projectsData } from '../../src/data/projects';

describe('Content Architecture & Data Integrity', () => {
  it('should have verified profile metrics for Rudra Tiwari', () => {
    expect(profileData.name).toBe('Rudra Tiwari');
    expect(profileData.education.cgpa).toBe('8.02/10');
    expect(profileData.education.college).toContain('ABES');
    expect(profileData.metrics.leetcodeCount).toBe('600+');
    expect(profileData.metrics.leetcodeRating).toBe('1812');
    expect(profileData.experience.company).toBe('Salescode AI');
    expect(profileData.githubUrl).toBe('https://github.com/Rudra130');
    expect(profileData.linkedinUrl).toBe('https://www.linkedin.com/in/rudratiwari1306/');
  });

  it('should define all 9 Vedic Grahas with valid properties', () => {
    expect(worldsData.length).toBe(9);
    const ids = worldsData.map((w) => w.id);
    expect(ids).toContain('surya');
    expect(ids).toContain('chandra');
    expect(ids).toContain('mangal');
    expect(ids).toContain('budh');
    expect(ids).toContain('guru');
    expect(ids).toContain('shukra');
    expect(ids).toContain('shani');
    expect(ids).toContain('rahu');
    expect(ids).toContain('ketu');

    worldsData.forEach((w) => {
      expect(w.radius).toBeGreaterThan(0);
      expect(w.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(w.englishTitle.length).toBeGreaterThan(0);
      expect(w.realWorldIdentity.length).toBeGreaterThan(0);
    });
  });

  it('should define verified software engineering projects', () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(4);
    const projectTitles = projectsData.map((p) => p.title);
    expect(projectTitles).toContain('Natural Language to SQL (NL2SQL)');
    expect(projectTitles).toContain('AI-Powered Log Investigation System');
    expect(projectTitles).toContain('BarterNow: AI-Powered Sponsorship Platform');
    expect(projectTitles).toContain('Food Delivery System');
  });
});
