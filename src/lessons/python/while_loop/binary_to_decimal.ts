import type { LessonProgram, ExecutionStep } from '../../types';

export const binary_to_decimal: LessonProgram = {
  id: 'binary_to_decimal',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 10,
  friendlyName: 'Binary to Decimal',
  learningObjective: 'Learn how to convert binary to decimal using modulo and powers of 2.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1010' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'dec' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'base' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'dec' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'base' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'base' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 9, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'dec' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 1010, min: 0, max: 11111111, label: 'Binary Number' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const initialN = Number(n);
    let currentN = initialN;
    let dec = 0;
    let base = 1;
    let rem = 0;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the binary number ${initialN} in "n".`,
      explanationHinglish: `"n" variable me ${initialN} dala.`,
      memorySnapshot: { n: initialN },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: initialN },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Initialize "dec" to 0.',
      explanationHinglish: '"dec" ki value 0 set ki.',
      memorySnapshot: { n: initialN, dec: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'dec', value: 0 },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize "base" to 1 (representing 2^0).',
      explanationHinglish: '"base" ki value 1 set ki.',
      memorySnapshot: { n: initialN, dec: 0, base: 1 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'base', value: 1 },
    });

    while (currentN > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if n > 0. (${currentN} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. (${currentN} > 0) True hai.`,
        memorySnapshot: { n: currentN, dec, base, ...(steps.length > 3 ? { rem } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      rem = currentN % 10;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Get the last binary digit: ${currentN} % 10 = ${rem}.`,
        explanationHinglish: `Aakhri digit nikala: ${rem}.`,
        memorySnapshot: { n: currentN, dec, base, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '% 10', result: rem, storeIn: 'rem' },
      });

      const oldDec = dec;
      dec += rem * base;
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Add value to decimal: ${oldDec} + (${rem} * ${base}) = ${dec}.`,
        explanationHinglish: `dec update kiya: ${oldDec} + (${rem} * ${base}) = ${dec}.`,
        memorySnapshot: { n: currentN, dec, base, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['dec', 'rem', 'base'], operator: '+ *', result: dec, storeIn: 'dec' },
      });

      const oldBase = base;
      base *= 2;
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Multiply base power of 2: ${oldBase} * 2 = ${base}.`,
        explanationHinglish: `base update kiya: ${oldBase} * 2 = ${base}.`,
        memorySnapshot: { n: currentN, dec, base, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['base'], operator: '* 2', result: base, storeIn: 'base' },
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 10);
      steps.push({
        step: steps.length + 1, lineNum: 8,
        explanationEnglish: `Remove last binary digit: ${oldN} // 10 = ${currentN}.`,
        explanationHinglish: `n se aakhri digit hataya: ${currentN}.`,
        memorySnapshot: { n: currentN, dec, base, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 10', result: currentN, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if n > 0. (${currentN} > 0) is False. Loop exits.`,
      explanationHinglish: `Check kiya kya n > 0. (${currentN} > 0) False hai. Loop complete.`,
      memorySnapshot: { n: currentN, dec, base, rem },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    steps.push({
      step: steps.length + 1, lineNum: 9,
      explanationEnglish: `Print the final decimal value: ${dec}.`,
      explanationHinglish: `Final decimal print kiya: ${dec}.`,
      memorySnapshot: { n: currentN, dec, base, rem },
      consoleOutput: String(dec),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'dec', outputValue: dec },
    });

    return steps;
  },
  executionSteps: []
};