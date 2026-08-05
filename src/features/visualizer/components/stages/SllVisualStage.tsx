import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';
import { ArrowRight } from 'lucide-react';

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

export const SllVisualStage: React.FC = () => {
  const { currentStep, zoom } = useLesson();

  const { list: listItems, capacity: CAPACITY } = getListFromStep(currentStep);
  const ev = currentStep?.animationEvent as any;
  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? ev.indexA :
    ev?.pointers?.curr ?? (typeof currentStep?.memorySnapshot?.i === 'number' ? currentStep.memorySnapshot.i : undefined);

  const isEmpty = listItems.length === 0;
  const isFull = listItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'SLL_DELETE' && isEmpty) || (currentStep?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-[#060814] flex flex-col items-center justify-start overflow-auto relative py-8 px-4">
      <div
        className="flex flex-col items-center gap-6 my-auto transition-transform duration-200 ease-out origin-top"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-emerald-400/90">
            Singly Linked List — Capacity {CAPACITY}
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {isFull && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-[11px] font-mono font-black tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              MAX CAPACITY REACHED ({listItems.length}/{CAPACITY})
            </motion.div>
          )}
          {isUnderflow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[11px] font-mono font-black tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              UNDERFLOW: LIST IS EMPTY
            </motion.div>
          )}
        </AnimatePresence>

        {/* Linked List Chain */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4 max-w-4xl">
          {/* Head Pointer Label */}
          <div className="flex flex-col items-center gap-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">
              HEAD
            </span>
            <div className="text-slate-600 text-xs">▼</div>
          </div>

          {isEmpty ? (
            <div className="w-16 h-12 rounded-xl border border-dashed border-slate-800 flex items-center justify-center bg-slate-950/20 text-slate-700 text-xs font-mono">
              NULL
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {listItems.map((val, idx) => {
                const isHighlighted = idx === activeHighlight;
                const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
                const isFound = isSearch && (ev as any).result === 'found';

                return (
                  <React.Fragment key={idx}>
                    {/* Node block */}
                    <motion.div
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={`flex rounded-xl overflow-hidden border transition-all duration-300 ${
                        isFound
                          ? 'border-green-500 bg-green-950/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : isHighlighted || isSearch
                          ? 'border-amber-500 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'border-slate-800 bg-slate-900/90'
                      }`}
                    >
                      {/* Left: Value Part */}
                      <div className="px-4 py-2.5 flex flex-col items-center justify-center min-w-12 border-r border-slate-800/40">
                        <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
                        <span className="font-mono font-black text-slate-200">{val}</span>
                      </div>
                      {/* Right: Next Pointer Part */}
                      <div className="px-2.5 py-2.5 flex flex-col items-center justify-center bg-slate-950/60 min-w-8">
                        <span className="text-[8px] font-mono text-slate-600">next</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-emerald-300" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Arrow Pointer */}
                    <div className="flex items-center text-emerald-500/60">
                      <ArrowRight size={16} />
                    </div>
                  </React.Fragment>
                );
              })}

              {/* End NULL Badge */}
              <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-500 text-[10px] font-mono font-bold">
                NULL
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-slate-500' : isFull ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-slate-500">{isEmpty ? 'Empty' : isFull ? 'Full' : 'Active'}</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Size: <span className="text-slate-300 font-bold">{listItems.length}/{CAPACITY}</span></span>
        </div>
      </div>
    </div>
  );
};
