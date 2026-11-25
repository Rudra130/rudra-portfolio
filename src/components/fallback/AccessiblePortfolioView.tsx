import React from 'react';
import {
  Download,
  ExternalLink,
  Mail,
  Award,
  GraduationCap,
  Briefcase,
  Eye,
  Home,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { worldsData } from '../../data/worlds';
import { useUniverseStore } from '../../store/useUniverseStore';
import { CosmicSpotlight } from '../ui/aceternity/CosmicSpotlight';
import { StarsBackground } from '../ui/aceternity/StarsBackground';

export const AccessiblePortfolioView: React.FC = () => {
  const { setFallback2D, enterUniverse, returnToLanding } = useUniverseStore();

  return (
    <div className="relative min-h-screen w-full bg-space-void text-slate-100 overflow-x-hidden">
      {/* Aceternity UI Cosmic Background (Spotlight + Beams + Twinkling Stars & Shooting Stars) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <CosmicSpotlight />
        <StarsBackground />
      </div>

      {/* Top Navigation Banner */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
        <button
          onClick={returnToLanding}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-mono uppercase tracking-wider hover:bg-white/10 shadow-xl transition-all cursor-pointer"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setFallback2D(false);
            enterUniverse();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs font-mono uppercase tracking-wider hover:bg-amber-500/30 shadow-xl transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Switch to 3D Portfolio</span>
        </button>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-6 sm:px-12 py-24 max-w-5xl mx-auto">

      {/* Hero Header */}
      <section className="mb-16 border-b border-white/10 pb-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-300 opacity-40 blur-sm group-hover:opacity-75 transition duration-300" />
          <img
            src={profileData.avatarPath || '/assets/user-photos/profile/profile-main.webp'}
            alt={profileData.name}
            className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl object-cover object-center shadow-2xl border border-white/10"
          />
        </div>

        <div className="text-center sm:text-left flex-1">
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

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
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

          {/* Verified Industry Certifications */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-amber-300">
              Verified Industry Certifications
            </h3>
            {profileData.certifications.map((cert) => (
              <div
                key={cert.name}
                className="glass-card p-6 border border-white/10 space-y-3 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    {cert.badgeImage ? (
                      <img
                        src={cert.badgeImage}
                        alt={cert.name}
                        className="w-14 h-14 object-contain shrink-0 rounded-full bg-white/5 p-1 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-amber-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-display font-bold text-white">
                        {cert.name}
                      </h4>
                      <p className="text-xs font-mono text-amber-400">
                        {cert.issuer} {cert.issueDate && `• Issued ${cert.issueDate}`} {cert.validUntil && `• Valid until ${cert.validUntil}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      ✓ {cert.status}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20 hover:text-white transition-all cursor-pointer"
                        title="Verify official Oracle University badge"
                      >
                        <span>Verify Badge</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      </a>
                    )}
                  </div>
                </div>

                {cert.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generative AI & Autonomous Agents (Rahu) */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" /> Generative AI & Autonomous Agents
        </h2>
        <div className="glass-card p-6 border border-indigo-500/30 space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              'LangGraph',
              'Advanced RAG',
              'AI Guardrails',
              'OpenAI SDK',
              'Model Context Protocol (MCP)',
              'Google Agentic Dev Kit',
              'NVIDIA NIM',
            ].map((t) => (
              <span
                key={t}
                className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-950/40 text-indigo-200 border border-indigo-500/20"
              >
                {t}
              </span>
            ))}
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">LangGraph Multi-Agent Workflows:</strong> Built stateful cyclic graphs with conditional edge branching, reflection loops, self-correction nodes, and human-in-the-loop checkpoints.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Advanced Hybrid RAG:</strong> Engineered hybrid retrieval (dense vector embeddings + BM25 keyword search via Reciprocal Rank Fusion) with hierarchical parent-document chunking and cross-encoder semantic re-ranking.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">AI Safety & Guardrails:</strong> Configured NeMo Guardrails principles for prompt injection defense, automated PII sanitization, and output factuality checks against ground truth context.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">OpenAI SDK & Tool Calling:</strong> Implemented structured function calling, parallel tool executions, SSE streaming, and deterministic Pydantic schema decoding.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Model Context Protocol (MCP) & Google Agentic Kit:</strong> Built standardized MCP tool servers exposing filesystems, databases, and APIs over JSON-RPC, integrated with Google Agentic tools and Oracle certifications.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Celestial Dimensions Guide */}
      <section className="pt-8 border-t border-white/10">
        <h2 className="text-xl font-display font-semibold text-white mb-4">
          The Celestial Dimensions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {worldsData.map((w) => (
            <div key={w.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span style={{ color: w.color }}>{w.symbol}</span>
                <span>{w.realWorldIdentity}</span>
              </p>
              <p className="text-[11px] font-mono text-slate-400">{w.theme}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};
