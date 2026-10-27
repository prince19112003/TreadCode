import type { LessonProgram, ExecutionStep } from '../types';

// ─── TOPIC 01: VARIABLES (5 Programs) ──────────────────────────────────────────

export const cIntVariable: LessonProgram = {
  id: 'c_int',
  language: 'c',
  topic: 'variables',
  lessonNumber: 1,
  friendlyName: 'Integer Variable',
  learningObjective: 'Understand how C allocates 4 bytes of memory for storing integers with int.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25', paramId: 'age' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Age = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'age' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    age: { default: 25, min: 1, max: 120, label: 'Age (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const age = Number(vars.age ?? 25);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare integer variable 'age' [4 Bytes] = ${age}.`,
        explanationHinglish: `Integer variable 'age' [4 Bytes] declare hua aur ${age} store hua.`,
        memorySnapshot: { age: `${age} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'age', value: age }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints Age = ${age}.`,
        explanationHinglish: `printf se Age = ${age} console pe display hua.`,
        memorySnapshot: { age: `${age} [4B]` },
        consoleOutput: `Age = ${age}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'age', outputValue: age }
      }
    ];
  },
  executionSteps: []
};

export const cFloatVariable: LessonProgram = {
  id: 'c_float',
  language: 'c',
  topic: 'variables',
  lessonNumber: 2,
  friendlyName: 'Float and Double',
  learningObjective: 'Learn decimal storage with float and double precision in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'pi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14', paramId: 'pi' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '99.99', paramId: 'price' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"pi=%.2f, price=%.2f\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'pi' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'price' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    pi: { default: 3.14, label: 'pi (float)' },
    price: { default: 99.99, label: 'price (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const pi = Number(vars.pi ?? 3.14);
    const price = Number(vars.price ?? 99.99);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare float pi = ${pi} [4 Bytes].`,
        explanationHinglish: `Float variable pi [4 Bytes] memory me store hua.`,
        memorySnapshot: { pi: `${pi} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'pi', value: pi }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare double price = ${price} [8 Bytes].`,
        explanationHinglish: `Double variable price [8 Bytes] memory me store hua.`,
        memorySnapshot: { pi: `${pi} [4B]`, price: `${price} [8B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'price', value: price }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `printf outputs float and double decimal numbers.`,
        explanationHinglish: `printf se pi aur price print hue.`,
        memorySnapshot: { pi: `${pi} [4B]`, price: `${price} [8B]` },
        consoleOutput: `pi=${pi.toFixed(2)}, price=${price.toFixed(2)}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `pi=${pi.toFixed(2)}, price=${price.toFixed(2)}` }
      }
    ];
  },
  executionSteps: []
};

export const cCharVariable: LessonProgram = {
  id: 'c_char',
  language: 'c',
  topic: 'variables',
  lessonNumber: 3,
  friendlyName: 'Char and ASCII',
  learningObjective: 'Learn how C stores single characters using 1-byte ASCII codes.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade: %c (ASCII: %d)\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Declare char grade = 'A' [1 Byte] (ASCII value 65).",
      explanationHinglish: "Character 'A' ASCII code 65 ke roop me 1 byte memory leta hai.",
      memorySnapshot: { grade: "'A' [1B / ASCII 65]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'A'" }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "printf displays 'A' with %c and 65 with %d.",
      explanationHinglish: "printf %c se 'A' aur %d se ASCII 65 display karta hai.",
      memorySnapshot: { grade: "'A' [1B / ASCII 65]" },
      consoleOutput: 'Grade: A (ASCII: 65)',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: 'Grade: A (ASCII: 65)' }
    }
  ],
  executionSteps: []
};



export const c_swap_temp: LessonProgram = {
  id: 'c_swap_temp',
  language: 'c',
  topic: 'variables',
  lessonNumber: 4,
  friendlyName: 'Swap with Temp',
  learningObjective: 'Learn variable value swapping using a third temporary memory slot in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'b' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"After swap: a=%d, b=%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a: { default: 10, min: -100, max: 100, label: 'Value A (int)' },
    b: { default: 20, min: -100, max: 100, label: 'Value B (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a = Number(vars?.a ?? 10);
    const b = Number(vars?.b ?? 20);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Allocate integers: a = ${a}, b = ${b}, temp = uninitialized.`,
        explanationHinglish: `Memory me a = ${a}, b = ${b} aur temp allocate hue.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, temp: '? [4B]' },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'a', value: a },
            { name: 'b', value: b },
            { name: 'temp', value: '?' }
          ]
        }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `temp = a; Backup value of a (${a}) into temp slot.`,
        explanationHinglish: `temp = a; a ki value (${a}) temp variable me copy ho gayi.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, temp: `${a} [4B]` },
        animationEvent: { type: 'COPY_VALUE' as const, from: 'a', to: 'temp', value: a }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `a = b; Overwrite a with b's value (${b}).`,
        explanationHinglish: `a = b; a ke andar b ki value (${b}) overwrite ho gayi.`,
        memorySnapshot: { a: `${b} [4B]`, b: `${b} [4B]`, temp: `${a} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: a, newValue: b, formula: `a = ${b}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `b = temp; Transfer original value of a (${a}) from temp into b.`,
        explanationHinglish: `b = temp; temp me rakhi puraani value (${a}) ab b me aa gayi. Swapping complete!`,
        memorySnapshot: { a: `${b} [4B]`, b: `${a} [4B]`, temp: `${a} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'b', oldValue: b, newValue: a, formula: `b = ${a}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `printf prints swapped values: a=${b}, b=${a}.`,
        explanationHinglish: `printf se console pe a=${b}, b=${a} output display hua.`,
        memorySnapshot: { a: `${b} [4B]`, b: `${a} [4B]`, temp: `${a} [4B]` },
        consoleOutput: `After swap: a=${b}, b=${a}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'swap', outputValue: `a=${b}, b=${a}` }
      }
    ];
  },
  executionSteps: []
};

export const c_swap_no_temp: LessonProgram = {
  id: 'c_swap_no_temp',
  language: 'c',
  topic: 'variables',
  lessonNumber: 5,
  friendlyName: 'Swap without Temp',
  learningObjective: 'Swap two variables using arithmetic addition and subtraction without extra memory.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '30', paramId: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Swapped: a=%d, b=%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a: { default: 15, min: -100, max: 100, label: 'Value A (int)' },
    b: { default: 30, min: -100, max: 100, label: 'Value B (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a = Number(vars?.a ?? 15);
    const b = Number(vars?.b ?? 30);
    const sum = a + b;
    const newB = sum - b; // original a
    const newA = sum - newB; // original b

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare integers: a = ${a}, b = ${b}.`,
        explanationHinglish: `a = ${a} aur b = ${b} declare hue.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]` },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'a', value: a },
            { name: 'b', value: b }
          ]
        }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `a = a + b; Combine both numbers: ${a} + ${b} = ${sum}.`,
        explanationHinglish: `a = a + b; dono ka sum (${a} + ${b} = ${sum}) a me store hua.`,
        memorySnapshot: { a: `${sum} [4B]`, b: `${b} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: a, newValue: sum, formula: `${a} + ${b} = ${sum}` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `b = a - b; Extract original a: ${sum} - ${b} = ${newB}. Now b holds ${newB}!`,
        explanationHinglish: `b = a - b; sum me se b subtract kiya (${sum} - ${b} = ${newB}). Ab b = ${newB} ban gaya!`,
        memorySnapshot: { a: `${sum} [4B]`, b: `${newB} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'b', oldValue: b, newValue: newB, formula: `${sum} - ${b} = ${newB}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `a = a - b; Extract original b: ${sum} - ${newB} = ${newA}. Swapping complete!`,
        explanationHinglish: `a = a - b; sum me se naya b subtract kiya (${sum} - ${newB} = ${newA}). Swapping ho gayi!`,
        memorySnapshot: { a: `${newA} [4B]`, b: `${newB} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: sum, newValue: newA, formula: `${sum} - ${newB} = ${newA}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `printf prints swapped values: a=${newA}, b=${newB}.`,
        explanationHinglish: `printf se console pe a=${newA}, b=${newB} print hua.`,
        memorySnapshot: { a: `${newA} [4B]`, b: `${newB} [4B]` },
        consoleOutput: `Swapped: a=${newA}, b=${newB}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'swap', outputValue: `a=${newA}, b=${newB}` }
      }
    ];
  },
  executionSteps: []
};




export const c_arithmetic: LessonProgram = {
  id: 'c_arithmetic',
  language: 'c',
  topic: 'operators',
  lessonNumber: 1,
  friendlyName: 'Arithmetic Operators',
  learningObjective: 'Demonstrate all 5 C arithmetic operators (+, -, *, /, %) with integer division vs modulo.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '6', paramId: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diff' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'prod' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'quot' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"+:%d, -:%d, *:%d, /:%d, %%:%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diff' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'prod' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'quot' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a: { default: 20, min: -100, max: 100, label: 'Operand a (int)' },
    b: { default: 6, min: 1, max: 100, label: 'Operand b (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a = Number(vars?.a ?? 20);
    const b = Number(vars?.b ?? 6) || 1;
    const sum = a + b;
    const diff = a - b;
    const prod = a * b;
    const quot = Math.trunc(a / b);
    const rem = a % b;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare inputs: int a = ${a}, int b = ${b}.`,
        explanationHinglish: `Operands a = ${a} aur b = ${b} declare hue.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]` },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'a', value: a },
            { name: 'b', value: b }
          ]
        }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Addition: sum = a + b = ${a} + ${b} = ${sum}.`,
        explanationHinglish: `Addition: sum = ${a} + ${b} = ${sum}.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, sum: `${sum} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${a}`, `${b}`], operator: '+', result: sum, storeIn: 'sum', formula: `${a} + ${b} = ${sum}` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Subtraction: diff = a - b = ${a} - ${b} = ${diff}.`,
        explanationHinglish: `Subtraction: diff = ${a} - ${b} = ${diff}.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, sum: `${sum} [4B]`, diff: `${diff} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${a}`, `${b}`], operator: '-', result: diff, storeIn: 'diff', formula: `${a} - ${b} = ${diff}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `Multiplication: prod = a * b = ${a} * ${b} = ${prod}.`,
        explanationHinglish: `Multiplication: prod = ${a} * ${b} = ${prod}.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, sum: `${sum} [4B]`, diff: `${diff} [4B]`, prod: `${prod} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${a}`, `${b}`], operator: '*', result: prod, storeIn: 'prod', formula: `${a} * ${b} = ${prod}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `Integer Division: quot = a / b = ${a} / ${b} = ${quot} (discards decimals).`,
        explanationHinglish: `Integer Division: quot = ${a} / ${b} = ${quot} (C me fractional part cut ho jata hai).`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, sum: `${sum} [4B]`, diff: `${diff} [4B]`, prod: `${prod} [4B]`, quot: `${quot} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${a}`, `${b}`], operator: '/', result: quot, storeIn: 'quot', formula: `${a} / ${b} = ${quot}` }
      },
      {
        step: 6, lineNum: 8,
        explanationEnglish: `Modulo (Remainder): rem = a % b = ${a} % ${b} = ${rem}.`,
        explanationHinglish: `Modulo Operator: rem = ${a} % ${b} = ${rem} (division ke baad bacha remainder).`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, sum: `${sum} [4B]`, diff: `${diff} [4B]`, prod: `${prod} [4B]`, quot: `${quot} [4B]`, rem: `${rem} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${a}`, `${b}`], operator: '%', result: rem, storeIn: 'rem', formula: `${a} % ${b} = ${rem}` }
      },
      {
        step: 7, lineNum: 9,
        explanationEnglish: `printf outputs all arithmetic results: +:${sum}, -:${diff}, *:${prod}, /:${quot}, %:${rem}.`,
        explanationHinglish: `printf se sabhi arithmetic calculations console pe display hue.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, sum: `${sum} [4B]`, diff: `${diff} [4B]`, prod: `${prod} [4B]`, quot: `${quot} [4B]`, rem: `${rem} [4B]` },
        consoleOutput: `+:${sum}, -:${diff}, *:${prod}, /:${quot}, %:${rem}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `+:${sum}, -:${diff}, *:${prod}, /:${quot}, %:${rem}` }
      }
    ];
  },
  executionSteps: []
};

export const c_relational_logical: LessonProgram = {
  id: 'c_relational_logical',
  language: 'c',
  topic: 'operators',
  lessonNumber: 2,
  friendlyName: 'Relational & Logical',
  learningObjective: 'Evaluate relational comparisons and logical compound conditions (AND, OR, NOT) in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'x' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25', paramId: 'y' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'is_less' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'is_equal' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'and_cond' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&&' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'or_cond' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'not_cond' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"<:%d, ==:%d, &&:%d, ||:%d, !:%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'is_less' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'is_equal' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'and_cond' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'or_cond' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'not_cond' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    x: { default: 10, min: -100, max: 100, label: 'x (int)' },
    y: { default: 25, min: -100, max: 100, label: 'y (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const x = Number(vars?.x ?? 10);
    const y = Number(vars?.y ?? 25);
    const isLess = x < y ? 1 : 0;
    const isEqual = x === y ? 1 : 0;
    const andCond = (x > 0 && y > 20) ? 1 : 0;
    const orCond = (x === 0 || y > 0) ? 1 : 0;
    const notCond = !(x === y) ? 1 : 0;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare integers: x = ${x}, y = ${y}. In C, boolean TRUE is 1 and FALSE is 0.`,
        explanationHinglish: `x = ${x} aur y = ${y} declare hue. C me TRUE ka matlab 1 aur FALSE ka matlab 0 hota hai.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]` },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'x', value: x },
            { name: 'y', value: y }
          ]
        }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Relational (<): (${x} < ${y}) evaluates to ${isLess} (${isLess ? 'TRUE' : 'FALSE'}).`,
        explanationHinglish: `Relational (<): (${x} < ${y}) ka result ${isLess} (${isLess ? 'TRUE' : 'FALSE'}) mila.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, is_less: `${isLess} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${x}`, `${y}`], operator: '<', result: isLess, storeIn: 'is_less', formula: `${x} < ${y} → ${isLess}` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Relational (==): (${x} == ${y}) evaluates to ${isEqual} (${isEqual ? 'TRUE' : 'FALSE'}).`,
        explanationHinglish: `Relational (==): (${x} == ${y}) equality check hua → result ${isEqual}.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, is_less: `${isLess} [4B]`, is_equal: `${isEqual} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${x}`, `${y}`], operator: '==', result: isEqual, storeIn: 'is_equal', formula: `${x} == ${y} → ${isEqual}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `Logical AND (&&): (${x} > 0 && ${y} > 20) evaluates to ${andCond}. Both conditions must be TRUE.`,
        explanationHinglish: `Logical AND (&&): dono conditions check hui → result ${andCond}.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, is_less: `${isLess} [4B]`, is_equal: `${isEqual} [4B]`, and_cond: `${andCond} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${x}>0`, `${y}>20`], operator: '&&', result: andCond, storeIn: 'and_cond', formula: `(${x}>0 && ${y}>20) → ${andCond}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `Logical OR (||): (${x} == 0 || ${y} > 0) evaluates to ${orCond}. At least one condition must be TRUE.`,
        explanationHinglish: `Logical OR (||): koi ek condition TRUE hone par result 1 hota hai → result ${orCond}.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, is_less: `${isLess} [4B]`, is_equal: `${isEqual} [4B]`, and_cond: `${andCond} [4B]`, or_cond: `${orCond} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${x}==0`, `${y}>0`], operator: '||', result: orCond, storeIn: 'or_cond', formula: `(${x}==0 || ${y}>0) → ${orCond}` }
      },
      {
        step: 6, lineNum: 8,
        explanationEnglish: `Logical NOT (!): !(${x} == ${y}) inverts condition to ${notCond}.`,
        explanationHinglish: `Logical NOT (!): result invert ho gaya → ${notCond}.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, is_less: `${isLess} [4B]`, is_equal: `${isEqual} [4B]`, and_cond: `${andCond} [4B]`, or_cond: `${orCond} [4B]`, not_cond: `${notCond} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${isEqual}`], operator: '!', result: notCond, storeIn: 'not_cond', formula: `!(${x}==${y}) → ${notCond}` }
      },
      {
        step: 7, lineNum: 9,
        explanationEnglish: `printf prints all relational & logical results: <:${isLess}, ==:${isEqual}, &&:${andCond}, ||:${orCond}, !:${notCond}.`,
        explanationHinglish: `printf se console pe sabhi condition results display hue.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, is_less: `${isLess} [4B]`, is_equal: `${isEqual} [4B]`, and_cond: `${andCond} [4B]`, or_cond: `${orCond} [4B]`, not_cond: `${notCond} [4B]` },
        consoleOutput: `<:${isLess}, ==:${isEqual}, &&:${andCond}, ||:${orCond}, !:${notCond}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `<:${isLess}, ==:${isEqual}, &&:${andCond}, ||:${orCond}, !:${notCond}` }
      }
    ];
  },
  executionSteps: []
};

export const c_inc_dec: LessonProgram = {
  id: 'c_inc_dec',
  language: 'c',
  topic: 'operators',
  lessonNumber: 3,
  friendlyName: 'Increment & Decrement',
  learningObjective: 'Master prefix vs postfix increment and decrement memory evaluation timing in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'x' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'y' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'pre' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'operator', value: '++' }, { type: 'variable', value: 'x' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '    ' }, { type: 'comment', value: '// Step 1: x increments to 6, Step 2: pre gets 6' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'post' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '   ' }, { type: 'comment', value: '// Step 1: post gets old 5, Step 2: y increments to 6' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"pre=%d (x=%d), post=%d (y=%d)\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'pre' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'post' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    x: { default: 5, min: -50, max: 50, label: 'Initial x (int)' },
    y: { default: 5, min: -50, max: 50, label: 'Initial y (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const x = Number(vars?.x ?? 5);
    const y = Number(vars?.y ?? 5);
    const preVal = x + 1;
    const postVal = y;
    const finalY = y + 1;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize x = ${x}, y = ${y}.`,
        explanationHinglish: `x = ${x} aur y = ${y} initialize hue.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]` },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'x', value: x },
            { name: 'y', value: y }
          ]
        }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `PRE-INCREMENT (++x): 1. Memory increments x from ${x} to ${preVal} first. 2. Value ${preVal} is assigned to pre.`,
        explanationHinglish: `PRE-INCREMENT (++x): Pehle x ki value badhkar ${preVal} hui, phir wahi nayi value (${preVal}) 'pre' me store hui.`,
        memorySnapshot: { x: `${preVal} [4B]`, y: `${y} [4B]`, pre: `${preVal} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'x', oldValue: x, newValue: preVal, formula: `++${x} → ${preVal} (assigned to pre)` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `POST-INCREMENT (y++): 1. Current value ${postVal} is assigned to post first. 2. Then y increments in memory to ${finalY}.`,
        explanationHinglish: `POST-INCREMENT (y++): Pehle puraani value (${postVal}) 'post' ko mili, uske baad y memory me badhkar ${finalY} hua.`,
        memorySnapshot: { x: `${preVal} [4B]`, y: `${finalY} [4B]`, pre: `${preVal} [4B]`, post: `${postVal} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'y', oldValue: y, newValue: finalY, formula: `${y}++ → post got ${postVal}, y became ${finalY}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `printf shows the difference: pre=${preVal} (x=${preVal}), post=${postVal} (y=${finalY}).`,
        explanationHinglish: `printf se clear hua: pre=${preVal} aur post=${postVal}.`,
        memorySnapshot: { x: `${preVal} [4B]`, y: `${finalY} [4B]`, pre: `${preVal} [4B]`, post: `${postVal} [4B]` },
        consoleOutput: `pre=${preVal} (x=${preVal}), post=${postVal} (y=${finalY})`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `pre=${preVal} (x=${preVal}), post=${postVal} (y=${finalY})` }
      }
    ];
  },
  executionSteps: []
};

export const c_circle_geometry: LessonProgram = {
  id: 'c_circle_geometry',
  language: 'c',
  topic: 'operators',
  lessonNumber: 4,
  friendlyName: 'Circle Area',
  learningObjective: 'Apply float arithmetic formulas for geometric calculation in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7.0', paramId: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14159' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'circumference' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14159' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Area = %.2f, Circumference = %.2f\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'circumference' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    radius: { default: 7.0, label: 'Radius (float)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const radius = Number(vars?.radius ?? 7.0);
    const area = 3.14159 * radius * radius;
    const circumference = 2 * 3.14159 * radius;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare float radius = ${radius.toFixed(2)} [4 Bytes IEEE 754].`,
        explanationHinglish: `Float radius = ${radius.toFixed(2)} memory me store hua.`,
        memorySnapshot: { radius: `${radius.toFixed(2)} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'radius', value: radius.toFixed(2) }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Calculate Area = π * r² = 3.14159 * ${radius} * ${radius} = ${area.toFixed(2)}.`,
        explanationHinglish: `Area formula (π * r²) calculate hua → ${area.toFixed(2)}.`,
        memorySnapshot: { radius: `${radius.toFixed(2)} [4B]`, area: `${area.toFixed(2)} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['3.14159', `${radius}`, `${radius}`], operator: '*', result: area.toFixed(2), storeIn: 'area', formula: `π * r² = ${area.toFixed(2)}` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Calculate Circumference = 2 * π * r = 2 * 3.14159 * ${radius} = ${circumference.toFixed(2)}.`,
        explanationHinglish: `Circumference formula (2 * π * r) calculate hua → ${circumference.toFixed(2)}.`,
        memorySnapshot: { radius: `${radius.toFixed(2)} [4B]`, area: `${area.toFixed(2)} [4B]`, circumference: `${circumference.toFixed(2)} [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['2', '3.14159', `${radius}`], operator: '*', result: circumference.toFixed(2), storeIn: 'circumference', formula: `2 * π * r = ${circumference.toFixed(2)}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `printf outputs geometric results: Area = ${area.toFixed(2)}, Circumference = ${circumference.toFixed(2)}.`,
        explanationHinglish: `printf se Area = ${area.toFixed(2)}, Circumference = ${circumference.toFixed(2)} print hua.`,
        memorySnapshot: { radius: `${radius.toFixed(2)} [4B]`, area: `${area.toFixed(2)} [4B]`, circumference: `${circumference.toFixed(2)} [4B]` },
        consoleOutput: `Area = ${area.toFixed(2)}, Circumference = ${circumference.toFixed(2)}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Area = ${area.toFixed(2)}, Circumference = ${circumference.toFixed(2)}` }
      }
    ];
  },
  executionSteps: []
};

export const c_temp_converter: LessonProgram = {
  id: 'c_temp_converter',
  language: 'c',
  topic: 'operators',
  lessonNumber: 5,
  friendlyName: 'Celsius to Fahrenheit',
  learningObjective: 'Master operator precedence and float conversion formula (F = (C * 9/5) + 32) in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'celsius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25.0', paramId: 'celsius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fahrenheit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'celsius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '9.0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '5.0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '32.0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%.1f C = %.1f F\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'celsius' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fahrenheit' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    celsius: { default: 25.0, label: 'Celsius (°C)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const celsius = Number(vars?.celsius ?? 25.0);
    const fahrenheit = (celsius * 9.0 / 5.0) + 32.0;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare float celsius = ${celsius.toFixed(1)} °C.`,
        explanationHinglish: `Celsius temperature = ${celsius.toFixed(1)} °C memory me store hua.`,
        memorySnapshot: { celsius: `${celsius.toFixed(1)}°C [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'celsius', value: `${celsius.toFixed(1)}°C` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Convert: (${celsius} * 9.0 / 5.0) + 32.0 = ${fahrenheit.toFixed(1)} °F. Note: Using 9.0/5.0 prevents integer truncation (9/5 would be 1).`,
        explanationHinglish: `Conversion formula evaluate hua: (${celsius} * 9.0 / 5.0) + 32 = ${fahrenheit.toFixed(1)} °F (9.0/5.0 float division use kiya).`,
        memorySnapshot: { celsius: `${celsius.toFixed(1)}°C [4B]`, fahrenheit: `${fahrenheit.toFixed(1)}°F [4B]` },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`${celsius.toFixed(1)}`, '9.0/5.0', '32.0'], operator: '+', result: `${fahrenheit.toFixed(1)}°F`, storeIn: 'fahrenheit', formula: `(${celsius} * 9/5) + 32 = ${fahrenheit.toFixed(1)}°F` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `printf prints converted temperatures: ${celsius.toFixed(1)} C = ${fahrenheit.toFixed(1)} F.`,
        explanationHinglish: `printf se console pe ${celsius.toFixed(1)} C = ${fahrenheit.toFixed(1)} F print hua.`,
        memorySnapshot: { celsius: `${celsius.toFixed(1)}°C [4B]`, fahrenheit: `${fahrenheit.toFixed(1)}°F [4B]` },
        consoleOutput: `${celsius.toFixed(1)} C = ${fahrenheit.toFixed(1)} F`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${celsius.toFixed(1)} C = ${fahrenheit.toFixed(1)} F` }
      }
    ];
  },
  executionSteps: []
};


export const c_scanf_integer: LessonProgram = {
  id: 'c_scanf_integer',
  language: 'c',
  topic: 'user_input',
  lessonNumber: 1,
  friendlyName: 'Read Integer',
  learningObjective: 'Master user input in C using scanf with format specifier %d and address-of operator (&).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter an integer: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'scanf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// stdin: ' }, { type: 'number', value: '42', paramId: 'num' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"You entered: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    num: { default: 42, min: -9999, max: 9999, label: 'User Input (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const inputVal = Number(vars?.num ?? 42);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: "Declare integer variable 'num' [4 Bytes] in memory (currently holds uninitialized garbage).",
        explanationHinglish: "Integer variable 'num' [4 Bytes] memory me declare hua (abhi uninitialized hai).",
        memorySnapshot: { num: '? [4B garbage]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: '?' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'printf displays console prompt: "Enter an integer: ".',
        explanationHinglish: 'printf ne console pe message show kiya: "Enter an integer: ".',
        memorySnapshot: { num: '? [4B]' },
        consoleOutput: 'Enter an integer: ',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'prompt', outputValue: 'Enter an integer: ' }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `User inputs "${inputVal}". scanf filters it via '%d' and writes integer ${inputVal} directly into memory address &num (0x7ffd4).`,
        explanationHinglish: `User ne "${inputVal}" type kiya. scanf ne '%d' filter se parse karke memory address &num (0x7ffd4) pe store kar diya.`,
        memorySnapshot: { num: `${inputVal} [4B]` },
        animationEvent: {
          type: 'C_FORMAT_SPECIFIER' as const,
          specifier: '%d',
          variableName: 'num',
          rawValue: inputVal,
          memoryAddress: '0x7ffd4',
          actionType: 'scanf',
          byteSize: 4
        }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `printf reads value from 'num' and formats with '%d' to output: You entered: ${inputVal}.`,
        explanationHinglish: `printf ne '%d' specifier se num ki value read karke console pe print kar di: You entered: ${inputVal}.`,
        memorySnapshot: { num: `${inputVal} [4B]` },
        consoleOutput: `Enter an integer: \nYou entered: ${inputVal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `You entered: ${inputVal}` }
      }
    ];
  },
  executionSteps: []
};

export const c_scanf_float: LessonProgram = {
  id: 'c_scanf_float',
  language: 'c',
  topic: 'user_input',
  lessonNumber: 2,
  friendlyName: 'Read Float',
  learningObjective: 'Understand reading decimal numbers in C using %f for float and %lf for double.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter radius: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'scanf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%f"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// stdin: ' }, { type: 'number', value: '5.5', paramId: 'radius' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Radius: %.2f\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    radius: { default: 5.5, label: 'Radius (float)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const radius = Number(vars?.radius ?? 5.5);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: "Declare float variable 'radius' [4 Bytes IEEE 754].",
        explanationHinglish: "Float variable 'radius' [4 Bytes] memory me allocate hua.",
        memorySnapshot: { radius: '? [4B Float]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'radius', value: '?' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'printf prompts user to enter decimal radius.',
        explanationHinglish: 'printf se console pe radius input karne ka message display hua.',
        memorySnapshot: { radius: '? [4B]' },
        consoleOutput: 'Enter radius: ',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'prompt', outputValue: 'Enter radius: ' }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `scanf reads input "${radius}" with specifier '%f' and writes float value into &radius address (0x7ffd8).`,
        explanationHinglish: `scanf '%f' specifier ke sath "${radius}" ko read karke &radius ke memory address pe store karta hai.`,
        memorySnapshot: { radius: `${radius.toFixed(2)} [4B]` },
        animationEvent: {
          type: 'C_FORMAT_SPECIFIER' as const,
          specifier: '%f',
          variableName: 'radius',
          rawValue: radius.toFixed(2),
          memoryAddress: '0x7ffd8',
          actionType: 'scanf',
          byteSize: 4
        }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `printf with '%.2f' outputs formatted decimal: Radius: ${radius.toFixed(2)}.`,
        explanationHinglish: `printf '%.2f' format se 2 decimal places tak Radius: ${radius.toFixed(2)} print karta hai.`,
        memorySnapshot: { radius: `${radius.toFixed(2)} [4B]` },
        consoleOutput: `Enter radius: \nRadius: ${radius.toFixed(2)}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Radius: ${radius.toFixed(2)}` }
      }
    ];
  },
  executionSteps: []
};

export const c_scanf_string: LessonProgram = {
  id: 'c_scanf_string',
  language: 'c',
  topic: 'user_input',
  lessonNumber: 3,
  friendlyName: 'Read String',
  learningObjective: 'Understand how scanf with %s reads words into a char array and automatically adds null-terminator (\\0).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '20' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter your name: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'scanf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%s"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// stdin: "' }, { type: 'string', value: 'Alex', paramId: 'name' }, { type: 'comment', value: '"' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Hello, %s!\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    name: { default: 'Alex', type: 'text', label: 'Name (string)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const name = String(vars?.name ?? 'Alex').trim() || 'Alex';
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: "Declare character array 'name[20]' [20 Bytes]. In C, arrays act as direct memory pointers.",
        explanationHinglish: "Character array 'name[20]' [20 Bytes] allocate hua. C me array name khud ek memory address hota hai.",
        memorySnapshot: { name: 'uninitialized [20B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'name[20]', value: 'empty buffer' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'printf prints "Enter your name: " on terminal.',
        explanationHinglish: 'printf se terminal pe "Enter your name: " message display hua.',
        memorySnapshot: { name: 'uninitialized [20B]' },
        consoleOutput: 'Enter your name: ',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'prompt', outputValue: 'Enter your name: ' }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `scanf reads string "${name}" via '%s'. Notice no '&' needed because array 'name' already decays to base address (0x7ffe0). It appends '\\0' at the end.`,
        explanationHinglish: `scanf '%s' se string "${name}" read karta hai. Array name already base address (0x7ffe0) hai isliye '&' ki zaroorat nahi hoti. End me '\\0' automatically lag jata hai.`,
        memorySnapshot: { name: `"${name}\\0" [20B]` },
        animationEvent: {
          type: 'C_FORMAT_SPECIFIER' as const,
          specifier: '%s',
          variableName: 'name',
          rawValue: name,
          memoryAddress: '0x7ffe0',
          actionType: 'scanf',
          byteSize: 20
        }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `printf with '%s' traverses characters from memory until it finds '\\0' sentinel: Hello, ${name}!`,
        explanationHinglish: `printf '%s' memory me se characters read karke jab tak '\\0' na mile print karta hai: Hello, ${name}!`,
        memorySnapshot: { name: `"${name}\\0" [20B]` },
        consoleOutput: `Enter your name: \nHello, ${name}!`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Hello, ${name}!` }
      }
    ];
  },
  executionSteps: []
};



export const c_implicit_casting: LessonProgram = {
  id: 'c_implicit_casting',
  language: 'c',
  topic: 'type_casting',
  lessonNumber: 1,
  friendlyName: 'Implicit Casting',
  learningObjective: 'Understand automatic widening conversion where C safely promotes int (4B) to double (8B) without precision loss.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '42', paramId: 'count' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '    ' }, { type: 'comment', value: '// Automatic widening: 42 -> 42.0' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"int: %d, double: %.2f\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    count: { default: 42, min: 1, max: 9999, label: 'Integer count (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const count = Number(vars?.count ?? 42);
    const total = count;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare integer variable: int count = ${count} [4 Bytes].`,
        explanationHinglish: `Integer variable 'count' = ${count} [4 Bytes] memory me allocate hua.`,
        memorySnapshot: { count: `${count} [4B int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'count', value: count }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Implicit Type Promotion: C automatically converts integer ${count} [4 Bytes] to double ${total.toFixed(2)} [8 Bytes] without data loss.`,
        explanationHinglish: `Automatic Widening: C ne integer ${count} [4B] ko bina kisi loss ke double ${total.toFixed(2)} [8B] me promote kar diya.`,
        memorySnapshot: { count: `${count} [4B int]`, total: `${total.toFixed(2)} [8B double]` },
        animationEvent: {
          type: 'TYPE_CAST_TRANSFORM' as const,
          fromType: 'int',
          toType: 'double',
          fromValue: count,
          toValue: total.toFixed(2),
          variableName: 'total'
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `printf prints both original int and promoted double: int: ${count}, double: ${total.toFixed(2)}.`,
        explanationHinglish: `printf se console pe int: ${count} aur double: ${total.toFixed(2)} display hua.`,
        memorySnapshot: { count: `${count} [4B int]`, total: `${total.toFixed(2)} [8B double]` },
        consoleOutput: `int: ${count}, double: ${total.toFixed(2)}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `int: ${count}, double: ${total.toFixed(2)}` }
      }
    ];
  },
  executionSteps: []
};

export const c_explicit_casting: LessonProgram = {
  id: 'c_explicit_casting',
  language: 'c',
  topic: 'type_casting',
  lessonNumber: 2,
  friendlyName: 'Explicit Casting',
  learningObjective: 'Master manual type casting syntax ((type)value) and understand decimal fraction truncation in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'price' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '99.75', paramId: 'price' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'truncated' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: ')' }, { type: 'variable', value: 'price' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '    ' }, { type: 'comment', value: '// Explicit cast chops .75' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"double: %.2f -> int: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'price' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'truncated' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    price: { default: 99.75, label: 'Double price' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const price = Number(vars?.price ?? 99.75);
    const truncated = Math.trunc(price);

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare double price = ${price.toFixed(2)} [8 Bytes].`,
        explanationHinglish: `Double price = ${price.toFixed(2)} memory me declare hua.`,
        memorySnapshot: { price: `${price.toFixed(2)} [8B double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'price', value: price.toFixed(2) }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Explicit Cast (int)price: C forcibly truncates fractional part (.${(price % 1).toFixed(2).slice(2)}) $\\rightarrow$ stores integer ${truncated} in 4-byte box.`,
        explanationHinglish: `Explicit Cast (int)price: C ne decimal part ko chop (truncate) karke integer ${truncated} bana diya.`,
        memorySnapshot: { price: `${price.toFixed(2)} [8B double]`, truncated: `${truncated} [4B int]` },
        animationEvent: {
          type: 'TYPE_CAST_TRANSFORM' as const,
          fromType: 'double',
          toType: 'int',
          fromValue: price.toFixed(2),
          toValue: truncated,
          variableName: 'truncated'
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `printf shows truncated result: double: ${price.toFixed(2)} -> int: ${truncated}.`,
        explanationHinglish: `printf se console pe truncated result double: ${price.toFixed(2)} -> int: ${truncated} display hua.`,
        memorySnapshot: { price: `${price.toFixed(2)} [8B double]`, truncated: `${truncated} [4B int]` },
        consoleOutput: `double: ${price.toFixed(2)} -> int: ${truncated}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `double: ${price.toFixed(2)} -> int: ${truncated}` }
      }
    ];
  },
  executionSteps: []
};

export const c_char_ascii: LessonProgram = {
  id: 'c_char_ascii',
  language: 'c',
  topic: 'type_casting',
  lessonNumber: 3,
  friendlyName: 'Char to ASCII',
  learningObjective: 'Understand how character symbols convert directly to their underlying 1-byte integer ASCII code in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ascii_code' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: ')' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '    ' }, { type: 'comment', value: "// 'A' -> ASCII 65" }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Char: \'%c\' <-> ASCII: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ascii_code' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Declare char ch = 'A' [1 Byte].",
      explanationHinglish: "Character ch = 'A' memory me store hua.",
      memorySnapshot: { ch: "'A' [1B / ASCII 65]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: "'A'" }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "Explicit Cast (int)ch: Extracts underlying ASCII numerical value 65 from character 'A'.",
      explanationHinglish: "Explicit Cast (int)ch se character 'A' ka underlying ASCII code 65 nikal kar integer box me store hua.",
      memorySnapshot: { ch: "'A' [1B]", ascii_code: '65 [4B int]' },
      animationEvent: {
        type: 'TYPE_CAST_TRANSFORM' as const,
        fromType: 'char',
        toType: 'int',
        fromValue: "'A'",
        toValue: 65,
        variableName: 'ascii_code'
      }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: "printf outputs character alongside ASCII code: Char: 'A' <-> ASCII: 65.",
      explanationHinglish: "printf se console pe Char: 'A' aur ASCII: 65 display hua.",
      memorySnapshot: { ch: "'A' [1B]", ascii_code: '65 [4B int]' },
      consoleOutput: "Char: 'A' <-> ASCII: 65",
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: "Char: 'A' <-> ASCII: 65" }
    }
  ],
  executionSteps: []
};


export const c_even_odd: LessonProgram = {
  id: 'c_even_odd',
  language: 'c',
  topic: 'if_else',
  lessonNumber: 1,
  friendlyName: 'Even or Odd',
  learningObjective: 'Learn conditional branching in C using modulo (%) remainder check and if-else statements.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is EVEN\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is ODD\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    num: { default: 7, min: -1000, max: 1000, label: 'Number to check (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const num = Number(vars?.num ?? 7);
    const isEven = (num % 2) === 0;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int num = ${num} [4 Bytes].`,
        explanationHinglish: `Integer num = ${num} memory me store hua.`,
        memorySnapshot: { num: `${num} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: num }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Evaluate condition: (${num} % 2 == 0) $\\rightarrow$ ${num % 2} == 0 is ${isEven ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check hui: ${num} % 2 (${num % 2}) == 0 $\\rightarrow$ result mila ${isEven ? 'TRUE (Even block)' : 'FALSE (Else block)'}.`,
        memorySnapshot: { num: `${num} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'num',
          variableValue: num,
          condition: `% 2 == 0`,
          result: isEven
        }
      },
      isEven ? {
        step: 3, lineNum: 5,
        explanationEnglish: `Condition TRUE: execute if-block and print "${num} is EVEN".`,
        explanationHinglish: `Condition TRUE hone par IF block execute hua: "${num} is EVEN".`,
        memorySnapshot: { num: `${num} [4B]` },
        consoleOutput: `${num} is EVEN`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${num} is EVEN` }
      } : {
        step: 3, lineNum: 7,
        explanationEnglish: `Condition FALSE: skip if-block, jump to else-block and print "${num} is ODD".`,
        explanationHinglish: `Condition FALSE hone par ELSE block execute hua: "${num} is ODD".`,
        memorySnapshot: { num: `${num} [4B]` },
        consoleOutput: `${num} is ODD`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${num} is ODD` }
      }
    ];
  },
  executionSteps: []
};

export const c_largest_three: LessonProgram = {
  id: 'c_largest_three',
  language: 'c',
  topic: 'if_else',
  lessonNumber: 2,
  friendlyName: 'Largest of Three',
  learningObjective: 'Use logical AND (&&) in compound conditional statements to find the maximum value in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '28', paramId: 'b' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '9', paramId: 'c' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&&' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Largest number is: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a: { default: 15, label: 'Value a (int)' },
    b: { default: 28, label: 'Value b (int)' },
    c: { default: 9, label: 'Value c (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a = Number(vars?.a ?? 15);
    const b = Number(vars?.b ?? 28);
    const c = Number(vars?.c ?? 9);
    const isAGreatest = (a >= b && a >= c);
    const isBGreatest = (!isAGreatest && b >= c);
    const maxVal = Math.max(a, b, c);

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare inputs: int a = ${a}, b = ${b}, c = ${c}.`,
        explanationHinglish: `Operands a = ${a}, b = ${b}, c = ${c} declare hue.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]` },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'a', value: a },
            { name: 'b', value: b },
            { name: 'c', value: c }
          ]
        }
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: `Evaluate: (${a} >= ${b} && ${a} >= ${c}) $\\rightarrow$ ${isAGreatest ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehli condition check hui: (${a} >= ${b} && ${a} >= ${c}) $\\rightarrow$ ${isAGreatest ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'a',
          variableValue: a,
          condition: `>= ${b} && >= ${c}`,
          result: isAGreatest
        }
      }
    ];

    if (isAGreatest) {
      steps.push({
        step: 3, lineNum: 6,
        explanationEnglish: `Assign max = a = ${a}.`,
        explanationHinglish: `max variable me a (${a}) store hua.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]`, max: `${a} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'max', value: a }
      });
    } else {
      steps.push({
        step: 3, lineNum: 7,
        explanationEnglish: `Evaluate second condition: (${b} >= ${c}) $\\rightarrow$ ${isBGreatest ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Else-if condition check hui: (${b} >= ${c}) $\\rightarrow$ ${isBGreatest ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'b',
          variableValue: b,
          condition: `>= ${c}`,
          result: isBGreatest
        }
      });

      if (isBGreatest) {
        steps.push({
          step: 4, lineNum: 8,
          explanationEnglish: `Assign max = b = ${b}.`,
          explanationHinglish: `max variable me b (${b}) store hua.`,
          memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]`, max: `${b} [4B]` },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'max', value: b }
        });
      } else {
        steps.push({
          step: 4, lineNum: 10,
          explanationEnglish: `Both prior conditions failed: Assign max = c = ${c}.`,
          explanationHinglish: `Dono conditions fail hone par else block chala: max = c (${c}).`,
          memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]`, max: `${c} [4B]` },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'max', value: c }
        });
      }
    }

    steps.push({
      step: steps.length + 1, lineNum: 12,
      explanationEnglish: `printf prints the largest value: Largest number is: ${maxVal}.`,
      explanationHinglish: `printf se console pe largest number (${maxVal}) print hua.`,
      memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, c: `${c} [4B]`, max: `${maxVal} [4B]` },
      consoleOutput: `Largest number is: ${maxVal}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Largest number is: ${maxVal}` }
    });

    return steps;
  },
  executionSteps: []
};

export const c_leap_year: LessonProgram = {
  id: 'c_leap_year',
  language: 'c',
  topic: 'if_else',
  lessonNumber: 3,
  friendlyName: 'Leap Year',
  learningObjective: 'Master leap year evaluation rules: ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2024', paramId: 'year' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&&' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '400' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is a LEAP YEAR\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is NOT a leap year\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    year: { default: 2024, min: 1000, max: 9999, label: 'Year (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const year = Number(vars?.year ?? 2024);
    const isLeap = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int year = ${year} [4 Bytes].`,
        explanationHinglish: `Integer year = ${year} memory me store hua.`,
        memorySnapshot: { year: `${year} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'year', value: year }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check Leap Year Rule: (${year}%4==0 && ${year}%100!=0) || (${year}%400==0) $\\rightarrow$ ${isLeap ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Leap year condition check hui $\\rightarrow$ Result ${isLeap ? 'TRUE (Leap Year)' : 'FALSE (Not a leap year)'}.`,
        memorySnapshot: { year: `${year} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'year',
          variableValue: year,
          condition: `% 4 == 0 (Leap criteria)`,
          result: isLeap
        }
      },
      isLeap ? {
        step: 3, lineNum: 5,
        explanationEnglish: `Condition TRUE: execute if-block: "${year} is a LEAP YEAR".`,
        explanationHinglish: `Condition TRUE hone par IF block chala: "${year} is a LEAP YEAR".`,
        memorySnapshot: { year: `${year} [4B]` },
        consoleOutput: `${year} is a LEAP YEAR`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${year} is a LEAP YEAR` }
      } : {
        step: 3, lineNum: 7,
        explanationEnglish: `Condition FALSE: execute else-block: "${year} is NOT a leap year".`,
        explanationHinglish: `Condition FALSE hone par ELSE block chala: "${year} is NOT a leap year".`,
        memorySnapshot: { year: `${year} [4B]` },
        consoleOutput: `${year} is NOT a leap year`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${year} is NOT a leap year` }
      }
    ];
  },
  executionSteps: []
};

export const c_vowel_consonant: LessonProgram = {
  id: 'c_vowel_consonant',
  language: 'c',
  topic: 'if_else',
  lessonNumber: 4,
  friendlyName: 'Vowel or Consonant',
  learningObjective: 'Check multiple character match possibilities using logical OR (||) in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\'%c\' is a VOWEL\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\'%c\' is a CONSONANT\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const ch = 'e';
    const isVowel = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(ch);

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: "Declare char ch = 'e' [1 Byte].",
        explanationHinglish: "Character ch = 'e' memory me store hua.",
        memorySnapshot: { ch: "'e' [1B]" },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: "'e'" }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: "Check Vowel criteria: (ch=='a' || ch=='e' || ch=='i' || ch=='o' || ch=='u') $\\rightarrow$ TRUE.",
        explanationHinglish: "Vowel condition check hui: ch == 'e' match ho gaya $\\rightarrow$ result TRUE mila.",
        memorySnapshot: { ch: "'e' [1B]" },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'ch',
          variableValue: "'e'",
          condition: "in ['a','e','i','o','u']",
          result: isVowel
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: "Condition is TRUE: print \"'e' is a VOWEL\".",
        explanationHinglish: "Condition TRUE hone par IF block chala: \"'e' is a VOWEL\" print hua.",
        memorySnapshot: { ch: "'e' [1B]" },
        consoleOutput: "'e' is a VOWEL",
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: "'e' is a VOWEL" }
      }
    ];
  },
  executionSteps: []
};


export const c_marks_grade: LessonProgram = {
  id: 'c_marks_grade',
  language: 'c',
  topic: 'if_elif_else',
  lessonNumber: 1,
  friendlyName: 'Student Grade',
  learningObjective: 'Evaluate multi-tier grade boundaries using an if-else if ladder in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '82', paramId: 'marks' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '90' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '80' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'B'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '60' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'C'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'F'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Marks: %d -> Grade: %c\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    marks: { default: 82, min: 0, max: 100, label: 'Student Marks (0-100)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const marks = Number(vars?.marks ?? 82);
    const condA = marks >= 90;
    const condB = !condA && marks >= 80;
    const condC = !condA && !condB && marks >= 60;
    const gradeChar = condA ? 'A' : condB ? 'B' : condC ? 'C' : 'F';

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int marks = ${marks} [4 Bytes].`,
        explanationHinglish: `Integer marks = ${marks} store hua.`,
        memorySnapshot: { marks: `${marks} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'marks', value: marks }
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: `Evaluate tier 1: (${marks} >= 90) $\\rightarrow$ ${condA ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla condition (${marks} >= 90) check hua $\\rightarrow$ ${condA ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { marks: `${marks} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'marks',
          variableValue: marks,
          condition: '>= 90',
          result: condA
        }
      }
    ];

    if (condA) {
      steps.push({
        step: 3, lineNum: 6,
        explanationEnglish: `Condition TRUE: assign grade = 'A'.`,
        explanationHinglish: `grade = 'A' assign hua.`,
        memorySnapshot: { marks: `${marks} [4B]`, grade: "'A' [1B]" },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'A'" }
      });
    } else {
      steps.push({
        step: 3, lineNum: 7,
        explanationEnglish: `Evaluate tier 2: (${marks} >= 80) $\\rightarrow$ ${condB ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusra condition (${marks} >= 80) check hua $\\rightarrow$ ${condB ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { marks: `${marks} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'marks',
          variableValue: marks,
          condition: '>= 80',
          result: condB
        }
      });

      if (condB) {
        steps.push({
          step: 4, lineNum: 8,
          explanationEnglish: `Condition TRUE: assign grade = 'B'.`,
          explanationHinglish: `grade = 'B' assign hua.`,
          memorySnapshot: { marks: `${marks} [4B]`, grade: "'B' [1B]" },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'B'" }
        });
      } else {
        steps.push({
          step: 4, lineNum: 9,
          explanationEnglish: `Evaluate tier 3: (${marks} >= 60) $\\rightarrow$ ${condC ? 'TRUE' : 'FALSE'}.`,
          explanationHinglish: `Teesra condition (${marks} >= 60) check hua $\\rightarrow$ ${condC ? 'TRUE' : 'FALSE'}.`,
          memorySnapshot: { marks: `${marks} [4B]` },
          animationEvent: {
            type: 'EVALUATE_CONDITION' as const,
            variableName: 'marks',
            variableValue: marks,
            condition: '>= 60',
            result: condC
          }
        });

        if (condC) {
          steps.push({
            step: 5, lineNum: 10,
            explanationEnglish: `Condition TRUE: assign grade = 'C'.`,
            explanationHinglish: `grade = 'C' assign hua.`,
            memorySnapshot: { marks: `${marks} [4B]`, grade: "'C' [1B]" },
            animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'C'" }
          });
        } else {
          steps.push({
            step: 5, lineNum: 12,
            explanationEnglish: `All tiers failed: assign fallback grade = 'F'.`,
            explanationHinglish: `Sabhi conditions fail hone par fallback grade = 'F' assign hua.`,
            memorySnapshot: { marks: `${marks} [4B]`, grade: "'F' [1B]" },
            animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'F'" }
          });
        }
      }
    }

    steps.push({
      step: steps.length + 1, lineNum: 14,
      explanationEnglish: `printf prints the calculated grade: Marks: ${marks} -> Grade: ${gradeChar}.`,
      explanationHinglish: `printf se console pe result Marks: ${marks} -> Grade: ${gradeChar} print hua.`,
      memorySnapshot: { marks: `${marks} [4B]`, grade: `'${gradeChar}' [1B]` },
      consoleOutput: `Marks: ${marks} -> Grade: ${gradeChar}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Marks: ${marks} -> Grade: ${gradeChar}` }
    });

    return steps;
  },
  executionSteps: []
};

export const c_tax_calc: LessonProgram = {
  id: 'c_tax_calc',
  language: 'c',
  topic: 'if_elif_else',
  lessonNumber: 2,
  friendlyName: 'Income Tax',
  learningObjective: 'Compute percentage taxes across multiple income brackets using if-else if in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '650000.0', paramId: 'income' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'tax' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '250000.0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '       ' }, { type: 'comment', value: '// 0% slab' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '500000.0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.05' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// 5% slab' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.20' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// 20% slab' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Income: %.2f -> Tax: %.2f\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'tax' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    income: { default: 650000.0, label: 'Annual Income (float)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const income = Number(vars?.income ?? 650000.0);
    const slab1 = income <= 250000.0;
    const slab2 = !slab1 && income <= 500000.0;
    const tax = slab1 ? 0.0 : slab2 ? income * 0.05 : income * 0.20;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare float income = ${income.toFixed(2)} [4 Bytes].`,
        explanationHinglish: `Float income = ${income.toFixed(2)} memory me initialize hua.`,
        memorySnapshot: { income: `${income.toFixed(2)} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'income', value: income.toFixed(2) }
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: `Check Slab 1 (<= 250,000): (${income.toFixed(2)} <= 250000.0) $\\rightarrow$ ${slab1 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla tax slab condition check hua $\\rightarrow$ ${slab1 ? 'TRUE (No tax)' : 'FALSE'}.`,
        memorySnapshot: { income: `${income.toFixed(2)} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'income',
          variableValue: income.toFixed(2),
          condition: '<= 250000.0',
          result: slab1
        }
      }
    ];

    if (slab1) {
      steps.push({
        step: 3, lineNum: 6,
        explanationEnglish: `Income <= 250000: tax = 0.0 (Nil).`,
        explanationHinglish: `Tax = 0.0 memory me store hua.`,
        memorySnapshot: { income: `${income.toFixed(2)} [4B]`, tax: `0.00 [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'tax', value: '0.00' }
      });
    } else {
      steps.push({
        step: 3, lineNum: 7,
        explanationEnglish: `Check Slab 2 (<= 500,000): (${income.toFixed(2)} <= 500000.0) $\\rightarrow$ ${slab2 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusra tax slab condition check hua $\\rightarrow$ ${slab2 ? 'TRUE (5% tax)' : 'FALSE (20% slab)'}.`,
        memorySnapshot: { income: `${income.toFixed(2)} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'income',
          variableValue: income.toFixed(2),
          condition: '<= 500000.0',
          result: slab2
        }
      });

      if (slab2) {
        steps.push({
          step: 4, lineNum: 8,
          explanationEnglish: `Calculate 5% tax: tax = ${income.toFixed(2)} * 0.05 = ${tax.toFixed(2)}.`,
          explanationHinglish: `5% tax calculate hua: tax = ${tax.toFixed(2)}.`,
          memorySnapshot: { income: `${income.toFixed(2)} [4B]`, tax: `${tax.toFixed(2)} [4B]` },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'tax', value: tax.toFixed(2) }
        });
      } else {
        steps.push({
          step: 4, lineNum: 10,
          explanationEnglish: `Calculate 20% tax: tax = ${income.toFixed(2)} * 0.20 = ${tax.toFixed(2)}.`,
          explanationHinglish: `20% tax calculate hua: tax = ${tax.toFixed(2)}.`,
          memorySnapshot: { income: `${income.toFixed(2)} [4B]`, tax: `${tax.toFixed(2)} [4B]` },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'tax', value: tax.toFixed(2) }
        });
      }
    }

    steps.push({
      step: steps.length + 1, lineNum: 12,
      explanationEnglish: `printf prints tax calculation: Income: ${income.toFixed(2)} -> Tax: ${tax.toFixed(2)}.`,
      explanationHinglish: `printf se console pe Tax: ${tax.toFixed(2)} print hua.`,
      memorySnapshot: { income: `${income.toFixed(2)} [4B]`, tax: `${tax.toFixed(2)} [4B]` },
      consoleOutput: `Income: ${income.toFixed(2)} -> Tax: ${tax.toFixed(2)}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Income: ${income.toFixed(2)} -> Tax: ${tax.toFixed(2)}` }
    });

    return steps;
  },
  executionSteps: []
};

export const c_pos_neg_zero: LessonProgram = {
  id: 'c_pos_neg_zero',
  language: 'c',
  topic: 'if_elif_else',
  lessonNumber: 3,
  friendlyName: 'Positive, Negative, Zero',
  learningObjective: 'Classify any integer into Positive, Negative, or Zero using sign comparison in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '-12', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is POSITIVE\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is NEGATIVE\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Number is ZERO\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: -12, min: -1000, max: 1000, label: 'Integer n' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Number(vars?.n ?? -12);
    const isPos = n > 0;
    const isNeg = !isPos && n < 0;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int n = ${n} [4 Bytes].`,
        explanationHinglish: `Integer n = ${n} memory me declare hua.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check positive: (${n} > 0) $\\rightarrow$ ${isPos ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla check (${n} > 0) $\\rightarrow$ ${isPos ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'n',
          variableValue: n,
          condition: '> 0',
          result: isPos
        }
      }
    ];

    if (isPos) {
      steps.push({
        step: 3, lineNum: 5,
        explanationEnglish: `Condition TRUE: print "${n} is POSITIVE".`,
        explanationHinglish: `"${n} is POSITIVE" print hua.`,
        memorySnapshot: { n: `${n} [4B]` },
        consoleOutput: `${n} is POSITIVE`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${n} is POSITIVE` }
      });
    } else {
      steps.push({
        step: 3, lineNum: 6,
        explanationEnglish: `Check negative: (${n} < 0) $\\rightarrow$ ${isNeg ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Else-if check (${n} < 0) $\\rightarrow$ ${isNeg ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'n',
          variableValue: n,
          condition: '< 0',
          result: isNeg
        }
      });

      if (isNeg) {
        steps.push({
          step: 4, lineNum: 7,
          explanationEnglish: `Condition TRUE: print "${n} is NEGATIVE".`,
          explanationHinglish: `"${n} is NEGATIVE" print hua.`,
          memorySnapshot: { n: `${n} [4B]` },
          consoleOutput: `${n} is NEGATIVE`,
          animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${n} is NEGATIVE` }
        });
      } else {
        steps.push({
          step: 4, lineNum: 9,
          explanationEnglish: `Both failed: number is ZERO. Print "Number is ZERO".`,
          explanationHinglish: `Else block chala: "Number is ZERO" print hua.`,
          memorySnapshot: { n: `${n} [4B]` },
          consoleOutput: `Number is ZERO`,
          animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Number is ZERO` }
        });
      }
    }

    return steps;
  },
  executionSteps: []
};

export const c_electricity_bill: LessonProgram = {
  id: 'c_electricity_bill',
  language: 'c',
  topic: 'if_elif_else',
  lessonNumber: 4,
  friendlyName: 'Electricity Bill',
  learningObjective: 'Calculate tiered utility bills based on consumed units in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '230', paramId: 'units' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bill' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'bill' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '1.50' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// $1.50 per unit' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '300' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'bill' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '2.50' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// $2.50 per unit' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'bill' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '4.00' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// $4.00 per unit' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Units: %d -> Total Bill: $%.2f\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bill' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    units: { default: 230, min: 1, max: 1000, label: 'Units Consumed' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const units = Number(vars?.units ?? 230);
    const tier1 = units <= 100;
    const tier2 = !tier1 && units <= 300;
    const bill = tier1 ? units * 1.50 : tier2 ? units * 2.50 : units * 4.00;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int units = ${units} [4 Bytes].`,
        explanationHinglish: `Units = ${units} declare hua.`,
        memorySnapshot: { units: `${units} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'units', value: units }
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: `Check Tier 1: (${units} <= 100) $\\rightarrow$ ${tier1 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla tier condition (${units} <= 100) check hua $\\rightarrow$ ${tier1 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { units: `${units} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'units',
          variableValue: units,
          condition: '<= 100',
          result: tier1
        }
      }
    ];

    if (tier1) {
      steps.push({
        step: 3, lineNum: 6,
        explanationEnglish: `Tier 1 applied: bill = ${units} * 1.50 = $${bill.toFixed(2)}.`,
        explanationHinglish: `Tier 1 calculate hua: bill = $${bill.toFixed(2)}.`,
        memorySnapshot: { units: `${units} [4B]`, bill: `$${bill.toFixed(2)} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'bill', value: `$${bill.toFixed(2)}` }
      });
    } else {
      steps.push({
        step: 3, lineNum: 7,
        explanationEnglish: `Check Tier 2: (${units} <= 300) $\\rightarrow$ ${tier2 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusra tier condition (${units} <= 300) check hua $\\rightarrow$ ${tier2 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { units: `${units} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'units',
          variableValue: units,
          condition: '<= 300',
          result: tier2
        }
      });

      if (tier2) {
        steps.push({
          step: 4, lineNum: 8,
          explanationEnglish: `Tier 2 applied: bill = ${units} * 2.50 = $${bill.toFixed(2)}.`,
          explanationHinglish: `Tier 2 calculate hua: bill = $${bill.toFixed(2)}.`,
          memorySnapshot: { units: `${units} [4B]`, bill: `$${bill.toFixed(2)} [4B]` },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'bill', value: `$${bill.toFixed(2)}` }
        });
      } else {
        steps.push({
          step: 4, lineNum: 10,
          explanationEnglish: `Tier 3 applied (> 300): bill = ${units} * 4.00 = $${bill.toFixed(2)}.`,
          explanationHinglish: `Tier 3 calculate hua: bill = $${bill.toFixed(2)}.`,
          memorySnapshot: { units: `${units} [4B]`, bill: `$${bill.toFixed(2)} [4B]` },
          animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'bill', value: `$${bill.toFixed(2)}` }
        });
      }
    }

    steps.push({
      step: steps.length + 1, lineNum: 12,
      explanationEnglish: `printf prints total calculated bill: Units: ${units} -> Total Bill: $${bill.toFixed(2)}.`,
      explanationHinglish: `printf se console pe bill: $${bill.toFixed(2)} display hua.`,
      memorySnapshot: { units: `${units} [4B]`, bill: `$${bill.toFixed(2)} [4B]` },
      consoleOutput: `Units: ${units} -> Total Bill: $${bill.toFixed(2)}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Units: ${units} -> Total Bill: $${bill.toFixed(2)}` }
    });

    return steps;
  },
  executionSteps: []
};



export const c_switch_day: LessonProgram = {
  id: 'c_switch_day',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 1,
  friendlyName: 'Day of Week',
  learningObjective: 'Understand C switch jump table, case matching, and the break statement.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'day' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3', paramId: 'day' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'day' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Monday\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Tuesday\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Wednesday\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Other Day\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    day: { default: 3, min: 1, max: 7, label: 'Day Number (1-7)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const day = Number(vars?.day ?? 3);
    const dayMap: Record<number, { name: string; line: number }> = {
      1: { name: 'Monday', line: 5 },
      2: { name: 'Tuesday', line: 6 },
      3: { name: 'Wednesday', line: 7 }
    };
    const snap = { day };
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    // Step 1: Initialize day
    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize int day = ${day}.`,
      explanationHinglish: `Variable day = ${day} memory me store hua.`,
      memorySnapshot: snap,
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'day', value: day }
    });

    // Step 2: Switch statement evaluates day expression
    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `switch(day): Evaluates day expression (${day}) to check matching cases.`,
      explanationHinglish: `switch(day): day ki value (${day}) evaluate karke matching case check karna shuru kiya.`,
      memorySnapshot: snap,
      animationEvent: { type: 'COMPUTE' as const, inputs: ['day'], operator: 'switch', result: String(day), storeIn: 'Match' }
    });

    // Step 3: Sequential case evaluations
    let matched = false;
    for (let d = 1; d <= 3; d++) {
      if (day === d) {
        steps.push({
          step: stepCount++,
          lineNum: dayMap[d].line,
          explanationEnglish: `Check case ${d}: day (${day}) == ${d} matches! Jumping directly into case ${d}.`,
          explanationHinglish: `case ${d} check kiya: day (${day}) == ${d} match ho gaya! Ab case ${d} execute hoga.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE' as const, inputs: ['day'], operator: `== ${d}`, result: 'True', storeIn: 'Condition' }
        });
        matched = true;
        break;
      } else {
        steps.push({
          step: stepCount++,
          lineNum: dayMap[d].line,
          explanationEnglish: `Check case ${d}: day (${day}) != ${d}. Condition false, testing next case.`,
          explanationHinglish: `case ${d} check kiya: day (${day}) != ${d} match nahi hua. Agla case check hoga.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE' as const, inputs: ['day'], operator: `== ${d}`, result: 'False', storeIn: 'Condition' }
        });
      }
    }

    if (!matched) {
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `No cases matched day (${day}). Fallback to default case.`,
        explanationHinglish: `Koi case match nahi hua (${day}). Default case execute hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['day'], operator: '== default', result: 'True', storeIn: 'Condition' }
      });
    }

    // Step: Execution inside matched branch
    const target = dayMap[day] ?? { name: 'Other Day', line: 8 };
    steps.push({
      step: stepCount++,
      lineNum: target.line,
      explanationEnglish: `printf outputs "${target.name}".`,
      explanationHinglish: `printf se "${target.name}" console pe print hua.`,
      memorySnapshot: snap,
      consoleOutput: target.name,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: target.name }
    });

    return steps;
  },
  executionSteps: []
};

export const c_switch_calc: LessonProgram = {
  id: 'c_switch_calc',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 2,
  friendlyName: 'Simple Calculator',
  learningObjective: 'Switch on operator choice to execute arithmetic operation in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'a' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'choice' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'+'", paramId: 'choice' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'choice' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'+'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'-'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a: { default: 10, label: 'Operand a (int)' },
    b: { default: 5, label: 'Operand b (int)' },
    choice: { default: '+', type: 'text', label: 'Operator (+, -, *)', quoteChar: "'" }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a = Math.trunc(Number(vars?.a ?? 10));
    const b = Math.trunc(Number(vars?.b ?? 5));
    const rawChoice = String(vars?.choice ?? '+').replace(/['"]/g, '').trim();
    const choice = rawChoice.length > 0 ? rawChoice[0] : '+';
    const snap = { a, b, choice: `'${choice}'` };
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    // Step 1: Declare a
    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare int a = ${a}.`,
      explanationHinglish: `Variable a = ${a} declare hua.`,
      memorySnapshot: { a },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'a', value: a }
    });

    // Step 2: Declare b
    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Declare int b = ${b}.`,
      explanationHinglish: `Variable b = ${b} declare hua.`,
      memorySnapshot: { a, b },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'b', value: b }
    });

    // Step 3: Declare choice
    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Declare char choice = '${choice}'.`,
      explanationHinglish: `Variable choice = '${choice}' save hua.`,
      memorySnapshot: snap,
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'choice', value: `'${choice}'` }
    });

    // Step 4: Switch evaluation
    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: `switch(choice): Evaluates choice '${choice}' to find matching case.`,
      explanationHinglish: `switch(choice): choice '${choice}' evaluate karke matching case dhoondna shuru kiya.`,
      memorySnapshot: snap,
      animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: 'switch', result: `'${choice}'`, storeIn: 'Match' }
    });

    if (choice === '+') {
      const sum = a + b;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check case '+': choice ('${choice}') == '+' matches! Jumping into case '+' block.`,
        explanationHinglish: `case '+' check kiya: choice == '+' match ho gaya!`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '+'", result: 'True', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `printf prints the evaluated sum: ${a} + ${b} = ${sum}.`,
        explanationHinglish: `printf se ${a} + ${b} = ${sum} print hua.`,
        memorySnapshot: { ...snap, result: sum },
        consoleOutput: String(sum),
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: sum }
      });
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: 'break: exits the switch block.',
        explanationHinglish: 'break statement se switch block se bahar nikal gaye.',
        memorySnapshot: { ...snap, result: sum },
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break' }
      });
    } else if (choice === '-') {
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check case '+': choice ('${choice}') != '+'. Condition false, testing next case.`,
        explanationHinglish: `case '+' match nahi hua. Agla case check hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '+'", result: 'False', storeIn: 'Condition' }
      });
      const diff = a - b;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Check case '-': choice ('${choice}') == '-' matches! Jumping into case '-' block.`,
        explanationHinglish: `case '-' check kiya: choice == '-' match ho gaya!`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '-'", result: 'True', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `printf prints the evaluated difference: ${a} - ${b} = ${diff}.`,
        explanationHinglish: `printf se ${a} - ${b} = ${diff} print hua.`,
        memorySnapshot: { ...snap, result: diff },
        consoleOutput: String(diff),
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: diff }
      });
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: 'break: exits the switch block.',
        explanationHinglish: 'break statement se switch block se bahar nikal gaye.',
        memorySnapshot: { ...snap, result: diff },
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break' }
      });
    } else if (choice === '*') {
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check case '+': choice ('${choice}') != '+'. Condition false, testing next case.`,
        explanationHinglish: `case '+' match nahi hua. Agla case check hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '+'", result: 'False', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Check case '-': choice ('${choice}') != '-'. Condition false, testing next case.`,
        explanationHinglish: `case '-' match nahi hua. Agla case check hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '-'", result: 'False', storeIn: 'Condition' }
      });
      const prod = a * b;
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Check case '*': choice ('${choice}') == '*' matches! Jumping into case '*' block.`,
        explanationHinglish: `case '*' check kiya: choice == '*' match ho gaya!`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '*'", result: 'True', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `printf prints the evaluated product: ${a} * ${b} = ${prod}.`,
        explanationHinglish: `printf se ${a} * ${b} = ${prod} print hua.`,
        memorySnapshot: { ...snap, result: prod },
        consoleOutput: String(prod),
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: prod }
      });
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: 'break: exits the switch block.',
        explanationHinglish: 'break statement se switch block se bahar nikal gaye.',
        memorySnapshot: { ...snap, result: prod },
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break' }
      });
    } else {
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check case '+': choice ('${choice}') != '+'. Condition false, testing next case.`,
        explanationHinglish: `case '+' match nahi hua. Agla case check hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '+'", result: 'False', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Check case '-': choice ('${choice}') != '-'. Condition false, testing next case.`,
        explanationHinglish: `case '-' match nahi hua. Agla case check hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '-'", result: 'False', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Check case '*': choice ('${choice}') != '*'. Condition false, testing default.`,
        explanationHinglish: `case '*' match nahi hua. Default case check hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: "== '*'", result: 'False', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: `No cases matched choice ('${choice}'). Fallback to default case.`,
        explanationHinglish: `Koi case match nahi hua ('${choice}'). Default case chalega.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['choice'], operator: '== default', result: 'True', storeIn: 'Condition' }
      });
      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: 'printf outputs "Invalid\\n".',
        explanationHinglish: 'printf se "Invalid" print hua.',
        memorySnapshot: snap,
        consoleOutput: 'Invalid',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: 'Invalid' }
      });
    }

    return steps;
  },
  executionSteps: []
};

export const c_switch_vowel: LessonProgram = {
  id: 'c_switch_vowel',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 3,
  friendlyName: 'Vowel Check',
  learningObjective: 'Learn intentional switch fall-through in C (grouping multiple cases together).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'", paramId: 'ch' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\'%c\' is a VOWEL\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\'%c\' is a CONSONANT\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    ch: { default: 'o', type: 'text', label: 'Alphabet Character', quoteChar: "'" }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawCh = String(vars?.ch ?? 'o').replace(/['"]/g, '').trim();
    const ch = rawCh.length > 0 ? rawCh[0] : 'o';
    const snap = { ch: `'${ch}'` };
    const vowelLines: Record<string, number> = {
      a: 5,
      e: 6,
      i: 7,
      o: 8,
      u: 9
    };
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const isVowel = vowels.includes(ch);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    // Step 1: Initialize ch
    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare char ch = '${ch}'.`,
      explanationHinglish: `Variable ch = '${ch}' memory me save hua.`,
      memorySnapshot: snap,
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: `'${ch}'` }
    });

    // Step 2: Switch statement
    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `switch(ch): Evaluates char '${ch}' to find matching vowel case.`,
      explanationHinglish: `switch(ch): character '${ch}' evaluate karke matching vowel case dhoondna shuru kiya.`,
      memorySnapshot: snap,
      animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: 'switch', result: `'${ch}'`, storeIn: 'Match' }
    });

    if (isVowel) {
      // Sequential case evaluations until match
      for (const v of vowels) {
        const line = vowelLines[v];
        if (ch === v) {
          steps.push({
            step: stepCount++,
            lineNum: line,
            explanationEnglish: `Check case '${v}': ch ('${ch}') == '${v}' matches! Fall-through activates because cases share line 10 without breaks.`,
            explanationHinglish: `case '${v}' match ho gaya! Line 10 par fall-through karke execute hoga.`,
            memorySnapshot: snap,
            animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: `== '${v}'`, result: 'True', storeIn: 'Condition' }
          });
          break;
        } else {
          steps.push({
            step: stepCount++,
            lineNum: line,
            explanationEnglish: `Check case '${v}': ch ('${ch}') != '${v}'. Condition false, testing next case.`,
            explanationHinglish: `case '${v}' match nahi hua, agla vowel check hoga.`,
            memorySnapshot: snap,
            animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: `== '${v}'`, result: 'False', storeIn: 'Condition' }
          });
        }
      }

      // Step: Executing line 10 printf
      const outText = `'${ch}' is a VOWEL`;
      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: `printf outputs "${outText}".`,
        explanationHinglish: `printf se "${outText}" console pe print hua.`,
        memorySnapshot: snap,
        consoleOutput: outText,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: outText }
      });

      // Step: Line 11 break
      steps.push({
        step: stepCount++,
        lineNum: 11,
        explanationEnglish: 'break: exits switch statement.',
        explanationHinglish: 'break statement switch se bahar nikal deta hai.',
        memorySnapshot: snap,
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
      });
    } else {
      // Consonant or non-vowel
      for (const v of vowels) {
        const line = vowelLines[v];
        steps.push({
          step: stepCount++,
          lineNum: line,
          explanationEnglish: `Check case '${v}': ch ('${ch}') != '${v}'. Condition false, testing next case.`,
          explanationHinglish: `case '${v}' match nahi hua, agla vowel check hoga.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: `== '${v}'`, result: 'False', storeIn: 'Condition' }
        });
      }

      // Step: Line 12 default
      steps.push({
        step: stepCount++,
        lineNum: 12,
        explanationEnglish: `No vowel case matched '${ch}'. Jumping to default case.`,
        explanationHinglish: `Koi vowel match nahi hua '${ch}'. Default case chalega.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: '== default', result: 'True', storeIn: 'Condition' }
      });

      // Step: Line 13 printf consonant
      const outText = `'${ch}' is a CONSONANT`;
      steps.push({
        step: stepCount++,
        lineNum: 13,
        explanationEnglish: `printf outputs "${outText}".`,
        explanationHinglish: `printf se "${outText}" console pe print hua.`,
        memorySnapshot: snap,
        consoleOutput: outText,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: outText }
      });
    }

    return steps;
  },
  executionSteps: []
};

export const c_switch_grade: LessonProgram = {
  id: 'c_switch_grade',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 4,
  friendlyName: 'Grade Calculator',
  learningObjective: 'Evaluate student remarks based on grade letter (A, B, C, D, Fail) using switch case in C.',
  learningObjectiveHinglish: 'Switch statement ka use karke student ke grade letter (A, B, C, D, Fail) par remarks calculate karna samjhein.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'B'", paramId: 'grade' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Excellent\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'B'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Good\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'C'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fair\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'D'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Pass\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'F'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fail\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid Grade\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    grade: { default: 'B', type: 'text', label: 'Grade (A, B, C, D, F)', quoteChar: "'" }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawGrade = String(vars?.grade ?? 'B').replace(/['"]/g, '').trim();
    const grade = (rawGrade.length > 0 ? rawGrade[0] : 'B').toUpperCase();
    const snap = { grade: `'${grade}'` };
    const gradeMap: Record<string, { remark: string; line: number }> = {
      A: { remark: 'Excellent', line: 5 },
      B: { remark: 'Good', line: 6 },
      C: { remark: 'Fair', line: 7 },
      D: { remark: 'Pass', line: 8 },
      F: { remark: 'Fail', line: 9 }
    };
    const validGrades = ['A', 'B', 'C', 'D', 'F'];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    // Step 1: Initialize grade
    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare char grade = '${grade}'.`,
      explanationHinglish: `Variable grade = '${grade}' memory me save hua.`,
      memorySnapshot: snap,
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: `'${grade}'` }
    });

    // Step 2: Switch statement
    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `switch(grade): Evaluates grade expression ('${grade}') to match case.`,
      explanationHinglish: `switch(grade): grade '${grade}' evaluate karke matching case dhoondna shuru kiya.`,
      memorySnapshot: snap,
      animationEvent: { type: 'COMPUTE' as const, inputs: ['grade'], operator: 'switch', result: `'${grade}'`, storeIn: 'Match' }
    });

    // Check cases sequentially
    let matched = false;
    for (const g of validGrades) {
      if (grade === g) {
        steps.push({
          step: stepCount++,
          lineNum: gradeMap[g].line,
          explanationEnglish: `Check case '${g}': grade ('${grade}') == '${g}' matches! Jumping into case '${g}' block.`,
          explanationHinglish: `case '${g}' check kiya: grade ('${grade}') == '${g}' match ho gaya! Ab ye block chalega.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE' as const, inputs: ['grade'], operator: `== '${g}'`, result: 'True', storeIn: 'Condition' }
        });
        matched = true;
        break;
      } else {
        steps.push({
          step: stepCount++,
          lineNum: gradeMap[g].line,
          explanationEnglish: `Check case '${g}': grade ('${grade}') != '${g}'. Condition false, testing next case.`,
          explanationHinglish: `case '${g}' check kiya: grade ('${grade}') != '${g}' match nahi hua. Agla case check hoga.`,
          memorySnapshot: snap,
          animationEvent: { type: 'COMPUTE' as const, inputs: ['grade'], operator: `== '${g}'`, result: 'False', storeIn: 'Condition' }
        });
      }
    }

    if (!matched) {
      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: `No cases matched grade ('${grade}'). Fallback to default case.`,
        explanationHinglish: `Koi case match nahi hua ('${grade}'). Default case execute hoga.`,
        memorySnapshot: snap,
        animationEvent: { type: 'COMPUTE' as const, inputs: ['grade'], operator: '== default', result: 'True', storeIn: 'Condition' }
      });
    }

    // Step: Execution inside matched branch
    const target = gradeMap[grade] ?? { remark: 'Invalid Grade', line: 10 };
    steps.push({
      step: stepCount++,
      lineNum: target.line,
      explanationEnglish: `printf outputs "${target.remark}".`,
      explanationHinglish: `printf se "${target.remark}" console pe print hua.`,
      memorySnapshot: snap,
      consoleOutput: target.remark,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: target.remark }
    });

    // Step: Break statement if matched valid grade
    if (matched) {
      steps.push({
        step: stepCount++,
        lineNum: target.line,
        explanationEnglish: 'break: exits switch block.',
        explanationHinglish: 'break statement se switch block se bahar nikal gaye.',
        memorySnapshot: snap,
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break' }
      });
    }

    return steps;
  },
  executionSteps: []
};

// Backward-compatible alias
export const c_switch_month: LessonProgram = {
  ...c_switch_grade,
  id: 'c_switch_month',
  lessonNumber: 5,
  friendlyName: 'Grade & Remarks (Switch Case)',
};

export const c_for_sum: LessonProgram = {
  id: 'c_for_sum',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 1,
  friendlyName: 'Sum of N Numbers',
  learningObjective: 'Accumulate sum inside a for loop counter in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 10, label: 'Value of n' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Math.min(10, Math.max(1, Number(vars?.n ?? 5)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let total = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare upper limit n = ${n}.`,
      explanationHinglish: `Variable n = ${n} declare hua.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize accumulator total = 0.',
      explanationHinglish: 'Sum store karne ke liye total = 0 initialize kiya.',
      memorySnapshot: { n, total: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'total', value: 0 }
    });

    for (let i = 1; i <= n; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Check loop condition: i (${i}) <= ${n} is True.`,
        explanationHinglish: `Condition check: i (${i}) <= ${n} True hai.`,
        memorySnapshot: { n, total, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'True', storeIn: 'Condition' }
      });

      const oldTotal = total;
      total += i;

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Add i to total: ${oldTotal} + ${i} = ${total}.`,
        explanationHinglish: `total me ${i} joda: naya total ${total} hua.`,
        memorySnapshot: { n, total, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['total', 'i'], operator: '+', result: total, storeIn: 'total' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Check loop condition: i (${n + 1}) <= ${n} is False. The loop exits.`,
      explanationHinglish: `Condition check: i (${n + 1}) <= ${n} False ho gayi. Loop exit hua.`,
      memorySnapshot: { n, total, i: n + 1 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 8,
      explanationEnglish: `printf prints the final sum: ${total}.`,
      explanationHinglish: `printf se final sum: ${total} print hua.`,
      memorySnapshot: { n, total, i: n + 1 },
      consoleOutput: String(total),
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'total', outputValue: total }
    });

    return steps;
  },
  executionSteps: []
};

export const c_multiplication_table: LessonProgram = {
  id: 'c_multiplication_table',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 2,
  friendlyName: 'Multiplication Table',
  learningObjective: 'Generate formatted multiplication tables using for loops in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    num: { default: 4, min: 1, max: 20, label: 'Table number' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const num = Number(vars?.num ?? 4);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let consoleHistory = '';

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare table number num = ${num}.`,
      explanationHinglish: `Table number num = ${num} memory me declare hua.`,
      memorySnapshot: { num },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: num }
    });

    for (let i = 1; i <= 5; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: `Check loop condition: i (${i}) <= 5 is True.`,
        explanationHinglish: `Condition check: i (${i}) <= 5 True hai.`,
        memorySnapshot: { num, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: '<= 5', result: 'True', storeIn: 'Condition' }
      });

      const res = num * i;
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Calculate product: ${num} * ${i} = ${res}.`,
        explanationHinglish: `Multiply kiya: ${num} * ${i} = ${res}.`,
        memorySnapshot: { num, i, res },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['num', 'i'], operator: '*', result: res, storeIn: 'res' }
      });

      consoleHistory += (consoleHistory ? '\n' : '') + String(res);
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `printf prints the result: ${res}.`,
        explanationHinglish: `printf se ${res} print hua.`,
        memorySnapshot: { num, i, res },
        consoleOutput: consoleHistory,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'res', outputValue: res }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Check loop condition: i (6) <= 5 is False. Loop exits.',
      explanationHinglish: 'Condition check: i (6) <= 5 False hai. Loop exit hua.',
      memorySnapshot: { num, i: 6 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: '<= 5', result: 'False', storeIn: 'Condition' }
    });

    return steps;
  },
  executionSteps: []
};

export const c_even_numbers: LessonProgram = {
  id: 'c_even_numbers',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 3,
  friendlyName: 'Print Even Numbers',
  learningObjective: 'Loop with step increment (i += 2) to print even numbers in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '8', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 8, min: 2, max: 16, label: 'Upper limit n' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Math.min(16, Math.max(2, Number(vars?.n ?? 8)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let consoleHistory = '';

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare limit n = ${n}.`,
      explanationHinglish: `Variable n = ${n} declare hua.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    for (let i = 2; i <= n; i += 2) {
      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: `Check loop condition: i (${i}) <= ${n} is True.`,
        explanationHinglish: `Condition check: i (${i}) <= ${n} True hai.`,
        memorySnapshot: { n, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'True', storeIn: 'Condition' }
      });

      consoleHistory += (consoleHistory ? '\n' : '') + String(i);

      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `printf outputs even number: ${i}.`,
        explanationHinglish: `printf se even number ${i} print hua.`,
        memorySnapshot: { n, i },
        consoleOutput: consoleHistory,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'i', outputValue: i }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Check loop condition: i (${n + 2}) <= ${n} is False. Loop exits.`,
      explanationHinglish: `Condition check: i (${n + 2}) <= ${n} False ho gayi. Loop exit hua.`,
      memorySnapshot: { n, i: n + 2 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'False', storeIn: 'Condition' }
    });

    return steps;
  },
  executionSteps: []
};

export const c_fibonacci: LessonProgram = {
  id: 'c_fibonacci',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 4,
  friendlyName: 'Fibonacci Series',
  learningObjective: 'Generate N Fibonacci terms (0, 1, 1, 2, 3...) using for loops in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'next' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'next' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 8, label: 'Terms N' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Math.min(8, Math.max(1, Number(vars?.n ?? 5)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let a = 0;
    let b = 1;
    let consoleHistory = '';

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare number of terms n = ${n}.`,
      explanationHinglish: `Terms n = ${n} declare kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize starting terms: a = 0, b = 1.',
      explanationHinglish: 'Fibonacci ke pehle 2 terms a = 0 aur b = 1 initialize kiye.',
      memorySnapshot: { n, a: 0, b: 1 },
      animationEvent: {
        type: 'MULTI_CREATE_VARIABLES' as const,
        variables: [
          { name: 'a', value: 0 },
          { name: 'b', value: 1 }
        ]
      }
    });

    for (let i = 1; i <= n; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Check loop condition: i (${i}) <= ${n} is True.`,
        explanationHinglish: `Condition check: i (${i}) <= ${n} True hai.`,
        memorySnapshot: { n, a, b, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'True', storeIn: 'Condition' }
      });

      consoleHistory += (consoleHistory ? '\n' : '') + String(a);

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `printf prints current term: ${a}.`,
        explanationHinglish: `printf se current term ${a} print hua.`,
        memorySnapshot: { n, a, b, i },
        consoleOutput: consoleHistory,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'a', outputValue: a }
      });

      const next = a + b;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Compute next term: next = a + b = ${a} + ${b} = ${next}.`,
        explanationHinglish: `Agla term calculate kiya: next = ${a} + ${b} = ${next}.`,
        memorySnapshot: { n, a, b, i, next },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['a', 'b'], operator: '+', result: next, storeIn: 'next' }
      });

      const oldA = a;
      a = b;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Shift: a = b -> ${a}.`,
        explanationHinglish: `a ki value b (${a}) set hui.`,
        memorySnapshot: { n, a, b, i, next },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', newValue: a, oldValue: oldA }
      });

      const oldB = b;
      b = next;
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Shift: b = next -> ${b}.`,
        explanationHinglish: `b ki value next (${b}) set hui.`,
        memorySnapshot: { n, a, b, i, next },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'b', newValue: b, oldValue: oldB }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Check loop condition: i (${n + 1}) <= ${n} is False. Loop exits.`,
      explanationHinglish: `Condition check: i (${n + 1}) <= ${n} False ho gayi. Loop exit hua.`,
      memorySnapshot: { n, a, b, i: n + 1 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'False', storeIn: 'Condition' }
    });

    return steps;
  },
  executionSteps: []
};

export const c_while_basic: LessonProgram = {
  id: 'c_while_basic',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 1,
  friendlyName: 'While Loop Counter',
  learningObjective: 'Learn while loop conditional repetition and state updates in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 10, label: 'Limit n' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const limit = Math.min(10, Math.max(1, Number(vars?.n ?? 5)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let i = 1;
    let consoleHistory = '';

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: 'Initialize counter i = 1.',
      explanationHinglish: 'Loop counter i = 1 initialize hua.',
      memorySnapshot: { i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Set loop limit n = ${limit}.`,
      explanationHinglish: `Loop limit n = ${limit} set kiya.`,
      memorySnapshot: { i: 1, n: limit },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: limit }
    });

    while (i <= limit) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `while condition check: i (${i}) <= ${limit} is True.`,
        explanationHinglish: `Condition check: i (${i}) <= ${limit} True hai.`,
        memorySnapshot: { i, n: limit },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'True', storeIn: 'Condition' }
      });

      consoleHistory += (consoleHistory ? '\n' : '') + String(i);
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `printf prints current counter: ${i}.`,
        explanationHinglish: `printf se i = ${i} print hua.`,
        memorySnapshot: { i, n: limit },
        consoleOutput: consoleHistory,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'i', outputValue: i }
      });

      const oldI = i;
      i++;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Increment counter: i++ (${oldI} + 1 = ${i}).`,
        explanationHinglish: `Counter increment hua: i++ -> i = ${i}.`,
        memorySnapshot: { i, n: limit },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: '+ 1', result: i, storeIn: 'i' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `while condition check: i (${i}) <= ${limit} is False. Loop exits.`,
      explanationHinglish: `Condition check: i (${i}) <= ${limit} False ho gayi. Loop exit hua.`,
      memorySnapshot: { i, n: limit },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'False', storeIn: 'Condition' }
    });

    return steps;
  },
  executionSteps: []
};

export const c_digit_sum: LessonProgram = {
  id: 'c_digit_sum',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 2,
  friendlyName: 'Sum of Digits',
  learningObjective: 'Extract digits using % 10 and / 10 inside a while loop in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '245', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 245, min: 1, max: 99999, label: 'Number (n)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let currentN = Math.abs(Number(vars?.n ?? 245));
    const initialN = currentN;
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let sum = 0;
    let digit = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Store the number ${initialN} in "n".`,
      explanationHinglish: `"n" variable me ${initialN} save kiya.`,
      memorySnapshot: { n: initialN },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: initialN }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize sum to 0.',
      explanationHinglish: '"sum" ki value 0 set ki.',
      memorySnapshot: { n: initialN, sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    while (currentN > 0) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Check if n > 0. (${currentN} > 0) is True.`,
        explanationHinglish: `Check kiya kya n > 0. Yeh True hai.`,
        memorySnapshot: { n: currentN, sum, ...(digit > 0 ? { digit } : {}) },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' }
      });

      digit = currentN % 10;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Extract the last digit using modulo 10: ${currentN} % 10 = ${digit}.`,
        explanationHinglish: `Aakhri digit nikalne ke liye % 10 kiya: digit = ${digit}.`,
        memorySnapshot: { n: currentN, sum, digit },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '% 10', result: digit, storeIn: 'digit' }
      });

      const oldSum = sum;
      sum += digit;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Add the digit to sum: ${oldSum} + ${digit} = ${sum}.`,
        explanationHinglish: `Sum mein digit joda: ${oldSum} + ${digit} = ${sum}.`,
        memorySnapshot: { n: currentN, sum, digit },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['sum', 'digit'], operator: '+', result: sum, storeIn: 'sum' }
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 10);
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Remove the last digit using integer division: ${oldN} / 10 = ${currentN}.`,
        explanationHinglish: `Aakhri digit hatane ke liye 10 se divide kiya: n = ${currentN}.`,
        memorySnapshot: { n: currentN, sum, digit },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '/ 10', result: currentN, storeIn: 'n' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Check if n > 0. (${currentN} > 0) is False. The loop exits.`,
      explanationHinglish: `Kya ${currentN} > 0 hai? False. Loop yahin exit hua.`,
      memorySnapshot: { n: currentN, sum, digit },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `Print the final sum (${sum}).`,
      explanationHinglish: `Final sum print kiya (${sum}).`,
      memorySnapshot: { n: currentN, sum, digit },
      consoleOutput: String(sum),
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: sum }
    });

    return steps;
  },
  executionSteps: []
};

export const c_factorial: LessonProgram = {
  id: 'c_factorial',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 3,
  friendlyName: 'Factorial',
  learningObjective: 'Compute multiplicative factorial sequence using while loops in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 8, label: 'Value of n' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Math.min(8, Math.max(1, Number(vars?.n ?? 5)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let fact = 1;
    let i = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare n = ${n}.`,
      explanationHinglish: `Variable n = ${n} declare kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize factorial accumulator fact = 1.',
      explanationHinglish: 'fact = 1 initialize hua.',
      memorySnapshot: { n, fact: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'fact', value: 1 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize counter i = 1.',
      explanationHinglish: 'i = 1 initialize kiya.',
      memorySnapshot: { n, fact: 1, i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    while (i <= n) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `while condition check: is i <= n? (${i} <= ${n}) is True.`,
        explanationHinglish: `Condition check: i (${i}) <= ${n} True hai.`,
        memorySnapshot: { n, fact, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'True', storeIn: 'Condition' }
      });

      const oldFact = fact;
      fact *= i;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Multiply: fact = ${oldFact} * ${i} = ${fact}.`,
        explanationHinglish: `fact me multiply kiya: ${oldFact} * ${i} = ${fact}.`,
        memorySnapshot: { n, fact, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['fact', 'i'], operator: '*', result: fact, storeIn: 'fact' }
      });

      const oldI = i;
      i++;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Increment counter: i++ (${oldI} + 1 = ${i}).`,
        explanationHinglish: `Counter increment hua: i++ -> i = ${i}.`,
        memorySnapshot: { n, fact, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: '+ 1', result: i, storeIn: 'i' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: `while check: is i <= n? (${i} <= ${n}) is False. Loop ends.`,
      explanationHinglish: `Condition i (${i}) <= ${n} False ho gayi. Loop exit hua.`,
      memorySnapshot: { n, fact, i },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'n'], operator: '<=', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `printf prints the factorial: ${fact}.`,
      explanationHinglish: `printf se Factorial: ${fact} print hua.`,
      memorySnapshot: { n, fact, i },
      consoleOutput: String(fact),
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'fact', outputValue: fact }
    });

    return steps;
  },
  executionSteps: []
};

export const c_reverse_num: LessonProgram = {
  id: 'c_reverse_num',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 4,
  friendlyName: 'Reverse a Number',
  learningObjective: 'Shift and reverse integer digits in C while loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1234', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 1234, min: 1, max: 99999, label: 'Number' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let currentN = Math.abs(Number(vars?.n ?? 1234));
    const initialN = currentN;
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let rev = 0;
    let rem = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare n = ${initialN}.`,
      explanationHinglish: `Variable n = ${initialN} declare hua.`,
      memorySnapshot: { n: initialN },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: initialN }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize reversed number rev = 0.',
      explanationHinglish: 'rev = 0 initialize kiya.',
      memorySnapshot: { n: initialN, rev: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'rev', value: 0 }
    });

    while (currentN > 0) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `while check: is n > 0? (${currentN} > 0) is True.`,
        explanationHinglish: `n (${currentN}) > 0 True hai.`,
        memorySnapshot: { n: currentN, rev, ...(rem > 0 ? { rem } : {}) },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '> 0', result: 'True', storeIn: 'Condition' }
      });

      rem = currentN % 10;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Extract last digit: rem = ${currentN} % 10 = ${rem}.`,
        explanationHinglish: `Last digit nikala: rem = ${rem}.`,
        memorySnapshot: { n: currentN, rev, rem },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '% 10', result: rem, storeIn: 'rem' }
      });

      const oldRev = rev;
      rev = rev * 10 + rem;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Shift and append: rev = ${oldRev} * 10 + ${rem} = ${rev}.`,
        explanationHinglish: `rev ko shift karke digit joda: rev = ${rev}.`,
        memorySnapshot: { n: currentN, rev, rem },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['rev', 'rem'], operator: '* 10 +', result: rev, storeIn: 'rev' }
      });

      const oldN = currentN;
      currentN = Math.floor(currentN / 10);
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Drop last digit: n = ${oldN} / 10 = ${currentN}.`,
        explanationHinglish: `Last digit hataya: n = ${currentN}.`,
        memorySnapshot: { n: currentN, rev, rem },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '/ 10', result: currentN, storeIn: 'n' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'while check: is n > 0? (0 > 0) is False. Loop ends.',
      explanationHinglish: 'n (0) > 0 False ho gaya. Loop khatam hua.',
      memorySnapshot: { n: 0, rev, rem },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '> 0', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `printf prints the reversed number: ${rev}.`,
      explanationHinglish: `printf se reversed number: ${rev} print hua.`,
      memorySnapshot: { n: 0, rev, rem },
      consoleOutput: String(rev),
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'rev', outputValue: rev }
    });

    return steps;
  },
  executionSteps: []
};


export const c_prime_check: LessonProgram = {
  id: 'c_prime_check',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 5,
  friendlyName: 'Prime Number Check',
  learningObjective: 'Check if an integer is prime using trial division in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is Prime\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 7, min: 2, max: 20, label: 'Candidate N' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Math.min(20, Math.max(2, Number(vars?.n ?? 7)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let isPrime = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare candidate number n = ${n}.`,
      explanationHinglish: `Number n = ${n} declare kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize isPrime flag = 1 (assume prime).',
      explanationHinglish: 'isPrime flag = 1 set kiya (prime assume kiya).',
      memorySnapshot: { n, isPrime: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'isPrime', value: 1 }
    });

    for (let i = 2; i <= Math.floor(n / 2); i++) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Loop condition check: i (${i}) <= n/2 (${Math.floor(n / 2)}) is True.`,
        explanationHinglish: `Loop check: i (${i}) <= ${Math.floor(n / 2)} True hai.`,
        memorySnapshot: { n, isPrime, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'limit'], operator: '<=', result: 'True', storeIn: 'Condition' }
      });

      const remainder = n % i;
      const isDivisible = remainder === 0;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check divisibility: ${n} % ${i} == 0 (${remainder} == 0) is ${isDivisible ? 'True' : 'False'}.`,
        explanationHinglish: `${n} % ${i} check: remainder = ${remainder} (${isDivisible ? 'Divisible' : 'Not divisible'}).`,
        memorySnapshot: { n, isPrime, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n', 'i'], operator: '% == 0', result: isDivisible ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (isDivisible) {
        isPrime = 0;
        steps.push({
          step: stepCount++,
          lineNum: 7,
          explanationEnglish: `Factor found! Set isPrime = 0.`,
          explanationHinglish: `Factor mila: isPrime = 0 set kiya.`,
          memorySnapshot: { n, isPrime: 0, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'isPrime', oldValue: 1, newValue: 0 }
        });
        steps.push({
          step: stepCount++,
          lineNum: 8,
          explanationEnglish: 'Break from loop immediately.',
          explanationHinglish: 'Loop se break karke bahar nikla.',
          memorySnapshot: { n, isPrime: 0, i },
          animationEvent: { type: 'BREAK_EXECUTION' as const }
        });
        break;
      }

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Increment divisor: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `Divisor badha: i = ${nextI}.`,
        memorySnapshot: { n, isPrime, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Divisor loop ended: no factor found up to n/2.`,
      explanationHinglish: `Loop terminate hua: n/2 tak koi factor nahi mila.`,
      memorySnapshot: { n, isPrime },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', 'limit'], operator: '<=', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 11,
      explanationEnglish: 'Check condition: isPrime == 1 is True.',
      explanationHinglish: 'Condition check: isPrime == 1 True hai.',
      memorySnapshot: { n, isPrime },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['isPrime', '1'], operator: '==', result: 'True', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 12,
      explanationEnglish: `printf confirms: "${n} is Prime".`,
      explanationHinglish: `printf se "${n} is Prime" print hua.`,
      memorySnapshot: { n, isPrime },
      consoleOutput: `${n} is Prime`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${n} is Prime` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_palindrome_num: LessonProgram = {
  id: 'c_palindrome_num',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 5,
  friendlyName: 'Palindrome Number',
  learningObjective: 'Check if an integer reads the same forwards and backwards in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '121', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is Palindrome\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 121, min: 10, max: 9999, label: 'Number N' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let n = Math.min(9999, Math.max(1, Number(vars?.n ?? 121)));
    const original = n;
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let rev = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare number n = ${n}.`,
      explanationHinglish: `Number n = ${n} declare kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Backup original number: original = ${original}.`,
      explanationHinglish: `original = ${original} me copy save ki comparison ke liye.`,
      memorySnapshot: { n, original },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'original', value: original }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize reversed number rev = 0.',
      explanationHinglish: 'rev = 0 initialize kiya.',
      memorySnapshot: { n, original, rev: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'rev', value: 0 }
    });

    while (n > 0) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `while check: n (${n}) > 0 is True.`,
        explanationHinglish: `Condition check: n (${n}) > 0 True hai.`,
        memorySnapshot: { n, original, rev },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n', '0'], operator: '>', result: 'True', storeIn: 'Condition' }
      });

      const rem = n % 10;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Extract digit: rem = ${n} % 10 = ${rem}.`,
        explanationHinglish: `Aakhri digit nikala: rem = ${rem}.`,
        memorySnapshot: { n, original, rev, rem },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'rem', value: rem }
      });

      const oldRev = rev;
      rev = rev * 10 + rem;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Append digit to rev: ${oldRev} * 10 + ${rem} = ${rev}.`,
        explanationHinglish: `rev me digit joda: rev = ${rev}.`,
        memorySnapshot: { n, original, rev, rem },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'rev', oldValue: oldRev, newValue: rev, formula: 'rev * 10 + rem' }
      });

      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Remove last digit: n = ${oldN} / 10 = ${n}.`,
        explanationHinglish: `Digit hataya: n = ${n}.`,
        memorySnapshot: { n, original, rev, rem },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'n', oldValue: oldN, newValue: n, formula: 'n / 10' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'while check: n (0) > 0 is False. Loop terminates.',
      explanationHinglish: 'Loop check False: n (0) > 0. Loop khatam hua.',
      memorySnapshot: { n: 0, original, rev },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['n', '0'], operator: '>', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 11,
      explanationEnglish: `Check: original (${original}) == rev (${rev}) is True!`,
      explanationHinglish: `Check kiya: original (${original}) == rev (${rev}) True hai!`,
      memorySnapshot: { n: 0, original, rev },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['original', 'rev'], operator: '==', result: 'True', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 12,
      explanationEnglish: `printf prints palindrome result: "${original} is Palindrome".`,
      explanationHinglish: `printf se "${original} is Palindrome" output print hua.`,
      memorySnapshot: { n: 0, original, rev },
      consoleOutput: `${original} is Palindrome`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${original} is Palindrome` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_armstrong_num: LessonProgram = {
  id: 'c_armstrong_num',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 6,
  friendlyName: 'Armstrong Number',
  learningObjective: 'Check if sum of cubes of digits equals the number in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '153', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rem' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d is Armstrong\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 153, min: 100, max: 999, label: 'Number N' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let n = Math.min(999, Math.max(100, Number(vars?.n ?? 153)));
    const original = n;
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let sum = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare candidate number n = ${n}.`,
      explanationHinglish: `Candidate number n = ${n} declare kiya.`,
      memorySnapshot: { n },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Store original backup: original = ${original}.`,
      explanationHinglish: `Backup original = ${original} store kiya.`,
      memorySnapshot: { n, original },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'original', value: original }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize sum = 0.',
      explanationHinglish: 'Cube sum = 0 initialize kiya.',
      memorySnapshot: { n: 153, original: 153, sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    while (n > 0) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `while check: n (${n}) > 0 is True.`,
        explanationHinglish: `Loop check: n (${n}) > 0 True hai.`,
        memorySnapshot: { n, original, sum },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['n', '0'], operator: '>', result: 'True', storeIn: 'Condition' }
      });

      const rem = n % 10;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Extract digit: rem = ${n} % 10 = ${rem}.`,
        explanationHinglish: `Digit nikala: rem = ${rem}.`,
        memorySnapshot: { n, original, sum, rem },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'rem', value: rem }
      });

      const cube = rem * rem * rem;
      const oldSum = sum;
      sum += cube;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Add cube: ${oldSum} + (${rem}³) = ${oldSum} + ${cube} = ${sum}.`,
        explanationHinglish: `Cube joda: ${oldSum} + ${cube} = ${sum}.`,
        memorySnapshot: { n, original, sum, rem },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: sum, formula: `sum + (${rem}³)` }
      });

      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Remove digit: n = ${oldN} / 10 = ${n}.`,
        explanationHinglish: `Digit hataya: n = ${n}.`,
        memorySnapshot: { n, original, sum, rem },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'n', oldValue: oldN, newValue: n, formula: 'n / 10' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'while check: n (0) > 0 is False. Loop ends.',
      explanationHinglish: 'Loop check False: n (0) > 0. Loop khatam hua.',
      memorySnapshot: { n: 0, original, sum },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['n', '0'], operator: '>', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 11,
      explanationEnglish: `Check: original (${original}) == sum (${sum}) is True!`,
      explanationHinglish: `Check kiya: original (${original}) == sum (${sum}) True hai!`,
      memorySnapshot: { n: 0, original, sum },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['original', 'sum'], operator: '==', result: 'True', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 12,
      explanationEnglish: `printf confirms: "${original} is Armstrong".`,
      explanationHinglish: `printf se "${original} is Armstrong" output print hua.`,
      memorySnapshot: { n: 0, original, sum },
      consoleOutput: `${original} is Armstrong`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${original} is Armstrong` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_do_while_basic: LessonProgram = {
  id: 'c_do_while_basic',
  language: 'c',
  topic: 'do_while_loop',
  lessonNumber: 1,
  friendlyName: 'Do-While Basic',
  learningObjective: 'Understand exit-controlled loop execution guaranteed to run at least once in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'do' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3', paramId: 'count' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    count: { default: 3, min: 1, max: 5, label: 'Loop count' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const count = Math.min(5, Math.max(1, Number(vars?.count ?? 3)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let i = 1;
    let consoleHistory = '';

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: 'Initialize counter i = 1.',
      explanationHinglish: 'Loop counter i = 1 initialize hua.',
      memorySnapshot: { i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    do {
      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: 'do block entered: body executes unconditionally before condition check.',
        explanationHinglish: 'do block chalu hua: bina kisi condition check ke direct body execute hogi.',
        memorySnapshot: { i },
        animationEvent: { type: 'NONE' as const }
      });

      consoleHistory += (consoleHistory ? '\n' : '') + String(i);

      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `printf prints current counter: ${i}.`,
        explanationHinglish: `printf se i = ${i} print hua.`,
        memorySnapshot: { i },
        consoleOutput: consoleHistory,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'i', outputValue: i }
      });

      const oldI = i;
      i++;

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Increment counter: i++ (${oldI} + 1 = ${i}).`,
        explanationHinglish: `i++ execute hua -> naya i = ${i}.`,
        memorySnapshot: { i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: '+ 1', result: i, storeIn: 'i' }
      });

      const cond = i <= count;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `while condition check at exit: i (${i}) <= ${count} is ${cond ? 'True (loop back)' : 'False (exit loop)'}.`,
        explanationHinglish: `Exit condition check: i (${i}) <= ${count} -> ${cond ? 'True (wapas loop)' : 'False (loop exit)'}.`,
        memorySnapshot: { i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: `<= ${count}`, result: cond ? 'True' : 'False', storeIn: 'Condition' }
      });
    } while (i <= count);

    return steps;
  },
  executionSteps: []
};

export const c_do_while_sum: LessonProgram = {
  id: 'c_do_while_sum',
  language: 'c',
  topic: 'do_while_loop',
  lessonNumber: 2,
  friendlyName: 'Do-While Sum',
  learningObjective: 'Accumulate numbers inside a do-while loop in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'do' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    n: { default: 4, min: 1, max: 6, label: 'Limit N' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const n = Math.min(6, Math.max(1, Number(vars?.n ?? 4)));
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let i = 1;
    let sum = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: 'Initialize counter i = 1.',
      explanationHinglish: 'Counter i = 1 initialize kiya.',
      memorySnapshot: { i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize accumulator sum = 0.',
      explanationHinglish: 'Sum accumulator sum = 0 initialize hua.',
      memorySnapshot: { i: 1, sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    do {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: 'do block entered: executes body before checking condition.',
        explanationHinglish: 'do block execute hua.',
        memorySnapshot: { i, sum },
        animationEvent: { type: 'NONE' as const }
      });

      const oldSum = sum;
      sum += i;

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Add i to sum: sum = ${oldSum} + ${i} = ${sum}.`,
        explanationHinglish: `sum me i add hua: ${oldSum} + ${i} = ${sum}.`,
        memorySnapshot: { i, sum },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['sum', 'i'], operator: '+', result: sum, storeIn: 'sum' }
      });

      const oldI = i;
      i++;

      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Increment i++ (${oldI} + 1 = ${i}).`,
        explanationHinglish: `i++ hua -> naya i = ${i}.`,
        memorySnapshot: { i, sum },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: '+ 1', result: i, storeIn: 'i' }
      });

      const cond = i <= n;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `while condition check at exit: i (${i}) <= ${n} is ${cond ? 'True (loop back)' : 'False (exit loop)'}.`,
        explanationHinglish: `Exit condition: i (${i}) <= ${n} -> ${cond ? 'True' : 'False'}.`,
        memorySnapshot: { i, sum },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i'], operator: `<= ${n}`, result: cond ? 'True' : 'False', storeIn: 'Condition' }
      });
    } while (i <= n);

    steps.push({
      step: stepCount++,
      lineNum: 9,
      explanationEnglish: `printf prints the final sum: ${sum}.`,
      explanationHinglish: `printf se final sum: ${sum} print hua.`,
      memorySnapshot: { i, sum },
      consoleOutput: String(sum),
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: sum }
    });

    return steps;
  },
  executionSteps: []
};


export const c_string_length: LessonProgram = {
  id: 'c_string_length',
  language: 'c',
  topic: 'strings',
  lessonNumber: 1,
  friendlyName: 'String Length',
  learningObjective: 'Measure null-terminated character array length in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Code"', paramId: 'str' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'len' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'len' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'\\0'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'len' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Length: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'len' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    str: { default: 'Code', type: 'text', label: 'Input String' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = String(vars?.str ?? 'Code').slice(0, 8);
    const chars = raw.split('');
    const arrJson = JSON.stringify([...chars, '\\0']);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare character array str[] = "${raw}" with terminating '\\0'.`,
      explanationHinglish: `Character array str[] = "${raw}" declare hua jisme last me '\\0' store hota hai.`,
      memorySnapshot: { str: arrJson },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'str', value: arrJson }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Initialize length accumulator len = 0.`,
      explanationHinglish: `Counter variable len = 0 initialize kiya.`,
      memorySnapshot: { str: arrJson, len: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'len', value: 0 }
    });

    for (let i = 0; i < chars.length; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Check condition: str[${i}] ('${chars[i]}') != '\\0' is True.`,
        explanationHinglish: `Check kiya: str[${i}] ('${chars[i]}') != '\\0' True hai.`,
        memorySnapshot: { str: arrJson, len: i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'str', index: i }
      });

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Increment len: ${i} -> ${i + 1}.`,
        explanationHinglish: `len badhakar ${i + 1} hua.`,
        memorySnapshot: { str: arrJson, len: i + 1 },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'len', oldValue: i, newValue: i + 1, formula: 'len++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Check condition: str[${chars.length}] ('\\0') != '\\0' is False. Loop terminates.`,
      explanationHinglish: `str[${chars.length}] ('\\0') null character mil gaya. Loop end hua.`,
      memorySnapshot: { str: arrJson, len: chars.length },
      animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'str', index: chars.length }
    });

    steps.push({
      step: stepCount++,
      lineNum: 8,
      explanationEnglish: `printf outputs calculated string length: ${chars.length}.`,
      explanationHinglish: `printf se string length ${chars.length} print hua.`,
      memorySnapshot: { str: arrJson, len: chars.length },
      consoleOutput: `Length: ${chars.length}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Length: ${chars.length}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_string_copy: LessonProgram = {
  id: 'c_string_copy',
  language: 'c',
  topic: 'strings',
  lessonNumber: 2,
  friendlyName: 'Copy String',
  learningObjective: 'Copy character array contents into destination buffer.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'src' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"CPro"', paramId: 'src' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'dest' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'src' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'\\0'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'dest' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'src' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'dest' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'\\0'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Copied: %s\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'dest' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    src: { default: 'CPro', type: 'text', label: 'Source String' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = String(vars?.src ?? 'CPro').slice(0, 4);
    const chars = raw.split('');
    const srcArr = [...chars, '\\0'];
    const destArr = Array(chars.length + 1).fill('?');
    const srcJson = JSON.stringify(srcArr);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare source string src[] = "${raw}".`,
      explanationHinglish: `Source string src[] = "${raw}" initialize hua.`,
      memorySnapshot: { src: srcJson },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'src', value: srcJson }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Allocate destination buffer dest[${chars.length + 1}].`,
      explanationHinglish: `Destination array dest[${chars.length + 1}] allocate hua.`,
      memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'dest', value: JSON.stringify(destArr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize loop index i = 0.',
      explanationHinglish: 'Index counter i = 0 set kiya.',
      memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr), i: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 0 }
    });

    for (let k = 0; k < chars.length; k++) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check condition: src[${k}] ('${chars[k]}') != '\\0' is True.`,
        explanationHinglish: `Check kiya: src[${k}] ('${chars[k]}') null terminator nahi hai.`,
        memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr), i: k },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'src', index: k }
      });

      destArr[k] = chars[k];
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Copy dest[${k}] = src[${k}] ('${chars[k]}').`,
        explanationHinglish: `dest[${k}] me '${chars[k]}' copy kiya.`,
        memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr), i: k },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'dest', index: k, oldValue: '?', newValue: chars[k] }
      });

      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Increment i: ${k} -> ${k + 1}.`,
        explanationHinglish: `Index i increment hua: ${k + 1}.`,
        memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr), i: k + 1 },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: k, newValue: k + 1, formula: 'i++' }
      });
    }

    destArr[chars.length] = '\\0';
    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `Append null terminator dest[${chars.length}] = '\\0' to finalize string.`,
      explanationHinglish: `String complete karne ke liye dest[${chars.length}] pe '\\0' lagaya.`,
      memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr), i: chars.length },
      animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'dest', index: chars.length, oldValue: '?', newValue: '\\0' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 11,
      explanationEnglish: `printf outputs copied string: "${raw}".`,
      explanationHinglish: `printf se copied string "${raw}" print hua.`,
      memorySnapshot: { src: srcJson, dest: JSON.stringify(destArr), i: chars.length },
      consoleOutput: `Copied: ${raw}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Copied: ${raw}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_string_reverse: LessonProgram = {
  id: 'c_string_reverse',
  language: 'c',
  topic: 'strings',
  lessonNumber: 3,
  friendlyName: 'Reverse String',
  learningObjective: 'Reverse character array in-place using two-pointer swap.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"FLOW"', paramId: 'word' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'start' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '--' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed: %s\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    word: { default: 'FLOW', type: 'text', label: 'String to Reverse' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = String(vars?.word ?? 'FLOW').slice(0, 6);
    const chars = [...raw.split(''), '\\0'];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let start = 0;
    let end = Math.max(0, raw.length - 1);

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize char str[] = "${raw}".`,
      explanationHinglish: `Character array str[] = "${raw}" declare hua.`,
      memorySnapshot: { str: JSON.stringify(chars) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'str', value: JSON.stringify(chars) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Set left pointer start = 0.',
      explanationHinglish: 'Left pointer start = 0 set kiya.',
      memorySnapshot: { str: JSON.stringify(chars), start: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'start', value: 0 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Set right pointer end = ${end}.`,
      explanationHinglish: `Right pointer end = ${end} set kiya.`,
      memorySnapshot: { str: JSON.stringify(chars), start: 0, end },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'end', value: end }
    });

    while (start < end) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check condition: start (${start}) < end (${end}) is True.`,
        explanationHinglish: `Condition check: start (${start}) < end (${end}) True hai.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['start', 'end'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      const tempVal = chars[start];
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Backup str[${start}] ('${tempVal}') into temp.`,
        explanationHinglish: `temp variable me str[${start}] ('${tempVal}') copy kiya.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, temp: tempVal },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'temp', value: `'${tempVal}'` }
      });

      const oldStart = chars[start];
      chars[start] = chars[end];
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Swap left: str[${start}] = str[${end}] ('${chars[start]}').`,
        explanationHinglish: `str[${start}] me right character '${chars[start]}' set kiya.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, temp: tempVal },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'str', index: start, oldValue: oldStart, newValue: chars[start] }
      });

      const oldEnd = chars[end];
      chars[end] = tempVal;
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Swap right: str[${end}] = temp ('${tempVal}').`,
        explanationHinglish: `str[${end}] me temp character '${tempVal}' set kiya.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, temp: tempVal },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'str', index: end, oldValue: oldEnd, newValue: tempVal }
      });

      const nextStart = start + 1;
      const nextEnd = end - 1;
      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: `Move pointer: start++ (${start} -> ${nextStart}).`,
        explanationHinglish: `Left pointer aage badha: start = ${nextStart}.`,
        memorySnapshot: { str: JSON.stringify(chars), start: nextStart, end },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'start', oldValue: start, newValue: nextStart, formula: 'start++' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 11,
        explanationEnglish: `Move pointer: end-- (${end} -> ${nextEnd}).`,
        explanationHinglish: `Right pointer peeche aaya: end = ${nextEnd}.`,
        memorySnapshot: { str: JSON.stringify(chars), start: nextStart, end: nextEnd },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'end', oldValue: end, newValue: nextEnd, formula: 'end--' }
      });

      start = nextStart;
      end = nextEnd;
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: `Check condition: start (${start}) < end (${end}) is False. Loop ends.`,
      explanationHinglish: `Condition check: start (${start}) < end (${end}) False ho gaya. Loop terminate hua.`,
      memorySnapshot: { str: JSON.stringify(chars), start, end },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['start', 'end'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    const reversedStr = chars.slice(0, chars.length - 1).join('');
    steps.push({
      step: stepCount++,
      lineNum: 13,
      explanationEnglish: `printf prints in-place reversed string: "${reversedStr}".`,
      explanationHinglish: `printf se reversed string "${reversedStr}" print hui.`,
      memorySnapshot: { str: JSON.stringify(chars), start, end },
      consoleOutput: `Reversed: ${reversedStr}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Reversed: ${reversedStr}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_string_palindrome: LessonProgram = {
  id: 'c_string_palindrome',
  language: 'c',
  topic: 'strings',
  lessonNumber: 4,
  friendlyName: 'String Palindrome',
  learningObjective: 'Check if a string reads the same forwards and backwards using two pointers in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"radar"', paramId: 'word' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPal' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'isPal' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'start' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '--' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'isPal' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%s is Palindrome\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 19, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    word: { default: 'radar', type: 'text', label: 'Word to check' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = vars?.word ? String(vars.word).trim().toLowerCase() : 'radar';
    const cleanWord = (raw.replace(/[^a-z]/g, '').slice(0, 6)) || 'radar';
    const chars = [...cleanWord.split(''), '\\0'];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let start = 0;
    let end = cleanWord.length - 1;
    let isPal = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize char str[] = "${cleanWord}".`,
      explanationHinglish: `Character array str[] = "${cleanWord}" memory me allocate hui.`,
      memorySnapshot: { str: JSON.stringify(chars) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'str', value: JSON.stringify(chars) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Set left pointer: start = 0.',
      explanationHinglish: 'Left pointer start = 0 set kiya.',
      memorySnapshot: { str: JSON.stringify(chars), start: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'start', value: 0 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Set right pointer: end = ${end}.`,
      explanationHinglish: `Right pointer end = ${end} set kiya.`,
      memorySnapshot: { str: JSON.stringify(chars), start: 0, end },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'end', value: end }
    });

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'Initialize isPal flag = 1 (assume palindrome).',
      explanationHinglish: 'isPal flag = 1 set kiya.',
      memorySnapshot: { str: JSON.stringify(chars), start: 0, end, isPal: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'isPal', value: 1 }
    });

    while (start < end) {
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check condition: start (${start}) < end (${end}) is True.`,
        explanationHinglish: `Condition check: start (${start}) < end (${end}) True hai.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, isPal },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['start', 'end'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Compare str[${start}] ('${chars[start]}') with str[${end}] ('${chars[end]}').`,
        explanationHinglish: `Pointers ke characters compare kiye: '${chars[start]}' aur '${chars[end]}'.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, isPal },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'str', index: start }
      });

      const mismatch = chars[start] !== chars[end];
      if (mismatch) {
        isPal = 0;
        steps.push({
          step: stepCount++,
          lineNum: 9,
          explanationEnglish: `Mismatch: '${chars[start]}' != '${chars[end]}'. Set isPal = 0.`,
          explanationHinglish: `Mismatch mila: '${chars[start]}' != '${chars[end]}'. isPal = 0 kiya.`,
          memorySnapshot: { str: JSON.stringify(chars), start, end, isPal: 0 },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'isPal', oldValue: 1, newValue: 0, formula: '0' }
        });

        steps.push({
          step: stepCount++,
          lineNum: 10,
          explanationEnglish: 'break statement terminates the loop.',
          explanationHinglish: 'break se loop turant band hua.',
          memorySnapshot: { str: JSON.stringify(chars), start, end, isPal: 0 },
          animationEvent: { type: 'COMPUTE' as const, inputs: ['break'], operator: 'break', result: 'Exited', storeIn: 'Loop' }
        });
        break;
      }

      const nextStart = start + 1;
      const nextEnd = end - 1;
      steps.push({
        step: stepCount++,
        lineNum: 12,
        explanationEnglish: `Characters match! Advance left pointer: start++ (${start} -> ${nextStart}).`,
        explanationHinglish: `Dono same hain! Left pointer aage badha: start = ${nextStart}.`,
        memorySnapshot: { str: JSON.stringify(chars), start: nextStart, end, isPal },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'start', oldValue: start, newValue: nextStart, formula: 'start++' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 13,
        explanationEnglish: `Retreat right pointer: end-- (${end} -> ${nextEnd}).`,
        explanationHinglish: `Right pointer peeche laya: end = ${nextEnd}.`,
        memorySnapshot: { str: JSON.stringify(chars), start: nextStart, end: nextEnd, isPal },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'end', oldValue: end, newValue: nextEnd, formula: 'end--' }
      });

      start = nextStart;
      end = nextEnd;
    }

    if (isPal === 1) {
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Loop ended: start (${start}) < end (${end}) is False.`,
        explanationHinglish: `Loop terminate hua: start (${start}) >= end (${end}).`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, isPal },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['start', 'end'], operator: '<', result: 'False', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 15,
        explanationEnglish: 'Check condition: isPal == 1 is True.',
        explanationHinglish: 'isPal == 1 True hai: saare characters mirror match hue.',
        memorySnapshot: { str: JSON.stringify(chars), start, end, isPal },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['isPal', '1'], operator: '==', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 16,
        explanationEnglish: `printf prints confirmation: "${cleanWord} is Palindrome".`,
        explanationHinglish: `printf se "${cleanWord} is Palindrome" output print hua.`,
        memorySnapshot: { str: JSON.stringify(chars), start, end, isPal },
        consoleOutput: `${cleanWord} is Palindrome`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${cleanWord} is Palindrome` }
      });
    } else {
      steps.push({
        step: stepCount++,
        lineNum: 15,
        explanationEnglish: 'Check condition: isPal == 1 is False (not a palindrome).',
        explanationHinglish: 'isPal == 1 False hai (palindrome nahi hai).',
        memorySnapshot: { str: JSON.stringify(chars), start, end, isPal: 0 },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['isPal', '1'], operator: '==', result: 'False', storeIn: 'Condition' }
      });
    }

    return steps;
  },
  executionSteps: []
};


export const c_string_vowels: LessonProgram = {
  id: 'c_string_vowels',
  language: 'c',
  topic: 'strings',
  lessonNumber: 5,
  friendlyName: 'Count Vowels',
  learningObjective: 'Traverse a character array and count vowels (a, e, i, o, u) in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"apple"', paramId: 'word' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'vowels' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'\\0'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'vowels' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Vowels = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'vowels' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    word: { default: 'apple', type: 'text', label: 'Input word' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = vars?.word ? String(vars.word).trim().toLowerCase() : 'apple';
    const cleanWord = (raw.replace(/[^a-z]/g, '').slice(0, 6)) || 'apple';
    const chars = [...cleanWord.split(''), '\\0'];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let vowels = 0;
    let i = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize char str[] = "${cleanWord}".`,
      explanationHinglish: `String str[] = "${cleanWord}" initialize hui.`,
      memorySnapshot: { str: JSON.stringify(chars) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'str', value: JSON.stringify(chars) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize vowels counter = 0.',
      explanationHinglish: 'vowels counter = 0 set kiya.',
      memorySnapshot: { str: JSON.stringify(chars), vowels: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'vowels', value: 0 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Set loop index i = 0.',
      explanationHinglish: 'Index i = 0 set kiya.',
      memorySnapshot: { str: JSON.stringify(chars), vowels: 0, i: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 0 }
    });

    while (chars[i] !== '\\0') {
      const ch = chars[i];
      const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(ch);

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `while check: str[${i}] ('${ch}') != '\\0' is True.`,
        explanationHinglish: `str[${i}] ('${ch}') null terminator nahi hai.`,
        memorySnapshot: { str: JSON.stringify(chars), vowels, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'str', index: i }
      });

      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Read character ch = '${ch}'.`,
        explanationHinglish: `ch = '${ch}' read kiya.`,
        memorySnapshot: { str: JSON.stringify(chars), vowels, i, ch: `'${ch}'` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: `'${ch}'` }
      });

      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Check: is '${ch}' a vowel? (${isVowel ? 'Yes' : 'No'}).`,
        explanationHinglish: `Kya '${ch}' vowel hai? ${isVowel ? 'Haan' : 'Nahi'}.`,
        memorySnapshot: { str: JSON.stringify(chars), vowels, i, ch: `'${ch}'` },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: 'isVowel', result: isVowel ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (isVowel) {
        const oldVowels = vowels;
        vowels++;
        steps.push({
          step: stepCount++,
          lineNum: 9,
          explanationEnglish: `Vowel found! vowels++ (${oldVowels} -> ${vowels}).`,
          explanationHinglish: `Vowel mila! vowels counter increment hua: ${vowels}.`,
          memorySnapshot: { str: JSON.stringify(chars), vowels, i, ch: `'${ch}'` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'vowels', oldValue: oldVowels, newValue: vowels, formula: 'vowels++' }
        });
      }

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 11,
        explanationEnglish: `Advance index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `Index aage badha: i = ${nextI}.`,
        memorySnapshot: { str: JSON.stringify(chars), vowels, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });

      i = nextI;
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: `while check: str[${i}] is '\\0'. String scan finished.`,
      explanationHinglish: `str[${i}] null terminator hai: scan complete hua.`,
      memorySnapshot: { str: JSON.stringify(chars), vowels, i },
      animationEvent: { type: 'COMPUTE' as const, inputs: [`str[${i}]`, "'\\0'"], operator: '!=', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 13,
      explanationEnglish: `printf prints total vowel count: "Vowels = ${vowels}".`,
      explanationHinglish: `printf se "Vowels = ${vowels}" print hua.`,
      memorySnapshot: { str: JSON.stringify(chars), vowels },
      consoleOutput: `Vowels = ${vowels}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Vowels = ${vowels}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_string_concat: LessonProgram = {
  id: 'c_string_concat',
  language: 'c',
  topic: 'strings',
  lessonNumber: 6,
  friendlyName: 'Concatenate Strings',
  learningObjective: 'Append one string to another without library functions in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Hi"', paramId: 's1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Go"', paramId: 's2' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'\\0'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'\\0'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Merged: %s\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    s1: { default: 'Hi', type: 'text', label: 'First string' },
    s2: { default: 'Go', type: 'text', label: 'Second string' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawS1 = vars?.s1 ? String(vars.s1).trim().slice(0, 4) : 'Hi';
    const rawS2 = vars?.s2 ? String(vars.s2).trim().slice(0, 4) : 'Go';
    const str1 = rawS1 || 'Hi';
    const str2 = rawS2 || 'Go';
    const s1Chars = [...str1.split(''), ...Array(10 - str1.length).fill(' ')];
    s1Chars[str1.length] = '\\0';
    const s2Chars = [...str2.split(''), '\\0'];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let i = str1.length;
    let j = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize destination buffer s1[10] = "${str1}".`,
      explanationHinglish: `Destination buffer s1[10] = "${str1}" initialize hua.`,
      memorySnapshot: { s1: JSON.stringify(s1Chars) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 's1', value: JSON.stringify(s1Chars) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Initialize source string s2[] = "${str2}".`,
      explanationHinglish: `Source string s2[] = "${str2}" initialize hui.`,
      memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 's2', value: JSON.stringify(s2Chars) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: `Set i = ${i} (end of "${str1}" in s1).`,
      explanationHinglish: `s1 ke end ka index i = ${i} set kiya.`,
      memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: i }
    });

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'Set j = 0 (start of s2).',
      explanationHinglish: 's2 ka start index j = 0 set kiya.',
      memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i, j: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'j', value: 0 }
    });

    while (s2Chars[j] !== '\\0') {
      const ch = s2Chars[j];
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `while check: s2[${j}] ('${ch}') != '\\0' is True.`,
        explanationHinglish: `s2[${j}] ('${ch}') null terminator nahi hai.`,
        memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i, j },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 's2', index: j }
      });

      const oldVal = s1Chars[i];
      s1Chars[i] = ch;
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Append: s1[${i}] = s2[${j}] ('${ch}').`,
        explanationHinglish: `s1[${i}] me '${ch}' copy kiya.`,
        memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i, j },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 's1', index: i, oldValue: oldVal, newValue: ch }
      });

      const nextI = i + 1;
      const nextJ = j + 1;
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Increment destination index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `i++ -> ${nextI}.`,
        memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i: nextI, j },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: `Increment source index: j++ (${j} -> ${nextJ}).`,
        explanationHinglish: `j++ -> ${nextJ}.`,
        memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i: nextI, j: nextJ },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'j', oldValue: j, newValue: nextJ, formula: 'j++' }
      });

      i = nextI;
      j = nextJ;
    }

    s1Chars[i] = '\\0';
    steps.push({
      step: stepCount++,
      lineNum: 12,
      explanationEnglish: `Append null terminator: s1[${i}] = '\\0'.`,
      explanationHinglish: `s1[${i}] me null terminator '\\0' lagaya.`,
      memorySnapshot: { s1: JSON.stringify(s1Chars), s2: JSON.stringify(s2Chars), i },
      animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 's1', index: i, oldValue: s1Chars[i], newValue: '\\0' }
    });

    const merged = str1 + str2;
    steps.push({
      step: stepCount++,
      lineNum: 13,
      explanationEnglish: `printf prints concatenated string: "Merged: ${merged}".`,
      explanationHinglish: `printf se "Merged: ${merged}" output print hua.`,
      memorySnapshot: { s1: JSON.stringify(s1Chars) },
      consoleOutput: `Merged: ${merged}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Merged: ${merged}` }
    });

    return steps;
  },
  executionSteps: []
};


// ─── TOPIC 12: FUNCTIONS (4 Programs) ──────────────────────────────────────────

export const c_functions: LessonProgram = {
  id: 'c_functions',
  language: 'c',
  topic: 'functions',
  lessonNumber: 1,
  friendlyName: 'Square of a Number (Function)',
  learningObjective: 'Learn how to pass an argument to a function, execute its body, and return the computed square.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'square' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 7, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'square' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Square = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 5, min: 1, max: 20, type: 'number', label: 'Input Number (num)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const num = Number(vars.num ?? 5);
    const result = num * num;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define function square(int n) that computes and returns the square of n.',
        explanationHinglish: 'square(int n) function define kiya jo n ka square calculate karke return karega.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 8,
        explanationEnglish: `Allocate 4 bytes for int num and initialize with ${num}.`,
        explanationHinglish: `Variable num [4 Bytes] initialize kiya ${num} ke saath.`,
        memorySnapshot: { num: `${num} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num }
      },
      {
        step: 3, lineNum: 9,
        explanationEnglish: `Call square(num) passing argument ${num}. Control jumps to square().`,
        explanationHinglish: `square(num) call kiya argument ${num} ke saath. Control square function par jump hua.`,
        memorySnapshot: { num: `${num} [4B]` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'square', args: { n: num } }
      },
      {
        step: 4, lineNum: 3,
        explanationEnglish: `Parameter n in square() receives value ${num}.`,
        explanationHinglish: `square() ke parameter n ko value ${num} mili.`,
        memorySnapshot: { num: `${num} [4B]`, n: `${num} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: num }
      },
      {
        step: 5, lineNum: 4,
        explanationEnglish: `Calculate ${num} * ${num} = ${result} and return it to caller.`,
        explanationHinglish: `${num} * ${num} = ${result} calculate karke caller ko return kiya.`,
        memorySnapshot: { num: `${num} [4B]`, n: `${num} [4B]` },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'square', returnValue: result }
      },
      {
        step: 6, lineNum: 9,
        explanationEnglish: `Function returned ${result}. Store in variable ans.`,
        explanationHinglish: `Function se ${result} return aaya aur variable ans mein store hua.`,
        memorySnapshot: { num: `${num} [4B]`, ans: `${result} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: result }
      },
      {
        step: 7, lineNum: 10,
        explanationEnglish: `printf displays Square = ${result}.`,
        explanationHinglish: `printf console pe Square = ${result} display karta hai.`,
        memorySnapshot: { num: `${num} [4B]`, ans: `${result} [4B]` },
        consoleOutput: `Square = ${result}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: result }
      }
    ];
  },
  executionSteps: []
};

export const c_func_addition: LessonProgram = {
  id: 'c_func_addition',
  language: 'c',
  topic: 'functions',
  lessonNumber: 2,
  friendlyName: 'Addition Function',
  learningObjective: 'Learn how multiple parameters are passed and returned in C functions.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'add' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 7, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '15', paramId: 'x' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'y' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'add' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'x' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'y' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sum = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    x: { default: 15, min: 1, max: 100, type: 'number', label: 'First Number (x)' },
    y: { default: 20, min: 1, max: 100, type: 'number', label: 'Second Number (y)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const x = Number(vars.x ?? 15);
    const y = Number(vars.y ?? 20);
    const sum = x + y;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define function add(int a, int b) that returns the sum of two parameters.',
        explanationHinglish: 'add(int a, int b) function banaya jo do arguments ka sum return karta hai.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 8,
        explanationEnglish: `Store ${x} in variable x.`,
        explanationHinglish: `Variable x mein ${x} store kiya.`,
        memorySnapshot: { x: `${x} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'x', value: x }
      },
      {
        step: 3, lineNum: 9,
        explanationEnglish: `Store ${y} in variable y.`,
        explanationHinglish: `Variable y mein ${y} store kiya.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'y', value: y }
      },
      {
        step: 4, lineNum: 10,
        explanationEnglish: `Call add(x, y) passing arguments ${x} and ${y}. Jump to function definition.`,
        explanationHinglish: `add(x, y) call kiya ${x} aur ${y} pass karke. Control add() par jump hua.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'add', args: { a: x, b: y } }
      },
      {
        step: 5, lineNum: 3,
        explanationEnglish: `Parameters receive arguments: a = ${x}, b = ${y}.`,
        explanationHinglish: `add() ke parameters ko values mili: a = ${x}, b = ${y}.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, a: `${x} [4B]`, b: `${y} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: x }
      },
      {
        step: 6, lineNum: 4,
        explanationEnglish: `Compute ${x} + ${y} = ${sum} and return to caller.`,
        explanationHinglish: `${x} + ${y} = ${sum} calculate karke return kiya.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, a: `${x} [4B]`, b: `${y} [4B]` },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'add', returnValue: sum }
      },
      {
        step: 7, lineNum: 10,
        explanationEnglish: `Store returned sum (${sum}) in variable sum.`,
        explanationHinglish: `Return aayi value (${sum}) ko variable sum mein store kiya.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, sum: `${sum} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'sum', value: sum }
      },
      {
        step: 8, lineNum: 11,
        explanationEnglish: `printf prints Sum = ${sum}.`,
        explanationHinglish: `printf se Sum = ${sum} console pe display hua.`,
        memorySnapshot: { x: `${x} [4B]`, y: `${y} [4B]`, sum: `${sum} [4B]` },
        consoleOutput: `Sum = ${sum}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'sum', outputValue: sum }
      }
    ];
  },
  executionSteps: []
};

export const c_func_call_by_val: LessonProgram = {
  id: 'c_func_call_by_val',
  language: 'c',
  topic: 'functions',
  lessonNumber: 3,
  friendlyName: 'Call by Value (Stack Isolation)',
  learningObjective: 'Understand that C passes arguments by value, so modifying the formal parameter does not affect the caller variable.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'modify' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'x' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 7, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'modify' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Value in main = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 25, min: 1, max: 100, type: 'number', label: 'Initial Value (num)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const num = Number(vars.num ?? 25);
    const modifiedX = num + 10;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define function modify(int x) that increments parameter x locally.',
        explanationHinglish: 'modify(int x) function define kiya jo local copy x ko increment karega.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 8,
        explanationEnglish: `Declare int num = ${num} inside main()'s stack frame.`,
        explanationHinglish: `main() ke stack frame mein int num = ${num} allocate hua.`,
        memorySnapshot: { num: `${num} [main]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num }
      },
      {
        step: 3, lineNum: 9,
        explanationEnglish: `Call modify(num). C passes a copy of ${num} by value.`,
        explanationHinglish: `modify(num) call kiya — C language ${num} ki copy bhejti hai.`,
        memorySnapshot: { num: `${num} [main]` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'modify', args: { x: num } }
      },
      {
        step: 4, lineNum: 3,
        explanationEnglish: `Parameter x in modify's stack frame receives value copy: ${num}.`,
        explanationHinglish: `modify ke alag stack frame mein parameter x ko copy mili: ${num}.`,
        memorySnapshot: { num: `${num} [main]`, x: `${num} [modify]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'x', value: num }
      },
      {
        step: 5, lineNum: 4,
        explanationEnglish: `Execute x = x + 10. Formal parameter x becomes ${modifiedX}.`,
        explanationHinglish: `x = x + 10 execute hua. Local parameter x ab ${modifiedX} ban gaya.`,
        memorySnapshot: { num: `${num} [main]`, x: `${modifiedX} [modify]` },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'x', newValue: modifiedX, oldValue: num }
      },
      {
        step: 6, lineNum: 9,
        explanationEnglish: `Function modify() ends and its stack frame is popped. Variable num in main is still ${num}!`,
        explanationHinglish: `modify() khatam hua aur uska stack frame destroy ho gaya. main ka num abhi bhi ${num} hai!`,
        memorySnapshot: { num: `${num} [main]` },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'modify', returnValue: undefined }
      },
      {
        step: 7, lineNum: 10,
        explanationEnglish: `printf displays: Value in main = ${num} (proved unchanged).`,
        explanationHinglish: `printf se Value in main = ${num} display hua (value bilkul change nahi hui).`,
        memorySnapshot: { num: `${num} [main]` },
        consoleOutput: `Value in main = ${num}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'num', outputValue: num }
      }
    ];
  },
  executionSteps: []
};

export const c_func_max: LessonProgram = {
  id: 'c_func_max',
  language: 'c',
  topic: 'functions',
  lessonNumber: 4,
  friendlyName: 'Find Maximum of Two Numbers',
  learningObjective: 'Learn how to use conditional statements inside a C function to return the greater value.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'findMax' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 11, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '35', paramId: 'num1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '42', paramId: 'num2' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'findMax' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num2' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Max = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 17, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num1: { default: 35, min: 1, max: 100, type: 'number', label: 'First Number (num1)' },
    num2: { default: 42, min: 1, max: 100, type: 'number', label: 'Second Number (num2)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const num1 = Number(vars.num1 ?? 35);
    const num2 = Number(vars.num2 ?? 42);
    const isGreater = num1 > num2;
    const maxVal = isGreater ? num1 : num2;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define function findMax(int a, int b) to compare two numbers.',
        explanationHinglish: 'findMax(int a, int b) function banaya do numbers compare karne ke liye.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 12,
        explanationEnglish: `Store ${num1} in variable num1.`,
        explanationHinglish: `num1 variable mein ${num1} store kiya.`,
        memorySnapshot: { num1: `${num1} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num1', value: num1 }
      },
      {
        step: 3, lineNum: 13,
        explanationEnglish: `Store ${num2} in variable num2.`,
        explanationHinglish: `num2 variable mein ${num2} store kiya.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num2', value: num2 }
      },
      {
        step: 4, lineNum: 14,
        explanationEnglish: `Call findMax(${num1}, ${num2}). Control jumps to findMax.`,
        explanationHinglish: `findMax(${num1}, ${num2}) call kiya. Control function par jump hua.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'findMax', args: { a: num1, b: num2 } }
      },
      {
        step: 5, lineNum: 3,
        explanationEnglish: `Parameters receive arguments: a = ${num1}, b = ${num2}.`,
        explanationHinglish: `Parameters a = ${num1}, b = ${num2} function mein receive hue.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]`, a: `${num1} [4B]`, b: `${num2} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: num1 }
      },
      {
        step: 6, lineNum: 4,
        explanationEnglish: `Check condition: is a (${num1}) > b (${num2})? → ${isGreater ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check kiya: kya a (${num1}) > b (${num2}) hai? → ${isGreater ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]`, a: `${num1} [4B]`, b: `${num2} [4B]` },
        animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '>', formula: `${num1} > ${num2}`, result: isGreater ? 'True' : 'False', storeIn: 'Condition' }
      },
      {
        step: 7, lineNum: isGreater ? 5 : 7,
        explanationEnglish: `${isGreater ? 'Condition true: return a (' + num1 + ')' : 'Condition false: return b (' + num2 + ')'}.`,
        explanationHinglish: `${isGreater ? 'True hone par a (' + num1 + ') return kiya' : 'False hone par else block se b (' + num2 + ') return kiya'}.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]`, a: `${num1} [4B]`, b: `${num2} [4B]` },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'findMax', returnValue: maxVal }
      },
      {
        step: 8, lineNum: 14,
        explanationEnglish: `Function returned ${maxVal}. Store into variable max.`,
        explanationHinglish: `Function se ${maxVal} return aaya aur max variable mein store kiya.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]`, max: `${maxVal} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'max', value: maxVal }
      },
      {
        step: 9, lineNum: 15,
        explanationEnglish: `printf outputs: Max = ${maxVal}.`,
        explanationHinglish: `printf se Max = ${maxVal} console pe print hua.`,
        memorySnapshot: { num1: `${num1} [4B]`, num2: `${num2} [4B]`, max: `${maxVal} [4B]` },
        consoleOutput: `Max = ${maxVal}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'max', outputValue: maxVal }
      }
    ];
  },
  executionSteps: []
};

// ─── TOPIC 15: RECURSION (4 Programs) ──────────────────────────────────────────


export const c_func_factorial: LessonProgram = {
  id: 'c_func_factorial',
  language: 'c',
  topic: 'functions',
  lessonNumber: 5,
  friendlyName: 'Factorial Function (Logic Validation)',
  learningObjective: 'Learn iterative calculation inside a function with defensive logic error handling for negative inputs.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'long long' }, { type: 'text', value: ' ' }, { type: 'function', value: 'factorial' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Logic Error: Negative input %d!\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'long long' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 15, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'long long' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'factorial' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 19, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Factorial = %lld\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 20, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 21, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 22, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 5, min: -3, max: 12, type: 'number', label: 'Input Number (num)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const num = Number(vars.num ?? 5);
    const isError = num < 0;
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define function factorial(int n) returning long long integer.',
        explanationHinglish: 'factorial(int n) function define kiya jo long long integer return karega.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 16,
        explanationEnglish: `Initialize num = ${num} in main().`,
        explanationHinglish: `main() mein num = ${num} initialize hua.`,
        memorySnapshot: { num: `${num} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num }
      },
      {
        step: 3, lineNum: 17,
        explanationEnglish: `Call factorial(${num}). Control jumps to function definition.`,
        explanationHinglish: `factorial(${num}) call kiya. Control function par jump hua.`,
        memorySnapshot: { num: `${num} [4B]` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'factorial', args: { n: num } }
      },
      {
        step: 4, lineNum: 3,
        explanationEnglish: `Parameter n in factorial receives ${num}.`,
        explanationHinglish: `factorial ke parameter n ko value ${num} mili.`,
        memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: num }
      },
      {
        step: 5, lineNum: 4,
        explanationEnglish: `Check logic constraint: is n (${num}) < 0? -> ${isError ? 'TRUE (Logic Error Detected)' : 'FALSE (Valid Input)'}.`,
        explanationHinglish: `Logic validation check: kya n (${num}) < 0 hai? -> ${isError ? 'TRUE (Logic Error!)' : 'FALSE (Sahi Input)'}.`,
        memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]` },
        animationEvent: { type: 'COMPUTE', inputs: ['n', '0'], operator: '<', formula: `${num} < 0`, result: isError ? 'True' : 'False', storeIn: 'Condition' }
      }
    ];

    if (isError) {
      steps.push({
        step: 6, lineNum: 5,
        explanationEnglish: `Logic Error triggered: Factorial of negative number ${num} is undefined!`,
        explanationHinglish: `Logic Error: Negative number ${num} ka factorial mathematical roop se undefined hota hai!`,
        memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]` },
        consoleOutput: `Logic Error: Negative input ${num}!`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: `Logic Error: Negative input ${num}!` }
      });
      steps.push({
        step: 7, lineNum: 6,
        explanationEnglish: 'Return error flag -1 to caller.',
        explanationHinglish: 'Caller ko error code -1 return kiya.',
        memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]` },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'factorial', returnValue: -1 }
      });
      steps.push({
        step: 8, lineNum: 17,
        explanationEnglish: 'Function returned error code -1. Stored in ans.',
        explanationHinglish: 'Function se error code -1 return hua aur ans mein store hua.',
        memorySnapshot: { num: `${num} [main]`, ans: '-1 [Error Code]' },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: -1 }
      });
      steps.push({
        step: 9, lineNum: 18,
        explanationEnglish: 'Check condition: ans != -1 is FALSE. Skip printing result block.',
        explanationHinglish: 'Condition ans != -1 FALSE hui. Print result block skip hua.',
        memorySnapshot: { num: `${num} [main]`, ans: '-1 [Error Code]' },
        animationEvent: { type: 'NONE' }
      });
    } else {
      let fact = 1;
      steps.push({
        step: 6, lineNum: 8,
        explanationEnglish: 'Initialize accumulator variable fact = 1.',
        explanationHinglish: 'Accumulator variable fact = 1 initialize hua.',
        memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]`, fact: '1 [8B]' },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'fact', value: 1 }
      });

      for (let i = 1; i <= Math.min(num, 12); i++) {
        fact *= i;
        steps.push({
          step: steps.length + 1, lineNum: 10,
          explanationEnglish: `Multiply fact (${fact / i}) * ${i} = ${fact}.`,
          explanationHinglish: `fact (${fact / i}) * ${i} = ${fact} update hua.`,
          memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]`, fact: `${fact} [8B]`, i: `${i}` },
          animationEvent: { type: 'UPDATE_VARIABLE', name: 'fact', newValue: fact, oldValue: fact / i }
        });
      }

      steps.push({
        step: steps.length + 1, lineNum: 12,
        explanationEnglish: `Function computed factorial = ${fact}. Return to caller.`,
        explanationHinglish: `Function ne factorial = ${fact} calculate karke caller ko return kiya.`,
        memorySnapshot: { num: `${num} [main]`, n: `${num} [factorial]`, fact: `${fact} [8B]` },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'factorial', returnValue: fact }
      });

      steps.push({
        step: steps.length + 1, lineNum: 17,
        explanationEnglish: `Store returned factorial (${fact}) in variable ans in main().`,
        explanationHinglish: `Return aayi value (${fact}) ko main ke variable ans mein store kiya.`,
        memorySnapshot: { num: `${num} [main]`, ans: `${fact} [8B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: fact }
      });

      steps.push({
        step: steps.length + 1, lineNum: 19,
        explanationEnglish: `printf outputs: Factorial = ${fact}.`,
        explanationHinglish: `printf se Factorial = ${fact} console pe display hua.`,
        memorySnapshot: { num: `${num} [main]`, ans: `${fact} [8B]` },
        consoleOutput: `Factorial = ${fact}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: fact }
      });
    }

    return steps;
  },
  executionSteps: []
};

export const c_func_fibonacci: LessonProgram = {
  id: 'c_func_fibonacci',
  language: 'c',
  topic: 'functions',
  lessonNumber: 6,
  friendlyName: 'Fibonacci Series Function',
  learningObjective: 'Learn how to pass a count parameter to a helper function that generates and displays the complete Fibonacci series.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printFibonacci' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'next' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d %d "' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'next' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d "' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'next' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'next' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 14, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fibonacci: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printFibonacci' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 19, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 7, min: 2, max: 12, type: 'number', label: 'Series Terms (n)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    let n = Number(vars.n ?? 7);
    n = Math.max(2, Math.min(12, Math.floor(isNaN(n) ? 7 : n)));

    let outStr = 'Fibonacci: ';
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define function printFibonacci(int n) to generate and display the Fibonacci series.',
        explanationHinglish: 'printFibonacci(int n) function define kiya jo series generate karke print karega.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 15,
        explanationEnglish: `Initialize n = ${n} (number of terms to generate) in main().`,
        explanationHinglish: `main() mein n = ${n} terms initialize kiye.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n }
      },
      {
        step: 3, lineNum: 16,
        explanationEnglish: 'printf prints header prefix "Fibonacci: ".',
        explanationHinglish: 'printf se header "Fibonacci: " console pe print hua.',
        memorySnapshot: { n: `${n} [4B]` },
        consoleOutput: outStr,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: outStr }
      },
      {
        step: 4, lineNum: 17,
        explanationEnglish: `Call printFibonacci(${n}). Execution jumps to function body.`,
        explanationHinglish: `printFibonacci(${n}) call kiya. Control function par jump hua.`,
        memorySnapshot: { n: `${n} [4B]` },
        consoleOutput: outStr,
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'printFibonacci', args: { n } }
      },
      {
        step: 5, lineNum: 3,
        explanationEnglish: `Parameter n in printFibonacci receives argument ${n}.`,
        explanationHinglish: `printFibonacci ke parameter n ko value ${n} mili.`,
        memorySnapshot: { n: `${n} [main]`, n_local: `${n} [printFibonacci]` },
        consoleOutput: outStr,
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n }
      },
      {
        step: 6, lineNum: 4,
        explanationEnglish: 'Initialize starting terms a = 0 and b = 1.',
        explanationHinglish: 'Pehle do terms a = 0 aur b = 1 initialize hue.',
        memorySnapshot: { n: `${n} [main]`, a: 0, b: 1 },
        consoleOutput: outStr,
        animationEvent: { type: 'MULTI_CREATE_VARIABLES', variables: [{ name: 'a', value: 0 }, { name: 'b', value: 1 }] }
      }
    ];

    outStr += '0 1 ';
    steps.push({
      step: 7, lineNum: 5,
      explanationEnglish: 'printf prints first two terms: 0 1.',
      explanationHinglish: 'printf se pehle do terms 0 aur 1 print hue.',
      memorySnapshot: { n: `${n} [main]`, a: 0, b: 1 },
      consoleOutput: outStr,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: '0 1 ' }
    });

    let a = 0, b = 1, next = 1;
    for (let i = 3; i <= n; i++) {
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Iteration i = ${i}: Loop condition i (${i}) <= n (${n}) is TRUE.`,
        explanationHinglish: `Iteration i = ${i}: Loop condition i (${i}) <= n (${n}) SAHI hai.`,
        memorySnapshot: { n: `${n} [main]`, a, b, i },
        consoleOutput: outStr,
        animationEvent: { type: 'COMPUTE', inputs: ['i', 'n'], operator: '<=', formula: `${i} <= ${n}`, result: 'True', storeIn: 'Condition' }
      });

      next = a + b;
      steps.push({
        step: steps.length + 1, lineNum: 7,
        explanationEnglish: `Calculate next term: next = a (${a}) + b (${b}) = ${next}.`,
        explanationHinglish: `Next term calculate kiya: next = ${a} + ${b} = ${next}.`,
        memorySnapshot: { n: `${n} [main]`, a, b, next, i },
        consoleOutput: outStr,
        animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '+', formula: `${a} + ${b} = ${next}`, result: `${next}`, storeIn: 'next' }
      });

      outStr += `${next} `;
      steps.push({
        step: steps.length + 1, lineNum: 8,
        explanationEnglish: `printf prints term ${next}.`,
        explanationHinglish: `printf se agla term ${next} print hua.`,
        memorySnapshot: { n: `${n} [main]`, a, b, next, i },
        consoleOutput: outStr,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: `${next} ` }
      });

      const oldA = a;
      a = b;
      steps.push({
        step: steps.length + 1, lineNum: 9,
        explanationEnglish: `Shift window: a = b (${b}).`,
        explanationHinglish: `Window shift kiya: a = b (${b}).`,
        memorySnapshot: { n: `${n} [main]`, a, b, next, i },
        consoleOutput: outStr,
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'a', newValue: a, oldValue: oldA }
      });

      const oldB = b;
      b = next;
      steps.push({
        step: steps.length + 1, lineNum: 10,
        explanationEnglish: `Shift window: b = next (${next}).`,
        explanationHinglish: `Window shift kiya: b = next (${next}).`,
        memorySnapshot: { n: `${n} [main]`, a, b, next, i },
        consoleOutput: outStr,
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'b', newValue: b, oldValue: oldB }
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: 6,
      explanationEnglish: `Loop condition check: i (${n + 1}) <= n (${n}) is FALSE. Loop finishes.`,
      explanationHinglish: `Loop condition check: i (${n + 1}) <= n (${n}) GALAT hai. Loop complete hua.`,
      memorySnapshot: { n: `${n} [main]`, a, b, next, i: n + 1 },
      consoleOutput: outStr,
      animationEvent: { type: 'COMPUTE', inputs: ['i', 'n'], operator: '<=', formula: `${n + 1} <= ${n}`, result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: steps.length + 1, lineNum: 12,
      explanationEnglish: 'Function printFibonacci finishes execution and returns to main().',
      explanationHinglish: 'printFibonacci execution complete karke main() par return hua.',
      memorySnapshot: { n: `${n} [main]` },
      consoleOutput: outStr,
      animationEvent: { type: 'FUNCTION_RETURN', functionName: 'printFibonacci' }
    });

    steps.push({
      step: steps.length + 1, lineNum: 18,
      explanationEnglish: 'return 0 finishes main() function.',
      explanationHinglish: 'return 0 se program finish ho gaya.',
      memorySnapshot: { n: `${n} [main]` },
      consoleOutput: outStr,
      animationEvent: { type: 'NONE' }
    });

    return steps;
  },
  executionSteps: []
};


export const c_recur_factorial: LessonProgram = {
  id: 'c_recur_factorial',
  language: 'c',
  topic: 'recursion',
  lessonNumber: 1,
  friendlyName: 'Factorial Using Recursion',
  learningObjective: 'Observe how recursion mathematically builds up call frames on the stack and multiplies results on return unwinding.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fact' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fact' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fact' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Factorial = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 4, min: 0, max: 6, type: 'number', label: 'Input Number (n)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    let n = Number(vars.n ?? 4);
    n = Math.max(0, Math.min(6, Math.floor(isNaN(n) ? 4 : n)));

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define recursive function fact(int n).',
        explanationHinglish: 'Recursive function fact(int n) define kiya.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 11,
        explanationEnglish: `Initialize n = ${n} in main().`,
        explanationHinglish: `main() mein n = ${n} initialize kiya.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n }
      },
      {
        step: 3, lineNum: 12,
        explanationEnglish: `Call fact(${n}) from main().`,
        explanationHinglish: `main() se fact(${n}) ko call kiya.`,
        memorySnapshot: { n: `${n} [4B]`, CallStack: `fact(${n})` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'fact', args: { n } }
      }
    ];

    const callChain: number[] = [];
    for (let k = n; k >= 1; k--) callChain.push(k);
    if (callChain.length === 0) callChain.push(0);

    let stepNum = 4;
    let currentStack = '';

    callChain.forEach((val, idx) => {
      currentStack = currentStack ? `${currentStack} -> fact(${val})` : `fact(${val})`;

      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Entered fact() with n = ${val}.`,
        explanationHinglish: `fact() frame push hua n = ${val} ke saath.`,
        memorySnapshot: { n: val, CallStack: currentStack },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: val }
      });

      const isBase = val <= 1;
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Check base condition: is n (${val}) <= 1? → ${isBase ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Base condition check: kya n (${val}) <= 1 hai? → ${isBase ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n: val, CallStack: currentStack },
        animationEvent: { type: 'COMPUTE', inputs: ['n', '1'], operator: '<=', formula: `${val} <= 1`, result: isBase ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (!isBase && idx < callChain.length - 1) {
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Call fact(${val - 1}) recursively. (Push new frame to call stack)`,
          explanationHinglish: `fact(${val - 1}) ko recursively call kiya. (Call stack pe naya frame push)`,
          memorySnapshot: { n: val, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_CALL', functionName: 'fact', args: { n: val - 1 } }
        });
      }
    });

    const baseVal = callChain[callChain.length - 1];
    const stackAtBase = callChain.map(v => `fact(${v})`).join(' -> ');
    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: `Base condition met for n = ${baseVal}! Return 1.`,
      explanationHinglish: `Base condition meet ho gayi n = ${baseVal} ke liye! 1 return kiya.`,
      memorySnapshot: { n: baseVal, CallStack: stackAtBase },
      animationEvent: { type: 'COMPUTE', inputs: [], operator: 'return', result: 1, storeIn: 'ReturnValue' }
    });

    let currentRes = 1;
    for (let i = callChain.length - 2; i >= 0; i--) {
      const val = callChain[i];
      const prevRes = currentRes;
      const subStack = callChain.slice(0, i + 1).map(v => `fact(${v})`).join(' -> ');
      currentRes = val * prevRes;

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Returned from fact(${val - 1}) with ${prevRes}. Compute ${val} * ${prevRes} = ${currentRes} and return.`,
        explanationHinglish: `fact(${val - 1}) se ${prevRes} return aaya. ${val} * ${prevRes} = ${currentRes} calculate karke return kiya.`,
        memorySnapshot: { n: val, CallStack: subStack },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'fact', returnValue: currentRes }
      });
    }

    const factFn = (x: number): number => (x <= 1 ? 1 : x * factFn(x - 1));
    const finalAns = factFn(n);

    steps.push({
      step: stepNum++, lineNum: 12,
      explanationEnglish: `Store returned factorial result (${finalAns}) in variable ans.`,
      explanationHinglish: `Returned result (${finalAns}) ko ans variable mein store kiya.`,
      memorySnapshot: { n: `${n} [4B]`, ans: `${finalAns} [4B]` },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: finalAns }
    });

    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: `printf outputs Factorial = ${finalAns}.`,
      explanationHinglish: `printf se Factorial = ${finalAns} display hua.`,
      memorySnapshot: { n: `${n} [4B]`, ans: `${finalAns} [4B]` },
      consoleOutput: `Factorial = ${finalAns}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: finalAns }
    });

    return steps;
  },
  executionSteps: []
};

export const c_recur_fibonacci: LessonProgram = {
  id: 'c_recur_fibonacci',
  language: 'c',
  topic: 'recursion',
  lessonNumber: 2,
  friendlyName: 'Fibonacci Series Using Recursion',
  learningObjective: 'Understand how a recursive function branches out to calculate the Nth Fibonacci term.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'fib' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fibonacci = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 4, min: 0, max: 6, type: 'number', label: 'Term Index (n)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    let n = Number(vars.n ?? 4);
    n = Math.max(0, Math.min(6, Math.floor(isNaN(n) ? 4 : n)));

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define recursive function fib(int n) for Fibonacci numbers.',
        explanationHinglish: 'Fibonacci numbers calculate karne ke liye recursive function fib(n) define kiya.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 11,
        explanationEnglish: `Initialize n = ${n} in main().`,
        explanationHinglish: `main() mein n = ${n} initialize kiya.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n }
      },
      {
        step: 3, lineNum: 12,
        explanationEnglish: `Call fib(${n}) from main().`,
        explanationHinglish: `fib(${n}) ko main() se call kiya.`,
        memorySnapshot: { n: `${n} [4B]`, CallStack: `fib(${n})` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'fib', args: { n } }
      }
    ];

    let stepNum = 4;
    const fibCalc = (val: number, stackStr: string): number => {
      const curStack = stackStr ? `${stackStr} -> fib(${val})` : `fib(${val})`;

      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Entered fib() with n = ${val}.`,
        explanationHinglish: `fib() frame push hua n = ${val} ke saath.`,
        memorySnapshot: { n: val, CallStack: curStack },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: val }
      });

      const isBase = val <= 1;
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Check base condition: is n (${val}) <= 1? → ${isBase ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check kiya kya n (${val}) <= 1 hai? → ${isBase ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n: val, CallStack: curStack },
        animationEvent: { type: 'COMPUTE', inputs: ['n', '1'], operator: '<=', formula: `${val} <= 1`, result: isBase ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (isBase) {
        steps.push({
          step: stepNum++, lineNum: 5,
          explanationEnglish: `Base case met for n = ${val}! Return ${val}.`,
          explanationHinglish: `Base condition match hui! ${val} return kiya.`,
          memorySnapshot: { n: val, CallStack: curStack },
          animationEvent: { type: 'COMPUTE', inputs: [], operator: 'return', result: val, storeIn: 'ReturnValue' }
        });
        return val;
      }

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Call fib(${val - 1}) recursively (left branch).`,
        explanationHinglish: `Left branch: fib(${val - 1}) ko recursively call kiya.`,
        memorySnapshot: { n: val, CallStack: curStack },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'fib', args: { n: val - 1 } }
      });

      const left = fibCalc(val - 1, curStack);

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Returned ${left} from left branch. Now call fib(${val - 2}) (right branch).`,
        explanationHinglish: `Left branch se ${left} return aaya. Ab right branch fib(${val - 2}) call kiya.`,
        memorySnapshot: { n: val, CallStack: curStack },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'fib', args: { n: val - 2 } }
      });

      const right = fibCalc(val - 2, curStack);
      const sum = left + right;

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Combine results: fib(${val - 1})[${left}] + fib(${val - 2})[${right}] = ${sum}. Return ${sum}.`,
        explanationHinglish: `Dono branches ka sum calculate kiya: ${left} + ${right} = ${sum}. ${sum} return kiya.`,
        memorySnapshot: { n: val, CallStack: curStack },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'fib', returnValue: sum }
      });

      return sum;
    };

    const finalAns = fibCalc(n, '');

    steps.push({
      step: stepNum++, lineNum: 12,
      explanationEnglish: `Store final Fibonacci result (${finalAns}) in variable ans.`,
      explanationHinglish: `Final Fibonacci result (${finalAns}) ans variable mein store kiya.`,
      memorySnapshot: { n: `${n} [4B]`, ans: `${finalAns} [4B]` },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: finalAns }
    });

    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: `printf prints Fibonacci = ${finalAns}.`,
      explanationHinglish: `printf se Fibonacci = ${finalAns} display hua.`,
      memorySnapshot: { n: `${n} [4B]`, ans: `${finalAns} [4B]` },
      consoleOutput: `Fibonacci = ${finalAns}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: finalAns }
    });

    return steps;
  },
  executionSteps: []
};

export const c_recur_sum: LessonProgram = {
  id: 'c_recur_sum',
  language: 'c',
  topic: 'recursion',
  lessonNumber: 3,
  friendlyName: 'Sum of N Natural Numbers',
  learningObjective: 'Understand how recursive accumulation adds numbers backwards as the stack pops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'sum' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'function', value: 'sum' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'sum' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sum = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 4, min: 0, max: 7, type: 'number', label: 'N Terms (n)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    let n = Number(vars.n ?? 4);
    n = Math.max(0, Math.min(7, Math.floor(isNaN(n) ? 4 : n)));

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define recursive function sum(int n).',
        explanationHinglish: 'N natural numbers ka sum nikalne ke liye recursive function sum(n) banaya.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 11,
        explanationEnglish: `Initialize n = ${n} in main().`,
        explanationHinglish: `main() mein n = ${n} initialize kiya.`,
        memorySnapshot: { n: `${n} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n }
      },
      {
        step: 3, lineNum: 12,
        explanationEnglish: `Call sum(${n}) from main().`,
        explanationHinglish: `main() se sum(${n}) ko call kiya.`,
        memorySnapshot: { n: `${n} [4B]`, CallStack: `sum(${n})` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'sum', args: { n } }
      }
    ];

    const callChain: number[] = [];
    for (let k = n; k >= 0; k--) callChain.push(k);

    let stepNum = 4;
    let currentStack = '';

    callChain.forEach((val, idx) => {
      currentStack = currentStack ? `${currentStack} -> sum(${val})` : `sum(${val})`;

      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Entered sum() with n = ${val}.`,
        explanationHinglish: `sum() frame push hua n = ${val} ke saath.`,
        memorySnapshot: { n: val, CallStack: currentStack },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: val }
      });

      const isBase = val <= 0;
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Check base condition: is n (${val}) <= 0? → ${isBase ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Check kiya kya n (${val}) <= 0 hai? → ${isBase ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { n: val, CallStack: currentStack },
        animationEvent: { type: 'COMPUTE', inputs: ['n', '0'], operator: '<=', formula: `${val} <= 0`, result: isBase ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (!isBase && idx < callChain.length - 1) {
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Call sum(${val - 1}) recursively. (Push new frame)`,
          explanationHinglish: `Recursion: sum(${val - 1}) ko call kiya. (Naya frame push)`,
          memorySnapshot: { n: val, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_CALL', functionName: 'sum', args: { n: val - 1 } }
        });
      }
    });

    const stackAtBase = callChain.map(v => `sum(${v})`).join(' -> ');
    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Base condition met for n = 0! Return 0.',
      explanationHinglish: 'Base condition match ho gayi! 0 return kiya.',
      memorySnapshot: { n: 0, CallStack: stackAtBase },
      animationEvent: { type: 'COMPUTE', inputs: [], operator: 'return', result: 0, storeIn: 'ReturnValue' }
    });

    let currentRes = 0;
    for (let i = callChain.length - 2; i >= 0; i--) {
      const val = callChain[i];
      const prevRes = currentRes;
      const subStack = callChain.slice(0, i + 1).map(v => `sum(${v})`).join(' -> ');
      currentRes = val + prevRes;

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Returned ${prevRes} from sum(${val - 1}). Compute ${val} + ${prevRes} = ${currentRes}.`,
        explanationHinglish: `sum(${val - 1}) se ${prevRes} return aaya. ${val} + ${prevRes} = ${currentRes} mila.`,
        memorySnapshot: { n: val, CallStack: subStack },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'sum', returnValue: currentRes }
      });
    }

    const finalAns = (n * (n + 1)) / 2;

    steps.push({
      step: stepNum++, lineNum: 12,
      explanationEnglish: `Store returned sum (${finalAns}) in variable ans.`,
      explanationHinglish: `Final sum (${finalAns}) ans variable mein store kiya.`,
      memorySnapshot: { n: `${n} [4B]`, ans: `${finalAns} [4B]` },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: finalAns }
    });

    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: `printf prints Sum = ${finalAns}.`,
      explanationHinglish: `printf se Sum = ${finalAns} console pe print hua.`,
      memorySnapshot: { n: `${n} [4B]`, ans: `${finalAns} [4B]` },
      consoleOutput: `Sum = ${finalAns}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: finalAns }
    });

    return steps;
  },
  executionSteps: []
};

export const c_recur_power: LessonProgram = {
  id: 'c_recur_power',
  language: 'c',
  topic: 'recursion',
  lessonNumber: 4,
  friendlyName: 'Power of a Number (Base^Exp)',
  learningObjective: 'Calculate exponentiation using recursive multiplication until exponent reaches 0.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'power' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'base' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'exp' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'exp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'base' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'function', value: 'power' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'base' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'exp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 10, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'base' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'base' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'exp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3', paramId: 'exp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'function', value: 'power' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'base' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'exp' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Result = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ans' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    base: { default: 2, min: 1, max: 5, type: 'number', label: 'Base' },
    exp: { default: 3, min: 0, max: 5, type: 'number', label: 'Exponent (exp)' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    let base = Number(vars.base ?? 2);
    let exp = Number(vars.exp ?? 3);
    base = Math.max(1, Math.min(5, Math.floor(isNaN(base) ? 2 : base)));
    exp = Math.max(0, Math.min(5, Math.floor(isNaN(exp) ? 3 : exp)));

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Define recursive function power(int base, int exp).',
        explanationHinglish: 'Power calculate karne ke liye recursive function power(base, exp) banaya.',
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 11,
        explanationEnglish: `Initialize base = ${base} in main().`,
        explanationHinglish: `main() mein base = ${base} allocate hua.`,
        memorySnapshot: { base: `${base} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'base', value: base }
      },
      {
        step: 3, lineNum: 12,
        explanationEnglish: `Initialize exp = ${exp} in main().`,
        explanationHinglish: `main() mein exp = ${exp} allocate hua.`,
        memorySnapshot: { base: `${base} [4B]`, exp: `${exp} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'exp', value: exp }
      },
      {
        step: 4, lineNum: 13,
        explanationEnglish: `Call power(${base}, ${exp}) from main().`,
        explanationHinglish: `main() se power(${base}, ${exp}) ko call kiya.`,
        memorySnapshot: { base: `${base} [4B]`, exp: `${exp} [4B]`, CallStack: `power(${base}, ${exp})` },
        animationEvent: { type: 'FUNCTION_CALL', functionName: 'power', args: { base, exp } }
      }
    ];

    const callChain: number[] = [];
    for (let k = exp; k >= 0; k--) callChain.push(k);

    let stepNum = 5;
    let currentStack = '';

    callChain.forEach((curExp, idx) => {
      currentStack = currentStack ? `${currentStack} -> power(${base}, ${curExp})` : `power(${base}, ${curExp})`;

      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Entered power() with exp = ${curExp}.`,
        explanationHinglish: `power() frame push hua exp = ${curExp} ke saath.`,
        memorySnapshot: { base, exp: curExp, CallStack: currentStack },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'exp', value: curExp }
      });

      const isBase = curExp <= 0;
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Check base condition: is exp (${curExp}) <= 0? → ${isBase ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Base condition check: kya exp (${curExp}) <= 0 hai? → ${isBase ? 'SAHI' : 'GALAT'}.`,
        memorySnapshot: { base, exp: curExp, CallStack: currentStack },
        animationEvent: { type: 'COMPUTE', inputs: ['exp', '0'], operator: '<=', formula: `${curExp} <= 0`, result: isBase ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (!isBase && idx < callChain.length - 1) {
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Call power(${base}, ${curExp - 1}) recursively.`,
          explanationHinglish: `power(${base}, ${curExp - 1}) ko recursively call kiya.`,
          memorySnapshot: { base, exp: curExp, CallStack: currentStack },
          animationEvent: { type: 'FUNCTION_CALL', functionName: 'power', args: { base, exp: curExp - 1 } }
        });
      }
    });

    const stackAtBase = callChain.map(e => `power(${base}, ${e})`).join(' -> ');
    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Base condition met: exp == 0! Return 1.',
      explanationHinglish: 'Base condition true: exp == 0! 1 return kiya.',
      memorySnapshot: { base, exp: 0, CallStack: stackAtBase },
      animationEvent: { type: 'COMPUTE', inputs: [], operator: 'return', result: 1, storeIn: 'ReturnValue' }
    });

    let currentRes = 1;
    for (let i = callChain.length - 2; i >= 0; i--) {
      const curExp = callChain[i];
      const prevRes = currentRes;
      const subStack = callChain.slice(0, i + 1).map(e => `power(${base}, ${e})`).join(' -> ');
      currentRes = base * prevRes;

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Returned ${prevRes} from power(${base}, ${curExp - 1}). Compute ${base} * ${prevRes} = ${currentRes}.`,
        explanationHinglish: `power(${base}, ${curExp - 1}) se ${prevRes} return aaya. ${base} * ${prevRes} = ${currentRes} mila.`,
        memorySnapshot: { base, exp: curExp, CallStack: subStack },
        animationEvent: { type: 'FUNCTION_RETURN', functionName: 'power', returnValue: currentRes }
      });
    }

    const finalAns = Math.pow(base, exp);

    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: `Store returned result (${finalAns}) into variable ans.`,
      explanationHinglish: `Result (${finalAns}) ans variable mein store kiya.`,
      memorySnapshot: { base: `${base} [4B]`, exp: `${exp} [4B]`, ans: `${finalAns} [4B]` },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'ans', value: finalAns }
    });

    steps.push({
      step: stepNum++, lineNum: 14,
      explanationEnglish: `printf outputs: Result = ${finalAns}.`,
      explanationHinglish: `printf console pe Result = ${finalAns} print karta hai.`,
      memorySnapshot: { base: `${base} [4B]`, exp: `${exp} [4B]`, ans: `${finalAns} [4B]` },
      consoleOutput: `Result = ${finalAns}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'ans', outputValue: finalAns }
    });

    return steps;
  },
  executionSteps: []
};


// ─── TOPIC 16: STRUCTURES (2 In-Depth Multi-Instance Programs) ────────────────

export const c_struct_student: LessonProgram = {
  id: 'c_struct_student',
  language: 'c',
  topic: 'structures',
  lessonNumber: 1,
  friendlyName: 'Student Records (Multi-Instance Struct Copies)',
  learningObjective: 'Master how declaring struct variables (s1, s2) instantiates independent, blank dictionary-style copies in RAM, populated and manipulated via dot operator (.).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'struct' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'Student' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rollNo' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '};' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 9, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'struct' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'Student' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'struct' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'Student' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'rollNo' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '101', paramId: 's1_roll' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '88.5', paramId: 's1_marks' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'rollNo' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '102', paramId: 's2_roll' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '94.0', paramId: 's2_marks' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 19, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Topper: S1 (Roll %d, Marks %.1f)\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'rollNo' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 20, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 21, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Topper: S2 (Roll %d, Marks %.1f)\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'rollNo' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 's2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 22, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 23, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 24, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    s1_roll: { default: 101, min: 1, max: 999, type: 'number', label: 'Student 1 Roll No' },
    s1_marks: { default: 88.5, min: 0, max: 100, label: 'Student 1 Marks' },
    s2_roll: { default: 102, min: 1, max: 999, type: 'number', label: 'Student 2 Roll No' },
    s2_marks: { default: 94.0, min: 0, max: 100, label: 'Student 2 Marks' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const s1_roll = Number(vars.s1_roll ?? 101);
    const s1_marks = Number(vars.s1_marks ?? 88.5);
    const s2_roll = Number(vars.s2_roll ?? 102);
    const s2_marks = Number(vars.s2_marks ?? 94.0);

    const s1_grade = s1_marks >= 90 ? 'A' : s1_marks >= 75 ? 'B' : 'C';
    const s2_grade = s2_marks >= 90 ? 'A' : s2_marks >= 75 ? 'B' : 'C';
    const s1IsTopper = s1_marks >= s2_marks;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: "Define master mould 'struct Student' bundling 3 members: rollNo (4B), marks (4B), grade (1B) -> 12 Bytes total in RAM (with alignment).",
        explanationHinglish: "Master blueprint 'struct Student' define kiya: rollNo (4B), marks (4B), grade (1B) -> 12 Bytes memory blueprint.",
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 10,
        explanationEnglish: "Declare 'struct Student s1'. C reserves a blank 12-byte dictionary box in RAM for student 1 (members uninitialized).",
        explanationHinglish: "Variable s1 declare kiya: RAM mein student 1 ke liye ek blank struct copy bani (members abhi uninitialized '?' hain).",
        memorySnapshot: { s1: '{ rollNo: ?, marks: ?, grade: ? } [12B]' },
        animationEvent: { 
          type: 'CREATE_VARIABLE', 
          name: 's1 (struct Student)', 
          value: JSON.stringify({ rollNo: '?', marks: '?', grade: '?' }) 
        }
      },
      {
        step: 3, lineNum: 11,
        explanationEnglish: "Declare 'struct Student s2'. C allocates a SECOND independent blank 12-byte copy in RAM!",
        explanationHinglish: "Variable s2 declare kiya: s2 ek doosri independent blank copy hai RAM mein!",
        memorySnapshot: { s1: '{ rollNo: ?, marks: ?, grade: ? }', s2: '{ rollNo: ?, marks: ?, grade: ? }' },
        animationEvent: { 
          type: 'CREATE_VARIABLE', 
          name: 's2 (struct Student)', 
          value: JSON.stringify({ rollNo: '?', marks: '?', grade: '?' }) 
        }
      },
      {
        step: 4, lineNum: 12,
        explanationEnglish: `Using dot operator (.), assign ${s1_roll} into s1.rollNo slot.`,
        explanationHinglish: `Dot operator (.) se s1.rollNo slot mein ${s1_roll} store kiya.`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ?, grade: ? }`, s2: '{ rollNo: ?, marks: ?, grade: ? }' },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 's1 (struct Student)', 
          newValue: JSON.stringify({ rollNo: s1_roll, marks: '?', grade: '?' }),
          highlightedKey: 'rollNo'
        } as any
      },
      {
        step: 5, lineNum: 13,
        explanationEnglish: `Assign ${s1_marks.toFixed(1)} into s1.marks slot.`,
        explanationHinglish: `s1.marks slot mein ${s1_marks.toFixed(1)} store kiya.`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: ? }`, s2: '{ rollNo: ?, marks: ?, grade: ? }' },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 's1 (struct Student)', 
          newValue: JSON.stringify({ rollNo: s1_roll, marks: s1_marks.toFixed(1), grade: '?' }),
          highlightedKey: 'marks'
        } as any
      },
      {
        step: 6, lineNum: 14,
        explanationEnglish: `Assign grade '${s1_grade}' into s1.grade slot.`,
        explanationHinglish: `s1.grade slot mein '${s1_grade}' store kiya.`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, s2: '{ rollNo: ?, marks: ?, grade: ? }' },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 's1 (struct Student)', 
          newValue: JSON.stringify({ rollNo: s1_roll, marks: s1_marks.toFixed(1), grade: s1_grade }),
          highlightedKey: 'grade'
        } as any
      },
      {
        step: 7, lineNum: 15,
        explanationEnglish: `Now update SECOND instance s2: assign ${s2_roll} into s2.rollNo.`,
        explanationHinglish: `Ab second struct box s2 mein ${s2_roll} store kiya (s1 bilkul secure raha).`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, s2: `{ rollNo: ${s2_roll}, marks: ?, grade: ? }` },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 's2 (struct Student)', 
          newValue: JSON.stringify({ rollNo: s2_roll, marks: '?', grade: '?' }),
          highlightedKey: 'rollNo'
        } as any
      },
      {
        step: 8, lineNum: 16,
        explanationEnglish: `Assign ${s2_marks.toFixed(1)} into s2.marks slot.`,
        explanationHinglish: `s2.marks slot mein ${s2_marks.toFixed(1)} store kiya.`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, s2: `{ rollNo: ${s2_roll}, marks: ${s2_marks.toFixed(1)}, grade: ? }` },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 's2 (struct Student)', 
          newValue: JSON.stringify({ rollNo: s2_roll, marks: s2_marks.toFixed(1), grade: '?' }),
          highlightedKey: 'marks'
        } as any
      },
      {
        step: 9, lineNum: 17,
        explanationEnglish: `Assign grade '${s2_grade}' into s2.grade slot.`,
        explanationHinglish: `s2.grade slot mein '${s2_grade}' store kiya.`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, s2: `{ rollNo: ${s2_roll}, marks: ${s2_marks.toFixed(1)}, grade: '${s2_grade}' }` },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 's2 (struct Student)', 
          newValue: JSON.stringify({ rollNo: s2_roll, marks: s2_marks.toFixed(1), grade: s2_grade }),
          highlightedKey: 'grade'
        } as any
      },
      {
        step: 10, lineNum: 18,
        explanationEnglish: `Compare struct members: s1.marks (${s1_marks.toFixed(1)}) > s2.marks (${s2_marks.toFixed(1)})? -> ${s1IsTopper ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Do alag struct instances ke members compare kiye: ${s1_marks.toFixed(1)} > ${s2_marks.toFixed(1)} -> ${s1IsTopper ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { 
          s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, 
          s2: `{ rollNo: ${s2_roll}, marks: ${s2_marks.toFixed(1)}, grade: '${s2_grade}' }`,
          's1.marks': s1_marks.toFixed(1),
          's2.marks': s2_marks.toFixed(1)
        },
        animationEvent: { type: 'COMPUTE', inputs: ['s1.marks', 's2.marks'], operator: '>', result: s1IsTopper ? 'True' : 'False', storeIn: 'Condition' }
      },
      {
        step: 11, lineNum: s1IsTopper ? 19 : 21,
        explanationEnglish: `printf prints topper result: ${s1IsTopper ? `Topper: S1 (Roll ${s1_roll}, Marks ${s1_marks.toFixed(1)})` : `Topper: S2 (Roll ${s2_roll}, Marks ${s2_marks.toFixed(1)})`}.`,
        explanationHinglish: `printf se topper print hua: ${s1IsTopper ? `S1 (Roll ${s1_roll})` : `S2 (Roll ${s2_roll})`}.`,
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, s2: `{ rollNo: ${s2_roll}, marks: ${s2_marks.toFixed(1)}, grade: '${s2_grade}' }` },
        consoleOutput: s1IsTopper ? `Topper: S1 (Roll ${s1_roll}, Marks ${s1_marks.toFixed(1)})` : `Topper: S2 (Roll ${s2_roll}, Marks ${s2_marks.toFixed(1)})`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: s1IsTopper ? `Topper: S1 (Roll ${s1_roll})` : `Topper: S2 (Roll ${s2_roll})` }
      },
      {
        step: 12, lineNum: 23,
        explanationEnglish: "return 0 finishes main function execution.",
        explanationHinglish: "return 0 se main function complete hokar terminate ho gaya.",
        memorySnapshot: { s1: `{ rollNo: ${s1_roll}, marks: ${s1_marks.toFixed(1)}, grade: '${s1_grade}' }`, s2: `{ rollNo: ${s2_roll}, marks: ${s2_marks.toFixed(1)}, grade: '${s2_grade}' }` },
        consoleOutput: s1IsTopper ? `Topper: S1 (Roll ${s1_roll}, Marks ${s1_marks.toFixed(1)})` : `Topper: S2 (Roll ${s2_roll}, Marks ${s2_marks.toFixed(1)})`,
        animationEvent: { type: 'NONE' }
      }
    ];
  },
  executionSteps: []
};

export const c_struct_rectangle: LessonProgram = {
  id: 'c_struct_rectangle',
  language: 'c',
  topic: 'structures',
  lessonNumber: 2,
  friendlyName: 'Rectangle Geometry (Multi-Instance Comparison)',
  learningObjective: 'Learn how multiple struct instances (r1, r2) hold distinct geometric properties, perform member arithmetic, and evaluate comparisons in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 3, tokens: [{ type: 'keyword', value: 'struct' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'Rectangle' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'width' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '};' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '' }] },
    { lineNum: 8, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'struct' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'Rectangle' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'struct' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'Rectangle' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r2' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'r1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'r1_len' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'r1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'width' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'r1_wid' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'r2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '8', paramId: 'r2_len' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'r2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'width' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'r2_wid' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r1' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'width' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r2' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'width' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 17, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"R1 Area: %d, R2 Area: %d\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area2' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 18, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'area1' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area2' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 19, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Rectangle 1 is larger\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 20, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 21, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Rectangle 2 is larger\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 22, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 23, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 24, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    r1_len: { default: 10, min: 1, max: 100, type: 'number', label: 'Rectangle 1 Length' },
    r1_wid: { default: 5, min: 1, max: 100, type: 'number', label: 'Rectangle 1 Width' },
    r2_len: { default: 8, min: 1, max: 100, type: 'number', label: 'Rectangle 2 Length' },
    r2_wid: { default: 7, min: 1, max: 100, type: 'number', label: 'Rectangle 2 Width' }
  },
  generateSteps: (vars: Record<string, any> = {}): ExecutionStep[] => {
    const r1_len = Number(vars.r1_len ?? 10);
    const r1_wid = Number(vars.r1_wid ?? 5);
    const r2_len = Number(vars.r2_len ?? 8);
    const r2_wid = Number(vars.r2_wid ?? 7);

    const area1 = r1_len * r1_wid;
    const area2 = r2_len * r2_wid;
    const r1Larger = area1 > area2;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: "Define master mould 'struct Rectangle' encapsulating length (4B) and width (4B) -> 8 Bytes total.",
        explanationHinglish: "Master template 'struct Rectangle' banaya jisme length (4B) aur width (4B) members hain.",
        memorySnapshot: {},
        animationEvent: { type: 'NONE' }
      },
      {
        step: 2, lineNum: 9,
        explanationEnglish: "Declare 'struct Rectangle r1'. Allocates first independent 8-byte blank copy in RAM (members uninitialized).",
        explanationHinglish: "r1 declare kiya: RAM mein Rectangle 1 ke liye 8-byte ki blank copy bani (members uninitialized '?' hain).",
        memorySnapshot: { r1: '{ length: ?, width: ? } [8B]' },
        animationEvent: { 
          type: 'CREATE_VARIABLE', 
          name: 'r1 (struct Rectangle)', 
          value: JSON.stringify({ length: '?', width: '?' }) 
        }
      },
      {
        step: 3, lineNum: 10,
        explanationEnglish: "Declare 'struct Rectangle r2'. Allocates SECOND independent 8-byte blank copy in RAM!",
        explanationHinglish: "r2 declare kiya: RAM mein Rectangle 2 ke liye doosri independent 8-byte copy bani!",
        memorySnapshot: { r1: '{ length: ?, width: ? }', r2: '{ length: ?, width: ? }' },
        animationEvent: { 
          type: 'CREATE_VARIABLE', 
          name: 'r2 (struct Rectangle)', 
          value: JSON.stringify({ length: '?', width: '?' }) 
        }
      },
      {
        step: 4, lineNum: 11,
        explanationEnglish: `Assign ${r1_len} into r1.length.`,
        explanationHinglish: `r1.length member mein ${r1_len} store kiya.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ? }`, r2: '{ length: ?, width: ? }' },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 'r1 (struct Rectangle)', 
          newValue: JSON.stringify({ length: r1_len, width: '?' }),
          highlightedKey: 'length'
        } as any
      },
      {
        step: 5, lineNum: 12,
        explanationEnglish: `Assign ${r1_wid} into r1.width.`,
        explanationHinglish: `r1.width member mein ${r1_wid} store kiya.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: '{ length: ?, width: ? }' },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 'r1 (struct Rectangle)', 
          newValue: JSON.stringify({ length: r1_len, width: r1_wid }),
          highlightedKey: 'width'
        } as any
      },
      {
        step: 6, lineNum: 13,
        explanationEnglish: `Assign ${r2_len} into r2.length.`,
        explanationHinglish: `r2.length member mein ${r2_len} store kiya.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: `{ length: ${r2_len}, width: ? }` },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 'r2 (struct Rectangle)', 
          newValue: JSON.stringify({ length: r2_len, width: '?' }),
          highlightedKey: 'length'
        } as any
      },
      {
        step: 7, lineNum: 14,
        explanationEnglish: `Assign ${r2_wid} into r2.width.`,
        explanationHinglish: `r2.width member mein ${r2_wid} store kiya.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: `{ length: ${r2_len}, width: ${r2_wid} }` },
        animationEvent: { 
          type: 'UPDATE_VARIABLE', 
          name: 'r2 (struct Rectangle)', 
          newValue: JSON.stringify({ length: r2_len, width: r2_wid }),
          highlightedKey: 'width'
        } as any
      },
      {
        step: 8, lineNum: 15,
        explanationEnglish: `Compute area1 = r1.length (${r1_len}) * r1.width (${r1_wid}) = ${area1}.`,
        explanationHinglish: `r1 ke members se area1 calculate kiya: ${r1_len} * ${r1_wid} = ${area1}.`,
        memorySnapshot: { 
          r1: `{ length: ${r1_len}, width: ${r1_wid} }`, 
          r2: `{ length: ${r2_len}, width: ${r2_wid} }`, 
          'r1.length': r1_len,
          'r1.width': r1_wid,
          area1: `${area1} [4B]` 
        },
        animationEvent: { 
          type: 'COMPUTE', 
          inputs: ['r1.length', 'r1.width'], 
          operator: '*', 
          formula: `${r1_len} * ${r1_wid} = ${area1}`, 
          result: area1, 
          storeIn: 'area1' 
        }
      },
      {
        step: 9, lineNum: 16,
        explanationEnglish: `Compute area2 = r2.length (${r2_len}) * r2.width (${r2_wid}) = ${area2}.`,
        explanationHinglish: `r2 ke members se area2 calculate kiya: ${r2_len} * ${r2_wid} = ${area2}.`,
        memorySnapshot: { 
          r1: `{ length: ${r1_len}, width: ${r1_wid} }`, 
          r2: `{ length: ${r2_len}, width: ${r2_wid} }`, 
          'r1.length': r1_len,
          'r1.width': r1_wid,
          'r2.length': r2_len,
          'r2.width': r2_wid,
          area1: `${area1} [4B]`, 
          area2: `${area2} [4B]` 
        },
        animationEvent: { 
          type: 'COMPUTE', 
          inputs: ['r2.length', 'r2.width'], 
          operator: '*', 
          formula: `${r2_len} * ${r2_wid} = ${area2}`, 
          result: area2, 
          storeIn: 'area2' 
        }
      },
      {
        step: 10, lineNum: 17,
        explanationEnglish: `printf prints R1 Area: ${area1}, R2 Area: ${area2}.`,
        explanationHinglish: `printf se dono areas display hue.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: `{ length: ${r2_len}, width: ${r2_wid} }`, area1: `${area1} [4B]`, area2: `${area2} [4B]` },
        consoleOutput: `R1 Area: ${area1}, R2 Area: ${area2}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: `R1 Area: ${area1}, R2 Area: ${area2}` }
      },
      {
        step: 11, lineNum: 18,
        explanationEnglish: `Compare areas: area1 (${area1}) > area2 (${area2})? -> ${r1Larger ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Areas compare kiye: ${area1} > ${area2} -> ${r1Larger ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: `{ length: ${r2_len}, width: ${r2_wid} }`, area1: `${area1} [4B]`, area2: `${area2} [4B]` },
        consoleOutput: `R1 Area: ${area1}, R2 Area: ${area2}`,
        animationEvent: { type: 'COMPUTE', inputs: ['area1', 'area2'], operator: '>', result: r1Larger ? 'True' : 'False', storeIn: 'Condition' }
      },
      {
        step: 12, lineNum: r1Larger ? 19 : 21,
        explanationEnglish: `printf outputs: ${r1Larger ? 'Rectangle 1 is larger' : 'Rectangle 2 is larger'}.`,
        explanationHinglish: `printf se ${r1Larger ? 'Rectangle 1 is larger' : 'Rectangle 2 is larger'} print hua.`,
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: `{ length: ${r2_len}, width: ${r2_wid} }`, area1: `${area1} [4B]`, area2: `${area2} [4B]` },
        consoleOutput: `R1 Area: ${area1}, R2 Area: ${area2}\n${r1Larger ? 'Rectangle 1 is larger' : 'Rectangle 2 is larger'}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'printf', outputValue: r1Larger ? 'Rectangle 1 is larger' : 'Rectangle 2 is larger' }
      },
      {
        step: 13, lineNum: 23,
        explanationEnglish: "return 0 finishes main function execution.",
        explanationHinglish: "return 0 se execution complete hokar terminate ho gaya.",
        memorySnapshot: { r1: `{ length: ${r1_len}, width: ${r1_wid} }`, r2: `{ length: ${r2_len}, width: ${r2_wid} }`, area1: `${area1} [4B]`, area2: `${area2} [4B]` },
        consoleOutput: `R1 Area: ${area1}, R2 Area: ${area2}\n${r1Larger ? 'Rectangle 1 is larger' : 'Rectangle 2 is larger'}`,
        animationEvent: { type: 'NONE' }
      }
    ];
  },
  executionSteps: []
};


export const c_array_sum: LessonProgram = {
  id: 'c_array_sum',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 1,
  friendlyName: 'Sum of Array',
  learningObjective: 'Understand contiguous memory allocation and element summation in C arrays.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '10', paramId: 'v0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '30', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '40', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '50', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sum = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    v0: { default: 10, min: 1, max: 99, label: 'arr[0]' },
    v1: { default: 20, min: 1, max: 99, label: 'arr[1]' },
    v2: { default: 30, min: 1, max: 99, label: 'arr[2]' },
    v3: { default: 40, min: 1, max: 99, label: 'arr[3]' },
    v4: { default: 50, min: 1, max: 99, label: 'arr[4]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v0 = Number(vars?.v0 ?? 10);
    const v1 = Number(vars?.v1 ?? 20);
    const v2 = Number(vars?.v2 ?? 30);
    const v3 = Number(vars?.v3 ?? 40);
    const v4 = Number(vars?.v4 ?? 50);
    const arr = [v0, v1, v2, v3, v4];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let sum = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare and initialize 1D integer array arr[5] = {${arr.join(', ')}}.`,
      explanationHinglish: `1D integer array arr[5] = {${arr.join(', ')}} contiguous memory me allocate hui.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: JSON.stringify(arr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize accumulator variable sum = 0.',
      explanationHinglish: 'Accumulator variable sum = 0 declare kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Loop counter starts: int i = 0.',
      explanationHinglish: 'Loop counter start hua: i = 0.',
      memorySnapshot: { arr: JSON.stringify(arr), sum, i: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 0 }
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Check loop condition: i (${i}) < 5 is True.`,
        explanationHinglish: `Condition check: i (${i}) < 5 True hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), sum, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Access arr[${i}] = ${arr[i]}.`,
        explanationHinglish: `arr[${i}] = ${arr[i]} element read kiya.`,
        memorySnapshot: { arr: JSON.stringify(arr), sum, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      const oldSum = sum;
      sum += arr[i];
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Add to sum: ${oldSum} + ${arr[i]} = ${sum}.`,
        explanationHinglish: `sum me add kiya: ${oldSum} + ${arr[i]} = ${sum}.`,
        memorySnapshot: { arr: JSON.stringify(arr), sum, i },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: sum, formula: `sum + arr[${i}]` }
      });

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Increment loop index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `Loop counter badha: i = ${nextI}.`,
        memorySnapshot: { arr: JSON.stringify(arr), sum, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Check loop condition: i (5) < 5 is False. Loop terminates.',
      explanationHinglish: 'Condition check: i (5) < 5 False ho gaya. Loop khatam hua.',
      memorySnapshot: { arr: JSON.stringify(arr), sum, i: 5 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 8,
      explanationEnglish: `printf prints the accumulated total sum: "Sum = ${sum}".`,
      explanationHinglish: `printf se accumulated total "Sum = ${sum}" print hua.`,
      memorySnapshot: { arr: JSON.stringify(arr), sum, i: 5 },
      consoleOutput: `Sum = ${sum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Sum = ${sum}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_array_max: LessonProgram = {
  id: 'c_array_max',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 2,
  friendlyName: 'Find Maximum',
  learningObjective: 'Learn linear scan and maximum tracking in C 1D array.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '15', paramId: 'v0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '62', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '34', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '89', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '41', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Max = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    v0: { default: 15, min: 1, max: 99, label: 'arr[0]' },
    v1: { default: 62, min: 1, max: 99, label: 'arr[1]' },
    v2: { default: 34, min: 1, max: 99, label: 'arr[2]' },
    v3: { default: 89, min: 1, max: 99, label: 'arr[3]' },
    v4: { default: 41, min: 1, max: 99, label: 'arr[4]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v0 = Number(vars?.v0 ?? 15);
    const v1 = Number(vars?.v1 ?? 62);
    const v2 = Number(vars?.v2 ?? 34);
    const v3 = Number(vars?.v3 ?? 89);
    const v4 = Number(vars?.v4 ?? 41);
    const arr = [v0, v1, v2, v3, v4];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let max = arr[0];

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare and initialize 1D array arr[5] = {${arr.join(', ')}}.`,
      explanationHinglish: `1D array arr[5] initialize hui: {${arr.join(', ')}}.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: JSON.stringify(arr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Initialize max with the first element: arr[0] (${max}).`,
      explanationHinglish: `max ko pehle element arr[0] (${max}) se initialize kiya.`,
      memorySnapshot: { arr: JSON.stringify(arr), max },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'max', value: max }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Start loop from index i = 1.',
      explanationHinglish: 'Loop index i = 1 se shuru kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), max, i: 1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    for (let i = 1; i < arr.length; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Check loop condition: i (${i}) < 5 is True.`,
        explanationHinglish: `Condition check: i (${i}) < 5 True hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Inspect arr[${i}] = ${arr[i]} for maximum comparison.`,
        explanationHinglish: `arr[${i}] = ${arr[i]} ko max (${max}) ke saath compare karne ke liye inspect kiya.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      const isGreater = arr[i] > max;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check condition: arr[${i}] (${arr[i]}) > max (${max}) is ${isGreater ? 'True' : 'False'}.`,
        explanationHinglish: `Condition check: ${arr[i]} > ${max} ${isGreater ? 'True' : 'False'} hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`arr[${i}]`, 'max'], operator: '>', result: isGreater ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (isGreater) {
        const oldMax = max;
        max = arr[i];
        steps.push({
          step: stepCount++,
          lineNum: 7,
          explanationEnglish: `Update max = ${arr[i]} (new highest found).`,
          explanationHinglish: `Naya maximum mila: max = ${arr[i]} update kiya.`,
          memorySnapshot: { arr: JSON.stringify(arr), max, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'max', oldValue: oldMax, newValue: max, formula: `arr[${i}]` }
        });
      }

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Increment loop index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `Loop counter increment hua: i = ${nextI}.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Check loop condition: i (5) < 5 is False. Loop terminates.',
      explanationHinglish: 'Condition check: i (5) < 5 False ho gaya. Loop khatam hua.',
      memorySnapshot: { arr: JSON.stringify(arr), max, i: 5 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `printf prints the maximum value found: "Max = ${max}".`,
      explanationHinglish: `printf se final maximum "Max = ${max}" print hua.`,
      memorySnapshot: { arr: JSON.stringify(arr), max, i: 5 },
      consoleOutput: `Max = ${max}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Max = ${max}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_linear_search: LessonProgram = {
  id: 'c_linear_search',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 3,
  friendlyName: 'Linear Search',
  learningObjective: 'Learn sequential search and early break execution in C arrays.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '12', paramId: 'v0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '45', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '78', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '23', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '56', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '78', paramId: 'target' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'found' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'found' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Found at index %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'found' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    v0: { default: 12, min: 1, max: 99, label: 'arr[0]' },
    v1: { default: 45, min: 1, max: 99, label: 'arr[1]' },
    v2: { default: 78, min: 1, max: 99, label: 'arr[2]' },
    v3: { default: 23, min: 1, max: 99, label: 'arr[3]' },
    v4: { default: 56, min: 1, max: 99, label: 'arr[4]' },
    target: { default: 78, min: 1, max: 99, label: 'Search Target' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v0 = Number(vars?.v0 ?? 12);
    const v1 = Number(vars?.v1 ?? 45);
    const v2 = Number(vars?.v2 ?? 78);
    const v3 = Number(vars?.v3 ?? 23);
    const v4 = Number(vars?.v4 ?? 56);
    const arr = [v0, v1, v2, v3, v4];
    const target = Number(vars?.target ?? 78);
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let found = -1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare and initialize 1D array arr[5] = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr[5] = {${arr.join(', ')}} memory me allocate hui.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: JSON.stringify(arr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Set search target = ${target}.`,
      explanationHinglish: `Search target = ${target} set kiya.`,
      memorySnapshot: { arr: JSON.stringify(arr), target },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'target', value: target }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize result tracker found = -1 (not yet found).',
      explanationHinglish: 'found = -1 set kiya (abhi tak match nahi mila).',
      memorySnapshot: { arr: JSON.stringify(arr), target, found: -1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'found', value: -1 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'Start linear search at index i = 0.',
      explanationHinglish: 'Linear search index i = 0 se start kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), target, found, i: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 0 }
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check loop condition: i (${i}) < 5 is True.`,
        explanationHinglish: `Condition check: i (${i}) < 5 True hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), target, found, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Inspect arr[${i}] = ${arr[i]}.`,
        explanationHinglish: `arr[${i}] = ${arr[i]} inspect kiya.`,
        memorySnapshot: { arr: JSON.stringify(arr), target, found, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      const isMatch = arr[i] === target;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check: arr[${i}] (${arr[i]}) == target (${target}) is ${isMatch ? 'True' : 'False'}.`,
        explanationHinglish: `Match check: ${arr[i]} == ${target} ${isMatch ? 'True' : 'False'} hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), target, found, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`arr[${i}]`, 'target'], operator: '==', result: isMatch ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (isMatch) {
        found = i;
        steps.push({
          step: stepCount++,
          lineNum: 8,
          explanationEnglish: `Target found! Record match index found = ${i}.`,
          explanationHinglish: `Match mil gaya! found = ${i} record kiya.`,
          memorySnapshot: { arr: JSON.stringify(arr), target, found: i, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'found', oldValue: -1, newValue: i, formula: 'i' }
        });

        steps.push({
          step: stepCount++,
          lineNum: 9,
          explanationEnglish: 'Execute break statement to exit search loop immediately.',
          explanationHinglish: 'break statement execute hui aur loop turant terminate hua.',
          memorySnapshot: { arr: JSON.stringify(arr), target, found, i },
          animationEvent: { type: 'BREAK_EXECUTION' as const }
        });
        break;
      }

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Increment loop index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `Index aage badha: i = ${nextI}.`,
        memorySnapshot: { arr: JSON.stringify(arr), target, found, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 12,
      explanationEnglish: `printf prints the search result: "Found at index ${found}".`,
      explanationHinglish: `printf se output "Found at index ${found}" print hua.`,
      memorySnapshot: { arr: JSON.stringify(arr), target, found },
      consoleOutput: `Found at index ${found}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Found at index ${found}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_matrix_2d: LessonProgram = {
  id: 'c_matrix_2d',
  language: 'c',
  topic: 'arrays_2d',
  lessonNumber: 1,
  friendlyName: 'Display 2D Matrix',
  learningObjective: 'Understand 2D array row-major memory and nested loop traversal in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1', paramId: 'm00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'm01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 'm10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'm11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d "' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']);' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    m00: { default: 1, min: 1, max: 99, label: 'mat[0][0]' },
    m01: { default: 2, min: 1, max: 99, label: 'mat[0][1]' },
    m10: { default: 3, min: 1, max: 99, label: 'mat[1][0]' },
    m11: { default: 4, min: 1, max: 99, label: 'mat[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const m00 = Number(vars?.m00 ?? 1);
    const m01 = Number(vars?.m01 ?? 2);
    const m10 = Number(vars?.m10 ?? 3);
    const m11 = Number(vars?.m11 ?? 4);
    const mat = [[m00, m01], [m10, m11]];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare and initialize 2D integer matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}}.`,
      explanationHinglish: `2D integer matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}} memory grid me allocate hui.`,
      memorySnapshot: { mat: JSON.stringify(mat) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: JSON.stringify(mat) }
    });

    for (let i = 0; i < 2; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: `Outer loop row i = ${i}: check i < 2 is True.`,
        explanationHinglish: `Outer loop row i = ${i}: i < 2 True hai.`,
        memorySnapshot: { mat: JSON.stringify(mat), i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '2'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      for (let j = 0; j < 2; j++) {
        steps.push({
          step: stepCount++,
          lineNum: 5,
          explanationEnglish: `Inner loop column j = ${j}: check j < 2 is True.`,
          explanationHinglish: `Inner loop column j = ${j}: j < 2 True hai.`,
          memorySnapshot: { mat: JSON.stringify(mat), i, j },
          animationEvent: { type: 'COMPUTE' as const, inputs: ['j', '2'], operator: '<', result: 'True', storeIn: 'Condition' }
        });

        steps.push({
          step: stepCount++,
          lineNum: 6,
          explanationEnglish: `Access cell mat[${i}][${j}] = ${mat[i][j]}.`,
          explanationHinglish: `Matrix cell mat[${i}][${j}] = ${mat[i][j]} inspect kiya.`,
          memorySnapshot: { mat: JSON.stringify(mat), i, j },
          animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'mat', index: i * 2 + j, cell: [i, j] }
        });

        steps.push({
          step: stepCount++,
          lineNum: 6,
          explanationEnglish: `printf prints cell value: "${mat[i][j]} ".`,
          explanationHinglish: `printf se cell value "${mat[i][j]} " print hui.`,
          memorySnapshot: { mat: JSON.stringify(mat), i, j },
          consoleOutput: `${mat[i][j]} `,
          animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `${mat[i][j]} ` }
        });

        const nextJ = j + 1;
        steps.push({
          step: stepCount++,
          lineNum: 5,
          explanationEnglish: `Increment column index: j++ (${j} -> ${nextJ}).`,
          explanationHinglish: `Column index aage badha: j = ${nextJ}.`,
          memorySnapshot: { mat: JSON.stringify(mat), i, j: nextJ },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'j', oldValue: j, newValue: nextJ, formula: 'j++' }
        });
      }

      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Inner loop column j (2) < 2 is False. Row ${i} completed.`,
        explanationHinglish: `Inner loop column check False: Row ${i} complete hui.`,
        memorySnapshot: { mat: JSON.stringify(mat), i, j: 2 },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['j', '2'], operator: '<', result: 'False', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: 'printf prints newline to move to next row.',
        explanationHinglish: 'printf se newline print hua next row ke liye.',
        memorySnapshot: { mat: JSON.stringify(mat), i, j: 2 },
        consoleOutput: '\n',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: '\n' }
      });

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 4,
        explanationEnglish: `Increment row index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `Row index aage badha: i = ${nextI}.`,
        memorySnapshot: { mat: JSON.stringify(mat), i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Outer loop row i (2) < 2 is False. Matrix traversal finished.',
      explanationHinglish: 'Outer loop check False: Matrix traversal poora hua.',
      memorySnapshot: { mat: JSON.stringify(mat), i: 2 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '2'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    return steps;
  },
  executionSteps: []
};


export const c_matrix_sum: LessonProgram = {
  id: 'c_matrix_sum',
  language: 'c',
  topic: 'arrays_2d',
  lessonNumber: 2,
  friendlyName: 'Sum of Matrix',
  learningObjective: 'Accumulate the total sum of all elements in a 2D matrix in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '5', paramId: 'm00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'm01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '15', paramId: 'm10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'm11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Total Sum = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    m00: { default: 5, min: 1, max: 99, label: 'mat[0][0]' },
    m01: { default: 10, min: 1, max: 99, label: 'mat[0][1]' },
    m10: { default: 15, min: 1, max: 99, label: 'mat[1][0]' },
    m11: { default: 20, min: 1, max: 99, label: 'mat[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const m00 = Number(vars?.m00 ?? 5);
    const m01 = Number(vars?.m01 ?? 10);
    const m10 = Number(vars?.m10 ?? 15);
    const m11 = Number(vars?.m11 ?? 20);
    const mat = [[m00, m01], [m10, m11]];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let sum = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Declare and initialize 2D matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}}.`,
      explanationHinglish: `2D matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}} memory me store hui.`,
      memorySnapshot: { mat: JSON.stringify(mat) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: JSON.stringify(mat) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize accumulator variable sum = 0.',
      explanationHinglish: 'Total accumulator sum = 0 declare kiya.',
      memorySnapshot: { mat: JSON.stringify(mat), sum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const val = mat[i][j];
        steps.push({
          step: stepCount++,
          lineNum: 6,
          explanationEnglish: `Access cell mat[${i}][${j}] = ${val}.`,
          explanationHinglish: `Matrix cell mat[${i}][${j}] = ${val} inspect kiya.`,
          memorySnapshot: { mat: JSON.stringify(mat), sum, i, j },
          animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'mat', index: i * 2 + j, cell: [i, j] }
        });

        const oldSum = sum;
        sum += val;
        steps.push({
          step: stepCount++,
          lineNum: 7,
          explanationEnglish: `Add mat[${i}][${j}] to sum: ${oldSum} + ${val} = ${sum}.`,
          explanationHinglish: `sum me cell value jodi: ${oldSum} + ${val} = ${sum}.`,
          memorySnapshot: { mat: JSON.stringify(mat), sum, i, j },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: sum, formula: `sum + mat[${i}][${j}]` }
        });
      }
    }

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `printf prints the overall matrix sum: "Total Sum = ${sum}".`,
      explanationHinglish: `printf se complete matrix ka sum "Total Sum = ${sum}" print hua.`,
      memorySnapshot: { mat: JSON.stringify(mat), sum },
      consoleOutput: `Total Sum = ${sum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Total Sum = ${sum}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_matrix_transpose: LessonProgram = {
  id: 'c_matrix_transpose',
  language: 'c',
  topic: 'arrays_2d',
  lessonNumber: 3,
  friendlyName: 'Matrix Transpose',
  learningObjective: 'Swap row and column coordinates to transpose a 2D matrix in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1', paramId: 'm00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'm01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 'm10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'm11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'trans' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'trans' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Transposed [0][1] = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'trans' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ']);' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    m00: { default: 1, min: 1, max: 99, label: 'mat[0][0]' },
    m01: { default: 2, min: 1, max: 99, label: 'mat[0][1]' },
    m10: { default: 3, min: 1, max: 99, label: 'mat[1][0]' },
    m11: { default: 4, min: 1, max: 99, label: 'mat[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const m00 = Number(vars?.m00 ?? 1);
    const m01 = Number(vars?.m01 ?? 2);
    const m10 = Number(vars?.m10 ?? 3);
    const m11 = Number(vars?.m11 ?? 4);
    const mat = [[m00, m01], [m10, m11]];
    const trans = [[0, 0], [0, 0]];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Original matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}} initialized.`,
      explanationHinglish: `Original matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}} initialize hui.`,
      memorySnapshot: { mat: JSON.stringify(mat) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: JSON.stringify(mat) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Allocate destination matrix trans[2][2].',
      explanationHinglish: 'Destination matrix trans[2][2] memory grid allocate hui.',
      memorySnapshot: { mat: JSON.stringify(mat), trans: JSON.stringify(trans) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'trans', value: JSON.stringify(trans) }
    });

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const val = mat[i][j];
        steps.push({
          step: stepCount++,
          lineNum: 7,
          explanationEnglish: `Read mat[${i}][${j}] = ${val}.`,
          explanationHinglish: `Source cell mat[${i}][${j}] = ${val} read kiya.`,
          memorySnapshot: { mat: JSON.stringify(mat), trans: JSON.stringify(trans), i, j },
          animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'mat', index: i * 2 + j, cell: [i, j] }
        });

        const oldVal = trans[j][i];
        trans[j][i] = val;
        steps.push({
          step: stepCount++,
          lineNum: 7,
          explanationEnglish: `Assign trans[${j}][${i}] = ${val} (swap row & col).`,
          explanationHinglish: `trans[${j}][${i}] = ${val} set kiya (row aur col swapped).`,
          memorySnapshot: { mat: JSON.stringify(mat), trans: JSON.stringify(trans), i, j },
          animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'trans', index: j * 2 + i, cell: [j, i], oldValue: oldVal, newValue: val }
        });
      }
    }

    steps.push({
      step: stepCount++,
      lineNum: 10,
      explanationEnglish: `printf prints transposed cell value trans[0][1] = ${trans[0][1]}.`,
      explanationHinglish: `printf se transposed cell trans[0][1] = ${trans[0][1]} print hua.`,
      memorySnapshot: { mat: JSON.stringify(mat), trans: JSON.stringify(trans) },
      consoleOutput: `Transposed [0][1] = ${trans[0][1]}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Transposed [0][1] = ${trans[0][1]}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_array_reverse: LessonProgram = {
  id: 'c_array_reverse',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 4,
  friendlyName: 'Reverse Array',
  learningObjective: 'Reverse elements of a 1D array in-place without extra array storage in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '10', paramId: 'v0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '30', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '40', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '50', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'start' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '--' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed arr[0] = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']);' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    v0: { default: 10, min: 1, max: 99, label: 'arr[0]' },
    v1: { default: 20, min: 1, max: 99, label: 'arr[1]' },
    v2: { default: 30, min: 1, max: 99, label: 'arr[2]' },
    v3: { default: 40, min: 1, max: 99, label: 'arr[3]' },
    v4: { default: 50, min: 1, max: 99, label: 'arr[4]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v0 = Number(vars?.v0 ?? 10);
    const v1 = Number(vars?.v1 ?? 20);
    const v2 = Number(vars?.v2 ?? 30);
    const v3 = Number(vars?.v3 ?? 40);
    const v4 = Number(vars?.v4 ?? 50);
    const arr = [v0, v1, v2, v3, v4];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let start = 0;
    let end = 4;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize 1D array arr[5] = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr[5] = {${arr.join(', ')}} allocate hui.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: JSON.stringify(arr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize left pointer start = 0.',
      explanationHinglish: 'Left pointer start = 0 set kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), start: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'start', value: 0 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize right pointer end = 4.',
      explanationHinglish: 'Right pointer end = 4 set kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), start: 0, end: 4 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'end', value: 4 }
    });

    while (start < end) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `while check: start (${start}) < end (${end}) is True.`,
        explanationHinglish: `Condition check: start (${start}) < end (${end}) True hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), start, end },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['start', 'end'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      const tempVal = arr[start];
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Backup arr[${start}] (${tempVal}) into temp.`,
        explanationHinglish: `temp me arr[${start}] (${tempVal}) copy kiya.`,
        memorySnapshot: { arr: JSON.stringify(arr), start, end, temp: tempVal },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'temp', value: tempVal }
      });

      const oldStart = arr[start];
      arr[start] = arr[end];
      steps.push({
        step: stepCount++,
        lineNum: 8,
        explanationEnglish: `Swap: arr[${start}] = arr[${end}] (${arr[start]}).`,
        explanationHinglish: `arr[${start}] me arr[${end}] (${arr[start]}) daala.`,
        memorySnapshot: { arr: JSON.stringify(arr), start, end, temp: tempVal },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'arr', index: start, oldValue: oldStart, newValue: arr[start] }
      });

      const oldEnd = arr[end];
      arr[end] = tempVal;
      steps.push({
        step: stepCount++,
        lineNum: 9,
        explanationEnglish: `Swap: arr[${end}] = temp (${tempVal}).`,
        explanationHinglish: `arr[${end}] me temp (${tempVal}) daala.`,
        memorySnapshot: { arr: JSON.stringify(arr), start, end, temp: tempVal },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'arr', index: end, oldValue: oldEnd, newValue: tempVal }
      });

      const nextStart = start + 1;
      const nextEnd = end - 1;
      steps.push({
        step: stepCount++,
        lineNum: 10,
        explanationEnglish: `Advance start++ (${start} -> ${nextStart}).`,
        explanationHinglish: `start = ${nextStart}.`,
        memorySnapshot: { arr: JSON.stringify(arr), start: nextStart, end },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'start', oldValue: start, newValue: nextStart, formula: 'start++' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 11,
        explanationEnglish: `Retreat end-- (${end} -> ${nextEnd}).`,
        explanationHinglish: `end = ${nextEnd}.`,
        memorySnapshot: { arr: JSON.stringify(arr), start: nextStart, end: nextEnd },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'end', oldValue: end, newValue: nextEnd, formula: 'end--' }
      });

      start = nextStart;
      end = nextEnd;
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: `while check: start (${start}) < end (${end}) is False. Loop ends.`,
      explanationHinglish: `start >= end: In-place reversal complete hua.`,
      memorySnapshot: { arr: JSON.stringify(arr), start, end },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['start', 'end'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 13,
      explanationEnglish: `printf confirms reversed element: arr[0] = ${arr[0]}.`,
      explanationHinglish: `printf se reversed arr[0] = ${arr[0]} print hua.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      consoleOutput: `Reversed arr[0] = ${arr[0]}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Reversed arr[0] = ${arr[0]}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_array_even_odd: LessonProgram = {
  id: 'c_array_even_odd',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 5,
  friendlyName: 'Count Even and Odd',
  learningObjective: 'Count even and odd integers in a 1D array using the modulo operator in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '12', paramId: 'v0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '17', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '24', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '39', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '40', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'even' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'odd' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'even' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'odd' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Even: %d, Odd: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'even' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'odd' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    v0: { default: 12, min: 1, max: 99, label: 'arr[0]' },
    v1: { default: 17, min: 1, max: 99, label: 'arr[1]' },
    v2: { default: 24, min: 1, max: 99, label: 'arr[2]' },
    v3: { default: 39, min: 1, max: 99, label: 'arr[3]' },
    v4: { default: 40, min: 1, max: 99, label: 'arr[4]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v0 = Number(vars?.v0 ?? 12);
    const v1 = Number(vars?.v1 ?? 17);
    const v2 = Number(vars?.v2 ?? 24);
    const v3 = Number(vars?.v3 ?? 39);
    const v4 = Number(vars?.v4 ?? 40);
    const arr = [v0, v1, v2, v3, v4];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let even = 0;
    let odd = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize arr[5] = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr[5] = {${arr.join(', ')}} initialize hui.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: JSON.stringify(arr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize even counter = 0.',
      explanationHinglish: 'even counter = 0 set kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), even: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'even', value: 0 }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize odd counter = 0.',
      explanationHinglish: 'odd counter = 0 set kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), even: 0, odd: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'odd', value: 0 }
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check loop condition: i (${i}) < 5 is True.`,
        explanationHinglish: `Condition check: i (${i}) < 5 True hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), even, odd, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Inspect element arr[${i}] = ${arr[i]}.`,
        explanationHinglish: `arr[${i}] = ${arr[i]} check kiya.`,
        memorySnapshot: { arr: JSON.stringify(arr), even, odd, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      const isEven = arr[i] % 2 === 0;
      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Check: ${arr[i]} % 2 == 0 is ${isEven ? 'True (Even)' : 'False (Odd)'}.`,
        explanationHinglish: `${arr[i]} % 2 check: ${isEven ? 'Even' : 'Odd'}.`,
        memorySnapshot: { arr: JSON.stringify(arr), even, odd, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: [`arr[${i}]`, '2'], operator: '% == 0', result: isEven ? 'True' : 'False', storeIn: 'Condition' }
      });

      if (isEven) {
        const oldEven = even;
        even++;
        steps.push({
          step: stepCount++,
          lineNum: 8,
          explanationEnglish: `Increment even counter: even++ (${oldEven} -> ${even}).`,
          explanationHinglish: `even counter increment hua: ${even}.`,
          memorySnapshot: { arr: JSON.stringify(arr), even, odd, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'even', oldValue: oldEven, newValue: even, formula: 'even++' }
        });
      } else {
        const oldOdd = odd;
        odd++;
        steps.push({
          step: stepCount++,
          lineNum: 10,
          explanationEnglish: `Increment odd counter: odd++ (${oldOdd} -> ${odd}).`,
          explanationHinglish: `odd counter increment hua: ${odd}.`,
          memorySnapshot: { arr: JSON.stringify(arr), even, odd, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'odd', oldValue: oldOdd, newValue: odd, formula: 'odd++' }
        });
      }

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Advance loop index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `i++ -> ${nextI}.`,
        memorySnapshot: { arr: JSON.stringify(arr), even, odd, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'Loop condition check: i (5) < 5 is False. Traversal complete.',
      explanationHinglish: 'Loop finish hua: i = 5.',
      memorySnapshot: { arr: JSON.stringify(arr), even, odd, i: 5 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 13,
      explanationEnglish: `printf prints totals: "Even: ${even}, Odd: ${odd}".`,
      explanationHinglish: `printf se "Even: ${even}, Odd: ${odd}" print hua.`,
      memorySnapshot: { arr: JSON.stringify(arr), even, odd },
      consoleOutput: `Even: ${even}, Odd: ${odd}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Even: ${even}, Odd: ${odd}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_array_second_max: LessonProgram = {
  id: 'c_array_second_max',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 6,
  friendlyName: 'Second Largest Element',
  learningObjective: 'Find the second largest integer in a 1D array in a single traversal in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '20', paramId: 'v0' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '45', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '80', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '55', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '30', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'secondMax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'secondMax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'secondMax' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'secondMax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Second Max = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'secondMax' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 15, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    v0: { default: 20, min: 1, max: 99, label: 'arr[0]' },
    v1: { default: 45, min: 1, max: 99, label: 'arr[1]' },
    v2: { default: 80, min: 1, max: 99, label: 'arr[2]' },
    v3: { default: 55, min: 1, max: 99, label: 'arr[3]' },
    v4: { default: 30, min: 1, max: 99, label: 'arr[4]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v0 = Number(vars?.v0 ?? 20);
    const v1 = Number(vars?.v1 ?? 45);
    const v2 = Number(vars?.v2 ?? 80);
    const v3 = Number(vars?.v3 ?? 55);
    const v4 = Number(vars?.v4 ?? 30);
    const arr = [v0, v1, v2, v3, v4];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let max = arr[0];
    let secondMax = -1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize arr[5] = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr[5] = {${arr.join(', ')}} allocate hui.`,
      memorySnapshot: { arr: JSON.stringify(arr) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: JSON.stringify(arr) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Initialize max with arr[0] (${max}).`,
      explanationHinglish: `max = arr[0] (${max}) set kiya.`,
      memorySnapshot: { arr: JSON.stringify(arr), max },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'max', value: max }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize secondMax = -1.',
      explanationHinglish: 'secondMax = -1 set kiya.',
      memorySnapshot: { arr: JSON.stringify(arr), max, secondMax: -1 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'secondMax', value: -1 }
    });

    for (let i = 1; i < arr.length; i++) {
      const val = arr[i];
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Check loop condition: i (${i}) < 5 is True.`,
        explanationHinglish: `Condition check: i (${i}) < 5 True hai.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 7,
        explanationEnglish: `Inspect arr[${i}] = ${val}.`,
        explanationHinglish: `arr[${i}] = ${val} inspect kiya.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      if (val > max) {
        const oldSecond = secondMax;
        secondMax = max;
        steps.push({
          step: stepCount++,
          lineNum: 8,
          explanationEnglish: `New highest found! Demote old max (${max}) to secondMax.`,
          explanationHinglish: `Naya max mila: purane max (${max}) ko secondMax banaya.`,
          memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'secondMax', oldValue: oldSecond, newValue: secondMax, formula: 'max' }
        });

        const oldMax = max;
        max = val;
        steps.push({
          step: stepCount++,
          lineNum: 9,
          explanationEnglish: `Promote new highest: max = ${val}.`,
          explanationHinglish: `max = ${val} update kiya.`,
          memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'max', oldValue: oldMax, newValue: max, formula: `arr[${i}]` }
        });
      } else if (val > secondMax) {
        const oldSecond = secondMax;
        secondMax = val;
        steps.push({
          step: stepCount++,
          lineNum: 11,
          explanationEnglish: `arr[${i}] (${val}) > secondMax: Update secondMax = ${val}.`,
          explanationHinglish: `secondMax = ${val} update kiya.`,
          memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'secondMax', oldValue: oldSecond, newValue: secondMax, formula: `arr[${i}]` }
        });
      }

      const nextI = i + 1;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Advance loop index: i++ (${i} -> ${nextI}).`,
        explanationHinglish: `i++ -> ${nextI}.`,
        memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i: nextI },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: nextI, formula: 'i++' }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 6,
      explanationEnglish: 'Loop condition check: i (5) < 5 is False. Traversal complete.',
      explanationHinglish: 'Loop finish hua.',
      memorySnapshot: { arr: JSON.stringify(arr), max, secondMax, i: 5 },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '5'], operator: '<', result: 'False', storeIn: 'Condition' }
    });

    steps.push({
      step: stepCount++,
      lineNum: 14,
      explanationEnglish: `printf prints the second largest element: "Second Max = ${secondMax}".`,
      explanationHinglish: `printf se "Second Max = ${secondMax}" print hua.`,
      memorySnapshot: { arr: JSON.stringify(arr), max, secondMax },
      consoleOutput: `Second Max = ${secondMax}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Second Max = ${secondMax}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_matrix_addition: LessonProgram = {
  id: 'c_matrix_addition',
  language: 'c',
  topic: 'arrays_2d',
  lessonNumber: 4,
  friendlyName: 'Matrix Addition',
  learningObjective: 'Compute element-wise addition of two 2D matrices in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1', paramId: 'a00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'a01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 'a10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'a11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '5', paramId: 'b00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '6', paramId: 'b01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '7', paramId: 'b10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '8', paramId: 'b11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"C[0][0] = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']);' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a00: { default: 1, min: 1, max: 99, label: 'A[0][0]' },
    a01: { default: 2, min: 1, max: 99, label: 'A[0][1]' },
    a10: { default: 3, min: 1, max: 99, label: 'A[1][0]' },
    a11: { default: 4, min: 1, max: 99, label: 'A[1][1]' },
    b00: { default: 5, min: 1, max: 99, label: 'B[0][0]' },
    b01: { default: 6, min: 1, max: 99, label: 'B[0][1]' },
    b10: { default: 7, min: 1, max: 99, label: 'B[1][0]' },
    b11: { default: 8, min: 1, max: 99, label: 'B[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a00 = Number(vars?.a00 ?? 1);
    const a01 = Number(vars?.a01 ?? 2);
    const a10 = Number(vars?.a10 ?? 3);
    const a11 = Number(vars?.a11 ?? 4);
    const b00 = Number(vars?.b00 ?? 5);
    const b01 = Number(vars?.b01 ?? 6);
    const b10 = Number(vars?.b10 ?? 7);
    const b11 = Number(vars?.b11 ?? 8);
    const a = [[a00, a01], [a10, a11]];
    const b = [[b00, b01], [b10, b11]];
    const c = [[0, 0], [0, 0]];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize Matrix A[2][2] = {{${a00}, ${a01}}, {${a10}, ${a11}}}.`,
      explanationHinglish: `Matrix A[2][2] initialize hui.`,
      memorySnapshot: { a: JSON.stringify(a) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'a', value: JSON.stringify(a) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Initialize Matrix B[2][2] = {{${b00}, ${b01}}, {${b10}, ${b11}}}.`,
      explanationHinglish: `Matrix B[2][2] initialize hui.`,
      memorySnapshot: { a: JSON.stringify(a), b: JSON.stringify(b) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'b', value: JSON.stringify(b) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Allocate destination Matrix C[2][2].',
      explanationHinglish: 'Result matrix C[2][2] allocate hui.',
      memorySnapshot: { a: JSON.stringify(a), b: JSON.stringify(b), c: JSON.stringify(c) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'c', value: JSON.stringify(c) }
    });

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const sumVal = a[i][j] + b[i][j];
        const oldVal = c[i][j];
        c[i][j] = sumVal;

        steps.push({
          step: stepCount++,
          lineNum: 8,
          explanationEnglish: `Calculate C[${i}][${j}] = A[${i}][${j}] (${a[i][j]}) + B[${i}][${j}] (${b[i][j]}) = ${sumVal}.`,
          explanationHinglish: `C[${i}][${j}] = ${a[i][j]} + ${b[i][j]} = ${sumVal} calculate kiya.`,
          memorySnapshot: { a: JSON.stringify(a), b: JSON.stringify(b), c: JSON.stringify(c), i, j },
          animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'c', index: i * 2 + j, cell: [i, j], oldValue: oldVal, newValue: sumVal }
        });
      }
    }

    steps.push({
      step: stepCount++,
      lineNum: 11,
      explanationEnglish: `printf prints result cell C[0][0] = ${c[0][0]}.`,
      explanationHinglish: `printf se C[0][0] = ${c[0][0]} print hua.`,
      memorySnapshot: { c: JSON.stringify(c) },
      consoleOutput: `C[0][0] = ${c[0][0]}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `C[0][0] = ${c[0][0]}` }
    });

    return steps;
  },
  executionSteps: []
};


export const c_matrix_diagonal_sum: LessonProgram = {
  id: 'c_matrix_diagonal_sum',
  language: 'c',
  topic: 'arrays_2d',
  lessonNumber: 5,
  friendlyName: 'Diagonal Sum',
  learningObjective: 'Calculate the sum of primary diagonal elements mat[i][i] in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '4', paramId: 'm00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'm01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '2', paramId: 'm10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '9', paramId: 'm11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Diagonal Sum = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    m00: { default: 4, min: 1, max: 99, label: 'mat[0][0]' },
    m01: { default: 7, min: 1, max: 99, label: 'mat[0][1]' },
    m10: { default: 2, min: 1, max: 99, label: 'mat[1][0]' },
    m11: { default: 9, min: 1, max: 99, label: 'mat[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const m00 = Number(vars?.m00 ?? 4);
    const m01 = Number(vars?.m01 ?? 7);
    const m10 = Number(vars?.m10 ?? 2);
    const m11 = Number(vars?.m11 ?? 9);
    const mat = [[m00, m01], [m10, m11]];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;
    let diagSum = 0;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize 2D matrix mat[2][2] = {{${m00}, ${m01}}, {${m10}, ${m11}}}.`,
      explanationHinglish: `Matrix mat[2][2] initialize hui.`,
      memorySnapshot: { mat: JSON.stringify(mat) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: JSON.stringify(mat) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: 'Initialize diagonal accumulator diagSum = 0.',
      explanationHinglish: 'diagSum = 0 set kiya.',
      memorySnapshot: { mat: JSON.stringify(mat), diagSum: 0 },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'diagSum', value: 0 }
    });

    for (let i = 0; i < 2; i++) {
      const val = mat[i][i];
      steps.push({
        step: stepCount++,
        lineNum: 5,
        explanationEnglish: `Loop condition check: i (${i}) < 2 is True.`,
        explanationHinglish: `Condition check: i (${i}) < 2 True hai.`,
        memorySnapshot: { mat: JSON.stringify(mat), diagSum, i },
        animationEvent: { type: 'COMPUTE' as const, inputs: ['i', '2'], operator: '<', result: 'True', storeIn: 'Condition' }
      });

      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Access diagonal cell mat[${i}][${i}] = ${val}.`,
        explanationHinglish: `Diagonal element mat[${i}][${i}] = ${val} inspect kiya.`,
        memorySnapshot: { mat: JSON.stringify(mat), diagSum, i },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'mat', index: i * 2 + i, cell: [i, i] }
      });

      const oldSum = diagSum;
      diagSum += val;
      steps.push({
        step: stepCount++,
        lineNum: 6,
        explanationEnglish: `Add to diagSum: ${oldSum} + ${val} = ${diagSum}.`,
        explanationHinglish: `diagSum me ${val} joda: ${oldSum} + ${val} = ${diagSum}.`,
        memorySnapshot: { mat: JSON.stringify(mat), diagSum, i },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'diagSum', oldValue: oldSum, newValue: diagSum, formula: `diagSum + mat[${i}][${i}]` }
      });
    }

    steps.push({
      step: stepCount++,
      lineNum: 8,
      explanationEnglish: `printf prints the primary diagonal sum: "Diagonal Sum = ${diagSum}".`,
      explanationHinglish: `printf se "Diagonal Sum = ${diagSum}" print hua.`,
      memorySnapshot: { mat: JSON.stringify(mat), diagSum },
      consoleOutput: `Diagonal Sum = ${diagSum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Diagonal Sum = ${diagSum}` }
    });

    return steps;
  },
  executionSteps: []
};

export const c_matrix_multiplication: LessonProgram = {
  id: 'c_matrix_multiplication',
  language: 'c',
  topic: 'arrays_2d',
  lessonNumber: 6,
  friendlyName: 'Matrix Multiplication',
  learningObjective: 'Multiply two 2x2 matrices using triple nested loops in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'A' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1', paramId: 'a00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'a01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 'a10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'a11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'B' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '2', paramId: 'b00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '0', paramId: 'b01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '1', paramId: 'b10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'b11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'C' }, { type: 'punctuation', value: '[2][2]' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{0, 0}, {0, 0}};' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'k' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'k' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'k' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '                ' }, { type: 'variable', value: 'C' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'A' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'k' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'B' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'k' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"C[0][0] = %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'C[0][0]' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a00: { default: 1, min: 0, max: 9, label: 'A[0][0]' },
    a01: { default: 2, min: 0, max: 9, label: 'A[0][1]' },
    a10: { default: 3, min: 0, max: 9, label: 'A[1][0]' },
    a11: { default: 4, min: 0, max: 9, label: 'A[1][1]' },
    b00: { default: 2, min: 0, max: 9, label: 'B[0][0]' },
    b01: { default: 0, min: 0, max: 9, label: 'B[0][1]' },
    b10: { default: 1, min: 0, max: 9, label: 'B[1][0]' },
    b11: { default: 2, min: 0, max: 9, label: 'B[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a00 = Number(vars?.a00 ?? 1);
    const a01 = Number(vars?.a01 ?? 2);
    const a10 = Number(vars?.a10 ?? 3);
    const a11 = Number(vars?.a11 ?? 4);
    const b00 = Number(vars?.b00 ?? 2);
    const b01 = Number(vars?.b01 ?? 0);
    const b10 = Number(vars?.b10 ?? 1);
    const b11 = Number(vars?.b11 ?? 2);
    const A = [[a00, a01], [a10, a11]];
    const B = [[b00, b01], [b10, b11]];
    const C = [[0, 0], [0, 0]];
    const steps: ExecutionStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      lineNum: 3,
      explanationEnglish: `Initialize 2x2 matrix A = {{${a00}, ${a01}}, {${a10}, ${a11}}}.`,
      explanationHinglish: '2x2 Matrix A initialize hua.',
      memorySnapshot: { A: JSON.stringify(A) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'A', value: JSON.stringify(A) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 4,
      explanationEnglish: `Initialize 2x2 matrix B = {{${b00}, ${b01}}, {${b10}, ${b11}}}.`,
      explanationHinglish: '2x2 Matrix B initialize hua.',
      memorySnapshot: { A: JSON.stringify(A), B: JSON.stringify(B) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'B', value: JSON.stringify(B) }
    });

    steps.push({
      step: stepCount++,
      lineNum: 5,
      explanationEnglish: 'Initialize result matrix C = {{0, 0}, {0, 0}}.',
      explanationHinglish: 'Result matrix C zeros ke sath initialize hua.',
      memorySnapshot: { A: JSON.stringify(A), B: JSON.stringify(B), C: JSON.stringify(C) },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'C', value: JSON.stringify(C) }
    });

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          const prod = A[i][k] * B[k][j];
          const oldC = C[i][j];
          C[i][j] += prod;

          steps.push({
            step: stepCount++,
            lineNum: 9,
            explanationEnglish: `C[${i}][${j}] += A[${i}][${k}] (${A[i][k]}) * B[${k}][${j}] (${B[k][j]}) = ${prod} -> C[${i}][${j}] = ${C[i][j]}.`,
            explanationHinglish: `Multiply & add: ${A[i][k]} * ${B[k][j]} = ${prod}, C[${i}][${j}] ab ${C[i][j]} ho gaya.`,
            memorySnapshot: { A: JSON.stringify(A), B: JSON.stringify(B), C: JSON.stringify(C), i, j, k },
            animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'C', index: i * 2 + j, cell: [i, j], oldValue: oldC, newValue: C[i][j] }
          });
        }
      }
    }

    steps.push({
      step: stepCount++,
      lineNum: 13,
      explanationEnglish: `printf prints C[0][0] = ${C[0][0]}.`,
      explanationHinglish: `printf se C[0][0] = ${C[0][0]} print hua.`,
      memorySnapshot: { C: JSON.stringify(C) },
      consoleOutput: `C[0][0] = ${C[0][0]}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `C[0][0] = ${C[0][0]}` }
    });

    return steps;
  },
  executionSteps: []
};


export const cLessons: Record<string, LessonProgram> = {
  // Variables
  c_int: cIntVariable,
  c_float: cFloatVariable,
  c_char: cCharVariable,
  c_swap_temp: c_swap_temp,
  c_swap_no_temp: c_swap_no_temp,
  // Operators
  c_arithmetic: c_arithmetic,
  c_relational_logical: c_relational_logical,
  c_inc_dec: c_inc_dec,
  c_circle_geometry: c_circle_geometry,
  c_temp_converter: c_temp_converter,
  // User Input
  c_scanf_integer: c_scanf_integer,
  c_scanf_float: c_scanf_float,
  c_scanf_string: c_scanf_string,
  // Type Casting
  c_implicit_casting: c_implicit_casting,
  c_explicit_casting: c_explicit_casting,
  c_char_ascii: c_char_ascii,
  // If Else
  c_even_odd: c_even_odd,
  c_largest_three: c_largest_three,
  c_leap_year: c_leap_year,
  c_vowel_consonant: c_vowel_consonant,
  // If Else If
  c_marks_grade: c_marks_grade,
  c_tax_calc: c_tax_calc,
  c_pos_neg_zero: c_pos_neg_zero,
  c_electricity_bill: c_electricity_bill,
  // Switch Case
  c_switch_day: c_switch_day,
  c_switch_calc: c_switch_calc,
  c_switch_vowel: c_switch_vowel,
  c_switch_grade: c_switch_grade,
  c_switch_month: c_switch_month,
  // For Loop
  c_for_sum: c_for_sum,
  c_multiplication_table: c_multiplication_table,
  c_even_numbers: c_even_numbers,
  c_fibonacci: c_fibonacci,
  c_prime_check: c_prime_check,
  // While Loop
  c_while_basic: c_while_basic,
  c_digit_sum: c_digit_sum,
  c_factorial: c_factorial,
  c_reverse_num: c_reverse_num,
  c_palindrome_num: c_palindrome_num,
  c_armstrong_num: c_armstrong_num,
  // Do While Loop
  c_do_while_basic: c_do_while_basic,
  c_do_while_sum: c_do_while_sum,
  // Strings
  c_string_length: c_string_length,
  c_string_copy: c_string_copy,
  c_string_reverse: c_string_reverse,
  c_string_palindrome: c_string_palindrome,
  c_string_vowels: c_string_vowels,
  c_string_concat: c_string_concat,
  // Functions
  c_functions: c_functions,
  c_func_addition: c_func_addition,
  c_func_call_by_val: c_func_call_by_val,
  c_func_max: c_func_max,
  c_func_factorial: c_func_factorial,
  c_func_fibonacci: c_func_fibonacci,
  // Recursion
  c_recur_factorial: c_recur_factorial,
  c_recur_fibonacci: c_recur_fibonacci,
  c_recur_sum: c_recur_sum,
  c_recur_power: c_recur_power,
  // 1D Arrays
  c_array_sum: c_array_sum,
  c_array_max: c_array_max,
  c_linear_search: c_linear_search,
  c_array_reverse: c_array_reverse,
  c_array_even_odd: c_array_even_odd,
  c_array_second_max: c_array_second_max,
  // 2D Arrays
  c_matrix_2d: c_matrix_2d,
  c_matrix_sum: c_matrix_sum,
  c_matrix_transpose: c_matrix_transpose,
  c_matrix_addition: c_matrix_addition,
  c_matrix_diagonal_sum: c_matrix_diagonal_sum,
  c_matrix_multiplication: c_matrix_multiplication,
  // Structures
  c_struct_student: c_struct_student,
  c_struct_rectangle: c_struct_rectangle,
};
