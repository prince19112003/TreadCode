import type { LessonProgram, ExecutionStep } from '../../types';

export const square_root: LessonProgram = {
  id: 'square_root', language: 'python', topic: 'variables', lessonNumber: 9,
  friendlyName: 'Square Root Using Variables',
  learningObjective: 'Learn how to use exponentiation to find the square root.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'number' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '16' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'root' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'number' }, { type: 'text', value: ' ' }, { type: 'operator', value: '**' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.5' }] },
    { lineNum: 3, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'root' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    number: { default: 16, min: 0, max: 999999, label: 'Number' },
  },
  generateSteps: ({ number }): ExecutionStep[] => {
    const root = parseFloat(Math.pow(number, 0.5).toFixed(4));
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "number" and store ${number} inside it.`,
        explanationHinglish: `"number" naam ka variable declare kiya aur usme ${number} store kar diya.`,
        memorySnapshot: { number },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'number', value: number },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Calculate the square root of ${number} (** 0.5) and store the result (${root}) in "root".`,
        explanationHinglish: `${number} ka square root nikala (** 0.5 use karke) aur result ${root} "root" variable me store kiya.`,
        memorySnapshot: { number, root },
        animationEvent: { type: 'COMPUTE', inputs: ['number', '0.5'], operator: '**', result: root, storeIn: 'root' },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Print the value of "root" on the screen.`,
        explanationHinglish: `"root" ka value (${root}) screen par print kiya.`,
        memorySnapshot: { number, root },
        consoleOutput: String(root),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'root', outputValue: root },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "number" and store 16 inside it.',
      explanationHinglish: '"number" naam ka variable declare kiya aur usme 16 store kar diya.',
      memorySnapshot: { number: 16 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'number', value: 16 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Calculate the square root of 16 using the exponent operator (** 0.5) and store the result (4.0) in "root".',
      explanationHinglish: '16 ka square root nikala (** 0.5 use karke) aur result 4.0 "root" variable me store kiya.',
      memorySnapshot: { number: 16, root: 4.0 },
      animationEvent: { type: 'COMPUTE', inputs: ['number', '0.5'], operator: '**', result: 4.0, storeIn: 'root' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Print the value of "root" on the screen.',
      explanationHinglish: '"root" ka value (4.0) screen par print kiya.',
      memorySnapshot: { number: 16, root: 4.0 },
      consoleOutput: '4.0',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'root', outputValue: 4.0 },
    },
  ],
};
