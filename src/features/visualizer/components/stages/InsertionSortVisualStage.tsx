import React from 'react';
import { motion } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

interface PassRowData {
  passLabel: string;
  passNum: number;
  arr: number[];
  comparing: [number, number] | null;
  keyVal: number | null;
  sortedCount: number;
  isActive: boolean;
  isCompleted: boolean;
}

const ensureArray = (val: any): number[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      const parts = val.replace(/[\[\]]/g, '').split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parts.length > 0) return parts;
    }
  }
  return [12, 11, 13, 5, 6, 20];
};

export const InsertionSortVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const activeSteps = useLessonStore(s => s.activeSteps);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const zoom = useLessonStore(s => s.zoom);

  // Extract active snapshot
  const mem = (currentStep?.memorySnapshot as any) || {};
  const currentPassNum = typeof mem.pass === 'number' ? mem.pass : 1;
  const currentArr: number[] = ensureArray(mem.arr);
  const currentKey: number | null = typeof mem.key === 'number' ? mem.key : null;
  const currentSortedCount: number = typeof mem.sortedCount === 'number' ? mem.sortedCount : (typeof mem.i === 'number' ? mem.i : 1);

  const ev = (currentStep?.animationEvent as any) || {};
  let currentComparing: [number, number] | null = null;

  if (ev.type === 'COMPARE_INDICES' && typeof ev.indexA === 'number' && typeof ev.indexB === 'number') {
    currentComparing = [ev.indexA, ev.indexB];
  } else if (mem.comparing && Array.isArray(mem.comparing)) {
    currentComparing = [mem.comparing[0], mem.comparing[1]];
  }

  // Build history of pass snapshot rows up to current pass
  const maxPasses = 5;
  const passRows: PassRowData[] = [];

  // 1. Initial State Row
  const firstStep = activeSteps ? activeSteps[0] : null;
  const initialArr = ensureArray((firstStep?.memorySnapshot as any)?.arr);
  passRows.push({
    passLabel: 'INITIAL',
    passNum: 0,
    arr: initialArr,
    comparing: currentPassNum === 1 && currentStepIndex === 0 ? currentComparing : null,
    keyVal: null,
    sortedCount: 1,
    isActive: currentStepIndex === 0,
    isCompleted: currentStepIndex > 0,
  });

  // 2. Pass 1 to Pass 5 Rows (Revealed progressively as algorithm reaches each pass)
  for (let p = 1; p <= maxPasses; p++) {
    const stepsArr = activeSteps || [];

    // Reveal pass p ONLY if the algorithm has reached pass p in the execution timeline
    const isRevealed = currentPassNum >= p && currentStepIndex > 0;

    if (isRevealed) {
      let passStep = stepsArr.slice(0, currentStepIndex + 1).reverse().find((s: any) => s.memorySnapshot?.pass === p);
      if (!passStep) {
        passStep = stepsArr.find((s: any) => s.memorySnapshot?.pass === p);
      }

      const isActive = currentPassNum === p && currentStepIndex > 0;
      const isCompleted = currentPassNum > p;

      if (passStep) {
        const stepMem = (passStep as any).memorySnapshot || {};
        const rowArr = ensureArray(isActive ? currentArr : (stepMem.arr || currentArr));
        const rowKey = isActive ? currentKey : (typeof stepMem.key === 'number' ? stepMem.key : null);
        const rowSortedCount = isActive ? currentSortedCount : (typeof stepMem.sortedCount === 'number' ? stepMem.sortedCount : p + 1);

        passRows.push({
          passLabel: `PASS ${p}`,
          passNum: p,
          arr: rowArr,
          comparing: isActive ? currentComparing : null,
          keyVal: rowKey,
          sortedCount: rowSortedCount,
          isActive,
          isCompleted,
        });
      }
    }
  }

  // Auto-scroll to bottom whenever step or pass row count updates
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStepIndex, passRows.length]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6 select-none custom-scrollbar"
    >
      <div
        className="w-full max-w-4xl flex flex-col items-center gap-4 transition-transform duration-200 ease-out py-2"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        
        {/* Minimal Header Status Bar */}
        <div className="flex items-center justify-between w-full bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span className="font-extrabold text-indigo-300 tracking-wider">
              INSERTION SORT VISUALIZER (KEY-INSERTION)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500">Pass:</span>
              <span className="font-bold text-indigo-400">{currentPassNum} / 5</span>
            </div>
            <div className="w-px h-3.5 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500">Active Key:</span>
              <span className="font-extrabold text-indigo-300">{currentKey !== null ? currentKey : '-'}</span>
            </div>
          </div>
        </div>

        {/* Minimal Pass Rows List (Contiguous Array Look with Sharp White Border) */}
        <div className="w-full flex flex-col gap-5 py-2">
          {passRows.map((row) => (
            <motion.div
              key={row.passLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2 border-b border-slate-900/80 transition-all ${
                row.isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {/* Left Row Label */}
              <div className="flex items-center gap-2.5 min-w-36 shrink-0">
                <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-[11px] tracking-wider uppercase border ${
                  row.isActive
                    ? 'bg-indigo-500 text-slate-950 border-indigo-400 shadow-sm font-black'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800'
                }`}>
                  {row.passLabel}
                </span>

                {row.isActive && row.keyVal !== null && (
                  <span className="text-[10px] font-mono text-indigo-300 font-bold flex items-center gap-1">
                    KEY = {row.keyVal}
                  </span>
                )}
                {row.isActive && row.comparing && (
                  <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    SHIFT
                  </span>
                )}
              </div>

              {/* Contiguous Memory Array Block (Sharp Square Boxes with White Border) */}
              <div className="flex flex-col items-center">
                <div className="inline-flex rounded-none border border-white/80 bg-slate-950/90 shadow-lg divide-x divide-white/80">
                  {ensureArray(row.arr).map((val, idx) => {
                    const isKey = row.keyVal !== null && val === row.keyVal && idx >= row.sortedCount - 1;
                    const isComparing = row.comparing && (row.comparing[0] === idx || row.comparing[1] === idx);
                    const isSorted = idx < row.sortedCount;

                    return (
                      <motion.div
                        key={idx}
                        layout
                        animate={{
                          scale: isComparing ? 1.03 : 1,
                        }}
                        className={`w-14 h-12 flex items-center justify-center font-mono font-black text-sm transition-colors duration-150 ${
                          isComparing
                            ? 'bg-amber-950/90 text-amber-200 shadow-[inset_0_0_12px_rgba(251,191,36,0.4)]'
                            : isKey
                            ? 'bg-indigo-950/90 text-indigo-200 shadow-[inset_0_0_12px_rgba(99,102,241,0.5)]'
                            : isSorted
                            ? 'bg-emerald-950/70 text-emerald-300'
                            : 'bg-slate-900/60 text-slate-200'
                        }`}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Sub-row Index Markers below continuous block */}
                <div className="inline-flex w-full justify-around pt-1.5 px-0.5">
                  {ensureArray(row.arr).map((_, idx) => {
                    const isSorted = idx < row.sortedCount;
                    return (
                      <span
                        key={idx}
                        className={`w-14 text-center text-[10px] font-mono font-bold ${
                          isSorted ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        [{idx}]
                      </span>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Minimal Legend Footer */}
        <div className="flex items-center justify-center gap-6 font-mono text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-950 border border-indigo-400" />
            <span>Picked Key (KEY)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-950 border border-amber-400" />
            <span>Compare / Shift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-950 border border-emerald-400" />
            <span>Sorted Subarray</span>
          </div>
        </div>

      </div>
    </div>
  );
};

