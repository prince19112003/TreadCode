import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';

const getArrayStateFromStep = (step: any): {
  arr: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sortedIndices: number[];
  passNum: number;
  totalSwaps: number;
} => {
  if (!step) {
    return { arr: [64, 34, 25, 12, 22], comparing: null, swapping: null, sortedIndices: [], passNum: 1, totalSwaps: 0 };
  }
  const mem = step.memorySnapshot || {};
  let arr: number[] = [64, 34, 25, 12, 22];
  if (Array.isArray(mem.arr)) {
    arr = mem.arr;
  } else if (typeof mem.arr === 'string') {
    try {
      const parsed = JSON.parse(mem.arr);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      // fallback
    }
  }

  const ev = step.animationEvent || {};
  let comparing: [number, number] | null = null;
  let swapping: [number, number] | null = null;

  if (ev.type === 'COMPARE_INDICES' && typeof ev.indexA === 'number' && typeof ev.indexB === 'number') {
    comparing = [ev.indexA, ev.indexB];
  } else if (mem.comparing && Array.isArray(mem.comparing)) {
    comparing = [mem.comparing[0], mem.comparing[1]];
  }

  if (ev.type === 'SWAP' && typeof ev.indexA === 'number' && typeof ev.indexB === 'number') {
    swapping = [ev.indexA, ev.indexB];
  } else if (mem.swapping && Array.isArray(mem.swapping)) {
    swapping = [mem.swapping[0], mem.swapping[1]];
  }

  const sortedIndices: number[] = Array.isArray(mem.sortedIndices) ? mem.sortedIndices : [];
  const passNum: number = typeof mem.pass === 'number' ? mem.pass : 1;
  const totalSwaps: number = typeof mem.swapsCount === 'number' ? mem.swapsCount : 0;

  return { arr, comparing, swapping, sortedIndices, passNum, totalSwaps };
};

export const BubbleSortVisualStage: React.FC = () => {
  const { currentStep, zoom } = useLesson();

  const { arr, comparing, swapping, sortedIndices, passNum, totalSwaps } = getArrayStateFromStep(currentStep);

  const maxVal = Math.max(...arr, 100);

  return (
    <div className="flex-1 w-full h-full bg-transparent flex items-center justify-center overflow-hidden relative px-6 py-6 select-none">
      <div
        className="w-full h-full flex flex-col items-center justify-center relative transition-transform duration-200 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <div className="flex flex-col items-center gap-8 max-w-5xl w-full">

          {/* Top Info Bar */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 px-5 py-2 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-300">
                PASS {passNum}
              </span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Total Swaps:</span>
              <span className="text-rose-400 font-extrabold">{totalSwaps}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Sorted Locked:</span>
              <span className="text-emerald-400 font-extrabold">{sortedIndices.length}/{arr.length}</span>
            </div>
          </div>

          {/* Array Visual Columns */}
          <div className="flex items-end justify-center gap-4 min-h-72 w-full pt-10 pb-4 px-4">
            {arr.map((val, idx) => {
              const isComparing = comparing && (comparing[0] === idx || comparing[1] === idx);
              const isSwapping = swapping && (swapping[0] === idx || swapping[1] === idx);
              const isSorted = sortedIndices.includes(idx);
              const heightPercent = Math.max(35, Math.min(100, (val / maxVal) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-2 relative">

                  {/* Top Pointer Badges */}
                  <div className="h-8 flex flex-col items-center justify-end">
                    <AnimatePresence mode="wait">
                      {isSwapping && (
                        <motion.span
                          initial={{ opacity: 0, y: -6, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.8 }}
                          className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_12px_rgba(244,63,94,0.8)]"
                        >
                          SWAP ⇄
                        </motion.span>
                      )}
                      {!isSwapping && isComparing && (
                        <motion.span
                          initial={{ opacity: 0, y: -6, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.8 }}
                          className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                        >
                          {comparing[0] === idx ? 'j' : 'j+1'}
                        </motion.span>
                      )}
                      {!isSwapping && !isComparing && isSorted && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-mono font-black text-[10px] shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        >
                          ✓ SORTED
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bar / Node Card */}
                  <motion.div
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: isSwapping ? 1.08 : isComparing ? 1.04 : 1,
                      opacity: 1,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ height: `${heightPercent * 2.2}px` }}
                    className={`w-20 md:w-24 rounded-2xl flex flex-col items-center justify-between p-3 border-2 shadow-2xl transition-colors duration-200 ${
                      isSwapping
                        ? 'border-rose-400 bg-rose-950/80 shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                        : isComparing
                        ? 'border-amber-400 bg-amber-950/80 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                        : isSorted
                        ? 'border-emerald-400 bg-emerald-950/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                        : 'border-slate-800 bg-slate-900/90'
                    }`}
                  >
                    {/* Value Badge inside top */}
                    <div className="w-full text-center">
                      <span className="text-[10px] font-mono text-slate-400 font-bold block uppercase tracking-wider">VAL</span>
                    </div>

                    {/* Main Value Number */}
                    <div className="w-full py-1 text-center bg-white rounded-xl shadow-inner my-auto">
                      <span className="font-mono font-black text-2xl text-slate-950 tracking-tight">{val}</span>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="w-full text-center">
                      <span className="text-[9px] font-mono text-slate-400 font-extrabold block">
                        {isSorted ? 'LOCKED' : isComparing ? 'COMPARE' : isSwapping ? 'SWAPPING' : 'UNSORTED'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Index Tag below card */}
                  <span className="text-xs font-mono font-extrabold text-slate-400 mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>

          {/* Legend Footer */}
          <div className="flex items-center gap-6 font-mono text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md border-2 border-amber-400 bg-amber-950/80" />
              <span>Comparing Pair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md border-2 border-rose-400 bg-rose-950/80" />
              <span>Swapping Pair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-md border-2 border-emerald-400 bg-emerald-950/50" />
              <span>Sorted & Locked</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
