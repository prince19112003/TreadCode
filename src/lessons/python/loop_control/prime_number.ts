import type { LessonProgram, ExecutionStep } from '../../types';

export const prime_number: LessonProgram = {
  id: 'prime_number', language: 'python', topic: 'loop_control', lessonNumber: 4,
  friendlyName: 'Prime Number Checker',
  learningObjective: 'Use loop and break to determine if a number is prime.',
  editableVariables: {
    num: { default: 7, min: 2, max: 100, label: 'Number' }
  },
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'is_prime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'True' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'function', value: 'range' }, { type: 'punctuation', value: '(' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '//' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'is_prime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'False' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'break' }] },
    { lineNum: 7, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'is_prime' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Prime"' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 9, tokens: [{ type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not Prime"' }, { type: 'punctuation', value: ')' }] },
  ],
  executionSteps: [],
  generateSteps: (variables) => {
    const num = Number(variables?.num || 7);
    const maxDivisor = Math.floor(num / 2);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let mem: Record<string, string | number> = {};

    mem.num = num;
    steps.push({
      step: stepCount++, lineNum: 1,
      explanationEnglish: `Set num = ${num}.`,
      explanationHinglish: `num की value ${num} set की.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num },
    });

    mem.is_prime = 'True';
    steps.push({
      step: stepCount++, lineNum: 2,
      explanationEnglish: `Initialize is_prime = True.`,
      explanationHinglish: `is_prime = True set kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'is_prime', value: 'True' },
    });

    steps.push({
      step: stepCount++, lineNum: 3,
      explanationEnglish: `The loop will check divisors from 2 to num // 2 (${maxDivisor}).`,
      explanationHinglish: `Loop 2 se num // 2 (${maxDivisor}) tak divide karke check karega.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'NONE' },
    });

    for (let i = 2; i <= maxDivisor; i++) {
      mem.i = i;
      steps.push({
        step: stepCount++, lineNum: 3,
        explanationEnglish: `Testing divisor i = ${i}.`,
        explanationHinglish: `i की value ${i} हो गई.`,
        memorySnapshot: { ...mem },
        animationEvent: mem.i === i && Object.keys(mem).includes('i') ? { type: 'UPDATE_VARIABLE', name: 'i', oldValue: i - 1, newValue: i } : { type: 'CREATE_VARIABLE', name: 'i', value: i },
      });

      const remainder = num % i;
      const condition = remainder === 0;
      steps.push({
        step: stepCount++, lineNum: 4,
        explanationEnglish: `Check if ${num} % ${i} == 0 (${remainder} == 0). This is ${condition ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya ${num} ko ${i} se divide karne par remainder 0 aata hai. Yeh ${condition ? 'True' : 'False'} hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['num', 'i'], operator: '% i == 0', result: condition ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (condition) {
        mem.is_prime = 'False';
        steps.push({
          step: stepCount++, lineNum: 5,
          explanationEnglish: `Found a divisor (${i}). Number is not prime. Set is_prime = False.`,
          explanationHinglish: `Ek divisor mil gaya, iska matlab prime nahi hai. is_prime ko False set kiya.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'is_prime', oldValue: 'True', newValue: 'False' },
        });

        steps.push({
          step: stepCount++, lineNum: 6,
          explanationEnglish: 'The break statement stops the loop completely since we know it is not prime.',
          explanationHinglish: 'Break loop ko yahi rok dega kyunki pata chal gaya ki prime nahi hai.',
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });
        
        break;
      }
    }

    steps.push({
      step: stepCount++, lineNum: 7,
      explanationEnglish: `Check if is_prime is True. It is ${mem.is_prime}.`,
      explanationHinglish: `Check kiya kya is_prime True hai. Yeh ${mem.is_prime} hai.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'COMPUTE', inputs: ['is_prime'], operator: '== True', result: mem.is_prime === 'True' ? 'True' : 'False', storeIn: 'Condition' },
    });

    if (mem.is_prime === 'True') {
      steps.push({
        step: stepCount++, lineNum: 8,
        explanationEnglish: 'Print "Prime".',
        explanationHinglish: 'Console pe "Prime" print kiya.',
        memorySnapshot: { ...mem },
        consoleOutput: 'Prime',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Prime"', outputValue: 'Prime' },
      });
    } else {
      steps.push({
        step: stepCount++, lineNum: 10,
        explanationEnglish: 'Print "Not Prime".',
        explanationHinglish: 'Console pe "Not Prime" print kiya.',
        memorySnapshot: { ...mem },
        consoleOutput: 'Not Prime',
        animationEvent: { type: 'PRINT_VALUE', variableName: '"Not Prime"', outputValue: 'Not Prime' },
      });
    }

    return steps;
  }
};
