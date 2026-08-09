import type { LessonProgram, ExecutionStep } from '../../types';

export const func_with_args: LessonProgram = {
  id: 'func_with_args', language: 'python', topic: 'functions', lessonNumber: 2,
  friendlyName: 'Function With Arguments',
  learningObjective: 'Learn how to pass data into a function using arguments and parameters.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'greet_user' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Hello,"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'greet_user' }, { type: 'punctuation', value: '(' }, { type: 'parameter', value: '"Alice"', paramId: 'userName' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    userName: { default: '"Alice"', type: 'text', label: 'Name' }
  },
  generateSteps: ({ userName }): ExecutionStep[] => {
    const cleanName = String(userName).replace(/['"]/g, '');
    const formattedName = `"${cleanName}"`;
    const greetingText = `Hello, ${cleanName}`;

    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define function greet_user(name) — registers function blueprint in memory with parameter "name".',
        explanationHinglish: 'greet_user(name) function banaya — memory mein parameter "name" ke saath blueprint store hua.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Call function greet_user(${formattedName}) passing argument ${formattedName}. Program jumps to line 1.`,
        explanationHinglish: `greet_user(${formattedName}) call kiya — argument ${formattedName} bhej ke line 1 par jump kiya.`,
        memorySnapshot: {},
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'greet_user', args: { name: formattedName } },
      },
      {
        step: 3, lineNum: 1,
        explanationEnglish: `Parameter "name" inside greet_user receives the argument value ${formattedName}.`,
        explanationHinglish: `Function ke andar parameter "name" mein ${formattedName} value aa gayi.`,
        memorySnapshot: { name: formattedName },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'name', value: formattedName },
      },
      {
        step: 4, lineNum: 2,
        explanationEnglish: `Execute print("Hello,", name) -> Outputs "${greetingText}".`,
        explanationHinglish: `print("Hello,", name) execute hua -> Output aaya: "${greetingText}".`,
        memorySnapshot: { name: formattedName },
        consoleOutput: greetingText,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${greetingText}"` },
      },
      {
        step: 5, lineNum: 4,
        explanationEnglish: 'Function execution finished. Program control returns back to line 4.',
        explanationHinglish: 'Function execution poora hua. Control wapas line 4 par aa gaya.',
        memorySnapshot: {},
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'greet_user' },
      }
    ];
  },
  executionSteps: []
};