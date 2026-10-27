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

export const VariableBox: React.FC<VariableBoxProps> = ({
  name,
  value,
  oldValue,
  isActive,
  colorTheme = 'default',
  isSmall,
  varType
}) => {
  const isLiteral = name === String(value);

  // Helper to extract type tag like [int], [const int], [double], [char] from value string
  const parseValAndType = (rawVal?: string | number, explicitType?: string) => {
    if (rawVal === undefined || rawVal === null) return { cleanVal: rawVal, typeBadge: explicitType };
    const str = String(rawVal);
    const typeMatch = str.match(/\[([a-zA-Z0-9_\s]+)\]/);
    const typeFromStr = typeMatch ? typeMatch[1] : undefined;
    const cleanStr = str.replace(/\s*\[[a-zA-Z0-9_\s]+\]/g, '').trim();

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

  const isConst = Boolean(varType?.includes('const') || typeBadge?.includes('const'));

  let colorClasses = isLiteral
    ? (isActive ? 'border-violet-400/80 bg-violet-500/10' : 'border-violet-500/30 bg-violet-500/5')
    : isConst
      ? (isActive ? 'border-amber-400/80 bg-amber-500/10 text-amber-100' : 'border-amber-500/40 bg-amber-500/5 text-amber-200')
      : (isActive ? 'border-blue-400/80 bg-blue-500/10' : 'border-blue-500/30 bg-blue-500/5');

  if (colorTheme === 'grey') {
    colorClasses = isActive ? 'border-slate-400/80 bg-slate-500/20 text-slate-200' : 'border-slate-700/60 bg-slate-800/20 text-slate-400';
  } else if (colorTheme === 'orange') {
    colorClasses = isActive ? 'border-orange-400/80 bg-orange-500/20 text-orange-200' : 'border-orange-600/40 bg-orange-950/20 text-orange-400';
  } else if (colorTheme === 'fuchsia') {
    colorClasses = isActive ? 'border-fuchsia-400/80 bg-fuchsia-500/20 text-fuchsia-200' : 'border-fuchsia-600/40 bg-fuchsia-950/20 text-fuchsia-400';
  } else if (colorTheme === 'teal') {
    colorClasses = isActive ? 'border-teal-400/80 bg-teal-500/20 text-teal-200' : 'border-teal-600/40 bg-teal-950/20 text-teal-400';
  }

  const height = isSmall ? '2.5rem' : '3.5rem';
  const minWidth = isSmall ? '3.5rem' : '4.5rem';
  const px = isSmall ? 'px-3' : 'px-5';
  const textSize = isSmall ? 'text-sm' : 'text-xl';
  const oldTextSize = isSmall ? 'text-[10px]' : 'text-sm';
  const labelSize = isSmall ? 'text-[9px]' : 'text-[11px]';
  const labelMargin = isSmall ? 'mb-1' : 'mb-1.5';
  const boxHeightLiteral = isSmall ? 'h-10 min-w-8' : 'h-14 min-w-12';

  if (isLiteral) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`flex items-center justify-center font-mono font-bold ${textSize} text-slate-200 select-none ${px} ${boxHeightLiteral}`}
      >
        {displayVal}
      </motion.div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Name tag + type badge above the box */}
      {name !== String(value) && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`absolute bottom-full ${labelMargin} left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 whitespace-nowrap`}
        >
          {typeBadge && typeBadge !== 'Obj' && typeBadge !== 'Object' && name !== 'sc' && String(displayVal) !== 'Scanner' && (
            <span
              className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-none border ${
                isConst
                  ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                  : 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30'
              }`}
            >
              {typeBadge}
            </span>
          )}
          <span
            className={`${labelSize} font-bold tracking-wider ${
              isConst ? 'text-amber-300' : 'text-blue-300'
            } font-mono leading-none whitespace-nowrap flex items-center gap-1`}
          >
            {isConst && (
              <svg
                className="w-2.5 h-2.5 text-amber-400 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="0" ry="0" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            {name}
          </span>
        </motion.div>
      )}

      {/* The actual value box with crisp 1px border */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`relative flex items-center justify-center ${px} rounded-none border overflow-hidden transition-colors duration-200 ${colorClasses}`}
        style={{ height, minWidth }}
      >
        <AnimatePresence mode="popLayout">
          {displayOldVal !== undefined && isActive && (
            <motion.span
              key="oldValue"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0.4, scale: 0.85, x: -8 }}
              transition={{ duration: 0.2 }}
              className={`font-mono font-bold ${oldTextSize} text-slate-400 line-through mr-2 whitespace-nowrap`}
            >
              {displayOldVal}
            </motion.span>
          )}
          {displayVal !== undefined && (
            <motion.span
              key={String(displayVal)}
              initial={{ opacity: 0, y: -12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ duration: 0.15 }}
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
