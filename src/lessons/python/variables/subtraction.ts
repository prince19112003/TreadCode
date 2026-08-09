import type { LessonProgram, ExecutionStep } from '../../types';

export const subtraction: LessonProgram = {
  id: 'subtraction', language: 'python', topic: 'variables', lessonNumber: 5,
  friendlyName: 'Subtraction Using Variables',
  learningObjective: 'Learn how to subtract values using variables.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'total_money' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'spent' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '40' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'remaining' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total_money' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'spent' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'remaining' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    total_money: { default: 100, min: 0, max: 99999, label: 'Total Money' },
    spent:       { default: 40,  min: 0, max: 99999, label: 'Spent' },
  },
  generateSteps: ({ total_money, spent }): ExecutionStep[] => {
    const remaining = total_money - spent;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "total_money" and store ${total_money} inside it.`,
        explanationHinglish: `"total_money" naam ka variable bana aur usme ${total_money} store kar diya.`,
        memorySnapshot: { total_money },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'total_money', value: total_money },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "spent" and store ${spent}.`,
        explanationHinglish: `"spent" variable bana aur usme ${spent} store kar diya.`,
        memorySnapshot: { total_money, spent },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'spent', value: spent },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Subtract "spent" from "total_money" (${total_money} - ${spent} = ${remaining}) and store in "remaining".`,
        explanationHinglish: `${total_money} me se ${spent} ghataya aur bacha hua ${remaining} "remaining" variable me store kiya.`,
        memorySnapshot: { total_money, spent, remaining },
        animationEvent: { type: 'COMPUTE', inputs: ['total_money', 'spent'], operator: '-', result: remaining, storeIn: 'remaining' },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Print the value of "remaining" on the screen.`,
        explanationHinglish: `"remaining" ka value (${remaining}) screen par dekhaya.`,
        memorySnapshot: { total_money, spent, remaining },
        consoleOutput: String(remaining),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'remaining', outputValue: remaining },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "total_money" and store 100 inside it.',
      explanationHinglish: '"total_money" naam ka variable bana aur usme 100 store kar diya.',
      memorySnapshot: { total_money: 100 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'total_money', value: 100 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "spent" and store 40.',
      explanationHinglish: '"spent" variable bana aur usme 40 store kar diya.',
      memorySnapshot: { total_money: 100, spent: 40 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'spent', value: 40 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Subtract "spent" from "total_money" (100 - 40) and store the result (60) in "remaining".',
      explanationHinglish: '100 me se 40 ghataya (minus kiya) aur bacha hua 60 "remaining" variable me store kiya.',
      memorySnapshot: { total_money: 100, spent: 40, remaining: 60 },
      animationEvent: { type: 'COMPUTE', inputs: ['total_money', 'spent'], operator: '-', result: 60, storeIn: 'remaining' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the value of "remaining" on the screen.',
      explanationHinglish: '"remaining" ka value (60) screen par dekhaya.',
      memorySnapshot: { total_money: 100, spent: 40, remaining: 60 },
      consoleOutput: '60',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'remaining', outputValue: 60 },
    },
  ],
};
