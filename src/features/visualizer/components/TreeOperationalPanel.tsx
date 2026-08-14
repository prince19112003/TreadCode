import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Search, CheckCircle2 } from 'lucide-react';

// Static 7-Node Balanced BST Structure
const STATIC_BST_NODES = [25, 15, 50, 10, 22, 35, 70];

export const TreeOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const goNext = useLessonStore(s => s.goNext);
  const goPrev = useLessonStore(s => s.goPrev);
  const isPlaying = useLessonStore(s => s.isPlaying);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const totalSteps = useLessonStore(s => s.totalSteps);

  const [searchVal, setSearchVal] = useState('22');
  const [selectedAction, setSelectedAction] = useState<'search' | 'inorder' | 'preorder' | 'postorder' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize Default Static Tree State
  const loadInitialBstState = useCallback(() => {
    setSelectedAction(null);
    const initStep: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: `Static Balanced BST Initialized (7 Nodes). Select Search or a Traversal.`,
      explanationHinglish: `Static Balanced BST Initialized (7 Nodes). Search ya Traversal select karein.`,
      memorySnapshot: { list: STATIC_BST_NODES, actionName: 'INIT' },
      consoleOutput: `> Static BST Initialized: [${STATIC_BST_NODES.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    };

    setCustomSteps([initStep]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [setCustomSteps, goToStep, setIsPlaying]);

  useEffect(() => {
    loadInitialBstState();
  }, [lesson?.id, loadInitialBstState]);

  // Search Node step-by-step path trace through the static BST
  const handleSearch = () => {
    const val = parseInt(searchVal.trim(), 10);
    if (isNaN(val)) return setError('Enter a valid node value to search');

    setSelectedAction('search');

    const steps: ExecutionStep[] = [];
    let current: number | undefined = 25; // Root of static BST
    let stepCount = 1;
    let found = false;

    // Define tree parent-child map for exact search navigation
    const bstMap: Record<number, { left?: number; right?: number }> = {
      25: { left: 15, right: 50 },
      15: { left: 10, right: 22 },
      50: { left: 35, right: 70 },
      10: {},
      22: {},
      35: {},
      70: {},
    };

    const visitedPath: number[] = [];

    while (current !== undefined) {
      visitedPath.push(current);
      const isMatch = current === val;

      steps.push({
        step: stepCount++,
        lineNum: 1,
        explanationEnglish: `SEARCH(${val}): Inspecting node [${current}]. ${isMatch ? '✓ MATCH FOUND!' : val < current ? `${val} < ${current} → Go Left to node [${bstMap[current]?.left ?? 'null'}]` : `${val} > ${current} → Go Right to node [${bstMap[current]?.right ?? 'null'}]`}`,
        explanationHinglish: `SEARCH(${val}): Node [${current}] check kiya. ${isMatch ? '✓ Match mil gaya!' : val < current ? `${val} < ${current} → Left child node [${bstMap[current]?.left ?? 'null'}] jaenge` : `${val} > ${current} → Right child node [${bstMap[current]?.right ?? 'null'}] jaenge`}`,
        memorySnapshot: {
          list: STATIC_BST_NODES,
          activeNodeValue: current,
          visitedPath: [...visitedPath],
          isMatch,
          actionName: 'SEARCH',
        },
        consoleOutput: `> Visited Node [${current}] ${isMatch ? '✓ MATCH FOUND' : ''}`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeValue: current } as any,
      });

      if (isMatch) {
        found = true;
        break;
      }

      if (val < current) {
        current = bstMap[current]?.left;
      } else {
        current = bstMap[current]?.right;
      }
    }

    if (!found) {
      steps.push({
        step: stepCount,
        lineNum: 1,
        explanationEnglish: `SEARCH RESULT: Node [${val}] NOT FOUND in this BST.`,
        explanationHinglish: `SEARCH RESULT: Node [${val}] is BST me nahi mila.`,
        memorySnapshot: { list: STATIC_BST_NODES, notFound: true, visitedPath: [...visitedPath], actionName: 'SEARCH' },
        consoleOutput: `> Node [${val}] NOT FOUND`,
        animationEvent: { type: 'NONE' } as any,
      });
    }

    setError(null);
    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  };

  // Traversals (Inorder, Preorder, Postorder)
  const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    setSelectedAction(type);

    const steps: ExecutionStep[] = [];

    // Exact traversal sequences for our static 7-node BST
    const sequences = {
      inorder: [10, 15, 22, 25, 35, 50, 70],
      preorder: [25, 15, 10, 22, 50, 35, 70],
      postorder: [10, 22, 15, 35, 70, 50, 25],
    };

    const seq = sequences[type];

    const typeTitles = {
      inorder: 'INORDER (Left ➔ Root ➔ Right) — Sorted Array Output',
      preorder: 'PREORDER (Root ➔ Left ➔ Right) — Root First',
      postorder: 'POSTORDER (Left ➔ Right ➔ Root) — Children First, Root Last',
    };

    seq.forEach((val, idx) => {
      steps.push({
        step: idx + 1,
        lineNum: 1,
        explanationEnglish: `${type.toUpperCase()} Traversal (${idx + 1}/7): Visiting Node [${val}]. Visited path so far: [${seq.slice(0, idx + 1).join(', ')}]`,
        explanationHinglish: `${type.toUpperCase()} Traversal (${idx + 1}/7): Node [${val}] visit kiya. Current sequence: [${seq.slice(0, idx + 1).join(', ')}]`,
        memorySnapshot: {
          list: STATIC_BST_NODES,
          activeNodeValue: val,
          traversalSeq: seq.slice(0, idx + 1),
          type,
          title: typeTitles[type],
          actionName: 'TRAVERSAL',
        },
        consoleOutput: `> ${type.toUpperCase()} [${idx + 1}]: Node [${val}]`,
        animationEvent: { type: 'HIGHLIGHT_NODE', activeNodeValue: val } as any,
      });
    });

    setError(null);
    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  };

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            BINARY SEARCH TREE (BST)
          </span>
        </div>
        <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded font-semibold">
          7-Node Static Tree
        </span>
      </div>

      {/* Control Panel Body */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col justify-between gap-4">

        <div className="flex flex-col gap-3.5">
          
          {/* Search Node Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold px-0.5">
              1. Search BST Node
            </span>

            <div className={`flex items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 ${
              selectedAction === 'search'
                ? 'bg-cyan-950/80 border-cyan-400/90 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400'
                : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <input
                type="text"
                placeholder="Value"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="w-20 text-center py-2 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-cyan-400 text-slate-100 text-xs font-mono font-bold focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  selectedAction === 'search'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                    : 'bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200'
                }`}
              >
                <Search size={14} /> Search Path
                {selectedAction === 'search' && <CheckCircle2 size={12} className="ml-1 text-slate-950" />}
              </button>
            </div>
          </div>

          {/* Tree Traversals Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                2. Tree Traversals
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                Click to run
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              
              {/* INORDER */}
              <button
                onClick={() => handleTraversal('inorder')}
                className={`py-2.5 px-1 rounded-xl font-mono text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5 border ${
                  selectedAction === 'inorder'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black shadow-[0_0_16px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <span className="flex items-center gap-1">
                  INORDER
                  {selectedAction === 'inorder' && <CheckCircle2 size={10} />}
                </span>
                <span className={`text-[8px] font-mono font-normal ${
                  selectedAction === 'inorder' ? 'text-slate-900 font-bold' : 'text-emerald-400/80'
                }`}>
                  Sorted Order
                </span>
              </button>

              {/* PREORDER */}
              <button
                onClick={() => handleTraversal('preorder')}
                className={`py-2.5 px-1 rounded-xl font-mono text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5 border ${
                  selectedAction === 'preorder'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-[0_0_16px_rgba(251,191,36,0.8)] ring-2 ring-amber-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-amber-500/40 text-amber-300'
                }`}
              >
                <span className="flex items-center gap-1">
                  PREORDER
                  {selectedAction === 'preorder' && <CheckCircle2 size={10} />}
                </span>
                <span className={`text-[8px] font-mono font-normal ${
                  selectedAction === 'preorder' ? 'text-slate-900 font-bold' : 'text-amber-400/80'
                }`}>
                  Root First
                </span>
              </button>

              {/* POSTORDER */}
              <button
                onClick={() => handleTraversal('postorder')}
                className={`py-2.5 px-1 rounded-xl font-mono text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5 border ${
                  selectedAction === 'postorder'
                    ? 'bg-purple-500 text-slate-950 border-purple-300 font-black shadow-[0_0_16px_rgba(168,85,247,0.8)] ring-2 ring-purple-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-purple-500/40 text-purple-300'
                }`}
              >
                <span className="flex items-center gap-1">
                  POSTORDER
                  {selectedAction === 'postorder' && <CheckCircle2 size={10} />}
                </span>
                <span className={`text-[8px] font-mono font-normal ${
                  selectedAction === 'postorder' ? 'text-slate-900 font-bold' : 'text-purple-400/80'
                }`}>
                  Root Last
                </span>
              </button>

            </div>
          </div>

          {error && (
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-[11px] text-center font-bold">
              {error}
            </div>
          )}

        </div>

        {/* Clean Step Controls Footer */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800/80">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={goPrev}
              disabled={currentStepIndex === 0}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-35 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`py-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isPlaying
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={goNext}
              disabled={currentStepIndex >= totalSteps - 1}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-35 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={loadInitialBstState}
            className="w-full py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/70 text-slate-400 hover:text-slate-200 font-mono text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw size={12} /> Reset Tree
          </button>
        </div>

      </div>
    </div>
  );
};
