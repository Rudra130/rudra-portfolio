import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { profileData } from '../../data/profile';

export const LandingHero: React.FC = () => {
  const { enterUniverse, toggleFallback2D } = useUniverseStore();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-12 z-30 overflow-hidden select-none">
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle radial cosmic glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-indigo-900/20 via-purple-950/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 inset-x-0 h-[300px] bg-gradient-to-t from-cyan-950/20 to-transparent blur-[100px]" />
      </div>

      {/* Top Spacer */}
      <div className="w-full h-12" />

      {/* Main Central Typography */}
      <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto my-auto animate-fade-in">
        <span className="text-xs md:text-sm font-mono uppercase tracking-[0.35em] text-cyan-300/80 mb-4 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
          My Universe
        </span>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold uppercase tracking-tight text-white mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          {profileData.name}
        </h1>

        <p className="text-lg md:text-xl font-body font-medium text-slate-300 tracking-wide mb-3">
          {profileData.tagline}
        </p>

        <p className="text-sm md:text-base font-body italic text-slate-400 max-w-lg mb-8 leading-relaxed">
          {profileData.quote}
        </p>

        {/* Enter Universe CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={enterUniverse}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-amber-500/40 text-amber-200 font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:border-amber-400 hover:text-white hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95"
          >
            <span>Enter Universe</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={toggleFallback2D}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
          >
            or view Accessible 2D Portfolio
          </button>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div
        onClick={enterUniverse}
        className="flex flex-col items-center gap-2 cursor-pointer group pb-4 transition-transform hover:translate-y-1"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-slate-400 group-hover:border-amber-400/50 group-hover:text-amber-300 transition-colors">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
