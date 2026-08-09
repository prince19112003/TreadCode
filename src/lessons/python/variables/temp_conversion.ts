import type { LessonProgram, ExecutionStep } from '../../types';

export const temp_conversion: LessonProgram = {
  id: 'temp_conversion', language: 'python', topic: 'variables', lessonNumber: 13,
  friendlyName: 'Temperature Conversion',
  learningObjective: 'Learn how to convert temperature from Celsius to Fahrenheit using variables and a formula.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'celsius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'fahrenheit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'celsius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '9' }, { type: 'operator', value: '/' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '32' }] },
    { lineNum: 3, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'fahrenheit' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    celsius: { default: 25, min: -273, max: 9999, label: 'Celsius' },
  },
  generateSteps: ({ celsius }): ExecutionStep[] => {
    const fahrenheit = parseFloat(((celsius * 9 / 5) + 32).toFixed(4));
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "celsius" and store ${celsius}.`,
        explanationHinglish: `"celsius" variable bana aur ${celsius} store kiya.`,
        memorySnapshot: { celsius },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'celsius', value: celsius },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Calculate Fahrenheit ((${celsius} * 9/5) + 32 = ${fahrenheit}) and store in "fahrenheit".`,
        explanationHinglish: `Formula calculate kiya aur result ${fahrenheit} "fahrenheit" me store kiya.`,
        memorySnapshot: { celsius, fahrenheit },
        animationEvent: { type: 'COMPUTE', inputs: ['celsius', '9', '5', '32'], operator: '* / +', result: fahrenheit, storeIn: 'fahrenheit' },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Print the value of "fahrenheit" on the screen.`,
        explanationHinglish: `"fahrenheit" variable ka value screen par print kiya.`,
        memorySnapshot: { celsius, fahrenheit },
        consoleOutput: String(fahrenheit),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'fahrenheit', outputValue: fahrenheit },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "celsius" and store 25.',
      explanationHinglish: '"celsius" variable bana aur 25 store kiya.',
      memorySnapshot: { celsius: 25 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'celsius', value: 25 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Calculate Fahrenheit ((25 * 9/5) + 32) and store the result (77.0) in "fahrenheit".',
      explanationHinglish: 'Formula calculate kiya aur result 77.0 "fahrenheit" me store kiya.',
      memorySnapshot: { celsius: 25, fahrenheit: 77.0 },
      animationEvent: { type: 'COMPUTE', inputs: ['celsius', '9', '5', '32'], operator: '* / +', result: 77.0, storeIn: 'fahrenheit' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Print the value of "fahrenheit" on the screen.',
      explanationHinglish: '"fahrenheit" variable ka value screen par print kiya.',
      memorySnapshot: { celsius: 25, fahrenheit: 77.0 },
      consoleOutput: '77.0',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'fahrenheit', outputValue: 77.0 },
    },
  ],
};
