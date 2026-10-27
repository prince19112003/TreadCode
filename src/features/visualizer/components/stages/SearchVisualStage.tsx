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
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 custom-scrollbar select-none font-mono text-neutral-200">
      <div
        className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-6 py-3 transition-transform duration-150 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Top Status Bar (Consistent with Standard Layout) ── */}
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <div className="flex flex-wrap items-center justify-between w-full px-3 py-1.5 bg-[#080b13] border border-neutral-800 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[10.5px]">
              <span className="w-2 h-2 bg-cyan-400 inline-block" />
              <span>{isBinary ? 'BINARY SEARCH (DIVIDE & CONQUER)' : 'LINEAR SEARCH (SEQUENTIAL SCAN)'}</span>
            </div>

            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold">
                SIZE: {currentArray.length}
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-amber-500/50 text-amber-300 font-bold">
                TARGET: {target}
              </span>
              <span className={`px-2 py-0.5 border font-bold ${
                resultIndex !== -1
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400'
              }`}>
                {resultIndex !== -1 ? `FOUND AT [${resultIndex}]` : activeCheckIndex >= 0 ? `CHECKING [${activeCheckIndex}]` : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Floating Target Checker Box / Comparison Banner ── */}
        <div className="flex flex-col items-center justify-center min-h-16 w-full relative">
          <AnimatePresence mode="wait">
            {isBinary ? (
              /* Binary Search Comparison Card */
              midIdx >= 0 && midIdx < currentArray.length ? (
                <motion.div
                  key={`binary-step-${midIdx}-${lowIdx}-${highIdx}-${resultIndex}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex items-center gap-3 px-3 py-1 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
                    <span className="text-emerald-400 font-bold">low = {lowIdx}</span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-amber-300 font-bold">
                      mid = ⌊({lowIdx}+{highIdx})/2⌋ = {midIdx}
                    </span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-rose-400 font-bold">high = {highIdx}</span>
                  </div>

                  <div
                    className={`flex items-center gap-2.5 px-4 py-1.5 font-mono text-xs font-bold border ${
                      resultIndex === midIdx
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : currentArray[midIdx] < target
                        ? 'bg-blue-950 border-blue-500 text-blue-300'
                        : 'bg-purple-950 border-purple-500 text-purple-300'
                    }`}
                  >
                    <span>arr[{midIdx}] ({currentArray[midIdx]})</span>
                    <span className="text-neutral-400">
                      {resultIndex === midIdx ? '==' : currentArray[midIdx] < target ? '<' : '>'}
                    </span>
                    <span>Target ({target})</span>
                    {resultIndex === midIdx ? (
                      <span className="text-emerald-400 font-black ml-1.5">✓ MATCH</span>
                    ) : currentArray[midIdx] < target ? (
                      <span className="text-blue-300 font-black ml-1.5">➔ RIGHT (low={midIdx + 1})</span>
                    ) : (
                      <span className="text-purple-300 font-black ml-1.5">➔ LEFT (high={midIdx - 1})</span>
                    )}
                  </div>
                </motion.div>
              ) : resultIndex !== -1 ? (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold">
                  <span>✓ Target {target} found at index [{resultIndex}]</span>
                </div>
              ) : currentStepIndex === activeSteps.length - 1 && activeSteps.length > 1 ? (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-950 border border-rose-500 text-rose-300 font-mono text-xs font-bold">
                  <span>✗ Target {target} not found in array (-1)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-xs">
                  <span>Search Space: <strong className="text-emerald-400">low={lowIdx}</strong> to <strong className="text-rose-400">high={highIdx}</strong></span>
                </div>
              )
            ) : (
              /* Linear Search Comparison Card */
              activeCheckIndex >= 0 && activeCheckIndex < currentArray.length ? (
                <motion.div
                  key={`checker-${activeCheckIndex}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-2.5 px-4 py-1.5 font-mono text-xs font-bold border ${
                    resultIndex === activeCheckIndex
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950 border-rose-500 text-rose-300'
                  }`}
                >
                  <span>Target: {target}</span>
                  <span className="text-neutral-400">{resultIndex === activeCheckIndex ? '==' : '!='}</span>
                  <span className="text-white bg-black px-1.5 py-0.5 border border-neutral-700">
                    arr[{activeCheckIndex}] = {currentArray[activeCheckIndex]}
                  </span>
                  {resultIndex === activeCheckIndex ? (
                    <span className="text-emerald-400 font-black ml-1.5">✓ MATCH FOUND</span>
                  ) : (
                    <span className="text-rose-400 font-bold ml-1.5">✗ NO MATCH</span>
                  )}
                </motion.div>
              ) : resultIndex !== -1 ? (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold">
                  <span>✓ Target {target} found at index [{resultIndex}]</span>
                </div>
              ) : currentStepIndex === activeSteps.length - 1 && activeSteps.length > 1 ? (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-950 border border-rose-500 text-rose-300 font-mono text-xs font-bold">
                  <span>✗ Target {target} not found in array (-1)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-xs">
                  <span>Target: <strong className="text-amber-300 font-bold">{target}</strong></span>
                </div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* ── Contiguous Unified Array Grid (Sharp 90° Corners) ── */}
        <div className="flex flex-col items-center">
          {/* Main Array Block Container */}
          <div className="flex items-stretch border border-neutral-700 bg-[#05070e] shadow-md">
            {currentArray.map((val: number, idx: number) => {
              const isFound = resultIndex === idx;
              const isMid = isBinary && midIdx === idx;
              const isLinearChecking = !isBinary && activeCheckIndex === idx;
              const isEliminated = isBinary && lowIdx !== -1 && highIdx !== -1 && (idx < lowIdx || idx > highIdx);
              const isInSearchSpace = isBinary && lowIdx !== -1 && highIdx !== -1 && idx >= lowIdx && idx <= highIdx;

              let cellBg = 'bg-[#05070e]';
              let cellText = 'text-neutral-200';
              let cellBorder = 'border-r border-neutral-800';

              if (idx === currentArray.length - 1) {
                cellBorder = '';
              }

              if (isFound) {
                cellBg = 'bg-emerald-950';
                cellText = 'text-emerald-300 font-black';
              } else if (isMid) {
                cellBg = 'bg-amber-950';
                cellText = 'text-amber-300 font-black';
              } else if (isLinearChecking) {
                cellBg = 'bg-rose-950';
                cellText = 'text-rose-300 font-black';
              } else if (isInSearchSpace) {
                cellBg = 'bg-[#090d18]';
                cellText = 'text-white font-bold';
              } else if (isEliminated) {
                cellBg = 'bg-neutral-950/80';
                cellText = 'text-neutral-600 line-through opacity-40';
              }

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-center font-mono font-bold select-none transition-all duration-200 ${cellBorder} ${cellBg}`}
                  style={{
                    width: currentArray.length > 10 ? 44 : 56,
                    height: currentArray.length > 10 ? 46 : 58,
                  }}
                >
                  <span className={`text-base md:text-lg transition-colors ${cellText}`}>
                    {val}
                  </span>

                  {/* Active Indicator Arrow */}
                  {(isLinearChecking || (isBinary && isMid)) && (
                    <motion.div
                      layoutId="check-arrow"
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent z-20 ${
                        isFound ? 'border-t-emerald-400' : isBinary ? 'border-t-amber-400' : 'border-t-rose-400'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Indices Row & Pointer Markers */}
          <div className="flex items-center">
            {currentArray.map((_: number, idx: number) => {
              const isFound = resultIndex === idx;
              const isMid = isBinary && idx === midIdx;
              const isLow = isBinary && idx === lowIdx;
              const isHigh = isBinary && idx === highIdx;
              const isLinearChecking = !isBinary && activeCheckIndex === idx;

              let indexColor = 'text-neutral-500';
              if (isFound) indexColor = 'text-emerald-400 font-black';
              else if (isMid) indexColor = 'text-amber-300 font-black';
              else if (isLow) indexColor = 'text-emerald-400 font-bold';
              else if (isHigh) indexColor = 'text-rose-400 font-bold';
              else if (isLinearChecking) indexColor = 'text-rose-400 font-bold';

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center pt-2 font-mono"
                  style={{
                    width: currentArray.length > 10 ? 44 : 56,
                  }}
                >
                  <span className={`text-[11px] ${indexColor}`}>[{idx}]</span>

                  {/* Binary Search Badges */}
                  {isBinary && (
                    <div className="min-h-6 flex flex-col items-center justify-start gap-0.5 mt-1 font-mono text-[9px] font-black">
                      {isMid && (
                        <span className="px-1 py-0.2 bg-amber-400 text-neutral-950">
                          MID
                        </span>
                      )}
                      {isLow && (
                        <span className="px-1 py-0.2 bg-emerald-950 border border-emerald-400 text-emerald-300">
                          LOW
                        </span>
                      )}
                      {isHigh && (
                        <span className="px-1 py-0.2 bg-rose-950 border border-rose-400 text-rose-300">
                          HIGH
                        </span>
                      )}
                    </div>
                  )}

                  {/* Linear Search Badges */}
                  {!isBinary && (
                    <div className="min-h-6 flex flex-col items-center justify-start gap-0.5 mt-1 font-mono text-[9px] font-black">
                      {isLinearChecking && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`px-1.5 py-0.5 text-[9px] font-black tracking-wide ${
                            isFound
                              ? 'bg-emerald-500 text-neutral-950'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {isFound ? '✓ MATCH' : `i = ${idx}`}
                        </motion.span>
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
