import React from 'react';
import { Mail, ArrowUpRight, Home, ArrowLeft } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons/BrandIcons';
import { useUniverseStore } from '../../store/useUniverseStore';
import { profileData } from '../../data/profile';

export const Header: React.FC = () => {
  const {
    isFallback2D,
    toggleFallback2D,
    selectWorld,
    returnToLanding,
    activeWorldId,
    closeDrawer,
  } = useUniverseStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Left Brand Identity + Contextual Back Button */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div
          onClick={returnToLanding}
          className="flex items-center gap-3 cursor-pointer group transition-transform hover:scale-[1.02]"
          title="Return to Landing Page"
        >
          {/* Golden Galaxy Swirl with Rudra's Portrait */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] transition-all overflow-hidden shrink-0">
            <img
              src={profileData.avatarPath || '/assets/user-photos/profile/profile-main.webp'}
              alt={profileData.name}
              className="w-full h-full rounded-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-slate-100 font-display font-semibold text-sm tracking-wide group-hover:text-amber-300 transition-colors">
              {profileData.name}
            </span>
            <span className="text-slate-400 text-[11px] font-mono tracking-wider">
              My Portfolio
            </span>
          </div>
        </div>

        {/* Integrated Back Button in Header row (active during planet inspection) */}
        {activeWorldId && (
          <button
            onClick={closeDrawer}
            className="group flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-200 hover:text-white hover:border-amber-400 hover:bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ml-1"
            title="Return to Solar System Overview (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-display font-medium tracking-wide">
              Back to Overview
            </span>
          </button>
        )}
      </div>

      {/* Right Navigation & Socials */}
      <nav className="flex items-center gap-5 pointer-events-auto bg-slate-950/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/5">
        <button
          onClick={returnToLanding}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
          title="Return to Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            if (isFallback2D) toggleFallback2D();
            selectWorld(null);
          }}
          className="text-xs font-medium text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
        >
          Portfolio
        </button>

        <button
          onClick={() => selectWorld('surya')}
          className="text-xs font-medium text-slate-300 hover:text-amber-300 transition-colors"
        >
          About
        </button>

        <a
          href={profileData.resumePath}
          download="Rudra_Tiwari_Resume.pdf"
          className="flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors group"
        >
          Resume
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        <div className="h-3 w-[1px] bg-white/10 mx-1" />

        <a
          href={profileData.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
        </a>

        <a
          href={profileData.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>

        <a
          href={`mailto:${profileData.email}`}
          aria-label="Email Rudra Tiwari"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Mail className="w-4 h-4" />
        </a>
      </nav>
    </header>
  );
};
