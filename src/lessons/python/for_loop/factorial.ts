import type { LessonProgram, ExecutionStep } from '../../types';

export const factorial: LessonProgram = {
  id: 'factorial', language: 'python', topic: 'for_loop', lessonNumber: 4,
  friendlyName: 'Factorial of a Number',
  learningObjective: 'Understand how to use an accumulator variable with multiplication.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }] },
    { lineNum: 5, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'fact' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 10, label: 'Value of n' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let fact = 1;
    
    // Step 1: Initialize fact
    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: 'Create a variable "fact" to hold the multiplication result, starting at 1.',
      explanationHinglish: 'Result store karne ke liye "fact" variable declare kiya, shuruwat 1 se ki.',
      memorySnapshot: { fact },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'fact', value: fact },
    });

    // Step 2: Initialize n
    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: `Store the number to find factorial of in "n" (${n}).`,
      explanationHinglish: `"n" variable me ${n} dala.`,
      memorySnapshot: { fact, n },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n },
    });

    // Loop iterations
    for (let i = 1; i <= Number(n); i++) {
      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Loop starts for i = ${i}.`,
        explanationHinglish: `Loop i = ${i} ke liye chalu hua.`,
        memorySnapshot: { fact, n, i },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      const oldFact = fact;
      fact *= i;

      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Multiply fact by ${i}. ${oldFact} * ${i} = ${fact}.`,
        explanationHinglish: `fact ko ${i} se multiply kiya. Naya fact ${fact} hua.`,
        memorySnapshot: { fact, n, i },
        animationEvent: { type: 'COMPUTE', inputs: ['fact', 'i'], operator: '*', result: fact, storeIn: 'fact' },
      });
    }

    // Print step
    steps.push({
      step: steps.length + 1, lineNum: 5,
      explanationEnglish: 'The loop ends. Print the final factorial result.',
      explanationHinglish: 'Loop complete hua. Final factorial print kiya.',
      memorySnapshot: { fact, n, i: Number(n) },
      consoleOutput: String(fact),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'fact', outputValue: fact },
    });

    return steps;
  },
  executionSteps: []
};