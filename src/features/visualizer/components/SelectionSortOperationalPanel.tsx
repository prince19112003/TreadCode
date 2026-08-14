import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

export const SelectionSortOperationalPanel: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const setCustomSteps = useLessonStore(s => s.setCustomSteps);
  const goToStep = useLessonStore(s => s.goToStep);
  const goNext = useLessonStore(s => s.goNext);
  const goPrev = useLessonStore(s => s.goPrev);
  const isPlaying = useLessonStore(s => s.isPlaying);
  const setIsPlaying = useLessonStore(s => s.setIsPlaying);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const totalSteps = useLessonStore(s => s.totalSteps);

  // 6 separate input boxes state
  const [boxes, setBoxes] = useState<string[]>(['64', '25', '12', '22', '11', '90']);

  // Generate full Selection Sort execution steps for 6 elements
  const generateSelectionSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const arr = [...initialArr];
    const n = arr.length;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    // Initial State
    steps.push({
      step: stepNum++,
      lineNum: 1,
      explanationEnglish: `Selection Sort initialized with elements: [${arr.join(', ')}].`,
      explanationHinglish: `Elements ke saath Selection Sort initialize hua: [${arr.join(', ')}].`,
      memorySnapshot: { arr: [...arr], pass: 1, i: 0, minIdx: 0, j: -1, sortedCount: 0 },
      consoleOutput: `> Selection Sort initialized: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // Pass start step
      steps.push({
        step: stepNum++,
        lineNum: 3,
        explanationEnglish: `Pass ${i + 1}: Assume index [${i}] (${arr[i]}) as minimum (minIdx = ${i}).`,
        explanationHinglish: `Pass ${i + 1}: index [${i}] (${arr[i]}) ko pehle minimum maan lo (minIdx = ${i}).`,
        memorySnapshot: { arr: [...arr], pass: i + 1, i, minIdx, j: i + 1, sortedCount: i },
        consoleOutput: `> Pass ${i + 1} | Initial minIdx = [${i}] (${arr[i]})`,
        animationEvent: { type: 'NONE' } as any,
      });

      for (let j = i + 1; j < n; j++) {
        // Compare step
        steps.push({
          step: stepNum++,
          lineNum: 4,
          explanationEnglish: `Pass ${i + 1}: Compare arr[${j}] (${arr[j]}) with min arr[${minIdx}] (${arr[minIdx]}).`,
          explanationHinglish: `Pass ${i + 1}: arr[${j}] (${arr[j]}) ko min element arr[${minIdx}] (${arr[minIdx]}) se compare kiya.`,
          memorySnapshot: { arr: [...arr], pass: i + 1, i, minIdx, j, sortedCount: i, comparing: [j, minIdx] },
          consoleOutput: `> Comparing arr[${j}] (${arr[j]}) vs min arr[${minIdx}] (${arr[minIdx]})`,
          animationEvent: {
            type: 'COMPARE_INDICES',
            arrayName: 'arr',
            indexA: j,
            indexB: minIdx,
          } as any,
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          // New Min Found
          steps.push({
            step: stepNum++,
            lineNum: 5,
            explanationEnglish: `New Minimum Found! arr[${j}] (${arr[j]}) < min element → Update minIdx = ${minIdx}.`,
            explanationHinglish: `Naya Minimum mila! arr[${j}] (${arr[j]}) chhota hai → minIdx = ${minIdx} kar do.`,
            memorySnapshot: { arr: [...arr], pass: i + 1, i, minIdx, j, sortedCount: i },
            consoleOutput: `> New minIdx = [${minIdx}] (${arr[minIdx]})`,
            animationEvent: { type: 'NONE' } as any,
          });
        }
      }

      // Swap step if minIdx !== i
      if (minIdx !== i) {
        const valA = arr[i];
        const valB = arr[minIdx];
        arr[i] = valB;
        arr[minIdx] = valA;

        steps.push({
          step: stepNum++,
          lineNum: 7,
          explanationEnglish: `Swap min element arr[${minIdx}] (${valB}) into sorted position arr[${i}] (${valA}).`,
          explanationHinglish: `Min element arr[${minIdx}] (${valB}) ko sorted position arr[${i}] (${valA}) ke saath swap kiya.`,
          memorySnapshot: { arr: [...arr], pass: i + 1, i, minIdx, j: -1, sortedCount: i + 1, swapping: [i, minIdx] },
          consoleOutput: `> Swapped: ${valA} ⇄ ${valB} | Current: [${arr.join(', ')}]`,
          animationEvent: {
            type: 'SWAP',
            arrayName: 'arr',
            indexA: i,
            indexB: minIdx,
          } as any,
        });
      } else {
        steps.push({
          step: stepNum++,
          lineNum: 7,
          explanationEnglish: `arr[${i}] (${arr[i]}) is already the minimum. No swap needed.`,
          explanationHinglish: `arr[${i}] (${arr[i]}) pehle se hi minimum hai. Swap zaroori nahi.`,
          memorySnapshot: { arr: [...arr], pass: i + 1, i, minIdx: i, j: -1, sortedCount: i + 1 },
          consoleOutput: `> arr[${i}] (${arr[i]}) already in correct position`,
          animationEvent: { type: 'NONE' } as any,
        });
      }
    }

    // Final Complete Step
    steps.push({
      step: stepNum,
      lineNum: 8,
      explanationEnglish: `✓ SELECTION SORT COMPLETE! Array is fully sorted.`,
      explanationHinglish: `✓ SELECTION SORT COMPLETE! Array poori tarah sort ho gayi hai.`,
      memorySnapshot: { arr: [...arr], pass: n - 1, i: n, minIdx: -1, j: -1, sortedCount: n },
      consoleOutput: `✓ Selection Sort Complete: [${arr.join(', ')}]`,
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

    const steps = generateSelectionSortSteps(nums);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  // Initialize default array on component load
  useEffect(() => {
    const initialArr = [64, 25, 12, 22, 11, 90];
    const steps = generateSelectionSortSteps(initialArr);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, generateSelectionSortSteps, setCustomSteps, goToStep, setIsPlaying]);

  return (
    <div className="h-full flex flex-col bg-[#080a14] border border-slate-800/60 rounded-2xl overflow-hidden text-slate-200">
      
      {/* Sleek Minimal Header */}
      <div className="px-4 py-3 bg-[#050711] border-b border-slate-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-extrabold tracking-wider text-slate-200 text-[11px] uppercase">
            SELECTION SORT
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
                  className="w-full text-center py-2 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-cyan-400 focus:bg-slate-950 text-slate-100 text-xs font-mono font-bold tracking-tight focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Clean Step Controls Footer */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-800/80">
          
          {/* Main Controls: Prev / Play-Pause / Next */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={goPrev}
              disabled={currentStepIndex === 0}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-35 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`py-2 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isPlaying
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={goNext}
              disabled={currentStepIndex >= totalSteps - 1}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-35 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>

          {/* Reset Action */}
          <button
            onClick={() => {
              setIsPlaying(false);
              goToStep(0);
            }}
            className="w-full py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/70 text-slate-400 hover:text-slate-200 font-mono text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw size={12} /> Reset to Start
          </button>

        </div>

      </div>
    </div>
  );
};


