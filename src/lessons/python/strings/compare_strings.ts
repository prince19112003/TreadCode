import type { LessonProgram, ExecutionStep } from '../../types';

export const compare_strings: LessonProgram = {
  id: 'compare_strings', language: 'python', topic: 'strings', lessonNumber: 10,
  friendlyName: 'Compare Two Strings',
  learningObjective: 'Understand how string comparison works and why it is case-sensitive.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'str1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"apple"' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'str2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Apple"' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str2' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Same Strings"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Different Strings"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    str1: { default: '"apple"', type: 'text', label: 'String 1' },
    str2: { default: '"Apple"', type: 'text', label: 'String 2' },
  },
  generateSteps: ({ str1, str2 }) => {
    const s1 = String(str1).replace(/['"]/g, '');
    const s2 = String(str2).replace(/['"]/g, '');
    const f1 = `"${s1}"`;
    const f2 = `"${s2}"`;
    const isEqual = s1 === s2;
    const sameStr = '"Same Strings"';
    const diffStr = '"Different Strings"';

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store "${s1}" in variable str1.`,
        explanationHinglish: `Variable str1 mein "${s1}" store kiya.`,
        memorySnapshot: { str1: f1 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'str1', value: f1 },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Store "${s2}" in variable str2.`,
        explanationHinglish: `Variable str2 mein "${s2}" store kiya.`,
        memorySnapshot: { str1: f1, str2: f2 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'str2', value: f2 },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Compare str1 ("${s1}") and str2 ("${s2}"). They are ${isEqual ? 'equal' : 'not equal (comparison is case-sensitive)'}.`,
        explanationHinglish: `str1 ("${s1}") aur str2 ("${s2}") ko compare kiya. Ye ${isEqual ? 'same hain' : 'same nahi hain (comparison case-sensitive hai)'}.`,
        memorySnapshot: { str1: f1, str2: f2 },
        animationEvent: { type: 'COMPUTE', inputs: ['str1', 'str2'], operator: '==', result: String(isEqual), storeIn: 'Condition' },
      }
    ];

    if (isEqual) {
      steps.push({
        step: 4, lineNum: 4,
        explanationEnglish: 'Print "Same Strings".',
        explanationHinglish: '"Same Strings" print kiya.',
        memorySnapshot: { str1: f1, str2: f2 },
        consoleOutput: 'Same Strings',
        animationEvent: { type: 'PRINT_VALUE', variableName: 'str1', outputValue: sameStr },
      });
    } else {
      steps.push({
        step: 4, lineNum: 5,
        explanationEnglish: 'Go to else block because condition is false.',
        explanationHinglish: 'Condition false hone par else block mein move hua.',
        memorySnapshot: { str1: f1, str2: f2 },
        animationEvent: { type: 'NONE' },
      });
      steps.push({
        step: 5, lineNum: 6,
        explanationEnglish: 'Print "Different Strings".',
        explanationHinglish: '"Different Strings" print kiya.',
        memorySnapshot: { str1: f1, str2: f2 },
        consoleOutput: 'Different Strings',
        animationEvent: { type: 'PRINT_VALUE', variableName: 'str1', outputValue: diffStr },
      });
    }

    return steps;
  },
  executionSteps: [],
};