import type { LessonProgram, ExecutionStep } from '../../types';

export const pass_marks: LessonProgram = {
  id: 'pass_marks', language: 'python', topic: 'if_statement', lessonNumber: 4,
  friendlyName: 'Pass Marks Check',
  learningObjective: 'Use an if statement to verify a passing threshold condition.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '75' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'passing' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '40' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'passing' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Exam Passed!"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    marks:   { default: 75, min: 0, max: 100, label: 'Marks Scored' },
    passing: { default: 40, min: 0, max: 100, label: 'Passing Threshold' },
  },
  generateSteps: ({ marks, passing }): ExecutionStep[] => {
    const conditionResult = marks >= passing;
    const snap1: Record<string, string | number> = { marks };
    const snap2: Record<string, string | number> = { marks, passing };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "marks" and store the student's score (${marks}).`,
        explanationHinglish: `Student ke marks (${marks}) "marks" variable me store kiye.`,
        memorySnapshot: snap1,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'marks', value: marks },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "passing" to store the minimum required score (${passing}).`,
        explanationHinglish: `Pass hone ka threshold (${passing}) "passing" variable me store kiya.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'passing', value: passing },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Compare if marks (${marks}) is >= passing (${passing}). ${conditionResult ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya marks passing limit se zyada hain (${marks} >= ${passing}). Yeh ${conditionResult ? 'true' : 'false'} hai.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'COMPUTE', inputs: ['marks', 'passing'], operator: '>=', result: conditionResult ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];
    if (conditionResult) {
      steps.push({
        step: 4, lineNum: 4,
        explanationEnglish: 'Condition met, print the passing message.',
        explanationHinglish: 'Condition True hai isliye "Exam Passed!" print kiya.',
        memorySnapshot: snap2,
        consoleOutput: 'Exam Passed!',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Exam Passed!"', outputValue: 'Exam Passed!' },
      });
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: "Create a box \"marks\" and store the student's score (75).",
      explanationHinglish: 'Student ke marks (75) "marks" variable me store kiye.',
      memorySnapshot: { marks: 75 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'marks', value: 75 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "passing" to store the minimum required score (40).',
      explanationHinglish: 'Pass hone ka threshold (40) "passing" variable me store kiya.',
      memorySnapshot: { marks: 75, passing: 40 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'passing', value: 40 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Compare if marks (75) is greater than or equal to passing (40). True.',
      explanationHinglish: 'Check kiya kya marks passing limit se zyada hain (75 >= 40). Yeh true hai.',
      memorySnapshot: { marks: 75, passing: 40 },
      animationEvent: { type: 'COMPUTE', inputs: ['marks', 'passing'], operator: '>=', result: 'True', storeIn: 'Condition' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Condition met, print the passing message.',
      explanationHinglish: 'Condition True hai isliye "Exam Passed!" print kiya.',
      memorySnapshot: { marks: 75, passing: 40 },
      consoleOutput: 'Exam Passed!',
      animationEvent: { type: 'PRINT_VALUE', variableName: '"Exam Passed!"', outputValue: 'Exam Passed!' },
    },
  ],
};
