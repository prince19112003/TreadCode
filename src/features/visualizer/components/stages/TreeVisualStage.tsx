import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';

interface StaticBstNode {
  val: number;
  x: number; // percentage
  y: number; // px offset
  parentVal: number | null;
  side?: 'L' | 'R';
}

const STATIC_BST_HIERARCHY: StaticBstNode[] = [
  { val: 25, x: 50, y: 35, parentVal: null },
  { val: 15, x: 26, y: 105, parentVal: 25, side: 'L' },
  { val: 50, x: 74, y: 105, parentVal: 25, side: 'R' },
  { val: 10, x: 14, y: 175, parentVal: 15, side: 'L' },
  { val: 22, x: 38, y: 175, parentVal: 15, side: 'R' },
  { val: 35, x: 62, y: 175, parentVal: 50, side: 'L' },
  { val: 70, x: 86, y: 175, parentVal: 50, side: 'R' },
];

export const TreeVisualStage: React.FC = () => {
  const currentStep = useLessonStore(s => s.currentStep);
  const activeSteps = useLessonStore(s => s.activeSteps);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const zoom = useLessonStore(s => s.zoom);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract snapshot reliably from activeSteps[currentStepIndex]
  const stepSnapshot = (activeSteps && activeSteps.length > 0)
    ? (activeSteps[currentStepIndex] || activeSteps[0])
    : currentStep;

  const mem = (stepSnapshot?.memorySnapshot as any) || {};
  const activeVal = typeof mem.activeNodeValue === 'number' ? mem.activeNodeValue : undefined;
  const visitedPath = Array.isArray(mem.visitedPath) ? mem.visitedPath : [];
  const traversalSeq = Array.isArray(mem.traversalSeq) ? mem.traversalSeq : [];
  const actionName = typeof mem.actionName === 'string' ? mem.actionName : 'INIT';
  const isMatch = mem.isMatch === true;
  const notFound = mem.notFound === true;

  const maxSteps = activeSteps ? activeSteps.length : 1;

  // Combination of path or traversal sequence for highlighting visited nodes
  const activeSequence = traversalSeq.length > 0 ? traversalSeq : visitedPath;

  // Auto-scroll on step change
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
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="font-extrabold text-violet-300 tracking-wider">
              BINARY SEARCH TREE (STATIC 7-NODE BST)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono text-xs">
            <div>
              <span className="text-slate-500">Mode:</span>{' '}
              <span className="font-bold text-violet-400 uppercase">{actionName}</span>
            </div>
            <div>
              <span className="text-slate-500">Step:</span>{' '}
              <span className="font-bold text-amber-400">{currentStepIndex + 1} / {maxSteps}</span>
            </div>
          </div>
        </div>

        {/* Tree Interactive SVG Stage */}
        <div className="w-full bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden shadow-2xl min-h-75">
          
          <div className="w-full flex items-center justify-between font-mono text-[11px] text-slate-400 pb-2 border-b border-slate-900">
            <span className="font-bold text-violet-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              BST STRUCTURE (ROOT = 25 | LEFT &lt; PARENT &lt; RIGHT)
            </span>
            
            {activeVal !== undefined && (
              <span className={`font-mono font-bold ${
                isMatch ? 'text-emerald-400' : 'text-amber-300 animate-pulse'
              }`}>
                {isMatch ? `✓ MATCH FOUND [${activeVal}]` : `Inspecting Node [${activeVal}]`}
              </span>
            )}
            {notFound && (
              <span className="text-rose-400 font-mono font-bold">
                ✕ NODE NOT FOUND
              </span>
            )}
          </div>

          {/* SVG Canvas for Tree Links */}
          <div className="w-full h-70 relative mt-2">
            <svg className="w-full h-full absolute inset-0 pointer-events-none stroke-violet-500/50" style={{ zIndex: 1 }}>
              {STATIC_BST_HIERARCHY.map(node => {
                if (node.parentVal === null) return null;
                const parent = STATIC_BST_HIERARCHY.find(p => p.val === node.parentVal);
                if (!parent) return null;

                const isPathActive = activeSequence.includes(parent.val) && activeSequence.includes(node.val);

                return (
                  <g key={`edge-${node.val}`}>
                    <line
                      x1={`${parent.x}%`}
                      y1={parent.y + 16}
                      x2={`${node.x}%`}
                      y2={node.y + 16}
                      strokeWidth={isPathActive ? 3 : 2}
                      className={isPathActive ? 'stroke-amber-400' : 'stroke-violet-500/50'}
                    />
                    {/* Sub-label for Left/Right branch indicator */}
                    <text
                      x={`${(parent.x + node.x) / 2}%`}
                      y={(parent.y + node.y) / 2 + 10}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.side}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tree Nodes */}
            {STATIC_BST_HIERARCHY.map(node => {
              const val = node.val;
              const isActive = val === activeVal;
              const isVisited = activeSequence.includes(val);

              return (
                <motion.div
                  key={`node-${val}`}
                  animate={{ scale: isActive ? 1.25 : 1 }}
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
                    isActive && isMatch
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.9)] ring-2 ring-emerald-400'
                      : isActive
                      ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.9)] ring-2 ring-amber-400'
                      : isVisited
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.7)]'
                      : 'bg-slate-900 border-violet-400/80 text-slate-100 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  }`}>
                    {val}
                  </div>
                </motion.div>
              );
            })}

          </div>

        </div>

        {/* Visited Sequence / Search Path Result Bar */}
        {activeSequence.length > 0 && (
          <div className="w-full flex flex-col items-center gap-2 bg-slate-950/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl font-mono text-xs">
            <div className="w-full flex items-center justify-between border-b border-slate-900 pb-2 text-[11px] text-slate-400">
              <span className="font-bold text-amber-400 uppercase">
                {traversalSeq.length > 0 ? 'TRAVERSAL SEQUENCE RESULT' : 'SEARCH PATH TRACE'}:
              </span>
              <span className="text-slate-500">
                {activeSequence.length} Nodes Visited
              </span>
            </div>

            {/* Sharp Square Contiguous Sequence Blocks */}
            <div className="inline-flex rounded-none border border-white/80 bg-slate-950/90 shadow-xl divide-x divide-white/80 mt-1">
              {activeSequence.map((val: number, idx: number) => (
                <div
                  key={idx}
                  className={`w-12 h-11 flex items-center justify-center font-mono font-black text-sm ${
                    val === activeVal
                      ? isMatch ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      : 'bg-emerald-950/80 text-emerald-200'
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minimal Legend Footer */}
        <div className="flex items-center justify-center gap-6 font-mono text-[11px] text-slate-400 pt-3 border-t border-slate-800/60 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-violet-400" />
            <span>BST Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-400" />
            <span>Inspected Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-400" />
            <span>Visited / Match Node</span>
          </div>
        </div>

      </div>
    </div>
  );
};
