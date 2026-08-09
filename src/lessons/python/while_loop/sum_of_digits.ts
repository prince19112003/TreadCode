import type { LessonProgram, ExecutionStep } from '../../types';

export const sum_of_digits: LessonProgram = {
  id: 'sum_of_digits', language: 'python', topic: 'while_loop', lessonNumber: 2,
  friendlyName: 'Sum of Digits',
  learningObjective: 'Use modulo and integer division in a while loop to process individual digits.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '245' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 7, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 245, min: 1, max: 99999, label: 'Number (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let currentN = Number(n);
    let sum = 0;
    let digit = 0;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the number ${currentN} in "n".`,
      explanationHinglish: `"n" variable me ${currentN} dala.`,
      memorySnapshot: { n: currentN },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: currentN },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Initialize sum to 0.',
      explanationHinglish: '"sum" ki value 0 set ki.',
      memorySnapshot: { n: currentN, sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'sum', value: 0 },
    });

    while (currentN > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Check if n > 0. (${currentN} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. Yeh True hai.`,
        memorySnapshot: { n: currentN, sum, ...(digit > 0 ? { digit } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      digit = currentN % 10;
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Extract the last digit using modulo 10: ${currentN} % 10 = ${digit}.`,
        explanationHinglish: `Aakhri digit nikalne ke liye % 10 kiya. Digit ${digit} found hua.`,
        memorySnapshot: { n: currentN, sum, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '% 10', result: digit, storeIn: 'digit' },
      });

      const oldSum = sum;
      sum += digit;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Add the digit to sum: ${oldSum} + ${digit} = ${sum}.`,
        explanationHinglish: `Sum mein digit joda: ${oldSum} + ${digit} = ${sum}.`,
        memorySnapshot: { n: currentN, sum, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['sum', 'digit'], operator: '+', result: sum, storeIn: 'sum' },
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 10);
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Remove the last digit using integer division: ${oldN} // 10 = ${currentN}.`,
        explanationHinglish: `Aakhri digit hatane ke liye 10 se divide kiya. Naya n ${currentN} hua.`,
        memorySnapshot: { n: currentN, sum, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 10', result: currentN, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: `Check if n > 0. (${currentN} > 0) is False. The loop exits.`,
      explanationHinglish: `Kya ${currentN} > 0 hai? False. Loop yahin band ho gaya.`,
      memorySnapshot: { n: currentN, sum, digit },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    steps.push({
      step: steps.length + 1, lineNum: 7,
      explanationEnglish: `Print the final sum (${sum}).`,
      explanationHinglish: `Final sum print kiya.`,
      memorySnapshot: { n: currentN, sum, digit },
      consoleOutput: String(sum),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'sum', outputValue: sum },
    });

    return steps;
  },
  executionSteps: []
};