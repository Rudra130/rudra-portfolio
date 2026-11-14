import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { worldsData } from '../../data/worlds';

export const PlanetNavList: React.FC = () => {
  const { activeWorldId, selectWorld } = useUniverseStore();
  // Collapsed mode by default as requested
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <aside
      aria-label="Portfolio Dimensions Navigation"
      className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 select-none transition-all duration-300"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: prefersReduced ? 0.01 : 0.4, ease: 'easeOut' }}
        className="flex flex-col rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-1.5 sm:p-2"
      >
        {/* Dock Header */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-1 border-b border-white/5 gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow shrink-0" />
            {!isCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 whitespace-nowrap">
                Explore
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
            aria-label={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
            )}
          </button>
        </div>

        {/* Vertical List of Celestial Bodies */}
        <nav className="flex flex-col gap-1">
          {worldsData.map((world) => {
            const isActive = activeWorldId === world.id;

            return (
              <motion.button
                key={world.id}
                onClick={() => selectWorld(world.id)}
                whileHover={prefersReduced ? undefined : { x: 3 }}
                whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                className={`group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                title={world.realWorldIdentity}
                aria-label={world.realWorldIdentity}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Visual Orb / Celestial Symbol */}
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs transition-transform group-hover:scale-110 shadow-sm"
                  style={{
                    backgroundColor: `${world.color}25`,
                    borderColor: `${world.color}60`,
                    borderWidth: '1px',
                  }}
                >
                  <span style={{ color: world.color }}>{world.symbol}</span>
                </div>

                {/* Real-World Identity Text Label */}
                {!isCollapsed && (
                  <div className="hidden sm:flex flex-col min-w-[170px] pr-2">
                    <span
                      className={`text-[12px] font-display font-medium tracking-wide whitespace-nowrap transition-colors ${
                        isActive ? 'text-amber-200 font-semibold' : 'group-hover:text-amber-300'
                      }`}
                    >
                      {world.realWorldIdentity}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 truncate max-w-[170px]">
                      {world.theme}
                    </span>
                  </div>
                )}

                {/* Active Indicator Pip */}
                {isActive && (
                  <motion.div
                    layoutId="activePlanetIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                  />
                )}

                {/* Floating Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs font-display whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    <p className="font-semibold">{world.realWorldIdentity}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{world.theme}</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>
    </aside>
  );
};
