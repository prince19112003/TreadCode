import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, Trash, Search, Play, RotateCcw, Trash2 } from 'lucide-react';

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

  const handleInsert = () => {
    const val = insertVal.trim();
    if (!val) return setError('Enter value to insert');
    if (list.length >= capacity) return setError(`List Full (Capacity: ${capacity})`);
    const pos = Math.max(0, Math.min(list.length, Number(insertIdx || 0)));
    const parsed = isNaN(Number(val)) ? val : Number(val);
    
    const next = [...list];
    next.splice(pos, 0, parsed);

    dispatch(next,
      `INSERT(${parsed}, pos=${pos}): Node inserted. pointers updated.`,
      `INSERT(${parsed}, pos=${pos}): Naya Node insert hua. Links change kiye.`,
      `Inserted: ${parsed} at index ${pos} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_INSERT', value: parsed, index: pos, listState: next }
    );
    setInsertVal('');
  };

  const handleDelete = () => {
    if (list.length === 0) return setError('List is empty');
    const pos = Math.max(0, Math.min(list.length - 1, Number(insertIdx || 0)));
    const deletedVal = list[pos];
    const next = [...list];
    next.splice(pos, 1);

    dispatch(next,
      `DELETE(pos=${pos}): Removed node with value "${deletedVal}".`,
      `DELETE(pos=${pos}): Index ${pos} se "${deletedVal}" node remove kiya.`,
      `Deleted: ${deletedVal} from index ${pos} | Size: ${next.length}/${capacity}`,
      { type: 'SLL_DELETE', index: pos, listState: next }
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
        explanationEnglish: `Search: traversing node [${i}] = ${list[i]}`,
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
    setTimeout(() => goToStep(1), 30);
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
    setTimeout(() => goToStep(1), 30);
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
      {/* Header */}
      <div className="px-4 py-3 bg-[#0d0f1f] border-b border-slate-800/60 flex items-center justify-between shrink-0 font-mono text-xs">
        <span className="font-bold text-slate-300">LINKED LIST CONTROLS</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Size:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-slate-900 text-emerald-400 border border-slate-700/60 rounded px-1.5 py-0.5 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {[3, 4, 5, 6, 8, 10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
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

        {/* Node Insertion Input */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Insert Node</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Val..."
              value={insertVal}
              onChange={e => setInsertVal(e.target.value)}
              className="w-1/2 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
            />
            <input
              type="number"
              placeholder="Pos..."
              value={insertIdx}
              onChange={e => setInsertIdx(e.target.value)}
              className="w-1/4 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleInsert}
              disabled={isFull}
              className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Insert
            </button>
          </div>
        </div>

        {/* Delete Node Control */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Delete Node</span>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Pos..."
              value={insertIdx}
              onChange={e => setInsertIdx(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleDelete}
              disabled={isEmpty}
              className="px-4 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 text-rose-300 font-bold text-xs font-mono flex items-center justify-center gap-1"
            >
              <Trash size={14} /> Delete
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search val..."
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
          <Play size={13} /> Traverse List
        </button>

        {/* CLEAR */}
        <button
          onClick={handleClear}
          disabled={isEmpty}
          className="w-full py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 disabled:opacity-30 text-red-400 font-mono text-[11px] flex items-center justify-center gap-1"
        >
          <Trash2 size={12} /> Clear List
        </button>
      </div>
    </div>
  );
};
