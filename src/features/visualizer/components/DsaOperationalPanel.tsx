import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, ArrowDown, Eye, Search, Play, RotateCcw, Trash2 } from 'lucide-react';

/** Read stack array from step */
const stackFromStep = (step: ExecutionStep | null): { stack: (string | number)[]; capacity: number } => {
  if (!step) return { stack: [], capacity: 4 };
  const mem = step.memorySnapshot as any;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 4;
  if (Array.isArray(mem?.stack)) return { stack: mem.stack, capacity: cap };
  if (typeof mem?.stack === 'string') {
    try { return { stack: JSON.parse(mem.stack), capacity: cap }; } catch { return { stack: [], capacity: cap }; }
  }
  const ev = step.animationEvent as any;
  if (ev?.stackState) return { stack: ev.stackState, capacity: cap };
  return { stack: [], capacity: cap };
};

export const DsaOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [capacity, setCapacity] = useState<number>(4);
  const [stack, setStack] = useState<(string | number)[]>([]);
  const [pushVal, setPushVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { stack: s, capacity: c } = stackFromStep(currentStep);
    setStack(s);
    if (c) setCapacity(c);
  }, [currentStep]);

  useEffect(() => {
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Stack initialized (Empty). Capacity: ${capacity}.`,
      explanationHinglish: `Stack empty initialize hua hai. Capacity: ${capacity}.`,
      memorySnapshot: { top: -1, capacity, stack: [] },
      consoleOutput: `> Stack initialized (Capacity: ${capacity}).`,
      animationEvent: { type: 'NONE' } as any,
    };
    setStack([]);
    setCustomSteps([init]);
    setTimeout(() => goToStep(1), 30);
  }, [lesson?.id]);

  const dispatch = useCallback((
    newStack: (string | number)[],
    explanationEn: string,
    explanationHi: string,
    consoleOut: string,
    event: any,
    extraMem: Record<string, any> = {}
  ) => {
    setError(null);
    const step: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: explanationEn,
      explanationHinglish: explanationHi,
      memorySnapshot: { top: newStack.length - 1, capacity, stack: newStack, ...extraMem },
      consoleOutput: `> ${consoleOut}`,
      animationEvent: event,
    };
    setStack(newStack);
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  }, [setCustomSteps, goToStep, capacity]);

  /* ── Stack Operations ── */

  const handlePush = () => {
    const val = pushVal.trim();
    if (!val) return setError('Enter value to push');
    if (stack.length >= capacity) return setError(`Stack Overflow (Capacity: ${capacity})`);
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...stack, parsed];
    dispatch(next,
      `PUSH(${parsed}): Added to index [${next.length - 1}]. TOP → ${next.length - 1}.`,
      `PUSH(${parsed}): Index [${next.length - 1}] pe push hua. TOP → ${next.length - 1}.`,
      `Pushed: ${parsed} | Size: ${next.length}/${capacity}`,
      { type: 'STACK_PUSH', value: parsed, stackState: next }
    );
    setPushVal('');
  };

  const handlePop = () => {
    if (stack.length === 0) return setError('Stack Underflow (Empty)');
    const popped = stack[stack.length - 1];
    const next = stack.slice(0, -1);
    dispatch(next,
      `POP(): Removed ${popped} from index [${stack.length - 1}].`,
      `POP(): ${popped} remove hua.`,
      `Popped: ${popped} | Size: ${next.length}/${capacity}`,
      { type: 'STACK_POP', poppedValue: popped, stackState: next }
    );
  };

  const handlePeek = () => {
    if (stack.length === 0) return setError('Stack is empty');
    const top = stack[stack.length - 1];
    dispatch(stack,
      `PEEK(): TOP = ${top} [index ${stack.length - 1}]`,
      `PEEK(): TOP = ${top} [index ${stack.length - 1}]`,
      `Peek TOP: ${top}`,
      { type: 'SET_POINTERS', pointers: { top: stack.length - 1 } }
    );
  };

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) return setError('Enter search value');
    if (stack.length === 0) return setError('Stack is empty');
    const target = isNaN(Number(val)) ? val : Number(val);
    setSearchVal('');

    const steps: ExecutionStep[] = [];
    let found = false;
    for (let i = stack.length - 1; i >= 0; i--) {
      const match = stack[i] === target;
      if (match) found = true;
      steps.push({
        step: steps.length + 1,
        lineNum: steps.length + 1,
        explanationEnglish: `Search: checking index [${i}] = ${stack[i]}`,
        explanationHinglish: `Search: index [${i}] = ${stack[i]} check kiya`,
        memorySnapshot: { top: stack.length - 1, capacity, stack, i },
        consoleOutput: `> Index [${i}]: ${stack[i]} ${match ? '✓ MATCH' : ''}`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'stack',
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
        memorySnapshot: { top: stack.length - 1, capacity, stack },
        consoleOutput: `> ${target} NOT FOUND`,
        animationEvent: { type: 'NONE' } as any,
      });
    }
    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleTraverse = () => {
    if (stack.length === 0) return setError('Stack is empty');
    const steps: ExecutionStep[] = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Traverse: index [${i}] = ${stack[i]}`,
        explanationHinglish: `Traverse: index [${i}] = ${stack[i]}`,
        memorySnapshot: { top: stack.length - 1, capacity, stack, i },
        consoleOutput: `> [${i}]: ${stack[i]}`,
        animationEvent: { type: 'SET_POINTERS', pointers: { curr: i } } as any,
      });
    }
    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleIsEmpty = () => {
    const empty = stack.length === 0;
    dispatch(stack,
      `isEmpty() = ${empty}`,
      `isEmpty() = ${empty}`,
      `isEmpty() = ${empty}`,
      { type: 'NONE' } as any
    );
  };

  const handleIsFull = () => {
    const full = stack.length >= capacity;
    dispatch(stack,
      `isFull() = ${full}`,
      `isFull() = ${full}`,
      `isFull() = ${full}`,
      { type: 'NONE' } as any
    );
  };

  const handleSize = () => {
    dispatch(stack,
      `Size() = ${stack.length}/${capacity}`,
      `Size() = ${stack.length}/${capacity}`,
      `Size = ${stack.length}/${capacity}`,
      { type: 'NONE' } as any
    );
  };

  const handleClear = () => {
    dispatch([],
      `Stack cleared.`,
      `Stack cleared.`,
      `Cleared Stack`,
      { type: 'STACK_POP', poppedValue: '', stackState: [] }
    );
  };

  const handleCapacityChange = (newCap: number) => {
    setCapacity(newCap);
    const trimmedStack = stack.slice(0, newCap);
    setStack(trimmedStack);
    setError(null);
    const step: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Capacity changed to ${newCap}.`,
      explanationHinglish: `Capacity badal kar ${newCap} set ki.`,
      memorySnapshot: { top: trimmedStack.length - 1, capacity: newCap, stack: trimmedStack },
      consoleOutput: `> Capacity = ${newCap}`,
      animationEvent: { type: 'NONE' } as any,
    };
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  };

  const topIndex = stack.length - 1;
  const isEmpty = stack.length === 0;
  const isFull = stack.length >= capacity;

  return (
    <div className="h-full flex flex-col bg-[#0a0c16] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Simple Header */}
      <div className="px-4 py-3 bg-[#0d0f1f] border-b border-slate-800/60 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">STACK CONTROLS</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Size:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-slate-900 text-purple-400 border border-slate-700/60 rounded px-1.5 py-0.5 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {[2, 3, 4, 5, 6, 8].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <span className="text-slate-400">TOP: <strong className="text-purple-400">{topIndex}</strong></span>
          <button onClick={() => handleCapacityChange(capacity)} className="text-slate-500 hover:text-slate-300 p-1" title="Reset">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Simple Clean Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">✕</button>
          </div>
        )}

        {/* PUSH */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Value..."
            value={pushVal}
            onChange={e => setPushVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePush()}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs font-mono focus:outline-none"
          />
          <button
            onClick={handlePush}
            disabled={isFull}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center gap-1 shrink-0"
          >
            <Plus size={14} /> Push
          </button>
        </div>

        {/* POP & PEEK */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePop}
            disabled={isEmpty}
            className="py-2.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 text-rose-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5"
          >
            <ArrowDown size={14} /> Pop
          </button>
          <button
            onClick={handlePeek}
            disabled={isEmpty}
            className="py-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 disabled:opacity-40 text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5"
          >
            <Eye size={14} /> Peek
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
          <Play size={13} /> Traverse
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
          <Trash2 size={12} /> Clear Stack
        </button>

      </div>
    </div>
  );
};
