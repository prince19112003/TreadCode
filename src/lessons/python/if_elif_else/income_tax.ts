import type { LessonProgram, ExecutionStep } from '../../types';

export const income_tax: LessonProgram = {
  id: 'income_tax', language: 'python', topic: 'if_elif_else', lessonNumber: 5,
  friendlyName: 'Income Tax Slab (Basic)',
  learningObjective: 'Apply cumulative progressive tax percentages based on varying income brackets.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '700000' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '300000' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 5, tokens: [{ type: 'keyword', value: 'elif' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '600000' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '300000' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.05' }] },
    { lineNum: 7, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15000' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '600000' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.10' }] },
    { lineNum: 9, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'tax' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    income: { default: 700000, min: 0, max: 99999999, label: 'Annual Income' },
  },
  generateSteps: ({ income }): ExecutionStep[] => {
    const snapIncome: Record<string, string | number> = { income };
    const snapTaxInit: Record<string, string | number> = { income, tax: 0 };
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Store the income value ${income} in variable "income".`,
        explanationHinglish: `"income" variable me ${income} save kiya.`,
        memorySnapshot: snapIncome,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'income', value: income },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: 'Initialize "tax" variable with 0.',
        explanationHinglish: '"tax" variable ko 0 se initialize kiya.',
        memorySnapshot: snapTaxInit,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'tax', value: 0 },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Check if income <= 300000. (${income} <= 300000 is ${income <= 300000 ? 'True' : 'False'}).`,
        explanationHinglish: `Kya income 300000 ya usse kam hai? Yeh ${income <= 300000 ? 'True' : 'False'} hai.`,
        memorySnapshot: snapTaxInit,
        animationEvent: { type: 'COMPUTE', inputs: ['income'], operator: '<= 300000', result: income <= 300000 ? 'True' : 'False', storeIn: 'Condition' },
      },
    ];

    let taxVal = 0;
    if (income <= 300000) {
      taxVal = 0;
      const snapTax: Record<string, string | number> = { income, tax: taxVal };
      steps.push(
        {
          step: 4, lineNum: 4,
          explanationEnglish: 'No tax is applied for income under 300000 (tax remains 0).',
          explanationHinglish: '300000 se kam income par koi tax nahi laga (tax 0 hi raha).',
          memorySnapshot: snapTax,
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'tax', oldValue: 0, newValue: 0 },
        },
        {
          step: 5, lineNum: 9,
          explanationEnglish: `Print the tax amount (${taxVal}).`,
          explanationHinglish: `Tax amount (${taxVal}) print kiya.`,
          memorySnapshot: snapTax,
          consoleOutput: String(taxVal),
          animationEvent: { type: 'PRINT_VALUE', variableName: 'tax', outputValue: taxVal },
        }
      );
    } else {
      steps.push({
        step: 4, lineNum: 5,
        explanationEnglish: `Check if income <= 600000. (${income} <= 600000 is ${income <= 600000 ? 'True' : 'False'}).`,
        explanationHinglish: `Kya income 600000 ya usse kam hai? Yeh ${income <= 600000 ? 'True' : 'False'} hai.`,
        memorySnapshot: snapTaxInit,
        animationEvent: { type: 'COMPUTE', inputs: ['income'], operator: '<= 600000', result: income <= 600000 ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (income <= 600000) {
        const extraIncome = income - 300000;
        taxVal = parseFloat((extraIncome * 0.05).toFixed(2));
        const snapTax: Record<string, string | number> = { income, tax: taxVal };
        steps.push(
          {
            step: 5, lineNum: 6,
            explanationEnglish: `Calculate 5% tax: (${income} - 300000) * 0.05 = ${extraIncome} * 0.05 = ${taxVal}.`,
            explanationHinglish: `5% tax nikala: (${income} - 300000) * 0.05 = ${extraIncome} * 0.05 = ${taxVal}.`,
            memorySnapshot: snapTaxInit,
            animationEvent: { type: 'COMPUTE', inputs: [`(${income}-300k)`, '5%'], operator: '*', result: taxVal, storeIn: 'Calculation' },
          },
          {
            step: 6, lineNum: 6,
            explanationEnglish: `Update tax variable to ${taxVal}.`,
            explanationHinglish: `Tax variable ko update karke ${taxVal} kiya.`,
            memorySnapshot: snapTax,
            animationEvent: { type: 'UPDATE_VARIABLE', name: 'tax', oldValue: 0, newValue: taxVal },
          },
          {
            step: 7, lineNum: 9,
            explanationEnglish: `Print the calculated tax (${taxVal}).`,
            explanationHinglish: `Calculated tax (${taxVal}) print kiya.`,
            memorySnapshot: snapTax,
            consoleOutput: String(taxVal),
            animationEvent: { type: 'PRINT_VALUE', variableName: 'tax', outputValue: taxVal },
          }
        );
      } else {
        const extraIncome = income - 600000;
        taxVal = parseFloat((15000 + extraIncome * 0.10).toFixed(2));
        const snapTax: Record<string, string | number> = { income, tax: taxVal };
        steps.push(
          {
            step: 5, lineNum: 7,
            explanationEnglish: 'Skip elif block, jump to else because income is greater than 600000.',
            explanationHinglish: 'Elif block skip kiya aur else block par jump kiya kyunki income 600000 se bada hai.',
            memorySnapshot: snapTaxInit,
            animationEvent: { type: 'NONE' },
          },
          {
            step: 6, lineNum: 8,
            explanationEnglish: `Calculate tax: 15000 + (${income} - 600000) * 0.10 = 15000 + ${extraIncome} * 0.10 = ${taxVal}.`,
            explanationHinglish: `Tax nikala: 15000 + (${income} - 600000) * 0.10 = 15000 + ${extraIncome} * 0.10 = ${taxVal}.`,
            memorySnapshot: snapTaxInit,
            animationEvent: { type: 'COMPUTE', inputs: ['15000', `(${income}-600k)*10%`], operator: '+', result: taxVal, storeIn: 'Calculation' },
          },
          {
            step: 7, lineNum: 8,
            explanationEnglish: `Update tax variable to ${taxVal}.`,
            explanationHinglish: `Tax variable ko update karke ${taxVal} kiya.`,
            memorySnapshot: snapTax,
            animationEvent: { type: 'UPDATE_VARIABLE', name: 'tax', oldValue: 0, newValue: taxVal },
          },
          {
            step: 8, lineNum: 9,
            explanationEnglish: `Print the calculated tax (${taxVal}).`,
            explanationHinglish: `Calculated tax (${taxVal}) print kiya.`,
            memorySnapshot: snapTax,
            consoleOutput: String(taxVal),
            animationEvent: { type: 'PRINT_VALUE', variableName: 'tax', outputValue: taxVal },
          }
        );
      }
    }
    return steps;
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Store the income value 700000.',
      explanationHinglish: '"income" variable me 700000 save kiya.',
      memorySnapshot: { income: 700000 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'income', value: 700000 },
    },
  ],
};
