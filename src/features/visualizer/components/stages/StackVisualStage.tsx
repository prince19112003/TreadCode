import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';

const CAPACITY = 6;

const getStackFromStep = (step: any): (string | number)[] => {
  if (!step) return [];
  const mem = step.memorySnapshot;
  if (Array.isArray(mem?.stack)) return mem.stack;
  if (typeof mem?.stack === 'string') {
    try { return JSON.parse(mem.stack); } catch { return []; }
  }
  const ev = step.animationEvent;
  if (ev?.type === 'STACK_PUSH' || ev?.type === 'STACK_POP') {
    return (ev as any).stackState ?? [];
  }
  return [];
};

export const StackVisualStage: React.FC = () => {
  const { currentStep } = useLesson();

  const stackItems: (string | number)[] = getStackFromStep(currentStep);
  const topIndex = stackItems.length - 1;
  const ev = currentStep?.animationEvent;
  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? (ev as any).indexA :
    (ev as any)?.pointers?.curr ?? (typeof currentStep?.memorySnapshot?.i === 'number' ? currentStep.memorySnapshot.i : undefined);

  const isOverflow = stackItems.length > CAPACITY;
  const isEmpty = stackItems.length === 0;

  return (
    <div className="flex-1 w-full h-full bg-[#060814] flex items-center justify-center overflow-auto">
      <div className="flex flex-col items-center gap-6 py-6">

        {/* Stack Header Label */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
          <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-purple-400/90">
            Stack (LIFO) — Capacity {CAPACITY}
          </span>
          <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
        </div>

        {/* Open Top Label */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">OPEN TOP ▼</span>
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        {/* Main Stack Frame */}
        <div
          className={`relative flex flex-col gap-0 rounded-b-2xl overflow-hidden transition-all duration-300 ${
            isOverflow ? 'ring-2 ring-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''
          }`}
          style={{ minWidth: 340 }}
        >
          {/* Render slots from index [CAPACITY-1] down to [0] */}
          {Array.from({ length: CAPACITY }).map((_, i) => {
            const idx = CAPACITY - 1 - i;
            const hasValue = idx <= topIndex && stackItems[idx] !== undefined;
            const value = hasValue ? stackItems[idx] : null;
            const isTop = idx === topIndex && hasValue;
            const isHighlighted = idx === activeHighlight;
            const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
            const isFound = isSearch && (ev as any).result === 'found';

            return (
              <div key={idx} className="flex items-stretch">
                {/* Left: Index Badge */}
                <div className="w-12 flex items-center justify-end pr-3 shrink-0 border-r border-slate-800/60 bg-slate-950/60">
                  <span className="text-[10px] font-mono font-bold text-slate-600">[{idx}]</span>
                </div>

                {/* Center: Slot */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`slot-${idx}-${hasValue ? 'filled' : 'empty'}`}
                    layout
                    initial={hasValue ? { opacity: 0, y: -12, scale: 0.95 } : { opacity: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22, duration: 0.25 }}
                    className={`flex-1 h-14 flex items-center justify-center font-mono font-bold text-base transition-all duration-300 border-b border-slate-800/40 ${
                      isFound
                        ? 'bg-green-500/20 text-green-300 shadow-[inset_0_0_20px_rgba(34,197,94,0.15)]'
                        : isHighlighted || isSearch
                        ? 'bg-amber-500/15 text-amber-300 shadow-[inset_0_0_20px_rgba(245,158,11,0.15)]'
                        : isTop
                        ? 'bg-purple-500/20 text-purple-200 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]'
                        : hasValue
                        ? 'bg-indigo-950/80 text-slate-300'
                        : 'bg-slate-950/40 text-slate-800'
                    }`}
                  >
                    {hasValue ? (
                      <span className={`tracking-wide ${isTop ? 'text-purple-200' : 'text-slate-300'}`}>
                        {value}
                      </span>
                    ) : (
                      <span className="text-[9px] tracking-[0.3em] uppercase text-slate-800/60 font-sans font-normal select-none">
                        empty
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Right: Pointer / Status */}
                <div className="w-20 flex items-center pl-3 shrink-0 border-l border-slate-800/60 bg-slate-950/60">
                  <AnimatePresence>
                    {isFound && (
                      <motion.span
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -5, opacity: 0 }}
                        className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-400/50 text-green-300 text-[9px] font-mono font-black tracking-wider"
                      >
                        FOUND ✓
                      </motion.span>
                    )}
                    {!isFound && (isHighlighted || isSearch) && (
                      <motion.span
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -5, opacity: 0 }}
                        className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[9px] font-mono font-black tracking-wider"
                      >
                        SCAN ◀
                      </motion.span>
                    )}
                    {!isHighlighted && !isSearch && isTop && (
                      <motion.span
                        key={`top-ptr-${idx}`}
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -5, opacity: 0 }}
                        className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-400/60 text-purple-300 text-[9px] font-mono font-black tracking-wider shadow-sm"
                      >
                        TOP ◀
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Solid Base */}
          <div className="h-3 bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 border-t-2 border-slate-600/60 flex items-center justify-center">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-slate-500/40 to-transparent" />
          </div>
        </div>

        {/* Base Label */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
          <span className="text-[10px] font-mono text-slate-700 tracking-widest uppercase">▲ BASE (index 0)</span>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-purple-500' : stackItems.length >= CAPACITY ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className="text-slate-500">
              {isEmpty ? 'Empty' : stackItems.length >= CAPACITY ? 'Full (Overflow Risk)' : 'Active'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Size: <span className="text-slate-300 font-bold">{stackItems.length}/{CAPACITY}</span></span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">TOP: <span className="text-purple-300 font-bold">{topIndex}</span></span>
        </div>

      </div>
    </div>
  );
};
