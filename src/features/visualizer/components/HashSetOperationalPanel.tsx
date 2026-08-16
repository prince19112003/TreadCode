import React, { useState, useEffect } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, Trash, Search, RotateCcw, Trash2 } from 'lucide-react';

const CAPACITY = 7;

export const HashSetOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);
  const customSteps = useLessonStore(s => s.customSteps);

  const [inputVal, setInputVal] = useState('');
  const [elements, setElements] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hash function: simple modulo by capacity
  const hashFunc = (key: string) => {
    let num = parseInt(key, 10);
    if (isNaN(num)) {
      num = 0;
      for (let i = 0; i < key.length; i++) num += key.charCodeAt(i);
    }
    return Math.abs(num) % CAPACITY;
  };

  const buildStep = (
    currentList: string[],
    activeVal: string,
    action: 'ADD' | 'REMOVE' | 'CONTAINS' | 'INIT' | 'CLEAR',
    stepMsgEn: string,
    stepMsgHi: string
  ): ExecutionStep => {
    const bucketMap: Record<number, string[]> = {};
    for (let i = 0; i < CAPACITY; i++) bucketMap[i] = [];

    currentList.forEach(item => {
      const idx = hashFunc(item);
      if (!bucketMap[idx].includes(item)) {
        bucketMap[idx].push(item);
      }
    });

    const targetIdx = activeVal ? hashFunc(activeVal) : -1;

    return {
      step: 1,
      lineNum: 1,
      explanationEnglish: stepMsgEn,
      explanationHinglish: stepMsgHi,
      memorySnapshot: {
        capacity: CAPACITY,
        elements: [...currentList],
        bucketMap,
        activeVal,
        targetIdx,
        action,
      },
      consoleOutput: `> [HashSet] ${action}: ${activeVal || 'State updated'} (Size: ${currentList.length})`,
      animationEvent: {
        type: action === 'CONTAINS' ? 'COMPARE_INDICES' : 'HIGHLIGHT_ARRAY_INDEX',
        index: targetIdx,
        value: activeVal,
      } as any,
    };
  };

  const handleAdd = () => {
    const val = inputVal.trim();
    if (!val) return setError('Enter a value to add');
    if (elements.includes(val)) return setError(`Duplicate value '${val}' ignored. HashSet only keeps unique elements!`);
    if (elements.length >= CAPACITY * 2) return setError('HashSet is full');

    setError(null);
    const next = [...elements, val];
    setElements(next);
    setInputVal('');

    const targetBucket = hashFunc(val);
    const step = buildStep(
      next,
      val,
      'ADD',
      `ADD("${val}"): Hash h("${val}") = ${val} % ${CAPACITY} = Bucket [${targetBucket}]. Inserted uniquely!`,
      `ADD("${val}"): Hash value ${val} % ${CAPACITY} = Bucket [${targetBucket}]. Unique element insert ho gaya.`
    );

    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  const handleRemove = () => {
    const val = inputVal.trim();
    if (!val) return setError('Enter a value to remove');
    if (!elements.includes(val)) return setError(`Value '${val}' not found in HashSet!`);

    setError(null);
    const next = elements.filter(e => e !== val);
    setElements(next);
    setInputVal('');

    const targetBucket = hashFunc(val);
    const step = buildStep(
      next,
      val,
      'REMOVE',
      `REMOVE("${val}"): Located in Bucket [${targetBucket}] via Hash h("${val}"). Element deleted.`,
      `REMOVE("${val}"): Bucket [${targetBucket}] se element remove kar diya.`
    );

    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  const handleContains = () => {
    const val = inputVal.trim();
    if (!val) return setError('Enter a value to check');

    setError(null);
    const exists = elements.includes(val);
    const targetBucket = hashFunc(val);

    const step = buildStep(
      elements,
      val,
      'CONTAINS',
      `CONTAINS("${val}"): Computed Hash h("${val}") = ${targetBucket}. Result = ${exists ? 'TRUE (Found!)' : 'FALSE (Not Found)'}`,
      `CONTAINS("${val}"): Hash Bucket [${targetBucket}] check kiya. Result = ${exists ? 'TRUE (Mila)' : 'FALSE (Nahi mila)'}`
    );

    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  const handleClear = () => {
    setError(null);
    setElements([]);
    setInputVal('');
    const step = buildStep([], '', 'CLEAR', 'HashSet cleared. All elements removed.', 'HashSet khali kar di.');
    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  useEffect(() => {
    const initial: string[] = [];
    setElements(initial);
    setInputVal('');
    const step = buildStep(initial, '', 'INIT', 'HashSet initialized (Empty). Capacity: 7 Buckets.', 'HashSet initialize hui (Khali). Capacity: 7 Buckets.');
    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, customSteps === null]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      <div className="px-3.5 py-2.5 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            HASHSET CONTROLS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>Buckets: <strong className="text-emerald-400 font-mono">7</strong></span>
          <span>Size: <strong className="text-emerald-400 font-mono">{elements.length}</strong></span>
          <button onClick={handleClear} title="Clear HashSet" className="p-1 hover:text-white transition-colors">
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-between gap-3">
        {error && (
          <div className="px-3 py-1.5 rounded bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center justify-between">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-xs font-bold px-1">✕</button>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold px-0.5">
            Key Input Operation
          </span>

          <input
            type="text"
            placeholder="Enter Element Key..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-400 text-slate-100 text-xs font-mono font-bold focus:outline-none"
          />

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleAdd}
              disabled={!inputVal.trim()}
              className="py-2 px-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              <Plus size={13} /> add()
            </button>
            <button
              onClick={handleRemove}
              disabled={!inputVal.trim()}
              className="py-2 px-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-300 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              <Trash size={13} /> remove()
            </button>
            <button
              onClick={handleContains}
              disabled={!inputVal.trim()}
              className="py-2 px-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              <Search size={13} /> contains()
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
          <button
            onClick={handleClear}
            disabled={elements.length === 0}
            className="w-full py-1.5 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 disabled:opacity-30 text-rose-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <Trash2 size={12} /> Clear HashSet
          </button>
        </div>
      </div>
    </div>
  );
};
