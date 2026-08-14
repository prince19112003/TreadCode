import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RefreshCw, Sparkles, Shuffle, ArrowDownMin, Check } from 'lucide-react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

export const SelectionSortOperationalPanel: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>('64, 25, 12, 22, 11');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Store bindings
  const updateActiveSteps = useLessonStore((state) => state.updateActiveSteps);
  const goToStep = useLessonStore((state) => state.goToStep);
  const goNext = useLessonStore((state) => state.goNext);
  const goPrev = useLessonStore((state) => state.goPrev);
  const isPlaying = useLessonStore((state) => state.isPlaying);
  const setIsPlaying = useLessonStore((state) => state.setIsPlaying);
  const playbackSpeed = useLessonStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useLessonStore((state) => state.setPlaybackSpeed);
  const currentStepIndex = useLessonStore((state) => state.currentStepIndex);
  const activeSteps = useLessonStore((state) => state.activeSteps);

  // Generate Step-by-Step Selection Sort Execution Steps
  const generateSelectionSortSteps = (arrInput: number[]): ExecutionStep[] => {
    const arr = [...arrInput];
    const n = arr.length;
    const steps: ExecutionStep[] = [];

    // Step 1: Initial Array
    steps.push({
      step: 1,
      lineNum: 1,
      explanationEnglish: `Initial Array: [${arr.join(', ')}] with ${n} unsorted elements.`,
      explanationHinglish: `Shuruati Array: [${arr.join(', ')}] — Total ${n} unsorted elements.`,
      memorySnapshot: { arr: `[${arr.join(',')}]`, i: 0, minIdx: -1, j: -1 },
    });

    let stepNum = 2;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // Pass boundary start
      steps.push({
        step: stepNum++,
        lineNum: 3,
        explanationEnglish: `Pass ${i + 1}: Assume minIdx = ${i} (arr[${i}] = ${arr[i]}).`,
        explanationHinglish: `Pass ${i + 1}: minIdx = ${i} (arr[${i}] = ${arr[i]}) ko sabse chhota man lo.`,
        memorySnapshot: { arr: `[${arr.join(',')}]`, i, minIdx, j: i + 1 },
      });

      for (let j = i + 1; j < n; j++) {
        // Compare step
        steps.push({
          step: stepNum++,
          lineNum: 4,
          explanationEnglish: `Compare arr[${j}] = ${arr[j]} with current minimum arr[${minIdx}] = ${arr[minIdx]}.`,
          explanationHinglish: `Compare karo: arr[${j}] = ${arr[j]} aur min element arr[${minIdx}] = ${arr[minIdx]}.`,
          memorySnapshot: { arr: `[${arr.join(',')}]`, i, minIdx, j },
        });

        if (arr[j] < arr[minIdx]) {
          const prevMin = minIdx;
          minIdx = j;
          // New Minimum Found step
          steps.push({
            step: stepNum++,
            lineNum: 5,
            explanationEnglish: `New Minimum Found! arr[${j}] (${arr[j]}) < arr[${prevMin}] (${arr[prevMin]}) → Update minIdx = ${minIdx}.`,
            explanationHinglish: `Naya Minimum mil gaya! arr[${j}] (${arr[j]}) chhota hai → minIdx = ${minIdx} kar do.`,
            memorySnapshot: { arr: `[${arr.join(',')}]`, i, minIdx, j },
          });
        }
      }

      // Swap step if minIdx changed
      if (minIdx !== i) {
        steps.push({
          step: stepNum++,
          lineNum: 7,
          explanationEnglish: `Swap smallest element arr[${minIdx}] (${arr[minIdx]}) to boundary arr[${i}] (${arr[i]}).`,
          explanationHinglish: `Sabse chhote element arr[${minIdx}] (${arr[minIdx]}) ko arr[${i}] (${arr[i]}) ke sath swap karo.`,
          memorySnapshot: { arr: `[${arr.join(',')}]`, i, minIdx, j: -1 },
        });

        // Perform swap
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];

        // After swap state
        steps.push({
          step: stepNum++,
          lineNum: 7,
          explanationEnglish: `After Swap: arr = [${arr.join(', ')}]. Index [0..${i}] is now sorted.`,
          explanationHinglish: `Swap ke baad: arr = [${arr.join(', ')}]. Index [0..${i}] ab sorted hai.`,
          memorySnapshot: { arr: `[${arr.join(',')}]`, i: i + 1, minIdx: -1, j: -1 },
        });
      } else {
        steps.push({
          step: stepNum++,
          lineNum: 7,
          explanationEnglish: `arr[${i}] (${arr[i]}) is already the minimum. No swap needed.`,
          explanationHinglish: `arr[${i}] (${arr[i]}) pehle se hi minimum hai. Swap zaroori nahi.`,
          memorySnapshot: { arr: `[${arr.join(',')}]`, i: i + 1, minIdx: -1, j: -1 },
        });
      }
    }

    // Final Sorted Step
    steps.push({
      step: stepNum,
      lineNum: 8,
      explanationEnglish: `✓ Selection Sort Complete! Sorted Array = [${arr.join(', ')}].`,
      explanationHinglish: `✓ Selection Sort Complete! Sorted Array = [${arr.join(', ')}].`,
      memorySnapshot: { arr: `[${arr.join(',')}]`, i: n, minIdx: -1, j: -1 },
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
      setErrorMsg('Please enter between 4 to 6 numbers max (e.g., 64, 25, 12, 22, 11).');
      return;
    }

    const steps = generateSelectionSortSteps(parsed);
    updateActiveSteps(steps);
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
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h2 className="text-xs font-black tracking-wider text-slate-100 uppercase">SELECTION SORT CONTROLS</h2>
      </div>

      {/* Input Array Section */}
      <div className="space-y-3 mb-4">
        <label className="text-[11px] font-bold text-slate-400 block">
          INPUT ARRAY <span className="text-purple-400">(4 to 6 Elements Max)</span>:
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="e.g. 64, 25, 12, 22, 11"
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
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
            <Shuffle size={12} className="text-purple-400" /> Random
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
          className="w-full py-2.5 rounded-xl font-mono font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-500/20"
        >
          <Sparkles size={14} /> ▶ START SELECTION SORT VISUALIZATION
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
                : 'bg-purple-600 hover:bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/30'
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
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg border font-mono transition-all ${
                  playbackSpeed === spd
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
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
