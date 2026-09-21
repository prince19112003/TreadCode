import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { useModuleStore, MODULE_SIZE_MAP } from '@shared/hooks/useModuleStore';
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
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="mlCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="mlPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="mlSynapseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Neural Network Synapses */}
        <line x1="28" y1="36" x2="64" y2="28" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />
        <line x1="28" y1="36" x2="64" y2="64" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />
        <line x1="28" y1="36" x2="64" y2="100" stroke="url(#mlSynapseGrad)" strokeWidth="2" opacity="0.4" />
        <line x1="28" y1="92" x2="64" y2="28" stroke="url(#mlSynapseGrad)" strokeWidth="2" opacity="0.4" />
        <line x1="28" y1="92" x2="64" y2="64" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />
        <line x1="28" y1="92" x2="64" y2="100" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />

        <line x1="64" y1="28" x2="100" y2="48" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="100" y2="48" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="100" y2="80" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />
        <line x1="64" y1="100" x2="100" y2="80" stroke="url(#mlSynapseGrad)" strokeWidth="2.5" />

        {/* Input Layer Nodes */}
        <circle cx="28" cy="36" r="8" fill="url(#mlCyanGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="28" cy="92" r="8" fill="url(#mlCyanGrad)" stroke="#ffffff" strokeWidth="2" />

        {/* Hidden Layer Nodes */}
        <circle cx="64" cy="28" r="9" fill="url(#mlPurpleGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="64" cy="64" r="10" fill="url(#mlPurpleGrad)" stroke="#22d3ee" strokeWidth="2" />
        <circle cx="64" cy="100" r="9" fill="url(#mlPurpleGrad)" stroke="#ffffff" strokeWidth="2" />

        {/* Output Layer Nodes */}
        <circle cx="100" cy="48" r="8.5" fill="url(#mlCyanGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="100" cy="80" r="8.5" fill="url(#mlCyanGrad)" stroke="#ffffff" strokeWidth="2" />

        {/* Central Core Pulse */}
        <circle cx="64" cy="64" r="4" fill="#ffffff" />
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
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <defs>
          <linearGradient id="netCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="netLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Connection Ring */}
        <circle cx="64" cy="64" r="44" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />

        {/* Network Bus & Mesh Lines */}
        <line x1="64" y1="64" x2="64" y2="24" stroke="url(#netLineGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="102" y2="42" stroke="url(#netLineGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="102" y2="86" stroke="url(#netLineGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="64" y2="104" stroke="url(#netLineGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="26" y2="86" stroke="url(#netLineGrad)" strokeWidth="2.5" />
        <line x1="64" y1="64" x2="26" y2="42" stroke="url(#netLineGrad)" strokeWidth="2.5" />

        {/* Cross Interconnects */}
        <line x1="26" y1="42" x2="64" y2="24" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
        <line x1="64" y1="24" x2="102" y2="42" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
        <line x1="102" y1="42" x2="102" y2="86" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
        <line x1="102" y1="86" x2="64" y2="104" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
        <line x1="64" y1="104" x2="26" y2="86" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
        <line x1="26" y1="86" x2="26" y2="42" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />

        {/* Peripheral Client / Host Nodes */}
        <circle cx="64" cy="24" r="7" fill="url(#netCyanGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="102" cy="42" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="102" cy="86" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="64" cy="104" r="7" fill="url(#netCyanGrad)" stroke="#ffffff" strokeWidth="2" />
        <circle cx="26" cy="86" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="26" cy="42" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />

        {/* Data Packets in Flight */}
        <rect x="62" y="40" width="4" height="6" rx="1.5" fill="#38bdf8" />
        <rect x="80" y="50" width="6" height="4" rx="1.5" fill="#38bdf8" />
        <rect x="42" y="72" width="6" height="4" rx="1.5" fill="#38bdf8" />

        {/* Central Router Core */}
        <circle cx="64" cy="64" r="14" fill="#0c101d" stroke="#0ea5e9" strokeWidth="2.5" />
        <circle cx="64" cy="64" r="8" fill="url(#netCyanGrad)" />
        <circle cx="64" cy="64" r="3" fill="#ffffff" />
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
  const [showLicensePrompt, setShowLicensePrompt] = useState(false);
  const { moduleStatus, downloadProgress, installedVersions, init, installModule } = useModuleStore();

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

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full relative">
      <div className="flex flex-col items-center pt-4 md:pt-6 pb-12 px-4 min-h-full relative z-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-8 max-w-2xl mx-auto"
        >
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
              if (!isInstalled) {
                if (!isDownloading) {
                  installModule(lang.id);
                }
                return;
              }
              navigate(`/topics/${lang.id}`);
            };

            return (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
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
                  className="relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 min-h-64 p-6 group select-none"
                  style={{
                    background: !isLangEnabled
                      ? 'rgba(12, 14, 22, 0.5)'
                      : !isInstalled
                        ? 'rgba(13, 16, 24, 0.75)'
                        : 'rgba(12, 14, 22, 0.85)',
                    border: `1px solid ${
                      !isLangEnabled
                        ? 'rgba(255,255,255,0.05)'
                        : !isInstalled
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(255,255,255,0.12)'
                    }`,
                    cursor: !isLangEnabled
                      ? 'default'
                      : 'pointer',
                    opacity: !isLangEnabled ? 0.4 : 1,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                  onMouseEnter={e => {
                    if (!isLangEnabled) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = `0 12px 30px -10px ${lang.accentGlow}`;
                    el.style.borderColor = lang.accentBorder;
                  }}
                  onMouseLeave={e => {
                    if (!isLangEnabled) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                    el.style.borderColor = !isInstalled
                      ? 'rgba(255,255,255,0.07)'
                      : 'rgba(255,255,255,0.12)';
                  }}
                >
                  {/* Background Watermark Icon on right side of card */}
                  <div
                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none group-hover:scale-105 transition-all duration-500 flex items-center justify-center shrink-0"
                    style={{
                      opacity: !isInstalled ? 0.04 : 0.15,
                      filter: !isInstalled ? 'grayscale(1)' : 'none',
                    }}
                  >
                    <Icon />
                  </div>

                  {/* Top row: Icon + Action / Badge */}
                  <div className="relative z-10 flex justify-between items-start mb-5">
                    <div
                      className="w-13 h-13 rounded-2xl p-2.5 flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        background: !isInstalled
                          ? 'rgba(255,255,255,0.03)'
                          : lang.accentGlow,
                        border: `1px solid ${
                          !isInstalled
                            ? 'rgba(255,255,255,0.08)'
                            : lang.accentBorder
                        }`,
                        filter: !isInstalled ? 'grayscale(1)' : 'none',
                      }}
                    >
                      <Icon />
                    </div>

                    {/* Top Right Action / Badge */}
                    {!isLangEnabled ? (
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <Lock className="w-2.5 h-2.5" />
                        Soon
                      </span>
                    ) : isLocked ? (
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                        style={
                          lang.id === 'ml' || lang.id === 'networking'
                            ? { color: '#c084fc', background: 'rgba(192,132,252,0.12)', border: '1px solid rgba(192,132,252,0.35)' }
                            : { color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)' }
                        }
                      >
                        <Lock className="w-2.5 h-2.5" />
                        {lang.id === 'ml' || lang.id === 'networking' ? 'Enterprise' : 'Professional'}
                      </span>
                    ) : hasUpdate ? (
                      /* On-card Direct Update Button (replaces AVAILABLE when update is detected) */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installModule(lang.id, remoteVer);
                        }}
                        title={`New version v${remoteVer} available (Installed: v${installedVer}). Click to update now.`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 text-amber-300 bg-amber-500/20 border border-amber-500/45 hover:bg-amber-500/30 animate-pulse"
                      >
                        <RefreshCw className="w-3 h-3 text-amber-400" />
                        <span>Update</span>
                        {sizeText && (
                          <span className="text-[9px] font-mono text-amber-300/80">
                            ({sizeText})
                          </span>
                        )}
                      </button>
                    ) : isInstalled ? (
                      /* Clean Available badge (automatically turns into Update button when update is detected online) */
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full shrink-0"
                        style={{ color: '#4ade80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}
                      >
                        Available
                      </span>
                    ) : isDownloading ? (
                      /* Downloading state badge */
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0"
                        style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.35)' }}
                      >
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        {progress > 0 ? `${progress}%` : 'Starting'}
                      </span>
                    ) : isError ? (
                      /* Retry button on error */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installModule(lang.id);
                        }}
                        className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        style={{ color: '#f87171', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.35)' }}
                      >
                        <AlertCircle className="w-2.5 h-2.5" />
                        Retry
                      </button>
                    ) : (
                      /* On-card Direct Install Button */
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          installModule(lang.id);
                        }}
                        title={`Download ${lang.name} module`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 hover:border-indigo-400"
                      >
                        <Download className="w-3 h-3 text-indigo-400" />
                        <span>Download</span>
                        {sizeText && (
                          <span className="text-[9px] font-mono text-indigo-300/70">
                            ({sizeText})
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Language Info */}
                  <div className="relative mt-auto">
                    <h2
                      className="text-2xl font-black mb-1 tracking-tight transition-colors"
                      style={{
                        color: !isInstalled ? '#64748b' : 'white',
                      }}
                    >
                      {lang.name}
                    </h2>

                    <p
                      className="text-xs md:text-sm font-medium mb-3 line-clamp-1 transition-colors"
                      style={{
                        color: !isInstalled ? '#475569' : '#e2e8f0',
                      }}
                    >
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
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <motion.div
                            className="h-full bg-linear-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.max(progress, 5)}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* On-card hint when not installed and idle */}
                    {!isInstalled && !isDownloading && !isError && lang.enabled && (
                      <div className="mb-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                        <Download className="w-3 h-3 text-slate-500" />
                        <span>Click card or Download</span>
                      </div>
                    )}

                    {/* Meta */}
                    <div
                      className="text-xs font-mono border-t pt-3 flex items-center justify-between transition-colors"
                      style={{
                        borderColor: !isInstalled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                        color: !isInstalled ? '#475569' : '#cbd5e1',
                      }}
                    >
                      <span>
                        By{' '}
                        <strong
                          style={{ color: !isInstalled ? '#64748b' : 'white' }}
                          className="font-bold"
                        >
                          {lang.creator}
                        </strong>
                      </span>
                      <span
                        style={{ color: !isInstalled ? '#64748b' : 'white' }}
                        className="font-bold"
                      >
                        {lang.year}
                      </span>
                    </div>
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
