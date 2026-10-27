import React from 'react';
import { motion } from 'motion/react';

interface ExceptionBoxProps {
  type?: string;
  message: string;
  lineNum?: number;
}

export const ExceptionBox: React.FC<ExceptionBoxProps> = ({
  type = 'C COMPILER ERROR',
  message,
  lineNum
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col gap-1.5 p-3 px-4 rounded-none border border-rose-500/40 bg-slate-950/90 font-mono text-left max-w-md select-none my-1"
    >
      <div className="flex items-center justify-between gap-3 border-b border-rose-500/20 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center">
          {type}
        </span>
        {lineNum !== undefined && (
          <span className="text-[10px] text-slate-400 font-mono">
            line {lineNum}
          </span>
        )}
      </div>
      <div className="text-xs text-rose-200 font-mono leading-relaxed wrap-break-word">
        {message}
      </div>
    </motion.div>
  );
};
