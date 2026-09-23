import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { useModuleStore, MODULE_SIZE_MAP } from '@shared/hooks/useModuleStore';
import { useThemeStore } from '@shared/hooks/useThemeStore';
import { LicenseContext } from '@app/App';
import { LicenseModal } from '@shared/components/ui/LicenseModal';
import { db } from '@shared/config/firebase';
import { ref, get } from 'firebase/database';

const PACK_IDS = new Set(['c', 'cpp', 'java', 'dsa', 'ml', 'networking', 'javascript', 'sql', 'oops']);

function isVersionNewer(remote?: string, local?: string): boolean {
  if (!remote || !local) return false;
  if (remote === local) return false;
  const rParts = remote.split('.').map(n => parseInt(n, 10) || 0);
  const lParts = local.split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(rParts.length, lParts.length); i++) {
    const r = rParts[i] ?? 0;
    const l = lParts[i] ?? 0;
    if (r > l) return true;
    if (r < l) return false;
  }
  return false;
}

type CategoryFilter = 'all' | 'languages' | 'dsa' | 'core';

const CATEGORY_MAP: Record<string, CategoryFilter> = {
  python: 'languages',
  java: 'languages',
  c: 'languages',
  cpp: 'languages',
  javascript: 'languages',
  dsa: 'dsa',
  ml: 'core',
  networking: 'core',
  sql: 'core',
  oops: 'core',
};

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'languages', label: 'Languages' },
  { id: 'dsa', label: 'DSA' },
  { id: 'core', label: 'Core CS' },
];

/* =========================================================
   MODULE DATA
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
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="pyBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#387eb8" />
            <stop offset="100%" stopColor="#296396" />
          </linearGradient>
          <linearGradient id="pyYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd43b" />
            <stop offset="100%" stopColor="#f5b800" />
          </linearGradient>
        </defs>
        {/* Top Blue Snake */}
        <path
          fill="url(#pyBlueGrad)"
          d="M63.6 14c-20.5 0-19.2 8.9-19.2 8.9l.1 9.2h19.5v2.8H24.5S13 33.6 13 54.3c0 20.7 10 20.1 10 20.1h6v-8.4c0-9.6 8.5-9.6 8.5-9.6h19.3c8.9 0 8.5-8.2 8.5-8.2V22.8S67.1 14 63.6 14zm-10 6.6c2 0 3.6 1.6 3.6 3.6s-1.6 3.6-3.6 3.6-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6z"
        />
        {/* Bottom Yellow Snake */}
        <path
          fill="url(#pyYellowGrad)"
          d="M64.4 114c20.5 0 19.2-8.9 19.2-8.9l-.1-9.2H64V93.1h39.5s11.5 1.3 11.5-19.4c0-20.7-10-20.1-10-20.1h-6v8.4c0 9.6-8.5 9.6-8.5 9.6H51.2c-8.9 0-8.5 8.2-8.5 8.2v25.4s-1.8 8.8 21.7 8.8zm10-6.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z"
        />
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
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
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
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
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
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
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
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="dsaRootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="dsaLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="dsaRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        {/* Connecting branches */}
        <path d="M64 26 L34 60 M64 26 L94 60 M34 60 L18 96 M34 60 L50 96 M94 60 L78 96 M94 60 L110 96" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <path d="M64 26 L34 60" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M64 26 L94 60" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 60 L18 96" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 60 L50 96" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
        <path d="M94 60 L78 96" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M94 60 L110 96" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        
        {/* Root Node */}
        <circle cx="64" cy="26" r="14" fill="url(#dsaRootGrad)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="64" cy="26" r="5" fill="#ffffff" />

        {/* Level 1 Nodes */}
        <circle cx="34" cy="60" r="11" fill="url(#dsaLeftGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="34" cy="60" r="4" fill="#ffffff" />
        <circle cx="94" cy="60" r="11" fill="url(#dsaRightGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="94" cy="60" r="4" fill="#ffffff" />

        {/* Leaf Nodes */}
        <circle cx="18" cy="96" r="8" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="50" cy="96" r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="78" cy="96" r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="110" cy="96" r="8" fill="#34d399" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    enabled: true,
    creator: 'AI & Data Science',
    year: 'Modern',
    tagline: 'Visual Models, Neural Nets & Intuitive Playgrounds.',
    topics: 11,
    programs: 11,
    accentColor: '#06b6d4',
    accentGlow: 'rgba(6,182,212,0.22)',
    accentBorder: 'rgba(6,182,212,0.38)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="mlInputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="mlHiddenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="mlOutputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        {/* Synapse Lines */}
        <line x1="24" y1="36" x2="64" y2="24" stroke="#334155" strokeWidth="2.5" />
        <line x1="24" y1="36" x2="64" y2="64" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
        <line x1="24" y1="36" x2="64" y2="104" stroke="#334155" strokeWidth="1.5" />
        <line x1="24" y1="92" x2="64" y2="24" stroke="#334155" strokeWidth="1.5" />
        <line x1="24" y1="92" x2="64" y2="64" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
        <line x1="24" y1="92" x2="64" y2="104" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
        
        <line x1="64" y1="24" x2="104" y2="44" stroke="#a855f7" strokeWidth="2" opacity="0.8" />
        <line x1="64" y1="24" x2="104" y2="84" stroke="#334155" strokeWidth="1.5" />
        <line x1="64" y1="64" x2="104" y2="44" stroke="#a855f7" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="104" y2="84" stroke="#a855f7" strokeWidth="2.5" />
        <line x1="64" y1="104" x2="104" y2="44" stroke="#334155" strokeWidth="1.5" />
        <line x1="64" y1="104" x2="104" y2="84" stroke="#a855f7" strokeWidth="2" opacity="0.8" />

        {/* Input Layer */}
        <circle cx="24" cy="36" r="10" fill="url(#mlInputGrad)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="24" cy="92" r="10" fill="url(#mlInputGrad)" stroke="#ffffff" strokeWidth="2.5" />

        {/* Hidden Layer */}
        <circle cx="64" cy="24" r="11" fill="url(#mlHiddenGrad)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="64" cy="64" r="12" fill="url(#mlHiddenGrad)" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="64" cy="104" r="11" fill="url(#mlHiddenGrad)" stroke="#ffffff" strokeWidth="2.5" />

        {/* Output Layer */}
        <circle cx="104" cy="44" r="10" fill="url(#mlOutputGrad)" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="104" cy="84" r="10" fill="url(#mlOutputGrad)" stroke="#ffffff" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'networking',
    name: 'Computer Networks',
    enabled: true,
    creator: 'ARPANET / IETF',
    year: 'Core',
    tagline: 'Protocols, Packet Flow, Routing & Layer Architecture.',
    topics: 8,
    programs: 8,
    accentColor: '#0ea5e9',
    accentGlow: 'rgba(14,165,233,0.20)',
    accentBorder: 'rgba(14,165,233,0.38)',
    Icon: () => (
      <svg viewBox="0 0 128 128" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="cnRouterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="cnNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        {/* Ring backbone */}
        <circle cx="64" cy="64" r="42" fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle cx="64" cy="64" r="42" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 6" />

        {/* Bus connectors */}
        <line x1="64" y1="22" x2="64" y2="64" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="100" y1="44" x2="64" y2="64" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="100" y1="84" x2="64" y2="64" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="64" y1="106" x2="64" y2="64" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="28" y1="84" x2="64" y2="64" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="28" y1="44" x2="64" y2="64" stroke="#38bdf8" strokeWidth="2.5" />

        {/* Host / Switch Nodes */}
        <circle cx="64" cy="22" r="7" fill="url(#cnNodeGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="100" cy="44" r="7" fill="url(#cnNodeGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="100" cy="84" r="7" fill="url(#cnNodeGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="64" cy="106" r="7" fill="url(#cnNodeGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="28" cy="84" r="7" fill="url(#cnNodeGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="28" cy="44" r="7" fill="url(#cnNodeGrad)" stroke="#ffffff" strokeWidth="2" />

        {/* Central Gateway Router */}
        <circle cx="64" cy="64" r="16" fill="url(#cnRouterGrad)" stroke="#ffffff" strokeWidth="3" />
        <path d="M58 64h12 M64 58v12 M59 59l10 10 M59 69l10-10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
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
  const licenseContext = useContext(LicenseContext);
  const { isLight } = useThemeStore();
  const [showLicensePrompt, setShowLicensePrompt] = useState(false);
  const { moduleStatus, downloadProgress, installedVersions, init, installModule } = useModuleStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [manualRemoteVersions, setManualRemoteVersions] = useState<Record<string, string>>({});

  const remoteModuleVersions: Record<string, string> = licenseContext?.settings?.moduleVersions || {};

  const handleCheckUpdate = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      const versionsRef = ref(db, 'global_settings/moduleVersions');
      const snap = await get(versionsRef);
      if (snap.exists()) {
        const val = snap.val() as Record<string, string>;
        if (val) {
          setManualRemoteVersions(prev => ({ ...prev, ...val }));
        }
      }
    } catch (err) {
      console.warn('Update check failed:', err);
    }
  }, []);

  useEffect(() => { init(); }, [init]);

  // Automatic internet check: runs on initial mount & automatically whenever internet connects
  useEffect(() => {
    if (navigator.onLine) {
      handleCheckUpdate();
    }
    const handleOnline = () => {
      handleCheckUpdate();
    };
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [handleCheckUpdate]);

  const rawTier = licenseContext?.trialInfo?.isTrialActive
    ? 'enterprise'
    : (licenseContext?.activated
      ? (licenseContext?.licenseDetails?.tier?.toLowerCase() || 'community')
      : 'community');

  const activeTier = (rawTier === 'developer' || rawTier === 'standard' || rawTier === 'professional')
    ? 'professional'
    : (rawTier === 'ultimate' || rawTier === 'enterprise')
    ? 'enterprise'
    : (rawTier === 'free' || rawTier === 'community')
    ? 'community'
    : rawTier;

  const isModuleLockedForTier = (moduleKey: string) => {
    // 1. Dynamic override from Admin Settings if configured
    const tierAccess = licenseContext?.settings?.tierAccess?.[activeTier] || licenseContext?.settings?.tierAccess?.[rawTier];
    if (tierAccess) {
      const key = moduleKey === 'javascript' ? ('js' in tierAccess ? 'js' : 'javascript') : moduleKey;
      if (typeof tierAccess[key] === 'boolean') {
        return !tierAccess[key];
      }
    }

    // 2. Default fallbacks
    if (activeTier === 'community' || activeTier === 'free') {
      return moduleKey !== 'python';
    }
    if (activeTier === 'professional') {
      if (moduleKey === 'ml' || moduleKey === 'networking') return true;
      return false;
    }
    return false;
  };

  const filteredLanguages = useMemo(() => {
    if (selectedCategory === 'all') return languages;
    return languages.filter(l => CATEGORY_MAP[l.id] === selectedCategory);
  }, [selectedCategory]);

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full relative">
      <div className="flex flex-col items-center pt-4 md:pt-6 pb-12 px-4 min-h-full relative z-10">

        {/* Top Bar: Title on left, Filters in right corner */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Curriculum Modules
            </h1>
            <p className={`text-xs mt-0.5 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Select a module to start step-by-step visual execution.
            </p>
          </div>

          {/* Right Corner Filter: Clean tabs with Micro-Animation and TreadCode Indigo Blue */}
          <div className={`relative inline-flex items-center p-1 border rounded-xs shrink-0 gap-1 self-start sm:self-auto transition-colors ${
            isLight ? 'bg-slate-200/90 border-slate-300' : 'bg-[#10141e] border-[#263145]'
          }`}>
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative h-6.5 px-3 text-xs rounded-[4px] cursor-pointer flex items-center justify-center font-bold transition-colors duration-150 z-10 select-none ${
                    isActive
                      ? 'text-white'
                      : isLight
                        ? 'text-slate-700 hover:text-slate-950'
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterBubble"
                      className="absolute inset-0 rounded-[4px]"
                      style={{
                        background: '#2563eb',
                        boxShadow: 'none',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 max-w-5xl w-full mx-auto pb-12">
          {filteredLanguages.map((lang, index) => {
            const Icon = lang.Icon;
            const isLangEnabled = Boolean(lang.enabled || licenseContext?.settings?.enabledModules?.[lang.id]);
            const isPack = PACK_IDS.has(lang.id);
            const status = isPack ? (moduleStatus[lang.id] || 'not_installed') : 'installed';
            const isInstalled = !isPack || status === 'installed';
            const isDownloading = status === 'downloading';
            const isError = status === 'error';
            const progress = downloadProgress[lang.id] || 0;
            const sizeText = MODULE_SIZE_MAP[lang.id] || '';
            const isLocked = isModuleLockedForTier(lang.id);

            const remoteVer = manualRemoteVersions[lang.id] || remoteModuleVersions[lang.id];
            const installedVer = installedVersions[lang.id] || (isInstalled ? '1.0.0' : undefined);
            const hasUpdate = isPack && isInstalled && !isDownloading && Boolean(remoteVer && installedVer && isVersionNewer(remoteVer, installedVer));

            const handleCardClick = () => {
              if (!isLangEnabled) return;
              if (isLocked) {
                setShowLicensePrompt(true);
                return;
              }
              if (isInstalled) {
                navigate(`/topics/${lang.id}`);
              } else if (!isDownloading) {
                installModule(lang.id);
              }
            };

            return (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
              >
                <div
                  role={isLangEnabled ? 'button' : 'region'}
                  tabIndex={isLangEnabled ? 0 : -1}
                  aria-label={
                    !isLangEnabled
                      ? `${lang.name} — Coming Soon`
                      : !isInstalled
                        ? `${lang.name} — Click to install (${sizeText})`
                        : `Select ${lang.name}`
                  }
                  onClick={handleCardClick}
                  onKeyDown={e => {
                    if (isLangEnabled && (e.key === 'Enter' || e.key === ' ')) {
                      handleCardClick();
                    }
                  }}
                  className="relative flex flex-col justify-between overflow-hidden rounded-lg transition-all duration-200 min-h-60 p-5 group select-none"
                  style={{
                    background: !isLangEnabled
                      ? (isLight ? '#e2e8f0' : '#07080c')
                      : !isInstalled
                        ? (isLight ? '#f8fafc' : '#080a0e')
                        : (isLight ? '#ffffff' : '#0b0d13'),
                    border: `1px solid ${
                      !isLangEnabled
                        ? (isLight ? '#cbd5e1' : '#141720')
                        : !isInstalled
                          ? (isLight ? '#cbd5e1' : '#181c26')
                          : (isLight ? '#cbd5e1' : '#1e2433')
                    }`,
                    boxShadow: isLight
                      ? '0 1px 3px 0 rgba(15, 23, 42, 0.10), 0 4px 14px -2px rgba(15, 23, 42, 0.08)'
                      : 'none',
                    cursor: !isLangEnabled ? 'default' : 'pointer',
                    opacity: !isLangEnabled ? 0.5 : !isInstalled ? 0.7 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!isLangEnabled) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-2px)';
                    if (isInstalled) {
                      el.style.backgroundColor = isLight ? '#ffffff' : '#11141d';
                      el.style.borderColor = lang.accentColor || '#4f46e5';
                      el.style.boxShadow = isLight
                        ? '0 14px 28px -4px rgba(15, 23, 42, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.08)'
                        : '0 10px 28px -4px rgba(0, 0, 0, 0.85)';
                    } else {
                      el.style.opacity = '0.9';
                      el.style.borderColor = isLight ? '#94a3b8' : '#262e40';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isLangEnabled) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.backgroundColor = !isInstalled ? (isLight ? '#f8fafc' : '#080a0e') : (isLight ? '#ffffff' : '#0b0d13');
                    el.style.boxShadow = isLight
                      ? '0 1px 3px 0 rgba(15, 23, 42, 0.10), 0 4px 14px -2px rgba(15, 23, 42, 0.08)'
                      : 'none';
                    el.style.borderColor = !isInstalled ? (isLight ? '#cbd5e1' : '#181c26') : (isLight ? '#cbd5e1' : '#1e2433');
                    el.style.opacity = !isInstalled ? '0.7' : '1';
                  }}
                >
                  {/* Top-Attached Status Tag / Badge (Solid, Non-glass, Anchored to Top Edge) */}
                  <div className="absolute top-0 right-4 z-20">
                    {!isLangEnabled ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-x border-b rounded-b-md shadow-xs ${
                        isLight ? 'text-slate-600 bg-slate-200 border-slate-300' : 'text-slate-300 bg-[#1c2333] border-[#2d3852]'
                      }`}>
                        <Lock className="w-2.5 h-2.5" />
                        Soon
                      </span>
                    ) : isLocked ? (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-b-md shadow-xs"
                        style={
                          lang.id === 'ml' || lang.id === 'networking'
                            ? (isLight
                                ? { color: '#6b21a8', background: '#f3e8ff', borderLeft: '1px solid #d8b4fe', borderRight: '1px solid #d8b4fe', borderBottom: '1px solid #d8b4fe' }
                                : { color: '#f3e8ff', background: '#3b1261', borderLeft: '1px solid #5b2194', borderRight: '1px solid #5b2194', borderBottom: '1px solid #5b2194' })
                            : (isLight
                                ? { color: '#9a3412', background: '#ffedd5', borderLeft: '1px solid #fed7aa', borderRight: '1px solid #fed7aa', borderBottom: '1px solid #fed7aa' }
                                : { color: '#fef3c7', background: '#452205', borderLeft: '1px solid #783e08', borderRight: '1px solid #783e08', borderBottom: '1px solid #783e08' })
                        }
                      >
                        <Lock className="w-2.5 h-2.5" />
                        {lang.id === 'ml' || lang.id === 'networking' ? 'Enterprise' : 'Professional'}
                      </span>
                    ) : hasUpdate ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installModule(lang.id, remoteVer);
                        }}
                        title={`Update to v${remoteVer}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold tracking-wide transition-all cursor-pointer text-slate-950 bg-amber-400 hover:bg-amber-300 border-x border-b border-amber-300 rounded-b-md shadow-sm active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
                        <span>Update</span>
                        {sizeText && <span className="text-[10px] font-mono text-slate-900">({sizeText})</span>}
                      </button>
                    ) : isInstalled ? (
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-x border-b rounded-b-md shadow-xs ${
                        isLight
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-300 font-extrabold'
                          : 'text-emerald-200 bg-[#065f46] border-[#047857]'
                      }`}>
                        Available
                      </span>
                    ) : isDownloading ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-x border-b rounded-b-md shadow-xs ${
                        isLight
                          ? 'text-sky-800 bg-sky-100 border-sky-300'
                          : 'text-sky-200 bg-[#0a3854] border-[#0e5682]'
                      }`}>
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        {progress > 0 ? `${progress}%` : 'Starting'}
                      </span>
                    ) : isError ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installModule(lang.id);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-x border-b rounded-b-md cursor-pointer shadow-xs ${
                          isLight
                            ? 'text-rose-800 bg-rose-100 hover:bg-rose-200 border-rose-300'
                            : 'text-rose-200 bg-[#4c131a] hover:bg-[#5c1820] border-[#781f2b]'
                        }`}
                      >
                        <AlertCircle className="w-2.5 h-2.5" />
                        Retry
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installModule(lang.id);
                        }}
                        title={`Download ${lang.name} module`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-b-md shadow-sm border-x border-b border-blue-500 cursor-pointer transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-white" />
                        <span>Download</span>
                        {sizeText && <span className="text-[10px] font-mono text-blue-200">({sizeText})</span>}
                      </button>
                    )}
                  </div>

                  {/* Right Side Featured Logo: Prominent & Clean */}
                  <div
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 pointer-events-none transition-transform duration-300 flex items-center justify-center shrink-0 group-hover:scale-105"
                    style={{
                      opacity: !isInstalled ? 0.40 : 1,
                    }}
                  >
                    <Icon />
                  </div>

                  {/* Language Info */}
                  <div className="relative z-10 pt-3 pr-32 mt-auto">
                    <h2 className={`text-2xl font-bold mb-1 tracking-tight transition-colors ${
                      isLight ? 'text-slate-950 group-hover:text-indigo-600' : 'text-white group-hover:text-blue-300'
                    }`}>
                      {lang.name}
                    </h2>

                    <p className={`text-xs font-medium mb-3 line-clamp-1 transition-colors ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      {lang.tagline}
                    </p>

                    {/* On-card Progress Bar when downloading */}
                    {isDownloading && (
                      <div className="mb-3 pt-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-sky-400 mb-1 font-semibold">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            Downloading pack...
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded overflow-hidden border ${
                          isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-slate-700/60'
                        }`}>
                          <motion.div
                            className="h-full bg-blue-500 rounded"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.max(progress, 5)}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* On-card hint when not installed and idle */}
                    {!isInstalled && !isDownloading && !isError && lang.enabled && (
                      <div className={`mb-3 flex items-center gap-1.5 text-[11px] font-mono ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        <Download className="w-3 h-3" />
                        <span>Click card or Download</span>
                      </div>
                    )}
                  </div>

                  {/* Meta Footer */}
                  <div className={`relative z-10 text-xs font-mono border-t pt-2.5 mt-2 flex items-center justify-between transition-colors ${
                    isLight ? 'border-slate-300/80 text-slate-600' : 'border-[#232f42] text-slate-400'
                  }`}>
                    <span>
                      By{' '}
                      <strong className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {lang.creator}
                      </strong>
                    </span>
                    <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      {lang.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showLicensePrompt && (
        <LicenseModal
          onActivate={licenseContext?.handleActivate || (async () => false)}
          onClose={() => setShowLicensePrompt(false)}
        />
      )}
    </PageTransition>
  );
};
