import React, { useState, useEffect, useCallback } from 'react';
import { useLesson } from '../../../lessons/LessonContext';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Play, Pause, RotateCcw, Shuffle, Sparkles, ArrowDown, ArrowUp } from 'lucide-react';

export const BubbleSortOperationalPanel: React.FC = () => {
  const { lesson, setCustomSteps, goToStep } = useLesson();
  const isPlaying = useLessonStore(s => s.isPlaying);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);
  const playSpeed = useLessonStore(s => s.playSpeed);
  const setPlaySpeed = useLessonStore(s => s.setPlaySpeed);

  const [inputVal, setInputVal] = useState('64, 34, 25, 12, 22');
  const [error, setError] = useState<string | null>(null);
  const [isBoundedNotice, setIsBoundedNotice] = useState(false);

  // Helper to parse input and enforce 4–6 elements max
  const parseArray = useCallback((str: string): number[] => {
    const parts = str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parts.length > 6) {
      setIsBoundedNotice(true);
      return parts.slice(0, 6);
    }
    if (parts.length > 0 && parts.length < 4) {
      // pad up to 4 if under 4
      return parts;
    }
    setIsBoundedNotice(false);
    return parts.length === 0 ? [64, 34, 25, 12, 22] : parts;
  }, []);

  // Generate full Bubble Sort execution steps
  const generateBubbleSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const arr = [...initialArr];
    const n = arr.length;
    const steps: ExecutionStep[] = [];
    const sortedIndices: number[] = [];
    let swapsCount = 0;

    // Step 1: Initial State
    steps.push({
      step: 1,
      lineNum: 1,
      explanationEnglish: `Bubble Sort initialized with ${n} elements: [${arr.join(', ')}].`,
      explanationHinglish: `${n} elements ke saath Bubble Sort initialize hua: [${arr.join(', ')}].`,
      memorySnapshot: { arr: [...arr], pass: 1, swapsCount: 0, sortedIndices: [] },
      consoleOutput: `> Bubble Sort initialized: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    let stepCounter = 2;

    for (let i = 0; i < n - 1; i++) {
      let swappedInPass = false;

      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        steps.push({
          step: stepCounter++,
          lineNum: 4,
          explanationEnglish: `Pass ${i + 1}: Compare arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
          explanationHinglish: `Pass ${i + 1}: arr[${j}] (${arr[j]}) aur arr[${j + 1}] (${arr[j + 1]}) ko compare kiya.`,
          memorySnapshot: {
            arr: [...arr],
            pass: i + 1,
            swapsCount,
            sortedIndices: [...sortedIndices],
            comparing: [j, j + 1],
          },
          consoleOutput: `> Comparing index [${j}] (${arr[j]}) with [${j + 1}] (${arr[j + 1]})`,
          animationEvent: {
            type: 'COMPARE_INDICES',
            arrayName: 'arr',
            indexA: j,
            indexB: j + 1,
          } as any,
        });

        if (arr[j] > arr[j + 1]) {
          // Swap step
          const valA = arr[j];
          const valB = arr[j + 1];
          arr[j] = valB;
          arr[j + 1] = valA;
          swapsCount++;
          swappedInPass = true;

          steps.push({
            step: stepCounter++,
            lineNum: 6,
            explanationEnglish: `arr[${j}] (${valA}) > arr[${j + 1}] (${valB}) → SWAP positions!`,
            explanationHinglish: `${valA} > ${valB} → positions swap kar di!`,
            memorySnapshot: {
              arr: [...arr],
              pass: i + 1,
              swapsCount,
              sortedIndices: [...sortedIndices],
              swapping: [j, j + 1],
            },
            consoleOutput: `> Swapped: ${valA} ⇄ ${valB} | Current: [${arr.join(', ')}]`,
            animationEvent: {
              type: 'SWAP',
              arrayName: 'arr',
              indexA: j,
              indexB: j + 1,
            } as any,
          });
        }
      }

      // Element at n - i - 1 is locked in sorted order
      sortedIndices.unshift(n - i - 1);

      steps.push({
        step: stepCounter++,
        lineNum: 8,
        explanationEnglish: `Pass ${i + 1} complete! Largest element in pass is locked at index [${n - i - 1}] (${arr[n - i - 1]}).`,
        explanationHinglish: `Pass ${i + 1} complete! Pass ka sabse bada element index [${n - i - 1}] (${arr[n - i - 1]}) par lock hua.`,
        memorySnapshot: {
          arr: [...arr],
          pass: i + 1,
          swapsCount,
          sortedIndices: [...sortedIndices],
        },
        consoleOutput: `> Pass ${i + 1} complete | Locked index [${n - i - 1}]`,
        animationEvent: { type: 'NONE' } as any,
      });

      if (!swappedInPass) {
        // Optimization: no swaps means array is fully sorted
        break;
      }
    }

    // Lock index 0 as well
    if (!sortedIndices.includes(0)) {
      sortedIndices.unshift(0);
    }

    // Final Complete Step
    steps.push({
      step: stepCounter,
      lineNum: 10,
      explanationEnglish: `✓ BUBBLE SORT COMPLETE! Array is fully sorted in ${swapsCount} total swaps.`,
      explanationHinglish: `✓ BUBBLE SORT COMPLETE! Array ${swapsCount} total swaps me poori tarah sort ho gayi.`,
      memorySnapshot: {
        arr: [...arr],
        pass: n - 1,
        swapsCount,
        sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      },
      consoleOutput: `✓ Bubble Sort Complete: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  }, []);

  // Run Bubble Sort animation
  const handleStartSort = () => {
    const rawParts = inputVal.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (rawParts.length < 4) {
      setError('Array size must be between 4 and 6 elements');
      return;
    }
    setError(null);
    const parsed = parseArray(inputVal);
    setInputVal(parsed.join(', '));
    const steps = generateBubbleSortSteps(parsed);
    setCustomSteps(steps);
    setTimeout(() => {
      goToStep(0);
      setIsPlaying(true);
    }, 30);
  };

  // Preset Loaders
  const handlePreset = (presetType: 'random' | 'reverse' | 'nearly') => {
    setError(null);
    let arr: number[] = [];
    if (presetType === 'random') {
      arr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 89) + 10);
    } else if (presetType === 'reverse') {
      arr = [95, 72, 54, 38, 16];
    } else {
      arr = [12, 25, 45, 34, 88];
    }
    const formatted = arr.join(', ');
    setInputVal(formatted);
    const steps = generateBubbleSortSteps(arr);
    setCustomSteps(steps);
    setTimeout(() => {
      goToStep(0);
      setIsPlaying(true);
    }, 30);
  };

  // Initialize default 5-element array on load
  useEffect(() => {
    const initialArr = [64, 34, 25, 12, 22];
    const steps = generateBubbleSortSteps(initialArr);
    setCustomSteps(steps);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id]);

  const currentArr = parseArray(inputVal);

  return (
    <div className="h-full flex flex-col bg-[#0a0c16] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Control Panel Header */}
      <div className="px-3.5 py-2.5 bg-[#070913] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <span className="font-bold tracking-wider text-slate-200 text-[11px]">BUBBLE SORT CONTROLS</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Size:</span>
          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-extrabold font-mono">
            {currentArr.length} (Max 6)
          </span>
        </div>
      </div>

      {/* Control Panel Body */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-between gap-2">

        {/* Error / Bounded Alerts */}
        {error && (
          <div className="px-3 py-1.5 rounded bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center justify-between shadow-md">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-rose-300 hover:text-white text-xs font-bold px-1.5">✕</button>
          </div>
        )}
        {isBoundedNotice && !error && (
          <div className="px-3 py-1 bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 text-[11px] font-mono rounded flex items-center gap-1">
            <span>ℹ Array bounded to 6 elements max</span>
          </div>
        )}

        {/* Main Stack Operations */}
        <div className="flex flex-col gap-2.5">
          
          {/* Input Field Row */}
          <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold">
                Enter Array (4 to 6 Numbers)
              </span>
              <span className="text-[9px] font-mono text-amber-400/90 font-bold">4–6 Elements</span>
            </div>

            <input
              type="text"
              placeholder="e.g. 64, 34, 25, 12, 22"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStartSort()}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 text-slate-100 text-xs font-mono tracking-wider focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Quick Preset Generators */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handlePreset('random')}
              className="py-1.5 px-2 rounded font-mono font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/50 text-amber-300"
            >
              <Shuffle size={11} /> Random
            </button>
            <button
              onClick={() => handlePreset('reverse')}
              className="py-1.5 px-2 rounded font-mono font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300"
            >
              <ArrowDown size={11} /> Reverse
            </button>
            <button
              onClick={() => handlePreset('nearly')}
              className="py-1.5 px-2 rounded font-mono font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300"
            >
              <ArrowUp size={11} /> Almost
            </button>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleStartSort}
            className="w-full py-2.5 rounded-xl font-mono font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20"
          >
            <Sparkles size={14} /> ▶ START BUBBLE SORT VISUALIZATION
          </button>

        </div>

        {/* Playback Controls Footer */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause Sort' : 'Play Sort'}
            </button>

            <div className="flex items-center gap-1 ml-2">
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  onClick={() => setPlaySpeed(s)}
                  className={`px-2 py-1 rounded font-mono text-[10px] font-bold transition-all ${
                    playSpeed === s
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartSort}
            className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center gap-1"
          >
            <RotateCcw size={12} /> Restart Visualization
          </button>
        </div>

      </div>
    </div>
  );
};
