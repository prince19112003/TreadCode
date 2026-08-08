import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FunctionStatementRowProps {
  code: string;
  statementType: 'print' | 'return' | 'variable' | 'compute' | 'condition' | 'other';
  isActive: boolean;
  hasExecuted: boolean;
  activeComponent?: React.ReactNode;
}

const typeConfig = {
  print: {
    borderAccent: 'border-l-emerald-400',
    activeBg: 'bg-emerald-950/45 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    pendingBg: 'bg-slate-900/40 border-slate-800/60 text-slate-500',
    executedBg: 'bg-emerald-950/15 border-emerald-900/30 text-emerald-400/80',
    dot: 'bg-emerald-400',
  },
  return: {
    borderAccent: 'border-l-cyan-400',
    activeBg: 'bg-cyan-950/45 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    pendingBg: 'bg-slate-900/40 border-slate-800/60 text-slate-500',
    executedBg: 'bg-cyan-950/15 border-cyan-900/30 text-cyan-400/80',
    dot: 'bg-cyan-400',
  },
  variable: {
    borderAccent: 'border-l-sky-400',
    activeBg: 'bg-sky-950/45 border-sky-500/60 shadow-[0_0_20px_rgba(14,165,233,0.25)]',
    pendingBg: 'bg-slate-900/40 border-slate-800/60 text-slate-500',
    executedBg: 'bg-sky-950/15 border-sky-900/30 text-sky-400/80',
    dot: 'bg-sky-400',
  },
  compute: {
    borderAccent: 'border-l-violet-400',
    activeBg: 'bg-violet-950/45 border-violet-500/60 shadow-[0_0_20px_rgba(139,92,246,0.25)]',
    pendingBg: 'bg-slate-900/40 border-slate-800/60 text-slate-500',
    executedBg: 'bg-violet-950/15 border-violet-900/30 text-violet-400/80',
    dot: 'bg-violet-400',
  },
  condition: {
    borderAccent: 'border-l-amber-500',
    activeBg: 'bg-amber-950/45 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    pendingBg: 'bg-slate-900/40 border-slate-800/60 text-slate-500',
    executedBg: 'bg-amber-950/15 border-amber-900/30 text-amber-400/80',
    dot: 'bg-amber-500',
  },
  other: {
    borderAccent: 'border-l-slate-600',
    activeBg: 'bg-slate-900/50 border-slate-700/60',
    pendingBg: 'bg-slate-950/20 border-slate-900/30 text-slate-600',
    executedBg: 'bg-slate-900/20 border-slate-800/30 text-slate-400/70',
    dot: 'bg-slate-500',
  },
};

export const FunctionStatementRow: React.FC<FunctionStatementRowProps> = ({
  code,
  statementType,
  isActive,
  hasExecuted,
  activeComponent,
}) => {
  const cfg = typeConfig[statementType];

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <motion.div
        layout
        animate={{ 
          scale: isActive ? 1.01 : 1, 
          opacity: !hasExecuted && !isActive ? 0.3 : 1 
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`w-full flex items-center gap-2 px-3 py-1.5 border-l-2 font-mono text-[11px] whitespace-pre transition-all duration-300 ${cfg.borderAccent} ${isActive ? 'text-white' : 'text-slate-300'}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${isActive ? 'animate-ping' : ''}`} />
        <span className={`font-semibold ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
          {code}
        </span>
        {isActive && (
          <span className="ml-auto text-[8px] font-black tracking-widest text-amber-400 uppercase shrink-0">
            ●
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {isActive && activeComponent && (
          <motion.div
            key="active-component"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="w-full flex justify-center"
          >
            {activeComponent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
