import { ProjectRecord } from '../types/content';

export const projectsData: ProjectRecord[] = [
  {
    id: 'nl-2-db',
    title: 'Natural Language to SQL (NL2SQL)',
    tagline: 'Convert natural language queries into executable SQL using LLMs.',
    category: 'AI / ML',
    technologies: ['Python', 'FastAPI', 'NVIDIA NIM', 'LangChain', 'LangGraph', 'RAG', 'SQL'],
    description:
      'An LLM-powered natural-language-to-database system using FastAPI and NVIDIA NIM to translate user questions into database-specific SQL queries and retrieve accurate results without requiring manual SQL authoring.',
    keyFeatures: [
      'Multi-stage query generation orchestrated with LangGraph (schema retrieval, SQL generation, validation, execution).',
      'Configurable database integration layer with SQL validation restricting execution to SELECT-only queries.',
      'Sub-second inference leveraging NVIDIA NIM optimized microservices.',
    ],
    githubUrl: 'https://github.com/rudra-tiwari',
    iconType: 'database',
  },
  {
    id: 'log-investigation',
    title: 'AI-Powered Log Investigation System',
    tagline: 'Contextual failure analysis and root-cause error summarization.',
    category: 'AI / ML',
    technologies: ['Java', 'Spring Boot', 'Spring AI', 'LangGraph', 'SQL'],
    description:
      'An AI-powered error-log investigation platform developed for Salescode AI, enabling engineers to analyze production errors through natural-language queries and drastically reducing manual triaging effort.',
    keyFeatures: [
      'Controlled read-only log analysis workflow retrieving error logs for user-selected time ranges.',
      'Contextual failure analysis and automated root-cause summarization using Spring AI.',
      'Hardened SQL proxy security layer restricting AI-assisted database operations to SELECT-only.',
    ],
    githubUrl: 'https://github.com/rudra-tiwari',
    iconType: 'brain',
  },
  {
    id: 'barternow',
    title: 'BarterNow: AI-Powered Sponsorship Platform',
    tagline: 'Connecting brands with event organizers via an AI recommendation engine.',
    category: 'Full-Stack',
    technologies: ['Python', 'FastAPI', 'React', 'Express.js', 'Prisma', 'Razorpay'],
    description:
      'A two-sided sponsorship marketplace matching brands with event organizers using an AI-driven recommendation engine based on audience demographics and engagement analytics.',
    keyFeatures: [
      'AI recommendation engine matching brand sponsorship criteria with target event audiences.',
      'Integrated Razorpay with idempotent webhook handling for reliable payment capture and settlement tracking.',
      'Shipped real-time ROI analytics dashboards for brand campaign performance.',
    ],
    githubUrl: 'https://github.com/rudra-tiwari',
    liveUrl: 'https://barternow.example.com',
    iconType: 'code',
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery System',
    tagline: 'A full-stack food ordering platform with authentication and real-time order tracking.',
    category: 'Full-Stack',
    technologies: ['React', 'Spring Boot', 'SQL', 'REST APIs'],
    description:
      'A scalable full-stack ordering platform managing multi-vendor menus, role-based customer/vendor access, cart persistence, and live order status lifecycles.',
    keyFeatures: [
      'Modular RESTful architecture powered by Spring Boot with clean separation of domain boundaries.',
      'Responsive ordering interface built in React with real-time order stage visualization.',
      'Transactional order placement with inventory reservation and state-machine transitions.',
    ],
    githubUrl: 'https://github.com/rudra-tiwari',
    iconType: 'cutlery',
  },
];
