import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDynamicCodeRunner } from '../hooks/useDynamicCodeRunner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLight?: boolean;
}

const AVAILABLE_ENVIRONMENTS = [
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'dsa', label: 'DSA' },
];

const DEFAULT_CODE = `total = 0
for i in range(1, 6):
    total = total + i
print("Final Sum:", total)`;

export const CustomCodeSandboxModal: React.FC<Props> = ({ isOpen, onClose, isLight = false }) => {
  const [selectedEnv, setSelectedEnv] = useState<'python' | string>('python');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600); // ms per step

  const { runCode, isRunning, result, currentStep, currentStepIdx, nextStep, prevStep, reset } =
    useDynamicCodeRunner();
  const autoPlayTimerRef = useRef<number | null>(null);

  // Auto-play stepper loop
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    if (!result || result.steps.length === 0) {
      setIsAutoPlaying(false);
      return;
    }

    autoPlayTimerRef.current = window.setInterval(() => {
      if (currentStepIdx >= result.steps.length - 1) {
        setIsAutoPlaying(false);
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      } else {
        nextStep();
      }
    }, playbackSpeed);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, currentStepIdx, result, playbackSpeed, nextStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 select-none">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col border overflow-hidden ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#090b10] border-slate-800 text-slate-100'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`flex items-center justify-between px-3.5 py-2.5 border-b shrink-0 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0f131c] border-slate-800'
          }`}
        >
          <span className="font-mono text-xs font-semibold tracking-wide">
            Code Simulator
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Language Selection Bar (Pure labels, zero "[Active]" suffix text) */}
        <div
          className={`flex items-center px-3.5 py-1.5 border-b overflow-x-auto gap-1 shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#06080d] border-slate-800'
          }`}
        >
          {AVAILABLE_ENVIRONMENTS.map((env) => {
            const isSelected = selectedEnv === env.id;
            return (
              <button
                key={env.id}
                type="button"
                onClick={() => setSelectedEnv(env.id)}
                className={`text-[11px] font-mono px-2.5 py-1 border transition-colors cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-400 bg-slate-200 text-slate-950 font-semibold'
                    : isLight
                      ? 'border-transparent text-slate-600 hover:bg-slate-200'
                      : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {env.label}
              </button>
            );
          })}
        </div>

        {/* Body Workspace */}
        <div className="flex-1 overflow-y-auto p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Left Panel: Code Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono uppercase font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Code
              </span>
              {result && (
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {result.totalSteps} steps | {result.executionTimeMs}ms
                </span>
              )}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={13}
              spellCheck={false}
              className={`w-full font-mono text-xs p-3 border resize-none outline-none leading-relaxed ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-700'
                  : 'bg-[#040508] border-slate-800 text-emerald-400 focus:border-slate-600'
              }`}
              placeholder="Write executable Python code..."
            />

            {/* Run Controls */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  runCode(code);
                }}
                disabled={isRunning}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                  isLight
                    ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-200 text-slate-950 hover:bg-white'
                }`}
              >
                <Play size={12} className={isRunning ? 'animate-spin' : ''} />
                <span>{isRunning ? 'Running...' : 'Execute'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setIsAutoPlaying(false);
                }}
                disabled={!result}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer disabled:opacity-40 ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                    : 'border-slate-800 bg-[#0f131c] hover:bg-slate-800 text-slate-300'
                }`}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {result?.error && (
              <div className="p-2 border border-amber-600/40 bg-amber-500/10 text-amber-300 text-[11px] font-mono">
                {result.error}
              </div>
            )}
          </div>

          {/* Right Panel: Execution Controls, Active Line & Memory */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono uppercase font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Step Playback
              </span>
              <span className={`text-[11px] font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {result && result.steps.length > 0
                  ? `Step ${currentStepIdx + 1} / ${result.steps.length}`
                  : 'Step — / —'}
              </span>
            </div>

            {/* Stepper Toolbar */}
            <div
              className={`p-2 border flex items-center justify-between gap-2 ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0f131c] border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    prevStep();
                  }}
                  disabled={!result || currentStepIdx === 0}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono border transition-colors cursor-pointer disabled:opacity-30 ${
                    isLight ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800' : 'border-slate-700 bg-[#0a0d16] hover:bg-slate-800 text-slate-200'
                  }`}
                  title="Previous Step"
                >
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    nextStep();
                  }}
                  disabled={!result || currentStepIdx >= result.steps.length - 1}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono border transition-colors cursor-pointer disabled:opacity-30 ${
                    isLight ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800' : 'border-slate-700 bg-[#0a0d16] hover:bg-slate-800 text-slate-200'
                  }`}
                  title="Next Step"
                >
                  <span>Next</span>
                  <ChevronRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  disabled={!result || result.steps.length === 0}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium border transition-colors cursor-pointer disabled:opacity-30 ${
                    isAutoPlaying
                      ? 'border-amber-600 bg-amber-600 text-white'
                      : isLight
                        ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                        : 'border-slate-700 bg-[#0a0d16] hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isAutoPlaying ? 'Pause' : 'Auto'}</span>
                </button>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1">
                {[
                  { label: '1x', delay: 700 },
                  { label: '2x', delay: 350 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setPlaybackSpeed(s.delay)}
                    className={`text-[10px] font-mono px-2 py-0.5 border transition-colors cursor-pointer ${
                      playbackSpeed === s.delay
                        ? isLight
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                          : 'border-slate-400 bg-slate-200 text-slate-950 font-semibold'
                        : isLight
                          ? 'border-slate-300 bg-white text-slate-600'
                          : 'border-slate-800 bg-transparent text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Step Instruction Banner */}
            <div
              className={`p-2.5 border text-xs font-mono min-h-13 flex flex-col justify-center ${
                currentStep
                  ? isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-[#0f131c] border-slate-700 text-slate-200'
                  : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-[#040508] border-slate-800 text-slate-500'
              }`}
            >
              {currentStep ? (
                <div>
                  <div className="font-semibold flex items-center justify-between">
                    <span>{currentStep.explanation}</span>
                    <span className="opacity-60 text-[10px]">Line {currentStep.line}</span>
                  </div>
                  <div className="mt-1 opacity-75 truncate text-[11px]">
                    &gt; {currentStep.codeLine}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-[11px]">Ready</div>
              )}
            </div>

            {/* Live Memory Variables Snapshot Table */}
            <div className="flex-1 flex flex-col min-h-24">
              <div className={`text-[10px] font-mono uppercase mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Memory Variables
              </div>
              <div
                className={`flex-1 p-2 border overflow-y-auto ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#040508] border-slate-800'
                }`}
              >
                {currentStep && Object.keys(currentStep.variables).length > 0 ? (
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {Object.entries(currentStep.variables).map(([key, val]) => (
                      <div
                        key={key}
                        className={`p-1.5 border flex items-center justify-between ${
                          isLight ? 'bg-white border-slate-300' : 'bg-[#0f131c] border-slate-800'
                        }`}
                      >
                        <span className="font-semibold text-blue-400">{key}:</span>
                        <span className="truncate max-w-28 text-slate-200">
                          {Array.isArray(val) ? `[${val.join(', ')}]` : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-xs text-center py-3 font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    —
                  </div>
                )}
              </div>
            </div>

            {/* Console Output */}
            {currentStep?.output && (
              <div className="shrink-0">
                <div className={`text-[10px] font-mono uppercase mb-1 font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Standard Output
                </div>
                <div
                  className={`p-2 font-mono text-[11px] max-h-18 overflow-y-auto whitespace-pre-wrap border ${
                    isLight
                      ? 'bg-slate-900 text-emerald-400 border-slate-800'
                      : 'bg-black text-emerald-400 border-slate-800'
                  }`}
                >
                  {currentStep.output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
