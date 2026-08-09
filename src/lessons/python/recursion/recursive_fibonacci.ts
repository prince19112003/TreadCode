import type { LessonProgram, ExecutionStep } from '../../types';

export const recursive_fibonacci: LessonProgram = {
  id: 'recursive_fibonacci', language: 'python', topic: 'recursion', lessonNumber: 4,
  friendlyName: 'Fibonacci Series Using Recursion',
  learningObjective: 'Understand how recursion generates each term of the Fibonacci Series.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'variable', value: 'terms' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '5', paramId: 'n' }] },
    { lineNum: 6, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'terms' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 10, type: 'number', label: 'Number of Terms (n)' },
  },
  generateSteps: (values: Record<string, any> = {}): ExecutionStep[] => {
    const rawN = values?.n;
    let terms = (rawN !== undefined && rawN !== null && !isNaN(Number(rawN))) ? Number(rawN) : 5;
    terms = Math.max(1, Math.min(10, Math.floor(terms))); // Constraint 1 to 10 terms

    const fibCalc = (k: number): number => (k <= 1 ? k : fibCalc(k - 1) + fibCalc(k - 2));

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define a recursive function to compute the nth Fibonacci number.',
        explanationHinglish: 'Fibonacci series ka nth term calculate karne ke liye recursive function define kiya.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: `Initialize terms = ${terms}.`,
        explanationHinglish: `terms = ${terms} set kiya (hum ${terms} terms print karenge).`,
        memorySnapshot: { terms },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'terms', value: terms },
      },
    ];

    let stepCount = 3;
    const printedSeries: number[] = [];

    for (let i = 0; i < terms; i++) {
      steps.push({
        step: stepCount++, lineNum: 6,
        explanationEnglish: `Loop iteration i = ${i}: Generating term ${i + 1} of Fibonacci series.`,
        explanationHinglish: `Loop i = ${i}: Fibonacci series ka term ${i + 1} generate karne ja rahe hain.`,
        memorySnapshot: { terms, i },
        animationEvent: i === 0
          ? { type: 'CREATE_VARIABLE', name: 'i', value: i }
          : { type: 'UPDATE_VARIABLE', name: 'i', oldValue: i - 1, newValue: i },
      });

      steps.push({
        step: stepCount++, lineNum: 7,
        explanationEnglish: `Call fib(${i}) recursively to compute value for i = ${i}.`,
        explanationHinglish: `fib(${i}) call kiya index ${i} ke liye value nikalne.`,
        memorySnapshot: { terms, i, CallStack: `fib(${i})` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'fib', args: { n: i } },
      });

      // Helper function to build recursive call tree execution steps for fib(k)
      const solveFib = (k: number, stackPath: string): number => {
        const currentStack = stackPath ? `${stackPath} -> fib(${k})` : `fib(${k})`;

        steps.push({
          step: stepCount++, lineNum: 1,
          explanationEnglish: `Entered fib with n = ${k}.`,
          explanationHinglish: `fib function mein n = ${k} aya.`,
          memorySnapshot: { terms, i, n: k, CallStack: currentStack },
          animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: k },
        });

        const isBase = k <= 1;
        steps.push({
          step: stepCount++, lineNum: 2,
          explanationEnglish: `Check base condition: is n (${k}) <= 1? → ${isBase ? 'TRUE' : 'FALSE'}.`,
          explanationHinglish: `Check kiya kya n (${k}) <= 1 hai? → ${isBase ? 'SAHI' : 'GALAT'}.`,
          memorySnapshot: { terms, i, n: k, CallStack: currentStack },
          animationEvent: { type: 'COMPUTE', inputs: ['n', '1'], operator: '<=', formula: 'n <= 1', result: isBase ? 'True' : 'False', storeIn: 'Condition' },
        });

        if (isBase) {
          steps.push({
            step: stepCount++, lineNum: 3,
            explanationEnglish: `Base condition met! Return ${k}.`,
            explanationHinglish: `Base condition true! ${k} return kiya.`,
            memorySnapshot: { terms, i, n: k, CallStack: currentStack },
            animationEvent: { type: 'FUNCTION_RETURN', functionName: 'fib', returnValue: k },
          });
          return k;
        }

        // Left branch fib(k-1)
        steps.push({
          step: stepCount++, lineNum: 4,
          explanationEnglish: `Call fib(${k - 1}) recursively. (Left Branch Push)`,
          explanationHinglish: `Left branch ke liye fib(${k - 1}) ko call kiya. (Stack Push)`,
          memorySnapshot: { terms, i, n: k, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_CALL', functionName: 'fib', args: { n: k - 1 } },
        });

        const leftVal = solveFib(k - 1, currentStack);

        // Right branch fib(k-2)
        steps.push({
          step: stepCount++, lineNum: 4,
          explanationEnglish: `Call fib(${k - 2}) recursively. (Right Branch Push)`,
          explanationHinglish: `Right branch ke liye fib(${k - 2}) ko call kiya. (Stack Push)`,
          memorySnapshot: { terms, i, n: k, left_val: leftVal, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_CALL', functionName: 'fib', args: { n: k - 2 } },
        });

        const rightVal = solveFib(k - 2, currentStack);

        const totalVal = leftVal + rightVal;
        steps.push({
          step: stepCount++, lineNum: 4,
          explanationEnglish: `Compute ${leftVal} + ${rightVal} = ${totalVal} and return it.`,
          explanationHinglish: `${leftVal} aur ${rightVal} ko add karke ${totalVal} return kiya.`,
          memorySnapshot: { terms, i, n: k, left_val: leftVal, right_val: rightVal, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_RETURN', functionName: 'fib', returnValue: totalVal },
        });

        return totalVal;
      };

      const termVal = solveFib(i, '');
      printedSeries.push(termVal);

      steps.push({
        step: stepCount++, lineNum: 7,
        explanationEnglish: `Print term ${i + 1} of Fibonacci series: ${termVal}.`,
        explanationHinglish: `Fibonacci series ka term ${i + 1} (${termVal}) print kiya.`,
        memorySnapshot: { terms, i, termVal },
        consoleOutput: printedSeries.join('\n'),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'series_term', outputValue: termVal },
      });
    }

    return steps;
  },
  executionSteps: [],
};