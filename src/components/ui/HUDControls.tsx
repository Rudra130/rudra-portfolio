import React, { useState } from 'react';
import { Info, Maximize2, Minimize2, Plus, Minus, Volume2, VolumeX, Eye } from 'lucide-react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { worldsData } from '../../data/worlds';

export const HUDControls: React.FC = () => {
  const {
    activeWorldId,
    selectWorld,
    zoomIn,
    zoomOut,
    isAudioMuted,
    toggleAudio,
    toggleFallback2D,
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
      {/* Right Vertical Tool Dock */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-2xl">
        <button
          onClick={() => setShowInfoModal(true)}
          title="About Cosmic System"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <div className="w-5 h-[1px] bg-white/10" />

        <button
          onClick={zoomIn}
          title="Zoom In"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-5 h-[1px] bg-white/10" />

        <button
          onClick={toggleAudio}
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={toggleFallback2D}
          title="Switch to 2D Accessible Portfolio"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>
      </aside>

      {/* Bottom Exploration Cue (when in solar overview) */}
      {!activeWorldId && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-3">
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-slate-400/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Click on a planet to explore
          </span>

          {/* Quick World Pill Carousel */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/5 max-w-[90vw] overflow-x-auto">
            {worldsData.map((world) => (
              <button
                key={world.id}
                onClick={() => selectWorld(world.id)}
                className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span style={{ color: world.color }}>{world.symbol}</span>
                <span>{world.sanskritName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Modal Dialog */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="max-w-md w-full glass-panel rounded-2xl p-6 text-left border border-white/10">
            <h3 className="text-xl font-display font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-400">✦</span> The Cosmic Concept
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Welcome to the <strong>Cosmic Portfolio</strong> of <strong>Rudra Tiwari</strong>. This 3D universe is inspired by the nine Grahas of Vedic astronomy, where every celestial body represents a unique dimension of his life, career, and technical mastery.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 mb-6 font-mono">
              <li>• <strong>Surya (Sun)</strong>: Core Identity & Resume</li>
              <li>• <strong>Mangal (Mars)</strong>: Projects (NL2SQL, Food Delivery)</li>
              <li>• <strong>Budh (Mercury)</strong>: Skills & DSA (1812 LeetCode)</li>
              <li>• <strong>Guru (Jupiter)</strong>: Education (B.Tech) & Certifications</li>
              <li>• <strong>Shani (Saturn)</strong>: Salescode AI Work Experience</li>
              <li>• <strong>Rahu</strong>: Generative AI, LangGraph, RAG</li>
            </ul>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold uppercase tracking-wider hover:bg-amber-500/30 transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
};
