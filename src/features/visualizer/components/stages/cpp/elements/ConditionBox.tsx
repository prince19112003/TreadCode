import React, { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Check, X, HelpCircle } from 'lucide-react';

interface ConditionBoxProps {
  condition: string;
  inputs: string[];
  memorySnapshot: Record<string, string | number>;
  isTrue?: boolean | null;
  isActive?: boolean;
  label?: string;
  colorTheme?: 'default' | 'orange' | 'fuchsia' | 'teal' | 'grey';
}

export const ConditionBox: React.FC<ConditionBoxProps> = ({ 
  condition, 
  inputs, 
  memorySnapshot, 
  isTrue, 
  isActive,
  label = 'CONDITION',
  colorTheme = 'default'
}) => {
  const controls = useAnimation();
  
  let borderBgClass = isTrue === false
    ? (isActive ? 'border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-red-500/60 bg-red-500/10')
    : (isActive ? 'border-teal-400 bg-teal-500/10' : 'border-teal-500/50 bg-teal-500/5');
  let labelColorClass = isTrue === false ? 'text-red-400 font-bold' : 'text-teal-400';
  let placeholderColorClass = 'bg-teal-500/20 text-teal-300';
  let tokenColorClass = isTrue === false ? 'text-red-200 font-semibold' : 'text-teal-200';

  if (colorTheme === 'orange') {
    borderBgClass = isTrue === false 
      ? (isActive ? 'border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-red-500/60 bg-red-500/10')
      : (isActive ? 'border-orange-400 bg-orange-500/20' : 'border-orange-500/50 bg-orange-900/30');
    labelColorClass = isTrue === false ? 'text-red-400 font-bold' : 'text-orange-400';
    placeholderColorClass = 'bg-orange-500/20 text-orange-300';
    tokenColorClass = isTrue === false ? 'text-red-200 font-semibold' : 'text-orange-200';
  } else if (colorTheme === 'fuchsia') {
    borderBgClass = isTrue === false 
      ? (isActive ? 'border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-red-500/60 bg-red-500/10')
      : (isActive ? 'border-fuchsia-400 bg-fuchsia-500/20' : 'border-fuchsia-500/50 bg-fuchsia-900/30');
    labelColorClass = isTrue === false ? 'text-red-400 font-bold' : 'text-fuchsia-400';
    placeholderColorClass = 'bg-fuchsia-500/20 text-fuchsia-300';
    tokenColorClass = isTrue === false ? 'text-red-200 font-semibold' : 'text-fuchsia-200';
  } else if (colorTheme === 'grey') {
    borderBgClass = isTrue === false 
      ? (isActive ? 'border-red-500 bg-red-500/15 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-red-500/60 bg-red-500/10')
      : (isActive ? 'border-slate-400 bg-slate-500/20' : 'border-slate-500/50 bg-slate-800/40');
    labelColorClass = isTrue === false ? 'text-red-400 font-bold' : 'text-slate-400';
    placeholderColorClass = 'bg-slate-500/20 text-slate-300';
    tokenColorClass = isTrue === false ? 'text-red-200 font-semibold' : 'text-slate-200';
  }

  useEffect(() => {
    if (isTrue === false) {
      controls.start({
        x: [0, -12, 12, -10, 10, -6, 6, 0],
        transition: { duration: 0.45, ease: 'easeInOut' }
      });
    }
  }, [isTrue, controls]);

  const tokens = condition.split(/\s+/).filter(Boolean);

  return (
    <div className="flex flex-col items-center gap-1.5 relative">
      {/* The actual conditional box */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className={`relative flex items-center justify-between px-6 rounded-2xl border-2 transition-colors duration-300 ${borderBgClass}`}
        style={{ height: '5.25rem', minWidth: '14rem' }}
      >
        <div className={`flex items-center gap-2 font-mono text-lg ${tokenColorClass}`} style={{ fontFeatureSettings: '"liga" 0', fontVariantLigatures: 'none' }}>
          {tokens.map((token, i) => {
            const cleanToken = token.replace(/[^a-zA-Z0-9_]/g, '');
            const isVar = (inputs.includes(token) || inputs.includes(cleanToken)) && 
                          (memorySnapshot[token] !== undefined || memorySnapshot[cleanToken] !== undefined);
            const varName = memorySnapshot[token] !== undefined ? token : cleanToken;

            if (isVar) {
              const rawMem = String(memorySnapshot[varName]);
              const displayVal = rawMem.replace(/\s*\[[a-zA-Z0-9_]+\]/g, '').trim();
              return (
                <div key={i} className="flex flex-col items-center justify-center gap-0.5 px-1">
                  <span className={`font-bold text-[16px] ${
                    isTrue === false 
                      ? 'text-red-200' 
                      : colorTheme === 'orange' ? 'text-orange-200' : colorTheme === 'fuchsia' ? 'text-fuchsia-200' : colorTheme === 'grey' ? 'text-slate-200' : 'text-teal-200'
                  }`}>
                    {varName}
                  </span>
                  <span className={`text-[11px] font-black tracking-wider ${
                    isTrue === false 
                      ? 'text-red-400' 
                      : colorTheme === 'orange' ? 'text-orange-400' : colorTheme === 'fuchsia' ? 'text-fuchsia-400' : colorTheme === 'grey' ? 'text-slate-400' : 'text-teal-400'
                  }`}>
                    {displayVal}
                  </span>
                </div>
              );
            }
            return (
              <span key={i} className={`font-bold ${isTrue === false ? 'text-red-300' : 'text-slate-300'}`}>
                {token}
              </span>
            );
          })}
        </div>

        {/* Validation status badge */}
        {isTrue !== undefined && isTrue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.2 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 ${
              isTrue ? 'bg-green-500 text-white' : 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
            }`}
          >
            {isTrue ? <Check size={18} className="stroke-3" /> : <X size={18} className="stroke-3" />}
          </motion.div>
        )}

        {/* Default placeholder state before evaluation */}
        {isTrue === undefined && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 ${placeholderColorClass}`}>
            <HelpCircle size={18} />
          </div>
        )}
      </motion.div>

      {/* Label positioned at the bottom of the box */}
      <span className={`text-[11px] font-black tracking-wider font-mono leading-none uppercase ${labelColorClass}`}>
        {label}
      </span>

      {/* Branch transition indicator when condition evaluates to false */}
      {isTrue === false && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-1 px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-lg flex items-center gap-1.5 shadow-md select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold text-red-300 tracking-wider">
            Condition FALSE → Executing Next Branch (else / else if)
          </span>
        </motion.div>
      )}
    </div>
  );
};
