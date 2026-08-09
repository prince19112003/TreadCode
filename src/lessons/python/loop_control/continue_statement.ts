import type { LessonProgram, ExecutionStep } from '../../types';

export const continue_statement: LessonProgram = {
  id: 'continue_statement', language: 'python', topic: 'loop_control', lessonNumber: 2,
  friendlyName: 'Continue Statement',
  learningObjective: 'Understand how continue skips the rest of the current iteration and moves to the next.',
  editableVariables: {
    limit: { default: 6, min: 1, max: 20, label: 'Limit' },
    skip_at: { default: 3, min: 1, max: 20, label: 'Skip At' }
  },
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'limit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'skip_at' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'limit' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'skip_at' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'continue' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ')' }] },
  ],
  executionSteps: [],
  generateSteps: (variables) => {
    const limit = Number(variables?.limit || 6);
    const skip_at = Number(variables?.skip_at || 3);
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

    mem.skip_at = skip_at;
    steps.push({
      step: stepCount++, lineNum: 2,
      explanationEnglish: `Set skip_at = ${skip_at}.`,
      explanationHinglish: `skip_at ki value ${skip_at} set ki.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'skip_at', value: skip_at },
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
        explanationEnglish: `Check if i == ${skip_at}. This is ${i === skip_at ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya i == ${skip_at} hai. Yeh ${i === skip_at ? 'True' : 'False'} hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['i'], operator: `== ${skip_at}`, result: i === skip_at ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (i === skip_at) {
        steps.push({
          step: stepCount++, lineNum: 5,
          explanationEnglish: 'The continue statement is executed. It skips the print line.',
          explanationHinglish: 'Continue chal gaya. Print line skip ho jayegi aur loop next number pe jayega.',
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });
        continue;
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
