import type { LessonProgram, ExecutionStep, TokenType } from '../types';

// Helper to make simple C++ lesson program with custom code, variables, and steps
function createCppLesson(
  id: string,
  topic: string,
  lessonNumber: number,
  friendlyName: string,
  learningObjective: string,
  lines: Array<{ lineNum: number; tokens: Array<{ type: TokenType; value: string; paramId?: string }> }>,
  editableVariables: Record<string, any>,
  stepGenerator: (vars: Record<string, any>) => ExecutionStep[]
): LessonProgram {
  return {
    id,
    language: 'cpp',
    topic,
    lessonNumber,
    friendlyName,
    learningObjective,
    lines,
    editableVariables,
    generateSteps: stepGenerator,
    executionSteps: []
  };
}

// ─── TOPIC 01: VARIABLES & MEMORY (4 Programs) ─────────────────────────────────

export const cpp_types = createCppLesson(
  'cpp_types', 'variables', 1,
  'C++ Primitive Data Types (int, float, double, bool, char)',
  'Learn C++ strongly-typed variable declarations and explicit memory storage.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'count' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'count' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'gpa' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '3.8500f', paramId: 'gpa' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'double' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'salary' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '1250.7500', paramId: 'salary' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'bool' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'isPassed' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'true', paramId: 'isPassed' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'char' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'grade' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: "'A'", paramId: 'grade' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Grade: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'grade' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'endl' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { 
    count: { default: 10, label: 'count (int)' }, 
    gpa: { default: 3.85, label: 'gpa (float)' }, 
    salary: { default: 1250.75, label: 'salary (double)' },
    isPassed: { default: 'true', label: 'isPassed (bool)', type: 'text', noQuotes: true },
    grade: { default: 'A', label: 'grade (char)', type: 'text' }
  },
  (vars) => {
    const count = Number(vars.count ?? 10);
    const gpaRaw = Number(vars.gpa ?? 3.85);
    const salaryRaw = Number(vars.salary ?? 1250.75);
    const isPassed = String(vars.isPassed ?? 'true');
    const grade = String(vars.grade ?? 'A').replace(/['"]/g, '');
    
    const gpa = isNaN(gpaRaw) ? '3.8500' : gpaRaw.toFixed(4);
    const salary = isNaN(salaryRaw) ? '1250.7500' : salaryRaw.toFixed(4);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Declare count = ${count} [4B].`, explanationHinglish: `Integer count (${count}) [4 Bytes] memory me allocate hua.`, memorySnapshot: { count: `${count} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'count', value: count } },
      { step: 2, lineNum: 5, explanationEnglish: `Declare gpa = ${gpa}f [4B].`, explanationHinglish: `Float variable gpa (${gpa}) [4 Bytes] store hua.`, memorySnapshot: { count: `${count} [4B]`, gpa: `${gpa} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'gpa', value: gpa } },
      { step: 3, lineNum: 6, explanationEnglish: `Declare salary = ${salary} [8B].`, explanationHinglish: `Double variable salary (${salary}) [8 Bytes] allocate hua.`, memorySnapshot: { count: `${count} [4B]`, gpa: `${gpa} [4B]`, salary: `${salary} [8B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'salary', value: salary } },
      { step: 4, lineNum: 7, explanationEnglish: `Declare isPassed = ${isPassed} [1B].`, explanationHinglish: `Boolean isPassed = ${isPassed} [1 Byte] slot me store hua.`, memorySnapshot: { count: `${count} [4B]`, gpa: `${gpa} [4B]`, salary: `${salary} [8B]`, isPassed: `${isPassed} [1B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'isPassed', value: isPassed } },
      { step: 5, lineNum: 8, explanationEnglish: `Declare grade = '${grade}' [1B].`, explanationHinglish: `Character grade ('${grade}') [1 Byte] memory slot me allocate hua.`, memorySnapshot: { count: `${count} [4B]`, gpa: `${gpa} [4B]`, salary: `${salary} [8B]`, isPassed: `${isPassed} [1B]`, grade: `'${grade}' [1B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'grade', value: `'${grade}'` } },
      { step: 6, lineNum: 9, explanationEnglish: `cout prints output: Grade: ${grade}.`, explanationHinglish: `std::cout se terminal me Grade: ${grade} display hua.`, memorySnapshot: { count: `${count} [4B]`, gpa: `${gpa} [4B]`, salary: `${salary} [8B]`, isPassed: `${isPassed} [1B]`, grade: `'${grade}' [1B]` }, consoleOutput: `Grade: ${grade}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'grade', outputValue: `Grade: ${grade}` } }
    ];
  }
);

export const cpp_swap_temp = createCppLesson(
  'cpp_swap_temp', 'variables', 2,
  'Swap Two Variables (Using Temp)',
  'Understand variable value swapping using a third temporary memory slot in C++.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'a' }, { type: 'punctuation' as const, value: ';' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '20', paramId: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'temp' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'temp' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"a: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '", b: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { a: { default: 10, label: 'a' }, b: { default: 20, label: 'b' } },
  (vars) => {
    const a = Number(vars.a ?? 10);
    const b = Number(vars.b ?? 20);
    return [
      {
        step: 1, lineNum: 4,
        explanationEnglish: `Declare int a = ${a}.`,
        explanationHinglish: `Variable a (${a}) [4 Bytes] memory me allocate hua.`,
        memorySnapshot: { a: `${a} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare int b = ${b}.`,
        explanationHinglish: `Variable b (${b}) [4 Bytes] memory me allocate hua.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `int temp = a (${a}). Copy value of a to temp.`,
        explanationHinglish: `temp variable me a ki value (${a}) store ki.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]`, temp: `${a} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'temp', value: a }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `a = b (${b}). Assign value of b into a.`,
        explanationHinglish: `b (${b}) ki value a me copy hui (a changed from ${a} -> ${b}).`,
        memorySnapshot: { a: `${b} [4B]`, b: `${b} [4B]`, temp: `${a} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'a', oldValue: a, newValue: b }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `b = temp (${a}). Assign value of temp into b. Swapping finished!`,
        explanationHinglish: `temp (${a}) ki value b me store hui -> b = ${a}. Swapping Complete!`,
        memorySnapshot: { a: `${b} [4B]`, b: `${a} [4B]`, temp: `${a} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'b', oldValue: b, newValue: a }
      },
      {
        step: 6, lineNum: 8,
        explanationEnglish: `cout prints swapped values a: ${b}, b: ${a}.`,
        explanationHinglish: `Console par Swapped values display hui: a: ${b}, b: ${a}.`,
        memorySnapshot: { a: `${b} [4B]`, b: `${a} [4B]`, temp: `${a} [4B]` },
        consoleOutput: `a: ${b}, b: ${a}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'cout', outputValue: `a: ${b}, b: ${a}` }
      }
    ];
  }
);

export const cpp_swap_no_temp = createCppLesson(
  'cpp_swap_no_temp', 'variables', 3,
  'Swap Two Variables (Without Temp)',
  'Swap two variables using arithmetic addition and subtraction.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '5', paramId: 'a' }, { type: 'punctuation' as const, value: ';' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '15', paramId: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '+' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '-' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '-' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"a: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '", b: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { a: { default: 5, label: 'a' }, b: { default: 15, label: 'b' } },
  (vars) => {
    const a = Number(vars.a ?? 5);
    const b = Number(vars.b ?? 15);
    const sum = a + b;
    return [
      {
        step: 1, lineNum: 4,
        explanationEnglish: `Declare int a = ${a}.`,
        explanationHinglish: `Variable a (${a}) [4 Bytes] memory me allocate hua.`,
        memorySnapshot: { a: `${a} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare int b = ${b}.`,
        explanationHinglish: `Variable b (${b}) [4 Bytes] memory me allocate hua.`,
        memorySnapshot: { a: `${a} [4B]`, b: `${b} [4B]` },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `a = a + b -> ${a} + ${b} = ${sum}. Calculate sum of both variables.`,
        explanationHinglish: `a = a + b (${a} + ${b} = ${sum}). a me dono variables ka total sum store hua -> ${sum}.`,
        memorySnapshot: { a: `${sum} [4B]`, b: `${b} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'a', oldValue: a, newValue: sum, formula: `a = ${a} + ${b} = ${sum}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `b = a - b -> ${sum} - ${b} = ${a}. Extract original a value into b.`,
        explanationHinglish: `b = a - b (${sum} - ${b} = ${a}). b me original a ki value (${a}) aagayi.`,
        memorySnapshot: { a: `${sum} [4B]`, b: `${a} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'b', oldValue: b, newValue: a, formula: `b = ${sum} - ${b} = ${a}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `a = a - b -> ${sum} - ${a} = ${b}. Extract original b value into a. Swapping Complete!`,
        explanationHinglish: `a = a - b (${sum} - ${a} = ${b}). a me original b ki value (${b}) aagayi. Swapping Complete!`,
        memorySnapshot: { a: `${b} [4B]`, b: `${a} [4B]` },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'a', oldValue: sum, newValue: b, formula: `a = ${sum} - ${a} = ${b}` }
      },
      {
        step: 6, lineNum: 8,
        explanationEnglish: `cout prints swapped values a: ${b}, b: ${a}.`,
        explanationHinglish: `Console par Swapped values display hui: a: ${b}, b: ${a}.`,
        memorySnapshot: { a: `${b} [4B]`, b: `${a} [4B]` },
        consoleOutput: `a: ${b}, b: ${a}`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'cout', outputValue: `a: ${b}, b: ${a}` }
      }
    ];
  }
);

export const cpp_constants = createCppLesson(
  'cpp_constants', 'variables', 4,
  'Constants & Read-only Variables (const)',
  'Learn const qualifier usage for immutable, read-only memory variables in C++.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'const' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'PI' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '3.1416f' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '7.0000f' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'area' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'PI' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '*' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '*' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Area: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'area' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  {},
  () => [
    { step: 1, lineNum: 4, explanationEnglish: 'Declare const float PI = 3.1416f.', explanationHinglish: 'PI read-only constant memory me initialize hua (3.1416).', memorySnapshot: { PI: '3.1416 [const]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'PI', value: '3.1416' } },
    { step: 2, lineNum: 5, explanationEnglish: 'Declare float radius = 7.0000f.', explanationHinglish: 'Float variable radius = 7.0000 memory me store hua.', memorySnapshot: { PI: '3.1416 [const]', radius: '7.0000 [4B]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'radius', value: '7.0000' } },
    { step: 3, lineNum: 6, explanationEnglish: 'Compute area = PI * radius * radius = 153.9384.', explanationHinglish: 'area = 3.1416 * 7.0000 * 7.0000 = 153.9384 calculate hua.', memorySnapshot: { PI: '3.1416 [const]', radius: '7.0000 [4B]', area: '153.9384 [4B]' }, animationEvent: { type: 'COMPUTE', inputs: ['PI', 'radius', 'radius'], operator: '* *', storeIn: 'area', result: '153.9384' } },
    { step: 4, lineNum: 7, explanationEnglish: 'cout prints Area: 153.9384.', explanationHinglish: 'Console pe Area: 153.9384 display hua.', memorySnapshot: { PI: '3.1416 [const]', radius: '7.0000 [4B]', area: '153.9384 [4B]' }, consoleOutput: 'Area: 153.9384', animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: 'Area: 153.9384' } }
  ]
);


export const cpp_arithmetic = createCppLesson(
  'cpp_arithmetic', 'operators', 1,
  'Arithmetic Operators (+, -, *, /, %)',
  'Master C++ arithmetic operator evaluation rules and memory updates.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '17', paramId: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '5', paramId: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'sum' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '+' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'diff' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '-' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'prod' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '*' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'quot' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '/' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'rem' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '%' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { a: { default: 17, label: 'a (int)' }, b: { default: 5, label: 'b (int)' } },
  (vars) => {
    const a = Math.trunc(Number(vars.a ?? 17));
    const b = Math.trunc(Number(vars.b ?? 5));
    const sum = Math.trunc(a + b);
    const diff = Math.trunc(a - b);
    const prod = Math.trunc(a * b);
    const quot = b !== 0 ? Math.trunc(a / b) : 0;
    const rem = b !== 0 ? Math.trunc(a % b) : 0;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize variable a = ${a}.`, explanationHinglish: `Variable a (${a}) [4 Bytes int] memory me allocate hua.`, memorySnapshot: { a: `${a} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a } },
      { step: 2, lineNum: 5, explanationEnglish: `Initialize variable b = ${b}.`, explanationHinglish: `Variable b (${b}) [4 Bytes int] memory me allocate hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b } },
      { step: 3, lineNum: 6, explanationEnglish: `Calculate sum = a + b = ${sum}.`, explanationHinglish: `sum = ${a} + ${b} = ${sum} calculate hokar int memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, sum: `${sum} [int]` }, animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '+', storeIn: 'sum', result: sum } },
      { step: 4, lineNum: 7, explanationEnglish: `Calculate diff = a - b = ${diff}.`, explanationHinglish: `diff = ${a} - ${b} = ${diff} calculate hokar int memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, sum: `${sum} [int]`, diff: `${diff} [int]` }, animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '-', storeIn: 'diff', result: diff } },
      { step: 5, lineNum: 8, explanationEnglish: `Calculate prod = a * b = ${prod}.`, explanationHinglish: `prod = ${a} * ${b} = ${prod} calculate hokar int memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, sum: `${sum} [int]`, diff: `${diff} [int]`, prod: `${prod} [int]` }, animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '*', storeIn: 'prod', result: prod } },
      { step: 6, lineNum: 9, explanationEnglish: `Calculate quot = a / b = ${quot} (Integer Division truncates decimal).`, explanationHinglish: `quot = ${a} / ${b} = ${quot} (C++ int division decimal truncate kar deta hai).`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, sum: `${sum} [int]`, diff: `${diff} [int]`, prod: `${prod} [int]`, quot: `${quot} [int]` }, animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '/', storeIn: 'quot', result: quot } },
      { step: 7, lineNum: 10, explanationEnglish: `Calculate rem = a % b = ${rem}.`, explanationHinglish: `rem = ${a} % ${b} = ${rem} (remainder modulo) int store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, sum: `${sum} [int]`, diff: `${diff} [int]`, prod: `${prod} [int]`, quot: `${quot} [int]`, rem: `${rem} [int]` }, animationEvent: { type: 'COMPUTE', inputs: ['a', 'b'], operator: '%', storeIn: 'rem', result: rem } }
    ];
  }
);


export const cpp_relational_logical = createCppLesson(
  'cpp_relational_logical', 'operators', 2,
  'Relational & Logical Operators (&&, ||, !)',
  'Understand comparison rules and combine conditions with boolean logic.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '20', paramId: 'age' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'bool' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'hasID' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'true', paramId: 'hasID' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'bool' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'canVote' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '18' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '&&' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'hasID' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'bool' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'discount' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '12' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '||' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '60' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { age: { default: 20, label: 'age (int)' }, hasID: { default: 'true', label: 'hasID (bool)', type: 'text', noQuotes: true } },
  (vars) => {
    const age = Number(vars.age ?? 20);
    const hasID = String(vars.hasID ?? 'true') === 'true';
    const canVote = age >= 18 && hasID;
    const discount = age < 12 || age >= 60;
    const hasIDStr = hasID ? 'true' : 'false';
    const canVoteStr = canVote ? 'true' : 'false';
    const discountStr = discount ? 'true' : 'false';

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize age = ${age}.`, explanationHinglish: `Variable age (${age}) memory me allocate hua.`, memorySnapshot: { age: `${age} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'age', value: age } },
      { step: 2, lineNum: 5, explanationEnglish: `Initialize hasID = ${hasIDStr}.`, explanationHinglish: `Boolean hasID (${hasIDStr}) memory me store hua.`, memorySnapshot: { age: `${age} [4B]`, hasID: `${hasIDStr} [1B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'hasID', value: hasIDStr } },
      { step: 3, lineNum: 6, explanationEnglish: `Evaluate canVote = (age >= 18 && hasID) -> (${age} >= 18 && ${hasIDStr}) = ${canVoteStr}.`, explanationHinglish: `canVote (${canVoteStr}) calculate hokar store hua.`, memorySnapshot: { age: `${age} [4B]`, hasID: `${hasIDStr} [1B]`, canVote: `${canVoteStr} [1B]` }, animationEvent: { type: 'COMPUTE', inputs: ['age', '18', 'hasID'], operator: '>= &&', storeIn: 'canVote', result: canVoteStr } },
      { step: 4, lineNum: 7, explanationEnglish: `Evaluate discount = (age < 12 || age >= 60) -> (${age} < 12 || ${age} >= 60) = ${discountStr}.`, explanationHinglish: `discount (${discountStr}) calculate hokar store hua.`, memorySnapshot: { age: `${age} [4B]`, hasID: `${hasIDStr} [1B]`, canVote: `${canVoteStr} [1B]`, discount: `${discountStr} [1B]` }, animationEvent: { type: 'COMPUTE', inputs: ['age', '12', 'age', '60'], operator: '< || >=', storeIn: 'discount', result: discountStr } }
    ];
  }
);


export const cpp_inc_dec = createCppLesson(
  'cpp_inc_dec', 'operators', 3,
  'Pre-increment vs Post-increment (++i vs i++)',
  'Master prefix and postfix increment statements and memory updates.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'x' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '5', paramId: 'x' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'y' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '++' }, { type: 'variable' as const, value: 'x' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'z' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'x' }, { type: 'operator' as const, value: '++' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { x: { default: 5, label: 'x (int)' } },
  (vars) => {
    const startX = Number(vars.x ?? 5);
    const preX = startX + 1;
    const postX = preX + 1;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize x = ${startX}.`, explanationHinglish: `Variable x (${startX}) memory me allocate hua.`, memorySnapshot: { x: `${startX} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'x', value: startX } },
      { step: 2, lineNum: 5, explanationEnglish: `Pre-increment x first: x becomes ${preX}.`, explanationHinglish: `Pehle x ki value increment hokar ${preX} hui.`, memorySnapshot: { x: `${preX} [4B]` }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'x', newValue: preX, oldValue: startX } },
      { step: 3, lineNum: 5, explanationEnglish: `Assign value to y: y = ${preX}.`, explanationHinglish: `y me incremented value (${preX}) store hui.`, memorySnapshot: { x: `${preX} [4B]`, y: `${preX} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'y', value: preX } },
      { step: 4, lineNum: 6, explanationEnglish: `Assign current x to z first: z = ${preX}.`, explanationHinglish: `Pehle z me current x (${preX}) copy hua.`, memorySnapshot: { x: `${preX} [4B]`, y: `${preX} [4B]`, z: `${preX} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'z', value: preX } },
      { step: 5, lineNum: 6, explanationEnglish: `Post-increment x afterwards: x becomes ${postX}.`, explanationHinglish: `Z me value copy karne ke baad x increment hokar ${postX} hua.`, memorySnapshot: { x: `${postX} [4B]`, y: `${preX} [4B]`, z: `${preX} [4B]` }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'x', newValue: postX, oldValue: preX } }
    ];
  }
);


export const cpp_circle_area = createCppLesson(
  'cpp_circle_area', 'user_input', 3,
  'Area of Circle (cin >> radius)',
  'Read circle radius from user input using cin >> and calculate area.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'const' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'PI' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '3.1416f' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cin' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>>' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'area' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'PI' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '*' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '*' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'radius' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Area = "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'area' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'endl' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { radius: { default: 5.0, label: 'radius (float)' } },
  (vars) => {
    const radiusVal = Number(vars.radius ?? 5.0);
    const radius = isNaN(radiusVal) ? 5.0 : radiusVal;
    const PI = 3.1416;
    const area = PI * radius * radius;

    return [
      { step: 1, lineNum: 4, explanationEnglish: 'Declare float variable radius [4 Bytes].', explanationHinglish: 'Float variable radius declare hua.', memorySnapshot: { radius: 'uninitialized' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'radius', value: '?' } },
      { step: 2, lineNum: 5, explanationEnglish: 'Declare constant PI = 3.1416f.', explanationHinglish: 'Constant PI = 3.1416 memory me store hua.', memorySnapshot: { radius: 'uninitialized', PI: '3.1416 [const]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'PI', value: '3.1416' } },
      { step: 3, lineNum: 6, explanationEnglish: `cin >> reads user input radius = ${radius}.`, explanationHinglish: `User input se radius = ${radius} read hokar memory me store hua.`, memorySnapshot: { radius: `${radius.toFixed(2)} [float]`, PI: '3.1416 [const]' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'radius', newValue: radius.toFixed(2), oldValue: '?' } },
      { step: 4, lineNum: 7, explanationEnglish: `Calculate area = PI * radius * radius = ${area.toFixed(2)}.`, explanationHinglish: `area = 3.1416 * ${radius} * ${radius} = ${area.toFixed(2)} store hua.`, memorySnapshot: { radius: `${radius.toFixed(2)} [float]`, PI: '3.1416 [const]', area: `${area.toFixed(2)} [float]` }, animationEvent: { type: 'COMPUTE', inputs: ['PI', 'radius', 'radius'], operator: '* *', storeIn: 'area', result: area.toFixed(2) } },
      { step: 5, lineNum: 8, explanationEnglish: `cout prints Area = ${area.toFixed(2)}.`, explanationHinglish: `Console pe Area = ${area.toFixed(2)} display hua.`, memorySnapshot: { radius: `${radius.toFixed(2)} [float]`, PI: '3.1416 [const]', area: `${area.toFixed(2)} [float]` }, consoleOutput: `Area = ${area.toFixed(2)}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'area', outputValue: `Area = ${area.toFixed(2)}` } }
    ];
  }
);


export const cpp_cin_primitives = createCppLesson(
  'cpp_cin_primitives', 'user_input', 1,
  'Read Primitive Inputs (cin >>)',
  'Demonstrate console input for standard C++ primitives (int, float, char) using std::cin.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'float' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'gpa' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'char' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'grade' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cin' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>>' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age', paramId: 'age' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cin' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>>' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'gpa', paramId: 'gpa' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cin' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>>' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'grade', paramId: 'grade' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Age: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'age' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '", GPA: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'gpa' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '", Grade: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'grade' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  {
    age: { default: 21, label: 'Input Age (int)' },
    gpa: { default: 3.85, label: 'Input GPA (float)' },
    grade: { default: 'A', label: 'Input Grade (char)', type: 'text' }
  },
  (vars) => {
    const age = Number(vars.age ?? 21);
    const gpaRaw = Number(vars.gpa ?? 3.85);
    const grade = String(vars.grade ?? 'A').replace(/['"]/g, '');
    const gpa = isNaN(gpaRaw) ? '3.8500' : gpaRaw.toFixed(4);

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Declare age [4B].`, explanationHinglish: `Variable age memory me declare hua.`, memorySnapshot: {}, animationEvent: { type: 'CREATE_VARIABLE', name: 'age', value: '?' } },
      { step: 2, lineNum: 5, explanationEnglish: `Declare gpa [4B].`, explanationHinglish: `Variable gpa memory me declare hua.`, memorySnapshot: { age: '? [4B]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'gpa', value: '?' } },
      { step: 3, lineNum: 6, explanationEnglish: `Declare grade [1B].`, explanationHinglish: `Variable grade memory me declare hua.`, memorySnapshot: { age: '? [4B]', gpa: '? [4B]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'grade', value: '?' } },
      { step: 4, lineNum: 7, explanationEnglish: `cin reads age = ${age} from console.`, explanationHinglish: `Console se user input age = ${age} read hokar store hua.`, memorySnapshot: { age: `${age} [4B]`, gpa: '? [4B]', grade: '? [1B]' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'age', newValue: age, oldValue: '?' } },
      { step: 5, lineNum: 8, explanationEnglish: `cin reads gpa = ${gpa} from console.`, explanationHinglish: `Console se user input gpa = ${gpa} read hokar store hua.`, memorySnapshot: { age: `${age} [4B]`, gpa: `${gpa} [4B]`, grade: '? [1B]' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'gpa', newValue: gpa, oldValue: '?' } },
      { step: 6, lineNum: 9, explanationEnglish: `cin reads grade = '${grade}' from console.`, explanationHinglish: `Console se user input grade = '${grade}' read hokar store hua.`, memorySnapshot: { age: `${age} [4B]`, gpa: `${gpa} [4B]`, grade: `'${grade}' [1B]` }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'grade', newValue: `'${grade}'`, oldValue: '?' } },
      { step: 7, lineNum: 10, explanationEnglish: `cout prints: Age: ${age}, GPA: ${gpa}, Grade: ${grade}.`, explanationHinglish: `cout terminal me output display karega.`, memorySnapshot: { age: `${age} [4B]`, gpa: `${gpa} [4B]`, grade: `'${grade}' [1B]` }, consoleOutput: `Age: ${age}, GPA: ${gpa}, Grade: ${grade}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'grade', outputValue: `Age: ${age}, GPA: ${gpa}, Grade: ${grade}` } }
    ];
  }
);


export const cpp_cin_strings = createCppLesson(
  'cpp_cin_strings', 'user_input', 2,
  'Read String Inputs (cin vs getline)',
  'Compare reading a single word with cin versus reading a full line with std::getline.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<string>' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'string' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'word' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'variable' as const, value: 'string' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'line' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cin' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '>>' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'word', paramId: 'word' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'getline' }, { type: 'punctuation' as const, value: '(' }, { type: 'function' as const, value: 'cin' }, { type: 'punctuation' as const, value: ',' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'line', paramId: 'line' }, { type: 'punctuation' as const, value: ')' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Word: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'word' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '", Line: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'line' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  {
    word: { default: 'Hello', label: 'Input Word (string)', type: 'text', noQuotes: true },
    line: { default: 'Welcome to FlowTrace', label: 'Input Line (string)', type: 'text', noQuotes: true }
  },
  (vars) => {
    const wordInput = String(vars.word ?? 'Hello').replace(/['"]/g, '');
    const word = wordInput.split(/\s+/)[0] || 'Hello';
    const line = String(vars.line ?? 'Welcome to FlowTrace').replace(/['"]/g, '');

    return [
      { step: 1, lineNum: 5, explanationEnglish: `Declare word variable [string].`, explanationHinglish: `word variable memory me declare hua.`, memorySnapshot: {}, animationEvent: { type: 'CREATE_VARIABLE', name: 'word', value: '""' } },
      { step: 2, lineNum: 6, explanationEnglish: `Declare line variable [string].`, explanationHinglish: `line variable memory me declare hua.`, memorySnapshot: { word: '""' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'line', value: '""' } },
      { step: 3, lineNum: 7, explanationEnglish: `cin >> word reads first word: "${word}".`, explanationHinglish: `cin space se pehle tak ka word ("${word}") read karega.`, memorySnapshot: { word: `"${word}"`, line: '""' }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'word', newValue: `"${word}"`, oldValue: '""' } },
      { step: 4, lineNum: 8, explanationEnglish: `getline(cin, line) reads full line: "${line}".`, explanationHinglish: `getline full text line ("${line}") read karke store karega.`, memorySnapshot: { word: `"${word}"`, line: `"${line}"` }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'line', newValue: `"${line}"`, oldValue: '""' } },
      { step: 5, lineNum: 9, explanationEnglish: `cout prints: Word: ${word}, Line: ${line}.`, explanationHinglish: `cout terminal screen par outputs display karega.`, memorySnapshot: { word: `"${word}"`, line: `"${line}"` }, consoleOutput: `Word: ${word}, Line: ${line}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'line', outputValue: `Word: ${word}, Line: ${line}` } }
    ];
  }
);


export const cpp_implicit_casting = createCppLesson(
  'cpp_implicit_casting', 'type_casting', 1,
  'Implicit Widening Type Casting',
  'Automatic type conversion from smaller int to double without precision loss.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'num' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '15', paramId: 'num' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'double' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'decimal' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'num' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { num: { default: 15, label: 'num (int)' } },
  (vars) => {
    const num = Number(vars.num ?? 15);
    const decimal = num.toFixed(4);

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize num = ${num}.`, explanationHinglish: `Variable num (${num}) [4 Bytes] memory me initialize hua.`, memorySnapshot: { num: `${num} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'num', value: num } },
      { step: 2, lineNum: 5, explanationEnglish: `num is implicitly widened and assigned to decimal = ${decimal}.`, explanationHinglish: `int num (${num}) automatically widening cast hokar double decimal (${decimal}) me copy hua.`, memorySnapshot: { num: `${num} [4B]`, decimal: `${decimal} [8B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'decimal', value: decimal } }
    ];
  }
);


export const cpp_explicit_casting = createCppLesson(
  'cpp_explicit_casting', 'type_casting', 2,
  'Explicit Static Casting (static_cast)',
  'Force explicit type conversion using static_cast operator in C++.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'double' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'price' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '9.8500', paramId: 'price' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'intPrice' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'static_cast' }, { type: 'operator' as const, value: '<' }, { type: 'keyword' as const, value: 'int' }, { type: 'operator' as const, value: '>' }, { type: 'punctuation' as const, value: '(' }, { type: 'variable' as const, value: 'price' }, { type: 'punctuation' as const, value: ')' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { price: { default: 9.85, label: 'price (double)' } },
  (vars) => {
    const priceRaw = Number(vars.price ?? 9.85);
    const price = isNaN(priceRaw) ? '9.8500' : priceRaw.toFixed(4);
    const intPrice = isNaN(priceRaw) ? 9 : Math.floor(priceRaw);

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize price = ${price}.`, explanationHinglish: `Variable price (${price}) [8 Bytes] memory me store hua.`, memorySnapshot: { price: `${price} [8B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'price', value: price } },
      { step: 2, lineNum: 5, explanationEnglish: `Convert price explicitly using static_cast<int>(price) = ${intPrice}.`, explanationHinglish: `static_cast se double value ko int (${intPrice}) me explicitly convert kiya (fractional part truncate hua).`, memorySnapshot: { price: `${price} [8B]`, intPrice: `${intPrice} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'intPrice', value: intPrice } }
    ];
  }
);


export const cpp_char_ascii = createCppLesson(
  'cpp_char_ascii', 'type_casting', 3,
  'Char to ASCII Integer Code Conversion',
  'Convert single characters to their 1-byte ASCII integer value representation.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'char' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'ch' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: "'A'", paramId: 'ch' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'ascii' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'static_cast' }, { type: 'operator' as const, value: '<' }, { type: 'keyword' as const, value: 'int' }, { type: 'operator' as const, value: '>' }, { type: 'punctuation' as const, value: '(' }, { type: 'variable' as const, value: 'ch' }, { type: 'punctuation' as const, value: ')' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { ch: { default: 'A', label: 'ch (char)', type: 'text' } },
  (vars) => {
    const rawCh = String(vars.ch ?? 'A').replace(/['"]/g, '');
    const ch = rawCh ? rawCh[0] : 'A';
    const ascii = ch.charCodeAt(0);

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize ch = '${ch}' [1B].`, explanationHinglish: `Variable ch ('${ch}') [1 Byte] memory me allocate hua.`, memorySnapshot: { ch: `'${ch}' [1B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'ch', value: `'${ch}'` } },
      { step: 2, lineNum: 5, explanationEnglish: `Explicitly cast ch to int: ascii = ${ascii}.`, explanationHinglish: `static_cast se char '${ch}' ki ASCII numerical value (${ascii}) read hokar ascii variable me store hui.`, memorySnapshot: { ch: `'${ch}' [1B]`, ascii: `${ascii} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'ascii', value: ascii } }
    ];
  }
);


export const cpp_if_else = createCppLesson(
  'cpp_if_else', 'if_else', 1,
  'Max of Two Numbers (if-else)',
  'Compare two integers and print the larger one using if-else branching.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '25', paramId: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '15', paramId: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'a' }, { type: 'operator' as const, value: ' > ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Max = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Max = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { a: { default: 25, label: 'a (int)' }, b: { default: 15, label: 'b (int)' } },
  (vars) => {
    const a = Math.trunc(Number(vars.a ?? 25));
    const b = Math.trunc(Number(vars.b ?? 15));
    const condResult = a > b;
    const maxVal = condResult ? a : b;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize a = ${a}.`, explanationHinglish: `Variable a = ${a} [4B int] memory me store hua.`, memorySnapshot: { a: `${a} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a } },
      { step: 2, lineNum: 5, explanationEnglish: `Initialize b = ${b}.`, explanationHinglish: `Variable b = ${b} [4B int] memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b } },
      { step: 3, lineNum: 6, explanationEnglish: `Evaluate condition: a > b → ${a} > ${b} → ${condResult}.`, explanationHinglish: `if condition: ${a} > ${b} evaluate hua → ${condResult ? 'true (if block execute hoga)' : 'false (else block execute hoga)'}.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['a', 'b'], operator: '>', result: String(condResult), storeIn: 'Condition' } },
      { step: 4, lineNum: condResult ? 7 : 9, explanationEnglish: `cout prints: Max = ${maxVal}.`, explanationHinglish: `cout output: Max = ${maxVal} terminal par print hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]` }, consoleOutput: `Max = ${maxVal}`, animationEvent: { type: 'PRINT_VALUE', variableName: condResult ? 'a' : 'b', outputValue: maxVal } },
    ];
  }
);


export const cpp_even_odd = createCppLesson(
  'cpp_even_odd', 'if_else', 2,
  'Even or Odd Number Checker',
  'Determine parity of a number using modulo operator and if-else branching.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '8', paramId: 'n' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '%' }, { type: 'text' as const, value: ' 2 == 0) {' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is Even"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is Odd"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { n: { default: 8, label: 'n (int)' } },
  (vars) => {
    const n = Math.trunc(Number(vars.n ?? 8));
    const remainder = Math.abs(n % 2);
    const isEven = remainder === 0;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize n = ${n}.`, explanationHinglish: `Variable n = ${n} [4B int] memory me store hua.`, memorySnapshot: { n: `${n} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n } },
      { step: 2, lineNum: 5, explanationEnglish: `Evaluate condition: n % 2 == 0 → ${n} % 2 = ${remainder} → ${isEven}.`, explanationHinglish: `if condition: ${n} % 2 = ${remainder} evaluate hua → ${isEven ? 'true (Even branch chalega)' : 'false (Odd branch chalega)'}.`, memorySnapshot: { n: `${n} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '% 2', result: remainder, storeIn: 'Condition' } },
      { step: 3, lineNum: isEven ? 6 : 8, explanationEnglish: `cout prints: ${n} is ${isEven ? 'Even' : 'Odd'}.`, explanationHinglish: `cout output: "${n} is ${isEven ? 'Even' : 'Odd'}" terminal par print hua.`, memorySnapshot: { n: `${n} [int]` }, consoleOutput: `${n} is ${isEven ? 'Even' : 'Odd'}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'n', outputValue: `${n} is ${isEven ? 'Even' : 'Odd'}` } },
    ];
  }
);


export const cpp_largest_three = createCppLesson(
  'cpp_largest_three', 'if_else', 3,
  'Largest of Three Numbers',
  'Use nested if-else with logical AND to find the greatest among three integers.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '12', paramId: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '45', paramId: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'c' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '29', paramId: 'c' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' >= ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' && ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' >= ' }, { type: 'variable' as const, value: 'c' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Largest = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' >= ' }, { type: 'variable' as const, value: 'c' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Largest = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Largest = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'c' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 14, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { a: { default: 12, label: 'a (int)' }, b: { default: 45, label: 'b (int)' }, c: { default: 29, label: 'c (int)' } },
  (vars) => {
    const a = Math.trunc(Number(vars.a ?? 12));
    const b = Math.trunc(Number(vars.b ?? 45));
    const c = Math.trunc(Number(vars.c ?? 29));
    const cond1 = a >= b && a >= c;
    const cond2 = b >= c;
    const largest = cond1 ? a : cond2 ? b : c;
    const branch = cond1 ? 8 : cond2 ? 10 : 12;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize variable a = ${a}.`, explanationHinglish: `Pehla variable a = ${a} [int] memory me store hua.`, memorySnapshot: { a: `${a} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a } },
      { step: 2, lineNum: 5, explanationEnglish: `Initialize variable b = ${b}.`, explanationHinglish: `Doosra variable b = ${b} [int] memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b } },
      { step: 3, lineNum: 6, explanationEnglish: `Initialize variable c = ${c}.`, explanationHinglish: `Teesra variable c = ${c} [int] memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'c', value: c } },
      { step: 4, lineNum: 7, explanationEnglish: `Check if a >= b && a >= c → ${a} >= ${b} && ${a} >= ${c} → ${cond1}.`, explanationHinglish: `1st if condition: a>=${b} AND a>=${c} → ${cond1 ? 'true (a sabse bada hai)' : 'false (agla condition check hoga)'}.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['a', 'b', 'c'], operator: '>= && >=', result: String(cond1), storeIn: 'Condition' } },
      ...(!cond1 ? [{ step: 5, lineNum: 9, explanationEnglish: `Check if b >= c → ${b} >= ${c} → ${cond2}.`, explanationHinglish: `else-if condition: b>=${c} → ${cond2 ? 'true (b sabse bada hai)' : 'false (c sabse bada hai)'}.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['b', 'c'], operator: '>=', result: String(cond2), storeIn: 'Condition' } }] : []),
      { step: !cond1 ? 6 : 5, lineNum: branch, explanationEnglish: `cout prints: Largest = ${largest}.`, explanationHinglish: `cout output: "Largest = ${largest}" terminal par print hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]` }, consoleOutput: `Largest = ${largest}`, animationEvent: { type: 'PRINT_VALUE', variableName: cond1 ? 'a' : cond2 ? 'b' : 'c', outputValue: largest } },
    ];
  }
);


export const cpp_leap_year = createCppLesson(
  'cpp_leap_year', 'if_else', 4,
  'Leap Year Checker',
  'Evaluate divisibility by 4, 100, 400 to determine if a year is a leap year.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'year' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '2024', paramId: 'year' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' ((' }, { type: 'variable' as const, value: 'year' }, { type: 'text' as const, value: ' % 4 == 0 && ' }, { type: 'variable' as const, value: 'year' }, { type: 'text' as const, value: ' % 100 != 0) ||' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '        (' }, { type: 'variable' as const, value: 'year' }, { type: 'text' as const, value: ' % 400 == 0)) {' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'year' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is a Leap Year"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'year' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is Not a Leap Year"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { year: { default: 2024, label: 'year (int)' } },
  (vars) => {
    const year = Math.trunc(Number(vars.year ?? 2024));
    const div4    = year % 4 === 0;
    const div100  = year % 100 === 0;
    const div400  = year % 400 === 0;
    const isLeap  = (div4 && !div100) || div400;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize year = ${year}.`, explanationHinglish: `Variable year = ${year} [4B int] memory me store hua.`, memorySnapshot: { year: `${year} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'year', value: year } },
      { step: 2, lineNum: 5, explanationEnglish: `Evaluate: (${year} % 4==0 && ${year} % 100!=0) → (${div4} && ${!div100}) → ${div4 && !div100}.`, explanationHinglish: `Pehla part: year%4==0 AND year%100!=0 → (${div4} AND ${!div100}) → ${div4 && !div100}.`, memorySnapshot: { year: `${year} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['year'], operator: '%4==0 && %100!=0', result: String(div4 && !div100), storeIn: 'Condition' } },
      { step: 3, lineNum: 6, explanationEnglish: `Evaluate: ${year} % 400 == 0 → ${div400}. Full condition → ${isLeap}.`, explanationHinglish: `Doosra part: year%400==0 → ${div400}. Pura condition: ${isLeap ? 'true (Leap Year hai)' : 'false (Leap Year nahi hai)'}.`, memorySnapshot: { year: `${year} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['year'], operator: '%400==0', result: String(div400), storeIn: 'Condition' } },
      { step: 4, lineNum: isLeap ? 7 : 9, explanationEnglish: `cout prints: ${year} is ${isLeap ? '' : 'Not '}a Leap Year.`, explanationHinglish: `cout output: "${year} is ${isLeap ? '' : 'Not '}a Leap Year" terminal par print hua.`, memorySnapshot: { year: `${year} [int]` }, consoleOutput: `${year} is ${isLeap ? '' : 'Not '}a Leap Year`, animationEvent: { type: 'PRINT_VALUE', variableName: 'year', outputValue: `${year} is ${isLeap ? '' : 'Not '}a Leap Year` } },
    ];
  }
);


export const cpp_marks_grade = createCppLesson(
  'cpp_marks_grade', 'if_elif_else', 1,
  'Student Grade System (If-Else Ladder)',
  'Assign letter grades using a multi-tier if-else-if ladder based on marks.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'marks' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '85', paramId: 'marks' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'marks' }, { type: 'text' as const, value: ' >= 90) {' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Grade: A+"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'marks' }, { type: 'text' as const, value: ' >= 80) {' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Grade: A"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'marks' }, { type: 'text' as const, value: ' >= 70) {' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Grade: B"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'marks' }, { type: 'text' as const, value: ' >= 60) {' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Grade: C"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 14, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Grade: F"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 15, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 16, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 17, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { marks: { default: 85, label: 'marks (int, 0-100)' } },
  (vars) => {
    const marks = Math.min(100, Math.max(0, Number(vars.marks ?? 85)));
    const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B' : marks >= 60 ? 'C' : 'F';
    const printLine = marks >= 90 ? 6 : marks >= 80 ? 8 : marks >= 70 ? 10 : marks >= 60 ? 12 : 14;

    const steps: any[] = [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize marks = ${marks}.`, explanationHinglish: `Variable marks = ${marks} [4B] memory me store hua.`, memorySnapshot: { marks: `${marks} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'marks', value: marks } },
      { step: 2, lineNum: 5, explanationEnglish: `Check marks >= 90 → ${marks} >= 90 → ${marks >= 90}.`, explanationHinglish: `if (marks >= 90): ${marks} >= 90 → ${marks >= 90 ? 'true → Grade A+' : 'false → agla check'}.`, memorySnapshot: { marks: `${marks} [4B]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['marks'], operator: '>= 90', result: String(marks >= 90), storeIn: 'Condition' } },
    ];
    if (marks < 90) steps.push({ step: 3, lineNum: 7, explanationEnglish: `Check marks >= 80 → ${marks} >= 80 → ${marks >= 80}.`, explanationHinglish: `else if (marks >= 80): ${marks} >= 80 → ${marks >= 80 ? 'true → Grade A' : 'false → agla check'}.`, memorySnapshot: { marks: `${marks} [4B]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['marks'], operator: '>= 80', result: String(marks >= 80), storeIn: 'Condition' } });
    if (marks < 80) steps.push({ step: 4, lineNum: 9, explanationEnglish: `Check marks >= 70 → ${marks} >= 70 → ${marks >= 70}.`, explanationHinglish: `else if (marks >= 70): ${marks} >= 70 → ${marks >= 70 ? 'true → Grade B' : 'false → agla check'}.`, memorySnapshot: { marks: `${marks} [4B]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['marks'], operator: '>= 70', result: String(marks >= 70), storeIn: 'Condition' } });
    if (marks < 70) steps.push({ step: 5, lineNum: 11, explanationEnglish: `Check marks >= 60 → ${marks} >= 60 → ${marks >= 60}.`, explanationHinglish: `else if (marks >= 60): ${marks} >= 60 → ${marks >= 60 ? 'true → Grade C' : 'false → Grade F'}.`, memorySnapshot: { marks: `${marks} [4B]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['marks'], operator: '>= 60', result: String(marks >= 60), storeIn: 'Condition' } });
    steps.push({ step: steps.length + 1, lineNum: printLine, explanationEnglish: `cout prints: Grade: ${grade}.`, explanationHinglish: `cout output: "Grade: ${grade}" terminal par print hua.`, memorySnapshot: { marks: `${marks} [4B]` }, consoleOutput: `Grade: ${grade}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'marks', outputValue: `Grade: ${grade}` } });
    return steps;
  }
);


export const cpp_tax_calc = createCppLesson(
  'cpp_tax_calc', 'if_elif_else', 2,
  'Income Tax Slab Calculator',
  'Calculate income tax using tiered slab rates with if-else-if ladder.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '600000', paramId: 'income' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'double' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'tax' }, { type: 'text' as const, value: ' = 0;' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' <= 250000) {' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'tax' }, { type: 'text' as const, value: ' = 0;' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' <= 500000) {' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'tax' }, { type: 'text' as const, value: ' = (' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' - 250000) * 0.05;' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' <= 1000000) {' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'tax' }, { type: 'text' as const, value: ' = 12500 + (' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' - 500000) * 0.20;' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 13, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'tax' }, { type: 'text' as const, value: ' = 112500 + (' }, { type: 'variable' as const, value: 'income' }, { type: 'text' as const, value: ' - 1000000) * 0.30;' }] },
    { lineNum: 14, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 15, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Tax = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'tax' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 16, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 17, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { income: { default: 600000, label: 'income (int)' } },
  (vars: Record<string, any>) => {
    const income = Math.trunc(Number(vars.income ?? 600000));
    let tax = 0;
    let taxLine = 7;
    let formulaStr = '';

    if (income <= 250000) {
      tax = 0;
      taxLine = 7;
      formulaStr = '0 (Slab 1: Below 2.5L)';
    } else if (income <= 500000) {
      tax = (income - 250000) * 0.05;
      taxLine = 9;
      formulaStr = `(${income} - 250000) * 0.05 = ${tax.toFixed(2)}`;
    } else if (income <= 1000000) {
      tax = 12500 + (income - 500000) * 0.20;
      taxLine = 11;
      formulaStr = `12500 + (${income} - 500000) * 0.20 = ${tax.toFixed(2)}`;
    } else {
      tax = 112500 + (income - 1000000) * 0.30;
      taxLine = 13;
      formulaStr = `112500 + (${income} - 1000000) * 0.30 = ${tax.toFixed(2)}`;
    }
    const taxStr = tax.toFixed(2);

    const steps: any[] = [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize income = ${income}.`, explanationHinglish: `Variable income = ${income} [int] memory me store hua.`, memorySnapshot: { income: `${income} [int]`, tax: '0.00 [double]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'income', value: income } },
      { step: 2, lineNum: 5, explanationEnglish: 'Initialize double tax = 0.00.', explanationHinglish: 'Double variable tax = 0.00 [double] initialize hua.', memorySnapshot: { income: `${income} [int]`, tax: '0.00 [double]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'tax', value: '0.00' } },
      { step: 3, lineNum: 6, explanationEnglish: `Check if income <= 250000 → ${income} <= 250000 → ${income <= 250000}.`, explanationHinglish: `1st Slab check: ${income} <= 250000 → ${income <= 250000 ? 'true (No Tax)' : 'false (agla slab check होगा)'}.`, memorySnapshot: { income: `${income} [int]`, tax: '0.00 [double]' }, animationEvent: { type: 'COMPUTE' as const, inputs: ['income'], operator: '<= 250000', result: String(income <= 250000), storeIn: 'Condition' } },
    ];

    if (income > 250000) {
      steps.push({ step: steps.length + 1, lineNum: 8, explanationEnglish: `Check if income <= 500000 → ${income} <= 500000 → ${income <= 500000}.`, explanationHinglish: `2nd Slab check: ${income} <= 500000 → ${income <= 500000 ? 'true (5% Slab apply होगा)' : 'false (agla slab check होगा)'}.`, memorySnapshot: { income: `${income} [int]`, tax: '0.00 [double]' }, animationEvent: { type: 'COMPUTE' as const, inputs: ['income'], operator: '<= 500000', result: String(income <= 500000), storeIn: 'Condition' } });
    }
    if (income > 500000) {
      steps.push({ step: steps.length + 1, lineNum: 10, explanationEnglish: `Check if income <= 1000000 → ${income} <= 1000000 → ${income <= 1000000}.`, explanationHinglish: `3rd Slab check: ${income} <= 1000000 → ${income <= 1000000 ? 'true (20% Slab apply hoga)' : 'false (30% Slab apply hoga)'}.`, memorySnapshot: { income: `${income} [int]`, tax: '0.00 [double]' }, animationEvent: { type: 'COMPUTE' as const, inputs: ['income'], operator: '<= 1000000', result: String(income <= 1000000), storeIn: 'Condition' } });
    }

    // Explicit Calculation Step at exact taxLine
    steps.push({
      step: steps.length + 1,
      lineNum: taxLine,
      explanationEnglish: `Calculate tax: ${formulaStr}.`,
      explanationHinglish: `Tax slab formula apply hua: ${formulaStr}.`,
      memorySnapshot: { income: `${income} [int]`, tax: `${taxStr} [double]` },
      animationEvent: { type: 'COMPUTE' as const, inputs: ['income'], operator: 'tax_formula', result: taxStr, storeIn: 'tax' }
    });

    steps.push({
      step: steps.length + 1,
      lineNum: 15,
      explanationEnglish: `cout prints: Tax = ${taxStr}.`,
      explanationHinglish: `cout output: "Tax = ${taxStr}" terminal par print hua.`,
      memorySnapshot: { income: `${income} [int]`, tax: `${taxStr} [double]` },
      consoleOutput: `Tax = ${taxStr}`,
      animationEvent: { type: 'PRINT_VALUE', variableName: 'tax', outputValue: taxStr }
    });

    return steps;
  }
);


export const cpp_pos_neg_zero = createCppLesson(
  'cpp_pos_neg_zero', 'if_elif_else', 3,
  'Positive, Negative, or Zero Checker',
  'Classify an integer as positive, negative, or zero using if-else-if.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '-15', paramId: 'n' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' > 0) {' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is Positive"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' < 0) {' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'n' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is Negative"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Zero"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { n: { default: -15, label: 'n (int)' } },
  (vars) => {
    const n = Number(vars.n ?? -15);
    const isPos = n > 0;
    const isNeg = n < 0;
    const label = isPos ? 'Positive' : isNeg ? 'Negative' : 'Zero';
    const printLine = isPos ? 6 : isNeg ? 8 : 10;

    const steps: any[] = [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize n = ${n}.`, explanationHinglish: `Variable n = ${n} [4B] memory me store hua.`, memorySnapshot: { n: `${n} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'n', value: n } },
      { step: 2, lineNum: 5, explanationEnglish: `Check n > 0 → ${n} > 0 → ${isPos}.`, explanationHinglish: `if (n > 0): ${n} > 0 → ${isPos ? 'true → Positive hai' : 'false → agla check'}.`, memorySnapshot: { n: `${n} [4B]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '> 0', result: String(isPos), storeIn: 'Condition' } },
    ];
    if (!isPos) steps.push({ step: 3, lineNum: 7, explanationEnglish: `Check n < 0 → ${n} < 0 → ${isNeg}.`, explanationHinglish: `else if (n < 0): ${n} < 0 → ${isNeg ? 'true → Negative hai' : 'false → Zero hai'}.`, memorySnapshot: { n: `${n} [4B]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['n'], operator: '< 0', result: String(isNeg), storeIn: 'Condition' } });
    steps.push({ step: steps.length + 1, lineNum: printLine, explanationEnglish: `cout prints: ${n} is ${label}.`, explanationHinglish: `cout output: "${n} is ${label}" terminal par print hua.`, memorySnapshot: { n: `${n} [4B]` }, consoleOutput: `${n} is ${label}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'n', outputValue: `${n} is ${label}` } });
    return steps;
  }
);


export const cpp_electricity_bill = createCppLesson(
  'cpp_electricity_bill', 'if_elif_else', 4,
  'Tiered Electricity Bill Calculator',
  'Calculate monthly electricity bill using tiered unit slabs with if-else-if.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'units' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '250', paramId: 'units' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'double' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'bill' }, { type: 'text' as const, value: ' = 0;' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'units' }, { type: 'text' as const, value: ' <= 100) {' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'bill' }, { type: 'text' as const, value: ' = ' }, { type: 'variable' as const, value: 'units' }, { type: 'text' as const, value: ' * 3.50;' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else if' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'units' }, { type: 'text' as const, value: ' <= 200) {' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'bill' }, { type: 'text' as const, value: ' = 350 + (' }, { type: 'variable' as const, value: 'units' }, { type: 'text' as const, value: ' - 100) * 5.00;' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    } ' }, { type: 'keyword' as const, value: 'else' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'variable' as const, value: 'bill' }, { type: 'text' as const, value: ' = 850 + (' }, { type: 'variable' as const, value: 'units' }, { type: 'text' as const, value: ' - 200) * 6.50;' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 13, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Bill = "' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'bill' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 14, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { units: { default: 250, label: 'units (int)' } },
  (vars) => {
    const units = Math.max(0, Number(vars.units ?? 250));
    let bill = 0;
    let billLine = 7;
    if (units <= 100) { bill = units * 3.50; billLine = 7; }
    else if (units <= 200) { bill = 350 + (units - 100) * 5.00; billLine = 9; }
    else { bill = 850 + (units - 200) * 6.50; billLine = 11; }
    const billStr = bill.toFixed(2);

    const steps: any[] = [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize units = ${units}.`, explanationHinglish: `Variable units = ${units} [4B] memory me store hua.`, memorySnapshot: { units: `${units} [4B]`, bill: '0 [8B]' }, animationEvent: { type: 'CREATE_VARIABLE', name: 'units', value: units } },
      { step: 2, lineNum: 6, explanationEnglish: `Check units <= 100 → ${units} <= 100 → ${units <= 100}.`, explanationHinglish: `if (units <= 100): ${units <= 100 ? 'true → 3.50/unit slab' : 'false → agla slab check'}.`, memorySnapshot: { units: `${units} [4B]`, bill: '0 [8B]' }, animationEvent: { type: 'COMPUTE' as const, inputs: ['units'], operator: '<= 100', result: String(units <= 100), storeIn: 'Condition' } },
    ];
    if (units > 100) steps.push({ step: 3, lineNum: 8, explanationEnglish: `Check units <= 200 → ${units} <= 200 → ${units <= 200}.`, explanationHinglish: `else if (units <= 200): ${units <= 200 ? 'true → 5.00/unit slab' : 'false → 6.50/unit slab'}.`, memorySnapshot: { units: `${units} [4B]`, bill: '0 [8B]' }, animationEvent: { type: 'COMPUTE' as const, inputs: ['units'], operator: '<= 200', result: String(units <= 200), storeIn: 'Condition' } });
    steps.push({ step: steps.length + 1, lineNum: billLine, explanationEnglish: `Bill computed = ${billStr}.`, explanationHinglish: `Slab formula apply hokar bill = Rs. ${billStr} calculate hua.`, memorySnapshot: { units: `${units} [4B]`, bill: `${billStr} [8B]` }, animationEvent: { type: 'UPDATE_VARIABLE', name: 'bill', newValue: billStr, oldValue: '0' } });
    steps.push({ step: steps.length + 1, lineNum: 13, explanationEnglish: `cout prints: Bill = ${billStr}.`, explanationHinglish: `cout output: "Bill = ${billStr}" terminal par print hua.`, memorySnapshot: { units: `${units} [4B]`, bill: `${billStr} [8B]` }, consoleOutput: `Bill = ${billStr}`, animationEvent: { type: 'PRINT_VALUE', variableName: 'bill', outputValue: billStr } });
    return steps;
  }
);


export const cpp_switch_day = createCppLesson(
  'cpp_switch_day', 'switch_case', 1,
  'Day of Week Switch Case',
  'Demonstrate C++ switch jump table and break statement execution.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'day' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '3', paramId: 'day' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'switch' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'day' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: ' 1: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Monday"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: ' 2: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Tuesday"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: ' 3: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Wednesday"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: ' 4: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Thursday"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: ' 5: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Friday"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'default' }, { type: 'text' as const, value: ': ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Invalid Day"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 13, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { day: { default: 3, label: 'day (int, 1-7)' } },
  (vars: Record<string, any>) => {
    const day = Math.trunc(Number(vars.day ?? 3));
    const dayNames: Record<number, { name: string; line: number }> = {
      1: { name: 'Monday', line: 6 },
      2: { name: 'Tuesday', line: 7 },
      3: { name: 'Wednesday', line: 8 },
      4: { name: 'Thursday', line: 9 },
      5: { name: 'Friday', line: 10 },
    };
    const matched = dayNames[day] ?? { name: 'Invalid Day', line: 11 };

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize day = ${day}.`, explanationHinglish: `Variable day = ${day} [int] memory me store hua.`, memorySnapshot: { day: `${day} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'day', value: day } },
      { step: 2, lineNum: 5, explanationEnglish: `Evaluate switch(day) with value ${day}.`, explanationHinglish: `switch statement value ${day} check kar ke matching case par jump karega.`, memorySnapshot: { day: `${day} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['day'], operator: 'switch', result: String(day), storeIn: 'Match' } },
      { step: 3, lineNum: matched.line, explanationEnglish: `Matched case ${day in dayNames ? day : 'default'} → cout prints "${matched.name}" and breaks.`, explanationHinglish: `Case match hua: "${matched.name}" print hua aur break statement execute hua.`, memorySnapshot: { day: `${day} [int]` }, consoleOutput: matched.name, animationEvent: { type: 'PRINT_VALUE', variableName: 'day', outputValue: matched.name } },
    ];
  }
);


export const cpp_switch_calc = createCppLesson(
  'cpp_switch_calc', 'switch_case', 2,
  'Menu-Driven Arithmetic Calculator',
  'Build char-based menu selector for arithmetic operations (+, -, *, /).',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '10', paramId: 'a' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'b' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '5', paramId: 'b' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'char' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'op' }, { type: 'text' as const, value: ' = ' }, { type: 'string' as const, value: "'+'", paramId: 'op' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'switch' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'op' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: " '+': " }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' + ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: " '-': " }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' - ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: " '*': " }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' * ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'case' }, { type: 'text' as const, value: " '/': " }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'a' }, { type: 'text' as const, value: ' / ' }, { type: 'variable' as const, value: 'b' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'default' }, { type: 'text' as const, value: ': ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Invalid Operator"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 13, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 14, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { a: { default: 10, label: 'a (int)' }, b: { default: 5, label: 'b (int)' }, op: { default: '+', label: 'op (char)', type: 'text' } },
  (vars: Record<string, any>) => {
    const a = Math.trunc(Number(vars.a ?? 10));
    const b = Math.trunc(Number(vars.b ?? 5));
    const rawOp = String(vars.op ?? '+').replace(/['"]/g, '');
    const op = rawOp ? rawOp[0] : '+';

    let result = 0;
    let line = 12;
    if (op === '+') { result = a + b; line = 8; }
    else if (op === '-') { result = a - b; line = 9; }
    else if (op === '*') { result = a * b; line = 10; }
    else if (op === '/') { result = b !== 0 ? Math.trunc(a / b) : 0; line = 11; }

    const outText = line === 12 ? 'Invalid Operator' : `Result = ${result}`;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize a = ${a}.`, explanationHinglish: `Variable a = ${a} [int] memory me store hua.`, memorySnapshot: { a: `${a} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'a', value: a } },
      { step: 2, lineNum: 5, explanationEnglish: `Initialize b = ${b}.`, explanationHinglish: `Variable b = ${b} [int] memory me store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'b', value: b } },
      { step: 3, lineNum: 6, explanationEnglish: `Initialize op = '${op}'.`, explanationHinglish: `Char variable op = '${op}' [char] store hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, op: `'${op}' [char]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'op', value: `'${op}'` } },
      { step: 4, lineNum: 7, explanationEnglish: `Evaluate switch(op) with character '${op}'.`, explanationHinglish: `switch statement char '${op}' check karke target case par execute hoga.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, op: `'${op}' [char]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['op'], operator: 'switch', result: `'${op}'`, storeIn: 'Match' } },
      { step: 5, lineNum: line, explanationEnglish: `Matched case '${op}' → cout prints "${outText}" and breaks.`, explanationHinglish: `Case '${op}' match hua → calculation output "${outText}" print hua.`, memorySnapshot: { a: `${a} [int]`, b: `${b} [int]`, op: `'${op}' [char]` }, consoleOutput: outText, animationEvent: { type: 'PRINT_VALUE', variableName: 'op', outputValue: outText } }
    ];
  }
);


export const cpp_switch_vowel = createCppLesson(
  'cpp_switch_vowel', 'switch_case', 3,
  'Vowel or Consonant Check (Fallthrough)',
  'Demonstrate case fallthrough grouping without break statements.',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'char' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'ch' }, { type: 'text' as const, value: ' = ' }, { type: 'string' as const, value: "'E'", paramId: 'ch' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'switch' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'ch' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: "        case 'a': case 'e': case 'i': case 'o': case 'u':" }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: "        case 'A': case 'E': case 'I': case 'O': case 'U':" }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '            ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'ch' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is a Vowel"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'default' }, { type: 'text' as const, value: ': ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'variable' as const, value: 'ch' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '" is a Consonant"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { ch: { default: 'E', label: 'ch (char)', type: 'text' } },
  (vars: Record<string, any>) => {
    const rawCh = String(vars.ch ?? 'E').replace(/['"]/g, '');
    const ch = rawCh ? rawCh[0] : 'E';
    const isVowel = 'aeiouAEIOU'.includes(ch);
    const outText = `${ch} is a ${isVowel ? 'Vowel' : 'Consonant'}`;

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize ch = '${ch}'.`, explanationHinglish: `Variable ch = '${ch}' [char] memory me store hua.`, memorySnapshot: { ch: `'${ch}' [char]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'ch', value: `'${ch}'` } },
      { step: 2, lineNum: 5, explanationEnglish: `Evaluate switch(ch) with value '${ch}'.`, explanationHinglish: `switch statement value '${ch}' check kar raha hai.`, memorySnapshot: { ch: `'${ch}' [char]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['ch'], operator: 'switch', result: `'${ch}'`, storeIn: 'Match' } },
      { step: 3, lineNum: isVowel ? 8 : 9, explanationEnglish: `Fallthrough match → cout prints "${outText}".`, explanationHinglish: `Case fallthrough match: "${outText}" print hua.`, memorySnapshot: { ch: `'${ch}' [char]` }, consoleOutput: outText, animationEvent: { type: 'PRINT_VALUE', variableName: 'ch', outputValue: outText } }
    ];
  }
);


export const cpp_switch_month = createCppLesson(
  'cpp_switch_month', 'switch_case', 4,
  'Season Finder by Month Number',
  'Group month cases to map seasons (Winter, Spring, Summer, Autumn).',
  [
    { lineNum: 1,  tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: '<iostream>' }] },
    { lineNum: 2,  tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' namespace ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3,  tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'month' }, { type: 'text' as const, value: ' = ' }, { type: 'number' as const, value: '7', paramId: 'month' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5,  tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'switch' }, { type: 'text' as const, value: ' (' }, { type: 'variable' as const, value: 'month' }, { type: 'text' as const, value: ') {' }] },
    { lineNum: 6,  tokens: [{ type: 'text' as const, value: '        case 12: case 1: case 2: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Winter"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7,  tokens: [{ type: 'text' as const, value: '        case 3: case 4: case 5: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Spring"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 8,  tokens: [{ type: 'text' as const, value: '        case 6: case 7: case 8: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Summer"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 9,  tokens: [{ type: 'text' as const, value: '        case 9: case 10: case 11: ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Autumn"' }, { type: 'punctuation' as const, value: '; ' }, { type: 'keyword' as const, value: 'break' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text' as const, value: '        ' }, { type: 'keyword' as const, value: 'default' }, { type: 'text' as const, value: ': ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' << ' }, { type: 'string' as const, value: '"Invalid Month"' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text' as const, value: '    }' }] },
    { lineNum: 12, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' 0;' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { month: { default: 7, label: 'month (int, 1-12)' } },
  (vars: Record<string, any>) => {
    const month = Math.trunc(Number(vars.month ?? 7));
    let season = 'Invalid Month';
    let line = 10;

    if ([12, 1, 2].includes(month)) { season = 'Winter'; line = 6; }
    else if ([3, 4, 5].includes(month)) { season = 'Spring'; line = 7; }
    else if ([6, 7, 8].includes(month)) { season = 'Summer'; line = 8; }
    else if ([9, 10, 11].includes(month)) { season = 'Autumn'; line = 9; }

    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize month = ${month}.`, explanationHinglish: `Variable month = ${month} [int] memory me store hua.`, memorySnapshot: { month: `${month} [int]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'month', value: month } },
      { step: 2, lineNum: 5, explanationEnglish: `Evaluate switch(month) for month ${month}.`, explanationHinglish: `switch statement month ${month} check kar raha hai.`, memorySnapshot: { month: `${month} [int]` }, animationEvent: { type: 'COMPUTE' as const, inputs: ['month'], operator: 'switch', result: String(month), storeIn: 'Match' } },
      { step: 3, lineNum: line, explanationEnglish: `Matched month ${month} → cout prints "${season}".`, explanationHinglish: `Month ${month} match hua → season "${season}" print hua.`, memorySnapshot: { month: `${month} [int]` }, consoleOutput: season, animationEvent: { type: 'PRINT_VALUE', variableName: 'month', outputValue: season } }
    ];
  }
);


export const cpp_for_sum = createCppLesson(
  'cpp_for_sum', 'for_loop', 1,
  'Sum of First N Natural Numbers',
  'For loop counter accumulator.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Sum of First N Natural Numbers: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Sum of 1 to 5 = 15.`, explanationHinglish: `std::cout output display hua: Sum of 1 to 5 = 15.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Sum of 1 to 5 = 15`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_multiplication_table = createCppLesson(
  'cpp_multiplication_table', 'for_loop', 2,
  'Multiplication Table Generator',
  'Loop iteration formatted table.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Multiplication Table Generator: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: 5 x 1 = 5 ... 5 x 10 = 50.`, explanationHinglish: `std::cout output display hua: 5 x 1 = 5 ... 5 x 10 = 50.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `5 x 1 = 5 ... 5 x 10 = 50`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_even_numbers = createCppLesson(
  'cpp_even_numbers', 'for_loop', 3,
  'Print Even Numbers up to N',
  'Loop step increment (i += 2).',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Print Even Numbers up to N: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Even: 2 4 6 8 10.`, explanationHinglish: `std::cout output display hua: Even: 2 4 6 8 10.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Even: 2 4 6 8 10`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_fibonacci = createCppLesson(
  'cpp_fibonacci', 'for_loop', 4,
  'Fibonacci Series Generator (N terms)',
  'Iterative Fibonacci generation.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Fibonacci Series Generator (N terms): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Fibonacci: 0 1 1 2 3 5 8.`, explanationHinglish: `std::cout output display hua: Fibonacci: 0 1 1 2 3 5 8.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Fibonacci: 0 1 1 2 3 5 8`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_while = createCppLesson(
  'cpp_while', 'while_loop', 1,
  'While Loop Accumulator in C++',
  'While loop conditional loop.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"While Loop Accumulator in C++: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Count: 1 2 3.`, explanationHinglish: `std::cout output display hua: Count: 1 2 3.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Count: 1 2 3`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_digit_sum = createCppLesson(
  'cpp_digit_sum', 'while_loop', 2,
  'Sum of Digits (While Loop)',
  'Extract digits with % 10 & / 10.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Sum of Digits (While Loop): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Sum of digits of 432 = 9.`, explanationHinglish: `std::cout output display hua: Sum of digits of 432 = 9.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Sum of digits of 432 = 9`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_factorial = createCppLesson(
  'cpp_factorial', 'while_loop', 3,
  'Factorial Calculation (long long)',
  'Multiplicative factorial sequence.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Factorial Calculation (long long): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: 5! = 120.`, explanationHinglish: `std::cout output display hua: 5! = 120.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `5! = 120`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_reverse_num = createCppLesson(
  'cpp_reverse_num', 'while_loop', 4,
  'Reverse an Integer Number',
  'Reverse integer digits.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Reverse an Integer Number: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Reverse of 1234 is 4321.`, explanationHinglish: `std::cout output display hua: Reverse of 1234 is 4321.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Reverse of 1234 is 4321`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_do_while = createCppLesson(
  'cpp_do_while', 'do_while_loop', 1,
  'Do-While Guaranteed Execution',
  'Exit-controlled guaranteed run.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Do-While Guaranteed Execution: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Executes at least 1 time.`, explanationHinglish: `std::cout output display hua: Executes at least 1 time.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Executes at least 1 time`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_do_while_sum = createCppLesson(
  'cpp_do_while_sum', 'do_while_loop', 2,
  'Accumulator Loop (Do-While)',
  'Do-while accumulator loop.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Accumulator Loop (Do-While): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Sum accumulated = 30.`, explanationHinglish: `std::cout output display hua: Sum accumulated = 30.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Sum accumulated = 30`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_string_concat = createCppLesson(
  'cpp_string_concat', 'strings', 1,
  'String Concatenation & Length (.length())',
  'std::string operations.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"String Concatenation & Length (.length()): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Joined: "Hello World", Len = 11.`, explanationHinglish: `std::cout output display hua: Joined: "Hello World", Len = 11.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Joined: "Hello World", Len = 11`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_string_access = createCppLesson(
  'cpp_string_access', 'strings', 2,
  'String Character Access & Indexing (str[i])',
  'Character indexing in std::string.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"String Character Access & Indexing (str[i]): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: str[0] = "H", str[4] = "o".`, explanationHinglish: `std::cout output display hua: str[0] = "H", str[4] = "o".`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `str[0] = "H", str[4] = "o"`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_string_reverse = createCppLesson(
  'cpp_string_reverse', 'strings', 3,
  'Reverse a String (std::string)',
  'In-place string reversal.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Reverse a String (std::string): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Reversed: "dlroW olleH".`, explanationHinglish: `std::cout output display hua: Reversed: "dlroW olleH".`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Reversed: "dlroW olleH"`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_square_func = createCppLesson(
  'cpp_square_func', 'functions', 1,
  'Square Function in C++',
  'Return values and function call.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Square Function in C++: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: square(6) = 36.`, explanationHinglish: `std::cout output display hua: square(6) = 36.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `square(6) = 36`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_func_addition = createCppLesson(
  'cpp_func_addition', 'functions', 2,
  'Custom Addition Function with Parameters',
  'Function parameters passing.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Custom Addition Function with Parameters: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: add(12, 18) = 30.`, explanationHinglish: `std::cout output display hua: add(12, 18) = 30.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `add(12, 18) = 30`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_func_pass_by_val = createCppLesson(
  'cpp_func_pass_by_val', 'functions', 3,
  'Pass by Value (Parameter Copying)',
  'Pass by value stack copies.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Pass by Value (Parameter Copying): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Caller variable remains 10.`, explanationHinglish: `std::cout output display hua: Caller variable remains 10.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Caller variable remains 10`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_func_pass_by_ref = createCppLesson(
  'cpp_func_pass_by_ref', 'functions', 4,
  'Pass by Reference (int &x)',
  'Reference parameters mutation.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Pass by Reference (int &x): "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Caller variable modified to 50.`, explanationHinglish: `std::cout output display hua: Caller variable modified to 50.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Caller variable modified to 50`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_array_max = createCppLesson(
  'cpp_array_max', 'arrays_1d', 1,
  'Find Maximum Element in C++ Array',
  '1D array linear scan.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Find Maximum Element in C++ Array: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Max element in [45, 89, 12] is 89.`, explanationHinglish: `std::cout output display hua: Max element in [45, 89, 12] is 89.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Max element in [45, 89, 12] is 89`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_array_sum = createCppLesson(
  'cpp_array_sum', 'arrays_1d', 2,
  '1D Array Sum & Average Computation',
  'Array accumulator loop.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"1D Array Sum & Average Computation: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Sum = 150, Avg = 30.0.`, explanationHinglish: `std::cout output display hua: Sum = 150, Avg = 30.0.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Sum = 150, Avg = 30.0`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_linear_search = createCppLesson(
  'cpp_linear_search', 'arrays_1d', 3,
  'Linear Search in 1D Array',
  'Target element array scan.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Linear Search in 1D Array: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Target 25 found at index 2.`, explanationHinglish: `std::cout output display hua: Target 25 found at index 2.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Target 25 found at index 2`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_array_reverse = createCppLesson(
  'cpp_array_reverse', 'arrays_1d', 4,
  'Reverse 1D Array Elements In-place',
  'Two-pointer array reversal.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Reverse 1D Array Elements In-place: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Reversed: [50, 40, 30, 20, 10].`, explanationHinglish: `std::cout output display hua: Reversed: [50, 40, 30, 20, 10].`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Reversed: [50, 40, 30, 20, 10]`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_matrix_2d = createCppLesson(
  'cpp_matrix_2d', 'arrays_2d', 1,
  '2D Matrix Declaration & Traversal',
  'Nested loop 2D grid traversal.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"2D Matrix Declaration & Traversal: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Matrix [2][2] printed.`, explanationHinglish: `std::cout output display hua: Matrix [2][2] printed.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Matrix [2][2] printed`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_diagonal_sum_2d = createCppLesson(
  'cpp_diagonal_sum_2d', 'arrays_2d', 2,
  'Primary Diagonal Sum of 2D Matrix',
  'Primary diagonal element sum.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"Primary Diagonal Sum of 2D Matrix: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Diagonal sum (1+5+9) = 15.`, explanationHinglish: `std::cout output display hua: Diagonal sum (1+5+9) = 15.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Diagonal sum (1+5+9) = 15`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cpp_matrix_transpose = createCppLesson(
  'cpp_matrix_transpose', 'arrays_2d', 3,
  '2D Matrix Transpose',
  'Rows to columns matrix swap.',
  [
    { lineNum: 1, tokens: [{ type: 'keyword' as const, value: '#include' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '<iostream>' }] },
    { lineNum: 2, tokens: [{ type: 'keyword' as const, value: 'using' }, { type: 'text' as const, value: ' ' }, { type: 'keyword' as const, value: 'namespace' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'std' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 3, tokens: [{ type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'function' as const, value: 'main' }, { type: 'punctuation' as const, value: '()' }, { type: 'text' as const, value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'int' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '=' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '10', paramId: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'function' as const, value: 'cout' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'string' as const, value: '"2D Matrix Transpose: "' }, { type: 'text' as const, value: ' ' }, { type: 'operator' as const, value: '<<' }, { type: 'text' as const, value: ' ' }, { type: 'variable' as const, value: 'val' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text' as const, value: '    ' }, { type: 'keyword' as const, value: 'return' }, { type: 'text' as const, value: ' ' }, { type: 'number' as const, value: '0' }, { type: 'punctuation' as const, value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation' as const, value: '}' }] },
  ],
  { val: { default: 10, label: 'val (int)' } },
  (vars) => {
    const val = Number(vars.val ?? 10);
    return [
      { step: 1, lineNum: 4, explanationEnglish: `Initialize val = ${val} [4Bytes].`, explanationHinglish: `Variable val (${val}) memory me store hua.`, memorySnapshot: { val: `${val} [4B]` }, animationEvent: { type: 'CREATE_VARIABLE', name: 'val', value: val } },
      { step: 2, lineNum: 5, explanationEnglish: `cout prints output: Transpose matrix generated.`, explanationHinglish: `std::cout output display hua: Transpose matrix generated.`, memorySnapshot: { val: `${val} [4B]` }, consoleOutput: `Transpose matrix generated`, animationEvent: { type: 'PRINT_VALUE', variableName: 'val', outputValue: val } }
    ];
  }
);


export const cppLessons: Record<string, LessonProgram> = {
  cpp_types: cpp_types,
  cpp_swap_temp: cpp_swap_temp,
  cpp_swap_no_temp: cpp_swap_no_temp,
  cpp_arithmetic: cpp_arithmetic,
  cpp_relational_logical: cpp_relational_logical,
  cpp_inc_dec: cpp_inc_dec,
  cpp_circle_area: cpp_circle_area,
  cpp_cin_primitives: cpp_cin_primitives,
  cpp_cin_strings: cpp_cin_strings,
  cpp_implicit_casting: cpp_implicit_casting,
  cpp_explicit_casting: cpp_explicit_casting,
  cpp_char_ascii: cpp_char_ascii,
  cpp_if_else: cpp_if_else,
  cpp_even_odd: cpp_even_odd,
  cpp_largest_three: cpp_largest_three,
  cpp_leap_year: cpp_leap_year,
  cpp_marks_grade: cpp_marks_grade,
  cpp_tax_calc: cpp_tax_calc,
  cpp_pos_neg_zero: cpp_pos_neg_zero,
  cpp_electricity_bill: cpp_electricity_bill,
  cpp_switch_day: cpp_switch_day,
  cpp_switch_calc: cpp_switch_calc,
  cpp_switch_vowel: cpp_switch_vowel,
  cpp_switch_month: cpp_switch_month,
  cpp_for_sum: cpp_for_sum,
  cpp_multiplication_table: cpp_multiplication_table,
  cpp_even_numbers: cpp_even_numbers,
  cpp_fibonacci: cpp_fibonacci,
  cpp_while: cpp_while,
  cpp_digit_sum: cpp_digit_sum,
  cpp_factorial: cpp_factorial,
  cpp_reverse_num: cpp_reverse_num,
  cpp_do_while: cpp_do_while,
  cpp_do_while_sum: cpp_do_while_sum,
  cpp_string_concat: cpp_string_concat,
  cpp_string_access: cpp_string_access,
  cpp_string_reverse: cpp_string_reverse,
  cpp_square_func: cpp_square_func,
  cpp_func_addition: cpp_func_addition,
  cpp_func_pass_by_val: cpp_func_pass_by_val,
  cpp_func_pass_by_ref: cpp_func_pass_by_ref,
  cpp_array_max: cpp_array_max,
  cpp_array_sum: cpp_array_sum,
  cpp_linear_search: cpp_linear_search,
  cpp_array_reverse: cpp_array_reverse,
  cpp_matrix_2d: cpp_matrix_2d,
  cpp_diagonal_sum_2d: cpp_diagonal_sum_2d,
  cpp_matrix_transpose: cpp_matrix_transpose
};
