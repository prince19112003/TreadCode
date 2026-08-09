import type { LessonProgram, ExecutionStep } from '../../types';

export const floyds_triangle: LessonProgram = {
  id: 'floyds_triangle', language: 'python', topic: 'nested_loop', lessonNumber: 5,
  friendlyName: 'Floyd\'s Triangle',
  learningObjective: 'Learn how to manage independent external state across multiple nested loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'size' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'counter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'size' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'counter' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '=' }, { type: 'string', value: '" "' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'counter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: ')' }] },
  ],
  
  editableVariables: {
    size: { default: 3, min: 1, max: 6, label: 'Rows' },
  },
  generateSteps: ({ size }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const limit = Number(size);
    let currentOutput = "";
    let num = 1;

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Set the number of rows to ${limit}.`,
      explanationHinglish: `Rows ${limit} set kiye.`,
      memorySnapshot: { size: limit },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'size', value: limit },
    });

    steps.push({
      step: steps.length + 1, lineNum: 2,
      explanationEnglish: `Initialize num to 1.`,
      explanationHinglish: `num 1 set kiya.`,
      memorySnapshot: { size: limit, num },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
    });

    for (let i = 1; i <= limit; i++) {
      steps.push({
        step: steps.length + 1, lineNum: 3,
        explanationEnglish: `Outer loop for row i = ${i}.`,
        explanationHinglish: `Outer loop row i = ${i} ke liye.`,
        memorySnapshot: { size: limit, num, i },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      for (let j = 1; j <= i; j++) {
        steps.push({
          step: steps.length + 1, lineNum: 4,
          explanationEnglish: `Inner loop for column j = ${j}.`,
          explanationHinglish: `Inner loop column j = ${j} ke liye.`,
          memorySnapshot: { size: limit, num, i, j },
          animationEvent: { type: 'CREATE_VARIABLE', name: 'j', value: j },
        });

        currentOutput += String(num) + " ";
        steps.push({
          step: steps.length + 1, lineNum: 5,
          explanationEnglish: 'Print current number.',
          explanationHinglish: 'Current number print kiya.',
          memorySnapshot: { size: limit, num, i, j },
          consoleOutput: currentOutput,
          animationEvent: { type: 'PRINT_VALUE', variableName: 'num', outputValue: num },
        });

        num++;
        steps.push({
          step: steps.length + 1, lineNum: 6,
          explanationEnglish: 'Increment num by 1.',
          explanationHinglish: 'num ko 1 se badhaya.',
          memorySnapshot: { size: limit, num, i, j },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'num', newValue: num, oldValue: num - 1 },
        });
      }

      currentOutput += "\n";
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: 'Move to the next line.',
        explanationHinglish: 'Agli line mein move hua.',
        memorySnapshot: { size: limit, num, i },
        consoleOutput: currentOutput,
        animationEvent: { type: 'PRINT_VALUE', variableName: '"\\n"', outputValue: '"\\n"' },
      });
    }
    return steps;
  },
  executionSteps: []
};