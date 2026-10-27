import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';
import { ArrowRight } from 'lucide-react';

const getListFromStep = (step: any): { list: (string | number)[]; capacity: number; activeIdx: number; isFound: boolean } => {
  if (!step) return { list: [10, 20, 30], capacity: 6, activeIdx: -1, isFound: false };
  const mem = step.memorySnapshot;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 6;
  const activeIdx = typeof mem?.activeIdx === 'number' ? mem.activeIdx : -1;
  const isFound = Boolean(mem?.isFound);

  if (Array.isArray(mem?.list)) return { list: mem.list, capacity: cap, activeIdx, isFound };
  if (typeof mem?.list === 'string') {
    try {
      const parsed = JSON.parse(mem.list);
      if (Array.isArray(parsed)) return { list: parsed, capacity: cap, activeIdx, isFound };
    } catch {
      const parts = mem.list.replace(/→NULL|NULL/g, '').split('→').map((s: string) => s.trim()).filter(Boolean);
      if (parts.length > 0) return { list: parts, capacity: cap, activeIdx, isFound };
    }
  }
  const ev = step.animationEvent;
  if (ev?.listState) return { list: ev.listState, capacity: cap, activeIdx, isFound };
  return { list: [10, 20, 30], capacity: cap, activeIdx, isFound };
};

export const SllVisualStage: React.FC = () => {
  const { currentStep, activeSteps, currentStepIndex, zoom } = useLesson();

  const step = (activeSteps && activeSteps.length > 0)
    ? (activeSteps[currentStepIndex] || activeSteps[0])
    : currentStep;

  const { list: listItems, capacity: CAPACITY, activeIdx, isFound } = getListFromStep(step);

  const isEmpty = listItems.length === 0;

  return (
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 custom-scrollbar select-none font-mono text-neutral-200">
      <div
        className="relative w-full max-w-5xl flex flex-col items-center justify-start gap-6 py-3 transition-transform duration-150 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Top Status Bar ── */}
        <div className="flex flex-col items-center gap-2 w-full max-w-3xl">
          <div className="flex flex-wrap items-center justify-between w-full px-3 py-1.5 bg-[#080b13] border border-neutral-800 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                SINGLY LINKED LIST
              </span>
              <span className="text-[9.5px] text-neutral-500">
                (Dynamic Linear Chain)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold">
                NODES: {listItems.length} / {CAPACITY}
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-emerald-300 font-bold">
                HEAD: {listItems.length > 0 ? `Node(${listItems[0]})` : 'NULL'}
              </span>
            </div>
          </div>

          {/* Action Callout Banner */}
          <div className="px-4 py-1.5 text-xs font-bold border border-neutral-700 bg-[#090d18] text-center w-full">
            <span>
              {step?.explanationEnglish || (isEmpty ? 'List is empty: HEAD points to NULL' : `Singly linked list with ${listItems.length} nodes chained`)}
            </span>
          </div>
        </div>

        {/* ── Visual Node Chain (Textbook Representation) ── */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full p-2 py-4">
          {/* Head Indicator Badge */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
            <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-400 text-neutral-950 uppercase tracking-wider">
              HEAD
            </span>
            <div className="text-emerald-400 font-bold text-sm">
              <ArrowRight size={18} />
            </div>
          </div>

          {isEmpty ? (
            <div className="px-6 py-4 border-2 border-dashed border-neutral-700 bg-[#060810] text-neutral-500 font-bold text-xs flex items-center justify-center">
              NULL (Empty List)
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-nowrap">
              {listItems.map((val, idx) => {
                const isHead = idx === 0;
                const isTail = idx === listItems.length - 1;
                const isActive = idx === activeIdx;
                const isMatched = isActive && isFound;

                let borderStyle = 'border-neutral-700';
                let dataBg = 'bg-[#0b101d]';
                let dataText = 'text-white';
                let ring = '';

                if (isMatched) {
                  borderStyle = 'border-emerald-400';
                  dataBg = 'bg-[#062419]';
                  dataText = 'text-emerald-300 font-black';
                  ring = 'ring-2 ring-emerald-400 z-10';
                } else if (isActive) {
                  borderStyle = 'border-amber-400';
                  dataBg = 'bg-[#291705]';
                  dataText = 'text-amber-200 font-black';
                  ring = 'ring-2 ring-amber-400 z-10';
                } else if (isHead) {
                  borderStyle = 'border-emerald-500/80';
                }

                return (
                  <React.Fragment key={`sll-node-${idx}`}>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      {/* Pointer Tag Above Node */}
                      <div className="h-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          {isMatched ? (
                            <motion.span
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 3 }}
                              className="text-[8px] font-black px-1.5 py-0.2 bg-emerald-400 text-neutral-950 uppercase tracking-wider"
                            >
                              ✓ MATCH
                            </motion.span>
                          ) : isActive ? (
                            <motion.span
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 3 }}
                              className="text-[8px] font-black px-1.5 py-0.2 bg-amber-400 text-neutral-950 uppercase tracking-wider"
                            >
                              CURRENT
                            </motion.span>
                          ) : isHead && isTail ? (
                            <span className="text-[7.5px] font-bold px-1.5 py-0.2 bg-neutral-800 text-emerald-300 border border-neutral-700">
                              HEAD &amp; TAIL
                            </span>
                          ) : isHead ? (
                            <span className="text-[7.5px] font-bold px-1.5 py-0.2 bg-neutral-800 text-emerald-300 border border-neutral-700">
                              HEAD
                            </span>
                          ) : isTail ? (
                            <span className="text-[7.5px] font-bold px-1.5 py-0.2 bg-neutral-800 text-cyan-300 border border-neutral-700">
                              TAIL
                            </span>
                          ) : null}
                        </AnimatePresence>
                      </div>

                      {/* Node Box (Two Compartments: Data & Next) */}
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-stretch border-2 bg-[#060810] shadow-md rounded-none ${borderStyle} ${ring}`}
                      >
                        {/* Data Compartment */}
                        <div className={`px-4 py-2.5 flex flex-col items-center justify-center border-r border-neutral-700 min-w-16 ${dataBg}`}>
                          <span className="text-[8px] text-neutral-500 uppercase font-semibold">DATA</span>
                          <span className={`text-xl font-black ${dataText}`}>{val}</span>
                        </div>

                        {/* Next Pointer Compartment */}
                        <div className="px-3 py-2.5 flex flex-col items-center justify-center bg-[#060912] min-w-12">
                          <span className="text-[8px] text-neutral-500 uppercase font-semibold">NEXT</span>
                          <div className="w-2.5 h-2.5 bg-emerald-400 my-1 inline-block" />
                          <span className="text-[7.5px] text-neutral-400">
                            {isTail ? 'NULL' : 'ptr'}
                          </span>
                        </div>
                      </motion.div>

                      {/* Index Label Below Node */}
                      <span className="text-[9px] text-neutral-500 font-semibold mt-0.5">
                        [{idx}]
                      </span>
                    </div>

                    {/* Arrow to Next Node */}
                    <div className="flex items-center text-emerald-400 shrink-0 px-0.5">
                      <ArrowRight size={20} strokeWidth={2.5} />
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Terminal NULL Box */}
              <div className="flex flex-col items-center justify-center gap-1 shrink-0 pt-6">
                <div className="px-3 py-2 border-2 border-dashed border-neutral-700 bg-[#060810] text-rose-400 font-bold text-xs">
                  NULL
                </div>
                <span className="text-[8px] text-neutral-600 font-semibold">Terminator</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Textbook Invariant Card (Clean, Sharp) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl text-[10px]">
          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-emerald-400 uppercase text-[9px]">Node Linking Mechanism</span>
            <span className="text-neutral-400 text-[9.5px]">
              Every node stores a <span className="text-white font-bold">Data</span> value and a <span className="text-emerald-300 font-bold">Next</span> reference pointing to the memory location of the succeeding node.
            </span>
          </div>

          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-cyan-400 uppercase text-[9px]">Linear Traversal</span>
            <span className="text-neutral-400 text-[9.5px]">
              Access begins strictly at <span className="text-white font-bold">HEAD</span> and follows each pointer until encountering <span className="text-rose-400 font-bold">NULL</span>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
