import type { LessonProgram, ExecutionStep } from '../../types';

export const input_string: LessonProgram = {
  id: 'input_string',
  language: 'python',
  topic: 'user_input',
  lessonNumber: 1,
  friendlyName: 'Read String Input',
  learningObjective: 'Learn how input() prompts for and reads text input from the user.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'name' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'input' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter your name: "' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 2, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Hello, "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '"!"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    name: { default: 'Alex', type: 'text', label: 'Input Name', noQuotes: true },
  },
  generateSteps: ({ name }): ExecutionStep[] => {
    const inputName = String(name || 'Alex').trim() || 'Alex';
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let mem: Record<string, string | number> = {};

    // Step 1: Prompt input card
    mem.name = `"${inputName}"`;
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `input() displays terminal prompt "Enter your name: " and captures user text "${inputName}".`,
      explanationHinglish: `input() ne terminal prompt "Enter your name: " dikhakar user input "${inputName}" capture kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { 
        type: 'USER_INPUT_PROMPT', 
        prompt: 'Enter your name: ', 
        variableName: 'name', 
        value: `"${inputName}"` 
      },
    });

    // Step 2: Store in variable
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `Store captured string value "${inputName}" in variable 'name'.`,
      explanationHinglish: `Captured text "${inputName}" ko variable 'name' me store kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'name', value: `"${inputName}"` },
    });

    // Step 3: Print greeting
    const greeting = `Hello, ${inputName}!`;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Concatenate string "Hello, " + name + "!" and print output.`,
      explanationHinglish: `String concatenate karke print kiya: "${greeting}".`,
      memorySnapshot: { ...mem },
      consoleOutput: greeting,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${greeting}"` },
    });

    return steps;
  },
  executionSteps: [],
};
