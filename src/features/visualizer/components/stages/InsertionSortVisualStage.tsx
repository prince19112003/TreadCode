import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';
import { Sparkles, ArrowDown, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const InsertionSortVisualStage: React.FC = () => {
  const currentStep = useLessonStore((state) => state.currentStep);
  const activeSteps = useLessonStore((state) => state.activeSteps);
  const currentStepIndex = useLessonStore((state) => state.currentStepIndex);

  // Extract step details
  const activeStepObj = currentStep || (activeSteps && activeSteps.length > 0 ? activeSteps[currentStepIndex] : null);
  const memory = activeStepObj?.memorySnapshot || {};
  const explanation = activeStepObj?.explanationEnglish || activeStepObj?.explanationHinglish || '';

  // Parse Array from Memory
  let arr: number[] = [12, 11, 13, 5, 6];
  if (memory.arr) {
    try {
      if (typeof memory.arr === 'string') {
        const cleaned = memory.arr.replace(/[\[\]]/g, '');
        if (cleaned.trim()) {
          arr = cleaned.split(',').map((v: string) => parseInt(v.trim(), 10)).filter((v: number) => !isNaN(v));
        }
      } else if (Array.isArray(memory.arr)) {
        arr = memory.arr;
      }
    } catch (e) {
      console.error('Error parsing array in InsertionSortVisualStage:', e);
    }
  }

  // Indices & Key
  const currentI = typeof memory.i === 'number' ? memory.i : -1;
  const currentJ = typeof memory.j === 'number' ? memory.j : -1;
  const keyVal = typeof memory.key === 'number' ? memory.key : null;

  // Determine step action state
  const isShiftStep = explanation.toLowerCase().includes('shift');
  const isInsertStep = explanation.toLowerCase().includes('insert');
  const isCompareStep = explanation.toLowerCase().includes('compare') || currentJ >= 0;
  const isSortedStep = explanation.toLowerCase().includes('complete') || currentStepIndex === (activeSteps?.length || 1) - 1;

  // Bar height calculation (min 70px, max 190px)
  const maxVal = Math.max(...arr, 1);
  const minVal = Math.min(...arr, 1);
  const getHeight = (val: number) => {
    if (maxVal === minVal) return 130;
    const norm = (val - minVal) / (maxVal - minVal);
    return Math.round(70 + norm * 120);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl relative overflow-hidden select-none">
      {/* Background ambient neon radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Header Info & State Badge */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shadow-lg shadow-indigo-500/10">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-white font-black tracking-wide text-base">INSERTION SORT VISUALIZER</h3>
            <p className="text-xs font-mono text-slate-400">O(N²) Time Complexity • Sequential Insertion</p>
          </div>
        </div>

        {/* Dynamic State Badge */}
        <div className="flex items-center gap-2">
          {isSortedStep ? (
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={14} /> ✓ ARRAY SORTED
            </div>
          ) : isInsertStep ? (
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-bounce">
              📥 INSERT KEY ({keyVal})
            </div>
          ) : isShiftStep ? (
            <div className="px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/20">
              ➡️ SHIFTING RIGHT: arr[{currentJ}] ({arr[currentJ]})
            </div>
          ) : isCompareStep ? (
            <div className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
              🔍 COMPARING arr[{currentJ}] with KEY ({keyVal})
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono font-bold text-xs">
              READY TO SORT
            </div>
          )}
        </div>
      </div>

      {/* Main Array Bars Graphic Container */}
      <div className="w-full flex-1 flex items-end justify-center gap-4 md:gap-6 my-6 z-10 px-4">
        <AnimatePresence mode="popLayout">
          {arr.map((val, idx) => {
            const isScanner = idx === currentJ && !isSortedStep;
            const isTargetKey = idx === currentI && !isSortedStep;
            const isSorted = isSortedStep || (currentI >= 0 && idx < currentI);
            const isShifting = isShiftStep && idx === currentJ;

            // Card Color Styling
            let bgClass = 'bg-linear-to-t from-slate-900 via-slate-800 to-slate-700 border-slate-700/80 text-slate-200';
            let glowShadow = '';
            let ringClass = '';

            if (isSorted) {
              bgClass = 'bg-linear-to-t from-emerald-950/90 via-emerald-800/90 to-emerald-600 border-emerald-400 text-white';
              glowShadow = 'shadow-[0_0_25px_rgba(16,185,129,0.3)]';
            } else if (isShifting) {
              bgClass = 'bg-linear-to-t from-rose-950 via-rose-800 to-rose-500 border-rose-400 text-white';
              glowShadow = 'shadow-[0_0_30px_rgba(244,63,94,0.5)]';
              ringClass = 'ring-4 ring-rose-500/40 animate-pulse';
            } else if (isScanner) {
              bgClass = 'bg-linear-to-t from-amber-950 via-amber-800 to-amber-500 border-amber-400 text-white';
              glowShadow = 'shadow-[0_0_25px_rgba(245,158,11,0.4)]';
              ringClass = 'ring-2 ring-amber-400';
            } else if (isTargetKey) {
              bgClass = 'bg-linear-to-t from-indigo-950 via-indigo-800 to-indigo-500 border-indigo-400 text-white';
              glowShadow = 'shadow-[0_0_25px_rgba(99,102,241,0.4)]';
            }

            const barHeight = getHeight(val);

            return (
              <motion.div
                key={`${idx}-${val}`}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="flex flex-col items-center gap-2 group flex-1 max-w-25"
              >
                {/* Pointer Tags Top Indicator */}
                <div className="h-10 flex flex-col items-center justify-end font-mono text-[11px] font-black tracking-wider">
                  {isShifting ? (
                    <span className="text-rose-400 flex items-center gap-1 animate-bounce">
                      <ArrowRight size={14} /> SHIFT
                    </span>
                  ) : isScanner ? (
                    <span className="text-amber-300 flex items-center gap-0.5">
                      <ArrowDown size={14} /> j
                    </span>
                  ) : isTargetKey ? (
                    <span className="text-indigo-300 flex items-center gap-0.5">
                      <ArrowDown size={14} /> KEY
                    </span>
                  ) : isSorted ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Lock size={12} />
                    </span>
                  ) : null}
                </div>

                {/* Vertical Bar Card */}
                <div
                  style={{ height: `${barHeight}px` }}
                  className={`w-full rounded-2xl border-2 flex flex-col items-center justify-between p-2.5 transition-all duration-300 ${bgClass} ${glowShadow} ${ringClass} relative overflow-hidden`}
                >
                  {/* Top value badge */}
                  <span className="text-2xl font-black font-mono drop-shadow-md text-slate-950 bg-white/95 px-2.5 py-0.5 rounded-xl shadow-sm">
                    {val}
                  </span>

                  {/* Lock icon for sorted elements */}
                  {isSorted && (
                    <span className="text-emerald-200/80 font-mono text-[10px] font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                      SORTED
                    </span>
                  )}
                </div>

                {/* Array Index Tag [0] */}
                <span className="font-mono text-xs font-extrabold text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-800 shadow-inner">
                  [{idx}]
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Step Explanation Note */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs font-mono z-10">
        <span className="text-slate-400">Step {currentStepIndex + 1} of {activeSteps?.length || 1}:</span>
        <span className="text-slate-100 font-bold truncate max-w-[80%]">
          {explanation || 'Select or enter array values to visualize Insertion Sort step-by-step.'}
        </span>
      </div>
    </div>
  );
};
