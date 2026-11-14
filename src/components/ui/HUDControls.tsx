import React, { useState } from 'react';
import { Info, Maximize2, Minimize2, Plus, Minus } from 'lucide-react';
import { useUniverseStore } from '../../store/useUniverseStore';

export const HUDControls: React.FC = () => {
  const {
    activeWorldId,
    zoomIn,
    zoomOut,
  } = useUniverseStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* Right Vertical Tool Dock (Exact View 2 Layout) */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 p-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-2xl">
        <button
          onClick={() => setShowInfoModal(true)}
          title="About Cosmic Portfolio"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-all"
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <div className="w-5 h-[1px] bg-white/10 my-0.5" />

        <button
          onClick={zoomIn}
          title="Zoom In (or use mouse scroll)"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={zoomOut}
          title="Zoom Out (or use mouse scroll)"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
      </aside>

      {/* Bottom Exploration Cue (Exact View 2 Layout) */}
      {!activeWorldId && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center select-none">
          <span className="text-xs sm:text-sm font-body text-slate-400 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Click on a planet to explore
          </span>
        </div>
      )}

      {/* Info Modal Dialog */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 text-left border border-white/10 shadow-2xl">
            <h3 className="text-xl font-display font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-400">✦</span> The Cosmic Concept
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Welcome to the personal portfolio of <strong>Rudra Tiwari</strong>. This interactive 3D portfolio is inspired by the 9 Grahas of Vedic astronomy, representing distinct dimensions of his career, skills, and life.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 mb-6 font-mono">
              <li>• <strong>Surya (Sun)</strong>: Core Identity, Bio & Resume</li>
              <li>• <strong>Mangal (Mars)</strong>: Software Projects (NL2SQL, Food Delivery)</li>
              <li>• <strong>Budh (Mercury)</strong>: Tech Stack & DSA (1812 LeetCode Rating)</li>
              <li>• <strong>Guru (Jupiter)</strong>: Education (B.Tech) & Oracle Certifications</li>
              <li>• <strong>Shani (Saturn)</strong>: Work Experience at Salescode AI</li>
              <li>• <strong>Rahu</strong>: Generative AI, LangGraph & AI Agents</li>
              <li>• <strong>Chandra</strong>: College Life & Cricket Trophy</li>
              <li>• <strong>Shukra</strong>: UI/UX & Frontend Craft</li>
              <li>• <strong>Ketu</strong>: Philosophy & Life Reflections</li>
            </ul>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
