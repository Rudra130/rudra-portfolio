# ARCHITECTURE_DECISIONS.md — Architecture Decision Records (ADRs)

> **PROJECT**: Cosmic Portfolio — Rudra Tiwari  
> **STATUS**: Accepted & Active  
> **FORMAT**: Michael Nygard ADR Template

---

## ADR Index

* [ADR-001: Frontend Framework & Build Tooling (React 19 + TypeScript + Vite)](#adr-001-frontend-framework--build-tooling-react-19--typescript--vite)
* [ADR-002: 3D WebGL Graphics Engine (Three.js via React Three Fiber & Drei)](#adr-002-3d-webgl-graphics-engine-threejs-via-react-three-fiber--drei)
* [ADR-003: Application State Management (Zustand)](#adr-003-application-state-management-zustand)
* [ADR-004: Centralized Static Content Repository vs. Headless CMS](#adr-004-centralized-static-content-repository-vs-headless-cms)
* [ADR-005: 100% Pure Frontend Architecture with Zero Backend](#adr-005-100-pure-frontend-architecture-with-zero-backend)
* [ADR-006: Stylized Ergonomic Orbits vs. Astronomical Scale Accuracy](#adr-006-stylized-ergonomic-orbits-vs-astronomical-scale-accuracy)
* [ADR-007: Dual-Paradigm Navigation Architecture (3D Space + 2D Accessible Mode)](#adr-007-dual-paradigm-navigation-architecture-3d-space--2d-accessible-mode)
* [ADR-008: Styling Engine & UI Layer (Tailwind CSS + Framer Motion)](#adr-008-styling-engine--ui-layer-tailwind-css--framer-motion)

---

### ADR-001: Frontend Framework & Build Tooling (React 19 + TypeScript + Vite)

* **Status**: Accepted
* **Context**: The portfolio requires high-performance UI rendering, declarative component composition, type-safe data handling, and rapid hot-module replacement during complex 3D shader and math development.
* **Decision**: Adopt **React 19** with **TypeScript 5 (Strict Mode)** and **Vite** as the core build foundation.
* **Alternatives Considered**:
  * *Next.js 15 (App Router)*: Excellent for SSR, but WebGL canvases and heavy client-side 3D engines run strictly on the client; SSR provides minimal advantage for full WebGL applications and adds Node server/bundling overhead.
  * *Vanilla JavaScript / Vite*: Lacks the declarative component model required for managing rich modal drawers, tabbed project breakdowns, and complex UI states.
* **Consequences**:
  * *Positive*: Blazing fast HMR (< 50ms), modern ES modules, zero SSR hydration mismatches with Three.js, lightweight static production bundles deployable to any edge CDN.
  * *Negative*: Initial SEO requires client-side meta management or pre-rendering plugins.

---

### ADR-002: 3D WebGL Graphics Engine (Three.js via React Three Fiber & Drei)

* **Status**: Accepted
* **Context**: The product vision mandates an immersive 3D solar system featuring nine distinct celestial bodies, custom corona and cometary shaders, smooth camera choreography, and raycast interaction.
* **Decision**: Use **Three.js** orchestrated through **React Three Fiber (R3F)** and **@react-three/drei**.
* **Alternatives Considered**:
  * *Vanilla Three.js*: Highly performant, but bridging imperative Three.js scene graphs with React UI overlays requires extensive manual synchronization, lifecycle management, and event listeners.
  * *Babylon.js*: Capable 3D engine, but smaller React ecosystem and larger bundle footprint compared to Three.js + R3F.
  * *Spline*: Easy visual modeling, but limits custom GLSL shader flexibility, fine-grained camera slerp math, and code-level architectural control.
* **Consequences**:
  * *Positive*: Declarative JSX scene hierarchy, automated WebGL resource cleanup on unmount, seamless integration with React state hooks, and rich ecosystem of camera and shader helpers in Drei.
  * *Negative*: Developers must understand both React reconciliation and Three.js frame-loop concepts to avoid accidental re-renders inside `useFrame`.

---

### ADR-003: Application State Management (Zustand)

* **Status**: Accepted
* **Context**: 3D camera controllers, user interaction raycasters, HUD drawers, and audio controllers must read and update shared state (e.g., active planet, camera mode, 2D fallback toggle) without triggering unnecessary React component re-renders that could degrade WebGL frame rates.
* **Decision**: Utilize **Zustand** as the centralized state manager.
* **Alternatives Considered**:
  * *React Context*: Inadequate for high-frequency updates; changing context re-renders all consumer components, destroying 60 FPS animation performance.
  * *Redux Toolkit*: Robust, but introduces substantial boilerplate (reducers, actions, dispatchers) that is disproportionate for this application scale.
* **Consequences**:
  * *Positive*: Minimal footprint (< 1KB), zero boilerplate, supports out-of-React state subscription (`useUniverseStore.getState()`), allowing R3F `useFrame` to read camera targets without triggering React re-renders.
  * *Negative*: State is client-memory bound; persistence across tabs requires explicit local storage middleware.

---

### ADR-004: Centralized Static Content Repository vs. Headless CMS

* **Status**: Accepted
* **Context**: Portfolio content (Rudra's biography, education, certifications, project architecture, skills, and timeline) must be completely accurate, instantly loaded, and verifiable.
* **Decision**: Maintain all content in strongly typed TypeScript files within `src/data/` as a static repository.
* **Alternatives Considered**:
  * *Headless CMS (Sanity / Strapi / Contentful)*: Adds unnecessary third-party API dependencies, network latency, subscription costs, and potential downtime for a personal portfolio.
  * *Markdown Files (MDX)*: Good for long-form blogs, but less suitable for deeply structured relational data (such as mapping orbital coordinates to project records).
* **Consequences**:
  * *Positive*: Instant zero-latency loading, compile-time type validation, zero runtime API failures, and complete version control alongside application code in git.
  * *Negative*: Updating content requires a git commit and automated redeployment (mitigated by instant Vercel CI/CD builds).

---

### ADR-005: 100% Pure Frontend Architecture with Zero Backend

* **Status**: Accepted
* **Context**: The portfolio is designed to showcase Rudra Tiwari's personal identity, engineering projects, skills, education, and credentials. All portfolio reads are static, and outreach interactions are direct communication actions.
* **Decision**: Eliminate all backend server and database requirements. Build and deploy exclusively as a **100% client-side, pure frontend single-page application (SPA)** hosted on Vercel Edge. No Java/Spring Boot server, database, or backend API layer will be implemented.
* **Alternatives Considered**:
  * *Spring Boot 3 + PostgreSQL Backend*: Introduces unnecessary hosting overhead, cold-start delays, database management, and maintenance complexity without architectural benefit.
  * *BaaS (Firebase / Supabase)*: Introduces third-party vendor lock-in and potential network failures for what is fundamentally a static portfolio.
* **Consequences**:
  * *Positive*: Maximum speed, zero hosting costs, 100% availability through global edge CDN, zero security attack surface from backend vulnerabilities, and simplified CI/CD pipeline. Contact interactions operate directly via native client `mailto:`, LinkedIn messaging, and GitHub links.
  * *Negative*: No server-side persistence of visitor comments (not needed for this portfolio).

---

### ADR-006: Stylized Ergonomic Orbits vs. Astronomical Scale Accuracy

* **Status**: Accepted
* **Context**: Real astronomical dimensions are vast: the Sun is 109x Earth's diameter, and Neptune is 30 astronomical units away. In a true-scale 3D viewport, planets are invisible sub-pixel dots unless the user zooms in by orders of magnitude.
* **Decision**: Implement stylized, ergonomically scaled orbital distances ($22.0$ to $148.0$ units) and planetary radii ($1.8$ to $6.5$ units) that evoke realistic planetary proportions while ensuring all worlds remain visually identifiable and clickable.
* **Alternatives Considered**:
  * *Strict Astronomical Scale*: Unusable for an interactive portfolio; visitors cannot locate or click planets without complex radar overlays.
  * *Flat 2D Circle*: Visually boring; eliminates the sense of cosmic depth and space travel.
* **Consequences**:
  * *Positive*: High visual impact, comfortable camera navigation, immediate readability, and intuitive touch interaction.
  * *Negative*: Deviates from exact celestial physics (clearly documented as a deliberate artistic and ergonomic design choice).

---

### ADR-007: Dual-Paradigm Navigation Architecture (3D Space + 2D Accessible Mode)

* **Status**: Accepted
* **Context**: WebGL 3D experiences can be inaccessible to screen-reader users, individuals with vestibular or motion sensitivity, and devices with low-end GPUs or disabled WebGL contexts.
* **Decision**: Engineer a dual-paradigm architecture:
  1. Primary: 3D interactive celestial universe.
  2. Alternative: 2D accessible, semantic, responsive portfolio view.
  Both modes share the identical centralized data layer.
* **Alternatives Considered**:
  * *3D Only with basic ARIA labels*: Fails WCAG 2.1 AA requirements and excludes users on non-WebGL devices.
  * *2D Only with 3D canvas background*: Eliminates the core creative vision of exploring an interactive personal universe.
* **Consequences**:
  * *Positive*: Full WCAG 2.1 AA compliance, seamless support for `prefers-reduced-motion`, and bulletproof resilience against WebGL context crashes.
  * *Negative*: Requires developing and maintaining two presentation layouts (mitigated by sharing common UI cards and data repositories).

---

### ADR-008: Styling Engine & UI Layer (Tailwind CSS + Framer Motion)

* **Status**: Accepted
* **Context**: UI overlays (glassmorphic drawers, HUD status bars, telemetry tags, and responsive cards) require high design fidelity, smooth micro-interactions, and low bundle weight.
* **Decision**: Use **Tailwind CSS** for styling and **Framer Motion** for UI panel transitions.
* **Alternatives Considered**:
  * *CSS Modules*: Clean, but slower development velocity and lacks Tailwind's atomic utility deduplication.
  * *Styled Components / Emotion*: Runtime CSS-in-JS adds CPU overhead and hydration performance penalties in React 19.
* **Consequences**:
  * *Positive*: Zero runtime styling overhead, instant utility prototyping, highly customizable cosmic tokens, and buttery-smooth spring physics in Framer Motion.
  * *Negative*: Requires disciplined class organization and utility extraction for common glassmorphic surfaces.
