import type { LessonProgram, ExecutionStep } from '../../types';

export const even_odd_func: LessonProgram = {
  id: 'even_odd_func', language: 'python', topic: 'functions', lessonNumber: 10,
  friendlyName: 'Even or Odd Using Function',
  learningObjective: 'Learn how functions can return different strings based on conditional checks.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'check_even_odd' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Even"' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Odd"' }] },
    { lineNum: 6, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '7', paramId: 'n' }] },
    { lineNum: 7, tokens: [{ type: 'variable', value: 'result' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'check_even_odd' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 8, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'result' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 7, type: 'number', label: 'Number to Check (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const num = Number(n);
    const isEven = num % 2 === 0;
    const resultVal = isEven ? '"Even"' : '"Odd"';
    const consoleVal = isEven ? 'Even' : 'Odd';
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define check_even_odd(num) — checks if a number is even or odd.',
        explanationHinglish: 'check_even_odd(num) banaya — number even hai ya odd evaluate karta hai.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: `Set n = ${num}.`,
        explanationHinglish: `n mein ${num} dala.`,
        memorySnapshot: { n: num },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: num },
      },
      {
        step: 3, lineNum: 7,
        explanationEnglish: `Call check_even_odd(n) — sending ${num} into the function.`,
        explanationHinglish: `check_even_odd(n) call kiya — ${num} function ko bheja.`,
        memorySnapshot: { n: num },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'check_even_odd', args: { num } },
      },
      {
        step: 4, lineNum: 1,
        explanationEnglish: `Parameter num receives ${num}. Function starts executing.`,
        explanationHinglish: `Parameter num mein ${num} aaya. Function start hua.`,
        memorySnapshot: { n: num, num },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
      },
      {
        step: 5, lineNum: 2,
        explanationEnglish: `Check if ${num} % 2 == 0 → ${num % 2} == 0 is ${isEven ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check: ${num} % 2 == 0 → ${num % 2} == 0 is ${isEven ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n: num, num },
        animationEvent: { type: 'COMPUTE', inputs: ['num', '2'], operator: '%==0', result: isEven ? 'True' : 'False', storeIn: 'Condition' },
      },
      ...(isEven
        ? [{
            step: 6, lineNum: 3,
            explanationEnglish: 'Condition is TRUE. Return "Even".',
            explanationHinglish: 'Condition sahi. "Even" return kiya.',
            memorySnapshot: { n: num, num },
            animationEvent: { type: 'FUNCTION_RETURN' as const, functionName: 'check_even_odd', returnValue: '"Even"' },
          }]
        : [
            {
              step: 6, lineNum: 4,
              explanationEnglish: 'Condition is FALSE. Jump to else.',
              explanationHinglish: 'Condition galat. else mein move hua.',
              memorySnapshot: { n: num, num },
              animationEvent: { type: 'NONE' as const },
            },
            {
              step: 7, lineNum: 5,
              explanationEnglish: 'Return "Odd".',
              explanationHinglish: '"Odd" return kiya.',
              memorySnapshot: { n: num, num },
              animationEvent: { type: 'FUNCTION_RETURN' as const, functionName: 'check_even_odd', returnValue: '"Odd"' },
            },
          ]
      ),
      {
        step: 8, lineNum: 7,
        explanationEnglish: `Function returned ${resultVal}. Store in result.`,
        explanationHinglish: `Function ne ${resultVal} diya. "result" mein store kiya.`,
        memorySnapshot: { n: num, result: resultVal },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'result', value: resultVal },
      },
      {
        step: 9, lineNum: 8,
        explanationEnglish: `Print result: ${consoleVal}.`,
        explanationHinglish: `Result print kiya: ${consoleVal}.`,
        memorySnapshot: { n: num, result: resultVal },
        consoleOutput: consoleVal,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: resultVal },
      },
    ];
  },
  executionSteps: [],
};