import type { LessonProgram, ExecutionStep } from '../../types';

export const voting_eligibility: LessonProgram = {
  id: 'voting_eligibility', language: 'python', topic: 'if_statement', lessonNumber: 3,
  friendlyName: 'Voting Eligibility',
  learningObjective: 'Use the greater than or equal to (>=) operator in an if statement.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '18' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '18' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Eligible to Vote"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    age: { default: 18, min: 1, max: 150, label: 'Age' },
  },
  generateSteps: ({ age }): ExecutionStep[] => {
    const conditionResult = age >= 18;
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "age" and store ${age}.`,
        explanationHinglish: `"age" naam ka variable bana aur ${age} store kiya.`,
        memorySnapshot: { age },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'age', value: age },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if age (${age}) is 18 or older. The condition is ${conditionResult ? 'true' : 'false'}.`,
        explanationHinglish: `Check kiya kya umar (${age}) 18 ya usse jyada hai. Yeh condition ${conditionResult ? 'true' : 'false'} hai.`,
        memorySnapshot: { age },
        animationEvent: { type: 'COMPUTE', inputs: ['age'], operator: '>= 18', result: conditionResult ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];
    if (conditionResult) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Print the success message since the condition passed.',
        explanationHinglish: 'Condition pass hui isliye humne voting eligible ka message print kiya.',
        memorySnapshot: { age },
        consoleOutput: 'Eligible to Vote',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Eligible to Vote"', outputValue: 'Eligible to Vote' },
      });
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "age" and store 18.',
      explanationHinglish: '"age" naam ka variable bana aur 18 store kiya.',
      memorySnapshot: { age: 18 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'age', value: 18 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if age is 18 or older. Since it is exactly 18, the condition is true.',
      explanationHinglish: 'Check kiya kya umar 18 ya usse jyada hai. Yeh condition true hai kyunki umar exactly 18 hai.',
      memorySnapshot: { age: 18 },
      animationEvent: { type: 'COMPUTE', inputs: ['age'], operator: '>= 18', result: 'True', storeIn: 'Condition' },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Print the success message since the condition passed.',
      explanationHinglish: 'Condition pass hui isliye humne voting eligible ka message print kiya.',
      memorySnapshot: { age: 18 },
      consoleOutput: 'Eligible to Vote',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Eligible to Vote"', outputValue: 'Eligible to Vote' },
    },
  ],
};
