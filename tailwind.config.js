/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          void: '#030508',
          obsidian: '#080c16',
          slate: '#0d1424',
          card: 'rgba(13, 20, 36, 0.7)',
        },
        celestial: {
          surya: '#f59e0b',
          chandra: '#cbd5e1',
          mangal: '#ef4444',
          budh: '#06b6d4',
          guru: '#d97706',
          shukra: '#ec4899',
          shani: '#a8a29e',
          rahu: '#6366f1',
          ketu: '#14b8a6',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Cinzel', 'serif', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.4)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.4)',
        'glow-crimson': '0 0 25px rgba(239, 68, 68, 0.4)',
        'glow-purple': '0 0 25px rgba(99, 102, 241, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
