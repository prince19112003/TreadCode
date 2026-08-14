import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

interface HeapNodePos {
  index: number;
  x: number; // percentage
  y: number; // px offset
  parentIndex: number | null;
}

// Tree node positions for 7-element complete binary tree
const HEAP_NODE_POSITIONS: HeapNodePos[] = [
  { index: 0, x: 50, y: 35, parentIndex: null },
  { index: 1, x: 26, y: 105, parentIndex: 0 },
  { index: 2, x: 74, y: 105, parentIndex: 0 },
  { index: 3, x: 14, y: 175, parentIndex: 1 },
  { index: 4, x: 38, y: 175, parentIndex: 1 },
  { index: 5, x: 62, y: 175, parentIndex: 2 },
  { index: 6, x: 86, y: 175, parentIndex: 2 },
];

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
  return [4, 10, 3, 5, 1, 9, 8];
};

export const HeapSortVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const activeSteps = useLessonStore(s => s.activeSteps);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const zoom = useLessonStore(s => s.zoom);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract snapshot
  const mem = (currentStep?.memorySnapshot as any) || {};
  const currentArr = ensureArray(mem.arr);
  const phase = typeof mem.phase === 'string' ? mem.phase : 'INIT';
  const heapSize = typeof mem.heapSize === 'number' ? mem.heapSize : currentArr.length;
  const activeNode = typeof mem.activeNode === 'number' ? mem.activeNode : -1;
  const comparing = Array.isArray(mem.comparing) ? mem.comparing : [];
  const swapping = Array.isArray(mem.swapping) ? mem.swapping : [];
  const sortedIndices = Array.isArray(mem.sortedIndices) ? mem.sortedIndices : [];

  const maxSteps = activeSteps ? activeSteps.length : 1;

  // Auto-scroll to bottom as steps update
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStepIndex]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6 select-none custom-scrollbar"
    >
      <div
        className="w-full max-w-4xl flex flex-col items-center gap-6 transition-transform duration-200 ease-out py-2"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        
        {/* Minimal Header Status Bar */}
        <div className="flex items-center justify-between w-full bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="font-extrabold text-amber-300 tracking-wider">
              HEAP SORT ALGORITHM (MAX-HEAP BINARY TREE + ARRAY)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono text-xs">
            <div>
              <span className="text-slate-500">Heap Size:</span>{' '}
              <span className="font-bold text-amber-400">{heapSize} / 7</span>
            </div>
            <div>
              <span className="text-slate-500">Step:</span>{' '}
              <span className="font-bold text-amber-400">{currentStepIndex + 1} / {maxSteps}</span>
            </div>
          </div>
        </div>

        {/* TOP SECTION: Interactive Binary Tree Max-Heap Diagram */}
        <div className="w-full bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden shadow-2xl">
          <div className="w-full flex items-center justify-between font-mono text-[11px] text-slate-400 pb-2 border-b border-slate-900">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              MAX-HEAP BINARY TREE
            </span>
            <span className="uppercase text-[10px] text-slate-500">
              Phase: <strong className="text-slate-200">{phase}</strong>
            </span>
          </div>

          {/* SVG Canvas for Tree Edges */}
          <div className="w-full h-56 relative mt-2">
            <svg className="w-full h-full absolute inset-0 pointer-events-none stroke-slate-700/80" style={{ zIndex: 1 }}>
              {HEAP_NODE_POSITIONS.map(node => {
                if (node.parentIndex === null) return null;
                const parent = HEAP_NODE_POSITIONS[node.parentIndex];
                const isEdgeInHeap = node.index < heapSize && parent.index < heapSize;
                
                return (
                  <line
                    key={`edge-${node.index}`}
                    x1={`${parent.x}%`}
                    y1={parent.y + 16}
                    x2={`${node.x}%`}
                    y2={node.y + 16}
                    strokeWidth={isEdgeInHeap ? 2.5 : 1.5}
                    strokeDasharray={isEdgeInHeap ? 'none' : '4 3'}
                    className={isEdgeInHeap ? 'stroke-amber-500/60' : 'stroke-slate-800'}
                  />
                );
              })}
            </svg>

            {/* Tree Nodes */}
            {HEAP_NODE_POSITIONS.map(node => {
              const idx = node.index;
              const val = currentArr[idx] ?? 0;
              const isInHeap = idx < heapSize;
              const isSorted = sortedIndices.includes(idx);
              const isActive = idx === activeNode;
              const isComparing = comparing.includes(idx);
              const isSwapping = swapping.includes(idx);

              return (
                <motion.div
                  key={`node-${idx}`}
                  animate={{ scale: isSwapping ? 1.15 : isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    left: `${node.x}%`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-black text-sm transition-all duration-200 shadow-xl border-2 ${
                    isSwapping
                      ? 'bg-rose-950 border-rose-400 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.8)]'
                      : isComparing
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_16px_rgba(6,182,212,0.8)]'
                      : isActive
                      ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.8)]'
                      : isSorted
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 opacity-90'
                      : isInHeap
                      ? 'bg-slate-900 border-slate-600 text-slate-100'
                      : 'bg-slate-950 border-slate-800 text-slate-600 opacity-40'
                  }`}>
                    {val}
                  </div>

                  {/* Node Index Badge */}
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                    [{idx}]
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: 1D Contiguous Memory Array Block */}
        <div className="w-full flex flex-col items-center gap-2 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div className="w-full flex items-center justify-between font-mono text-[11px] text-slate-400 pb-2 border-b border-slate-900">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              1D MEMORY ARRAY REPRESENTATION
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Parent(i) = ⌊(i-1)/2⌋ | Left = 2i+1 | Right = 2i+2
            </span>
          </div>

          {/* Sharp Square Contiguous Array Block */}
          <div className="pt-3 flex flex-col items-center">
            <div className="inline-flex rounded-none border border-white/80 bg-slate-950/90 shadow-xl divide-x divide-white/80">
              {currentArr.map((val, idx) => {
                const isInHeap = idx < heapSize;
                const isSorted = sortedIndices.includes(idx);
                const isActive = idx === activeNode;
                const isComparing = comparing.includes(idx);
                const isSwapping = swapping.includes(idx);

                return (
                  <motion.div
                    key={idx}
                    animate={{ scale: isSwapping ? 1.05 : 1 }}
                    className={`w-14 h-12 flex items-center justify-center font-mono font-black text-sm transition-colors duration-150 ${
                      isSwapping
                        ? 'bg-rose-950/90 text-rose-200 shadow-[inset_0_0_12px_rgba(244,63,94,0.6)]'
                        : isComparing
                        ? 'bg-cyan-950/90 text-cyan-200 shadow-[inset_0_0_12px_rgba(6,182,212,0.6)]'
                        : isActive
                        ? 'bg-amber-950/90 text-amber-200 shadow-[inset_0_0_12px_rgba(251,191,36,0.6)]'
                        : isSorted
                        ? 'bg-emerald-950/80 text-emerald-300 shadow-[inset_0_0_10px_rgba(16,185,129,0.4)]'
                        : isInHeap
                        ? 'bg-slate-900/90 text-slate-100'
                        : 'bg-slate-950/60 text-slate-600 opacity-50'
                    }`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>

            {/* Sub-row Index Markers */}
            <div className="inline-flex w-full justify-around pt-1.5 px-0.5">
              {currentArr.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-14 text-center text-[10px] font-mono font-bold ${
                    sortedIndices.includes(idx) ? 'text-emerald-400' : idx < heapSize ? 'text-amber-400' : 'text-slate-600'
                  }`}
                >
                  [{idx}]
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal Legend Footer */}
        <div className="flex items-center justify-center gap-6 font-mono text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-400" />
            <span>Active Heap Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-950 border border-rose-400" />
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-400" />
            <span>Extracted & Sorted</span>
          </div>
        </div>

      </div>
    </div>
  );
};
