import type { LessonProgram, ExecutionStep } from '../types';

// ==============================================================================
// TOPIC 1: VARIABLES & DATA TYPES (6 Programs)
// ==============================================================================

export const javaTypes: LessonProgram = {
  id: 'java_types',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 1,
  friendlyName: 'Java Primitive Data Types (int, double, boolean, char)',
  learningObjective: 'Understand Java strongly-typed primitives, explicit byte sizes, and memory allocation.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'score' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '95', paramId: 'score' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'gpa' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.85', paramId: 'gpa' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'boolean' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPassed' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'true' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Score: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'score' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '", Grade: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'grade' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    score: { default: 95, min: 0, max: 100, label: 'score (int)' },
    gpa: { default: 3.85, label: 'gpa (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const score = Number(vars.score ?? 95);
    const gpa = Number(vars.gpa ?? 3.85);
    return [
      {
        step: 1, lineNum: 2,
        explanationEnglish: 'Java main method entry point execution starts.',
        explanationHinglish: 'Java main method entry point se code execution start hua.',
        memorySnapshot: {}, animationEvent: { type: 'NONE' as const }
      },
      {
        step: 2, lineNum: 3,
        explanationEnglish: `Declare 32-bit primitive integer int score = ${score} (4 bytes).`,
        explanationHinglish: `Java stack memory me 4-byte int variable 'score' (${score}) allocate hua.`,
        memorySnapshot: { score: `${score} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'score', value: score }
      },
      {
        step: 3, lineNum: 4,
        explanationEnglish: `Declare 64-bit double precision gpa = ${gpa} (8 bytes).`,
        explanationHinglish: `Double variable 'gpa' (${gpa}) 8-byte floating point memory slot me store hua.`,
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'gpa', value: gpa }
      },
      {
        step: 4, lineNum: 5,
        explanationEnglish: "Declare 16-bit Unicode char grade = 'A' (2 bytes).",
        explanationHinglish: "Character variable 'grade' ('A') 2-byte Unicode slot me store hua.",
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]`, grade: "'A' [char]" },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'A'" }
      },
      {
        step: 5, lineNum: 6,
        explanationEnglish: 'Declare boolean variable isPassed = true (1 bit/1 byte).',
        explanationHinglish: 'Boolean variable isPassed = true stack slot me store hua.',
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]`, grade: "'A' [char]", isPassed: 'true [boolean]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'isPassed', value: 'true' }
      },
      {
        step: 6, lineNum: 7,
        explanationEnglish: `System.out.println prints Score: ${score}, Grade: A.`,
        explanationHinglish: `System.out.println se "Score: ${score}, Grade: A" console pe display hua.`,
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]`, grade: "'A' [char]", isPassed: 'true [boolean]' },
        consoleOutput: `Score: ${score}, Grade: A`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'score', outputValue: score }
      },
      {
        step: 7, lineNum: 8,
        explanationEnglish: 'Method main finished.',
        explanationHinglish: 'main method finish ho gaya.',
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]`, grade: "'A' [char]", isPassed: 'true [boolean]' },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaCasting: LessonProgram = {
  id: 'java_casting',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 2,
  friendlyName: 'Implicit & Explicit Type Casting',
  learningObjective: 'Learn automatic widening and manual narrowing casting in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rawVal' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '87.95', paramId: 'rawVal' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'truncated' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rawVal' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Truncated: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'truncated' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    rawVal: { default: 87.95, label: 'rawVal (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = Number(vars.rawVal ?? 87.95);
    const trunc = Math.floor(raw);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare double rawVal = ${raw}.`,
        explanationHinglish: `Double variable rawVal = ${raw} store hua.`,
        memorySnapshot: { rawVal: `${raw} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'rawVal', value: raw }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Explicit Narrowing: (int) ${raw} truncates decimal digits to ${trunc}.`,
        explanationHinglish: `Explicit casting (int) se decimal ke baad waali value gayab ho ke integer ${trunc} banta hai.`,
        memorySnapshot: { rawVal: `${raw} [double]`, truncated: `${trunc} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'truncated', value: trunc }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Truncated: ${trunc}.`,
        explanationHinglish: `System.out.println se "Truncated: ${trunc}" print hua.`,
        memorySnapshot: { rawVal: `${raw} [double]`, truncated: `${trunc} [int]` },
        consoleOutput: `Truncated: ${trunc}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'truncated', outputValue: trunc }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { rawVal: `${raw} [double]`, truncated: `${trunc} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaAscii: LessonProgram = {
  id: 'java_ascii',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 3,
  friendlyName: 'Char to ASCII Integer Conversion',
  learningObjective: 'Understand character encoding and numeric ASCII representation in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'asciiCode' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"ASCII: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'asciiCode' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Declare char ch = 'A'.",
      explanationHinglish: "Character variable ch = 'A' memory me store hua.",
      memorySnapshot: { ch: "'A' [char]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: "'A'" }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "Implicit Widening: 'A' automatically converts to integer ASCII code 65.",
      explanationHinglish: "Automatic type conversion se 'A' ka ASCII code 65 int variable asciiCode me store ho gaya.",
      memorySnapshot: { ch: "'A' [char]", asciiCode: '65 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'asciiCode', value: 65 }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'System.out.println prints ASCII: 65.',
      explanationHinglish: 'System.out.println se ASCII: 65 print hua.',
      memorySnapshot: { ch: "'A' [char]", asciiCode: '65 [int]' },
      consoleOutput: 'ASCII: 65',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'asciiCode', outputValue: 65 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { ch: "'A' [char]", asciiCode: '65 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaTempConvert: LessonProgram = {
  id: 'java_temp_convert',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 4,
  friendlyName: 'Temperature Converter (Celsius to Fahrenheit)',
  learningObjective: 'Learn mixed double expression evaluation and formula computation in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'celsius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25.0', paramId: 'celsius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fahrenheit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'celsius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '9.0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '5.0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '32.0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fahrenheit: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fahrenheit' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    celsius: { default: 25.0, label: 'celsius (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const cel = Number(vars.celsius ?? 25.0);
    const fah = (cel * 9.0) / 5.0 + 32.0;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare celsius = ${cel}.`,
        explanationHinglish: `Variable celsius = ${cel} store hua.`,
        memorySnapshot: { celsius: `${cel} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'celsius', value: cel }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Compute formula (${cel} * 9.0 / 5.0) + 32.0 = ${fah}.`,
        explanationHinglish: `Formula calculate hoke fahrenheit = ${fah} store hua.`,
        memorySnapshot: { celsius: `${cel} [double]`, fahrenheit: `${fah} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'fahrenheit', value: fah }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Fahrenheit: ${fah}.`,
        explanationHinglish: `System.out.println se "Fahrenheit: ${fah}" print hua.`,
        memorySnapshot: { celsius: `${cel} [double]`, fahrenheit: `${fah} [double]` },
        consoleOutput: `Fahrenheit: ${fah}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'fahrenheit', outputValue: fah }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { celsius: `${cel} [double]`, fahrenheit: `${fah} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaCircleArea: LessonProgram = {
  id: 'java_circle_area',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 5,
  friendlyName: 'Area & Circumference of Circle',
  learningObjective: 'Learn floating point math formulas using double precision in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7.0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14159' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Area: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Declare double r = 7.0.',
      explanationHinglish: 'Radius r = 7.0 store hua.',
      memorySnapshot: { r: '7.0 [double]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'r', value: 7.0 }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Calculate area = 3.14159 * 7.0 * 7.0 = 153.93791.',
      explanationHinglish: 'Area calculate hoke area = 153.93791 store hua.',
      memorySnapshot: { r: '7.0 [double]', area: '153.93791 [double]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'area', value: 153.93791 }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'System.out.println prints Area: 153.93791.',
      explanationHinglish: 'Console pe "Area: 153.93791" print hua.',
      memorySnapshot: { r: '7.0 [double]', area: '153.93791 [double]' },
      consoleOutput: 'Area: 153.93791',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'area', outputValue: 153.93791 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { r: '7.0 [double]', area: '153.93791 [double]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaSwapTemp: LessonProgram = {
  id: 'java_swap_temp',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 6,
  friendlyName: 'Swap Two Variables (Using Temp Variable)',
  learningObjective: 'Understand variable swapping logic and temporary memory slot usage.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"a: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '", b: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set a = 10, b = 20.',
      explanationHinglish: 'a = 10 aur b = 20 initialize hue.',
      memorySnapshot: { a: '10 [int]', b: '20 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: 10 }, { name: 'b', value: 20 }] }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Backup a value to temp: temp = a (10).',
      explanationHinglish: 'a ki value (10) temp variable me backup ki.',
      memorySnapshot: { a: '10 [int]', b: '20 [int]', temp: '10 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'temp', value: 10 }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'Copy b to a: a = b (20).',
      explanationHinglish: 'b (20) ki value a me copy hui -> a = 20.',
      memorySnapshot: { a: '20 [int]', b: '20 [int]', temp: '10 [int]' },
      animationEvent: { type: 'COPY_VALUE' as const, from: 'b', to: 'a', value: 20 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'Copy temp to b: b = temp (10). Swap complete!',
      explanationHinglish: 'temp (10) ki value b me copy hui -> b = 10. Swapping complete!',
      memorySnapshot: { a: '20 [int]', b: '10 [int]', temp: '10 [int]' },
      animationEvent: { type: 'COPY_VALUE' as const, from: 'temp', to: 'b', value: 10 }
    },
    {
      step: 5, lineNum: 7,
      explanationEnglish: 'System.out.println prints a: 20, b: 10.',
      explanationHinglish: 'Console pe "a: 20, b: 10" print hua.',
      memorySnapshot: { a: '20 [int]', b: '10 [int]' },
      consoleOutput: 'a: 20, b: 10',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'a', outputValue: '20, 10' }
    },
    {
      step: 6, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { a: '20 [int]', b: '10 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

// ==============================================================================
// TOPIC 2: CONDITIONALS (IF-ELSE & LADDER) (6 Programs)
// ==============================================================================

export const javaEvenOdd: LessonProgram = {
  id: 'java_even_odd',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 1,
  friendlyName: 'Even or Odd Check',
  learningObjective: 'Understand binary branch decision execution using if-else and modulo % in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '14', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Even"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Odd"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 14, min: 1, max: 100, label: 'num (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const num = Number(vars.num ?? 14);
    const isEven = num % 2 === 0;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int num = ${num}.`,
        explanationHinglish: `Variable num = ${num} set hua.`,
        memorySnapshot: { num: `${num} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: num }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Evaluate condition ${num} % 2 == 0 -> ${isEven ? 'TRUE (Green)' : 'FALSE (Red)'}.`,
        explanationHinglish: `Condition check ${num} % 2 == 0 -> ${isEven ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { num: `${num} [int]` },
        animationEvent: { type: 'NONE' as const }
      },
      isEven ? {
        step: 3, lineNum: 5,
        explanationEnglish: 'Condition true, execute if block: System.out.println("Even").',
        explanationHinglish: 'Condition true hui, "Even" print hua.',
        memorySnapshot: { num: `${num} [int]` },
        consoleOutput: 'Even',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'num', outputValue: 'Even' }
      } : {
        step: 3, lineNum: 7,
        explanationEnglish: 'Condition false, execute else block: System.out.println("Odd").',
        explanationHinglish: 'Condition false hui, "Odd" print hua.',
        memorySnapshot: { num: `${num} [int]` },
        consoleOutput: 'Odd',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'num', outputValue: 'Odd' }
      },
      {
        step: 4, lineNum: 9,
        explanationEnglish: 'Program completed.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { num: `${num} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaLargestThree: LessonProgram = {
  id: 'java_largest_three',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 2,
  friendlyName: 'Largest of Three Numbers',
  learningObjective: 'Learn logical AND (&&) combination in Java if-else if decision trees.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '45' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '89' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '23' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&&' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"a is largest"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"b is largest"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"c is largest"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Initialize int a=45, b=89, c=23.',
      explanationHinglish: 'Variables a=45, b=89, c=23 initialize hue.',
      memorySnapshot: { a: '45 [int]', b: '89 [int]', c: '23 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: 45 }, { name: 'b', value: 89 }, { name: 'c', value: 23 }] }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Check (a >= b && a >= c): 45 >= 89 is FALSE.',
      explanationHinglish: 'Condition 45 >= 89 && 45 >= 23 check hui -> FALSE.',
      memorySnapshot: { a: '45 [int]', b: '89 [int]', c: '23 [int]' },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: 'Check else if (b >= c): 89 >= 23 is TRUE.',
      explanationHinglish: 'Condition 89 >= 23 check hui -> TRUE.',
      memorySnapshot: { a: '45 [int]', b: '89 [int]', c: '23 [int]' },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 4, lineNum: 7,
      explanationEnglish: 'Execute branch: System.out.println("b is largest").',
      explanationHinglish: 'b sabse bada hai, "b is largest" print hua.',
      memorySnapshot: { a: '45 [int]', b: '89 [int]', c: '23 [int]' },
      consoleOutput: 'b is largest',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'b', outputValue: 'b is largest' }
    },
    {
      step: 5, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { a: '45 [int]', b: '89 [int]', c: '23 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaGrade: LessonProgram = {
  id: 'java_grade',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 3,
  friendlyName: 'Student Grade Calculator (If-Else Ladder)',
  learningObjective: 'Learn multi-branch conditional execution using if-else if in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '82', paramId: 'marks' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '90' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade A"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '75' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade B"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Grade C"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    marks: { default: 82, min: 0, max: 100, label: 'marks (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const marks = Number(vars.marks ?? 82);
    let grade = 'Grade C';
    let lineToExec = 9;
    if (marks >= 90) { grade = 'Grade A'; lineToExec = 5; }
    else if (marks >= 75) { grade = 'Grade B'; lineToExec = 7; }

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare marks = ${marks}.`,
        explanationHinglish: `Variable 'marks' = ${marks} set hua.`,
        memorySnapshot: { marks: `${marks} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'marks', value: marks }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check first condition: ${marks} >= 90 is ${marks >= 90 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehli condition: ${marks} >= 90 -> ${marks >= 90 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { marks: `${marks} [int]` },
        animationEvent: { type: 'NONE' as const }
      },
      ...(marks < 90 ? [{
        step: 3, lineNum: 6,
        explanationEnglish: `Check second condition: ${marks} >= 75 is ${marks >= 75 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusri condition check: ${marks} >= 75 -> ${marks >= 75 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { marks: `${marks} [int]` },
        animationEvent: { type: 'NONE' as const }
      }] : []),
      {
        step: 4, lineNum: lineToExec,
        explanationEnglish: `Execute selected branch: System.out.println("${grade}").`,
        explanationHinglish: `Matching branch execute hoke "${grade}" print hua.`,
        memorySnapshot: { marks: `${marks} [int]` },
        consoleOutput: grade,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'marks', outputValue: grade }
      },
      {
        step: 5, lineNum: 11,
        explanationEnglish: 'Method completed.',
        explanationHinglish: 'Method execution finish hua.',
        memorySnapshot: { marks: `${marks} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaTaxCalc: LessonProgram = {
  id: 'java_tax_calc',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 4,
  friendlyName: 'Income Tax Slab Calculator',
  learningObjective: 'Calculate variable tax percentage slabs using Java conditionals.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '600000', paramId: 'income' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '500000' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.20' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.05' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Tax: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'tax' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    income: { default: 600000, min: 100000, max: 2000000, label: 'income (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const inc = Number(vars.income ?? 600000);
    const taxRate = inc > 500000 ? 0.20 : 0.05;
    const tax = inc * taxRate;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Set income = ${inc}.`,
        explanationHinglish: `Variable income = ${inc} set hua.`,
        memorySnapshot: { income: `${inc} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'income', value: inc }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'Initialize tax = 0.0.',
        explanationHinglish: 'Variable tax = 0.0 initialize hua.',
        memorySnapshot: { income: `${inc} [double]`, tax: '0.0 [double]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'tax', value: 0 }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Check condition income (${inc}) > 500000 is ${inc > 500000 ? 'TRUE (20% Slab)' : 'FALSE (5% Slab)'}.`,
        explanationHinglish: `Income > 500000 check -> ${inc > 500000 ? 'TRUE (20% Slab)' : 'FALSE (5% Slab)'}.`,
        memorySnapshot: { income: `${inc} [double]`, tax: '0.0 [double]' },
        animationEvent: { type: 'NONE' as const }
      },
      {
        step: 4, lineNum: inc > 500000 ? 6 : 8,
        explanationEnglish: `Calculate tax: ${inc} * ${taxRate} = ${tax}.`,
        explanationHinglish: `Tax calculate hoke tax = ${tax} update hua.`,
        memorySnapshot: { income: `${inc} [double]`, tax: `${tax} [double]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'tax', oldValue: 0, newValue: tax }
      },
      {
        step: 5, lineNum: 10,
        explanationEnglish: `System.out.println prints Tax: ${tax}.`,
        explanationHinglish: `System.out.println se Tax: ${tax} print hua.`,
        memorySnapshot: { income: `${inc} [double]`, tax: `${tax} [double]` },
        consoleOutput: `Tax: ${tax}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'tax', outputValue: tax }
      },
      {
        step: 6, lineNum: 11,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { income: `${inc} [double]`, tax: `${tax} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaLeapYear: LessonProgram = {
  id: 'java_leap_year',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 5,
  friendlyName: 'Leap Year Checker',
  learningObjective: 'Learn complex boolean expression logic (% 4, % 100, % 400).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2024' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'boolean' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isLeap' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&&' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '400' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Leap Year: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isLeap' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set year = 2024.',
      explanationHinglish: 'year = 2024 initialize hua.',
      memorySnapshot: { year: '2024 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'year', value: 2024 }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Evaluate (2024 % 4 == 0 && 2024 % 100 != 0) -> TRUE.',
      explanationHinglish: 'Leap year condition check hui -> TRUE.',
      memorySnapshot: { year: '2024 [int]', isLeap: 'true [boolean]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'isLeap', value: 'true' }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'System.out.println prints Leap Year: true.',
      explanationHinglish: 'Console pe "Leap Year: true" print hua.',
      memorySnapshot: { year: '2024 [int]', isLeap: 'true [boolean]' },
      consoleOutput: 'Leap Year: true',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'isLeap', outputValue: 'true' }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { year: '2024 [int]', isLeap: 'true [boolean]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaVowelIf: LessonProgram = {
  id: 'java_vowel_if',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 6,
  friendlyName: 'Vowel or Consonant (If-Else Logical OR)',
  learningObjective: 'Learn multiple character comparisons using logical OR (||) in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Vowel"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Consonant"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Set char ch = 'i'.",
      explanationHinglish: "Character ch = 'i' set hua.",
      memorySnapshot: { ch: "'i' [char]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: "'i'" }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "Check condition ('i'=='a' || 'i'=='e' || 'i'=='i') -> TRUE.",
      explanationHinglish: "Condition ch == 'i' true hui.",
      memorySnapshot: { ch: "'i' [char]" },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'System.out.println prints Vowel.',
      explanationHinglish: 'Console pe "Vowel" print hua.',
      memorySnapshot: { ch: "'i' [char]" },
      consoleOutput: 'Vowel',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'ch', outputValue: 'Vowel' }
    },
    {
      step: 4, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { ch: "'i' [char]" },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

// ==============================================================================
// TOPIC 3: SWITCH CASE & SELECTION (5 Programs)
// ==============================================================================

export const javaSwitchDay: LessonProgram = {
  id: 'java_switch_day',
  language: 'java',
  topic: 'switch_case',
  lessonNumber: 1,
  friendlyName: 'Day of Week Switch Case',
  learningObjective: 'Understand Java switch-case jumping and break statements.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'day' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3', paramId: 'day' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'day' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Monday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Wednesday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Other Day"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    day: { default: 3, min: 1, max: 7, label: 'day (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const day = Number(vars.day ?? 3);
    const dayName = day === 1 ? 'Monday' : day === 3 ? 'Wednesday' : 'Other Day';
    const lineToExec = day === 1 ? 5 : day === 3 ? 6 : 7;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Set day = ${day}.`,
        explanationHinglish: `Variable day = ${day} store hua.`,
        memorySnapshot: { day: `${day} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'day', value: day }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Switch selector evaluates day = ${day} and jumps directly to matching case.`,
        explanationHinglish: `Switch selector day = ${day} ko evaluate karke exact matching case par jump karta hai.`,
        memorySnapshot: { day: `${day} [int]` },
        animationEvent: { type: 'MATCH_START' as const, variableName: 'day', value: day }
      },
      {
        step: 3, lineNum: lineToExec,
        explanationEnglish: `Execute case ${day}: System.out.println("${dayName}").`,
        explanationHinglish: `Case ${day} match hua, "${dayName}" print hua.`,
        memorySnapshot: { day: `${day} [int]` },
        consoleOutput: dayName,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'day', outputValue: dayName }
      },
      {
        step: 4, lineNum: 9,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { day: `${day} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaSwitchVowel: LessonProgram = {
  id: 'java_switch_vowel',
  language: 'java',
  topic: 'switch_case',
  lessonNumber: 2,
  friendlyName: 'Vowel or Consonant Check',
  learningObjective: 'Learn switch case fallthrough grouping for multiple matching conditions.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '                ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Vowel"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Consonant"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Declare char ch = 'e'.",
      explanationHinglish: "Character variable ch = 'e' store hua.",
      memorySnapshot: { ch: "'e' [char]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: "'e'" }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "Switch evaluates ch = 'e' and matches grouped vowel case.",
      explanationHinglish: "Switch 'e' ko grouped vowel case ke sath match karke execute karta hai.",
      memorySnapshot: { ch: "'e' [char]" },
      animationEvent: { type: 'MATCH_START' as const, variableName: 'ch', value: "'e'" }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: 'System.out.println prints Vowel.',
      explanationHinglish: 'Console pe "Vowel" print hua.',
      memorySnapshot: { ch: "'e' [char]" },
      consoleOutput: 'Vowel',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'ch', outputValue: 'Vowel' }
    },
    {
      step: 4, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { ch: "'e' [char]" },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaSwitchCalc: LessonProgram = {
  id: 'java_switch_calc',
  language: 'java',
  topic: 'switch_case',
  lessonNumber: 3,
  friendlyName: 'Menu Driven Calculator',
  learningObjective: 'Learn operation selection using char switch in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'op' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'op' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Result: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set int a = 20, b = 5.',
      explanationHinglish: 'a = 20 aur b = 5 initialize hue.',
      memorySnapshot: { a: '20 [int]', b: '5 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: 20 }, { name: 'b', value: 5 }] }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: "Set operator char op = '*'.",
      explanationHinglish: "Operator op = '*' set hua.",
      memorySnapshot: { a: '20 [int]', b: '5 [int]', op: "'*' [char]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'op', value: "'*'" }
    },
    {
      step: 3, lineNum: 7,
      explanationEnglish: "Switch matches '*' case: compute res = 20 * 5 = 100.",
      explanationHinglish: "Case '*' match hua, res = 20 * 5 = 100 calculate hoke res me store hua.",
      memorySnapshot: { a: '20 [int]', b: '5 [int]', op: "'*' [char]", res: '100 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'res', value: 100 }
    },
    {
      step: 4, lineNum: 9,
      explanationEnglish: 'System.out.println prints Result: 100.',
      explanationHinglish: 'Console pe "Result: 100" print hua.',
      memorySnapshot: { a: '20 [int]', b: '5 [int]', op: "'*' [char]", res: '100 [int]' },
      consoleOutput: 'Result: 100',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'res', outputValue: 100 }
    },
    {
      step: 5, lineNum: 10,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { a: '20 [int]', b: '5 [int]', op: "'*' [char]", res: '100 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaSwitchMonth: LessonProgram = {
  id: 'java_switch_month',
  language: 'java',
  topic: 'switch_case',
  lessonNumber: 4,
  friendlyName: 'Season Finder by Month Number',
  learningObjective: 'Learn range mapping with switch case statements.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'month' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'month' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '8' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Monsoon"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Other Season"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set month = 7.',
      explanationHinglish: 'month = 7 set hua.',
      memorySnapshot: { month: '7 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'month', value: 7 }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Switch evaluates month = 7 and matches case 7.',
      explanationHinglish: 'Switch month = 7 ko case 7 ke sath match karta hai.',
      memorySnapshot: { month: '7 [int]' },
      animationEvent: { type: 'MATCH_START' as const, variableName: 'month', value: 7 }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'System.out.println prints Monsoon.',
      explanationHinglish: 'Console pe "Monsoon" print hua.',
      memorySnapshot: { month: '7 [int]' },
      consoleOutput: 'Monsoon',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'month', outputValue: 'Monsoon' }
    },
    {
      step: 4, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { month: '7 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaSwitchGrade: LessonProgram = {
  id: 'java_switch_grade',
  language: 'java',
  topic: 'switch_case',
  lessonNumber: 5,
  friendlyName: 'Performance Comment by Grade',
  learningObjective: 'Learn character switch matching with descriptive output.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'g' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'g' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Excellent"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Good Job"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: "Set char g = 'A'.",
      explanationHinglish: "Character g = 'A' set hua.",
      memorySnapshot: { g: "'A' [char]" },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'g', value: "'A'" }
    },
    {
      step: 2, lineNum: 5,
      explanationEnglish: 'System.out.println prints Excellent.',
      explanationHinglish: 'Console pe "Excellent" print hua.',
      memorySnapshot: { g: "'A' [char]" },
      consoleOutput: 'Excellent',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'g', outputValue: 'Excellent' }
    },
    {
      step: 3, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { g: "'A' [char]" },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

// ==============================================================================
// TOPIC 4: LOOPS (FOR, WHILE, DO-WHILE) (7 Programs)
// ==============================================================================

export const javaForSum: LessonProgram = {
  id: 'java_for_sum',
  language: 'java',
  topic: 'loops',
  lessonNumber: 1,
  friendlyName: 'Sum of First N Natural Numbers',
  learningObjective: 'Learn accumulator variable accumulation in Java for loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sum: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let currentSum = 0;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: 'Set n = 4, initialize sum = 0.',
      explanationHinglish: 'n = 4 aur sum = 0 initialize hua.',
      memorySnapshot: { n: '4 [int]', sum: '0 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: 4 }, { name: 'sum', value: 0 }] }
    });

    for (let i = 1; i <= 4; i++) {
      const oldSum = currentSum;
      currentSum += i;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration ${i}: sum += ${i} -> sum = ${currentSum}.`,
        explanationHinglish: `Iteration ${i}: sum me ${i} add hua -> sum = ${currentSum}.`,
        memorySnapshot: { n: '4 [int]', i: `${i} [int]`, sum: `${currentSum} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: currentSum }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: `System.out.println prints Sum: ${currentSum}.`,
      explanationHinglish: `System.out.println se "Sum: ${currentSum}" print hua.`,
      memorySnapshot: { n: '4 [int]', sum: `${currentSum} [int]` },
      consoleOutput: `Sum: ${currentSum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: currentSum }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '4 [int]', sum: `${currentSum} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaWhileDigits: LessonProgram = {
  id: 'java_while_digits',
  language: 'java',
  topic: 'loops',
  lessonNumber: 2,
  friendlyName: 'Sum of Digits (While Loop)',
  learningObjective: 'Learn digit extraction using % 10 and / 10 inside a while loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '432' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Digit Sum: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => {
    let n = 432;
    let sum = 0;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: 'Set num = 432, sum = 0.',
      explanationHinglish: 'num = 432 aur sum = 0 initialize hua.',
      memorySnapshot: { num: '432 [int]', sum: '0 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'num', value: 432 }, { name: 'sum', value: 0 }] }
    });

    while (n > 0) {
      const digit = n % 10;
      const oldSum = sum;
      sum += digit;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Extract last digit ${n} % 10 = ${digit}. sum += ${digit} -> sum = ${sum}.`,
        explanationHinglish: `Last digit ${digit} extract hua aur sum me add hoke ${sum} bana.`,
        memorySnapshot: { num: `${n} [int]`, sum: `${sum} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: sum }
      });
      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Remove last digit: num /= 10 -> num = ${n}.`,
        explanationHinglish: `num /= 10 se last digit remove hua -> num = ${n}.`,
        memorySnapshot: { num: `${n} [int]`, sum: `${sum} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'num', oldValue: oldN, newValue: n }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `System.out.println prints Digit Sum: ${sum}.`,
      explanationHinglish: `Console pe "Digit Sum: ${sum}" print hua.`,
      memorySnapshot: { num: '0 [int]', sum: `${sum} [int]` },
      consoleOutput: `Digit Sum: ${sum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: sum }
    });

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { num: '0 [int]', sum: `${sum} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaFactorial: LessonProgram = {
  id: 'java_factorial',
  language: 'java',
  topic: 'loops',
  lessonNumber: 3,
  friendlyName: 'Factorial Calculation',
  learningObjective: 'Learn multiplicative accumulation in loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'long' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Factorial: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => {
    let fact = 1;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: 'Set n = 5, long fact = 1.',
      explanationHinglish: 'n = 5 aur 8-byte long fact = 1 set hua.',
      memorySnapshot: { n: '5 [int]', fact: '1 [long]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: 5 }, { name: 'fact', value: 1 }] }
    });

    for (let i = 1; i <= 5; i++) {
      const oldFact = fact;
      fact *= i;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration ${i}: fact *= ${i} -> fact = ${fact}.`,
        explanationHinglish: `Iteration ${i}: fact me ${i} multiply hoke ${fact} hua.`,
        memorySnapshot: { n: '5 [int]', i: `${i} [int]`, fact: `${fact} [long]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'fact', oldValue: oldFact, newValue: fact }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: `System.out.println prints Factorial: ${fact}.`,
      explanationHinglish: `Console pe "Factorial: ${fact}" print hua.`,
      memorySnapshot: { n: '5 [int]', fact: `${fact} [long]` },
      consoleOutput: `Factorial: ${fact}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'fact', outputValue: fact }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '5 [int]', fact: `${fact} [long]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaDoWhile: LessonProgram = {
  id: 'java_do_while',
  language: 'java',
  topic: 'loops',
  lessonNumber: 4,
  friendlyName: 'Do-While Guaranteed Execution',
  learningObjective: 'Learn exit-controlled do-while loops in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'do' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Count: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'count' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set count = 1.',
      explanationHinglish: 'count = 1 set hua.',
      memorySnapshot: { count: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'count', value: 1 }
    },
    {
      step: 2, lineNum: 5,
      explanationEnglish: 'Execute body first without checking condition: System.out.println("Count: 1").',
      explanationHinglish: 'Pehle body execute hui (guaranteed 1st run): "Count: 1" print hua.',
      memorySnapshot: { count: '1 [int]' },
      consoleOutput: 'Count: 1',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'count', outputValue: 1 }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: 'Increment count++ -> count = 2.',
      explanationHinglish: 'count++ hoke 2 hua.',
      memorySnapshot: { count: '2 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'count', oldValue: 1, newValue: 2 }
    },
    {
      step: 4, lineNum: 7,
      explanationEnglish: 'Check while condition at bottom: count (2) <= 2 is TRUE. Loop continues.',
      explanationHinglish: 'Bottom me while condition check hui -> TRUE. Loop continue karega.',
      memorySnapshot: { count: '2 [int]' },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 5, lineNum: 5,
      explanationEnglish: 'Iteration 2: System.out.println("Count: 2").',
      explanationHinglish: 'Iteration 2: "Count: 2" print hua.',
      memorySnapshot: { count: '2 [int]' },
      consoleOutput: 'Count: 1\nCount: 2',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'count', outputValue: 2 }
    },
    {
      step: 6, lineNum: 6,
      explanationEnglish: 'Increment count++ -> count = 3.',
      explanationHinglish: 'count++ hoke 3 hua.',
      memorySnapshot: { count: '3 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'count', oldValue: 2, newValue: 3 }
    },
    {
      step: 7, lineNum: 7,
      explanationEnglish: 'Check while condition: count (3) <= 2 is FALSE. Loop ends.',
      explanationHinglish: 'Condition 3 <= 2 is FALSE. Do-while loop exit hua.',
      memorySnapshot: { count: '3 [int]' },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 8, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { count: '3 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaMultiplicationTable: LessonProgram = {
  id: 'java_multiplication_table',
  language: 'java',
  topic: 'loops',
  lessonNumber: 5,
  friendlyName: 'Multiplication Table Generator',
  learningObjective: 'Learn dynamic loop multiplier output formatting.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '" x "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '" = "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '));' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => {
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let out = '';

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: 'Set n = 5.',
      explanationHinglish: 'n = 5 initialize hua.',
      memorySnapshot: { n: '5 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: 5 }
    });

    for (let i = 1; i <= 3; i++) {
      const prod = 5 * i;
      out += (out ? '\n' : '') + `5 x ${i} = ${prod}`;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Print 5 x ${i} = ${prod}.`,
        explanationHinglish: `Console pe "5 x ${i} = ${prod}" print hua.`,
        memorySnapshot: { n: '5 [int]', i: `${i} [int]` },
        consoleOutput: out,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'n', outputValue: `${5}x${i}=${prod}` }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '5 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaReverseNum: LessonProgram = {
  id: 'java_reverse_num',
  language: 'java',
  topic: 'loops',
  lessonNumber: 6,
  friendlyName: 'Reverse an Integer Number',
  learningObjective: 'Learn math digit shifting (rev = rev * 10 + digit) in loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '123' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set n = 123, rev = 0.',
      explanationHinglish: 'n = 123 aur rev = 0 initialize hua.',
      memorySnapshot: { n: '123 [int]', rev: '0 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: 123 }, { name: 'rev', value: 0 }] }
    },
    {
      step: 2, lineNum: 5,
      explanationEnglish: 'Extract 3: rev = 0 * 10 + 3 = 3. n = 12.',
      explanationHinglish: 'Digit 3 extract karke rev = 3, n = 12 hua.',
      memorySnapshot: { n: '12 [int]', rev: '3 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'rev', oldValue: 0, newValue: 3 }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'Extract 2: rev = 3 * 10 + 2 = 32. n = 1.',
      explanationHinglish: 'Digit 2 extract karke rev = 32, n = 1 hua.',
      memorySnapshot: { n: '1 [int]', rev: '32 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'rev', oldValue: 3, newValue: 32 }
    },
    {
      step: 4, lineNum: 5,
      explanationEnglish: 'Extract 1: rev = 32 * 10 + 1 = 321. n = 0.',
      explanationHinglish: 'Digit 1 extract karke rev = 321, n = 0 hua.',
      memorySnapshot: { n: '0 [int]', rev: '321 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'rev', oldValue: 32, newValue: 321 }
    },
    {
      step: 5, lineNum: 8,
      explanationEnglish: 'System.out.println prints Reversed: 321.',
      explanationHinglish: 'Console pe "Reversed: 321" print hua.',
      memorySnapshot: { n: '0 [int]', rev: '321 [int]' },
      consoleOutput: 'Reversed: 321',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'rev', outputValue: 321 }
    },
    {
      step: 6, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '0 [int]', rev: '321 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaPrimeCheck: LessonProgram = {
  id: 'java_prime_check',
  language: 'java',
  topic: 'loops',
  lessonNumber: 7,
  friendlyName: 'Prime Number Checker',
  learningObjective: 'Learn divisor testing using boolean flags in loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'boolean' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'true' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'false' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Is Prime: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPrime' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Set n = 7, boolean isPrime = true.',
      explanationHinglish: 'n = 7 aur isPrime = true initialize hue.',
      memorySnapshot: { n: '7 [int]', isPrime: 'true [boolean]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: 7 }, { name: 'isPrime', value: 'true' }] }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Test divisors i from 2 to n / 2 (3): No divisor divides 7 evenly.',
      explanationHinglish: '2 se 3 tak check kiya (n / 2), koi divisor divide nahi karta.',
      memorySnapshot: { n: '7 [int]', isPrime: 'true [boolean]' },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 3, lineNum: 7,
      explanationEnglish: 'System.out.println prints Is Prime: true.',
      explanationHinglish: 'Console pe "Is Prime: true" print hua.',
      memorySnapshot: { n: '7 [int]', isPrime: 'true [boolean]' },
      consoleOutput: 'Is Prime: true',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'isPrime', outputValue: 'true' }
    },
    {
      step: 4, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '7 [int]', isPrime: 'true [boolean]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

// ==============================================================================
// TOPIC 5: ARRAYS (1D & 2D ARRAYS) (7 Programs)
// ==============================================================================

export const javaArraySum1D: LessonProgram = {
  id: 'java_array_sum_1d',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 1,
  friendlyName: '1D Array Sum & Average',
  learningObjective: 'Learn Java 1D array allocation, element indexing, and average computation.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '12' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '25' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '37' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '48' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'text', value: ' ' }, { type: 'operator', value: ':' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'val' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'avg' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'double' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Avg: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'avg' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => {
    const arr = [12, 25, 37, 48];
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let sum = 0;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: 'Heap Memory Allocation: Allocate 1D array int[] arr = {12, 25, 37, 48}.',
      explanationHinglish: 'Heap memory me 1D array object int[] arr allocate hua.',
      memorySnapshot: { 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: '[12, 25, 37, 48]' }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Initialize sum = 0.',
      explanationHinglish: 'sum = 0 initialize hua.',
      memorySnapshot: { 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]', sum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const oldSum = sum;
      sum += val;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Index ${i} (val=${val}): sum += ${val} -> sum = ${sum}.`,
        explanationHinglish: `Index ${i} pe arr[${i}]=${val} sum me add hua -> sum = ${sum}.`,
        memorySnapshot: { 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]', sum: `${sum} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: sum }
      });
    }

    const avg = sum / arr.length;
    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `Compute average = (double) ${sum} / 4 = ${avg}.`,
      explanationHinglish: `Average calculate hua: avg = ${avg}.`,
      memorySnapshot: { 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]', sum: `${sum} [int]`, avg: `${avg} [double]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'avg', value: avg }
    });

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: `System.out.println prints Avg: ${avg}.`,
      explanationHinglish: `Console pe "Avg: ${avg}" print hua.`,
      memorySnapshot: { 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]', avg: `${avg} [double]` },
      consoleOutput: `Avg: ${avg}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'avg', outputValue: avg }
    });

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]', avg: `${avg} [double]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaArrayMax1D: LessonProgram = {
  id: 'java_array_max_1d',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 2,
  friendlyName: 'Find Maximum & Minimum in 1D Array',
  learningObjective: 'Learn element comparisons and tracking extrema in Java arrays.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '34' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '89' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '15' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Max: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Allocate arr = {34, 89, 15}.',
      explanationHinglish: 'Array arr = {34, 89, 15} memory me allocate hua.',
      memorySnapshot: { 'arr[0]': '34 [int]', 'arr[1]': '89 [int]', 'arr[2]': '15 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: '[34, 89, 15]' }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Set initial max = arr[0] (34).',
      explanationHinglish: 'max ko pehle element arr[0] (34) se initialize kiya.',
      memorySnapshot: { 'arr[0]': '34 [int]', 'arr[1]': '89 [int]', 'arr[2]': '15 [int]', max: '34 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'max', value: 34 }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: 'i=1: arr[1] (89) > max (34) is TRUE -> Update max = 89.',
      explanationHinglish: 'Index 1 pe arr[1]=89 > max (34) -> TRUE, max = 89 update hua.',
      memorySnapshot: { 'arr[0]': '34 [int]', 'arr[1]': '89 [int]', 'arr[2]': '15 [int]', max: '89 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'max', oldValue: 34, newValue: 89 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'i=2: arr[2] (15) > max (89) is FALSE -> Keep max = 89.',
      explanationHinglish: 'Index 2 pe arr[2]=15 > max (89) -> FALSE, max 89 hi raha.',
      memorySnapshot: { 'arr[0]': '34 [int]', 'arr[1]': '89 [int]', 'arr[2]': '15 [int]', max: '89 [int]' },
      animationEvent: { type: 'NONE' as const }
    },
    {
      step: 5, lineNum: 8,
      explanationEnglish: 'System.out.println prints Max: 89.',
      explanationHinglish: 'Console pe "Max: 89" print hua.',
      memorySnapshot: { 'arr[0]': '34 [int]', 'arr[1]': '89 [int]', 'arr[2]': '15 [int]', max: '89 [int]' },
      consoleOutput: 'Max: 89',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'max', outputValue: 89 }
    },
    {
      step: 6, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 'arr[0]': '34 [int]', 'arr[1]': '89 [int]', 'arr[2]': '15 [int]', max: '89 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaLinearSearch: LessonProgram = {
  id: 'java_linear_search',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 3,
  friendlyName: 'Linear Search in 1D Array',
  learningObjective: 'Learn target element search and early break execution in Java arrays.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '30' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'foundIdx' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '-1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '                ' }, { type: 'variable', value: 'foundIdx' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Found at index: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'foundIdx' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Allocate arr = {10, 20, 30}.',
      explanationHinglish: 'Array arr = {10, 20, 30} memory me allocate hua.',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: '[10, 20, 30]' }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Set target = 20, foundIdx = -1.',
      explanationHinglish: 'target = 20 aur foundIdx = -1 initialize hue.',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]', target: '20 [int]', foundIdx: '-1 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'target', value: 20 }, { name: 'foundIdx', value: -1 }] }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: 'i=0: arr[0] (10) == target (20) is FALSE.',
      explanationHinglish: 'Index 0 (arr[0]=10) target (20) ke sath match nahi hua.',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]', target: '20 [int]', foundIdx: '-1 [int]' },
      animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: 0 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'i=1: arr[1] (20) == target (20) is TRUE! Match found!',
      explanationHinglish: 'Index 1 (arr[1]=20) target (20) ke sath match ho gaya!',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]', target: '20 [int]', foundIdx: '-1 [int]' },
      animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: 1 }
    },
    {
      step: 5, lineNum: 7,
      explanationEnglish: 'Set foundIdx = 1 and execute break.',
      explanationHinglish: 'foundIdx = 1 update hoke loop break ho gaya.',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]', target: '20 [int]', foundIdx: '1 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'foundIdx', oldValue: -1, newValue: 1 }
    },
    {
      step: 6, lineNum: 10,
      explanationEnglish: 'System.out.println prints Found at index: 1.',
      explanationHinglish: 'Console pe "Found at index: 1" print hua.',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]', target: '20 [int]', foundIdx: '1 [int]' },
      consoleOutput: 'Found at index: 1',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'foundIdx', outputValue: 1 }
    },
    {
      step: 7, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 'arr[0]': '10 [int]', 'arr[1]': '20 [int]', 'arr[2]': '30 [int]', target: '20 [int]', foundIdx: '1 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaArrayReverse: LessonProgram = {
  id: 'java_array_reverse',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 4,
  friendlyName: 'Reverse 1D Array Elements',
  learningObjective: 'Learn in-place array swapping using two pointers.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed Array"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Allocate arr = {1, 2, 3}.',
      explanationHinglish: 'arr = {1, 2, 3} allocate hua.',
      memorySnapshot: { 'arr[0]': '1 [int]', 'arr[1]': '2 [int]', 'arr[2]': '3 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: '[1, 2, 3]' }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Store arr[0] (1) into temp.',
      explanationHinglish: 'arr[0] (1) ko temp me backup kiya.',
      memorySnapshot: { 'arr[0]': '1 [int]', 'arr[1]': '2 [int]', 'arr[2]': '3 [int]', temp: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'temp', value: 1 }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'Copy arr[2] (3) to arr[0].',
      explanationHinglish: 'arr[2] (3) ki value arr[0] me copy hui.',
      memorySnapshot: { 'arr[0]': '3 [int]', 'arr[1]': '2 [int]', 'arr[2]': '3 [int]', temp: '1 [int]' },
      animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'arr', index: 0, oldValue: 1, newValue: 3 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'Copy temp (1) to arr[2]. Swapped arr = {3, 2, 1}.',
      explanationHinglish: 'temp (1) ki value arr[2] me write hui -> {3, 2, 1}.',
      memorySnapshot: { 'arr[0]': '3 [int]', 'arr[1]': '2 [int]', 'arr[2]': '1 [int]' },
      animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'arr', index: 2, oldValue: 3, newValue: 1 }
    },
    {
      step: 5, lineNum: 7,
      explanationEnglish: 'System.out.println prints Reversed Array.',
      explanationHinglish: 'Console pe "Reversed Array" print hua.',
      memorySnapshot: { 'arr[0]': '3 [int]', 'arr[1]': '2 [int]', 'arr[2]': '1 [int]' },
      consoleOutput: 'Reversed Array',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'arr', outputValue: '[3, 2, 1]' }
    },
    {
      step: 6, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 'arr[0]': '3 [int]', 'arr[1]': '2 [int]', 'arr[2]': '1 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaMatrix2D: LessonProgram = {
  id: 'java_matrix_2d',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 5,
  friendlyName: '2D Matrix Declaration & Traversal',
  learningObjective: 'Understand 2D array matrix row and column indexing in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'matrix' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '                ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'matrix' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'r' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Matrix Sum = "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Allocate 2D Matrix Grid int[][] matrix = {{1, 2}, {3, 4}} (2 rows, 2 cols).',
      explanationHinglish: 'Heap memory me 2x2 2D Matrix grid int[][] matrix allocate hua.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'matrix', value: '[[1, 2], [3, 4]]' }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Initialize sum = 0.',
      explanationHinglish: 'sum = 0 initialize hua.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    },
    {
      step: 3, lineNum: 7,
      explanationEnglish: 'Cell [0][0] = 1: sum += 1 -> sum = 1.',
      explanationHinglish: 'Row 0, Col 0 cell (val=1) sum me add hua -> sum = 1.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '1 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: 0, newValue: 1 }
    },
    {
      step: 4, lineNum: 7,
      explanationEnglish: 'Cell [0][1] = 2: sum += 2 -> sum = 3.',
      explanationHinglish: 'Row 0, Col 1 cell (val=2) sum me add hua -> sum = 3.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '3 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: 1, newValue: 3 }
    },
    {
      step: 5, lineNum: 7,
      explanationEnglish: 'Cell [1][0] = 3: sum += 3 -> sum = 6.',
      explanationHinglish: 'Row 1, Col 0 cell (val=3) sum me add hua -> sum = 6.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '6 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: 3, newValue: 6 }
    },
    {
      step: 6, lineNum: 7,
      explanationEnglish: 'Cell [1][1] = 4: sum += 4 -> sum = 10.',
      explanationHinglish: 'Row 1, Col 1 cell (val=4) sum me add hua -> sum = 10.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '10 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: 6, newValue: 10 }
    },
    {
      step: 7, lineNum: 10,
      explanationEnglish: 'System.out.println prints Matrix Sum = 10.',
      explanationHinglish: 'Console pe "Matrix Sum = 10" print hua.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '10 [int]' },
      consoleOutput: 'Matrix Sum = 10',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: 10 }
    },
    {
      step: 8, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 'matrix[0][0]': '1 [int]', 'matrix[0][1]': '2 [int]', 'matrix[1][0]': '3 [int]', 'matrix[1][1]': '4 [int]', sum: '10 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaDiagonalSum2D: LessonProgram = {
  id: 'java_diagonal_sum_2d',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 6,
  friendlyName: 'Primary Diagonal Sum of 2D Matrix',
  learningObjective: 'Learn matrix primary diagonal indexing (matrix[i][i]) in Java 2D arrays.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '8' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '9' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Diagonal Sum = "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Allocate 2x2 Matrix mat = {{5, 8}, {3, 9}}.',
      explanationHinglish: '2x2 Matrix mat = {{5, 8}, {3, 9}} allocate hua.',
      memorySnapshot: { 'mat[0][0]': '5 [int]', 'mat[0][1]': '8 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '9 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: '[[5, 8], [3, 9]]' }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Initialize diagSum = 0.',
      explanationHinglish: 'diagSum = 0 initialize hua.',
      memorySnapshot: { 'mat[0][0]': '5 [int]', 'mat[0][1]': '8 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '9 [int]', diagSum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'diagSum', value: 0 }
    },
    {
      step: 3, lineNum: 6,
      explanationEnglish: 'Primary diagonal cell [0][0] = 5: diagSum += 5 -> diagSum = 5.',
      explanationHinglish: 'Diagonal element mat[0][0]=5 sum me add hua -> diagSum = 5.',
      memorySnapshot: { 'mat[0][0]': '5 [int]', 'mat[0][1]': '8 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '9 [int]', diagSum: '5 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'diagSum', oldValue: 0, newValue: 5 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'Primary diagonal cell [1][1] = 9: diagSum += 9 -> diagSum = 14.',
      explanationHinglish: 'Diagonal element mat[1][1]=9 sum me add hua -> diagSum = 14.',
      memorySnapshot: { 'mat[0][0]': '5 [int]', 'mat[0][1]': '8 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '9 [int]', diagSum: '14 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'diagSum', oldValue: 5, newValue: 14 }
    },
    {
      step: 5, lineNum: 8,
      explanationEnglish: 'System.out.println prints Diagonal Sum = 14.',
      explanationHinglish: 'Console pe "Diagonal Sum = 14" print hua.',
      memorySnapshot: { 'mat[0][0]': '5 [int]', 'mat[0][1]': '8 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '9 [int]', diagSum: '14 [int]' },
      consoleOutput: 'Diagonal Sum = 14',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'diagSum', outputValue: 14 }
    },
    {
      step: 6, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 'mat[0][0]': '5 [int]', 'mat[0][1]': '8 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '9 [int]', diagSum: '14 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaMatrixTranspose: LessonProgram = {
  id: 'java_matrix_transpose',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 7,
  friendlyName: '2D Matrix Transpose',
  learningObjective: 'Learn row-column swapping matrix transposition in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 't' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'new' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 't' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '1' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '0' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Transposed Matrix"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  generateSteps: (): ExecutionStep[] => [
    {
      step: 1, lineNum: 3,
      explanationEnglish: 'Allocate mat = {{1, 2}, {3, 4}}.',
      explanationHinglish: 'Matrix mat = {{1, 2}, {3, 4}} allocate hua.',
      memorySnapshot: { 'mat[0][0]': '1 [int]', 'mat[0][1]': '2 [int]', 'mat[1][0]': '3 [int]', 'mat[1][1]': '4 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: '[[1, 2], [3, 4]]' }
    },
    {
      step: 2, lineNum: 4,
      explanationEnglish: 'Allocate empty 2x2 matrix t[][].',
      explanationHinglish: 'Empty matrix t[][] allocate hua.',
      memorySnapshot: { 't[0][0]': '0 [int]', 't[0][1]': '0 [int]', 't[1][0]': '0 [int]', 't[1][1]': '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 't', value: '[[0, 0], [0, 0]]' }
    },
    {
      step: 3, lineNum: 5,
      explanationEnglish: 'Transpose swap: t[0][1] = mat[1][0] (3).',
      explanationHinglish: 'Row-column transpose: t[0][1] = mat[1][0] = 3 set hua.',
      memorySnapshot: { 't[0][0]': '1 [int]', 't[0][1]': '3 [int]', 't[1][0]': '2 [int]', 't[1][1]': '4 [int]' },
      animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 't', oldValue: 0, newValue: 3 }
    },
    {
      step: 4, lineNum: 6,
      explanationEnglish: 'System.out.println prints Transposed Matrix.',
      explanationHinglish: 'Console pe "Transposed Matrix" print hua.',
      memorySnapshot: { 't[0][0]': '1 [int]', 't[0][1]': '3 [int]', 't[1][0]': '2 [int]', 't[1][1]': '4 [int]' },
      consoleOutput: 'Transposed Matrix',
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 't', outputValue: '[[1, 3], [2, 4]]' }
    },
    {
      step: 5, lineNum: 7,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { 't[0][0]': '1 [int]', 't[0][1]': '3 [int]', 't[1][0]': '2 [int]', 't[1][1]': '4 [int]' },
      animationEvent: { type: 'COMPLETE' as const }
    }
  ],
  executionSteps: []
};

export const javaSwapNoTemp: LessonProgram = {
  id: 'java_swap_no_temp',
  language: 'java',
  topic: 'variables',
  lessonNumber: 2,
  friendlyName: 'Swap Two Variables (Without Temp Variable)',
  learningObjective: 'Swap two integer variables using arithmetic addition and subtraction.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'a' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"a: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '", b: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    a: { default: 5, min: 1, max: 100, label: 'a (int)' },
    b: { default: 10, min: 1, max: 100, label: 'b (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let aVal = Number(vars.a ?? 5);
    let bVal = Number(vars.b ?? 10);
    const sum = aVal + bVal;
    const newB = sum - bVal;
    const newA = sum - newB;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize a = ${aVal}, b = ${bVal}.`,
        explanationHinglish: `a = ${aVal} aur b = ${bVal} declare hua.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'a', value: aVal }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `a = a + b -> ${aVal} + ${bVal} = ${sum}.`,
        explanationHinglish: `a me total sum (${sum}) store hua.`,
        memorySnapshot: { a: `${sum} [int]`, b: `${bVal} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: aVal, newValue: sum }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `b = a - b -> ${sum} - ${bVal} = ${newB}. Original a restored into b!`,
        explanationHinglish: `b = ${sum} - ${bVal} = ${newB}. Original a ki value b me aa gayi!`,
        memorySnapshot: { a: `${sum} [int]`, b: `${newB} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'b', oldValue: bVal, newValue: newB }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `a = a - b -> ${sum} - ${newB} = ${newA}. Swapping complete!`,
        explanationHinglish: `a = ${sum} - ${newB} = ${newA}. Swapping without temp complete!`,
        memorySnapshot: { a: `${newA} [int]`, b: `${newB} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: sum, newValue: newA }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `System.out.println prints a: ${newA}, b: ${newB}.`,
        explanationHinglish: `Console pe "a: ${newA}, b: ${newB}" print hua.`,
        memorySnapshot: { a: `${newA} [int]`, b: `${newB} [int]` },
        consoleOutput: `a: ${newA}, b: ${newB}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'a', outputValue: `${newA}, ${newB}` }
      }
    ];
  },
  executionSteps: []
};

export const javaWidening: LessonProgram = {
  id: 'java_widening',
  language: 'java',
  topic: 'type_casting',
  lessonNumber: 2,
  friendlyName: 'Automatic Widening Type Casting',
  learningObjective: 'Understand automatic conversion from smaller int [4B] to larger double [8B].',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '42', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'wideNum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Wide: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'wideNum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 42, min: 1, max: 1000, label: 'num (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const val = Number(vars.num ?? 42);
    const wideVal = val.toFixed(1);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int num = ${val} [4 Bytes].`,
        explanationHinglish: `int num = ${val} declare hua (4 Bytes).`,
        memorySnapshot: { num: `${val} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: val }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Automatic widening: int ${val} is automatically converted to double ${wideVal} [8 Bytes].`,
        explanationHinglish: `Automatic widening: int (${val}) double (${wideVal}) me convert ho gaya. No precision loss!`,
        memorySnapshot: { num: `${val} [int]`, wideNum: `${wideVal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'wideNum', value: wideVal }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints wideNum: ${wideVal}.`,
        explanationHinglish: `Console pe "Wide: ${wideVal}" print hua.`,
        memorySnapshot: { num: `${val} [int]`, wideNum: `${wideVal} [double]` },
        consoleOutput: `Wide: ${wideVal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'wideNum', outputValue: wideVal }
      }
    ];
  },
  executionSteps: []
};

export const javaSimpleInterest: LessonProgram = {
  id: 'java_simple_interest',
  language: 'java',
  topic: 'operators_expressions',
  lessonNumber: 3,
  friendlyName: 'Simple Interest Calculator',
  learningObjective: 'Compute interest formula (P * R * T) / 100 using double arithmetic expressions.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'P' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10000', paramId: 'P' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'R' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5.5', paramId: 'R' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'T' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'T' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'SI' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'P' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'R' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'T' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Interest: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'SI' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    P: { default: 10000, min: 1000, max: 100000, label: 'P (Principal)' },
    R: { default: 5.5, min: 1, max: 20, label: 'R (Rate %)' },
    T: { default: 2, min: 1, max: 10, label: 'T (Time Years)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const p = Number(vars.P ?? 10000);
    const r = Number(vars.R ?? 5.5);
    const t = Number(vars.T ?? 2);
    const si = (p * r * t) / 100;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize P = ${p}, R = ${r}%, T = ${t} years.`,
        explanationHinglish: `P = ${p}, R = ${r}%, T = ${t} years declare hue.`,
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'P', value: p }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Compute SI = (${p} * ${r} * ${t}) / 100 = ${si}.`,
        explanationHinglish: `SI calculate hua -> (${p} * ${r} * ${t}) / 100 = ${si}.`,
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]`, SI: `${si} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'SI', value: si }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Interest: ${si}.`,
        explanationHinglish: `Console pe "Interest: ${si}" print hua.`,
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]`, SI: `${si} [double]` },
        consoleOutput: `Interest: ${si}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'SI', outputValue: String(si) }
      }
    ];
  },
  executionSteps: []
};

export const javaPosNegZero: LessonProgram = {
  id: 'java_pos_neg_zero',
  language: 'java',
  topic: 'if_elif_else',
  lessonNumber: 3,
  friendlyName: 'Positive, Negative or Zero Checker',
  learningObjective: 'Classify any integer into Positive, Negative, or Zero using an if-else if ladder.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '-7', paramId: 'num' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Positive"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Negative"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Zero"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: -7, min: -100, max: 100, label: 'num (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const val = Number(vars.num ?? -7);
    const result = val > 0 ? 'Positive' : val < 0 ? 'Negative' : 'Zero';
    const lineToExec = val > 0 ? 5 : val < 0 ? 7 : 9;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int num = ${val}.`,
        explanationHinglish: `num = ${val} set hua.`,
        memorySnapshot: { num: `${val} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: val }
      },
      {
        step: 2, lineNum: val > 0 ? 4 : 6,
        explanationEnglish: `Check condition for ${val}: evaluates to ${result}.`,
        explanationHinglish: `${val} ke liye check hua -> condition Result: ${result}.`,
        memorySnapshot: { num: `${val} [int]` },
        animationEvent: { type: 'NONE' as const }
      },
      {
        step: 3, lineNum: lineToExec,
        explanationEnglish: `System.out.println prints "${result}".`,
        explanationHinglish: `Console pe "${result}" print hua.`,
        memorySnapshot: { num: `${val} [int]` },
        consoleOutput: result,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'num', outputValue: result }
      }
    ];
  },
  executionSteps: []
};

export const javaBmiCalc: LessonProgram = {
  id: 'java_bmi_calc',
  language: 'java',
  topic: 'if_elif_else',
  lessonNumber: 4,
  friendlyName: 'BMI Category Calculator',
  learningObjective: 'Calculate Body Mass Index (weight / height^2) and categorize health status.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'weight' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '70', paramId: 'weight' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'height' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1.75', paramId: 'height' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bmi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'weight' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'height' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'height' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"BMI: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bmi' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    weight: { default: 70, min: 40, max: 150, label: 'weight (kg)' },
    height: { default: 1.75, min: 1.2, max: 2.2, label: 'height (m)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const w = Number(vars.weight ?? 70);
    const h = Number(vars.height ?? 1.75);
    const bmiVal = Number((w / (h * h)).toFixed(2));
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize weight = ${w} kg, height = ${h} m.`,
        explanationHinglish: `weight = ${w} kg, height = ${h} m set hua.`,
        memorySnapshot: { weight: `${w} [double]`, height: `${h} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'weight', value: w }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Compute BMI = ${w} / (${h} * ${h}) = ${bmiVal}.`,
        explanationHinglish: `BMI calculate hua -> ${w} / (${h} * ${h}) = ${bmiVal}.`,
        memorySnapshot: { weight: `${w} [double]`, height: `${h} [double]`, bmi: `${bmiVal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'bmi', value: bmiVal }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints BMI: ${bmiVal}.`,
        explanationHinglish: `Console pe "BMI: ${bmiVal}" print hua.`,
        memorySnapshot: { weight: `${w} [double]`, height: `${h} [double]`, bmi: `${bmiVal} [double]` },
        consoleOutput: `BMI: ${bmiVal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'bmi', outputValue: String(bmiVal) }
      }
    ];
  },
  executionSteps: []
};

export const javaElectricityBill: LessonProgram = {
  id: 'java_electricity_bill',
  language: 'java',
  topic: 'if_elif_else',
  lessonNumber: 5,
  friendlyName: 'Electricity Bill Slab Calculator',
  learningObjective: 'Calculate tiered utility electricity bills by unit consumption slabs.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '150', paramId: 'units' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bill' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '5.0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Bill: ₹"' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bill' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    units: { default: 150, min: 10, max: 1000, label: 'units (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const u = Number(vars.units ?? 150);
    const billVal = u * 5.0;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize units = ${u}.`,
        explanationHinglish: `units = ${u} set hua.`,
        memorySnapshot: { units: `${u} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'units', value: u }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Compute bill = ${u} * 5.0 = ₹${billVal}.`,
        explanationHinglish: `Bill calculate hua -> ${u} * ₹5.0 = ₹${billVal}.`,
        memorySnapshot: { units: `${u} [int]`, bill: `${billVal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'bill', value: billVal }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Bill: ₹${billVal}.`,
        explanationHinglish: `Console pe "Bill: ₹${billVal}" print hua.`,
        memorySnapshot: { units: `${u} [int]`, bill: `${billVal} [double]` },
        consoleOutput: `Bill: ₹${billVal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'bill', outputValue: String(billVal) }
      }
    ];
  },
  executionSteps: []
};

export const javaFibonacciFor: LessonProgram = {
  id: 'java_fibonacci_for',
  language: 'java',
  topic: 'for_loop',
  lessonNumber: 3,
  friendlyName: 'Fibonacci Series Generator (For Loop)',
  learningObjective: 'Generate N Fibonacci terms (0, 1, 1, 2, 3, 5...) using variable swapping in a for loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fibonacci Series:"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '" "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 2, max: 15, label: 'n terms (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const limit = Number(vars.n ?? 5);
    let aVal = 0;
    let bVal = 1;
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize n = ${limit}, a = 0, b = 1.`,
        explanationHinglish: `n = ${limit}, a = 0, b = 1 initial terms declare hue.`,
        memorySnapshot: { n: `${limit} [int]`, a: '0 [int]', b: '1 [int]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: limit }
      }
    ];

    let output = '';
    for (let i = 1; i <= Math.min(limit, 5); i++) {
      output += aVal + ' ';
      const cVal = aVal + bVal;
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Term ${i}: Output ${aVal}.`,
        explanationHinglish: `Term ${i}: ${aVal} output hua. Next c = ${aVal} + ${bVal} = ${cVal}.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${aVal} [int]`, b: `${bVal} [int]`, i: `${i} [int]` },
        consoleOutput: output.trim(),
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'a', outputValue: String(aVal) }
      });
      aVal = bVal;
      bVal = cVal;
    }
    return steps;
  },
  executionSteps: []
};

export const javaEvenNumbers: LessonProgram = {
  id: 'java_even_numbers',
  language: 'java',
  topic: 'for_loop',
  lessonNumber: 4,
  friendlyName: 'Print Even Numbers up to N',
  learningObjective: 'Loop with step increment (i += 2) to filter even numbers.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 10, min: 2, max: 20, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const limit = Number(vars.n ?? 10);
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize limit n = ${limit}.`,
        explanationHinglish: `n = ${limit} set hua.`,
        memorySnapshot: { n: `${limit} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: limit }
      }
    ];

    for (let i = 2; i <= Math.min(limit, 8); i += 2) {
      steps.push({
        step: steps.length + 1, lineNum: 5,
        explanationEnglish: `Print even number i = ${i}.`,
        explanationHinglish: `Console pe even number ${i} print hua.`,
        memorySnapshot: { n: `${limit} [int]`, i: `${i} [int]` },
        consoleOutput: String(i),
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'i', outputValue: String(i) }
      });
    }
    return steps;
  },
  executionSteps: []
};

export const javaPowerCalc: LessonProgram = {
  id: 'java_power_calc',
  language: 'java',
  topic: 'for_loop',
  lessonNumber: 5,
  friendlyName: 'Power of a Number (base^exp)',
  learningObjective: 'Compute exponential power by repeated multiplication inside a for loop.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'base' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'base' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'exp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'exp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'long' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'result' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'exp' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'result' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'base' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Result: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'result' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    base: { default: 2, min: 1, max: 10, label: 'base (int)' },
    exp: { default: 5, min: 1, max: 10, label: 'exp (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const b = Number(vars.base ?? 2);
    const e = Number(vars.exp ?? 5);
    const ans = Math.pow(b, e);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize base = ${b}, exp = ${e}.`,
        explanationHinglish: `base = ${b}, exp = ${e} set hua.`,
        memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'base', value: b }
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: `Multiply result repeatedly: ${b}^${e} = ${ans}.`,
        explanationHinglish: `Loop complete: ${b}^${e} = ${ans} calculate hua.`,
        memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${ans} [long]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'result', value: ans }
      },
      {
        step: 3, lineNum: 8,
        explanationEnglish: `System.out.println prints Result: ${ans}.`,
        explanationHinglish: `Console pe "Result: ${ans}" print hua.`,
        memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${ans} [long]` },
        consoleOutput: `Result: ${ans}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'result', outputValue: String(ans) }
      }
    ];
  },
  executionSteps: []
};

export const javaPalindromeNum: LessonProgram = {
  id: 'java_palindrome_num',
  language: 'java',
  topic: 'while_loop',
  lessonNumber: 5,
  friendlyName: 'Palindrome Number Checker',
  learningObjective: 'Check if integer reading forward and backward is identical (e.g., 121 -> 121).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '121', paramId: 'num' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'boolean' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPalindrome' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Palindrome: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPalindrome' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 121, min: 10, max: 9999, label: 'num (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const original = Number(vars.num ?? 121);
    const rev = Number(String(original).split('').reverse().join(''));
    const isPal = original === rev;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize original num = ${original}.`,
        explanationHinglish: `original num = ${original} set hua.`,
        memorySnapshot: { num: `${original} [int]`, original: `${original} [int]`, rev: '0 [int]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'original', value: original }
      },
      {
        step: 2, lineNum: 8,
        explanationEnglish: `Reversed num = ${rev}. Compare original (${original}) == rev (${rev}): ${isPal}.`,
        explanationHinglish: `Reverse Number = ${rev}. ${original} == ${rev} -> ${isPal}.`,
        memorySnapshot: { original: `${original} [int]`, rev: `${rev} [int]`, isPalindrome: `${isPal} [boolean]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'isPalindrome', value: isPal ? 'true' : 'false' }
      },
      {
        step: 3, lineNum: 9,
        explanationEnglish: `System.out.println prints Palindrome: ${isPal}.`,
        explanationHinglish: `Console pe "Palindrome: ${isPal}" print hua.`,
        memorySnapshot: { original: `${original} [int]`, rev: `${rev} [int]`, isPalindrome: `${isPal} [boolean]` },
        consoleOutput: `Palindrome: ${isPal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'isPalindrome', outputValue: String(isPal) }
      }
    ];
  },
  executionSteps: []
};

export const javaDoWhileSum: LessonProgram = {
  id: 'java_do_while_sum',
  language: 'java',
  topic: 'do_while_loop',
  lessonNumber: 2,
  friendlyName: 'Accumulator Loop (Do-While Loop)',
  learningObjective: 'Accumulate numbers inside a do-while loop guaranteed to run at least once.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1', paramId: 'count' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'do' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'count' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Total Sum: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    count: { default: 1, min: 1, max: 5, label: 'start count (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let c = Number(vars.count ?? 1);
    let s = 0;
    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize count = ${c}, sum = 0.`,
        explanationHinglish: `count = ${c}, sum = 0 set hua.`,
        memorySnapshot: { count: `${c} [int]`, sum: '0 [int]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'count', value: c }
      }
    ];

    do {
      s += c;
      c++;
    } while (c <= 5);

    steps.push({
      step: 2, lineNum: 8,
      explanationEnglish: `Do-while loop accumulated total sum = ${s}.`,
      explanationHinglish: `Do-while loop complete -> Total Sum = ${s}.`,
      memorySnapshot: { count: `${c} [int]`, sum: `${s} [int]` },
      consoleOutput: `Total Sum: ${s}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: String(s) }
    });
    return steps;
  },
  executionSteps: []
};

export const javaStringConcat: LessonProgram = {
  id: 'java_string_concat',
  language: 'java',
  topic: 'strings',
  lessonNumber: 2,
  friendlyName: 'String Concatenation & Length',
  learningObjective: 'Join String objects using + operator and inspect string .length().',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'greeting' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Hello"' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Java"' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fullMsg' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'greeting' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '", "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'fullMsg' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const msg = 'Hello, Java';
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Initialize String greeting = "Hello", name = "Java".',
        explanationHinglish: 'greeting = "Hello", name = "Java" initialize hue.',
        memorySnapshot: { greeting: '"Hello" [String]', name: '"Java" [String]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'greeting', value: '"Hello"' }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'Concatenate: greeting + ", " + name -> "Hello, Java".',
        explanationHinglish: 'String concatenate hoke fullMsg = "Hello, Java" bana.',
        memorySnapshot: { greeting: '"Hello" [String]', name: '"Java" [String]', fullMsg: '"Hello, Java" [String]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'fullMsg', value: '"Hello, Java"' }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: 'System.out.println prints "Hello, Java".',
        explanationHinglish: 'Console pe "Hello, Java" print hua.',
        memorySnapshot: { greeting: '"Hello" [String]', name: '"Java" [String]', fullMsg: '"Hello, Java" [String]' },
        consoleOutput: msg,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'fullMsg', outputValue: msg }
      }
    ];
  },
  executionSteps: []
};

export const javaScannerNumber: LessonProgram = {
  id: 'java_scanner_number',
  language: 'java',
  topic: 'user_input',
  lessonNumber: 1,
  friendlyName: 'Read User Integer Input (Scanner.nextInt)',
  learningObjective: 'Learn Scanner initialization and integer user input reading with sc.nextInt().',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'import' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'java.util.Scanner' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'Scanner' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sc' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'new' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Scanner' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'System.in' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter age: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'age' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sc' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'nextInt' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'comment', value: '// Reads integer' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Your age is: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'age' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    age: { default: 21, min: 1, max: 100, label: 'sc.nextInt() value' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const userAge = Number(vars.age ?? 21);
    return [
      {
        step: 1, lineNum: 4,
        explanationEnglish: 'Initialize Scanner object sc connected to System.in.',
        explanationHinglish: 'Scanner object sc (System.in) initialize hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sc', value: 'Scanner' }
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: 'System.out.print prompt: "Enter age: ".',
        explanationHinglish: 'Console pe prompt: "Enter age: " print hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        consoleOutput: 'Enter age: ',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sc', outputValue: 'Enter age: ' }
      },
      {
        step: 3, lineNum: 6,
        explanationEnglish: `sc.nextInt() reads user integer input -> ${userAge}.`,
        explanationHinglish: `sc.nextInt() ne console se input ${userAge} read kiya. age = ${userAge} store hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', age: `${userAge} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'age', value: userAge }
      },
      {
        step: 4, lineNum: 7,
        explanationEnglish: `System.out.println prints Your age is: ${userAge}.`,
        explanationHinglish: `Console pe "Your age is: ${userAge}" print hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', age: `${userAge} [int]` },
        consoleOutput: `Enter age: \nYour age is: ${userAge}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'age', outputValue: String(userAge) }
      }
    ];
  },
  executionSteps: []
};

export const javaScannerFloat: LessonProgram = {
  id: 'java_scanner_float',
  language: 'java',
  topic: 'user_input',
  lessonNumber: 2,
  friendlyName: 'Read User Double Input (Scanner.nextDouble)',
  learningObjective: 'Read decimal floating point input from user using sc.nextDouble().',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'import' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'java.util.Scanner' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'Scanner' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sc' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'new' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Scanner' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'System.in' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter salary: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'salary' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sc' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'nextDouble' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Salary: ₹"' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'salary' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    salary: { default: 45000.5, min: 1000, max: 200000, label: 'sc.nextDouble() value' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const sal = Number(vars.salary ?? 45000.5);
    return [
      {
        step: 1, lineNum: 4,
        explanationEnglish: 'Initialize Scanner object sc.',
        explanationHinglish: 'Scanner object sc declare hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sc', value: 'Scanner' }
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: `sc.nextDouble() reads decimal input -> ${sal}.`,
        explanationHinglish: `sc.nextDouble() ne decimal input ${sal} read kiya. salary = ${sal} store hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', salary: `${sal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'salary', value: sal }
      },
      {
        step: 3, lineNum: 7,
        explanationEnglish: `System.out.println prints Salary: ₹${sal}.`,
        explanationHinglish: `Console pe "Salary: ₹${sal}" print hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', salary: `${sal} [double]` },
        consoleOutput: `Salary: ₹${sal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'salary', outputValue: String(sal) }
      }
    ];
  },
  executionSteps: []
};

export const javaScannerString: LessonProgram = {
  id: 'java_scanner_string',
  language: 'java',
  topic: 'user_input',
  lessonNumber: 3,
  friendlyName: 'Read User String Line (Scanner.nextLine)',
  learningObjective: 'Read full text line input from user using sc.nextLine().',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'import' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'java.util.Scanner' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'Scanner' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sc' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'new' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Scanner' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'System.in' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.print' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Enter full name: "' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sc' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'nextLine' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Welcome, "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {},
  generateSteps: (): ExecutionStep[] => {
    const strName = 'Rahul Sharma';
    return [
      {
        step: 1, lineNum: 4,
        explanationEnglish: 'Initialize Scanner object sc.',
        explanationHinglish: 'Scanner object sc initialize hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sc', value: 'Scanner' }
      },
      {
        step: 2, lineNum: 6,
        explanationEnglish: `sc.nextLine() reads string line input -> "${strName}".`,
        explanationHinglish: `sc.nextLine() ne string line "${strName}" read ki. name = "${strName}" store hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', name: `"${strName}" [String]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'name', value: `"${strName}"` }
      },
      {
        step: 3, lineNum: 7,
        explanationEnglish: `System.out.println prints Welcome, ${strName}.`,
        explanationHinglish: `Console pe "Welcome, ${strName}" print hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', name: `"${strName}" [String]` },
        consoleOutput: `Welcome, ${strName}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'name', outputValue: `Welcome, ${strName}` }
      }
    ];
  },
  executionSteps: []
};

// Export all Java lessons map
export const javaLessons = {
  java_types: javaTypes,
  java_casting: javaCasting,
  java_ascii: javaAscii,
  java_temp_convert: javaTempConvert,
  java_circle_area: javaCircleArea,
  java_swap_temp: javaSwapTemp,
  java_swap_no_temp: javaSwapNoTemp,
  java_widening: javaWidening,
  java_simple_interest: javaSimpleInterest,
  java_scanner_number: javaScannerNumber,
  java_scanner_float: javaScannerFloat,
  java_scanner_string: javaScannerString,
  java_even_odd: javaEvenOdd,
  java_largest_three: javaLargestThree,
  java_grade: javaGrade,
  java_tax_calc: javaTaxCalc,
  java_pos_neg_zero: javaPosNegZero,
  java_bmi_calc: javaBmiCalc,
  java_electricity_bill: javaElectricityBill,
  java_leap_year: javaLeapYear,
  java_vowel_if: javaVowelIf,
  java_switch_day: javaSwitchDay,
  java_switch_vowel: javaSwitchVowel,
  java_switch_calc: javaSwitchCalc,
  java_switch_month: javaSwitchMonth,
  java_switch_grade: javaSwitchGrade,
  java_for_sum: javaForSum,
  java_fibonacci_for: javaFibonacciFor,
  java_even_numbers: javaEvenNumbers,
  java_power_calc: javaPowerCalc,
  java_while_digits: javaWhileDigits,
  java_factorial: javaFactorial,
  java_do_while: javaDoWhile,
  java_do_while_sum: javaDoWhileSum,
  java_multiplication_table: javaMultiplicationTable,
  java_reverse_num: javaReverseNum,
  java_prime_check: javaPrimeCheck,
  java_palindrome_num: javaPalindromeNum,
  java_string_concat: javaStringConcat,
  java_array_sum_1d: javaArraySum1D,
  java_array_max_1d: javaArrayMax1D,
  java_linear_search: javaLinearSearch,
  java_array_reverse: javaArrayReverse,
  java_matrix_2d: javaMatrix2D,
  java_diagonal_sum_2d: javaDiagonalSum2D,
  java_matrix_transpose: javaMatrixTranspose,
};
