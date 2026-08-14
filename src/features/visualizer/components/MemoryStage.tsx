import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLesson } from '../../../lessons/LessonContext';
import type { AnimationEvent } from '../../../lessons/types';
import { usePinchZoom } from '../../../shared/hooks/usePinchZoom';

// ─── Premium Color System ──────────────────────────────────────────────────────

const EV = {
  CREATE_VARIABLE: { h: '#60a5fa', glow: '#3b82f6', bg: 'rgba(59,130,246,0.08)', label: 'DECLARE', icon: '◆' },
  UPDATE_VARIABLE: { h: '#fbbf24', glow: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'ASSIGN',  icon: '◈' },
  COMPUTE:         { h: '#a78bfa', glow: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',  label: 'COMPUTE', icon: '⬡' },
  PRINT_VALUE:     { h: '#4ade80', glow: '#22c55e', bg: 'rgba(34,197,94,0.08)',   label: 'OUTPUT',  icon: '▸' },
  COPY_VALUE:      { h: '#22d3ee', glow: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   label: 'COPY',    icon: '⤳' },
  SWAP:            { h: '#fb923c', glow: '#f97316', bg: 'rgba(249,115,22,0.08)',  label: 'SWAP',    icon: '⇄' },
  COMPLETE:        { h: '#34d399', glow: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'DONE',    icon: '✦' },
  NONE:            { h: '#94a3b8', glow: '#475569', bg: 'rgba(71,85,105,0.05)',  label: 'RUN',     icon: '▷' },
};

const fmt = (v: string | number) => typeof v === 'string' ? `"${v}"` : String(v);
const getEv = (type: string) => EV[type as keyof typeof EV] ?? EV.NONE;

// ─── Dot Grid Background ───────────────────────────────────────────────────────

const DotGrid: React.FC<{ color: string }> = ({ color }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color}28 1px, transparent 1px)`,
      backgroundSize: '28px 28px',
      transition: 'background-image 0.6s ease',
    }}
  />
);

// ─── Glass Memory Cell ─────────────────────────────────────────────────────────

const GlassCell: React.FC<{
  name: string;
  value: string | number;
  isNew: boolean;
  isActive: boolean;
  evColor: typeof EV.CREATE_VARIABLE;
}> = ({ name, value, isNew, isActive, evColor }) => (
  <motion.div
    layout
    initial={isNew ? { scale: 0, opacity: 0, y: -16, rotate: -6 } : false}
    animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    className="relative flex flex-col items-center"
  >
    {/* Outer glow ring when active */}
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${evColor.glow}88, 0 0 60px ${evColor.glow}33`,
          }}
        />
      )}
    </AnimatePresence>

    {/* Name label */}
    <motion.span
      animate={{ color: isActive ? evColor.h : '#64748b' }}
      transition={{ duration: 0.3 }}
      className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 select-none font-mono"
    >
      {name}
    </motion.span>

    {/* The cell */}
    <motion.div
      animate={{
        borderColor: isActive ? evColor.glow : 'rgba(255,255,255,0.1)',
        background: isActive ? `${evColor.glow}18` : 'rgba(255,255,255,0.03)',
      }}
      transition={{ duration: 0.35 }}
      className="w-14 h-10 rounded-xl border flex items-center justify-center overflow-hidden"
      style={{
        backdropFilter: 'blur(8px)',
        boxShadow: isActive
          ? `0 0 0 1px ${evColor.glow}44, inset 0 1px 0 rgba(255,255,255,0.08)`
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={String(value)}
          initial={{ opacity: 0, y: 6, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
          className="font-mono font-black text-sm text-white leading-none select-none"
        >
          {fmt(value)}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  </motion.div>
);

// ─── Hero Tile (used in action scenes) ────────────────────────────────────────

const HeroTile: React.FC<{
  label?: string;
  value: string | number;
  ev: typeof EV.CREATE_VARIABLE;
  delay?: number;
  pulse?: boolean;
}> = ({ label, value, ev, delay = 0, pulse }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 440, damping: 24, delay }}
    className="flex flex-col items-center gap-1.5"
  >
    {label && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
        className="text-[9px] font-black uppercase tracking-[0.18em] select-none"
        style={{ color: ev.h }}
      >
        {label}
      </motion.span>
    )}
    <motion.div
      animate={pulse ? { boxShadow: [`0 0 20px ${ev.glow}44`, `0 0 40px ${ev.glow}99`, `0 0 20px ${ev.glow}44`] } : {}}
      transition={{ repeat: Infinity, duration: 1.4 }}
      className="relative px-5 py-3 rounded-2xl flex items-center justify-center overflow-hidden"
      style={{
        border: `1.5px solid ${ev.glow}`,
        background: `linear-gradient(135deg, ${ev.glow}18 0%, ${ev.glow}08 100%)`,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 24px ${ev.glow}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
        minWidth: '72px',
      }}
    >
      {/* Inner shimmer */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: delay + 0.5, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-1/3 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${ev.h}22, transparent)` }}
      />
      <span
        className="font-mono font-black text-xl leading-none text-white select-none relative z-10"
      >
        {fmt(value)}
      </span>
    </motion.div>
  </motion.div>
);

// ─── Glow Beam with Particles ─────────────────────────────────────────────────

const GlowBeam: React.FC<{ ev: typeof EV.CREATE_VARIABLE; delay?: number; vertical?: boolean }> = ({ ev, delay = 0, vertical }) => {
  const particles = [0, 1, 2];
  if (vertical) {
    return (
      <div className="relative flex flex-col items-center" style={{ height: 40, width: 20 }}>
        {/* Line */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay, duration: 0.3, ease: 'easeOut' }}
          style={{ originY: 0, background: `linear-gradient(to bottom, ${ev.glow}, ${ev.h})`, height: '100%', width: 2, borderRadius: 4, boxShadow: `0 0 8px ${ev.glow}` }}
        />
        {/* Arrowhead */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute bottom-0"
        >
          <svg width="10" height="8" viewBox="0 0 10 8"><path d="M0 0L5 8L10 0Z" fill={ev.glow} /></svg>
        </motion.div>
        {/* Particles */}
        {particles.map(i => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, 36, 36], opacity: [0, 1, 0] }}
            transition={{ delay: delay + 0.2 + i * 0.18, duration: 0.55, ease: 'easeIn' }}
            className="absolute top-0 w-1.5 h-1.5 rounded-full"
            style={{ background: ev.h, boxShadow: `0 0 6px ${ev.glow}`, left: '25%' }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="relative flex items-center" style={{ width: 56, height: 24 }}>
      {/* Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay, duration: 0.3, ease: 'easeOut' }}
        style={{
          originX: 0,
          background: `linear-gradient(to right, ${ev.glow}, ${ev.h})`,
          width: '100%', height: 2, borderRadius: 4,
          boxShadow: `0 0 8px ${ev.glow}`,
        }}
      />
      {/* Arrowhead */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.28 }}
        className="absolute right-0"
      >
        <svg width="8" height="10" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill={ev.glow} /></svg>
      </motion.div>
      {/* Particles */}
      {particles.map(i => (
        <motion.div
          key={i}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [0, 52, 52], opacity: [0, 1, 0] }}
          transition={{ delay: delay + 0.12 + i * 0.14, duration: 0.5, ease: 'easeIn' }}
          className="absolute left-0 w-1.5 h-1.5 rounded-full"
          style={{ background: ev.h, boxShadow: `0 0 6px ${ev.glow}`, top: '25%' }}
        />
      ))}
    </div>
  );
};

// ─── Operator Badge ────────────────────────────────────────────────────────────

const OpBadge: React.FC<{ children: React.ReactNode; ev: typeof EV.COMPUTE; delay?: number }> = ({ children, ev, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay, type: 'spring', stiffness: 500, damping: 22 }}
    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl select-none"
    style={{
      background: `radial-gradient(circle, ${ev.glow}44 0%, ${ev.glow}11 100%)`,
      border: `1.5px solid ${ev.glow}88`,
      color: ev.h,
      boxShadow: `0 0 16px ${ev.glow}55`,
    }}
  >
    {children}
  </motion.div>
);

// ─── Scene: DECLARE ────────────────────────────────────────────────────────────

const SceneDeclare: React.FC<{ ev: Extract<AnimationEvent, { type: 'CREATE_VARIABLE' }> }> = ({ ev }) => {
  const e = EV.CREATE_VARIABLE;
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <span className="text-xs font-black uppercase tracking-[0.2em] select-none" style={{ color: e.h }}>{e.icon} {e.label}</span>
      </motion.div>
      <div className="flex items-end gap-4">
        <HeroTile label="variable" value={ev.name} ev={e} delay={0.08} />
        <OpBadge ev={e as any} delay={0.22}>=</OpBadge>
        <HeroTile label="value" value={fmt(ev.value)} ev={e} delay={0.38} pulse />
      </div>
    </div>
  );
};

// ─── Scene: ASSIGN ─────────────────────────────────────────────────────────────

const SceneAssign: React.FC<{ ev: Extract<AnimationEvent, { type: 'UPDATE_VARIABLE' }> }> = ({ ev }) => {
  const e = EV.UPDATE_VARIABLE;
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] select-none" style={{ color: e.h }}>{e.icon} {e.label}</span>
      </motion.div>
      <div className="flex items-end gap-4">
        {/* Old value crossed */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 select-none">before</span>
          <div
            className="relative px-5 py-3 rounded-2xl flex items-center justify-center"
            style={{ border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', minWidth: '72px' }}
          >
            <span className="font-mono font-black text-xl text-slate-600 select-none line-through">{fmt(ev.oldValue)}</span>
          </div>
        </motion.div>

        <GlowBeam ev={e as any} delay={0.2} />
        <HeroTile label={ev.name} value={fmt(ev.newValue)} ev={e} delay={0.44} pulse />
      </div>
    </div>
  );
};

// ─── Scene: COMPUTE ────────────────────────────────────────────────────────────

const SceneCompute: React.FC<{
  ev: Extract<AnimationEvent, { type: 'COMPUTE' }>;
  memory: Record<string, string | number>;
}> = ({ ev, memory }) => {
  const e = EV.COMPUTE;
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] select-none" style={{ color: e.h }}>{e.icon} {e.label}</span>
      </motion.div>
      <div className="flex items-end gap-3 flex-wrap justify-center">
        {ev.inputs.map((inp, i) => (
          <React.Fragment key={i}>
            <HeroTile label={inp} value={fmt(memory[inp] ?? inp)} ev={e} delay={i * 0.14} />
            {i < ev.inputs.length - 1 && (
              <OpBadge ev={e} delay={0.18 + i * 0.1}>{ev.operator}</OpBadge>
            )}
          </React.Fragment>
        ))}

        <GlowBeam ev={e as any} delay={0.36} />
        <OpBadge ev={e} delay={0.5}>=</OpBadge>
        <HeroTile label={ev.storeIn} value={fmt(ev.result)} ev={e} delay={0.64} pulse />
      </div>
    </div>
  );
};

// ─── Scene: PRINT ──────────────────────────────────────────────────────────────

const ScenePrint: React.FC<{ ev: Extract<AnimationEvent, { type: 'PRINT_VALUE' }> }> = ({ ev }) => {
  const e = EV.PRINT_VALUE;
  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] select-none" style={{ color: e.h }}>{e.icon} {e.label}</span>
      </motion.div>

      <HeroTile label={ev.variableName} value={fmt(ev.outputValue)} ev={e} delay={0.1} />

      <GlowBeam ev={e as any} delay={0.3} vertical />

      {/* Terminal output box */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.5, y: 8 }}
        animate={{ opacity: 1, scaleX: 1, y: 0 }}
        transition={{ delay: 0.65, type: 'spring', stiffness: 380, damping: 24 }}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl"
        style={{
          border: `1.5px solid ${e.glow}`,
          background: `linear-gradient(135deg, ${e.glow}18, ${e.glow}08)`,
          boxShadow: `0 0 24px ${e.glow}44`,
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="font-mono font-black text-sm select-none"
          style={{ color: e.h }}
        >
          &gt;_
        </motion.span>
        <span className="font-mono font-black text-xl text-white select-none">{fmt(ev.outputValue)}</span>
      </motion.div>
    </div>
  );
};

// ─── Scene: COPY ───────────────────────────────────────────────────────────────

const SceneCopy: React.FC<{ ev: Extract<AnimationEvent, { type: 'COPY_VALUE' }> }> = ({ ev }) => {
  const e = EV.COPY_VALUE;
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] select-none" style={{ color: e.h }}>{e.icon} {e.label}</span>
      </motion.div>
      <div className="flex items-end gap-4">
        <HeroTile label={ev.from} value={fmt(ev.value)} ev={e} delay={0.08} />
        <GlowBeam ev={e as any} delay={0.28} />
        <HeroTile label={ev.to} value={fmt(ev.value)} ev={e} delay={0.6} pulse />
      </div>
    </div>
  );
};

// ─── Scene: SWAP ───────────────────────────────────────────────────────────────

const SceneSwap: React.FC<{
  ev: Extract<AnimationEvent, { type: 'SWAP' }>;
  memory: Record<string, string | number>;
}> = ({ ev, memory }) => {
  const e = EV.SWAP;
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] select-none" style={{ color: e.h }}>{e.icon} {e.label}</span>
      </motion.div>
      <div className="flex items-end gap-4">
        <HeroTile label={ev.varA} value={fmt(memory[ev.varA] ?? '?')} ev={e} delay={0.06} />
        <OpBadge ev={e as any} delay={0.22}>⇄</OpBadge>
        <HeroTile label={ev.varB} value={fmt(memory[ev.varB] ?? '?')} ev={e} delay={0.06} />
      </div>
    </div>
  );
};

// ─── Scene: COMPLETE ───────────────────────────────────────────────────────────

const SceneComplete: React.FC = () => {
  const e = EV.COMPLETE;
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ background: [e.glow, '#f59e0b', '#ec4899', '#60a5fa'][i % 4] }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / 8) * Math.PI * 2) * 80,
            y: Math.sin((i / 8) * Math.PI * 2) * 80,
            opacity: 0,
            scale: 0,
          }}
          transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-7xl select-none"
      >
        🎉
      </motion.div>
      <p className="font-black text-3xl text-white select-none tracking-tight">Done!</p>
      <p className="font-bold text-sm select-none" style={{ color: e.h }}>Bahut badhiya! 🚀</p>
    </motion.div>
  );
};

// ─── Action Dispatcher ─────────────────────────────────────────────────────────

const ActionScene: React.FC<{ ev: AnimationEvent; memory: Record<string, string | number> }> = ({ ev, memory }) => {
  switch (ev.type) {
    case 'CREATE_VARIABLE': return <SceneDeclare ev={ev} />;
    case 'UPDATE_VARIABLE': return <SceneAssign ev={ev} />;
    case 'COMPUTE':         return <SceneCompute ev={ev} memory={memory} />;
    case 'PRINT_VALUE':     return <ScenePrint ev={ev} />;
    case 'COPY_VALUE':      return <SceneCopy ev={ev} />;
    case 'SWAP':            return <SceneSwap ev={ev} memory={memory} />;
    case 'COMPLETE':        return <SceneComplete />;
    default:
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 select-none"
        >
          press next ▶
        </motion.div>
      );
  }
};

// ─── Main ──────────────────────────────────────────────────────────────────────

export const MemoryStage: React.FC = () => {
  const { lesson, currentStep, currentStepIndex, zoom, setZoom } = useLesson();
  const containerRef = usePinchZoom(setZoom, 0.2, 2.5);
  const [memory, setMemory] = useState<Record<string, string | number>>({});
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [newKey, setNewKey] = useState<string | undefined>();
  const [evType, setEvType] = useState<string>('NONE');
  const prevRef = useRef<number>(-1);

  // Reset on retry
  useEffect(() => {
    if (currentStepIndex === 0) {
      setMemory({});
      setActiveKey(undefined);
      setNewKey(undefined);
      setEvType('NONE');
      prevRef.current = -1;
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (!currentStep || currentStep.step === prevRef.current) return;
    prevRef.current = currentStep.step;

    const ev = currentStep.animationEvent;
    setMemory({ ...currentStep.memorySnapshot });
    if (!ev) return;
    setEvType(ev.type);

    let active: string | undefined;
    let isNew = false;
    if (ev.type === 'CREATE_VARIABLE') { active = ev.name; isNew = true; }
    else if (ev.type === 'UPDATE_VARIABLE') { active = ev.name; }
    else if (ev.type === 'COMPUTE') { active = ev.storeIn; }
    else if (ev.type === 'COPY_VALUE') { active = ev.to; }

    setActiveKey(active);
    setNewKey(isNew ? active : undefined);

    const t = setTimeout(() => { setActiveKey(undefined); setNewKey(undefined); }, 1100);
    return () => clearTimeout(t);
  }, [currentStep]);

  if (!lesson || !currentStep) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#080a12] border border-white/5 rounded-2xl">
        <p className="text-slate-700 text-[10px] font-mono uppercase tracking-[0.2em] select-none">select a lesson</p>
      </div>
    );
  }

  const ev = currentStep.animationEvent ?? ({ type: 'NONE' } as any);
  const e = getEv(evType);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative rounded-2xl"
      style={{
        background: '#080a12',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Dot Grid ── */}
      <DotGrid color={e.glow} />

      {/* ── Subtle radial gradient tint per event ── */}
      <motion.div
        animate={{ background: `radial-gradient(ellipse at 50% 0%, ${e.glow}12 0%, transparent 60%)` }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* ── Memory Shelf ── */}
      <div className="shrink-0 relative z-10 px-4 pt-4 pb-3">
        <AnimatePresence>
          {Object.keys(memory).length > 0 ? (
            <motion.div layout className="flex flex-wrap gap-3 justify-center">
              {Object.entries(memory).map(([name, value]) => (
                <GlassCell
                  key={name}
                  name={name}
                  value={value}
                  isNew={newKey === name}
                  isActive={activeKey === name}
                  evColor={e}
                />
              ))}
            </motion.div>
          ) : (
            <div className="h-12 flex items-center justify-center">
              <p className="text-slate-800 text-[9px] font-mono uppercase tracking-[0.2em] select-none">
                no variables yet
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <motion.div
        animate={{ background: `linear-gradient(to right, transparent, ${e.glow}44, transparent)` }}
        transition={{ duration: 0.6 }}
        className="mx-4 h-px shrink-0"
      />

      {/* ── Action Scene ── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto relative z-10">
        <div
          className="relative min-h-full flex items-center justify-center p-6 transition-transform duration-300 origin-top"
          style={{ transform: `scale(${0.9 * zoom})`, transformOrigin: 'top center' }}
        >
          {/* Pen Layer Target */}
          <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="w-full flex items-center justify-center"
            >
              <ActionScene ev={ev} memory={memory} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Complete overlay ── */}
      <AnimatePresence>
        {ev.type === 'COMPLETE' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl"
            style={{ background: 'rgba(8,10,18,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <SceneComplete />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
