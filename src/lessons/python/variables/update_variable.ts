import type { LessonProgram } from '../../types';

export const update_variable: LessonProgram = {
  id: 'update_variable', language: 'python', topic: 'variables', lessonNumber: 4,
  friendlyName: 'Update Variable Value',
  learningObjective: 'Understand that assigning a new value erases the old value from the memory box.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'points' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'points' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'points' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'points' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    points_initial: { default: 10, min: -9999, max: 9999, label: 'Initial Points' },
    points_updated: { default: 20, min: -9999, max: 9999, label: 'Updated Points' },
  },
  generateSteps: ({ points_initial, points_updated }) => [
    {
      step: 1, lineNum: 1,
      explanationEnglish: `"points" box is created and ${points_initial} is stored inside it.`,
      explanationHinglish: `"points" ka variable bana, usme ${points_initial} store kiya!`,
      memorySnapshot: { points: points_initial },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'points', value: points_initial },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: `Computer reads ${points_initial} from "points" and prints it.`,
      explanationHinglish: `variable read kiya — ${points_initial} screen par print ho gaya!`,
      memorySnapshot: { points: points_initial },
      consoleOutput: String(points_initial),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'points', outputValue: points_initial },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: `The old value ${points_initial} is destroyed and replaced with ${points_updated}. The box still has the same name.`,
      explanationHinglish: `${points_initial} mit gaya! Usi variable me ab ${points_updated} aa gaya. Naam wahi raha, value badal gayi!`,
      memorySnapshot: { points: points_updated },
      animationEvent: { type: 'UPDATE_VARIABLE', name: 'points', oldValue: points_initial, newValue: points_updated },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: `Now the "points" box contains ${points_updated}, so ${points_updated} is printed.`,
      explanationHinglish: `Ab variable read kiya toh ${points_updated} fetch kiya — ${points_updated} screen pe print ho gaya!`,
      memorySnapshot: { points: points_updated },
      consoleOutput: `${points_initial}\n${points_updated}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'points', outputValue: points_updated },
    },
  ],
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: '"points" box is created and 10 is stored inside it.',
      explanationHinglish: '"points" ka variable bana, usme 10 store kiya!',
      memorySnapshot: { points: 10 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'points', value: 10 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Computer reads 10 from "points" and prints it.',
      explanationHinglish: 'variable read kiya — 10 screen par print ho gaya!',
      memorySnapshot: { points: 10 },
      consoleOutput: '10',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'points', outputValue: 10 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'The old value 10 is destroyed and replaced with 20. The box still has the same name.',
      explanationHinglish: '10 mit gaya! Usi variable me ab 20 aa gaya. Naam wahi raha, value badal gayi!',
      memorySnapshot: { points: 20 },
      animationEvent: { type: 'UPDATE_VARIABLE', name: 'points', oldValue: 10, newValue: 20 },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Now the "points" box contains 20, so 20 is printed.',
      explanationHinglish: 'Ab variable read kiya toh 20 fetch kiya — 20 screen pe print ho gaya!',
      memorySnapshot: { points: 20 },
      consoleOutput: '10\n20',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'points', outputValue: 20 },
    },
  ],
};
