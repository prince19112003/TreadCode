import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

export const BubbleSortOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);

  // 6 separate input boxes state
  const [boxes, setBoxes] = useState<string[]>(['69', '14', '75', '68', '61', '58']);

  // Generate full Bubble Sort execution steps for 6 elements
  const generateBubbleSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const arr = [...initialArr];
    const n = arr.length;
    const steps: ExecutionStep[] = [];
    const sortedIndices: number[] = [];
    let swapsCount = 0;

    // Initial State Step
    steps.push({
      step: 1,
      lineNum: 1,
      explanationEnglish: `Bubble Sort initialized with elements: [${arr.join(', ')}].`,
      explanationHinglish: `Elements ke saath Bubble Sort initialize hua: [${arr.join(', ')}].`,
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
          explanationEnglish: `Pass ${i + 1}: Compare index [${j}] (${arr[j]}) and index [${j + 1}] (${arr[j + 1]}).`,
          explanationHinglish: `Pass ${i + 1}: index [${j}] (${arr[j]}) aur index [${j + 1}] (${arr[j + 1]}) ko compare kiya.`,
          memorySnapshot: {
            arr: [...arr],
            pass: i + 1,
            swapsCount,
            sortedIndices: [...sortedIndices],
            comparing: [j, j + 1],
          },
          consoleOutput: `> Pass ${i + 1} | Comparing [${j}] (${arr[j]}) vs [${j + 1}] (${arr[j + 1]})`,
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
        consoleOutput: `> Pass ${i + 1} complete | Locked index [${n - i - 1}] (${arr[n - i - 1]})`,
        animationEvent: { type: 'NONE' } as any,
      });

      if (!swappedInPass) {
        break;
      }
    }

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

    const steps = generateBubbleSortSteps(nums);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  const customSteps = useLessonStore(s => s.customSteps);

  // Initialize default array on component load or reset
  useEffect(() => {
    const initialArr = [69, 14, 75, 68, 61, 58];
    setBoxes(['69', '14', '75', '68', '61', '58']);
    const steps = generateBubbleSortSteps(initialArr);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, customSteps === null]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Sleek Minimal Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            BUBBLE SORT
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
                  className="w-full text-center py-2 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-amber-400 focus:bg-slate-950 text-slate-100 text-xs font-mono font-bold tracking-tight focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



