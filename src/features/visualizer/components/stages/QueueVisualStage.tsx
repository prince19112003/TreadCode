import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';

const getQueueFromStep = (step: any): { queue: (string | number)[]; capacity: number; front: number; rear: number } => {
  if (!step) return { queue: [], capacity: 4, front: -1, rear: -1 };
  const mem = step.memorySnapshot;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 4;
  const f = typeof mem?.front === 'number' ? mem.front : -1;
  const r = typeof mem?.rear === 'number' ? mem.rear : -1;
  if (Array.isArray(mem?.queue)) return { queue: mem.queue, capacity: cap, front: f, rear: r };
  if (typeof mem?.queue === 'string') {
    try { return { queue: JSON.parse(mem.queue), capacity: cap, front: f, rear: r }; } catch { return { queue: [], capacity: cap, front: f, rear: r }; }
  }
  const ev = step.animationEvent;
  if (ev?.type === 'QUEUE_ENQUEUE' || ev?.type === 'QUEUE_DEQUEUE') {
    return { queue: (ev as any).queueState ?? [], capacity: cap, front: f, rear: r };
  }
  return { queue: [], capacity: cap, front: f, rear: r };
};

export const QueueVisualStage: React.FC = () => {
  const { currentStep, zoom } = useLesson();

  const { queue: queueItems, capacity: CAPACITY } = getQueueFromStep(currentStep);
  const ev = currentStep?.animationEvent as any;
  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? ev.indexA :
    ev?.pointers?.curr ?? (typeof currentStep?.memorySnapshot?.i === 'number' ? currentStep.memorySnapshot.i : undefined);

  const isEmpty = queueItems.length === 0;
  const isFull = queueItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'QUEUE_DEQUEUE' && isEmpty) || (currentStep?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-[#060814] flex flex-col items-center justify-start overflow-auto relative py-8 px-4">
      <div
        className="flex flex-col items-center gap-6 my-auto transition-transform duration-200 ease-out origin-top"
        style={{ transform: `scale(${zoom})` }}
      >

        {/* Header Label */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
          <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-cyan-400/90">
            Queue (FIFO) — Capacity {CAPACITY}
          </span>
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {isFull && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-[11px] font-mono font-black tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              OVERFLOW WARNING: QUEUE IS FULL ({queueItems.length}/{CAPACITY})
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
              UNDERFLOW WARNING: CANNOT DEQUEUE FROM EMPTY QUEUE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Direction Flow Labels */}
        <div className="flex items-center justify-between w-full max-w-xl text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">
          <span>◄ FRONT (DEQUEUE EXIT)</span>
          <span>REAR (ENQUEUE ENTRY) ►</span>
        </div>

        {/* Main Horizontal Queue Container */}
        <div className="relative flex items-center gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {Array.from({ length: CAPACITY }).map((_, idx) => {
            const hasValue = idx < queueItems.length && queueItems[idx] !== undefined;
            const value = hasValue ? queueItems[idx] : null;
            const isFront = idx === 0 && hasValue;
            const isRear = idx === queueItems.length - 1 && hasValue;
            const isHighlighted = idx === activeHighlight;
            const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
            const isFound = isSearch && (ev as any).result === 'found';

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                {/* Pointer Top Badges */}
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence>
                    {isFound && (
                      <motion.span initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }} className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 text-[9px] font-mono font-bold">
                        FOUND
                      </motion.span>
                    )}
                    {!isFound && (isHighlighted || isSearch) && (
                      <motion.span initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }} className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                        SCAN
                      </motion.span>
                    )}
                    {!isHighlighted && !isSearch && isFront && isRear && (
                      <motion.span key="front-rear" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }} className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold">
                        F & R
                      </motion.span>
                    )}
                    {!isHighlighted && !isSearch && isFront && !isRear && (
                      <motion.span key="front" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }} className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">
                        FRONT ▼
                      </motion.span>
                    )}
                    {!isHighlighted && !isSearch && !isFront && isRear && (
                      <motion.span key="rear" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }} className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold">
                        REAR ▼
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Queue Cell Box */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cell-${idx}-${hasValue ? 'filled' : 'empty'}`}
                    initial={hasValue ? { scale: 0.8, opacity: 0 } : { opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono font-bold text-base border transition-all duration-300 ${
                      isFound
                        ? 'bg-green-500/20 border-green-500/50 text-green-300 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]'
                        : isHighlighted || isSearch
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]'
                        : isFront
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]'
                        : isRear
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]'
                        : hasValue
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/40 text-slate-800'
                    }`}
                  >
                    {hasValue ? value : <span className="text-[10px] text-slate-800 select-none">Ø</span>}
                  </motion.div>
                </AnimatePresence>

                {/* Index Bottom Label */}
                <span className="text-[10px] font-mono text-slate-600 font-bold">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-slate-500' : queueItems.length >= CAPACITY ? 'bg-red-500' : 'bg-cyan-500'}`} />
            <span className="text-slate-500">
              {isEmpty ? 'Empty' : queueItems.length >= CAPACITY ? 'Full' : 'Active'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">Size: <span className="text-slate-300 font-bold">{queueItems.length}/{CAPACITY}</span></span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">FRONT: <span className="text-cyan-300 font-bold">{isEmpty ? -1 : 0}</span></span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">REAR: <span className="text-indigo-300 font-bold">{isEmpty ? -1 : queueItems.length - 1}</span></span>
        </div>

      </div>
    </div>
  );
};
