import type { LessonProgram, ExecutionStep } from '../../types';

export const divisible_by_7: LessonProgram = {
  id: 'divisible_by_7', language: 'python', topic: 'if_else', lessonNumber: 5,
  friendlyName: 'Divisible by 7 or Not',
  learningObjective: 'Use modulo with an if-else to verify exact divisibility.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Divisible"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not Divisible"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    num: { default: 15, min: -9999, max: 999999, label: 'Number' },
  },
  generateSteps: ({ num }): ExecutionStep[] => {
    const isDiv = num % 7 === 0;
    const snap: Record<string, string | number> = { num };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the number ${num} in "num".`,
        explanationHinglish: `"num" variable me ${num} dala.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if ${num} divided by 7 leaves a remainder of 0. (${num} % 7 is ${num % 7}, so ${num % 7} == 0 is ${isDiv ? 'True' : 'False'}).`,
        explanationHinglish: `Check kiya kya ${num} ko 7 se divide karne par remainder 0 aata hai. Yeh condition ${isDiv ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '% 7 == 0', result: isDiv ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isDiv) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Since the condition is true, run the if block and print "Divisible".',
        explanationHinglish: 'Condition True is isliye if block execute hua aur "Divisible" print kiya.',
        memorySnapshot: snap,
        consoleOutput: 'Divisible',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Divisible"', outputValue: 'Divisible' },
      });
    } else {
      steps.push(
        {
          step: 3, lineNum: 4,
          explanationEnglish: 'Because the condition is False, jump directly to the else statement.',
          explanationHinglish: 'Condition False thi, isliye sidha else block par jump kiya.',
          memorySnapshot: snap,
          animationEvent: { type: 'NONE' },
        },
        {
          step: 4, lineNum: 5,
          explanationEnglish: 'Run the else block and print "Not Divisible".',
          explanationHinglish: 'Else block execute kiya aur "Not Divisible" print kiya.',
          memorySnapshot: snap,
          consoleOutput: 'Not Divisible',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Not Divisible"', outputValue: 'Not Divisible' },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the number 15 in "num".',
      explanationHinglish: '"num" variable me 15 dala.',
      memorySnapshot: { num: 15 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: 15 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if 15 divided by 7 leaves a remainder of 0. (15 % 7 is 1, so 1 == 0 is False).',
      explanationHinglish: 'Check kiya kya 15 ko 7 se divide karne par remainder 0 bachta hai. Yeh False hai kyunki remainder 1 aayega.',
      memorySnapshot: { num: 15 },
      animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '% 7 == 0', result: 'False', storeIn: 'Condition' },
    },
  ],
};
