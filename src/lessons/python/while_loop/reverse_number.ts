import type { LessonProgram, ExecutionStep } from '../../types';

export const reverse_number: LessonProgram = {
  id: 'reverse_number', language: 'python', topic: 'while_loop', lessonNumber: 3,
  friendlyName: 'Reverse a Number',
  learningObjective: 'Learn to reconstruct a number backwards digit-by-digit using a while loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '835' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 7, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 835, min: 1, max: 99999, label: 'Number (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let currentN = Number(n);
    let rev = 0;
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
      explanationEnglish: 'Initialize reversed number "rev" to 0.',
      explanationHinglish: '"rev" ki value 0 set ki.',
      memorySnapshot: { n: currentN, rev },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'rev', value: 0 },
    });

    while (currentN > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Check if n > 0. (${currentN} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. Yeh True hai.`,
        memorySnapshot: { n: currentN, rev, ...(digit > 0 ? { digit } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      digit = currentN % 10;
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Extract the last digit using modulo 10: ${currentN} % 10 = ${digit}.`,
        explanationHinglish: `Aakhri digit nikalne ke liye % 10 kiya. Digit ${digit} found hua.`,
        memorySnapshot: { n: currentN, rev, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '% 10', result: digit, storeIn: 'digit' },
      });

      const oldRev = rev;
      rev = rev * 10 + digit;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Shift existing digits left (*10) and add new digit: ${oldRev} * 10 + ${digit} = ${rev}.`,
        explanationHinglish: `Purane digits ko shift kiya aur naya digit joda. Naya rev ${rev} hua.`,
        memorySnapshot: { n: currentN, rev, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['rev', 'digit'], operator: '*10 +', result: rev, storeIn: 'rev' },
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 10);
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Remove the last digit from n: ${oldN} // 10 = ${currentN}.`,
        explanationHinglish: `Aakhri digit hatane ke liye 10 se divide kiya. Naya n ${currentN} hua.`,
        memorySnapshot: { n: currentN, rev, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 10', result: currentN, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: `Check if n > 0. (${currentN} > 0) is False. The loop exits.`,
      explanationHinglish: `Kya ${currentN} > 0 hai? False. Loop yahin band ho gaya.`,
      memorySnapshot: { n: currentN, rev, digit },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    steps.push({
      step: steps.length + 1, lineNum: 7,
      explanationEnglish: `Print the final reversed number (${rev}).`,
      explanationHinglish: `Ulta number print kiya.`,
      memorySnapshot: { n: currentN, rev, digit },
      consoleOutput: String(rev),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'rev', outputValue: rev },
    });

    return steps;
  },
  executionSteps: []
};