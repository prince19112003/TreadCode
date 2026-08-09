import type { LessonProgram, ExecutionStep } from '../../types';

export const day_name: LessonProgram = {
  id: 'day_name', language: 'python', topic: 'match_case', lessonNumber: 1,
  friendlyName: 'Day Name',
  learningObjective: 'Use match-case to cleanly handle multiple specific value conditions.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'day' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'match' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'day' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Monday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Tuesday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Wednesday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Thursday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Friday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Saturday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sunday"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'keyword', value: '_' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    day: { default: 3, min: 1, max: 8, label: 'Day Number' },
  },
  generateSteps: ({ day }): ExecutionStep[] => {
    const snap: Record<string, string | number> = { day };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store day value ${day} in "day".`,
        explanationHinglish: `"day" variable me ${day} save kiya.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'day', value: day },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Start matching the value of "day" (${day}).`,
        explanationHinglish: `Match block start hua, day (${day}) ki value check karne ke liye.`,
        memorySnapshot: snap,
        animationEvent: { type: 'MATCH_START', variableName: 'day', value: day },
      },
    ];

    const dayNameMap: Record<number, { name: string; line: number; caseLine: number }> = {
      1: { name: 'Monday', line: 4, caseLine: 3 },
      2: { name: 'Tuesday', line: 6, caseLine: 5 },
      3: { name: 'Wednesday', line: 8, caseLine: 7 },
      4: { name: 'Thursday', line: 10, caseLine: 9 },
      5: { name: 'Friday', line: 12, caseLine: 11 },
      6: { name: 'Saturday', line: 14, caseLine: 13 },
      7: { name: 'Sunday', line: 16, caseLine: 15 },
    };

    const match = dayNameMap[day];

    // Show evaluations step-by-step
    for (let d = 1; d <= 7; d++) {
      if (day === d) {
        steps.push({
          step: steps.length + 1, lineNum: dayNameMap[d].caseLine,
          explanationEnglish: `Check case ${d}. Since day is ${d}, this case matches!`,
          explanationHinglish: `Case ${d} check kiya. Kyunki day ${d} hai, yeh case match ho gaya!`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE', inputs: ['day'], operator: `== ${d}`, result: 'True', storeIn: 'Condition' },
        });
        break; // Matched, so stop checking further cases
      } else {
        steps.push({
          step: steps.length + 1, lineNum: dayNameMap[d].caseLine,
          explanationEnglish: `Check case ${d}. Since day is not ${d}, this case does not match.`,
          explanationHinglish: `Case ${d} check kiya. Kyunki day ${d} nahi hai, yeh case match nahi hua.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE', inputs: ['day'], operator: `== ${d}`, result: 'False', storeIn: 'Condition' },
        });
      }
    }

    if (match) {
      steps.push({
        step: steps.length + 1, lineNum: match.line,
        explanationEnglish: `Execute case ${day} block and print "${match.name}".`,
        explanationHinglish: `Case ${day} execute kiya aur "${match.name}" print kiya.`,
        memorySnapshot: snap,
        consoleOutput: match.name,
        animationEvent: { type: 'PRINT_VALUE', variableName: `"${match.name}"`, outputValue: match.name },
      });
    } else {
      // Default case check if no match was found
      steps.push(
        {
          step: steps.length + 1, lineNum: 17,
          explanationEnglish: `No previous cases matched, fallback to default case (_).`,
          explanationHinglish: `Koi case match nahi hua, default (_) case execute hua.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE', inputs: ['day'], operator: '== default', result: 'True', storeIn: 'Condition' },
        },
        {
          step: steps.length + 1, lineNum: 18,
          explanationEnglish: 'Print "Invalid" default message.',
          explanationHinglish: 'Default message "Invalid" print kiya.',
          memorySnapshot: snap,
          consoleOutput: 'Invalid',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Invalid"', outputValue: 'Invalid' },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store 3 in "day".',
      explanationHinglish: '"day" variable me 3 dala.',
      memorySnapshot: { day: 3 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'day', value: 3 },
    },
  ],
};
