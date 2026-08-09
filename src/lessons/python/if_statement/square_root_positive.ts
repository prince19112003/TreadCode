import type { LessonProgram, ExecutionStep } from '../../types';

export const square_root_positive: LessonProgram = {
  id: 'square_root_positive', language: 'python', topic: 'if_statement', lessonNumber: 5,
  friendlyName: 'Square Root of Positive Number',
  learningObjective: 'Use an if statement to ensure an operation (like square root) is only performed on valid inputs.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'root' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '**' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.5' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'root' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    num: { default: 25, min: -9999, max: 999999, label: 'Number' },
  },
  generateSteps: ({ num }): ExecutionStep[] => {
    const conditionResult = num > 0;
    const snapNum: Record<string, string | number> = { num };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the number ${num} in the "num" box.`,
        explanationHinglish: `"num" variable me ${num} dala.`,
        memorySnapshot: snapNum,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if num (${num}) is greater than 0 to avoid errors. The condition is ${conditionResult ? 'True' : 'False'}.`,
        explanationHinglish: `Square root nikalne se pehle check kiya ki number positive hai (0 se bada hai). ${conditionResult ? 'True' : 'False'} hai.`,
        memorySnapshot: snapNum,
        animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '> 0', result: conditionResult ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];
    if (conditionResult) {
      const root = parseFloat(Math.pow(num, 0.5).toFixed(4));
      const snapRoot: Record<string, string | number> = { num, root };
      steps.push(
        {
          step: 3, lineNum: 3,
          explanationEnglish: `Calculate the square root of ${num} (which is ${root}) and store it in "root".`,
          explanationHinglish: `${num} ka square root nikala (${root}) aur usko naye variable "root" mein save kiya.`,
          memorySnapshot: snapRoot,
          animationEvent: { type: 'COMPUTE', inputs: ['num', '0.5'], operator: '**', result: root, storeIn: 'root' },
        },
        {
          step: 4, lineNum: 4,
          explanationEnglish: `Print the calculated root value on the screen.`,
          explanationHinglish: `Calculated root value (${root}) ko screen par print kiya.`,
          memorySnapshot: snapRoot,
          consoleOutput: String(root),
          animationEvent: { type: 'PRINT_VALUE', variableName: 'root', outputValue: root },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the number 25 in the "num" box.',
      explanationHinglish: '"num" variable me 25 dala.',
      memorySnapshot: { num: 25 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: 25 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if num is greater than 0 to avoid errors when finding the square root.',
      explanationHinglish: 'Square root nikalne se pehle check kiya ki number positive hai (0 se bada hai). True hai.',
      memorySnapshot: { num: 25 },
      animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '> 0', result: 'True', storeIn: 'Condition' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Calculate the square root of 25 (which is 5.0) and store it in "root".',
      explanationHinglish: '25 ka square root nikala (5.0) aur usko naye variable "root" mein save kiya.',
      memorySnapshot: { num: 25, root: 5.0 },
      animationEvent: { type: 'COMPUTE', inputs: ['num', '0.5'], operator: '**', result: 5.0, storeIn: 'root' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the calculated root value on the screen.',
      explanationHinglish: 'Calculated root value (5.0) ko screen par print kiya.',
      memorySnapshot: { num: 25, root: 5.0 },
      consoleOutput: '5.0',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'root', outputValue: 5.0 },
    },
  ],
};
