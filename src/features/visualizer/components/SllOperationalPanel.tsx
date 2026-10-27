import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, Trash2, Search, RefreshCw } from 'lucide-react';

const listFromStep = (step: ExecutionStep | null): { list: (string | number)[]; capacity: number } => {
  if (!step) return { list: [10, 20, 30], capacity: 6 };
  const mem = step.memorySnapshot as any;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 6;
  if (Array.isArray(mem?.list)) return { list: mem.list, capacity: cap };
  if (typeof mem?.list === 'string') {
    try { return { list: JSON.parse(mem.list), capacity: cap }; } catch { return { list: [], capacity: cap }; }
  }
  const ev = step.animationEvent as any;
  if (ev?.listState) return { list: ev.listState, capacity: cap };
  return { list: [10, 20, 30], capacity: cap };
};

export const SllOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [capacity] = useState<number>(6);
  const [list, setList] = useState<(string | number)[]>([10, 20, 30]);
  const [nodeVal, setNodeVal] = useState('40');
  const [searchVal, setSearchVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { list: l } = listFromStep(currentStep);
    setList(l);
  }, [currentStep]);

  // Initial load
  useEffect(() => {
    const initialList = [10, 20, 30];
    const init: ExecutionStep = {
      step: 1,
      lineNum: 1,
      explanationEnglish: `Singly Linked List initialized: HEAD points to Node(${initialList[0]}). Total ${initialList.length} nodes chained to NULL.`,
      explanationHinglish: `Singly Linked List initialize hui: HEAD Node(${initialList[0]}) ko point karta hai. Total ${initialList.length} nodes chain me hain.`,
      memorySnapshot: { capacity: 6, list: initialList, activeIdx: -1 },
      consoleOutput: `> Linked List: ${initialList.join(' → ')} → NULL`,
      animationEvent: { type: 'NONE' } as any,
    };
    setList(initialList);
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
      step: 1,
      lineNum: 1,
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
    const val = nodeVal.trim();
    if (!val) {
      setError('Please enter a node value');
      return;
    }
    if (list.length >= capacity) {
      setError(`List is at maximum capacity (${capacity} nodes)`);
      return;
    }
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [parsed, ...list];
    dispatch(
      next,
      `INSERT HEAD(${parsed}): Created new Node(${parsed}) and linked next to previous head. HEAD pointer updated.`,
      `INSERT HEAD(${parsed}): Naya Node(${parsed}) banakar HEAD pointer ko ispar point kiya.`,
      `Insert Head: ${parsed} | List: ${next.join(' → ')} → NULL`,
      { type: 'SLL_INSERT', value: parsed, index: 0, listState: next }
    );
    setNodeVal('');
  };

  const handleInsertTail = () => {
    const val = nodeVal.trim();
    if (!val) {
      setError('Please enter a node value');
      return;
    }
    if (list.length >= capacity) {
      setError(`List is at maximum capacity (${capacity} nodes)`);
      return;
    }
    const parsed = isNaN(Number(val)) ? val : Number(val);
    const next = [...list, parsed];
    dispatch(
      next,
      `INSERT TAIL(${parsed}): Traversed to end and updated last node's next pointer to new Node(${parsed}).`,
      `INSERT TAIL(${parsed}): Last node ka next pointer naye Node(${parsed}) par link kiya.`,
      `Insert Tail: ${parsed} | List: ${next.join(' → ')} → NULL`,
      { type: 'SLL_INSERT', value: parsed, index: list.length, listState: next }
    );
    setNodeVal('');
  };

  const handleDeleteHead = () => {
    if (list.length === 0) {
      setError('List Underflow! Linked list is empty.');
      return;
    }
    const removed = list[0];
    const next = list.slice(1);
    dispatch(
      next,
      `DELETE HEAD: Unlinked Node(${removed}). HEAD pointer advanced to next node.`,
      `DELETE HEAD: Node(${removed}) delete kiya. HEAD ab agle node ko point kar raha hai.`,
      `Deleted Head: ${removed} | List: ${next.length > 0 ? next.join(' → ') + ' → NULL' : 'EMPTY'}`,
      { type: 'SLL_DELETE', deletedValue: removed, index: 0, listState: next }
    );
  };

  const handleDeleteTail = () => {
    if (list.length === 0) {
      setError('List Underflow! Linked list is empty.');
      return;
    }
    const removed = list[list.length - 1];
    const next = list.slice(0, -1);
    dispatch(
      next,
      `DELETE TAIL: Traversed to second-last node and set its next pointer to NULL. Removed Node(${removed}).`,
      `DELETE TAIL: Last Node(${removed}) ko unlink kiya. Previous node ka next = NULL set kiya.`,
      `Deleted Tail: ${removed} | List: ${next.length > 0 ? next.join(' → ') + ' → NULL' : 'EMPTY'}`,
      { type: 'SLL_DELETE', deletedValue: removed, index: list.length - 1, listState: next }
    );
  };

  const handleSearch = () => {
    const val = searchVal.trim();
    if (!val) {
      setError('Enter value to search');
      return;
    }
    if (list.length === 0) {
      setError('List is empty! Nothing to search.');
      return;
    }
    const target = isNaN(Number(val)) ? val : Number(val);
    const steps: ExecutionStep[] = [];

    let found = false;
    for (let i = 0; i < list.length; i++) {
      const match = list[i] === target;
      steps.push({
        step: i + 1,
        lineNum: 4,
        explanationEnglish: `Visiting Node at position [${i}] (Value = ${list[i]}). ${match ? `Target ${target} MATCHED!` : `Does not match target ${target}, advancing to next node.`}`,
        explanationHinglish: `Position [${i}] pe Node(${list[i]}) check kiya. ${match ? `Mil gaya!` : `Agle node par aage badhe.`}`,
        memorySnapshot: { capacity, list, activeIdx: i, isFound: match },
        consoleOutput: `> Search: inspecting Node [${i}] (${list[i]}) ${match ? '→ MATCH FOUND' : ''}`,
        animationEvent: { type: 'COMPARE_INDICES', indexA: i, result: match ? 'found' : 'not_found' } as any,
      });
      if (match) {
        found = true;
        break;
      }
    }

    if (!found) {
      steps.push({
        step: steps.length + 1,
        lineNum: 6,
        explanationEnglish: `Search finished: Reached NULL. Value ${target} not found in the linked list.`,
        explanationHinglish: `Search khatam: List ke end tak NULL mila. Value ${target} nahi mili.`,
        memorySnapshot: { capacity, list, activeIdx: -1, isFound: false },
        consoleOutput: `> Search result: ${target} not found.`,
        animationEvent: { type: 'NONE' } as any,
      });
    }

    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
    setSearchVal('');
  };

  const handleReset = () => {
    const sample = [10, 20, 30];
    dispatch(
      sample,
      `Reset list with 3 nodes: [10, 20, 30] → NULL.`,
      `Linked list ko [10, 20, 30] nodes se reset kiya.`,
      `Reset list: 10 → 20 → 30 → NULL`,
      { type: 'NONE' }
    );
  };

  const handleClear = () => {
    dispatch(
      [],
      `Linked list cleared. HEAD points to NULL.`,
      `Linked list khali kar di gayi hai (HEAD → NULL).`,
      `Cleared list: HEAD → NULL`,
      { type: 'SLL_DELETE', deletedValue: '', listState: [] }
    );
  };

  const isFull = list.length >= capacity;
  const isEmpty = list.length === 0;

  return (
    <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 rounded-none overflow-hidden font-mono text-neutral-200">
      {/* Header */}
      <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0 text-xs">
        <span className="font-bold tracking-wider text-neutral-100 text-[11px] uppercase">
          LINKED LIST CONTROLS
        </span>
        <span className="text-[10px] text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-none font-bold">
          Dynamic Nodes
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col justify-between gap-2.5 custom-scrollbar">
        {/* Node Insertion Section */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold px-0.5">
            1. Insert Node:
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              maxLength={4}
              value={nodeVal}
              onChange={e => {
                setNodeVal(e.target.value);
                setError(null);
              }}
              placeholder="Value"
              className="w-20 text-center py-1.5 rounded-none bg-[#060810] border border-neutral-700 focus:border-purple-400 text-neutral-100 text-xs font-bold focus:outline-none transition-colors"
            />
            <button
              onClick={handleInsertHead}
              disabled={isFull}
              className={`flex-1 py-1.5 px-1.5 flex items-center justify-center gap-1 text-[10.5px] font-bold rounded-none border transition-colors cursor-pointer ${
                isFull
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-emerald-950/80 border-emerald-500/70 text-emerald-200 hover:bg-emerald-900/80'
              }`}
            >
              <Plus size={11} />
              <span>Head</span>
            </button>
            <button
              onClick={handleInsertTail}
              disabled={isFull}
              className={`flex-1 py-1.5 px-1.5 flex items-center justify-center gap-1 text-[10.5px] font-bold rounded-none border transition-colors cursor-pointer ${
                isFull
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-cyan-950/80 border-cyan-500/70 text-cyan-200 hover:bg-cyan-900/80'
              }`}
            >
              <Plus size={11} />
              <span>Tail</span>
            </button>
          </div>
        </div>

        {/* Node Deletion Section */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold px-0.5">
            2. Delete Node:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleDeleteHead}
              disabled={isEmpty}
              className={`py-1.5 px-2 flex items-center justify-center gap-1 text-[10.5px] font-bold rounded-none border transition-colors cursor-pointer ${
                isEmpty
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-rose-950/80 border-rose-500/70 text-rose-200 hover:bg-rose-900/80'
              }`}
            >
              <Trash2 size={11} />
              <span>Delete Head</span>
            </button>
            <button
              onClick={handleDeleteTail}
              disabled={isEmpty}
              className={`py-1.5 px-2 flex items-center justify-center gap-1 text-[10.5px] font-bold rounded-none border transition-colors cursor-pointer ${
                isEmpty
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-amber-950/80 border-amber-500/70 text-amber-200 hover:bg-amber-900/80'
              }`}
            >
              <Trash2 size={11} />
              <span>Delete Tail</span>
            </button>
          </div>
        </div>

        {/* Search Node Section */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold px-0.5">
            3. Search Value:
          </span>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              maxLength={4}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Find..."
              className="flex-1 text-center py-1.5 rounded-none bg-[#060810] border border-neutral-700 focus:border-purple-400 text-neutral-100 text-xs font-bold focus:outline-none transition-colors"
            />
            <button
              onClick={handleSearch}
              className="py-1.5 px-3 flex items-center justify-center gap-1 text-[10.5px] font-bold rounded-none bg-purple-950/80 border border-purple-500/70 text-purple-200 hover:bg-purple-900/80 cursor-pointer transition-colors"
            >
              <Search size={11} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Quick Reset & Clear */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 text-[10px] font-bold rounded-none bg-neutral-900 border border-neutral-700 text-neutral-300 hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <RefreshCw size={11} />
            <span>Sample (3 Nodes)</span>
          </button>
          <button
            onClick={handleClear}
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 text-[10px] font-bold rounded-none bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-rose-300 hover:border-rose-700 cursor-pointer transition-colors"
          >
            <Trash2 size={11} />
            <span>Clear List</span>
          </button>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="px-2 py-1 bg-rose-950/90 border border-rose-500/60 text-rose-300 text-[10px] font-bold">
            ⚠ {error}
          </div>
        )}

        {/* Minimal Concept Guide */}
        <div className="border border-neutral-800/80 p-2 bg-[#090c15] text-[9.5px] space-y-1">
          <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">
            Node Structure:
          </div>
          <div className="text-neutral-400 space-y-0.5">
            <div>• <span className="text-emerald-400 font-bold">HEAD:</span> Pointer to first node.</div>
            <div>• <span className="text-cyan-400 font-bold">[DATA | NEXT]:</span> Value &amp; pointer to next node.</div>
            <div>• <span className="text-neutral-300 font-bold">NULL:</span> Marks end of chain (terminator).</div>
          </div>
        </div>
      </div>
    </div>
  );
};
