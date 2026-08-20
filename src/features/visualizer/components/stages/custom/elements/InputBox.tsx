import React from 'react';
import { motion } from 'motion/react';

interface InputBoxProps {
  prompt?: string;
  isActive?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ prompt, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex flex-col items-center justify-center gap-1 px-4 rounded-xl border-2 transition-colors duration-300 ${
        isActive ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-purple-500/50 bg-purple-500/5'
      }`}
      style={{ height: '4rem', minWidth: 'fit-content' }}
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 select-none leading-none">
        INPUT
      </span>
      {prompt && (
        <span className="font-mono text-sm text-purple-200 mt-1">
          "{prompt}"
        </span>
      )}
    </motion.div>
  );
};
