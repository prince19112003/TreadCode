import type { LessonProgram, ExecutionStep } from '../../types';

export const list_stats: LessonProgram = {
  id: 'list_stats', language: 'python', topic: 'lists', lessonNumber: 2,
  friendlyName: 'List Statistics',
  learningObjective: 'Learn how to traverse a list to compute sum, average, min, and max values manually.',
  lines: [
    { lineNum: 1, tokens: [
      { type: 'variable', value: 'nums' }, 
      { type: 'text', value: ' ' }, 
      { type: 'operator', value: '=' }, 
      { type: 'text', value: ' ' }, 
      { type: 'punctuation', value: '[' }, 
      { type: 'number', value: '10, 5, 20, 15' }, 
      { type: 'punctuation', value: ']' }
    ] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'largest' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'nums' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'smallest' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'nums' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'nums' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'largest' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'largest' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'smallest' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'smallest' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }] },
    { lineNum: 10, tokens: [{ type: 'variable', value: 'avg' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'function', value: 'len' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'nums' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 11, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'total' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    nums: { default: '10, 5, 20, 15', type: 'text', label: 'Numbers List', noQuotes: true },
  },
  generateSteps: ({ nums }): ExecutionStep[] => {
    let listItems: Array<number> = [10, 5, 20, 15];
    const rawVal = String(nums).trim();
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

    const firstListStr = `"[${listItems.join(', ')}]"`;
    const firstVal = listItems[0];

    let total = 0;
    let largest = firstVal;
    let smallest = firstVal;
    let stepNum = 1;

    const steps: ExecutionStep[] = [
      {
        step: stepNum++, lineNum: 1,
        explanationEnglish: `Create list nums containing: [${listItems.join(', ')}].`,
        explanationHinglish: `nums naam ka list banaya jisme elements hain: [${listItems.join(', ')}].`,
        memorySnapshot: { nums: firstListStr },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'nums', value: firstListStr },
      },
      {
        step: stepNum++, lineNum: 2,
        explanationEnglish: `Initialize total sum to 0.`,
        explanationHinglish: `Sum calculate karne ke liye total ko 0 se start kiya.`,
        memorySnapshot: { nums: firstListStr, total: 0 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'total', value: 0 },
      },
      {
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Initialize largest and smallest with the first element of list: ${firstVal}.`,
        explanationHinglish: `largest aur smallest dono ko list ke pehle element (${firstVal}) se start kiya.`,
        memorySnapshot: { nums: firstListStr, total: 0, largest: firstVal, smallest: firstVal },
        animationEvent: { 
          type: 'MULTI_CREATE_VARIABLES', 
          variables: [
            { name: 'largest', value: firstVal },
            { name: 'smallest', value: firstVal }
          ] 
        },
      }
    ];

    // Traverse the loop
    for (let i = 0; i < listItems.length; i++) {
      const num = listItems[i];
      
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Read next list element: num = ${num}.`,
        explanationHinglish: `List se agla element padha: num = ${num}.`,
        memorySnapshot: { nums: firstListStr, total, largest, smallest, num },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
      });

      const oldTotal = total;
      total += num;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Add num to total: ${oldTotal} + ${num} = ${total}.`,
        explanationHinglish: `total mein num joda: ${oldTotal} + ${num} = ${total}.`,
        memorySnapshot: { nums: firstListStr, total, largest, smallest, num },
        animationEvent: { type: 'COMPUTE', inputs: ['total', 'num'], operator: '+', result: total, storeIn: 'total' },
      });

      // Check if num > largest
      const isGreater = num > largest;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Check if num > largest (${num} > ${largest}) is ${isGreater ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya num > largest (${num} > ${largest}) ${isGreater ? 'True' : 'False'} hai.`,
        memorySnapshot: { nums: firstListStr, total, largest, smallest, num },
        animationEvent: { type: 'COMPUTE', inputs: ['num', 'largest'], operator: '>', result: isGreater ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isGreater) {
        largest = num;
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Set largest to the new maximum: ${largest}.`,
          explanationHinglish: `largest ko update kiya nayi maximum value se: ${largest}.`,
          memorySnapshot: { nums: firstListStr, total, largest, smallest, num },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'largest', oldValue: largest, newValue: largest },
        });
      }

      // Check if num < smallest
      const isSmaller = num < smallest;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Check if num < smallest (${num} < ${smallest}) is ${isSmaller ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya num < smallest (${num} < ${smallest}) ${isSmaller ? 'True' : 'False'} hai.`,
        memorySnapshot: { nums: firstListStr, total, largest, smallest, num },
        animationEvent: { type: 'COMPUTE', inputs: ['num', 'smallest'], operator: '<', result: isSmaller ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isSmaller) {
        smallest = num;
        steps.push({
          step: stepNum++, lineNum: 9,
          explanationEnglish: `Set smallest to the new minimum: ${smallest}.`,
          explanationHinglish: `smallest ko update kiya nayi minimum value se: ${smallest}.`,
          memorySnapshot: { nums: firstListStr, total, largest, smallest, num },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'smallest', oldValue: smallest, newValue: smallest },
        });
      }
    }

    // Calculate Average
    const avg = total / listItems.length;
    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `Calculate average: total / len(nums) = ${total} / ${listItems.length} = ${avg}.`,
      explanationHinglish: `average calculate kiya: total / len(nums) = ${total} / ${listItems.length} = ${avg}.`,
      memorySnapshot: { nums: firstListStr, total, largest, smallest, avg },
      animationEvent: { type: 'COMPUTE', inputs: ['total', 'length'], operator: '/', result: avg, storeIn: 'avg' },
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: `Print the final sum total: ${total}.`,
      explanationHinglish: `Final sum total print kiya: ${total}.`,
      memorySnapshot: { nums: firstListStr, total, largest, smallest, avg },
      consoleOutput: String(total),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'total', outputValue: total },
    });

    return steps;
  },
  executionSteps: [],
};