import type { LessonProgram, ExecutionStep } from '../../types';

export const linear_search: LessonProgram = {
  id: 'linear_search', language: 'python', topic: 'searching_sorting', lessonNumber: 1,
  friendlyName: 'Linear Search',
  learningObjective: 'Learn how linear search iterates sequentially to find a target.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '12, 25, 18, 40, 15' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'target' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '40' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'found' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'False' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'function', value: 'len' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'found' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'True' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: 'f"Found at index {i}"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'break' }] },
    { lineNum: 9, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'not' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'found' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not found"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    arr: { default: '12, 25, 18, 40, 15', type: 'text', label: 'Search Array', noQuotes: true },
    target: { default: 40, label: 'Search Target' },
  },
  generateSteps: ({ arr, target }): ExecutionStep[] => {
    let items: Array<number | string> = [12, 25, 18, 40, 15];
    const rawVal = String(arr).trim();
    const cleaned = rawVal.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      items = cleaned.split(',').map(s => {
        const v = s.trim();
        return isNaN(Number(v)) ? v.replace(/['"]/g, '') : Number(v);
      });
    }

    const formatListStr = (a: Array<string | number>) => {
      return "[" + a.map(x => typeof x === 'string' ? `'${x}'` : x).join(', ') + "]";
    };

    const arrStr = formatListStr(items);
    const targetVal = isNaN(Number(target)) ? String(target) : Number(target);

    let stepNum = 1;
    const steps: ExecutionStep[] = [];
    let mem: Record<string, string | number> = { arr: arrStr };

    // Step 1: Create arr
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `Initialize search array: ${arrStr}.`,
      explanationHinglish: `Search array banaya: ${arrStr}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: arrStr },
    });

    // Step 2: Create target
    mem.target = targetVal;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Set search target: ${targetVal}.`,
      explanationHinglish: `Search target set kiya: ${targetVal}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: targetVal },
    });

    // Step 3: found = False
    mem.found = 'False';
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Initialize found flag to False.`,
      explanationHinglish: `found flag ko False se set kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'found', value: '"False"' },
    });

    let foundMatchIndex = -1;

    for (let i = 0; i < items.length; i++) {
      const currentVal = items[i];
      mem.i = i;

      // Step 4: Loop index i with HIGHLIGHT_ARRAY_INDEX
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Iteration i = ${i}: Inspecting element at index ${i} (${currentVal}).`,
        explanationHinglish: `Iteration i = ${i}: Index ${i} par element (${currentVal}) ko inspect kar rahe hain.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX', arrayName: 'arr', index: i },
      });

      // Step 5: Check arr[i] == target
      const isMatch = String(currentVal) === String(targetVal);
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Check if arr[${i}] (${currentVal}) == target (${targetVal}). Result: ${isMatch ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check kiya kya arr[${i}] (${currentVal}) == target (${targetVal}) hai. Result: ${isMatch ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: [`arr[${i}]`, 'target'], operator: '==', result: isMatch ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isMatch) {
        foundMatchIndex = i;
        // Step 6: found = True
        mem.found = 'True';
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Target ${targetVal} matched at index ${i}! Set found = True.`,
          explanationHinglish: `Target ${targetVal} index ${i} par mil gaya! found ko True kiya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'found', oldValue: '"False"', newValue: '"True"' },
        });

        // Step 7: Print success
        const msg = `Found at index ${i}`;
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Print output message: "${msg}".`,
          explanationHinglish: `Output message print kiya: "${msg}".`,
          memorySnapshot: { ...mem },
          consoleOutput: msg,
          animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${msg}"` },
        });

        // Step 8: Break
        steps.push({
          step: stepNum++, lineNum: 8,
          explanationEnglish: `Target found. Break out of loop.`,
          explanationHinglish: `Target milne par loop break kiya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });

        break;
      }
    }

    if (foundMatchIndex === -1) {
      // Step 9: if not found
      steps.push({
        step: stepNum++, lineNum: 9,
        explanationEnglish: `Loop completed without finding target ${targetVal}.`,
        explanationHinglish: `Loop poora hua par target ${targetVal} nahi found hua.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'NONE' },
      });

      // Step 10: Print Not found
      steps.push({
        step: stepNum++, lineNum: 10,
        explanationEnglish: `Print "Not found".`,
        explanationHinglish: `"Not found" print kiya.`,
        memorySnapshot: { ...mem },
        consoleOutput: 'Not found',
        animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: '"Not found"' },
      });
    }

    return steps;
  },
  executionSteps: [],
};