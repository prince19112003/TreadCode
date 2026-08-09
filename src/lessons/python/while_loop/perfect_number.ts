import type { LessonProgram, ExecutionStep } from '../../types';

export const perfect_number: LessonProgram = {
  id: 'perfect_number',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 7,
  friendlyName: 'Perfect Number Check',
  learningObjective: 'Learn how to use a while loop to find divisors and check if a number is a Perfect Number.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 8, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Perfect Number"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not Perfect Number"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 6, min: 2, max: 9999, label: 'Number (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const limit = Number(n);
    let sum = 0;
    let i = 1;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the number ${limit} in "n".`,
      explanationHinglish: `"n" variable me ${limit} dala.`,
      memorySnapshot: { n: limit },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: limit },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Initialize "sum" to 0.',
      explanationHinglish: '"sum" ki value 0 set ki.',
      memorySnapshot: { n: limit, sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'sum', value: 0 },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize loop counter "i" to 1.',
      explanationHinglish: '"i" ki value 1 set ki.',
      memorySnapshot: { n: limit, sum: 0, i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: 1 },
    });

    while (i < limit) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if i < n. (${i} < ${limit}) is True.`,
        explanationHinglish: `Check kiya kya i < n. (${i} < ${limit}) True hai.`,
        memorySnapshot: { n: limit, sum, i },
        animationEvent: { type: 'COMPUTE', inputs: ['i', 'n'], operator: '<', result: 'True', storeIn: 'Condition' },
      });

      const isDivisor = limit % i === 0;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Check if n % i == 0: ${limit} % ${i} == 0 is ${isDivisor ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya n % i == 0 hai: ${limit} % ${i} == 0 Yeh ${isDivisor ? 'True' : 'False'} hai.`,
        memorySnapshot: { n: limit, sum, i },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: `% ${i} == 0`, result: isDivisor ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isDivisor) {
        const oldSum = sum;
        sum += i;
        steps.push({
          step: steps.length + 1, lineNum: 6,
          explanationEnglish: `Add i to sum: ${oldSum} + ${i} = ${sum}.`,
          explanationHinglish: `sum mein i joda: ${oldSum} + ${i} = ${sum}.`,
          memorySnapshot: { n: limit, sum, i },
          animationEvent: { type: 'COMPUTE', inputs: ['sum', 'i'], operator: '+', result: sum, storeIn: 'sum' },
        });
      }

      const oldI = i;
      i += 1;
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Increment i by 1: ${oldI} + 1 = ${i}.`,
        explanationHinglish: `i ko 1 se badhaya: ${oldI} + 1 = ${i}.`,
        memorySnapshot: { n: limit, sum, i },
        animationEvent: { type: 'COMPUTE', inputs: ['i'], operator: '+ 1', result: i, storeIn: 'i' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if i < n. (${i} < ${limit}) is False. Loop exits.`,
      explanationHinglish: `Check kiya kya i < n. (${i} < ${limit}) False hai. Loop complete.`,
      memorySnapshot: { n: limit, sum, i },
      animationEvent: { type: 'COMPUTE', inputs: ['i', 'n'], operator: '<', result: 'False', storeIn: 'Condition' },
    });

    const isPerfect = sum === limit;
    steps.push({
      step: steps.length + 1, lineNum: 8,
      explanationEnglish: `Check if sum == n: ${sum} == ${limit} is ${isPerfect ? 'True' : 'False'}.`,
      explanationHinglish: `Check kiya kya sum == n: ${sum} == ${limit} Yeh ${isPerfect ? 'True' : 'False'} hai.`,
      memorySnapshot: { n: limit, sum, i },
      animationEvent: { type: 'COMPUTE', inputs: ['sum', 'n'], operator: '==', result: isPerfect ? 'True' : 'False', storeIn: 'Condition' },
    });

    if (isPerfect) {
      steps.push({
        step: steps.length + 1, lineNum: 9,
        explanationEnglish: 'Print "Perfect Number".',
        explanationHinglish: '"Perfect Number" print kiya.',
        memorySnapshot: { n: limit, sum, i },
        consoleOutput: 'Perfect Number',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Perfect Number"', outputValue: 'Perfect Number' },
      });
    } else {
      steps.push(
        {
          step: steps.length + 1, lineNum: 10,
          explanationEnglish: 'Condition was False, skip to else block.',
          explanationHinglish: 'Condition False thi, else block par move hua.',
          memorySnapshot: { n: limit, sum, i },
          animationEvent: { type: 'NONE' },
        },
        {
          step: steps.length + 1, lineNum: 11,
          explanationEnglish: 'Print "Not Perfect Number".',
          explanationHinglish: '"Not Perfect Number" print kiya.',
          memorySnapshot: { n: limit, sum, i },
          consoleOutput: 'Not Perfect Number',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Not Perfect Number"', outputValue: 'Not Perfect Number' },
        }
      );
    }

    return steps;
  },
  executionSteps: []
};