import type { LessonProgram, ExecutionStep } from '../../types';

export const month_name: LessonProgram = {
  id: 'month_name', language: 'python', topic: 'match_case', lessonNumber: 2,
  friendlyName: 'Month Name',
  learningObjective: 'Use the default case (_) in a match statement to handle invalid inputs.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'month' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '13' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'match' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'month' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"January"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"February"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"March"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"April"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"May"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"June"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"July"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '8' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"August"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 19, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '9' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 20, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"September"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 21, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 22, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"October"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 23, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '11' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 24, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"November"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 25, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '12' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 26, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"December"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 27, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'keyword', value: '_' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 28, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid Month"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    month: { default: 13, min: 1, max: 14, label: 'Month Number' },
  },
  generateSteps: ({ month }): ExecutionStep[] => {
    const snap: Record<string, string | number> = { month };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store ${month} in "month".`,
        explanationHinglish: `"month" variable me ${month} dala.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'month', value: month },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Start matching the value of "month" (${month}).`,
        explanationHinglish: 'Match block start hua, month ki value check karne.',
        memorySnapshot: snap,
        animationEvent: { type: 'MATCH_START', variableName: 'month', value: month },
      },
    ];

    const monthMap: Record<number, { name: string; line: number; caseLine: number }> = {
      1: { name: 'January', line: 4, caseLine: 3 },
      2: { name: 'February', line: 6, caseLine: 5 },
      3: { name: 'March', line: 8, caseLine: 7 },
      4: { name: 'April', line: 10, caseLine: 9 },
      5: { name: 'May', line: 12, caseLine: 11 },
      6: { name: 'June', line: 14, caseLine: 13 },
      7: { name: 'July', line: 16, caseLine: 15 },
      8: { name: 'August', line: 18, caseLine: 17 },
      9: { name: 'September', line: 20, caseLine: 19 },
      10: { name: 'October', line: 22, caseLine: 21 },
      11: { name: 'November', line: 24, caseLine: 23 },
      12: { name: 'December', line: 26, caseLine: 25 },
    };

    const match = monthMap[month];

    // Evaluate step-by-step
    for (let m = 1; m <= 12; m++) {
      if (month === m) {
        steps.push({
          step: steps.length + 1, lineNum: monthMap[m].caseLine,
          explanationEnglish: `Check case ${m}. Since month is ${m}, this case matches!`,
          explanationHinglish: `Case ${m} check kiya. Kyunki month ${m} hai, yeh case match ho gaya!`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE', inputs: ['month'], operator: `== ${m}`, result: 'True', storeIn: 'Condition' },
        });
        break;
      } else {
        steps.push({
          step: steps.length + 1, lineNum: monthMap[m].caseLine,
          explanationEnglish: `Check case ${m}. Since month is not ${m}, this case does not match.`,
          explanationHinglish: `Case ${m} check kiya. Kyunki month ${m} nahi hai, yeh case match nahi hua.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE', inputs: ['month'], operator: `== ${m}`, result: 'False', storeIn: 'Condition' },
        });
      }
    }

    if (match) {
      steps.push({
        step: steps.length + 1, lineNum: match.line,
        explanationEnglish: `Print "${match.name}".`,
        explanationHinglish: `"${match.name}" print kiya.`,
        memorySnapshot: snap,
        consoleOutput: match.name,
        animationEvent: { type: 'PRINT_VALUE', variableName: `"${match.name}"`, outputValue: match.name },
      });
    } else {
      steps.push(
        {
          step: steps.length + 1, lineNum: 27,
          explanationEnglish: `No cases matched, jumping to the default case (_).`,
          explanationHinglish: `Koi case match nahi hua, default (_) case par jump kiya.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE', inputs: ['month'], operator: '== default', result: 'True', storeIn: 'Condition' },
        },
        {
          step: steps.length + 1, lineNum: 28,
          explanationEnglish: 'Print "Invalid Month".',
          explanationHinglish: '"Invalid Month" print kiya.',
          memorySnapshot: snap,
          consoleOutput: 'Invalid Month',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Invalid Month"', outputValue: 'Invalid Month' },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store 13 in "month".',
      explanationHinglish: '"month" variable me 13 dala.',
      memorySnapshot: { month: 13 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'month', value: 13 },
    },
  ],
};
