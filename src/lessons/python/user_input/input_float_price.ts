import type { LessonProgram, ExecutionStep } from '../../types';

export const input_float_price: LessonProgram = {
  id: 'input_float_price',
  language: 'python',
  topic: 'user_input',
  lessonNumber: 4,
  friendlyName: 'Read Float & Percentage Math',
  learningObjective: 'Learn float(input()) for decimal numbers like currency and percentage calculations.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'float' }, { type: 'punctuation', value: '(' }, { type: 'function', value: 'input' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter price: "' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.18' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'total_price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'tax' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: 'f"Total with Tax: {total_price}"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    price: { default: 500, label: 'Item Price' },
  },
  generateSteps: ({ price }): ExecutionStep[] => {
    const valPrice = Number(price) || 500;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let mem: Record<string, string | number> = {};

    // Step 1: Prompt & Float Type Cast
    mem.price = valPrice;
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `float(input()) prompts "Enter price: " and converts text "${valPrice}" to decimal float ${valPrice.toFixed(1)}.`,
      explanationHinglish: `float(input()) ne prompt "Enter price: " dikhakar text "${valPrice}" ko decimal float ${valPrice.toFixed(1)} me convert kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { 
        type: 'TYPE_CAST_TRANSFORM', 
        fromType: 'str', 
        toType: 'float', 
        fromValue: `"${valPrice}"`, 
        toValue: `${valPrice.toFixed(1)}`, 
        variableName: 'price' 
      },
    });

    // Step 2: Compute tax 18%
    const taxVal = Number((valPrice * 0.18).toFixed(2));
    mem.tax = taxVal;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Calculate 18% GST tax = price * 0.18 (${valPrice} * 0.18 = ${taxVal}).`,
      explanationHinglish: `18% tax calculate kiya = ${valPrice} * 0.18 = ${taxVal}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'COMPUTE', inputs: ['price', '0.18'], operator: '*', result: taxVal, storeIn: 'tax' },
    });

    // Step 3: Compute total_price
    const totalPriceVal = Number((valPrice + taxVal).toFixed(2));
    mem.total_price = totalPriceVal;
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Calculate total_price = price + tax (${valPrice} + ${taxVal} = ${totalPriceVal}).`,
      explanationHinglish: `Total price calculate kiya = ${valPrice} + ${taxVal} = ${totalPriceVal}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'COMPUTE', inputs: ['price', 'tax'], operator: '+', result: totalPriceVal, storeIn: 'total_price' },
    });

    // Step 4: Print
    const outputText = `Total with Tax: ${totalPriceVal}`;
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Print final bill amount: "${outputText}".`,
      explanationHinglish: `Final bill amount print kiya: "${outputText}".`,
      memorySnapshot: { ...mem },
      consoleOutput: outputText,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${outputText}"` },
    });

    return steps;
  },
  executionSteps: [],
};
