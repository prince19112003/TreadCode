import React, { useState, useEffect, useRef } from 'react';
import { useDynamicCodeRunner } from '../hooks/useDynamicCodeRunner';
import { detectDeviceTier } from '../profiler';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLight?: boolean;
}

const AVAILABLE_ENVIRONMENTS = [
  { id: 'python', label: 'Python', role: 'Dynamic Engine (Ready)' },
  { id: 'java', label: 'Java', role: 'Catalog Visualizer' },
  { id: 'c', label: 'C', role: 'Catalog Visualizer' },
  { id: 'cpp', label: 'C++', role: 'Catalog Visualizer' },
  { id: 'javascript', label: 'JavaScript', role: 'Catalog Visualizer' },
  { id: 'dsa', label: 'DSA', role: 'Interactive Stages' },
];

const TEMPLATES: { label: string; code: string }[] = [
  {
    label: 'Loop & Sum',
    code: `# Calculate sum of 1 to 5
total = 0
for i in range(1, 6):
    total = total + i
print("Final Sum:", total)`,
  },
  {
    label: 'Variable Swap',
    code: `# Swap two variables
a = 15
b = 30
temp = a
a = b
b = temp
print("a:", a, "b:", b)`,
  },
  {
    label: 'Array Traversal',
    code: `# Array element update
arr = [10, 20, 30]
for i in range(len(arr)):
    arr[i] = arr[i] * 2
print("Doubled:", arr)`,
  },
  {
    label: 'Factorial',
    code: `# Compute factorial of 5
n = 5
fact = 1
for i in range(1, n + 1):
    fact = fact * i
print("Factorial:", fact)`,
  },
];

export const CustomCodeSandboxModal: React.FC<Props> = ({ isOpen, onClose, isLight = false }) => {
  const [selectedEnv, setSelectedEnv] = useState<'python' | string>('python');
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600); // ms per step

  const { runCode, isRunning, result, currentStep, currentStepIdx, nextStep, prevStep, reset } =
    useDynamicCodeRunner();
  const tier = detectDeviceTier();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 select-none">
      <div
        className={`w-full max-w-5xl max-h-[94vh] flex flex-col rounded-none border overflow-hidden ${
          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#090b10] border-slate-800 text-slate-100'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`flex items-center justify-between px-3.5 py-2.5 border-b shrink-0 ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0f131c] border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              Execution Simulator
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
              isLight ? 'border-slate-300 bg-white text-slate-600' : 'border-slate-800 bg-black text-slate-400'
            }`}>
              Tier: {tier} | &lt;1.5MB RAM
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1 text-xs font-mono border transition-colors cursor-pointer ${
              isLight
                ? 'border-slate-300 bg-white hover:bg-slate-200 text-slate-800'
                : 'border-slate-700 bg-black hover:bg-slate-800 text-slate-200'
            }`}
          >
            [Close Esc]
          </button>
        </div>

        {/* Language Environment Bar */}
        <div
          className={`flex items-center justify-between px-3.5 py-2 border-b overflow-x-auto gap-2 shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#06080d] border-slate-900'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono uppercase mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Available Languages:
            </span>
            {AVAILABLE_ENVIRONMENTS.map((env) => {
              const isSelected = selectedEnv === env.id;
              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => setSelectedEnv(env.id)}
                  className={`text-[10px] font-mono px-2 py-0.5 border transition-colors cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'border-slate-900 bg-slate-900 text-white font-bold'
                        : 'border-white bg-white text-black font-bold'
                      : isLight
                        ? 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                        : 'border-slate-800 bg-transparent text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {env.label}
                  {env.id === 'python' ? ' [Active]' : ''}
                </button>
              );
            })}
          </div>

          {selectedEnv !== 'python' && (
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Note: Full interactive stages available in main catalog.
            </span>
          )}
        </div>

        {/* Body Workspace */}
        <div className="flex-1 overflow-y-auto p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Left Panel: Code Input & Templates */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Source Code ({selectedEnv === 'python' ? 'Python Subset' : selectedEnv.toUpperCase()})
              </span>
              <div className="flex items-center gap-1">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    type="button"
                    onClick={() => {
                      setCode(tmpl.code);
                      reset();
                      setIsAutoPlaying(false);
                    }}
                    className={`text-[10px] font-mono px-1.5 py-0.5 border transition-colors cursor-pointer ${
                      isLight
                        ? 'border-slate-300 bg-white hover:bg-slate-200 text-slate-700'
                        : 'border-slate-800 bg-[#0f131c] hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className={`w-full font-mono text-xs p-3 border resize-none outline-none leading-relaxed ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-700'
                  : 'bg-[#040508] border-slate-800 text-emerald-400 focus:border-slate-600'
              }`}
              placeholder="Write executable Python code..."
            />

            {/* Run Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    runCode(code);
                  }}
                  disabled={isRunning}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
                    isLight
                      ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
                      : 'border-slate-200 bg-slate-200 text-slate-900 hover:bg-white'
                  }`}
                >
                  {isRunning ? 'Running...' : 'Execute Snippet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsAutoPlaying(false);
                  }}
                  disabled={!result}
                  className={`px-2.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer disabled:opacity-40 ${
                    isLight
                      ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                      : 'border-slate-800 bg-black hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  Reset
                </button>
              </div>

              {result && (
                <div className={`text-[10px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {result.totalSteps} steps | {result.executionTimeMs}ms
                </div>
              )}
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
              <span className={`text-[11px] font-mono uppercase font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Step Playback Controls
              </span>
              {result && result.steps.length > 0 && (
                <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Step {currentStepIdx + 1} / {result.steps.length}
                </span>
              )}
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
                  className={`px-2.5 py-1 text-xs font-mono border transition-colors cursor-pointer disabled:opacity-30 ${
                    isLight ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800' : 'border-slate-700 bg-black hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  &larr; Prev
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    nextStep();
                  }}
                  disabled={!result || currentStepIdx >= result.steps.length - 1}
                  className={`px-2.5 py-1 text-xs font-mono border transition-colors cursor-pointer disabled:opacity-30 ${
                    isLight ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800' : 'border-slate-700 bg-black hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  Next &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  disabled={!result || result.steps.length === 0}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold border transition-colors cursor-pointer disabled:opacity-30 ${
                    isAutoPlaying
                      ? 'border-amber-600 bg-amber-600 text-white'
                      : isLight
                        ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                        : 'border-slate-700 bg-black hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  {isAutoPlaying ? 'Pause' : 'Auto Play'}
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
                    className={`text-[10px] font-mono px-1.5 py-0.5 border transition-colors cursor-pointer ${
                      playbackSpeed === s.delay
                        ? isLight
                          ? 'border-slate-900 bg-slate-900 text-white font-bold'
                          : 'border-white bg-white text-black font-bold'
                        : isLight
                          ? 'border-slate-300 bg-white text-slate-600'
                          : 'border-slate-800 bg-transparent text-slate-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Step Instruction Banner */}
            <div
              className={`p-2.5 border text-xs font-mono ${
                currentStep
                  ? isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white/5 border-slate-700 text-slate-200'
                  : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-black border-slate-900 text-slate-600'
              }`}
            >
              {currentStep ? (
                <div>
                  <div className="font-bold flex items-center justify-between">
                    <span>{currentStep.explanation}</span>
                    <span className="opacity-60 text-[10px]">Line {currentStep.line}</span>
                  </div>
                  <div className="mt-1 opacity-75 truncate text-[11px]">
                    &gt; {currentStep.codeLine}
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">No active step. Execute code to trace.</div>
              )}
            </div>

            {/* Live Memory Variables Snapshot Table */}
            <div className="flex-1 flex flex-col min-h-25">
              <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
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
                          isLight ? 'bg-white border-slate-300' : 'bg-white/5 border-slate-800'
                        }`}
                      >
                        <span className="font-bold text-blue-500">{key}:</span>
                        <span className="truncate max-w-25">
                          {Array.isArray(val) ? `[${val.join(', ')}]` : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-xs text-center py-4 font-mono ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                    Variables will appear as lines execute.
                  </div>
                )}
              </div>
            </div>

            {/* Console Output */}
            {currentStep?.output && (
              <div className="shrink-0">
                <div className={`text-[10px] font-mono uppercase mb-1 font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
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
