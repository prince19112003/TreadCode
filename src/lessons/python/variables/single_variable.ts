import type { LessonProgram } from '../../types';

export const single_variable: LessonProgram = {
  id: 'single_variable', language: 'python', topic: 'variables', lessonNumber: 1,
  friendlyName: 'Create a Single Variable',
  learningObjective: 'Understand how a computer stores a number in memory using a named variable.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15' }] },
    { lineNum: 2, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'age' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    age: { default: 15, min: -9999, max: 9999, label: 'Age' },
  },
  generateSteps: ({ age }) => [
    {
      step: 1, lineNum: 1,
      explanationEnglish: `The computer creates a memory box named "age" and stores the number ${age} inside it.`,
      explanationHinglish: `Computer ne "age" variable declare kiya aur usme ${age} store kar diya!`,
      memorySnapshot: { age },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'age', value: age },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: `The computer opens the "age" box, reads ${age} from it, and prints it on the screen.`,
      explanationHinglish: `"age" ka variable read kiya, andar se ${age} fetch kiya, aur screen par print ho gaya!`,
      memorySnapshot: { age },
      consoleOutput: String(age),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'age', outputValue: age },
    },
  ],
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'The computer creates a memory box named "age" and stores the number 15 inside it.',
      explanationHinglish: 'Computer ne "age" variable declare kiya aur usme 15 store kar diya!',
      memorySnapshot: { age: 15 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'age', value: 15 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'The computer opens the "age" box, reads 15 from it, and prints it on the screen.',
      explanationHinglish: '"age" ka variable read kiya, andar se 15 fetch kiya, aur screen par print ho gaya!',
      memorySnapshot: { age: 15 },
      consoleOutput: '15',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'age', outputValue: 15 },
    },
  ],
};

