import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Mail,
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Database,
  Utensils,
  Brain,
  CheckCircle2,
  Code,
} from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { useUniverseStore } from '../../store/useUniverseStore';
import { worldsData } from '../../data/worlds';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';

export const WorldDrawer: React.FC = () => {
  const { activeWorldId, cameraMode, closeDrawer, activeTab, setActiveTab } =
    useUniverseStore();
  const [projectCategory, setProjectCategory] = useState<string>('All');

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const world =
    worldsData.find((w) => w.id === activeWorldId) || worldsData[0];

  // Motion variants for glassmorphic drawer panel
  const drawerPanelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: prefersReduced ? 50 : 26,
        stiffness: prefersReduced ? 300 : 260,
      },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.25,
        ease: 'easeIn' as const,
      },
    },
  };

  // Staggered cascade container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.07,
        delayChildren: prefersReduced ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 24,
        stiffness: 260,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 22,
        stiffness: 240,
      },
    },
  };

  if (!activeWorldId) return null;

  return (
    <>
      {/* 1. Cinematic Approach Telemetry Overlay (Requirement 8) */}
      <AnimatePresence>
        {cameraMode === 'APPROACHING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between items-center"
          >
            {/* Top Letterbox Bar */}
            <div className="w-full h-8 sm:h-12 bg-slate-950/85 backdrop-blur-sm border-b border-white/10" />

            {/* Central Navigation Telemetry Banner */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.35)] mb-14"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse" style={{ color: world.color }}>
                  {world.symbol}
                </span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                    Approaching Celestial Dimension
                  </span>
                  <span className="text-sm font-display font-bold text-white tracking-wide">
                    {world.realWorldIdentity}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bottom Letterbox Bar */}
            <div className="w-full h-8 sm:h-12 bg-slate-950/85 backdrop-blur-sm border-t border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Prominent Top-Left Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={closeDrawer}
          className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-200 hover:text-white hover:border-amber-400 hover:bg-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Return to Solar System Overview (Esc)"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-display font-medium tracking-wide">
            Back to Overview
          </span>
        </button>
      </div>

      {/* 3. Floating Return Button at Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={closeDrawer}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-900/90 shadow-2xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-300 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-body tracking-wide">Back to Overview</span>
        </button>
      </div>

      {/* 4. Main Right-Side Glassmorphic Panel with Staggered Framer Motion Animations */}
      <AnimatePresence mode="wait">
        {activeWorldId && (
          <motion.div
            key={activeWorldId}
            variants={drawerPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-30 w-full lg:w-[62%] xl:w-[58%] glass-panel overflow-y-auto px-6 sm:px-12 py-20 flex flex-col justify-start border-l border-white/10"
          >
            {/* World Header with Staggered Motion */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-6 relative"
            >
              <button
                onClick={closeDrawer}
                className="absolute top-0 right-0 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Close and return to overview (Esc)"
              >
                <span className="text-xl leading-none">✕</span>
              </button>

              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-1 pr-10">
                <span className="text-2xl" style={{ color: world.color }}>
                  {world.symbol}
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  {world.realWorldIdentity}
                </h2>
              </motion.div>

              <motion.h3
                variants={itemVariants}
                className="text-sm sm:text-base font-display font-medium tracking-wide mb-3"
                style={{ color: world.color }}
              >
                {world.theme}
              </motion.h3>

              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed"
              >
                {world.description}
              </motion.p>
            </motion.div>

            {/* 1. SURYA: THE CORE IDENTITY */}
            {activeWorldId === 'surya' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Tabs for Surya */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-7 border-b border-white/10 pb-2.5 text-xs font-body"
                >
                  {['Overview', 'Biography', 'Resume', 'Contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-1 transition-all relative ${
                        activeTab === tab
                          ? 'text-amber-400 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-[-11px] left-0 right-0 h-[2px] bg-amber-400 rounded-full" />
                      )}
                    </button>
                  ))}
                </motion.div>

                {/* Overview Tab Content */}
                {activeTab === 'Overview' && (
                  <motion.div variants={itemVariants} className="space-y-5">
                    {/* Profile Card */}
                    <div className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 border border-white/10 shadow-2xl">
                      {/* Portrait photo of Rudra Tiwari */}
                      <img
                        src="/assets/user-photos/profile/profile-main.webp"
                        alt={profileData.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/assets/user-photos/profile/profile-main.jpg';
                        }}
                      />

                      <div className="flex flex-col text-center sm:text-left flex-1">
                        <h4 className="text-xl font-display font-bold text-white mb-0.5">
                          {profileData.name}
                        </h4>
                        <p className="text-xs font-body text-slate-300 mb-2.5">
                          {profileData.titles.join(' | ')}
                        </p>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
                          {profileData.summary}
                        </p>

                        {/* Stats Trio */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2 text-left">
                            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <p className="text-[11px] font-semibold text-slate-200">
                                {profileData.education.degree}{' '}
                                {profileData.education.major.split(' ')[0]}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {profileData.education.college}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-left">
                            <Award className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <p className="text-[11px] font-semibold text-slate-200">
                                {profileData.metrics.cgpa}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                (Graduating Jul 2026)
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-left">
                            <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <p className="text-[11px] font-semibold text-slate-200">
                                {profileData.metrics.experienceMonths}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Software Engineering
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <a
                        href={profileData.resumePath}
                        download="Rudra_Tiwari_Resume.pdf"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-xs tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_28px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>Download Resume</span>
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={`mailto:${profileData.email}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-200 font-medium text-xs tracking-wide hover:bg-slate-800/80 hover:text-white transition-all"
                      >
                        <span>Get in Touch</span>
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* Biography Tab */}
                {activeTab === 'Biography' && (
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-body glass-card p-6 border border-white/10"
                  >
                    <p>
                      I am a Software Engineer and Computer Science graduate from{' '}
                      <strong>
                        ABES Engineering College / Dr. A.P.J. Abdul Kalam Technical
                        University
                      </strong>{' '}
                      with a CGPA of <strong>8.02/10</strong>.
                    </p>
                    <p>
                      My engineering experience includes production software
                      engineering at <strong>Salescode AI</strong> (Gurugram,
                      India), where I engineered microservices and REST APIs for
                      authentication, OAuth 2.0 / SSO adopted across 10 services,
                      and OpenTelemetry observability pipelines.
                    </p>
                    <p>
                      Beyond production systems, I have solved over{' '}
                      <strong>1,200 algorithmic problems</strong> (600+ on
                      LeetCode with an <strong>1812 rating</strong>), earned the
                      prestigious <strong>National Means-cum-Merit Scholarship</strong>,
                      and continuously build AI agent workflows using LangGraph and
                      NVIDIA NIM.
                    </p>
                  </motion.div>
                )}

                {/* Resume Tab */}
                {activeTab === 'Resume' && (
                  <motion.div
                    variants={itemVariants}
                    className="glass-card p-6 border border-white/10 space-y-4 text-center"
                  >
                    <h4 className="text-base font-display font-semibold text-white">
                      Curriculum Vitae
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Download the complete verified curriculum vitae of Rudra
                      Tiwari detailing production engineering at Salescode AI, AI
                      projects, certifications, and academic achievements.
                    </p>
                    <a
                      href={profileData.resumePath}
                      download="Rudra_Tiwari_Resume.pdf"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-semibold text-xs tracking-wide hover:bg-amber-400 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Document</span>
                    </a>
                  </motion.div>
                )}

                {/* Contact Tab */}
                {activeTab === 'Contact' && (
                  <motion.div
                    variants={itemVariants}
                    className="glass-card p-6 border border-white/10 space-y-4"
                  >
                    <h4 className="text-base font-display font-semibold text-white">
                      Direct Outreach
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Open for software engineering opportunities, AI architectures,
                      and technical collaborations.
                    </p>
                    <div className="space-y-3 pt-1">
                      <a
                        href={`mailto:${profileData.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-slate-200 text-xs font-mono transition-all"
                      >
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>{profileData.email}</span>
                      </a>
                      <a
                        href={profileData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-slate-200 text-xs font-mono transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-amber-400" />
                        <span>linkedin.com/in/rudratiwari1306</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 2. MANGAL: THE WORLD OF ACTION */}
            {activeWorldId === 'mangal' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Filter Category Pills */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap items-center gap-2.5"
                >
                  {['All', 'AI / ML', 'Full-Stack', 'Systems', 'Tooling'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setProjectCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-body transition-all ${
                          projectCategory === cat
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </motion.div>

                {/* Project Cards (Grid with Hover Depth & Elevation - Requirements 13 & 14) */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {projectsData
                    .filter((p) => {
                      if (projectCategory === 'All') return true;
                      return p.category
                        .toLowerCase()
                        .includes(projectCategory.toLowerCase());
                    })
                    .map((project) => (
                      <motion.div
                        key={project.id}
                        variants={cardVariants}
                        whileHover={
                          prefersReduced
                            ? undefined
                            : {
                                y: -6,
                                scale: 1.02,
                                boxShadow:
                                  '0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(239, 68, 68, 0.25)',
                                transition: {
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 25,
                                },
                              }
                        }
                        whileTap={{ scale: 0.98 }}
                        className="glass-card p-5 border border-white/10 flex flex-col justify-between group hover:border-red-500/40 hover:bg-slate-900/80 transition-all duration-300 cursor-default"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                              {project.iconType === 'database' && (
                                <Database className="w-4 h-4" />
                              )}
                              {project.iconType === 'brain' && (
                                <Brain className="w-4 h-4" />
                              )}
                              {project.iconType === 'cutlery' && (
                                <Utensils className="w-4 h-4" />
                              )}
                              {project.iconType === 'code' && (
                                <Code className="w-4 h-4" />
                              )}
                              {![
                                'database',
                                'brain',
                                'cutlery',
                                'code',
                              ].includes(project.iconType) && (
                                <Code className="w-4 h-4" />
                              )}
                            </div>
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-white transition-colors p-1"
                              title="View on GitHub"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <h4 className="text-sm font-display font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                            {project.tagline}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                          {project.technologies.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-mono text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </motion.div>

                {/* Direct GitHub Profile Link Banner */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-white/10 gap-3 mt-2"
                >
                  <div className="flex items-center gap-2.5">
                    <GithubIcon className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        GitHub Repositories (@Rudra130)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Browse all 26 public repositories, algorithms, and AI
                        agent architectures.
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://github.com/Rudra130"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs hover:brightness-110 shadow-lg transition-all"
                  >
                    <span>github.com/Rudra130</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* 3. BUDH: INTELLIGENCE NETWORK */}
            {activeWorldId === 'budh' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-transparent"
                >
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2">
                    Problem-Solving & Algorithms
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                    <div>
                      <p className="text-2xl font-display font-bold text-white">
                        600+
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        LeetCode Solved
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-amber-400">
                        1812
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        Contest Rating
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-white">
                        1,200+
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        Total Solved
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  {profileData.skills.map((group) => (
                    <div
                      key={group.category}
                      className="glass-card p-4 border border-white/5"
                    >
                      <p className="text-[11px] font-mono uppercase text-slate-400 mb-2 tracking-wider">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-200 text-xs font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* 4. GURU: KNOWLEDGE & WISDOM */}
            {activeWorldId === 'guru' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-amber-500/20 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-base font-display font-bold text-white">
                        {profileData.education.degree} in{' '}
                        {profileData.education.major}
                      </h4>
                      <p className="text-xs font-body text-amber-400 mb-1">
                        {profileData.education.college} |{' '}
                        {profileData.education.university}
                      </p>
                      <p className="text-xs text-slate-400">
                        {profileData.education.location} •{' '}
                        {profileData.education.duration} • CGPA:{' '}
                        <span className="text-white font-semibold">
                          {profileData.education.cgpa}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-amber-500/20 space-y-2"
                >
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> National Honor
                  </h4>
                  <p className="text-sm font-display font-semibold text-white">
                    National Means-cum-Merit Scholarship Recipient
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Awarded prestigious merit-based national scholarship in
                    recognition of high academic achievement.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Industry Certifications
                  </p>
                  {profileData.certifications.map((cert) => (
                    <div
                      key={cert.name}
                      className="glass-card p-4 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {cert.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {cert.status}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* 5. SHANI: TIMELINE OF KARMA */}
            {activeWorldId === 'shani' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-stone-500/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-display font-bold text-white">
                      {profileData.experience.role}
                    </h4>
                    <span className="text-xs font-mono text-amber-400">
                      {profileData.experience.duration}
                    </span>
                  </div>
                  <p className="text-xs font-body text-stone-300 mb-4">
                    {profileData.experience.company} •{' '}
                    {profileData.experience.location}
                  </p>

                  <div className="space-y-3">
                    {profileData.experience.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed"
                      >
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 6. RAHU: FRONTIER OF INNOVATION */}
            {activeWorldId === 'rahu' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-indigo-500/30 space-y-4"
                >
                  <h4 className="text-base font-display font-semibold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" /> Autonomous AI
                    Agents & Generative AI
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Exploring multi-agent reasoning using{' '}
                    <strong>LangGraph</strong>, fast structured inference via{' '}
                    <strong>NVIDIA NIM</strong>, and production failure analysis
                    using <strong>Spring AI</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs font-semibold text-indigo-300 mb-1">
                        Agentic Workflows
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Multi-stage LangGraph graphs with schema validation.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs font-semibold text-indigo-300 mb-1">
                        RAG & Vector Stores
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Contextual database schema grounding and failure logging.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 7. CHANDRA: INNER UNIVERSE */}
            {activeWorldId === 'chandra' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-slate-400/30 space-y-3"
                >
                  <h4 className="text-base font-display font-bold text-white flex items-center gap-2">
                    🏆 College Cricket Tournament Champion
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Captaincy, pressure composure, and team coordination.
                    Winning the tournament at ABES Engineering College taught
                    lessons in tactical agility that apply directly to
                    engineering sprints.
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* 8. SHUKRA: CREATIVITY & AESTHETICS */}
            {activeWorldId === 'shukra' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-pink-500/30 space-y-3"
                >
                  <h4 className="text-base font-display font-bold text-white">
                    Cosmic Minimalist Design System
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Bridging deep astronomical visualization with clean,
                    high-performance UI components. Engineered using custom
                    Tailwind tokens, glassmorphic blur physics, and 60 FPS Three.js
                    rendering.
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* 9. KETU: SPACE OF REFLECTION */}
            {activeWorldId === 'ketu' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                <motion.div
                  variants={itemVariants}
                  className="glass-card p-6 border border-teal-500/30 space-y-4"
                >
                  <h4 className="text-base font-display font-bold text-white">
                    Philosophy of Engineering
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    “Code is transient; clean architecture and reliable systems
                    endure.”
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Solving 1,200+ algorithmic problems taught me patience with
                    complex states. Deploying microservices across 10 lines of
                    business taught me discipline and empathy for engineers
                    consuming my APIs.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
