import type { LessonProgram, ExecutionStep } from '../../types';

export const recursive_factorial: LessonProgram = {
  id: 'recursive_factorial', language: 'python', topic: 'recursion', lessonNumber: 3,
  friendlyName: 'Factorial Using Recursion',
  learningObjective: 'Observe how recursion mathematically builds up a result (n * factorial(n-1)).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'factorial' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'prev_fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'factorial' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'prev_fact' }] },
    { lineNum: 6, tokens: [{ type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'factorial' }, { type: 'punctuation', value: '(' }, { type: 'parameter', value: '3', paramId: 'n' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 7, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 3, min: 0, max: 7, type: 'number', label: 'Input Number (n)' },
  },
  generateSteps: (values: Record<string, any> = {}): ExecutionStep[] => {
    const rawN = values?.n;
    let n = (rawN !== undefined && rawN !== null && !isNaN(Number(rawN))) ? Number(rawN) : 3;
    n = Math.max(0, Math.min(7, Math.floor(n))); // Constraint 0 to 7

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define a recursive function to compute factorial.',
        explanationHinglish: 'Factorial calculate karne ke liye recursive function define kiya.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: `Call factorial(${n}).`,
        explanationHinglish: `factorial(${n}) ko call kiya.`,
        memorySnapshot: { CallStack: `factorial(${n})` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'factorial', args: { n } },
      },
    ];

    const callChain: number[] = [];
    for (let k = n; k >= 1; k--) {
      callChain.push(k);
    }
    if (callChain.length === 0) callChain.push(0);

    let stepNum = 3;

    const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));

    let currentStack = '';
    callChain.forEach((val, idx) => {
      currentStack = currentStack ? `${currentStack} -> factorial(${val})` : `factorial(${val})`;

      steps.push({
        step: stepNum++, lineNum: 1,
        explanationEnglish: `Entered factorial with n = ${val}.`,
        explanationHinglish: `factorial function mein n = ${val} aya.`,
        memorySnapshot: { n: val, CallStack: currentStack },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: val },
      });

      const isBase = val <= 1;
      steps.push({
        step: stepNum++, lineNum: 2,
        explanationEnglish: `Check base condition: is n (${val}) <= 1? → ${isBase ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check kiya kya n (${val}) <= 1 hai? → ${isBase ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n: val, CallStack: currentStack },
        animationEvent: { type: 'COMPUTE', inputs: ['n', '1'], operator: '<=', formula: 'n <= 1', result: isBase ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (!isBase && idx < callChain.length - 1) {
        steps.push({
          step: stepNum++, lineNum: 4,
          explanationEnglish: `Call factorial(${val - 1}) recursively. (Push to Stack)`,
          explanationHinglish: `Recursion: factorial(${val - 1}) ko call kiya. (Stack Push)`,
          memorySnapshot: { n: val, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_CALL', functionName: 'factorial', args: { n: val - 1 } },
        });
      }
    });

    const baseVal = callChain[callChain.length - 1];
    const stackAtBase = callChain.map(v => `factorial(${v})`).join(' -> ');
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Base condition met for n = ${baseVal}! Return 1.`,
      explanationHinglish: `Base condition true! 1 return kiya.`,
      memorySnapshot: { n: baseVal, CallStack: stackAtBase },
      animationEvent: { type: 'COMPUTE', inputs: [], operator: 'return', result: 1, storeIn: 'ReturnValue' },
    });

    let currentRes = 1;
    for (let i = callChain.length - 2; i >= 0; i--) {
      const val = callChain[i];
      const subStack = callChain.slice(0, i + 1).map(v => `factorial(${v})`).join(' -> ');
      currentRes = val * currentRes;

      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Returned from factorial(${val - 1}) with value ${currentRes / val}.`,
        explanationHinglish: `factorial(${val - 1}) se ${currentRes / val} return aaya.`,
        memorySnapshot: { n: val, CallStack: subStack },
        animationEvent: { type: 'NONE' },
      });

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Compute ${val} * ${currentRes / val} = ${currentRes} and return it.`,
        explanationHinglish: `${val} aur ${currentRes / val} ko multiply karke ${currentRes} return kiya.`,
        memorySnapshot: { n: val, CallStack: subStack },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'factorial', returnValue: currentRes },
      });
    }

    const finalAns = fact(n);
    steps.push({
      step: stepNum++, lineNum: 6,
      explanationEnglish: `Store the final result (${finalAns}) in "ans".`,
      explanationHinglish: `Final result (${finalAns}) ko "ans" mein store kiya.`,
      memorySnapshot: { ans: finalAns },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: finalAns },
    });

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: `Print the factorial result: ${finalAns}.`,
      explanationHinglish: `Factorial print kiya: ${finalAns}.`,
      memorySnapshot: { ans: finalAns },
      consoleOutput: String(finalAns),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: finalAns },
    });

    return steps;
  },
  executionSteps: [],
};