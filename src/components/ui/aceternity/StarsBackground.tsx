import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface StarsBackgroundProps {
  className?: string;
  starDensity?: number;
}

interface ShootingStarSpec {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  repeatDelay: number;
  duration: number;
  colorStart: string;
  colorEnd: string;
}

const SHOOTING_STARS: ShootingStarSpec[] = [
  {
    id: 1,
    x1: 160,
    y1: 70,
    x2: 610,
    y2: 310,
    delay: 0.6,
    repeatDelay: 5.5,
    duration: 1.4,
    colorStart: '#22d3ee',
    colorEnd: '#6366f1',
  },
  {
    id: 2,
    x1: 1150,
    y1: 55,
    x2: 700,
    y2: 330,
    delay: 2.8,
    repeatDelay: 7.0,
    duration: 1.6,
    colorStart: '#fbbf24',
    colorEnd: '#f59e0b',
  },
  {
    id: 3,
    x1: 1280,
    y1: 380,
    x2: 810,
    y2: 650,
    delay: 5.2,
    repeatDelay: 8.5,
    duration: 1.5,
    colorStart: '#a5b4fc',
    colorEnd: '#22d3ee',
  },
];

const TWINKLE_STARS = Array.from({ length: 36 }, (_, idx) => {
  // Deterministic pseudo-random spread for crisp twinkle highlights without rAF loops
  const seedA = ((idx * 73 + 19) % 97) / 97;
  const seedB = ((idx * 41 + 37) % 89) / 89;
  const seedC = ((idx * 29 + 11) % 53) / 53;
  return {
    id: idx,
    top: `${(seedA * 96 + 2).toFixed(2)}%`,
    left: `${(seedB * 96 + 2).toFixed(2)}%`,
    size: seedC > 0.72 ? 2.5 : 1.5,
    duration: 2.6 + seedC * 3.4,
    delay: seedA * 3.0,
    tint:
      idx % 5 === 0
        ? 'bg-amber-200'
        : idx % 3 === 0
        ? 'bg-cyan-200'
        : 'bg-slate-100',
  };
});

/**
 * Aceternity UI-inspired Shooting Stars & Stars Background for non-WebGL views.
 * Draws static base stars on a 2D canvas on mount/resize and layers Framer Motion
 * twinkle & shooting-star streaks (respecting prefers-reduced-motion).
 */
export const StarsBackground: React.FC<StarsBackgroundProps> = ({
  className,
  starDensity = 0.00018,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const starColors = useMemo(
    () => [
      'rgba(248, 250, 252, 0.75)',
      'rgba(186, 230, 253, 0.65)',
      'rgba(253, 230, 138, 0.6)',
      'rgba(199, 210, 254, 0.55)',
    ],
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const numStars = Math.min(360, Math.floor(width * height * starDensity));
      let seed = 987654321;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };

      for (let i = 0; i < numStars; i++) {
        const x = rand() * width;
        const y = rand() * height;
        const radius = 0.4 + rand() * 1.1;
        const color = starColors[Math.floor(rand() * starColors.length)];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    };

    renderStars();
    window.addEventListener('resize', renderStars);
    return () => window.removeEventListener('resize', renderStars);
  }, [starDensity, starColors]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />

      {/* Subtle twinkling star layer */}
      {TWINKLE_STARS.map((star) => (
        <motion.span
          key={star.id}
          className={cn('absolute rounded-full', star.tint)}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0.35 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.45 }
              : { opacity: [0.2, 0.9, 0.25], scale: [1, 1.35, 1] }
          }
          transition={{
            duration: star.duration,
            repeat: prefersReducedMotion ? 0 : Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Aceternity Shooting Stars SVG streaks */}
      {!prefersReducedMotion && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {SHOOTING_STARS.map((s) => (
              <linearGradient
                key={s.id}
                id={`shooting-star-grad-${s.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={s.colorEnd} stopOpacity="0" />
                <stop offset="65%" stopColor={s.colorStart} stopOpacity="0.65" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>

          {SHOOTING_STARS.map((s) => (
            <motion.line
              key={s.id}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={`url(#shooting-star-grad-${s.id})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 0.28, 0],
                pathOffset: [0, 0.72, 1],
                opacity: [0, 0.95, 0],
              }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                repeat: Infinity,
                repeatDelay: s.repeatDelay,
                ease: 'easeOut',
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
};
