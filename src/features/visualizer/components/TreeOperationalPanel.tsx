import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, Search, RotateCcw, Trash2 } from 'lucide-react';

/** Read list array from step */
const listFromStep = (step: ExecutionStep | null): { list: (string | number)[]; capacity: number } => {
  if (!step) return { list: [], capacity: 7 };
  const mem = step.memorySnapshot as any;
  const cap = typeof mem?.capacity === 'number' ? mem.capacity : 7;
  if (Array.isArray(mem?.list)) return { list: mem.list, capacity: cap };
  if (typeof mem?.list === 'string') {
    try { return { list: JSON.parse(mem.list), capacity: cap }; } catch { return { list: [], capacity: cap }; }
  }
  const ev = step.animationEvent as any;
  if (ev?.listState) return { list: ev.listState, capacity: cap };
  return { list: [], capacity: cap };
};

export const TreeOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, currentStep, goToStep } = useLesson();

  const [capacity, setCapacity] = useState<number>(7);
  const [list, setList] = useState<(string | number)[]>([]);
  const [insertVal, setInsertVal] = useState('');
  const [deleteVal, setDeleteVal] = useState('');
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
      explanationEnglish: `BST Tree initialized (Empty). Capacity: ${capacity} nodes.`,
      explanationHinglish: `BST Tree khali initialize hua hai. Max limit: ${capacity} nodes.`,
      memorySnapshot: { capacity, list: [] },
      consoleOutput: `> BST initialized (Max nodes: ${capacity}).`,
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

  /* ── BST Operations ── */

  const handleInsert = () => {
    const val = Number(insertVal.trim());
    if (isNaN(val)) return setError('Enter a valid numeric value');
    if (list.length >= capacity) return setError(`Tree Full (Capacity: ${capacity})`);
    if (list.includes(val)) return setError('Duplicate values not allowed in BST');

    const next = [...list, val];
    dispatch(next,
      `INSERT(${val}): Node inserted in BST. Branch path auto-aligned.`,
      `INSERT(${val}): Naya tree node insert kiya. BST rules se align hua.`,
      `Inserted node: ${val} | Total nodes: ${next.length}/${capacity}`,
      { type: 'TREE_INSERT', value: val, listState: next }
    );
    setInsertVal('');
  };

  const handleDelete = () => {
    const val = Number(deleteVal.trim());
    if (isNaN(val)) return setError('Enter a valid node value to delete');
    if (!list.includes(val)) return setError(`Node ${val} not found in tree`);

    const next = list.filter(v => v !== val);
    dispatch(next,
      `DELETE(${val}): Node removed. BST reconstructed using children successor replacement rules.`,
      `DELETE(${val}): Node remove kiya. BST structure restructure ho gaya.`,
      `Deleted node: ${val} | Total nodes: ${next.length}/${capacity}`,
      { type: 'TREE_DELETE', value: val, listState: next }
    );
    setDeleteVal('');
  };

  const handleSearch = () => {
    const val = Number(searchVal.trim());
    if (isNaN(val)) return setError('Enter a valid node value to search');
    if (list.length === 0) return setError('Tree is empty');
    setSearchVal('');

    const steps: ExecutionStep[] = [];
    let found = false;

    // Fallback traversal trace if tree search logic meets bounds
    const traceSteps: number[] = [];
    let currentTrace = Number(list[0]);
    let traceLimit = 0;
    while (currentTrace !== undefined && traceLimit < 10) {
      traceSteps.push(currentTrace);
      if (val === currentTrace) {
        found = true;
        break;
      }
      // BST routing search choice
      const nextNode = val < currentTrace
        ? list.filter(v => Number(v) < currentTrace).sort((a,b) => Number(b) - Number(a))[0] // left branch guess
        : list.filter(v => Number(v) > currentTrace).sort((a,b) => Number(a) - Number(b))[0]; // right branch guess
      
      if (nextNode !== undefined) currentTrace = Number(nextNode);
      else break;
      traceLimit++;
    }

    traceSteps.forEach((nodeValue) => {
      const match = nodeValue === val;
      steps.push({
        step: steps.length + 1,
        lineNum: steps.length + 1,
        explanationEnglish: `BST Search: checking node ${nodeValue} (${val < nodeValue ? 'val < node → search left' : val > nodeValue ? 'val > node → search right' : 'found!'})`,
        explanationHinglish: `BST Search: node ${nodeValue} check kiya (${val === nodeValue ? 'Match mil gaya!' : val < nodeValue ? 'left jao' : 'right jao'})`,
        memorySnapshot: { capacity, list, activeNodeValue: nodeValue },
        consoleOutput: `> Visited: ${nodeValue} | target: ${val} ${match ? '✓ MATCH' : ''}`,
        animationEvent: {
          type: 'HIGHLIGHT_NODE',
          activeNodeValue: nodeValue,
        } as any,
      });
    });

    if (!found) {
      steps.push({
        step: steps.length + 1, lineNum: steps.length + 1,
        explanationEnglish: `Search complete: Node ${val} not found in BST.`,
        explanationHinglish: `Search complete: Node ${val} nahi mila.`,
        memorySnapshot: { capacity, list },
        consoleOutput: `> Node ${val} NOT FOUND`,
        animationEvent: { type: 'NONE' } as any,
      });
    }

    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (list.length === 0) return setError('Tree is empty');
    
    const steps: ExecutionStep[] = [];

    // Helper algorithms to traverse
    const inorderResult: number[] = [];
    const preorderResult: number[] = [];
    const postorderResult: number[] = [];

    // Construct quick visual recursive path
    const traverseBST = (nodeVal: number | undefined) => {
      if (nodeVal === undefined) return;
      
      // Preorder collect
      preorderResult.push(nodeVal);

      const leftChild = list.filter(v => Number(v) < nodeVal).sort((a,b) => Number(b) - Number(a))[0];
      if (leftChild !== undefined) traverseBST(Number(leftChild));

      // Inorder collect
      inorderResult.push(nodeVal);

      const rightChild = list.filter(v => Number(v) > nodeVal).sort((a,b) => Number(a) - Number(b))[0];
      if (rightChild !== undefined) traverseBST(Number(rightChild));

      // Postorder collect
      postorderResult.push(nodeVal);
    };

    traverseBST(Number(list[0]));

    const traversalOrder =
      type === 'inorder' ? [...list].sort((a,b) => Number(a)-Number(b)) // Inorder BST is sorted array
      : type === 'preorder' ? preorderResult
      : postorderResult;

    traversalOrder.forEach((nodeVal, index) => {
      steps.push({
        step: steps.length + 1,
        lineNum: steps.length + 1,
        explanationEnglish: `${type.toUpperCase()} Traversal: Visited Node ${nodeVal}`,
        explanationHinglish: `${type.toUpperCase()} Traversal: Node ${nodeVal} pe check kiya`,
        memorySnapshot: { capacity, list, activeNodeValue: nodeVal },
        consoleOutput: `> Traversal path [${index + 1}]: ${nodeVal}`,
        animationEvent: {
          type: 'HIGHLIGHT_NODE',
          activeNodeValue: nodeVal,
        } as any,
      });
    });

    setError(null);
    setCustomSteps(steps);
    setTimeout(() => goToStep(1), 30);
  };

  const handleClear = () => {
    dispatch([],
      `Tree cleared.`,
      `Tree khali ho gaya.`,
      `Cleared BST Tree`,
      { type: 'TREE_DELETE', listState: [] }
    );
  };

  const handleCapacityChange = (newCap: number) => {
    setCapacity(newCap);
    const trimmed = list.slice(0, newCap);
    setList(trimmed);
    setError(null);
    const step: ExecutionStep = {
      step: 1, lineNum: 1,
      explanationEnglish: `Max nodes capacity limit changed to ${newCap}.`,
      explanationHinglish: `Max limit badal kar ${newCap} set ki.`,
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
        <span className="font-bold text-slate-300">BST TREE CONTROLS</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Limit:</span>
            <select
              value={capacity}
              onChange={e => handleCapacityChange(Number(e.target.value))}
              className="bg-slate-900 text-violet-400 border border-slate-700/60 rounded px-1.5 py-0.5 text-xs font-bold focus:outline-none cursor-pointer"
            >
              {[3, 5, 7, 9, 11, 15].map(n => (
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
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Insert Node (BST placement)</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Num val..."
              value={insertVal}
              onChange={e => setInsertVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInsert()}
              className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleInsert}
              disabled={isFull}
              className="px-4 py-1.5 rounded bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-xs font-mono flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Insert
            </button>
          </div>
        </div>

        {/* Delete Node Control */}
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Delete Node (BST Restructure)</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Val..."
              value={deleteVal}
              onChange={e => setDeleteVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleDelete()}
              className="flex-1 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none"
            />
            <button
              onClick={handleDelete}
              disabled={isEmpty}
              className="px-4 py-1.5 rounded bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 disabled:opacity-40 text-rose-300 font-bold text-xs font-mono flex items-center justify-center gap-1"
            >
              <Trash2 size={14} /> Delete
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
            className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-violet-500 text-slate-200 text-xs font-mono focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isEmpty}
            className="px-4 py-2 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 disabled:opacity-40 text-violet-200 font-bold text-xs font-mono flex items-center gap-1 shrink-0"
          >
            <Search size={14} /> Search
          </button>
        </div>

        {/* Traversals list */}
        <div className="flex flex-col gap-1.5 p-2 rounded-lg border border-slate-800/40 bg-slate-950/20">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Tree Traversals</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleTraversal('inorder')}
              disabled={isEmpty}
              className="py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 text-[10px] font-bold font-mono"
            >
              Inorder
            </button>
            <button
              onClick={() => handleTraversal('preorder')}
              disabled={isEmpty}
              className="py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 text-[10px] font-bold font-mono"
            >
              Preorder
            </button>
            <button
              onClick={() => handleTraversal('postorder')}
              disabled={isEmpty}
              className="py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 text-[10px] font-bold font-mono"
            >
              Postorder
            </button>
          </div>
        </div>

        {/* CLEAR */}
        <button
          onClick={handleClear}
          disabled={isEmpty}
          className="w-full py-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 disabled:opacity-30 text-red-400 font-mono text-[11px] flex items-center justify-center gap-1"
        >
          <Trash2 size={12} /> Clear Tree
        </button>
      </div>
    </div>
  );
};
