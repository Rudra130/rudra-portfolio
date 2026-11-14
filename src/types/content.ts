export interface EducationRecord {
  degree: string;
  major: string;
  university: string;
  college: string;
  location: string;
  duration: string;
  graduationDate: string;
  cgpa: string;
}

export interface WorkExperienceRecord {
  company: string;
  location: string;
  role: string;
  duration: string;
  highlights: string[];
}

export interface ProjectRecord {
  id: string;
  title: string;
  tagline: string;
  category: 'AI / ML' | 'Full-Stack' | 'Systems' | 'Tooling';
  technologies: string[];
  description: string;
  keyFeatures: string[];
  githubUrl?: string;
  liveUrl?: string;
  iconType: 'database' | 'cutlery' | 'brain' | 'code';
}

export interface SkillCategoryRecord {
  category: string;
  skills: string[];
}

export interface CertificationRecord {
  name: string;
  issuer: string;
  status: string;
  credentialUrl?: string;
  badgeImage?: string;
  issueDate?: string;
  validUntil?: string;
  description?: string;
  skills?: string[];
}

export interface ProfileRecord {
  name: string;
  titles: string[];
  tagline: string;
  quote: string;
  summary: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumePath: string;
  avatarPath?: string;
  education: EducationRecord;
  experience: WorkExperienceRecord;
  skills: SkillCategoryRecord[];
  certifications: CertificationRecord[];
  metrics: {
    experienceMonths: string;
    leetcodeCount: string;
    totalProblemsSolved: string;
    leetcodeRating: string;
    cgpa: string;
  };
}
