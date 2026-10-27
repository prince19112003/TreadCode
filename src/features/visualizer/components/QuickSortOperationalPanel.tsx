import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';
import { RefreshCw, Shuffle } from 'lucide-react';

export interface PartitionTreeNode {
  id: string;
  parentId: string | null;
  depth: number;
  branch: 'root' | 'left' | 'right';
  range: [number, number];
  elements: number[];
  pivotVal: number;
  finalPivotPos: number | null;
  status: 'active' | 'completed' | 'waiting';
  leftSubRange: [number, number] | null;
  rightSubRange: [number, number] | null;
}

export const QuickSortOperationalPanel: React.FC = () => {
  const lesson = useLessonStore((s: any) => s.lesson);
  const setCustomSteps = useLessonStore((s: any) => s.setCustomSteps);
  const goToStep = useLessonStore((s: any) => s.goToStep);
  const setIsPlaying = useLessonStore((s: any) => s.setIsPlaying);

  // 8 separate input boxes state
  const [boxes, setBoxes] = useState<string[]>(['52', '38', '74', '19', '63', '27', '85', '41']);

  // Generate full Lomuto Quick Sort execution steps for 8 elements with Divide & Conquer Tree
  const generateQuickSortSteps = useCallback((initialArr: number[]): ExecutionStep[] => {
    const rawArr = [...initialArr.slice(0, 8)];
    while (rawArr.length < 8) rawArr.push(10);
    const arr = [...rawArr];

    const steps: ExecutionStep[] = [];
    const sortedIndices: number[] = [];
    let stepCount = 1;

    // Build the static skeleton of all partition nodes so the tree structure is known
    const treeNodes: PartitionTreeNode[] = [];
    let nodeIdCounter = 0;

    const prebuildTree = (simArr: number[], low: number, high: number, parentId: string | null, depth: number, branch: 'root' | 'left' | 'right'): string | null => {
      if (low > high) return null;
      const id = `node_${nodeIdCounter++}`;
      const sub = simArr.slice(low, high + 1);
      const node: PartitionTreeNode = {
        id,
        parentId,
        depth,
        branch,
        range: [low, high],
        elements: [...sub],
        pivotVal: simArr[high],
        finalPivotPos: null,
        status: 'waiting',
        leftSubRange: null,
        rightSubRange: null,
      };
      treeNodes.push(node);

      if (low === high) {
        node.finalPivotPos = low;
        return id;
      }

      const pivot = simArr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (simArr[j] < pivot) {
          i++;
          const t = simArr[i];
          simArr[i] = simArr[j];
          simArr[j] = t;
        }
      }
      const pi = i + 1;
      const temp = simArr[pi];
      simArr[pi] = simArr[high];
      simArr[high] = temp;
      node.finalPivotPos = pi;

      if (low <= pi - 1) {
        node.leftSubRange = [low, pi - 1];
        prebuildTree(simArr, low, pi - 1, id, depth + 1, 'left');
      }
      if (pi + 1 <= high) {
        node.rightSubRange = [pi + 1, high];
        prebuildTree(simArr, pi + 1, high, id, depth + 1, 'right');
      }
      return id;
    };

    prebuildTree([...arr], 0, arr.length - 1, null, 0, 'root');

    // Helper to get clone of current tree with updated statuses
    const getTreeSnapshot = (activeId: string, completedIds: string[]): PartitionTreeNode[] => {
      return treeNodes.map(n => ({
        ...n,
        status: completedIds.includes(n.id)
          ? 'completed'
          : n.id === activeId
          ? 'active'
          : 'waiting',
      }));
    };

    const completedNodeIds: string[] = [];

    // Initial Step
    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `Quick Sort initialized with 8 elements: [${arr.join(', ')}]. Lomuto partition method picks the rightmost element as Pivot in each recursive sub-array.`,
      explanationHinglish: `8 elements ke saath Quick Sort initialize hua: [${arr.join(', ')}]. Lomuto method har sub-array me rightmost element ko Pivot banata hai.`,
      memorySnapshot: {
        arr: [...arr],
        low: 0,
        high: 7,
        pivotIdx: 7,
        pivotVal: arr[7],
        i: -1,
        j: 0,
        sortedIndices: [],
        phase: 'INIT',
        phaseTitle: 'INITIALIZATION: 8-ELEMENT ARRAY',
        activeNodeId: treeNodes[0]?.id || 'node_0',
        partitionTree: getTreeSnapshot(treeNodes[0]?.id || 'node_0', []),
        isFinished: false,
      },
      consoleOutput: `> Quick Sort initialized: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    // Recursive QuickSort Simulation
    let currentWalkIdx = 0;
    const quickSort = (low: number, high: number, depth: number) => {
      if (low > high) return;

      const currentNode = treeNodes[currentWalkIdx++];
      const activeNodeId = currentNode ? currentNode.id : 'node_0';

      // Base Case: 1 element sub-array
      if (low === high) {
        if (!sortedIndices.includes(low)) sortedIndices.push(low);
        completedNodeIds.push(activeNodeId);

        steps.push({
          step: stepCount++,
          lineNum: 2,
          explanationEnglish: `Base Case reached for window [${low}..${high}]: arr[${low}] = ${arr[low]} has size 1. Single elements are trivially sorted.`,
          explanationHinglish: `Base Case mila [${low}..${high}]: arr[${low}] = ${arr[low]} size 1 hai, isliye yeh automatically sorted hai.`,
          memorySnapshot: {
            arr: [...arr],
            low,
            high,
            pivotIdx: low,
            pivotVal: arr[low],
            i: low,
            j: low,
            sortedIndices: [...sortedIndices],
            phase: 'BASE_CASE',
            phaseTitle: `BASE CASE: [${low}..${high}] (SIZE 1)`,
            activeNodeId,
            partitionTree: getTreeSnapshot(activeNodeId, completedNodeIds),
            isFinished: false,
          },
          consoleOutput: `> Base Case: Index [${low}] (${arr[low]}) is sorted`,
          animationEvent: { type: 'NONE' } as any,
        });
        return;
      }

      // Partition Phase: Choose Pivot
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: `Enter Sub-Problem [${low}..${high}] (Depth ${depth}): Pick Pivot = arr[${high}] (${pivot}). Boundary pointer i initialized to ${i}.`,
        explanationHinglish: `Sub-Problem [${low}..${high}] shuru (Depth ${depth}): Pivot = arr[${high}] (${pivot}). Boundary pointer i = ${i} set kiya.`,
        memorySnapshot: {
          arr: [...arr],
          low,
          high,
          pivotIdx: high,
          pivotVal: pivot,
          i,
          j: low,
          sortedIndices: [...sortedIndices],
          phase: 'WINDOW_SELECT',
          phaseTitle: `PHASE: PARTITIONING WINDOW [${low}..${high}] WITH PIVOT ${pivot}`,
          activeNodeId,
          partitionTree: getTreeSnapshot(activeNodeId, completedNodeIds),
          isFinished: false,
        },
        consoleOutput: `> Sub-Problem [${low}..${high}] | Pivot = arr[${high}] (${pivot})`,
        animationEvent: { type: 'NONE' } as any,
      });

      // Scan elements low to high - 1
      for (let j = low; j < high; j++) {
        const isSmaller = arr[j] < pivot;

        // Step: Compare arr[j] vs Pivot
        steps.push({
          step: stepCount++,
          lineNum: 5,
          explanationEnglish: `Compare arr[${j}] (${arr[j]}) vs Pivot (${pivot}): ${
            isSmaller
              ? `${arr[j]} < ${pivot} → Smaller than Pivot! Advance boundary pointer i and swap into Left Region.`
              : `${arr[j]} >= ${pivot} → Greater or equal! Keep in Right Region.`
          }`,
          explanationHinglish: `arr[${j}] (${arr[j]}) vs Pivot (${pivot}) compare kiya: ${
            isSmaller
              ? `${arr[j]} chhota hai Pivot se! Boundary pointer i++ karke swap karo.`
              : `${arr[j]} bada/barabar hai. Right region me hi rahega.`
          }`,
          memorySnapshot: {
            arr: [...arr],
            low,
            high,
            pivotIdx: high,
            pivotVal: pivot,
            i,
            j,
            sortedIndices: [...sortedIndices],
            comparing: [j, high],
            phase: 'SCAN_COMPARE',
            phaseTitle: `SCANNING: A[${j}] (${arr[j]}) vs PIVOT (${pivot})`,
            activeNodeId,
            partitionTree: getTreeSnapshot(activeNodeId, completedNodeIds),
            isFinished: false,
          },
          consoleOutput: `> Compare A[${j}] (${arr[j]}) vs Pivot (${pivot}) → ${isSmaller ? '< Pivot' : '>= Pivot'}`,
          animationEvent: {
            type: 'COMPARE_INDICES',
            arrayName: 'arr',
            indexA: j,
            indexB: high,
          } as any,
        });

        if (isSmaller) {
          i++;
          if (i !== j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            // Step: Swap smaller element into left boundary
            steps.push({
              step: stepCount++,
              lineNum: 6,
              explanationEnglish: `Swap arr[${i}] (${arr[i]}) ⇄ arr[${j}] (${arr[j]}): Moves smaller element into Left Region [low..i].`,
              explanationHinglish: `arr[${i}] (${arr[i]}) aur arr[${j}] (${arr[j]}) ko swap kiya: chhota element Left Region [low..i] me aa gaya.`,
              memorySnapshot: {
                arr: [...arr],
                low,
                high,
                pivotIdx: high,
                pivotVal: pivot,
                i,
                j,
                sortedIndices: [...sortedIndices],
                swapping: [i, j],
                phase: 'SWAP_SMALLER',
                phaseTitle: `SWAP: MOVE SMALLER ELEMENT TO LEFT REGION A[${i}] ⇄ A[${j}]`,
                activeNodeId,
                partitionTree: getTreeSnapshot(activeNodeId, completedNodeIds),
                isFinished: false,
              },
              consoleOutput: `> Swapped A[${i}] ⇄ A[${j}]: [${arr.join(', ')}]`,
              animationEvent: {
                type: 'SWAP',
                arrayName: 'arr',
                indexA: i,
                indexB: j,
              } as any,
            });
          }
        }
      }

      // Step: Pivot placement swap
      const pi = i + 1;
      const temp = arr[pi];
      arr[pi] = arr[high];
      arr[high] = temp;

      if (!sortedIndices.includes(pi)) sortedIndices.push(pi);
      completedNodeIds.push(activeNodeId);

      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Place Pivot into permanent sorted position: Swap arr[${pi}] (${arr[pi]}) ⇄ arr[${high}] (${arr[high]}). Pivot value (${arr[pi]}) is now permanently fixed at index [${pi}]!`,
        explanationHinglish: `Pivot ko final sorted jagah par rakha: arr[${pi}] aur arr[${high}] ko swap kiya. Pivot value (${arr[pi]}) index [${pi}] par permanently lock ho gayi!`,
        memorySnapshot: {
          arr: [...arr],
          low,
          high,
          pivotIdx: pi,
          pivotVal: arr[pi],
          i: pi,
          j: high,
          sortedIndices: [...sortedIndices],
          swapping: [pi, high],
          phase: 'PIVOT_LOCK',
          phaseTitle: `PIVOT LOCKED AT INDEX [${pi}] (${arr[pi]})`,
          activeNodeId,
          partitionTree: getTreeSnapshot(activeNodeId, completedNodeIds),
          isFinished: false,
        },
        consoleOutput: `> PIVOT LOCKED: arr[${pi}] = ${arr[pi]} will never move again`,
        animationEvent: {
          type: 'SWAP',
          arrayName: 'arr',
          indexA: pi,
          indexB: high,
        } as any,
      });

      // Step: Divide into Sub-arrays
      const hasLeft = low <= pi - 1;
      const hasRight = pi + 1 <= high;
      steps.push({
        step: stepCount++,
        lineNum: 13,
        explanationEnglish: `Divide and Conquer: Sub-array [${low}..${high}] successfully split at pivot index [${pi}] (${arr[pi]}). Now recurse on Left [${hasLeft ? `${low}..${pi - 1}` : 'none'}] and Right [${hasRight ? `${pi + 1}..${high}` : 'none'}].`,
        explanationHinglish: `Divide & Conquer split: Sub-array [${low}..${high}] pivot [${pi}] (${arr[pi]}) par do hisso me toot gaya. Ab Left [${hasLeft ? `${low}..${pi - 1}` : 'none'}] aur Right [${hasRight ? `${pi + 1}..${high}` : 'none'}] par recursion chalega.`,
        memorySnapshot: {
          arr: [...arr],
          low,
          high,
          pivotIdx: pi,
          pivotVal: arr[pi],
          i: pi,
          j: high,
          sortedIndices: [...sortedIndices],
          phase: 'DIVIDE_SUBARRAYS',
          phaseTitle: `DIVIDE: LEFT [${hasLeft ? `${low}..${pi - 1}` : '—'}] | PIVOT [${pi}] | RIGHT [${hasRight ? `${pi + 1}..${high}` : '—'}]`,
          activeNodeId,
          partitionTree: getTreeSnapshot(activeNodeId, completedNodeIds),
          isFinished: false,
        },
        consoleOutput: `> Split at index [${pi}] → Left: [${low}..${pi - 1}], Right: [${pi + 1}..${high}]`,
        animationEvent: { type: 'NONE' } as any,
      });

      // Recurse Left & Right
      quickSort(low, pi - 1, depth + 1);
      quickSort(pi + 1, high, depth + 1);
    };

    quickSort(0, arr.length - 1, 0);

    // Final Complete Step
    steps.push({
      step: stepCount++,
      lineNum: 16,
      explanationEnglish: `Quick Sort Finished! All 8 elements partitioned, conquered, and sorted in-place: [${arr.join(', ')}].`,
      explanationHinglish: `Quick Sort Poora Hua! Saare 8 elements divide & conquer se sorted hain: [${arr.join(', ')}].`,
      memorySnapshot: {
        arr: [...arr],
        low: 0,
        high: 7,
        pivotIdx: -1,
        pivotVal: -1,
        i: -1,
        j: -1,
        sortedIndices: [0, 1, 2, 3, 4, 5, 6, 7],
        phase: 'COMPLETE',
        phaseTitle: 'ALL 8 ELEMENTS FULLY SORTED',
        activeNodeId: '',
        partitionTree: treeNodes.map(n => ({ ...n, status: 'completed' })),
        isFinished: true,
      },
      consoleOutput: `> ALL ELEMENTS SORTED: [${arr.join(', ')}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  }, []);

  const handleBoxChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const updated = [...boxes];
    updated[index] = cleaned;
    setBoxes(updated);

    const nums = updated.map(b => (b.trim() === '' ? 10 : Number(b)));
    const steps = generateQuickSortSteps(nums);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  const handlePreset = (preset: number[]) => {
    setBoxes(preset.map(String));
    const steps = generateQuickSortSteps(preset);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 20);
  };

  const handleRandomize = () => {
    const rand = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 12);
    handlePreset(rand);
  };

  const handleReset = () => {
    handlePreset([52, 38, 74, 19, 63, 27, 85, 41]);
  };

  // Initialize on mount
  useEffect(() => {
    const initialArr = [52, 38, 74, 19, 63, 27, 85, 41];
    const steps = generateQuickSortSteps(initialArr);
    setCustomSteps(steps);
    setIsPlaying(false);
    setTimeout(() => goToStep(0), 30);
  }, [lesson?.id, generateQuickSortSteps, setCustomSteps, setIsPlaying, goToStep]);

  return (
    <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 rounded-none overflow-hidden font-mono text-neutral-200">
      {/* Header */}
      <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0 text-xs">
        <span className="font-bold tracking-wider text-neutral-100 text-[11px] uppercase">
          QUICK SORT
        </span>
        <span className="text-[10px] text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-none font-bold">
          8-Element Divide & Conquer
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col justify-between gap-2.5 custom-scrollbar">
        {/* 8 Array Boxes Input */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold px-0.5">
              8-Element Input Array:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRandomize}
                className="flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-none bg-neutral-900 border border-neutral-700 text-cyan-400 hover:bg-neutral-800 cursor-pointer font-bold transition-colors"
              >
                <Shuffle size={10} /> Random
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-none bg-neutral-900 border border-neutral-700 text-amber-400 hover:bg-neutral-800 cursor-pointer font-bold transition-colors"
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
            {boxes.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center bg-[#0d111d] border border-neutral-800/80 p-1">
                <span className="text-[8px] font-medium text-neutral-500 mb-0.5">A[{idx}]</span>
                <input
                  type="text"
                  maxLength={3}
                  value={val}
                  onChange={e => handleBoxChange(idx, e.target.value)}
                  className="w-full text-center py-1 rounded-none bg-[#060810] border border-neutral-700/80 focus:border-purple-400 text-neutral-100 text-xs font-bold tracking-tight focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
            Quick Presets:
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handlePreset([52, 38, 74, 19, 63, 27, 85, 41])}
              className="text-[9px] font-bold py-1 px-1 rounded-none bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-purple-400 cursor-pointer text-center transition-colors"
            >
              Default
            </button>
            <button
              onClick={() => handlePreset([88, 77, 66, 55, 44, 33, 22, 11])}
              className="text-[9px] font-bold py-1 px-1 rounded-none bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-purple-400 cursor-pointer text-center transition-colors"
            >
              Reversed
            </button>
            <button
              onClick={() => handlePreset([12, 24, 35, 48, 62, 53, 71, 89])}
              className="text-[9px] font-bold py-1 px-1 rounded-none bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-purple-400 cursor-pointer text-center transition-colors"
            >
              Nearly Sorted
            </button>
          </div>
        </div>

        {/* Conceptual Guide Card */}
        <div className="border border-neutral-800/80 p-2 bg-[#090c15] text-[10px] space-y-1.5">
          <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">
            Lomuto Partition Rules:
          </div>
          <div className="text-neutral-400 leading-relaxed space-y-1 text-[9.5px]">
            <div>
              <span className="text-cyan-400 font-bold">• Boundary i:</span> Marks end of elements <span className="text-emerald-400">&lt; Pivot</span>.
            </div>
            <div>
              <span className="text-amber-400 font-bold">• Scanner j:</span> Compares each element against Pivot.
            </div>
            <div>
              <span className="text-purple-400 font-bold">• Lock-in:</span> Swap <span className="text-white font-bold">A[i+1] ⇄ Pivot</span> to place Pivot in its final sorted position.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
