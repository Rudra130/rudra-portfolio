import { useEffect } from 'react';
import { useUniverseStore } from '../store/useUniverseStore';
import { CelestialId } from '../types/celestial';

const CELESTIAL_ORDER: CelestialId[] = [
  'surya',
  'budh',
  'shukra',
  'mangal',
  'guru',
  'shani',
  'rahu',
  'ketu',
];

export function useKeyboardNavigation() {
  const {
    hasEnteredUniverse,
    activeWorldId,
    hoveredWorldId,
    selectWorld,
    closeDrawer,
    toggleOrbitPause,
  } = useUniverseStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs or textareas
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (!hasEnteredUniverse) return;

      switch (e.code) {
        case 'ArrowRight': {
          e.preventDefault();
          const currentIndex = activeWorldId
            ? CELESTIAL_ORDER.indexOf(activeWorldId)
            : -1;
          const nextIndex = (currentIndex + 1) % CELESTIAL_ORDER.length;
          selectWorld(CELESTIAL_ORDER[nextIndex]);
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const currentIndex = activeWorldId
            ? CELESTIAL_ORDER.indexOf(activeWorldId)
            : 0;
          const prevIndex =
            (currentIndex - 1 + CELESTIAL_ORDER.length) % CELESTIAL_ORDER.length;
          selectWorld(CELESTIAL_ORDER[prevIndex]);
          break;
        }
        case 'Escape': {
          e.preventDefault();
          if (activeWorldId) {
            closeDrawer();
          }
          break;
        }
        case 'Space': {
          e.preventDefault();
          toggleOrbitPause();
          break;
        }
        case 'Enter': {
          if (!activeWorldId && hoveredWorldId) {
            e.preventDefault();
            selectWorld(hoveredWorldId);
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEnteredUniverse, activeWorldId, hoveredWorldId, selectWorld, closeDrawer, toggleOrbitPause]);
}
