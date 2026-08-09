import type { LessonProgram, ExecutionStep } from '../../types';

export const list_search: LessonProgram = {
  id: 'list_search', language: 'python', topic: 'lists', lessonNumber: 3,
  friendlyName: 'Search Element and Count Occurrences',
  learningObjective: 'Learn how to traverse a list and search for specific elements using conditionals.',
  lines: [
    { lineNum: 1, tokens: [
      { type: 'variable', value: 'items' }, 
      { type: 'text', value: ' ' }, 
      { type: 'operator', value: '=' }, 
      { type: 'text', value: ' ' }, 
      { type: 'punctuation', value: '[' }, 
      { type: 'number', value: '1, 3, 2, 3, 5' }, 
      { type: 'punctuation', value: ']' }
    ] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'search_target' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'items' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'search_target' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 7, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    items: { default: '1, 3, 2, 3, 5', type: 'text', label: 'Items List', noQuotes: true },
    search_target: { default: 3, min: -999, max: 999, type: 'number', label: 'Search Target' },
  },
  generateSteps: ({ items, search_target }): ExecutionStep[] => {
    let listItems: Array<number> = [1, 3, 2, 3, 5];
    const rawVal = String(items).trim();
    const cleaned = rawVal.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      listItems = cleaned.split(',').map(s => {
        const n = Number(s.trim());
        return isNaN(n) ? 0 : n;
      });
    }

    if (listItems.length === 0) {
      listItems = [0];
    }

    const targetVal = Number(search_target) !== undefined ? Number(search_target) : 3;
    const firstListStr = `"[${listItems.join(', ')}]"`;

    let count = 0;
    let stepNum = 1;

    const steps: ExecutionStep[] = [
      {
        step: stepNum++, lineNum: 1,
        explanationEnglish: `Create list items containing: [${listItems.join(', ')}].`,
        explanationHinglish: `items naam ka list banaya jisme elements hain: [${listItems.join(', ')}].`,
        memorySnapshot: { items: firstListStr },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'items', value: firstListStr },
      },
      {
        step: stepNum++, lineNum: 2,
        explanationEnglish: `Set search target to ${targetVal}.`,
        explanationHinglish: `Jise search karna hai wo target value ${targetVal} set kiya.`,
        memorySnapshot: { items: firstListStr, search_target: targetVal },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'search_target', value: targetVal },
      },
      {
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Initialize occurrence count to 0.`,
        explanationHinglish: `Milne wale matches ka count 0 se start kiya.`,
        memorySnapshot: { items: firstListStr, search_target: targetVal, count: 0 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'count', value: 0 },
      }
    ];

    for (let i = 0; i < listItems.length; i++) {
      const val = listItems[i];
      const isMatch = val === targetVal;
      const snapshot: Record<string, string | number> = { 
        items: firstListStr, 
        search_target: targetVal, 
        count, 
        val 
      };

      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Read next list element: val = ${val}.`,
        explanationHinglish: `List se agla element padha: val = ${val}.`,
        memorySnapshot: { ...snapshot },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val },
      });

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Check if val == search_target (${val} == ${targetVal}). Result is ${isMatch ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya val == search_target (${val} == ${targetVal}) barabar hain. Result: ${isMatch ? 'True' : 'False'}.`,
        memorySnapshot: { ...snapshot },
        animationEvent: { type: 'COMPUTE', inputs: ['val', 'search_target'], operator: '==', result: isMatch ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isMatch) {
        count++;
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Match found! Increase occurrence count to ${count}.`,
          explanationHinglish: `Match mil gaya! count ko badha kar ${count} kar diya.`,
          memorySnapshot: { items: firstListStr, search_target: targetVal, count, val },
          animationEvent: { type: 'COMPUTE', inputs: ['count'], operator: '+ 1', result: count, storeIn: 'count' },
        });
      }
    }

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: `Print the final occurrence count: ${count}.`,
      explanationHinglish: `Target value ${targetVal} ke occurrences ka final count print kiya: ${count}.`,
      memorySnapshot: { items: firstListStr, search_target: targetVal, count },
      consoleOutput: String(count),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'count', outputValue: count },
    });

    return steps;
  },
  executionSteps: [],
};