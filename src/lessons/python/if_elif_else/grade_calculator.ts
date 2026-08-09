import type { LessonProgram, ExecutionStep } from '../../types';

export const grade_calculator: LessonProgram = {
  id: 'grade_calculator', language: 'python', topic: 'if_elif_else', lessonNumber: 2,
  friendlyName: 'Grade Calculator',
  learningObjective: 'Use multiple elif statements to assign a grade based on numeric scores.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '82' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '90' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade A"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '80' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade B"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 6, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade C"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    marks: { default: 82, min: 0, max: 100, label: 'Marks Scored' },
  },
  generateSteps: ({ marks }): ExecutionStep[] => {
    const snap: Record<string, string | number> = { marks };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the student score ${marks} in "marks".`,
        explanationHinglish: `Student ke marks (${marks}) "marks" variable me dale.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'marks', value: marks },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if marks >= 90. (${marks} >= 90 is ${marks >= 90 ? 'True' : 'False'}).`,
        explanationHinglish: `Check kiya kya marks 90 ya zyada hain. Yeh ${marks >= 90 ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['marks'], operator: '>= 90', result: marks >= 90 ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (marks >= 90) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Since this condition is True, print "Grade A".',
        explanationHinglish: 'Yeh condition True is, isliye "Grade A" print kiya.',
        memorySnapshot: snap,
        consoleOutput: 'Grade A',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Grade A"', outputValue: 'Grade A' },
      });
    } else {
      steps.push({
        step: 3, lineNum: 4,
        explanationEnglish: `Move to the next condition: Check if marks >= 80. (${marks} >= 80 is ${marks >= 80 ? 'True' : 'False'}).`,
        explanationHinglish: `Agli condition dekhi: kya marks 80 ya zyada hain. Yeh ${marks >= 80 ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['marks'], operator: '>= 80', result: marks >= 80 ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (marks >= 80) {
        steps.push({
          step: 4, lineNum: 5,
          explanationEnglish: 'Since this condition is True, print "Grade B".',
          explanationHinglish: 'Yeh condition True is, isliye "Grade B" print kiya.',
          memorySnapshot: snap,
          consoleOutput: 'Grade B',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Grade B"', outputValue: 'Grade B' },
        });
      } else {
        steps.push(
          {
            step: 4, lineNum: 6,
            explanationEnglish: 'Since all conditions above are False, jump to else.',
            explanationHinglish: 'Kyunki upar wali conditions false thin, isliye else block par jump kiya.',
            memorySnapshot: snap,
            animationEvent: { type: 'NONE' },
          },
          {
            step: 5, lineNum: 7,
            explanationEnglish: 'Run the else block and print "Grade C".',
            explanationHinglish: 'Else block execute kiya aur "Grade C" print kiya.',
            memorySnapshot: snap,
            consoleOutput: 'Grade C',
            animationEvent: { type: 'PRINT_VALUE', variableName: '"Grade C"', outputValue: 'Grade C' },
          }
        );
      }
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the student score 82 in "marks".',
      explanationHinglish: 'Student ke marks (82) "marks" variable me dale.',
      memorySnapshot: { marks: 82 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'marks', value: 82 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if marks >= 90. (82 >= 90 is False).',
      explanationHinglish: 'Check kiya kya marks 90 ya zyada hain. Yeh False hai.',
      memorySnapshot: { marks: 82 },
      animationEvent: { type: 'COMPUTE', inputs: ['marks'], operator: '>= 90', result: 'False', storeIn: 'Condition' },
    },
  ],
};
