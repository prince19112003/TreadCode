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
      { type: 'STACK_PEEK', peekIndex: stack.length - 1, value: top, pointers: { top: stack.length - 1 } }
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
    <div className="h-full flex flex-col bg-[#0b0d19] border border-slate-800/80 rounded-xl overflow-hidden text-slate-200 shadow-xl">
      
      {/* Sleek Minimal Header */}
      <div className="px-3.5 py-2.5 bg-[#070913] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-200 text-[11px]">STACK CONTROLS</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-md px-2 py-0.5">
            <span className="text-slate-400">Cap:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {[2, 3, 4, 5, 6, 8].map(n => (
                <option key={n} value={n} className="bg-slate-900 text-slate-200">{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-md px-2 py-0.5">
            <span className="text-slate-400">TOP:</span>
            <strong className="text-purple-400 font-mono">{topIndex}</strong>
          </div>
          <button
            onClick={() => handleCapacityChange(capacity)}
            className="text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 transition-colors"
            title="Reset Stack"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Dashboard Body - Evenly Distributed Well-Proportioned Layout */}
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
          
          {/* Row 1: Push Input & Action */}
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Value..."
              value={pushVal}
              onChange={e => setPushVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePush()}
              className="flex-1 px-3.5 py-3 rounded-sm bg-slate-950 border border-slate-700 focus:border-indigo-400 text-slate-100 text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={handlePush}
              disabled={isFull}
              className={`px-5 py-3 rounded-sm font-mono font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95 ${
                isFull
                  ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40'
              }`}
            >
              <Plus size={14} /> Push
            </button>
          </div>

          {/* Row 2: Pop | Peek | Traverse */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handlePop}
              disabled={isEmpty}
              className={`py-3 px-2 rounded-sm font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                isEmpty
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-300 hover:text-white'
              }`}
            >
              <ArrowDown size={14} /> Pop
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
            <Trash2 size={14} /> Clear Stack
          </button>
        </div>

      </div>
    </div>
  );
};
