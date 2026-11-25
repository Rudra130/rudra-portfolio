import React, { useEffect } from 'react';
import { useUniverseStore } from './store/useUniverseStore';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { Header } from './components/ui/Header';
import { LandingHero } from './components/ui/LandingHero';
import { HUDControls } from './components/ui/HUDControls';
import { PlanetNavList } from './components/ui/PlanetNavList';
import { WorldDrawer } from './components/ui/WorldDrawer';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { AccessiblePortfolioView } from './components/fallback/AccessiblePortfolioView';
import { CelestialId } from './types/celestial';
import { SLUG_TO_WORLD, WORLD_TO_SLUG, replacePath } from './utils/navigation';

export const App: React.FC = () => {
  const {
    hasEnteredUniverse,
    isFallback2D,
    enterUniverse,
    returnToLanding,
    selectWorld,
    setFallback2D,
  } = useUniverseStore();

  // Enable multi-modal global keyboard navigation (Arrows, Esc, Space, Enter)
  useKeyboardNavigation();

  // Synchronize Clean HTML5 URL Path navigation (and clean up legacy hashes)
  useEffect(() => {
    const handleRouteSync = () => {
      // 1. Upgrade legacy hash to clean URL if present
      if (window.location.hash) {
        const hash = window.location.hash;
        if (hash.startsWith('#/world/')) {
          const rawId = hash.replace('#/world/', '').replace(/\/$/, '');
          const targetWorld = SLUG_TO_WORLD[rawId] || (rawId as CelestialId);
          const slug = WORLD_TO_SLUG[targetWorld] || targetWorld;
          replacePath(`/portfolio/${slug}`);
          enterUniverse();
          selectWorld(targetWorld);
          return;
        } else if (
          hash === '#/portfolio' ||
          hash === '#/portfolio/' ||
          hash === '#/universe' ||
          hash === '#/universe/'
        ) {
          replacePath('/portfolio');
          enterUniverse();
          selectWorld(null);
          return;
        }
      }

      // 2. Parse clean URL path
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      if (path === '/') {
        returnToLanding();
      } else if (path === '/portfolio') {
        enterUniverse();
        selectWorld(null);
      } else if (path.startsWith('/portfolio/')) {
        const slug = path.replace('/portfolio/', '');
        const targetWorld = SLUG_TO_WORLD[slug];
        if (targetWorld) {
          enterUniverse();
          selectWorld(targetWorld);
        } else {
          enterUniverse();
          selectWorld(null);
        }
      } else if (path === '/universe') {
        // Backward compatibility: redirect /universe to clean /portfolio
        replacePath('/portfolio');
        enterUniverse();
        selectWorld(null);
      } else if (path.startsWith('/universe/')) {
        // Backward compatibility: redirect /universe/:slug to clean /portfolio/:slug
        const slug = path.replace('/universe/', '');
        const targetWorld = SLUG_TO_WORLD[slug];
        if (targetWorld) {
          const canonicalSlug = WORLD_TO_SLUG[targetWorld] || targetWorld;
          replacePath(`/portfolio/${canonicalSlug}`);
          enterUniverse();
          selectWorld(targetWorld);
        } else {
          replacePath('/portfolio');
          enterUniverse();
          selectWorld(null);
        }
      } else if (path.startsWith('/world/')) {
        // Backward compatibility: redirect /world/:slug to clean /portfolio/:slug
        const slug = path.replace('/world/', '');
        const targetWorld = SLUG_TO_WORLD[slug];
        if (targetWorld) {
          const canonicalSlug = WORLD_TO_SLUG[targetWorld] || targetWorld;
          replacePath(`/portfolio/${canonicalSlug}`);
          enterUniverse();
          selectWorld(targetWorld);
        } else {
          replacePath('/portfolio');
          enterUniverse();
          selectWorld(null);
        }
      } else if (path === '/2d' || path === '/accessible') {
        setFallback2D(true);
      }
    };

    handleRouteSync();
    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, [enterUniverse, returnToLanding, selectWorld, setFallback2D]);

  // Accessible 2D Fallback View
  if (isFallback2D) {
    return <AccessiblePortfolioView />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-void select-none">
      {/* 3D WebGL Canvas Layer */}
      <CanvasContainer />

      {/* Landing Experience */}
      {!hasEnteredUniverse ? (
        <LandingHero />
      ) : (
        <>
          {/* Main Top Header (In Portfolio View) */}
          <Header />

          {/* Left Vertical Navigation List */}
          <PlanetNavList />

          {/* Active Portfolio HUD Tools */}
          <HUDControls />

          {/* World Deep-Dive Drawer */}
          <WorldDrawer />
        </>
      )}
    </main>
  );
};

export default App;
