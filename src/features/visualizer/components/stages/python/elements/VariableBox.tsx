import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VariableBoxProps {
  name: string;
  value?: string | number;
  oldValue?: string | number;
  isActive?: boolean;
  colorTheme?: 'default' | 'grey' | 'orange' | 'fuchsia' | 'teal';
  isSmall?: boolean;
  varType?: string;
}

export const VariableBox: React.FC<VariableBoxProps> = ({ name, value, oldValue, isActive, colorTheme = 'default', isSmall, varType }) => {
  const isLiteral = name === String(value);
  
  let colorClasses = isLiteral
    ? (isActive ? 'border-violet-400 bg-violet-500/10' : 'border-violet-500/40 bg-violet-500/5')
    : (isActive ? 'border-blue-400 bg-blue-500/10' : 'border-blue-500/40 bg-blue-500/5');

  if (colorTheme === 'grey') {
    colorClasses = isActive ? 'border-slate-400 bg-slate-500/20 text-slate-200' : 'border-slate-600/50 bg-slate-700/20 text-slate-400';
  } else if (colorTheme === 'orange') {
    colorClasses = isActive ? 'border-orange-400 bg-orange-500/20 text-orange-200' : 'border-orange-500/50 bg-orange-900/30 text-orange-400';
  } else if (colorTheme === 'fuchsia') {
    colorClasses = isActive ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200' : 'border-fuchsia-500/50 bg-fuchsia-900/30 text-fuchsia-400';
  } else if (colorTheme === 'teal') {
    colorClasses = isActive ? 'border-teal-400 bg-teal-500/20 text-teal-200' : 'border-teal-500/50 bg-teal-900/30 text-teal-400';
  }

  const height = isSmall ? '2.5rem' : '3.5rem';
  const minWidth = isSmall ? '3.5rem' : '4.5rem';
  const px = isSmall ? 'px-3' : 'px-5';
  const textSize = isSmall ? 'text-sm' : 'text-xl';
  const oldTextSize = isSmall ? 'text-[10px]' : 'text-sm';
  const labelSize = isSmall ? 'text-[9px]' : 'text-[11px]';
  const labelMargin = isSmall ? 'mb-1' : 'mb-1.5';
  const boxHeightLiteral = isSmall ? 'h-10 min-w-8' : 'h-14 min-w-12';

  // Helper to extract type tag like [int], [double], [char], [boolean], [String] from value string
  const parseValAndType = (rawVal?: string | number, explicitType?: string) => {
    if (rawVal === undefined || rawVal === null) return { cleanVal: rawVal, typeBadge: explicitType };
    const str = String(rawVal);
    const typeMatch = str.match(/\[([a-zA-Z0-9_]+)\]/);
    const typeFromStr = typeMatch ? typeMatch[1] : undefined;
    const cleanStr = str.replace(/\s*\[[a-zA-Z0-9_]+\]/g, '').trim();
    
    // Parse numeric string if applicable
    let finalVal: string | number = cleanStr;
    const typeBadge = explicitType || typeFromStr;

    if (typeBadge === 'float' || typeBadge === 'double') {
      const num = Number(cleanStr);
      if (!isNaN(num) && typeBadge === 'float') {
        finalVal = num.toFixed(4);
      }
    }

    return { cleanVal: finalVal, typeBadge };
  };

  const { cleanVal: displayVal, typeBadge } = parseValAndType(value, varType);
  const { cleanVal: displayOldVal } = parseValAndType(oldValue, varType);

  if (isLiteral) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center justify-center font-mono font-bold ${textSize} text-slate-200 select-none ${px} ${boxHeightLiteral}`}
      >
        {displayVal}
      </motion.div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Name tag + small clean type badge positioned above the box */}
      {name !== String(value) && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-full ${labelMargin} left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 whitespace-nowrap`}
        >
          {typeBadge && typeBadge !== 'Obj' && typeBadge !== 'Object' && name !== 'sc' && String(displayVal) !== 'Scanner' && (
            <span className="text-[9px] font-mono font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-1 py-0.2 rounded border border-indigo-500/30">
              {typeBadge}
            </span>
          )}
          <span className={`${labelSize} font-black tracking-wider text-blue-300 font-mono leading-none whitespace-nowrap px-0.5`}>
            {name}
          </span>
        </motion.div>
      )}

      {/* The actual value box */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative flex items-center justify-center ${px} rounded-xl border-2 overflow-hidden transition-colors duration-300 ${colorClasses}`}
        style={{ height, minWidth }}
      >
        <AnimatePresence mode="popLayout">
          {displayOldVal !== undefined && isActive && (
            <motion.span
              key="oldValue"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0.4, scale: 0.85, x: -10 }}
              transition={{ duration: 0.5 }}
              className={`font-mono font-bold ${oldTextSize} text-slate-400 line-through mr-2 whitespace-nowrap`}
            >
              {displayOldVal}
            </motion.span>
          )}
          {displayVal !== undefined && (
            <motion.span
              key={String(displayVal)}
              // Value slides in from the top and slightly scales up
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: displayOldVal !== undefined ? 0.3 : 0 }}
              className={`font-mono font-bold ${textSize} text-white whitespace-nowrap`}
            >
              {displayVal}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
