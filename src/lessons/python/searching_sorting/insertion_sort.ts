import type { LessonProgram, ExecutionStep } from '../../types';

export const insertion_sort: LessonProgram = {
  id: 'insertion_sort', language: 'python', topic: 'searching_sorting', lessonNumber: 5,
  friendlyName: 'Insertion Sort',
  learningObjective: 'Learn how insertion sort builds the sorted array one element at a time by inserting each key into its correct position.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '12, 11, 13, 5, 6' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'len' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'key' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'and' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'key' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'key' }] },
    { lineNum: 10, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    arr: { default: '12, 11, 13, 5, 6', type: 'text', label: 'Array to Sort', noQuotes: true },
  },
  generateSteps: ({ arr }): ExecutionStep[] => {
    let items: Array<number> = [12, 11, 13, 5, 6];
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
    const sortedIndices: number[] = [0]; // Index 0 is initially sorted
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
      explanationEnglish: `Initialize unsorted array: ${arrStr}. First element ${items[0]} is trivially sorted.`,
      explanationHinglish: `Unsorted array banaya: ${arrStr}. Pehla element ${items[0]} already sorted maana gaya.`,
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

    for (let i = 1; i < n; i++) {
      mem.i = i;
      const keyVal = items[i];
      mem.key = keyVal;

      // Step 3: Loop pass i
      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Pass ${i}: Picking element at index ${i} to insert into sorted left portion [0..${i - 1}].`,
        explanationHinglish: `Pass ${i}: Index ${i} wale element ko sorted left portion [0..${i - 1}] mein sahi jagah insert karenge.`,
        memorySnapshot: { ...mem, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      // Step 4: Extract key
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Extracted key = ${keyVal} (from arr[${i}]).`,
        explanationHinglish: `key = ${keyVal} (arr[${i}] se) ko pick kiya.`,
        memorySnapshot: { ...mem, key: keyVal, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'key', value: keyVal },
      });

      let j = i - 1;
      mem.j = j;

      // Step 5: Set j = i - 1
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Start scanning sorted portion from right: j = ${j} (arr[${j}] = ${items[j]}).`,
        explanationHinglish: `Sorted portion mein right se scanning start ki: j = ${j} (arr[${j}] = ${items[j]}).`,
        memorySnapshot: { ...mem, j, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'j', value: j },
      });

      while (j >= 0 && items[j] > keyVal) {
        // Step 6: While check
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Check if arr[${j}] (${items[j]}) > key (${keyVal}): TRUE (Shift ${items[j]} right).`,
          explanationHinglish: `Check kiya kya arr[${j}] (${items[j]}) > key (${keyVal}): SAHI (${items[j]} ko right shift karenge).`,
          memorySnapshot: {
            ...mem,
            comparingIndices: [j, i],
            sortedIndices: [...sortedIndices],
            passSnapshots: [...passSnapshots],
          },
          animationEvent: { type: 'COMPUTE', inputs: [`arr[${j}]`, `key`], operator: '>', result: 'True', storeIn: 'Condition' },
        });

        // Shift item right
        const shiftedVal = items[j];
        items[j + 1] = shiftedVal;
        const prevArrStr = arrStr;
        arrStr = formatListStr(items);
        mem.arr = arrStr;

        // Step 7: Shift element right
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Shifted element ${shiftedVal} from index ${j} to index ${j + 1}.`,
          explanationHinglish: `Element ${shiftedVal} ko index ${j} se index ${j + 1} par shift kiya.`,
          memorySnapshot: { ...mem, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'arr', oldValue: prevArrStr, newValue: arrStr },
        });

        j--;
        mem.j = j;

        // Step 8: Decrement j
        steps.push({
          step: stepNum++, lineNum: 8,
          explanationEnglish: `Moved pointer left: j = ${j}.`,
          explanationHinglish: `Pointer ko aage (left) badhaya: j = ${j}.`,
          memorySnapshot: { ...mem, j, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'j', oldValue: j + 1, newValue: j },
        });
      }

      // Insert key at j + 1
      const insertPos = j + 1;
      items[insertPos] = keyVal;
      const prevArrStr = arrStr;
      arrStr = formatListStr(items);
      mem.arr = arrStr;

      // Step 9: Insert key at correct spot
      steps.push({
        step: stepNum++, lineNum: 9,
        explanationEnglish: `Inserted key = ${keyVal} into its correct sorted spot at index ${insertPos}.`,
        explanationHinglish: `key = ${keyVal} ko sorted position index ${insertPos} par insert kiya.`,
        memorySnapshot: { ...mem, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'arr', oldValue: prevArrStr, newValue: arrStr },
      });

      if (!sortedIndices.includes(i)) {
        sortedIndices.push(i);
      }
      passSnapshots.push({
        pass: i,
        lockedIndex: insertPos,
        lockedValue: keyVal,
        array: [...items],
      });

      mem.sortedIndices = [...sortedIndices];
      mem.passSnapshots = [...passSnapshots];
    }

    // Step 10: Print sorted array
    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `🎉 Insertion sort complete! Array is 100% sorted: ${arrStr}.`,
      explanationHinglish: `🎉 Insertion sort poora hua! Array 100% sort ho gaya: ${arrStr}.`,
      memorySnapshot: { ...mem, sortedIndices: [...sortedIndices], passSnapshots: [...passSnapshots] },
      consoleOutput: arrStr,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'arr', outputValue: arrStr },
    });

    return steps;
  },
  executionSteps: [],
};