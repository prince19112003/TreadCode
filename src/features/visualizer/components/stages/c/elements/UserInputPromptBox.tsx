import React from 'react';
import { motion } from 'motion/react';
import { Terminal, CornerDownLeft, Sparkles, Pause } from 'lucide-react';

interface UserInputPromptBoxProps {
  prompt: string;
  variableName: string;
  value: string | number;
  isActive?: boolean;
}

export const UserInputPromptBox: React.FC<UserInputPromptBoxProps> = ({
  prompt,
  variableName,
  value,
  isActive = true,
}) => {
  const displayVal = typeof value === 'string' ? value.replace(/['"]/g, '') : String(value);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex flex-col gap-3 p-4 rounded-2xl border-2 backdrop-blur-xl transition-all duration-300 ${
        isActive
          ? 'bg-[#090d1f]/95 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.35)] ring-2 ring-cyan-500/20 scale-[1.02]'
          : 'bg-[#080914]/80 border-slate-700/60 opacity-80'
      }`}
      style={{ minWidth: '280px', maxWidth: '380px' }}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Terminal size={13} />
          </div>
          <span className="text-[10.5px] font-black uppercase tracking-widest text-cyan-300 font-mono">
            TERMINAL INPUT PROMPT
          </span>
        </div>
        {isActive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[9px] font-mono font-black text-amber-300 shadow-sm animate-pulse">
            <Pause size={10} className="fill-amber-300" />
            <span>WAITING FOR INPUT</span>
          </div>
        )}
      </div>

      {/* Terminal Screen Prompt */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-mono">
        <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <span className="text-cyan-400 font-bold">&gt;</span> {prompt || `Enter value for ${variableName}:`}
        </div>

        {/* Input Field Simulator */}
        <div className="flex items-center justify-between bg-black/60 border border-cyan-500/50 rounded-lg px-3 py-2 text-sm">
          <span className="font-bold text-white flex items-center gap-1">
            {displayVal}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-cyan-400 rounded-xs ml-0.5"
            />
          </span>
          <span className="text-[10px] font-black text-slate-400 bg-white/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-white/10">
            <span>Enter</span>
            <CornerDownLeft size={10} />
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
        <span className="text-slate-400 flex items-center gap-1">
          <Sparkles size={11} className="text-cyan-400" />
          Stores in <strong className="text-cyan-300 font-black">{variableName}</strong>
        </span>
        <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          ✓ Captured
        </span>
      </div>
    </motion.div>
  );
};
