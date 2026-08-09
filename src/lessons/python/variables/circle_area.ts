import type { LessonProgram, ExecutionStep } from '../../types';

export const circle_area: LessonProgram = {
  id: 'circle_area', language: 'python', topic: 'variables', lessonNumber: 8,
  friendlyName: 'Circle Area Using Variables',
  learningObjective: 'Learn how to combine variables and numbers to calculate the area of a circle.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'pi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'radius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'area' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'pi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'area' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    radius: { default: 5, min: 1, max: 9999, label: 'Radius' },
  },
  generateSteps: ({ radius }): ExecutionStep[] => {
    const pi = 3.14;
    const area = parseFloat((pi * radius * radius).toFixed(4));
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Create a box "pi" and store the decimal value 3.14.',
        explanationHinglish: '"pi" naam ka variable declare kiya aur usme 3.14 store kar diya.',
        memorySnapshot: { pi },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'pi', value: pi },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "radius" and store ${radius}.`,
        explanationHinglish: `"radius" variable bana aur usme ${radius} store kar diya.`,
        memorySnapshot: { pi, radius },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'radius', value: radius },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Calculate the area (3.14 * ${radius} * ${radius} = ${area}) and store in "area".`,
        explanationHinglish: `Area calculate kiya (3.14 * ${radius} * ${radius}) aur result ${area} "area" variable me store kiya.`,
        memorySnapshot: { pi, radius, area },
        animationEvent: { type: 'COMPUTE', inputs: ['pi', 'radius', 'radius'], operator: '*', result: area, storeIn: 'area' },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Print the value of "area" on the screen.`,
        explanationHinglish: `"area" variable ka value screen par print kiya.`,
        memorySnapshot: { pi, radius, area },
        consoleOutput: String(area),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: area },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "pi" and store the decimal value 3.14.',
      explanationHinglish: '"pi" naam ka variable declare kiya aur usme 3.14 store kar diya.',
      memorySnapshot: { pi: 3.14 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'pi', value: 3.14 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "radius" and store 5.',
      explanationHinglish: '"radius" variable bana aur usme 5 store kar diya.',
      memorySnapshot: { pi: 3.14, radius: 5 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'radius', value: 5 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Calculate the area (3.14 * 5 * 5) and store the result (78.5) in "area".',
      explanationHinglish: 'Area calculate kiya (3.14 * 5 * 5) aur result 78.5 "area" variable me store kiya.',
      memorySnapshot: { pi: 3.14, radius: 5, area: 78.5 },
      animationEvent: { type: 'COMPUTE', inputs: ['pi', 'radius', 'radius'], operator: '*', result: 78.5, storeIn: 'area' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the value of "area" on the screen.',
      explanationHinglish: '"area" variable ka value screen par print kiya.',
      memorySnapshot: { pi: 3.14, radius: 5, area: 78.5 },
      consoleOutput: '78.5',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: 78.5 },
    },
  ],
};
