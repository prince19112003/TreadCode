import type { LessonProgram, ExecutionStep } from '../../types';

export const greater_of_two: LessonProgram = {
  id: 'greater_of_two', language: 'python', topic: 'if_else', lessonNumber: 2,
  friendlyName: 'Greater of Two Numbers',
  learningObjective: 'Use if-else to compare two variables and output the larger one.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    a: { default: 15, min: -9999, max: 9999, label: 'Value a' },
    b: { default: 25, min: -9999, max: 9999, label: 'Value b' },
  },
  generateSteps: ({ a, b }): ExecutionStep[] => {
    const isGreater = a > b;
    const snap1: Record<string, string | number> = { a };
    const snap2: Record<string, string | number> = { a, b };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store ${a} in variable "a".`,
        explanationHinglish: `"a" variable me ${a} save kiya.`,
        memorySnapshot: snap1,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Store ${b} in variable "b".`,
        explanationHinglish: `"b" variable me ${b} save kiya.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Check if a (${a}) is greater than b (${b}). This condition is ${isGreater ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya a (${a}), b (${b}) se bada hai. Yeh condition ${isGreater ? 'True' : 'False'} hai.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '>', result: isGreater ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isGreater) {
      steps.push({
        step: 4, lineNum: 4,
        explanationEnglish: `Since the condition is true, we print the value of "a" (${a}).`,
        explanationHinglish: `Condition True hai isliye "a" ka value (${a}) print kar diya.`,
        memorySnapshot: snap2,
        consoleOutput: String(a),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'a', outputValue: a },
      });
    } else {
      steps.push(
        {
          step: 4, lineNum: 5,
          explanationEnglish: `Since the condition was False, we skip the if block and jump to the else block.`,
          explanationHinglish: `Condition False hone par hum if block ko skip karke else statement par chale move hua.`,
          memorySnapshot: snap2,
          animationEvent: { type: 'NONE' },
        },
        {
          step: 5, lineNum: 6,
          explanationEnglish: `Run the else block and print the value of "b" (${b}).`,
          explanationHinglish: `Else block execute kiya aur "b" ka value (${b}) print kar diya.`,
          memorySnapshot: snap2,
          consoleOutput: String(b),
          animationEvent: { type: 'PRINT_VALUE', variableName: 'b', outputValue: b },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store 15 in variable "a".',
      explanationHinglish: '"a" variable me 15 save kiya.',
      memorySnapshot: { a: 15 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: 15 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Store 25 in variable "b".',
      explanationHinglish: '"b" variable me 25 save kiya.',
      memorySnapshot: { a: 15, b: 25 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: 25 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Check if a (15) is greater than b (25). This condition is False.',
      explanationHinglish: 'Check kiya kya a, b se bada hai. 15 bada nahi hai 25 se, isliye condition False hai.',
      memorySnapshot: { a: 15, b: 25 },
      animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '>', result: 'False', storeIn: 'Condition' },
    },
  ],
};
