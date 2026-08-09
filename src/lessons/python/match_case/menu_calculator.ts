import type { LessonProgram, ExecutionStep } from '../../types';

export const menu_calculator: LessonProgram = {
  id: 'menu_calculator', language: 'python', topic: 'match_case', lessonNumber: 3,
  friendlyName: 'Menu Driven Calculator',
  learningObjective: 'Use match-case to execute different mathematical operations based on a menu choice.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'choice' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"add"' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'match' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'choice' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: '"add"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: '"sub"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: '"mul"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: '"div"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: '"mod"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'keyword', value: '_' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid Choice"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    a: { default: 10, min: -9999, max: 9999, label: 'Value a' },
    b: { default: 5, min: -9999, max: 9999, label: 'Value b' },
    choice: { default: 'add', type: 'text', label: 'Operation Choice' },
  },
  generateSteps: ({ a, b, choice }): ExecutionStep[] => {
    const cleanChoice = String(choice).replace(/['"]/g, '');
    const snap1: Record<string, string | number> = { a };
    const snap2: Record<string, string | number> = { a, b };
    const snap3: Record<string, string | number> = { a, b, choice: `"${cleanChoice}"` };

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store ${a} in "a".`,
        explanationHinglish: `"a" variable me ${a} store kiya.`,
        memorySnapshot: snap1,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Store ${b} in "b".`,
        explanationHinglish: `"b" variable me ${b} store kiya.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Store operational choice "${cleanChoice}" in "choice".`,
        explanationHinglish: `Operation choice "${cleanChoice}" ko "choice" variable me store kiya.`,
        memorySnapshot: snap3,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'choice', value: `"${cleanChoice}"` },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Start matching the value of "choice" ("${cleanChoice}").`,
        explanationHinglish: `Choice ko match karna start kiya.`,
        memorySnapshot: snap3,
        animationEvent: { type: 'MATCH_START', variableName: 'choice', value: `"${cleanChoice}"` },
      },
    ];

    const operationMap: Record<string, { opName: string; line: number; caseLine: number; calc: () => number; operatorChar: string }> = {
      add: { opName: 'Addition', line: 6, caseLine: 5, calc: () => a + b, operatorChar: '+' },
      sub: { opName: 'Subtraction', line: 8, caseLine: 7, calc: () => a - b, operatorChar: '-' },
      mul: { opName: 'Multiplication', line: 10, caseLine: 9, calc: () => a * b, operatorChar: '*' },
      div: { opName: 'Division', line: 12, caseLine: 11, calc: () => b !== 0 ? Math.round((a / b) * 100) / 100 : 0, operatorChar: '/' },
      mod: { opName: 'Modulo', line: 14, caseLine: 13, calc: () => b !== 0 ? a % b : 0, operatorChar: '%' },
    };

    const keys = ['add', 'sub', 'mul', 'div', 'mod'];
    let matchedKey: string | null = null;

    for (const key of keys) {
      if (cleanChoice === key) {
        matchedKey = key;
        steps.push({
          step: steps.length + 1, lineNum: operationMap[key].caseLine,
          explanationEnglish: `Choice is "${key}", so case "${key}" matches!`,
          explanationHinglish: `Choice "${key}" hai, isliye case "${key}" match ho gaya!`,
          memorySnapshot: snap3,
          animationEvent: { type: 'COMPUTE', inputs: ['choice'], operator: `== "${key}"`, result: 'True', storeIn: 'Condition' },
        });
        break;
      } else {
        steps.push({
          step: steps.length + 1, lineNum: operationMap[key].caseLine,
          explanationEnglish: `Choice is not "${key}", checking next case.`,
          explanationHinglish: `Choice "${key}" nahi hai, agla case check karenge.`,
          memorySnapshot: snap3,
          animationEvent: { type: 'COMPUTE', inputs: ['choice'], operator: `== "${key}"`, result: 'False', storeIn: 'Condition' },
        });
      }
    }

    if (matchedKey) {
      const op = operationMap[matchedKey];
      const res = op.calc();
      steps.push({
        step: steps.length + 1, lineNum: op.line,
        explanationEnglish: `Perform dynamic ${op.opName.toLowerCase()}: a ${op.operatorChar} b = ${a} ${op.operatorChar} ${b} = ${res}.`,
        explanationHinglish: `${op.opName} kiya: a ${op.operatorChar} b = ${a} ${op.operatorChar} ${b} = ${res}.`,
        memorySnapshot: snap3,
        consoleOutput: String(res),
        animationEvent: { type: 'PRINT_VALUE', variableName: `a ${op.operatorChar} b`, outputValue: res },
      });
    } else {
      steps.push(
        {
          step: steps.length + 1, lineNum: 15,
          explanationEnglish: 'No cases matched, jump to default case (_).',
          explanationHinglish: 'Koi case match nahi hua, default (_) case par jump kiya.',
          memorySnapshot: snap3,
          animationEvent: { type: 'COMPUTE', inputs: ['choice'], operator: '== default', result: 'True', storeIn: 'Condition' },
        },
        {
          step: steps.length + 1, lineNum: 16,
          explanationEnglish: 'Print "Invalid Choice".',
          explanationHinglish: '"Invalid Choice" default message print kiya.',
          memorySnapshot: snap3,
          consoleOutput: 'Invalid Choice',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Invalid Choice"', outputValue: 'Invalid Choice' },
        }
      );
    }

    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store 10 in "a".',
      explanationHinglish: '"a" variable me 10 store kiya.',
      memorySnapshot: { a: 10 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: 10 },
    },
  ],
};
