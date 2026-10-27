import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';
import type { PartitionTreeNode } from '../QuickSortOperationalPanel';

export const QuickSortVisualStage: React.FC = () => {
  const currentStepIndex = useLessonStore((s: any) => s.currentStepIndex);
  const activeSteps = useLessonStore((s: any) => s.activeSteps) || [];
  const zoom = useLessonStore((s: any) => s.zoom) || 1;

  const currentStep = activeSteps[currentStepIndex] || activeSteps[0] || {};
  const mem = currentStep?.memorySnapshot || {};

  const currentArr: number[] = Array.isArray(mem.arr)
    ? mem.arr
    : [52, 38, 74, 19, 63, 27, 85, 41];
  const low: number = typeof mem.low === 'number' ? mem.low : 0;
  const high: number = typeof mem.high === 'number' ? mem.high : 7;
  const pivotIdx: number = typeof mem.pivotIdx === 'number' ? mem.pivotIdx : 7;
  const pivotVal: number = typeof mem.pivotVal === 'number' ? mem.pivotVal : currentArr[7];
  const iPtr: number = typeof mem.i === 'number' ? mem.i : -1;
  const jPtr: number = typeof mem.j === 'number' ? mem.j : 0;
  const sortedIndices: number[] = Array.isArray(mem.sortedIndices) ? mem.sortedIndices : [];
  const comparing: [number, number] | null = Array.isArray(mem.comparing) ? [mem.comparing[0], mem.comparing[1]] : null;
  const swapping: [number, number] | null = Array.isArray(mem.swapping) ? [mem.swapping[0], mem.swapping[1]] : null;
  const phase: string = mem.phase || 'INIT';
  const phaseTitle: string = mem.phaseTitle || 'PHASE: PARTITIONING WINDOW';
  const activeNodeId: string = mem.activeNodeId || '';
  const partitionTree: PartitionTreeNode[] = Array.isArray(mem.partitionTree) ? mem.partitionTree : [];
  const isFinished: boolean = Boolean(mem.isFinished) || (currentStepIndex >= activeSteps.length - 1 && activeSteps.length > 1);

  // Group partition tree nodes by depth for multi-level phase diagram
  const treeByDepth: Record<number, PartitionTreeNode[]> = {};
  partitionTree.forEach(node => {
    if (!treeByDepth[node.depth]) treeByDepth[node.depth] = [];
    treeByDepth[node.depth].push(node);
  });
  const maxDepth = Math.max(...Object.keys(treeByDepth).map(Number), 0);

  return (
    <div className="flex-1 min-h-0 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto custom-scrollbar p-3 select-none relative font-mono text-neutral-200">
      <div
        className="relative w-full max-w-5xl flex flex-col items-center justify-start gap-4 transition-transform duration-150 ease-out py-2"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Section 1: Active Phase & Status Bar ── */}
        <div className="flex flex-col items-center gap-2 max-w-4xl w-full">
          <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 bg-[#080b13] border border-neutral-800 text-xs shadow-md">
            {/* Active Window */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold text-[10.5px]">
              <span className="text-neutral-500 text-[9px] uppercase tracking-wider">WINDOW:</span>
              <span className="text-white font-black">[{low} .. {high}]</span>
              <span className="text-neutral-400 text-[9px]">({high >= low ? high - low + 1 : 0} items)</span>
            </div>

            {/* Pivot Value */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-purple-950/90 border border-purple-500/60 text-purple-200 font-bold text-[11px]">
              <span className="text-[9px] text-purple-400 uppercase tracking-wider">PIVOT:</span>
              <span className="text-white font-black">
                {pivotIdx >= 0 ? `A[${pivotIdx}] (${pivotVal})` : '—'}
              </span>
            </div>

            {/* Boundary i Pointer */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 font-bold text-[11px]">
              <span className="text-[9px] text-emerald-400 uppercase tracking-wider">i (BOUNDARY &lt; P):</span>
              <span className="text-white font-black">{iPtr}</span>
            </div>

            {/* Scanner j Pointer */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-950/90 border border-cyan-500/60 text-cyan-200 font-bold text-[11px]">
              <span className="text-[9px] text-cyan-400 uppercase tracking-wider">j (SCANNER):</span>
              <span className="text-white font-black">{jPtr >= 0 && !isFinished ? jPtr : '—'}</span>
            </div>

            {/* Phase Tag */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-950/80 border border-amber-600/60 text-amber-300 font-bold text-[10px]">
              <span>{phase}</span>
            </div>
          </div>

          {/* Action Callout Banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`qs-msg-${currentStepIndex}-${phase}-${swapping ? 'swap' : comparing ? 'cmp' : 'idle'}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1 }}
              className={`px-4 py-1.5 text-xs font-bold border transition-colors text-center w-full max-w-4xl ${
                isFinished
                  ? 'bg-[#061510] border-emerald-500 text-emerald-300'
                  : phase === 'PIVOT_LOCK'
                  ? 'bg-[#1b0826] border-purple-400 text-purple-200'
                  : swapping
                  ? 'bg-[#261504] border-amber-400 text-amber-200'
                  : comparing
                  ? 'bg-[#042832] border-cyan-400 text-cyan-200'
                  : 'bg-[#0a0e19] border-neutral-700 text-neutral-200'
              }`}
            >
              <span>{currentStep?.explanationEnglish || phaseTitle}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Section 2: Active Working Array (8 Elements) ── */}
        <div className="flex flex-col items-center gap-1 mt-1 w-full max-w-4xl">
          <div className="flex items-center justify-between w-full text-xs text-neutral-400 px-1 font-bold">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 uppercase tracking-wider">ACTIVE PARTITION ARRAY</span>
              <span className="text-[10px] text-neutral-500">(8 Elements)</span>
            </div>
            <span className="text-[10px] text-neutral-400">
              {isFinished ? 'All 8 elements sorted in-place' : `Current Sub-problem: Window [${low} .. ${high}]`}
            </span>
          </div>

          {/* Pointers Row Above Array Cells */}
          <div className="flex items-center justify-center w-full">
            {currentArr.map((_, idx) => {
              const isPivot = idx === pivotIdx && !isFinished;
              const isJ = idx === jPtr && !isFinished && idx !== pivotIdx;

              return (
                <div
                  key={`top-ptr-${idx}`}
                  className="w-13 sm:w-16 md:w-18 h-7 text-center flex flex-col items-center justify-end pb-0.5 relative"
                >
                  {isPivot ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black px-1.5 py-0.2 bg-purple-500 text-neutral-950 uppercase tracking-wider">
                        PIVOT
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-500" />
                    </div>
                  ) : isJ ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black px-1.5 py-0.2 bg-cyan-400 text-neutral-950 uppercase tracking-wider">
                        j SCAN
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* 8 Array Cells Row (Sharp 90-degree Corners, 1px Borders) */}
          <div className="flex items-stretch border-2 border-neutral-700 bg-[#060810] relative shadow-lg rounded-none">
            {currentArr.map((val, idx) => {
              const inWindow = idx >= low && idx <= high && !isFinished;
              const isLockedPivot = sortedIndices.includes(idx) || isFinished;
              const isComparing = comparing ? comparing.includes(idx) : false;
              const isSwapping = swapping ? swapping.includes(idx) : false;
              const isCurrentPivot = idx === pivotIdx && !isFinished;
              const isLeftRegion = inWindow && idx <= iPtr && !isLockedPivot;
              const isRightRegion = inWindow && idx > iPtr && idx < jPtr && !isLockedPivot && idx !== pivotIdx;

              let bg = inWindow ? 'bg-[#090d18]' : 'bg-[#04060c] opacity-40';
              let text = inWindow ? 'text-neutral-100' : 'text-neutral-600';
              let ring = '';

              if (isLockedPivot) {
                bg = 'bg-[#052317]';
                text = 'text-emerald-300 font-bold';
                ring = 'border border-emerald-500/70';
              } else if (isSwapping) {
                bg = 'bg-[#331806]';
                text = 'text-amber-200 font-black';
                ring = 'ring-2 ring-amber-400 z-20';
              } else if (isComparing) {
                bg = 'bg-[#042832]';
                text = 'text-cyan-200 font-black';
                ring = 'ring-2 ring-cyan-400 z-20';
              } else if (isCurrentPivot) {
                bg = 'bg-[#250a35]';
                text = 'text-purple-200 font-black';
                ring = 'ring-2 ring-purple-500 z-10';
              } else if (isLeftRegion) {
                bg = 'bg-[#071f16]';
                text = 'text-emerald-200 font-bold';
                ring = 'border border-emerald-600/50';
              } else if (isRightRegion) {
                bg = 'bg-[#211707]';
                text = 'text-amber-200 font-bold';
                ring = 'border border-amber-600/50';
              }

              return (
                <div
                  key={`cell-${idx}`}
                  className={`w-13 sm:w-16 md:w-18 h-16 sm:h-18 md:h-20 relative flex flex-col items-center justify-center border-r last:border-r-0 border-neutral-700 transition-all rounded-none ${bg} ${ring}`}
                >
                  <span className="text-[9px] text-neutral-400 font-medium mb-0.5">A[{idx}]</span>
                  <span className={`text-lg sm:text-xl md:text-2xl font-black ${text}`}>{val}</span>
                  {!inWindow && !isLockedPivot && (
                    <span className="text-[7px] text-neutral-600 uppercase tracking-tight mt-0.5">dimmed</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Badges Row Below Cells */}
          <div className="flex items-center justify-center w-full pt-1.5">
            {currentArr.map((_, idx) => {
              const isLockedPivot = sortedIndices.includes(idx) || isFinished;
              const isI = idx === iPtr && !isFinished;
              const inWindow = idx >= low && idx <= high && !isFinished;
              const isLeftRegion = inWindow && idx <= iPtr && !isLockedPivot;
              const isRightRegion = inWindow && idx > iPtr && idx < jPtr && !isLockedPivot && idx !== pivotIdx;

              return (
                <div
                  key={`bot-ptr-${idx}`}
                  className="w-13 sm:w-16 md:w-18 h-7 text-center flex flex-col items-center justify-start gap-0.5 relative"
                >
                  {isLockedPivot ? (
                    <span className="text-[8px] font-bold px-1 py-0.5 bg-emerald-950/90 border border-emerald-500/60 text-emerald-300">
                      👑 LOCKED
                    </span>
                  ) : isI ? (
                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-400 text-neutral-950">
                      i = {idx}
                    </span>
                  ) : isLeftRegion ? (
                    <span className="text-[7.5px] font-bold px-1 py-0.2 bg-emerald-950/70 border border-emerald-700/50 text-emerald-300">
                      &lt; PIVOT
                    </span>
                  ) : isRightRegion ? (
                    <span className="text-[7.5px] font-bold px-1 py-0.2 bg-amber-950/70 border border-amber-700/50 text-amber-300">
                      ≥ PIVOT
                    </span>
                  ) : inWindow && idx === pivotIdx ? (
                    <span className="text-[7.5px] font-bold px-1 py-0.2 bg-purple-950/80 border border-purple-600/60 text-purple-300">
                      PIVOT
                    </span>
                  ) : (
                    <span className="text-[8px] text-neutral-700 font-mono">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 3: Conceptual Divide & Conquer Partition Tree ── */}
        <div className="w-full max-w-4xl border border-neutral-800 bg-[#060810] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-neutral-200 uppercase tracking-wider">
                DIVIDE & CONQUER: RECURSIVE PARTITION TREE
              </span>
              <span className="text-[9.5px] text-neutral-500">
                Visualizes how the 8-element array splits into sub-problems at each locked pivot
              </span>
            </div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 bg-cyan-400 inline-block" /> Active Sub-problem
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-500 inline-block" /> Partitioned / Locked
              </span>
              <span className="flex items-center gap-1 text-neutral-500">
                <span className="w-2 h-2 bg-neutral-700 inline-block" /> Queued
              </span>
            </div>
          </div>

          {/* Tree Levels */}
          <div className="flex flex-col gap-2.5 overflow-x-auto py-1">
            {Array.from({ length: maxDepth + 1 }).map((_, depth) => {
              const nodesAtDepth = treeByDepth[depth] || [];
              if (nodesAtDepth.length === 0) return null;

              return (
                <div key={`depth-${depth}`} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                      {depth === 0 ? 'ROOT' : `LEVEL ${depth} SUB-ARRAYS`}:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {nodesAtDepth.map(node => {
                      const isActive = node.id === activeNodeId && !isFinished;
                      const isDone = node.status === 'completed' || isFinished;
                      const isBase = node.range[0] === node.range[1];

                      let borderClass = 'border-neutral-800 bg-[#090c15] text-neutral-400';
                      let badge = (
                        <span className="text-[8px] px-1 py-0.2 bg-neutral-800 text-neutral-400">
                          WAITING
                        </span>
                      );

                      if (isActive) {
                        borderClass = 'border-cyan-400 bg-[#041d26] text-cyan-100 shadow-md ring-1 ring-cyan-400';
                        badge = (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 bg-cyan-400 text-neutral-950">
                            ACTIVE
                          </span>
                        );
                      } else if (isDone) {
                        borderClass = 'border-emerald-600/70 bg-[#061e15] text-emerald-200';
                        badge = (
                          <span className="text-[8px] font-bold px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/60 text-emerald-300">
                            ✓ FIXED
                          </span>
                        );
                      }

                      return (
                        <div
                          key={node.id}
                          className={`flex flex-col p-2 border transition-all rounded-none min-w-44 ${borderClass}`}
                        >
                          <div className="flex items-center justify-between text-[9px] mb-1 gap-2">
                            <span className="font-bold">
                              Window [{node.range[0]}..{node.range[1]}]
                            </span>
                            {badge}
                          </div>

                          {/* Mini Elements Row */}
                          <div className="flex items-center gap-1 my-1">
                            {node.elements.map((val, idx) => {
                              const globalIdx = node.range[0] + idx;
                              const isPivot = globalIdx === node.range[1] && !isBase;
                              return (
                                <div
                                  key={idx}
                                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border rounded-none ${
                                    isPivot
                                      ? 'border-purple-400 bg-purple-950 text-purple-200'
                                      : 'border-neutral-700 bg-neutral-900 text-neutral-200'
                                  }`}
                                >
                                  {val}
                                </div>
                              );
                            })}
                          </div>

                          {/* Node Footer Details */}
                          <div className="flex items-center justify-between text-[8.5px] text-neutral-400 pt-0.5 border-t border-neutral-800">
                            <span>Pivot: {isBase ? node.elements[0] : node.pivotVal}</span>
                            {node.finalPivotPos !== null && (
                              <span className="text-emerald-400 font-semibold">
                                Locks at A[{node.finalPivotPos}]
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 4: Conceptual Invariant Ledger ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-4xl text-[10px]">
          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-emerald-400 uppercase text-[9px]">1. Left Region [low .. i]</span>
            <span className="text-neutral-400 text-[9.5px]">
              Guaranteed elements strictly smaller than Pivot (<span className="text-emerald-300">&lt; Pivot</span>).
            </span>
          </div>

          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-amber-400 uppercase text-[9px]">2. Right Region [i+1 .. j-1]</span>
            <span className="text-neutral-400 text-[9.5px]">
              Guaranteed elements greater or equal to Pivot (<span className="text-amber-300">≥ Pivot</span>).
            </span>
          </div>

          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-purple-400 uppercase text-[9px]">3. Pivot Lock-In (A[i+1])</span>
            <span className="text-neutral-400 text-[9.5px]">
              Swap Pivot into <span className="text-white font-bold">A[i+1]</span>. It will never move again in subsequent recursions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
