import React from 'react';
import { motion } from 'motion/react';
import { useLesson } from '../../../../lessons/LessonContext';

const getQueueFromStep = (step: any): { queue: (string | number)[]; capacity: number; front: number; rear: number } => {
  if (!step) return { queue: [10, 20, 30], capacity: 5, front: 0, rear: 2 };
  const mem = step.memorySnapshot;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 5;
  const f = typeof mem?.front === 'number' ? mem.front : (Array.isArray(mem?.queue) && mem.queue.length > 0 ? 0 : -1);
  const r = typeof mem?.rear === 'number' ? mem.rear : (Array.isArray(mem?.queue) && mem.queue.length > 0 ? mem.queue.length - 1 : -1);

  if (Array.isArray(mem?.queue)) return { queue: mem.queue, capacity: cap, front: f, rear: r };
  if (typeof mem?.queue === 'string') {
    try {
      const parsed = JSON.parse(mem.queue);
      if (Array.isArray(parsed)) return { queue: parsed, capacity: cap, front: f, rear: r };
    } catch {
      const parts = mem.queue.replace(/[[\]]/g, '').split(',').map((s: string) => s.trim()).filter(Boolean);
      if (parts.length > 0) return { queue: parts, capacity: cap, front: f, rear: r };
    }
  }
  const ev = step.animationEvent;
  if (ev?.type === 'QUEUE_ENQUEUE' || ev?.type === 'QUEUE_DEQUEUE') {
    return { queue: (ev as any).queueState ?? [], capacity: cap, front: f, rear: r };
  }
  return { queue: [10, 20, 30], capacity: cap, front: f, rear: r };
};

export const QueueVisualStage: React.FC = () => {
  const { currentStep, activeSteps, currentStepIndex, zoom } = useLesson();

  const step = (activeSteps && activeSteps.length > 0)
    ? (activeSteps[currentStepIndex] || activeSteps[0])
    : currentStep;

  const { queue: queueItems, capacity: CAPACITY, front, rear } = getQueueFromStep(step);
  const ev = step?.animationEvent as any;
  const isPeekEvent = ev?.type === 'QUEUE_PEEK' || step?.explanationEnglish?.includes('PEEK');

  const isEmpty = queueItems.length === 0;

  return (
    <div className="flex-1 w-full h-full bg-transparent flex flex-col items-center justify-start overflow-y-auto p-4 custom-scrollbar select-none font-mono text-neutral-200">
      <div
        className="relative w-full max-w-4xl flex flex-col items-center justify-start gap-6 py-3 transition-transform duration-150 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

        {/* ── Top Status & FIFO Flow Bar ── */}
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <div className="flex flex-wrap items-center justify-between w-full px-3 py-1.5 bg-[#080b13] border border-neutral-800 text-xs shadow-sm">
            {/* Front Exit Indicator */}
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[10.5px]">
              <span className="w-2 h-2 bg-cyan-400 inline-block" />
              <span>◄ EXIT (FRONT)</span>
            </div>

            {/* Central Queue Metric */}
            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 font-bold">
                SIZE: {queueItems.length} / {CAPACITY}
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-400 font-bold">
                FRONT: {front >= 0 ? `[${front}]` : '—'}
              </span>
              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-400 font-bold">
                REAR: {rear >= 0 ? `[${rear}]` : '—'}
              </span>
            </div>

            {/* Rear Entry Indicator */}
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[10.5px]">
              <span>ENTRY (REAR) ►</span>
              <span className="w-2 h-2 bg-indigo-400 inline-block" />
            </div>
          </div>

          {/* Action Callout Banner */}
          <div className="px-4 py-1.5 text-xs font-bold border border-neutral-700 bg-[#090d18] text-center w-full">
            <span>
              {step?.explanationEnglish || (isEmpty ? 'Queue is empty' : `Queue with ${queueItems.length} elements (FIFO order)`)}
            </span>
          </div>
        </div>

        {/* ── Main Queue Conveyor (Horizontal Linear Buffer) ── */}
        <div className="flex flex-col items-center gap-1 w-full max-w-2xl">
          {/* Top Pointer Row (Arrows pointing down to Front & Rear) */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            {Array.from({ length: CAPACITY }).map((_, idx) => {
              const isFront = front !== -1 ? idx === front : (idx === 0 && !isEmpty);
              const isRear = rear !== -1 ? idx === rear : (idx === queueItems.length - 1 && !isEmpty);

              return (
                <div
                  key={`queue-ptr-${idx}`}
                  className="w-18 md:w-20 h-7 text-center flex flex-col items-center justify-end pb-0.5 relative"
                >
                  {isFront && isRear ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black px-1.5 py-0.2 bg-linear-to-r from-cyan-400 to-indigo-400 text-neutral-950 uppercase tracking-wider">
                        FRONT & REAR
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400" />
                    </div>
                  ) : isFront ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black px-1.5 py-0.2 bg-cyan-400 text-neutral-950 uppercase tracking-wider">
                        FRONT
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400" />
                    </div>
                  ) : isRear ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black px-1.5 py-0.2 bg-indigo-400 text-neutral-950 uppercase tracking-wider">
                        REAR
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-indigo-400" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Queue Slots Container (Sharp Corners, Clean 1px Borders) */}
          <div className="flex items-center justify-center gap-2.5 p-3 border-y-2 border-neutral-700 bg-[#05070e] shadow-md w-full">
            {Array.from({ length: CAPACITY }).map((_, idx) => {
              const hasValue = idx < queueItems.length && queueItems[idx] !== undefined && queueItems[idx] !== null;
              const value = hasValue ? queueItems[idx] : null;
              const isFront = front !== -1 ? idx === front : (idx === 0 && hasValue);
              const isRear = rear !== -1 ? idx === rear : (idx === queueItems.length - 1 && hasValue);
              const isPeek = isPeekEvent && isFront;

              let slotBg = hasValue ? 'bg-[#0a0f1e]' : 'bg-[#04060c]/50';
              let borderColor = hasValue ? 'border-neutral-600' : 'border-dashed border-neutral-800';
              let textStyle = hasValue ? 'text-white' : 'text-neutral-700';

              if (isPeek) {
                slotBg = 'bg-[#291705]';
                borderColor = 'border-amber-400 ring-1 ring-amber-400';
              } else if (isFront) {
                borderColor = 'border-cyan-400';
              } else if (isRear) {
                borderColor = 'border-indigo-400';
              }

              return (
                <motion.div
                  key={`slot-${idx}`}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`w-18 md:w-20 h-18 md:h-20 flex flex-col items-center justify-center border-2 transition-all rounded-none ${slotBg} ${borderColor}`}
                >
                  <span className="text-[9px] text-neutral-500 font-semibold mb-0.5">[{idx}]</span>
                  <span className={`text-xl md:text-2xl font-black ${textStyle}`}>
                    {hasValue ? value : '—'}
                  </span>
                  {isPeek && (
                    <span className="text-[7.5px] font-black px-1 bg-amber-400 text-neutral-950 uppercase mt-0.5">
                      PEEK
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Labels (Index & Flow indicators) */}
          <div className="flex items-center justify-between w-full text-[9.5px] text-neutral-500 px-2 pt-1 font-semibold">
            <span>◄ DEQUEUE removes from FRONT</span>
            <span>ENQUEUE inserts at REAR ►</span>
          </div>
        </div>

        {/* ── Textbook Invariant Card (Clean, Sharp) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl text-[10px]">
          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-cyan-400 uppercase text-[9px]">Enqueue Operation (O(1))</span>
            <span className="text-neutral-400 text-[9.5px]">
              Inserts new element at <span className="text-white font-bold">REAR</span> index and advances rear pointer forward.
            </span>
          </div>

          <div className="p-2 border border-neutral-800 bg-[#080b14] flex flex-col gap-0.5">
            <span className="font-bold text-rose-400 uppercase text-[9px]">Dequeue Operation (O(1))</span>
            <span className="text-neutral-400 text-[9.5px]">
              Removes the oldest element from <span className="text-white font-bold">FRONT</span> index (FIFO order).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
