import type { LessonProgram, ExecutionStep } from '../../types';

export const input_integer: LessonProgram = {
  id: 'input_integer',
  language: 'python',
  topic: 'user_input',
  lessonNumber: 2,
  friendlyName: 'Read Integer & Type Casting',
  learningObjective: 'Learn how int(input()) converts text input to integer for numerical math.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'age_str' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'input' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter age: "' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'int' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'age_str' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'next_age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: 'f"Next year: {next_age}"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    age: { default: 18, min: 1, max: 100, label: 'Input Age' },
  },
  generateSteps: ({ age }): ExecutionStep[] => {
    const inputAgeVal = Number(age) || 18;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let mem: Record<string, string | number> = {};

    // Step 1: Terminal Prompt
    mem.age_str = `"${inputAgeVal}"`;
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `input() prompts "Enter age: " and receives raw text string "${inputAgeVal}".`,
      explanationHinglish: `input() ne prompt "Enter age: " dikhakar text string "${inputAgeVal}" read kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { 
        type: 'USER_INPUT_PROMPT', 
        prompt: 'Enter age: ', 
        variableName: 'age_str', 
        value: `"${inputAgeVal}"` 
      },
    });

    // Step 2: Convert to int with TypeCastBox
    mem.age = inputAgeVal;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `int("${inputAgeVal}") type casts text string "${inputAgeVal}" to integer number ${inputAgeVal}.`,
      explanationHinglish: `int("${inputAgeVal}") ne text string "${inputAgeVal}" ko integer number ${inputAgeVal} me convert kar diya.`,
      memorySnapshot: { ...mem },
      animationEvent: { 
        type: 'TYPE_CAST_TRANSFORM', 
        fromType: 'str', 
        toType: 'int', 
        fromValue: `"${inputAgeVal}"`, 
        toValue: inputAgeVal, 
        variableName: 'age' 
      },
    });

    // Step 3: Compute next_age
    const nextAgeVal = inputAgeVal + 1;
    mem.next_age = nextAgeVal;
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Calculate next_age = age + 1 (${inputAgeVal} + 1 = ${nextAgeVal}).`,
      explanationHinglish: `next_age calculate kiya = ${inputAgeVal} + 1 = ${nextAgeVal}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'COMPUTE', inputs: ['age', '1'], operator: '+', result: nextAgeVal, storeIn: 'next_age' },
    });

    // Step 4: Print
    const outputStr = `Next year: ${nextAgeVal}`;
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Print output result: "${outputStr}".`,
      explanationHinglish: `Output result print kiya: "${outputStr}".`,
      memorySnapshot: { ...mem },
      consoleOutput: outputStr,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${outputStr}"` },
    });

    return steps;
  },
  executionSteps: [],
};
