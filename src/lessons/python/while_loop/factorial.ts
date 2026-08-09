import type { LessonProgram, ExecutionStep } from '../../types';

export const factorial: LessonProgram = {
  id: 'factorial',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 11,
  friendlyName: 'Factorial of a Number',
  learningObjective: 'Learn how to compute the product of numbers from 1 to N using a while loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 7, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'fact' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 10, label: 'Number (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const limit = Number(n);
    let fact = 1;
    let i = 1;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the limit number ${limit} in "n".`,
      explanationHinglish: `"n" variable me ${limit} set kiya.`,
      memorySnapshot: { n: limit },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: limit },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Initialize "fact" to 1.',
      explanationHinglish: '"fact" ki value 1 set ki.',
      memorySnapshot: { n: limit, fact: 1 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'fact', value: 1 },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize loop counter "i" to 1.',
      explanationHinglish: '"i" ki value 1 set ki.',
      memorySnapshot: { n: limit, fact: 1, i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: 1 },
    });

    while (i <= limit) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if i <= n. (${i} <= ${limit}) is True.`,
        explanationHinglish: `Check kiya kya i <= n. (${i} <= ${limit}) True hai.`,
        memorySnapshot: { n: limit, fact, i },
        animationEvent: { type: 'COMPUTE', inputs: ['i', 'n'], operator: '<=', result: 'True', storeIn: 'Condition' },
      });

      const oldFact = fact;
      fact *= i;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Multiply fact by i: ${oldFact} * ${i} = ${fact}.`,
        explanationHinglish: `fact ko i se multiply kiya: ${oldFact} * ${i} = ${fact}.`,
        memorySnapshot: { n: limit, fact, i },
        animationEvent: { type: 'COMPUTE', inputs: ['fact', 'i'], operator: '*', result: fact, storeIn: 'fact' },
      });

      const oldI = i;
      i += 1;
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Increment i by 1: ${oldI} + 1 = ${i}.`,
        explanationHinglish: `i ko 1 se badhaya: ${oldI} + 1 = ${i}.`,
        memorySnapshot: { n: limit, fact, i },
        animationEvent: { type: 'COMPUTE', inputs: ['i'], operator: '+ 1', result: i, storeIn: 'i' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if i <= n. (${i} <= ${limit}) is False. Loop exits.`,
      explanationHinglish: `Check kiya kya i <= n. (${i} <= ${limit}) False hai. Loop complete.`,
      memorySnapshot: { n: limit, fact, i },
      animationEvent: { type: 'COMPUTE', inputs: ['i', 'n'], operator: '<=', result: 'False', storeIn: 'Condition' },
    });

    steps.push({
      step: steps.length + 1, lineNum: 7,
      explanationEnglish: `Print the final factorial value: ${fact}.`,
      explanationHinglish: `Final factorial print kiya: ${fact}.`,
      memorySnapshot: { n: limit, fact, i },
      consoleOutput: String(fact),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'fact', outputValue: fact },
    });

    return steps;
  },
  executionSteps: []
};
