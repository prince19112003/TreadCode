import React from 'react';
import { motion } from 'motion/react';

interface ExceptionBoxProps {
  type: string;
  message: string;
}

export const ExceptionBox: React.FC<ExceptionBoxProps> = ({ type, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="flex flex-col gap-1.5 p-3 px-5 rounded-xl border-2 border-red-500 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
      style={{ minWidth: 'fit-content' }}
    >
      <span className="text-[11px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        {type}
      </span>
      <span className="font-mono text-sm text-red-200">
        {message}
      </span>
    </motion.div>
  );
};
