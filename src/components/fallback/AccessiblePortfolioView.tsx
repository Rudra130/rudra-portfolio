import React, { useState } from 'react';
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
  Sun,
  Moon,
} from 'lucide-react';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { worldsData } from '../../data/worlds';
import { useUniverseStore } from '../../store/useUniverseStore';
import { CosmicSpotlight, Portfolio2DTheme } from '../ui/aceternity/CosmicSpotlight';
import { StarsBackground } from '../ui/aceternity/StarsBackground';
import { PORTFOLIO_2D_THEMES } from './portfolio2dTheme';

const STORAGE_KEY_2D_THEME = 'portfolio-2d-theme';

function getInitial2DTheme(): Portfolio2DTheme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY_2D_THEME);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (err) {
    console.warn('Unable to read 2D portfolio theme preference from storage:', err);
  }
  return 'dark';
}

export const AccessiblePortfolioView: React.FC = () => {
  const { setFallback2D, enterUniverse, returnToLanding } = useUniverseStore();
  const [theme, setTheme] = useState<Portfolio2DTheme>(getInitial2DTheme);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Portfolio2DTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY_2D_THEME, next);
      } catch (err) {
        console.warn('Unable to persist 2D portfolio theme preference:', err);
      }
      return next;
    });
  };

  const t = PORTFOLIO_2D_THEMES[theme];
  const isLight = theme === 'light';

  return (
    <div
      data-2d-theme={theme}
      className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${t.shell}`}
    >
      {/* Aceternity UI Cosmic Background (Spotlight + Beams + Twinkling Stars & Shooting Stars) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <CosmicSpotlight theme={theme} />
        <StarsBackground theme={theme} />
      </div>

      {/* Top Navigation Banner */}
      <div className="fixed top-4 right-6 z-50 flex flex-wrap items-center justify-end gap-2.5">
        <button
          onClick={toggleTheme}
          aria-label={isLight ? 'Switch 2D portfolio to dark mode' : 'Switch 2D portfolio to light mode'}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-xs font-mono uppercase tracking-wider shadow-xl transition-all cursor-pointer ${t.themeBtn}`}
        >
          {isLight ? (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light</span>
            </>
          )}
        </button>

        <button
          onClick={returnToLanding}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-xs font-mono uppercase tracking-wider shadow-xl transition-all cursor-pointer ${t.navBtn}`}
        >
          <Home className={`w-4 h-4 ${t.accentAmber}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setFallback2D(false);
            enterUniverse();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-xs font-mono uppercase tracking-wider shadow-xl transition-all cursor-pointer ${t.nav3dBtn}`}
        >
          <Eye className="w-4 h-4" />
          <span>Switch to 3D Portfolio</span>
        </button>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-6 sm:px-12 py-24 max-w-5xl mx-auto">
        {/* Hero Header */}
        <section
          className={`mb-16 border-b pb-12 flex flex-col sm:flex-row items-center sm:items-start gap-8 ${t.heroDivider}`}
        >
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-300 opacity-40 blur-sm group-hover:opacity-75 transition duration-300" />
            <img
              src={profileData.avatarPath || '/assets/user-photos/profile/profile-main.webp'}
              alt={profileData.name}
              className={`relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl object-cover object-center shadow-2xl border ${t.avatarFrame}`}
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <span className={`text-xs font-mono uppercase tracking-widest block mb-2 ${t.eyebrow}`}>
              2D Accessible Portfolio
            </span>
            <h1 className={`text-4xl sm:text-6xl font-display font-bold mb-2 ${t.heading}`}>
              {profileData.name}
            </h1>
            <p className={`text-base sm:text-lg font-mono mb-4 ${t.subHeading}`}>
              {profileData.titles.join(' | ')}
            </p>
            <p className={`text-sm max-w-2xl leading-relaxed mb-6 ${t.body}`}>
              {profileData.summary}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <a
                href={profileData.resumePath}
                download="Rudra_Tiwari_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume (PDF)</span>
              </a>

              <a
                href={`mailto:${profileData.email}`}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass-pill text-xs font-mono transition-all ${t.emailPill}`}
              >
                <Mail className={`w-4 h-4 ${t.accentAmber}`} />
                <span>{profileData.email}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Experience Section (Shani) */}
        <section className="mb-16">
          <h2 className={`text-2xl font-display font-bold mb-6 flex items-center gap-2 ${t.heading}`}>
            <Briefcase className={`w-5 h-5 ${t.accentAmber}`} /> Work Experience
          </h2>
          <div className={`glass-card p-6 border ${t.cardBorder}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className={`text-lg font-bold ${t.heading}`}>{profileData.experience.role}</h3>
              <span className={`text-xs font-mono ${t.subHeading}`}>
                {profileData.experience.duration}
              </span>
            </div>
            <p className={`text-xs font-mono mb-4 ${t.muted}`}>
              {profileData.experience.company} • {profileData.experience.location}
            </p>
            <ul className={`space-y-2.5 text-xs ${t.body}`}>
              {profileData.experience.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={t.accentAmber}>•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Projects Section (Mangal) */}
        <section className="mb-16">
          <h2 className={`text-2xl font-display font-bold mb-6 flex items-center gap-2 ${t.heading}`}>
            <span className="text-red-500">♂</span> Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className={`glass-card p-6 border flex flex-col justify-between ${t.cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${t.tagAmber}`}
                    >
                      {project.category}
                    </span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={t.iconLink}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className={`text-base font-display font-bold mb-2 ${t.heading}`}>
                    {project.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-4 ${t.body}`}>
                    {project.description}
                  </p>
                </div>
                <div className={`flex flex-wrap gap-1.5 pt-3 border-t ${t.cardDivider}`}>
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${t.tagNeutral}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Problem Solving (Budh) */}
        <section className="mb-16">
          <h2 className={`text-2xl font-display font-bold mb-6 ${t.heading}`}>
            Skills & Algorithms
          </h2>
          <div className={`glass-card p-6 border mb-6 ${t.cardBorder}`}>
            <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${t.eyebrow}`}>
              LeetCode & Problem Solving
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className={`text-3xl font-display font-bold ${t.heading}`}>600+</p>
                <p className={`text-xs font-mono ${t.muted}`}>LeetCode Solved</p>
              </div>
              <div>
                <p className={`text-3xl font-display font-bold ${t.subHeading}`}>1812</p>
                <p className={`text-xs font-mono ${t.muted}`}>Contest Rating</p>
              </div>
              <div>
                <p className={`text-3xl font-display font-bold ${t.heading}`}>1,200+</p>
                <p className={`text-xs font-mono ${t.muted}`}>Total Solved Across Platforms</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileData.skills.map((grp) => (
              <div key={grp.category} className={`glass-card p-4 border ${t.cardBorder}`}>
                <h3 className={`text-xs font-mono uppercase mb-2 ${t.muted}`}>{grp.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {grp.skills.map((s) => (
                    <span
                      key={s}
                      className={`text-xs font-mono px-2.5 py-1 rounded-full border ${t.tagCyan}`}
                    >
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
          <h2 className={`text-2xl font-display font-bold mb-6 flex items-center gap-2 ${t.heading}`}>
            <GraduationCap className={`w-5 h-5 ${t.accentAmber}`} /> Education & Honors
          </h2>
          <div className="space-y-4">
            <div className={`glass-card p-6 border ${t.cardBorder}`}>
              <h3 className={`text-base font-display font-bold ${t.heading}`}>
                {profileData.education.degree} in {profileData.education.major}
              </h3>
              <p className={`text-xs font-mono mb-1 ${t.subHeading}`}>
                {profileData.education.college} | {profileData.education.university}
              </p>
              <p className={`text-xs ${t.muted}`}>
                {profileData.education.location} • {profileData.education.duration} • CGPA:{' '}
                {profileData.education.cgpa}
              </p>
            </div>

            <div className={`glass-card p-6 border ${t.cardBorder}`}>
              <div className={`flex items-center gap-2 text-sm font-semibold mb-1 ${t.subHeading}`}>
                <Award className="w-4 h-4" /> National Means-cum-Merit Scholarship
              </div>
              <p className={`text-xs ${t.body}`}>
                National merit scholarship awarded in recognition of academic excellence.
              </p>
            </div>

            {/* Verified Industry Certifications */}
            <div className="space-y-4 pt-4">
              <h3 className={`text-sm font-mono uppercase tracking-wider ${t.certTextAmber}`}>
                Verified Industry Certifications
              </h3>
              {profileData.certifications.map((cert) => (
                <div
                  key={cert.name}
                  className={`glass-card p-6 border space-y-3 transition-colors ${t.cardBorder}`}
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
                        <div
                          className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${t.certAvatarFallback}`}
                        >
                          <CheckCircle2 className={`w-6 h-6 ${t.accentAmber}`} />
                        </div>
                      )}
                      <div>
                        <h4 className={`text-base font-display font-bold ${t.heading}`}>
                          {cert.name}
                        </h4>
                        <p className={`text-xs font-mono ${t.subHeading}`}>
                          {cert.issuer} {cert.issueDate && `• Issued ${cert.issueDate}`}{' '}
                          {cert.validUntil && `• Valid until ${cert.validUntil}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono px-3 py-1 rounded-full border ${t.verifiedBadge}`}
                      >
                        ✓ {cert.status}
                      </span>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${t.verifyLink}`}
                          title="Verify official Oracle University badge"
                        >
                          <span>Verify Badge</span>
                          <ExternalLink className={`w-3.5 h-3.5 ${t.accentAmber}`} />
                        </a>
                      )}
                    </div>
                  </div>

                  {cert.description && (
                    <p className={`text-xs leading-relaxed ${t.body}`}>{cert.description}</p>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cert.skills.map((s) => (
                        <span
                          key={s}
                          className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${t.tagNeutral}`}
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
          <h2 className={`text-2xl font-display font-bold mb-6 flex items-center gap-2 ${t.heading}`}>
            <Brain className={`w-5 h-5 ${t.accentIndigo}`} /> Generative AI & Autonomous Agents
          </h2>
          <div className={`glass-card p-6 border space-y-4 ${t.cardBorder}`}>
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                'LangGraph',
                'Advanced RAG',
                'AI Guardrails',
                'OpenAI SDK',
                'Model Context Protocol (MCP)',
                'Google Agentic Dev Kit',
                'NVIDIA NIM',
              ].map((tech) => (
                <span
                  key={tech}
                  className={`text-xs font-mono px-2.5 py-1 rounded-full border ${t.tagIndigo}`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <ul className={`space-y-2.5 text-xs ${t.body}`}>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${t.accentIndigo}`} />
                <div>
                  <strong className={t.heading}>LangGraph Multi-Agent Workflows:</strong> Built stateful cyclic graphs with conditional edge branching, reflection loops, self-correction nodes, and human-in-the-loop checkpoints.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${t.accentIndigo}`} />
                <div>
                  <strong className={t.heading}>Advanced Hybrid RAG:</strong> Engineered hybrid retrieval (dense vector embeddings + BM25 keyword search via Reciprocal Rank Fusion) with hierarchical parent-document chunking and cross-encoder semantic re-ranking.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${t.accentIndigo}`} />
                <div>
                  <strong className={t.heading}>AI Safety & Guardrails:</strong> Configured NeMo Guardrails principles for prompt injection defense, automated PII sanitization, and output factuality checks against ground truth context.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${t.accentIndigo}`} />
                <div>
                  <strong className={t.heading}>OpenAI SDK & Tool Calling:</strong> Implemented structured function calling, parallel tool executions, SSE streaming, and deterministic Pydantic schema decoding.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${t.accentIndigo}`} />
                <div>
                  <strong className={t.heading}>Model Context Protocol (MCP) & Google Agentic Kit:</strong> Built standardized MCP tool servers exposing filesystems, databases, and APIs over JSON-RPC, integrated with Google Agentic tools and Oracle certifications.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Celestial Dimensions Guide */}
        <section className={`pt-8 border-t ${t.sectionDivider}`}>
          <h2 className={`text-xl font-display font-semibold mb-4 ${t.heading}`}>
            The Celestial Dimensions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {worldsData.map((w) => (
              <div key={w.id} className={`p-3 rounded-xl border ${t.worldCard}`}>
                <p className={`text-xs font-bold flex items-center gap-1.5 ${t.heading}`}>
                  <span style={{ color: w.color }}>{w.symbol}</span>
                  <span>{w.realWorldIdentity}</span>
                </p>
                <p className={`text-[11px] font-mono ${t.muted}`}>{w.theme}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
