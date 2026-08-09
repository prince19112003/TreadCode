import type { LessonProgram, ExecutionStep } from '../../types';

export const inverted_triangle: LessonProgram = {
  id: 'inverted_triangle', language: 'python', topic: 'nested_loop', lessonNumber: 3,
  friendlyName: 'Inverted Triangle Pattern',
  learningObjective: 'Learn how combining a reverse outer loop and dynamic inner loop creates inverted patterns.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'size' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'size' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"*"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '=' }, { type: 'string', value: '" "' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: ')' }] },
  ],
  
  editableVariables: {
    size: { default: 3, min: 1, max: 6, label: 'Size' },
  },
  generateSteps: ({ size }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const limit = Number(size);
    let currentOutput = "";

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Set the size to ${limit}.`,
      explanationHinglish: `Size ${limit} set kiya.`,
      memorySnapshot: { size: limit },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'size', value: limit },
    });

    for (let i = limit; i >= 1; i--) {
      steps.push({
        step: steps.length + 1, lineNum: 2,
        explanationEnglish: `Outer loop for row i = ${i}.`,
        explanationHinglish: `Outer loop row i = ${i} ke liye.`,
        memorySnapshot: { size: limit, i },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      for (let j = 1; j <= i; j++) {
        steps.push({
          step: steps.length + 1, lineNum: 3,
          explanationEnglish: `Inner loop for column j = ${j}.`,
          explanationHinglish: `Inner loop column j = ${j} ke liye.`,
          memorySnapshot: { size: limit, i, j },
          animationEvent: { type: 'CREATE_VARIABLE', name: 'j', value: j },
        });

        currentOutput += "* ";
        steps.push({
          step: steps.length + 1, lineNum: 4,
          explanationEnglish: 'Print on the same line.',
          explanationHinglish: 'Line bina badle print kiya.',
          memorySnapshot: { size: limit, i, j },
          consoleOutput: currentOutput,
          animationEvent: { type: 'PRINT_VALUE', variableName: 'print', outputValue: "* " },
        });
      }

      currentOutput += "\n";
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: 'Move to the next line.',
        explanationHinglish: 'Agli line mein move hua.',
        memorySnapshot: { size: limit, i },
        consoleOutput: currentOutput,
        animationEvent: { type: 'PRINT_VALUE', variableName: '"\\n"', outputValue: '"\\n"' },
      });
    }
    return steps;
  },
  executionSteps: []
};