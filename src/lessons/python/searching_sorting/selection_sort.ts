import type { LessonProgram, ExecutionStep } from '../../types';

export const selection_sort: LessonProgram = {
  id: 'selection_sort', language: 'python', topic: 'searching_sorting', lessonNumber: 4,
  friendlyName: 'Selection Sort',
  learningObjective: 'Learn how selection sort finds the minimum element in the unsorted portion and swaps it to the front.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '64, 25, 12, 22, 11' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'len' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'min_idx' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '+' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'min_idx' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'min_idx' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'min_idx' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'min_idx' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 9, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    arr: { default: '64, 25, 12, 22, 11', type: 'text', label: 'Array to Sort', noQuotes: true },
  },
  generateSteps: ({ arr }): ExecutionStep[] => {
    let items: Array<number> = [64, 25, 12, 22, 11];
    const rawVal = String(arr).trim();
    const cleaned = rawVal.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      items = cleaned.split(',').map(s => {
        const n = Number(s.trim());
        return isNaN(n) ? 0 : n;
      });
    }

    const formatListStr = (a: Array<number>) => "[" + a.join(', ') + "]";
    let arrStr = formatListStr(items);
    const n = items.length;

    let stepNum = 1;
    const steps: ExecutionStep[] = [];
    const sortedIndices: number[] = [];
    const passSnapshots: Array<{ pass: number; lockedIndex: number; lockedValue: number; array: number[] }> = [];

    let mem: Record<string, any> = {
      arr: arrStr,
      n,
      sortedIndices: [...sortedIndices],
      passSnapshots: [...passSnapshots],
    };

    // Step 1: Create arr
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `Initialize unsorted array: ${arrStr}.`,
      explanationHinglish: `Unsorted array banaya: ${arrStr}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: arrStr },
    });

    // Step 2: Create n
    mem.n = n;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Calculate array length n = ${n}.`,
      explanationHinglish: `Array ki length n = ${n} nikali.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n },
    });

    for (let i = 0; i < n; i++) {
      mem.i = i;
      let min_idx = i;
      mem.min_idx = min_idx;

      // Step 3: Outer loop pass i
      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Pass ${i + 1} of ${n}: Finding minimum element starting from index ${i}.`,
        explanationHinglish: `Pass ${i + 1} of ${n}: Index ${i} se aage ka sabse chhota (minimum) element dhoondh rahe hain.`,
        memorySnapshot: { ...mem, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      // Step 4: Assume min_idx is i
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Initially assume min_idx is ${i} (value ${items[i]}).`,
        explanationHinglish: `Pehle maan liya ki min_idx ${i} hai (value ${items[i]}).`,
        memorySnapshot: { ...mem, min_idx, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'min_idx', value: min_idx },
      });

      for (let j = i + 1; j < n; j++) {
        mem.j = j;

        // Step 5: Inner loop scanning
        steps.push({
          step: stepNum++, lineNum: 5,
          explanationEnglish: `Scanning index ${j} (value ${items[j]}) against current min index ${min_idx} (value ${items[min_idx]}).`,
          explanationHinglish: `Index ${j} (value ${items[j]}) ko current min index ${min_idx} (value ${items[min_idx]}) se compare kar rahe hain.`,
          memorySnapshot: {
            ...mem,
            min_idx,
            comparingIndices: [j, min_idx],
            sortedIndices: [...sortedIndices],
            passSnapshots: [...passSnapshots],
          },
          animationEvent: { type: 'CREATE_VARIABLE', name: 'j', value: j },
        });

        const isSmaller = items[j] < items[min_idx];
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Check if arr[${j}] (${items[j]}) < arr[${min_idx}] (${items[min_idx]}): ${isSmaller ? 'TRUE (New min found!)' : 'FALSE'}.`,
          explanationHinglish: `Check kiya kya arr[${j}] (${items[j]}) < arr[${min_idx}] (${items[min_idx]}): ${isSmaller ? 'SAHI (Naya min found hua!)' : 'GALAT'}.`,
          memorySnapshot: {
            ...mem,
            min_idx,
            comparingIndices: [j, min_idx],
            sortedIndices: [...sortedIndices],
            passSnapshots: [...passSnapshots],
          },
          animationEvent: { type: 'COMPUTE', inputs: [`arr[${j}]`, `arr[${min_idx}]`], operator: '<', result: isSmaller ? 'True' : 'False', storeIn: 'Condition' },
        });

        if (isSmaller) {
          const oldMin = min_idx;
          min_idx = j;
          mem.min_idx = min_idx;

          steps.push({
            step: stepNum++, lineNum: 7,
            explanationEnglish: `New minimum element found! Updated min_idx = ${min_idx} (value ${items[min_idx]}).`,
            explanationHinglish: `Naya minimum element found hua! min_idx ko ${min_idx} (value ${items[min_idx]}) par update kiya.`,
            memorySnapshot: { ...mem, min_idx, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
            animationEvent: { type: 'UPDATE_VARIABLE', name: 'min_idx', oldValue: oldMin, newValue: min_idx },
          });
        }
      }

      // Step 8: Swap arr[i] with arr[min_idx]
      if (min_idx !== i) {
        const valI = items[i];
        const valMin = items[min_idx];
        items[i] = valMin;
        items[min_idx] = valI;

        const prevArrStr = arrStr;
        arrStr = formatListStr(items);
        mem.arr = arrStr;

        steps.push({
          step: stepNum++, lineNum: 8,
          explanationEnglish: `Swapped minimum element ${valMin} (at index ${min_idx}) with arr[${i}] (${valI}).`,
          explanationHinglish: `Minimum element ${valMin} (at index ${min_idx}) ko arr[${i}] (${valI}) ke saath swap kiya.`,
          memorySnapshot: { ...mem, swappingIndices: [i, min_idx], sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'arr', oldValue: prevArrStr, newValue: arrStr },
        });
      }

      sortedIndices.push(i);
      passSnapshots.push({
        pass: i + 1,
        lockedIndex: i,
        lockedValue: items[i],
        array: [...items],
      });

      mem.sortedIndices = [...sortedIndices];
      mem.passSnapshots = [...passSnapshots];
    }

    // Step 9: Print sorted array
    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: `🎉 Selection sort complete! Array is 100% sorted: ${arrStr}.`,
      explanationHinglish: `🎉 Selection sort poora hua! Array 100% sort ho gaya: ${arrStr}.`,
      memorySnapshot: { ...mem, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
      consoleOutput: arrStr,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: arrStr },
    });

    return steps;
  },
  executionSteps: [],
};