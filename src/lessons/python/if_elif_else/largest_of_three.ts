import type { LessonProgram, ExecutionStep } from '../../types';

export const largest_of_three: LessonProgram = {
  id: 'largest_of_three', language: 'python', topic: 'if_elif_else', lessonNumber: 1,
  friendlyName: 'Largest of Three Numbers',
  learningObjective: 'Use if, elif, and else together to check multiple conditions sequentially.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'z' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'and' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'z' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 6, tokens: [{ type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'z' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'y' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 8, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'z' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    x: { default: 10, min: -9999, max: 9999, label: 'Value x' },
    y: { default: 25, min: -9999, max: 9999, label: 'Value y' },
    z: { default: 15, min: -9999, max: 9999, label: 'Value z' },
  },
  generateSteps: ({ x, y, z }): ExecutionStep[] => {
    const isXMax = x > y && x > z;
    const isYMax = y > z;
    
    const snap1: Record<string, string | number> = { x };
    const snap2: Record<string, string | number> = { x, y };
    const snap3: Record<string, string | number> = { x, y, z };
    
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store ${x} in "x".`,
        explanationHinglish: `"x" mein ${x} save kiya.`,
        memorySnapshot: snap1,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'x', value: x },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Store ${y} in "y".`,
        explanationHinglish: `"y" mein ${y} save kiya.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'y', value: y },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Store ${z} in "z".`,
        explanationHinglish: `"z" mein ${z} save kiya.`,
        memorySnapshot: snap3,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'z', value: z },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Check if x (${x}) is greater than both y (${y}) and z (${z}). This is ${isXMax ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya x (${x}) baki dono se bada hai. Yeh condition ${isXMax ? 'True' : 'False'} hai.`,
        memorySnapshot: snap3,
        animationEvent: { type: 'COMPUTE', inputs: ['x', 'y', 'z'], operator: 'x > y and x > z', result: isXMax ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isXMax) {
      steps.push({
        step: 5, lineNum: 5,
        explanationEnglish: `The condition is True, print "x" (${x}).`,
        explanationHinglish: `Condition True is isliye x ka value (${x}) print kiya.`,
        memorySnapshot: snap3,
        consoleOutput: String(x),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'x', outputValue: x },
      });
    } else {
      steps.push({
        step: 5, lineNum: 6,
        explanationEnglish: `Since the first condition was False, check the elif condition: is y greater than z? (${y} > ${z}) is ${isYMax ? 'True' : 'False'}.`,
        explanationHinglish: `Pehli condition False thi, toh ab elif block dekha. Kya y (${y}), z (${z}) se bada hai? Yeh ${isYMax ? 'True' : 'False'} hai.`,
        memorySnapshot: snap3,
        animationEvent: { type: 'COMPUTE', inputs: ['y', 'z'], operator: 'y > z', result: isYMax ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isYMax) {
        steps.push({
          step: 6, lineNum: 7,
          explanationEnglish: `The elif condition is True, so print "y" (${y}).`,
          explanationHinglish: `Elif condition True is, isliye y ka value (${y}) print kiya.`,
          memorySnapshot: snap3,
          consoleOutput: String(y),
          animationEvent: { type: 'PRINT_VALUE', variableName: 'y', outputValue: y },
        });
      } else {
        steps.push(
          {
            step: 6, lineNum: 8,
            explanationEnglish: 'All conditions are False, jump to else block.',
            explanationHinglish: 'Upar ki sab conditions false thi, else statement par jump kiya.',
            memorySnapshot: snap3,
            animationEvent: { type: 'NONE' },
          },
          {
            step: 7, lineNum: 9,
            explanationEnglish: `Run the else block and print the value of "z" (${z}).`,
            explanationHinglish: `Else block execute kiya aur "z" ka value (${z}) print kiya.`,
            memorySnapshot: snap3,
            consoleOutput: String(z),
            animationEvent: { type: 'PRINT_VALUE', variableName: 'z', outputValue: z },
          }
        );
      }
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store 10 in "x".',
      explanationHinglish: '"x" mein 10 save kiya.',
      memorySnapshot: { x: 10 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'x', value: 10 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Store 25 in "y".',
      explanationHinglish: '"y" mein 25 save kiya.',
      memorySnapshot: { x: 10, y: 25 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'y', value: 25 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Store 15 in "z".',
      explanationHinglish: '"z" mein 15 save kiya.',
      memorySnapshot: { x: 10, y: 25, z: 15 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'z', value: 15 },
    },
  ],
};
