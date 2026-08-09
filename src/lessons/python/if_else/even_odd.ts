import type { LessonProgram, ExecutionStep } from '../../types';

export const even_odd: LessonProgram = {
  id: 'even_odd', language: 'python', topic: 'if_else', lessonNumber: 1,
  friendlyName: 'Even or Odd',
  learningObjective: 'Learn how to use an if-else statement to execute one block of code for true conditions and another for false.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'number' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '8' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'number' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Even"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Odd"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    number: { default: 8, min: -9999, max: 9999, label: 'Number' },
  },
  generateSteps: ({ number }): ExecutionStep[] => {
    const isEven = number % 2 === 0;
    const snap: Record<string, string | number> = { number };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the number ${number} in the "number" box.`,
        explanationHinglish: `"number" variable me ${number} store kiya.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'number', value: number },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if ${number} is divisible by 2. The condition is ${isEven ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya ${number} ko 2 se divide karne par remainder 0 aata hai. Yeh condition ${isEven ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['number'], operator: '% 2 == 0', result: isEven ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isEven) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Since the condition is true, we run the if block and print "Even".',
        explanationHinglish: 'Condition True hai, isliye if block execute hua aur "Even" print hua.',
        memorySnapshot: snap,
        consoleOutput: 'Even',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Even"', outputValue: 'Even' },
      });
    } else {
      steps.push(
        {
          step: 3, lineNum: 4,
          explanationEnglish: 'Since the condition was False, we skip the if block and jump to the else statement.',
          explanationHinglish: 'Condition False hone par hum if block ko skip karke else statement par move hua.',
          memorySnapshot: snap,
          animationEvent: { type: 'NONE' },
        },
        {
          step: 4, lineNum: 5,
          explanationEnglish: 'We execute the else block and print "Odd".',
          explanationHinglish: 'Else block execute kiya aur "Odd" print kar diya.',
          memorySnapshot: snap,
          consoleOutput: 'Odd',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Odd"', outputValue: 'Odd' },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the number 8 in the "number" box.',
      explanationHinglish: '"number" variable me 8 store kiya.',
      memorySnapshot: { number: 8 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'number', value: 8 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if 8 is divisible by 2 (remainder == 0). The condition is True.',
      explanationHinglish: 'Check kiya kya 8 ko 2 se divide karne par remainder 0 aata hai. Yeh condition True hai.',
      memorySnapshot: { number: 8 },
      animationEvent: { type: 'COMPUTE', inputs: ['number'], operator: '% 2 == 0', result: 'True', storeIn: 'Condition' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Since the condition is true, we run the if block and print "Even".',
      explanationHinglish: 'Condition True hai, isliye if block execute hua aur "Even" print hua.',
      memorySnapshot: { number: 8 },
      consoleOutput: 'Even',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Even"', outputValue: 'Even' },
    },
  ],
};
