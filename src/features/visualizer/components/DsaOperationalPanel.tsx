import React, { useState, useEffect } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { RotateCcw, AlertTriangle } from 'lucide-react';

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

    // Slice history up to current step index to handle "time travel" (overwriting future steps if user stepped back)
    const baseSteps = customSteps.slice(0, currentStepIndex);
    const nextStepNum = baseSteps.length + 1;

    const newStep: ExecutionStep = {
      step: nextStepNum,
      lineNum: nextStepNum,
      explanationEnglish: explanationEn,
      explanationHinglish: explanationHi,
      memorySnapshot: {
        top: stack.length - 1,
        capacity,
        ...memUpdate,
      },
      consoleOutput: consoleOut,
      animationEvent: event,
    };

    const updated = [...baseSteps, newStep];
    setCustomSteps(updated);

    // Give React context a moment to update totalSteps, then jump to the new step
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
      { top: newStack.length - 1 }
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
      { top: newStack.length - 1 }
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
      { top: -1 }
    );
  };

  const handleTraverse = () => {
    if (stack.length === 0) {
      setErrorMsg('Stack is empty! Nothing to traverse.');
      return;
    }

    // Generate animation steps sequentially for traversal
    let stepsToInject = [...(customSteps ?? [])];
    const baseIndex = currentStepIndex;

    // We can generate multiple steps to animate the traversal from TOP to BOTTOM
    for (let i = stack.length - 1; i >= 0; i--) {
      stepsToInject.push({
        step: stepsToInject.length + 1,
        lineNum: stepsToInject.length + 1,
        explanationEnglish: `Traversing: Inspecting stack element at index [${i}] = ${stack[i]}.`,
        explanationHinglish: `Traverse step: Index [${i}] pe inspect kiya, value = ${stack[i]} hai.`,
        memorySnapshot: { top: stack.length - 1, capacity, i },
        consoleOutput: `Element at [${i}]: ${stack[i]}`,
        animationEvent: { type: 'SET_POINTERS', pointers: { curr: i } },
      });
    }

    setCustomSteps(stepsToInject);
    setTimeout(() => {
      goToStep(baseIndex + 1); // Start the traversal playback
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

    // Animate search from Top to Bottom
    for (let i = stack.length - 1; i >= 0; i--) {
      const match = stack[i] === target;
      if (match) foundIndex = i;

      stepsToInject.push({
        step: stepsToInject.length + 1,
        lineNum: stepsToInject.length + 1,
        explanationEnglish: `Search Step: Comparing stack[${i}] (${stack[i]}) with target ${target}. ${match ? 'MATCH FOUND!' : 'No match.'}`,
        explanationHinglish: `Search Step: stack[${i}] (${stack[i]}) ko target ${target} se compare kiya. ${match ? 'MATCH MIL GAYA!' : 'Match nahi hua.'}`,
        memorySnapshot: { top: stack.length - 1, capacity, i },
        consoleOutput: `Compare index [${i}]: ${stack[i]} == ${target} (${match ? 'Match' : 'No Match'})`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'stack',
          indexA: i,
          indexB: i,
          result: match ? 'found' : 'not-found',
        },
      });

      if (match) break; // Stop search on first match
    }

    if (foundIndex === -1) {
      stepsToInject.push({
        step: stepsToInject.length + 1,
        lineNum: stepsToInject.length + 1,
        explanationEnglish: `Search finished: Target element ${target} not found in the stack.`,
        explanationHinglish: `Search khatam: Target element ${target} stack me nahi mila.`,
        memorySnapshot: { top: stack.length - 1, capacity },
        consoleOutput: `Search: ${target} Not Found`,
        animationEvent: { type: 'NONE' },
      });
    }

    setCustomSteps(stepsToInject);
    setSearchVal('');
    setTimeout(() => {
      goToStep(baseIndex + 1); // Start search playback
    }, 50);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0c14] border border-indigo-500/20 rounded-2xl overflow-hidden shadow-2xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-500/20 bg-indigo-950/20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs font-mono font-black tracking-widest text-indigo-400 uppercase">
            Operational Dashboard
          </span>
        </div>
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
          className="p-1.5 rounded-lg border border-red-500/30 bg-red-900/10 hover:bg-red-500/20 transition-all text-xs text-red-400 hover:text-white flex items-center gap-1 font-mono"
          title="Reset Stack"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Control Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* State Indicators */}
        <div className="grid grid-cols-2 gap-2 bg-black/30 p-3 rounded-xl border border-indigo-500/10 font-mono text-xs text-slate-400">
          <div>TOP Pointer: <span className="text-indigo-400 font-bold">{stack.length - 1}</span></div>
          <div>Size: <span className="text-indigo-400 font-bold">{stack.length} / {capacity}</span></div>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 text-xs animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Stack Actions */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Primary Operations</span>

          {/* PUSH Operation */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Value to push..."
              value={pushVal}
              onChange={(e) => setPushVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-indigo-500/20 focus:border-indigo-500/50 text-slate-200 text-sm font-mono focus:outline-none transition-all placeholder:text-slate-600"
            />
            <button
              onClick={handlePush}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all font-mono"
            >
              Push()
            </button>
          </div>

          {/* POP & PEEK row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePop}
              className="px-3 py-2.5 rounded-xl border border-rose-500/30 bg-rose-950/10 hover:bg-rose-500/20 text-rose-400 hover:text-white font-bold text-sm transition-all font-mono"
            >
              Pop()
            </button>
            <button
              onClick={handlePeek}
              className="px-3 py-2.5 rounded-xl border border-amber-500/30 bg-amber-950/10 hover:bg-amber-500/20 text-amber-400 hover:text-white font-bold text-sm transition-all font-mono"
            >
              Peek()
            </button>
          </div>
        </div>

        {/* Utility Methods */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Boolean Queries & Info</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleIsEmpty}
              className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-indigo-500/10 hover:border-indigo-500/20 text-slate-300 text-xs font-mono transition-all"
            >
              isEmpty()
            </button>
            <button
              onClick={handleIsFull}
              className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-indigo-500/10 hover:border-indigo-500/20 text-slate-300 text-xs font-mono transition-all"
            >
              isFull()
            </button>
            <button
              onClick={handleSize}
              className="py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-indigo-500/10 hover:border-indigo-500/20 text-slate-300 text-xs font-mono transition-all"
            >
              Size()
            </button>
          </div>
        </div>

        {/* Advanced Iteration Operations */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Search & Traversal</span>

          {/* Search Operation */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search value..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-indigo-500/20 focus:border-indigo-500/50 text-slate-200 text-sm font-mono focus:outline-none transition-all placeholder:text-slate-600"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 transition-all font-mono"
            >
              Search()
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTraverse}
              className="py-2.5 px-3 rounded-xl border border-cyan-500/30 bg-cyan-950/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-white font-bold text-xs transition-all font-mono"
            >
              Display/Traverse
            </button>
            <button
              onClick={handleClear}
              className="py-2.5 px-3 rounded-xl border border-slate-500/30 bg-slate-950/10 hover:bg-slate-800/40 text-slate-400 hover:text-white font-bold text-xs transition-all font-mono"
            >
              Clear Stack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
