import type { LessonProgram, ExecutionStep } from '../../types';

export const square_area: LessonProgram = {
  id: 'square_area', language: 'python', topic: 'variables', lessonNumber: 11,
  friendlyName: 'Square Area',
  learningObjective: 'Learn how to calculate the area of a square using variables.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'side' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'area' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'side' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'side' }] },
    { lineNum: 3, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'area' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    side: { default: 4, min: 1, max: 9999, label: 'Side Length' },
  },
  generateSteps: ({ side }): ExecutionStep[] => {
    const area = side * side;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "side" and store ${side}.`,
        explanationHinglish: `"side" variable bana aur ${side} store kiya.`,
        memorySnapshot: { side },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'side', value: side },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Calculate the area (${side} * ${side} = ${area}) and store in "area".`,
        explanationHinglish: `Area calculate kiya (${side} * ${side}) aur result ${area} "area" me store kiya.`,
        memorySnapshot: { side, area },
        animationEvent: { type: 'COMPUTE', inputs: ['side', 'side'], operator: '*', result: area, storeIn: 'area' },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Print the value of "area" on the screen.`,
        explanationHinglish: `"area" variable ka value screen par print kiya.`,
        memorySnapshot: { side, area },
        consoleOutput: String(area),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: area },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "side" and store 4.',
      explanationHinglish: '"side" variable bana aur 4 store kiya.',
      memorySnapshot: { side: 4 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'side', value: 4 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Calculate the area (4 * 4) and store the result (16) in "area".',
      explanationHinglish: 'Area calculate kiya (4 * 4) aur result 16 "area" me store kiya.',
      memorySnapshot: { side: 4, area: 16 },
      animationEvent: { type: 'COMPUTE', inputs: ['side', 'side'], operator: '*', result: 16, storeIn: 'area' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Print the value of "area" on the screen.',
      explanationHinglish: '"area" variable ka value screen par print kiya.',
      memorySnapshot: { side: 4, area: 16 },
      consoleOutput: '16',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: 16 },
    },
  ],
};
