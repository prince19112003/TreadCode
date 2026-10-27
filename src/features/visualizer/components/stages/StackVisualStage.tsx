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
  const { currentStep, activeSteps, currentStepIndex, zoom } = useLesson();

  const step = (activeSteps && activeSteps.length > 0)
    ? (activeSteps[currentStepIndex] || activeSteps[0])
    : currentStep;

  const { stack: stackItems, capacity: CAPACITY } = getStackFromStep(step);
  const topIndex = stackItems.length - 1;
  const ev = step?.animationEvent;
  
  const isPeekEvent = (ev as any)?.type === 'STACK_PEEK' || step?.explanationEnglish?.includes('PEEK()');
  const isTraverseStep = ev?.type === 'SET_POINTERS' && typeof (ev as any)?.pointers?.curr === 'number';
  
  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? (ev as any).indexA :
    isTraverseStep ? (ev as any).pointers.curr :
    isPeekEvent ? (ev as any)?.peekIndex ?? topIndex :
    (typeof step?.memorySnapshot?.i === 'number' ? step.memorySnapshot.i : undefined);

  const isEmpty = stackItems.length === 0;
  const isFull = stackItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'STACK_POP' && isEmpty) || (step?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 custom-scrollbar select-none font-mono text-neutral-200">
      <div
        className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-6 py-3 transition-transform duration-150 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Top Status Bar ── */}
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <div className="flex flex-wrap items-center justify-between w-full px-3 py-1.5 bg-[#080b13] border border-neutral-800 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10.5px]">
              <span className="w-2 h-2 bg-cyan-400 inline-block" />
              <span>STACK (LIFO: LAST-IN, FIRST-OUT)</span>
            </div>

            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold">
                CAP: {CAPACITY}
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold">
                SIZE: {stackItems.length}
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-cyan-500/50 text-cyan-400 font-bold">
                TOP: {topIndex}
              </span>
              <span className={`px-2 py-0.5 border font-bold ${isEmpty ? 'bg-neutral-900 border-neutral-700 text-neutral-400' : isFull ? 'bg-rose-950 border-rose-500/50 text-rose-300' : 'bg-cyan-950 border-cyan-500/50 text-cyan-300'}`}>
                {isEmpty ? 'EMPTY' : isFull ? 'FULL' : 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* Alert Banners */}
          <AnimatePresence>
            {isFull && (
              <div className="px-3 py-1 bg-rose-950 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold shrink-0">
                ⚠ STACK OVERFLOW (CAPACITY REACHED: {stackItems.length}/{CAPACITY})
              </div>
            )}
            {isUnderflow && (
              <div className="px-3 py-1 bg-amber-950 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold shrink-0">
                ⚠ STACK UNDERFLOW: STACK IS EMPTY
              </div>
            )}
            {isPeekEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="font-mono font-black text-xs text-amber-400 flex items-center gap-1.5 shrink-0 tracking-wider"
              >
                <span>👁 PEEK TOP ELEMENT = {stackItems[topIndex]}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Main Stack Visualization: Bucket Frame + Pointers ── */}
        <div className="flex items-center justify-center gap-6 py-2">
          {/* 1. Array Indexing Column */}
          <div className="h-64 flex flex-col justify-between py-1 font-mono text-xs font-bold text-neutral-400 text-right pr-2">
            {Array.from({ length: CAPACITY }).map((_, i) => {
              const idx = CAPACITY - 1 - i;
              const isTop = idx === topIndex;
              const isTarget = idx === activeHighlight;
              return (
                <div key={idx} className="flex-1 flex items-center justify-end">
                  <span className={isTarget ? 'text-amber-400 font-black text-sm' : isTop ? 'text-cyan-400 font-black text-xs' : 'text-neutral-500'}>
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. Middle: Bucket Frame (Textbook Open Bucket, Sharp 90° Corners) */}
          <div className="flex flex-col items-center">
            {/* Open Top Indicator */}
            <div className="text-[10px] text-neutral-400 font-mono font-bold mb-1 tracking-wider uppercase">
              ▲ PUSH / POP HERE (TOP)
            </div>

            {/* Cyan Open Bucket Frame (border-l-4 border-r-4 border-b-4 border-t-0) */}
            <div className="w-64 p-2 border-x-4 border-b-4 border-t-0 border-cyan-400 flex flex-col justify-between gap-2 bg-[#05070e] shadow-xl h-64">
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
                          className={`w-full h-full flex items-center justify-center font-mono font-black text-lg text-white ${
                            isFound
                              ? 'bg-emerald-500/30 text-white border-2 border-emerald-400'
                              : isPeekTarget
                              ? 'bg-amber-500/30 text-white border-2 border-amber-400'
                              : isTraverseTarget
                              ? 'bg-cyan-500/30 text-white border-2 border-cyan-300'
                              : isSearch
                              ? 'bg-amber-500/30 text-white border-2 border-amber-300'
                              : isTop
                              ? 'bg-cyan-500/25 text-white border-2 border-cyan-400'
                              : 'bg-neutral-900 text-white border border-cyan-500/30'
                          }`}
                        >
                          {value}
                        </motion.div>
                      ) : (
                        <div className="w-full h-full border border-dashed border-neutral-800 flex items-center justify-center text-[10px] font-mono text-neutral-600 font-bold select-none">
                          EMPTY
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Right Column: Pointer Badges */}
          <div className="h-64 flex flex-col justify-between py-1 font-mono text-xs pl-2">
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
                        className="px-2 py-0.5 bg-emerald-500 text-neutral-950 font-mono font-black text-xs"
                      >
                        ◄ MATCH ✓
                      </motion.span>
                    )}
                    {isPeekTarget && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2 py-0.5 bg-amber-400 text-neutral-950 font-mono font-black text-xs flex items-center gap-1"
                      >
                        ◄ PEEK TOP
                      </motion.span>
                    )}
                    {!isPeekTarget && isTraverseTarget && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2 py-0.5 bg-cyan-400 text-neutral-950 font-mono font-black text-xs flex items-center gap-1"
                      >
                        ◄ VISITING
                      </motion.span>
                    )}
                    {!isFound && !isPeekTarget && !isTraverseTarget && isSearch && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2 py-0.5 bg-amber-400 text-neutral-950 font-mono font-black text-xs"
                      >
                        ◄ SCAN
                      </motion.span>
                    )}
                    {!isFound && !isPeekTarget && !isTraverseTarget && !isSearch && isTop && (
                      <motion.span
                        key={`top-ptr-${idx}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="px-2 py-0.5 bg-cyan-400 text-neutral-950 font-mono font-black text-xs"
                      >
                        ◄ TOP
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
