import type { Portfolio2DTheme } from '../ui/aceternity/CosmicSpotlight';

export interface Portfolio2DThemeTokens {
  shell: string;
  navBtn: string;
  nav3dBtn: string;
  themeBtn: string;
  heroDivider: string;
  avatarFrame: string;
  eyebrow: string;
  heading: string;
  subHeading: string;
  body: string;
  muted: string;
  accentAmber: string;
  accentIndigo: string;
  emailPill: string;
  cardBorder: string;
  cardDivider: string;
  tagAmber: string;
  tagNeutral: string;
  tagCyan: string;
  tagIndigo: string;
  verifiedBadge: string;
  verifyLink: string;
  worldCard: string;
  iconLink: string;
  certAvatarFallback: string;
  certTextAmber: string;
  sectionDivider: string;
}

export const PORTFOLIO_2D_THEMES: Record<Portfolio2DTheme, Portfolio2DThemeTokens> = {
  dark: {
    shell: 'bg-space-void text-slate-100',
    navBtn:
      'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-white/10',
    nav3dBtn:
      'bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30',
    themeBtn:
      'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-white/10',
    heroDivider: 'border-white/10',
    avatarFrame: 'border-white/10',
    eyebrow: 'text-cyan-400',
    heading: 'text-white',
    subHeading: 'text-amber-400',
    body: 'text-slate-300',
    muted: 'text-slate-400',
    accentAmber: 'text-amber-400',
    accentIndigo: 'text-indigo-400',
    emailPill: 'text-slate-200 hover:text-white',
    cardBorder: 'border-white/10',
    cardDivider: 'border-white/5',
    tagAmber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    tagNeutral: 'bg-white/5 text-slate-300 border-white/5',
    tagCyan: 'bg-cyan-950/40 text-cyan-200 border-cyan-500/20',
    tagIndigo: 'bg-indigo-950/40 text-indigo-200 border-indigo-500/20',
    verifiedBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    verifyLink:
      'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20 hover:text-white',
    worldCard: 'bg-white/5 border-white/5',
    iconLink: 'text-slate-400 hover:text-white',
    certAvatarFallback: 'bg-amber-500/10 border-amber-500/30',
    certTextAmber: 'text-amber-300',
    sectionDivider: 'border-white/10',
  },
  light: {
    shell: 'portfolio-2d-light bg-slate-50 text-slate-900',
    navBtn:
      'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-100',
    nav3dBtn:
      'bg-amber-500 text-slate-950 border-amber-500 hover:bg-amber-400 font-semibold',
    themeBtn:
      'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-100',
    heroDivider: 'border-slate-200',
    avatarFrame: 'border-slate-200',
    eyebrow: 'text-cyan-700',
    heading: 'text-slate-900',
    subHeading: 'text-amber-700',
    body: 'text-slate-700',
    muted: 'text-slate-500',
    accentAmber: 'text-amber-600',
    accentIndigo: 'text-indigo-600',
    emailPill: 'text-slate-800 hover:text-slate-950',
    cardBorder: 'border-slate-200/80',
    cardDivider: 'border-slate-200/70',
    tagAmber: 'bg-amber-100 text-amber-800 border-amber-200',
    tagNeutral: 'bg-slate-100 text-slate-700 border-slate-200',
    tagCyan: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    tagIndigo: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    verifiedBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    verifyLink:
      'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 hover:text-amber-950',
    worldCard: 'bg-white/75 border-slate-200/80 shadow-sm',
    iconLink: 'text-slate-500 hover:text-slate-900',
    certAvatarFallback: 'bg-amber-50 border-amber-200',
    certTextAmber: 'text-amber-700',
    sectionDivider: 'border-slate-200',
  },
};
