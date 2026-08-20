import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Lock } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { getLanguageStats } from '../lessons/registry';

/* =========================================================
   LANGUAGE DATA
   ========================================================= */
/* =========================================================
   LANGUAGE DATA
   ========================================================= */
const languages = [
  {
    id: 'python',
    name: 'Python',
    enabled: true,
    creator: 'Guido van Rossum',
    year: '1991',
    tagline: 'Simple. Powerful. Visual.',
    topics: 16,
    programs: 100,
    accentColor: '#3b82f6',
    accentGlow: 'rgba(59,130,246,0.20)',
    accentBorder: 'rgba(59,130,246,0.35)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#3776AB" d="M62.6 12C42.2 12 43.5 20.9 43.5 20.9l.1 9.2h19.5v2.8H23.5S12 31.6 12 52.3c0 20.7 10 20.1 10 20.1h6v-8.4c0-9.6 8.5-9.6 8.5-9.6h19.3c8.9 0 8.5-8.2 8.5-8.2V20.8S66.1 12 62.6 12zm-10 6.6c2 0 3.6 1.6 3.6 3.6s-1.6 3.6-3.6 3.6-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6z"/>
        <path fill="#FFD43B" d="M65.4 116c20.4 0 19.1-8.9 19.1-8.9l-.1-9.2H64.9V95.1h39.6s11.5 1.3 11.5-19.4c0-20.7-10-20.1-10-20.1h-6v8.4c0 9.6-8.5 9.6-8.5 9.6H52.2c-8.9 0-8.5 8.2-8.5 8.2v24.9s-1.8 8.8 21.7 8.8zm10-6.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z"/>
      </svg>
    ),
  },
  {
    id: 'java',
    name: 'Java',
    enabled: true,
    creator: 'James Gosling',
    year: '1995',
    tagline: 'Write once, run anywhere.',
    topics: 13,
    programs: 52,
    accentColor: '#f97316',
    accentGlow: 'rgba(249,115,22,0.20)',
    accentBorder: 'rgba(249,115,22,0.35)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#5382A1" d="M47 99.4c0 0-7.3 2-2.3 2.7 6.1.9 16.9.7 27.6-.8 7.3-1.1 15-2.9 15-2.9s-4.3 1.5-9.7 2.1c-13.8 1.6-30.8 1-30.6-1.1"/>
        <path fill="#5382A1" d="M42.2 86.8c0 0-8.2 2.3-2.6 3.1 7 1 19.3.9 31.7-.9 8.3-1.2 17.1-3.3 17.1-3.3s-4.9 1.7-11.1 2.4c-15.7 1.8-35.1 1.1-35.1-1.3"/>
        <path fill="#E76F00" d="M68 53c6.8 7.4-1.8 13.9-1.8 13.9s17.3-8.8 8.8-17.7c-7.2-7.5-13.5-12.7.7-25.2C75.7 24 61.2 45.6 68 53z"/>
        <path fill="#E76F00" d="M53.4 34.6c4.6 5-1.2 9.4-1.2 9.4s11.7-6 6-12c-4.9-5.1-9.1-8.6.5-17.1C58.6 15 48.8 29.6 53.4 34.6z"/>
        <path fill="#5382A1" d="M44.4 73c0 0 4.1 1.5 13.1.9 10.9-.7 19.8-3.9 19.8-3.9s-3.5 1.1-10.4 1.7c-11.3 1.1-22.5.3-22.5.3z"/>
      </svg>
    ),
  },
  {
    id: 'c',
    name: 'C',
    enabled: true,
    creator: 'Dennis Ritchie',
    year: '1972',
    tagline: 'The foundation of all systems.',
    topics: 13,
    programs: 45,
    accentColor: '#38bdf8',
    accentGlow: 'rgba(56,189,248,0.20)',
    accentBorder: 'rgba(56,189,248,0.35)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#283593" d="M117.5 35L64 4.1 10.5 35v61.8L64 127.9l53.5-30.9V35z"/>
        <path fill="#5C6BC0" d="M64 4.1v123.8l53.5-30.9V35L64 4.1z"/>
        <path fill="#FFFFFF" d="M65.7 40.5c-15.6 0-26.6 10.7-26.6 25.2 0 14.5 10.8 25.2 26.6 25.2 9.5 0 17.5-4.4 21.6-11.7l-9.9-5.7c-2.3 4.2-6.6 6.7-11.7 6.7-8.8 0-14.7-6.2-14.7-14.5 0-8.3 5.9-14.5 14.7-14.5 5.1 0 9.4 2.5 11.7 6.7l9.9-5.7c-4.1-7.3-12.1-11.7-21.6-11.7z"/>
      </svg>
    ),
  },
  {
    id: 'cpp',
    name: 'C++',
    enabled: true,
    creator: 'Bjarne Stroustrup',
    year: '1985',
    tagline: 'Power meets performance.',
    topics: 14,
    programs: 50,
    accentColor: '#818cf8',
    accentGlow: 'rgba(129,140,248,0.20)',
    accentBorder: 'rgba(129,140,248,0.35)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <path fill="#00599C" d="M117.5 35L64 4.1 10.5 35v61.8L64 127.9l53.5-30.9V35z"/>
        <path fill="#004482" d="M64 4.1v123.8l53.5-30.9V35L64 4.1z"/>
        <path fill="#FFFFFF" d="M53 43.5c-11.8 0-20.2 8.1-20.2 19.1 0 11 8.4 19.1 20.2 19.1 7.2 0 13.3-3.3 16.4-8.9l-7.5-4.3c-1.8 3.2-5 5.1-8.9 5.1-6.7 0-11.1-4.7-11.1-11 0-6.3 4.4-11 11.1-11 3.9 0 7.1 1.9 8.9 5.1l7.5-4.3c-3.1-5.6-9.2-8.9-16.4-8.9zm27.8 13.5v4.5h-4.5v3.6h4.5v4.5h3.6v-4.5h4.5v-3.6h-4.5v-4.5h-3.6zm18 0v4.5h-4.5v3.6h4.5v4.5h3.6v-4.5h4.5v-3.6h-4.5v-4.5h-3.6z"/>
      </svg>
    ),
  },
  {
    id: 'dsa',
    name: 'DSA',
    enabled: true,
    creator: 'Computer Science',
    year: 'Core',
    tagline: 'Data Structures & Algorithms.',
    topics: 19,
    programs: 21,
    accentColor: '#a855f7',
    accentGlow: 'rgba(168,85,247,0.22)',
    accentBorder: 'rgba(168,85,247,0.35)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="dsaBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id="dsaCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="dsaLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
          </linearGradient>
          <filter id="dsaGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Glow backdrop paths */}
        <path d="M64 18 L32 54 M64 18 L96 54 M32 54 L18 90 M32 54 L48 90 M96 54 L80 90 M96 54 L110 90 M48 90 L80 90" stroke="url(#dsaLineGrad)" strokeWidth="4.5" strokeLinecap="round" />
        
        {/* Additional Cross Mesh links */}
        <path d="M32 54 L96 54" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.7" />

        {/* Glowing Outer Rings */}
        <circle cx="64" cy="18" r="16" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.6" />
        <circle cx="32" cy="54" r="13" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
        <circle cx="96" cy="54" r="13" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />

        {/* Root Node */}
        <circle cx="64" cy="18" r="11" fill="url(#dsaBgGrad)" stroke="#ffffff" strokeWidth="2.5" filter="url(#dsaGlowFilter)" />
        <circle cx="64" cy="18" r="4" fill="#ffffff" />

        {/* Level 1 Nodes */}
        <circle cx="32" cy="54" r="9" fill="url(#dsaCyanGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="96" cy="54" r="9" fill="url(#dsaCyanGrad)" stroke="#ffffff" strokeWidth="2" />

        {/* Level 2 Nodes */}
        <circle cx="18" cy="90" r="7" fill="#e879f9" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="48" cy="90" r="7" fill="#818cf8" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="80" cy="90" r="7" fill="#818cf8" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="110" cy="90" r="7" fill="#e879f9" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'oops',
    name: 'OOPs',
    enabled: false,
    creator: 'Alan Kay',
    year: 'Paradigm',
    tagline: 'Classes, Objects, Inheritance & Polymorphism.',
    topics: 0,
    programs: 0,
    accentColor: '#10b981',
    accentGlow: 'rgba(16,185,129,0.12)',
    accentBorder: 'rgba(16,185,129,0.20)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <rect x="24" y="24" width="40" height="40" rx="8" fill="#10b981" opacity="0.8"/>
        <rect x="64" y="64" width="40" height="40" rx="8" fill="#34d399" opacity="0.9"/>
        <path d="M44 64v16h20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="44" cy="44" r="6" fill="#ffffff"/>
        <circle cx="84" cy="84" r="6" fill="#ffffff"/>
      </svg>
    ),
  },
  {
    id: 'sql',
    name: 'SQL & DB',
    enabled: false,
    creator: 'Edgar F. Codd',
    year: '1974',
    tagline: 'Relational Queries, Joins & Schemas.',
    topics: 0,
    programs: 0,
    accentColor: '#ec4899',
    accentGlow: 'rgba(236,72,153,0.12)',
    accentBorder: 'rgba(236,72,153,0.20)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <ellipse cx="64" cy="36" rx="40" ry="16" fill="#ec4899"/>
        <path d="M24 36v28c0 8.8 17.9 16 40 16s40-7.2 40-16V36" fill="none" stroke="#f472b6" strokeWidth="6"/>
        <path d="M24 64v28c0 8.8 17.9 16 40 16s40-7.2 40-16V64" fill="none" stroke="#fb7185" strokeWidth="6"/>
      </svg>
    ),
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    enabled: false,
    creator: 'Brendan Eich',
    year: '1995',
    tagline: 'The language of the web.',
    topics: 0,
    programs: 0,
    accentColor: '#eab308',
    accentGlow: 'rgba(234,179,8,0.12)',
    accentBorder: 'rgba(234,179,8,0.20)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <rect width="128" height="128" rx="16" fill="#F7DF1E"/>
        <path fill="#000000" d="M67.3 97.4c2.8 4.6 6.7 7.7 13.5 7.7 5.7 0 9.3-2.8 9.3-6.7 0-4.6-3.7-6.3-10-9l-3.5-1.5c-10.1-4.3-16.7-9.7-16.7-21 0-11.7 9.1-20.7 23.3-20.7 10.3 0 17.5 3.6 22.3 12.2l-10.8 6.9c-2.3-4.1-5.4-5.8-10.8-5.8-4.5 0-7.3 2.7-7.3 6 0 4.1 3 5.8 8.8 8.3l3.5 1.5c12.2 5.2 18.2 10.2 18.2 21.6 0 13.7-10.4 21.9-26.2 21.9-14.6 0-23.2-6.9-27.9-15.9l10.8-7zm-39.7 1.2c2.4 4.1 5.4 7.2 10.9 7.2 5.4 0 8.8-2.6 8.8-8.8V46.6h15.2v50.5c0 14.7-8.4 21.6-23.2 21.6-11.7 0-19.3-6-23.2-14.7l11.5-6.9z"/>
      </svg>
    ),
  },
];

/* =========================================================
   PAGE
   ========================================================= */
export const LanguageSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-80 bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="flex flex-col items-center pt-4 md:pt-6 pb-12 px-4 min-h-full relative z-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 bg-indigo-950/60 border border-indigo-400/40 text-white shadow-md backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Interactive Code Visualization Platform</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight text-white drop-shadow-sm">
            Choose a Language
          </h1>
          
          <p className="text-sm md:text-base text-slate-200 font-medium leading-normal whitespace-nowrap">
            Step-by-step interactive code execution and visualization platform.
          </p>
        </motion.div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl w-full mx-auto pb-12">
          {languages.map((lang, index) => {
            const Icon = lang.Icon;
            const stats = lang.enabled ? getLanguageStats(lang.id) : { topicsCount: lang.topics, programsCount: lang.programs };
            const topicsCount = stats.topicsCount || lang.topics;
            const programsCount = stats.programsCount || lang.programs;
            return (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
              >
                <div
                  role={lang.enabled ? 'button' : 'region'}
                  tabIndex={lang.enabled ? 0 : -1}
                  aria-label={lang.enabled ? `Select ${lang.name}` : `${lang.name} — Coming Soon`}
                  onClick={() => lang.enabled && navigate(`/topics/${lang.id}`)}
                  onKeyDown={e => { if (lang.enabled && (e.key === 'Enter' || e.key === ' ')) navigate(`/topics/${lang.id}`); }}
                  className="relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 min-h-64 p-6 group select-none"
                  style={{
                    background: 'rgba(12, 14, 22, 0.85)',
                    border: `1px solid ${lang.enabled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                    cursor: lang.enabled ? 'pointer' : 'default',
                    opacity: lang.enabled ? 1 : 0.4,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                  onMouseEnter={e => {
                    if (!lang.enabled) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = `0 12px 32px -8px ${lang.accentGlow}, 0 0 0 1px ${lang.accentBorder}`;
                    el.style.borderColor = lang.accentBorder;
                  }}
                  onMouseLeave={e => {
                    if (!lang.enabled) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                    el.style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                >
                  {/* Background Watermark Icon on right side of card */}
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 opacity-15 pointer-events-none group-hover:opacity-30 group-hover:scale-105 transition-all duration-500 flex items-center justify-center shrink-0">
                    <Icon />
                  </div>

                  {/* Top row: Icon + Badge */}
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div
                      className="w-13 h-13 rounded-2xl p-2.5 flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        background: lang.enabled ? `${lang.accentGlow}` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${lang.enabled ? lang.accentBorder : 'rgba(255,255,255,0.08)'}`,
                        filter: lang.enabled ? 'none' : 'grayscale(1)',
                      }}
                    >
                      <Icon />
                    </div>

                    {(lang.id === 'python' || lang.id === 'dsa') ? (
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        style={{ color: '#4ade80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Available
                      </span>
                    ) : lang.enabled ? (
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        In Progress 🚧
                      </span>
                    ) : (
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <Lock className="w-2.5 h-2.5" />
                        Soon
                      </span>
                    )}
                  </div>

                  {/* Language Info */}
                  <div className="relative mt-auto">
                    <h2 className="text-2xl font-black mb-1 tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                      {lang.name}
                    </h2>
                    
                    <p className="text-xs md:text-sm font-medium mb-4 line-clamp-1 text-slate-200">
                      {lang.tagline}
                    </p>

                    {/* Stats row for enabled languages */}
                    {lang.enabled && (
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="text-xs px-2.5 py-1 rounded-md font-mono font-bold text-white"
                          style={{ background: `${lang.accentGlow}`, border: `1px solid ${lang.accentBorder}` }}
                        >
                          {topicsCount} Topics
                        </div>
                        {lang.id !== 'dsa' && (
                          <div
                            className="text-xs px-2.5 py-1 rounded-md font-mono font-bold text-white"
                            style={{ background: `${lang.accentGlow}`, border: `1px solid ${lang.accentBorder}` }}
                          >
                            {programsCount} Programs
                          </div>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div
                      className="text-xs font-mono border-t pt-3 flex items-center justify-between text-slate-300"
                      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <span>By <strong className="font-bold text-white">{lang.creator}</strong></span>
                      <span className="font-bold text-white">{lang.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};
