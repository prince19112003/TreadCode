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
}> = {
  idle: {
    border: 'border-slate-800/60',
    bg: 'bg-slate-950/20 backdrop-blur-md',
    shadow: 'shadow-lg shadow-black/20',
    badge: 'WAITING',
    badgeColor: 'text-slate-500 border-slate-800',
  },
  defined: {
    border: 'border-slate-700/80',
    bg: 'bg-slate-950/40 backdrop-blur-md',
    shadow: 'shadow-lg shadow-black/30',
    badge: 'DEFINED',
    badgeColor: 'text-indigo-400 border-indigo-500/20',
  },
  calling: {
    border: 'border-amber-500/40',
    bg: 'bg-slate-950/50 backdrop-blur-md',
    shadow: 'shadow-xl shadow-black/30',
    badge: 'CALLING',
    badgeColor: 'text-amber-400 border-amber-500/25',
  },
  executing: {
    border: 'border-emerald-500/40',
    bg: 'bg-slate-950/60 backdrop-blur-md',
    shadow: 'shadow-xl shadow-black/40',
    badge: 'EXECUTING',
    badgeColor: 'text-emerald-400 border-emerald-500/25',
  },
  returning: {
    border: 'border-teal-500/40',
    bg: 'bg-slate-950/60 backdrop-blur-md',
    shadow: 'shadow-xl shadow-black/40',
    badge: 'RETURNING',
    badgeColor: 'text-teal-400 border-teal-500/25',
  },
};

export const FunctionBlock: React.FC<FunctionBlockProps> = ({
  functionName,
  phase,
  children,
  id,
}) => {
  const cfg = phaseConfig[phase];

  return (
    <motion.div
      id={id}
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-xl p-5 pt-11 flex flex-col items-start gap-3 min-w-77.5 max-w-105 border transition-all duration-300 ${cfg.border} ${cfg.bg} ${cfg.shadow}`}
    >
      {/* Function name header badge on top border */}
      <motion.div
        layout
        className="absolute -top-3 left-4 px-3 py-1 font-mono font-bold text-[9px] tracking-wider bg-slate-950 border border-slate-800 rounded-md text-slate-300 shadow-sm"
      >
        fn <span className="text-white ml-1">{functionName.toUpperCase()}</span>
      </motion.div>

      {/* Status badge - top right */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={`absolute top-3.5 right-5 px-2 py-0.5 rounded-md text-[8px] font-bold tracking-widest border bg-slate-950/80 ${cfg.badgeColor}`}
        >
          {cfg.badge}
        </motion.div>
      </AnimatePresence>

      {/* Statement rows container */}
      <div className="w-full flex flex-col gap-2.5 mt-0.5">
        {children}
      </div>
    </motion.div>
  );
};
