import type { LessonProgram, ExecutionStep } from '../../types';

export const positive_negative_zero: LessonProgram = {
  id: 'positive_negative_zero', language: 'python', topic: 'if_elif_else', lessonNumber: 3,
  friendlyName: 'Positive / Negative / Zero',
  learningObjective: 'Categorize a number into three exact states using if, elif, and else.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '-5' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Positive"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Negative"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 6, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Zero"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    num: { default: -5, min: -9999, max: 9999, label: 'Number' },
  },
  generateSteps: ({ num }): ExecutionStep[] => {
    const snap: Record<string, string | number> = { num };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store ${num} in "num".`,
        explanationHinglish: `"num" variable me ${num} dala.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if ${num} > 0. This is ${num > 0 ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya ${num}, 0 se bada hai. Yeh ${num > 0 ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '> 0', result: num > 0 ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (num > 0) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Since the condition is True, print "Positive".',
        explanationHinglish: 'Condition True is isliye "Positive" print kiya.',
        memorySnapshot: snap,
        consoleOutput: 'Positive',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Positive"', outputValue: 'Positive' },
      });
    } else {
      steps.push({
        step: 3, lineNum: 4,
        explanationEnglish: `Check the elif: is ${num} < 0? This is ${num < 0 ? 'True' : 'False'}.`,
        explanationHinglish: `Elif check kiya: kya ${num}, 0 se chhota hai. Yeh ${num < 0 ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '< 0', result: num < 0 ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (num < 0) {
        steps.push({
          step: 4, lineNum: 5,
          explanationEnglish: 'Since elif is true, print "Negative".',
          explanationHinglish: 'Elif condition true hone ki wajah se "Negative" print kiya.',
          memorySnapshot: snap,
          consoleOutput: 'Negative',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Negative"', outputValue: 'Negative' },
        });
      } else {
        steps.push(
          {
            step: 4, lineNum: 6,
            explanationEnglish: 'Since conditions above are False, jump to else.',
            explanationHinglish: 'Kyunki upar wali conditions false thin, isliye else block par jump kiya.',
            memorySnapshot: snap,
            animationEvent: { type: 'NONE' },
          },
          {
            step: 5, lineNum: 7,
            explanationEnglish: 'Run the else block and print "Zero".',
            explanationHinglish: 'Else block execute kiya aur "Zero" print kiya.',
            memorySnapshot: snap,
            consoleOutput: 'Zero',
            animationEvent: { type: 'PRINT_VALUE', variableName: '"Zero"', outputValue: 'Zero' },
          }
        );
      }
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store -5 in "num".',
      explanationHinglish: '"num" variable me -5 dala.',
      memorySnapshot: { num: -5 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: -5 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if -5 > 0. This is False.',
      explanationHinglish: 'Check kiya kya -5, 0 se bada hai. Yeh False hai.',
      memorySnapshot: { num: -5 },
      animationEvent: { type: 'COMPUTE', inputs: ['num'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    },
  ],
};
