import React from 'react';
import { motion } from 'motion/react';

interface PrintBoxProps {
  variableName?: string;
  value: string | number;
  isActive?: boolean;
  colorTheme?: 'default' | 'grey' | 'orange' | 'fuchsia' | 'teal';
  isSmall?: boolean;
}

export const PrintBox: React.FC<PrintBoxProps> = ({ variableName, value, isActive, colorTheme = 'default', isSmall }) => {
  let colorClasses = isActive ? 'border-green-400 bg-green-500/10 text-white' : 'border-green-500/50 bg-green-500/5 text-white';
  let labelColor = 'text-green-400';

  if (colorTheme === 'grey') {
    colorClasses = isActive ? 'border-slate-400 bg-slate-500/20 text-slate-200' : 'border-slate-600/50 bg-slate-700/20 text-slate-400';
    labelColor = 'text-slate-400';
  } else if (colorTheme === 'orange') {
    colorClasses = isActive ? 'border-orange-400 bg-orange-500/20 text-orange-200' : 'border-orange-500/50 bg-orange-900/30 text-orange-400';
    labelColor = 'text-orange-400';
  } else if (colorTheme === 'fuchsia') {
    colorClasses = isActive ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200' : 'border-fuchsia-500/50 bg-fuchsia-900/30 text-fuchsia-400';
    labelColor = 'text-fuchsia-400';
  } else if (colorTheme === 'teal') {
    colorClasses = isActive ? 'border-teal-400 bg-teal-500/20 text-teal-200' : 'border-teal-500/50 bg-teal-900/30 text-teal-400';
    labelColor = 'text-teal-400';
  }

  const minHeight = isSmall ? '2.5rem' : '3.5rem';
  const minWidth = isSmall ? '3.5rem' : '4.5rem';
  const px = isSmall ? 'px-3' : 'px-5';
  const textSize = isSmall ? 'text-xs' : 'text-sm';
  const gap = isSmall ? 'gap-1' : 'gap-1.5';
  const labelSize = isSmall ? 'text-[9px]' : 'text-[11px]';

  let displayText = '';
  if (value !== undefined && value !== null && String(value).trim() !== '') {
    const valStr = String(value);
    if (
      variableName &&
      !valStr.startsWith(variableName) &&
      !['output', 'print', 'val', 'value', 'result'].includes(variableName.toLowerCase()) &&
      !valStr.includes(':')
    ) {
      displayText = `${variableName}: ${valStr}`;
    } else {
      displayText = valStr;
    }
  } else {
    displayText = variableName || '';
  }

  return (
    <div className={`flex flex-col items-center ${gap}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center justify-center ${px} py-2 rounded-xl border-2 transition-colors duration-300 ${colorClasses} w-fit max-w-md text-center`}
        style={{ minHeight, minWidth }}
      >
        <span className={`font-mono font-bold ${textSize} text-white whitespace-pre-wrap leading-tight`}>
          {displayText}
        </span>
      </motion.div>
      <span className={`${labelSize} font-black tracking-wider font-mono leading-none ${labelColor}`}>
        PRINT
      </span>
    </div>
  );
};
