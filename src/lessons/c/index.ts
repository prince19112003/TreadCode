import type { LessonProgram, ExecutionStep } from '../types';

// ─── TOPIC 01: VARIABLES (4 Programs) ──────────────────────────────────────────

export const cIntVariable: LessonProgram = {
  id: 'c_int',
  language: 'c',
  topic: 'variables',
  lessonNumber: 1,
  friendlyName: 'Integer Data Type (int)',
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
  friendlyName: 'Float & Double Data Types',
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
  friendlyName: 'Char & ASCII Storage',
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
  friendlyName: 'Swap Two Variables (Using Temp)',
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
  friendlyName: 'Swap Two Variables (Without Temp)',
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

export const c_constants: LessonProgram = {
  id: 'c_constants',
  language: 'c',
  topic: 'variables',
  lessonNumber: 6,
  friendlyName: 'Constants vs Variables (const)',
  learningObjective: 'Understand how const locks memory from modification compared to normal variables in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'score' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '50', paramId: 'score' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'const' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'MAX_LIMIT' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '100', paramId: 'max_limit' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'score' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '75' }, { type: 'punctuation', value: ';' }, { type: 'text', value: '       ' }, { type: 'comment', value: '// Allowed: normal variable can change' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'comment', value: '// MAX_LIMIT = 150; // ERROR! const variable cannot be modified' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Score: %d, Max: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'score' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'MAX_LIMIT' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    score: { default: 50, min: 0, max: 100, label: 'Initial score (int)' },
    max_limit: { default: 100, min: 10, max: 1000, label: 'MAX_LIMIT (const int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const score = Number(vars?.score ?? 50);
    const maxLimit = Number(vars?.max_limit ?? 100);
    const updatedScore = score + 25;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare mutable variable: int score = ${score} [Read/Write RAM].`,
        explanationHinglish: `Normal variable 'score' = ${score} declare hua. Iski value future me badal sakti hai.`,
        memorySnapshot: { score: `${score} [4B Read/Write]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'score', value: score }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare constant: const int MAX_LIMIT = ${maxLimit} [LOCKED / Read-Only Memory].`,
        explanationHinglish: `const int MAX_LIMIT = ${maxLimit} declare hua. 'const' lagane se ye box LOCK (Read-Only) ho gaya!`,
        memorySnapshot: { score: `${score} [4B]`, MAX_LIMIT: `${maxLimit} [🔒 CONST LOCKED]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'MAX_LIMIT (🔒 const)', value: `${maxLimit}` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `score = ${updatedScore}; Modification ALLOWED because 'score' is a normal variable (${score} → ${updatedScore}).`,
        explanationHinglish: `score = ${updatedScore}; Success! score normal variable hai isliye iski value change hokar ${updatedScore} ho gayi.`,
        memorySnapshot: { score: `${updatedScore} [4B]`, MAX_LIMIT: `${maxLimit} [🔒 CONST LOCKED]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'score', oldValue: score, newValue: updatedScore, formula: `score = ${updatedScore}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `Attempting MAX_LIMIT = 150 would cause COMPILER ERROR: "assignment of read-only variable 'MAX_LIMIT'".`,
        explanationHinglish: `Agar hum MAX_LIMIT = 150 likhenge toh C Compiler ERROR dega: "assignment of read-only variable". Constant kabhi change nahi ho sakta!`,
        memorySnapshot: { score: `${updatedScore} [4B]`, MAX_LIMIT: `${maxLimit} [🔒 CONST LOCKED]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'MAX_LIMIT = 150 (BLOCKED ❌)',
          result: false,
          explanation: 'ERROR: Cannot assign to variable with const-qualified type'
        }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `printf prints final values: Score: ${updatedScore}, Max: ${maxLimit}.`,
        explanationHinglish: `printf se console pe Score: ${updatedScore}, Max: ${maxLimit} print hua.`,
        memorySnapshot: { score: `${updatedScore} [4B]`, MAX_LIMIT: `${maxLimit} [🔒 CONST LOCKED]` },
        consoleOutput: `Score: ${updatedScore}, Max: ${maxLimit}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Score: ${updatedScore}, Max: ${maxLimit}` }
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
  friendlyName: 'Arithmetic Operators (+, -, *, /, %)',
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
  friendlyName: 'Relational & Logical Operators (==, !=, <, >, &&, ||, !)',
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
  friendlyName: 'Pre-increment vs Post-increment (++i vs i++)',
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
  friendlyName: 'Circle Area & Circumference Formulas',
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
  friendlyName: 'Celsius to Fahrenheit Converter',
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
  friendlyName: 'Read Integer Input (scanf with %d)',
  learningObjective: 'Master user input in C using scanf with format specifier %d and address-of operator (&).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter an integer: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'scanf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%d"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ');' }] },
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
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'num', outputValue: inputVal }
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
  friendlyName: 'Read Decimal Input (scanf with %f / %lf)',
  learningObjective: 'Understand reading decimal numbers in C using %f for float and %lf for double.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'float' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter radius: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'scanf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%f"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ');' }] },
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
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'radius', outputValue: radius.toFixed(2) }
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
  friendlyName: 'Read String Input (scanf with %s)',
  learningObjective: 'Understand how scanf with %s reads words into a char array and automatically adds null-terminator (\\0).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '20' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter your name: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'scanf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"%s"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ');' }] },
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
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'name', outputValue: `Hello, ${name}!` }
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
  friendlyName: 'Implicit Type Promotion (int to double)',
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
  friendlyName: 'Explicit Casting ((int)pi truncation)',
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
  friendlyName: 'Char to ASCII Code Conversion',
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
  friendlyName: 'Even or Odd Number Checker',
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
  friendlyName: 'Largest of Three Numbers',
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
  friendlyName: 'Leap Year Checker',
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
  friendlyName: 'Vowel or Consonant Checker',
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
  friendlyName: 'Student Grade System (If-Else Ladder)',
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
  friendlyName: 'Income Tax Slab Calculator',
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
  friendlyName: 'Positive, Negative, or Zero Checker',
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
  friendlyName: 'Tiered Electricity Bill Calculator',
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
  friendlyName: 'Day of Week (Switch Case)',
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
    const dayName = day === 1 ? 'Monday' : day === 2 ? 'Tuesday' : day === 3 ? 'Wednesday' : 'Other Day';
    const targetLine = day === 1 ? 5 : day === 2 ? 6 : day === 3 ? 7 : 8;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int day = ${day} [4 Bytes].`,
        explanationHinglish: `Integer day = ${day} memory me store hua.`,
        memorySnapshot: { day: `${day} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'day', value: day }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `switch(day): Evaluate day expression (${day}) and jump directly to matching case.`,
        explanationHinglish: `switch(day) ne jump table se matching case ${day} find kiya.`,
        memorySnapshot: { day: `${day} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'day',
          variableValue: day,
          condition: `matches case ${day > 3 || day < 1 ? 'default' : day}`,
          result: true
        }
      },
      {
        step: 3, lineNum: targetLine,
        explanationEnglish: `Executed case ${day <= 3 && day >= 1 ? day : 'default'}: printf outputs "${dayName}" and break exits the switch block.`,
        explanationHinglish: `Matching case chala: "${dayName}" print hua aur break statement se switch khatam hua.`,
        memorySnapshot: { day: `${day} [4B]` },
        consoleOutput: dayName,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: dayName }
      }
    ];
  },
  executionSteps: []
};

export const c_switch_calc: LessonProgram = {
  id: 'c_switch_calc',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 2,
  friendlyName: 'Mini Calculator (Switch on Char Operator)',
  learningObjective: 'Switch on char operator characters (+, -, *, /) to perform arithmetic calculations.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '12', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'op' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'op' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'+'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sum: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'-'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Diff: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Product: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid operator\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    a: { default: 12, label: 'Operand a (int)' },
    b: { default: 4, label: 'Operand b (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const a = Number(vars?.a ?? 12);
    const b = Number(vars?.b ?? 4);
    const prod = a * b;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare inputs: int a = ${a}, b = ${b}.`,
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
        explanationEnglish: "Declare char op = '*' [1 Byte].",
        explanationHinglish: "char op = '*' memory me store hua.",
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, op: "'*' [1B]" },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'op', value: "'*'" }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: "switch(op): Matches char '*' with case '*'.",
        explanationHinglish: "switch ne case '*' match kiya.",
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, op: "'*' [1B]" },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'op',
          variableValue: "'*'",
          condition: "== case '*'",
          result: true
        }
      },
      {
        step: 4, lineNum: 8,
        explanationEnglish: `Calculate product: ${a} * ${b} = ${prod} and print "Product: ${prod}".`,
        explanationHinglish: `Product calculate hua: ${a} * ${b} = ${prod}.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, op: "'*' [1B]" },
        consoleOutput: `Product: ${prod}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: `Product: ${prod}` }
      }
    ];
  },
  executionSteps: []
};

export const c_switch_vowel: LessonProgram = {
  id: 'c_switch_vowel',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 3,
  friendlyName: 'Vowel Check (Switch Fall-through)',
  learningObjective: 'Learn intentional switch fall-through in C (grouping multiple cases together).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\'%c\' is a VOWEL\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"\'%c\' is a CONSONANT\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Declare char ch = 'o' [1 Byte].",
      explanationHinglish: "char ch = 'o' memory me store hua.",
      memorySnapshot: { ch: "'o' [1B]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: "'o'" }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "switch(ch): Matches 'o'. Since cases 'a', 'e', 'i', 'o', 'u' share one execution block without breaks, it falls through to line 6.",
      explanationHinglish: "switch ne case 'o' match kiya. Yaha fall-through hoke single shared code block execute hua.",
      memorySnapshot: { ch: "'o' [1B]" },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        variableName: 'ch',
        variableValue: "'o'",
        condition: "falls through ('a'|'e'|'i'|'o'|'u')",
        result: true
      }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: "printf outputs \"'o' is a VOWEL\" and break exits the switch block.",
      explanationHinglish: "printf se \"'o' is a VOWEL\" display hua.",
      memorySnapshot: { ch: "'o' [1B]" },
      consoleOutput: "'o' is a VOWEL",
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: "'o' is a VOWEL" }
    }
  ],
  executionSteps: []
};

export const c_switch_month: LessonProgram = {
  id: 'c_switch_month',
  language: 'c',
  topic: 'switch_case',
  lessonNumber: 4,
  friendlyName: 'Month Days Counter (Switch Case)',
  learningObjective: 'Determine days in a month (31, 30, or 28/29 days) using switch cases in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'month' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'month' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'month' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"28 or 29 days\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '9' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '11' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"30 days\\n"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"31 days\\n"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {
    month: { default: 4, min: 1, max: 12, label: 'Month (1-12)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const month = Number(vars?.month ?? 4);
    const resultText = month === 2 ? '28 or 29 days' : [4, 6, 9, 11].includes(month) ? '30 days' : '31 days';
    const targetLine = month === 2 ? 5 : [4, 6, 9, 11].includes(month) ? 7 : 8;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int month = ${month} [4 Bytes].`,
        explanationHinglish: `Integer month = ${month} memory me store hua.`,
        memorySnapshot: { month: `${month} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'month', value: month }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `switch(month): Jump table matches month ${month}.`,
        explanationHinglish: `switch(month) ne case ${month} match kiya.`,
        memorySnapshot: { month: `${month} [4B]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          variableName: 'month',
          variableValue: month,
          condition: `matched group for month ${month}`,
          result: true
        }
      },
      {
        step: 3, lineNum: targetLine,
        explanationEnglish: `Executed matching case: printf outputs "${resultText}".`,
        explanationHinglish: `printf se "${resultText}" print hua.`,
        memorySnapshot: { month: `${month} [4B]` },
        consoleOutput: resultText,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'printf', outputValue: resultText }
      }
    ];
  },
  executionSteps: []
};



export const c_for_sum: LessonProgram = {
  id: 'c_for_sum',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 1,
  friendlyName: 'For Sum in C',
  learningObjective: 'Learn For Sum execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"For Sum: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for For Sum.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `For Sum: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_multiplication_table: LessonProgram = {
  id: 'c_multiplication_table',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 1,
  friendlyName: 'Multiplication Table in C',
  learningObjective: 'Learn Multiplication Table execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Multiplication Table: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Multiplication Table.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Multiplication Table: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_even_numbers: LessonProgram = {
  id: 'c_even_numbers',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 1,
  friendlyName: 'Even Numbers in C',
  learningObjective: 'Learn Even Numbers execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Even Numbers: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Even Numbers.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Even Numbers: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_fibonacci: LessonProgram = {
  id: 'c_fibonacci',
  language: 'c',
  topic: 'for_loop',
  lessonNumber: 1,
  friendlyName: 'Fibonacci in C',
  learningObjective: 'Learn Fibonacci execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fibonacci: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Fibonacci.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Fibonacci: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_while_basic: LessonProgram = {
  id: 'c_while_basic',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 1,
  friendlyName: 'While Basic in C',
  learningObjective: 'Learn While Basic execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"While Basic: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for While Basic.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `While Basic: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_digit_sum: LessonProgram = {
  id: 'c_digit_sum',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 1,
  friendlyName: 'Digit Sum in C',
  learningObjective: 'Learn Digit Sum execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Digit Sum: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Digit Sum.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Digit Sum: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_factorial: LessonProgram = {
  id: 'c_factorial',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 1,
  friendlyName: 'Factorial in C',
  learningObjective: 'Learn Factorial execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Factorial: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Factorial.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Factorial: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_reverse_num: LessonProgram = {
  id: 'c_reverse_num',
  language: 'c',
  topic: 'while_loop',
  lessonNumber: 1,
  friendlyName: 'Reverse Num in C',
  learningObjective: 'Learn Reverse Num execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reverse Num: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Reverse Num.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Reverse Num: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_do_while_basic: LessonProgram = {
  id: 'c_do_while_basic',
  language: 'c',
  topic: 'do_while_loop',
  lessonNumber: 1,
  friendlyName: 'Do While Basic in C',
  learningObjective: 'Learn Do While Basic execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Do While Basic: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Do While Basic.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Do While Basic: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_do_while_sum: LessonProgram = {
  id: 'c_do_while_sum',
  language: 'c',
  topic: 'do_while_loop',
  lessonNumber: 1,
  friendlyName: 'Do While Sum in C',
  learningObjective: 'Learn Do While Sum execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Do While Sum: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Do While Sum.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Do While Sum: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_string_length: LessonProgram = {
  id: 'c_string_length',
  language: 'c',
  topic: 'strings',
  lessonNumber: 1,
  friendlyName: 'String Length in C',
  learningObjective: 'Learn String Length execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"String Length: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for String Length.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `String Length: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_string_copy: LessonProgram = {
  id: 'c_string_copy',
  language: 'c',
  topic: 'strings',
  lessonNumber: 1,
  friendlyName: 'String Copy in C',
  learningObjective: 'Learn String Copy execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"String Copy: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for String Copy.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `String Copy: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_string_reverse: LessonProgram = {
  id: 'c_string_reverse',
  language: 'c',
  topic: 'strings',
  lessonNumber: 1,
  friendlyName: 'String Reverse in C',
  learningObjective: 'Learn String Reverse execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"String Reverse: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for String Reverse.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `String Reverse: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_functions: LessonProgram = {
  id: 'c_functions',
  language: 'c',
  topic: 'functions',
  lessonNumber: 1,
  friendlyName: 'Functions in C',
  learningObjective: 'Learn Functions execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Functions: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Functions.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Functions: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_func_addition: LessonProgram = {
  id: 'c_func_addition',
  language: 'c',
  topic: 'variables',
  lessonNumber: 1,
  friendlyName: 'Funaddition in C',
  learningObjective: 'Learn Funaddition execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Funaddition: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Funaddition.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Funaddition: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_func_call_by_val: LessonProgram = {
  id: 'c_func_call_by_val',
  language: 'c',
  topic: 'variables',
  lessonNumber: 1,
  friendlyName: 'Funcall By Val in C',
  learningObjective: 'Learn Funcall By Val execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Funcall By Val: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Funcall By Val.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Funcall By Val: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_array_sum: LessonProgram = {
  id: 'c_array_sum',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 1,
  friendlyName: 'Array Sum in C',
  learningObjective: 'Learn Array Sum execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Array Sum: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Array Sum.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Array Sum: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_array_max: LessonProgram = {
  id: 'c_array_max',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 1,
  friendlyName: 'Array Max in C',
  learningObjective: 'Learn Array Max execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Array Max: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Array Max.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Array Max: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const c_linear_search: LessonProgram = {
  id: 'c_linear_search',
  language: 'c',
  topic: 'arrays_1d',
  lessonNumber: 1,
  friendlyName: 'Linear Search in C',
  learningObjective: 'Learn Linear Search execution logic and memory tracking in C.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: '#include' }, { type: 'text', value: ' ' }, { type: 'string', value: '<stdio.h>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'printf' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Linear Search: %d\\n"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'return' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'punctuation', value: '}' }] }
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize C variable val = 10 [4 Bytes].`,
        explanationHinglish: `val = 10 memory me store hua.`,
        memorySnapshot: { val: '10 [4B]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'val', value: '10' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `printf prints output for Linear Search.`,
        explanationHinglish: `printf output display hua.`,
        memorySnapshot: { val: '10 [4B]' },
        consoleOutput: `Linear Search: 10`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'val', outputValue: '10' }
      }
  ],
  executionSteps: []
};


export const cLessons: Record<string, LessonProgram> = {
  c_int: cIntVariable,
  c_float: cFloatVariable,
  c_char: cCharVariable,
  c_swap_temp: c_swap_temp,
  c_swap_no_temp: c_swap_no_temp,
  c_constants: c_constants,
  c_arithmetic: c_arithmetic,
  c_relational_logical: c_relational_logical,
  c_inc_dec: c_inc_dec,
  c_circle_geometry: c_circle_geometry,
  c_temp_converter: c_temp_converter,
  c_scanf_integer: c_scanf_integer,
  c_scanf_float: c_scanf_float,
  c_scanf_string: c_scanf_string,
  c_implicit_casting: c_implicit_casting,
  c_explicit_casting: c_explicit_casting,
  c_char_ascii: c_char_ascii,
  c_even_odd: c_even_odd,
  c_largest_three: c_largest_three,
  c_leap_year: c_leap_year,
  c_vowel_consonant: c_vowel_consonant,
  c_marks_grade: c_marks_grade,
  c_tax_calc: c_tax_calc,
  c_pos_neg_zero: c_pos_neg_zero,
  c_electricity_bill: c_electricity_bill,
  c_switch_day: c_switch_day,
  c_switch_calc: c_switch_calc,
  c_switch_vowel: c_switch_vowel,
  c_switch_month: c_switch_month,
  c_for_sum: c_for_sum,
  c_multiplication_table: c_multiplication_table,
  c_even_numbers: c_even_numbers,
  c_fibonacci: c_fibonacci,
  c_while_basic: c_while_basic,
  c_digit_sum: c_digit_sum,
  c_factorial: c_factorial,
  c_reverse_num: c_reverse_num,
  c_do_while_basic: c_do_while_basic,
  c_do_while_sum: c_do_while_sum,
  c_string_length: c_string_length,
  c_string_copy: c_string_copy,
  c_string_reverse: c_string_reverse,
  c_functions: c_functions,
  c_func_addition: c_func_addition,
  c_func_call_by_val: c_func_call_by_val,
  c_array_sum: c_array_sum,
  c_array_max: c_array_max,
  c_linear_search: c_linear_search,
};
