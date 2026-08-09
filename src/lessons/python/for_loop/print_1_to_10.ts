import type { LessonProgram, ExecutionStep } from '../../types';

export const print_1_to_10: LessonProgram = {
  id: 'print_1_to_10', language: 'python', topic: 'for_loop', lessonNumber: 1,
  friendlyName: 'Print Numbers (1 to N)',
  learningObjective: 'Understand how a for loop iterates over a dynamic range of numbers.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 20, label: 'Value of n' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let consoleOut = '';
    
    // Step 1: Initialize n
    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Create variable "n" with value ${n}.`,
      explanationHinglish: `"n" variable me ${n} save kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n },
    });

    // Loop steps
    for (let i = 1; i <= Number(n); i++) {
      steps.push({
        step: steps.length + 1, lineNum: 2,
        explanationEnglish: `The loop variable "i" takes the next value in the range (${i}).`,
        explanationHinglish: `Loop variable "i" ne agli value (${i}) le li.`,
        memorySnapshot: { n, i },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      consoleOut += (consoleOut === '' ? '' : '\n') + i;

      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Print the current value of "i" (${i}).`,
        explanationHinglish: `"i" ki current value (${i}) print kiya.`,
        memorySnapshot: { n, i },
        consoleOutput: consoleOut,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'i', outputValue: i },
      });
    }

    return steps;
  },
  executionSteps: [] // Fallback is no longer needed since generateSteps exists
};