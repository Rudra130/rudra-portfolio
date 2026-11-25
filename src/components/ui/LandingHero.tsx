import React from 'react';
import { ArrowRight, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { profileData } from '../../data/profile';

export const LandingHero: React.FC = () => {
  const { enterUniverse, selectWorld, setFallback2D } = useUniverseStore();

  const ctaButtonBase =
    'group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-slate-950/70 backdrop-blur-md border font-body text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:text-white hover:bg-slate-900/90 hover:scale-105 active:scale-95 shadow-xl cursor-pointer';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-8 z-30 overflow-hidden select-none">
      {/* Background: Cinematic AI-generated Cosmic Explorer Artwork */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/assets/reference/landing-hero-cinematic.jpg')`,
        }}
      >
        {/* Subtle dark gradient overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-slate-950/60" />
      </div>

      {/* Top Navigation Bar (Identical to View 1) */}
      <header className="relative w-full max-w-7xl mx-auto flex items-center justify-end z-40 pointer-events-auto">
        <nav className="flex items-center gap-7 text-xs sm:text-sm font-body tracking-wider text-slate-300">
          <button
            onClick={() => {
              enterUniverse();
              selectWorld('surya');
            }}
            className="hover:text-amber-300 transition-colors"
          >
            About
          </button>
          <button
            onClick={enterUniverse}
            className="hover:text-amber-300 transition-colors"
          >
            Portfolio
          </button>
          <a
            href={profileData.resumePath}
            download="Rudra_Tiwari_Resume.pdf"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors group"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </nav>
      </header>

      {/* Central Hero Block (Centered Typography) */}
      <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto my-auto z-40">
        {/* Profile Avatar Badge */}
        <div className="relative mb-4 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[2px] shadow-[0_0_25px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] transition-all overflow-hidden">
            <img
              src={profileData.avatarPath || '/assets/user-photos/profile/profile-main.webp'}
              alt={profileData.name}
              className="w-full h-full rounded-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          </div>
        </div>

        <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-slate-200/90 mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Cosmic Portfolio
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight text-white mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
          {profileData.name}
        </h1>

        <p className="text-base sm:text-xl font-body font-medium text-slate-200 tracking-wide mb-3 drop-shadow-md">
          {profileData.tagline}
        </p>

        <p className="text-xs sm:text-base font-body italic text-slate-300 max-w-lg mb-8 leading-relaxed drop-shadow-md">
          {profileData.quote}
        </p>

        {/* Enter Portfolio & 2D Portfolio CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={enterUniverse}
            className={`${ctaButtonBase} border-amber-500/50 text-amber-200 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]`}
          >
            <span>Enter Portfolio</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setFallback2D(true)}
            className={`${ctaButtonBase} border-cyan-500/40 text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]`}
          >
            <span>Accessible 2D Portfolio</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Scroll/Enter Indicator (View 1) */}
      <div
        onClick={enterUniverse}
        className="relative z-40 flex flex-col items-center gap-2 cursor-pointer group pb-2 transition-transform hover:translate-y-1"
        title="Enter Portfolio"
      >
        <div className="w-9 h-9 rounded-full border border-white/20 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-300 group-hover:border-amber-400/60 group-hover:text-amber-300 transition-all shadow-lg">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
