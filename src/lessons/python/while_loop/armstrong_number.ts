import type { LessonProgram, ExecutionStep } from '../../types';

export const armstrong_number: LessonProgram = {
  id: 'armstrong_number',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 6,
  friendlyName: 'Armstrong Number',
  learningObjective: 'Learn how to process digits and calculate complex sums in a loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '153' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '**' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 8, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Armstrong"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    original: { default: 153, min: 1, max: 9999, label: 'Number' },
  },
  generateSteps: ({ original }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const origNum = Number(original);
    let n = origNum;
    let sum = 0;
    let digit = 0;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the number ${origNum} in "original".`,
      explanationHinglish: `"original" variable me ${origNum} dala.`,
      memorySnapshot: { original: origNum },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'original', value: origNum },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Copy original to "n".',
      explanationHinglish: '"n" mein original ki copy banayi.',
      memorySnapshot: { original: origNum, n },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize "sum" to 0.',
      explanationHinglish: '"sum" ki value 0 set ki.',
      memorySnapshot: { original: origNum, n, sum },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'sum', value: 0 },
    });

    while (n > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if n > 0. (${n} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. Yeh True hai.`,
        memorySnapshot: { original: origNum, n, sum, ...(digit > 0 ? { digit } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      digit = n % 10;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Extract digit: ${n} % 10 = ${digit}.`,
        explanationHinglish: `Aakhri digit nikala: ${digit}.`,
        memorySnapshot: { original: origNum, n, sum, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '% 10', result: digit, storeIn: 'digit' },
      });

      const oldSum = sum;
      sum += Math.pow(digit, 3);
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Add cube of digit to sum: ${oldSum} + (${digit}^3) = ${sum}.`,
        explanationHinglish: `Digit ka cube sum mein joda: ${sum}.`,
        memorySnapshot: { original: origNum, n, sum, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['sum', 'digit'], operator: '+ digit**3', result: sum, storeIn: 'sum' },
      });

      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Remove digit from n: ${oldN} // 10 = ${n}.`,
        explanationHinglish: `n se digit hataya. Naya n: ${n}.`,
        memorySnapshot: { original: origNum, n, sum, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 10', result: n, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if n > 0. (${n} > 0) is False. The loop exits.`,
      explanationHinglish: `Kya ${n} > 0 hai? False. Loop band ho gaya.`,
      memorySnapshot: { original: origNum, n, sum, digit },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    const isArm = origNum === sum;
    steps.push({
      step: steps.length + 1, lineNum: 8,
      explanationEnglish: `Compare original and sum: ${origNum} == ${sum} is ${isArm ? 'True' : 'False'}.`,
      explanationHinglish: `Check kiya kya original aur sum barabar hain. ${isArm ? 'True' : 'False'}.`,
      memorySnapshot: { original: origNum, n, sum, digit },
      animationEvent: { type: 'COMPUTE', inputs: ['original', 'sum'], operator: '==', result: isArm ? 'True' : 'False', storeIn: 'Condition' },
    });

    if (isArm) {
      steps.push({
        step: steps.length + 1, lineNum: 9,
        explanationEnglish: 'Print "Armstrong".',
        explanationHinglish: '"Armstrong" print kiya.',
        memorySnapshot: { original: origNum, n, sum, digit },
        consoleOutput: 'Armstrong',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Armstrong"', outputValue: 'Armstrong' },
      });
    }

    return steps;
  },
  executionSteps: []
};