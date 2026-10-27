import React from 'react';
import { motion } from 'motion/react';

interface FormatSpecifierBoxProps {
  specifier: '%d' | '%i' | '%f' | '%lf' | '%c' | '%s' | '%u' | '%p' | string;
  variableName: string;
  rawValue: string | number;
  memoryAddress?: string;
  actionType?: 'scanf' | 'printf';
  byteSize?: number | string;
  isActive?: boolean;
}

export const FormatSpecifierBox: React.FC<FormatSpecifierBoxProps> = ({
  specifier = '%d',
  variableName,
  rawValue,
  memoryAddress = '0x7ffd8',
  actionType = 'scanf',
  byteSize,
  isActive = true,
}) => {
  const specMeta: Record<string, { type: string; desc: string; size: string }> = {
    '%d': { type: 'int', desc: 'Signed 32-bit Integer', size: '4B' },
    '%i': { type: 'int', desc: 'Integer (Base auto-detect)', size: '4B' },
    '%f': { type: 'float', desc: 'Single-precision Float', size: '4B' },
    '%lf': { type: 'double', desc: 'Double-precision Float', size: '8B' },
    '%c': { type: 'char', desc: 'Single ASCII Char', size: '1B' },
    '%s': { type: 'char[]', desc: 'Null-terminated String', size: 'Buffer' },
    '%u': { type: 'unsigned int', desc: 'Unsigned 32-bit Integer', size: '4B' },
    '%p': { type: 'void*', desc: 'Pointer Memory Address', size: '8B' },
  };

  const meta = specMeta[specifier] || {
    type: 'raw',
    desc: 'Formatted Value',
    size: byteSize ? `${byteSize}B` : '4B',
  };

  const isScanf = actionType === 'scanf';
  const displayVal = typeof rawValue === 'string' ? rawValue.replace(/['"]/g, '') : String(rawValue);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col gap-2 p-3 rounded-none border font-mono text-left select-none transition-colors duration-150 ${
        isActive
          ? 'border-cyan-500/50 bg-slate-950/95'
          : 'border-slate-800 bg-slate-950/70 opacity-80'
      }`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      {/* Clean HUD Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-slate-200">
            {isScanf ? `scanf("${specifier}", &${variableName})` : `printf("${specifier}", ${variableName})`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="px-1.5 py-0.2 rounded-none border border-slate-800 bg-slate-900 text-cyan-300 font-bold">
            {specifier} ({meta.type})
          </span>
          <span className="px-1.5 py-0.2 rounded-none border border-slate-800 bg-slate-900 text-slate-300">
            {byteSize ? `${byteSize}B` : meta.size}
          </span>
        </div>
      </div>

      {/* Direct Memory & Stream Flow */}
      <div className="flex flex-col gap-1.5 text-xs">
        {/* Row 1: Raw stdin stream */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-none bg-slate-900/60 border border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            stdin stream
          </span>
          <span className="font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-none border border-slate-700">
            "{displayVal}"
          </span>
        </div>

        {/* Row 2: Target memory write */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-none bg-cyan-950/20 border border-cyan-500/30">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="font-bold">{isScanf ? `&${variableName}` : variableName}</span>
            {memoryAddress && (
              <span className="text-[10px] text-slate-400 font-normal">({memoryAddress})</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">writes:</span>
            <span className="font-bold text-white bg-cyan-500/20 border border-cyan-400/40 px-2 py-0.5 rounded-none">
              {displayVal}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-footer detail: Specifier explanation */}
      <div className="text-[9.5px] text-slate-500 pt-0.5 border-t border-slate-900 flex justify-between">
        <span>{meta.desc}</span>
        <span className="text-slate-400">
          {isScanf ? `pointer to &${variableName}` : `value formatted`}
        </span>
      </div>
    </motion.div>
  );
};
