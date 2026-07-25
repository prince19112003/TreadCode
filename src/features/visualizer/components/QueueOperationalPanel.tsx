import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, ArrowRight, Eye, Search, Play, RotateCcw, Trash2 } from 'lucide-react';

/** Read queue array from step */
const queueFromStep = (step: ExecutionStep | null): { queue: (string | number)[]; capacity: number } => {
  if (!step) return { queue: [], capacity: 4 };
  const mem = step.memorySnapshot as any;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 4;
  if (Array.isArray(mem?.queue)) return { queue: mem.queue, capacity: cap };
  if (typeof mem?.queue === 'string') {
    try { return { queue: JSON.parse(mem.queue), capacity: cap }; } catch { return { queue: [], capacity: cap }; }
  }
  const ev = step.animationEvent as any;
  if (ev?.queueState) return { queue: ev.queueState, capacity: cap };
  return { queue: [], capacity: cap };
};

export const QueueOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [capacity, setCapacity] = useState<number>(4);
  const [queue, setQueue] = useState<(string | number)[]>([]);
  const [enqueueVal, setEnqueueVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { queue: q, capacity: c } = queueFromStep(currentStep);
    setQueue(q);
    if (c) setCapacity(c);
  }, [currentStep]);

  useEffect(() => {
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Queue initialized (Empty). Capacity: ${capacity}.`,
      explanationHinglish: `Queue empty initialize hua hai. Capacity: ${capacity}.`,
      memorySnapshot: { front: -1, rear: -1, capacity, queue: [] },
      consoleOutput: `> Queue initialized (Capacity: ${capacity}).`,
      animationEvent: { type: 'NONE' } as any,
    };
    setQueue([]);
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
      step: 1, lineNum: 1,
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
    if (!val) return setError('Enter value to enqueue');
    if (queue.length >= capacity) return setError(`Queue Overflow (Capacity: ${capacity})`);
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...queue, parsed];
    dispatch(next,
      `ENQUEUE(${parsed}): Added at REAR index [${next.length - 1}].`,
      `ENQUEUE(${parsed}): REAR index [${next.length - 1}] pe add hua.`,
      `Enqueued: ${parsed} | Size: ${next.length}/${capacity}`,
      { type: 'QUEUE_ENQUEUE', value: parsed, queueState: next }
    );
    setEnqueueVal('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) return setError('Queue Underflow (Empty)');
    const dequeued = queue[0];
    const next = queue.slice(1);
    dispatch(next,
      `DEQUEUE(): Removed ${dequeued} from FRONT index [0].`,
      `DEQUEUE(): ${dequeued} FRONT index [0] se remove hua.`,
      `Dequeued: ${dequeued} | Size: ${next.length}/${capacity}`,
      { type: 'QUEUE_DEQUEUE', dequeuedValue: dequeued, queueState: next }
    );
  };

  const handlePeek = () => {
    if (queue.length === 0) return setError('Queue is empty');
    const frontVal = queue[0];
    dispatch(queue,
      `PEEK(): FRONT = ${frontVal} [index 0]`,
      `PEEK(): FRONT = ${frontVal} [index 0]`,
      `Peek FRONT: ${frontVal}`,
      { type: 'SET_POINTERS', pointers: { front: 0 } }
    );
  };

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) return setError('Enter search value');
    if (queue.length === 0) return setError('Queue is empty');
    const target = isNaN(Number(val)) ? val : Number(val);
    setSearchVal('');

    const steps: ExecutionStep[] = [];
    let found = false;
    for (let i = 0; i < queue.length; i++) {
      const match = queue[i] === target;
      if (match) found = true;
      steps.push({
        step: steps.length + 1,
        lineNum: steps.length + 1,
        explanationEnglish: `Search: checking index [${i}] = ${queue[i]}`,
        explanationHinglish: `Search: index [${i}] = ${queue[i]} check kiya`,
        memorySnapshot: { front: 0, rear: queue.length - 1, capacity, queue, i },
        consoleOutput: `> Index [${i}]: ${queue[i]} ${match ? '✓ MATCH' : ''}`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'queue',
          indexA: i, indexB: i,
          result: match ? 'found' : 'not-found',
        } as any,
      });
      if (match) break;
    }
    if (!found) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Search complete: ${target} not found.`,
        explanationHinglish: `Search complete: ${target} nahi mila.`,
        memorySnapshot: { front: 0, rear: queue.length - 1, capacity, queue },
        consoleOutput: `> ${target} NOT FOUND`,
        animationEvent: { type: 'NONE' } as any,
      });
    }
    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleTraverse = () => {
    if (queue.length === 0) return setError('Queue is empty');
    const steps: ExecutionStep[] = [];
    for (let i = 0; i < queue.length; i++) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Traverse: index [${i}] = ${queue[i]}`,
        explanationHinglish: `Traverse: index [${i}] = ${queue[i]}`,
        memorySnapshot: { front: 0, rear: queue.length - 1, capacity, queue, i },
        consoleOutput: `> [${i}]: ${queue[i]}`,
        animationEvent: { type: 'SET_POINTERS', pointers: { curr: i } } as any,
      });
    }
    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleIsEmpty = () => {
    const empty = queue.length === 0;
    dispatch(queue,
      `isEmpty() = ${empty}`,
      `isEmpty() = ${empty}`,
      `isEmpty() = ${empty}`,
      { type: 'NONE' } as any
    );
  };

  const handleIsFull = () => {
    const full = queue.length >= capacity;
    dispatch(queue,
      `isFull() = ${full}`,
      `isFull() = ${full}`,
      `isFull() = ${full}`,
      { type: 'NONE' } as any
    );
  };

  const handleSize = () => {
    dispatch(queue,
      `Size() = ${queue.length}/${capacity}`,
      `Size() = ${queue.length}/${capacity}`,
      `Size = ${queue.length}/${capacity}`,
      { type: 'NONE' } as any
    );
  };

  const handleClear = () => {
    dispatch([],
      `Queue cleared.`,
      `Queue cleared.`,
      `Cleared Queue`,
      { type: 'QUEUE_DEQUEUE', dequeuedValue: '', queueState: [] }
    );
  };

  const handleCapacityChange = (newCap: number) => {
    setCapacity(newCap);
    const trimmedQueue = queue.slice(0, newCap);
    setQueue(trimmedQueue);
    setError(null);
    const step: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Capacity changed to ${newCap}.`,
      explanationHinglish: `Capacity badal kar ${newCap} set ki.`,
      memorySnapshot: { front: trimmedQueue.length === 0 ? -1 : 0, rear: trimmedQueue.length === 0 ? -1 : trimmedQueue.length - 1, capacity: newCap, queue: trimmedQueue },
      consoleOutput: `> Capacity = ${newCap}`,
      animationEvent: { type: 'NONE' } as any,
    };
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  };

  const isEmpty = queue.length === 0;
  const isFull = queue.length >= capacity;

  return (
    <div className="h-full flex flex-col bg-[#0a0c16] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Header */}
      <div className="px-4 py-3 bg-[#0d0f1f] border-b border-slate-800/60 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">QUEUE CONTROLS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Size:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-slate-900 text-cyan-400 border border-slate-700/60 rounded px-1.5 py-0.5 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {[2, 3, 4, 5, 6, 8].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <span className="text-slate-400 font-bold">REAR: <strong className="text-indigo-400">{isEmpty ? -1 : queue.length - 1}</strong></span>
          <button onClick={() => handleCapacityChange(capacity)} className="text-slate-500 hover:text-slate-300 p-1" title="Reset">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">✕</button>
          </div>
        )}

        {/* ENQUEUE */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Value..."
            value={enqueueVal}
            onChange={e => setEnqueueVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEnqueue()}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs font-mono focus:outline-none"
          />
          <button
            onClick={handleEnqueue}
            disabled={isFull}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center gap-1 shrink-0"
          >
            <Plus size={14} /> Enqueue
          </button>
        </div>

        {/* DEQUEUE & PEEK */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDequeue}
            disabled={isEmpty}
            className="py-2.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 text-rose-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5"
          >
            <ArrowRight size={14} /> Dequeue
          </button>
          <button
            onClick={handlePeek}
            disabled={isEmpty}
            className="py-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 disabled:opacity-40 text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5"
          >
            <Eye size={14} /> Peek Front
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 text-xs font-mono focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isEmpty}
            className="px-4 py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 disabled:opacity-40 text-purple-200 font-bold text-xs font-mono flex items-center gap-1 shrink-0"
          >
            <Search size={14} /> Search
          </button>
        </div>

        {/* TRAVERSE */}
        <button
          onClick={handleTraverse}
          disabled={isEmpty}
          className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 text-cyan-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5"
        >
          <Play size={13} /> Traverse Front → Rear
        </button>

        {/* UTILITIES */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/40">
          <button onClick={handleIsEmpty} className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px]">
            isEmpty()
          </button>
          <button onClick={handleIsFull} className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px]">
            isFull()
          </button>
          <button onClick={handleSize} className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px]">
            Size()
          </button>
        </div>

        {/* CLEAR */}
        <button
          onClick={handleClear}
          disabled={isEmpty}
          className="w-full py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 disabled:opacity-30 text-red-400 font-mono text-[11px] flex items-center justify-center gap-1"
        >
          <Trash2 size={12} /> Clear Queue
        </button>

      </div>
    </div>
  );
};
