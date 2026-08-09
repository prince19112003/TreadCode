import type { LessonProgram, ExecutionStep } from '../../types';

export const func_with_return: LessonProgram = {
  id: 'func_with_return', language: 'python', topic: 'functions', lessonNumber: 3,
  friendlyName: 'Function With Return Value',
  learningObjective: 'Understand how a function can send computed data back to the calling code.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'def' }, { type: 'text', value: ' ' }, { type: 'function', value: 'get_number' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'parameter', value: '42', paramId: 'retVal' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 4, tokens: [{ type: 'variable', value: 'result' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'get_number' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'result' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    retVal: { default: 42, type: 'number', label: 'Return Value' }
  },
  generateSteps: ({ retVal }): ExecutionStep[] => {
    const val = isNaN(Number(retVal)) ? String(retVal) : Number(retVal);

    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: 'Define function get_number() that returns a value.',
        explanationHinglish: 'get_number naam ka function banaya jo value return karega.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' },
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'Call get_number() from line 4. Program jumps to function definition.',
        explanationHinglish: 'Line 4 par get_number() call hua. Control function ke andar execute hua gaya.',
        memorySnapshot: {},
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'get_number', args: {} },
      },
      {
        step: 3, lineNum: 2,
        explanationEnglish: `Execute "return ${val}". The function returns ${val} back to line 4.`,
        explanationHinglish: `"return ${val}" execute hua. Function se ${val} value wapas line 4 ko bejhi.`,
        memorySnapshot: {},
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'get_number', returnValue: val },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Store the returned value (${val}) into variable "result".`,
        explanationHinglish: `Function se aayi value (${val}) ko variable "result" mein store kiya.`,
        memorySnapshot: { result: val },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'result', value: val },
      },
      {
        step: 5, lineNum: 5,
        explanationEnglish: `Print the stored result: ${val}.`,
        explanationHinglish: `result mein store ki gayi value print ki: ${val}.`,
        memorySnapshot: { result: val },
        consoleOutput: String(val),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'result', outputValue: val },
      }
    ];
  },
  executionSteps: []
};