import type { LessonProgram, ExecutionStep } from '../../types';

export const multiple_variables: LessonProgram = {
  id: 'multiple_variables', language: 'python', topic: 'variables', lessonNumber: 2,
  friendlyName: 'Create Multiple Variables',
  learningObjective: 'Understand that the computer stores multiple independent variables in separate memory boxes.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'width' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 3, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'width' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    length: { default: 10, min: 1, max: 9999, label: 'Length' },
    width:  { default: 5,  min: 1, max: 9999, label: 'Width' },
  },
  generateSteps: ({ length, width }): ExecutionStep[] => [
    {
      step: 1, lineNum: 1,
      explanationEnglish: `A memory box called "length" is created and the number ${length} is stored inside.`,
      explanationHinglish: `"length" naam ka pehla variable bana aur usme ${length} gaya!`,
      memorySnapshot: { length },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'length', value: length },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: `A second independent memory box called "width" is created and stores ${width}.`,
      explanationHinglish: `Ek aur alag variable "width" bana, usme ${width} store ho gaya. Dono alag-alag hain!`,
      memorySnapshot: { length, width },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'width', value: width },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: `The computer reads from the "length" box and prints ${length} on the screen.`,
      explanationHinglish: `"length" ka variable read kiya, ${length} screen pe print ho gaya!`,
      memorySnapshot: { length, width },
      consoleOutput: String(length),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'length', outputValue: length },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: `The computer reads from the "width" box and prints ${width} on the screen.`,
      explanationHinglish: `"width" ka variable read kiya, ${width} screen pe print ho gaya!`,
      memorySnapshot: { length, width },
      consoleOutput: `${length}\n${width}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'width', outputValue: width },
    },
  ],
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'A memory box called "length" is created and the number 10 is stored inside.',
      explanationHinglish: '"length" naam ka pehla variable bana aur usme 10 gaya!',
      memorySnapshot: { length: 10 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'length', value: 10 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'A second independent memory box called "width" is created and stores 5.',
      explanationHinglish: 'Ek aur alag variable "width" bana, usme 5 store ho gaya. Dono alag-alag hain!',
      memorySnapshot: { length: 10, width: 5 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'width', value: 5 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'The computer reads from the "length" box and prints 10 on the screen.',
      explanationHinglish: '"length" ka variable read kiya, 10 screen pe print ho gaya!',
      memorySnapshot: { length: 10, width: 5 },
      consoleOutput: '10',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'length', outputValue: 10 },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'The computer reads from the "width" box and prints 5 on the screen.',
      explanationHinglish: '"width" ka variable read kiya, 5 screen pe print ho gaya!',
      memorySnapshot: { length: 10, width: 5 },
      consoleOutput: '10\n5',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'width', outputValue: 5 },
    },
  ],
};
