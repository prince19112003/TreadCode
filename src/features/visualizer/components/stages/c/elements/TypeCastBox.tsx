import React from 'react';
import { ArrowRight } from 'lucide-react';

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
  const fromDisplay = String(fromValue);
  const toDisplay = String(toValue);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border font-mono transition-all ${
        isActive
          ? 'bg-slate-900 border-amber-400/80 shadow-md text-slate-100'
          : 'bg-slate-950/80 border-slate-700/60 text-slate-400'
      }`}
    >
      {/* Source Variable & Type */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {fromType}
        </span>
        <span className="text-sm font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
          {fromDisplay}
        </span>
      </div>

      {/* Static Arrow & Target Type Cast Label */}
      <div className="flex items-center gap-1.5 text-amber-400">
        <ArrowRight size={14} className="text-slate-400" />
        <span className="text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-300">
          ({toType})
        </span>
        <ArrowRight size={14} className="text-slate-400" />
      </div>

      {/* Target Result Box */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          {variableName} = {toDisplay}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          [{toType}]
        </span>
      </div>
    </div>
  );
};

