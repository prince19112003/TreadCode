import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, ArrowRight, Eye, RefreshCw, Trash2 } from 'lucide-react';

const queueFromStep = (step: ExecutionStep | null): { queue: (string | number)[]; capacity: number } => {
  if (!step) return { queue: [10, 20, 30], capacity: 5 };
  const mem = step.memorySnapshot as any;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 5;
  if (Array.isArray(mem?.queue)) return { queue: mem.queue, capacity: cap };
  if (typeof mem?.queue === 'string') {
    try { return { queue: JSON.parse(mem.queue), capacity: cap }; } catch { return { queue: [], capacity: cap }; }
  }
  const ev = step.animationEvent as any;
  if (ev?.queueState) return { queue: ev.queueState, capacity: cap };
  return { queue: [10, 20, 30], capacity: cap };
};

export const QueueOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [capacity, setCapacity] = useState<number>(5);
  const [queue, setQueue] = useState<(string | number)[]>([10, 20, 30]);
  const [enqueueVal, setEnqueueVal] = useState('40');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { queue: q, capacity: c } = queueFromStep(currentStep);
    setQueue(q);
    if (c) setCapacity(c);
  }, [currentStep]);

  // Initial load
  useEffect(() => {
    const initialQueue = [10, 20, 30];
    const init: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: `Queue initialized with elements [${initialQueue.join(', ')}]. Front is at index [0], Rear is at index [${initialQueue.length - 1}].`,
      explanationHinglish: `Queue initialize hua: [${initialQueue.join(', ')}]. Front index [0] pe hai aur Rear index [${initialQueue.length - 1}] pe.`,
      memorySnapshot: { front: 0, rear: initialQueue.length - 1, capacity: 5, queue: initialQueue },
      consoleOutput: `> Queue initialized: [${initialQueue.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    };
    setQueue(initialQueue);
    setCustomSteps([init]);
    setTimeout(() => goToStep(1), 30);
  }, [lesson?.id]);

  const dispatch = useCallback((
    newQueue: (string | number)[],
    explanationEn: string,
    explanationHi: string,
    consoleOut: string,
    event: any,
    extraMem: Record<string, any> = {}
  ) => {
    setError(null);
    const frontIdx = newQueue.length === 0 ? -1 : 0;
    const rearIdx = newQueue.length === 0 ? -1 : newQueue.length - 1;
    const step: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: explanationEn,
      explanationHinglish: explanationHi,
      memorySnapshot: { front: frontIdx, rear: rearIdx, capacity, queue: newQueue, ...extraMem },
      consoleOutput: `> ${consoleOut}`,
      animationEvent: event,
    };
    setQueue(newQueue);
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  }, [setCustomSteps, goToStep, capacity]);

  /* ── Queue Operations ── */

  const handleEnqueue = () => {
    const val = enqueueVal.trim();
    if (!val) {
      setError('Please enter a value');
      return;
    }
    if (queue.length >= capacity) {
      setError(`Queue Overflow! Max capacity is ${capacity}.`);
      return;
    }
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...queue, parsed];
    dispatch(
      next,
      `ENQUEUE(${parsed}): Added element at REAR index [${next.length - 1}].`,
      `ENQUEUE(${parsed}): Naya element REAR index [${next.length - 1}] par add hua.`,
      `Enqueued: ${parsed} | Current Queue: [${next.join(', ')}]`,
      { type: 'QUEUE_ENQUEUE', value: parsed, queueState: next }
    );
    setEnqueueVal('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setError('Queue Underflow! Queue is already empty.');
      return;
    }
    const dequeued = queue[0];
    const next = queue.slice(1);
    dispatch(
      next,
      `DEQUEUE(): Removed ${dequeued} from FRONT index [0]. Remaining elements shifted forward.`,
      `DEQUEUE(): FRONT index [0] se ${dequeued} remove hua. Baaki elements aage badhe.`,
      `Dequeued: ${dequeued} | Remaining: [${next.join(', ')}]`,
      { type: 'QUEUE_DEQUEUE', dequeuedValue: dequeued, queueState: next }
    );
  };

  const handlePeek = () => {
    if (queue.length === 0) {
      setError('Queue is empty! No front element to peek.');
      return;
    }
    const frontItem = queue[0];
    dispatch(
      queue,
      `PEEK(): Front element is ${frontItem} at index [0] (remains in queue).`,
      `PEEK(): FRONT index [0] par element ${frontItem} hai (queue se remove nahi hota).`,
      `Peeked Front: ${frontItem}`,
      { type: 'QUEUE_PEEK', targetIndex: 0 }
    );
  };

  const handleReset = () => {
    const sample = [10, 20, 30];
    dispatch(
      sample,
      `Reset queue with sample elements [10, 20, 30].`,
      `Queue ko sample data [10, 20, 30] se reset kiya.`,
      `Reset queue: [10, 20, 30]`,
      { type: 'NONE' }
    );
  };

  const handleClear = () => {
    dispatch(
      [],
      `Queue cleared to empty state.`,
      `Queue khali kar di gayi hai.`,
      `Queue cleared: []`,
      { type: 'QUEUE_DEQUEUE', dequeuedValue: '', queueState: [] }
    );
  };

  const isFull = queue.length >= capacity;
  const isEmpty = queue.length === 0;

  return (
    <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 rounded-none overflow-hidden font-mono text-neutral-200">
      {/* Header */}
      <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0 text-xs">
        <span className="font-bold tracking-wider text-neutral-100 text-[11px] uppercase">
          QUEUE CONTROLS
        </span>
        <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-none font-bold">
          FIFO Buffer
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col justify-between gap-2.5 custom-scrollbar">
        {/* Enqueue Section */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold px-0.5">
            1. Enqueue (Enter at Rear):
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              maxLength={4}
              value={enqueueVal}
              onChange={e => {
                setEnqueueVal(e.target.value);
                setError(null);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleEnqueue();
              }}
              placeholder="Value"
              className="w-20 text-center py-1.5 rounded-none bg-[#060810] border border-neutral-700 focus:border-cyan-400 text-neutral-100 text-xs font-bold focus:outline-none transition-colors"
            />
            <button
              onClick={handleEnqueue}
              disabled={isFull}
              className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1 text-[11px] font-bold rounded-none border transition-colors cursor-pointer ${
                isFull
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-cyan-950/80 border-cyan-500/70 text-cyan-200 hover:bg-cyan-900/80'
              }`}
            >
              <Plus size={12} />
              <span>Enqueue</span>
            </button>
          </div>
        </div>

        {/* Dequeue & Peek Section */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold px-0.5">
            2. Remove & Inspect (Front):
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleDequeue}
              disabled={isEmpty}
              className={`py-1.5 px-2 flex items-center justify-center gap-1 text-[11px] font-bold rounded-none border transition-colors cursor-pointer ${
                isEmpty
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-rose-950/80 border-rose-500/70 text-rose-200 hover:bg-rose-900/80'
              }`}
            >
              <ArrowRight size={12} />
              <span>Dequeue</span>
            </button>

            <button
              onClick={handlePeek}
              disabled={isEmpty}
              className={`py-1.5 px-2 flex items-center justify-center gap-1 text-[11px] font-bold rounded-none border transition-colors cursor-pointer ${
                isEmpty
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-amber-950/80 border-amber-500/70 text-amber-200 hover:bg-amber-900/80'
              }`}
            >
              <Eye size={12} />
              <span>Peek Front</span>
            </button>
          </div>
        </div>

        {/* Quick Reset & Clear */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 text-[10px] font-bold rounded-none bg-neutral-900 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <RefreshCw size={11} />
            <span>Sample (3 Items)</span>
          </button>
          <button
            onClick={handleClear}
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 text-[10px] font-bold rounded-none bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-rose-300 hover:border-rose-700 cursor-pointer transition-colors"
          >
            <Trash2 size={11} />
            <span>Clear Queue</span>
          </button>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="px-2 py-1 bg-rose-950/90 border border-rose-500/60 text-rose-300 text-[10px] font-bold">
            ⚠ {error}
          </div>
        )}

        {/* Minimal Concept Guide */}
        <div className="border border-neutral-800/80 p-2 bg-[#090c15] text-[9.5px] space-y-1">
          <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">
            Queue Invariants:
          </div>
          <div className="text-neutral-400 space-y-0.5">
            <div>• <span className="text-cyan-400 font-bold">FRONT:</span> Element removed next (Exit).</div>
            <div>• <span className="text-indigo-400 font-bold">REAR:</span> Position where new elements enter.</div>
            <div>• <span className="text-emerald-400 font-bold">FIFO:</span> First-In First-Out order.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
