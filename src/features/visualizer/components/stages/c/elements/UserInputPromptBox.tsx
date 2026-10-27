import React from 'react';
import { motion } from 'motion/react';

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
      initial={{ opacity: 0, scale: 0.97, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col gap-2 p-3 rounded-none border font-mono text-left select-none transition-colors duration-150 ${
        isActive
          ? 'border-cyan-500/50 bg-slate-950/95'
          : 'border-slate-800 bg-slate-950/70 opacity-80'
      }`}
      style={{ minWidth: '280px', maxWidth: '380px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-slate-200">
            STDIN PROMPT
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          stores in <strong className="text-cyan-300 font-bold">{variableName}</strong>
        </span>
      </div>

      {/* Terminal prompt message */}
      <div className="flex flex-col gap-1.5 bg-slate-900/60 border border-slate-800/60 rounded-none p-2.5 text-xs">
        <div className="text-slate-400 text-[11px] leading-tight">
          <span className="text-cyan-400 font-bold mr-1">&gt;</span>
          {prompt || `Enter value for ${variableName}:`}
        </div>

        {/* User typed value */}
        <div className="flex items-center justify-between bg-black/70 border border-slate-700/80 rounded-none px-2.5 py-1.5 text-sm mt-0.5">
          <span className="font-bold text-white tracking-wide">
            {displayVal}
          </span>
          <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded-none border border-slate-800 bg-slate-900">
            ↵ Enter
          </span>
        </div>
      </div>
    </motion.div>
  );
};
