import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

export const HeapSortOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);

  // 7 separate input boxes state
  const [boxes, setBoxes] = useState<string[]>(['4', '10', '3', '5', '1', '9', '8']);

  // Generate Heap Sort Execution Steps
  const generateHeapSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const arr = [...initialArr];
    const n = arr.length;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    // Step 1: Initial Array State
    steps.push({
      step: stepNum++,
      lineNum: 1,
      explanationEnglish: `Heap Sort Initialized: [${arr.join(', ')}]. Phase 1: Build Max-Heap.`,
      explanationHinglish: `Heap Sort initialize hua: [${arr.join(', ')}]. Phase 1: Build Max-Heap start hoga.`,
      memorySnapshot: { arr: [...arr], phase: 'INIT', heapSize: n, activeNode: -1, sortedIndices: [] },
      consoleOutput: `> Heap Sort Initialized: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    const sortedIndices: number[] = [];

    // Helper: Heapify subtree rooted at index i
    const heapify = (size: number, i: number, phaseName: string) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      steps.push({
        step: stepNum++,
        lineNum: 3,
        explanationEnglish: `${phaseName}: Heapify node index [${i}] (${arr[i]}). Compare with left child [${left}] & right child [${right}].`,
        explanationHinglish: `${phaseName}: Node index [${i}] (${arr[i]}) par Heapify run kar rahe hain.`,
        memorySnapshot: {
          arr: [...arr],
          phase: phaseName,
          heapSize: size,
          activeNode: i,
          comparing: [left < size ? left : -1, right < size ? right : -1].filter(x => x >= 0),
          sortedIndices: [...sortedIndices],
        },
        consoleOutput: `> Heapifying node [${i}] (${arr[i]}) | Heap size: ${size}`,
        animationEvent: { type: 'NONE' } as any,
      });

      if (left < size && arr[left] > arr[largest]) {
        largest = left;
      }
      if (right < size && arr[right] > arr[largest]) {
        largest = right;
      }

      if (largest !== i) {
        const valA = arr[i];
        const valB = arr[largest];
        arr[i] = valB;
        arr[largest] = valA;

        steps.push({
          step: stepNum++,
          lineNum: 5,
          explanationEnglish: `${phaseName}: Swap parent arr[${i}] (${valA}) ↔ larger child arr[${largest}] (${valB}).`,
          explanationHinglish: `${phaseName}: Parent arr[${i}] (${valA}) ko bade child arr[${largest}] (${valB}) ke saath swap kiya.`,
          memorySnapshot: {
            arr: [...arr],
            phase: phaseName,
            heapSize: size,
            activeNode: largest,
            swapping: [i, largest],
            sortedIndices: [...sortedIndices],
          },
          consoleOutput: `> Swapped: ${valA} ⇄ ${valB} | Current Heap: [${arr.join(', ')}]`,
          animationEvent: {
            type: 'SWAP',
            arrayName: 'arr',
            indexA: i,
            indexB: largest,
          } as any,
        });

        // Recursively heapify the affected sub-tree
        heapify(size, largest, phaseName);
      }
    };

    // Phase 1: Build Max Heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i, 'BUILD MAX-HEAP');
    }

    steps.push({
      step: stepNum++,
      lineNum: 6,
      explanationEnglish: `✓ MAX-HEAP BUILT! Maximum element (${arr[0]}) is now at root arr[0].`,
      explanationHinglish: `✓ MAX-HEAP TAYYAR! Sabse bada element (${arr[0]}) ab root index [0] par hai.`,
      memorySnapshot: { arr: [...arr], phase: 'HEAP_READY', heapSize: n, activeNode: 0, sortedIndices: [] },
      consoleOutput: `> Max-Heap Ready: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    // Phase 2: Extract Max elements one by one
    for (let i = n - 1; i > 0; i--) {
      const maxVal = arr[0];
      const lastVal = arr[i];

      // Swap root with last element
      arr[0] = lastVal;
      arr[i] = maxVal;
      sortedIndices.unshift(i);

      steps.push({
        step: stepNum++,
        lineNum: 8,
        explanationEnglish: `EXTRACT MAX: Swap root max (${maxVal}) with last element arr[${i}] (${lastVal}). Lock index [${i}]!`,
        explanationHinglish: `EXTRACT MAX: Root max (${maxVal}) ko last arr[${i}] (${lastVal}) se swap karke lock kar diya!`,
        memorySnapshot: {
          arr: [...arr],
          phase: 'EXTRACT_MAX',
          heapSize: i,
          swapping: [0, i],
          sortedIndices: [...sortedIndices],
        },
        consoleOutput: `> Extracted max ${maxVal} ➔ Locked at index [${i}]`,
        animationEvent: {
          type: 'SWAP',
          arrayName: 'arr',
          indexA: 0,
          indexB: i,
        } as any,
      });

      // Restore Max-Heap property on reduced heap
      heapify(i, 0, 'HEAPIFY ROOT');
    }

    sortedIndices.unshift(0);

    // Final Complete Step
    steps.push({
      step: stepNum,
      lineNum: 10,
      explanationEnglish: `✓ HEAP SORT COMPLETE! Array is fully sorted in ascending order.`,
      explanationHinglish: `✓ HEAP SORT COMPLETE! Array poori tarah sorted ho gayi hai.`,
      memorySnapshot: { arr: [...arr], phase: 'COMPLETE', heapSize: 0, sortedIndices: Array.from({ length: n }, (_, idx) => idx) },
      consoleOutput: `✓ Heap Sort Complete: [${arr.join(', ')}]`,
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

    const steps = generateHeapSortSteps(nums);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  // Initialize default array on component load
  useEffect(() => {
    const initialArr = [4, 10, 3, 5, 1, 9, 8];
    const steps = generateHeapSortSteps(initialArr);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, generateHeapSortSteps, setCustomSteps, goToStep, setIsPlaying]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Sleek Minimal Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            HEAP SORT
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

          {/* 7 Input Boxes Grid */}
          <div className="grid grid-cols-7 gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
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
