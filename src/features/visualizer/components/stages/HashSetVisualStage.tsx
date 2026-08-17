import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';
import { Layers, Database, ArrowRight } from 'lucide-react';

const CAPACITY = 8; // 8 buckets for a clean 2x4 grid layout

export const HashSetVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const zoom = useLessonStore(s => s.zoom);

  const mem = (currentStep?.memorySnapshot as any) || {};
  const activeVal: string = mem.activeVal ? String(mem.activeVal) : '';
  const action: 'ADD' | 'REMOVE' | 'CONTAINS' | 'INIT' | 'CLEAR' = mem.action || 'INIT';

  // Compute target bucket index modulo 8
  const hashIdx = activeVal ? Math.abs(parseInt(activeVal, 10) || 0) % CAPACITY : -1;

  // Real bucket map from step (defaults to empty buckets)
  const bucketData: Record<number, string[]> = mem.bucketMap || {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [],
  };

  // State flags
  const isDuplicate = action === 'ADD' && activeVal && (bucketData[hashIdx]?.filter(x => x === activeVal).length > 1);
  const isSearchFound = action === 'CONTAINS' && activeVal && bucketData[hashIdx]?.includes(activeVal);
  const isSearchNotFound = action === 'CONTAINS' && activeVal && !bucketData[hashIdx]?.includes(activeVal);
  const isCollision = hashIdx >= 0 && (bucketData[hashIdx]?.length || 0) > 1;

  return (
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6 select-none custom-scrollbar">
      <div
        className="relative w-full max-w-3xl flex flex-col items-center gap-5 transition-transform duration-200 ease-out py-2"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />
        {/* ── TOP SECTION: ELEGANT PIPELINE BANNER ── */}
        <div className="w-full bg-[#080c1d]/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-emerald-400" />
              <span className="font-extrabold text-slate-200 tracking-wider text-[11px] uppercase">
                HASHSET PIPELINE
              </span>
            </div>

            {/* Status Tag */}
            <AnimatePresence mode="wait">
              {isDuplicate ? (
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-xs">
                  Already Exists (Duplicate Ignored)
                </span>
              ) : isSearchFound ? (
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 shadow-xs">
                  Found in Bucket [{hashIdx}]
                </span>
              ) : isSearchNotFound ? (
                <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40 shadow-xs">
                  Not Found
                </span>
              ) : isCollision ? (
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/40 shadow-xs">
                  Collision (Chained)
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase tracking-wider">
                  {action}
                </span>
              )}
            </AnimatePresence>
          </div>

          {/* Formula Display */}
          <div className="flex items-center justify-between font-mono text-xs pt-0.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Input Value:</span>
              {activeVal ? (
                <span className="px-3 py-1 rounded-xl bg-emerald-400 text-slate-950 border border-emerald-300 font-black text-sm shadow-md">
                  {activeVal}
                </span>
              ) : (
                <span className="text-slate-600 italic text-xs">none</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
              {activeVal && hashIdx >= 0 ? (
                <>
                  <span className="text-slate-400">h("{activeVal}") = {activeVal} % {CAPACITY} =</span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 font-extrabold text-xs shadow-xs">
                    Bucket [{hashIdx}]
                  </span>
                </>
              ) : (
                <span className="text-slate-500 text-[11px]">Ready for add() or contains()</span>
              )}
            </div>
          </div>
        </div>

        {/* ── CENTRAL 2x4 GRID LAYOUT FOR BUCKETS ── */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
          {Array.from({ length: CAPACITY }, (_, i) => {
            const items = bucketData[i] || [];
            const isActiveBucket = i === hashIdx;
            const hasCollision = items.length > 1;

            return (
              <div
                key={i}
                className={`w-full flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 min-h-32 ${
                  isActiveBucket
                    ? 'bg-linear-to-r from-emerald-950/80 via-[#0d1726]/90 to-[#080c1d] border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/60'
                    : 'bg-[#080c1d]/80 border-slate-800/80 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Header Row inside Card */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <div className="flex items-center gap-2.5 font-mono">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-inner transition-all ${
                      isActiveBucket
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black'
                        : 'bg-slate-900/90 text-slate-400 border-slate-700/80'
                    }`}>
                      <Database size={15} className={isActiveBucket ? 'text-slate-950' : 'text-slate-500'} />
                    </div>

                    <span className={`text-xs font-black tracking-wide ${
                      isActiveBucket ? 'text-emerald-300' : 'text-slate-300'
                    }`}>
                      BUCKET [{i}]
                    </span>
                  </div>

                  {hasCollision && (
                    <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40">
                      Collision
                    </span>
                  )}
                </div>

                {/* Stored Elements inside Bucket Card */}
                <div className="flex items-center gap-2 flex-wrap font-mono text-xs pt-1">
                  {items.length === 0 ? (
                    <div className="w-full py-2 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 text-slate-600 text-center italic text-xs font-medium">
                      [ empty bucket slot ]
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap w-full">
                      {items.map((val, idx) => {
                        const isTargetValue = val === activeVal;
                        return (
                          <React.Fragment key={idx}>
                            <div
                              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all flex items-center gap-1 shadow-md border ${
                                isTargetValue && isActiveBucket
                                  ? 'bg-emerald-400 text-slate-950 border-emerald-200 font-black shadow-[0_0_15px_rgba(52,211,153,0.7)] scale-105'
                                  : 'bg-slate-900/90 text-slate-200 border-slate-700/80'
                              }`}
                            >
                              <span className="text-[10px] text-slate-400 font-mono">Key:</span>
                              <span className="font-mono text-xs">{val}</span>
                            </div>

                            {idx < items.length - 1 && (
                              <div className="flex items-center text-purple-400 px-0.5">
                                <ArrowRight size={13} className="stroke-[2.5]" />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
