import type { LessonProgram, ExecutionStep } from '../../types';

export const full_pyramid: LessonProgram = {
  id: 'full_pyramid', language: 'python', topic: 'nested_loop', lessonNumber: 6,
  friendlyName: 'Full Pyramid Star Pattern',
  learningObjective: 'Understand how to use multiple consecutive inner loops inside an outer loop to draw a pyramid.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '" "' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '=' }, { type: 'string', value: '""' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'k' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"*"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '=' }, { type: 'string', value: '""' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '()' }] },
  ],
  
  editableVariables: {
    size: { default: 5, min: 1, max: 6, label: 'Rows' },
  },
  generateSteps: ({ size }): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    const limit = Number(size);
    let currentOutput = "";

    steps.push({
      step: steps.length + 1, lineNum: 1,
      explanationEnglish: `Set the number of rows (n) to ${limit}.`,
      explanationHinglish: `n ki value ${limit} set ki.`,
      memorySnapshot: { n: limit },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: limit },
    });

    for (let i = 1; i <= limit; i++) {
      steps.push({
        step: steps.length + 1, lineNum: 2,
        explanationEnglish: `Outer loop for row i = ${i}.`,
        explanationHinglish: `Outer loop row i = ${i} ke liye.`,
        memorySnapshot: { n: limit, i },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      for (let j = 1; j <= limit - i; j++) {
        steps.push({
          step: steps.length + 1, lineNum: 3,
          explanationEnglish: `Space loop for column j = ${j}.`,
          explanationHinglish: `Space loop column j = ${j} ke liye.`,
          memorySnapshot: { n: limit, i, j },
          animationEvent: { type: 'CREATE_VARIABLE', name: 'j', value: j },
        });

        currentOutput += " ";
        steps.push({
          step: steps.length + 1, lineNum: 4,
          explanationEnglish: 'Print space.',
          explanationHinglish: 'Space print kiya.',
          memorySnapshot: { n: limit, i, j },
          consoleOutput: currentOutput,
          animationEvent: { type: 'PRINT_VALUE', variableName: '" "', outputValue: '" "' },
        });
      }

      for (let k = 1; k <= (2 * i - 1); k++) {
        steps.push({
          step: steps.length + 1, lineNum: 5,
          explanationEnglish: `Star loop for k = ${k}.`,
          explanationHinglish: `Star loop k = ${k} ke liye.`,
          memorySnapshot: { n: limit, i, k },
          animationEvent: { type: 'CREATE_VARIABLE', name: 'k', value: k },
        });

        currentOutput += "*";
        steps.push({
          step: steps.length + 1, lineNum: 6,
          explanationEnglish: 'Print star.',
          explanationHinglish: 'Star print kiya.',
          memorySnapshot: { n: limit, i, k },
          consoleOutput: currentOutput,
          animationEvent: { type: 'PRINT_VALUE', variableName: '"*"', outputValue: '"*"' },
        });
      }

      currentOutput += "\n";
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: 'Move to the next line.',
        explanationHinglish: 'Agli line mein move hua.',
        memorySnapshot: { n: limit, i },
        consoleOutput: currentOutput,
        animationEvent: { type: 'PRINT_VALUE', variableName: '"\\n"', outputValue: '"\\n"' },
      });
    }
    return steps;
  },
  executionSteps: []
};