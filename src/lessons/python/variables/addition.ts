import type { LessonProgram, ExecutionStep } from '../../types';

export const addition: LessonProgram = {
  id: 'addition', language: 'python', topic: 'variables', lessonNumber: 4,
  friendlyName: 'Addition Using Variables',
  learningObjective: 'Learn how to perform addition operations with variables and store the result.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'apples' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'oranges' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'total_fruits' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'apples' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'oranges' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'total_fruits' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    apples:  { default: 5, min: 0, max: 9999, label: 'Apples' },
    oranges: { default: 3, min: 0, max: 9999, label: 'Oranges' },
  },
  generateSteps: ({ apples, oranges }): ExecutionStep[] => {
    const total_fruits = apples + oranges;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "apples" and store the number ${apples}.`,
        explanationHinglish: `"apples" naam ka variable bana aur usme ${apples} store kar diya.`,
        memorySnapshot: { apples },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'apples', value: apples },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create another box "oranges" and store the number ${oranges}.`,
        explanationHinglish: `Ek aur variable declare kiya "oranges" aur usme ${oranges} store kar diya.`,
        memorySnapshot: { apples, oranges },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'oranges', value: oranges },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Add "apples" and "oranges" (${apples}+${oranges}=${total_fruits}), store result in "total_fruits".`,
        explanationHinglish: `"apples" aur "oranges" ki value ko joda (${apples}+${oranges}=${total_fruits}) aur "total_fruits" variable me store kiya.`,
        memorySnapshot: { apples, oranges, total_fruits },
        animationEvent: { type: 'COMPUTE', inputs: ['apples', 'oranges'], operator: '+', result: total_fruits, storeIn: 'total_fruits' },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Print the value of "total_fruits" on the screen.`,
        explanationHinglish: `"total_fruits" ka value screen pe print kar diya.`,
        memorySnapshot: { apples, oranges, total_fruits },
        consoleOutput: String(total_fruits),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'total_fruits', outputValue: total_fruits },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box named "apples" and store the number 5.',
      explanationHinglish: '"apples" naam ka variable bana aur usme 5 store kar diya.',
      memorySnapshot: { apples: 5 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'apples', value: 5 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create another box named "oranges" and store the number 3.',
      explanationHinglish: 'Ek aur variable declare kiya "oranges" aur usme 3 store kar diya.',
      memorySnapshot: { apples: 5, oranges: 3 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'oranges', value: 3 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Add the values inside "apples" and "oranges", then store the result (8) in a new box "total_fruits".',
      explanationHinglish: '"apples" aur "oranges" ki value ko joda (5+3=8) aur "total_fruits" variable me store kiya.',
      memorySnapshot: { apples: 5, oranges: 3, total_fruits: 8 },
      animationEvent: { type: 'COMPUTE', inputs: ['apples', 'oranges'], operator: '+', result: 8, storeIn: 'total_fruits' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the value of "total_fruits" on the screen.',
      explanationHinglish: '"total_fruits" ka value screen pe print kar diya.',
      memorySnapshot: { apples: 5, oranges: 3, total_fruits: 8 },
      consoleOutput: '8',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'total_fruits', outputValue: 8 },
    },
  ],
};
