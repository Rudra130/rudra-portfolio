import React, { useState } from 'react';
import { ArrowLeft, Download, Mail, ExternalLink, Award, GraduationCap, Code2, Briefcase, Sparkles, Database, Utensils, Brain, CheckCircle2 } from 'lucide-react';
import { useUniverseStore } from '../../store/useUniverseStore';
import { worldsData } from '../../data/worlds';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';

export const WorldDrawer: React.FC = () => {
  const { activeWorldId, closeDrawer, activeTab, setActiveTab } = useUniverseStore();
  const [projectCategory, setProjectCategory] = useState<string>('All');

  if (!activeWorldId) return null;

  const world = worldsData.find((w) => w.id === activeWorldId) || worldsData[0];

  return (
    <>
      {/* Floating Return Button at Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={closeDrawer}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-amber-400/50 hover:bg-slate-900/90 shadow-2xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono tracking-wider uppercase">Back to Universe</span>
        </button>
      </div>

      {/* Main Right-Side Glassmorphic Drawer / Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-30 w-full lg:w-[58%] xl:w-[52%] glass-panel overflow-y-auto px-6 sm:px-10 py-20 flex flex-col justify-start animate-fade-in border-l border-white/10">
        {/* World Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl" style={{ color: world.color }}>
              {world.symbol}
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              {world.sanskritName}
            </h2>
          </div>

          <h3
            className="text-base sm:text-lg font-display font-medium tracking-wide mb-3"
            style={{ color: world.color }}
          >
            {world.englishTitle}
          </h3>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            {world.description}
          </p>
        </div>

        {/* Dynamic Content based on active World */}
        {activeWorldId === 'surya' && (
          <div className="space-y-6">
            {/* Tabs for Surya */}
            <div className="flex items-center gap-6 border-b border-white/10 pb-3 text-xs font-mono uppercase tracking-wider">
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
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-amber-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/10">
                  <img
                    src="/assets/user-photos/profile/profile-main.webp"
                    alt={profileData.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0"
                    onError={(e) => {
                      // Fallback if webp fails to render
                      (e.target as HTMLImageElement).src = '/assets/user-photos/profile/profile-main.jpg';
                    }}
                  />

                  <div className="flex flex-col text-center sm:text-left flex-1">
                    <h4 className="text-xl font-display font-bold text-white mb-1">
                      {profileData.name}
                    </h4>
                    <p className="text-xs font-mono text-amber-400/90 mb-3 tracking-wide">
                      {profileData.titles.join(' | ')}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-5">
                      {profileData.summary}
                    </p>

                    {/* Stats Trio */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-left">
                        <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-200">
                            {profileData.education.degree} {profileData.education.major.split(' ')[0]}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {profileData.education.college.split(' ')[0]} College
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
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={profileData.resumePath}
                    download="Rudra_Tiwari_Resume.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_28px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </a>

                  <a
                    href={`mailto:${profileData.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-pill text-slate-200 font-medium text-xs uppercase tracking-wider hover:text-white hover:border-white/30 transition-all"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>
            )}

            {/* Biography Tab */}
            {activeTab === 'Biography' && (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-body glass-card p-6 border border-white/10">
                <p>
                  I am a Software Engineer and Computer Science graduate (Class of 2026) from <strong>ABES Engineering College / AKTU</strong> with a CGPA of <strong>8.02/10</strong>.
                </p>
                <p>
                  My engineering journey spans production backend engineering at <strong>Salescode AI</strong>, where I built microservices for authentication, OAuth 2.0 / SSO adopted across 10 services, and OpenTelemetry observability pipelines.
                </p>
                <p>
                  Beyond production systems, I have solved over <strong>1,200 algorithmic problems</strong> (600+ on LeetCode with an <strong>1812 rating</strong>), earned the prestigious <strong>National Means-cum-Merit Scholarship</strong>, and continuously push the envelope in Generative AI and autonomous agent architectures.
                </p>
              </div>
            )}

            {/* Resume Tab */}
            {activeTab === 'Resume' && (
              <div className="glass-card p-6 border border-white/10 space-y-4 text-center">
                <h4 className="text-lg font-display font-semibold text-white">Curriculum Vitae</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Download the complete verified curriculum vitae of Rudra Tiwari detailing production engineering at Salescode AI, AI projects, certifications, and academic achievements.
                </p>
                <a
                  href={profileData.resumePath}
                  download="Rudra_Tiwari_Resume.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-slate-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </a>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'Contact' && (
              <div className="glass-card p-6 border border-white/10 space-y-4">
                <h4 className="text-lg font-display font-semibold text-white">Let's Connect</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  I'm always open to discussing distributed systems architectures, Generative AI agent workflows, and software engineering opportunities.
                </p>
                <div className="space-y-3 pt-2">
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
                    <span>linkedin.com/in/rudra-tiwari</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mangal: Projects Panel */}
        {activeWorldId === 'mangal' && (
          <div className="space-y-6">
            {/* Filter Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'AI / ML', 'Full-Stack', 'Systems', 'Tooling'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                    projectCategory === cat
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsData
                .filter((p) => projectCategory === 'All' || p.category === projectCategory)
                .map((proj) => (
                  <div
                    key={proj.id}
                    className="glass-card p-5 border border-white/10 flex flex-col justify-between group hover:border-red-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                          {proj.iconType === 'database' && <Database className="w-4 h-4" />}
                          {proj.iconType === 'cutlery' && <Utensils className="w-4 h-4" />}
                          {proj.iconType === 'brain' && <Brain className="w-4 h-4" />}
                          {proj.iconType === 'code' && <Code2 className="w-4 h-4" />}
                        </div>

                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View GitHub"
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <h4 className="text-base font-display font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {proj.description}
                      </p>
                    </div>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                      {proj.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Budh: Intelligence Network (Skills & DSA) */}
        {activeWorldId === 'budh' && (
          <div className="space-y-6">
            {/* DSA Metric Spotlight */}
            <div className="glass-card p-6 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-transparent">
              <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-300 mb-2">
                Problem-Solving & Algorithms
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div>
                  <p className="text-2xl font-display font-bold text-white">600+</p>
                  <p className="text-[11px] font-mono text-slate-400">LeetCode Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-amber-400">1812</p>
                  <p className="text-[11px] font-mono text-slate-400">LeetCode Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-white">1,200+</p>
                  <p className="text-[11px] font-mono text-slate-400">Total Solved</p>
                </div>
              </div>
            </div>

            {/* Skills Matrix */}
            <div className="space-y-4">
              {profileData.skills.map((group) => (
                <div key={group.category} className="glass-card p-4 border border-white/5">
                  <p className="text-xs font-mono uppercase text-slate-400 mb-2.5 tracking-wider">
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
            </div>
          </div>
        )}

        {/* Guru: Knowledge & Wisdom */}
        {activeWorldId === 'guru' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-amber-500/20 space-y-4">
              <div className="flex items-start gap-4">
                <GraduationCap className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-display font-bold text-white">
                    {profileData.education.degree} in {profileData.education.major}
                  </h4>
                  <p className="text-xs font-mono text-amber-400 mb-1">
                    {profileData.education.college} | {profileData.education.university}
                  </p>
                  <p className="text-xs text-slate-400">
                    {profileData.education.location} • {profileData.education.duration} • CGPA:{' '}
                    <span className="text-white font-semibold">{profileData.education.cgpa}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border border-amber-500/20 space-y-3">
              <h4 className="text-sm font-mono uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> National Honor
              </h4>
              <p className="text-sm font-display font-semibold text-white">
                National Means-cum-Merit Scholarship Recipient
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Awarded prestigious merit-based national scholarship in recognition of exceptional academic achievement and analytical competence.
              </p>
            </div>

            <div className="space-y-3">
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
                      <p className="text-xs font-semibold text-white">{cert.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{cert.issuer}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shani: Timeline of Karma */}
        {activeWorldId === 'shani' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-stone-500/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-display font-bold text-white">
                  {profileData.experience.role}
                </h4>
                <span className="text-xs font-mono text-amber-400">
                  {profileData.experience.duration}
                </span>
              </div>
              <p className="text-xs font-mono text-stone-300 mb-4">
                {profileData.experience.company} • {profileData.experience.location}
              </p>

              <div className="space-y-3">
                {profileData.experience.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rahu: Frontier of Innovation */}
        {activeWorldId === 'rahu' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-indigo-500/30 space-y-4">
              <h4 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Autonomous AI Agents & Generative AI
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exploring multi-agent reasoning using <strong>LangGraph</strong>, fast structured inference via <strong>NVIDIA NIM</strong>, and production failure analysis using <strong>Spring AI</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs font-semibold text-indigo-300 mb-1">Agentic Workflows</p>
                  <p className="text-[11px] text-slate-400">Multi-stage LangGraph graphs with deterministic validation steps.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs font-semibold text-indigo-300 mb-1">RAG & Vector Stores</p>
                  <p className="text-[11px] text-slate-400">Contextual database schema grounding and contextual failure logging.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chandra: Inner Universe */}
        {activeWorldId === 'chandra' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-slate-400/30 space-y-3">
              <h4 className="text-lg font-display font-bold text-white flex items-center gap-2">
                🏆 College Cricket Tournament Champion
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Captaincy, pressure composure, and team coordination. Winning the tournament at ABES Engineering College taught lessons in tactical agility that apply directly to engineering sprints.
              </p>
            </div>
            <div className="glass-card p-6 border border-slate-400/30 space-y-2">
              <h4 className="text-sm font-mono uppercase text-slate-300">Campus Leadership</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Event leadership experience in the <strong>Technovation Club</strong> organizing tech hackathons and campus engineering workshops.
              </p>
            </div>
          </div>
        )}

        {/* Shukra: Creativity & Aesthetics */}
        {activeWorldId === 'shukra' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-pink-500/30 space-y-3">
              <h4 className="text-lg font-display font-bold text-white">
                Cosmic Minimalist Design System
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bridging deep astronomical visualization with clean, high-performance UI components. Engineered using custom Tailwind tokens, glassmorphic blur physics, and 60 FPS Three.js rendering.
              </p>
            </div>
          </div>
        )}

        {/* Ketu: Space of Reflection */}
        {activeWorldId === 'ketu' && (
          <div className="space-y-6">
            <div className="glass-card p-6 border border-teal-500/30 space-y-4">
              <h4 className="text-lg font-display font-bold text-white">
                Philosophy of Engineering
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                *"Code is transient; clean architecture and reliable systems endure."*
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solving 1,200+ algorithmic problems taught me patience with complex states. Deploying microservices across 10 lines of business taught me discipline and empathy for engineers consuming my APIs.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
