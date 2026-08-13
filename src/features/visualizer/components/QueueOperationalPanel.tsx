import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import { useLessonStore } from '../../../lessons/useLessonStore';
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
    if (queue.length === 0) return setError('Queue is empty (Underflow)');
    const frontVal = queue[0];
    dispatch(queue,
      `PEEK(): FRONT = ${frontVal} [index 0]`,
      `PEEK(): FRONT = ${frontVal} [index 0] pe hai.`,
      `Peek FRONT: ${frontVal}`,
      { type: 'QUEUE_PEEK', peekValue: frontVal, peekIndex: 0 }
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
    setTimeout(() => {
      goToStep(0);
      useLessonStore.getState().setIsPlaying(true);
    }, 30);
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
    setTimeout(() => {
      goToStep(0);
      useLessonStore.getState().setIsPlaying(true);
    }, 30);
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
      
      {/* Sleek Minimal Header - Matching Stack Control Panel */}
      <div className="px-3.5 py-2.5 bg-[#070913] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-200 text-[11px]">QUEUE CONTROLS</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-md px-2 py-0.5">
            <span className="text-slate-400">Cap:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {[2, 3, 4, 5, 6, 8].map(n => (
                <option key={n} value={n} className="bg-slate-900 text-slate-200">{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-md px-2 py-0.5">
            <span className="text-slate-400">REAR:</span>
            <strong className="text-indigo-400 font-mono">{isEmpty ? -1 : queue.length - 1}</strong>
          </div>
          <button
            onClick={() => handleCapacityChange(capacity)}
            className="text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 transition-colors"
            title="Reset Queue"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Dashboard Body - Evenly Distributed Layout (Matching Stack) */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between gap-3">

        {/* Error Alert */}
        {error && (
          <div className="px-3.5 py-2 rounded-sm bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center justify-between shadow-md">
            <span className="font-medium">⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-rose-300 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-none bg-rose-900/60">✕</button>
          </div>
        )}

        {/* Main Controls Stack */}
        <div className="flex flex-col gap-3.5">
          
          {/* Row 1: Enqueue Input & Action */}
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Value..."
              value={enqueueVal}
              onChange={e => setEnqueueVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnqueue()}
              className="flex-1 px-3.5 py-3 rounded-sm bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={handleEnqueue}
              disabled={isFull}
              className={`px-5 py-3 rounded-sm font-mono font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95 ${
                isFull
                  ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40'
              }`}
            >
              <Plus size={14} /> Enqueue
            </button>
          </div>

          {/* Row 2: Dequeue | Peek | Traverse (Matching 3-Column Grid) */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handleDequeue}
              disabled={isEmpty}
              className={`py-3 px-2 rounded-sm font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                isEmpty
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-300 hover:text-white'
              }`}
            >
              <ArrowRight size={14} /> Dequeue
            </button>

            <button
              onClick={handlePeek}
              disabled={isEmpty}
              className={`py-3 px-2 rounded-sm font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                isEmpty
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-amber-950/70 hover:bg-amber-900 border border-amber-500/60 text-amber-300 hover:text-white'
              }`}
            >
              <Eye size={14} /> Peek
            </button>

            <button
              onClick={handleTraverse}
              disabled={isEmpty}
              className={`py-3 px-2 rounded-sm font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                isEmpty
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 hover:text-white'
              }`}
            >
              <Play size={14} /> Traverse
            </button>
          </div>

          {/* Row 3: Search Input & Action */}
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3.5 py-3 rounded-sm bg-slate-950 border border-slate-700 focus:border-purple-400 text-slate-100 text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={handleSearch}
              disabled={isEmpty}
              className={`px-5 py-3 rounded-sm font-mono font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all active:scale-95 ${
                isEmpty
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-purple-950/70 hover:bg-purple-900 border border-purple-500/60 text-purple-200 hover:text-white'
              }`}
            >
              <Search size={14} /> Search
            </button>
          </div>

        </div>

        {/* Bottom Utility Stack */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800/80">
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handleIsEmpty}
              className="py-2.5 rounded-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-[11px] font-bold transition-all active:scale-95 shadow-sm"
            >
              isEmpty()
            </button>
            <button
              onClick={handleIsFull}
              className="py-2.5 rounded-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-[11px] font-bold transition-all active:scale-95 shadow-sm"
            >
              isFull()
            </button>
            <button
              onClick={handleSize}
              className="py-2.5 rounded-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-[11px] font-bold transition-all active:scale-95 shadow-sm"
            >
              Size()
            </button>
          </div>

          <button
            onClick={handleClear}
            disabled={isEmpty}
            className={`w-full py-2.5 rounded-sm font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              isEmpty
                ? 'bg-slate-900/60 border border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 text-rose-300 hover:text-white'
            }`}
          >
            <Trash2 size={14} /> Clear Queue
          </button>
        </div>

      </div>
    </div>
  );
};
