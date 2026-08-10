import type { LessonProgram, ExecutionStep } from '../../types';

export const input_sum_two_numbers: LessonProgram = {
  id: 'input_sum_two_numbers',
  language: 'python',
  topic: 'user_input',
  lessonNumber: 3,
  friendlyName: 'Sum of Two Input Numbers',
  learningObjective: 'Learn inline int(input()) reading for multiple inputs and arithmetic calculation.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'num1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'int' }, { type: 'punctuation', value: '(' }, { type: 'function', value: 'input' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter num1: "' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'num2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'int' }, { type: 'punctuation', value: '(' }, { type: 'function', value: 'input' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter num2: "' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num2' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: 'f"Sum = {total}"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    num1: { default: 15, label: 'First Number' },
    num2: { default: 25, label: 'Second Number' },
  },
  generateSteps: ({ num1, num2 }): ExecutionStep[] => {
    const val1 = Number(num1) || 15;
    const val2 = Number(num2) || 25;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let mem: Record<string, string | number> = {};

    // Step 1: Read num1 directly as int
    mem.num1 = val1;
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `Read user input for num1 and convert directly using int(input()): num1 = ${val1}.`,
      explanationHinglish: `int(input()) se pehla input read karke num1 = ${val1} set kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num1', value: val1 },
    });

    // Step 2: Read num2 directly as int
    mem.num2 = val2;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Read user input for num2 and convert directly using int(input()): num2 = ${val2}.`,
      explanationHinglish: `int(input()) se doosra input read karke num2 = ${val2} set kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num2', value: val2 },
    });

    // Step 3: Compute total
    const sumVal = val1 + val2;
    mem.total = sumVal;
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Calculate total = num1 + num2 (${val1} + ${val2} = ${sumVal}).`,
      explanationHinglish: `num1 aur num2 ka addition kiya: ${val1} + ${val2} = ${sumVal}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'COMPUTE', inputs: ['num1', 'num2'], operator: '+', result: sumVal, storeIn: 'total' },
    });

    // Step 4: Print
    const outputText = `Sum = ${sumVal}`;
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Print result message: "${outputText}".`,
      explanationHinglish: `Result print kiya: "${outputText}".`,
      memorySnapshot: { ...mem },
      consoleOutput: outputText,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${outputText}"` },
    });

    return steps;
  },
  executionSteps: [],
};
