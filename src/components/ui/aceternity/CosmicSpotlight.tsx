import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export type Portfolio2DTheme = 'dark' | 'light';

interface CosmicSpotlightProps {
  className?: string;
  theme?: Portfolio2DTheme;
}

const BEAM_PATHS = [
  'M-180 -60 C 120 120, 420 -20, 760 160 C 1080 340, 1280 220, 1620 420',
  'M-140 240 C 180 60, 480 280, 820 140 C 1140 20, 1340 280, 1640 160',
  'M-120 560 C 240 420, 540 620, 880 480 C 1180 360, 1400 540, 1680 440',
];

/**
 * Aceternity UI-style Spotlight + Background Beams + subtle Dot Grid mask
 * tailored for the 2D Accessible Cosmic Portfolio backdrop in dark or light mode.
 */
export const CosmicSpotlight: React.FC<CosmicSpotlightProps> = ({
  className,
  theme = 'dark',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isLight = theme === 'light';

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      {/* Subtle Aceternity radial dot grid faded toward edges */}
      <div
        className={cn('absolute inset-0', isLight ? 'opacity-45' : 'opacity-25')}
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(rgba(100, 116, 139, 0.28) 1px, transparent 1px)'
            : 'radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 100%)',
        }}
      />

      {/* Aceternity Dual Spotlight Aurora Glows */}
      <motion.div
        className="absolute -top-44 -left-32 h-[540px] w-[620px] rounded-full blur-[120px]"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(251, 191, 36, 0.06) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.04) 45%, transparent 72%)',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.75, 1, 0.75], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/4 -right-40 h-[560px] w-[640px] rounded-full blur-[130px]"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(99, 102, 241, 0.09) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 72%)',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.7, 0.95, 0.7], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      <div
        className="absolute -bottom-48 left-1/3 h-[480px] w-[580px] rounded-full blur-[130px]"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(20, 184, 166, 0.10) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(20, 184, 166, 0.11) 0%, transparent 70%)',
        }}
      />

      {/* Aceternity Background Beams SVG Paths */}
      <svg
        className={cn('absolute inset-0 h-full w-full', isLight ? 'opacity-45' : 'opacity-55')}
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {BEAM_PATHS.map((_, idx) => (
            <motion.linearGradient
              key={`${theme}-${idx}`}
              id={`aceternity-beam-${idx}`}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: '0%', x2: '15%', y1: '0%', y2: '15%' }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      x1: ['0%', '95%'],
                      x2: ['18%', '115%'],
                      y1: ['0%', '65%'],
                      y2: ['18%', '85%'],
                    }
              }
              transition={{
                duration: 9 + idx * 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: idx * 1.2,
              }}
            >
              <stop offset="0%" stopColor={isLight ? '#0284c7' : '#18ccfc'} stopOpacity="0" />
              <stop
                offset="45%"
                stopColor={idx === 1 ? (isLight ? '#d97706' : '#f59e0b') : isLight ? '#0284c7' : '#22d3ee'}
                stopOpacity={isLight ? '0.35' : '0.45'}
              />
              <stop offset="75%" stopColor={isLight ? '#4f46e5' : '#6344f5'} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ae48ff" stopOpacity="0" />
            </motion.linearGradient>
          ))}
        </defs>

        {BEAM_PATHS.map((d, idx) => (
          <React.Fragment key={idx}>
            <path
              d={d}
              stroke={isLight ? 'rgba(15, 23, 42, 0.055)' : 'rgba(255, 255, 255, 0.035)'}
              strokeWidth="1"
            />
            <path d={d} stroke={`url(#aceternity-beam-${idx})`} strokeWidth="1.5" />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};
