import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Sparkles, Shuffle } from 'lucide-react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

export const InsertionSortOperationalPanel: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>('12, 11, 13, 5, 6');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Store bindings
  const setCustomSteps = useLessonStore((state) => state.setCustomSteps);
  const goToStep = useLessonStore((state) => state.goToStep);
  const goNext = useLessonStore((state) => state.goNext);
  const goPrev = useLessonStore((state) => state.goPrev);
  const isPlaying = useLessonStore((state) => state.isPlaying);
  const setIsPlaying = useLessonStore((state) => state.setIsPlaying);
  const playSpeed = useLessonStore((state) => state.playSpeed);
  const setPlaySpeed = useLessonStore((state) => state.setPlaySpeed);
  const currentStepIndex = useLessonStore((state) => state.currentStepIndex);
  const activeSteps = useLessonStore((state) => state.activeSteps);

  // Generate Step-by-Step Insertion Sort Execution Steps
  const generateInsertionSortSteps = (arrInput: number[]): ExecutionStep[] => {
    const arr = [...arrInput];
    const n = arr.length;
    const steps: ExecutionStep[] = [];

    // Step 1: Initial Array
    steps.push({
      step: 1,
      lineNum: 1,
      explanationEnglish: `Initial Array: [${arr.join(', ')}]. Index [0] (${arr[0]}) is trivially sorted.`,
      explanationHinglish: `Shuruati Array: [${arr.join(', ')}]. Index [0] (${arr[0]}) pehle se sorted mana jata hai.`,
      memorySnapshot: { arr: `[${arr.join(',')}]`, i: 1, key: arr[1], j: 0 },
    });

    let stepNum = 2;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      // Pick Key Step
      steps.push({
        step: stepNum++,
        lineNum: 3,
        explanationEnglish: `Pass ${i}: Pick KEY = arr[${i}] (${key}). Compare with sorted prefix.`,
        explanationHinglish: `Pass ${i}: KEY = arr[${i}] (${key}) ko pick karo aur left side sorted region se compare karo.`,
        memorySnapshot: { arr: `[${arr.join(',')}]`, i, key, j },
      });

      while (j >= 0 && arr[j] > key) {
        // Compare step
        steps.push({
          step: stepNum++,
          lineNum: 5,
          explanationEnglish: `arr[${j}] (${arr[j]}) > KEY (${key}) → Shift arr[${j}] (${arr[j]}) right to index [${j + 1}].`,
          explanationHinglish: `arr[${j}] (${arr[j]}) > KEY (${key}) → arr[${j}] (${arr[j]}) ko right index [${j + 1}] par shift karo.`,
          memorySnapshot: { arr: `[${arr.join(',')}]`, i, key, j },
        });

        arr[j + 1] = arr[j];
        j = j - 1;

        // Shifted array state
        steps.push({
          step: stepNum++,
          lineNum: 6,
          explanationEnglish: `After Shift: arr = [${arr.join(', ')}].`,
          explanationHinglish: `Shift ke baad: arr = [${arr.join(', ')}].`,
          memorySnapshot: { arr: `[${arr.join(',')}]`, i, key, j },
        });
      }

      // Insert Key Step
      arr[j + 1] = key;
      steps.push({
        step: stepNum++,
        lineNum: 8,
        explanationEnglish: `Insert KEY (${key}) into correct position arr[${j + 1}]. Array = [${arr.join(', ')}].`,
        explanationHinglish: `KEY (${key}) ko uski sahi jagah arr[${j + 1}] par insert kar diya. Array = [${arr.join(', ')}].`,
        memorySnapshot: { arr: `[${arr.join(',')}]`, i: i + 1, key, j: -1 },
      });
    }

    // Final Sorted Step
    steps.push({
      step: stepNum,
      lineNum: 9,
      explanationEnglish: `✓ Insertion Sort Complete! Sorted Array = [${arr.join(', ')}].`,
      explanationHinglish: `✓ Insertion Sort Complete! Sorted Array = [${arr.join(', ')}].`,
      memorySnapshot: { arr: `[${arr.join(',')}]`, i: n, key: null, j: -1 },
      consoleOutput: `Sorted: [${arr.join(', ')}]`,
    });

    return steps;
  };

  // Handle Input Submission & Visualization Trigger
  const handleStartSort = () => {
    setErrorMsg(null);
    const parsed = arrayInput
      .split(',')
      .map((v) => parseInt(v.trim(), 10))
      .filter((v) => !isNaN(v));

    if (parsed.length < 4 || parsed.length > 6) {
      setErrorMsg('Please enter between 4 to 6 numbers max (e.g., 12, 11, 13, 5, 6).');
      return;
    }

    const steps = generateInsertionSortSteps(parsed);
    setCustomSteps(steps);
    goToStep(0);
    setIsPlaying(false);
  };

  // Presets
  const setRandomPreset = () => {
    const count = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const randomVals = Array.from({ length: count }, () => Math.floor(Math.random() * 85) + 10);
    const str = randomVals.join(', ');
    setArrayInput(str);
    setErrorMsg(null);
  };

  const setReversePreset = () => {
    setArrayInput('90, 70, 50, 30, 10');
    setErrorMsg(null);
  };

  const setAlmostSortedPreset = () => {
    setArrayInput('15, 25, 45, 35, 55');
    setErrorMsg(null);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-950 text-white font-mono select-none overflow-y-auto">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <h2 className="text-xs font-black tracking-wider text-slate-100 uppercase">INSERTION SORT CONTROLS</h2>
      </div>

      {/* Input Array Section */}
      <div className="space-y-3 mb-4">
        <label className="text-[11px] font-bold text-slate-400 block">
          INPUT ARRAY <span className="text-indigo-400">(4 to 6 Elements Max)</span>:
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="e.g. 12, 11, 13, 5, 6"
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
        </div>

        {errorMsg && (
          <p className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            onClick={setRandomPreset}
            className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 transition-colors flex items-center justify-center gap-1"
          >
            <Shuffle size={12} className="text-indigo-400" /> Random
          </button>
          <button
            onClick={setReversePreset}
            className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 transition-colors flex items-center justify-center gap-1"
          >
            📉 Reverse
          </button>
          <button
            onClick={setAlmostSortedPreset}
            className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 transition-colors flex items-center justify-center gap-1"
          >
            📈 Almost
          </button>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleStartSort}
          className="w-full py-2.5 rounded-xl font-mono font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 bg-linear-to-r from-indigo-500 to-emerald-600 hover:from-indigo-400 hover:to-emerald-500 text-white shadow-indigo-500/20"
        >
          <Sparkles size={14} /> ▶ START INSERTION SORT VISUALIZATION
        </button>
      </div>

      {/* Step Playback Controls */}
      <div className="mt-auto pt-3 border-t border-slate-800/80 space-y-2.5">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
          STEP PLAYBACK CONTROLS
        </span>

        {/* Play/Pause & Prev/Next */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => goToStep(0)}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center transition-all active:scale-95"
            title="Reset to Start"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 flex items-center justify-center transition-all active:scale-95"
            title="Previous Step"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`py-2 rounded-xl border font-bold flex items-center justify-center transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
            }`}
            title={isPlaying ? 'Pause' : 'Auto Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={goNext}
            disabled={!activeSteps || currentStepIndex >= activeSteps.length - 1}
            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 flex items-center justify-center transition-all active:scale-95"
            title="Next Step"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Playback Speed Selector */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
          <span>SPEED:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaySpeed(spd)}
                className={`px-2 py-0.5 rounded-lg border font-mono transition-all ${
                  playSpeed === spd
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
