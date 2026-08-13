import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLessonStore } from '../../../../lessons/useLessonStore';
import type { AnimationEvent } from '../../../../lessons/types';

/* ─── Color Palette ──────────────────────────────────────────────────────── */
const POINTER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  i:     { bg: 'rgba(99,102,241,0.18)',  border: '#6366f1', text: '#a5b4fc' },
  j:     { bg: 'rgba(236,72,153,0.18)',  border: '#ec4899', text: '#f9a8d4' },
  left:  { bg: 'rgba(34,197,94,0.18)',   border: '#22c55e', text: '#86efac' },
  right: { bg: 'rgba(239,68,68,0.18)',   border: '#ef4444', text: '#fca5a5' },
  mid:   { bg: 'rgba(245,158,11,0.18)',  border: '#f59e0b', text: '#fcd34d' },
  low:   { bg: 'rgba(34,197,94,0.18)',   border: '#22c55e', text: '#86efac' },
  high:  { bg: 'rgba(239,68,68,0.18)',   border: '#ef4444', text: '#fca5a5' },
  top:   { bg: 'rgba(168,85,247,0.18)',  border: '#a855f7', text: '#d8b4fe' },
  front: { bg: 'rgba(6,182,212,0.18)',   border: '#06b6d4', text: '#67e8f9' },
  rear:  { bg: 'rgba(249,115,22,0.18)',  border: '#f97316', text: '#fdba74' },
  curr:  { bg: 'rgba(99,102,241,0.18)',  border: '#6366f1', text: '#a5b4fc' },
  prev:  { bg: 'rgba(107,114,128,0.18)', border: '#6b7280', text: '#d1d5db' },
  next:  { bg: 'rgba(236,72,153,0.18)',  border: '#ec4899', text: '#f9a8d4' },
  root:  { bg: 'rgba(245,158,11,0.18)',  border: '#f59e0b', text: '#fcd34d' },
};
const defaultPointerColor = { bg: 'rgba(99,102,241,0.18)', border: '#6366f1', text: '#a5b4fc' };
function getPointerColor(name: string) {
  return POINTER_COLORS[name.toLowerCase()] ?? defaultPointerColor;
}

/* ─── Array Box ─────────────────────────────────────────────────────────── */
interface ArrayBoxProps {
  value: string | number;
  index: number;
  isHighlighted: boolean;
  isCompareA: boolean;
  isCompareB: boolean;
  pointersAbove: string[];
  isSwapping: boolean;
}

const ArrayBox: React.FC<ArrayBoxProps> = ({
  value, index, isHighlighted, isCompareA, isCompareB, pointersAbove, isSwapping,
}) => {
  let boxBg = 'rgba(22,27,45,0.9)';
  let boxBorder = 'rgba(255,255,255,0.08)';
  let boxGlow = 'none';
  let textColor = '#e2e8f0';

  if (isSwapping) {
    boxBg = 'rgba(245,158,11,0.15)'; boxBorder = '#f59e0b';
    boxGlow = '0 0 16px rgba(245,158,11,0.3)'; textColor = '#fcd34d';
  } else if (isCompareA) {
    boxBg = 'rgba(99,102,241,0.15)'; boxBorder = '#6366f1';
    boxGlow = '0 0 14px rgba(99,102,241,0.3)'; textColor = '#a5b4fc';
  } else if (isCompareB) {
    boxBg = 'rgba(236,72,153,0.15)'; boxBorder = '#ec4899';
    boxGlow = '0 0 14px rgba(236,72,153,0.3)'; textColor = '#f9a8d4';
  } else if (isHighlighted) {
    boxBg = 'rgba(99,102,241,0.12)'; boxBorder = '#6366f1';
    boxGlow = '0 0 12px rgba(99,102,241,0.25)'; textColor = '#a5b4fc';
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-0.5 min-h-5.5 items-end">
        {pointersAbove.map(ptr => {
          const c = getPointerColor(ptr);
          return (
            <motion.span key={ptr} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
              {ptr}
            </motion.span>
          );
        })}
      </div>
      <motion.div layout animate={{ scale: isSwapping ? [1, 1.12, 1] : 1 }} transition={{ duration: 0.35 }}
        className="flex items-center justify-center rounded-xl font-black text-lg select-none"
        style={{
          width: 52, height: 52,
          background: boxBg, border: `2px solid ${boxBorder}`,
          boxShadow: boxGlow, color: textColor,
          fontFamily: "'JetBrains Mono', monospace",
          transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
        }}>
        {value}
      </motion.div>
      <span className="text-[11px] font-mono" style={{ color: '#4b5563' }}>[{index}]</span>
    </div>
  );
};

/* ─── Stack Visualization ───────────────────────────────────────────────── */
const StackViz: React.FC<{
  stackState: (string | number)[];
  lastAction?: 'push' | 'pop';
  lastValue?: string | number;
  pointers?: Record<string, number | null>;
  compareA?: number;
  compareB?: number;
}> = ({ stackState, lastAction, lastValue, pointers = {}, compareA = -1, compareB = -1 }) => {
  const capacity = 6;
  const slots = Array.from({ length: capacity }, (_, i) => capacity - 1 - i); // [5, 4, 3, 2, 1, 0]

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ color: '#a855f7', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
        Stack (LIFO)
      </div>
      <div className="relative flex flex-col gap-1.5 p-3 rounded-2xl border-2 border-dashed border-purple-500/20 bg-purple-950/5 w-full">
        {slots.map((idx) => {
          const hasValue = idx < stackState.length;
          const val = hasValue ? stackState[idx] : null;
          const isTop = idx === stackState.length - 1 && hasValue;

          const activePointers = Object.entries(pointers)
            .filter(([, pIdx]) => pIdx === idx)
            .map(([name]) => name);

          let borderStyle = '1px solid rgba(255,255,255,0.06)';
          let bgStyle = 'rgba(22,27,45,0.4)';
          let textStyle = 'text-slate-500';
          let shadow = 'none';

          if (isTop) {
            borderStyle = '2px solid #a855f7';
            bgStyle = 'rgba(168,85,247,0.15)';
            textStyle = 'text-purple-300 font-black';
            shadow = '0 0 10px rgba(168,85,247,0.2)';
          } else if (hasValue) {
            borderStyle = '1px solid rgba(168,85,247,0.4)';
            bgStyle = 'rgba(22,27,45,0.8)';
            textStyle = 'text-slate-200 font-bold';
          }

          if (compareA === idx || compareB === idx) {
            borderStyle = '2px solid #3b82f6';
            bgStyle = 'rgba(59,130,246,0.2)';
            shadow = '0 0 12px rgba(59,130,246,0.3)';
          }

          return (
            <div key={idx} className="flex items-center justify-between gap-3 w-full px-2">
              <span className="w-8 text-right font-mono text-xs text-slate-500">[{idx}]</span>
              <motion.div
                layout
                className={`flex-1 h-12 flex items-center justify-center rounded-xl font-mono text-sm transition-all duration-300 ${textStyle}`}
                style={{ border: borderStyle, background: bgStyle, boxShadow: shadow }}
              >
                <AnimatePresence mode="wait">
                  {hasValue ? (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {val}
                    </motion.span>
                  ) : (
                    <span className="text-[10px] tracking-wider text-slate-700 uppercase font-sans select-none">Empty</span>
                  )}
                </AnimatePresence>
              </motion.div>
              <div className="w-16 flex gap-1 items-center">
                {activePointers.map((ptr) => {
                  const c = getPointerColor(ptr);
                  return (
                    <motion.span
                      key={ptr}
                      initial={{ scale: 0.8, opacity: 0, x: -5 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border"
                      style={{ background: c.bg, borderColor: c.border, color: c.text }}
                    >
                      {ptr === 'top' ? 'TOP' : ptr.toUpperCase()}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {lastAction && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-bold px-3 py-1 rounded-lg"
          style={{
            color: lastAction === 'push' ? '#86efac' : '#fca5a5',
            background: lastAction === 'push' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${lastAction === 'push' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
          {lastAction === 'push' ? `⬆ PUSH(${lastValue})` : `⬇ POP → ${lastValue}`}
        </motion.div>
      )}
    </div>
  );
};

/* ─── Queue Visualization ───────────────────────────────────────────────── */
const QueueViz: React.FC<{
  queueState: (string | number)[];
  lastAction?: 'enqueue' | 'dequeue';
  lastValue?: string | number;
}> = ({ queueState, lastAction, lastValue }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
      style={{ color: '#06b6d4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
      Queue (FIFO)
    </div>
    <div className="flex items-center gap-1">
      <div className="text-xs font-bold" style={{ writingMode: 'vertical-rl', color: '#06b6d4', transform: 'rotate(180deg)' }}>FRONT ←</div>
      <div className="flex items-center gap-1.5 px-2 py-2 rounded-xl"
        style={{ border: '2px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.04)' }}>
        <AnimatePresence>
          {queueState.length === 0 ? (
            <div className="text-xs font-mono px-4" style={{ color: '#4b5563' }}>Empty</div>
          ) : (
            queueState.map((val, idx) => {
              const isFront = idx === 0;
              const isRear = idx === queueState.length - 1;
              return (
                <motion.div key={`q-${idx}-${val}`}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }} transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-0.5">
                  <div className="flex items-center justify-center rounded-lg font-black text-base"
                    style={{
                      width: 48, height: 44,
                      background: isFront ? 'rgba(6,182,212,0.22)' : isRear ? 'rgba(249,115,22,0.18)' : 'rgba(22,27,45,0.9)',
                      border: `2px solid ${isFront ? '#06b6d4' : isRear ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                      color: isFront ? '#67e8f9' : isRear ? '#fdba74' : '#94a3b8',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                    {val}
                  </div>
                  <span className="text-[9px] font-bold uppercase"
                    style={{ color: isFront ? '#06b6d4' : isRear ? '#f97316' : 'transparent' }}>
                    {isFront ? 'front' : isRear ? 'rear' : '.'}
                  </span>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      <div className="text-xs font-bold" style={{ writingMode: 'vertical-rl', color: '#f97316', transform: 'rotate(180deg)' }}>→ REAR</div>
    </div>
    {lastAction && (
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="text-xs font-bold px-2 py-1 rounded-lg"
        style={{
          color: lastAction === 'enqueue' ? '#86efac' : '#fca5a5',
          background: lastAction === 'enqueue' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${lastAction === 'enqueue' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
        {lastAction === 'enqueue' ? `↩ ENQUEUE(${lastValue})` : `↪ DEQUEUE → ${lastValue}`}
      </motion.div>
    )}
  </div>
);

/* ─── Linked List Visualization ─────────────────────────────────────────── */
interface LLNode { id: number; value: string | number; next: number | null }
const LinkedListViz: React.FC<{ nodes: LLNode[]; activeNodeId?: string | number }> = ({ nodes, activeNodeId }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
      style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
      Linked List
    </div>
    <div className="flex items-center gap-0 flex-wrap justify-center">
      {nodes.map((node, idx) => {
        const isActive = String(node.id) === String(activeNodeId);
        return (
          <div key={node.id} className="flex items-center">
            <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ duration: 0.25 }}
              className="flex flex-col rounded-xl overflow-hidden"
              style={{ border: `2px solid ${isActive ? '#8b5cf6' : 'rgba(139,92,246,0.25)'}`, boxShadow: isActive ? '0 0 16px rgba(139,92,246,0.35)' : 'none' }}>
              <div className="flex items-center justify-center font-black text-sm px-3 py-2"
                style={{ background: isActive ? 'rgba(139,92,246,0.22)' : 'rgba(22,27,45,0.9)', color: isActive ? '#d8b4fe' : '#e2e8f0', fontFamily: "'JetBrains Mono', monospace", minWidth: 48 }}>
                {node.value}
              </div>
              <div className="flex items-center justify-center text-[10px] font-mono px-2 py-1"
                style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
                {node.next !== null ? `→${node.next}` : 'NULL'}
              </div>
            </motion.div>
            {idx < nodes.length - 1 && (
              <div className="flex items-center px-0.5">
                <div style={{ width: 18, height: 2, background: 'rgba(139,92,246,0.4)' }} />
                <div style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '7px solid rgba(139,92,246,0.6)' }} />
              </div>
            )}
          </div>
        );
      })}
      {nodes.length > 0 && (
        <div className="flex items-center">
          <div className="flex items-center px-0.5">
            <div style={{ width: 14, height: 2, background: 'rgba(139,92,246,0.3)' }} />
            <div style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid rgba(139,92,246,0.4)' }} />
          </div>
          <div className="text-xs font-mono px-2 py-1 rounded"
            style={{ color: '#6b7280', border: '1px dashed rgba(107,114,128,0.4)' }}>NULL</div>
        </div>
      )}
    </div>
  </div>
);

/* ─── Main DSA Stage ─────────────────────────────────────────────────────── */
export const DsaAlgoStage: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const currentStep = useLessonStore(s => s.currentStep);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);

  const step = currentStep;
  const event: AnimationEvent | undefined = step?.animationEvent as AnimationEvent | undefined;
  const mem = step?.memorySnapshot ?? {};

  // Derive array state from memory snapshot (keys like arr[0], arr[1] ...)
  const arrayData = useMemo(() => {
    const entries = Object.entries(mem);
    const arrayKeys = entries.filter(([k]) => /^\w+\[\d+\]$/.test(k));
    if (arrayKeys.length === 0) return null;
    const groups: Record<string, { index: number; value: string | number }[]> = {};
    for (const [k, v] of arrayKeys) {
      const match = k.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const [, name, idx] = match;
        if (!groups[name]) groups[name] = [];
        groups[name].push({ index: Number(idx), value: String(v).replace(/\s*\[\d+B\]/, '') });
      }
    }
    return Object.entries(groups).map(([name, items]) => ({
      name, items: items.sort((a, b) => a.index - b.index),
    }));
  }, [mem]);

  // Derive stack/queue/linked list state from event or memory
  const stackState = useMemo<(string | number)[] | null>(() => {
    if (lesson?.topic === 'stack') {
      if (Array.isArray(mem.stack)) return mem.stack;
      if (typeof mem.stack === 'string') {
        try { return JSON.parse(mem.stack); } catch {}
      }
      if (event?.type === 'STACK_PUSH' || event?.type === 'STACK_POP') {
        return (event as any).stackState;
      }
      return [];
    }
    return null;
  }, [lesson, mem, event]);

  const queueState = useMemo<(string | number)[] | null>(() => {
    if (event?.type === 'ENQUEUE' || event?.type === 'DEQUEUE') return (event as any).queueState;
    return null;
  }, [event]);

  const linkedListNodes = useMemo<LLNode[] | null>(() => {
    if (event?.type === 'LINKED_LIST_UPDATE') return event.nodes;
    return null;
  }, [event]);

  // Derive active pointers
  const pointers = useMemo<Record<string, number | null>>(() => {
    if (event?.type === 'SET_POINTERS') return event.pointers;
    if (event?.type === 'COMPARE_INDICES') return { i: event.indexA, j: event.indexB };
    if (event?.type === 'HIGHLIGHT_ARRAY_INDEX') return { i: event.index };
    if (event?.type === 'UPDATE_ARRAY_INDEX') return { i: event.index };
    const p: Record<string, number | null> = {};
    for (const name of ['i', 'j', 'left', 'right', 'mid', 'low', 'high', 'top', 'front', 'rear', 'curr']) {
      if (mem[name] !== undefined) { const v = Number(mem[name]); if (!isNaN(v)) p[name] = v; }
    }
    return p;
  }, [event, mem]);

  const compareA = event?.type === 'COMPARE_INDICES' ? event.indexA : -1;
  const compareB = event?.type === 'COMPARE_INDICES' ? event.indexB : -1;
  const isSwapping = event?.type === 'SWAP' ||
    (event?.type === 'COMPARE_INDICES' && event.result === 'swap');

  if (!lesson) return (
    <div className="flex-1 flex items-center justify-center" style={{ color: '#4b5563' }}>
      <p className="text-sm">No lesson loaded</p>
    </div>
  );

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center gap-8 overflow-auto rounded-2xl p-6"
      style={{ background: 'rgba(8,10,20,0.95)', border: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.06) 0%, transparent 65%)' }} />

      {/* Badge */}
      <div className="absolute top-4 left-4">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color: '#a855f7', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
          Algorithm Visualization
        </span>
      </div>

      {/* Step counter */}
      {step && (
        <div className="absolute top-4 right-4 text-xs font-mono" style={{ color: '#4b5563' }}>
          Step {currentStepIndex + 1} / {lesson.executionSteps.length}
        </div>
      )}

      {/* ── Visualization area ── */}
      <div className="relative flex flex-col items-center gap-8 z-10 w-full">

        {/* ARRAY */}
        {arrayData && arrayData.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            {arrayData.map(({ name, items }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="text-xs font-bold font-mono mb-1" style={{ color: '#6b7280' }}>{name}[]</div>
                <div className="flex items-end gap-2 flex-wrap justify-center">
                  {items.map(({ index, value }) => {
                    const ptrs = Object.entries(pointers)
                      .filter(([, idx]) => idx === index)
                      .map(([n]) => n);
                    return (
                      <ArrayBox key={index} value={value} index={index}
                        isHighlighted={ptrs.length > 0}
                        isCompareA={compareA === index} isCompareB={compareB === index}
                        pointersAbove={ptrs}
                        isSwapping={isSwapping && (compareA === index || compareB === index)} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STACK */}
        {stackState && (
          <StackViz stackState={stackState}
            lastAction={event?.type === 'STACK_PUSH' ? 'push' : event?.type === 'STACK_POP' ? 'pop' : undefined}
            lastValue={event?.type === 'STACK_PUSH' ? event.value : event?.type === 'STACK_POP' ? event.poppedValue : undefined}
            pointers={pointers}
            compareA={compareA}
            compareB={compareB} />
        )}

        {/* QUEUE */}
        {queueState && (
          <QueueViz queueState={queueState}
            lastAction={event?.type === 'ENQUEUE' ? 'enqueue' : event?.type === 'DEQUEUE' ? 'dequeue' : undefined}
            lastValue={event?.type === 'ENQUEUE' ? event.value : event?.type === 'DEQUEUE' ? event.dequeuedValue : undefined} />
        )}

        {/* LINKED LIST */}
        {linkedListNodes && (
          <LinkedListViz nodes={linkedListNodes}
            activeNodeId={event?.type === 'NODE_TRAVERSE' ? event.nodeId : undefined} />
        )}

        {/* Fallback: memory variables as chips */}
        {!arrayData?.length && !stackState && !queueState && !linkedListNodes && (
          <div className="flex flex-wrap gap-3 justify-center max-w-lg">
            {Object.entries(mem)
              .filter(([k]) => !['i','j','left','right','mid','low','high','front','rear','curr','prev'].includes(k))
              .map(([k, v]) => (
                <motion.div key={k} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(22,27,45,0.9)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <span className="text-xs font-mono" style={{ color: '#6366f1' }}>{k}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#e2e8f0' }}>{String(v)}</span>
                </motion.div>
              ))}
          </div>
        )}

        {/* Compare result badge */}
        {event?.type === 'COMPARE_INDICES' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{
              background: (event.result === 'swap' || event.result === 'found') ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${(event.result === 'swap' || event.result === 'found') ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
              color: (event.result === 'swap' || event.result === 'found') ? '#86efac' : '#fca5a5',
            }}>
            {event.result === 'swap' && '🔄 Swapping!'}
            {event.result === 'no-swap' && '✓ No swap needed'}
            {event.result === 'found' && '✅ Target Found!'}
            {event.result === 'not-found' && '✗ Not found here'}
          </motion.div>
        )}
      </div>
    </div>
  );
};
