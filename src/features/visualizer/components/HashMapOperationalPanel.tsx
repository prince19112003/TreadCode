import React, { useState, useEffect } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Plus, Trash, Search, RotateCcw, Trash2 } from 'lucide-react';

const CAPACITY = 7;

export const HashMapOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);
  const customSteps = useLessonStore(s => s.customSteps);

  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  const [entries, setEntries] = useState<[string, string][]>([
    ['id', '101'],
    ['name', 'Alice'],
    ['age', '24']
  ]);
  const [error, setError] = useState<string | null>(null);

  const hashFunc = (key: string) => {
    let num = 0;
    for (let i = 0; i < key.length; i++) num += key.charCodeAt(i);
    return Math.abs(num) % CAPACITY;
  };

  const buildStep = (
    currentMap: [string, string][],
    activeKey: string,
    activeVal: string,
    action: 'PUT' | 'REMOVE' | 'GET' | 'INIT' | 'CLEAR',
    stepMsgEn: string,
    stepMsgHi: string
  ): ExecutionStep => {
    const bucketMap: Record<number, [string, string][]> = {};
    for (let i = 0; i < CAPACITY; i++) bucketMap[i] = [];

    currentMap.forEach(([k, v]) => {
      const idx = hashFunc(k);
      const existingIdx = bucketMap[idx].findIndex(([ek]) => ek === k);
      if (existingIdx >= 0) {
        bucketMap[idx][existingIdx] = [k, v];
      } else {
        bucketMap[idx].push([k, v]);
      }
    });

    const targetIdx = activeKey ? hashFunc(activeKey) : -1;

    return {
      step: 1,
      lineNum: 1,
      explanationEnglish: stepMsgEn,
      explanationHinglish: stepMsgHi,
      memorySnapshot: {
        capacity: CAPACITY,
        entries: [...currentMap],
        bucketMap,
        activeKey,
        activeVal,
        targetIdx,
        action,
      },
      consoleOutput: `> [HashMap] ${action}: key="${activeKey}" ${activeVal ? `value="${activeVal}"` : ''} (Size: ${currentMap.length})`,
      animationEvent: {
        type: action === 'GET' ? 'COMPARE_INDICES' : 'HIGHLIGHT_ARRAY_INDEX',
        index: targetIdx,
        value: activeKey,
      } as any,
    };
  };

  const handlePut = () => {
    const k = keyInput.trim();
    const v = valInput.trim();
    if (!k || !v) return setError('Enter both Key and Value');

    setError(null);
    const existingIdx = entries.findIndex(([ek]) => ek === k);
    let next: [string, string][];
    let isUpdate = false;

    if (existingIdx >= 0) {
      next = [...entries];
      next[existingIdx] = [k, v];
      isUpdate = true;
    } else {
      next = [...entries, [k, v]];
    }

    setEntries(next);
    setKeyInput('');
    setValInput('');

    const targetBucket = hashFunc(k);
    const step = buildStep(
      next,
      k,
      v,
      'PUT',
      `PUT("${k}": "${v}"): Hash h("${k}") = ${targetBucket}. ${isUpdate ? 'Key updated!' : 'New key-value pair inserted!'}`,
      `PUT("${k}": "${v}"): Hash Bucket [${targetBucket}] me ${isUpdate ? 'update' : 'insert'} ho gaya.`
    );

    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  const handleRemove = () => {
    const k = keyInput.trim();
    if (!k) return setError('Enter Key to remove');
    const existing = entries.find(([ek]) => ek === k);
    if (!existing) return setError(`Key '${k}' not found in HashMap!`);

    setError(null);
    const next = entries.filter(([ek]) => ek !== k);
    setEntries(next);
    setKeyInput('');

    const targetBucket = hashFunc(k);
    const step = buildStep(
      next,
      k,
      existing[1],
      'REMOVE',
      `REMOVE("${k}"): Located in Bucket [${targetBucket}]. Deleted key-value pair.`,
      `REMOVE("${k}"): Bucket [${targetBucket}] se key-value pair remove kar diya.`
    );

    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  const handleGet = () => {
    const k = keyInput.trim();
    if (!k) return setError('Enter Key to lookup');

    setError(null);
    const existing = entries.find(([ek]) => ek === k);
    const targetBucket = hashFunc(k);

    const step = buildStep(
      entries,
      k,
      existing ? existing[1] : '',
      'GET',
      `GET("${k}"): Computed Hash h("${k}") = ${targetBucket}. Result = ${existing ? `"${existing[1]}"` : 'null (Not Found)'}`,
      `GET("${k}"): Bucket [${targetBucket}] check kiya. Result = ${existing ? `"${existing[1]}"` : 'null'}`
    );

    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  const handleClear = () => {
    setError(null);
    setEntries([]);
    setKeyInput('');
    setValInput('');
    const step = buildStep([], '', '', 'CLEAR', 'HashMap cleared. All key-value pairs removed.', 'HashMap khali kar di.');
    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  };

  useEffect(() => {
    const initial: [string, string][] = [
      ['id', '101'],
      ['name', 'Alice'],
      ['age', '24']
    ];
    setEntries(initial);
    setKeyInput('');
    setValInput('');
    const step = buildStep(initial, '', '', 'INIT', 'HashMap Initialized with 7 Hash Buckets.', 'HashMap 7 Buckets ke saath initialize hui.');
    setCustomSteps([step]);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, customSteps === null]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      <div className="px-3.5 py-2.5 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            HASHMAP CONTROLS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>Buckets: <strong className="text-indigo-400 font-mono">7</strong></span>
          <span>Pairs: <strong className="text-indigo-400 font-mono">{entries.length}</strong></span>
          <button onClick={handleClear} title="Clear HashMap" className="p-1 hover:text-white transition-colors">
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
            Key-Value Map Operation
          </span>

          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="text"
              placeholder="Key (e.g. name)"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-400 text-slate-100 text-xs font-mono font-bold focus:outline-none"
            />
            <input
              type="text"
              placeholder="Value (e.g. Alice)"
              value={valInput}
              onChange={e => setValInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePut()}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-400 text-slate-100 text-xs font-mono font-bold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handlePut}
              disabled={!keyInput.trim() || !valInput.trim()}
              className="py-2 px-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/60 text-indigo-300 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              <Plus size={13} /> put(k,v)
            </button>
            <button
              onClick={handleRemove}
              disabled={!keyInput.trim()}
              className="py-2 px-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-300 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              <Trash size={13} /> remove(k)
            </button>
            <button
              onClick={handleGet}
              disabled={!keyInput.trim()}
              className="py-2 px-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              <Search size={13} /> get(k)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
          <button
            onClick={handleClear}
            disabled={entries.length === 0}
            className="w-full py-1.5 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 disabled:opacity-30 text-rose-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <Trash2 size={12} /> Clear HashMap
          </button>
        </div>
      </div>
    </div>
  );
};
