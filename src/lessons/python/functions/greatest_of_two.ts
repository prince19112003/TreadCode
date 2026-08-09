import type { LessonProgram, ExecutionStep } from '../../types';

export const greatest_of_two: LessonProgram = {
  id: 'greatest_of_two', language: 'python', topic: 'functions', lessonNumber: 6,
  friendlyName: 'Greatest of Two Numbers',
  learningObjective: 'Combine decision-making logic inside a reusable function.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'find_max' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }] },
    { lineNum: 6, tokens: [{ type: 'variable', value: 'n1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '12', paramId: 'n1' }] },
    { lineNum: 7, tokens: [{ type: 'variable', value: 'n2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '20', paramId: 'n2' }] },
    { lineNum: 8, tokens: [{ type: 'variable', value: 'maximum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'find_max' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n2' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 9, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'maximum' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n1: { default: 12, type: 'number', label: 'First Number (n1)' },
    n2: { default: 20, type: 'number', label: 'Second Number (n2)' },
  },
  generateSteps: (values: Record<string, any> = {}): ExecutionStep[] => {
    const rawN1 = values?.n1;
    const rawN2 = values?.n2;

    const a = (rawN1 !== undefined && rawN1 !== null && !isNaN(Number(rawN1))) ? Number(rawN1) : 12;
    const b = (rawN2 !== undefined && rawN2 !== null && !isNaN(Number(rawN2))) ? Number(rawN2) : 20;

    const isAGreater = a > b;
    const maximum = isAGreater ? a : b;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define find_max(a, b) — returns the larger of two numbers.',
        explanationHinglish: 'find_max(a, b) banaya — do numbers mein se bada return karta hai.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: `Set n1 = ${a}.`,
        explanationHinglish: `n1 mein ${a} dala.`,
        memorySnapshot: { n1: a },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n1', value: a },
      },
      {
        step: 3, lineNum: 7,
        explanationEnglish: `Set n2 = ${b}.`,
        explanationHinglish: `n2 mein ${b} dala.`,
        memorySnapshot: { n1: a, n2: b },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n2', value: b },
      },
      {
        step: 4, lineNum: 8,
        explanationEnglish: `Call find_max(n1, n2) — sending ${a} and ${b} into the function.`,
        explanationHinglish: `find_max(n1, n2) call kiya — ${a} aur ${b} function ko bheje.`,
        memorySnapshot: { n1: a, n2: b },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'find_max', args: { a, b } },
      },
      {
        step: 5, lineNum: 1,
        explanationEnglish: `Parameters: a = ${a}, b = ${b}. Function starts executing.`,
        explanationHinglish: `Parameters: a = ${a}, b = ${b}. Function start hua.`,
        memorySnapshot: { n1: a, n2: b, a, b },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'a', value: a }, { name: 'b', value: b }] },
      },
      {
        step: 6, lineNum: 2,
        explanationEnglish: `Check if a > b → ${a} > ${b} is ${isAGreater ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check kiya a > b → ${a} > ${b} = ${isAGreater ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n1: a, n2: b, a, b },
        animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '>', result: isAGreater ? 'True' : 'False', storeIn: 'Condition' },
      },
      ...(isAGreater
        ? [{
            step: 7, lineNum: 3,
            explanationEnglish: `Condition is TRUE. Return a (${a}).`,
            explanationHinglish: `Condition sahi hai. a (${a}) return kiya.`,
            memorySnapshot: { n1: a, n2: b, a, b },
            animationEvent: { type: 'FUNCTION_RETURN' as const, functionName: 'find_max', returnValue: a },
          }]
        : [
            {
              step: 7, lineNum: 4,
              explanationEnglish: 'Condition is FALSE. Jump to else block.',
              explanationHinglish: 'Condition galat. else block mein move hua.',
              memorySnapshot: { n1: a, n2: b, a, b },
              animationEvent: { type: 'NONE' as const },
            },
            {
              step: 8, lineNum: 5,
              explanationEnglish: `Return b (${b}).`,
              explanationHinglish: `b (${b}) return kiya.`,
              memorySnapshot: { n1: a, n2: b, a, b },
              animationEvent: { type: 'FUNCTION_RETURN' as const, functionName: 'find_max', returnValue: b },
            },
          ]
      ),
      {
        step: 9, lineNum: 8,
        explanationEnglish: `Function returned ${maximum}. Store in maximum.`,
        explanationHinglish: `Function ne ${maximum} return kiya. "maximum" mein store kiya.`,
        memorySnapshot: { n1: a, n2: b, maximum },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'maximum', value: maximum },
      },
      {
        step: 10, lineNum: 9,
        explanationEnglish: `Print maximum: ${maximum}.`,
        explanationHinglish: `Maximum value print ki: ${maximum}.`,
        memorySnapshot: { n1: a, n2: b, maximum },
        consoleOutput: String(maximum),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'maximum', outputValue: maximum },
      },
    ];
  },
  executionSteps: [],
};