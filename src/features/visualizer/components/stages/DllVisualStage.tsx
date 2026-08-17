import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';
import { ArrowLeftRight } from 'lucide-react';

const getListFromStep = (step: any): { list: (string | number)[]; capacity: number } => {
  if (!step) return { list: [], capacity: 6 };
  const mem = step.memorySnapshot;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 6;
  if (Array.isArray(mem?.list)) return { list: mem.list, capacity: cap };
  if (typeof mem?.list === 'string') {
    try { return { list: JSON.parse(mem.list), capacity: cap }; } catch { return { list: [], capacity: cap }; }
  }
  const ev = step.animationEvent;
  if (ev?.listState) return { list: ev.listState, capacity: cap };
  return { list: [], capacity: cap };
};

// Simulated memory address helper
const getSimulatedAddress = (index: number) => `0x${(0x2040 + index * 8).toString(16).toUpperCase()}`;

export const DllVisualStage: React.FC = () => {
  const { currentStep, zoom } = useLesson();

  const { list: listItems, capacity: CAPACITY } = getListFromStep(currentStep);
  const ev = currentStep?.animationEvent as any;
  
  const isTraverseStep = ev?.type === 'SET_POINTERS' && typeof ev?.pointers?.curr === 'number';

  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? ev.indexA :
    isTraverseStep ? ev.pointers.curr :
    (typeof currentStep?.memorySnapshot?.i === 'number' ? currentStep.memorySnapshot.i : undefined);

  const isEmpty = listItems.length === 0;
  const isFull = listItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'DLL_DELETE' && isEmpty) || (currentStep?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-transparent flex items-center justify-center overflow-hidden relative px-6 py-6 select-none">

      {/* ── Center: Doubly Linked List Node Chain ── */}
      <div
        className="w-full h-full flex flex-col items-center justify-center relative transition-transform duration-200 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />
        <div className="flex flex-col items-center gap-6">

          {/* Alert Banners */}
          <AnimatePresence>
            {isFull && (
              <div className="px-3.5 py-1 bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold rounded-md animate-pulse shrink-0 shadow-lg">
                ⚠ DLL CAPACITY REACHED ({listItems.length}/{CAPACITY})
              </div>
            )}
            {isUnderflow && (
              <div className="px-3.5 py-1 bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold rounded-md animate-pulse shrink-0 shadow-lg">
                ⚠ UNDERFLOW: LINKED LIST IS EMPTY
              </div>
            )}
          </AnimatePresence>

          {/* Head & Tail Pointer Indicators */}
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 font-mono font-extrabold text-xs shadow-[0_0_12px_rgba(129,140,248,0.2)]">
              HEAD POINTER
            </span>
            <span className="text-indigo-400 font-mono text-sm font-black">⇄</span>
            <span className="px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-xs shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              TAIL POINTER
            </span>
          </div>

          {/* Node Chain */}
          {isEmpty ? (
            <div className="w-36 h-16 rounded-xl border-2 border-dashed border-slate-800/90 flex items-center justify-center bg-slate-950/70 text-slate-500 font-mono font-bold text-xs shadow-inner">
              NULL ⇄ HEAD ⇄ NULL
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-6xl">
              
              {/* Start NULL Badge */}
              <div className="flex flex-col items-center gap-1 pt-6">
                <span className="text-[10px] font-mono text-slate-500 font-bold">0x0000</span>
                <div className="px-3.5 py-3 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-300 font-mono font-black text-xs shadow-[0_0_12px_rgba(129,140,248,0.3)] tracking-wider">
                  NULL
                </div>
              </div>

              {/* Arrow From NULL */}
              <div className="flex items-center text-indigo-400 pt-3 drop-shadow-[0_0_10px_rgba(129,140,248,0.7)]">
                <ArrowLeftRight size={22} strokeWidth={2.5} />
              </div>

              {/* Nodes List */}
              {listItems.map((val, idx) => {
                const isHead = idx === 0;
                const isTail = idx === listItems.length - 1;
                const isTraverseTarget = isTraverseStep && idx === activeHighlight;
                const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
                const isFound = isSearch && (ev as any).result === 'found';

                const prevAddr = isHead ? 'NULL' : getSimulatedAddress(idx - 1);
                const nextAddr = isTail ? 'NULL' : getSimulatedAddress(idx + 1);

                return (
                  <React.Fragment key={idx}>
                    {/* Node Card Component */}
                    <div className="flex flex-col items-center gap-1">
                      
                      {/* Top Pointer Badge */}
                      <div className="h-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {isFound && (
                            <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} className="px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                              ✓ MATCH
                            </motion.span>
                          )}
                          {!isFound && isTraverseTarget && (
                            <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} className="px-2.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                              🔍 VISIT
                            </motion.span>
                          )}
                          {!isFound && !isTraverseTarget && isSearch && (
                            <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                              SCAN
                            </motion.span>
                          )}
                          {!isFound && !isTraverseTarget && !isSearch && isHead && isTail && (
                            <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} className="px-2.5 py-0.5 rounded bg-indigo-400 text-slate-950 font-mono font-black text-[10px] shadow-sm">
                              H & T
                            </motion.span>
                          )}
                          {!isFound && !isTraverseTarget && !isSearch && isHead && !isTail && (
                            <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} className="px-2.5 py-0.5 rounded bg-indigo-400 text-slate-950 font-mono font-black text-[10px] shadow-sm">
                              HEAD
                            </motion.span>
                          )}
                          {!isFound && !isTraverseTarget && !isSearch && !isHead && isTail && (
                            <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} className="px-2.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono font-black text-[10px] shadow-sm">
                              TAIL
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Memory Address Simulator Tag */}
                      <span className="text-[10px] font-mono text-indigo-400/90 font-extrabold">{getSimulatedAddress(idx)}</span>

                      {/* Node Box */}
                      <motion.div
                        layout
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                        className={`flex rounded-xl overflow-hidden border shadow-xl transition-all ${
                          isFound
                            ? 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                            : isTraverseTarget || isSearch
                            ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                            : isHead
                            ? 'border-indigo-400/80 shadow-[0_0_15px_rgba(129,140,248,0.2)]'
                            : 'border-slate-700/80'
                        }`}
                      >
                        {/* Prev Pointer Part */}
                        <div className="px-3 py-3 flex flex-col items-center justify-center bg-[#070b14] text-indigo-400 min-w-14 border-r border-slate-800">
                          <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-wider">prev</span>
                          <div className="mt-1 w-3.5 h-3.5 rounded-full bg-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(129,140,248,0.9)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          </div>
                          <span className="text-[9px] font-mono text-indigo-300 font-black mt-1 tracking-tight">{prevAddr}</span>
                        </div>

                        {/* Data Part */}
                        <div className="px-4 py-3 flex flex-col items-center justify-center min-w-16 bg-white text-slate-950 border-r border-slate-300">
                          <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">data</span>
                          <span className="font-mono font-black text-2xl text-slate-950 mt-0.5">{val}</span>
                        </div>

                        {/* Next Pointer Part */}
                        <div className="px-3.5 py-3 flex flex-col items-center justify-center bg-[#070b14] text-emerald-400 min-w-14">
                          <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-wider">next</span>
                          <div className="mt-1 w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.9)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          </div>
                          <span className="text-[9px] font-mono text-emerald-300 font-black mt-1 tracking-tight">{nextAddr}</span>
                        </div>
                      </motion.div>

                      {/* Index Label */}
                      <span className="text-xs font-mono font-extrabold text-slate-400 mt-0.5">[{idx}]</span>
                    </div>

                    {/* Bidirectional Arrow Pointer */}
                    <div className="flex items-center text-indigo-400 pt-3 drop-shadow-[0_0_10px_rgba(129,140,248,0.7)]">
                      <ArrowLeftRight size={24} strokeWidth={2.5} />
                    </div>
                  </React.Fragment>
                );
              })}

              {/* End NULL Badge */}
              <div className="flex flex-col items-center gap-1 pt-6">
                <span className="text-[10px] font-mono text-slate-500 font-bold">0x0000</span>
                <div className="px-3.5 py-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 font-mono font-black text-xs shadow-[0_0_12px_rgba(52,211,153,0.3)] tracking-wider">
                  NULL
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
