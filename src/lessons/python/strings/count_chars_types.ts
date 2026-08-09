import type { LessonProgram, ExecutionStep } from '../../types';

export const count_chars_types: LessonProgram = {
  id: 'count_chars_types', language: 'python', topic: 'strings', lessonNumber: 8,
  friendlyName: 'Count Digits and Spaces',
  learningObjective: 'Learn how to use string methods like isdigit() and isspace() to analyze text.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'word' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"a 1 @"' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'd_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 's_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'word' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'isdigit' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'd_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'isspace' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 's_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'pass' }] },
    { lineNum: 10, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'd_count' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 11, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 's_count' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    word: { default: '"a 1 @"', type: 'text', label: 'Word' },
  },
  generateSteps: ({ word }) => {
    const cleanWord = String(word).replace(/['"]/g, '');
    const fWord = `"${cleanWord}"`;

    let dCount = 0;
    let sCount = 0;
    let stepNum = 1;

    const steps: ExecutionStep[] = [
      {
        step: stepNum++, lineNum: 1,
        explanationEnglish: `Store the text "${cleanWord}" in variable word.`,
        explanationHinglish: `Variable word mein "${cleanWord}" text store kiya.`,
        memorySnapshot: { word: fWord },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'word', value: fWord },
      },
      {
        step: stepNum++, lineNum: 2,
        explanationEnglish: 'Initialize digits counter to 0.',
        explanationHinglish: 'Digits ginne ke liye d_count ko 0 se start kiya.',
        memorySnapshot: { word: fWord, d_count: 0 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'd_count', value: 0 },
      },
      {
        step: stepNum++, lineNum: 3,
        explanationEnglish: 'Initialize spaces counter to 0.',
        explanationHinglish: 'Spaces ginne ke liye s_count ko 0 se start kiya.',
        memorySnapshot: { word: fWord, d_count: 0, s_count: 0 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 's_count', value: 0 },
      }
    ];

    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const fChar = `"${char}"`;
      const isDigit = /^[0-9]$/.test(char);
      const isSpace = char === ' ';

      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Read the next character "${char === ' ' ? 'space' : char}".`,
        explanationHinglish: `Agla character "${char === ' ' ? 'space' : char}" padha.`,
        memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, char: fChar },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'char', value: fChar },
      });

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Check if "${char === ' ' ? 'space' : char}" is a digit.`,
        explanationHinglish: `Check kiya kya "${char === ' ' ? 'space' : char}" digit hai.`,
        memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, char: fChar },
        animationEvent: { type: 'COMPUTE', inputs: ['char'], operator: '.isdigit()', result: isDigit ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isDigit) {
        dCount++;
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `It is a digit! Increase d_count to ${dCount}.`,
          explanationHinglish: `Yeh digit hai! d_count ko badha kar ${dCount} kar diya.`,
          memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, char: fChar },
          animationEvent: { type: 'COMPUTE', inputs: ['d_count'], operator: '+ 1', result: dCount, storeIn: 'd_count' },
        });
      } else {
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Check if "${char === ' ' ? 'space' : char}" is a space.`,
          explanationHinglish: `Check kiya kya "${char === ' ' ? 'space' : char}" space hai.`,
          memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, char: fChar },
          animationEvent: { type: 'COMPUTE', inputs: ['char'], operator: '.isspace()', result: isSpace ? 'True' : 'False', storeIn: 'Condition' },
        });

        if (isSpace) {
          sCount++;
          steps.push({
            step: stepNum++, lineNum: 8,
            explanationEnglish: `It is a space! Increase s_count to ${sCount}.`,
            explanationHinglish: `Yeh space hai! s_count ko badha kar ${sCount} kar diya.`,
            memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, char: fChar },
            animationEvent: { type: 'COMPUTE', inputs: ['s_count'], operator: '+ 1', result: sCount, storeIn: 's_count' },
          });
        } else {
          steps.push({
            step: stepNum++, lineNum: 9,
            explanationEnglish: `It is neither a digit nor a space. pass.`,
            explanationHinglish: `Yeh na toh digit hai na space. pass kiya.`,
            memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, char: fChar },
            animationEvent: { type: 'NONE' },
          });
        }
      }
    }

    const lastChar = cleanWord.length > 0 ? cleanWord[cleanWord.length - 1] : '';
    const fLastChar = lastChar ? `"${lastChar}"` : '';

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `Print the final digit count: ${dCount}.`,
      explanationHinglish: `Digits ka final count print kiya.`,
      memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, ...(fLastChar ? { char: fLastChar } : {}) },
      consoleOutput: String(dCount),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'd_count', outputValue: dCount },
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: `Print the final space count: ${sCount}.`,
      explanationHinglish: `Spaces ka final count print kiya.`,
      memorySnapshot: { word: fWord, d_count: dCount, s_count: sCount, ...(fLastChar ? { char: fLastChar } : {}) },
      consoleOutput: `${dCount}\n${sCount}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 's_count', outputValue: sCount },
    });

    return steps;
  },
  executionSteps: [],
};