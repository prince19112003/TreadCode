import React, { useState, useEffect } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';


export const DsaOperationalPanel: React.FC = () => {
  const {
    lesson,
    customSteps,
    setCustomSteps,
    currentStepIndex,
    goToStep,
  } = useLesson();

  const [pushVal, setPushVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const capacity = 6;

  // Helper to extract the current stack state from customSteps (or start empty)
  const getCurrentStack = (): (string | number)[] => {
    if (!customSteps || customSteps.length === 0) return [];
    // Get the state at the currentStepIndex
    const activeIdx = Math.max(0, currentStepIndex - 1);
    const step = customSteps[activeIdx];
    if (step && step.animationEvent && (step.animationEvent.type === 'STACK_PUSH' || step.animationEvent.type === 'STACK_POP')) {
      return (step.animationEvent as any).stackState ?? [];
    }
    // Fallback: scan backwards to find last stackState
    for (let i = activeIdx; i >= 0; i--) {
      const s = customSteps[i];
      if (s && s.animationEvent && (s.animationEvent.type === 'STACK_PUSH' || s.animationEvent.type === 'STACK_POP')) {
        return (s.animationEvent as any).stackState ?? [];
      }
    }
    return [];
  };

  const stack = getCurrentStack();

  // Reset/Initialize customSteps on mount or lesson change
  useEffect(() => {
    const initialStep: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: 'Stack is initialized and currently empty. Capacity is set to 6.',
      explanationHinglish: 'Stack empty state me initialize hua hai. Capacity 6 slots ki hai.',
      memorySnapshot: { top: -1, capacity },
      consoleOutput: 'Stack initialized (Empty).',
      animationEvent: { type: 'STACK_POP', poppedValue: '', stackState: [] },
    };
    setCustomSteps([initialStep]);
    goToStep(1);
  }, [lesson?.id]);

  const addStep = (
    explanationEn: string,
    explanationHi: string,
    event: any,
    consoleOut: string,
    memUpdate: Record<string, any> = {}
  ) => {
    setErrorMsg(null);
    if (!customSteps) return;

    // Slice history up to current step index to handle "time travel"
    const baseSteps = customSteps.slice(0, currentStepIndex);
    const nextStepNum = baseSteps.length + 1;

    const targetStack = memUpdate.stack !== undefined ? memUpdate.stack : stack;

    const newStep: ExecutionStep = {
      step: nextStepNum,
      lineNum: nextStepNum,
      explanationEnglish: explanationEn,
      explanationHinglish: explanationHi,
      memorySnapshot: {
        top: targetStack.length - 1,
        capacity,
        stack: targetStack,
        ...memUpdate,
      },
      consoleOutput: consoleOut,
      animationEvent: event,
    };

    const updated = [...baseSteps, newStep];
    setCustomSteps(updated);

    setTimeout(() => {
      goToStep(updated.length);
    }, 50);
  };

  /* ── Stack Actions ──────────────────────────────────────────────────────── */

  const handlePush = () => {
    if (!pushVal.trim()) {
      setErrorMsg('Please enter a value to push.');
      return;
    }
    if (stack.length >= capacity) {
      setErrorMsg('Stack Overflow! Stack is completely full.');
      return;
    }

    const value = isNaN(Number(pushVal)) ? pushVal : Number(pushVal);
    const newStack = [...stack, value];

    addStep(
      `PUSH operation: Element ${value} is pushed onto the stack. TOP moves up.`,
      `PUSH operation: Element ${value} stack ke top pe add ho gaya. TOP ek index upar chala gaya.`,
      { type: 'STACK_PUSH', value, stackState: newStack },
      `Pushed: ${value}`,
      { stack: newStack, top: newStack.length - 1 }
    );
    setPushVal('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setErrorMsg('Stack Underflow! Stack is empty.');
      return;
    }

    const popped = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);

    addStep(
      `POP operation: Top element ${popped} is retrieved and removed. TOP moves down.`,
      `POP operation: Sabse upar ka element ${popped} stack se nikal (remove) diya gaya.`,
      { type: 'STACK_POP', poppedValue: popped, stackState: newStack },
      `Popped: ${popped}`,
      { stack: newStack, top: newStack.length - 1 }
    );
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setErrorMsg('Stack is empty! Cannot peek.');
      return;
    }

    const topVal = stack[stack.length - 1];
    addStep(
      `PEEK operation: Inspecting the top element without removing it. Top element is ${topVal}.`,
      `PEEK operation: Top element ko inspect kiya bina use hataye. Top element ${topVal} hai.`,
      { type: 'SET_POINTERS', pointers: { top: stack.length - 1 } },
      `Peeked Top: ${topVal}`
    );
  };

  const handleIsEmpty = () => {
    const empty = stack.length === 0;
    addStep(
      `isEmpty check: Stack size is ${stack.length}. isEmpty = ${empty ? 'TRUE' : 'FALSE'}.`,
      `isEmpty check: Stack me abhi ${stack.length} elements hain. isEmpty = ${empty ? 'TRUE (Khali)' : 'FALSE (Khali nahi)'}.`,
      { type: 'NONE' },
      `isEmpty: ${empty}`
    );
  };

  const handleIsFull = () => {
    const full = stack.length >= capacity;
    addStep(
      `isFull check: Stack size is ${stack.length}/${capacity}. isFull = ${full ? 'TRUE' : 'FALSE'}.`,
      `isFull check: Stack size ${stack.length}/${capacity} hai. isFull = ${full ? 'TRUE (Bhara hua)' : 'FALSE'}.`,
      { type: 'NONE' },
      `isFull: ${full}`
    );
  };

  const handleSize = () => {
    addStep(
      `Size check: The total number of elements currently in the stack is ${stack.length}.`,
      `Size check: Stack me total elements ki sankhya abhi ${stack.length} hai.`,
      { type: 'NONE' },
      `Size: ${stack.length}`
    );
  };

  const handleClear = () => {
    addStep(
      `CLEAR operation: All elements have been flushed. Stack is now empty.`,
      `CLEAR operation: Stack ke saare elements ko clear kar diya gaya hai.`,
      { type: 'STACK_POP', poppedValue: '', stackState: [] },
      `Stack cleared.`,
      { stack: [], top: -1 }
    );
  };

  const handleTraverse = () => {
    if (stack.length === 0) {
      setErrorMsg('Stack is empty! Nothing to traverse.');
      return;
    }

    let stepsToInject = [...(customSteps ?? [])];
    const baseIndex = currentStepIndex;

    for (let i = stack.length - 1; i >= 0; i--) {
      stepsToInject.push({
        step: stepsToInject.length + 1,
        lineNum: stepsToInject.length + 1,
        explanationEnglish: `Traversing: Inspecting stack element at index [${i}] = ${stack[i]}.`,
        explanationHinglish: `Traverse step: Index [${i}] pe inspect kiya, value = ${stack[i]} hai.`,
        memorySnapshot: { top: stack.length - 1, capacity, stack, i },
        consoleOutput: `Element at [${i}]: ${stack[i]}`,
        animationEvent: { type: 'SET_POINTERS', pointers: { curr: i } },
      });
    }

    setCustomSteps(stepsToInject);
    setTimeout(() => {
      goToStep(baseIndex + 1);
    }, 50);
  };

  const handleSearch = () => {
    if (!searchVal.trim()) {
      setErrorMsg('Please enter a value to search.');
      return;
    }
    if (stack.length === 0) {
      setErrorMsg('Stack is empty! Cannot search.');
      return;
    }

    const target = isNaN(Number(searchVal)) ? searchVal : Number(searchVal);
    let stepsToInject = [...(customSteps ?? [])];
    const baseIndex = currentStepIndex;

    let foundIndex = -1;

    for (let i = stack.length - 1; i >= 0; i--) {
      const match = stack[i] === target;
      if (match) foundIndex = i;

      stepsToInject.push({
        step: stepsToInject.length + 1,
        lineNum: stepsToInject.length + 1,
        explanationEnglish: `Search Step: Comparing stack[${i}] (${stack[i]}) with target ${target}. ${match ? 'MATCH FOUND!' : 'No match.'}`,
        explanationHinglish: `Search Step: stack[${i}] (${stack[i]}) ko target ${target} se compare kiya. ${match ? 'MATCH MIL GAYA!' : 'Match nahi hua.'}`,
        memorySnapshot: { top: stack.length - 1, capacity, stack, i },
        consoleOutput: `Compare index [${i}]: ${stack[i]} == ${target} (${match ? 'Match' : 'No Match'})`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'stack',
          indexA: i,
          indexB: i,
          result: match ? 'found' : 'not-found',
        },
      });

      if (match) break;
    }

    if (foundIndex === -1) {
      stepsToInject.push({
        step: stepsToInject.length + 1,
        lineNum: stepsToInject.length + 1,
        explanationEnglish: `Search finished: Target element ${target} not found in the stack.`,
        explanationHinglish: `Search khatam: Target element ${target} stack me nahi mila.`,
        memorySnapshot: { top: stack.length - 1, capacity, stack },
        consoleOutput: `Search: ${target} Not Found`,
        animationEvent: { type: 'NONE' },
      });
    }

    setCustomSteps(stepsToInject);
    setSearchVal('');
    setTimeout(() => {
      goToStep(baseIndex + 1);
    }, 50);
  };

  return (
    <div className="h-full flex flex-col bg-[#08090f] rounded-2xl overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-500/10 shrink-0">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          Stack Controller
        </span>
        <button
          onClick={() => {
            const initialStep: ExecutionStep = {
              step: 1,
              lineNum: 1,
              explanationEnglish: 'Stack is reset to empty.',
              explanationHinglish: 'Stack ko empty reset kar diya gaya hai.',
              memorySnapshot: { top: -1, capacity },
              consoleOutput: 'Stack Reset.',
              animationEvent: { type: 'STACK_POP', poppedValue: '', stackState: [] },
            };
            setCustomSteps([initialStep]);
            goToStep(1);
          }}
          className="text-xs text-red-400/80 hover:text-red-400 font-mono transition-colors"
        >
          Reset Stack
        </button>
      </div>

      {/* Control Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {/* Real-time Status Badges (Minimalist) */}
        <div className="flex gap-2 justify-between items-center text-[11px] font-mono text-slate-500 border-b border-indigo-500/5 pb-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${stack.length === 0 ? 'bg-purple-500' : 'bg-green-500'}`} />
            {stack.length === 0 ? 'Empty' : stack.length === capacity ? 'Full' : 'Active'}
          </span>
          <span>Size: {stack.length} / {capacity}</span>
          <span>Top: {stack.length - 1}</span>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/10 border border-red-500/20 text-red-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Action Groups */}
        <div className="flex flex-col gap-5">
          {/* PUSH Group */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Value to push..."
              value={pushVal}
              onChange={(e) => setPushVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-indigo-500/10 focus:border-indigo-500/30 text-slate-200 text-xs font-mono focus:outline-none transition-all placeholder:text-slate-700"
            />
            <button
              onClick={handlePush}
              className="px-5 py-2.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs transition-colors font-mono"
            >
              Push()
            </button>
          </div>

          {/* POP & PEEK row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePop}
              className="py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-medium text-xs transition-all font-mono"
            >
              Pop()
            </button>
            <button
              onClick={handlePeek}
              className="py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 font-medium text-xs transition-all font-mono"
            >
              Peek()
            </button>
          </div>

          <div className="w-full border-t border-indigo-500/5 my-1" />

          {/* SEARCH Group */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Value to search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-indigo-500/10 focus:border-indigo-500/30 text-slate-200 text-xs font-mono focus:outline-none transition-all placeholder:text-slate-700"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 font-bold text-xs transition-colors font-mono"
            >
              Search()
            </button>
          </div>

          {/* Utility / Getter Functions Grid */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button
              onClick={handleIsEmpty}
              className="py-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 border border-indigo-500/10 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-all"
            >
              isEmpty()
            </button>
            <button
              onClick={handleIsFull}
              className="py-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 border border-indigo-500/10 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-all"
            >
              isFull()
            </button>
            <button
              onClick={handleSize}
              className="py-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 border border-indigo-500/10 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-all"
            >
              Size()
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTraverse}
              className="py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-[10px] transition-all font-mono"
            >
              Traverse
            </button>
            <button
              onClick={handleClear}
              className="py-2 rounded-xl border border-slate-700/20 hover:bg-slate-800/20 text-slate-500 hover:text-slate-400 text-[10px] transition-all font-mono"
            >
              Clear Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
