import type { LessonProgram, ExecutionStep } from '../../types';

export const vowel_consonant: LessonProgram = {
  id: 'vowel_consonant', language: 'python', topic: 'if_else', lessonNumber: 3,
  friendlyName: 'Vowel or Consonant',
  learningObjective: 'Use the "in" keyword within an if-else structure to check if a character is in a group.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"e"' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'char' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'string', value: '"aeiou"' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Vowel"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Consonant"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    char: { default: '"e"', label: 'Character', type: 'text' },
  },
  generateSteps: ({ char }): ExecutionStep[] => {
    // Normalize character value (strip quotes if any, lowercase it)
    const cleanChar = String(char).replace(/['"]/g, '').toLowerCase();
    const isVowel = 'aeiou'.includes(cleanChar) && cleanChar.length > 0;
    const snap: Record<string, string | number> = { char };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the character "${cleanChar}" in the "char" variable.`,
        explanationHinglish: `"char" variable me akshar "${cleanChar}" save kiya.`,
        memorySnapshot: snap,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'char', value: `"${cleanChar}"` },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Check if "${cleanChar}" exists inside the string "aeiou". This is ${isVowel ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya "${cleanChar}" vowels ("aeiou") mein aata hai. Yeh condition ${isVowel ? 'True' : 'False'} hai.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE', inputs: ['char'], operator: 'in "aeiou"', result: isVowel ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isVowel) {
      steps.push({
        step: 3, lineNum: 3,
        explanationEnglish: 'Since it is true, run the if block and print "Vowel".',
        explanationHinglish: 'Condition True is isliye if block ke andar ja kar "Vowel" print kiya.',
        memorySnapshot: snap,
        consoleOutput: 'Vowel',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Vowel"', outputValue: 'Vowel' },
      });
    } else {
      steps.push(
        {
          step: 3, lineNum: 4,
          explanationEnglish: 'Since the condition was False, skip the if block and jump to else.',
          explanationHinglish: 'Kyunki if block chal chuka hai, else block skip ho gaya.',
          memorySnapshot: snap,
          animationEvent: { type: 'NONE' },
        },
        {
          step: 4, lineNum: 5,
          explanationEnglish: 'Run the else block and print "Consonant".',
          explanationHinglish: 'Else block execute kiya aur "Consonant" print kiya.',
          memorySnapshot: snap,
          consoleOutput: 'Consonant',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Consonant"', outputValue: 'Consonant' },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the character "e" in the "char" variable.',
      explanationHinglish: '"char" variable me akshar "e" save kiya.',
      memorySnapshot: { char: '"e"' },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'char', value: '"e"' },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Check if "e" exists inside the string "aeiou". This is True.',
      explanationHinglish: 'Check kiya kya "e" in vowels ("aeiou") mein aata hai. Yeh condition True hai.',
      memorySnapshot: { char: '"e"' },
      animationEvent: { type: 'COMPUTE', inputs: ['char'], operator: 'in "aeiou"', result: 'True', storeIn: 'Condition' },
    },
  ],
};
