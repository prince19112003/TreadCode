import type { LessonProgram, ExecutionStep } from '../../types';

export const binary_search: LessonProgram = {
  id: 'binary_search', language: 'python', topic: 'searching_sorting', lessonNumber: 2,
  friendlyName: 'Binary Search',
  learningObjective: 'Learn how binary search repeatedly divides a sorted array in half to find a target.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '10, 20, 30, 40, 50, 60' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'target' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '50' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'low' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'variable', value: 'high' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'len' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 5, tokens: [{ type: 'variable', value: 'found' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'False' }] },
    { lineNum: 6, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'low' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'high' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'mid' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'low' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'high' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'mid' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'found' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'True' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: 'f"Found at index {mid}"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'break' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'mid' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'low' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mid' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'high' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mid' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 16, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'not' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'found' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not found"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    arr: { default: '10, 20, 30, 40, 50, 60', type: 'text', label: 'Sorted Array', noQuotes: true },
    target: { default: 50, label: 'Search Target' },
  },
  generateSteps: ({ arr, target }): ExecutionStep[] => {
    let rawItems: Array<number> = [10, 20, 30, 40, 50, 60];
    const rawVal = String(arr).trim();
    const cleaned = rawVal.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      rawItems = cleaned.split(',').map(s => {
        const n = Number(s.trim());
        return isNaN(n) ? 0 : n;
      });
    }

    // Check if user input is unsorted
    const isUnsorted = rawItems.some((val, idx) => idx > 0 && val < rawItems[idx - 1]);
    const items = [...rawItems].sort((a, b) => a - b);

    const formatListStr = (a: Array<number>) => {
      return "[" + a.join(', ') + "]";
    };

    const rawArrStr = formatListStr(rawItems);
    const sortedArrStr = formatListStr(items);
    const targetVal = Number(target) || 50;

    let stepNum = 1;
    const steps: ExecutionStep[] = [];
    let mem: Record<string, string | number> = { arr: isUnsorted ? rawArrStr : sortedArrStr };

    // Step 1: Create arr
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: isUnsorted
        ? `⚠️ Warning: Input array ${rawArrStr} is unsorted! Binary search requires a sorted array.`
        : `Initialize sorted array: ${sortedArrStr}.`,
      explanationHinglish: isUnsorted
        ? `⚠️ Warning: Input array ${rawArrStr} unsorted hai! Binary search ke liye array sorted honi chahiye.`
        : `Sorted array banaya: ${sortedArrStr}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'arr', value: isUnsorted ? rawArrStr : sortedArrStr },
    });

    // If unsorted, auto-sort warning step
    if (isUnsorted) {
      mem.arr = sortedArrStr;
      steps.push({
        step: stepNum++, lineNum: 1,
        explanationEnglish: `Auto-sorting array for binary search execution: ${sortedArrStr}.`,
        explanationHinglish: `Binary search ke liye array ko automatic sort kiya: ${sortedArrStr}.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'arr', oldValue: rawArrStr, newValue: sortedArrStr },
      });
    }

    // Step 2: Create target
    mem.target = targetVal;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Set search target: ${targetVal}.`,
      explanationHinglish: `Search target set kiya: ${targetVal}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'target', value: targetVal },
    });

    // Step 3: low = 0
    let low = 0;
    mem.low = low;
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Initialize low pointer to 0.`,
      explanationHinglish: `Low pointer ko 0 se set kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'low', value: 0 },
    });

    // Step 4: high = len(arr) - 1
    let high = items.length - 1;
    mem.high = high;
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Initialize high pointer to len(arr) - 1 = ${high}. Active search window: [index ${low} to ${high}].`,
      explanationHinglish: `High pointer ko len(arr) - 1 = ${high} se set kiya. Active search range: [index ${low} to ${high}].`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'high', value: high },
    });

    // Step 5: found = False
    let isFound = false;
    mem.found = 'False';
    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: `Initialize found flag to False.`,
      explanationHinglish: `found flag ko False se set kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'found', value: '"False"' },
    });

    let iter = 0;
    while (low <= high && iter < 10) {
      iter++;

      // Step 6: Check low <= high
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Check while low (${low}) <= high (${high}). Search space size: ${high - low + 1} elements.`,
        explanationHinglish: `Check kiya kya low (${low}) <= high (${high}) hai. Abhi search window size: ${high - low + 1} elements hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['low', 'high'], operator: '<=', result: 'True', storeIn: 'Condition' },
      });

      // Step 7: mid = (low + high) // 2
      const mid = Math.floor((low + high) / 2);
      const prevMid = mem.mid;
      mem.mid = mid;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Divide array in half: mid = (${low} + ${high}) // 2 = ${mid}. Mid element: ${items[mid]}.`,
        explanationHinglish: `Array ko aadha divide kiya: mid = (${low} + ${high}) // 2 = ${mid}. Mid element: ${items[mid]}.`,
        memorySnapshot: { ...mem },
        animationEvent: prevMid !== undefined 
          ? { type: 'UPDATE_VARIABLE', name: 'mid', oldValue: prevMid, newValue: mid }
          : { type: 'CREATE_VARIABLE', name: 'mid', value: mid },
      });

      const midVal = items[mid];

      // Step 8: Check arr[mid] == target
      const isMatch = midVal === targetVal;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Check if arr[${mid}] (${midVal}) == target (${targetVal}).`,
        explanationHinglish: `Check kiya kya arr[${mid}] (${midVal}) == target (${targetVal}) hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: [`arr[${mid}]`, 'target'], operator: '==', result: isMatch ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isMatch) {
        isFound = true;
        mem.found = 'True';
        // Step 9: found = True
        steps.push({
          step: stepNum++, lineNum: 9,
          explanationEnglish: `Match found at index ${mid}! Set found = True.`,
          explanationHinglish: `Target index ${mid} par mil gaya! found ko True kiya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'found', oldValue: '"False"', newValue: '"True"' },
        });

        // Step 10: Print success
        const msg = `Found at index ${mid}`;
        steps.push({
          step: stepNum++, lineNum: 10,
          explanationEnglish: `Print output message: "${msg}".`,
          explanationHinglish: `Output message print kiya: "${msg}".`,
          memorySnapshot: { ...mem },
          consoleOutput: msg,
          animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${msg}"` },
        });

        // Step 11: Break
        steps.push({
          step: stepNum++, lineNum: 11,
          explanationEnglish: `Break out of search loop.`,
          explanationHinglish: `Loop break kar diya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });
        break;
      } else if (midVal < targetVal) {
        // Step 12: check arr[mid] < target
        steps.push({
          step: stepNum++, lineNum: 12,
          explanationEnglish: `arr[${mid}] (${midVal}) < target (${targetVal}). Target lies in the right half! Eliminating left range [${low}...${mid}].`,
          explanationHinglish: `arr[${mid}] (${midVal}) target (${targetVal}) se chhota hai. Target right half mein hoga! Left region [${low}...${mid}] fade grey (ignored) ho gaya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });

        // Step 13: low = mid + 1
        const prevLow = low;
        low = mid + 1;
        mem.low = low;
        delete mem.mid;
        steps.push({
          step: stepNum++, lineNum: 13,
          explanationEnglish: `Shift low pointer to mid + 1 = ${low}. New search range: [index ${low}...${high}]. Ignored part faded grey.`,
          explanationHinglish: `Low pointer ko mid + 1 = ${low} par shift kiya. Naya active search range: [index ${low}...${high}]. Ignored part fade grey.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'low', oldValue: prevLow, newValue: low },
        });
      } else {
        // Step 14: else
        steps.push({
          step: stepNum++, lineNum: 14,
          explanationEnglish: `arr[${mid}] (${midVal}) > target (${targetVal}). Target lies in the left half! Eliminating right range [${mid}...${high}].`,
          explanationHinglish: `arr[${mid}] (${midVal}) target (${targetVal}) se bada hai. Target left half mein hoga! Right region [${mid}...${high}] fade grey (ignored) ho gaya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });

        // Step 15: high = mid - 1
        const prevHigh = high;
        high = mid - 1;
        mem.high = high;
        delete mem.mid;
        steps.push({
          step: stepNum++, lineNum: 15,
          explanationEnglish: `Shift high pointer to mid - 1 = ${high}. New search range: [index ${low}...${high}]. Ignored part faded grey.`,
          explanationHinglish: `High pointer ko mid - 1 = ${high} par shift kiya. Naya active search range: [index ${low}...${high}]. Ignored part fade grey.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'high', oldValue: prevHigh, newValue: high },
        });
      }
    }

    // Handle NOT FOUND scenario
    if (!isFound) {
      delete mem.mid;
      // Step 6: Check low <= high (False)
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Check while low (${low}) <= high (${high}): False! Search window collapsed (low > high). Target ${targetVal} is NOT in the array.`,
        explanationHinglish: `Check kiya while low (${low}) <= high (${high}): False! Low > High ho gaya, yaani target ${targetVal} array mein nahi hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['low', 'high'], operator: '<=', result: 'False', storeIn: 'Condition' },
      });

      // Step 16: if not found:
      steps.push({
        step: stepNum++, lineNum: 16,
        explanationEnglish: `Check if not found. It is True (${targetVal} was not found).`,
        explanationHinglish: `Check kiya if not found. Yeh True hai (target ${targetVal} array me nahi mila).`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['found'], operator: '== False', result: 'True', storeIn: 'Condition' },
      });

      // Step 17: print("Not found")
      steps.push({
        step: stepNum++, lineNum: 17,
        explanationEnglish: `Print "Not found".`,
        explanationHinglish: `Console pe "Not found" print kiya.`,
        memorySnapshot: { ...mem },
        consoleOutput: 'Not found',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Not found"', outputValue: 'Not found' },
      });
    }

    return steps;
  },
  executionSteps: [],
};