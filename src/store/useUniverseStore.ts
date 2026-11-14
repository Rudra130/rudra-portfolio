import { create } from 'zustand';
import { CelestialId } from '../types/celestial';
import { pushPath, getPathForWorld } from '../utils/navigation';

export type CameraMode = 'OVERVIEW' | 'APPROACHING' | 'INSPECTING' | 'RETURNING';

interface UniverseState {
  hasEnteredUniverse: boolean;
  activeWorldId: CelestialId | null;
  hoveredWorldId: CelestialId | null;
  cameraMode: CameraMode;
  isDrawerOpen: boolean;
  activeTab: string;
  isFallback2D: boolean;
  isAudioMuted: boolean;
  isSearchOpen: boolean;
  zoomLevel: number;
  isOrbitPaused: boolean;

  enterUniverse: () => void;
  selectWorld: (id: CelestialId | null) => void;
  setHoveredWorld: (id: CelestialId | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  closeDrawer: () => void;
  setActiveTab: (tab: string) => void;
  toggleFallback2D: () => void;
  toggleAudio: () => void;
  toggleOrbitPause: () => void;
  setSearchOpen: (open: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export const useUniverseStore = create<UniverseState>((set) => ({
  hasEnteredUniverse: false,
  activeWorldId: null,
  hoveredWorldId: null,
  cameraMode: 'OVERVIEW',
  isDrawerOpen: false,
  activeTab: 'Overview',
  isFallback2D: false,
  isAudioMuted: true,
  isSearchOpen: false,
  zoomLevel: 1.0,
  isOrbitPaused: false,

  enterUniverse: () => {
    set({ hasEnteredUniverse: true, cameraMode: 'OVERVIEW' });
    pushPath('/universe');
  },

  selectWorld: (id: CelestialId | null) => {
    if (id === null) {
      set({
        activeWorldId: null,
        cameraMode: 'RETURNING',
        isDrawerOpen: false,
      });
      pushPath('/universe');
    } else {
      set({
        activeWorldId: id,
        cameraMode: 'APPROACHING',
        isDrawerOpen: true,
        activeTab: 'Overview',
      });
      pushPath(getPathForWorld(id));
    }
  },

  setHoveredWorld: (id: CelestialId | null) => {
    set({ hoveredWorldId: id });
  },

  setCameraMode: (mode: CameraMode) => {
    set({ cameraMode: mode });
  },

  closeDrawer: () => {
    set({
      activeWorldId: null,
      cameraMode: 'RETURNING',
      isDrawerOpen: false,
    });
    pushPath('/universe');
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },

  toggleFallback2D: () => {
    set((state) => ({ isFallback2D: !state.isFallback2D }));
  },

  toggleAudio: () => {
    set((state) => ({ isAudioMuted: !state.isAudioMuted }));
  },

  toggleOrbitPause: () => {
    set((state) => ({ isOrbitPaused: !state.isOrbitPaused }));
  },

  setSearchOpen: (open: boolean) => {
    set({ isSearchOpen: open });
  },

  zoomIn: () => {
    set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 0.25, 2.5) }));
  },

  zoomOut: () => {
    set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 0.25, 0.5) }));
  },
}));
