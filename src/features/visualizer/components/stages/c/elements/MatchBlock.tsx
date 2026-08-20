import React from 'react';
import { motion } from 'motion/react';

interface MatchBlockProps {
  variableName: string;
  value: string | number;
  isActive?: boolean;
}

export const MatchBlock: React.FC<MatchBlockProps> = ({ variableName, value, isActive }) => {
  const borderBgClass = isActive
    ? 'border-fuchsia-500 bg-fuchsia-500/10'
    : 'border-fuchsia-500/40 bg-fuchsia-500/5';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`flex items-center justify-center px-8 rounded-2xl border-2 transition-colors duration-300 ${borderBgClass}`}
        style={{ height: '5.25rem', minWidth: '16rem' }}
      >
        <div className="flex items-center gap-3 font-mono">
          <span className="text-slate-300 font-bold text-xl uppercase tracking-wider">
            SWITCH
          </span>
          <div className="flex flex-col items-center justify-center px-3 py-1 bg-fuchsia-500/20 rounded-lg border border-fuchsia-500/30">
            <span className="font-bold text-fuchsia-300 text-lg">{variableName}</span>
            <span className="text-xs text-fuchsia-400/80 font-black tracking-wider">
              {value}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Label positioned at the bottom of the box */}
      <span className="text-[11px] font-black tracking-wider text-fuchsia-400 font-mono leading-none">
        SWITCH ROOT
      </span>
    </div>
  );
};
