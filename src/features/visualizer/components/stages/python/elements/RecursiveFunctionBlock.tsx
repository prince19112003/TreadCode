import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConditionBox } from './ConditionBox';

interface RecursiveFrame {
  callName: string;
  funcName: string;
  argText: string;
  isTop: boolean;
}

interface RecursiveFunctionBlockProps {
  visibleSteps: any[];
  lessonLines: any[];
  currentStepIndex: number;
}

const depthColors = [
  { border: 'border-indigo-500/50 bg-indigo-950/20', text: 'text-indigo-400', badge: 'border-indigo-500/30 text-indigo-300' },
  { border: 'border-fuchsia-500/50 bg-fuchsia-950/20', text: 'text-fuchsia-400', badge: 'border-fuchsia-500/30 text-fuchsia-300' },
  { border: 'border-cyan-500/50 bg-cyan-950/20', text: 'text-cyan-400', badge: 'border-cyan-500/30 text-cyan-300' },
  { border: 'border-emerald-500/50 bg-emerald-950/20', text: 'text-emerald-400', badge: 'border-emerald-500/30 text-emerald-300' },
  { border: 'border-amber-500/50 bg-amber-950/20', text: 'text-amber-400', badge: 'border-amber-500/30 text-amber-300' },
];

export const RecursiveFunctionBlock: React.FC<RecursiveFunctionBlockProps> = ({
  visibleSteps,
  lessonLines,
}) => {
  const latestStep = visibleSteps.length > 0 ? visibleSteps[visibleSteps.length - 1] : null;
  const callStackStr = latestStep?.memorySnapshot?.CallStack || '';

  const rawCalls = callStackStr.split('->').map((s: string) => s.trim()).filter(Boolean);

  if (rawCalls.length === 0) {
    return (
      <div className="w-80 h-40 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-2 backdrop-blur-xs select-none">
        <svg className="w-6 h-6 opacity-30 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-mono tracking-wider">Awaiting Recursive Execution...</span>
      </div>
    );
  }

  // Parse lesson base condition from code lines dynamically
  let paramName = 'n';
  let op = '==';
  let targetVal = 0;
  let baseCondText = 'n == 0';

  if (lessonLines && lessonLines.length > 0) {
    const ifLine = lessonLines.find((l: any) => l.tokens?.some((t: any) => t.type === 'keyword' && (t.value === 'if' || t.value === 'while')));
    if (ifLine) {
      const codeStr = ifLine.tokens.map((t: any) => t.value).join('').trim();
      const m = codeStr.match(/(?:if|while)\s+([a-zA-Z0-9_]+)\s*(==|<=|>=|<|>)\s*([a-zA-Z0-9_]+):/);
      if (m) {
        paramName = m[1];
        op = m[2];
        targetVal = isNaN(Number(m[3])) ? 0 : Number(m[3]);
        baseCondText = `${paramName} ${op} ${m[3]}`;
      } else {
        const m2 = codeStr.match(/(?:if|while)\s+(.*):/);
        if (m2) baseCondText = m2[1].trim();
      }
    }
  }

  const frames: RecursiveFrame[] = rawCalls.map((call: string, idx: number) => {
    const match = call.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    const funcName = match ? match[1] : 'func';
    const argText = match ? match[2] : '';
    return {
      callName: call,
      funcName,
      argText,
      isTop: idx === rawCalls.length - 1,
    };
  });

  const renderFrameLevel = (depth: number): React.ReactNode => {
    if (depth >= frames.length) return null;

    const frame = frames[depth];
    const isInnermost = depth === frames.length - 1;
    const theme = depthColors[depth % depthColors.length];

    const frameLatestStep = [...visibleSteps].reverse().find(s => {
      const cs = s.memorySnapshot?.CallStack || '';
      return cs.includes(frame.callName);
    }) || latestStep;

    const ev = frameLatestStep?.animationEvent;
    const isConditionStep = ev?.type === 'COMPUTE' && ev.storeIn === 'Condition';

    let argVal: number | string | undefined = undefined;
    if (frame.argText) {
      const args = frame.argText.split(',').map(s => s.trim());
      const lastNum = Number(args[args.length - 1]);
      argVal = isNaN(lastNum) ? args[args.length - 1] : lastNum;
    }

    let isBaseTrue = false;
    if (typeof argVal === 'number') {
      if (op === '==') isBaseTrue = argVal === targetVal;
      else if (op === '<=') isBaseTrue = argVal <= targetVal;
      else if (op === '>=') isBaseTrue = argVal >= targetVal;
      else if (op === '<') isBaseTrue = argVal < targetVal;
      else if (op === '>') isBaseTrue = argVal > targetVal;
    }

    return (
      <motion.div
        key={`${frame.callName}-${depth}`}
        layout
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`relative rounded-2xl flex flex-col gap-3 transition-all duration-300 border ${theme.border} p-4 pt-10 shadow-lg`}
        style={{
          minWidth: `${Math.max(260, 360 - depth * 28)}px`,
        }}
      >
        {/* Frame Name & Badge Header */}
        <div className="absolute -top-3 left-4 px-3 py-0.5 font-mono font-bold text-[10px] tracking-wider bg-slate-950 border border-slate-800 rounded-md text-slate-300 shadow-sm flex items-center gap-2 z-10">
          <span className={`${theme.text} font-black`}>Level {depth + 1}:</span>
          <span className="text-white font-bold">{frame.funcName}({frame.argText})</span>
        </div>

        <div className={`absolute top-2.5 right-4 px-2 py-0.5 rounded-md text-[8px] font-bold tracking-widest border bg-slate-950/80 z-10 ${
          isInnermost ? 'text-emerald-400 border-emerald-500/30 animate-pulse' : 'text-slate-400 border-slate-800'
        }`}>
          {isInnermost ? 'ACTIVE FRAME' : 'WAITING FOR CHILD'}
        </div>

        {/* Base Condition Visual */}
        {argVal !== undefined && (
          <div className="flex justify-center w-full my-1">
            <ConditionBox
              condition={baseCondText}
              inputs={[paramName]}
              memorySnapshot={{ [paramName]: argVal }}
              isTrue={isBaseTrue}
              isActive={isInnermost && isConditionStep}
              label="BASE CONDITION"
              colorTheme={isBaseTrue ? 'teal' : 'default'}
            />
          </div>
        )}

        {/* If child frame exists, nest it inside this block */}
        {!isInnermost ? (
          <div className="flex flex-col gap-2.5 mt-1 border-t border-dashed border-indigo-500/20 pt-3">
            <div className="flex items-center gap-1.5 text-[9px] font-mono font-black text-amber-400/90 uppercase tracking-widest px-1">
              <span className="text-amber-400 text-sm">↳</span>
              <span>RECURSIVE SELF CALL:</span>
            </div>
            <div className="w-full flex justify-center">
              {renderFrameLevel(depth + 1)}
            </div>
          </div>
        ) : (
          /* Innermost frame return visual when base condition met */
          <AnimatePresence>
            {ev?.type === 'COMPUTE' && ev?.storeIn !== 'Condition' && ev?.storeIn !== 'ReturnValue' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-2 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/50 flex flex-col items-center gap-1 shadow-md"
              >
                <span className="text-[10px] font-mono font-black text-indigo-300 uppercase tracking-wider">
                  CALCULATING RETURN VALUE
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {ev.formula || `${ev.inputs?.join(' ')}`} = <span className="text-amber-300 font-extrabold">{ev.result}</span>
                </span>
              </motion.div>
            )}
            {ev?.type === 'COMPUTE' && ev?.storeIn === 'ReturnValue' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col items-center gap-1 shadow-md shadow-emerald-950/40"
              >
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-wider">
                  BASE CASE MET
                </span>
                <span className="text-sm font-mono font-bold text-emerald-200">
                  return {ev.result}
                </span>
              </motion.div>
            )}
            {ev?.type === 'FUNCTION_RETURN' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-2 p-3 rounded-xl bg-teal-950/40 border border-teal-500/50 flex flex-col items-center gap-1 shadow-md"
              >
                <span className="text-[10px] font-mono font-black text-teal-400 uppercase tracking-wider">
                  RETURNED RESULT
                </span>
                <span className="text-sm font-mono font-bold text-teal-200">
                  {ev.returnValue !== undefined ? ev.returnValue : ev.result}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {renderFrameLevel(0)}
    </div>
  );
};
