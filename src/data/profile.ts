import { ProfileRecord } from '../types/content';

export const profileData: ProfileRecord = {
  name: 'Rudra Tiwari',
  titles: ['Software Engineer', 'AI Enthusiast', 'Problem Solver'],
  tagline: 'Engineer. Explorer. Creator.',
  quote: '“A journey through technology, knowledge, ambition and life.”',
  summary:
    'A Computer Science Engineer passionate about building impactful software, solving complex problems, and exploring the evolving world of Artificial Intelligence. Experienced in production microservices, OAuth 2.0 authentication, distributed tracing, and LLM-powered agent workflows.',
  email: 'rudra.tiwari.4141@gmail.com',
  githubUrl: 'https://github.com/Rudra130',
  linkedinUrl: 'https://www.linkedin.com/in/rudratiwari1306/',
  resumePath: '/assets/resume.pdf',
  avatarPath: '/assets/user-photos/profile/profile-main.webp',
  education: {
    degree: 'B.Tech',
    major: 'Computer Science and Engineering',
    university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    college: 'ABES Engineering College',
    location: 'Ghaziabad, Uttar Pradesh',
    duration: '2022 – 2026',
    graduationDate: 'July 2026',
    cgpa: '8.02/10',
  },
  experience: {
    company: 'Salescode AI',
    location: 'Gurugram, India',
    role: 'Software Engineer',
    duration: 'Oct 2025 – Sept 2026',
    highlights: [
      'Developed production-grade Java/Spring Boot microservices and REST APIs for authentication, onboarding, password recovery, loyalty workflows, and secure service-to-service communication.',
      'Implemented SSO and OAuth 2.0 with token issuance, refresh/revocation, and session validation, establishing a reusable authentication layer adopted across 10 services.',
      'Built OpenTelemetry-based observability with structured logging and distributed tracing, and developed reusable onboarding automation for 7 clients/LOBs, reducing setup time to ~2 hours.',
      'Proactively built an Authentication Configuration Portal adopted by 10 LOBs, enabling self-service configuration of login/password flows, policies, and OTP providers without backend code changes.',
      'Engineered multi-device login support with concurrent session management, per-device token issuance, and device-level revocation across web, mobile, and tablet clients.',
    ],
  },
  skills: [
    {
      category: 'Languages',
      skills: ['Java', 'Python', 'SQL', 'JavaScript', 'TypeScript'],
    },
    {
      category: 'Backend & Distributed Systems',
      skills: ['Spring Boot', 'Spring AI', 'FastAPI', 'Microservices', 'Kafka', 'Node.js'],
    },
    {
      category: 'AI & Generative AI',
      skills: ['LLMs', 'LangChain', 'LangGraph', 'RAG', 'AI Agents'],
    },
    {
      category: 'Databases & Caching',
      skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      category: 'Observability',
      skills: ['OpenTelemetry', 'Distributed Tracing', 'Structured Logging'],
    },
    {
      category: 'Developer Tools',
      skills: ['Claude Code', 'Cursor', 'GitHub Copilot'],
    },
  ],
  certifications: [
    {
      name: 'Oracle Agentic AI Certified Foundations Associate',
      issuer: 'Oracle',
      status: 'Verified',
    },
    {
      name: 'Oracle Cloud Infrastructure Certified Generative AI Professional',
      issuer: 'Oracle',
      status: 'Verified',
    },
  ],
  metrics: {
    experienceMonths: '~10 Months',
    leetcodeCount: '600+',
    totalProblemsSolved: '1,200+',
    leetcodeRating: '1812',
    cgpa: '8.02 CGPA',
  },
};
