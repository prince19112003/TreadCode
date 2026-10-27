import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

const ARRAY_1D_DEFAULT_ADDR: number[] = [10, 25, 42, 68, 85, 99];
const MATRIX_2D_DEFAULT_ADDR: number[][] = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
];
const DEFAULT_8_ARR: number[] = [42, 17, 89, 5, 63, 28, 94, 31];

export const ArrayVisualStage: React.FC = () => {
  const lesson = useLessonStore((s: any) => s.lesson);
  const currentStepIndex = useLessonStore((s: any) => s.currentStepIndex);
  const activeSteps = useLessonStore((s: any) => s.activeSteps) || [];
  const zoom = useLessonStore((s: any) => s.zoom) || 1;

  const stepIdx = Math.min(currentStepIndex, Math.max(0, activeSteps.length - 1));
  const currentStep = activeSteps[stepIdx] || activeSteps[0] || {};
  const mem = currentStep?.memorySnapshot || {};

  const isMinMaxLesson = mem.type === 'min_max' || lesson?.id === 'dsa_array_max_min';
  const isReverseLesson = mem.type === 'reverse' || lesson?.id === 'dsa_array_reverse';
  const isCountLesson = mem.type === 'count' || lesson?.id === 'dsa_array_count';

  /* ─────────────────────────────────────────────────────────────
     A. MIN & MAX VISUALIZER (Static 8 elements, 1D & 2D)
  ───────────────────────────────────────────────────────────── */
  if (isMinMaxLesson) {
    const dim = (mem.dim ?? '1D') as '1D' | '2D';
    const arr8: number[] = (mem.arr as number[]) || DEFAULT_8_ARR;
    const currentIdx = mem.currentIdx ?? 0;
    const minVal = Number(mem.minVal ?? arr8[0]);
    const maxVal = Number(mem.maxVal ?? arr8[0]);
    const minIdx = Number(mem.minIdx ?? 0);
    const maxIdx = Number(mem.maxIdx ?? 0);
    const stage = String(mem.stage ?? 'scan');
    const isComplete = stage === 'complete';

    // 2D grid matrix 2x4
    const matrix2D: number[][] = (mem.matrix2D as number[][]) || [
      arr8.slice(0, 4),
      arr8.slice(4, 8),
    ];

    return (
      <div className="flex-1 min-h-0 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto custom-scrollbar p-3 select-none relative font-mono text-neutral-200">
        <div
          className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-4 transition-transform duration-150 ease-out py-3"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

          {/* ── Top Status Banner ── */}
          <div className="flex flex-col items-center gap-2 max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 bg-[#090c16] border border-neutral-800 text-xs shadow-lg">
              <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-bold text-[10px]">
                SIZE: 8
              </span>
              <span className={`px-2 py-0.5 font-bold text-[10px] border ${
                dim === '1D'
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                  : 'bg-purple-950/80 border-purple-500/60 text-purple-300'
              }`}>
                {dim === '1D' ? '1D ARRAY' : '2D MATRIX (2 x 4)'}
              </span>

              {/* Scanning status */}
              {!isComplete && currentIdx >= 0 && (
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-950/60 border border-amber-500/70 text-amber-300 font-bold text-[10px]">
                  <span>SCANNING:</span>
                  <strong className="text-white">
                    {dim === '1D'
                      ? `A[${currentIdx}] = ${arr8[currentIdx]}`
                      : `A[${Math.floor(currentIdx / 4)}][${currentIdx % 4}] = ${arr8[currentIdx]}`}
                  </strong>
                </span>
              )}

              {/* Current MIN */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/90 border border-cyan-400 text-cyan-200 font-bold text-[11px] shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <span className="text-[9px] text-cyan-400 uppercase tracking-wider">MIN:</span>
                <span className="text-white font-black">{minVal}</span>
                <span className="text-[9px] text-cyan-400">
                  {dim === '1D' ? `[${minIdx}]` : `[${Math.floor(minIdx / 4)}][${minIdx % 4}]`}
                </span>
              </div>

              {/* Current MAX */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-950/90 border border-rose-400 text-rose-200 font-bold text-[11px] shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <span className="text-[9px] text-rose-400 uppercase tracking-wider">MAX:</span>
                <span className="text-white font-black">{maxVal}</span>
                <span className="text-[9px] text-rose-400">
                  {dim === '1D' ? `[${maxIdx}]` : `[${Math.floor(maxIdx / 4)}][${maxIdx % 4}]`}
                </span>
              </div>
            </div>

            {/* Animated Explanation highlight message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`minmax-msg-${stepIdx}-${currentIdx}-${minVal}-${maxVal}-${stage}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className={`px-4 py-1.5 text-xs font-bold border transition-colors ${
                  isComplete
                    ? 'bg-[#061510] border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : mem.updatedMin
                    ? 'bg-[#042832] border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : mem.updatedMax
                    ? 'bg-[#350d1a] border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-[#0b0f1a] border-neutral-700 text-neutral-200'
                }`}
              >
                {isComplete ? (
                  <span>
                    COMPLETE: Minimum = <strong className="text-cyan-300">{minVal}</strong> at index [
                    {dim === '1D' ? minIdx : `${Math.floor(minIdx / 4)}][${minIdx % 4}`}] | Maximum ={' '}
                    <strong className="text-rose-300">{maxVal}</strong> at index [
                    {dim === '1D' ? maxIdx : `${Math.floor(maxIdx / 4)}][${maxIdx % 4}`}]
                  </span>
                ) : stage === 'init' ? (
                  <span>
                    INITIALIZE: Set Min = <strong className="text-cyan-300">{minVal}</strong>, Max ={' '}
                    <strong className="text-rose-300">{maxVal}</strong> from first element A[0]
                  </span>
                ) : mem.updatedMin ? (
                  <span>
                    UPDATE MIN: A[{currentIdx}] ({arr8[currentIdx]}) &lt; Min ({minVal}) → New Minimum is {minVal}!
                  </span>
                ) : mem.updatedMax ? (
                  <span>
                    UPDATE MAX: A[{currentIdx}] ({arr8[currentIdx]}) &gt; Max ({maxVal}) → New Maximum is {maxVal}!
                  </span>
                ) : (
                  <span>
                    CHECK A[{currentIdx}] ({arr8[currentIdx]}): Between Min ({minVal}) &amp; Max ({maxVal}) → No change
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── 1D VIEW (8 Elements) ── */}
          {dim === '1D' && (
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center justify-between w-full text-xs text-neutral-400 px-1 font-bold">
                <span className="text-cyan-400">1D CONTIGUOUS ARRAY (8 ELEMENTS)</span>
                <span className="text-neutral-500">Scan: 0 → 7</span>
              </div>

              {/* Index row */}
              <div className="flex items-center">
                {arr8.map((_, idx) => {
                  const isCur = !isComplete && idx === currentIdx;
                  const isMin = idx === minIdx;
                  const isMax = idx === maxIdx;
                  return (
                    <div key={`1d-top-${idx}`} className="w-18 md:w-20 text-center pb-1 text-xs font-bold">
                      <span
                        className={
                          isCur
                            ? 'text-amber-400 font-black'
                            : isMin
                            ? 'text-cyan-400 font-black'
                            : isMax
                            ? 'text-rose-400 font-black'
                            : 'text-neutral-500'
                        }
                      >
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Array Cells */}
              <div className="flex items-stretch border-2 border-neutral-700 bg-[#07090f] relative shadow-xl">
                {arr8.map((val, idx) => {
                  const isCur = !isComplete && idx === currentIdx;
                  const isMin = idx === minIdx;
                  const isMax = idx === maxIdx;
                  const isBoth = isMin && isMax;
                  const isScanned = !isComplete && idx < currentIdx;

                  let bg = isScanned ? 'bg-[#080b14]/70' : 'bg-[#090c16]';
                  let text = isScanned ? 'text-neutral-400' : 'text-neutral-200';
                  let ring = '';

                  if (isBoth) {
                    bg = 'bg-gradient-to-r from-cyan-950 to-rose-950';
                    text = 'text-white font-black';
                    ring = 'ring-2 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]';
                  } else if (isMin) {
                    bg = 'bg-[#042832]';
                    text = 'text-cyan-200 font-black';
                    ring = 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]';
                  } else if (isMax) {
                    bg = 'bg-[#350d1a]';
                    text = 'text-rose-200 font-black';
                    ring = 'ring-2 ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
                  } else if (isCur) {
                    bg = 'bg-amber-950/70';
                    text = 'text-amber-300 font-black';
                    ring = 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
                  }

                  return (
                    <div
                      key={`1d-cell-${idx}`}
                      className={`w-18 md:w-20 h-18 md:h-20 relative flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 transition-all ${bg} ${ring}`}
                    >
                      {/* Active Animated Pointer Arrow for Scan */}
                      {isCur && (
                        <motion.div
                          layoutId="scan-pointer-1d"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none"
                        >
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-400 text-neutral-950 uppercase tracking-wider">
                            SCAN
                          </span>
                          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-amber-400" />
                        </motion.div>
                      )}
                      <span className="text-[10px] text-neutral-400 font-semibold mb-0.5">A[{idx}]</span>
                      <span className={`text-xl md:text-2xl font-black ${text}`}>{val}</span>
                    </div>
                  );
                })}
              </div>

              {/* Badges Row Below */}
              <div className="flex items-center pt-2">
                {arr8.map((_, idx) => {
                  const isCur = !isComplete && idx === currentIdx;
                  const isMin = idx === minIdx;
                  const isMax = idx === maxIdx;
                  const isBoth = isMin && isMax;

                  return (
                    <div key={`1d-bot-${idx}`} className="w-18 md:w-20 h-7 text-center flex flex-col items-center justify-start gap-0.5 relative">
                      {isBoth ? (
                        <motion.span
                          layoutId="badge-both-1d"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          className="text-[9px] font-black px-1.5 py-0.5 bg-purple-500 text-neutral-950 shadow-sm"
                        >
                          MIN/MAX
                        </motion.span>
                      ) : isMin ? (
                        <motion.span
                          layoutId="badge-min-1d"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          className="text-[9px] font-black px-1.5 py-0.5 bg-cyan-400 text-neutral-950 shadow-sm"
                        >
                          MIN
                        </motion.span>
                      ) : isMax ? (
                        <motion.span
                          layoutId="badge-max-1d"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          className="text-[9px] font-black px-1.5 py-0.5 bg-rose-500 text-neutral-950 shadow-sm"
                        >
                          MAX
                        </motion.span>
                      ) : isCur ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-400/90 text-neutral-950">
                          SCAN
                        </span>
                      ) : (
                        <span className="text-[9px] text-neutral-500 font-semibold">[{idx}]</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 2D VIEW (2x4 Matrix = 8 Elements) ── */}
          {dim === '2D' && (
            <div className="flex flex-col items-center gap-4 mt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-between w-full text-xs text-neutral-400 px-1 font-bold">
                  <span className="text-purple-400">2D LOGICAL MATRIX: A[2][4] (8 ELEMENTS)</span>
                  <span className="text-neutral-500">2 Rows × 4 Columns</span>
                </div>

                <div className="border border-neutral-800 bg-[#07080e] p-3 flex flex-col items-center shadow-lg">
                  {/* Column headers */}
                  <div className="flex items-center pl-12 mb-1.5 gap-1.5">
                    {[0, 1, 2, 3].map(c => (
                      <div key={c} className="w-18 md:w-20 text-center text-xs text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/60 py-1">
                        Col {c}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {[0, 1].map(r => (
                    <div key={r} className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-10 text-xs text-purple-300 font-bold text-center bg-purple-950/60 border border-purple-800/60 py-3">
                        R{r}
                      </span>
                      <div className="flex items-stretch border border-neutral-700 gap-1.5 p-1 bg-[#090b14]">
                        {[0, 1, 2, 3].map(c => {
                          const linearIdx = r * 4 + c;
                          const val = matrix2D[r][c];
                          const isCur = !isComplete && linearIdx === currentIdx;
                          const isMin = linearIdx === minIdx;
                          const isMax = linearIdx === maxIdx;
                          const isBoth = isMin && isMax;

                          let bg = 'bg-[#0a0e1c]';
                          let text = 'text-neutral-200';
                          let ring = 'border-neutral-800';

                          if (isBoth) {
                            bg = 'bg-gradient-to-br from-cyan-950 to-rose-950';
                            text = 'text-white font-black';
                            ring = 'border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]';
                          } else if (isMin) {
                            bg = 'bg-[#042832]';
                            text = 'text-cyan-200 font-black';
                            ring = 'border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
                          } else if (isMax) {
                            bg = 'bg-[#350d1a]';
                            text = 'text-rose-200 font-black';
                            ring = 'border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
                          } else if (isCur) {
                            bg = 'bg-amber-950/80';
                            text = 'text-amber-300 font-black';
                            ring = 'border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
                          }

                          return (
                            <div
                              key={c}
                              className={`w-18 md:w-20 h-16 md:h-18 relative flex flex-col items-center justify-center border transition-all ${bg} ${ring}`}
                            >
                              {/* Active pointer in 2D grid */}
                              {isCur && (
                                <motion.div
                                  layoutId="scan-pointer-2d"
                                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                  className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-none"
                                >
                                  <span className="text-[7px] font-black px-1 py-0.2 bg-amber-400 text-neutral-950 uppercase">
                                    SCAN
                                  </span>
                                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-amber-400" />
                                </motion.div>
                              )}

                              <span className="text-[10px] text-neutral-400 font-semibold mb-0.5">A[{r}][{c}]</span>
                              <span className={`text-lg md:text-xl font-black ${text}`}>{val}</span>
                              {isBoth ? (
                                <motion.span
                                  layoutId="badge-both-2d"
                                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                  className="text-[8px] font-black px-1.5 bg-purple-500 text-neutral-950"
                                >
                                  MIN/MAX
                                </motion.span>
                              ) : isMin ? (
                                <motion.span
                                  layoutId="badge-min-2d"
                                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                  className="text-[8px] font-black px-1.5 bg-cyan-400 text-neutral-950"
                                >
                                  MIN
                                </motion.span>
                              ) : isMax ? (
                                <motion.span
                                  layoutId="badge-max-2d"
                                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                  className="text-[8px] font-black px-1.5 bg-rose-500 text-neutral-950"
                                >
                                  MAX
                                </motion.span>
                              ) : isCur ? (
                                <span className="text-[8px] font-bold text-amber-300">SCAN</span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linear RAM Sequence below */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-between w-full text-xs text-neutral-400 px-1 font-bold">
                  <span>UNROLLED 1D MEMORY VIEW</span>
                  <span className="text-neutral-500">Linear Index 0 → 7</span>
                </div>
                <div className="flex items-stretch border-2 border-neutral-700 bg-[#07090f]">
                  {arr8.map((val, idx) => {
                    const isMin = idx === minIdx;
                    const isMax = idx === maxIdx;
                    const isBoth = isMin && isMax;
                    const isCur = !isComplete && idx === currentIdx;

                    let bg = 'bg-[#0a0d18]';
                    let text = 'text-neutral-300';
                    if (isBoth) {
                      bg = 'bg-purple-950 text-white font-black';
                    } else if (isMin) {
                      bg = 'bg-cyan-950 text-cyan-300 font-black';
                    } else if (isMax) {
                      bg = 'bg-rose-950 text-rose-300 font-black';
                    } else if (isCur) {
                      bg = 'bg-amber-950 text-amber-300 font-black';
                    }

                    return (
                      <div
                        key={`2d-lin-${idx}`}
                        className={`w-14 md:w-16 h-14 md:h-16 flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 ${bg}`}
                      >
                        <span className="text-[9px] opacity-75">k={idx}</span>
                        <span className={`text-sm font-bold ${text}`}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     B. IN-PLACE ARRAY REVERSAL VISUALIZER (dsa_array_reverse)
     Two-Pointer Inward Scanning & In-Place Swapping
  ───────────────────────────────────────────────────────────── */
  if (isReverseLesson) {
    const rawArr = mem.arr;
    let revArr: number[] = [10, 20, 30, 40, 50, 60];
    if (Array.isArray(rawArr)) {
      revArr = rawArr.map(Number);
    } else if (typeof rawArr === 'string') {
      try {
        const parsed = JSON.parse(rawArr);
        if (Array.isArray(parsed)) revArr = parsed.map(Number);
      } catch {
        const parts = rawArr.replace(/[[\]]/g, '').split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n));
        if (parts.length) revArr = parts;
      }
    }

    const n = revArr.length;
    const left = typeof mem.left === 'number' ? mem.left : 0;
    const right = typeof mem.right === 'number' ? mem.right : (n - 1);
    const temp = mem.temp != null ? Number(mem.temp) : null;
    const stage = String(mem.stage ?? (stepIdx === 0 ? 'init' : 'advance'));
    const isComplete = stage === 'complete' || left >= right;
    const swapping = Array.isArray(mem.swapping) ? mem.swapping : null;
    const isSwapping = stage === 'swap' || Boolean(swapping);
    const settledIndices: number[] = Array.isArray(mem.settledIndices) ? mem.settledIndices : [];
    const isOdd = n % 2 === 1;
    const pivotIdx = isOdd ? Math.floor(n / 2) : -1;

    return (
      <div className="flex-1 min-h-0 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto custom-scrollbar p-3 select-none relative font-mono text-neutral-200">
        <div
          className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-4 transition-transform duration-150 ease-out py-3"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

          {/* ── Top Status Banner ── */}
          <div className="flex flex-col items-center gap-2 max-w-3xl w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 bg-[#090c16] border border-neutral-800 text-xs shadow-lg">
              <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-bold text-[10px]">
                SIZE: {n}
              </span>
              <span className="px-2 py-0.5 bg-purple-950/80 border border-purple-500/60 text-purple-300 font-bold text-[10px]">
                TWO POINTERS
              </span>

              {/* Left Pointer Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/90 border border-cyan-400 text-cyan-200 font-bold text-[11px] shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <span className="text-[9px] text-cyan-400 uppercase tracking-wider">LEFT:</span>
                <span className="text-white font-black">{left < n ? `A[${left}]` : '-'}</span>
                <span className="text-[10px] text-cyan-300 font-extrabold">({revArr[left] ?? '-'})</span>
              </div>

              {/* Right Pointer Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-950/90 border border-rose-400 text-rose-200 font-bold text-[11px] shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <span className="text-[9px] text-rose-400 uppercase tracking-wider">RIGHT:</span>
                <span className="text-white font-black">{right >= 0 ? `A[${right}]` : '-'}</span>
                <span className="text-[10px] text-rose-300 font-extrabold">({revArr[right] ?? '-'})</span>
              </div>

              {/* Temp Storage Register */}
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 border font-bold text-[11px] transition-all ${
                temp != null
                  ? 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
              }`}>
                <span className="text-[9px] uppercase tracking-wider text-amber-400">TEMP:</span>
                <span className="text-white font-black">{temp != null ? temp : 'null'}</span>
              </div>
            </div>

            {/* Explanation Message Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`rev-msg-${stepIdx}-${left}-${right}-${stage}-${temp}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className={`px-4 py-1.5 text-xs font-bold border transition-colors ${
                  isComplete
                    ? 'bg-[#061510] border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : isSwapping
                    ? 'bg-[#261504] border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : stage === 'temp'
                    ? 'bg-[#042832] border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#0b0f1a] border-neutral-700 text-neutral-200'
                }`}
              >
                {isComplete ? (
                  <span>
                    COMPLETE: Left ({left}) &gt;= Right ({right}) condition met. In-place reversal finished with zero auxiliary arrays!
                  </span>
                ) : isSwapping ? (
                  <span>
                    SWAP: Exchanging opposite elements arr[{left}] ({revArr[left]}) ⇄ arr[{right}] ({revArr[right]}) in-place!
                  </span>
                ) : stage === 'temp' ? (
                  <span>
                    SAVE TEMP: temp = arr[{left}] ({temp}). Left element safely preserved before right element overwrite.
                  </span>
                ) : stage === 'advance' ? (
                  <span>
                    MOVE INWARD: left++ ({left}), right-- ({right}). Next opposite pair targeted.
                  </span>
                ) : (
                  <span>
                    INITIALIZE: Set left pointer to 0 and right pointer to {n - 1}.
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Visual Array with Animated Two-Pointer Indicators ── */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="flex items-center justify-between w-full text-xs text-neutral-400 px-1 font-bold">
              <span className="text-cyan-400">IN-PLACE ARRAY STORAGE (SIZE {n})</span>
              <span className="text-neutral-500">Pointers: Left → &nbsp;|&nbsp; ← Right</span>
            </div>

            {/* Pointer Arrows & Indicators Row (Above Cells) */}
            <div className="flex items-center">
              {revArr.map((_, idx) => {
                const isLeft = !isComplete && idx === left;
                const isRight = !isComplete && idx === right;
                const isBoth = isLeft && isRight;

                return (
                  <div key={`rev-ptr-${idx}`} className="w-18 md:w-20 h-7 text-center flex flex-col items-center justify-end pb-1 relative">
                    {isBoth ? (
                      <motion.div
                        layoutId="both-pointer-rev"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-[7.5px] font-black px-1.5 py-0.2 bg-purple-500 text-neutral-950 uppercase">
                          MEET
                        </span>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-500" />
                      </motion.div>
                    ) : isLeft ? (
                      <motion.div
                        layoutId="left-pointer-rev"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-[8px] font-black px-1.5 py-0.2 bg-cyan-400 text-neutral-950 uppercase tracking-wider">
                          LEFT
                        </span>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400" />
                      </motion.div>
                    ) : isRight ? (
                      <motion.div
                        layoutId="right-pointer-rev"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-[8px] font-black px-1.5 py-0.2 bg-rose-500 text-neutral-950 uppercase tracking-wider">
                          RIGHT
                        </span>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-rose-500" />
                      </motion.div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Array Cells Row */}
            <div className="flex items-stretch border-2 border-neutral-700 bg-[#07090f] relative shadow-xl">
              {revArr.map((val, idx) => {
                const isLeft = !isComplete && idx === left;
                const isRight = !isComplete && idx === right;
                const isSwapTarget = isSwapping && (idx === left || idx === right);
                const isSettled = isComplete || settledIndices.includes(idx);
                const isPivot = isOdd && idx === pivotIdx;

                let bg = 'bg-[#090c16]';
                let text = 'text-neutral-200';
                let ring = '';

                if (isSwapTarget) {
                  bg = 'bg-[#351a08]';
                  text = 'text-amber-200 font-black';
                  ring = 'ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-20';
                } else if (isLeft) {
                  bg = 'bg-[#042832]';
                  text = 'text-cyan-200 font-black';
                  ring = 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] z-10';
                } else if (isRight) {
                  bg = 'bg-[#350d1a]';
                  text = 'text-rose-200 font-black';
                  ring = 'ring-2 ring-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)] z-10';
                } else if (isPivot) {
                  bg = 'bg-purple-950/50';
                  text = 'text-purple-300 font-black';
                  ring = 'border border-purple-500/50';
                } else if (isSettled) {
                  bg = 'bg-[#061410]';
                  text = 'text-emerald-300 font-bold';
                  ring = 'border border-emerald-500/40';
                }

                return (
                  <div
                    key={`rev-cell-${idx}`}
                    className={`w-18 md:w-20 h-18 md:h-20 relative flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 transition-all ${bg} ${ring}`}
                  >
                    <span className="text-[10px] text-neutral-400 font-semibold mb-0.5">A[{idx}]</span>
                    <span className={`text-xl md:text-2xl font-black ${text}`}>{val}</span>
                  </div>
                );
              })}
            </div>

            {/* Badges Row Below */}
            <div className="flex items-center pt-2">
              {revArr.map((_, idx) => {
                const isLeft = !isComplete && idx === left;
                const isRight = !isComplete && idx === right;
                const isSwapTarget = isSwapping && (idx === left || idx === right);
                const isSettled = isComplete || settledIndices.includes(idx);
                const isPivot = isOdd && idx === pivotIdx;

                return (
                  <div key={`rev-bot-${idx}`} className="w-18 md:w-20 h-7 text-center flex flex-col items-center justify-start gap-0.5 relative">
                    {isSwapTarget ? (
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-400 text-neutral-950 shadow-sm">
                        ⇄ SWAP
                      </span>
                    ) : isPivot ? (
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-purple-500/90 text-white">
                        PIVOT
                      </span>
                    ) : isSettled ? (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                        REVERSED ✓
                      </span>
                    ) : isLeft ? (
                      <span className="text-[8.5px] font-bold px-1 py-0.5 bg-cyan-950 border border-cyan-500/70 text-cyan-300">
                        [L]
                      </span>
                    ) : isRight ? (
                      <span className="text-[8.5px] font-bold px-1 py-0.5 bg-rose-950 border border-rose-500/70 text-rose-300">
                        [R]
                      </span>
                    ) : (
                      <span className="text-[9px] text-neutral-500 font-semibold">[{idx}]</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Swap Connection / Pointer Bridge */}
            {left < right && (
              <div className="flex items-center justify-center gap-3 px-4 py-1.5 mt-2 bg-[#080c16] border border-neutral-800 text-xs">
                <span className="text-cyan-400 font-bold">A[{left}] ({revArr[left]})</span>
                <span className="text-amber-400 font-extrabold text-sm">⟷</span>
                <span className="text-rose-400 font-bold">A[{right}] ({revArr[right]})</span>
                <span className="text-neutral-500 text-[10px] ml-2">Distance: {right - left} steps</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     C. COUNT OCCURRENCES VISUALIZER (dsa_array_count)
     Minimal, Crisp, High-Contrast, Linear Scan with Accumulator
  ───────────────────────────────────────────────────────────── */
  if (isCountLesson) {
    const countArr: number[] = (mem.arr as number[]) || [5, 3, 5, 7, 5, 2];
    const target = Number(mem.target ?? 5);
    const currentIdx = Number(mem.currentIdx ?? -1);
    const count = Number(mem.count ?? 0);
    const matchedIndices: number[] = (mem.matchedIndices as number[]) || [];
    const isMatch = Boolean(mem.isMatch);
    const stage = String(mem.stage ?? 'init');
    const isComplete = stage === 'complete';
    const isScanning = stage === 'check' && currentIdx >= 0 && currentIdx < countArr.length;
    const n = countArr.length;
    const progressPercent = isComplete ? 100 : Math.round((Math.max(0, currentIdx + 1) / n) * 100);

    return (
      <div className="flex-1 min-h-0 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto custom-scrollbar p-3 select-none relative font-mono text-neutral-200">
        <div
          className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-4 transition-transform duration-150 ease-out py-3"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

          {/* ── Top Status Banner ── */}
          <div className="flex flex-col items-center gap-2 max-w-3xl w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 bg-[#090c16] border border-neutral-800 text-xs shadow-lg">
              <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-bold text-[10px]">
                SIZE: {n}
              </span>

              {/* Target Value Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/90 border border-cyan-400 text-cyan-200 font-bold text-[11px]">
                <span className="text-[9px] text-cyan-400 uppercase tracking-wider">TARGET:</span>
                <span className="text-white font-black">{target}</span>
              </div>

              {/* Current Scan Element */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 border font-bold text-[11px] transition-all ${
                  isScanning
                    ? isMatch
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                      : 'bg-amber-950/90 border-amber-400 text-amber-200'
                    : isComplete
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-400'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider text-neutral-400">SCAN:</span>
                <span className="text-white font-black">
                  {isScanning ? `A[${currentIdx}]` : isComplete ? 'DONE' : 'IDLE'}
                </span>
                {isScanning && (
                  <span className={`text-[10px] font-extrabold ${isMatch ? 'text-emerald-300' : 'text-amber-300'}`}>
                    ({countArr[currentIdx]})
                  </span>
                )}
              </div>

              {/* Total Occurrences Count */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950/90 border border-emerald-400 text-emerald-200 font-bold text-[11px]">
                <span className="text-[9px] text-emerald-400 uppercase tracking-wider">COUNT:</span>
                <span className="text-white font-black text-sm">{count}</span>
              </div>
            </div>

            {/* Explanation Message Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`count-msg-${stepIdx}-${currentIdx}-${count}-${stage}-${isMatch}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.12 }}
                className={`px-4 py-1.5 text-xs font-bold border transition-colors ${
                  isComplete
                    ? 'bg-[#061510] border-emerald-500 text-emerald-300'
                    : isMatch
                    ? 'bg-[#062419] border-emerald-400 text-emerald-200'
                    : isScanning
                    ? 'bg-[#241a06] border-amber-400 text-amber-200'
                    : 'bg-[#0b0f1a] border-neutral-700 text-neutral-200'
                }`}
              >
                {isComplete ? (
                  <span>
                    Complete: Target {target} found {count} time(s) at [{matchedIndices.join(', ')}].
                  </span>
                ) : isMatch ? (
                  <span>
                    Match: A[{currentIdx}] ({countArr[currentIdx]}) == {target} → Count = {count}
                  </span>
                ) : isScanning ? (
                  <span>
                    A[{currentIdx}] ({countArr[currentIdx]}) ≠ {target} → Count = {count}
                  </span>
                ) : (
                  <span>
                    Initialized: Target = {target} | Count = 0
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Visual Array with Animated Scan Pointer ── */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="flex items-center justify-between w-full text-xs text-neutral-400 px-1 font-bold">
              <span className="text-cyan-400">ARRAY (SIZE {n})</span>
            </div>

            {/* Pointer Indicator Row (Above Cells) */}
            <div className="flex items-center">
              {countArr.map((_, idx) => {
                const isCurrent = !isComplete && idx === currentIdx;

                return (
                  <div key={`count-ptr-${idx}`} className="w-18 md:w-20 h-7 text-center flex flex-col items-center justify-end pb-1 relative">
                    {isCurrent ? (
                      <motion.div
                        layoutId="scan-pointer-count"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        className="flex flex-col items-center"
                      >
                        <span
                          className={`text-[8px] font-black px-1.5 py-0.2 uppercase tracking-wider ${
                            isMatch ? 'bg-emerald-400 text-neutral-950' : 'bg-amber-400 text-neutral-950'
                          }`}
                        >
                          {isMatch ? 'MATCH ▼' : `i = ${idx}`}
                        </span>
                        <div
                          className={`w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                            isMatch ? 'border-t-emerald-400' : 'border-t-amber-400'
                          }`}
                        />
                      </motion.div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Array Cells Row */}
            <div className="flex items-stretch border-2 border-neutral-700 bg-[#07090f] relative shadow-xl">
              {countArr.map((val, idx) => {
                const isCurrent = !isComplete && idx === currentIdx;
                const isMatched = matchedIndices.includes(idx);
                const isEvaluated = (idx < currentIdx && currentIdx !== -1) || isComplete;

                let bg = 'bg-[#090c16]';
                let text = 'text-neutral-200';
                let ring = '';

                if (isCurrent) {
                  if (isMatch) {
                    bg = 'bg-[#062419]';
                    text = 'text-emerald-200 font-black';
                    ring = 'ring-2 ring-emerald-400 z-20';
                  } else {
                    bg = 'bg-[#281a06]';
                    text = 'text-amber-200 font-black';
                    ring = 'ring-2 ring-amber-400 z-20';
                  }
                } else if (isMatched) {
                  bg = 'bg-[#071912]';
                  text = 'text-emerald-300 font-bold';
                  ring = 'border border-emerald-500/50';
                } else if (isEvaluated) {
                  bg = 'bg-[#080a12]';
                  text = 'text-neutral-500';
                }

                return (
                  <div
                    key={`count-cell-${idx}`}
                    className={`w-18 md:w-20 h-18 md:h-20 relative flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 transition-all ${bg} ${ring}`}
                  >
                    {isMatched && (
                      <span className="absolute top-1 right-1 text-[8px] font-black text-emerald-400 bg-emerald-950 px-1 py-0.2 border border-emerald-500/40">
                        ✓
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-400 font-semibold mb-0.5">A[{idx}]</span>
                    <span className={`text-xl md:text-2xl font-black ${text}`}>{val}</span>
                  </div>
                );
              })}
            </div>

            {/* Badges Row Below Cells */}
            <div className="flex items-center pt-2">
              {countArr.map((_, idx) => {
                const isCurrent = !isComplete && idx === currentIdx;
                const isMatched = matchedIndices.includes(idx);

                return (
                  <div key={`count-bot-${idx}`} className="w-18 md:w-20 h-7 text-center flex flex-col items-center justify-start gap-0.5 relative">
                    {isCurrent ? (
                      isMatch ? (
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-400 text-neutral-950">
                          +1
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-950/80 border border-amber-500/60 text-amber-300">
                          ≠
                        </span>
                      )
                    ) : isMatched ? (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[8px] text-neutral-700 font-mono">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Matched Occurrence Ledger & Scan Progress Bar ── */}
          <div className="w-full max-w-xl flex flex-col gap-2 mt-1">
            <div className="p-3 bg-[#090c16] border border-neutral-800 shadow-md">
              <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                <span className="text-emerald-400 font-bold tracking-wider">
                  MATCHED INDICES ({matchedIndices.length})
                </span>
                <span className="text-cyan-400 font-mono text-[10px]">
                  {isComplete ? n : Math.max(0, currentIdx + 1)} / {n} ({progressPercent}%)
                </span>
              </div>

              {matchedIndices.length === 0 ? (
                <div className="text-xs text-neutral-500 italic py-1 text-center">
                  {currentIdx === -1 ? 'Ready.' : 'None found yet.'}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {matchedIndices.map((mIdx, order) => (
                    <div
                      key={`ledger-${mIdx}`}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#061e14] border border-emerald-500/50 text-xs text-emerald-200"
                    >
                      <span className="text-[10px] text-emerald-400 font-bold">#{order + 1}</span>
                      <span className="font-mono font-black text-white">A[{mIdx}]</span>
                      <span className="text-emerald-300 font-bold text-[11px]">({countArr[mIdx]})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Linear Scan Progress Meter */}
              <div className="mt-3 pt-1 border-t border-neutral-800/80">
                <div className="w-full bg-neutral-900 h-1.5 overflow-hidden border border-neutral-800">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={false}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     B. MEMORY ADDRESSING VISUALIZER (dsa_array_declare)
     Clean, Colorful, High-Contrast
  ───────────────────────────────────────────────────────────── */
  const dim = (mem.dim ?? '1D') as '1D' | '2D';
  const baseAddress = Number(mem.baseAddress ?? 1000);
  const elementSize = Number(mem.elementSize ?? 4);
  const stage = String(mem.stage ?? 'given');

  const isOffsetPhase = stage === 'offset' || stage === 'located' || stage === 'complete';
  const isLocatedPhase = stage === 'located' || stage === 'complete';

  // 1D variables
  const targetIndex1D = Number(mem.targetIndex ?? 3);
  const arr1D = (mem.arr1D as number[]) || ARRAY_1D_DEFAULT_ADDR;
  const offset1D = targetIndex1D * elementSize;
  const addr1D = baseAddress + offset1D;

  // 2D variables
  const order2D = (mem.order ?? 'RMO') as 'RMO' | 'CMO';
  const isRMO = order2D === 'RMO';
  const targetRow2D = Number(mem.targetRow ?? 1);
  const targetCol2D = Number(mem.targetCol ?? 2);
  const matrix2D = (mem.matrix2D as number[][]) || MATRIX_2D_DEFAULT_ADDR;
  const linearIndex2D = isRMO ? targetRow2D * 3 + targetCol2D : targetCol2D * 3 + targetRow2D;
  const offset2D = linearIndex2D * elementSize;
  const addr2D = baseAddress + offset2D;

  // 2D RAM cells
  const linearMemoryCells2D = useMemo(() => {
    const list: Array<{ row: number; col: number; val: number; k: number; addr: number }> = [];
    if (isRMO) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const k = r * 3 + c;
          list.push({
            row: r,
            col: c,
            val: matrix2D[r][c],
            k,
            addr: baseAddress + k * elementSize,
          });
        }
      }
    } else {
      for (let c = 0; c < 3; c++) {
        for (let r = 0; r < 3; r++) {
          const k = c * 3 + r;
          list.push({
            row: r,
            col: c,
            val: matrix2D[r][c],
            k,
            addr: baseAddress + k * elementSize,
          });
        }
      }
    }
    return list;
  }, [isRMO, baseAddress, elementSize, matrix2D]);

  return (
    <div className="flex-1 min-h-0 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto custom-scrollbar p-3 select-none relative font-mono text-neutral-200">
      <div
        className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-4 transition-transform duration-150 ease-out py-3"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Top Calculation Banner ── */}
        <div className="flex flex-col items-center justify-center min-h-16 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`calc-${dim}-${order2D}-${targetIndex1D}-${targetRow2D}-${targetCol2D}-${stage}-${baseAddress}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center gap-2 max-w-3xl"
            >
              {/* Parameter Bar with Rich Colors */}
              <div
                className={`flex flex-wrap items-center justify-center gap-2.5 px-3 py-1.5 bg-[#090c16] border text-xs shadow-md transition-colors ${
                  stage === 'given' ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'border-neutral-800'
                }`}
              >
                <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-bold text-[10px]">
                  DIM: <strong className="text-white">{dim}</strong>
                </span>
                {dim === '2D' && (
                  <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold text-[10px]">
                    ORDER: {order2D}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-bold text-[10px]">
                  BASE: {baseAddress}
                </span>
                <span className="px-2 py-0.5 bg-purple-950 border border-purple-500/50 text-purple-300 font-bold text-[10px]">
                  w: {elementSize}B
                </span>
                <span className="px-2.5 py-0.5 bg-amber-950/80 border border-amber-400 text-amber-300 font-bold text-[11px] shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  TARGET:{' '}
                  {dim === '1D'
                    ? `A[${targetIndex1D}] = ${arr1D[targetIndex1D]}`
                    : `A[${targetRow2D}][${targetCol2D}] = ${matrix2D[targetRow2D]?.[targetCol2D]}`}
                </span>
              </div>

              {/* Exact Formula Resolution Box (Fully visible from step 1 with color tags) */}
              <div
                className={`flex flex-wrap items-center justify-center gap-2 px-4 py-2 border text-xs font-bold transition-all shadow-lg ${
                  isLocatedPhase
                    ? 'bg-[#061812] border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : isOffsetPhase
                    ? 'bg-[#071620] border-cyan-400 text-cyan-300'
                    : stage === 'formula'
                    ? 'bg-[#151327] border-indigo-400 text-indigo-200'
                    : 'bg-[#090c16] border-neutral-700 text-neutral-200'
                }`}
              >
                {dim === '1D' ? (
                  <>
                    <span className="text-indigo-400 font-bold">Loc(A[i]) =</span>
                    <span className={stage === 'formula' ? 'text-amber-300 underline font-black' : 'text-neutral-300'}>
                      Base + (i - LB) * w
                    </span>
                    <span className="text-neutral-500">=</span>
                    <span className="text-neutral-200">{baseAddress} + ({targetIndex1D} - 0) * {elementSize}</span>
                    <span className="text-neutral-500">=</span>
                    <span className={`px-1.5 py-0.5 border ${
                      stage === 'offset'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'border-transparent text-cyan-400'
                    }`}>
                      {baseAddress} + {offset1D}B
                    </span>
                    <span className="text-neutral-500">=</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-black border transition-all ${
                        isLocatedPhase
                          ? 'bg-emerald-500 text-neutral-950 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      ADDRESS {addr1D}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-indigo-400 font-bold">
                      {isRMO ? 'RMO: Loc(A[i][j])' : 'CMO: Loc(A[i][j])'} =
                    </span>
                    <span className={stage === 'formula' ? 'text-amber-300 underline font-black' : 'text-neutral-300'}>
                      {isRMO ? `Base + [(i * C) + j] * w` : `Base + [(j * R) + i] * w`}
                    </span>
                    <span className="text-neutral-500">=</span>
                    <span className="text-neutral-200">
                      {isRMO
                        ? `${baseAddress} + [(${targetRow2D} * 3) + ${targetCol2D}] * ${elementSize}`
                        : `${baseAddress} + [(${targetCol2D} * 3) + ${targetRow2D}] * ${elementSize}`}
                    </span>
                    <span className="text-neutral-500">=</span>
                    <span className={`px-1.5 py-0.5 border ${
                      stage === 'offset'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'border-transparent text-cyan-400'
                    }`}>
                      {baseAddress} + {offset2D}B
                    </span>
                    <span className="text-neutral-500">=</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-black border transition-all ${
                        isLocatedPhase
                          ? 'bg-emerald-500 text-neutral-950 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      ADDRESS {addr2D}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── 1D VIEW ── */}
        {dim === '1D' && (
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="flex items-center justify-between w-full text-[10px] text-neutral-400 px-1">
              <span className="text-indigo-400 font-bold">CONTIGUOUS RAM BLOCK</span>
              <span className="text-neutral-500">Loc = Base + (i * w)</span>
            </div>

            {/* Address Row Above Cells */}
            <div className="flex items-center">
              {arr1D.map((_, idx) => {
                const cellAddr = baseAddress + idx * elementSize;
                const isTarget = idx === targetIndex1D;
                return (
                  <div key={`1d-addr-${idx}`} className="w-16 text-center pb-1 text-[10px] font-bold">
                    <span
                      className={
                        isTarget
                          ? isLocatedPhase
                            ? 'text-emerald-400 font-black drop-shadow-sm'
                            : 'text-cyan-400 font-black'
                          : idx === 0
                          ? 'text-indigo-300 font-bold'
                          : 'text-neutral-500'
                      }
                    >
                      {cellAddr}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Contiguous 1D Cells */}
            <div className="flex items-stretch border-2 border-neutral-700 bg-[#07090f] relative shadow-xl">
              {arr1D.map((val, idx) => {
                const isTarget = idx === targetIndex1D;
                const isBase = idx === 0;

                let bg = 'bg-[#090c16]';
                let text = 'text-neutral-300';
                let ring = '';

                if (isTarget) {
                  if (isLocatedPhase) {
                    bg = 'bg-[#064e3b]';
                    text = 'text-emerald-200 font-black';
                    ring = 'ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
                  } else if (isOffsetPhase) {
                    bg = 'bg-cyan-950';
                    text = 'text-cyan-200 font-black';
                    ring = 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
                  } else {
                    bg = 'bg-[#0a2720]';
                    text = 'text-emerald-300 font-bold';
                    ring = 'ring-2 ring-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                  }
                } else if (isBase) {
                  bg = 'bg-[#0f1426]';
                  text = 'text-indigo-200';
                }

                return (
                  <div
                    key={`1d-cell-${idx}`}
                    className={`w-16 h-16 relative flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 transition-all ${bg} ${ring}`}
                  >
                    {isTarget && (
                      <motion.div
                        layoutId="1d-arrow"
                        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent z-20 ${
                          isLocatedPhase ? 'border-t-emerald-400' : 'border-t-cyan-400'
                        }`}
                      />
                    )}
                    <span className="text-[9px] text-neutral-400">A[{idx}]</span>
                    <span className={`text-base ${text}`}>{val}</span>
                  </div>
                );
              })}
            </div>

            {/* Index & Badge Row Below Cells */}
            <div className="flex items-center pt-1.5">
              {arr1D.map((_, idx) => {
                const isTarget = idx === targetIndex1D;
                return (
                  <div key={`1d-bot-${idx}`} className="w-16 text-center flex flex-col items-center gap-0.5 text-[9px]">
                    <span className={isTarget ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                      [{idx}]
                    </span>
                    <span className="text-[8px] text-neutral-500">+{idx * elementSize}B</span>
                    {idx === 0 && (
                      <span className="text-[8px] text-indigo-300 bg-indigo-950/80 border border-indigo-700 px-1 mt-0.5 font-bold">
                        BASE
                      </span>
                    )}
                    {isTarget && (
                      <span
                        className={`text-[8px] font-black px-1.5 mt-0.5 ${
                          isLocatedPhase
                            ? 'bg-emerald-400 text-neutral-950 shadow-sm'
                            : 'bg-cyan-400 text-neutral-950 shadow-sm'
                        }`}
                      >
                        TARGET
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Offset Ruler */}
            {targetIndex1D > 0 && (
              <div className="mt-3 flex flex-col items-center gap-0.5 text-[10px]">
                <div
                  className="h-2 border-b-2 border-l-2 border-r-2 border-cyan-400 relative flex items-center justify-center"
                  style={{
                    width: targetIndex1D * 64,
                    marginLeft: -((arr1D.length - targetIndex1D) * 64) / 2 + 32,
                  }}
                >
                  <div className="absolute -top-3.5 px-2 bg-[#07090f] border border-cyan-400 text-cyan-300 text-[9px] font-black shadow-sm">
                    Offset = {targetIndex1D} × {elementSize}B = {offset1D} Bytes
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 2D VIEW (RMO / CMO) ── */}
        {dim === '2D' && (
          <div className="flex flex-col items-center gap-4 mt-1">
            {/* 2D Matrix Logical Grid */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-between w-full text-[10px] text-neutral-400 px-1">
                <span className="text-purple-400 font-bold">2D MATRIX: A[3][3]</span>
                <span className="text-cyan-400 font-bold">
                  {isRMO ? 'Row Major Sequence' : 'Column Major Sequence'}
                </span>
              </div>

              <div className="border border-neutral-800 bg-[#07080e] p-2 flex flex-col items-center shadow-lg">
                <div className="flex items-center pl-8 mb-1 gap-1">
                  {[0, 1, 2].map(c => (
                    <div key={c} className="w-14 text-center text-[10px] text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/60 py-0.5">
                      Col {c}
                    </div>
                  ))}
                </div>

                {[0, 1, 2].map(r => (
                  <div key={r} className="flex items-center gap-1 mb-1">
                    <span className="w-7 text-[10px] text-purple-300 font-bold text-center bg-purple-950/60 border border-purple-800/60 py-2">
                      R{r}
                    </span>
                    <div className="flex items-stretch border border-neutral-700 bg-[#090b14] gap-1 p-0.5">
                      {[0, 1, 2].map(c => {
                        const isTarget = targetRow2D === r && targetCol2D === c;
                        return (
                          <div
                            key={c}
                            className={`w-14 h-12 flex flex-col items-center justify-center border transition-all ${
                              isTarget
                                ? 'bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                                : 'bg-[#0a0e1c] text-neutral-300 border-neutral-800'
                            }`}
                          >
                            <span className="text-[9px] opacity-75">A[{r}][{c}]</span>
                            <span className="text-sm font-bold">{matrix2D[r][c]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1D Physical RAM sequence */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-between w-full text-[10px] text-neutral-400 px-1">
                <span className="text-indigo-400 font-bold">1D CONTIGUOUS RAM (9 CELLS)</span>
                <span className="text-neutral-500">Loc = Base + Offset</span>
              </div>

              <div className="flex items-center">
                {linearMemoryCells2D.map((cell, idx) => {
                  const isTarget = idx === linearIndex2D;
                  return (
                    <div key={`2d-top-addr-${idx}`} className="w-13 text-center pb-1 text-[9px] font-bold">
                      <span
                        className={
                          isTarget
                            ? isLocatedPhase
                              ? 'text-emerald-400 font-black'
                              : 'text-cyan-400 font-black'
                            : idx === 0
                            ? 'text-indigo-300 font-bold'
                            : 'text-neutral-500'
                        }
                      >
                        {cell.addr}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-stretch border-2 border-neutral-700 bg-[#07090f] relative shadow-xl">
                {linearMemoryCells2D.map((cell, idx) => {
                  const isTarget = idx === linearIndex2D;
                  const isBase = idx === 0;

                  let bg = 'bg-[#090b14]';
                  let text = 'text-neutral-300';
                  let ring = '';

                  if (isTarget) {
                    if (isLocatedPhase) {
                      bg = 'bg-[#064e3b]';
                      text = 'text-emerald-200 font-black';
                      ring = 'ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
                    } else if (isOffsetPhase) {
                      bg = 'bg-cyan-950';
                      text = 'text-cyan-200 font-black';
                      ring = 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
                    } else {
                      bg = 'bg-[#0a2720]';
                      text = 'text-emerald-300 font-bold';
                      ring = 'ring-2 ring-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                    }
                  } else if (isBase) {
                    bg = 'bg-[#0f1426]';
                    text = 'text-indigo-200';
                  }

                  return (
                    <div
                      key={`2d-ram-cell-${idx}`}
                      className={`w-13 h-14 relative flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 transition-all ${bg} ${ring}`}
                    >
                      {isTarget && (
                        <motion.div
                          layoutId="2d-arrow"
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent z-20 ${
                            isLocatedPhase ? 'border-t-emerald-400' : 'border-t-cyan-400'
                          }`}
                        />
                      )}
                      <span className="text-[8px] text-neutral-400">A[{cell.row}][{cell.col}]</span>
                      <span className={`text-sm ${text}`}>{cell.val}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center pt-1.5">
                {linearMemoryCells2D.map((_, idx) => {
                  const isTarget = idx === linearIndex2D;
                  return (
                    <div key={`2d-bot-idx-${idx}`} className="w-13 text-center flex flex-col items-center gap-0.5 text-[9px]">
                      <span className={isTarget ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                        k={idx}
                      </span>
                      <span className="text-[8px] text-neutral-500">+{idx * elementSize}B</span>
                      {idx === 0 && (
                        <span className="text-[8px] text-indigo-300 bg-indigo-950/80 border border-indigo-700 px-1 mt-0.5 font-bold">
                          BASE
                        </span>
                      )}
                      {isTarget && (
                        <span
                          className={`text-[8px] font-black px-1.5 mt-0.5 ${
                            isLocatedPhase ? 'bg-emerald-400 text-neutral-950 shadow-sm' : 'bg-cyan-400 text-neutral-950 shadow-sm'
                          }`}
                        >
                          TARGET
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
