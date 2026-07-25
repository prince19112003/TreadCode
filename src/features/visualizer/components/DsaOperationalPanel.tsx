import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';

const CAPACITY = 6;

/** Read stack array from a step's memorySnapshot or animationEvent */
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

  // Local stack state: source of truth derived from the LATEST customStep
  const [stack, setStack] = useState<(string | number)[]>([]);
  const [pushVal, setPushVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync local stack whenever the current step changes (time-travel support)
  useEffect(() => {
    const s = stackFromStep(currentStep);
    setStack(s);
  }, [currentStep]);

  // Initialize with empty stack step on lesson mount
  useEffect(() => {
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: 'Stack initialized (Empty). Use the controls below to interact.',
      explanationHinglish: 'Stack empty initialize hua hai. Neeche ke controls se interact karein.',
      memorySnapshot: { top: -1, capacity: CAPACITY, stack: [] },
      consoleOutput: '> Stack initialized (Empty).',
      animationEvent: { type: 'NONE' } as any,
    };
    setStack([]);
    setCustomSteps([init]);
    setTimeout(() => goToStep(1), 30);
  }, [lesson?.id]);

  /** Push a single new step replacing all history with the new live state */
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

  /* ── Stack Operations ─────────────────────────────────────────────────── */

  const handlePush = () => {
    const val = pushVal.trim();
    if (!val) return setError('Enter a value to push.');
    if (stack.length >= CAPACITY) return setError(`Stack Overflow! Capacity is ${CAPACITY}.`);
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...stack, parsed];
    dispatch(next,
      `PUSH(${parsed}): Element placed at index [${next.length - 1}]. TOP → ${next.length - 1}.`,
      `PUSH(${parsed}): Element index [${next.length - 1}] pe push hua. TOP → ${next.length - 1}.`,
      `Pushed: ${parsed} | Size: ${next.length}/${CAPACITY} | TOP: ${next.length - 1}`,
      { type: 'STACK_PUSH', value: parsed, stackState: next }
    );
    setPushVal('');
  };

  const handlePop = () => {
    if (stack.length === 0) return setError('Stack Underflow! Stack is empty.');
    const popped = stack[stack.length - 1];
    const next = stack.slice(0, -1);
    dispatch(next,
      `POP(): Element ${popped} removed from index [${stack.length - 1}]. TOP → ${next.length - 1}.`,
      `POP(): Element ${popped} index [${stack.length - 1}] se remove hua. TOP → ${next.length - 1}.`,
      `Popped: ${popped} | Size: ${next.length}/${CAPACITY} | TOP: ${next.length - 1}`,
      { type: 'STACK_POP', poppedValue: popped, stackState: next }
    );
  };

  const handlePeek = () => {
    if (stack.length === 0) return setError('Stack is empty! Cannot peek.');
    const top = stack[stack.length - 1];
    dispatch(stack,
      `PEEK(): Top element is ${top} at index [${stack.length - 1}]. No removal.`,
      `PEEK(): Top element ${top} index [${stack.length - 1}] par hai. Remove nahi hua.`,
      `Peeked TOP: ${top} at index [${stack.length - 1}]`,
      { type: 'SET_POINTERS', pointers: { top: stack.length - 1 } }
    );
  };

  const handleIsEmpty = () => {
    const empty = stack.length === 0;
    dispatch(stack,
      `isEmpty(): Stack has ${stack.length} element(s). Result = ${empty ? 'TRUE (Stack is empty)' : 'FALSE (Stack has elements)'}.`,
      `isEmpty(): Stack me ${stack.length} elements hain. Result = ${empty ? 'TRUE (Stack khali hai)' : 'FALSE (Stack me elements hain)'}.`,
      `isEmpty() = ${empty} | Size: ${stack.length}`,
      { type: 'NONE' } as any
    );
  };

  const handleIsFull = () => {
    const full = stack.length >= CAPACITY;
    dispatch(stack,
      `isFull(): Stack has ${stack.length}/${CAPACITY} elements. Result = ${full ? 'TRUE (Stack is full)' : 'FALSE (Space available)'}.`,
      `isFull(): Stack ${stack.length}/${CAPACITY} bhara hai. Result = ${full ? 'TRUE (Stack full hai)' : 'FALSE (Space hai)'}.`,
      `isFull() = ${full} | Size: ${stack.length}/${CAPACITY}`,
      { type: 'NONE' } as any
    );
  };

  const handleSize = () => {
    dispatch(stack,
      `Size(): Stack currently holds ${stack.length} element(s) out of capacity ${CAPACITY}.`,
      `Size(): Stack me abhi ${stack.length} elements hain, capacity ${CAPACITY} hai.`,
      `Size() = ${stack.length} | Capacity: ${CAPACITY}`,
      { type: 'NONE' } as any
    );
  };

  const handleClear = () => {
    dispatch([],
      `CLEAR(): All ${stack.length} element(s) removed. Stack is now empty.`,
      `CLEAR(): Saare ${stack.length} elements remove ho gaye. Stack ab empty hai.`,
      `Stack Cleared | Size: 0/${CAPACITY} | TOP: -1`,
      { type: 'STACK_POP', poppedValue: '', stackState: [] }
    );
  };

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) return setError('Enter a value to search.');
    if (stack.length === 0) return setError('Stack is empty! Cannot search.');
    const target = isNaN(Number(val)) ? val : Number(val);
    setSearchVal('');

    // Build multi-step scan steps
    const steps: ExecutionStep[] = [];
    let found = false;
    for (let i = stack.length - 1; i >= 0; i--) {
      const match = stack[i] === target;
      if (match) found = true;
      steps.push({
        step: steps.length + 1,
        lineNum: steps.length + 1,
        explanationEnglish: `Search Step: Checking index [${i}] = ${stack[i]}. ${match ? '✓ TARGET FOUND!' : 'No match, continue.'}`,
        explanationHinglish: `Search Step: Index [${i}] = ${stack[i]} check kiya. ${match ? '✓ TARGET MIL GAYA!' : 'Match nahi, aage chalein.'}`,
        memorySnapshot: { top: stack.length - 1, capacity: CAPACITY, stack, i },
        consoleOutput: `> Comparing [${i}]: ${stack[i]} == ${target} → ${match ? 'MATCH' : 'No Match'}`,
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
        explanationEnglish: `Search complete: ${target} not found in stack.`,
        explanationHinglish: `Search khatam: ${target} stack me nahi mila.`,
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
    if (stack.length === 0) return setError('Stack is empty! Nothing to traverse.');
    const steps: ExecutionStep[] = [];
    for (let i = stack.length - 1; i >= 0; i--) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Traverse Step: Visiting index [${i}] = ${stack[i]}.${i === stack.length - 1 ? ' (This is the TOP element)' : ''}`,
        explanationHinglish: `Traverse Step: Index [${i}] = ${stack[i]} visit kiya.${i === stack.length - 1 ? ' (Yeh TOP element hai)' : ''}`,
        memorySnapshot: { top: stack.length - 1, capacity: CAPACITY, stack, i },
        consoleOutput: `> Visiting [${i}]: ${stack[i]}`,
        animationEvent: { type: 'SET_POINTERS', pointers: { curr: i } } as any,
      });
    }
    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleReset = () => {
    setStack([]);
    setError(null);
    setPushVal('');
    setSearchVal('');
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: 'Stack has been reset to empty.',
      explanationHinglish: 'Stack reset hokar empty ho gaya hai.',
      memorySnapshot: { top: -1, capacity: CAPACITY, stack: [] },
      consoleOutput: '> Stack Reset.',
      animationEvent: { type: 'NONE' } as any,
    };
    setCustomSteps([init]);
    setTimeout(() => goToStep(1), 30);
  };

  /* ── UI ──────────────────────────────────────────────────────────────── */
  const topIndex = stack.length - 1;
  const isEmpty = stack.length === 0;
  const isFull = stack.length >= CAPACITY;

  return (
    <div className="h-full flex flex-col bg-[#080a12] border border-slate-800/40 rounded-2xl overflow-hidden text-slate-200">

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full shadow-[0_0_6px] ${isEmpty ? 'bg-slate-600 shadow-slate-600' : isFull ? 'bg-red-400 shadow-red-400' : 'bg-green-400 shadow-green-400'}`} />
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            Stack Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
          <span>TOP: <span className="text-purple-400 font-bold">{topIndex}</span></span>
          <span className="text-slate-800">|</span>
          <span>SIZE: <span className="text-slate-300 font-bold">{stack.length}/{CAPACITY}</span></span>
          <button
            onClick={handleReset}
            className="ml-2 text-[10px] text-red-500/60 hover:text-red-400 font-mono transition-colors"
          >
            ✕ Reset
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">

        {/* Error */}
        {error && (
          <div className="px-4 py-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
            <span className="text-red-400/60">⚠</span> {error}
          </div>
        )}

        {/* PUSH */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Insert Element</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Value..."
              value={pushVal}
              onChange={e => setPushVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePush()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 focus:border-indigo-500/40 text-slate-200 text-xs font-mono focus:outline-none transition-all placeholder:text-slate-700 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.1)]"
            />
            <button
              onClick={handlePush}
              disabled={isFull}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs transition-all font-mono shadow-[0_0_12px_rgba(99,102,241,0.3)] hover:shadow-[0_0_16px_rgba(99,102,241,0.5)]"
            >
              Push()
            </button>
          </div>
        </div>

        {/* POP + PEEK */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Remove / Inspect</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePop}
              disabled={isEmpty}
              className="py-3 rounded-xl border border-rose-500/25 bg-rose-950/20 hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed text-rose-400 font-bold text-xs transition-all font-mono"
            >
              Pop()
            </button>
            <button
              onClick={handlePeek}
              disabled={isEmpty}
              className="py-3 rounded-xl border border-amber-500/25 bg-amber-950/20 hover:bg-amber-950/40 disabled:opacity-30 disabled:cursor-not-allowed text-amber-400 font-bold text-xs transition-all font-mono"
            >
              Peek()
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Search Element</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search value..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 focus:border-purple-500/40 text-slate-200 text-xs font-mono focus:outline-none transition-all placeholder:text-slate-700 focus:shadow-[0_0_0_2px_rgba(168,85,247,0.1)]"
            />
            <button
              onClick={handleSearch}
              disabled={isEmpty}
              className="px-4 py-2.5 rounded-xl border border-purple-500/25 bg-purple-950/20 hover:bg-purple-950/40 disabled:opacity-30 disabled:cursor-not-allowed text-purple-400 font-bold text-xs transition-all font-mono"
            >
              Search()
            </button>
          </div>
        </div>

        {/* TRAVERSE + UTILITY ROW */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Traverse & Utility</span>
          <button
            onClick={handleTraverse}
            disabled={isEmpty}
            className="w-full py-3 rounded-xl border border-cyan-500/20 bg-cyan-950/15 hover:bg-cyan-950/30 disabled:opacity-30 disabled:cursor-not-allowed text-cyan-400 font-bold text-xs transition-all font-mono"
          >
            Traverse() — Scan Top → Bottom
          </button>
        </div>

        {/* divider */}
        <div className="border-t border-slate-800/30" />

        {/* Getter Operations */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Check Properties</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleIsEmpty}
              className="py-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/40 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-all"
            >
              isEmpty()
            </button>
            <button
              onClick={handleIsFull}
              className="py-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/40 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-all"
            >
              isFull()
            </button>
            <button
              onClick={handleSize}
              className="py-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/40 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-all"
            >
              Size()
            </button>
          </div>
        </div>

        {/* CLEAR */}
        <button
          onClick={handleClear}
          disabled={isEmpty}
          className="w-full py-2.5 rounded-xl border border-slate-700/20 hover:bg-slate-900/40 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:text-slate-400 text-[10px] transition-all font-mono"
        >
          Clear Stack
        </button>

      </div>
    </div>
  );
};
