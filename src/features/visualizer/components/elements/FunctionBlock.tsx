import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type FunctionPhase = 'idle' | 'defined' | 'calling' | 'executing' | 'returning';

interface FunctionBlockProps {
  functionName: string;
  phase: FunctionPhase;
  children: React.ReactNode;
  id?: string;
}

const phaseConfig: Record<FunctionPhase, {
  border: string;
  bg: string;
  shadow: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  glowColor: string;
}> = {
  idle: {
    border: 'border-slate-800',
    bg: 'bg-slate-950/40 backdrop-blur-xl',
    shadow: 'shadow-2xl shadow-black/60',
    badge: 'WAITING',
    badgeColor: 'text-slate-400',
    badgeBg: 'bg-[#080914] border-slate-700',
    glowColor: 'rgba(0, 0, 0, 0)',
  },
  defined: {
    border: 'border-indigo-500/40',
    bg: 'bg-slate-950/80 backdrop-blur-xl',
    shadow: 'shadow-[0_0_30px_rgba(99,102,241,0.1)]',
    badge: 'DEFINED',
    badgeColor: 'text-indigo-400',
    badgeBg: 'bg-slate-900 border-indigo-500/40',
    glowColor: 'rgba(99, 102, 241, 0.05)',
  },
  calling: {
    border: 'border-amber-400',
    bg: 'bg-slate-950/90 backdrop-blur-xl',
    shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.2)]',
    badge: 'CALLING',
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-slate-900 border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.1)',
  },
  executing: {
    border: 'border-emerald-400',
    bg: 'bg-slate-950/95 backdrop-blur-xl',
    shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.25)]',
    badge: 'EXECUTING',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-slate-900 border-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  returning: {
    border: 'border-teal-400',
    bg: 'bg-slate-950/95 backdrop-blur-xl',
    shadow: 'shadow-[0_0_45px_rgba(20,184,166,0.25)]',
    badge: 'RETURNING',
    badgeColor: 'text-teal-400',
    badgeBg: 'bg-slate-900 border-teal-400',
    glowColor: 'rgba(20, 184, 166, 0.15)',
  },
};

export const FunctionBlock: React.FC<FunctionBlockProps> = ({
  functionName,
  phase,
  children,
  id,
}) => {
  const cfg = phaseConfig[phase];
  const isActivePhase = phase === 'calling' || phase === 'executing';

  return (
    <motion.div
      id={id}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl p-6 pt-12 flex flex-col items-start gap-4 min-w-[310px] max-w-[420px] border transition-all duration-500 ${cfg.border} ${cfg.bg} ${cfg.shadow}`}
      style={{
        boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 40px ${cfg.glowColor}`,
      }}
    >
      {/* Animated Glowing Ring Edge */}
      <AnimatePresence>
        {isActivePhase && (
          <motion.div
            key="pulse-ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute -inset-px rounded-2xl border-2 border-amber-400 pointer-events-none"
          />
        )}
        {phase === 'returning' && (
          <motion.div
            key="return-ring"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute -inset-px rounded-2xl border-2 border-teal-400 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Function name header badge on top border */}
      <motion.div
        layout
        className={`absolute -top-3.5 left-6 px-4 py-1.5 font-mono font-bold text-[10px] tracking-widest border rounded-lg transition-all duration-500 whitespace-nowrap shadow-md ${cfg.badgeBg} ${cfg.badgeColor}`}
      >
        fn <span className="text-white ml-1">{functionName.toUpperCase()}</span>
      </motion.div>

      {/* Status badge - top right */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-3.5 right-6 px-2.5 py-0.5 rounded-md text-[8px] font-black tracking-widest border ${cfg.badgeBg} ${cfg.badgeColor}`}
        >
          {cfg.badge}
        </motion.div>
      </AnimatePresence>

      {/* Statement rows container */}
      <div className="w-full flex flex-col gap-3 mt-1">
        {children}
      </div>
    </motion.div>
  );
};
