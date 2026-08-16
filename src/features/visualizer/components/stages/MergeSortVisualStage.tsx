import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

interface TreeNodeBlock {
  id: string;
  arr: number[];
  range: [number, number]; // [left, right]
}

interface TreeLevel {
  levelIndex: number;
  label: string;
  subLabel: string;
  type: 'DIVIDE' | 'BASE' | 'MERGE' | 'COMPLETE';
  blocks: TreeNodeBlock[];
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
  return [38, 27, 43, 3, 9, 82];
};

export const MergeSortVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const activeSteps = useLessonStore(s => s.activeSteps);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const zoom = useLessonStore(s => s.zoom);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract snapshot
  const mem = (currentStep?.memorySnapshot as any) || {};
  const currentArr = ensureArray(mem.arr);

  // Extract initial array from step 0
  const firstStep = activeSteps ? activeSteps[0] : null;
  const initialArr = ensureArray((firstStep?.memorySnapshot as any)?.arr || currentArr);

  // Build exact 7-Level Diamond/Tree Diagram for 6 elements
  const buildExactMergeTree = (input: number[]): TreeLevel[] => {
    // Ensure input is exactly 6 elements (pad or slice if needed)
    const arr = input.slice(0, 6);
    while (arr.length < 6) arr.push(10);

    const a0 = arr[0], a1 = arr[1], a2 = arr[2], a3 = arr[3], a4 = arr[4], a5 = arr[5];

    // Helper to sort small subarray
    const sortSub = (items: number[]) => [...items].sort((x, y) => x - y);

    const pair01 = sortSub([a0, a1]);
    const pair34 = sortSub([a3, a4]);
    const halfLeft = sortSub([a0, a1, a2]);
    const halfRight = sortSub([a3, a4, a5]);
    const fullSorted = sortSub([a0, a1, a2, a3, a4, a5]);

    return [
      // Level 0: Root Initial Array
      {
        levelIndex: 0,
        label: 'LEVEL 0: INITIAL ARRAY',
        subLabel: `Original 6-Element Array: [${arr.join(', ')}]`,
        type: 'DIVIDE',
        blocks: [
          { id: 'l0-0', arr: [a0, a1, a2, a3, a4, a5], range: [0, 5] },
        ],
      },
      // Level 1: Divide into 2 Halves (Size 3 + Size 3)
      {
        levelIndex: 1,
        label: 'LEVEL 1: SPLIT INTO TWO HALVES',
        subLabel: `Split [0..5] → Left [0..2] & Right [3..5]`,
        type: 'DIVIDE',
        blocks: [
          { id: 'l1-0', arr: [a0, a1, a2], range: [0, 2] },
          { id: 'l1-1', arr: [a3, a4, a5], range: [3, 5] },
        ],
      },
      // Level 2: Divide into Sub-blocks (Sizes 2, 1, 2, 1)
      {
        levelIndex: 2,
        label: 'LEVEL 2: SPLIT SUB-ARRAYS',
        subLabel: `Split Left → [0..1] & [2], Split Right → [3..4] & [5]`,
        type: 'DIVIDE',
        blocks: [
          { id: 'l2-0', arr: [a0, a1], range: [0, 1] },
          { id: 'l2-1', arr: [a2], range: [2, 2] },
          { id: 'l2-2', arr: [a3, a4], range: [3, 4] },
          { id: 'l2-3', arr: [a5], range: [5, 5] },
        ],
      },
      // Level 3: Base Single Elements (Size 1 each)
      {
        levelIndex: 3,
        label: 'LEVEL 3: SINGLE ELEMENTS (BASE CASE)',
        subLabel: `All elements separated into individual boxes [1 element each]`,
        type: 'BASE',
        blocks: [
          { id: 'l3-0', arr: [a0], range: [0, 0] },
          { id: 'l3-1', arr: [a1], range: [1, 1] },
          { id: 'l3-2', arr: [a2], range: [2, 2] },
          { id: 'l3-3', arr: [a3], range: [3, 3] },
          { id: 'l3-4', arr: [a4], range: [4, 4] },
          { id: 'l3-5', arr: [a5], range: [5, 5] },
        ],
      },
      // Level 4: Merge Pairs ([a0] & [a1] ➔ pair01, [a3] & [a4] ➔ pair34)
      {
        levelIndex: 4,
        label: 'LEVEL 4: MERGE ADJACENT PAIRS',
        subLabel: `Merge [${a0}] & [${a1}] → [${pair01.join(', ')}], Merge [${a3}] & [${a4}] → [${pair34.join(', ')}]`,
        type: 'MERGE',
        blocks: [
          { id: 'l4-0', arr: pair01, range: [0, 1] },
          { id: 'l4-1', arr: [a2], range: [2, 2] },
          { id: 'l4-2', arr: pair34, range: [3, 4] },
          { id: 'l4-3', arr: [a5], range: [5, 5] },
        ],
      },
      // Level 5: Merge 3-Element Halves (pair01 + [a2] ➔ halfLeft, pair34 + [a5] ➔ halfRight)
      {
        levelIndex: 5,
        label: 'LEVEL 5: MERGE INTO 3-ELEMENT HALVES',
        subLabel: `Merge [${pair01.join(', ')}] + [${a2}] → [${halfLeft.join(', ')}], Merge [${pair34.join(', ')}] + [${a5}] → [${halfRight.join(', ')}]`,
        type: 'MERGE',
        blocks: [
          { id: 'l5-0', arr: halfLeft, range: [0, 2] },
          { id: 'l5-1', arr: halfRight, range: [3, 5] },
        ],
      },
      // Level 6: Final Merge into Full Sorted Array
      {
        levelIndex: 6,
        label: 'LEVEL 6: FINAL MERGE (COMPLETE SORT)',
        subLabel: `Merge Left [${halfLeft.join(', ')}] + Right [${halfRight.join(', ')}] → [${fullSorted.join(', ')}]`,
        type: 'COMPLETE',
        blocks: [
          { id: 'l6-0', arr: fullSorted, range: [0, 5] },
        ],
      },
    ];
  };

  const allLevels = buildExactMergeTree(initialArr);
  const maxSteps = activeSteps ? activeSteps.length : 1;

  // Map step index directly to tree level progression
  // Step 0 = Level 0 (Root)
  // Step 1 = Level 1 (Split 1)
  // Step 2 = Level 2 (Split 2)
  // Step 3 = Level 3 (Base)
  // Step 4 = Level 4 (Merge Pairs)
  // Step 5 = Level 5 (Merge Halves)
  // Step 6+ = Level 6 (Complete)
  const activeLevelIdx = Math.min(allLevels.length - 1, currentStepIndex);
  const visibleLevels = allLevels.slice(0, activeLevelIdx + 1);

  // Auto-scroll to bottom as tree grows
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStepIndex, visibleLevels.length]);

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
        <div className="flex items-center justify-between w-full bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl shadow-lg backdrop-blur-md font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="font-extrabold text-purple-300 tracking-wider">
              MERGE SORT ALGORITHM (DIVIDE & CONQUER TREE)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300 font-mono text-xs">
            <span className="text-slate-500">Step:</span>
            <span className="font-bold text-purple-400">{currentStepIndex + 1} / {maxSteps}</span>
          </div>
        </div>

        {/* Tree Diagram Container */}
        <div className="w-full flex flex-col items-center gap-6 py-2">
          {visibleLevels.map((lvl, lIdx) => {
            const isCurrentActive = lIdx === visibleLevels.length - 1;

            return (
              <React.Fragment key={lvl.levelIndex}>
                
                {/* Level Row Label & Array Blocks */}
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-2 w-full"
                >
                  {/* Phase Label & Step Explanation */}
                  <div className="flex flex-col items-center gap-1 font-mono text-[10px]">
                    <span className={`px-2.5 py-0.5 rounded border uppercase font-extrabold tracking-wider ${
                      lvl.type === 'COMPLETE'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : lvl.type === 'MERGE'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : lvl.type === 'BASE'
                        ? 'bg-amber-950 border-amber-400 text-amber-300'
                        : 'bg-purple-950 border-purple-400 text-purple-300'
                    }`}>
                      {lvl.label}
                    </span>

                    {/* Explanatory Action Banner */}
                    <span className="text-[11px] font-bold text-slate-300">
                      {lvl.subLabel}
                    </span>
                  </div>

                  {/* Level Blocks Flex Row (Exact 6 Elements Total across row) */}
                  <div className="flex items-center justify-center gap-4 flex-wrap w-full py-1">
                    {lvl.blocks.map((block) => (
                      <div key={block.id} className="flex flex-col items-center">
                        
                        {/* Contiguous Array Block (Sharp Square Boxes with White Border) */}
                        <div className={`inline-flex rounded-none border shadow-lg divide-x transition-all duration-200 ${
                          isCurrentActive
                            ? lvl.type === 'COMPLETE'
                              ? 'border-emerald-400 bg-emerald-950/90 shadow-[0_0_20px_rgba(16,185,129,0.7)] divide-emerald-400/80 ring-2 ring-emerald-400'
                              : lvl.type === 'MERGE'
                              ? 'border-cyan-400 bg-cyan-950/90 shadow-[0_0_20px_rgba(6,182,212,0.7)] divide-cyan-400/80 ring-2 ring-cyan-400'
                              : lvl.type === 'BASE'
                              ? 'border-amber-400 bg-amber-950/90 shadow-[0_0_20px_rgba(251,191,36,0.7)] divide-amber-400/80 ring-2 ring-amber-400'
                              : 'border-purple-400 bg-purple-950/90 shadow-[0_0_20px_rgba(168,85,247,0.7)] divide-purple-400/80 ring-2 ring-purple-400'
                            : lvl.type === 'COMPLETE'
                            ? 'border-emerald-500/80 bg-emerald-950/70 text-emerald-200 divide-emerald-500/60'
                            : lvl.type === 'MERGE'
                            ? 'border-cyan-500/80 bg-cyan-950/70 text-cyan-200 divide-cyan-500/60'
                            : lvl.type === 'BASE'
                            ? 'border-amber-500/80 bg-amber-950/60 text-amber-200 divide-amber-500/60'
                            : 'border-white/80 bg-slate-950/90 text-slate-100 divide-white/80'
                        }`}>
                          {block.arr.map((val, bIdx) => (
                            <div
                              key={bIdx}
                              className={`w-12 h-11 flex items-center justify-center font-mono font-black text-xs sm:text-sm ${
                                lvl.type === 'COMPLETE'
                                  ? 'bg-emerald-950/80 text-emerald-200'
                                  : lvl.type === 'MERGE'
                                  ? 'bg-cyan-950/70 text-cyan-200'
                                  : lvl.type === 'BASE'
                                  ? 'bg-amber-950/70 text-amber-200'
                                  : 'bg-slate-900/90 text-slate-100'
                              }`}
                            >
                              {val}
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>

                </motion.div>

                {/* Branch Arrows SVG between tree levels */}
                {lIdx < visibleLevels.length - 1 && (
                  <div className="w-full flex items-center justify-center py-1">
                    {lIdx === 0 && (
                      /* Level 0 -> Level 1: Single split from 1 block into 2 blocks */
                      <svg className="w-32 h-7 stroke-purple-400 fill-purple-400" viewBox="0 0 120 28" fill="none">
                        <path d="M60 2 L25 22" strokeWidth="2.2" strokeDasharray="3 2" />
                        <path d="M60 2 L95 22" strokeWidth="2.2" strokeDasharray="3 2" />
                        <polygon points="25,22 32,17 26,14" />
                        <polygon points="95,22 94,14 88,17" />
                      </svg>
                    )}

                    {lIdx === 1 && (
                      /* Level 1 -> Level 2: 2 separate parent blocks split into 4 blocks */
                      <div className="flex items-center justify-center gap-16 sm:gap-24 w-full">
                        <svg className="w-20 h-7 stroke-purple-400 fill-purple-400" viewBox="0 0 80 28" fill="none">
                          <path d="M40 2 L15 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <path d="M40 2 L65 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <polygon points="15,22 22,17 16,14" />
                          <polygon points="65,22 64,14 58,17" />
                        </svg>
                        <svg className="w-20 h-7 stroke-purple-400 fill-purple-400" viewBox="0 0 80 28" fill="none">
                          <path d="M40 2 L15 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <path d="M40 2 L65 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <polygon points="15,22 22,17 16,14" />
                          <polygon points="65,22 64,14 58,17" />
                        </svg>
                      </div>
                    )}

                    {lIdx === 2 && (
                      /* Level 2 -> Level 3: Base elements separation */
                      <div className="flex items-center justify-center gap-12 sm:gap-16 w-full">
                        <svg className="w-16 h-6 stroke-amber-400 fill-amber-400" viewBox="0 0 60 24" fill="none">
                          <path d="M30 2 L12 18" strokeWidth="2" strokeDasharray="3 2" />
                          <path d="M30 2 L48 18" strokeWidth="2" strokeDasharray="3 2" />
                          <polygon points="12,18 18,14 13,11" />
                          <polygon points="48,18 47,11 42,14" />
                        </svg>
                        <svg className="w-16 h-6 stroke-amber-400 fill-amber-400" viewBox="0 0 60 24" fill="none">
                          <path d="M30 2 L12 18" strokeWidth="2" strokeDasharray="3 2" />
                          <path d="M30 2 L48 18" strokeWidth="2" strokeDasharray="3 2" />
                          <polygon points="12,18 18,14 13,11" />
                          <polygon points="48,18 47,11 42,14" />
                        </svg>
                      </div>
                    )}

                    {lIdx === 3 && (
                      /* Level 3 -> Level 4: Merging single elements into pairs */
                      <div className="flex items-center justify-center gap-16 sm:gap-24 w-full">
                        <svg className="w-20 h-7 stroke-cyan-400 fill-cyan-400" viewBox="0 0 80 28" fill="none">
                          <path d="M15 2 L40 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <path d="M65 2 L40 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <polygon points="40,22 35,15 45,15" />
                        </svg>
                        <svg className="w-20 h-7 stroke-cyan-400 fill-cyan-400" viewBox="0 0 80 28" fill="none">
                          <path d="M15 2 L40 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <path d="M65 2 L40 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <polygon points="40,22 35,15 45,15" />
                        </svg>
                      </div>
                    )}

                    {lIdx === 4 && (
                      /* Level 4 -> Level 5: Merging pairs into halves */
                      <div className="flex items-center justify-center gap-20 sm:gap-32 w-full">
                        <svg className="w-24 h-7 stroke-cyan-400 fill-cyan-400" viewBox="0 0 90 28" fill="none">
                          <path d="M18 2 L45 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <path d="M72 2 L45 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <polygon points="45,22 40,15 50,15" />
                        </svg>
                        <svg className="w-24 h-7 stroke-cyan-400 fill-cyan-400" viewBox="0 0 90 28" fill="none">
                          <path d="M18 2 L45 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <path d="M72 2 L45 22" strokeWidth="2.2" strokeDasharray="3 2" />
                          <polygon points="45,22 40,15 50,15" />
                        </svg>
                      </div>
                    )}

                    {lIdx === 5 && (
                      /* Level 5 -> Level 6: Final merge of 2 halves into complete array */
                      <svg className="w-32 h-7 stroke-emerald-400 fill-emerald-400" viewBox="0 0 120 28" fill="none">
                        <path d="M25 2 L60 22" strokeWidth="2.2" strokeDasharray="3 2" />
                        <path d="M95 2 L60 22" strokeWidth="2.2" strokeDasharray="3 2" />
                        <polygon points="60,22 55,15 65,15" />
                      </svg>
                    )}
                  </div>
                )}

              </React.Fragment>
            );
          })}
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-center gap-6 font-mono text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-purple-950 border border-purple-400" />
            <span>Divide Halves</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-950 border border-amber-400" />
            <span>Single Base Elements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-950 border border-cyan-400" />
            <span>Merging Subarrays</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-950 border border-emerald-400" />
            <span>Final Sorted Array</span>
          </div>
        </div>

      </div>
    </div>
  );
};
