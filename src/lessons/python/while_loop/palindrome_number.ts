import type { LessonProgram, ExecutionStep } from '../../types';

export const palindrome_number: LessonProgram = {
  id: 'palindrome_number', language: 'python', topic: 'while_loop', lessonNumber: 5,
  friendlyName: 'Palindrome Number',
  learningObjective: 'Learn how to compare modified data against its original state using while loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '121' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 8, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Palindrome"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not Palindrome"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    original: { default: 121, min: 1, max: 99999, label: 'Number' },
  },
  generateSteps: ({ original }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const origNum = Number(original);
    let n = origNum;
    let rev = 0;
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
      explanationEnglish: 'Copy original to "n" to manipulate it.',
      explanationHinglish: '"n" mein original ki copy banayi.',
      memorySnapshot: { original: origNum, n },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize "rev" to 0.',
      explanationHinglish: '"rev" ki value 0 set ki.',
      memorySnapshot: { original: origNum, n, rev },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'rev', value: 0 },
    });

    while (n > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if n > 0. (${n} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. Yeh True hai.`,
        memorySnapshot: { original: origNum, n, rev, ...(digit > 0 ? { digit } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      digit = n % 10;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Extract digit: ${n} % 10 = ${digit}.`,
        explanationHinglish: `Aakhri digit nikala: ${digit}.`,
        memorySnapshot: { original: origNum, n, rev, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '% 10', result: digit, storeIn: 'digit' },
      });

      const oldRev = rev;
      rev = rev * 10 + digit;
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Update reverse: ${oldRev} * 10 + ${digit} = ${rev}.`,
        explanationHinglish: `Reverse number update kiya: ${rev}.`,
        memorySnapshot: { original: origNum, n, rev, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['rev', 'digit'], operator: '*10 +', result: rev, storeIn: 'rev' },
      });

      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Remove digit from n: ${oldN} // 10 = ${n}.`,
        explanationHinglish: `n se digit hataya. Naya n: ${n}.`,
        memorySnapshot: { original: origNum, n, rev, digit },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 10', result: n, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if n > 0. (${n} > 0) is False. The loop exits.`,
      explanationHinglish: `Kya ${n} > 0 hai? False. Loop band ho gaya.`,
      memorySnapshot: { original: origNum, n, rev, digit },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    const isPal = origNum === rev;
    steps.push({
      step: steps.length + 1, lineNum: 8,
      explanationEnglish: `Compare original and rev: ${origNum} == ${rev} is ${isPal ? 'True' : 'False'}.`,
      explanationHinglish: `Check kiya kya original aur rev barabar hain. ${isPal ? 'True' : 'False'}.`,
      memorySnapshot: { original: origNum, n, rev, digit },
      animationEvent: { type: 'COMPUTE', inputs: ['original', 'rev'], operator: '==', result: isPal ? 'True' : 'False', storeIn: 'Condition' },
    });

    if (isPal) {
      steps.push({
        step: steps.length + 1, lineNum: 9,
        explanationEnglish: 'Print "Palindrome".',
        explanationHinglish: '"Palindrome" print kiya.',
        memorySnapshot: { original: origNum, n, rev, digit },
        consoleOutput: 'Palindrome',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Palindrome"', outputValue: 'Palindrome' },
      });
    } else {
      steps.push({
        step: steps.length + 1, lineNum: 11,
        explanationEnglish: 'Print "Not Palindrome".',
        explanationHinglish: '"Not Palindrome" print kiya.',
        memorySnapshot: { original: origNum, n, rev, digit },
        consoleOutput: 'Not Palindrome',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Not Palindrome"', outputValue: 'Not Palindrome' },
      });
    }

    return steps;
  },
  executionSteps: []
};