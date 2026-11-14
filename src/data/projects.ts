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
    githubUrl: 'https://github.com/Rudra130/nl-2-db',
    iconType: 'database',
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery System',
    tagline: 'A full-stack food ordering platform with authentication and real-time order tracking.',
    category: 'Full-Stack',
    technologies: ['React', 'JavaScript', 'Spring Boot', 'Java', 'SQL', 'REST APIs'],
    description:
      'A scalable full-stack ordering platform managing multi-vendor menus, customer authentication, cart state persistence, and live order status lifecycles.',
    keyFeatures: [
      'Modular RESTful architecture powered by Spring Boot backend with clean separation of domain boundaries.',
      'Interactive responsive frontend built in React with real-time order state visualization.',
      'Transactional order placement with inventory reservation and state-machine transitions.',
    ],
    githubUrl: 'https://github.com/Rudra130/Onlinefoodordering',
    liveUrl: 'https://github.com/Rudra130/OnlineFoodOrderingFrontend',
    iconType: 'cutlery',
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
    githubUrl: 'https://github.com/Rudra130',
    iconType: 'code',
  },
  {
    id: 'log-investigation',
    title: 'AI-Powered Log Investigation System',
    tagline: 'Contextual failure analysis and automated root-cause summarization using Spring AI.',
    category: 'Systems',
    technologies: ['Java', 'Spring Boot', 'Spring AI', 'LangGraph', 'SQL'],
    description:
      'An AI-powered error-log investigation platform developed for Salescode AI, enabling engineers to analyze production errors through natural-language queries.',
    keyFeatures: [
      'Controlled read-only log analysis workflow retrieving error logs for user-selected time ranges.',
      'Contextual failure analysis and automated root-cause summarization using Spring AI.',
      'Hardened SQL proxy security layer restricting AI-assisted database operations to SELECT-only.',
    ],
    githubUrl: 'https://github.com/Rudra130',
    iconType: 'brain',
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI & Autonomous Workflows',
    tagline: 'Autonomous multi-agent architectures using LangGraph and tool execution.',
    category: 'AI / ML',
    technologies: ['Python', 'Jupyter', 'LangGraph', 'LangChain', 'AI Agents', 'LLMs'],
    description:
      'Research and implementation of agentic AI patterns, multi-agent collaboration, memory retention, and tool orchestration for autonomous problem-solving.',
    keyFeatures: [
      'Multi-agent graph topologies coordinating research, analysis, and validation nodes.',
      'Dynamic tool execution and structured output schemas.',
      'Evaluation harnesses measuring agent goal-completion fidelity.',
    ],
    githubUrl: 'https://github.com/Rudra130/agentic-ai',
    iconType: 'brain',
  },
  {
    id: 'seminar-allocation',
    title: 'Seminar & Auditorium Allocation Platform',
    tagline: 'MERN stack reservation and scheduling system with role-based access.',
    category: 'Full-Stack',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'MERN Stack'],
    description:
      'A web-based platform built using the MERN stack to streamline scheduling and booking of seminar halls and auditoriums with conflict prevention.',
    keyFeatures: [
      'Automated conflict detection preventing double-booking across academic venues.',
      'Role-based permissions for student organizers and faculty administrators.',
      'Clean responsive dashboard for instant slot booking and verification.',
    ],
    githubUrl: 'https://github.com/Rudra130/SeminarAllocationApp',
    iconType: 'code',
  },
  {
    id: 'job-hunter',
    title: 'Job Hunter Automation',
    tagline: 'Automated job search, aggregation, and application pipeline.',
    category: 'Tooling',
    technologies: ['TypeScript', 'Node.js', 'Automation', 'APIs'],
    description:
      'An automated tool that streamlines discovering and cataloging software engineering openings across multiple job boards and portal APIs.',
    keyFeatures: [
      'Deduplicated search pipeline aggregating fresh software engineering roles.',
      'Configurable criteria matching roles to specific skill stacks.',
      'Exportable tracking dashboard for application status management.',
    ],
    githubUrl: 'https://github.com/Rudra130/job-hunter',
    iconType: 'code',
  },
  {
    id: 'sign-check',
    title: 'SignCheck Verification System',
    tagline: 'AI-assisted signature inspection and anomaly detection engine.',
    category: 'AI / ML',
    technologies: ['Python', 'Computer Vision', 'FastAPI', 'Image Processing'],
    description:
      'Computer vision pipeline designed to analyze, preprocess, and match handwritten signatures against ground-truth samples for automated verification.',
    keyFeatures: [
      'Preprocessing pipeline with thresholding, noise removal, and contour extraction.',
      'Similarity scoring comparing stroke trajectories and geometry.',
      'REST API interface built with FastAPI for fast document integration.',
    ],
    githubUrl: 'https://github.com/Rudra130/sign-check',
    iconType: 'brain',
  },
  {
    id: 'event-hub',
    title: 'EventHub Next',
    tagline: 'Modern event ticketing and discovery platform built with Next.js.',
    category: 'Full-Stack',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    description:
      'A high-performance event management web application featuring server-side rendering, dynamic route handling, and intuitive ticket reservations.',
    keyFeatures: [
      'Next.js App Router with optimized server components for blazing-fast page loads.',
      'Responsive design with Tailwind CSS and dark-mode aesthetic.',
      'Event scheduling and attendee registration management.',
    ],
    githubUrl: 'https://github.com/Rudra130/event-hub-next',
    iconType: 'code',
  },
  {
    id: 'object-detection-yolo',
    title: 'YOLO Real-Time Object Detection',
    tagline: 'Real-time computer vision inference pipeline utilizing YOLO architecture.',
    category: 'AI / ML',
    technologies: ['Python', 'YOLO', 'OpenCV', 'PyTorch'],
    description:
      'Real-time object detection implementation leveraging pretrained YOLO models for low-latency visual multi-class bounding box inference.',
    keyFeatures: [
      'Live webcam and video stream inference pipeline with OpenCV integration.',
      'Confidence threshold tuning for noise reduction and high-precision bounding boxes.',
      'Modular Python codebase supporting edge model deployment.',
    ],
    githubUrl: 'https://github.com/Rudra130/ObjectDetectionYolo',
    iconType: 'brain',
  },
];
