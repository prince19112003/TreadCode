import type { LessonProgram, ExecutionStep } from '../../types';

export const strong_number: LessonProgram = {
  id: 'strong_number',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 8,
  friendlyName: 'Strong Number Check',
  learningObjective: 'Learn how to extract digits and calculate factorial sum to check Strong Number.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '145' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'd' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'f' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'comment', value: '# assume factorial calculation here' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'f' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Strong Number"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 145, min: 1, max: 9999, label: 'Number (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const limit = Number(n);
    let temp = limit;
    let sum = 0;
    let d = 0;
    let f = 1;

    const getFactorial = (num: number): number => {
      let fact = 1;
      for (let i = 1; i <= num; i++) fact *= i;
      return fact;
    };

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the number ${limit} in "n".`,
      explanationHinglish: `"n" variable me ${limit} dala.`,
      memorySnapshot: { n: limit },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: limit },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Copy n to "temp".',
      explanationHinglish: '"temp" mein n ki copy banayi.',
      memorySnapshot: { n: limit, temp },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'temp', value: temp },
    });

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: 'Initialize "sum" to 0.',
      explanationHinglish: '"sum" ki value 0 set ki.',
      memorySnapshot: { n: limit, temp, sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'sum', value: 0 },
    });

    while (temp > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Check if temp > 0. (${temp} > 0) is True.`,
        explanationHinglish: `Check kiya kya temp > 0. (${temp} > 0) True hai.`,
        memorySnapshot: { n: limit, temp, sum, ...(d > 0 ? { d, f } : {}) },
        animationEvent: { type: 'COMPUTE', inputs: ['temp'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      d = temp % 10;
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Extract digit: ${temp} % 10 = ${d}.`,
        explanationHinglish: `Aakhri digit nikala: ${d}.`,
        memorySnapshot: { n: limit, temp, sum, d },
        animationEvent: { type: 'COMPUTE', inputs: ['temp'], operator: '% 10', result: d, storeIn: 'd' },
      });

      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: 'Initialize factorial helper "f" to 1.',
        explanationHinglish: 'Factorial helper "f" ko 1 set kiya.',
        memorySnapshot: { n: limit, temp, sum, d, f: 1 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'f', value: 1 },
      });

      f = getFactorial(d);
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Calculate factorial: ${d}! = ${f}.`,
        explanationHinglish: `Factorial nikala: ${d}! = ${f}.`,
        memorySnapshot: { n: limit, temp, sum, d, f },
        animationEvent: { type: 'COMPUTE', inputs: ['d'], operator: '!', result: f, storeIn: 'f' },
      });

      const oldSum = sum;
      sum += f;
      steps.push({
        step: steps.length + 1, lineNum: 8,
        explanationEnglish: `Add factorial to sum: ${oldSum} + ${f} = ${sum}.`,
        explanationHinglish: `sum mein factorial joda: ${oldSum} + ${f} = ${sum}.`,
        memorySnapshot: { n: limit, temp, sum, d, f },
        animationEvent: { type: 'COMPUTE', inputs: ['sum', 'f'], operator: '+', result: sum, storeIn: 'sum' },
      });

      const oldTemp = temp;
      temp = Math.floor(temp / 10);
      steps.push({
        step: steps.length + 1, lineNum: 9,
        explanationEnglish: `Remove last digit: ${oldTemp} // 10 = ${temp}.`,
        explanationHinglish: `temp se aakhri digit hataya: ${temp}.`,
        memorySnapshot: { n: limit, temp, sum, d, f },
        animationEvent: { type: 'COMPUTE', inputs: ['temp'], operator: '// 10', result: temp, storeIn: 'temp' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 4,
      explanationEnglish: `Check if temp > 0. (${temp} > 0) is False. Loop exits.`,
      explanationHinglish: `Check kiya kya temp > 0. (${temp} > 0) False hai. Loop complete.`,
      memorySnapshot: { n: limit, temp, sum, d, f },
      animationEvent: { type: 'COMPUTE', inputs: ['temp'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    const isStrong = sum === limit;
    steps.push({
      step: steps.length + 1, lineNum: 10,
      explanationEnglish: `Check if sum == n: ${sum} == ${limit} is ${isStrong ? 'True' : 'False'}.`,
      explanationHinglish: `Check kiya kya sum == n: ${sum} == ${limit} Yeh ${isStrong ? 'True' : 'False'} hai.`,
      memorySnapshot: { n: limit, temp, sum, d, f },
      animationEvent: { type: 'COMPUTE', inputs: ['sum', 'n'], operator: '==', result: isStrong ? 'True' : 'False', storeIn: 'Condition' },
    });

    if (isStrong) {
      steps.push({
        step: steps.length + 1, lineNum: 11,
        explanationEnglish: 'Print "Strong Number".',
        explanationHinglish: '"Strong Number" print kiya.',
        memorySnapshot: { n: limit, temp, sum, d, f },
        consoleOutput: 'Strong Number',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Strong Number"', outputValue: 'Strong Number' },
      });
    }

    return steps;
  },
  executionSteps: []
};