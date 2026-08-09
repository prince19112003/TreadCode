import type { LessonProgram, ExecutionStep } from '../../types';

export const profit_loss: LessonProgram = {
  id: 'profit_loss', language: 'python', topic: 'if_else', lessonNumber: 4,
  friendlyName: 'Profit or Loss',
  learningObjective: 'Use variables representing real-world values in an if-else decision.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'cost_price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '500' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'sell_price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '650' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sell_price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'cost_price' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Profit Made"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 5, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Loss Incurred"' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    cost_price: { default: 500, min: 0, max: 999999, label: 'Cost Price' },
    sell_price: { default: 650, min: 0, max: 999999, label: 'Selling Price' },
  },
  generateSteps: ({ cost_price, sell_price }): ExecutionStep[] => {
    const isProfit = sell_price > cost_price;
    const snap1: Record<string, string | number> = { cost_price };
    const snap2: Record<string, string | number> = { cost_price, sell_price };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the buying price (${cost_price}) in "cost_price".`,
        explanationHinglish: `Khareedne ka daam (${cost_price}) "cost_price" mein save kiya.`,
        memorySnapshot: snap1,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'cost_price', value: cost_price },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Store the selling price (${sell_price}) in "sell_price".`,
        explanationHinglish: `Bechne ka daam (${sell_price}) "sell_price" mein save kiya.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'sell_price', value: sell_price },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Check if selling price is greater than cost price (${sell_price} > ${cost_price}). It is ${isProfit ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya bechne ka daam (${sell_price}) khareed daam (${cost_price}) se zyada hai. Yeh ${isProfit ? 'True' : 'False'} hai.`,
        memorySnapshot: snap2,
        animationEvent: { type: 'COMPUTE', inputs: ['sell_price', 'cost_price'], operator: '>', result: isProfit ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    if (isProfit) {
      steps.push({
        step: 4, lineNum: 4,
        explanationEnglish: 'Since it is True, run the if block and print "Profit Made".',
        explanationHinglish: 'Condition True thi isliye if block execute hua aur "Profit Made" print hua.',
        memorySnapshot: snap2,
        consoleOutput: 'Profit Made',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Profit Made"', outputValue: 'Profit Made' },
      });
    } else {
      steps.push(
        {
          step: 4, lineNum: 5,
          explanationEnglish: 'Skip the else block because the condition was False.',
          explanationHinglish: 'Condition False hone par if block bypass ho gaya aur else block par pahunche.',
          memorySnapshot: snap2,
          animationEvent: { type: 'NONE' },
        },
        {
          step: 5, lineNum: 6,
          explanationEnglish: 'Run the else block and print "Loss Incurred".',
          explanationHinglish: 'Else block execute kiya aur "Loss Incurred" print kiya.',
          memorySnapshot: snap2,
          consoleOutput: 'Loss Incurred',
          animationEvent: { type: 'PRINT_VALUE', variableName: '"Loss Incurred"', outputValue: 'Loss Incurred' },
        }
      );
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the buying price (500) in "cost_price".',
      explanationHinglish: 'Khareedne ka daam (500) "cost_price" mein save kiya.',
      memorySnapshot: { cost_price: 500 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'cost_price', value: 500 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Store the selling price (650) in "sell_price".',
      explanationHinglish: 'Bechne ka daam (650) "sell_price" mein save kiya.',
      memorySnapshot: { cost_price: 500, sell_price: 650 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'sell_price', value: 650 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Check if selling price is greater than cost price (650 > 500). It is True.',
      explanationHinglish: 'Check kiya kya bechne ka daam khareed daam se zyada hai. Yeh True hai.',
      memorySnapshot: { cost_price: 500, sell_price: 650 },
      animationEvent: { type: 'COMPUTE', inputs: ['sell_price', 'cost_price'], operator: '>', result: 'True', storeIn: 'Condition' },
    },
  ],
};
