import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

export const InsertionSortOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);

  // 6 separate input boxes state
  const [boxes, setBoxes] = useState<string[]>(['12', '11', '13', '5', '6', '20']);

  // Generate full Insertion Sort execution steps for 6 elements
  const generateInsertionSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const arr = [...initialArr];
    const n = arr.length;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    // Initial State
    steps.push({
      step: stepNum++,
      lineNum: 1,
      explanationEnglish: `Insertion Sort initialized with elements: [${arr.join(', ')}]. Index [0] (${arr[0]}) is trivially sorted.`,
      explanationHinglish: `Elements ke saath Insertion Sort initialize hua: [${arr.join(', ')}]. Index [0] (${arr[0]}) pehle se sorted hai.`,
      memorySnapshot: { arr: [...arr], pass: 1, i: 1, key: arr[1], j: 0, sortedCount: 1 },
      consoleOutput: `> Insertion Sort initialized: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      // Pick Key step
      steps.push({
        step: stepNum++,
        lineNum: 3,
        explanationEnglish: `Pass ${i}: Pick KEY = arr[${i}] (${key}). Compare with sorted subarray [0..${i - 1}].`,
        explanationHinglish: `Pass ${i}: KEY = arr[${i}] (${key}) ko pick karo aur left side sorted region se compare karo.`,
        memorySnapshot: { arr: [...arr], pass: i, i, key, j, sortedCount: i, keyIdx: i },
        consoleOutput: `> Pass ${i} | Picked KEY = arr[${i}] (${key})`,
        animationEvent: { type: 'NONE' } as any,
      });

      let shiftedCount = 0;
      while (j >= 0 && arr[j] > key) {
        // Compare & Shift step
        steps.push({
          step: stepNum++,
          lineNum: 5,
          explanationEnglish: `Pass ${i}: arr[${j}] (${arr[j]}) > KEY (${key}) → Shift arr[${j}] right to index [${j + 1}].`,
          explanationHinglish: `Pass ${i}: arr[${j}] (${arr[j]}) > KEY (${key}) → arr[${j}] (${arr[j]}) ko right index [${j + 1}] par shift kiya.`,
          memorySnapshot: { arr: [...arr], pass: i, i, key, j, sortedCount: i, comparing: [j, j + 1] },
          consoleOutput: `> Shifting arr[${j}] (${arr[j]}) right`,
          animationEvent: {
            type: 'COMPARE_INDICES',
            arrayName: 'arr',
            indexA: j,
            indexB: j + 1,
          } as any,
        });

        arr[j + 1] = arr[j];
        j = j - 1;
        shiftedCount++;
      }

      // Insert Key step
      arr[j + 1] = key;
      steps.push({
        step: stepNum++,
        lineNum: 8,
        explanationEnglish: `Pass ${i}: Insert KEY (${key}) at position arr[${j + 1}]. Subarray [0..${i}] is now sorted.`,
        explanationHinglish: `Pass ${i}: KEY (${key}) ko uski sahi jagah arr[${j + 1}] par insert kar diya.`,
        memorySnapshot: { arr: [...arr], pass: i, i: i + 1, key: null, j: -1, sortedCount: i + 1, insertedIdx: j + 1 },
        consoleOutput: `> Inserted KEY (${key}) at index [${j + 1}] | Current: [${arr.join(', ')}]`,
        animationEvent: { type: 'NONE' } as any,
      });
    }

    // Final Complete Step
    steps.push({
      step: stepNum,
      lineNum: 9,
      explanationEnglish: `✓ INSERTION SORT COMPLETE! Array is fully sorted.`,
      explanationHinglish: `✓ INSERTION SORT COMPLETE! Array poori tarah sort ho gayi hai.`,
      memorySnapshot: { arr: [...arr], pass: n - 1, i: n, key: null, j: -1, sortedCount: n },
      consoleOutput: `✓ Insertion Sort Complete: [${arr.join(', ')}]`,
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

    const steps = generateInsertionSortSteps(nums);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  const customSteps = useLessonStore(s => s.customSteps);

  // Initialize default array on component load or reset
  useEffect(() => {
    const initialArr = [12, 11, 13, 5, 6, 20];
    setBoxes(['12', '11', '13', '5', '6', '20']);
    const steps = generateInsertionSortSteps(initialArr);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, customSteps === null]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Sleek Minimal Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            INSERTION SORT
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
                  className="w-full text-center py-2 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-indigo-400 focus:bg-slate-950 text-slate-100 text-xs font-mono font-bold tracking-tight focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


