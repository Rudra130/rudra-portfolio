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
      skills: [
        'LangChain',
        'LangGraph',
        'Advanced RAG',
        'AI Guardrails',
        'OpenAI SDK',
        'Model Context Protocol (MCP)',
        'Google Agentic Dev Kit',
        'NVIDIA NIM',
        'Vector DBs (Chroma/FAISS)',
        'Spring AI',
      ],
    },
    {
      category: 'UI/UX & Frontend Engineering',
      skills: [
        'React 19',
        'Three.js / React Three Fiber',
        '3D GSAP Choreography',
        'Claymorphism',
        'Glassmorphism',
        'Tailwind CSS',
        'Framer Motion',
        'Figma Design Systems',
      ],
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
      name: 'Agentic AI Certified Foundations Associate',
      issuer: 'Oracle University',
      status: 'Verified',
      credentialUrl:
        'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7BA8D764E39E938D6DFDD2DCAB8FB79691641BB4172B812392D5A4DDE37483AB',
      badgeImage: '/assets/certifications/oracle-agentic-ai.png',
      issueDate: 'October 2026',
      validUntil: 'October 2028',
      description:
        'Practical, build-it-yourself certification in autonomous AI agents from first principles using LangChain, OpenAI Agents SDK, Model Context Protocol (MCP) servers, and OCI Enterprise AI Agents.',
      skills: [
        'AI Agents from scratch',
        'LangChain',
        'OpenAI Agents SDK',
        'Model Context Protocol (MCP)',
        'OCI Enterprise AI Agents',
        'Oracle AI Database',
      ],
    },
    {
      name: 'Oracle Cloud Infrastructure Certified Generative AI Professional',
      issuer: 'Oracle Cloud Infrastructure',
      status: 'Verified',
      issueDate: '2026',
      description:
        'Professional certification covering Large Language Models (LLMs), fine-tuning, OCI Generative AI Service, retrieval architectures, and enterprise vector databases.',
      skills: ['LLMs', 'Fine-Tuning', 'OCI Generative AI', 'Vector DBs', 'RAG'],
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
