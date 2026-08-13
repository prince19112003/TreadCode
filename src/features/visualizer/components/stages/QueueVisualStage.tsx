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

  const { queue: queueItems, capacity: CAPACITY, front, rear } = getQueueFromStep(currentStep);
  const ev = currentStep?.animationEvent as any;

  const isPeekEvent = ev?.type === 'QUEUE_PEEK' || currentStep?.explanationEnglish?.includes('PEEK()');
  const isTraverseStep = ev?.type === 'SET_POINTERS' && typeof ev?.pointers?.curr === 'number';

  const activeHighlight: number | undefined =
    ev?.type === 'COMPARE_INDICES' ? ev.indexA :
    isTraverseStep ? ev.pointers.curr :
    (typeof currentStep?.memorySnapshot?.i === 'number' ? currentStep.memorySnapshot.i : undefined);

  const isEmpty = queueItems.length === 0;
  const isFull = queueItems.length >= CAPACITY;
  const isUnderflow = (ev?.type === 'QUEUE_DEQUEUE' && isEmpty) || (currentStep?.explanationEnglish?.includes('Underflow'));

  return (
    <div className="flex-1 w-full h-full bg-transparent flex items-center overflow-hidden relative px-6 py-6">

      {/* ── Extreme Far-Right Corner QUEUE STATUS Panel (Matches Stack Status Panel) ── */}
      <div className="absolute right-3 top-4 z-20 w-36 flex flex-col gap-1.5 font-mono text-[10px] text-white bg-slate-950/85 p-2 border border-slate-800/80 rounded shadow-xl">
        
        {/* Header */}
        <div className="flex items-center gap-1 font-black text-white uppercase text-[9px] tracking-wider border-b border-slate-800 pb-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-slate-500' : isFull ? 'bg-rose-400' : 'bg-cyan-400'}`} />
          <span className="text-white font-extrabold text-[10px]">QUEUE STATUS</span>
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
            <strong className="text-white font-bold">{queueItems.length}/{CAPACITY}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-800/50 pb-0.5">
            <span className="text-slate-400">FRONT Index:</span>
            <strong className="text-cyan-300 font-bold">{front}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-800/50 pb-0.5">
            <span className="text-slate-400">REAR Index:</span>
            <strong className="text-indigo-300 font-bold">{rear}</strong>
          </div>
        </div>

        {/* Active Items List */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            DATA (FRONT → REAR)
          </span>

          {queueItems.length === 0 ? (
            <span className="text-slate-500 text-[9px] italic">Empty</span>
          ) : (
            <div className="flex flex-col gap-0.5 max-h-24 overflow-y-auto">
              {queueItems.map((item: any, idx: number) => {
                const isFrontItem = idx === 0;
                const isRearItem = idx === queueItems.length - 1;
                return (
                  <div
                    key={idx}
                    className={`px-1.5 py-0.5 flex items-center justify-between rounded text-[9px] font-bold font-mono ${
                      isFrontItem
                        ? 'bg-cyan-400 text-slate-950 font-black'
                        : isRearItem
                        ? 'bg-indigo-400 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>[{idx}]</span>
                    <span className="font-bold">{item}</span>
                    {isFrontItem && <span className="text-[7px] uppercase font-black bg-slate-950 text-cyan-300 px-1">FRONT</span>}
                    {!isFrontItem && isRearItem && <span className="text-[7px] uppercase font-black bg-slate-950 text-indigo-300 px-1">REAR</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── Left / Center: Queue Visual Container (Inside Zoom Wrapper) ── */}
      <div
        className="w-full h-full flex flex-col items-center justify-center relative transition-transform duration-200 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <div className="flex flex-col items-center gap-4">

          {/* Direction Flow Label */}
          <div className="flex items-center justify-between w-full max-w-md text-[10px] font-mono text-slate-400 uppercase tracking-widest px-1">
            <span className="text-cyan-400 font-bold">◄ FRONT (EXIT)</span>
            <span className="text-slate-600 font-bold">FLOW ➔ ➔ ➔</span>
            <span className="text-indigo-400 font-bold">REAR (ENTRY) ►</span>
          </div>

          {/* Alert Banners */}
          <AnimatePresence>
            {isFull && (
              <div className="px-3 py-1 bg-rose-950 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold rounded-md animate-pulse shrink-0">
                ⚠ QUEUE OVERFLOW (FULL)
              </div>
            )}
            {isUnderflow && (
              <div className="px-3 py-1 bg-amber-950 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold rounded-md animate-pulse shrink-0">
                ⚠ QUEUE UNDERFLOW
              </div>
            )}
            {isPeekEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="font-mono font-black text-xs text-amber-400 flex items-center gap-1.5 shrink-0 tracking-wider"
              >
                <span>👁 PEEK FRONT ELEMENT = {queueItems[0]}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cyan Open Queue Container Frame */}
          <div className="flex items-center gap-3 p-3 border-y-4 border-cyan-400 bg-slate-950/90 shadow-2xl">
            {Array.from({ length: CAPACITY }).map((_, idx) => {
              const hasValue = idx < queueItems.length && queueItems[idx] !== undefined && queueItems[idx] !== null;
              const value = hasValue ? queueItems[idx] : null;

              const isFront = front !== -1 ? idx === front : (idx === 0 && hasValue);
              const isRear = rear !== -1 ? idx === rear : (idx === queueItems.length - 1 && hasValue);
              const isPeekTarget = isPeekEvent && isFront;
              const isTraverseTarget = isTraverseStep && idx === activeHighlight;
              const isSearch = ev?.type === 'COMPARE_INDICES' && idx === (ev as any).indexA;
              const isFound = isSearch && (ev as any).result === 'found';

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  
                  {/* Top Pointer Badge */}
                  <div className="h-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isFound && (
                        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-mono font-black text-xs shadow-md">
                          ✓ MATCH
                        </motion.span>
                      )}
                      {isPeekTarget && !isFound && (
                        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-xs shadow-lg">
                          👁 PEEK
                        </motion.span>
                      )}
                      {!isFound && !isPeekTarget && isTraverseTarget && (
                        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono font-black text-xs">
                          🔍 VISIT
                        </motion.span>
                      )}
                      {!isFound && !isPeekTarget && !isTraverseTarget && isSearch && (
                        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-xs">
                          SCAN
                        </motion.span>
                      )}
                      {!isFound && !isPeekTarget && !isTraverseTarget && !isSearch && isFront && isRear && (
                        <motion.span key="fr" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-purple-400 text-slate-950 font-mono font-black text-xs shadow-md">
                          F & R ▲
                        </motion.span>
                      )}
                      {!isFound && !isPeekTarget && !isTraverseTarget && !isSearch && isFront && !isRear && (
                        <motion.span key="f" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-sky-400 text-slate-950 font-mono font-black text-xs shadow-md">
                          FRONT ▲
                        </motion.span>
                      )}
                      {!isFound && !isPeekTarget && !isTraverseTarget && !isSearch && !isFront && isRear && (
                        <motion.span key="r" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="px-2 py-0.5 rounded bg-indigo-400 text-slate-950 font-mono font-black text-xs shadow-md">
                          REAR ▲
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Cell Box (Matching Stack's Solid White Block Aesthetic) */}
                  <div className="w-16 h-16 relative flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {hasValue ? (
                        <motion.div
                          key={`block-${idx}-${value}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
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
                              : isFront
                              ? 'bg-white text-slate-950 border-2 border-cyan-400'
                              : isRear
                              ? 'bg-white text-slate-950 border-2 border-indigo-400'
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

                  {/* Bottom Index Label */}
                  <span className="text-xs font-mono font-bold text-slate-400">[{idx}]</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};
