import type { LessonProgram, ExecutionStep } from '../../types';

export const pass_statement: LessonProgram = {
  id: 'pass_statement', language: 'python', topic: 'loop_control', lessonNumber: 3,
  friendlyName: 'Pass Statement',
  learningObjective: 'Understand how pass acts as a placeholder and does nothing.',
  editableVariables: {
    limit: { default: 4, min: 1, max: 20, label: 'Limit' },
    pass_at: { default: 2, min: 1, max: 20, label: 'Pass At' }
  },
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'limit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'pass_at' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'limit' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'pass_at' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'pass' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ')' }] },
  ],
  executionSteps: [],
  generateSteps: (variables) => {
    const limit = Number(variables?.limit || 4);
    const pass_at = Number(variables?.pass_at || 2);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let consoleOut = '';
    let mem: Record<string, string | number> = {};

    mem.limit = limit;
    steps.push({
      step: stepCount++, lineNum: 1,
      explanationEnglish: `Set limit = ${limit}.`,
      explanationHinglish: `limit ki value ${limit} set ki.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'limit', value: limit },
    });

    mem.pass_at = pass_at;
    steps.push({
      step: stepCount++, lineNum: 2,
      explanationEnglish: `Set pass_at = ${pass_at}.`,
      explanationHinglish: `pass_at ki value ${pass_at} set ki.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'pass_at', value: pass_at },
    });

    steps.push({
      step: stepCount++, lineNum: 3,
      explanationEnglish: `The loop will iterate through numbers 1 to ${limit - 1}.`,
      explanationHinglish: `Loop 1 se ${limit - 1} tak numbers execute huayega.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'NONE' },
    });

    for (let i = 1; i < limit; i++) {
      mem.i = i;
      steps.push({
        step: stepCount++, lineNum: 3,
        explanationEnglish: `The loop variable "i" takes the value ${i}.`,
        explanationHinglish: `Loop variable "i" ki value ${i} ho gayi.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      steps.push({
        step: stepCount++, lineNum: 4,
        explanationEnglish: `Check if i == ${pass_at}. This is ${i === pass_at ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya i == ${pass_at} hai. Yeh ${i === pass_at ? 'True' : 'False'} hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['i'], operator: `== ${pass_at}`, result: i === pass_at ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (i === pass_at) {
        steps.push({
          step: stepCount++, lineNum: 5,
          explanationEnglish: 'The pass statement executes. It does nothing and moves to the next line.',
          explanationHinglish: 'Pass execute hua. Iska koi asar nahi hota, execution next line pe chali jayegi.',
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });
      }

      consoleOut += (consoleOut ? '\n' : '') + i;
      steps.push({
        step: stepCount++, lineNum: 6,
        explanationEnglish: `Print the current value of i (${i}).`,
        explanationHinglish: `i ki value (${i}) print ki.`,
        memorySnapshot: { ...mem },
        consoleOutput: consoleOut,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'i', outputValue: String(i) },
      });
    }
    
    return steps;
  }
};
