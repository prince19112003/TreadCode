import type { LessonProgram, ExecutionStep } from '../../types';

export const divisible_by_5: LessonProgram = {
  id: 'divisible_by_5', language: 'python', topic: 'if_statement', lessonNumber: 2,
  friendlyName: 'Divisible by 5',
  learningObjective: 'Learn how to use the modulo operator (%) in an if condition to check divisibility.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'score' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'score' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Multiple of 5!"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    score: { default: 25, min: -9999, max: 9999, label: 'Score' },
  },
  generateSteps: ({ score }): ExecutionStep[] => {
    const conditionResult = score % 5 === 0;
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the value ${score} in the "score" variable.`,
        explanationHinglish: `"score" variable me ${score} save kiya.`,
        memorySnapshot: { score },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'score', value: score },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if score divided by 5 leaves a remainder of 0. (${score} % 5 == 0 is ${conditionResult ? 'True' : 'False'})`,
        explanationHinglish: `Check kiya ki kya score ko 5 se divide karne par remainder 0 aata hai. Yeh condition ${conditionResult ? 'true' : 'false'} hai.`,
        memorySnapshot: { score },
        animationEvent: { type: 'COMPUTE', inputs: ['score'], operator: '% 5 == 0', result: conditionResult ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];
    if (conditionResult) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Condition is true, so print "Multiple of 5!".',
        explanationHinglish: 'Condition True hai, isliye if block execute hua aur "Multiple of 5!" print kiya.',
        memorySnapshot: { score },
        consoleOutput: 'Multiple of 5!',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Multiple of 5!"', outputValue: 'Multiple of 5!' },
      });
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the value 25 in the "score" variable.',
      explanationHinglish: '"score" variable me 25 save kiya.',
      memorySnapshot: { score: 25 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'score', value: 25 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if score divided by 5 leaves a remainder of 0. (25 % 5 == 0 is True)',
      explanationHinglish: 'Check kiya ki kya score ko 5 se divide karne par remainder 0 aata hai. Yeh condition true hai.',
      memorySnapshot: { score: 25 },
      animationEvent: { type: 'COMPUTE', inputs: ['score'], operator: '% 5 == 0', result: 'True', storeIn: 'Condition' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Condition is true, so print "Multiple of 5!".',
      explanationHinglish: 'Condition True hai, isliye if block execute hua aur "Multiple of 5!" print kiya.',
      memorySnapshot: { score: 25 },
      consoleOutput: 'Multiple of 5!',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Multiple of 5!"', outputValue: 'Multiple of 5!' },
    },
  ],
};
