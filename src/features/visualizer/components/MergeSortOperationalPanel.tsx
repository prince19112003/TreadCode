import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

export const MergeSortOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);

  // 6 separate input boxes state
  const [boxes, setBoxes] = useState<string[]>(['38', '27', '43', '3', '9', '82']);

  // Generate Merge Sort Execution Steps
  const generateMergeSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const arr = [...initialArr];
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    // Step 1: Initial State
    steps.push({
      step: stepNum++,
      lineNum: 1,
      explanationEnglish: `Merge Sort initialized: [${arr.join(', ')}]. Divide array into smaller halves.`,
      explanationHinglish: `Merge Sort initialize hua: [${arr.join(', ')}]. Array ko halves me divide karenge.`,
      memorySnapshot: { arr: [...arr], phase: 'DIVIDE_START', level: 0, activeRange: [0, 5] },
      consoleOutput: `> Merge Sort initialized: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    // Helper recursive merge sort simulator to log step snapshots
    const mergeSort = (a: number[], left: number, right: number, level: number) => {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      // Divide Step Left
      steps.push({
        step: stepNum++,
        lineNum: 3,
        explanationEnglish: `DIVIDE [${left}..${right}]: Split into Left [${left}..${mid}] and Right [${mid + 1}..${right}].`,
        explanationHinglish: `DIVIDE [${left}..${right}]: Left [${left}..${mid}] aur Right [${mid + 1}..${right}] me divide kiya.`,
        memorySnapshot: {
          arr: [...a],
          phase: 'DIVIDE',
          level,
          left,
          mid,
          right,
          subLeft: a.slice(left, mid + 1),
          subRight: a.slice(mid + 1, right + 1),
        },
        consoleOutput: `> Split range [${left}..${right}] → [${left}..${mid}] & [${mid + 1}..${right}]`,
        animationEvent: { type: 'NONE' } as any,
      });

      mergeSort(a, left, mid, level + 1);
      mergeSort(a, mid + 1, right, level + 1);

      // Merge Step
      const leftArr = a.slice(left, mid + 1);
      const rightArr = a.slice(mid + 1, right + 1);

      steps.push({
        step: stepNum++,
        lineNum: 6,
        explanationEnglish: `MERGE: Combining sorted halves [${leftArr.join(', ')}] and [${rightArr.join(', ')}].`,
        explanationHinglish: `MERGE: Sorted halves [${leftArr.join(', ')}] aur [${rightArr.join(', ')}] ko combine kar rahe hain.`,
        memorySnapshot: {
          arr: [...a],
          phase: 'MERGE_START',
          level,
          left,
          mid,
          right,
          leftArr,
          rightArr,
        },
        consoleOutput: `> Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
        animationEvent: { type: 'NONE' } as any,
      });

      // Perform Merge
      let i = 0, j = 0, k = left;
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          a[k] = leftArr[i];
          i++;
        } else {
          a[k] = rightArr[j];
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        a[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        a[k] = rightArr[j];
        j++;
        k++;
      }

      const mergedSub = a.slice(left, right + 1);
      steps.push({
        step: stepNum++,
        lineNum: 8,
        explanationEnglish: `MERGED RESULT [${left}..${right}]: [${mergedSub.join(', ')}] sorted in place!`,
        explanationHinglish: `MERGED RESULT [${left}..${right}]: [${mergedSub.join(', ')}] in-place sort ho gaya!`,
        memorySnapshot: {
          arr: [...a],
          phase: 'MERGED_DONE',
          level,
          left,
          right,
          mergedSub,
        },
        consoleOutput: `> Merged range [${left}..${right}]: [${mergedSub.join(', ')}]`,
        animationEvent: { type: 'NONE' } as any,
      });
    };

    mergeSort(arr, 0, arr.length - 1, 1);

    // Final Complete Step
    steps.push({
      step: stepNum,
      lineNum: 10,
      explanationEnglish: `✓ MERGE SORT COMPLETE! Array is fully sorted.`,
      explanationHinglish: `✓ MERGE SORT COMPLETE! Array poori tarah sort ho gayi hai.`,
      memorySnapshot: { arr: [...arr], phase: 'COMPLETE', level: 0 },
      consoleOutput: `✓ Merge Sort Complete: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  }, []);

  // Update visualization immediately whenever a box is changed
  const handleBoxChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 3);
    const nextBoxes = [...boxes];
    nextBoxes[index] = cleaned;
    setBoxes(nextBoxes);

    const nums = nextBoxes.map((b) => {
      const parsed = parseInt(b.trim(), 10);
      return isNaN(parsed) ? 0 : parsed;
    });

    const steps = generateMergeSortSteps(nums);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  // Initialize default array on component load
  useEffect(() => {
    const initialArr = [38, 27, 43, 3, 9, 82];
    const steps = generateMergeSortSteps(initialArr);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, generateMergeSortSteps, setCustomSteps, goToStep, setIsPlaying]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Sleek Minimal Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            MERGE SORT
          </span>
        </div>
      </div>

      {/* Control Panel Body */}
      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col justify-between gap-4">

        {/* Minimal Array Inputs Section */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold px-0.5">
            Array Input
          </span>

          {/* 6 Input Boxes Grid */}
          <div className="grid grid-cols-6 gap-1.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            {boxes.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono font-medium text-slate-500">[{idx}]</span>
                <input
                  type="text"
                  value={val}
                  onChange={e => handleBoxChange(idx, e.target.value)}
                  className="w-full text-center py-2 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-purple-400 focus:bg-slate-950 text-slate-100 text-xs font-mono font-bold tracking-tight focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
