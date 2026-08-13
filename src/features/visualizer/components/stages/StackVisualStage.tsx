import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';

const getStackFromStep = (step: any): { stack: (string | number)[]; capacity: number } => {
  if (!step) return { stack: [], capacity: 4 };
  const mem = step.memorySnapshot;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 4;
  if (Array.isArray(mem?.stack)) return { stack: mem.stack, capacity: cap };
  if (typeof mem?.stack === 'string') {
    try { return { stack: JSON.parse(mem.stack), capacity: cap }; } catch { return { stack: [], capacity: cap }; }
  }
  return { stack: [], capacity: cap };
};

export const StackVisualStage: React.FC = () => {
  const { currentStep, zoom } = useLesson();

  const { stack: stackItems, capacity: CAPACITY } = getStackFromStep(currentStep);
  const topIndex = stackItems.length - 1;
  const ev = currentStep?.animationEvent;
  
  const isPeekEvent = (ev as any)?.type === 'STACK_PEEK' || currentStep?.explanationEnglish?.includes('PEEK()');
  const isTraverseStep = ev?.type === 'SET_POINTERS' && typeof (ev as any)?.pointers?.curr === 'number';
  
  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? (ev as any).indexA :
    isTraverseStep ? (ev as any).pointers.curr :
    isPeekEvent ? (ev as any)?.peekIndex ?? topIndex :
    (typeof currentStep?.memorySnapshot?.i === 'number' ? currentStep.memorySnapshot.i : undefined);

  const isEmpty = stackItems.length === 0;
  const isFull = stackItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'STACK_POP' && isEmpty) || (currentStep?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-transparent flex items-center overflow-hidden relative px-6 py-6">

      {/* ── Extreme Far-Right Corner STACK STATUS Panel (Ultra-Compact Smaller Size) ── */}
      <div className="absolute right-3 top-4 z-20 w-36 flex flex-col gap-1.5 font-mono text-[10px] text-white bg-slate-950/85 p-2 border border-slate-800/80 rounded">
        
        {/* Header */}
        <div className="flex items-center gap-1 font-black text-white uppercase text-[9px] tracking-wider border-b border-slate-800 pb-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-slate-500' : isFull ? 'bg-rose-400' : 'bg-cyan-400'}`} />
          <span className="text-white font-extrabold text-[10px]">STACK STATUS</span>
        </div>

        {/* Key Value Stats */}
        <div className="flex flex-col gap-0.5 text-[9px]">
          <div className="flex justify-between border-b border-slate-800/50 pb-0.5">
            <span className="text-slate-400">State:</span>
            <strong className={isEmpty ? 'text-slate-300' : isFull ? 'text-rose-400' : 'text-cyan-300 font-bold'}>
              {isEmpty ? 'Empty' : isFull ? 'Full' : 'Active'}
            </strong>
          </div>
          <div className="flex justify-between border-b border-slate-800/50 pb-0.5">
            <span className="text-slate-400">Capacity:</span>
            <strong className="text-white font-bold">{CAPACITY}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-800/50 pb-0.5">
            <span className="text-slate-400">Size:</span>
            <strong className="text-white font-bold">{stackItems.length}/{CAPACITY}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-800/50 pb-0.5">
            <span className="text-slate-400">TOP Index:</span>
            <strong className="text-cyan-300 font-bold">{topIndex}</strong>
          </div>
        </div>

        {/* Active Items List */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            DATA (TOP → BOTTOM)
          </span>

          {stackItems.length === 0 ? (
            <span className="text-slate-500 text-[9px] italic">Empty</span>
          ) : (
            <div className="flex flex-col gap-0.5 max-h-24 overflow-y-auto">
              {stackItems.slice().reverse().map((item: any, idx: number) => {
                const actualIndex = stackItems.length - 1 - idx;
                const isTopItem = actualIndex === topIndex;
                return (
                  <div
                    key={idx}
                    className={`px-1.5 py-0.5 flex items-center justify-between rounded text-[9px] font-bold font-mono ${
                      isTopItem
                        ? 'bg-cyan-400 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>[{actualIndex}]</span>
                    <span className="font-bold">{item}</span>
                    {isTopItem && <span className="text-[7px] uppercase font-black bg-slate-950 text-cyan-300 px-1">TOP</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── Left / Center: Stack Visual Bucket (Inside Zoom Wrapper) ── */}
      <div
        className="w-full h-full flex items-center relative transition-transform duration-200 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'left center' }}
      >
        <div className="flex items-center gap-4 pl-4">
          
          {/* 1. Array Indexing Column */}
          <div className="h-62.5 flex flex-col justify-between py-1 font-mono text-xs font-bold text-slate-400 text-right pr-1">
            {Array.from({ length: CAPACITY }).map((_, i) => {
              const idx = CAPACITY - 1 - i;
              const isTop = idx === topIndex;
              const isTarget = idx === activeHighlight;
              return (
                <div key={idx} className="flex-1 flex items-center justify-end">
                  <span className={isTarget ? 'text-amber-400 font-black text-sm' : isTop ? 'text-cyan-400 font-black text-xs' : 'text-slate-400'}>
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. Middle: Bucket Frame */}
          <div className="flex flex-col items-center">
            
            {/* Alert Banners */}
            <AnimatePresence>
              {isFull && (
                <div className="px-3 py-1 bg-rose-950 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold rounded-md mb-2 animate-pulse shrink-0">
                  ⚠ STACK OVERFLOW (FULL)
                </div>
              )}
              {isUnderflow && (
                <div className="px-3 py-1 bg-amber-950 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold rounded-md mb-2 animate-pulse shrink-0">
                  ⚠ STACK UNDERFLOW
                </div>
              )}
              {isPeekEvent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-2 font-mono font-black text-xs text-amber-400 flex items-center gap-1.5 shrink-0 tracking-wider"
                >
                  <span>👁 PEEK TOP ELEMENT = {stackItems[topIndex]}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cyan Open Bucket Frame */}
            <div
              className="w-60 p-2 border-x-4 border-cyan-400 flex flex-col justify-between gap-2 bg-slate-950/90 shadow-2xl h-62.5"
            >
              {/* Render slots from TOP [CAPACITY-1] down to [0] */}
              {Array.from({ length: CAPACITY }).map((_, i) => {
                const idx = CAPACITY - 1 - i;
                const hasValue = idx <= topIndex && stackItems[idx] !== undefined;
                const value = hasValue ? stackItems[idx] : null;
                const isTop = idx === topIndex && hasValue;
                const isPeekTarget = isPeekEvent && isTop;
                const isTraverseTarget = isTraverseStep && idx === activeHighlight;
                const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
                const isFound = isSearch && (ev as any).result === 'found';

                return (
                  <div key={idx} className="flex-1 w-full flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                      {hasValue ? (
                        <motion.div
                          key={`block-${idx}-${value}`}
                          initial={{ opacity: 0, y: -20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                          className={`w-full h-full rounded-[5px] flex items-center justify-center font-mono font-black text-lg transition-all shadow-md ${
                            isFound
                              ? 'bg-emerald-400 text-slate-950 border-2 border-white'
                              : isPeekTarget
                              ? 'bg-amber-400 text-slate-950 border-2 border-amber-300 shadow-lg'
                              : isTraverseTarget
                              ? 'bg-cyan-400 text-slate-950 border-2 border-white'
                              : isSearch
                              ? 'bg-amber-400 text-slate-950 border-2 border-white'
                              : isTop
                              ? 'bg-white text-slate-950 border-2 border-cyan-400'
                              : 'bg-white text-slate-950 border border-slate-300'
                          }`}
                        >
                          {value}
                        </motion.div>
                      ) : (
                        <div className="w-full h-full rounded-[5px] border-2 border-dashed border-slate-800/80 flex items-center justify-center text-[10px] font-mono text-slate-700 font-bold select-none">
                          EMPTY SLOT
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Right Column: Pointer Badges */}
          <div className="h-62.5 flex flex-col justify-between py-1 font-mono text-xs pl-1">
            {Array.from({ length: CAPACITY }).map((_, i) => {
              const idx = CAPACITY - 1 - i;
              const hasValue = idx <= topIndex && stackItems[idx] !== undefined;
              const isTop = idx === topIndex && hasValue;
              const isPeekTarget = isPeekEvent && isTop;
              const isTraverseTarget = isTraverseStep && idx === activeHighlight;
              const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
              const isFound = isSearch && (ev as any).result === 'found';

              return (
                <div key={idx} className="flex-1 flex items-center">
                  <AnimatePresence>
                    {isFound && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-black text-xs shadow-md"
                      >
                        ← MATCH ✓
                      </motion.span>
                    )}
                    {isPeekTarget && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-xs shadow-lg flex items-center gap-1"
                      >
                        ← PEEK TOP 👁
                      </motion.span>
                    )}
                    {!isPeekTarget && isTraverseTarget && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono font-black text-xs shadow-lg flex items-center gap-1"
                      >
                        ← VISITING 🔍
                      </motion.span>
                    )}
                    {!isFound && !isPeekTarget && !isTraverseTarget && isSearch && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-xs"
                      >
                        ← SCAN
                      </motion.span>
                    )}
                    {!isFound && !isPeekTarget && !isTraverseTarget && !isSearch && isTop && (
                      <motion.span
                        key={`top-ptr-${idx}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2.5 py-0.5 rounded bg-sky-400 text-slate-950 font-mono font-black text-xs shadow-md"
                      >
                        ← TOP
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};
