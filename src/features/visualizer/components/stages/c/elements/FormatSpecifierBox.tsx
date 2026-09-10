import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Binary, Filter, Sparkles, MapPin } from 'lucide-react';

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
  // Specifier metadata dictionary
  const specMeta: Record<string, { type: string; color: string; desc: string; size: string }> = {
    '%d': { type: 'INT (32-bit)', color: 'text-sky-400 border-sky-400/50 bg-sky-500/10', desc: 'Signed Decimal Integer', size: '4 Bytes' },
    '%i': { type: 'INT (32-bit)', color: 'text-sky-400 border-sky-400/50 bg-sky-500/10', desc: 'Integer (Base auto-detect)', size: '4 Bytes' },
    '%f': { type: 'FLOAT', color: 'text-emerald-400 border-emerald-400/50 bg-emerald-500/10', desc: 'Single-precision Float', size: '4 Bytes' },
    '%lf': { type: 'DOUBLE', color: 'text-teal-400 border-teal-400/50 bg-teal-500/10', desc: 'Double-precision Float', size: '8 Bytes' },
    '%c': { type: 'CHAR', color: 'text-amber-400 border-amber-400/50 bg-amber-500/10', desc: 'Single ASCII Character', size: '1 Byte' },
    '%s': { type: 'STRING', color: 'text-fuchsia-400 border-fuchsia-400/50 bg-fuchsia-500/10', desc: 'Character Array (until \\0)', size: 'Array' },
    '%u': { type: 'UNSIGNED INT', color: 'text-indigo-400 border-indigo-400/50 bg-indigo-500/10', desc: 'Unsigned Decimal', size: '4 Bytes' },
    '%p': { type: 'POINTER', color: 'text-rose-400 border-rose-400/50 bg-rose-500/10', desc: 'Memory Address Hex', size: '8 Bytes' },
  };

  const meta = specMeta[specifier] || {
    type: 'VALUE',
    color: 'text-cyan-400 border-cyan-400/50 bg-cyan-500/10',
    desc: 'Formatted Value',
    size: byteSize ? `${byteSize}B` : '4 Bytes',
  };

  const isScanf = actionType === 'scanf';
  const displayVal = typeof rawValue === 'string' ? rawValue.replace(/['"]/g, '') : String(rawValue);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex flex-col gap-3 p-4 rounded-2xl border-2 backdrop-blur-xl transition-all duration-300 ${
        isActive
          ? 'bg-[#080d1e]/95 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.35)] ring-2 ring-cyan-500/20 scale-[1.02]'
          : 'bg-[#070913]/80 border-slate-700/60 opacity-80'
      }`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Filter size={13} />
          </div>
          <span className="text-[10.5px] font-black uppercase tracking-widest text-cyan-300 font-mono">
            {isScanf ? 'SCANF FORMAT FILTER' : 'PRINTF FORMAT CONVERTER'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-[9.5px] font-mono font-black text-cyan-300">
          <Binary size={11} />
          <span>{byteSize || meta.size}</span>
        </div>
      </div>

      {/* Pipeline Funnel Visual */}
      <div className="flex flex-col items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 font-mono">
        {/* Step 1: Input / Raw stream */}
        <div className="w-full flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Raw Input Stream</span>
          <span className="font-bold text-white tracking-wider bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            "{displayVal}"
          </span>
        </div>

        {/* Funnel Arrow with Specifier Badge */}
        <div className="flex items-center gap-2 my-0.5">
          <ArrowDown size={14} className="text-cyan-400 animate-bounce" />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`px-3 py-1 rounded-lg border text-xs font-black font-mono shadow-md ${meta.color}`}
          >
            Specifier: <span className="underline underline-offset-2 font-black">{specifier}</span> ({meta.type})
          </motion.div>
          <ArrowDown size={14} className="text-cyan-400 animate-bounce" />
        </div>

        {/* Step 2: Destination Memory Target */}
        <div className="w-full flex items-center justify-between bg-cyan-950/40 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <MapPin size={13} className="text-cyan-400 shrink-0" />
            <span>
              {isScanf ? `&${variableName}` : variableName}
              <span className="text-[10px] text-slate-400 font-normal ml-1">({memoryAddress})</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400">Stores:</span>
            <span className="font-black text-white bg-cyan-500/20 border border-cyan-400/60 px-2 py-0.5 rounded">
              {displayVal}
            </span>
          </div>
        </div>
      </div>

      {/* Helper Explanation Banner */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-cyan-400" />
          <span>{meta.desc}</span>
        </span>
        <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          {isScanf ? `&${variableName} Address Linked` : `Formatted for Console`}
        </span>
      </div>
    </motion.div>
  );
};
