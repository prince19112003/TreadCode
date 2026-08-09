import type { LessonProgram, ExecutionStep } from '../../types';

export const reverse_string: LessonProgram = {
  id: 'reverse_string', language: 'python', topic: 'strings', lessonNumber: 5,
  friendlyName: 'Reverse a String',
  learningObjective: 'Learn how to iterate through a string and build a new string backwards.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'word' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"cat"' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'rev_word' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '""' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'word' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'rev_word' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev_word' }] },
    { lineNum: 5, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'rev_word' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    word: { default: '"cat"', type: 'text', label: 'Word' },
  },
  generateSteps: ({ word }) => {
    const cleanWord = String(word).replace(/['"]/g, '');
    const fWord = `"${cleanWord}"`;
    
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the text "${cleanWord}" in variable word.`,
        explanationHinglish: `Variable word mein "${cleanWord}" text store kiya.`,
        memorySnapshot: { word: fWord },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'word', value: fWord },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: 'Create an empty string rev_word to build the reversed word.',
        explanationHinglish: 'Ulta word banane ke liye rev_word naam ka khali string banaya.',
        memorySnapshot: { word: fWord, rev_word: '""' },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'rev_word', value: '""' },
      }
    ];

    let currentRev = '';
    let stepNum = 3;

    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const fChar = `"${char}"`;
      const nextRev = char + currentRev;
      const fCurrentRev = currentRev === '' ? '""' : `"${currentRev}"`;
      const fNextRev = `"${nextRev}"`;

      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Read the next character "${char}".`,
        explanationHinglish: `Agla character "${char}" padha.`,
        memorySnapshot: { word: fWord, rev_word: fCurrentRev, char: fChar },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'char', value: fChar },
      });

      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Add "${char}" to the beginning of rev_word. It becomes "${nextRev}".`,
        explanationHinglish: `"${char}" ko rev_word ke start mein joda. Ab yeh "${nextRev}" ban gaya.`,
        memorySnapshot: { word: fWord, rev_word: fNextRev, char: fChar },
        animationEvent: { type: 'COMPUTE', inputs: ['char', 'rev_word'], operator: '+', result: fNextRev, storeIn: 'rev_word' },
      });

      currentRev = nextRev;
    }

    const fFinalRev = `"${currentRev}"`;
    const lastChar = cleanWord.length > 0 ? cleanWord[cleanWord.length - 1] : '';
    const fLastChar = lastChar ? `"${lastChar}"` : '""';

    steps.push({
      step: stepNum, lineNum: 5,
      explanationEnglish: `Print the fully reversed string: "${currentRev}".`,
      explanationHinglish: `Poora reverse hua string ("${currentRev}") print kiya.`,
      memorySnapshot: { word: fWord, rev_word: fFinalRev, ...(lastChar ? { char: fLastChar } : {}) },
      consoleOutput: currentRev,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'rev_word', outputValue: fFinalRev },
    });

    return steps;
  },
  executionSteps: [],
};