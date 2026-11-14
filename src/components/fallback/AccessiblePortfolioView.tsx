import React from 'react';
import { Download, ExternalLink, Mail, Award, GraduationCap, Briefcase, Eye } from 'lucide-react';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { worldsData } from '../../data/worlds';
import { useUniverseStore } from '../../store/useUniverseStore';

export const AccessiblePortfolioView: React.FC = () => {
  const { toggleFallback2D } = useUniverseStore();

  return (
    <div className="relative min-h-screen bg-space-void text-slate-100 px-6 sm:px-12 py-24 max-w-5xl mx-auto">
      {/* Return to 3D Banner */}
      <div className="fixed top-4 right-6 z-50">
        <button
          onClick={toggleFallback2D}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-mono uppercase tracking-wider hover:bg-amber-500/30 shadow-xl transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>Switch to 3D Universe</span>
        </button>
      </div>

      {/* Hero Header */}
      <section className="mb-16 text-center sm:text-left border-b border-white/10 pb-12">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
          2D Accessible Portfolio
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-bold text-white mb-2">
          {profileData.name}
        </h1>
        <p className="text-base sm:text-lg font-mono text-amber-400 mb-4">
          {profileData.titles.join(' | ')}
        </p>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
          {profileData.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={profileData.resumePath}
            download="Rudra_Tiwari_Resume.pdf"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume (PDF)</span>
          </a>

          <a
            href={`mailto:${profileData.email}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass-pill text-xs font-mono text-slate-200 hover:text-white transition-all"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>{profileData.email}</span>
          </a>
        </div>
      </section>

      {/* Experience Section (Shani) */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" /> Work Experience
        </h2>
        <div className="glass-card p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{profileData.experience.role}</h3>
            <span className="text-xs font-mono text-amber-400">{profileData.experience.duration}</span>
          </div>
          <p className="text-xs font-mono text-slate-400 mb-4">
            {profileData.experience.company} • {profileData.experience.location}
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {profileData.experience.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Projects Section (Mangal) */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-red-400">♂</span> Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.map((project) => (
            <div key={project.id} className="glass-card p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {project.category}
                  </span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2">{project.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                {project.technologies.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Problem Solving (Budh) */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Skills & Algorithms
        </h2>
        <div className="glass-card p-6 border border-white/10 mb-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">LeetCode & Problem Solving</p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-display font-bold text-white">600+</p>
              <p className="text-xs text-slate-400 font-mono">LeetCode Solved</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-amber-400">1812</p>
              <p className="text-xs text-slate-400 font-mono">Contest Rating</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-white">1,200+</p>
              <p className="text-xs text-slate-400 font-mono">Total Solved Across Platforms</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileData.skills.map((grp) => (
            <div key={grp.category} className="glass-card p-4 border border-white/5">
              <h3 className="text-xs font-mono uppercase text-slate-400 mb-2">{grp.category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {grp.skills.map((s) => (
                  <span key={s} className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-950/40 text-cyan-200 border border-cyan-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Certifications (Guru) */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400" /> Education & Honors
        </h2>
        <div className="space-y-4">
          <div className="glass-card p-6 border border-white/10">
            <h3 className="text-base font-display font-bold text-white">
              {profileData.education.degree} in {profileData.education.major}
            </h3>
            <p className="text-xs font-mono text-amber-400 mb-1">
              {profileData.education.college} | {profileData.education.university}
            </p>
            <p className="text-xs text-slate-400">
              {profileData.education.location} • {profileData.education.duration} • CGPA: {profileData.education.cgpa}
            </p>
          </div>

          <div className="glass-card p-6 border border-white/10">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-1">
              <Award className="w-4 h-4" /> National Means-cum-Merit Scholarship
            </div>
            <p className="text-xs text-slate-300">
              National merit scholarship awarded in recognition of academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* 9 Grahas Guide */}
      <section className="pt-8 border-t border-white/10">
        <h2 className="text-xl font-display font-semibold text-white mb-4">
          The 9 Celestial Dimensions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {worldsData.map((w) => (
            <div key={w.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span style={{ color: w.color }}>{w.symbol}</span>
                <span>{w.sanskritName}</span>
              </p>
              <p className="text-[11px] font-mono text-slate-400">{w.theme}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
