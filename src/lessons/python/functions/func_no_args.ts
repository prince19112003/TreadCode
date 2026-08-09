import type { LessonProgram, ExecutionStep } from '../../types';

export const func_no_args: LessonProgram = {
  id: 'func_no_args', language: 'python', topic: 'functions', lessonNumber: 1,
  friendlyName: 'Function Without Arguments',
  learningObjective: 'Learn how to define a basic function and execute it using a function call.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'greet' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'parameter', value: '"Hello, World!"', paramId: 'msg' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'greet' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    msg: { default: '"Hello, World!"', type: 'text', label: 'Greeting Text' }
  },
  generateSteps: ({ msg }): ExecutionStep[] => {
    const cleanMsg = String(msg).replace(/['"]/g, '');
    const formattedMsg = `"${cleanMsg}"`;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Python reads the "def greet():" line and stores the function blueprint in memory. The function body does NOT run yet.',
        explanationHinglish: 'Python "def greet():" dekh ke function ka blueprint memory mein store kar leta hai. Abhi code execute nahi hua.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'greet() is called. Program control jumps from line 4 into the greet() function body at line 2.',
        explanationHinglish: 'greet() call hua. Control line 4 se jump karke function ke andar execute hua gaya.',
        memorySnapshot: {},
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'greet', args: {} },
      },
      {
        step: 3, lineNum: 2,
        explanationEnglish: `Inside the function body: print(${formattedMsg}) executes and outputs the text.`,
        explanationHinglish: `Function ke andar: print(${formattedMsg}) execute hua aur text screen par aa gaya.`,
        memorySnapshot: {},
        consoleOutput: cleanMsg,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: formattedMsg },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: 'Function body execution is complete. Control returns back to line 4 where greet() was originally called.',
        explanationHinglish: 'Function execution poora hua. Control wapas line 4 par aa gaya.',
        memorySnapshot: {},
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'greet' },
      },
    ];
  },
  executionSteps: [],
};