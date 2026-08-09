import type { LessonProgram, ExecutionStep } from '../../types';

export const sum_n_natural: LessonProgram = {
  id: 'sum_n_natural', language: 'python', topic: 'for_loop', lessonNumber: 3,
  friendlyName: 'Sum of N Natural Numbers',
  learningObjective: 'Understand how to use an accumulator variable inside a loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }] },
    { lineNum: 5, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'total' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 20, label: 'Value of n' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let total = 0;
    
    // Step 1: Initialize n
    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Create variable "n" with value ${n}.`,
      explanationHinglish: `"n" variable me ${n} save kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n },
    });

    // Step 2: Initialize total
    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Create a variable "total" to hold the sum, starting at 0.',
      explanationHinglish: 'Sum store karne ke liye "total" variable declare kiya.',
      memorySnapshot: { n, total: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'total', value: 0 },
    });

    // Loop steps
    for (let i = 1; i <= Number(n); i++) {
      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Loop iteration for i = ${i}.`,
        explanationHinglish: `Loop i = ${i} ke liye chalu hua.`,
        memorySnapshot: { n, total, i },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      const oldTotal = total;
      total += i;

      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Add ${i} to total. ${oldTotal} + ${i} = ${total}.`,
        explanationHinglish: `Total mein ${i} joda. Naya total ${total} hua.`,
        memorySnapshot: { n, total, i },
        animationEvent: { type: 'COMPUTE', inputs: ['total', 'i'], operator: '+', result: total, storeIn: 'total' },
      });
    }

    // Print step
    steps.push({
      step: steps.length + 1, lineNum: 5,
      explanationEnglish: 'The loop ends. Print the final total.',
      explanationHinglish: 'Loop complete hua. Final sum print kiya.',
      memorySnapshot: { n, total, i: Number(n) }, // Keep last i in memory
      consoleOutput: String(total),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'total', outputValue: total },
    });

    return steps;
  },
  executionSteps: [] // Fallback is no longer needed since generateSteps exists
};