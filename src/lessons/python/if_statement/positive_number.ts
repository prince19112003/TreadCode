import type { LessonProgram, ExecutionStep } from '../../types';

export const positive_number: LessonProgram = {
  id: 'positive_number', language: 'python', topic: 'if_statement', lessonNumber: 1,
  friendlyName: 'Positive Number Check',
  learningObjective: 'Learn how to use an if statement to execute code only when a condition is true.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'number' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'number' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Positive!"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Done"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    number: { default: 10, min: -9999, max: 9999, label: 'Number' },
  },
  generateSteps: ({ number }): ExecutionStep[] => {
    const conditionResult = number > 0;
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a variable "number" and store the value ${number}.`,
        explanationHinglish: `"number" naam ka variable bana aur usme ${number} store kar diya.`,
        memorySnapshot: { number },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'number', value: number },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if the number is greater than 0. Since ${number} ${conditionResult ? 'is' : 'is not'} greater than 0, the condition is ${conditionResult ? 'true' : 'false'}.`,
        explanationHinglish: `Check kiya kya number 0 se bada hai. ${number} ${conditionResult ? 'bada hai' : 'bada nahi hai'}, isliye condition ${conditionResult ? 'true' : 'false'} hai.`,
        memorySnapshot: { number },
        animationEvent: { type: 'COMPUTE', inputs: ['number'], operator: '> 0', result: conditionResult ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];
    if (conditionResult) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Because the condition is true, we go inside the if block and print "Positive!".',
        explanationHinglish: 'Condition true thi isliye hum if block ke andar move hua aur "Positive!" print kiya.',
        memorySnapshot: { number },
        consoleOutput: 'Positive!',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Positive!"', outputValue: 'Positive!' },
      });
    }
    steps.push({
      step: conditionResult ? 4 : 3, lineNum: 4,
      explanationEnglish: 'The if statement is over, so we continue and print "Done".',
      explanationHinglish: 'If statement complete ho gaya, ab aage badh kar "Done" print kiya.',
      memorySnapshot: { number },
      consoleOutput: conditionResult ? 'Positive!\nDone' : 'Done',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Done"', outputValue: 'Done' },
    });
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a variable "number" and store the value 10.',
      explanationHinglish: '"number" naam ka variable bana aur usme 10 store kar diya.',
      memorySnapshot: { number: 10 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'number', value: 10 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if the number is greater than 0. Since 10 is greater than 0, the condition is true.',
      explanationHinglish: 'Check kiya kya number 0 se bada hai. 10 bada hai, isliye condition true hai.',
      memorySnapshot: { number: 10 },
      animationEvent: { type: 'COMPUTE', inputs: ['number'], operator: '> 0', result: 'True', storeIn: 'Condition' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Because the condition is true, we go inside the if block and print "Positive!".',
      explanationHinglish: 'Condition true thi isliye hum if block ke andar move hua aur "Positive!" print kiya.',
      memorySnapshot: { number: 10 },
      consoleOutput: 'Positive!',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Positive!"', outputValue: 'Positive!' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'The if statement is over, so we continue and print "Done".',
      explanationHinglish: 'If statement complete ho gaya, ab aage badh kar "Done" print kiya.',
      memorySnapshot: { number: 10 },
      consoleOutput: 'Positive!\nDone',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Done"', outputValue: 'Done' },
    },
  ],
};
