import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Search, Layers } from 'lucide-react';

const ARRAY_10 = [12, 25, 34, 41, 56, 63, 78, 82, 90, 99];
const ARRAY_20 = [5, 12, 18, 24, 31, 39, 45, 52, 58, 64, 70, 76, 81, 88, 92, 97, 103, 110, 115, 120];

export const SearchOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);

  const isBinary = lesson?.topic === 'binary_search' || lesson?.id === 'dsa_binary_search';

  const [arraySize, setArraySize] = useState<10 | 20>(10);
  const [targetValue, setTargetValue] = useState<string>('78');

  // Generate Linear Search Steps
  const generateLinearSearchSteps = useCallback((arr: number[], target: number): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `Linear Search initialized with Array of Size ${arr.length}. Target to find = ${target}.`,
      explanationHinglish: `Size ${arr.length} ke array me target = ${target} dhundhna shuru kar rahe hain.`,
      memorySnapshot: {
        arr: `[${arr.join(', ')}]`,
        target,
        result: -1,
        i: -1
      },
      consoleOutput: `> Linear Search Initialized: Target = ${target}`,
      animationEvent: { type: 'NONE' } as any,
    });

    let foundIndex = -1;
    for (let i = 0; i < arr.length; i++) {
      const isMatch = arr[i] === target;
      if (isMatch) foundIndex = i;

      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: `Step i = ${i}: Compare arr[${i}] (${arr[i]}) with Target (${target}). ${isMatch ? 'MATCH FOUND!' : 'Not a match, check next index.'}`,
        explanationHinglish: `Step i = ${i}: arr[${i}] (${arr[i]}) ko Target (${target}) se compare kiya. ${isMatch ? 'MATCH MIL GAYA!' : 'Match nahi hua, aage badho.'}`,
        memorySnapshot: {
          i,
          arr: `[${arr.join(', ')}]`,
          target,
          result: foundIndex,
          comparing: [i]
        },
        consoleOutput: `> Index [${i}]: arr[${i}] = ${arr[i]} ${isMatch ? '== TARGET (FOUND)' : '!= TARGET'}`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'arr',
          indexA: i,
          indexB: i,
          result: isMatch ? 'found' : 'not-found'
        } as any,
      });

      if (isMatch) break;
    }

    steps.push({
      step: stepCount++,
      lineNum: 9,
      explanationEnglish: foundIndex !== -1
        ? `Linear Search Finished! Target ${target} successfully found at index [${foundIndex}].`
        : `Linear Search Finished! Target ${target} was NOT found in the array (Result = -1).`,
      explanationHinglish: foundIndex !== -1
        ? `Linear Search Complete! Target ${target} index [${foundIndex}] par mila.`
        : `Linear Search Complete! Target ${target} array me nahi mila (Result = -1).`,
      memorySnapshot: {
        arr: `[${arr.join(', ')}]`,
        target,
        result: foundIndex
      },
      consoleOutput: foundIndex !== -1 ? `> RESULT: Target found at Index ${foundIndex}` : `> RESULT: Target NOT found (-1)`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  }, []);

  // Generate Binary Search Steps
  const generateBinarySearchSteps = useCallback((arr: number[], target: number): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    let low = 0;
    let high = arr.length - 1;
    let foundIndex = -1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `Binary Search initialized on Sorted Array of Size ${arr.length}. Target = ${target}. Initial pointers: low = 0, high = ${high}.`,
      explanationHinglish: `Size ${arr.length} ke sorted array me Binary Search shuru. Target = ${target}. low = 0, high = ${high}.`,
      memorySnapshot: {
        arr: `[${arr.join(', ')}]`,
        target,
        low,
        high,
        mid: -1,
        result: -1
      },
      consoleOutput: `> Binary Search Initialized: Target = ${target}, Low = 0, High = ${high}`,
      animationEvent: { type: 'NONE' } as any,
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midVal = arr[mid];

      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Calculate mid = (${low} + ${high}) / 2 = ${mid}. Mid Value arr[${mid}] = ${midVal}.`,
        explanationHinglish: `mid calculate kiya: (${low} + ${high}) / 2 = ${mid}. Value arr[${mid}] = ${midVal}.`,
        memorySnapshot: {
          arr: [...arr],
          low,
          high,
          mid,
          target,
          result: foundIndex,
          comparing: [mid]
        },
        consoleOutput: `> Range [${low}...${high}] | Mid = ${mid} (Value = ${midVal})`,
        animationEvent: {
          type: 'COMPARE_INDICES',
          arrayName: 'arr',
          indexA: mid,
          indexB: mid
        } as any,
      });

      if (midVal === target) {
        foundIndex = mid;
        steps.push({
          step: stepCount++,
          lineNum: 6,
          explanationEnglish: `arr[${mid}] (${midVal}) == Target (${target})! MATCH FOUND at index [${mid}]!`,
          explanationHinglish: `arr[${mid}] (${midVal}) == Target (${target})! Match mil gaya index [${mid}] par!`,
          memorySnapshot: {
            arr: [...arr],
            low,
            high,
            mid,
            target,
            result: foundIndex
          },
          consoleOutput: `> MATCH FOUND at index ${mid}!`,
          animationEvent: {
            type: 'COMPARE_INDICES',
            arrayName: 'arr',
            indexA: mid,
            indexB: mid,
            result: 'found'
          } as any,
        });
        break;
      } else if (midVal < target) {
        steps.push({
          step: stepCount++,
          lineNum: 7,
          explanationEnglish: `arr[${mid}] (${midVal}) < Target (${target}) → Target lies in RIGHT half. Update low = mid + 1 (${mid + 1}).`,
          explanationHinglish: `arr[${mid}] (${midVal}) < Target (${target}) → Target RIGHT half me hai. low = ${mid + 1} kar do.`,
          memorySnapshot: {
            arr: [...arr],
            low: mid + 1,
            high,
            mid,
            target,
            result: foundIndex
          },
          consoleOutput: `> Target > Mid Value. Shifting LOW to ${mid + 1}`,
          animationEvent: { type: 'NONE' } as any,
        });
        low = mid + 1;
      } else {
        steps.push({
          step: stepCount++,
          lineNum: 8,
          explanationEnglish: `arr[${mid}] (${midVal}) > Target (${target}) → Target lies in LEFT half. Update high = mid - 1 (${mid - 1}).`,
          explanationHinglish: `arr[${mid}] (${midVal}) > Target (${target}) → Target LEFT half me hai. high = ${mid - 1} kar do.`,
          memorySnapshot: {
            arr: [...arr],
            low,
            high: mid - 1,
            mid,
            target,
            result: foundIndex
          },
          consoleOutput: `> Target < Mid Value. Shifting HIGH to ${mid - 1}`,
          animationEvent: { type: 'NONE' } as any,
        });
        high = mid - 1;
      }
    }

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: foundIndex !== -1
        ? `Binary Search Completed! Target ${target} found at index [${foundIndex}].`
        : `Binary Search Completed! Target ${target} NOT found in array (Result = -1).`,
      explanationHinglish: foundIndex !== -1
        ? `Binary Search Finish! Target ${target} index [${foundIndex}] par mila.`
        : `Binary Search Finish! Target ${target} array me nahi mila (Result = -1).`,
      memorySnapshot: {
        arr: `[${arr.join(', ')}]`,
        target,
        result: foundIndex
      },
      consoleOutput: foundIndex !== -1 ? `> RESULT: Found at index ${foundIndex}` : `> RESULT: Target NOT found (-1)`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  }, []);

  // Real-time recalculation whenever arraySize or targetValue changes
  useEffect(() => {
    const arr = arraySize === 10 ? [...ARRAY_10] : [...ARRAY_20];
    const targetNum = targetValue.trim() !== '' ? Number(targetValue) : (arraySize === 10 ? 78 : 81);

    const steps = isBinary
      ? generateBinarySearchSteps(arr, targetNum)
      : generateLinearSearchSteps(arr, targetNum);

    setCustomSteps(steps);
    setIsPlaying(true);
    setTimeout(() => goToStep(0), 20);
  }, [arraySize, targetValue, isBinary, generateBinarySearchSteps, generateLinearSearchSteps, setCustomSteps, setIsPlaying, goToStep]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            {isBinary ? 'BINARY SEARCH' : 'LINEAR SEARCH'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded font-semibold">
          {isBinary ? 'O(log N) Divide & Conquer' : 'O(N) Sequential Scan'}
        </span>
      </div>

      {/* Body Controls */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col justify-start gap-3">
        
        {/* Array Size Selector (10 vs 20) */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
            <Layers size={13} className="text-indigo-400" /> Array Size:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setArraySize(10)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                arraySize === 10
                  ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.6)] font-black'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              10 Elements
            </button>
            <button
              onClick={() => setArraySize(20)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                arraySize === 20
                  ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.6)] font-black'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              20 Elements
            </button>
          </div>
        </div>

        {/* Search Target Input */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
            <Search size={13} className="text-amber-400" /> Target Value to Search:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={targetValue}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setTargetValue(val);
              }}
              placeholder="Enter target number..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 font-mono text-sm text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/80 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
