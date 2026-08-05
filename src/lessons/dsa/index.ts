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
  friendlyName: 'Array Declaration & Initialization',
  learningObjective: 'Understand how arrays allocate contiguous memory blocks. Each index stores one element.',
  lines: [
    line(1, [cm('// Array Declaration & Memory Layout (C++ style)')]),
    line(2, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('10'), pu(','), tx(' '), nu('30'), pu(','), tx(' '), nu('20'), pu(','), tx(' '), nu('50'), pu(','), tx(' '), nu('40'), pu('}'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('n'), tx(' '), op('='), tx(' '), nu('5'), pu(';'), tx(' '), cm('// array size')]),
    line(4, [cm('// Access elements using index:')]),
    line(5, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), va('n'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(6, [tx('    '), fn('print'), pu('('), va('arr'), pu('['), va('i'), pu(']'), pu(')')]),
    line(7, [pu('}')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      { step: 1, lineNum: 2, explanationEnglish: 'Declare int arr[5] and allocate 5 × 4B = 20 bytes of contiguous memory.', explanationHinglish: 'int arr[5] declare hua — 5 × 4 Bytes = 20 Bytes contiguous memory allocate hui.', memorySnapshot: { 'arr[0]': '10 [4B]', 'arr[1]': '30 [4B]', 'arr[2]': '20 [4B]', 'arr[3]': '50 [4B]', 'arr[4]': '40 [4B]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: '[10,30,20,50,40]' } },
      { step: 2, lineNum: 3, explanationEnglish: 'n = 5 stores the array size.', explanationHinglish: 'n = 5 array ki length store karta hai.', memorySnapshot: { 'arr[0]': '10 [4B]', 'arr[1]': '30 [4B]', 'arr[2]': '20 [4B]', 'arr[3]': '50 [4B]', 'arr[4]': '40 [4B]', n: 5 }, animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: 5 } },
      { step: 3, lineNum: 5, explanationEnglish: 'Loop i=0: access arr[0] = 10.', explanationHinglish: 'i=0: arr[0] = 10 access hua.', memorySnapshot: { 'arr[0]': '10 [4B]', 'arr[1]': '30 [4B]', 'arr[2]': '20 [4B]', 'arr[3]': '50 [4B]', 'arr[4]': '40 [4B]', n: 5, i: 0 }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: 0 } },
      { step: 4, lineNum: 5, explanationEnglish: 'Loop i=1: access arr[1] = 30.', explanationHinglish: 'i=1: arr[1] = 30 access hua.', memorySnapshot: { 'arr[0]': '10 [4B]', 'arr[1]': '30 [4B]', 'arr[2]': '20 [4B]', 'arr[3]': '50 [4B]', 'arr[4]': '40 [4B]', n: 5, i: 1 }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: 1 } },
      { step: 5, lineNum: 5, explanationEnglish: 'Loop i=2: access arr[2] = 20.', explanationHinglish: 'i=2: arr[2] = 20 access hua.', memorySnapshot: { 'arr[0]': '10 [4B]', 'arr[1]': '30 [4B]', 'arr[2]': '20 [4B]', 'arr[3]': '50 [4B]', 'arr[4]': '40 [4B]', n: 5, i: 2 }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: 2 } },
      { step: 6, lineNum: 6, explanationEnglish: 'Print all: 10 30 20 50 40.', explanationHinglish: 'Console pe print: 10 30 20 50 40.', memorySnapshot: { 'arr[0]': '10 [4B]', 'arr[1]': '30 [4B]', 'arr[2]': '20 [4B]', 'arr[3]': '50 [4B]', 'arr[4]': '40 [4B]' }, consoleOutput: '10 30 20 50 40', animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: '10 30 20 50 40' } },
    ];
  },
  executionSteps: [],
};

export const dsa_array_sum: LessonProgram = {
  id: 'dsa_array_sum', language: 'dsa', topic: 'array_operations', lessonNumber: 2,
  friendlyName: 'Sum & Average of Array Elements',
  learningObjective: 'Accumulate the sum of all array elements and compute the average.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('10'), pu(','), tx(' '), nu('20'), pu(','), tx(' '), nu('30'), pu(','), tx(' '), nu('40'), pu(','), tx(' '), nu('50'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('sum'), tx(' '), op('='), tx(' '), nu('0'), pu(';')]),
    line(3, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), nu('5'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(4, [tx('    '), va('sum'), tx(' '), op('+='), tx(' '), va('arr'), pu('['), va('i'), pu(']'), pu(';')]),
    line(5, [pu('}')]),
    line(6, [kw('double'), tx(' '), va('avg'), tx(' '), op('='), tx(' '), pu('('), kw('double'), pu(')'), va('sum'), tx(' '), op('/'), tx(' '), nu('5'), pu(';')]),
    line(7, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Sum: "'), tx(' '), op('<<'), tx(' '), va('sum'), tx(' '), op('<<'), tx(' '), st('" Avg: "'), tx(' '), op('<<'), tx(' '), va('avg'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [10, 20, 30, 40, 50];
    const steps: ExecutionStep[] = [];
    let sum = 0;
    steps.push({ step: 1, lineNum: 1, explanationEnglish: 'Array arr = {10,20,30,40,50} initialized.', explanationHinglish: 'Array arr initialize hua: {10,20,30,40,50}.', memorySnapshot: { arr: '[10,20,30,40,50]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: '[10,20,30,40,50]' } });
    steps.push({ step: 2, lineNum: 2, explanationEnglish: 'sum = 0 initialized.', explanationHinglish: 'Accumulator sum = 0 se shuru.', memorySnapshot: { arr: '[10,20,30,40,50]', sum: 0 }, animationEvent: { type: 'CREATE_VARIABLE', name: 'sum', value: 0 } });
    for (let i = 0; i < arr.length; i++) {
      const prev = sum;
      sum += arr[i];
      steps.push({ step: 3 + i, lineNum: 4, explanationEnglish: `i=${i}: sum = ${prev} + arr[${i}](${arr[i]}) = ${sum}.`, explanationHinglish: `i=${i}: sum = ${prev} + ${arr[i]} = ${sum}.`, memorySnapshot: { arr: '[10,20,30,40,50]', sum, i }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'sum', oldValue: prev, newValue: sum } });
    }
    const avg = sum / 5;
    steps.push({ step: 8, lineNum: 6, explanationEnglish: `avg = ${sum} / 5 = ${avg}.`, explanationHinglish: `avg = ${sum} / 5 = ${avg}.`, memorySnapshot: { arr: '[10,20,30,40,50]', sum, avg }, animationEvent: { type: 'CREATE_VARIABLE', name: 'avg', value: avg } });
    steps.push({ step: 9, lineNum: 7, explanationEnglish: `Output: Sum: ${sum} Avg: ${avg}`, explanationHinglish: `Console pe print: Sum ${sum}, Avg ${avg}.`, memorySnapshot: { sum, avg }, consoleOutput: `Sum: ${sum} Avg: ${avg}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'sum', outputValue: `${sum}` } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_array_max_min: LessonProgram = {
  id: 'dsa_array_max_min', language: 'dsa', topic: 'array_operations', lessonNumber: 3,
  friendlyName: 'Find Maximum & Minimum Element',
  learningObjective: 'Traverse the array in one pass to track the maximum and minimum values.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('40'), pu(','), tx(' '), nu('10'), pu(','), tx(' '), nu('70'), pu(','), tx(' '), nu('25'), pu(','), tx(' '), nu('55'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('maxVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), nu('0'), pu(']'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('minVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), nu('0'), pu(']'), pu(';')]),
    line(4, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('1'), pu(';'), tx(' '), va('i'), op('<'), nu('5'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(5, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('>'), tx(' '), va('maxVal'), pu(')'), tx(' '), va('maxVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('i'), pu(']'), pu(';')]),
    line(6, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('<'), tx(' '), va('minVal'), pu(')'), tx(' '), va('minVal'), tx(' '), op('='), tx(' '), va('arr'), pu('['), va('i'), pu(']'), pu(';')]),
    line(7, [pu('}')]),
    line(8, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Max: "'), tx(' '), op('<<'), tx(' '), va('maxVal'), tx(' '), op('<<'), tx(' '), st('" Min: "'), tx(' '), op('<<'), tx(' '), va('minVal'), pu(';')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const arr = [40, 10, 70, 25, 55];
    let maxVal = arr[0], minVal = arr[0];
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 2, explanationEnglish: `maxVal starts at arr[0] = ${maxVal}.`, explanationHinglish: `maxVal = arr[0] = ${maxVal} se initialize.`, memorySnapshot: { maxVal, minVal }, animationEvent: { type: 'CREATE_VARIABLE', name: 'maxVal', value: maxVal } },
      { step: 2, lineNum: 3, explanationEnglish: `minVal starts at arr[0] = ${minVal}.`, explanationHinglish: `minVal = arr[0] = ${minVal} se initialize.`, memorySnapshot: { maxVal, minVal }, animationEvent: { type: 'CREATE_VARIABLE', name: 'minVal', value: minVal } },
    ];
    for (let i = 1; i < arr.length; i++) {

      if (arr[i] > maxVal) maxVal = arr[i];
      if (arr[i] < minVal) minVal = arr[i];
      steps.push({ step: 2 + i, lineNum: 5, explanationEnglish: `i=${i}: arr[${i}]=${arr[i]} — maxVal=${maxVal}, minVal=${minVal}.`, explanationHinglish: `arr[${i}]=${arr[i]} check kiya — max=${maxVal}, min=${minVal}.`, memorySnapshot: { i, maxVal, minVal }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: i } });
    }
    steps.push({ step: steps.length + 1, lineNum: 8, explanationEnglish: `Output: Max: ${maxVal} Min: ${minVal}`, explanationHinglish: `Console pe Max: ${maxVal}, Min: ${minVal} print hua.`, memorySnapshot: { maxVal, minVal }, consoleOutput: `Max: ${maxVal} Min: ${minVal}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'maxVal', outputValue: maxVal } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_array_reverse: LessonProgram = {
  id: 'dsa_array_reverse', language: 'dsa', topic: 'array_operations', lessonNumber: 4,
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
    const arr = [10, 20, 30, 40, 50];
    let left = 0, right = 4;
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 1, explanationEnglish: 'Array arr = {10,20,30,40,50} initialized.', explanationHinglish: 'Array arr = {10,20,30,40,50} memory me store hua.', memorySnapshot: { arr: '[10,20,30,40,50]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: '[10,20,30,40,50]' } },
      { step: 2, lineNum: 2, explanationEnglish: 'left = 0 (start), right = 4 (end). Two pointer setup.', explanationHinglish: 'left = 0 (shuru), right = 4 (end). Two pointer ready.', memorySnapshot: { arr: '[10,20,30,40,50]', left, right }, animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'left', value: 0 }, { name: 'right', value: 4 }] } },
    ];
    let step = 3;
    while (left < right) {
      const temp = arr[left];
      steps.push({ step: step++, lineNum: 4, explanationEnglish: `temp = arr[${left}] = ${arr[left]}. Save before swap.`, explanationHinglish: `temp = arr[${left}] = ${arr[left]} save kiya.`, memorySnapshot: { arr: `[${arr.join(',')}]`, left, right, temp }, animationEvent: { type: 'CREATE_VARIABLE', name: 'temp', value: temp } });
      arr[left] = arr[right];
      steps.push({ step: step++, lineNum: 5, explanationEnglish: `arr[${left}] = arr[${right}] = ${arr[right]}. Left replaced.`, explanationHinglish: `arr[${left}] ko arr[${right}] ki value didi.`, memorySnapshot: { arr: `[${arr.join(',')}]`, left, right }, animationEvent: { type: 'UPDATE_ARRAY_INDEX', arrayName: 'arr', index: left, oldValue: temp, newValue: arr[left] } });
      arr[right] = temp;
      steps.push({ step: step++, lineNum: 6, explanationEnglish: `arr[${right}] = temp = ${temp}. Swap complete!`, explanationHinglish: `arr[${right}] ko temp = ${temp} se replace kiya. Swap complete!`, memorySnapshot: { arr: `[${arr.join(',')}]`, left, right }, animationEvent: { type: 'UPDATE_ARRAY_INDEX', arrayName: 'arr', index: right, oldValue: arr[left], newValue: temp } });
      left++; right--;
      steps.push({ step: step++, lineNum: 7, explanationEnglish: `left = ${left}, right = ${right}. Pointers moved inward.`, explanationHinglish: `left++ = ${left}, right-- = ${right}. Pointers andar aaye.`, memorySnapshot: { arr: `[${arr.join(',')}]`, left, right }, animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'left', value: left }, { name: 'right', value: right }] } });
    }
    steps.push({ step: step, lineNum: 9, explanationEnglish: `Reversed array: [${arr.join(',')}]`, explanationHinglish: `Reversed array: [${arr.join(',')}]`, memorySnapshot: { arr: `[${arr.join(',')}]` }, consoleOutput: `Reversed: [${arr.join(', ')}]`, animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: `[${arr.join(',')}]` } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_array_count: LessonProgram = {
  id: 'dsa_array_count', language: 'dsa', topic: 'array_operations', lessonNumber: 5,
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
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 2, explanationEnglish: `Target = ${t}. Searching for this value.`, explanationHinglish: `target = ${t}. Is value ko dhundh rhe hai.`, memorySnapshot: { arr: `[${arr.join(',')}]`, target: t, count: 0 }, animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: t } },
    ];
    for (let i = 0; i < arr.length; i++) {
      const prev = count;
      if (arr[i] === t) count++;
      steps.push({ step: 2 + i, lineNum: 5, explanationEnglish: `i=${i}: arr[${i}]=${arr[i]} ${arr[i] === t ? '== target → count++' : '!= target'} → count=${count}.`, explanationHinglish: `arr[${i}]=${arr[i]} check kiya — count=${count}.`, memorySnapshot: { i, arr: `[${arr.join(',')}]`, target: t, count }, animationEvent: arr[i] === t ? { type: 'UPDATE_VARIABLE', name: 'count', oldValue: prev, newValue: count } : { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: i } });
    }
    steps.push({ step: steps.length + 1, lineNum: 7, explanationEnglish: `Target ${t} appears ${count} time(s).`, explanationHinglish: `target ${t} array me ${count} baar mila.`, memorySnapshot: { count }, consoleOutput: `Count: ${count}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'count', outputValue: count } });
    return steps;
  },
  executionSteps: [],
};

// ─── TOPIC 02: SEARCHING ─────────────────────────────────────────────────────

export const dsa_linear_search: LessonProgram = {
  id: 'dsa_linear_search', language: 'dsa', topic: 'searching', lessonNumber: 1,
  friendlyName: 'Linear Search Algorithm (O(N))',
  learningObjective: 'Sequentially check every element from index 0 to N-1. Stop when target is found.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('5'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('12'), pu(','), tx(' '), nu('35'), pu(','), tx(' '), nu('78'), pu(','), tx(' '), nu('22'), pu(','), tx(' '), nu('56'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('target'), tx(' '), op('='), tx(' '), nu('22', 'target'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('result'), tx(' '), op('='), tx(' '), nu('-1'), pu(';')]),
    line(4, [kw('for'), pu('('), kw('int'), tx(' '), va('i'), op('='), nu('0'), pu(';'), tx(' '), va('i'), op('<'), nu('5'), pu(';'), tx(' '), va('i'), op('++'), pu(')'), tx(' {')]),
    line(5, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('i'), pu(']'), tx(' '), op('=='), tx(' '), va('target'), pu(')'), tx(' {')]),
    line(6, [tx('        '), va('result'), tx(' '), op('='), tx(' '), va('i'), pu(';'), tx(' '), kw('break'), pu(';')]),
    line(7, [tx('    '), pu('}')]),
    line(8, [pu('}')]),
    line(9, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Found at index: "'), tx(' '), op('<<'), tx(' '), va('result'), pu(';')]),
  ],
  editableVariables: { target: { default: 22, label: 'Search target' } },
  generateSteps: ({ target }): ExecutionStep[] => {
    const arr = [12, 35, 78, 22, 56];
    const t = Number(target ?? 22);
    let result = -1;
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 2, explanationEnglish: `Search for target = ${t} in array.`, explanationHinglish: `target = ${t} ko array me dhundh rhe hain.`, memorySnapshot: { arr: `[${arr.join(',')}]`, target: t, result: -1 }, animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: t } },
    ];
    for (let i = 0; i < arr.length; i++) {
      const found = arr[i] === t;
      if (found) result = i;
      steps.push({ step: 2 + i, lineNum: 5, explanationEnglish: `i=${i}: arr[${i}]=${arr[i]} ${found ? '== target → FOUND!' : '!= target, continue'}`, explanationHinglish: `arr[${i}]=${arr[i]} ${found ? '→ Match milgaya!' : '→ match nahi, aage badho'}`, memorySnapshot: { i, arr: `[${arr.join(',')}]`, target: t, result }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: i } });
      if (found) break;
    }
    steps.push({ step: steps.length + 1, lineNum: 9, explanationEnglish: result >= 0 ? `Found at index ${result}.` : 'Not found. result = -1.', explanationHinglish: result >= 0 ? `Index ${result} pe mila.` : 'Nahi mila. result = -1.', memorySnapshot: { result }, consoleOutput: result >= 0 ? `Found at index: ${result}` : 'Not Found (-1)', animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: result } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_binary_search: LessonProgram = {
  id: 'dsa_binary_search', language: 'dsa', topic: 'searching', lessonNumber: 2,
  friendlyName: 'Binary Search Algorithm (O(log N))',
  learningObjective: 'Halve the search space each step using low, mid, high pointers on a SORTED array.',
  lines: [
    line(1, [kw('int'), tx(' '), va('arr'), pu('['), nu('7'), pu(']'), tx(' '), op('='), tx(' '), pu('{'), nu('5'), pu(','), tx(' '), nu('12'), pu(','), tx(' '), nu('23'), pu(','), tx(' '), nu('38'), pu(','), tx(' '), nu('56'), pu(','), tx(' '), nu('72'), pu(','), tx(' '), nu('89'), pu('}'), pu(';')]),
    line(2, [kw('int'), tx(' '), va('target'), tx(' '), op('='), tx(' '), nu('38', 'target'), pu(';')]),
    line(3, [kw('int'), tx(' '), va('low'), tx(' '), op('='), tx(' '), nu('0'), pu(','), tx(' '), va('high'), tx(' '), op('='), tx(' '), nu('6'), pu(','), tx(' '), va('mid'), pu(','), tx(' '), va('result'), tx(' '), op('='), tx(' '), nu('-1'), pu(';')]),
    line(4, [kw('while'), pu('('), va('low'), tx(' '), op('<='), tx(' '), va('high'), pu(')'), tx(' {')]),
    line(5, [tx('    '), va('mid'), tx(' '), op('='), tx(' '), pu('('), va('low'), tx(' '), op('+'), tx(' '), va('high'), pu(')'), tx(' '), op('/'), tx(' '), nu('2'), pu(';')]),
    line(6, [tx('    '), kw('if'), pu('('), va('arr'), pu('['), va('mid'), pu(']'), tx(' '), op('=='), tx(' '), va('target'), pu(')'), tx(' {'), va('result'), tx(' '), op('='), tx(' '), va('mid'), pu(';'), kw('break'), pu(';}')]),
    line(7, [tx('    '), kw('else if'), pu('('), va('arr'), pu('['), va('mid'), pu(']'), tx(' '), op('<'), tx(' '), va('target'), pu(')'), tx(' '), va('low'), tx(' '), op('='), tx(' '), va('mid'), op('+'), nu('1'), pu(';')]),
    line(8, [tx('    '), kw('else'), tx(' '), va('high'), tx(' '), op('='), tx(' '), va('mid'), op('-'), nu('1'), pu(';')]),
    line(9, [pu('}')]),
    line(10, [fn('cout'), tx(' '), op('<<'), tx(' '), st('"Found at: "'), tx(' '), op('<<'), tx(' '), va('result'), pu(';')]),
  ],
  editableVariables: { target: { default: 38, label: 'Search target' } },
  generateSteps: ({ target }): ExecutionStep[] => {
    const arr = [5, 12, 23, 38, 56, 72, 89];
    const t = Number(target ?? 38);
    let low = 0, high = arr.length - 1, result = -1;
    const steps: ExecutionStep[] = [
      { step: 1, lineNum: 2, explanationEnglish: `Binary Search for target = ${t} in sorted array.`, explanationHinglish: `Sorted array me target = ${t} ko binary search se dhundho.`, memorySnapshot: { arr: `[${arr.join(',')}]`, target: t, low, high, result: -1 }, animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'target', value: t }, { name: 'low', value: 0 }, { name: 'high', value: 6 }] } },
    ];
    let step = 2;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({ step: step++, lineNum: 5, explanationEnglish: `mid = (${low} + ${high}) / 2 = ${mid}. arr[${mid}] = ${arr[mid]}.`, explanationHinglish: `mid = ${mid}. arr[${mid}] = ${arr[mid]}.`, memorySnapshot: { low, high, mid, result }, animationEvent: { type: 'CREATE_VARIABLE', name: 'mid', value: mid } });
      if (arr[mid] === t) { result = mid; steps.push({ step: step++, lineNum: 6, explanationEnglish: `arr[${mid}] = ${arr[mid]} == target! Found at index ${mid}.`, explanationHinglish: `arr[${mid}] = ${arr[mid]} == ${t}! Index ${mid} pe milgaya!`, memorySnapshot: { low, high, mid, result }, animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: mid } }); break; }
      else if (arr[mid] < t) { const prevLow = low; low = mid + 1; steps.push({ step: step++, lineNum: 7, explanationEnglish: `arr[${mid}]=${arr[mid]} < target. Move low to ${low}.`, explanationHinglish: `arr[${mid}] < target. low = ${low} ho gaya.`, memorySnapshot: { low, high, mid, result }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'low', oldValue: prevLow, newValue: low } }); }
      else { const prevHigh = high; high = mid - 1; steps.push({ step: step++, lineNum: 8, explanationEnglish: `arr[${mid}]=${arr[mid]} > target. Move high to ${high}.`, explanationHinglish: `arr[${mid}] > target. high = ${high} ho gaya.`, memorySnapshot: { low, high, mid, result }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'high', oldValue: prevHigh, newValue: high } }); }
    }
    steps.push({ step: step, lineNum: 10, explanationEnglish: result >= 0 ? `Found at index ${result}!` : 'Not found.', explanationHinglish: result >= 0 ? `Target index ${result} pe mila!` : 'Nahi mila.', memorySnapshot: { result }, consoleOutput: result >= 0 ? `Found at: ${result}` : 'Not Found', animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: result } });
    return steps;
  },
  executionSteps: [],
};

// ─── TOPIC 03: SORTING ────────────────────────────────────────────────────────

export const dsa_bubble_sort: LessonProgram = {
  id: 'dsa_bubble_sort', language: 'dsa', topic: 'sorting', lessonNumber: 1,
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
  id: 'dsa_selection_sort', language: 'dsa', topic: 'sorting', lessonNumber: 2,
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
  id: 'dsa_insertion_sort', language: 'dsa', topic: 'sorting', lessonNumber: 3,
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

// ─── TOPIC 04: RECURSION ─────────────────────────────────────────────────────

export const dsa_recursion_factorial: LessonProgram = {
  id: 'dsa_recursion_factorial', language: 'dsa', topic: 'recursion_dsa', lessonNumber: 1,
  friendlyName: 'Factorial — Recursive Call Stack',
  learningObjective: 'Trace how factorial(N) pushes call frames onto the stack until base case (N=0), then unwinds.',
  lines: [
    line(1, [kw('int'), tx(' '), fn('factorial'), pu('('), kw('int'), tx(' '), va('n'), pu(')'), tx(' {')]),
    line(2, [tx('    '), kw('if'), pu('('), va('n'), tx(' '), op('=='), tx(' '), nu('0'), pu(')'), tx(' '), kw('return'), tx(' '), nu('1'), pu(';'), tx(' '), cm('// BASE CASE')]),
    line(3, [tx('    '), kw('return'), tx(' '), va('n'), tx(' '), op('*'), tx(' '), fn('factorial'), pu('('), va('n'), op('-'), nu('1'), pu(')'), pu(';')]),
    line(4, [pu('}')]),
    line(5, [kw('int'), tx(' '), va('result'), tx(' '), op('='), tx(' '), fn('factorial'), pu('('), nu('5', 'n'), pu(')'), pu(';')]),
    line(6, [fn('cout'), tx(' '), op('<<'), tx(' '), va('result'), pu(';')]),
  ],
  editableVariables: { n: { default: 5, min: 1, max: 7, label: 'N (factorial)' } },
  generateSteps: ({ n }): ExecutionStep[] => {
    const N = Math.min(7, Math.max(1, Number(n ?? 5)));
    const steps: ExecutionStep[] = [];
    let step = 1;
    const callStack: string[] = [];
    for (let i = N; i >= 0; i--) {
      callStack.push(`factorial(${i})`);
      steps.push({ step: step++, lineNum: i === 0 ? 2 : 3, explanationEnglish: i === 0 ? `factorial(0): base case! Return 1. Stack unwinds now.` : `factorial(${i}) called → factorial(${i-1}) called recursively. Stack: [${callStack.join(' → ')}]`, explanationHinglish: i === 0 ? `factorial(0) base case! Return 1. Stack ab unwind hogi.` : `factorial(${i}) ne factorial(${i-1}) call kiya. Stack badh rhi hai.`, memorySnapshot: { 'call stack': callStack.join(' → '), 'current n': i }, animationEvent: { type: 'FUNCTION_CALL', functionName: `factorial`, args: { n: i } } });
    }
    let result = 1;
    for (let i = 1; i <= N; i++) {
      result *= i;
      callStack.pop();
      steps.push({ step: step++, lineNum: 3, explanationEnglish: `factorial(${i}) returns ${i} × ${result/i} = ${result}. Stack unwinds.`, explanationHinglish: `factorial(${i}) return karta hai ${result}. Stack kam ho rhi hai.`, memorySnapshot: { 'call stack': callStack.join(' → ') || 'empty', 'returned': result }, animationEvent: { type: 'FUNCTION_RETURN', functionName: `factorial(${i})`, returnValue: result } });
    }
    steps.push({ step: step, lineNum: 6, explanationEnglish: `Final result: ${N}! = ${result}`, explanationHinglish: `${N}! = ${result} output aaya.`, memorySnapshot: { result }, consoleOutput: `${result}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: result } });
    return steps;
  },
  executionSteps: [],
};

export const dsa_recursion_sum: LessonProgram = {
  id: 'dsa_recursion_sum', language: 'dsa', topic: 'recursion_dsa', lessonNumber: 2,
  friendlyName: 'Sum of N Natural Numbers (Recursion)',
  learningObjective: 'sum(N) = N + sum(N-1) with base case sum(0) = 0. Visualize call stack.',
  lines: [
    line(1, [kw('int'), tx(' '), fn('sum'), pu('('), kw('int'), tx(' '), va('n'), pu(')'), tx(' {')]),
    line(2, [tx('    '), kw('if'), pu('('), va('n'), tx(' '), op('=='), tx(' '), nu('0'), pu(')'), tx(' '), kw('return'), tx(' '), nu('0'), pu(';'), tx(' '), cm('// BASE CASE')]),
    line(3, [tx('    '), kw('return'), tx(' '), va('n'), tx(' '), op('+'), tx(' '), fn('sum'), pu('('), va('n'), op('-'), nu('1'), pu(')'), pu(';')]),
    line(4, [pu('}')]),
    line(5, [kw('int'), tx(' '), va('result'), tx(' '), op('='), tx(' '), fn('sum'), pu('('), nu('5', 'n'), pu(')'), pu(';')]),
    line(6, [fn('cout'), tx(' '), op('<<'), tx(' '), va('result'), pu(';')]),
  ],
  editableVariables: { n: { default: 5, min: 1, max: 8, label: 'N' } },
  generateSteps: ({ n }): ExecutionStep[] => {
    const N = Math.min(8, Math.max(1, Number(n ?? 5)));
    const steps: ExecutionStep[] = [];
    let step = 1;
    for (let i = N; i >= 0; i--) {
      steps.push({ step: step++, lineNum: i === 0 ? 2 : 3, explanationEnglish: i === 0 ? `sum(0): base case → return 0.` : `sum(${i}) calls sum(${i-1}).`, explanationHinglish: i === 0 ? `sum(0) base case! Return 0.` : `sum(${i}) ne sum(${i-1}) call kiya.`, memorySnapshot: { 'current n': i }, animationEvent: { type: 'FUNCTION_CALL', functionName: 'sum', args: { n: i } } });
    }
    let acc = 0;
    for (let i = 1; i <= N; i++) {
      acc += i;
      steps.push({ step: step++, lineNum: 3, explanationEnglish: `sum(${i}) returns ${i} + ${acc - i} = ${acc}.`, explanationHinglish: `sum(${i}) = ${i} + ${acc-i} = ${acc} return kiya.`, memorySnapshot: { 'accumulated': acc }, animationEvent: { type: 'FUNCTION_RETURN', functionName: `sum(${i})`, returnValue: acc } });
    }
    steps.push({ step: step, lineNum: 6, explanationEnglish: `sum(${N}) = ${acc}. Output printed.`, explanationHinglish: `Final answer: ${acc}`, memorySnapshot: { result: acc }, consoleOutput: `${acc}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: acc } });
    return steps;
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

export const dsa_sll_reverse: LessonProgram = {
  id: 'dsa_sll_reverse', language: 'dsa', topic: 'singly_linked_list', lessonNumber: 2,
  friendlyName: 'Reverse a Singly Linked List',
  learningObjective: 'Use three pointers (prev=NULL, curr=head, next) to reverse all next pointer links one by one.',
  lines: [
    line(1, [cm('// Reverse Singly Linked List using 3 Pointers')]),
    line(2, [va('Node'), op('*'), va('prev'), tx(' '), op('='), tx(' '), kw('nullptr'), pu(';')]),
    line(3, [va('Node'), op('*'), va('curr'), tx(' '), op('='), tx(' '), va('head'), pu(';')]),
    line(4, [kw('while'), pu('('), va('curr'), tx(' '), op('!='), tx(' '), kw('nullptr'), pu(')'), tx(' {')]),
    line(5, [tx('    '), va('Node'), op('*'), va('nextNode'), tx(' '), op('='), tx(' '), va('curr'), op('->'), va('next'), pu(';'), tx(' '), cm('// Save next')]),
    line(6, [tx('    '), va('curr'), op('->'), va('next'), tx(' '), op('='), tx(' '), va('prev'), pu(';'), tx(' '), cm('// Reverse link')]),
    line(7, [tx('    '), va('prev'), tx(' '), op('='), tx(' '), va('curr'), pu(';')]),
    line(8, [tx('    '), va('curr'), tx(' '), op('='), tx(' '), va('nextNode'), pu(';')]),
    line(9, [pu('}')]),
    line(10, [va('head'), tx(' '), op('='), tx(' '), va('prev'), pu(';'), tx(' '), cm('// New head')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      { step: 1, lineNum: 2, explanationEnglish: 'prev = nullptr. No previous node initially.', explanationHinglish: 'prev = nullptr. Abhi koi previous nahi.', memorySnapshot: { prev: 'NULL', curr: 'head→10', list: '10→20→30→NULL' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'prev', value: 'NULL' } },
      { step: 2, lineNum: 3, explanationEnglish: 'curr = head → Node(10). Start from first node.', explanationHinglish: 'curr = head = Node(10). Traversal shuru.', memorySnapshot: { prev: 'NULL', curr: '→10' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'curr', value: 'Node(10)' } },
      { step: 3, lineNum: 5, explanationEnglish: 'nextNode = curr->next = Node(20). Save before reversing.', explanationHinglish: 'nextNode = Node(20) save kiya.', memorySnapshot: { prev: 'NULL', curr: '→10', nextNode: '→20' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'nextNode', value: 'Node(20)' } },
      { step: 4, lineNum: 6, explanationEnglish: 'curr->next = prev = NULL. Node(10) now points backward (NULL).', explanationHinglish: 'Node(10) ka next reverse hua → NULL.', memorySnapshot: { 'Node10.next': 'NULL (reversed)', prev: 'NULL', curr: '→10' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'curr->next', oldValue: '→20', newValue: 'NULL' } },
      { step: 5, lineNum: 7, explanationEnglish: 'prev = curr = Node(10). Move prev forward.', explanationHinglish: 'prev = Node(10) ho gaya.', memorySnapshot: { prev: '→10', curr: '→10' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'prev', oldValue: 'NULL', newValue: 'Node(10)' } },
      { step: 6, lineNum: 8, explanationEnglish: 'curr = nextNode = Node(20). Advance to next.', explanationHinglish: 'curr = Node(20). Agla iteration.', memorySnapshot: { prev: '→10', curr: '→20' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'curr', oldValue: 'Node(10)', newValue: 'Node(20)' } },
      { step: 7, lineNum: 5, explanationEnglish: 'nextNode = curr->next = Node(30). Save next again.', explanationHinglish: 'nextNode = Node(30). Save kiya.', memorySnapshot: { prev: '→10', curr: '→20', nextNode: '→30' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'nextNode', oldValue: 'Node(20)', newValue: 'Node(30)' } },
      { step: 8, lineNum: 6, explanationEnglish: 'curr->next = prev = Node(10). 20 now points to 10.', explanationHinglish: 'Node(20).next → Node(10). Reverse hua!', memorySnapshot: { 'Node20.next': '→10 (reversed)' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'curr->next', oldValue: '→30', newValue: 'Node(10)' } },
      { step: 9, lineNum: 7, explanationEnglish: 'prev = Node(20). curr = Node(30). Continue.', explanationHinglish: 'prev = Node(20), curr = Node(30).', memorySnapshot: { prev: '→20', curr: '→30' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'prev', oldValue: 'Node(10)', newValue: 'Node(20)' } },
      { step: 10, lineNum: 6, explanationEnglish: 'Node(30)->next = Node(20). Last reverse done!', explanationHinglish: 'Node(30).next → Node(20). Teesra reverse hua!', memorySnapshot: { 'Node30.next': '→20 (reversed)', list: '30→20→10→NULL' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'curr->next', oldValue: 'NULL', newValue: 'Node(20)' } },
      { step: 11, lineNum: 10, explanationEnglish: 'head = prev = Node(30). Reversed! 30→20→10→NULL.', explanationHinglish: 'head = Node(30). Reverse complete! 30→20→10→NULL.', memorySnapshot: { head: '→30', list: '30→20→10→NULL' }, consoleOutput: '30 → 20 → 10 → NULL', animationEvent: { type: 'PRINT_VALUE', variableName: 'head', outputValue: '30→20→10→NULL' } },
    ];
  },
  executionSteps: [],
};
export const dsa_graph_basics: LessonProgram = {
  id: 'dsa_graph_basics', language: 'dsa', topic: 'graph_basics', lessonNumber: 1,
  friendlyName: 'Graph Fundamentals (Vertices & Edges)',
  learningObjective: 'Interactive Graph Workspace: Insert/Remove Vertices and Setup connections dynamically.',
  lines: [
    line(1, [cm('// Interactive Graph Workspace (Vertices & Connections)')]),
    line(2, [cm('// Use the left controls panel to manage nodes and edges.')]),
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: 'Graph Workspace initialized. Add vertices and edges to construct the mesh network.',
        explanationHinglish: 'Graph workspace initialize hua. Mesh network banane ke liye vertices add karein.',
        memorySnapshot: { vertices: [], edges: [] },
        consoleOutput: 'Graph Mesh Workspace initialized.',
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
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    return [
      {
        step: 1,
        lineNum: 2,
        explanationEnglish: 'BFS begins. Select start node (e.g. A).',
        explanationHinglish: 'BFS shuru hua. Start node select karein (e.g. A).',
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
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
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

// ─── EXPORT ────────────────────────────────────────────────────────────────────

export const dsaLessons: Record<string, LessonProgram> = {
  dsa_array_declare,
  dsa_array_sum,
  dsa_array_max_min,
  dsa_array_reverse,
  dsa_array_count,
  dsa_linear_search,
  dsa_binary_search,
  dsa_bubble_sort,
  dsa_selection_sort,
  dsa_insertion_sort,
  dsa_recursion_factorial,
  dsa_recursion_sum,
  dsa_stack_push_pop,
  dsa_queue_enq_deq,
  dsa_sll_traverse,
  dsa_sll_reverse,
  dsa_graph_basics,
  dsa_graph_bfs,
  dsa_graph_dfs,
  dsa_binary_tree,
  dsa_merge_sort,
  dsa_heap_sort,
  // Re-use existing Python lessons for tree/graph until dedicated versions are built:
  linear_search: dsa_linear_search,
  binary_search: dsa_binary_search,
  bubble_sort: dsa_bubble_sort,
  selection_sort: dsa_selection_sort,
  insertion_sort: dsa_insertion_sort,
};
