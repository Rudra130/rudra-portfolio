import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Sparkles,
  Layers,
  Move3d,
  CheckCircle2,
  Boxes,
} from 'lucide-react';

interface ShukraDesignContentProps {
  containerVariants: any;
  itemVariants: any;
}

export const ShukraDesignContent: React.FC<ShukraDesignContentProps> = ({
  containerVariants,
  itemVariants,
}) => {
  // Interactive Claymorphic Demo States
  const [activeClayTab, setActiveClayTab] = useState<'preview' | 'code'>('preview');
  const [clayPressed, setClayPressed] = useState(false);
  const [clayCounter, setClayCounter] = useState(7);
  const [claySoftness, setClaySoftness] = useState(65);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 1. Hero Overview Card */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 border border-pink-500/30 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-white tracking-wide">
                UI/UX Design Systems & Creative Frontend
              </h4>
              <p className="text-xs font-mono text-pink-400">
                Claymorphism • 3D GSAP Choreography • Cosmic Glassmorphism
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[11px] font-mono bg-pink-500/10 text-pink-300 border border-pink-500/20">
            60 FPS WebGL
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Bridging high-performance systems engineering with tactile, visually stunning digital experiences.
          Specialized in tactile 3D interfaces (Claymorphism), cinematic GSAP camera staging across 3D celestial coordinates,
          and hardware-accelerated glassmorphic design tokens designed for clarity, depth, and emotional delight.
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'Claymorphism (Soft 3D)',
            '3D GSAP & ScrollTrigger',
            'Three.js / React Three Fiber',
            'Glassmorphism & Blurs',
            'Framer Motion Springs',
            'Tailwind CSS Tokens',
            'Figma Design Systems',
            'Micro-Interactions',
          ].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-pink-950/40 text-pink-200 border border-pink-500/30 hover:border-pink-400 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 2. Claymorphism: Tactile 3D Soft Surfaces */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Boxes className="w-5 h-5" />
          </div>
          <h4 className="text-base font-display font-bold text-white">
            Claymorphism & Tactile 3D Soft Interfaces
          </h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Claymorphism evolves flat neumorphism into vibrant, tangible, squishy 3D surfaces through dual-shadow
          matrices, high-radius soft curvatures, and reactive physical compression physics.
        </p>

        <ul className="space-y-2.5 text-xs text-slate-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Dual-Drop-Shadow Depth Matrix:</strong> Engineered multi-tiered shadow
              stacks combining soft ambient outer diffusion with crisp top-left inner specular highlights and bottom-right
              depth bevels, yielding a buoyant, floating 3D clay aesthetic.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Physical Compression Feedback:</strong> Implemented active tactile button
              states with physical press depression (<code className="text-pink-300 bg-pink-950/40 px-1 py-0.5 rounded text-[11px]">transform: translateY(3px)</code>)
              and dynamic shadow inversion that mimics real rubber/clay deformation upon click or touch.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Organic 24px+ Squircle Radii:</strong> Replaced harsh rectangular card
              boundaries with smooth continuous super-ellipses (squircles) and pill tokens that feel natural to human touch.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Accessible Contrast Calibration:</strong> Solved flat neumorphism’s accessibility
              flaws by layering high-contrast WCAG 2.1 AA typography, saturated accent borders, and crisp iconography atop
              soft pastel clay backdrops.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Production Implementations:</strong> Designed tactile action cards, checkout
              pills, and metric dials for high-conversion web apps, creating tangible delight without heavy 3D asset overhead.
            </div>
          </li>
        </ul>

        {/* Live Interactive Claymorphic Playground */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Live Interactive Claymorphic Element
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveClayTab('preview')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all ${
                  activeClayTab === 'preview'
                    ? 'bg-pink-500/20 text-pink-200 border border-pink-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive
              </button>
              <button
                onClick={() => setActiveClayTab('code')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all ${
                  activeClayTab === 'code'
                    ? 'bg-pink-500/20 text-pink-200 border border-pink-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CSS Token
              </button>
            </div>
          </div>

          {activeClayTab === 'preview' ? (
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
              {/* Interactive Clay Button */}
              <button
                onMouseDown={() => setClayPressed(true)}
                onMouseUp={() => setClayPressed(false)}
                onClick={() => setClayCounter((c) => c + 1)}
                className="group relative select-none cursor-pointer transition-all duration-150 rounded-2xl px-6 py-3.5 flex items-center gap-3"
                style={{
                  background: clayPressed
                    ? 'linear-gradient(145deg, #1e1b4b, #2e1065)'
                    : 'linear-gradient(145deg, #312e81, #1e1b4b)',
                  boxShadow: clayPressed
                    ? 'inset 4px 4px 8px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(236,72,153,0.3)'
                    : '8px 8px 18px rgba(0,0,0,0.5), -4px -4px 12px rgba(236,72,153,0.25), inset 1.5px 1.5px 3px rgba(255,255,255,0.4)',
                  transform: clayPressed ? 'translateY(3px) scale(0.97)' : 'translateY(0) scale(1)',
                }}
              >
                <span className="text-xl">✨</span>
                <div className="text-left">
                  <div className="text-xs font-display font-bold text-white group-hover:text-pink-200 transition-colors">
                    Click Me (Tactile Clay)
                  </div>
                  <div className="text-[10px] font-mono text-pink-300">
                    Pressed {clayCounter} times
                  </div>
                </div>
              </button>

              {/* Clay Metric Pill */}
              <div
                className="rounded-2xl p-4 flex flex-col items-center justify-center min-w-[140px]"
                style={{
                  background: 'linear-gradient(145deg, #18181b, #09090b)',
                  boxShadow:
                    '6px 6px 14px rgba(0,0,0,0.6), -3px -3px 10px rgba(255,255,255,0.05), inset 2px 2px 4px rgba(255,255,255,0.15)',
                }}
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Depth Level
                </span>
                <span className="text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                  {claySoftness}% Soft
                </span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={claySoftness}
                  onChange={(e) => setClaySoftness(Number(e.target.value))}
                  className="w-full mt-2 accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          ) : (
            <pre className="p-3 rounded-xl bg-black/60 text-[11px] font-mono text-pink-300 overflow-x-auto border border-white/5 leading-relaxed">
{`.clay-card {
  border-radius: 24px;
  background: linear-gradient(145deg, #1f2937, #111827);
  box-shadow: 
    8px 8px 18px rgba(0, 0, 0, 0.45),
    -4px -4px 12px rgba(236, 72, 153, 0.20),
    inset 2px 2px 4px rgba(255, 255, 255, 0.25);
  transition: all 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.clay-card:active {
  transform: translateY(3px) scale(0.98);
  box-shadow: 
    inset 4px 4px 8px rgba(0, 0, 0, 0.6),
    inset -3px -3px 6px rgba(236, 72, 153, 0.3);
}`}
            </pre>
          )}
        </div>
      </motion.div>

      {/* 3. 3D GSAP Choreography & Kinetic Physics */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Move3d className="w-5 h-5" />
          </div>
          <h4 className="text-base font-display font-bold text-white">
            3D GSAP Choreography & Camera Rig Physics
          </h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Orchestrating Three.js 3D camera transforms, spatial transitions, and UI synchronizations using GSAP
          timelines to produce cinematic web navigation without frame drops.
        </p>

        <ul className="space-y-2.5 text-xs text-slate-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Quaternion 3D Camera Tweening:</strong> Engineered GSAP camera timelines
              interpolating coordinates <code className="text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded text-[11px]">(x, y, z)</code> and look-at
              vectors across 9 celestial coordinates using <code className="text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded text-[11px]">power3.inOut</code> cubic
              Bezier curves for zero nausea motion.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Staggered Spatial Staging:</strong> Synchronized 3D camera zoom maneuvers
              with 2D glassmorphic drawer entrances—sliding the viewport target to the left third of the screen so the 3D
              planet remains prominently framed while reading content.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">ScrollTrigger Depth Scrubbing:</strong> Bound page progression to real-time
              spatial coordinate warping, focal length shifting (FOV 45° → 28° zoom), and orbital ring opacity fades.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Frame-Loop Decoupling:</strong> Synchronized GSAP tween interpolation with
              React Three Fiber’s <code className="text-cyan-300 bg-cyan-950/40 px-1 py-0.5 rounded text-[11px]">useFrame</code> hook,
              avoiding duplicate requestAnimationFrame loops and guaranteeing a locked 60 FPS on high-refresh displays.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Momentum Inertia Panning:</strong> Integrated friction-damped orbital drag
              allowing users to rotate the universe naturally with realistic deceleration.
            </div>
          </li>
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <p className="text-lg font-display font-bold text-cyan-400">60 FPS</p>
            <p className="text-[11px] text-slate-400 font-mono">Render Target</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <p className="text-lg font-display font-bold text-pink-400">power3.inOut</p>
            <p className="text-[11px] text-slate-400 font-mono">Easing Curve</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
            <p className="text-lg font-display font-bold text-amber-400">&lt; 16ms</p>
            <p className="text-[11px] text-slate-400 font-mono">Frame Budget</p>
          </div>
        </div>
      </motion.div>

      {/* 4. Glassmorphism & Cosmic Design Tokens */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 border border-white/10 space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-display font-bold text-white">
            Glassmorphism & Atmospheric Design Tokens
          </h4>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">GPU-Accelerated Backdrop Filters:</strong> Multi-layer frosted glass effects
              using <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[11px]">backdrop-filter: blur(16px) saturate(180%)</code> that
              render smoothly across WebGL canvas layers without compositing redraw spikes.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Specular Starlight Rim Lighting:</strong> 1px ultra-fine semi-transparent borders
              (<code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[11px]">border-white/10</code>) with directional
              gradient highlights replicating celestial star reflections.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Chromatic Color Profiles:</strong> Unique planetary color signatures (Gold for Sun,
              Crimson for Mars, Azure for Earth, Violet for Singularity) creating instant cognitive orientation.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Universal Reduced-Motion Fallbacks:</strong> Full adherence to
              <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded text-[11px]"> prefers-reduced-motion</code>: replacing
              warp sweeps with subtle cross-fades and disabling continuous particle drift for vestibular-safe viewing.
            </div>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
