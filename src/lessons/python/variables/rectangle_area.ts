import type { LessonProgram, ExecutionStep } from '../../types';

export const rectangle_area: LessonProgram = {
  id: 'rectangle_area', language: 'python', topic: 'variables', lessonNumber: 12,
  friendlyName: 'Rectangle Area',
  learningObjective: 'Learn how to calculate the area of a rectangle using two variables.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'width' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'area' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'width' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'area' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    length: { default: 10, min: 1, max: 9999, label: 'Length' },
    width:  { default: 5,  min: 1, max: 9999, label: 'Width' },
  },
  generateSteps: ({ length, width }): ExecutionStep[] => {
    const area = length * width;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "length" and store ${length}.`,
        explanationHinglish: `"length" variable bana aur ${length} store kiya.`,
        memorySnapshot: { length },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'length', value: length },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "width" and store ${width}.`,
        explanationHinglish: `"width" variable bana aur ${width} store kiya.`,
        memorySnapshot: { length, width },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'width', value: width },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Calculate the area (${length} * ${width} = ${area}) and store in "area".`,
        explanationHinglish: `Area calculate kiya (${length} * ${width}) aur result ${area} "area" variable me store kiya.`,
        memorySnapshot: { length, width, area },
        animationEvent: { type: 'COMPUTE', inputs: ['length', 'width'], operator: '*', result: area, storeIn: 'area' },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Print the value of "area" on the screen.`,
        explanationHinglish: `"area" variable ka value screen par print kiya.`,
        memorySnapshot: { length, width, area },
        consoleOutput: String(area),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: area },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "length" and store 10.',
      explanationHinglish: '"length" variable bana aur 10 store kiya.',
      memorySnapshot: { length: 10 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'length', value: 10 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "width" and store 5.',
      explanationHinglish: '"width" variable bana aur 5 store kiya.',
      memorySnapshot: { length: 10, width: 5 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'width', value: 5 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Calculate the area (10 * 5) and store the result (50) in "area".',
      explanationHinglish: 'Area calculate kiya (10 * 5) aur result 50 "area" variable me store kiya.',
      memorySnapshot: { length: 10, width: 5, area: 50 },
      animationEvent: { type: 'COMPUTE', inputs: ['length', 'width'], operator: '*', result: 50, storeIn: 'area' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the value of "area" on the screen.',
      explanationHinglish: '"area" variable ka value screen par print kiya.',
      memorySnapshot: { length: 10, width: 5, area: 50 },
      consoleOutput: '50',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: 50 },
    },
  ],
};
