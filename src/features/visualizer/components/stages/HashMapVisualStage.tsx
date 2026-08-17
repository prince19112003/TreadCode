import React from 'react';
import { motion } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

const CAPACITY = 7;

export const HashMapVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const zoom = useLessonStore(s => s.zoom);

  const mem = (currentStep?.memorySnapshot as any) || {};
  const entries: [string, string][] = Array.isArray(mem.entries) ? mem.entries : [['id', '101'], ['name', 'Alice'], ['age', '24']];
  const bucketMap: Record<number, [string, string][]> = mem.bucketMap || {};
  const targetIdx: number = typeof mem.targetIdx === 'number' ? mem.targetIdx : -1;
  const activeKey: string = mem.activeKey || '';
  const activeVal: string = mem.activeVal || '';
  const action: string = mem.action || 'INIT';

  // Fill default bucket map if missing
  const buckets = Array.from({ length: CAPACITY }, (_, i) => ({
    index: i,
    items: bucketMap[i] || [],
  }));

  return (
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6 select-none custom-scrollbar">
      <div
        className="relative w-full max-w-4xl flex flex-col items-center gap-6 transition-transform duration-200 ease-out py-2"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />
        {/* Minimal Header Status Bar */}
        <div className="flex items-center justify-between w-full bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            <span className="font-extrabold text-indigo-300 tracking-wider">
              HASHMAP VISUALIZER (KEY-VALUE BUCKETS)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono text-xs">
            <span>Pairs: <strong className="text-indigo-400">{entries.length}</strong></span>
            <div className="w-px h-3.5 bg-slate-800" />
            <span>Buckets: <strong className="text-indigo-400">{CAPACITY}</strong></span>
          </div>
        </div>

        {/* Action Status Banner */}
        {activeKey && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-1.5 rounded-xl border font-mono text-xs font-bold shadow-lg flex items-center gap-2 ${
              action === 'PUT'
                ? 'bg-indigo-950/90 border-indigo-500/60 text-indigo-200'
                : action === 'REMOVE'
                ? 'bg-rose-950/90 border-rose-500/60 text-rose-200'
                : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200'
            }`}
          >
            <span className="uppercase tracking-widest text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-current">
              {action}
            </span>
            <span>Target Key: "{activeKey}" {activeVal ? `➔ Value: "${activeVal}"` : ''} | Hash Index: Bucket [{targetIdx}]</span>
          </motion.div>
        )}

        {/* Buckets Grid (Chaining / Key-Value Bucket Arrays) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-3 py-2">
          {buckets.map((b) => {
            const isTargetBucket = b.index === targetIdx;

            return (
              <div
                key={b.index}
                className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all duration-200 ${
                  isTargetBucket
                    ? 'bg-indigo-950/80 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.35)] ring-2 ring-indigo-400/50'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                {/* Bucket Index Header */}
                <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-1.5 mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    [{b.index}]
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    h(k)={b.index}
                  </span>
                </div>

                {/* Chained Key-Value Pairs in Bucket */}
                <div className="flex flex-col gap-1.5 w-full min-h-24 justify-start">
                  {b.items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[10px] font-mono text-slate-600 italic">
                      Empty
                    </div>
                  ) : (
                    b.items.map(([k, v], idx) => {
                      const isMatch = k === activeKey;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`w-full py-1.5 px-2 rounded-xl font-mono text-xs flex flex-col items-center justify-center shadow-md border gap-0.5 ${
                            isMatch
                              ? 'bg-indigo-500 text-white border-indigo-300 font-black shadow-[0_0_15px_rgba(129,140,248,0.8)] scale-105'
                              : 'bg-slate-900 border-slate-700/80 text-slate-200'
                          }`}
                        >
                          <span className="text-[10px] text-indigo-300 font-bold tracking-tight">
                            {k}
                          </span>
                          <span className="text-xs font-mono font-black text-amber-300">
                            → {v}
                          </span>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-center gap-6 font-mono text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-950 border border-indigo-400" />
            <span>Key → Value Pair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-950 border border-amber-400" />
            <span>Mapped Value</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-950 border border-slate-700" />
            <span>O(1) Avg Lookup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
