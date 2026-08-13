import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, Trash, Search, Play, RotateCcw, Trash2, ArrowRightLeft } from 'lucide-react';

/** Read list array from step */
const listFromStep = (step: ExecutionStep | null): { list: (string | number)[]; capacity: number } => {
  if (!step) return { list: [], capacity: 6 };
  const mem = step.memorySnapshot as any;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 6;
  if (Array.isArray(mem?.list)) return { list: mem.list, capacity: cap };
  if (typeof mem?.list === 'string') {
    try { return { list: JSON.parse(mem.list), capacity: cap }; } catch { return { list: [], capacity: cap }; }
  }
  const ev = step.animationEvent as any;
  if (ev?.listState) return { list: ev.listState, capacity: cap };
  return { list: [], capacity: cap };
};

export const SllOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [capacity, setCapacity] = useState<number>(6);
  const [list, setList] = useState<(string | number)[]>([]);
  const [insertVal, setInsertVal] = useState('');
  const [insertIdx, setInsertIdx] = useState('0');
  const [searchVal, setSearchVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { list: l, capacity: c } = listFromStep(currentStep);
    setList(l);
    if (c) setCapacity(c);
  }, [currentStep]);

  useEffect(() => {
    const init: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Linked List initialized (Empty). Capacity: ${capacity}.`,
      explanationHinglish: `Linked List khali initialize hui hai. Capacity: ${capacity}.`,
      memorySnapshot: { capacity, list: [] },
      consoleOutput: `> Singly Linked List initialized (Capacity: ${capacity}).`,
      animationEvent: { type: 'NONE' } as any,
    };
    setList([]);
    setCustomSteps([init]);
    setTimeout(() => goToStep(1), 30);
  }, [lesson?.id]);

  const dispatch = useCallback((
    newList: (string | number)[],
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
      memorySnapshot: { capacity, list: newList, ...extraMem },
      consoleOutput: `> ${consoleOut}`,
      animationEvent: event,
    };
    setList(newList);
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  }, [setCustomSteps, goToStep, capacity]);

  /* ── Linked List Operations ── */

  const handleInsertHead = () => {
    const val = insertVal.trim();
    if (!val) return setError('Enter value to insert');
    if (list.length >= capacity) return setError(`List Full (Capacity: ${capacity})`);
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [parsed, ...list];
    dispatch(next,
      `INSERT HEAD(${parsed}): Node inserted at position 0. HEAD updated.`,
      `INSERT HEAD(${parsed}): Position 0 pe naya Node insert hua.`,
      `Inserted Head: ${parsed} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_INSERT', value: parsed, index: 0, listState: next }
    );
    setInsertVal('');
  };

  const handleInsertTail = () => {
    const val = insertVal.trim();
    if (!val) return setError('Enter value to insert');
    if (list.length >= capacity) return setError(`List Full (Capacity: ${capacity})`);
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...list, parsed];
    dispatch(next,
      `INSERT TAIL(${parsed}): Node inserted at end (pos=${list.length}).`,
      `INSERT TAIL(${parsed}): End pe naya Node insert hua.`,
      `Inserted Tail: ${parsed} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_INSERT', value: parsed, index: list.length, listState: next }
    );
    setInsertVal('');
  };

  const handleInsertAtPos = () => {
    const val = insertVal.trim();
    if (!val) return setError('Enter value to insert');
    if (list.length >= capacity) return setError(`List Full (Capacity: ${capacity})`);
    const pos = Math.max(0, Math.min(list.length, Number(insertIdx || 0)));
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...list];
    next.splice(pos, 0, parsed);
    dispatch(next,
      `INSERT(${parsed}, pos=${pos}): Node inserted. Next pointers updated.`,
      `INSERT(${parsed}, pos=${pos}): Index ${pos} pe naya Node insert hua.`,
      `Inserted: ${parsed} at index ${pos} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_INSERT', value: parsed, index: pos, listState: next }
    );
    setInsertVal('');
  };

  const handleDeleteHead = () => {
    if (list.length === 0) return setError('List is empty');
    const deletedVal = list[0];
    const next = list.slice(1);
    dispatch(next,
      `DELETE HEAD(): Removed node "${deletedVal}" from pos 0. HEAD updated.`,
      `DELETE HEAD(): Pos 0 se "${deletedVal}" node remove hua.`,
      `Deleted Head: ${deletedVal} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_DELETE', index: 0, listState: next }
    );
  };

  const handleDeleteTail = () => {
    if (list.length === 0) return setError('List is empty');
    const deletedVal = list[list.length - 1];
    const next = list.slice(0, -1);
    dispatch(next,
      `DELETE TAIL(): Removed node "${deletedVal}" from end (pos ${list.length - 1}).`,
      `DELETE TAIL(): End se "${deletedVal}" node remove hua.`,
      `Deleted Tail: ${deletedVal} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_DELETE', index: list.length - 1, listState: next }
    );
  };

  const handleDeleteAtPos = () => {
    if (list.length === 0) return setError('List is empty');
    const pos = Math.max(0, Math.min(list.length - 1, Number(insertIdx || 0)));
    const deletedVal = list[pos];
    const next = [...list];
    next.splice(pos, 1);
    dispatch(next,
      `DELETE(pos=${pos}): Removed node "${deletedVal}".`,
      `DELETE(pos=${pos}): Index ${pos} se "${deletedVal}" node remove kiya.`,
      `Deleted: ${deletedVal} from index ${pos} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_DELETE', index: pos, listState: next }
    );
  };

  const handleReverse = () => {
    if (list.length <= 1) return setError('Need at least 2 nodes to reverse');
    const reversed = [...list].reverse();
    dispatch(reversed,
      `REVERSE(): Singly Linked List pointers reversed in-place.`,
      `REVERSE(): Singly Linked List pointers reverse ho gaye.`,
      `Reversed SLL: [${reversed.join(' → ')}]`,
      { type: 'SLL_REVERSE', listState: reversed }
    );
  };

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) return setError('Enter search value');
    if (list.length === 0) return setError('List is empty');
    const target = isNaN(Number(val)) ? val : Number(val);
    setSearchVal('');

    const steps: ExecutionStep[] = [];
    let found = false;
    for (let i = 0; i < list.length; i++) {
      const match = list[i] === target;
      if (match) found = true;
      steps.push({
        step: steps.length + 1,
        lineNum: steps.length + 1,
        explanationEnglish: `Search: checking node [${i}] = ${list[i]}`,
        explanationHinglish: `Search: node [${i}] = ${list[i]} check kiya`,
        memorySnapshot: { capacity, list, i },
        consoleOutput: `> Node [${i}]: ${list[i]} ${match ? '✓ MATCH' : ''}`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'list',
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
        memorySnapshot: { capacity, list },
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
    if (list.length === 0) return setError('List is empty');
    const steps: ExecutionStep[] = [];
    for (let i = 0; i < list.length; i++) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Traverse: visiting node [${i}] = ${list[i]} -> next`,
        explanationHinglish: `Traverse: node [${i}] = ${list[i]} pe visit kiya`,
        memorySnapshot: { capacity, list, i },
        consoleOutput: `> Visiting Node [${i}]: ${list[i]}`,
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
    const empty = list.length === 0;
    dispatch(list,
      `isEmpty() = ${empty}`,
      `isEmpty() = ${empty}`,
      `isEmpty() = ${empty}`,
      { type: 'NONE' } as any
    );
  };

  const handleSize = () => {
    dispatch(list,
      `Size() = ${list.length}/${capacity}`,
      `Size() = ${list.length}/${capacity}`,
      `Size = ${list.length}/${capacity}`,
      { type: 'NONE' } as any
    );
  };

  const handleClear = () => {
    dispatch([],
      `List cleared.`,
      `List khali ho gayi.`,
      `Cleared List`,
      { type: 'SLL_DELETE', listState: [] }
    );
  };

  const handleCapacityChange = (newCap: number) => {
    setCapacity(newCap);
    const trimmed = list.slice(0, newCap);
    setList(trimmed);
    setError(null);
    const step: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Capacity changed to ${newCap}.`,
      explanationHinglish: `Capacity badal kar ${newCap} set ki.`,
      memorySnapshot: { capacity: newCap, list: trimmed },
      consoleOutput: `> Capacity = ${newCap}`,
      animationEvent: { type: 'NONE' } as any,
    };
    setCustomSteps([step]);
    setTimeout(() => goToStep(1), 30);
  };

  const isEmpty = list.length === 0;
  const isFull = list.length >= capacity;

  return (
    <div className="h-full flex flex-col bg-[#0a0c16] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Sleek Minimal Header - Matching Stack & Queue Control Panels */}
      <div className="px-3.5 py-2.5 bg-[#070913] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-200 text-[11px]">SLL CONTROLS</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-md px-2 py-0.5">
            <span className="text-slate-400">Cap:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs"
            >
              {[3, 4, 5, 6, 8, 10].map(n => (
                <option key={n} value={n} className="bg-slate-900 text-slate-200">{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-md px-2 py-0.5">
            <span className="text-slate-400">HEAD:</span>
            <strong className="text-emerald-400 font-mono">{isEmpty ? 'NULL' : 0}</strong>
          </div>
          <button
            onClick={() => handleCapacityChange(capacity)}
            className="text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800/60 transition-colors"
            title="Reset List"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Dashboard Body - Evenly Distributed Layout */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-between gap-2">

        {/* Error Alert */}
        {error && (
          <div className="px-3 py-1.5 rounded bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center justify-between shadow-md">
            <span className="font-medium">⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-rose-300 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-none bg-rose-900/60">✕</button>
          </div>
        )}

        {/* Main Controls Stack */}
        <div className="flex flex-col gap-2">
          
          {/* Quick Insert Head / Tail Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleInsertHead}
              disabled={isFull || !insertVal.trim()}
              className="py-1.5 px-2 rounded font-mono font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 disabled:opacity-40"
            >
              <Plus size={13} /> Insert Head
            </button>
            <button
              onClick={handleInsertTail}
              disabled={isFull || !insertVal.trim()}
              className="py-1.5 px-2 rounded font-mono font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 bg-teal-950/70 hover:bg-teal-900 border border-teal-500/60 text-teal-300 disabled:opacity-40"
            >
              <Plus size={13} /> Insert Tail
            </button>
          </div>

          {/* Row 1: Insert Input & Position Action */}
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Value..."
              value={insertVal}
              onChange={e => setInsertVal(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 focus:border-emerald-400 text-slate-100 text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <input
              type="number"
              placeholder="Pos"
              value={insertIdx}
              onChange={e => setInsertIdx(e.target.value)}
              className="w-12 px-1.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-center text-slate-100 text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleInsertAtPos}
              disabled={isFull || !insertVal.trim()}
              className="px-3 py-1.5 rounded font-mono font-bold text-xs flex items-center gap-1 shadow-md transition-all shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 disabled:opacity-40 active:scale-95"
            >
              <Plus size={13} /> At Pos
            </button>
          </div>

          {/* Row 2: Delete Head | Delete Tail | Delete Pos Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleDeleteHead}
              disabled={isEmpty}
              className="py-1.5 px-1 rounded font-mono font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-all bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-300 disabled:opacity-40 active:scale-95"
            >
              <Trash size={11} /> Del Head
            </button>
            <button
              onClick={handleDeleteTail}
              disabled={isEmpty}
              className="py-1.5 px-1 rounded font-mono font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-all bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-300 disabled:opacity-40 active:scale-95"
            >
              <Trash size={11} /> Del Tail
            </button>
            <button
              onClick={handleDeleteAtPos}
              disabled={isEmpty}
              className="py-1.5 px-1 rounded font-mono font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-all bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-300 disabled:opacity-40 active:scale-95"
            >
              <Trash size={11} /> Del Pos
            </button>
          </div>

          {/* Row 3: Search Input & Action */}
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 focus:border-purple-400 text-slate-100 text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={handleSearch}
              disabled={isEmpty}
              className="px-3 py-1.5 rounded font-mono font-bold text-xs flex items-center gap-1 shrink-0 bg-purple-950/70 hover:bg-purple-900 border border-purple-500/60 text-purple-200 disabled:opacity-40 active:scale-95 shadow-md"
            >
              <Search size={13} /> Search
            </button>
          </div>

          {/* Row 4: Reverse & Traverse Actions */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleReverse}
              disabled={list.length <= 1}
              className="py-1.5 rounded bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/60 disabled:opacity-40 text-indigo-300 font-bold text-xs font-mono flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <ArrowRightLeft size={12} /> Reverse SLL
            </button>
            <button
              onClick={handleTraverse}
              disabled={isEmpty}
              className="py-1.5 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/60 disabled:opacity-40 text-cyan-300 font-bold text-xs font-mono flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Play size={12} /> Traverse
            </button>
          </div>

        </div>

        {/* Bottom Utility Stack */}
        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/80">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleIsEmpty}
              className="py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px] font-bold shadow-sm"
            >
              isEmpty()
            </button>
            <button
              onClick={handleSize}
              className="py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[10px] font-bold shadow-sm"
            >
              Size()
            </button>
          </div>

          <button
            onClick={handleClear}
            disabled={isEmpty}
            className="w-full py-1.5 rounded bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 disabled:opacity-30 text-rose-300 font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95"
          >
            <Trash2 size={12} /> Clear List
          </button>
        </div>

      </div>
    </div>
  );
};
