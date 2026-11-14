import React, { useEffect } from 'react';
import { useUniverseStore } from './store/useUniverseStore';
import { Header } from './components/ui/Header';
import { LandingHero } from './components/ui/LandingHero';
import { HUDControls } from './components/ui/HUDControls';
import { WorldDrawer } from './components/ui/WorldDrawer';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { AccessiblePortfolioView } from './components/fallback/AccessiblePortfolioView';
import { CelestialId } from './types/celestial';

export const App: React.FC = () => {
  const {
    hasEnteredUniverse,
    isFallback2D,
    enterUniverse,
    selectWorld,
  } = useUniverseStore();

  // Synchronize URL Hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/world/')) {
        const worldId = hash.replace('#/world/', '') as CelestialId;
        enterUniverse();
        selectWorld(worldId);
      } else if (hash === '#/universe') {
        enterUniverse();
        selectWorld(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [enterUniverse, selectWorld]);

  // Accessible 2D Fallback View
  if (isFallback2D) {
    return <AccessiblePortfolioView />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-void select-none">
      {/* 3D WebGL Canvas Layer */}
      <CanvasContainer />

      {/* Header Overlay */}
      <Header />

      {/* Landing Experience */}
      {!hasEnteredUniverse ? (
        <LandingHero />
      ) : (
        <>
          {/* Active Universe HUD Tools */}
          <HUDControls />

          {/* World Deep-Dive Drawer */}
          <WorldDrawer />
        </>
      )}
    </main>
  );
};

export default App;
