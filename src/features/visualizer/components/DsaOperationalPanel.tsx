import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, ArrowDown, Eye, Search, Play, RotateCcw, Trash2 } from 'lucide-react';

const CAPACITY = 6;

/** Read stack array from step */
const stackFromStep = (step: ExecutionStep | null): (string | number)[] => {
  if (!step) return [];
  const mem = step.memorySnapshot as any;
  if (Array.isArray(mem?.stack)) return mem.stack;
  if (typeof mem?.stack === 'string') {
    try { return JSON.parse(mem.stack); } catch { return []; }
  }
  const ev = step.animationEvent as any;
  if (ev?.stackState) return ev.stackState;
  return [];
};

export const DsaOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [stack, setStack] = useState<(string | number)[]>([]);
  const [pushVal, setPushVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = stackFromStep(currentStep);
    setStack(s);
  }, [currentStep]);

  useEffect(() => {
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: 'Stack initialized (Empty). Enter value & click Push to add element.',
      explanationHinglish: 'Stack empty initialize hua hai. Value daal kar Push click karein.',
      memorySnapshot: { top: -1, capacity: CAPACITY, stack: [] },
      consoleOutput: '> Stack initialized (Empty).',
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
      memorySnapshot: { top: newStack.length - 1, capacity: CAPACITY, stack: newStack, ...extraMem },
      consoleOutput: `> ${consoleOut}`,
      animationEvent: event,
    };
    setStack(newStack);
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  }, [setCustomSteps, goToStep]);

  /* ── Core Stack Operations ── */

  const handlePush = () => {
    const val = pushVal.trim();
    if (!val) return setError('Please enter a value to push');
    if (stack.length >= CAPACITY) return setError(`Stack Full! Maximum capacity is ${CAPACITY}`);
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...stack, parsed];
    dispatch(next,
      `PUSH (${parsed}): Added to index [${next.length - 1}]. TOP is now ${next.length - 1}.`,
      `PUSH (${parsed}): Index [${next.length - 1}] par add hua. TOP ab ${next.length - 1} hai.`,
      `Pushed: ${parsed} | Size: ${next.length}/${CAPACITY}`,
      { type: 'STACK_PUSH', value: parsed, stackState: next }
    );
    setPushVal('');
  };

  const handlePop = () => {
    if (stack.length === 0) return setError('Stack Empty! Cannot pop element');
    const popped = stack[stack.length - 1];
    const next = stack.slice(0, -1);
    dispatch(next,
      `POP (): Removed ${popped} from index [${stack.length - 1}]. TOP is now ${next.length - 1}.`,
      `POP (): ${popped} remove hua. TOP ab ${next.length - 1} hai.`,
      `Popped: ${popped} | Size: ${next.length}/${CAPACITY}`,
      { type: 'STACK_POP', poppedValue: popped, stackState: next }
    );
  };

  const handlePeek = () => {
    if (stack.length === 0) return setError('Stack Empty! Nothing to peek');
    const top = stack[stack.length - 1];
    dispatch(stack,
      `PEEK (): Top element is "${top}" at index [${stack.length - 1}].`,
      `PEEK (): Top element "${top}" hai index [${stack.length - 1}] par.`,
      `Peek TOP: ${top} at index [${stack.length - 1}]`,
      { type: 'SET_POINTERS', pointers: { top: stack.length - 1 } }
    );
  };

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) return setError('Please enter a value to search');
    if (stack.length === 0) return setError('Stack Empty! Cannot search');
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
        explanationEnglish: `Search: Checking index [${i}] (${stack[i]}). ${match ? 'FOUND!' : 'Checking next...'}`,
        explanationHinglish: `Search: Index [${i}] (${stack[i]}) check kiya. ${match ? 'MIL GAYA!' : 'Aage check kar rahe...'}`,
        memorySnapshot: { top: stack.length - 1, capacity: CAPACITY, stack, i },
        consoleOutput: `> Checking [${i}]: ${stack[i]} ${match ? '== MATCH' : ''}`,
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
        explanationEnglish: `Search complete: "${target}" not found in stack.`,
        explanationHinglish: `Search khatam: "${target}" stack me nahi mila.`,
        memorySnapshot: { top: stack.length - 1, capacity: CAPACITY, stack },
        consoleOutput: `> Search: ${target} NOT FOUND`,
        animationEvent: { type: 'NONE' } as any,
      });
    }
    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleTraverse = () => {
    if (stack.length === 0) return setError('Stack Empty! Nothing to traverse');
    const steps: ExecutionStep[] = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Traverse: Visiting index [${i}] = ${stack[i]}`,
        explanationHinglish: `Traverse: Index [${i}] = ${stack[i]} visit kiya`,
        memorySnapshot: { top: stack.length - 1, capacity: CAPACITY, stack, i },
        consoleOutput: `> Index [${i}]: ${stack[i]}`,
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
      `isEmpty(): ${empty ? 'YES (Stack is Empty)' : 'NO (Stack has elements)'}`,
      `isEmpty(): ${empty ? 'HAAN (Stack khali hai)' : 'NAHI (Stack me elements hain)'}`,
      `isEmpty() = ${empty}`,
      { type: 'NONE' } as any
    );
  };

  const handleIsFull = () => {
    const full = stack.length >= CAPACITY;
    dispatch(stack,
      `isFull(): ${full ? 'YES (Stack is Full)' : 'NO (Space Available)'}`,
      `isFull(): ${full ? 'HAAN (Stack full hai)' : 'NAHI (Space available hai)'}`,
      `isFull() = ${full}`,
      { type: 'NONE' } as any
    );
  };

  const handleSize = () => {
    dispatch(stack,
      `Size(): Stack contains ${stack.length} item(s) out of ${CAPACITY}`,
      `Size(): Stack me ${stack.length} items hain total ${CAPACITY} me se`,
      `Size = ${stack.length}/${CAPACITY}`,
      { type: 'NONE' } as any
    );
  };

  const handleClear = () => {
    dispatch([],
      `Stack cleared. All elements removed.`,
      `Stack clear ho gaya. Saare elements remove ho gaye.`,
      `Cleared Stack`,
      { type: 'STACK_POP', poppedValue: '', stackState: [] }
    );
  };

  const handleReset = () => {
    setStack([]);
    setError(null);
    setPushVal('');
    setSearchVal('');
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: 'Stack reset to empty.',
      explanationHinglish: 'Stack reset ho gaya.',
      memorySnapshot: { top: -1, capacity: CAPACITY, stack: [] },
      consoleOutput: '> Stack Reset.',
      animationEvent: { type: 'NONE' } as any,
    };
    setCustomSteps([init]);
    setTimeout(() => goToStep(1), 30);
  };

  const topIndex = stack.length - 1;
  const isEmpty = stack.length === 0;
  const isFull = stack.length >= CAPACITY;

  return (
    <div className="h-full flex flex-col bg-[#0a0c16] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Dashboard Top Header */}
      <div className="px-4 py-3 bg-[#0d0f1f] border-b border-slate-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isEmpty ? 'bg-slate-500' : isFull ? 'bg-red-400' : 'bg-green-400'}`} />
          <span className="text-xs font-bold font-mono tracking-wider text-slate-300">STACK CONTROLS</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">SIZE: <strong className="text-indigo-400">{stack.length}/{CAPACITY}</strong></span>
          <span className="text-slate-400">TOP: <strong className="text-purple-400">{topIndex}</strong></span>
          <button onClick={handleReset} className="ml-1 text-slate-500 hover:text-red-400 transition-colors p-1" title="Reset All">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main Controls Section */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* Error notification */}
        {error && (
          <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">✕</button>
          </div>
        )}

        {/* 1. PRIMARY OPERATIONS (Push / Pop / Peek) */}
        <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/40">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">1. Primary Operations</span>
          
          {/* Push Input & Button */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter value..."
              value={pushVal}
              onChange={e => setPushVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePush()}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs font-mono focus:outline-none transition-colors"
            />
            <button
              onClick={handlePush}
              disabled={isFull}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus size={14} /> Push
            </button>
          </div>

          {/* Pop & Peek Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={handlePop}
              disabled={isEmpty}
              className="py-2.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-rose-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowDown size={14} /> Pop
            </button>
            <button
              onClick={handlePeek}
              disabled={isEmpty}
              className="py-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye size={14} /> Peek
            </button>
          </div>
        </div>

        {/* 2. SEARCH & TRAVERSE */}
        <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/40">
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">2. Search & Scan</span>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search value..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-200 text-xs font-mono focus:outline-none transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={isEmpty}
              className="px-4 py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed text-purple-200 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Search size={14} /> Search
            </button>
          </div>

          <button
            onClick={handleTraverse}
            disabled={isEmpty}
            className="w-full py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play size={13} /> Traverse All Items
          </button>
        </div>

        {/* 3. QUICK CHECKS & UTILITIES */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/40">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">3. Utility Checks</span>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleIsEmpty}
              className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] transition-colors"
            >
              isEmpty()
            </button>
            <button
              onClick={handleIsFull}
              className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] transition-colors"
            >
              isFull()
            </button>
            <button
              onClick={handleSize}
              className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] transition-colors"
            >
              Size()
            </button>
          </div>

          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="w-full mt-1 py-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 disabled:opacity-30 text-red-400 font-mono text-[11px] flex items-center justify-center gap-1 transition-colors"
          >
            <Trash2 size={12} /> Clear Stack
          </button>
        </div>

      </div>
    </div>
  );
};
