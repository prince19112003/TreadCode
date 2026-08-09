import type { LessonProgram, ExecutionStep } from '../../types';

export const division: LessonProgram = {
  id: 'division', language: 'python', topic: 'variables', lessonNumber: 7,
  friendlyName: 'Division Using Variables',
  learningObjective: 'Learn how to divide values using variables.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'total_candies' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'kids' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'candies_per_kid' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total_candies' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'kids' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'candies_per_kid' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    total_candies: { default: 20, min: 1, max: 9999, label: 'Total Candies' },
    kids:          { default: 5,  min: 1, max: 999,  label: 'Kids' },
  },
  generateSteps: ({ total_candies, kids }): ExecutionStep[] => {
    const candies_per_kid = parseFloat((total_candies / kids).toFixed(4));
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "total_candies" and store ${total_candies}.`,
        explanationHinglish: `"total_candies" naam ka variable bana aur ${total_candies} store kiya.`,
        memorySnapshot: { total_candies },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'total_candies', value: total_candies },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "kids" and store ${kids}.`,
        explanationHinglish: `"kids" variable bana aur usme ${kids} store kar diya.`,
        memorySnapshot: { total_candies, kids },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'kids', value: kids },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Divide "total_candies" by "kids" (${total_candies} / ${kids} = ${candies_per_kid}) and store in "candies_per_kid".`,
        explanationHinglish: `${total_candies} ko ${kids} se divide kiya aur result ${candies_per_kid} "candies_per_kid" variable me store kiya.`,
        memorySnapshot: { total_candies, kids, candies_per_kid },
        animationEvent: { type: 'COMPUTE', inputs: ['total_candies', 'kids'], operator: '/', result: candies_per_kid, storeIn: 'candies_per_kid' },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Print the value of "candies_per_kid".`,
        explanationHinglish: `"candies_per_kid" ka value screen par print kiya.`,
        memorySnapshot: { total_candies, kids, candies_per_kid },
        consoleOutput: String(candies_per_kid),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'candies_per_kid', outputValue: candies_per_kid },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "total_candies" and store 20.',
      explanationHinglish: '"total_candies" naam ka variable bana aur 20 store kiya.',
      memorySnapshot: { total_candies: 20 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'total_candies', value: 20 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "kids" and store 5.',
      explanationHinglish: '"kids" variable bana aur usme 5 store kar diya.',
      memorySnapshot: { total_candies: 20, kids: 5 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'kids', value: 5 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Divide "total_candies" by "kids" (20 / 5) and store the result (4.0) in "candies_per_kid".',
      explanationHinglish: '20 ko 5 se divide kiya aur result 4.0 "candies_per_kid" variable me store kiya.',
      memorySnapshot: { total_candies: 20, kids: 5, candies_per_kid: 4.0 },
      animationEvent: { type: 'COMPUTE', inputs: ['total_candies', 'kids'], operator: '/', result: 4.0, storeIn: 'candies_per_kid' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the value of "candies_per_kid".',
      explanationHinglish: '"candies_per_kid" ka value screen par print kiya.',
      memorySnapshot: { total_candies: 20, kids: 5, candies_per_kid: 4.0 },
      consoleOutput: '4.0',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'candies_per_kid', outputValue: 4.0 },
    },
  ],
};
