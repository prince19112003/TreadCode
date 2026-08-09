import type { LessonProgram, ExecutionStep } from '../../types';

export const largest_of_three: LessonProgram = {
  id: 'largest_of_three', language: 'python', topic: 'functions', lessonNumber: 11,
  friendlyName: 'Largest of Three Numbers Using Function',
  learningObjective: 'Learn to use if-elif-else statements inside a function and return the correct result.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'find_largest' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'and' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'and' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }] },
    { lineNum: 8, tokens: [{ type: 'variable', value: 'n1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '10', paramId: 'n1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '25', paramId: 'n2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n3' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '15', paramId: 'n3' }] },
    { lineNum: 9, tokens: [{ type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'find_largest' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n3' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 10, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n1: { default: 10, type: 'number', label: 'First Number (n1)' },
    n2: { default: 25, type: 'number', label: 'Second Number (n2)' },
    n3: { default: 15, type: 'number', label: 'Third Number (n3)' },
  },
  generateSteps: (values: Record<string, any> = {}): ExecutionStep[] => {
    const rawN1 = values?.n1;
    const rawN2 = values?.n2;
    const rawN3 = values?.n3;

    const a = (rawN1 !== undefined && rawN1 !== null && !isNaN(Number(rawN1))) ? Number(rawN1) : 10;
    const b = (rawN2 !== undefined && rawN2 !== null && !isNaN(Number(rawN2))) ? Number(rawN2) : 25;
    const c = (rawN3 !== undefined && rawN3 !== null && !isNaN(Number(rawN3))) ? Number(rawN3) : 15;

    const isFirstLargest = a >= b && a >= c;
    const isSecondLargest = !isFirstLargest && (b >= a && b >= c);
    const largest = isFirstLargest ? a : (isSecondLargest ? b : c);

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define find_largest(a, b, c) — returns the largest of three numbers.',
        explanationHinglish: 'find_largest(a, b, c) function banaya — teen numbers mein se sabse bada return karta hai.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 8,
        explanationEnglish: `Set n1 = ${a}, n2 = ${b}, n3 = ${c}.`,
        explanationHinglish: `n1=${a}, n2=${b}, n3=${c} initialize kiye.`,
        memorySnapshot: { n1: a, n2: b, n3: c },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'n1', value: a }, { name: 'n2', value: b }, { name: 'n3', value: c }] },
      },
      {
        step: 3, lineNum: 9,
        explanationEnglish: `Call find_largest(n1, n2, n3) — sending ${a}, ${b}, ${c} into the function.`,
        explanationHinglish: `find_largest(${a}, ${b}, ${c}) call kiya. Control line 1 par jump hua.`,
        memorySnapshot: { n1: a, n2: b, n3: c },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'find_largest', args: { a, b, c } },
      },
      {
        step: 4, lineNum: 1,
        explanationEnglish: `Parameters receive: a = ${a}, b = ${b}, c = ${c}. Function starts executing.`,
        explanationHinglish: `Parameters mein values aayi: a = ${a}, b = ${b}, c = ${c}. Function start hua.`,
        memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'a', value: a }, { name: 'b', value: b }, { name: 'c', value: c }] },
      },
      {
        step: 5, lineNum: 2,
        explanationEnglish: `Check if a (${a}) >= b (${b}) and a (${a}) >= c (${c}) → ${isFirstLargest ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check: a (${a}) >= b (${b}) aur a (${a}) >= c (${c}) → ${isFirstLargest ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
        animationEvent: { type: 'COMPUTE', inputs: ['a', 'b', 'c'], operator: '>=', formula: 'a >= b and a >= c', result: isFirstLargest ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isFirstLargest) {
      steps.push({
        step: 6, lineNum: 3,
        explanationEnglish: `Condition is TRUE. Return a (${a}).`,
        explanationHinglish: `Condition sahi hai. a (${a}) return kiya.`,
        memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'find_largest', returnValue: a },
      });
    } else {
      steps.push({
        step: 6, lineNum: 4,
        explanationEnglish: `Check elif: b (${b}) >= a (${a}) and b (${b}) >= c (${c}) → ${isSecondLargest ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Elif check: b (${b}) >= a (${a}) aur b (${b}) >= c (${c}) → ${isSecondLargest ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
        animationEvent: { type: 'COMPUTE', inputs: ['b', 'a', 'c'], operator: '>=', formula: 'b >= a and b >= c', result: isSecondLargest ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isSecondLargest) {
        steps.push({
          step: 7, lineNum: 5,
          explanationEnglish: `Condition is TRUE. Return b (${b}).`,
          explanationHinglish: `Condition sahi hai. b (${b}) return kiya.`,
          memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
          animationEvent: { type: 'FUNCTION_RETURN', functionName: 'find_largest', returnValue: b },
        });
      } else {
        steps.push({
          step: 7, lineNum: 6,
          explanationEnglish: 'First two conditions are FALSE. Jump to else block.',
          explanationHinglish: 'Dono conditions galat. else block mein move hua.',
          memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
          animationEvent: { type: 'NONE' },
        });
        steps.push({
          step: 8, lineNum: 7,
          explanationEnglish: `Return c (${c}).`,
          explanationHinglish: `c (${c}) return kiya.`,
          memorySnapshot: { n1: a, n2: b, n3: c, a, b, c },
          animationEvent: { type: 'FUNCTION_RETURN', functionName: 'find_largest', returnValue: c },
        });
      }
    }

    const currentStepNum = steps.length + 1;
    steps.push({
      step: currentStepNum, lineNum: 9,
      explanationEnglish: `Function returned ${largest}. Store in ans.`,
      explanationHinglish: `Function ne ${largest} return kiya. "ans" mein store kiya.`,
      memorySnapshot: { n1: a, n2: b, n3: c, ans: largest },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: largest },
    });

    steps.push({
      step: currentStepNum + 1, lineNum: 10,
      explanationEnglish: `Print ans: ${largest}.`,
      explanationHinglish: `Ans print kiya: ${largest}.`,
      memorySnapshot: { n1: a, n2: b, n3: c, ans: largest },
      consoleOutput: String(largest),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: largest },
    });

    return steps;
  },
  executionSteps: [],
};