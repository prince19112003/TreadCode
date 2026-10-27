import React, { useState, useEffect, useCallback } from 'react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { ExecutionStep } from '../../../lessons/types';

// Fixed 1D Array for Memory Addressing (size 6)
const ARRAY_1D_ADDR: number[] = [10, 25, 42, 68, 85, 99];

// Fixed 2D Matrix for Memory Addressing (3x3)
const MATRIX_2D_ADDR: number[][] = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
];

// Default 8 elements for Min & Max
const DEFAULT_8_ELEMENTS: number[] = [42, 17, 89, 5, 63, 28, 94, 31];

export const ArrayOperationalPanel: React.FC = () => {
  const lesson = useLessonStore((s: any) => s.lesson);
  const setCustomSteps = useLessonStore((s: any) => s.setCustomSteps);
  const goToStep = useLessonStore((s: any) => s.goToStep);
  const setIsPlaying = useLessonStore((s: any) => s.setIsPlaying);

  const isMinMaxLesson = lesson?.id === 'dsa_array_max_min';
  const isReverseLesson = lesson?.id === 'dsa_array_reverse';
  const isCountLesson = lesson?.id === 'dsa_array_count';

  /* ─────────────────────────────────────────────────────────────
     1. MIN & MAX LOGIC (Static 8 elements, 1D & 2D, Adjustable)
  ───────────────────────────────────────────────────────────── */
  const [minMaxDim, setMinMaxDim] = useState<'1D' | '2D'>('1D');
  const [elements8, setElements8] = useState<number[]>([...DEFAULT_8_ELEMENTS]);

  const generateMinMaxSteps = useCallback((currentDim: '1D' | '2D', arr: number[]): ExecutionStep[] => {
    const numRows = 2;
    const numCols = 4;
    const matrix2D: number[][] = [
      arr.slice(0, 4),
      arr.slice(4, 8),
    ];

    let minVal = arr[0], maxVal = arr[0];
    let minIdx = 0, maxIdx = 0;
    const steps: ExecutionStep[] = [];

    // Step 1: Initial state
    const r0 = Math.floor(0 / numCols);
    const c0 = 0 % numCols;
    steps.push({
      step: 1,
      lineNum: 3,
      explanationEnglish: `Initial: Set minVal = arr[0] (${minVal}) and maxVal = arr[0] (${maxVal}) at index 0.`,
      explanationHinglish: `Shuruat: minVal = arr[0] (${minVal}), maxVal = arr[0] (${maxVal}) shuru kiya.`,
      memorySnapshot: {
        type: 'min_max',
        dim: currentDim,
        arr,
        matrix2D,
        numRows,
        numCols,
        currentIdx: 0,
        currentVal: arr[0],
        currentRow: r0,
        currentCol: c0,
        minVal,
        maxVal,
        minIdx: 0,
        maxIdx: 0,
        minCoord: { row: r0, col: c0 },
        maxCoord: { row: r0, col: c0 },
        updatedMin: false,
        updatedMax: false,
        stage: 'init',
      },
      consoleOutput: `> Initial: MIN = ${minVal} at [0], MAX = ${maxVal} at [0]`,
      animationEvent: { type: 'NONE' } as any,
    });

    // Loop through elements 1 to 7
    for (let i = 1; i < arr.length; i++) {
      const val = arr[i];
      let updatedMin = false;
      let updatedMax = false;

      if (val < minVal) {
        minVal = val;
        minIdx = i;
        updatedMin = true;
      }
      if (val > maxVal) {
        maxVal = val;
        maxIdx = i;
        updatedMax = true;
      }

      const r = Math.floor(i / numCols);
      const c = i % numCols;
      const minR = Math.floor(minIdx / numCols);
      const minC = minIdx % numCols;
      const maxR = Math.floor(maxIdx / numCols);
      const maxC = maxIdx % numCols;

      const locText = currentDim === '1D' ? `A[${i}]` : `A[${r}][${c}] (idx ${i})`;
      const reason = updatedMin
        ? `${locText}=${val} < min → New MIN = ${minVal}!`
        : updatedMax
        ? `${locText}=${val} > max → New MAX = ${maxVal}!`
        : `${locText}=${val} is between ${minVal} and ${maxVal}.`;

      steps.push({
        step: i + 1,
        lineNum: updatedMin ? 6 : updatedMax ? 7 : 5,
        explanationEnglish: `i = ${i} (${locText} = ${val}): ${reason} Current Min: ${minVal}, Current Max: ${maxVal}.`,
        explanationHinglish: `i = ${i} (${locText} = ${val}): ${reason} Min: ${minVal}, Max: ${maxVal}.`,
        memorySnapshot: {
          type: 'min_max',
          dim: currentDim,
          arr,
          matrix2D,
          numRows,
          numCols,
          currentIdx: i,
          currentVal: val,
          currentRow: r,
          currentCol: c,
          minVal,
          maxVal,
          minIdx,
          maxIdx,
          minCoord: { row: minR, col: minC },
          maxCoord: { row: maxR, col: maxC },
          updatedMin,
          updatedMax,
          stage: 'scan',
        },
        consoleOutput: `> Scan ${locText}=${val} | Min: ${minVal} | Max: ${maxVal}`,
        animationEvent: {
          type: 'HIGHLIGHT_ARRAY_INDEX',
          arrayName: 'arr',
          index: i,
        } as any,
      });
    }

    // Step 9: Complete
    const minR = Math.floor(minIdx / numCols);
    const minC = minIdx % numCols;
    const maxR = Math.floor(maxIdx / numCols);
    const maxC = maxIdx % numCols;
    const minLoc = currentDim === '1D' ? `A[${minIdx}]` : `A[${minR}][${minC}]`;
    const maxLoc = currentDim === '1D' ? `A[${maxIdx}]` : `A[${maxR}][${maxC}]`;

    steps.push({
      step: 9,
      lineNum: 9,
      explanationEnglish: `Complete! Minimum = ${minVal} at ${minLoc}, Maximum = ${maxVal} at ${maxLoc}.`,
      explanationHinglish: `Complete! Minimum = ${minVal} (${minLoc} par), Maximum = ${maxVal} (${maxLoc} par).`,
      memorySnapshot: {
        type: 'min_max',
        dim: currentDim,
        arr,
        matrix2D,
        numRows,
        numCols,
        currentIdx: -1,
        currentVal: null,
        currentRow: -1,
        currentCol: -1,
        minVal,
        maxVal,
        minIdx,
        maxIdx,
        minCoord: { row: minR, col: minC },
        maxCoord: { row: maxR, col: maxC },
        updatedMin: false,
        updatedMax: false,
        stage: 'complete',
      },
      consoleOutput: `> RESULT | MIN = ${minVal} at ${minLoc} | MAX = ${maxVal} at ${maxLoc}`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  }, []);

  const triggerMinMaxUpdate = useCallback((dimChoice: '1D' | '2D', arr: number[]) => {
    const steps = generateMinMaxSteps(dimChoice, arr);
    setCustomSteps(steps);
    setIsPlaying(false);
    goToStep(0);
  }, [generateMinMaxSteps, setCustomSteps, setIsPlaying, goToStep]);

  const handleMinMaxDimChange = (newDim: '1D' | '2D') => {
    setMinMaxDim(newDim);
    triggerMinMaxUpdate(newDim, elements8);
  };

  const handleElementChange = (idx: number, newVal: string) => {
    const parsed = parseInt(newVal, 10);
    const val = isNaN(parsed) ? 0 : Math.min(999, Math.max(-99, parsed));
    const nextArr = [...elements8];
    nextArr[idx] = val;
    setElements8(nextArr);
    triggerMinMaxUpdate(minMaxDim, nextArr);
  };

  const handlePresetRandom = () => {
    const rand = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setElements8(rand);
    triggerMinMaxUpdate(minMaxDim, rand);
  };

  const handlePresetAscending = () => {
    const asc = [12, 24, 35, 48, 59, 71, 84, 96];
    setElements8(asc);
    triggerMinMaxUpdate(minMaxDim, asc);
  };

  const handlePresetDescending = () => {
    const desc = [95, 83, 70, 58, 47, 36, 25, 11];
    setElements8(desc);
    triggerMinMaxUpdate(minMaxDim, desc);
  };

  const handlePresetReset = () => {
    const reset = [...DEFAULT_8_ELEMENTS];
    setElements8(reset);
    triggerMinMaxUpdate(minMaxDim, reset);
  };

  /* ─────────────────────────────────────────────────────────────
     1.5 IN-PLACE ARRAY REVERSAL LOGIC (dsa_array_reverse)
  ───────────────────────────────────────────────────────────── */
  const [reverseArr, setReverseArr] = useState<number[]>([10, 20, 30, 40, 50, 60]);

  const generateReverseSteps = useCallback((input: number[]): ExecutionStep[] => {
    const arr = [...input];
    let left = 0, right = arr.length - 1;
    const settledIndices: number[] = [];
    const steps: ExecutionStep[] = [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: `Array arr[${arr.length}] = {${arr.join(', ')}} initialized in memory.`,
        explanationHinglish: `Array arr[${arr.length}] = {${arr.join(', ')}} memory me initialize hua.`,
        memorySnapshot: {
          type: 'reverse',
          arr: [...arr],
          left: 0,
          right: arr.length - 1,
          temp: null,
          stage: 'init',
          swapping: null,
          settledIndices: [],
        },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: `[${arr.join(',')}]` },
      },
      {
        step: 2,
        lineNum: 2,
        explanationEnglish: `Two pointers initialized: left = 0 (points to ${arr[0]}), right = ${right} (points to ${arr[right]}).`,
        explanationHinglish: `Dono pointers set hue: left = 0 (${arr[0]}), right = ${right} (${arr[right]}).`,
        memorySnapshot: {
          type: 'reverse',
          arr: [...arr],
          left: 0,
          right: arr.length - 1,
          temp: null,
          stage: 'init',
          swapping: null,
          settledIndices: [],
        },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'left', value: 0 }, { name: 'right', value: right }] },
      },
    ];

    let step = 3;
    while (left < right) {
      const temp = arr[left];
      // Step A: Save temp
      steps.push({
        step: step++,
        lineNum: 4,
        explanationEnglish: `temp = arr[${left}] (${temp}). Save left element in temp variable before swapping.`,
        explanationHinglish: `temp = arr[${left}] (${temp}) save kiya swap ke liye.`,
        memorySnapshot: {
          type: 'reverse',
          arr: [...arr],
          left,
          right,
          temp,
          stage: 'temp',
          swapping: null,
          settledIndices: [...settledIndices],
        },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'temp', value: temp },
      });

      // Step B: Swap Left & Right
      arr[left] = arr[right];
      arr[right] = temp;
      settledIndices.push(left, right);

      steps.push({
        step: step++,
        lineNum: 6,
        explanationEnglish: `Swap complete! arr[${left}] (${arr[left]}) ⇄ arr[${right}] (${arr[right]}). Elements exchanged in-place.`,
        explanationHinglish: `Swap complete! arr[${left}] (${arr[left]}) ⇄ arr[${right}] (${arr[right]}) exchange hua.`,
        memorySnapshot: {
          type: 'reverse',
          arr: [...arr],
          left,
          right,
          temp,
          stage: 'swap',
          swapping: [left, right],
          settledIndices: [...settledIndices],
        },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX', arrayName: 'arr', index: left, oldValue: temp, newValue: arr[left] },
      });

      // Step C: Advance inward
      left++;
      right--;
      steps.push({
        step: step++,
        lineNum: 7,
        explanationEnglish: `Pointers moved inward: left = ${left}, right = ${right}. Checking loop condition (left < right).`,
        explanationHinglish: `Pointers andar badhe: left = ${left}, right = ${right}. Condition check: left < right.`,
        memorySnapshot: {
          type: 'reverse',
          arr: [...arr],
          left,
          right,
          temp: null,
          stage: 'advance',
          swapping: null,
          settledIndices: [...settledIndices],
        },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'left', value: left }, { name: 'right', value: right }] },
      });
    }

    // Step Final: Complete
    steps.push({
      step: step,
      lineNum: 9,
      explanationEnglish: `Reversal complete! Two pointers met/crossed (left >= right). Final reversed array: [${arr.join(', ')}].`,
      explanationHinglish: `Reversal complete! Pointers mil gaye (left >= right). Reversed array: [${arr.join(', ')}].`,
      memorySnapshot: {
        type: 'reverse',
        arr: [...arr],
        left,
        right,
        temp: null,
        stage: 'complete',
        swapping: null,
        settledIndices: arr.map((_, i) => i),
      },
      consoleOutput: `Reversed: [${arr.join(', ')}]`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: `[${arr.join(',')}]` },
    });

    return steps;
  }, []);

  const triggerReverseUpdate = useCallback((arr: number[]) => {
    const steps = generateReverseSteps(arr);
    setCustomSteps(steps);
    setIsPlaying(false);
    goToStep(0);
  }, [generateReverseSteps, setCustomSteps, setIsPlaying, goToStep]);

  const handleReverseElementChange = (idx: number, newVal: string) => {
    const parsed = parseInt(newVal, 10);
    const val = isNaN(parsed) ? 0 : Math.min(999, Math.max(-99, parsed));
    const nextArr = [...reverseArr];
    nextArr[idx] = val;
    setReverseArr(nextArr);
    triggerReverseUpdate(nextArr);
  };

  const handleReverseSetSize = (size: 5 | 6) => {
    let nextArr: number[];
    if (size === 5) {
      nextArr = [10, 25, 42, 68, 85];
    } else {
      nextArr = [10, 20, 30, 40, 50, 60];
    }
    setReverseArr(nextArr);
    triggerReverseUpdate(nextArr);
  };

  const handleReversePreset = (preset: 'default' | 'odd' | 'descending' | 'palindrome' | 'random') => {
    let nextArr: number[];
    if (preset === 'default') {
      nextArr = [10, 20, 30, 40, 50, 60];
    } else if (preset === 'odd') {
      nextArr = [10, 25, 42, 68, 85];
    } else if (preset === 'descending') {
      nextArr = [95, 80, 65, 45, 30, 15];
    } else if (preset === 'palindrome') {
      nextArr = [12, 34, 56, 56, 34, 12];
    } else {
      nextArr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
    }
    setReverseArr(nextArr);
    triggerReverseUpdate(nextArr);
  };

  /* ─────────────────────────────────────────────────────────────
     1.8 COUNT OCCURRENCES LOGIC (dsa_array_count)
  ───────────────────────────────────────────────────────────── */
  const [countArr, setCountArr] = useState<number[]>([5, 3, 5, 7, 5, 2]);
  const [targetVal, setTargetVal] = useState<number>(5);

  const generateCountSteps = useCallback((arrInput: number[], target: number): ExecutionStep[] => {
    const arr = [...arrInput];
    let count = 0;
    const matchedIndices: number[] = [];
    const steps: ExecutionStep[] = [
      {
        step: 1,
        lineNum: 2,
        explanationEnglish: `Target = ${target}. Initialized count = 0. Beginning linear scan through array.`,
        explanationHinglish: `Target = ${target}, count = 0 shuru kiya. Array scan shuru ho rha hai.`,
        memorySnapshot: {
          type: 'count',
          arr: [...arr],
          target,
          currentIdx: -1,
          count: 0,
          matchedIndices: [],
          isMatch: false,
          stage: 'init',
        },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: target },
      },
    ];

    for (let i = 0; i < arr.length; i++) {
      const isMatch = arr[i] === target;
      if (isMatch) {
        count++;
        matchedIndices.push(i);
      }

      steps.push({
        step: 2 + i,
        lineNum: 5,
        explanationEnglish: `i = ${i} (arr[${i}] = ${arr[i]}): ${
          isMatch ? `EQUAL to target (${target}) → count incremented to ${count}!` : `NOT EQUAL to target (${target}) → count remains ${count}.`
        }`,
        explanationHinglish: `i = ${i} (arr[${i}] = ${arr[i]}): ${
          isMatch ? `Target (${target}) mila → count = ${count}!` : `Target (${target}) nahi mila → count = ${count}.`
        }`,
        memorySnapshot: {
          type: 'count',
          arr: [...arr],
          target,
          currentIdx: i,
          count,
          matchedIndices: [...matchedIndices],
          isMatch,
          stage: 'check',
        },
        animationEvent: isMatch
          ? { type: 'UPDATE_VARIABLE', name: 'count', oldValue: count - 1, newValue: count }
          : { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: i },
      });
    }

    steps.push({
      step: steps.length + 1,
      lineNum: 7,
      explanationEnglish: `Complete! Target value ${target} occurs ${count} time(s) at index/indices [${matchedIndices.join(', ')}].`,
      explanationHinglish: `Complete! Target ${target} array me kul ${count} baar mila (indices [${matchedIndices.join(', ')}]).`,
      memorySnapshot: {
        type: 'count',
        arr: [...arr],
        target,
        currentIdx: -1,
        count,
        matchedIndices: [...matchedIndices],
        isMatch: false,
        stage: 'complete',
      },
      consoleOutput: `Count: ${count}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'count', outputValue: count },
    });

    return steps;
  }, []);

  const triggerCountUpdate = useCallback((arr: number[], target: number) => {
    const steps = generateCountSteps(arr, target);
    setCustomSteps(steps);
    setIsPlaying(false);
    goToStep(0);
  }, [generateCountSteps, setCustomSteps, setIsPlaying, goToStep]);

  const handleCountElementChange = (idx: number, newVal: string) => {
    const parsed = parseInt(newVal, 10);
    const val = isNaN(parsed) ? 0 : Math.min(999, Math.max(-99, parsed));
    const nextArr = [...countArr];
    nextArr[idx] = val;
    setCountArr(nextArr);
    triggerCountUpdate(nextArr, targetVal);
  };

  const handleTargetChange = (newTarget: string) => {
    const parsed = parseInt(newTarget, 10);
    const val = isNaN(parsed) ? 0 : Math.min(999, Math.max(-99, parsed));
    setTargetVal(val);
    triggerCountUpdate(countArr, val);
  };

  const handleCountPreset = (preset: 'default' | 'all' | 'none' | 'alternating' | 'random') => {
    let nextArr: number[];
    let nextTarget = targetVal;
    if (preset === 'default') {
      nextArr = [5, 3, 5, 7, 5, 2];
      nextTarget = 5;
    } else if (preset === 'all') {
      nextArr = [7, 7, 7, 7, 7, 7];
      nextTarget = 7;
    } else if (preset === 'none') {
      nextArr = [10, 20, 30, 40, 50, 60];
      nextTarget = 99;
    } else if (preset === 'alternating') {
      nextArr = [4, 9, 4, 9, 4, 9];
      nextTarget = 4;
    } else {
      const randTarget = Math.floor(Math.random() * 9) + 1;
      nextArr = Array.from({ length: 6 }, () => (Math.random() > 0.5 ? randTarget : Math.floor(Math.random() * 9) + 1));
      nextTarget = randTarget;
    }
    setCountArr(nextArr);
    setTargetVal(nextTarget);
    triggerCountUpdate(nextArr, nextTarget);
  };

  /* ─────────────────────────────────────────────────────────────
     2. MEMORY ADDRESSING LOGIC (dsa_array_declare)
  ───────────────────────────────────────────────────────────── */
  const [dim, setDim] = useState<'1D' | '2D'>('1D');
  const [baseAddress, setBaseAddress] = useState<number>(1000);
  const elementSize = 4;
  const [targetIndex1D, setTargetIndex1D] = useState<number>(3);
  const [order2D, setOrder2D] = useState<'RMO' | 'CMO'>('RMO');
  const [targetRow2D, setTargetRow2D] = useState<number>(1);
  const [targetCol2D, setTargetCol2D] = useState<number>(2);

  const generate1DSteps = useCallback((bAddr: number, tIdx: number): ExecutionStep[] => {
    const val = ARRAY_1D_ADDR[tIdx] ?? 68;
    const offset = tIdx * elementSize;
    const addr = bAddr + offset;

    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `1D Array [size 6]: Base = ${bAddr}, w = ${elementSize}B, Target A[${tIdx}] = ${val}.`,
      explanationHinglish: `1D Array [size 6]: Base = ${bAddr}, w = ${elementSize}B, Target A[${tIdx}] = ${val}.`,
      memorySnapshot: {
        dim: '1D',
        arr1D: ARRAY_1D_ADDR,
        baseAddress: bAddr,
        elementSize,
        targetIndex: tIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        stage: 'given',
      },
      consoleOutput: `> 1D Array | Base=${bAddr} w=${elementSize}B Target=A[${tIdx}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    steps.push({
      step: stepCount++,
      lineNum: 2,
      explanationEnglish: `Formula: Loc(A[${tIdx}]) = Base + (i - LB) * w = ${bAddr} + (${tIdx} - 0) * ${elementSize}.`,
      explanationHinglish: `Formula: Loc(A[${tIdx}]) = Base + (i - LB) * w = ${bAddr} + (${tIdx} - 0) * ${elementSize}.`,
      memorySnapshot: {
        dim: '1D',
        arr1D: ARRAY_1D_ADDR,
        baseAddress: bAddr,
        elementSize,
        targetIndex: tIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        stage: 'formula',
      },
      consoleOutput: `> Loc(A[${tIdx}]) = ${bAddr} + (${tIdx} * ${elementSize})`,
      animationEvent: { type: 'NONE' } as any,
    });

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Offset = ${tIdx} * ${elementSize}B = ${offset} Bytes.`,
      explanationHinglish: `Offset = ${tIdx} * ${elementSize}B = ${offset} Bytes.`,
      memorySnapshot: {
        dim: '1D',
        arr1D: ARRAY_1D_ADDR,
        baseAddress: bAddr,
        elementSize,
        targetIndex: tIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        stage: 'offset',
      },
      consoleOutput: `> Offset = ${offset} Bytes`,
      animationEvent: { type: 'NONE' } as any,
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Address = ${bAddr} + ${offset} = ${addr}. Element A[${tIdx}] = ${val} located.`,
      explanationHinglish: `Address = ${bAddr} + ${offset} = ${addr}. Element A[${tIdx}] = ${val} located.`,
      memorySnapshot: {
        dim: '1D',
        arr1D: ARRAY_1D_ADDR,
        baseAddress: bAddr,
        elementSize,
        targetIndex: tIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        stage: 'located',
      },
      consoleOutput: `> Address(A[${tIdx}]) = ${addr} [LOCATED: ${val}]`,
      animationEvent: {
        type: 'HIGHLIGHT_ARRAY_INDEX',
        arrayName: 'arr',
        index: tIdx,
      } as any,
    });

    return steps;
  }, []);

  const generate2DSteps = useCallback((
    bAddr: number,
    order: 'RMO' | 'CMO',
    r: number,
    c: number
  ): ExecutionStep[] => {
    const isRMO = order === 'RMO';
    const numRows = 3;
    const numCols = 3;
    const val = MATRIX_2D_ADDR[r]?.[c] ?? 60;
    const linearIdx = isRMO ? r * numCols + c : c * numRows + r;
    const offset = linearIdx * elementSize;
    const addr = bAddr + offset;

    const linearMemoryCells: Array<{ row: number; col: number; val: number; k: number; addr: number }> = [];
    if (isRMO) {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          const k = i * numCols + j;
          linearMemoryCells.push({
            row: i,
            col: j,
            val: MATRIX_2D_ADDR[i][j],
            k,
            addr: bAddr + k * elementSize,
          });
        }
      }
    } else {
      for (let j = 0; j < numCols; j++) {
        for (let i = 0; i < numRows; i++) {
          const k = j * numRows + i;
          linearMemoryCells.push({
            row: i,
            col: j,
            val: MATRIX_2D_ADDR[i][j],
            k,
            addr: bAddr + k * elementSize,
          });
        }
      }
    }

    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 1,
      explanationEnglish: `2D Matrix 3x3 | ${order}. Base = ${bAddr}, w = ${elementSize}B, Target A[${r}][${c}] = ${val}.`,
      explanationHinglish: `2D Matrix 3x3 | ${order}. Base = ${bAddr}, w = ${elementSize}B, Target A[${r}][${c}] = ${val}.`,
      memorySnapshot: {
        dim: '2D',
        order,
        matrix2D: MATRIX_2D_ADDR,
        numRows,
        numCols,
        baseAddress: bAddr,
        elementSize,
        targetRow: r,
        targetCol: c,
        linearIndex: linearIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        linearMemoryCells,
        stage: 'given',
      },
      consoleOutput: `> 2D Matrix 3x3 | ${order} | Target=A[${r}][${c}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    steps.push({
      step: stepCount++,
      lineNum: 2,
      explanationEnglish: isRMO
        ? `RMO: Loc(A[${r}][${c}]) = Base + [(i * C) + j] * w = ${bAddr} + [(${r} * 3) + ${c}] * ${elementSize}.`
        : `CMO: Loc(A[${r}][${c}]) = Base + [(j * R) + i] * w = ${bAddr} + [(${c} * 3) + ${r}] * ${elementSize}.`,
      explanationHinglish: isRMO
        ? `RMO: Loc(A[${r}][${c}]) = Base + [(i * C) + j] * w = ${bAddr} + [(${r} * 3) + ${c}] * ${elementSize}.`
        : `CMO: Loc(A[${r}][${c}]) = Base + [(j * R) + i] * w = ${bAddr} + [(${c} * 3) + ${r}] * ${elementSize}.`,
      memorySnapshot: {
        dim: '2D',
        order,
        matrix2D: MATRIX_2D_ADDR,
        numRows,
        numCols,
        baseAddress: bAddr,
        elementSize,
        targetRow: r,
        targetCol: c,
        linearIndex: linearIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        linearMemoryCells,
        stage: 'formula',
      },
      consoleOutput: isRMO
        ? `> Formula: ${bAddr} + [(${r} * 3) + ${c}] * ${elementSize}`
        : `> Formula: ${bAddr} + [(${c} * 3) + ${r}] * ${elementSize}`,
      animationEvent: { type: 'NONE' } as any,
    });

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Preceding elements k = ${linearIdx}. Offset = ${linearIdx} * ${elementSize}B = ${offset} Bytes.`,
      explanationHinglish: `Preceding elements k = ${linearIdx}. Offset = ${linearIdx} * ${elementSize}B = ${offset} Bytes.`,
      memorySnapshot: {
        dim: '2D',
        order,
        matrix2D: MATRIX_2D_ADDR,
        numRows,
        numCols,
        baseAddress: bAddr,
        elementSize,
        targetRow: r,
        targetCol: c,
        linearIndex: linearIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        linearMemoryCells,
        stage: 'offset',
      },
      consoleOutput: `> Preceding Elements k = ${linearIdx} | Offset = ${offset} Bytes`,
      animationEvent: { type: 'NONE' } as any,
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Address = ${bAddr} + ${offset} = ${addr}. Target element A[${r}][${c}] = ${val} located.`,
      explanationHinglish: `Address = ${bAddr} + ${offset} = ${addr}. Target element A[${r}][${c}] = ${val} located.`,
      memorySnapshot: {
        dim: '2D',
        order,
        matrix2D: MATRIX_2D_ADDR,
        numRows,
        numCols,
        baseAddress: bAddr,
        elementSize,
        targetRow: r,
        targetCol: c,
        linearIndex: linearIdx,
        offsetBytes: offset,
        finalAddress: addr,
        targetVal: val,
        linearMemoryCells,
        stage: 'located',
      },
      consoleOutput: `> Address(A[${r}][${c}]) = ${addr} [LOCATED: ${val}]`,
      animationEvent: {
        type: 'HIGHLIGHT_ARRAY_INDEX',
        arrayName: 'arr',
        index: linearIdx,
      } as any,
    });

    return steps;
  }, []);

  const triggerAddrUpdate = useCallback((
    currentDim: '1D' | '2D',
    bAddr: number,
    tIdx1D: number,
    order: 'RMO' | 'CMO',
    r2D: number,
    c2D: number
  ) => {
    const steps = currentDim === '1D'
      ? generate1DSteps(bAddr, tIdx1D)
      : generate2DSteps(bAddr, order, r2D, c2D);
    setCustomSteps(steps);
    setIsPlaying(false);
  }, [generate1DSteps, generate2DSteps, setCustomSteps, setIsPlaying]);

  const handleDimChange = (newDim: '1D' | '2D') => {
    setDim(newDim);
    triggerAddrUpdate(newDim, baseAddress, targetIndex1D, order2D, targetRow2D, targetCol2D);
    setTimeout(() => goToStep(0), 10);
  };

  const handle1DIndexChange = (idx: number) => {
    setTargetIndex1D(idx);
    triggerAddrUpdate('1D', baseAddress, idx, order2D, targetRow2D, targetCol2D);
    setTimeout(() => goToStep(0), 10);
  };

  const handleOrderChange = (newOrder: 'RMO' | 'CMO') => {
    setOrder2D(newOrder);
    triggerAddrUpdate('2D', baseAddress, targetIndex1D, newOrder, targetRow2D, targetCol2D);
    setTimeout(() => goToStep(0), 10);
  };

  const handleCellSelect2D = (r: number, c: number) => {
    setTargetRow2D(r);
    setTargetCol2D(c);
    triggerAddrUpdate('2D', baseAddress, targetIndex1D, order2D, r, c);
    setTimeout(() => goToStep(0), 10);
  };

  const handleBaseChange = (b: number) => {
    setBaseAddress(b);
    triggerAddrUpdate(dim, b, targetIndex1D, order2D, targetRow2D, targetCol2D);
    setTimeout(() => goToStep(0), 10);
  };

  const handleCalculateAddr = () => {
    triggerAddrUpdate(dim, baseAddress, targetIndex1D, order2D, targetRow2D, targetCol2D);
    setTimeout(() => goToStep(3), 30);
  };

  // Mount initialization based on active lesson
  useEffect(() => {
    if (isMinMaxLesson) {
      const steps = generateMinMaxSteps(minMaxDim, elements8);
      setCustomSteps(steps);
      setIsPlaying(false);
      setTimeout(() => goToStep(0), 20);
    } else if (isReverseLesson) {
      const steps = generateReverseSteps(reverseArr);
      setCustomSteps(steps);
      setIsPlaying(false);
      setTimeout(() => goToStep(0), 20);
    } else if (isCountLesson) {
      const steps = generateCountSteps(countArr, targetVal);
      setCustomSteps(steps);
      setIsPlaying(false);
      setTimeout(() => goToStep(0), 20);
    } else {
      const steps = generate1DSteps(1000, 3);
      setCustomSteps(steps);
      setIsPlaying(false);
      setTimeout(() => goToStep(0), 20);
    }
  }, [lesson?.id, isMinMaxLesson, isReverseLesson, isCountLesson, generateMinMaxSteps, generateReverseSteps, generateCountSteps, generate1DSteps, setCustomSteps, setIsPlaying, goToStep]);

  /* ─────────────────────────────────────────────────────────────
     RENDER: MIN & MAX PANEL
  ───────────────────────────────────────────────────────────── */
  if (isMinMaxLesson) {
    const curMin = Math.min(...elements8);
    const curMax = Math.max(...elements8);

    return (
      <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 font-mono text-neutral-200 select-none">
        {/* Header with Badges */}
        <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold text-neutral-100 tracking-wider">
            MIN & MAX FINDER
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] text-cyan-400 font-bold border border-cyan-500/40 px-1.5 py-0.5 bg-cyan-950/40">
              SIZE 8
            </span>
            <span className="text-[9.5px] text-neutral-400 font-bold border border-neutral-700/60 px-1.5 py-0.5 bg-neutral-900/60">
              O(N) PASS
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2.5">
          {/* Dimension Selector (1D vs 2D) */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
              Array Layout:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleMinMaxDimChange('1D')}
                className={`py-1.5 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                  minMaxDim === '1D'
                    ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                1D Array (8 Elements)
              </button>
              <button
                onClick={() => handleMinMaxDimChange('2D')}
                className={`py-1.5 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                  minMaxDim === '2D'
                    ? 'bg-purple-500 text-neutral-950 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                2D Matrix (2 x 4 = 8)
              </button>
            </div>
          </div>

          {/* Adjustable 8 Elements Grid */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                Adjust 8 Elements:
              </span>
              <span className="text-neutral-500 text-[8.5px]">
                {minMaxDim === '1D' ? '[0..7]' : '[0..1] x [0..3]'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {elements8.map((val, idx) => {
                const r = Math.floor(idx / 4);
                const c = idx % 4;
                const coordLabel = minMaxDim === '1D' ? `A[${idx}]` : `A[${r}][${c}]`;
                return (
                  <div key={idx} className="flex flex-col items-center bg-[#0d111d] border border-neutral-800/80 p-1">
                    <span className="text-[8px] text-neutral-400 font-semibold mb-0.5">
                      {coordLabel}
                    </span>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleElementChange(idx, e.target.value)}
                      className="w-full text-center text-[11px] font-bold text-neutral-100 bg-[#060810] border border-neutral-700/70 focus:border-cyan-400 focus:outline-none py-1 px-0.5 rounded-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Presets Grid (2x2) */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
              Array Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handlePresetRandom}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Randomize Values
              </button>
              <button
                onClick={handlePresetReset}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Default Initial
              </button>
              <button
                onClick={handlePresetAscending}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Ascending (Min at [0])
              </button>
              <button
                onClick={handlePresetDescending}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Descending (Max at [0])
              </button>
            </div>
          </div>

          {/* Live Extrema & Algorithm Specs Card */}
          <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[9px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800/80 pb-1">
              <span>Live Extrema:</span>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-bold text-[9px]">
                  MIN = {curMin}
                </span>
                <span className="px-1.5 py-0.2 bg-rose-950/80 border border-rose-500/60 text-rose-300 font-bold text-[9px]">
                  MAX = {curMax}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[8.5px] text-neutral-400 pt-0.5">
              <span>Strategy: Single-Pass Scan</span>
              <span className="text-cyan-400 font-bold">7 Comparisons</span>
            </div>
            <div className="flex items-center justify-between text-[8.5px] text-neutral-400">
              <span>Time: O(N)</span>
              <span className="text-emerald-400 font-bold">Aux Space: O(1)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     RENDER: IN-PLACE ARRAY REVERSAL PANEL (dsa_array_reverse)
  ───────────────────────────────────────────────────────────── */
  if (isReverseLesson) {
    const isOdd = reverseArr.length % 2 === 1;

    return (
      <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 font-mono text-neutral-200 select-none">
        {/* Header with Badges */}
        <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold text-neutral-100 tracking-wider">
            IN-PLACE ARRAY REVERSAL
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] text-cyan-400 font-bold border border-cyan-500/40 px-1.5 py-0.5 bg-cyan-950/40">
              SIZE {reverseArr.length}
            </span>
            <span className="text-[9.5px] text-purple-400 font-bold border border-purple-500/40 px-1.5 py-0.5 bg-purple-950/40">
              TWO POINTERS
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2.5">
          {/* Length Toggle */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
              Array Length:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleReverseSetSize(6)}
                className={`py-1.5 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                  reverseArr.length === 6
                    ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                6 Elements (Even Pairs)
              </button>
              <button
                onClick={() => handleReverseSetSize(5)}
                className={`py-1.5 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                  reverseArr.length === 5
                    ? 'bg-purple-500 text-neutral-950 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                5 Elements (Odd with Pivot)
              </button>
            </div>
          </div>

          {/* Edit Array Elements */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                Adjust Array Elements:
              </span>
              <span className="text-neutral-500 text-[8.5px]">
                [0..{reverseArr.length - 1}]
              </span>
            </div>

            <div className={`grid gap-1.5 pt-0.5 ${reverseArr.length === 5 ? 'grid-cols-5' : 'grid-cols-6'}`}>
              {reverseArr.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center bg-[#0d111d] border border-neutral-800/80 p-1">
                  <span className="text-[8px] text-neutral-400 font-semibold mb-0.5">
                    A[{idx}]
                  </span>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => handleReverseElementChange(idx, e.target.value)}
                    className="w-full text-center text-[11px] font-bold text-neutral-100 bg-[#060810] border border-neutral-700/70 focus:border-cyan-400 focus:outline-none py-1 px-0.5 rounded-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Presets Grid (2x2) */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
              Reversal Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleReversePreset('default')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Default (10..60)
              </button>
              <button
                onClick={() => handleReversePreset('palindrome')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Palindrome Mirror
              </button>
              <button
                onClick={() => handleReversePreset('descending')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Descending Values
              </button>
              <button
                onClick={() => handleReversePreset('random')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Randomize 6
              </button>
            </div>
          </div>

          {/* Algorithm Strategy Card */}
          <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[9px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800/80 pb-1">
              <span>Two-Pointer Logic:</span>
              <span className="text-cyan-400 font-bold">while (left &lt; right)</span>
            </div>
            <div className="flex items-center justify-between text-[8.5px] text-neutral-400 pt-0.5">
              <span>Swap Count:</span>
              <span className="text-cyan-300 font-bold">{Math.floor(reverseArr.length / 2)} Swaps</span>
            </div>
            <div className="flex items-center justify-between text-[8.5px] text-neutral-400">
              <span>Auxiliary Array:</span>
              <span className="text-emerald-400 font-bold">0 Bytes (True In-Place)</span>
            </div>
            <div className="flex items-center justify-between text-[8.5px] text-neutral-400">
              <span>Time Complexity:</span>
              <span className="text-purple-300 font-bold">O(N)</span>
            </div>
            {isOdd && (
              <div className="text-[8px] text-amber-400/90 bg-amber-950/40 border border-amber-600/40 px-1.5 py-0.5 mt-0.5">
                Note: Index [{Math.floor(reverseArr.length / 2)}] is center pivot and remains untouched.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     RENDER: COUNT OCCURRENCES PANEL (dsa_array_count)
  ───────────────────────────────────────────────────────────── */
  if (isCountLesson) {
    const liveMatches = countArr.filter((x) => x === targetVal).length;

    return (
      <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 font-mono text-neutral-200 select-none">
        {/* Header with Badges */}
        <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold text-neutral-100 tracking-wider">
            FREQUENCY COUNTER
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] text-cyan-400 font-bold border border-cyan-500/40 px-1.5 py-0.5 bg-cyan-950/40">
              SIZE {countArr.length}
            </span>
            <span className="text-[9.5px] text-emerald-400 font-bold border border-emerald-500/40 px-1.5 py-0.5 bg-emerald-950/40">
              LINEAR SCAN
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2.5">
          {/* Target Value Selector */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
              Target Value to Count:
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => handleTargetChange(String(targetVal - 1))}
                className="w-8 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={targetVal}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="flex-1 text-center text-sm font-black text-cyan-300 bg-[#060810] border border-cyan-500/60 focus:border-cyan-400 focus:outline-none py-1 px-1 rounded-none"
              />
              <button
                onClick={() => handleTargetChange(String(targetVal + 1))}
                className="w-8 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Adjust Array Elements */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                Array Elements:
              </span>
              <span className="text-neutral-500 text-[8.5px]">
                [0..{countArr.length - 1}]
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 pt-0.5">
              {countArr.map((val, idx) => {
                const isTargetMatch = val === targetVal;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center border p-1 transition-colors ${
                      isTargetMatch
                        ? 'bg-[#051c14] border-emerald-500/80'
                        : 'bg-[#0d111d] border-neutral-800/80'
                    }`}
                  >
                    <span className="text-[8px] text-neutral-400 font-semibold mb-0.5">
                      A[{idx}]
                    </span>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => handleCountElementChange(idx, e.target.value)}
                      className={`w-full text-center text-[11px] font-bold bg-[#060810] border focus:outline-none py-1 px-0.5 rounded-none ${
                        isTargetMatch
                          ? 'text-emerald-300 border-emerald-500/70 focus:border-emerald-400'
                          : 'text-neutral-100 border-neutral-700/70 focus:border-cyan-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Presets Grid (2x2) */}
          <div className="flex flex-col gap-1 border border-neutral-800/80 p-2 bg-[#0a0d14]">
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
              Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleCountPreset('default')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Default (Target=5)
              </button>
              <button
                onClick={() => handleCountPreset('all')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                All (Target=7)
              </button>
              <button
                onClick={() => handleCountPreset('none')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Zero (Target=99)
              </button>
              <button
                onClick={() => handleCountPreset('alternating')}
                className="py-1 text-[9.5px] font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 cursor-pointer transition-colors"
              >
                Alternating (Target=4)
              </button>
            </div>
          </div>

          {/* Clean Metric Badge */}
          <div className="flex items-center justify-between border border-neutral-800/80 p-2 bg-[#0a0d14] text-[9.5px] font-bold">
            <span className="text-neutral-400">Total Matches:</span>
            <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300">
              {liveMatches} {liveMatches === 1 ? 'MATCH' : 'MATCHES'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     RENDER: MEMORY ADDRESSING PANEL (dsa_array_declare)
     More colorful, sleek, clutter-free
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="h-full flex flex-col bg-[#07090e] border border-neutral-800 font-mono text-neutral-200 select-none">
      {/* Header (No dot icon) */}
      <div className="px-3 py-2 bg-[#040508] border-b border-neutral-800 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold text-neutral-100 tracking-wider">
          ARRAY ADDRESSING
        </span>
        <span className="text-[10px] text-indigo-400 font-bold border border-indigo-500/40 px-1.5 py-0.5 bg-indigo-950/40">
          RAM LOCATION
        </span>
      </div>

      {/* Body Controls */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {/* Step 1: 1D vs 2D Selector */}
        <div className="flex flex-col gap-1 border border-neutral-800/80 p-1.5 bg-[#0a0d14]">
          <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
            Dimension:
          </span>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleDimChange('1D')}
              className={`py-1.5 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                dim === '1D'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              1D Array (6 Elements)
            </button>
            <button
              onClick={() => handleDimChange('2D')}
              className={`py-1.5 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                dim === '2D'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              2D Array (3x3 RMO/CMO)
            </button>
          </div>
        </div>

        {/* 1D Target Element Selector */}
        {dim === '1D' && (
          <div className="flex flex-col gap-1.5 border border-neutral-800/80 p-1.5 bg-[#0a0d14]">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                Target Element A[i]:
              </span>
              <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-500/50 px-1.5 py-0.5">
                A[{targetIndex1D}] = {ARRAY_1D_ADDR[targetIndex1D]}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1 pt-0.5">
              {[0, 1, 2, 3, 4, 5].map(idx => {
                const isSelected = targetIndex1D === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handle1DIndexChange(idx)}
                    className={`py-1.5 text-center text-[10px] font-bold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div>[{idx}]</div>
                    <div className="text-[9px] opacity-75">{ARRAY_1D_ADDR[idx]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2D Order and Target Selector */}
        {dim === '2D' && (
          <>
            {/* RMO vs CMO Toggle */}
            <div className="flex flex-col gap-1 border border-neutral-800/80 p-1.5 bg-[#0a0d14]">
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
                Addressing Order:
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => handleOrderChange('RMO')}
                  className={`py-1 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                    order2D === 'RMO'
                      ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  Row Major (RMO)
                </button>
                <button
                  onClick={() => handleOrderChange('CMO')}
                  className={`py-1 text-[10px] font-bold tracking-tight transition-colors cursor-pointer border ${
                    order2D === 'CMO'
                      ? 'bg-purple-500 text-neutral-950 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                  }`}
                >
                  Column Major (CMO)
                </button>
              </div>
            </div>

            {/* Target Cell 3x3 Selector */}
            <div className="flex flex-col gap-1 border border-neutral-800/80 p-1.5 bg-[#0a0d14]">
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                  Target Cell A[i][j]:
                </span>
                <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-500/50 px-1.5 py-0.5">
                  A[{targetRow2D}][{targetCol2D}] = {MATRIX_2D_ADDR[targetRow2D][targetCol2D]}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-0.5">
                {[0, 1, 2].map(r =>
                  [0, 1, 2].map(c => {
                    const isSelected = targetRow2D === r && targetCol2D === c;
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleCellSelect2D(r, c)}
                        className={`py-1 text-center text-[10px] font-bold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        [{r}][{c}] = {MATRIX_2D_ADDR[r][c]}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* Base Address Preset Options */}
        <div className="flex flex-col gap-1 border border-neutral-800/80 p-1.5 bg-[#0a0d14] text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-[9px] uppercase tracking-wider font-semibold">
              Base Address (B):
            </span>
            <span className="text-indigo-300 font-bold bg-indigo-950/60 border border-indigo-500/40 px-1.5 py-0.5">
              {baseAddress}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[1000, 2000, 4000].map(b => (
              <button
                key={b}
                onClick={() => handleBaseChange(b)}
                className={`py-1 text-[9px] font-bold border cursor-pointer transition-colors ${
                  baseAddress === b
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[9px] text-neutral-400">
            <span>{dim === '1D' ? 'Size: 6 elements' : 'Grid: 3 x 3'}</span>
            <span className="text-neutral-300 font-semibold">w = {elementSize}B (int)</span>
          </div>
        </div>

        {/* Calculate Action Button */}
        <div className="mt-auto pt-1">
          <button
            onClick={handleCalculateAddr}
            className="w-full py-2 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer active:scale-[0.99] transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400"
          >
            Calculate Location
          </button>
        </div>
      </div>
    </div>
  );
};
