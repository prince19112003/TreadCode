import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConditionBox } from './ConditionBox';

interface RecursiveFunctionBlockProps {
  visibleSteps: any[];
  lessonLines: any[];
  currentStepIndex: number;
}

const depthColors = [
  { border: 'border-indigo-500/60 bg-indigo-950/30', header: 'bg-indigo-950/80 text-indigo-300', badge: 'text-indigo-400 border-indigo-500/30' },
  { border: 'border-fuchsia-500/60 bg-fuchsia-950/30', header: 'bg-fuchsia-950/80 text-fuchsia-300', badge: 'text-fuchsia-400 border-fuchsia-500/30' },
  { border: 'border-cyan-500/60 bg-cyan-950/30', header: 'bg-cyan-950/80 text-cyan-300', badge: 'text-cyan-400 border-cyan-500/30' },
  { border: 'border-emerald-500/60 bg-emerald-950/30', header: 'bg-emerald-950/80 text-emerald-300', badge: 'text-emerald-400 border-emerald-500/30' },
  { border: 'border-amber-500/60 bg-amber-950/30', header: 'bg-amber-950/80 text-amber-300', badge: 'text-amber-400 border-amber-500/30' },
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
      <div className="w-96 h-48 border-2 border-dashed border-slate-800 rounded-none flex flex-col items-center justify-center text-slate-600 gap-2 select-none">
        <svg className="w-7 h-7 opacity-30 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-mono tracking-wider">Awaiting Recursive Function Execution...</span>
      </div>
    );
  }

  // Parse lesson base condition from code lines dynamically
  let paramName = 'n';
  let op = '<=';
  let targetVal = 1;
  let baseCondText = 'n <= 1';

  if (lessonLines && lessonLines.length > 0) {
    const ifLine = lessonLines.find((l: any) => l.tokens?.some((t: any) => t.type === 'keyword' && (t.value === 'if' || t.value === 'while')));
    if (ifLine) {
      const codeStr = ifLine.tokens.map((t: any) => t.value).join('').trim();
      const m = codeStr.match(/(?:if|while)\s*\(?\s*([a-zA-Z0-9_]+)\s*(==|<=|>=|<|>)\s*([a-zA-Z0-9_]+)\s*\)?/);
      if (m) {
        paramName = m[1];
        op = m[2];
        targetVal = isNaN(Number(m[3])) ? 0 : Number(m[3]);
        baseCondText = `${paramName} ${op} ${m[3]}`;
      } else {
        const m2 = codeStr.match(/(?:if|while)\s*\(?([^:;{)]+)\)?/);
        if (m2) baseCondText = m2[1].trim();
      }
    }
  }

  // Process frames from call stack
  const frames = rawCalls.map((call: string, idx: number) => {
    const match = call.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    const funcName = match ? match[1] : 'func';
    const argText = match ? match[2] : '';
    const args = argText.split(',').map(s => s.trim());
    const lastArg = Number(args[args.length - 1]);
    const argNum = isNaN(lastArg) ? 0 : lastArg;
    const isTop = idx === rawCalls.length - 1;
    const prefix = rawCalls.slice(0, idx + 1).join(' -> ');

    let isBaseSatisfied = false;
    if (op === '<=') isBaseSatisfied = argNum <= targetVal;
    else if (op === '==') isBaseSatisfied = argNum === targetVal;
    else if (op === '<') isBaseSatisfied = argNum < targetVal;
    else if (op === '>=') isBaseSatisfied = argNum >= targetVal;

    // Check steps history to extract branch results and returned values
    let leftVal: number | undefined = undefined;
    let rightVal: number | undefined = undefined;
    let combinedVal: number | undefined = undefined;
    let isLeftCalled = false;
    let isRightCalled = false;
    let childVal: number | undefined = undefined;
    let linearResult: number | undefined = undefined;

    visibleSteps.forEach((s) => {
      const exp = s.explanationEnglish || '';
      const cs = s.memorySnapshot?.CallStack || '';

      // Check if left/right was called under this frame's stack
      if (cs.includes(`${prefix} -> fib(${argNum - 1})`)) isLeftCalled = true;
      if (cs.includes(`${prefix} -> fib(${argNum - 2})`)) isRightCalled = true;

      // Check left returned
      const mLeft = exp.match(/Returned\s+(\d+)\s+from\s+left\s+branch/);
      if (mLeft) leftVal = Number(mLeft[1]);

      // Check combine results
      const mComb = exp.match(/fib\(\d+\)\[(\d+)\]\s*\+\s*fib\(\d+\)\[(\d+)\]\s*=\s*(\d+)/);
      if (mComb) {
        if (cs === prefix) {
          leftVal = Number(mComb[1]);
          rightVal = Number(mComb[2]);
          combinedVal = Number(mComb[3]);
        }
      }

      // Linear recursion checks (fact, sum, power)
      const mFact = exp.match(/Returned\s+from\s+fact\((\d+)\)\s+with\s+(\d+)\.\s+Compute\s+(\d+)\s*\*\s*(\d+)\s*=\s*(\d+)/);
      if (mFact && Number(mFact[3]) === argNum) {
        childVal = Number(mFact[2]);
        linearResult = Number(mFact[5]);
      }

      const mSum = exp.match(/Returned\s+(\d+)\s+from\s+sum\((\d+)\)\.\s+Compute\s+(\d+)\s*\+\s*(\d+)\s*=\s*(\d+)/);
      if (mSum && Number(mSum[3]) === argNum) {
        childVal = Number(mSum[1]);
        linearResult = Number(mSum[5]);
      }

      const mPower = exp.match(/Returned\s+(\d+)\s+from\s+power.*Compute\s+(\d+)\s*\*\s*(\d+)\s*=\s*(\d+)/);
      if (mPower && cs === prefix) {
        childVal = Number(mPower[1]);
        linearResult = Number(mPower[4]);
      }
    });

    // Check if this frame is currently returning
    const ev = latestStep?.animationEvent;
    const isReturning = isTop && (ev?.type === 'FUNCTION_RETURN' || (ev?.type === 'COMPUTE' && ev?.storeIn === 'ReturnValue'));
    const returnVal = ev?.returnValue !== undefined ? ev.returnValue : (ev?.result !== undefined ? ev.result : undefined);

    return {
      callName: call,
      funcName,
      argText,
      args,
      argNum,
      isTop,
      prefix,
      isBaseSatisfied,
      leftVal,
      rightVal,
      combinedVal,
      isLeftCalled,
      isRightCalled,
      childVal,
      linearResult,
      isReturning,
      returnVal,
    };
  });

  // Render frames in LIFO order (Top of Stack first)
  const reversedFrames = [...frames].reverse();

  return (
    <div className="flex flex-col items-center gap-5 w-full min-w-100 max-w-155">
      {/* ── Call Stack Status Bar ── */}
      <div className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-none flex flex-col gap-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">
              RECURSION CALL STACK (LIFO)
            </span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 border border-slate-700 bg-slate-900 text-slate-300">
            STACK DEPTH: {rawCalls.length} FRAME{rawCalls.length > 1 ? 'S' : ''}
          </span>
        </div>

        {/* Call Chain Breadcrumb */}
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 flex-wrap pt-1 border-t border-slate-900">
          <span className="text-slate-500 font-semibold">main()</span>
          {rawCalls.map((call: string, idx: number) => {
            const isTop = idx === rawCalls.length - 1;
            return (
              <React.Fragment key={idx}>
                <span className="text-indigo-400 font-bold">➔</span>
                <span className={`px-2 py-0.5 border transition-all ${
                  isTop 
                    ? 'border-amber-400 bg-amber-950/40 text-amber-300 font-bold ring-1 ring-amber-400/30' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-300'
                }`}>
                  {call}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Stack Frames Hierarchy ── */}
      <div className="w-full flex flex-col items-center gap-3">
        <AnimatePresence mode="popLayout">
          {reversedFrames.map((frame, rIdx) => {
            const originalDepth = frames.length - 1 - rIdx;
            const theme = depthColors[originalDepth % depthColors.length];
            const isFib = frame.funcName === 'fib' || frame.funcName.toLowerCase().includes('fib');

            return (
              <React.Fragment key={`${frame.callName}-${originalDepth}`}>
                {/* Connector Arrow showing 'called by' relationship */}
                {rIdx > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-0.5 my-0.5 select-none"
                  >
                    <span className="text-[9px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                      ▲ called by
                    </span>
                    <div className="w-0.5 h-3 bg-indigo-500/40" />
                  </motion.div>
                )}

                {/* Activation Frame Card */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className={`w-full rounded-none border transition-all duration-300 flex flex-col p-4 gap-3 bg-slate-950 ${
                    frame.isTop
                      ? 'border-amber-400/80 ring-1 ring-amber-400/20 shadow-md'
                      : `${theme.border}`
                  }`}
                >
                  {/* Frame Header */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400">
                        FRAME #{originalDepth + 1}:
                      </span>
                      <span className="text-sm font-mono font-bold text-white">
                        {frame.funcName}(<span className="text-amber-300">{frame.argText}</span>)
                      </span>
                    </div>

                    <div className={`px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest border uppercase ${
                      frame.isTop
                        ? (frame.isReturning ? 'bg-teal-950/60 text-teal-300 border-teal-500/50' : 'bg-amber-950/60 text-amber-300 border-amber-500/50')
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {frame.isTop 
                        ? (frame.isReturning ? '⤶ RETURNING RESULT' : (frame.isBaseSatisfied ? '🎯 BASE CASE HIT' : '⚡ ACTIVE (TOP OF STACK)'))
                        : '⏳ WAITING FOR CHILD TO RETURN'}
                    </div>
                  </div>

                  {/* Base Condition Check */}
                  <div className="w-full flex justify-center py-1">
                    <ConditionBox
                      condition={baseCondText}
                      inputs={[paramName]}
                      memorySnapshot={{ [paramName]: frame.argNum }}
                      isTrue={frame.isBaseSatisfied}
                      isActive={frame.isTop}
                      label="BASE CONDITION"
                      colorTheme={frame.isBaseSatisfied ? 'teal' : 'default'}
                    />
                  </div>

                  {/* Branching Recursion (Fibonacci) Details */}
                  {isFib && !frame.isBaseSatisfied && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
                      <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                        CHILD BRANCHES:
                      </span>
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {/* Left Branch */}
                        <div className={`p-2.5 border rounded-none flex flex-col gap-1 transition-all ${
                          frame.leftVal !== undefined
                            ? 'border-emerald-500/40 bg-emerald-950/20'
                            : (frame.isLeftCalled ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 bg-slate-900/40')
                        }`}>
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                            <span className="text-slate-300">LEFT: fib({frame.argNum - 1})</span>
                            {frame.leftVal !== undefined ? (
                              <span className="text-emerald-300">RETURNED</span>
                            ) : frame.isLeftCalled ? (
                              <span className="text-amber-300">RUNNING...</span>
                            ) : (
                              <span className="text-slate-500">PENDING</span>
                            )}
                          </div>
                          <div className="text-xs font-mono font-bold">
                            {frame.leftVal !== undefined ? (
                              <span className="text-emerald-300">= {frame.leftVal}</span>
                            ) : (
                              <span className="text-slate-500 italic">awaiting result</span>
                            )}
                          </div>
                        </div>

                        {/* Right Branch */}
                        <div className={`p-2.5 border rounded-none flex flex-col gap-1 transition-all ${
                          frame.rightVal !== undefined
                            ? 'border-emerald-500/40 bg-emerald-950/20'
                            : (frame.isRightCalled ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 bg-slate-900/40')
                        }`}>
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                            <span className="text-slate-300">RIGHT: fib({frame.argNum - 2})</span>
                            {frame.rightVal !== undefined ? (
                              <span className="text-emerald-300">RETURNED</span>
                            ) : frame.isRightCalled ? (
                              <span className="text-amber-300">RUNNING...</span>
                            ) : (
                              <span className="text-slate-500">PENDING</span>
                            )}
                          </div>
                          <div className="text-xs font-mono font-bold">
                            {frame.rightVal !== undefined ? (
                              <span className="text-emerald-300">= {frame.rightVal}</span>
                            ) : (
                              <span className="text-slate-500 italic">awaiting result</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Combined Result formula */}
                      {(frame.leftVal !== undefined || frame.combinedVal !== undefined) && (
                        <div className="mt-1 px-3 py-2 bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-xs">
                          <span className="text-slate-400">Formula: fib({frame.argNum - 1}) + fib({frame.argNum - 2})</span>
                          <span className="text-emerald-300 font-bold">
                            = {frame.leftVal ?? '?' } + {frame.rightVal ?? '?'} = {frame.combinedVal ?? ((frame.leftVal ?? 0) + (frame.rightVal ?? 0))}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Linear Recursion (fact, sum, power) Details */}
                  {!isFib && !frame.isBaseSatisfied && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center justify-between text-[10px] font-mono px-3 py-2 bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400">Recursive Dependency:</span>
                        <span className="text-indigo-300 font-bold">
                          {frame.funcName}({frame.argNum - 1})
                        </span>
                      </div>
                      {frame.childVal !== undefined && (
                        <div className="px-3 py-2 bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between font-mono text-xs">
                          <span className="text-emerald-300">Child Returned: {frame.childVal}</span>
                          <span className="text-white font-bold">Computed Result: {frame.linearResult ?? ''}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Return Value Banner */}
                  {(frame.isReturning || (frame.isTop && frame.returnVal !== undefined)) && (
                    <div className="mt-1 px-4 py-2.5 bg-teal-950/40 border border-teal-500/50 flex items-center justify-between font-mono">
                      <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">
                        {frame.isBaseSatisfied ? 'BASE CASE VALUE' : 'RETURNING TO CALLER'}
                      </span>
                      <span className="text-sm font-bold text-teal-200">
                        return {frame.returnVal ?? (frame.isBaseSatisfied ? frame.argNum : (frame.combinedVal ?? frame.linearResult))}
                      </span>
                    </div>
                  )}
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
