import type { LessonProgram, ExecutionStep } from '../../types';

export const student_result: LessonProgram = {
  id: 'student_result', language: 'python', topic: 'variables', lessonNumber: 10,
  friendlyName: 'Student Result Calculator',
  learningObjective: 'Learn how to combine multiple operations to calculate total marks, average, and percentage.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'math' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '85' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'science' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '92' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'english' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '78' }] },
    { lineNum: 4, tokens: [{ type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'math' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'science' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'english' }] },
    { lineNum: 5, tokens: [{ type: 'variable', value: 'percentage' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '300' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }] },
    { lineNum: 6, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'total' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 7, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'percentage' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    math:    { default: 85, min: 0, max: 100, label: 'Math Marks' },
    science: { default: 92, min: 0, max: 100, label: 'Science Marks' },
    english: { default: 78, min: 0, max: 100, label: 'English Marks' },
  },
  generateSteps: ({ math, science, english }): ExecutionStep[] => {
    const total = math + science + english;
    const percentage = parseFloat(((total / 300) * 100).toFixed(2));
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "math" and store ${math}.`,
        explanationHinglish: `"math" variable bana aur ${math} store kiya.`,
        memorySnapshot: { math },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'math', value: math },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "science" and store ${science}.`,
        explanationHinglish: `"science" variable bana aur ${science} store kiya.`,
        memorySnapshot: { math, science },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'science', value: science },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Create a box "english" and store ${english}.`,
        explanationHinglish: `"english" variable bana aur ${english} store kiya.`,
        memorySnapshot: { math, science, english },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'english', value: english },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Add all marks (${math} + ${science} + ${english} = ${total}) and store in "total".`,
        explanationHinglish: `Teeno marks ko joda aur result ${total} "total" me store kiya.`,
        memorySnapshot: { math, science, english, total },
        animationEvent: { type: 'COMPUTE', inputs: ['math', 'science', 'english'], operator: '+', result: total, storeIn: 'total' },
      },
      {
        step: 5, lineNum: 5,
        explanationEnglish: `Calculate percentage ((${total} / 300) * 100 = ${percentage}) and store in "percentage".`,
        explanationHinglish: `Percentage nikala aur result ${percentage} "percentage" me store kiya.`,
        memorySnapshot: { math, science, english, total, percentage },
        animationEvent: { type: 'COMPUTE', inputs: ['total', '300', '100'], operator: '/ *', result: percentage, storeIn: 'percentage' },
      },
      {
        step: 6, lineNum: 6,
        explanationEnglish: `Print the "total" marks.`,
        explanationHinglish: `"total" marks screen par print kiya.`,
        memorySnapshot: { math, science, english, total, percentage },
        consoleOutput: String(total),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'total', outputValue: total },
      },
      {
        step: 7, lineNum: 7,
        explanationEnglish: `Print the "percentage".`,
        explanationHinglish: `"percentage" screen par print kiya.`,
        memorySnapshot: { math, science, english, total, percentage },
        consoleOutput: `${total}\n${percentage}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'percentage', outputValue: percentage },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "math" and store 85.',
      explanationHinglish: '"math" variable bana aur 85 store kiya.',
      memorySnapshot: { math: 85 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'math', value: 85 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "science" and store 92.',
      explanationHinglish: '"science" variable bana aur 92 store kiya.',
      memorySnapshot: { math: 85, science: 92 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'science', value: 92 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Create a box "english" and store 78.',
      explanationHinglish: '"english" variable bana aur 78 store kiya.',
      memorySnapshot: { math: 85, science: 92, english: 78 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'english', value: 78 },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Add the marks (85 + 92 + 78) and store the sum (255) in "total".',
      explanationHinglish: 'Teeno marks ko joda aur result 255 "total" me store kiya.',
      memorySnapshot: { math: 85, science: 92, english: 78, total: 255 },
      animationEvent: { type: 'COMPUTE', inputs: ['math', 'science', 'english'], operator: '+', result: 255, storeIn: 'total' },
    },
    {
      step: 5, lineNum: 5,
      explanationEnglish: 'Calculate the percentage ((255 / 300) * 100) and store the result (85.0) in "percentage".',
      explanationHinglish: 'Percentage nikala aur result 85.0 "percentage" me store kiya.',
      memorySnapshot: { math: 85, science: 92, english: 78, total: 255, percentage: 85.0 },
      animationEvent: { type: 'COMPUTE', inputs: ['total', '300', '100'], operator: '/ *', result: 85.0, storeIn: 'percentage' },
    },
    {
      step: 6, lineNum: 6,
      explanationEnglish: 'Print the "total" marks.',
      explanationHinglish: '"total" marks screen par print kiya.',
      memorySnapshot: { math: 85, science: 92, english: 78, total: 255, percentage: 85.0 },
      consoleOutput: '255',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'total', outputValue: 255 },
    },
    {
      step: 7, lineNum: 7,
      explanationEnglish: 'Print the "percentage".',
      explanationHinglish: '"percentage" screen par print kiya.',
      memorySnapshot: { math: 85, science: 92, english: 78, total: 255, percentage: 85.0 },
      consoleOutput: '255\n85.0',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'percentage', outputValue: 85.0 },
    },
  ],
};
