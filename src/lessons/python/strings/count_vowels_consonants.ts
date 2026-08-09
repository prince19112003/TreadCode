import type { LessonProgram, ExecutionStep } from '../../types';

export const count_vowels_consonants: LessonProgram = {
  id: 'count_vowels_consonants', language: 'python', topic: 'strings', lessonNumber: 7,
  friendlyName: 'Count Vowels and Consonants',
  learningObjective: 'Learn how to process strings character-by-character and classify letters using conditions.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'word' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"apple"' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'v_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'c_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'word' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'string', value: '"aeiou"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'v_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'c_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 9, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'v_count' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 10, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'c_count' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    word: { default: '"apple"', type: 'text', label: 'Word' },
  },
  generateSteps: ({ word }) => {
    const cleanWord = String(word).replace(/['"]/g, '');
    const fWord = `"${cleanWord}"`;

    let vCount = 0;
    let cCount = 0;
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
        explanationEnglish: 'Initialize vowel counter to 0.',
        explanationHinglish: 'Vowel ginne ke liye v_count ko 0 se start kiya.',
        memorySnapshot: { word: fWord, v_count: 0 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'v_count', value: 0 },
      },
      {
        step: stepNum++, lineNum: 3,
        explanationEnglish: 'Initialize consonant counter to 0.',
        explanationHinglish: 'Consonant ginne ke liye c_count ko 0 se start kiya.',
        memorySnapshot: { word: fWord, v_count: 0, c_count: 0 },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'c_count', value: 0 },
      }
    ];

    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const fChar = `"${char}"`;
      const isVowel = 'aeiouAEIOU'.includes(char);

      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Read the next character "${char}".`,
        explanationHinglish: `Agla character "${char}" padha.`,
        memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, char: fChar },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'char', value: fChar },
      });

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Check if "${char}" is in "aeiou".`,
        explanationHinglish: `Check kiya kya "${char}" vowels "aeiou" mein aata hai.`,
        memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, char: fChar },
        animationEvent: { type: 'COMPUTE', inputs: ['char'], operator: 'in "aeiou"', result: isVowel ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (isVowel) {
        vCount++;
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `It is a vowel! Increase v_count to ${vCount}.`,
          explanationHinglish: `Yeh vowel hai! v_count ko badha kar ${vCount} kar diya.`,
          memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, char: fChar },
          animationEvent: { type: 'COMPUTE', inputs: ['v_count'], operator: '+ 1', result: vCount, storeIn: 'v_count' },
        });
      } else {
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `It is not a vowel, go to else block.`,
          explanationHinglish: `Yeh vowel nahi hai, isliye else block mein move hua.`,
          memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, char: fChar },
          animationEvent: { type: 'NONE' },
        });

        cCount++;
        steps.push({
          step: stepNum++, lineNum: 8,
          explanationEnglish: `It is a consonant! Increase c_count to ${cCount}.`,
          explanationHinglish: `Yeh consonant hai! c_count ko badha kar ${cCount} kar diya.`,
          memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, char: fChar },
          animationEvent: { type: 'COMPUTE', inputs: ['c_count'], operator: '+ 1', result: cCount, storeIn: 'c_count' },
        });
      }
    }

    const lastChar = cleanWord.length > 0 ? cleanWord[cleanWord.length - 1] : '';
    const fLastChar = lastChar ? `"${lastChar}"` : '';

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: `Print the final vowel count: ${vCount}.`,
      explanationHinglish: `Vowel count print kiya.`,
      memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, ...(fLastChar ? { char: fLastChar } : {}) },
      consoleOutput: String(vCount),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'v_count', outputValue: vCount },
    });

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `Print the final consonant count: ${cCount}.`,
      explanationHinglish: `Consonant count print kiya.`,
      memorySnapshot: { word: fWord, v_count: vCount, c_count: cCount, ...(fLastChar ? { char: fLastChar } : {}) },
      consoleOutput: `${vCount}\n${cCount}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'c_count', outputValue: cCount },
    });

    return steps;
  },
  executionSteps: [],
};