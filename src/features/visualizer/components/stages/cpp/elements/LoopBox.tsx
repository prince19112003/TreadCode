import React from 'react';
import { motion } from 'motion/react';

interface LoopBoxProps {
  label?: string;
  isActive?: boolean;
  children: React.ReactNode;
}

export const LoopBox: React.FC<LoopBoxProps> = ({ label = 'LOOP', isActive, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
        isActive ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-yellow-500/40'
      }`}
      style={{ minWidth: 'fit-content' }}
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 font-mono leading-none">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
        {children}
      </div>
    </motion.div>
  );
};
