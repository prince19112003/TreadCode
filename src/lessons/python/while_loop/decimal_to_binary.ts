import type { LessonProgram, ExecutionStep } from '../../types';

export const decimal_to_binary: LessonProgram = {
  id: 'decimal_to_binary',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 9,
  friendlyName: 'Decimal to Binary',
  learningObjective: 'Learn how to convert decimal to binary using division by 2 in a while loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'bin' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'place' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'bin' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'place' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'place' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }] },
    { lineNum: 9, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'bin' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 10, min: 0, max: 255, label: 'Decimal Number' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const initialN = Number(n);
    let currentN = initialN;
    let bin = 0;
    let place = 1;
    let rem = 0;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the number ${initialN} in "n".`,
      explanationHinglish: `"n" variable me ${initialN} dala.`,
      memorySnapshot: { n: initialN },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: initialN },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Initialize "bin" to 0.',
      explanationHinglish: '"bin" ki value 0 set ki.',
      memorySnapshot: { n: initialN, bin: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'bin', value: 0 },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize "place" to 1.',
      explanationHinglish: '"place" ki value 1 set ki.',
      memorySnapshot: { n: initialN, bin: 0, place: 1 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'place', value: 1 },
    });

    while (currentN > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if n > 0. (${currentN} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. (${currentN} > 0) True hai.`,
        memorySnapshot: { n: currentN, bin, place, ...(steps.length > 3 ? { rem } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      rem = currentN % 2;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Find remainder by 2: ${currentN} % 2 = ${rem}.`,
        explanationHinglish: `2 se remainder nikala: ${rem}.`,
        memorySnapshot: { n: currentN, bin, place, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '% 2', result: rem, storeIn: 'rem' },
      });

      const oldBin = bin;
      bin += rem * place;
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Update binary string value: ${oldBin} + (${rem} * ${place}) = ${bin}.`,
        explanationHinglish: `bin update kiya: ${oldBin} + (${rem} * ${place}) = ${bin}.`,
        memorySnapshot: { n: currentN, bin, place, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['bin', 'rem', 'place'], operator: '+ *', result: bin, storeIn: 'bin' },
      });

      const oldPlace = place;
      place *= 10;
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Shift place value: ${oldPlace} * 10 = ${place}.`,
        explanationHinglish: `place badhaya: ${oldPlace} * 10 = ${place}.`,
        memorySnapshot: { n: currentN, bin, place, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['place'], operator: '* 10', result: place, storeIn: 'place' },
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 2);
      steps.push({
        step: steps.length + 1, lineNum: 8,
        explanationEnglish: `Divide n by 2: ${oldN} // 2 = ${currentN}.`,
        explanationHinglish: `n ko 2 se divide kiya: ${currentN}.`,
        memorySnapshot: { n: currentN, bin, place, rem },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 2', result: currentN, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if n > 0. (${currentN} > 0) is False. Loop exits.`,
      explanationHinglish: `Check kiya kya n > 0. (${currentN} > 0) False hai. Loop complete.`,
      memorySnapshot: { n: currentN, bin, place, rem },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    steps.push({
      step: steps.length + 1, lineNum: 9,
      explanationEnglish: `Print the final binary value: ${bin}.`,
      explanationHinglish: `Final binary print kiya: ${bin}.`,
      memorySnapshot: { n: currentN, bin, place, rem },
      consoleOutput: String(bin),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'bin', outputValue: bin },
    });

    return steps;
  },
  executionSteps: []
};