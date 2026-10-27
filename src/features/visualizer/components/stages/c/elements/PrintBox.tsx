import React from 'react';
import { motion } from 'motion/react';

interface PrintBoxProps {
  variableName?: string;
  value: string | number;
  isActive?: boolean;
  colorTheme?: 'default' | 'grey' | 'orange' | 'fuchsia' | 'teal';
  isSmall?: boolean;
}

export const PrintBox: React.FC<PrintBoxProps> = ({
  variableName,
  value,
  isActive,
  colorTheme = 'default',
  isSmall
}) => {
  let colorClasses = isActive
    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-100'
    : 'border-emerald-600/30 bg-emerald-950/10 text-emerald-200';
  let labelColor = 'text-emerald-400';

  if (colorTheme === 'grey') {
    colorClasses = isActive
      ? 'border-slate-400/80 bg-slate-500/20 text-slate-200'
      : 'border-slate-700/60 bg-slate-800/20 text-slate-400';
    labelColor = 'text-slate-400';
  } else if (colorTheme === 'orange') {
    colorClasses = isActive
      ? 'border-orange-400/80 bg-orange-500/20 text-orange-200'
      : 'border-orange-600/40 bg-orange-950/20 text-orange-400';
    labelColor = 'text-orange-400';
  } else if (colorTheme === 'fuchsia') {
    colorClasses = isActive
      ? 'border-fuchsia-400/80 bg-fuchsia-500/20 text-fuchsia-200'
      : 'border-fuchsia-600/40 bg-fuchsia-950/20 text-fuchsia-400';
    labelColor = 'text-fuchsia-400';
  } else if (colorTheme === 'teal') {
    colorClasses = isActive
      ? 'border-teal-400/80 bg-teal-500/20 text-teal-200'
      : 'border-teal-600/40 bg-teal-950/20 text-teal-400';
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
    displayText = String(value);
  } else {
    displayText = variableName || '';
  }

  return (
    <div className={`flex flex-col items-center ${gap}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`flex items-center justify-center ${px} py-2 rounded-none border transition-colors duration-200 ${colorClasses} w-fit max-w-md text-center`}
        style={{ minHeight, minWidth }}
      >
        <span className={`font-mono font-bold ${textSize} text-white whitespace-pre-wrap leading-tight`}>
          {displayText}
        </span>
      </motion.div>
      <span className={`${labelSize} font-bold tracking-wider font-mono leading-none ${labelColor}`}>
        PRINT
      </span>
    </div>
  );
};
