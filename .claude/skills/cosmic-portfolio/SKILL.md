---
name: cosmic-portfolio
description: Project-specific engineering guidance, conventions, and rules for developing the Cosmic Portfolio for Rudra Tiwari.
version: 1.0.0
---

# Cosmic Portfolio Engineering Skill

This skill defines the technical rules, architecture guidelines, and standards for building the **Cosmic Portfolio** for **Rudra Tiwari**.

---

## 1. Project Context

* **Product**: An immersive, interactive 3D personal universe inspired by the 8 Grahas of Vedic astronomy (Surya, Budh, Shukra, Mangal, Guru, Shani, Rahu, Ketu).
* **Owner**: Rudra Tiwari (B.Tech CSE, ABES Engineering College, July 2026, 8.02 CGPA; Software Engineer at Salescode AI).
* **Core Philosophy**: *"The universe should attract attention. My story should create curiosity. My engineering work should earn credibility."*

---

## 2. Core Architecture Rules

1. **Separation of Concerns**:
   * Keep 3D WebGL rendering (`ThreeCanvas`, shaders, celestial meshes) strictly isolated from 2D DOM markup (`HUD`, drawers, modals).
   * Manage all cross-cutting state through the centralized `useUniverseStore` (Zustand).
2. **Centralized Static Content**:
   * All personal information, projects, skills, education, and timeline entries must reside exclusively in `src/data/`.
   * Never hardcode personal text or project metrics in React components.
3. **No Fabrication**:
   * Never fabricate company names, dates, metrics, or credentials.
   * If details are missing, use explicit typed placeholders and ask Rudra Tiwari.
   * Never generate or use AI-generated fake portrait photos.
4. **Dual-Paradigm Accessibility**:
   * The application must provide a complete, functional 2D non-WebGL fallback view.
   * Full keyboard navigation (`Tab`, `Arrows`, `Enter`, `Space`, `Escape`) and `prefers-reduced-motion` support are mandatory.

---

## 3. Technology Stack & Framework Conventions

### React 19 & Next-Gen Patterns
* Use functional components with idiomatic hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`).
* Keep components under 250 lines of code. Split large components into focused sub-components.
* Use `React.lazy` and `Suspense` for heavy 3D drawers and fallback views.

### TypeScript 5
* Strict mode enabled (`"strict": true`).
* No `any` types. Define clear domain interfaces in `src/types/`.
* Strong prop-types for all components.

### Three.js & React Three Fiber (R3F)
* Use declarative R3F components (`@react-three/fiber`, `@react-three/drei`).
* Never allocate new vectors or objects inside `useFrame` (`new THREE.Vector3()` inside frame loops causes GC freezes).
* Always clamp device pixel ratio: `dpr={[1, Math.min(window.devicePixelRatio, 2)]}`.
* Explicitly dispose unused textures, materials, and geometries on unmount.

### Styling & Motion
* Use **Tailwind CSS** with custom cosmic tokens (`bg-space-void`, `bg-space-obsidian`, `accent-surya`, etc.).
* Use **Framer Motion** for glassmorphic drawer entrances and HUD micro-interactions.
* Adhere to WCAG 2.1 AA color contrast standards.

---

## 4. Asset Guidelines

* Personal photographs belong in `assets/user-photos/` (`profile/`, `college/`, `achievements/`, `personal/`).
* Images must be modern **WebP** format, compressed, and stripped of sensitive EXIF metadata.
* Planetary textures belong in `assets/textures/planets/` with documented astronomical provenance (NASA/USGS).
* Rahu and Ketu are rendered as procedural shaders/particle anomalies, not physical spherical planets.

---

## 5. Testing & Verification Standards

* All mathematical functions (orbits, camera lerp, formatting) must have Vitest unit tests.
* All content records in `src/data/` must have schema validation tests.
* Critical user journeys must have Playwright end-to-end tests.
* **Never claim tests passed without executing them in the project workspace terminal.**

---

## 6. Phased Development Workflow

Follow the 8-milestone roadmap defined in `IMPLEMENTATION.md`:
* Milestone 1: Project Foundation (Vite, React 19, TypeScript, Tailwind, Zustand)
* Milestone 2: Cosmic Environment (Starfield, Volumetric Nebula, Surya Glow, Camera Rig)
* Milestone 3: Celestial Objects (8 Vedic worlds, textures, Cassini Saturn rings, Rahu/Ketu shaders)
* Milestone 4: Keplerian Orbits (Logarithmic radii [2.0, 3.1, 3.8, 4.5, 6.7, 7.8, 9.1, 9.9], focus-centered ellipses, velocity modulation)
* Milestone 5: Individual Worlds (Glassmorphic HUD panels, project breakdowns, skills)
* Milestone 6: Personal Assets (Real photographs, screenshots, certificate badges)
* Milestone 7: Optimization (Draw call batching, LOD, mobile performance, 2D fallback)
* Milestone 8: Testing & Deployment (Test suite execution, custom .me domain, Vercel edge deployment)
