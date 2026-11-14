# GEMINI.md — Persistent Engineering Guidelines & Project Instructions

> **PROJECT**: Cosmic Portfolio — Rudra Tiwari  
> **ROLE**: Principal Software Architect, Senior Full-Stack Engineer, Three.js Specialist, UI/UX Designer  
> **SCOPE**: Production-quality, immersive, interactive 3D personal portfolio website inspired by the 9 Grahas of Vedic astronomy.

---

## 1. Project Overview & Core Philosophy

This application is **not** a conventional developer portfolio. It is a custom-engineered celestial universe where the Sun, planets, and astronomical phenomena represent different facets of Rudra Tiwari's life, career, and engineering philosophy.

* **Core Motto**: *"The universe should attract attention. My story should create curiosity. My engineering work should earn credibility."*
* **Core Philosophy**: *"Every celestial body represents a different dimension of my life. Together, they tell my story."*
* **Creative Framing**: The celestial bodies represent creative storytelling analogies, not astrological forecasting.

---

## 2. Fundamental Architecture Rules

Every code change and implementation step must adhere to these non-negotiable principles:

1. **Separation of Concerns**:
   * The **3D Canvas Layer** (`ThreeCanvas`, shaders, celestial bodies, camera rig) renders the universe. It must *not* contain presentation markup or hardcoded biography text.
   * The **UI Overlay Layer** (`HUD`, drawers, planet selector, modals) manages text, interactions, and accessibility.
   * The **State Layer** (`Zustand` store) coordinates camera focus, active planet, audio mute state, drawer open/close, and accessibility flags.
   * The **Data Layer** (`src/data/`) is the single source of truth for all portfolio facts, project records, skills, and timeline entries.
2. **Centralized Content Data**:
   * Never hardcode personal details, project descriptions, GitHub URLs, or work experience inside React components or 3D scene files.
   * All data must be imported from strongly typed files located under `src/data/`.
3. **Reusable 3D Components**:
   * Build modular celestial primitives (`CelestialSphere`, `AtmosphereGlow`, `OrbitalRing`, `PlanetMarker`).
   * Avoid monolithic scene components that mix rendering logic for all planets into one file.
4. **Predictable State Management**:
   * Use Zustand stores with pure setter actions. Do not mutate state directly.
   * Handle camera interpolation via an explicit state-driven camera controller hook/component.
5. **Robust Error Boundaries**:
   * Implement a dedicated WebGL Error Boundary. If WebGL context is lost, unsupported, or fails to initialize, gracefully transition to the 2D Accessible Portfolio view without crashing.
6. **Accessible & Responsive by Default**:
   * The application must be 100% functional on mobile screens (iOS/Android) and desktop.
   * Must respect `prefers-reduced-motion` by disabling warp camera animations and rendering gentle fades.
   * Must provide a 2D non-WebGL fallback view that provides full access to resume, projects, bio, skills, and contact form.
7. **Meaningful Logging & Clean Error Handling**:
   * Log texture loading errors, asset fetch failures, and validation errors meaningfully with context.
   * Never leave empty `catch (e) {}` blocks.

---

## 3. Prohibited Practices & Shortcuts

Strictly avoid the following antipatterns:
* ❌ **NO Giant Components**: Split components larger than 250 lines into smaller sub-components and custom hooks.
* ❌ **NO Duplicate Code**: Extract shared orbital math, shader uniforms, or HUD drawer layouts into utilities.
* ❌ **NO Unnecessary Abstractions**: Do not build generic multi-universe meta-engines when a clean, focused celestial portfolio architecture is needed.
* ❌ **NO Unnecessary Dependencies**: Keep dependencies minimal, verified, and modern. Do not install heavy external libraries when native CSS or lightweight utilities suffice.
* ❌ **NO Uncontrolled Animation Loops**: Never run independent `requestAnimationFrame` loops outside of R3F's `useFrame` hook. Always clean up listeners on component unmount.
* ❌ **NO Unoptimized Textures**: Do not load raw 8K uncompressed PNG textures. All textures must be compressed (WebP/KTX2), mipmapped, and sized appropriately (< 2048x2048 for major bodies, 1024x1024 for small bodies).
* ❌ **NO Fabricated Information**:
  * **NEVER fabricate company names, employment dates, project metrics, awards, professional achievements, or links.**
  * Where information is missing, create explicit placeholders and request the correct information from Rudra.
  * **NEVER create AI-generated fake portrait photos or claim stock photos are Rudra.**
  * Never publish personal private information (personal phone numbers, private home address) without approval.
* ❌ **NO Fake Test Results**: Never claim tests or builds passed without actually executing them in the workspace terminal.

---

## 4. Coding Standards & Conventions

### TypeScript
* **Strict Typing**: Strict mode enabled (`"strict": true` in `tsconfig.json`). No `any` types; use explicit interfaces, type unions, or `unknown` with type guards.
* **Type Exports**: Co-locate component-specific props with components; place domain entities in `src/types/`.

### React 19 & Next-Gen Patterns
* **Functional Components Only**: Use idiomatic hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`).
* **Custom Hooks**: Extract complex logic (e.g., `useCelestialNavigation`, `useOrbitControlsSync`, `useCameraLerp`).
* **Performance**: Memoize heavy calculation results in orbital math using `useMemo`.

### Three.js & React Three Fiber (R3F)
* **Resource Disposal**: Always dispose geometries and materials on unmount (`dispose={null}` when caching, or let R3F automatic cleanup handle managed nodes).
* **Frame Loop Optimization**: Keep logic inside `useFrame` minimal and allocation-free (do not create `new THREE.Vector3()` inside `useFrame`; allocate vectors outside and reuse them).
* **Pixel Ratio Clamping**: Always clamp device pixel ratio: `dpr={[1, Math.min(window.devicePixelRatio, 2)]}` to avoid GPU thermal throttling on high-DPI displays.

---

## 5. Development Workflow & Autonomy Protocol

The engineering workflow follows two strict phases:
* **STAGE A — DOCUMENTATION AND ARCHITECTURE**:
  * Inspect workspace and verify directory structure.
  * Create all required architecture, design, requirements, and test documentation files.
  * Ensure complete mutual consistency across all documents.
  * **STOP after Stage A and wait for user's explicit approval before writing application code.**
* **STAGE B — IMPLEMENTATION**:
  * Execute implementation milestones sequentially (Milestones 1 through 8).
  * Read relevant architecture docs before starting each milestone.
  * For each milestone: plan changes -> implement -> execute commands/tests -> verify acceptance criteria -> report modified files and actual test results -> pause for review.

---

## 6. Skills & Cross-Tool Guidance

* **Claude Skills Reference**: A project-specific development skill exists at `.claude/skills/cosmic-portfolio/SKILL.md`.
* **Important Notice**: Gemini / Antigravity does not automatically execute Claude-specific skill hooks. Whenever implementing code, Three.js shaders, or testing routines, explicitly reference `.claude/skills/cosmic-portfolio/SKILL.md` and the architecture documents in `docs/` as the primary source of truth.

---

## 7. Celestial Mapping Reference

| Graha (World) | Cosmic Analog | Portfolio Dimension | Key Content Focus |
| :--- | :--- | :--- | :--- |
| **Surya** | Central Sun | Core Identity | Introduction, Bio, Values, Resume Gateway, Contact (`rudra.tiwari.4141@gmail.com`) |
| **Chandra** | Earth/Moon | Inner Universe | Personal Life, Hobbies, AKTU/ABES College Memories, Cricket Championship Winner |
| **Mangal** | Mars (Red Planet) | World of Action | NL-2-DB (NVIDIA NIM/LangGraph), AI Log Investigator, BarterNow, Food Delivery |
| **Budh** | Mercury (Swift) | Intelligence Network | Tech Stack (Java, Spring AI, FastAPI, Kafka), DSA (1200+ Solved, 600+ LeetCode, Rating: 1812) |
| **Guru** | Jupiter (Gas Giant) | Knowledge & Wisdom | B.Tech CSE (AKTU/ABES, 8.02 CGPA), National Means-cum-Merit Scholarship, Oracle Certifications |
| **Shukra** | Venus (Golden Haze) | Creativity & Aesthetics | Cosmic UI/UX Design System, Interactive Visual Concepts, BarterNow Analytics Dashboards |
| **Shani** | Saturn (Ringed Titan)| Timeline of Karma | Software Engineer at Salescode AI (OAuth 2.0/SSO across 10 services, OpenTelemetry, Auth Portal) |
| **Rahu** | Shadow Singularity | Frontier of Innovation | Generative AI, LangGraph Agents, RAG Pipelines, Vector DBs, Spring AI Log Analysis |
| **Ketu** | Cometary Nebula | Space of Reflection | Philosophy, Resilience, Lessons from Setbacks, Values Beyond Tech |
