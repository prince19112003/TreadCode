import type { LessonProgram, ExecutionStep } from '../../types';

export const count_digits: LessonProgram = {
  id: 'count_digits',
  language: 'python',
  topic: 'while_loop',
  lessonNumber: 4,
  friendlyName: 'Count Digits',
  learningObjective: 'Learn how to use a while loop as a simple counter.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2048' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 6, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    n: { default: 2048, min: 0, max: 99999, label: 'Number (n)' },
  },
  generateSteps: ({ n }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let currentN = Number(n);
    let count = 0;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Store the number ${currentN} in "n".`,
      explanationHinglish: `"n" variable me ${currentN} dala.`,
      memorySnapshot: { n: currentN },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: currentN },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: 'Initialize count to 0.',
      explanationHinglish: '"count" ki value 0 set ki.',
      memorySnapshot: { n: currentN, count: 0 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'count', value: 0 },
    });

    // Special case for n = 0: while currentN > 0 won't execute, but we still run standard logic
    while (currentN > 0) {
      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Check if n > 0. (${currentN} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. Yeh True hai.`,
        memorySnapshot: { n: currentN, count },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' },
      });

      const oldCount = count;
      count += 1;
      steps.push({
        step: steps.length + 1, lineNum: 4,
        explanationEnglish: `Increase count by 1: ${oldCount} + 1 = ${count}.`,
        explanationHinglish: `Count badhaya: ${oldCount} + 1 = ${count}.`,
        memorySnapshot: { n: currentN, count },
        animationEvent: { type: 'COMPUTE', inputs: ['count'], operator: '+ 1', result: count, storeIn: 'count' },
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 10);
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Remove the last digit from n: ${oldN} // 10 = ${currentN}.`,
        explanationHinglish: `Aakhri digit hatane ke liye 10 se divide kiya. Naya n ${currentN} hua.`,
        memorySnapshot: { n: currentN, count },
        animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '// 10', result: currentN, storeIn: 'n' },
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 3,
      explanationEnglish: `Check if n > 0. (${currentN} > 0) is False. The loop exits.`,
      explanationHinglish: `Kya ${currentN} > 0 hai? False. Loop yahin band ho gaya.`,
      memorySnapshot: { n: currentN, count },
      animationEvent: { type: 'COMPUTE', inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' },
    });

    steps.push({
      step: steps.length + 1, lineNum: 6,
      explanationEnglish: `Print the final count (${count}).`,
      explanationHinglish: `Final count print kiya.`,
      memorySnapshot: { n: currentN, count },
      consoleOutput: String(count),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'count', outputValue: count },
    });

    return steps;
  },
  executionSteps: []
};