import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

export const SearchVisualStage: React.FC = () => {
  const currentStepIndex = useLessonStore((s: any) => s.currentStepIndex);
  const activeSteps = useLessonStore((s: any) => s.activeSteps) || [];
  const zoom = useLessonStore((s: any) => s.zoom) || 1;
  const lesson = useLessonStore((s: any) => s.lesson);

  const isBinary = lesson?.topic === 'binary_search' || lesson?.id === 'dsa_binary_search';
  const currentStep = activeSteps[currentStepIndex] || activeSteps[0] || {};
  const mem = currentStep?.memorySnapshot || {};

  // Extract array data
  const currentArray = useMemo(() => {
    if (mem.arr) {
      if (Array.isArray(mem.arr)) return mem.arr as number[];
      if (typeof mem.arr === 'string') {
        try {
          const cleaned = mem.arr.replace(/^\[|\]$/g, '').trim();
          if (cleaned) return cleaned.split(',').map((s: string) => Number(s.trim()));
        } catch {
          // ignore
        }
      }
    }
    return [12, 25, 34, 41, 56, 63, 78, 82, 90, 99];
  }, [mem.arr]);

  const target = mem.target !== undefined ? Number(mem.target) : 78;
  const resultIndex = mem.result !== undefined ? Number(mem.result) : -1;
  const currentIdx = mem.i !== undefined ? Number(mem.i) : -1;
  const lowIdx = mem.low !== undefined ? Number(mem.low) : -1;
  const highIdx = mem.high !== undefined ? Number(mem.high) : -1;
  const midIdx = mem.mid !== undefined ? Number(mem.mid) : -1;

  // Active target floating check position index
  const activeCheckIndex = isBinary ? midIdx : currentIdx;

  return (
    <div className="flex-1 w-full h-full bg-[#050711] flex flex-col items-center justify-center overflow-auto p-6 select-none relative">
      <div
        className="relative flex flex-col items-center justify-center gap-12 transition-transform duration-200 ease-out py-8 max-w-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Floating Target Checker Box / Comparison Banner ── */}
        <div className="flex flex-col items-center justify-center min-h-20 w-full relative">
          <AnimatePresence mode="wait">
            {isBinary ? (
              /* Binary Search Dedicated Header & Comparison */
              midIdx >= 0 && midIdx < currentArray.length ? (
                <motion.div
                  key={`binary-step-${midIdx}-${lowIdx}-${highIdx}-${resultIndex}`}
                  initial={{ opacity: 0, y: -14, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Pointers & Formula Pill */}
                  <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-md">
                    <span className="text-emerald-400 font-bold">low = {lowIdx}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-300 font-extrabold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      mid = ⌊({lowIdx}+{highIdx})/2⌋ = {midIdx}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-rose-400 font-bold">high = {highIdx}</span>
                  </div>

                  {/* Comparison Logic Card */}
                  <div
                    className={`flex items-center gap-2.5 px-5 py-2 rounded-xl font-mono text-sm font-black border backdrop-blur-md shadow-2xl ${
                      resultIndex === midIdx
                        ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.6)]'
                        : currentArray[midIdx] < target
                        ? 'bg-blue-950/95 border-blue-400/90 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                        : 'bg-purple-950/95 border-purple-400/90 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    }`}
                  >
                    <span>arr[mid={midIdx}] ({currentArray[midIdx]})</span>
                    <span className="text-slate-300">
                      {resultIndex === midIdx ? '==' : currentArray[midIdx] < target ? '<' : '>'}
                    </span>
                    <span>Target ({target})</span>

                    {resultIndex === midIdx ? (
                      <span className="text-emerald-400 font-extrabold ml-1.5">
                        ✓ Found at Index [{midIdx}]
                      </span>
                    ) : currentArray[midIdx] < target ? (
                      <span className="text-blue-300 font-extrabold ml-1.5">
                        ➔ Move RIGHT (low = {midIdx + 1})
                      </span>
                    ) : (
                      <span className="text-purple-300 font-extrabold ml-1.5">
                        ➔ Move LEFT (high = {midIdx - 1})
                      </span>
                    )}
                  </div>
                </motion.div>
              ) : resultIndex !== -1 ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-sm font-black shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <span>✓ Target {target} found at Index [{resultIndex}]</span>
                </div>
              ) : currentStepIndex === activeSteps.length - 1 && activeSteps.length > 1 ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-300 font-mono text-sm font-black shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                  <span>✗ Target {target} Not Found in Array (-1)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 font-mono text-xs">
                  <span>Binary Search Range: <strong className="text-emerald-400">low={lowIdx}</strong> to <strong className="text-rose-400">high={highIdx}</strong> | Target: <strong className="text-amber-300">{target}</strong></span>
                </div>
              )
            ) : (
              /* Linear Search Standard Single Step Check */
              activeCheckIndex >= 0 && activeCheckIndex < currentArray.length ? (
                <motion.div
                  key={`checker-${activeCheckIndex}`}
                  initial={{ opacity: 0, y: -16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-sm font-black border backdrop-blur-md shadow-2xl ${
                    resultIndex === activeCheckIndex
                      ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.6)]'
                      : 'bg-rose-950/95 border-rose-500/90 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                  }`}
                >
                  <span>Target: {target}</span>
                  <span className="text-slate-400">==</span>
                  <span className="text-white bg-black/50 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                    <span className="text-slate-400 text-xs">arr[{activeCheckIndex}]:</span>
                    <span>{currentArray[activeCheckIndex]}</span>
                  </span>
                  {resultIndex === activeCheckIndex ? (
                    <span className="text-emerald-400 font-extrabold ml-1.5 flex items-center gap-1">
                      ✓ Found at Index [{activeCheckIndex}]
                    </span>
                  ) : (
                    <span className="text-rose-400 font-extrabold ml-1.5">
                      ✗ (arr[{activeCheckIndex}] != {target})
                    </span>
                  )}
                </motion.div>
              ) : resultIndex !== -1 ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-mono text-sm font-black shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <span>✓ Target {target} found at Index [{resultIndex}]</span>
                </div>
              ) : currentStepIndex === activeSteps.length - 1 && activeSteps.length > 1 ? (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-300 font-mono text-sm font-black shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                  <span>✗ Target {target} Not Found in Array (-1)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 font-mono text-xs">
                  <span>Target: <strong className="text-amber-300 text-sm font-bold">{target}</strong></span>
                </div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* ── Contiguous Unified Array Grid ── */}
        <div className="flex flex-col items-center">
          
          {/* Main Array Block Container */}
          <div className="flex items-stretch border-2 border-slate-700/80 bg-[#080b18] shadow-2xl overflow-hidden rounded-md">
            {currentArray.map((val: number, idx: number) => {
              const isFound = resultIndex === idx;
              const isMid = isBinary && midIdx === idx;
              const isLinearChecking = !isBinary && activeCheckIndex === idx;
              const isEliminated = isBinary && lowIdx !== -1 && highIdx !== -1 && (idx < lowIdx || idx > highIdx);
              const isInSearchSpace = isBinary && lowIdx !== -1 && highIdx !== -1 && idx >= lowIdx && idx <= highIdx;

              // Cell Background & Border Colors
              let cellBg = 'bg-[#080b18]';
              let cellText = 'text-slate-200';
              let cellBorder = 'border-r border-slate-700/80';

              if (idx === currentArray.length - 1) {
                cellBorder = ''; // no right border on last element
              }

              if (isFound) {
                cellBg = 'bg-[#064e3b] shadow-[inset_0_0_16px_rgba(52,211,153,0.5)]';
                cellText = 'text-[#34d399] font-black';
              } else if (isMid) {
                // Binary Mid element
                cellBg = 'bg-amber-950/80 shadow-[inset_0_0_16px_rgba(245,158,11,0.5)]';
                cellText = 'text-amber-300 font-black';
              } else if (isLinearChecking) {
                // Linear mismatch
                cellBg = 'bg-[#4c0519] shadow-[inset_0_0_15px_rgba(244,63,94,0.4)]';
                cellText = 'text-[#fb7185] font-black';
              } else if (isInSearchSpace) {
                // Active search partition window
                cellBg = 'bg-[#0c1228]';
                cellText = 'text-white font-bold';
              } else if (isEliminated) {
                // Discarded half
                cellBg = 'bg-[#03050d]/90';
                cellText = 'text-slate-700 line-through opacity-40';
              }

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-center font-mono font-bold select-none transition-all duration-300 ${cellBorder} ${cellBg}`}
                  style={{
                    width: currentArray.length > 10 ? 44 : 58,
                    height: currentArray.length > 10 ? 46 : 60,
                  }}
                >
                  <span className={`text-base md:text-lg transition-colors ${cellText}`}>
                    {val}
                  </span>

                  {/* Active Indicator Arrow Pointing at checking element */}
                  {(isLinearChecking || (isBinary && isMid)) && (
                    <motion.div
                      layoutId="check-arrow"
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                        isFound ? 'border-t-emerald-400' : isBinary ? 'border-t-amber-400' : 'border-t-rose-400'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Indices Row & Binary Pointer Markers Directly Underneath */}
          <div className="flex items-center">
            {currentArray.map((_: number, idx: number) => {
              const isFound = resultIndex === idx;
              const isMid = isBinary && idx === midIdx;
              const isLow = isBinary && idx === lowIdx;
              const isHigh = isBinary && idx === highIdx;
              const isLinearChecking = !isBinary && activeCheckIndex === idx;

              let indexColor = 'text-slate-600';
              if (isFound) {
                indexColor = 'text-emerald-400 font-black';
              } else if (isMid) {
                indexColor = 'text-amber-300 font-black';
              } else if (isLow) {
                indexColor = 'text-emerald-400 font-bold';
              } else if (isHigh) {
                indexColor = 'text-rose-400 font-bold';
              } else if (isLinearChecking) {
                indexColor = 'text-rose-400 font-bold';
              }

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center pt-2 font-mono"
                  style={{
                    width: currentArray.length > 10 ? 44 : 58,
                  }}
                >
                  <span className={`text-[11px] ${indexColor}`}>[{idx}]</span>
                  
                  {/* Binary Search pointer badges (LOW, MID, HIGH) */}
                  {isBinary && (
                    <div className="min-h-6 flex flex-col items-center justify-start gap-0.5 mt-1 font-mono text-[9px] font-black">
                      {isMid && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                          MID
                        </span>
                      )}
                      {isLow && (
                        <span className="px-1 py-0.2 rounded bg-emerald-950 border border-emerald-400 text-emerald-300">
                          LOW
                        </span>
                      )}
                      {isHigh && (
                        <span className="px-1 py-0.2 rounded bg-rose-950 border border-rose-400 text-rose-300">
                          HIGH
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
