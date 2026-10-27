import type { LessonProgram, ExecutionStep } from '../types';

// Helper: make a simple line of code tokens
type T = { type: 'keyword' | 'function' | 'variable' | 'string' | 'number' | 'operator' | 'punctuation' | 'comment' | 'parameter' | 'text'; value: string; paramId?: string };
const line = (lineNum: number, tokens: T[]) => ({ lineNum, tokens });
const kw = (v: string): T => ({ type: 'keyword', value: v });
const fn = (v: string): T => ({ type: 'function', value: v });
const va = (v: string, paramId?: string): T => ({ type: 'variable', value: v, paramId });
const nu = (v: string, paramId?: string): T => ({ type: 'number', value: v, paramId });
const op = (v: string): T => ({ type: 'operator', value: v });
const pu = (v: string): T => ({ type: 'punctuation', value: v });
const tx = (v: string): T => ({ type: 'text', value: v });
const st = (v: string): T => ({ type: 'string', value: v });
const cm = (v: string): T => ({ type: 'comment', value: v });

// ─── TOPIC 01: ARRAYS & MEMORY ────────────────────────────────────────────────

export const dsa_array_declare: LessonProgram = {
  id: 'dsa_array_declare', language: 'dsa', topic: 'array_operations', lessonNumber: 1,
  friendlyName: 'Array Memory Addressing: 1D & 2D (RMO/CMO)',
  learningObjective: 'Calculate physical memory addresses in 1D contiguous RAM and 2D arrays using Row Major Order (RMO) and Column Major Order (CMO).',
  lines: [
    line(1, [cm('// 1D & 2D Array Memory Addressing Formulas (Contiguous RAM):')]),
    line(2, [cm('// 1D:  Loc(A[i])    = Base + (i - LB) * w')]),
    line(3, [cm('// RMO: Loc(A[i][j]) = Base + [(i - LBr) * C + (j - LBc)] * w')]),
    line(4, [cm('// CMO: Loc(A[i][j]) = Base + [(j - LBc) * R + (i - LBr)] * w')]),
    line(5, [kw('int'), tx(' '), va('arr'), pu('['), nu('6'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('10'), pu(','), tx(' '), nu('25'), pu(','), tx(' '), nu('42'), pu(','), tx(' '), nu('68'), pu(','), tx(' '), nu('85'), pu(','), tx(' '), nu('99'), pu('}'), pu(';')]),
    line(6, [kw('int'), tx(' '), va('Base'), tx(' '), op('='), tx(' '), nu('1000'), pu(';'), tx(' '), kw('int'), tx(' '), va('w'), tx(' '), op('='), tx(' '), nu('4'), pu(';'), tx(' '), cm('// 4 bytes per element')]),
    line(7, [kw('int'), tx(' '), va('i'), tx(' '), op('='), tx(' '), nu('3'), pu(';'), tx(' '), cm('// Target element: arr[3] = 68')]),
    line(8, [kw('int'), tx(' '), va('offset'), tx(' '), op('='), tx(' '), va('i'), tx(' '), op('*'), tx(' '), va('w'), pu(';'), tx(' '), cm('// 3 * 4 = 12 Bytes')]),
    line(9, [kw('int'), tx(' '), va('address'), tx(' '), op('='), tx(' '), va('Base'), tx(' '), op('+'), tx(' '), va('offset'), pu(';'), tx(' '), cm('// 1000 + 12 = 1012')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const bAddr = 1000, wSize = 4, tIdx = 3, targetVal = 68;
    const offsetBytes = tIdx * wSize; // 12
    const finalAddress = bAddr + offsetBytes; // 1012
    const arr1D = [10, 25, 42, 68, 85, 99];
    return [
      {
        step: 1, lineNum: 5,
        explanationEnglish: 'Given 1D Array [size 6]. Base = 1000, w = 4B. Target element arr[3] = 68.',
        explanationHinglish: '1D Array [size 6] diya hai. Base = 1000, w = 4B. Target element arr[3] = 68.',
        memorySnapshot: { dim: '1D', arr1D, baseAddress: bAddr, elementSize: wSize, targetIndex: tIdx, targetVal, offsetBytes, finalAddress, stage: 'given' },
        consoleOutput: '> 1D Array | Base=1000 w=4B Target=A[3]',
        animationEvent: { type: 'NONE' } as any,
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: '1D Formula: Loc(A[i]) = Base + (i - LB) * w = 1000 + (3 - 0) * 4.',
        explanationHinglish: '1D Formula: Loc = Base + (i - LB) * w = 1000 + (3 - 0) * 4.',
        memorySnapshot: { dim: '1D', arr1D, baseAddress: bAddr, elementSize: wSize, targetIndex: tIdx, targetVal, offsetBytes, finalAddress, stage: 'formula' },
        consoleOutput: '> Loc(A[3]) = 1000 + (3 * 4)',
        animationEvent: { type: 'NONE' } as any,
      },
      {
        step: 3, lineNum: 8,
        explanationEnglish: 'Offset = 3 * 4B = 12 Bytes.',
        explanationHinglish: 'Offset = 3 * 4B = 12 Bytes.',
        memorySnapshot: { dim: '1D', arr1D, baseAddress: bAddr, elementSize: wSize, targetIndex: tIdx, targetVal, offsetBytes, finalAddress, stage: 'offset' },
        consoleOutput: '> Offset = 12 Bytes',
        animationEvent: { type: 'NONE' } as any,
      },
      {
        step: 4, lineNum: 9,
        explanationEnglish: 'Address = 1000 + 12 = 1012. Element arr[3] = 68 located.',
        explanationHinglish: 'Address = 1000 + 12 = 1012. Element arr[3] = 68 locate hua.',
        memorySnapshot: { dim: '1D', arr1D, baseAddress: bAddr, elementSize: wSize, targetIndex: tIdx, targetVal, offsetBytes, finalAddress, stage: 'located' },
        consoleOutput: '> Address(A[3]) = 1012 [LOCATED: 68]',
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: tIdx } as any,
      },
    ];
  },
  executionSteps: [],
};

export const dsa_array_max_min: LessonProgram = {
  id: 'dsa_array_max_min', language: 'dsa', topic: 'array_operations', lessonNumber: 2,
  friendlyName: 'Find Minimum & Maximum: 1D & 2D Array',
  learningObjective: 'Traverse 8 elements in 1D array or 2D matrix (2x4) in a single pass to track the minimum and maximum values.',
  lines: [
    line(1, [cm('// Find Minimum & Maximum in Array (8 elements, 1D & 2D):')]),
    line(2, [kw('int'), tx(' '), va('arr'), pu('['), nu('8'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('42'), pu(','), tx(' '), nu('17'), pu(','), tx(' '), nu('89'), pu(','), tx(' '), nu('5'), pu(','), tx(' '), nu('63'), pu(','), tx(' '), nu('28'), pu(','), tx(' '), nu('94'), pu(','), tx(' '), nu('31'), pu('}'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('minVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), nu('0'), pu(']'), pu(';'), tx(' '), cm('// Initial min = 42')]),
    line(4, [kw('int'), tx(' '), va('maxVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), nu('0'), pu(']'), pu(';'), tx(' '), cm('// Initial max = 42')]),
    line(5, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('1'), pu(';'), tx(' '), va('i'), op('<'), nu('8'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(6, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('<'), tx(' '), va('minVal'), pu(')'), tx(' '), va('minVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('i'), pu(']'), pu(';')]),
    line(7, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('>'), tx(' '), va('maxVal'), pu(')'), tx(' '), va('maxVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('i'), pu(']'), pu(';')]),
    line(8, [pu('}')]),
    line(9, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Min: "'), tx(' '), op('<<'), tx(' '), va('minVal'), tx(' '), op('<<'), tx(' '), st('" | Max: "'), tx(' '), op('<<'), tx(' '), va('maxVal'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [42, 17, 89, 5, 63, 28, 94, 31];
    let minVal = arr[0], maxVal = arr[0];
    let minIdx = 0, maxIdx = 0;
    const steps: ExecutionStep[] = [];

    // Step 1: Initialize min and max at index 0
    steps.push({
      step: 1, lineNum: 3,
      explanationEnglish: `Initialize: minVal = arr[0] (${minVal}) at [0], maxVal = arr[0] (${maxVal}) at [0].`,
      explanationHinglish: `Shuruat: minVal = arr[0] (${minVal}), maxVal = arr[0] (${maxVal}).`,
      memorySnapshot: {
        type: 'min_max',
        dim: '1D',
        arr,
        matrix2D: [arr.slice(0, 4), arr.slice(4, 8)],
        currentIdx: 0,
        currentVal: arr[0],
        minVal,
        maxVal,
        minIdx,
        maxIdx,
        updatedMin: false,
        updatedMax: false,
        stage: 'init',
      },
      consoleOutput: `> Initial: min = ${minVal} at [0], max = ${maxVal} at [0]`,
      animationEvent: { type: 'NONE' } as any,
    });

    // Step 2 to 8: Loop through elements 1 to 7
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

      const reason = updatedMin
        ? `arr[${i}]=${val} < min → New MIN = ${minVal}!`
        : updatedMax
        ? `arr[${i}]=${val} > max → New MAX = ${maxVal}!`
        : `arr[${i}]=${val} between ${minVal} and ${maxVal}. No change.`;

      steps.push({
        step: i + 1,
        lineNum: updatedMin ? 6 : updatedMax ? 7 : 5,
        explanationEnglish: `i = ${i} (arr[${i}] = ${val}): ${reason} Current Min: ${minVal}, Current Max: ${maxVal}.`,
        explanationHinglish: `i = ${i} par arr[${i}] = ${val}: ${reason} Min: ${minVal}, Max: ${maxVal}.`,
        memorySnapshot: {
          type: 'min_max',
          dim: '1D',
          arr,
          matrix2D: [arr.slice(0, 4), arr.slice(4, 8)],
          currentIdx: i,
          currentVal: val,
          minVal,
          maxVal,
          minIdx,
          maxIdx,
          updatedMin,
          updatedMax,
          stage: 'scan',
        },
        consoleOutput: `> [${i}] = ${val} | Min: ${minVal} ([${minIdx}]), Max: ${maxVal} ([${maxIdx}])`,
        animationEvent: {
          type: 'HIGHLIGHT_ARRAY_INDEX',
          arrayName: 'arr',
          index: i,
        } as any,
      });
    }

    // Final Step: Complete summary
    steps.push({
      step: 9,
      lineNum: 9,
      explanationEnglish: `Complete! Minimum element = ${minVal} at index [${minIdx}], Maximum element = ${maxVal} at index [${maxIdx}].`,
      explanationHinglish: `Poora hua! Minimum element = ${minVal} (index [${minIdx}]), Maximum element = ${maxVal} (index [${maxIdx}]).`,
      memorySnapshot: {
        type: 'min_max',
        dim: '1D',
        arr,
        matrix2D: [arr.slice(0, 4), arr.slice(4, 8)],
        currentIdx: -1,
        currentVal: null,
        minVal,
        maxVal,
        minIdx,
        maxIdx,
        updatedMin: false,
        updatedMax: false,
        stage: 'complete',
      },
      consoleOutput: `> COMPLETE | MIN = ${minVal} at [${minIdx}] | MAX = ${maxVal} at [${maxIdx}]`,
      animationEvent: { type: 'NONE' } as any,
    });

    return steps;
  },
  executionSteps: [],
};

export const dsa_array_reverse: LessonProgram = {
  id: 'dsa_array_reverse', language: 'dsa', topic: 'array_operations', lessonNumber: 3,
  friendlyName: 'In-place Array Reversal (Two Pointers)',
  learningObjective: 'Use two pointer technique — swap elements from both ends moving inward until they meet.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('10'), pu(','), tx(' '), nu('20'), pu(','), tx(' '), nu('30'), pu(','), tx(' '), nu('40'), pu(','), tx(' '), nu('50'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('left'), tx(' '), op('='), tx(' '), nu('0'), pu(','), tx(' '), va('right'), tx(' '), op('='), tx(' '), nu('4'), pu(';')]),
    line(3, [kw('while'), pu('('), va('left'), tx(' '), op('<'), tx(' '), va('right'), pu(')'), tx(' {')]),
    line(4, [tx('    '), kw('int'), tx(' '), va('temp'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('left'), pu(']'), pu(';')]),
    line(5, [tx('    '), va('arr'), pu('['), va('left'), pu(']'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('right'), pu(']'), pu(';')]),
    line(6, [tx('    '), va('arr'), pu('['), va('right'), pu(']'), tx(' '), op('='), tx(' '), va('temp'), pu(';')]),
    line(7, [tx('    '), va('left'), op('++'), pu(';'), tx(' '), va('right'), op('--'), pu(';')]),
    line(8, [pu('}')]),
    line(9, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Reversed"'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [10, 20, 30, 40, 50, 60];
    let left = 0, right = arr.length - 1;
    const settledIndices: number[] = [];
    const steps: ExecutionStep[] = [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: `Array arr[${arr.length}] = {${arr.join(', ')}} initialized in memory.`,
        explanationHinglish: `Array arr[${arr.length}] = {${arr.join(', ')}} memory me store hua.`,
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
        explanationEnglish: `left = 0 (pointing to ${arr[0]}), right = ${right} (pointing to ${arr[right]}). Two pointers initialized at endpoints.`,
        explanationHinglish: `left = 0 (${arr[0]}), right = ${right} (${arr[right]}). Dono pointers ends par setup hue.`,
        memorySnapshot: {
          type: 'reverse',
          arr: [...arr],
          left,
          right,
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
        explanationEnglish: `temp = arr[${left}] (${temp}). Save left element before replacing.`,
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

      // Step B: Swap left with right
      arr[left] = arr[right];
      arr[right] = temp;
      settledIndices.push(left, right);

      steps.push({
        step: step++,
        lineNum: 6,
        explanationEnglish: `Swap complete! arr[${left}] (${arr[left]}) ⇄ arr[${right}] (${arr[right]}). In-place swap done.`,
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

      // Step C: Move inward
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
  },
  executionSteps: [],
};

export const dsa_array_count: LessonProgram = {
  id: 'dsa_array_count', language: 'dsa', topic: 'array_operations', lessonNumber: 4,
  friendlyName: 'Count Occurrences of Element',
  learningObjective: 'Scan the array and count how many times the target value appears.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('6'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('5'), pu(','), tx(' '), nu('3'), pu(','), tx(' '), nu('5'), pu(','), tx(' '), nu('7'), pu(','), tx(' '), nu('5'), pu(','), tx(' '), nu('2'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('target'), tx(' '), op('='), tx(' '), nu('5', 'target'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('count'), tx(' '), op('='), tx(' '), nu('0'), pu(';')]),
    line(4, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), nu('6'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(5, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('=='), tx(' '), va('target'), pu(')'), tx(' '), va('count'), op('++'), pu(';')]),
    line(6, [pu('}')]),
    line(7, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Count: "'), tx(' '), op('<<'), tx(' '), va('count'), pu(';')]),
  ],
  editableVariables: { target: { default: 5, label: 'Target value' } },
  generateSteps: ({ target }): ExecutionStep[] => {
    const arr = [5, 3, 5, 7, 5, 2];
    const t = Number(target ?? 5);
    let count = 0;
    const matchedIndices: number[] = [];
    const steps: ExecutionStep[] = [
      {
        step: 1,
        lineNum: 2,
        explanationEnglish: `Target = ${t}. Initialized count = 0. Beginning linear scan through array.`,
        explanationHinglish: `Target = ${t}, count = 0 shuru kiya. Array scan shuru ho rha hai.`,
        memorySnapshot: {
          type: 'count',
          arr: [...arr],
          target: t,
          currentIdx: -1,
          count: 0,
          matchedIndices: [],
          isMatch: false,
          stage: 'init',
        },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: t },
      },
    ];

    for (let i = 0; i < arr.length; i++) {
      const isMatch = arr[i] === t;
      if (isMatch) {
        count++;
        matchedIndices.push(i);
      }

      steps.push({
        step: 2 + i,
        lineNum: 5,
        explanationEnglish: `i = ${i} (arr[${i}] = ${arr[i]}): ${
          isMatch ? `EQUAL to target (${t}) → count incremented to ${count}!` : `NOT EQUAL to target (${t}) → count remains ${count}.`
        }`,
        explanationHinglish: `i = ${i} (arr[${i}] = ${arr[i]}): ${
          isMatch ? `Target (${t}) ke barabar mila → count = ${count}!` : `Target (${t}) nahi mila → count = ${count}.`
        }`,
        memorySnapshot: {
          type: 'count',
          arr: [...arr],
          target: t,
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
      explanationEnglish: `Complete! Target value ${t} occurs ${count} time(s) at index/indices [${matchedIndices.join(', ')}].`,
      explanationHinglish: `Complete! Target ${t} array me kul ${count} baar mila (indices [${matchedIndices.join(', ')}]).`,
      memorySnapshot: {
        type: 'count',
        arr: [...arr],
        target: t,
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
  },
  executionSteps: [],
};

// ─── TOPIC 02: SEARCHING ─────────────────────────────────────────────────────

export const dsa_linear_search: LessonProgram = {
  id: 'dsa_linear_search', language: 'dsa', topic: 'linear_search', lessonNumber: 1,
  friendlyName: 'Linear Search Algorithm (O(N))',
  learningObjective: 'Sequentially check every element from index 0 to N-1. Stop when target is found.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('10'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('12'), pu(','), tx(' '), nu('25'), pu(','), tx(' '), nu('34'), pu(','), tx(' '), nu('41'), pu(','), tx(' '), nu('56'), pu(','), tx(' '), nu('63'), pu(','), tx(' '), nu('78'), pu(','), tx(' '), nu('82'), pu(','), tx(' '), nu('90'), pu(','), tx(' '), nu('99'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('target'), tx(' '), op('='), tx(' '), nu('78', 'target'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('result'), tx(' '), op('='), tx(' '), nu('-1'), pu(';')]),
    line(4, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), nu('10'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(5, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('=='), tx(' '), va('target'), pu(')'), tx(' {')]),
    line(6, [tx('        '), va('result'), tx(' '), op('='), tx(' '), va('i'), pu(';'), tx(' '), kw('break'), pu(';')]),
    line(7, [tx('    '), pu('}')]),
    line(8, [pu('}')]),
    line(9, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Found at index: "'), tx(' '), op('<<'), tx(' '), va('result'), pu(';')]),
  ],
  editableVariables: { target: { default: 78, label: 'Search target' } },
  generateSteps: ({ target }): ExecutionStep[] => {
    const arr = [12, 25, 34, 41, 56, 63, 78, 82, 90, 99];
    const t = Number(target ?? 78);
    let result = -1;
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 2, explanationEnglish: `Search for target = ${t} in array.`, explanationHinglish: `target = ${t} ko array me dhundh rhe hain.`, memorySnapshot: { arr: [...arr], target: t, result: -1, i: -1 }, animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: t } },
    ];
    for (let i = 0; i < arr.length; i++) {
      const found = arr[i] === t;
      if (found) result = i;
      steps.push({ step: 2 + i, lineNum: 5, explanationEnglish: `i=${i}: arr[${i}]=${arr[i]} ${found ? '== target → FOUND!' : '!= target, continue'}`, explanationHinglish: `arr[${i}]=${arr[i]} ${found ? '→ Match milgaya!' : '→ match nahi, aage badho'}`, memorySnapshot: { i, arr: [...arr], target: t, result }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: i } });
      if (found) break;
    }
    steps.push({ step: steps.length + 1, lineNum: 9, explanationEnglish: result >= 0 ? `Found at index ${result}.` : 'Not found. result = -1.', explanationHinglish: result >= 0 ? `Index ${result} pe mila.` : 'Nahi mila. result = -1.', memorySnapshot: { arr: [...arr], target: t, result }, consoleOutput: result >= 0 ? `Found at index: ${result}` : 'Not Found (-1)', animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: result } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_binary_search: LessonProgram = {
  id: 'dsa_binary_search', language: 'dsa', topic: 'binary_search', lessonNumber: 2,
  friendlyName: 'Binary Search Algorithm (O(log N))',
  learningObjective: 'Halve the search space each step using low, mid, high pointers on a SORTED array.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('10'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('12'), pu(','), tx(' '), nu('25'), pu(','), tx(' '), nu('34'), pu(','), tx(' '), nu('41'), pu(','), tx(' '), nu('56'), pu(','), tx(' '), nu('63'), pu(','), tx(' '), nu('78'), pu(','), tx(' '), nu('82'), pu(','), tx(' '), nu('90'), pu(','), tx(' '), nu('99'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('target'), tx(' '), op('='), tx(' '), nu('78', 'target'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('low'), tx(' '), op('='), tx(' '), nu('0'), pu(','), tx(' '), va('high'), tx(' '), op('='), tx(' '), nu('9'), pu(','), tx(' '), va('mid'), pu(','), tx(' '), va('result'), tx(' '), op('='), tx(' '), nu('-1'), pu(';')]),
    line(4, [kw('while'), pu('('), va('low'), tx(' '), op('<='), tx(' '), va('high'), pu(')'), tx(' {')]),
    line(5, [tx('    '), va('mid'), tx(' '), op('='), tx(' '), pu('('), va('low'), tx(' '), op('+'), tx(' '), va('high'), pu(')'), tx(' '), op('/'), tx(' '), nu('2'), pu(';')]),
    line(6, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('mid'), pu(']'), tx(' '), op('=='), tx(' '), va('target'), pu(')'), tx(' {'), va('result'), tx(' '), op('='), tx(' '), va('mid'), pu(';'), kw('break'), pu(';}')]),
    line(7, [tx('    '), kw('else if'), pu('('), va('arr'), pu('['), va('mid'), pu(']'), tx(' '), op('<'), tx(' '), va('target'), pu(')'), tx(' '), va('low'), tx(' '), op('='), tx(' '), va('mid'), op('+'), nu('1'), pu(';')]),
    line(8, [tx('    '), kw('else'), tx(' '), va('high'), tx(' '), op('='), tx(' '), va('mid'), op('-'), nu('1'), pu(';')]),
    line(9, [pu('}')]),
    line(10, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Found at: "'), tx(' '), op('<<'), tx(' '), va('result'), pu(';')]),
  ],
  editableVariables: { target: { default: 78, label: 'Search target' } },
  generateSteps: ({ target }): ExecutionStep[] => {
    const arr = [12, 25, 34, 41, 56, 63, 78, 82, 90, 99];
    const t = Number(target ?? 78);
    let low = 0, high = arr.length - 1, result = -1;
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 2, explanationEnglish: `Binary Search for target = ${t} in sorted array.`, explanationHinglish: `Sorted array me target = ${t} ko binary search se dhundho.`, memorySnapshot: { arr: [...arr], target: t, low, high, mid: -1, result: -1 }, animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'target', value: t }, { name: 'low', value: 0 }, { name: 'high', value: 9 }] } },
    ];
    let step = 2;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({ step: step++, lineNum: 5, explanationEnglish: `mid = (${low} + ${high}) / 2 = ${mid}. arr[${mid}] = ${arr[mid]}.`, explanationHinglish: `mid = ${mid}. arr[${mid}] = ${arr[mid]}.`, memorySnapshot: { arr: [...arr], low, high, mid, target: t, result }, animationEvent: { type: 'CREATE_VARIABLE', name: 'mid', value: mid } });
      if (arr[mid] === t) { result = mid; steps.push({ step: step++, lineNum: 6, explanationEnglish: `arr[${mid}] = ${arr[mid]} == target! Found at index ${mid}.`, explanationHinglish: `arr[${mid}] = ${arr[mid]} == ${t}! Index ${mid} pe milgaya!`, memorySnapshot: { arr: [...arr], low, high, mid, target: t, result }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: mid } }); break; }
      else if (arr[mid] < t) { const prevLow = low; low = mid + 1; steps.push({ step: step++, lineNum: 7, explanationEnglish: `arr[${mid}]=${arr[mid]} < target. Move low to ${low}.`, explanationHinglish: `arr[${mid}] < target. low = ${low} ho gaya.`, memorySnapshot: { arr: [...arr], low, high, mid, target: t, result }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'low', oldValue: prevLow, newValue: low } }); }
      else { const prevHigh = high; high = mid - 1; steps.push({ step: step++, lineNum: 8, explanationEnglish: `arr[${mid}]=${arr[mid]} > target. Move high to ${high}.`, explanationHinglish: `arr[${mid}] > target. high = ${high} ho gaya.`, memorySnapshot: { arr: [...arr], low, high, mid, target: t, result }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'high', oldValue: prevHigh, newValue: high } }); }
    }
    steps.push({ step: steps.length + 1, lineNum: 10, explanationEnglish: result >= 0 ? `Found at index ${result}.` : 'Not found. result = -1.', explanationHinglish: result >= 0 ? `Index ${result} pe mila.` : 'Nahi mila. result = -1.', memorySnapshot: { arr: [...arr], target: t, result }, consoleOutput: result >= 0 ? `Found at index: ${result}` : 'Not Found (-1)', animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: result } });
    return steps;
  },
  executionSteps: [],
};

// ─── TOPIC 03: SORTING ────────────────────────────────────────────────────────

export const dsa_bubble_sort: LessonProgram = {
  id: 'dsa_bubble_sort', language: 'dsa', topic: 'bubble_sort', lessonNumber: 1,
  friendlyName: 'Bubble Sort Algorithm (O(N²))',
  learningObjective: 'Repeatedly compare adjacent elements. If left > right, swap. After each pass, largest element "bubbles up" to its correct position.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('64'), pu(','), tx(' '), nu('34'), pu(','), tx(' '), nu('25'), pu(','), tx(' '), nu('12'), pu(','), tx(' '), nu('22'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('n'), tx(' '), op('='), tx(' '), nu('5'), pu(';')]),
    line(3, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), va('n'), op('-'), nu('1'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(4, [tx('    '), kw('for'), pu('('), kw('int'), tx(' '), va('j'), op('='), nu('0'), pu(';'), tx(' '), va('j'), op('<'), va('n'), op('-'), va('i'), op('-'), nu('1'), pu(';'), tx(' '), va('j'), op('++'), pu(')'), tx(' {')]),
    line(5, [tx('        '), kw('if'), pu('('), va('arr'), pu('['), va('j'), pu(']'), tx(' '), op('>'), tx(' '), va('arr'), pu('['), va('j'), op('+'), nu('1'), pu(']'), pu(')'), tx(' {')]),
    line(6, [tx('            '), fn('swap'), pu('('), va('arr'), pu('['), va('j'), pu(']'), pu(','), tx(' '), va('arr'), pu('['), va('j'), op('+'), nu('1'), pu(']'), pu(')'), pu(';')]),
    line(7, [tx('        '), pu('}')]),
    line(8, [tx('    '), pu('}')]),
    line(9, [pu('}')]),
    line(10, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Sorted"'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [64, 34, 25, 12, 22];
    const n = arr.length;
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 1, explanationEnglish: `Array arr = [${arr.join(',')}] — unsorted.`, explanationHinglish: `Array arr = [${arr.join(',')}] — unsorted hai.`, memorySnapshot: { arr: `[${arr.join(',')}]`, n }, animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: `[${arr.join(',')}]` } },
    ];
    let step = 2;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          steps.push({ step: step++, lineNum: 5, explanationEnglish: `Pass ${i+1}: arr[${j}]=${arr[j]} > arr[${j+1}]=${arr[j+1]} → SWAP!`, explanationHinglish: `Pass ${i+1}: arr[${j}]=${arr[j]} > arr[${j+1}]=${arr[j+1]} → swap karo!`, memorySnapshot: { i, j, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'SWAP', varA: `arr[${j}]`, varB: `arr[${j+1}]` } });
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({ step: step++, lineNum: 6, explanationEnglish: `After swap: arr = [${arr.join(',')}]`, explanationHinglish: `Swap ke baad: arr = [${arr.join(',')}]`, memorySnapshot: { i, j, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'UPDATE_ARRAY_INDEX', arrayName: 'arr', index: j, oldValue: arr[j+1], newValue: arr[j] } });
        }
      }
    }
    steps.push({ step: step, lineNum: 10, explanationEnglish: `Sorted! arr = [${arr.join(',')}]`, explanationHinglish: `Sorting complete! arr = [${arr.join(',')}]`, memorySnapshot: { arr: `[${arr.join(',')}]` }, consoleOutput: `Sorted: [${arr.join(', ')}]`, animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: `[${arr.join(',')}]` } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_selection_sort: LessonProgram = {
  id: 'dsa_selection_sort', language: 'dsa', topic: 'selection_sort', lessonNumber: 2,
  friendlyName: 'Selection Sort Algorithm (O(N²))',
  learningObjective: 'Find minimum element in unsorted portion. Swap it to the front of the unsorted region.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('64'), pu(','), tx(' '), nu('25'), pu(','), tx(' '), nu('12'), pu(','), tx(' '), nu('22'), pu(','), tx(' '), nu('11'), pu('}'), pu(';')]),
    line(2, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), nu('4'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(3, [tx('    '), kw('int'), tx(' '), va('minIdx'), tx(' '), op('='), tx(' '), va('i'), pu(';'), tx('  '), cm('// Assume i is minimum')]),
    line(4, [tx('    '), kw('for'), pu('('), kw('int'), tx(' '), va('j'), op('='), va('i'), op('+'), nu('1'), pu(';'), tx(' '), va('j'), op('<'), nu('5'), pu(';'), tx(' '), va('j'), op('++'), pu(')'), tx(' {')]),
    line(5, [tx('        '), kw('if'), pu('('), va('arr'), pu('['), va('j'), pu(']'), tx(' '), op('<'), tx(' '), va('arr'), pu('['), va('minIdx'), pu(']'), pu(')'), tx(' '), va('minIdx'), tx(' '), op('='), tx(' '), va('j'), pu(';')]),
    line(6, [tx('    '), pu('}')]),
    line(7, [tx('    '), fn('swap'), pu('('), va('arr'), pu('['), va('i'), pu(']'), pu(','), tx(' '), va('arr'), pu('['), va('minIdx'), pu(']'), pu(')'), pu(';')]),
    line(8, [pu('}')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [64, 25, 12, 22, 11];
    const steps: ExecutionStep[] = [{ step: 1, lineNum: 1, explanationEnglish: `Array = [${arr.join(',')}] — unsorted.`, explanationHinglish: `Array [${arr.join(',')}] se shuru.`, memorySnapshot: { arr: `[${arr.join(',')}]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: `[${arr.join(',')}]` } }];
    let step = 2;
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      steps.push({ step: step++, lineNum: 3, explanationEnglish: `Pass ${i+1}: Assume minIdx = ${i} (arr[${i}]=${arr[i]}).`, explanationHinglish: `Pass ${i+1}: minIdx = ${i}, arr[${i}]=${arr[i]} sabse chhota man lo.`, memorySnapshot: { i, minIdx, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'minIdx', value: minIdx } });
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) { const prev = minIdx; minIdx = j; steps.push({ step: step++, lineNum: 5, explanationEnglish: `arr[${j}]=${arr[j]} < arr[${prev}]=${arr[prev]} → new minIdx=${minIdx}.`, explanationHinglish: `Naya minimum mila at j=${j}.`, memorySnapshot: { i, j, minIdx, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'minIdx', oldValue: prev, newValue: minIdx } }); }
      }
      if (minIdx !== i) { steps.push({ step: step++, lineNum: 7, explanationEnglish: `Swap arr[${i}]=${arr[i]} with arr[${minIdx}]=${arr[minIdx]}.`, explanationHinglish: `arr[${i}] aur arr[${minIdx}] ko swap karo.`, memorySnapshot: { i, minIdx, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'SWAP', varA: `arr[${i}]`, varB: `arr[${minIdx}]` } }); [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; }
    }
    steps.push({ step: step, lineNum: 8, explanationEnglish: `Sorted: [${arr.join(',')}]`, explanationHinglish: `Array sort ho gaya: [${arr.join(',')}]`, memorySnapshot: { arr: `[${arr.join(',')}]` }, consoleOutput: `Sorted: [${arr.join(', ')}]`, animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: `[${arr.join(',')}]` } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_insertion_sort: LessonProgram = {
  id: 'dsa_insertion_sort', language: 'dsa', topic: 'insertion_sort', lessonNumber: 3,
  friendlyName: 'Insertion Sort Algorithm',
  learningObjective: 'Pick each element and insert it into the correct position in the sorted portion.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('12'), pu(','), tx(' '), nu('11'), pu(','), tx(' '), nu('13'), pu(','), tx(' '), nu('5'), pu(','), tx(' '), nu('6'), pu('}'), pu(';')]),
    line(2, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('1'), pu(';'), tx(' '), va('i'), op('<'), nu('5'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(3, [tx('    '), kw('int'), tx(' '), va('key'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('i'), pu(']'), pu(';')]),
    line(4, [tx('    '), kw('int'), tx(' '), va('j'), tx(' '), op('='), tx(' '), va('i'), op('-'), nu('1'), pu(';')]),
    line(5, [tx('    '), kw('while'), pu('('), va('j'), tx(' '), op('>='), tx(' '), nu('0'), tx(' && '), va('arr'), pu('['), va('j'), pu(']'), tx(' '), op('>'), tx(' '), va('key'), pu(')'), tx(' {')]),
    line(6, [tx('        '), va('arr'), pu('['), va('j'), op('+'), nu('1'), pu(']'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('j'), pu(']'), pu(';'), tx(' '), va('j'), op('--'), pu(';')]),
    line(7, [tx('    '), pu('}')]),
    line(8, [tx('    '), va('arr'), pu('['), va('j'), op('+'), nu('1'), pu(']'), tx(' '), op('='), tx(' '), va('key'), pu(';')]),
    line(9, [pu('}')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [12, 11, 13, 5, 6];
    const steps: ExecutionStep[] = [{ step: 1, lineNum: 1, explanationEnglish: `Array = [${arr.join(',')}] — unsorted.`, explanationHinglish: `Array [${arr.join(',')}] se shuru.`, memorySnapshot: { arr: `[${arr.join(',')}]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: `[${arr.join(',')}]` } }];
    let step = 2;
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      steps.push({ step: step++, lineNum: 3, explanationEnglish: `Pick key = arr[${i}] = ${key}.`, explanationHinglish: `key = arr[${i}] = ${key} uthaya.`, memorySnapshot: { i, key, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'key', value: key } });
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        steps.push({ step: step++, lineNum: 6, explanationEnglish: `arr[${j}]=${arr[j+1]} > key=${key} → shift right. arr=[${arr.join(',')}]`, explanationHinglish: `arr[${j}]=${arr[j+1]} > key=${key} → ek jagah right shift.`, memorySnapshot: { j, key, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'UPDATE_ARRAY_INDEX', arrayName: 'arr', index: j + 1, oldValue: arr[j], newValue: arr[j + 1] } });
        j--;
      }
      arr[j + 1] = key;
      steps.push({ step: step++, lineNum: 8, explanationEnglish: `Insert key=${key} at arr[${j+1}]. arr=[${arr.join(',')}]`, explanationHinglish: `key=${key} ko correct position arr[${j+1}] pe insert kiya.`, memorySnapshot: { j, key, arr: `[${arr.join(',')}]` }, animationEvent: { type: 'UPDATE_ARRAY_INDEX', arrayName: 'arr', index: j + 1, oldValue: arr[j + 1], newValue: key } });
    }
    steps.push({ step: step, lineNum: 9, explanationEnglish: `Sorted! [${arr.join(',')}]`, explanationHinglish: `Sorted array: [${arr.join(',')}]`, memorySnapshot: { arr: `[${arr.join(',')}]` }, consoleOutput: `Sorted: [${arr.join(', ')}]`, animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: `[${arr.join(',')}]` } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_merge_sort: LessonProgram = {
  id: 'dsa_merge_sort', language: 'dsa', topic: 'merge_sort', lessonNumber: 1,
  friendlyName: 'Merge Sort Algorithm',
  learningObjective: 'Observe recursive divide-and-conquer strategy. Visual trace shows sublist partitions and merges.',
  lines: [
    line(1, [cm('// Merge Sort Walkthrough (Numerical Simulation)')]),
    line(2, [kw('void'), tx(' '), fn('mergeSort'), pu('('), va('int'), tx(' '), va('arr'), pu('[]'), pu(')')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Merge Sort initialized with unsorted array: [38, 27, 43, 3, 9, 82, 10].',
        explanationHinglish: 'Merge Sort shuru hua unsorted array ke sath: [38, 27, 43, 3, 9, 82, 10].',
        memorySnapshot: { arr: '[38, 27, 43, 3, 9, 82, 10]' },
        consoleOutput: 'Array loaded for Merge Sort.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2,
        lineNum: 2,
        explanationEnglish: 'Divide array into two halves: Left = [38, 27, 43, 3], Right = [9, 82, 10].',
        explanationHinglish: 'Array ko do halves me divide kiya: Left=[38, 27, 43, 3], Right=[9, 82, 10].',
        memorySnapshot: { left: '[38, 27, 43, 3]', right: '[9, 82, 10]' },
        consoleOutput: 'Divided array into Left and Right subarrays.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 3,
        lineNum: 2,
        explanationEnglish: 'Sort left half recursively: [3, 27, 38, 43].',
        explanationHinglish: 'Left half ko recursively sort kiya: [3, 27, 38, 43].',
        memorySnapshot: { left: '[3, 27, 38, 43]', right: '[9, 82, 10]' },
        consoleOutput: 'Sorted left subarray.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 4,
        lineNum: 2,
        explanationEnglish: 'Sort right half recursively: [9, 10, 82].',
        explanationHinglish: 'Right half ko recursively sort kiya: [9, 10, 82].',
        memorySnapshot: { left: '[3, 27, 38, 43]', right: '[9, 10, 82]' },
        consoleOutput: 'Sorted right subarray.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 5,
        lineNum: 2,
        explanationEnglish: 'Merge sorted halves back: Compare fronts to build final sorted array.',
        explanationHinglish: 'Dono sorted halves ko merge kiya to produce final sorted array.',
        memorySnapshot: { arr: '[3, 9, 10, 27, 38, 43, 82]' },
        consoleOutput: 'Merged subarrays. Merge Sort complete!',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_quick_sort: LessonProgram = {
  id: 'dsa_quick_sort', language: 'dsa', topic: 'quick_sort', lessonNumber: 1,
  friendlyName: 'Quick Sort (Pivot & Partition)',
  learningObjective: 'Understand Divide-and-Conquer sorting: pick a Pivot element, partition array so smaller elements go left and larger go right, then recursively sort.',
  lines: [
    line(1, [cm('// Quick Sort (Lomuto Partition Scheme)')]),
    line(2, [kw('int'), tx(' '), fn('partition'), pu('('), kw('int'), tx(' '), va('arr'), pu('[]'), pu(','), tx(' '), kw('int'), tx(' '), va('low'), pu(','), tx(' '), kw('int'), tx(' '), va('high'), pu(') {')]),
    line(3, [tx('    '), kw('int'), tx(' '), va('pivot'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('high'), pu(']'), pu(';'), tx(' '), kw('int'), tx(' '), va('i'), tx(' '), op('='), tx(' '), va('low'), tx(' '), op('-'), tx(' '), nu('1'), pu(';')]),
    line(4, [tx('    '), kw('for'), pu('('), kw('int'), tx(' '), va('j'), tx(' '), op('='), tx(' '), va('low'), pu(';'), tx(' '), va('j'), tx(' '), op('<'), tx(' '), va('high'), pu(';'), tx(' '), va('j'), op('++'), pu(') {')]),
    line(5, [tx('        '), kw('if'), pu('('), va('arr'), pu('['), va('j'), pu(']'), tx(' '), op('<'), tx(' '), va('pivot'), pu(') {')]),
    line(6, [tx('            '), va('i'), op('++'), pu(';'), tx(' '), fn('swap'), pu('('), va('arr'), pu('['), va('i'), pu(']'), pu(','), tx(' '), va('arr'), pu('['), va('j'), pu(']'), pu(');')]),
    line(7, [tx('        '), pu('}')]),
    line(8, [tx('    '), pu('}')]),
    line(9, [tx('    '), fn('swap'), pu('('), va('arr'), pu('['), va('i'), op('+'), nu('1'), pu(']'), pu(','), tx(' '), va('arr'), pu('['), va('high'), pu(']'), pu(');')]),
    line(10, [tx('    '), kw('return'), tx(' '), va('i'), tx(' '), op('+'), tx(' '), nu('1'), pu(';')]),
    line(11, [pu('}')]),
    line(12, [kw('void'), tx(' '), fn('quickSort'), pu('('), kw('int'), tx(' '), va('arr'), pu('[]'), pu(','), tx(' '), kw('int'), tx(' '), va('low'), pu(','), tx(' '), kw('int'), tx(' '), va('high'), pu(') {')]),
    line(13, [tx('    '), kw('if'), pu('('), va('low'), tx(' '), op('<'), tx(' '), va('high'), pu(') {')]),
    line(14, [tx('        '), kw('int'), tx(' '), va('pi'), tx(' '), op('='), tx(' '), fn('partition'), pu('('), va('arr'), pu(','), tx(' '), va('low'), pu(','), tx(' '), va('high'), pu(');')]),
    line(15, [tx('        '), fn('quickSort'), pu('('), va('arr'), pu(','), tx(' '), va('low'), pu(','), tx(' '), va('pi'), op('-'), nu('1'), pu(');')]),
    line(16, [tx('        '), fn('quickSort'), pu('('), va('arr'), pu(','), tx(' '), va('pi'), op('+'), nu('1'), pu(','), tx(' '), va('high'), pu(');')]),
    line(17, [tx('    '), pu('}')]),
    line(18, [pu('}')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Quick Sort initialized with 8 elements: [52, 38, 74, 19, 63, 27, 85, 41]. Lomuto partition picks rightmost element (41) as Pivot.',
        explanationHinglish: '8 elements ke saath Quick Sort shuru hua: [52, 38, 74, 19, 63, 27, 85, 41]. Rightmost element (41) ko Pivot chuna gaya.',
        memorySnapshot: { arr: [52, 38, 74, 19, 63, 27, 85, 41], low: 0, high: 7, pivotIdx: 7, pivotVal: 41, i: -1, j: 0, sortedIndices: [], phase: 'INIT' },
        consoleOutput: '> Quick Sort Initialized: [52, 38, 74, 19, 63, 27, 85, 41]',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 3,
        explanationEnglish: 'Partition [0..7]: Pivot = 41, boundary pointer i = -1. Scanning elements with pointer j.',
        explanationHinglish: 'Partition [0..7]: Pivot = 41, boundary i = -1. Pointer j se scan shuru.',
        memorySnapshot: { arr: [52, 38, 74, 19, 63, 27, 85, 41], low: 0, high: 7, pivotIdx: 7, pivotVal: 41, i: -1, j: 0, sortedIndices: [], phase: 'WINDOW_SELECT' },
        animationEvent: { type: 'NONE' },
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: 'Compare arr[0]=52 vs Pivot=41: 52 >= 41, no swap. Advance j to 1.',
        explanationHinglish: 'arr[0]=52 vs Pivot=41 compare kiya: 52 bada hai, right region me rahega.',
        memorySnapshot: { arr: [52, 38, 74, 19, 63, 27, 85, 41], low: 0, high: 7, pivotIdx: 7, pivotVal: 41, i: -1, j: 0, sortedIndices: [], comparing: [0, 7], phase: 'SCAN_COMPARE' },
        animationEvent: { type: 'COMPARE_INDICES', arrayName: 'arr', indexA: 0, indexB: 7 } as any,
      },
      {
        step: 4, lineNum: 5,
        explanationEnglish: 'Compare arr[1]=38 vs Pivot=41: 38 < 41 → Increment i to 0 and swap arr[0] (52) with arr[1] (38).',
        explanationHinglish: 'arr[1]=38 chhota hai 41 se! i++ = 0 aur arr[0] (52) ko arr[1] (38) se swap kiya.',
        memorySnapshot: { arr: [38, 52, 74, 19, 63, 27, 85, 41], low: 0, high: 7, pivotIdx: 7, pivotVal: 41, i: 0, j: 1, sortedIndices: [], swapping: [0, 1], phase: 'SWAP_SMALLER' },
        consoleOutput: '> Swapped: [38, 52, 74, 19, 63, 27, 85, 41]',
        animationEvent: { type: 'SWAP', arrayName: 'arr', indexA: 0, indexB: 1 } as any,
      },
      {
        step: 5, lineNum: 9,
        explanationEnglish: 'Place Pivot 41 into its permanent position at index [3]: Swap arr[3] (52) with arr[7] (41).',
        explanationHinglish: 'Pivot 41 ko permanent jagah par rakha: index [3] par swap kiya.',
        memorySnapshot: { arr: [38, 19, 27, 41, 63, 74, 85, 52], low: 0, high: 7, pivotIdx: 3, pivotVal: 41, i: 3, j: 7, sortedIndices: [3], swapping: [3, 7], phase: 'PIVOT_LOCK' },
        consoleOutput: '> Pivot 41 locked at index [3]',
        animationEvent: { type: 'SWAP', arrayName: 'arr', indexA: 3, indexB: 7 } as any,
      },
      {
        step: 6, lineNum: 16,
        explanationEnglish: 'Quick Sort Complete! All 8 elements partitioned and recursively sorted: [19, 27, 38, 41, 52, 63, 74, 85].',
        explanationHinglish: 'Quick Sort Poora Hua! Saare 8 elements sorted hain: [19, 27, 38, 41, 52, 63, 74, 85].',
        memorySnapshot: { arr: [19, 27, 38, 41, 52, 63, 74, 85], low: 0, high: 7, pivotIdx: -1, pivotVal: -1, i: -1, j: -1, sortedIndices: [0, 1, 2, 3, 4, 5, 6, 7], phase: 'COMPLETE', isFinished: true },
        consoleOutput: '> ALL 8 ELEMENTS SORTED: [19, 27, 38, 41, 52, 63, 74, 85]',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_heap_sort: LessonProgram = {
  id: 'dsa_heap_sort', language: 'dsa', topic: 'heap_sort', lessonNumber: 1,
  friendlyName: 'Heap Sort Algorithm',
  learningObjective: 'Observe Max-Heap structures and tree root replacements to perform sorted element extraction.',
  lines: [
    line(1, [cm('// Heap Sort Walkthrough (Numerical Simulation)')]),
    line(2, [kw('void'), tx(' '), fn('heapSort'), pu('('), va('int'), tx(' '), va('arr'), pu('[]'), pu(')')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Heap Sort initialized with array: [12, 11, 13, 5, 6, 7].',
        explanationHinglish: 'Heap Sort shuru hua array ke sath: [12, 11, 13, 5, 6, 7].',
        memorySnapshot: { arr: '[12, 11, 13, 5, 6, 7]' },
        consoleOutput: 'Array loaded for Heap Sort.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2,
        lineNum: 2,
        explanationEnglish: 'Convert array to Max-Heap (Heapify): Max element 13 is moved to root index [0].',
        explanationHinglish: 'Array ko Max-Heap me convert kiya (Heapify): Sabse bada element 13 root pe aa gaya.',
        memorySnapshot: { heap: '[13, 11, 12, 5, 6, 7]' },
        consoleOutput: 'Max Heap built successfully.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 3,
        lineNum: 2,
        explanationEnglish: 'Swap root 13 with last element 7 and extract 13.',
        explanationHinglish: 'Root element 13 ko last element 7 ke sath swap kiya aur extract kiya.',
        memorySnapshot: { heap: '[12, 11, 7, 5, 6]', extracted: '13' },
        consoleOutput: 'Extracted: 13',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 4,
        lineNum: 2,
        explanationEnglish: 'Heapify remaining elements and extract root 12.',
        explanationHinglish: 'Bache huye elements ko heapify kiya aur root 12 extract kiya.',
        memorySnapshot: { heap: '[11, 6, 7, 5]', extracted: '13, 12' },
        consoleOutput: 'Extracted: 12',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 5,
        lineNum: 2,
        explanationEnglish: 'Repeat extraction steps until heap is empty. Sorted Array: [5, 6, 7, 11, 12, 13].',
        explanationHinglish: 'Heap khali hone tak extraction steps repeat kiye. Sorted Array: [5, 6, 7, 11, 12, 13].',
        memorySnapshot: { arr: '[5, 6, 7, 11, 12, 13]' },
        consoleOutput: 'Heap Sort complete!',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

// ─── TOPIC 05: STACK ──────────────────────────────────────────────────────────

export const dsa_stack_push_pop: LessonProgram = {
  id: 'dsa_stack_push_pop', language: 'dsa', topic: 'stack', lessonNumber: 1,
  friendlyName: 'Stack Data Structure (LIFO)',
  learningObjective: 'Interactive Stack Workspace: Perform Push, Pop, Peek, Search, and Traverse operations directly.',
  lines: [
    line(1, [cm('// Interactive Stack Workspace (Language Independent)')]),
    line(2, [cm('// Use the Operational Panel on the left to perform stack operations.')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Stack initialized. Enter values in the Operational Dashboard to perform operations.',
        explanationHinglish: 'Stack initialize ho gaya hai. Operational Dashboard se operations perform karein.',
        memorySnapshot: { top: -1, capacity: 6, stack: [] },
        consoleOutput: 'Stack initialized (Empty).',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

// ─── TOPIC 06: QUEUE ──────────────────────────────────────────────────────────

export const dsa_queue_enq_deq: LessonProgram = {
  id: 'dsa_queue_enq_deq', language: 'dsa', topic: 'queue', lessonNumber: 1,
  friendlyName: 'Queue Implementation (FIFO)',
  learningObjective: 'Interactive Queue Workspace: Perform Enqueue, Dequeue, Peek Front, Search, and Traverse operations directly.',
  lines: [
    line(1, [cm('// Interactive Queue Workspace (Language Independent)')]),
    line(2, [cm('// Use the Operational Panel on the left to perform queue operations.')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Queue initialized. Use the Operational Dashboard to add/remove elements.',
        explanationHinglish: 'Queue initialize ho gaya hai. Operational Dashboard se elements add/remove karein.',
        memorySnapshot: { front: -1, rear: -1, capacity: 4, queue: [] },
        consoleOutput: 'Queue initialized (Empty).',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

// ─── TOPIC 07: SINGLY LINKED LIST ─────────────────────────────────────────────

export const dsa_sll_traverse: LessonProgram = {
  id: 'dsa_sll_traverse', language: 'dsa', topic: 'singly_linked_list', lessonNumber: 1,
  friendlyName: 'Singly Linked List (SLL)',
  learningObjective: 'Interactive Singly Linked List Workspace: Perform Node Insertion, Deletion, Searching, and Traversal directly.',
  lines: [
    line(1, [cm('// Interactive Singly Linked List Workspace (Language Independent)')]),
    line(2, [cm('// Use the SLL Controls panel to insert or delete nodes dynamically.')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Singly Linked List initialized. Head points to NULL.',
        explanationHinglish: 'Singly Linked List initialize ho gayi hai. Head NULL ko point kar raha hai.',
        memorySnapshot: { capacity: 6, list: [] },
        consoleOutput: 'Singly Linked List initialized (Empty).',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};
export const dsa_graph_basics: LessonProgram = {
  id: 'dsa_graph_basics', language: 'dsa', topic: 'graph_basics', lessonNumber: 1,
  friendlyName: 'Graph Fundamentals (Vertices, Edges & Matrices)',
  learningObjective: 'Learn Graph Theory basics: Vertices, Edges, Edge Weights, Neighbor Nodes, Degree, Adjacency Matrix & Adjacency List representations.',
  lines: [
    line(1, [cm('// Graph Fundamentals: Representation & Data Structures')]),
    line(2, [kw('class'), tx(' '), va('Graph'), tx(' {')]),
    line(3, [tx('    '), kw('int'), tx(' '), va('V'), pu(';'), tx(' '), cm('// Number of Vertices')]),
    line(4, [tx('    '), va('vector'), op('<'), va('pair'), op('<'), kw('int'), pu(','), kw('int'), op('>'), pu('>'), tx(' '), va('adj'), pu('['), pu(']'), pu(';'), tx(' '), cm('// Adjacency List')]),
    line(5, [tx('    '), kw('int'), tx(' '), va('matrix'), pu('['), va('V'), pu(']'), pu('['), va('V'), pu(']'), pu(';'), tx(' '), cm('// Adjacency Matrix')]),
    line(6, [pu('}')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 2,
        explanationEnglish: 'Graph G = (V, E): 7 Vertices V = {0..6} connected by 9 Edges E.',
        explanationHinglish: 'Graph G = (V, E): 7 Vertices V = {0..6} aur 9 Edges E ka non-linear mesh network.',
        memorySnapshot: { activeTab: 'overview', concept: 'GRAPH_STRUCTURE', nodesCount: 7, edgesCount: 9 },
        consoleOutput: 'Graph initialized: 7 Vertices, 9 Edges.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2,
        lineNum: 3,
        explanationEnglish: 'Vertices (Nodes): Spatial 2D coordinates (x, y) representing entities (Cities/Routers).',
        explanationHinglish: 'Vertices (Nodes): 2D spatial positions jo network entities (Cities/Routers) ko represent karti hain.',
        memorySnapshot: { activeTab: 'vertices', concept: 'VERTICES', highlightNode: '0' },
        consoleOutput: 'Vertices V = {0, 1, 2, 3, 4, 5, 6}',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 3,
        lineNum: 4,
        explanationEnglish: 'Neighbors & Degree: Node [0] connects to neighbors [1, 2, 3] → Degree(0) = 3.',
        explanationHinglish: 'Neighbors & Degree: Node [0] ke directly connected neighbors [1, 2, 3] hain → Degree(0) = 3.',
        memorySnapshot: { activeTab: 'neighbors', concept: 'NEIGHBORS', inspectNode: '0', neighbors: ['1', '2', '3'], inspectingNeighbors: ['1', '2', '3'], degree: 3 },
        consoleOutput: 'Node [0] Neighbors: [1, 2, 3] | Degree = 3',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 4,
        lineNum: 4,
        explanationEnglish: 'Edge Weights: Distance/latency values on connections (e.g. Node 0 ↔ Node 1 = 4).',
        explanationHinglish: 'Edge Weights: Node 0 se connected edges ke weights (e.g. w(0,1)=4, w(0,2)=2, w(0,3)=5).',
        memorySnapshot: { activeTab: 'weights', concept: 'EDGE_WEIGHTS', inspectNode: '0', neighbors: ['1', '2', '3'], inspectingNeighbors: ['1', '2', '3'] },
        consoleOutput: 'Edge Weights active (Weighted Graph).',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 5,
        lineNum: 5,
        explanationEnglish: 'Adjacency Matrix: V×V 2D Grid where M[u][v] stores edge weight/connection status.',
        explanationHinglish: 'Adjacency Matrix: 7×7 ka 2D Grid jahan M[u][v] edge weight ya connection presence store karta hai.',
        memorySnapshot: { activeTab: 'matrix', concept: 'ADJACENCY_MATRIX', showMatrix: true },
        consoleOutput: 'Adjacency Matrix 7x7 generated.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 6,
        lineNum: 4,
        explanationEnglish: 'Adjacency List: Array of linked vectors storing adj[u] → (v, weight) for optimal space.',
        explanationHinglish: 'Adjacency List: Memory-efficient list structure jahan adj[u] har node ke neighbors store karta hai.',
        memorySnapshot: { activeTab: 'list', concept: 'ADJACENCY_LIST', showList: true },
        consoleOutput: 'Adjacency List generated: adj[0] -> (1:4), (2:2), (3:5)',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_graph_bfs: LessonProgram = {
  id: 'dsa_graph_bfs', language: 'dsa', topic: 'graph_bfs', lessonNumber: 1,
  friendlyName: 'Breadth-First Search (BFS)',
  learningObjective: 'Observe level-order search via Queue. Visual walkthrough shows visited nodes status, active Queue elements, and path construction step-by-step.',
  lines: [
    line(1, [cm('// BFS Algorithm Walkthrough (Numerical Simulation)')]),
    line(2, [kw('void'), tx(' '), fn('BFS'), pu('('), va('Node'), tx(' '), va('start'), pu(')'), tx(' {')]),
    line(3, [tx('    '), va('Queue'), tx(' '), va('q'), pu(';'), tx(' '), va('q'), pu('.'), fn('enqueue'), pu('('), va('start'), pu(')'), pu(';')]),
    line(4, [tx('    '), va('visited'), pu('['), va('start'), pu(']'), tx(' '), op('='), tx(' '), kw('true'), pu(';')]),
    line(5, [tx('    '), kw('while'), pu('('), op('!'), va('q'), pu('.'), fn('empty'), pu('('), pu(')'), pu(')'), tx(' {')]),
    line(6, [tx('        '), va('Node'), tx(' '), va('curr'), tx(' '), op('='), tx(' '), va('q'), pu('.'), fn('dequeue'), pu('('), pu(')'), pu(';')]),
    line(7, [tx('        '), kw('for'), tx(' '), pu('('), va('Node'), tx(' '), va('nbr'), tx(' '), kw('in'), tx(' '), va('adj'), pu('['), va('curr'), pu(']'), pu(')'), tx(' {')]),
    line(8, [tx('            '), kw('if'), tx(' '), pu('('), op('!'), va('visited'), pu('['), va('nbr'), pu(']'), pu(')'), tx(' {')]),
    line(9, [tx('                '), va('q'), pu('.'), fn('enqueue'), pu('('), va('nbr'), pu(')'), pu(';')]),
    line(10, [tx('                '), va('visited'), pu('['), va('nbr'), pu(']'), tx(' '), op('='), tx(' '), kw('true'), pu(';')]),
    line(11, [tx('            '), pu('}')]),
    line(12, [tx('        '), pu('}')]),
    line(13, [tx('    '), pu('}')]),
    line(14, [pu('}')]),
  ],
  editableVariables: {
    graphPreset: { default: 1, min: 1, max: 2, label: 'Graph Preset' },
  },
  generateSteps: (vars?: Record<string, any>): ExecutionStep[] => {
    const preset = Number(vars?.graphPreset ?? 1);
    if (preset === 2) {
      return [
        {
          step: 1, lineNum: 2,
          explanationEnglish: 'BFS begins on Graph 2 (9 Vertices). Starting at Node 1.',
          explanationHinglish: 'Graph 2 (9 Vertices) par BFS shuru hua. Starting Node = 1.',
          memorySnapshot: { queue: ['1'], visited: ['1'], path: [] },
          consoleOutput: 'BFS initialized on Graph 2 at Node 1.',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 2, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 1. Add to Path: [1]. Inspect neighbors (2, 3, 4).',
          explanationHinglish: 'Queue se 1 ko dequeue kiya. Path: [1]. Neighbors (2, 3, 4) check karein.',
          memorySnapshot: { queue: [], visited: ['1'], path: ['1'] },
          consoleOutput: 'Dequeued: 1',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 3, lineNum: 9,
          explanationEnglish: 'Enqueue unvisited neighbors 2, 3, 4 into Queue.',
          explanationHinglish: 'Neighbors 2, 3, 4 ko Queue me enqueue kiya.',
          memorySnapshot: { queue: ['2', '3', '4'], visited: ['1', '2', '3', '4'], path: ['1'] },
          consoleOutput: 'Enqueued: 2, 3, 4',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 4, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 2. Path: [1, 2]. Neighbor 5 is unvisited.',
          explanationHinglish: 'Front se 2 ko dequeue kiya. Path: [1, 2]. Neighbor 5 unvisited hai.',
          memorySnapshot: { queue: ['3', '4'], visited: ['1', '2', '3', '4'], path: ['1', '2'] },
          consoleOutput: 'Dequeued: 2',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 5, lineNum: 9,
          explanationEnglish: 'Enqueue neighbor 5 into Queue.',
          explanationHinglish: 'Neighbor 5 ko Queue me add kiya.',
          memorySnapshot: { queue: ['3', '4', '5'], visited: ['1', '2', '3', '4', '5'], path: ['1', '2'] },
          consoleOutput: 'Enqueued: 5',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 6, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 3. Path: [1, 2, 3]. Neighbor 6 is unvisited.',
          explanationHinglish: 'Front se 3 ko dequeue kiya. Path: [1, 2, 3]. Neighbor 6 unvisited hai.',
          memorySnapshot: { queue: ['4', '5'], visited: ['1', '2', '3', '4', '5'], path: ['1', '2', '3'] },
          consoleOutput: 'Dequeued: 3',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 7, lineNum: 9,
          explanationEnglish: 'Enqueue neighbor 6 into Queue.',
          explanationHinglish: 'Neighbor 6 ko Queue me enqueue kiya.',
          memorySnapshot: { queue: ['4', '5', '6'], visited: ['1', '2', '3', '4', '5', '6'], path: ['1', '2', '3'] },
          consoleOutput: 'Enqueued: 6',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 8, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 4. Path: [1, 2, 3, 4]. (All neighbors visited).',
          explanationHinglish: 'Front se 4 ko dequeue kiya. Path: [1, 2, 3, 4]. All neighbors already visited.',
          memorySnapshot: { queue: ['5', '6'], visited: ['1', '2', '3', '4', '5', '6'], path: ['1', '2', '3', '4'] },
          consoleOutput: 'Dequeued: 4',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 9, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 5. Path: [1, 2, 3, 4, 5]. Neighbors 7 and 8 unvisited.',
          explanationHinglish: 'Front se 5 ko dequeue kiya. Path: [1, 2, 3, 4, 5]. Neighbors 7 aur 8 unvisited hain.',
          memorySnapshot: { queue: ['6'], visited: ['1', '2', '3', '4', '5', '6'], path: ['1', '2', '3', '4', '5'] },
          consoleOutput: 'Dequeued: 5',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 10, lineNum: 9,
          explanationEnglish: 'Enqueue neighbors 7 and 8 into Queue.',
          explanationHinglish: 'Neighbors 7 aur 8 ko Queue me enqueue kiya.',
          memorySnapshot: { queue: ['6', '7', '8'], visited: ['1', '2', '3', '4', '5', '6', '7', '8'], path: ['1', '2', '3', '4', '5'] },
          consoleOutput: 'Enqueued: 7, 8',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 11, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 6. Path: [1, 2, 3, 4, 5, 6]. Neighbor 9 unvisited.',
          explanationHinglish: 'Front se 6 ko dequeue kiya. Neighbor 9 unvisited hai.',
          memorySnapshot: { queue: ['7', '8'], visited: ['1', '2', '3', '4', '5', '6', '7', '8'], path: ['1', '2', '3', '4', '5', '6'] },
          consoleOutput: 'Dequeued: 6',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 12, lineNum: 9,
          explanationEnglish: 'Enqueue neighbor 9 into Queue.',
          explanationHinglish: 'Neighbor 9 ko Queue me enqueue kiya.',
          memorySnapshot: { queue: ['7', '8', '9'], visited: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], path: ['1', '2', '3', '4', '5', '6'] },
          consoleOutput: 'Enqueued: 9',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 13, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 7. Path: [1, 2, 3, 4, 5, 6, 7].',
          explanationHinglish: 'Front se 7 ko dequeue kiya. Path: [1..7].',
          memorySnapshot: { queue: ['8', '9'], visited: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], path: ['1', '2', '3', '4', '5', '6', '7'] },
          consoleOutput: 'Dequeued: 7',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 14, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 8. Path: [1, 2, 3, 4, 5, 6, 7, 8].',
          explanationHinglish: 'Front se 8 ko dequeue kiya. Path: [1..8].',
          memorySnapshot: { queue: ['9'], visited: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], path: ['1', '2', '3', '4', '5', '6', '7', '8'] },
          consoleOutput: 'Dequeued: 8',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 15, lineNum: 6,
          explanationEnglish: 'Dequeue curr = 9. Traversal complete! Path: [1, 2, 3, 4, 5, 6, 7, 8, 9].',
          explanationHinglish: 'Front se 9 ko dequeue kiya. BFS Complete! Final Path: [1, 2, 3, 4, 5, 6, 7, 8, 9].',
          memorySnapshot: { queue: [], visited: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], path: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
          consoleOutput: 'BFS Complete: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9',
          animationEvent: { type: 'NONE' },
        },
      ];
    }

    return [
      {
        step: 1,
        lineNum: 2,
        explanationEnglish: 'BFS begins on Graph 1 (5 Nodes). Select start node A.',
        explanationHinglish: 'Graph 1 par BFS shuru hua. Start node select karein (A).',
        memorySnapshot: { queue: [], visited: [], path: [] },
        consoleOutput: 'BFS traversal initialized.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2,
        lineNum: 3,
        explanationEnglish: 'Enqueue start node A into the BFS Queue.',
        explanationHinglish: 'Start node A ko BFS Queue me enqueue kiya.',
        memorySnapshot: { queue: ['A'], visited: ['A'], path: [] },
        consoleOutput: 'Enqueued: A',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 3,
        lineNum: 6,
        explanationEnglish: 'Dequeue curr = A. Visited path is appended: [A].',
        explanationHinglish: 'Queue se pop/dequeue kiya curr = A. Visited path: [A].',
        memorySnapshot: { queue: [], visited: ['A'], path: ['A'] },
        consoleOutput: 'Dequeued & Processed: A',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 4,
        lineNum: 9,
        explanationEnglish: 'Enqueue neighbors B and C of node A.',
        explanationHinglish: 'A ke neighbors B aur C ko queue me add kiya.',
        memorySnapshot: { queue: ['B', 'C'], visited: ['A', 'B', 'C'], path: ['A'] },
        consoleOutput: 'Enqueued: B, C',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 5,
        lineNum: 6,
        explanationEnglish: 'Dequeue next node curr = B from Front. Processed: [A, B].',
        explanationHinglish: 'Queue ke front se B ko dequeue kiya. Processed: [A, B].',
        memorySnapshot: { queue: ['C'], visited: ['A', 'B', 'C'], path: ['A', 'B'] },
        consoleOutput: 'Dequeued & Processed: B',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 6,
        lineNum: 9,
        explanationEnglish: 'B has unvisited neighbor D. Enqueue D.',
        explanationHinglish: 'B ka unvisited neighbor D hai. D ko queue kiya.',
        memorySnapshot: { queue: ['C', 'D'], visited: ['A', 'B', 'C', 'D'], path: ['A', 'B'] },
        consoleOutput: 'Enqueued: D',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 7,
        lineNum: 6,
        explanationEnglish: 'Dequeue next node curr = C. Processed: [A, B, C].',
        explanationHinglish: 'Queue se C ko dequeue kiya. Processed: [A, B, C].',
        memorySnapshot: { queue: ['D'], visited: ['A', 'B', 'C', 'D'], path: ['A', 'B', 'C'] },
        consoleOutput: 'Dequeued & Processed: C',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 8,
        lineNum: 6,
        explanationEnglish: 'Dequeue next node curr = D. Processed: [A, B, C, D].',
        explanationHinglish: 'Queue se D ko dequeue kiya. Processed: [A, B, C, D].',
        memorySnapshot: { queue: [], visited: ['A', 'B', 'C', 'D'], path: ['A', 'B', 'C', 'D'] },
        consoleOutput: 'Dequeued & Processed: D',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 9,
        lineNum: 9,
        explanationEnglish: 'D has neighbor E. Enqueue E.',
        explanationHinglish: 'D ka neighbor E hai. E ko enqueue kiya.',
        memorySnapshot: { queue: ['E'], visited: ['A', 'B', 'C', 'D', 'E'], path: ['A', 'B', 'C', 'D'] },
        consoleOutput: 'Enqueued: E',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 10,
        lineNum: 6,
        explanationEnglish: 'Dequeue last node curr = E. Processed: [A, B, C, D, E]. Queue is empty.',
        explanationHinglish: 'E ko dequeue kiya. Traversal complete! Path: [A, B, C, D, E].',
        memorySnapshot: { queue: [], visited: ['A', 'B', 'C', 'D', 'E'], path: ['A', 'B', 'C', 'D', 'E'] },
        consoleOutput: 'BFS Complete. Path: A -> B -> C -> D -> E',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_graph_dfs: LessonProgram = {
  id: 'dsa_graph_dfs', language: 'dsa', topic: 'graph_dfs', lessonNumber: 1,
  friendlyName: 'Depth-First Search (DFS)',
  learningObjective: 'Observe backtracking search via Stack. Walkthrough highlights stack contents, visiting depth, and backtrack routes step-by-step.',
  lines: [
    line(1, [cm('// DFS Algorithm Walkthrough (Numerical Simulation)')]),
    line(2, [kw('void'), tx(' '), fn('DFS'), pu('('), va('Node'), tx(' '), va('curr'), pu(')'), tx(' {')]),
    line(3, [tx('    '), va('visited'), pu('['), va('curr'), pu(']'), tx(' '), op('='), tx(' '), kw('true'), pu(';')]),
    line(4, [tx('    '), fn('process'), pu('('), va('curr'), pu(')'), pu(';')]),
    line(5, [tx('    '), kw('for'), tx(' '), pu('('), va('Node'), tx(' '), va('nbr'), tx(' '), kw('in'), tx(' '), va('adj'), pu('['), va('curr'), pu(']'), pu(')'), tx(' {')]),
    line(6, [tx('        '), kw('if'), tx(' '), pu('('), op('!'), va('visited'), pu('['), va('nbr'), pu(']'), pu(')'), tx(' {')]),
    line(7, [tx('            '), fn('DFS'), pu('('), va('nbr'), pu(')'), pu(';'), tx(' '), cm('// Recursive Stack push')]),
    line(8, [tx('        '), pu('}')]),
    line(9, [tx('    '), pu('}')]),
    line(10, [pu('}')]),
  ],
  editableVariables: {
    graphPreset: { default: 1, min: 1, max: 2, label: 'Graph Preset' },
  },
  generateSteps: (vars?: Record<string, any>): ExecutionStep[] => {
    const preset = Number(vars?.graphPreset ?? 1);
    if (preset === 2) {
      return [
        {
          step: 1, lineNum: 2,
          explanationEnglish: 'DFS begins on Graph 2 (9 Vertices). Start at Node 1.',
          explanationHinglish: 'Graph 2 (9 Vertices) par DFS call stack shuru hui starting Node 1 se.',
          memorySnapshot: { stack: ['DFS(1)'], visited: ['1'], path: [] },
          consoleOutput: 'DFS initialized on Graph 2 at Node 1.',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 2, lineNum: 4,
          explanationEnglish: 'Process Node 1. Add to Path: [1].',
          explanationHinglish: 'Node 1 ko process kiya. Visited Path: [1].',
          memorySnapshot: { stack: ['DFS(1)'], visited: ['1'], path: ['1'] },
          consoleOutput: 'Processed: 1',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 3, lineNum: 7,
          explanationEnglish: 'Recurse into Node 1\'s neighbor: DFS(2). Stack Push.',
          explanationHinglish: 'Node 1 ke neighbor 2 par recursive call stack push kiya: DFS(2).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)'], visited: ['1', '2'], path: ['1', '2'] },
          consoleOutput: 'Stack Push: DFS(2)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 4, lineNum: 7,
          explanationEnglish: 'Recurse into Node 2\'s neighbor: DFS(4). Stack Push.',
          explanationHinglish: 'Node 2 ke neighbor 4 par recursive call stack push kiya: DFS(4).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)'], visited: ['1', '2', '4'], path: ['1', '2', '4'] },
          consoleOutput: 'Stack Push: DFS(4)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 5, lineNum: 7,
          explanationEnglish: 'Recurse into Node 4\'s neighbor: DFS(6). Stack Push.',
          explanationHinglish: 'Node 4 ke neighbor 6 par recursive call stack push kiya: DFS(6).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)'], visited: ['1', '2', '4', '6'], path: ['1', '2', '4', '6'] },
          consoleOutput: 'Stack Push: DFS(6)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 6, lineNum: 7,
          explanationEnglish: 'Recurse into Node 6\'s neighbor: DFS(3). Stack Push.',
          explanationHinglish: 'Node 6 ke neighbor 3 par recursive call stack push kiya: DFS(3).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)', 'DFS(3)'], visited: ['1', '2', '4', '6', '3'], path: ['1', '2', '4', '6', '3'] },
          consoleOutput: 'Stack Push: DFS(3)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 7, lineNum: 9,
          explanationEnglish: 'Node 3 has no unvisited neighbors. Backtrack (Pop DFS(3)).',
          explanationHinglish: 'Node 3 ka koi unvisited neighbor nahi bacha. Backtrack kiya (Pop DFS(3)).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)'], visited: ['1', '2', '4', '6', '3'], path: ['1', '2', '4', '6', '3'] },
          consoleOutput: 'Stack Pop: DFS(3)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 8, lineNum: 7,
          explanationEnglish: 'From Node 6, recurse into unvisited neighbor: DFS(9). Stack Push.',
          explanationHinglish: 'Node 6 se unvisited neighbor 9 par call stack push kiya: DFS(9).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)', 'DFS(9)'], visited: ['1', '2', '4', '6', '3', '9'], path: ['1', '2', '4', '6', '3', '9'] },
          consoleOutput: 'Stack Push: DFS(9)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 9, lineNum: 7,
          explanationEnglish: 'Recurse into Node 9\'s neighbor: DFS(7). Stack Push.',
          explanationHinglish: 'Node 9 ke neighbor 7 par recursive call stack push kiya: DFS(7).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)', 'DFS(9)', 'DFS(7)'], visited: ['1', '2', '4', '6', '3', '9', '7'], path: ['1', '2', '4', '6', '3', '9', '7'] },
          consoleOutput: 'Stack Push: DFS(7)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 10, lineNum: 7,
          explanationEnglish: 'Recurse into Node 7\'s neighbor: DFS(5). Stack Push.',
          explanationHinglish: 'Node 7 ke neighbor 5 par recursive call stack push kiya: DFS(5).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)', 'DFS(9)', 'DFS(7)', 'DFS(5)'], visited: ['1', '2', '4', '6', '3', '9', '7', '5'], path: ['1', '2', '4', '6', '3', '9', '7', '5'] },
          consoleOutput: 'Stack Push: DFS(5)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 11, lineNum: 7,
          explanationEnglish: 'Recurse into Node 5\'s unvisited neighbor: DFS(8). Stack Push.',
          explanationHinglish: 'Node 5 ke neighbor 8 par recursive call stack push kiya: DFS(8).',
          memorySnapshot: { stack: ['DFS(1)', 'DFS(2)', 'DFS(4)', 'DFS(6)', 'DFS(9)', 'DFS(7)', 'DFS(5)', 'DFS(8)'], visited: ['1', '2', '4', '6', '3', '9', '7', '5', '8'], path: ['1', '2', '4', '6', '3', '9', '7', '5', '8'] },
          consoleOutput: 'Stack Push: DFS(8)',
          animationEvent: { type: 'NONE' },
        },
        {
          step: 12, lineNum: 10,
          explanationEnglish: 'All 9 nodes visited! Backtrack complete. DFS finished.',
          explanationHinglish: 'Sabhi 9 nodes visit ho gaye! DFS complete. Path: [1, 2, 4, 6, 3, 9, 7, 5, 8].',
          memorySnapshot: { stack: [], visited: ['1', '2', '4', '6', '3', '9', '7', '5', '8'], path: ['1', '2', '4', '6', '3', '9', '7', '5', '8'] },
          consoleOutput: 'DFS Complete: 1 -> 2 -> 4 -> 6 -> 3 -> 9 -> 7 -> 5 -> 8',
          animationEvent: { type: 'NONE' },
        },
      ];
    }

    return [
      {
        step: 1,
        lineNum: 2,
        explanationEnglish: 'DFS starts from selected node (e.g. A).',
        explanationHinglish: 'DFS call stack shuru hui starting node A se.',
        memorySnapshot: { stack: ['DFS(A)'], visited: ['A'], path: [] },
        consoleOutput: 'DFS traversal initialized.',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2,
        lineNum: 4,
        explanationEnglish: 'Process A. Add to path: [A].',
        explanationHinglish: 'A ko process kiya. Visited path: [A].',
        memorySnapshot: { stack: ['DFS(A)'], visited: ['A'], path: ['A'] },
        consoleOutput: 'Processed: A',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 3,
        lineNum: 7,
        explanationEnglish: 'Recurse into A\'s neighbor: DFS(B).',
        explanationHinglish: 'A ke neighbor B pe recursive call stack push kiya: DFS(B).',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)'], visited: ['A', 'B'], path: ['A'] },
        consoleOutput: 'Stack Push: DFS(B)',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 4,
        lineNum: 4,
        explanationEnglish: 'Process B. Add to path: [A, B].',
        explanationHinglish: 'B ko process kiya. Visited path: [A, B].',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)'], visited: ['A', 'B'], path: ['A', 'B'] },
        consoleOutput: 'Processed: B',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 5,
        lineNum: 7,
        explanationEnglish: 'Recurse into B\'s neighbor: DFS(D).',
        explanationHinglish: 'B ke neighbor D pe call push kiya: DFS(D).',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)'], visited: ['A', 'B', 'D'], path: ['A', 'B'] },
        consoleOutput: 'Stack Push: DFS(D)',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 6,
        lineNum: 4,
        explanationEnglish: 'Process D. Add to path: [A, B, D].',
        explanationHinglish: 'D ko process kiya. Visited path: [A, B, D].',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)'], visited: ['A', 'B', 'D'], path: ['A', 'B', 'D'] },
        consoleOutput: 'Processed: D',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 7,
        lineNum: 7,
        explanationEnglish: 'Recurse into D\'s neighbor: DFS(E).',
        explanationHinglish: 'D ke neighbor E pe call stack push: DFS(E).',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)', 'DFS(E)'], visited: ['A', 'B', 'D', 'E'], path: ['A', 'B', 'D'] },
        consoleOutput: 'Stack Push: DFS(E)',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 8,
        lineNum: 4,
        explanationEnglish: 'Process E. Add to path: [A, B, D, E].',
        explanationHinglish: 'E ko process kiya. Visited path: [A, B, D, E].',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)', 'DFS(E)'], visited: ['A', 'B', 'D', 'E'], path: ['A', 'B', 'D', 'E'] },
        consoleOutput: 'Processed: E',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 9,
        lineNum: 10,
        explanationEnglish: 'E has no unvisited neighbors. Backtrack: pop DFS(E).',
        explanationHinglish: 'E ke saare neighbors visited hain. Backtrack kiya: pop DFS(E).',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)'], visited: ['A', 'B', 'D', 'E'], path: ['A', 'B', 'D', 'E'] },
        consoleOutput: 'Stack Pop: DFS(E)',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 10,
        lineNum: 7,
        explanationEnglish: 'Back at D, explore other neighbor: DFS(C).',
        explanationHinglish: 'D ke other neighbor C pe stack push: DFS(C).',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)', 'DFS(C)'], visited: ['A', 'B', 'D', 'E', 'C'], path: ['A', 'B', 'D', 'E'] },
        consoleOutput: 'Stack Push: DFS(C)',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 11,
        lineNum: 4,
        explanationEnglish: 'Process C. Add to path: [A, B, D, E, C].',
        explanationHinglish: 'C ko process kiya. Visited path: [A, B, D, E, C].',
        memorySnapshot: { stack: ['DFS(A)', 'DFS(B)', 'DFS(D)', 'DFS(C)'], visited: ['A', 'B', 'D', 'E', 'C'], path: ['A', 'B', 'D', 'E', 'C'] },
        consoleOutput: 'Processed: C',
        animationEvent: { type: 'NONE' },
      },
      {
        step: 12,
        lineNum: 10,
        explanationEnglish: 'All remaining elements visited. Pop remaining frames. DFS complete.',
        explanationHinglish: 'Sabhi nodes visited ho gaye. Remaining call stacks pop kiya. DFS complete!',
        memorySnapshot: { stack: [], visited: ['A', 'B', 'C', 'D', 'E'], path: ['A', 'B', 'D', 'E', 'C'] },
        consoleOutput: 'DFS Complete. Path: A -> B -> D -> E -> C',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};
export const dsa_graph_dijkstra: LessonProgram = {
  id: 'dsa_graph_dijkstra', language: 'dsa', topic: 'graph_dijkstra', lessonNumber: 1,
  friendlyName: "Dijkstra's Shortest Path Algorithm",
  learningObjective: "Single-source shortest path calculation on weighted graph with distance table & edge relaxation.",
  lines: [
    line(1, [cm("// Dijkstra's Shortest Path Algorithm")]),
    line(2, [kw('void'), tx(' '), fn('dijkstra'), pu('('), kw('int'), tx(' '), va('startNode'), pu(')')]),
  ],
  editableVariables: {
    graphPreset: { default: 1, min: 1, max: 2, label: 'Graph Preset' },
  },
  generateSteps: (vars?: Record<string, any>): ExecutionStep[] => {
    const preset = Number(vars?.graphPreset ?? 1);
    if (preset === 2) {
      const graph2Nodes = [
        { id: '1', x: 65, y: 170 },
        { id: '2', x: 175, y: 70 },
        { id: '3', x: 175, y: 270 },
        { id: '4', x: 285, y: 70 },
        { id: '5', x: 285, y: 270 },
        { id: '6', x: 395, y: 70 },
        { id: '7', x: 395, y: 270 },
        { id: '8', x: 475, y: 170 },
      ];
      const graph2Edges = [
        { u: '1', v: '2', weight: 3 },
        { u: '1', v: '3', weight: 6 },
        { u: '2', v: '3', weight: 2 },
        { u: '2', v: '4', weight: 4 },
        { u: '2', v: '5', weight: 7 },
        { u: '3', v: '5', weight: 1 },
        { u: '4', v: '6', weight: 5 },
        { u: '4', v: '7', weight: 3 },
        { u: '5', v: '7', weight: 8 },
        { u: '6', v: '8', weight: 2 },
        { u: '7', v: '8', weight: 4 },
      ];
      return [
        {
          step: 1, lineNum: 1,
          explanationEnglish: "Dijkstra's initialized on Complex Graph 2 (8 Vertices: 1-8). Source = Node 1.",
          explanationHinglish: "Graph 2 (8 Vertices: 1-8) par Dijkstra's Algorithm shuru hua. Source = Node 1.",
          memorySnapshot: {
            nodes: graph2Nodes,
            edges: graph2Edges,
            isDijkstra: true,
            preset: 2,
            distMap: { '1': 0, '2': 3, '3': 5, '4': 7, '5': 6, '6': 12, '7': 10, '8': 14 },
            settledSet: ['1'],
            activeNode: '1',
          },
          consoleOutput: "> Dijkstra initialized on Graph 2 (8 Nodes).",
          animationEvent: { type: 'NONE' },
        },
      ];
    }
    const graph1Nodes = [
      { id: '1', x: 75, y: 170 },
      { id: '2', x: 200, y: 65 },
      { id: '3', x: 200, y: 275 },
      { id: '4', x: 345, y: 65 },
      { id: '5', x: 345, y: 275 },
      { id: '6', x: 465, y: 170 },
    ];
    const graph1Edges = [
      { u: '1', v: '2', weight: 4 },
      { u: '1', v: '3', weight: 2 },
      { u: '2', v: '3', weight: 1 },
      { u: '2', v: '4', weight: 5 },
      { u: '3', v: '4', weight: 8 },
      { u: '3', v: '5', weight: 10 },
      { u: '4', v: '5', weight: 2 },
      { u: '4', v: '6', weight: 6 },
      { u: '5', v: '6', weight: 3 },
    ];
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: "Dijkstra's Algorithm initialized on Graph 1 (6 Vertices).",
        explanationHinglish: "Graph 1 (6 Vertices) par Dijkstra's Shortest Path Workspace initialize hua.",
        memorySnapshot: {
          nodes: graph1Nodes,
          edges: graph1Edges,
          isDijkstra: true,
          preset: 1,
        },
        consoleOutput: "> Dijkstra initialized.",
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_graph_kruskal: LessonProgram = {
  id: 'dsa_graph_kruskal', language: 'dsa', topic: 'graph_kruskal', lessonNumber: 1,
  friendlyName: "Kruskal's Minimum Spanning Tree (MST)",
  learningObjective: "Minimum Spanning Tree construction using edge weight sorting & Disjoint Set Union.",
  lines: [
    line(1, [cm("// Kruskal's Minimum Spanning Tree Algorithm")]),
  ],
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: "Kruskal's MST Algorithm initialized on Weighted Graph.",
        explanationHinglish: "Weighted Graph par Kruskal's MST Workspace initialize hua.",
        memorySnapshot: { isKruskal: true },
        consoleOutput: "> Kruskal initialized.",
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_graph_prims: LessonProgram = {
  id: 'dsa_graph_prims', language: 'dsa', topic: 'graph_prims', lessonNumber: 1,
  friendlyName: "Prim's Minimum Spanning Tree (MST)",
  learningObjective: "Minimum Spanning Tree construction using Priority Queue & vertex expansion.",
  lines: [
    line(1, [cm("// Prim's Minimum Spanning Tree Algorithm")]),
  ],
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: "Prim's MST Algorithm initialized on Weighted Graph.",
        explanationHinglish: "Weighted Graph par Prim's MST Workspace initialize hua.",
        memorySnapshot: { isPrims: true },
        consoleOutput: "> Prim's initialized.",
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_graph_astar: LessonProgram = {
  id: 'dsa_graph_astar', language: 'dsa', topic: 'graph_astar', lessonNumber: 1,
  friendlyName: 'A* (A-Star) Search Algorithm',
  learningObjective: 'Optimal pathfinding using Heuristic evaluation f(n) = g(n) + h(n), Open Set priority queue, and Closed Set tracking.',
  lines: [
    line(1, [cm('// A* (A-Star) Search Algorithm: f(n) = g(n) + h(n)')]),
    line(2, [cm('// g(n): Actual path cost from Start Node')]),
    line(3, [cm('// h(n): Heuristic estimate to Target Node')]),
    line(4, [cm('// Open Set: Priority queue sorted by minimum f(n)')]),
    line(5, [cm('// Closed Set: Evaluated nodes')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'A* Search Algorithm workspace initialized. Priority Queue Open Set will evaluate nodes using f(n) = g(n) + h(n).',
      explanationHinglish: 'A* Search Algorithm workspace initialize hua. Open Set (Priority Queue) minimum f(n) = g(n) + h(n) value wale nodes ko evaluate karega.',
      memorySnapshot: { isAStar: true },
      consoleOutput: '> A* Search Algorithm workspace initialized.',
      animationEvent: { type: 'NONE' },
    },
  ],
  executionSteps: [],
};

export const dsa_binary_tree: LessonProgram = {
  id: 'dsa_binary_tree', language: 'dsa', topic: 'binary_tree', lessonNumber: 1,
  friendlyName: 'Binary Search Tree (BST)',
  learningObjective: 'Interactive Binary Search Tree Workspace: Perform Node Insertion, Searching, and Traversal operations.',
  lines: [
    line(1, [cm('// Interactive Binary Search Tree (BST) Workspace')]),
    line(2, [cm('// Use the operational panel on the left to insert, search and delete nodes.')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Binary Search Tree initialized. Left children elements are smaller; right children are larger.',
        explanationHinglish: 'BST initialize ho gaya. Left nodes choti values contain karte hain aur right nodes badi values.',
        memorySnapshot: { capacity: 7, list: [] },
        consoleOutput: 'Binary Search Tree initialized.',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_dll_traverse: LessonProgram = {
  id: 'dsa_dll_traverse',
  language: 'dsa',
  topic: 'doubly_linked_list',
  lessonNumber: 1,
  friendlyName: 'Doubly Linked List Implementation & Bidirectional Operations',
  learningObjective: 'Understand how nodes link with both prev and next pointers in dynamic heap memory.',
  lines: [
    line(1, [kw('struct'), tx(' '), va('Node'), tx(' {')]),
    line(2, [tx('    '), kw('int'), tx(' '), va('data'), pu(';')]),
    line(3, [tx('    '), va('Node'), op('*'), tx(' '), va('prev'), pu(';')]),
    line(4, [tx('    '), va('Node'), op('*'), tx(' '), va('next'), pu(';')]),
    line(5, [pu('}')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Doubly Linked List initialized. Nodes contain prev and next pointer links.',
        explanationHinglish: 'Doubly Linked List initialize hui hai. Nodes me prev aur next pointers hain.',
        memorySnapshot: { capacity: 6, list: [] },
        consoleOutput: '> Doubly Linked List workspace initialized.',
        animationEvent: { type: 'NONE' },
      },
    ];
  },
  executionSteps: [],
};

export const dsa_hashset: LessonProgram = {
  id: 'dsa_hashset', language: 'dsa', topic: 'hashset', lessonNumber: 18,
  friendlyName: 'HashSet Data Structure',
  learningObjective: 'Store unique keys using hash bucket indexing h(key) = key % 7. Operations: add(), remove(), contains().',
  lines: [
    line(1, [kw('HashSet'), pu('<'), kw('int'), pu('>'), tx(' '), va('set'), tx(' '), op('='), tx(' '), kw('new'), tx(' '), kw('HashSet'), pu('()'), pu(';')]),
    line(2, [va('set'), pu('.'), fn('add'), pu('('), nu('10'), pu(')'), pu(';')]),
    line(3, [va('set'), pu('.'), fn('add'), pu('('), nu('25'), pu(')'), pu(';')]),
    line(4, [va('set'), pu('.'), fn('add'), pu('('), nu('42'), pu(')'), pu(';')]),
    line(5, [va('set'), pu('.'), fn('contains'), pu('('), nu('25'), pu(')'), pu(';'), tx(' '), cm('// Returns true')]),
    line(6, [va('set'), pu('.'), fn('remove'), pu('('), nu('10'), pu(')'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: () => [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'HashSet initialized with 7 Buckets.',
      explanationHinglish: 'HashSet 7 Buckets ke saath initialize hui.',
      memorySnapshot: { capacity: 7, elements: ['10', '25', '42'] },
      consoleOutput: '> HashSet workspace initialized.',
      animationEvent: { type: 'NONE' },
    },
  ],
  executionSteps: [],
};

export const dsa_hashmap: LessonProgram = {
  id: 'dsa_hashmap', language: 'dsa', topic: 'hashmap', lessonNumber: 19,
  friendlyName: 'HashMap Data Structure',
  learningObjective: 'Store Key-Value pairs mapped into 7 hash buckets h(key). Operations: put(k,v), get(k), remove(k).',
  lines: [
    line(1, [kw('HashMap'), pu('<'), kw('String'), pu(','), tx(' '), kw('String'), pu('>'), tx(' '), va('map'), tx(' '), op('='), tx(' '), kw('new'), tx(' '), kw('HashMap'), pu('()'), pu(';')]),
    line(2, [va('map'), pu('.'), fn('put'), pu('('), st('"id"'), pu(','), tx(' '), st('"101"'), pu(')'), pu(';')]),
    line(3, [va('map'), pu('.'), fn('put'), pu('('), st('"name"'), pu(','), tx(' '), st('"Alice"'), pu(')'), pu(';')]),
    line(4, [va('map'), pu('.'), fn('put'), pu('('), st('"age"'), pu(','), tx(' '), st('"24"'), pu(')'), pu(';')]),
    line(5, [va('map'), pu('.'), fn('get'), pu('('), st('"name"'), pu(')'), pu(';'), tx(' '), cm('// Returns "Alice"')]),
    line(6, [va('map'), pu('.'), fn('remove'), pu('('), st('"id"'), pu(')'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: () => [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'HashMap initialized with 7 Hash Buckets.',
      explanationHinglish: 'HashMap 7 Hash Buckets ke saath initialize hui.',
      memorySnapshot: { capacity: 7, entries: [['id', '101'], ['name', 'Alice'], ['age', '24']] },
      consoleOutput: '> HashMap workspace initialized.',
      animationEvent: { type: 'NONE' },
    },
  ],
  executionSteps: [],
};

// ─── EXPORT ────────────────────────────────────────────────────────────────────

export const dsaLessons: Record<string, LessonProgram> = {
  dsa_array_declare,
  dsa_array_max_min,
  dsa_array_reverse,
  dsa_array_count,
  dsa_linear_search,
  dsa_binary_search,
  dsa_bubble_sort,
  dsa_selection_sort,
  dsa_insertion_sort,
  dsa_stack_push_pop,
  dsa_queue_enq_deq,
  dsa_sll_traverse,
  dsa_dll_traverse,
  dsa_graph_basics,
  dsa_graph_bfs,
  dsa_graph_dfs,
  dsa_graph_dijkstra,
  dsa_graph_kruskal,
  dsa_graph_prims,
  dsa_graph_astar,
  dsa_binary_tree,
  dsa_merge_sort,
  dsa_quick_sort,
  dsa_heap_sort,
  dsa_hashset,
  dsa_hashmap,
  // Re-use existing Python lessons for tree/graph until dedicated versions are built:
  linear_search: dsa_linear_search,
  binary_search: dsa_binary_search,
  bubble_sort: dsa_bubble_sort,
  selection_sort: dsa_selection_sort,
  insertion_sort: dsa_insertion_sort,
  quick_sort: dsa_quick_sort,
  hashset: dsa_hashset,
  hashmap: dsa_hashmap,
};

