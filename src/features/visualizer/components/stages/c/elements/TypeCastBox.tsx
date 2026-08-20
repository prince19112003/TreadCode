import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface TypeCastBoxProps {
  fromType: string;
  toType: string;
  fromValue: string | number;
  toValue: string | number;
  variableName: string;
  isActive?: boolean;
}

export const TypeCastBox: React.FC<TypeCastBoxProps> = ({
  fromType,
  toType,
  fromValue,
  toValue,
  variableName,
  isActive = true,
}) => {
  const fromDisplay = typeof fromValue === 'string' && !fromValue.startsWith('"') ? `"${fromValue}"` : String(fromValue);
  const toDisplay = typeof toValue === 'string' ? `"${toValue}"` : String(toValue);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 backdrop-blur-xl transition-all duration-300 ${
        isActive
          ? 'bg-[#100b21]/95 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/20 scale-[1.02]'
          : 'bg-[#0a0814]/80 border-slate-700/60 opacity-80'
      }`}
      style={{ minWidth: '300px', maxWidth: '400px' }}
    >
      {/* Badge Header */}
      <div className="flex items-center justify-between w-full border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Zap size={13} />
          </div>
          <span className="text-[10.5px] font-black uppercase tracking-widest text-amber-300 font-mono">
            TYPE CASTING TRANSFORMER
          </span>
        </div>
        <span className="text-[9.5px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
          <RefreshCw size={10} className="animate-spin text-amber-400" style={{ animationDuration: '3s' }} />
          {toType.toUpperCase()} CONVERSION
        </span>
      </div>

      {/* Morphing Flow Box */}
      <div className="flex items-center justify-center gap-3 w-full my-1">
        {/* Source String Box */}
        <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-900/90 border border-indigo-400/40 shrink-0 min-w-22.5">
          <span className="text-[8.5px] font-mono font-black text-indigo-300 uppercase tracking-widest">
            {fromType.toUpperCase()} (TEXT)
          </span>
          <span className="font-mono font-black text-sm text-indigo-200">
            {fromDisplay}
          </span>
        </div>

        {/* Transformer Function Arrow */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400 text-[10px] font-mono font-black text-amber-300 shadow-md shadow-amber-950/40"
          >
            {toType}()
          </motion.div>
          <ArrowRight size={16} className="text-amber-400" />
        </div>

        {/* Target Converted Number Box */}
        <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400/60 shrink-0 min-w-22.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <span className="text-[8.5px] font-mono font-black text-emerald-300 uppercase tracking-widest">
            {toType.toUpperCase()} (NUM)
          </span>
          <span className="font-mono font-black text-base text-emerald-200">
            {toDisplay}
          </span>
        </div>
      </div>

      {/* Result Badge */}
      <div className="text-[10px] font-mono text-slate-300 bg-black/50 border border-white/10 px-3 py-1 rounded-lg w-full text-center">
        Converted input text to numeric <strong className="text-amber-300">{toType}</strong> for variable <strong className="text-cyan-300">{variableName}</strong>
      </div>
    </motion.div>
  );
};
