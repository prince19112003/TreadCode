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
        step: 1, lineNum: 3,
        explanationEnglish: `Declare 32-bit primitive integer int score = ${score} (4 bytes).`,
        explanationHinglish: `Java stack memory me 4-byte int variable 'score' (${score}) allocate hua.`,
        memorySnapshot: { score: `${score} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'score', value: score }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare 64-bit double precision gpa = ${gpa} (8 bytes).`,
        explanationHinglish: `Double variable 'gpa' (${gpa}) 8-byte floating point memory slot me store hua.`,
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'gpa', value: gpa }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: "Declare 16-bit Unicode char grade = 'A' (2 bytes).",
        explanationHinglish: "Character variable 'grade' ('A') 2-byte Unicode slot me store hua.",
        memorySnapshot: { score: `${score} [int]`, gpa: `${gpa} [double]`, grade: "'A' [char]" },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'grade', value: "'A'" }
      },
      {
        step: 4, lineNum: 6,
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'", paramId: 'ch' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'asciiCode' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"ASCII: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'asciiCode' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    ch: { default: "'A'", type: 'text', label: 'Character ch' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawCh = String(vars?.ch ?? 'A').replace(/['"]/g, '') || 'A';
    const ch = rawCh.charAt(0);
    const asciiCode = ch.charCodeAt(0);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare char ch = '${ch}'.`,
        explanationHinglish: `Character variable ch = '${ch}' memory me store hua.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: `'${ch}'` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Implicit Widening: '${ch}' automatically converts to integer ASCII code ${asciiCode}.`,
        explanationHinglish: `Automatic type conversion se '${ch}' ka ASCII code ${asciiCode} int variable asciiCode me store ho gaya.`,
        memorySnapshot: { ch: `'${ch}' [char]`, asciiCode: `${asciiCode} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'asciiCode', value: asciiCode }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints ASCII: ${asciiCode}.`,
        explanationHinglish: `System.out.println se ASCII: ${asciiCode} print hua.`,
        memorySnapshot: { ch: `'${ch}' [char]`, asciiCode: `${asciiCode} [int]` },
        consoleOutput: `ASCII: ${asciiCode}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'asciiCode', outputValue: `ASCII: ${asciiCode}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { ch: `'${ch}' [char]`, asciiCode: `${asciiCode} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaTempConvert: LessonProgram = {
  id: 'java_temp_convert',
  language: 'java',
  topic: 'operators_expressions',
  lessonNumber: 1,
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
        explanationEnglish: `Declare double celsius = ${cel}.`,
        explanationHinglish: `Variable celsius = ${cel} store hua.`,
        memorySnapshot: { celsius: `${cel} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'celsius', value: cel }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Evaluate formula: (${cel} * 9.0 / 5.0) + 32.0 -> Result ${fah}.`,
        explanationHinglish: `celsius (${cel}) substitute karke formula calculate kiya: (${cel} * 9.0 / 5.0) + 32.0 = ${fah}.`,
        memorySnapshot: { celsius: `${cel} [double]`, fahrenheit: `${fah} [double]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['celsius', '9', '5', '32'],
          operator: '* / +',
          storeIn: 'fahrenheit',
          result: fah
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Fahrenheit: ${fah}.`,
        explanationHinglish: `System.out.println se "Fahrenheit: ${fah}" print hua.`,
        memorySnapshot: { celsius: `${cel} [double]`, fahrenheit: `${fah} [double]` },
        consoleOutput: `Fahrenheit: ${fah}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Fahrenheit: ${fah}` }
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
  topic: 'operators_expressions',
  lessonNumber: 2,
  friendlyName: 'Area & Circumference of Circle',
  learningObjective: 'Learn floating point math formulas using double precision in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7.0', paramId: 'r' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14159' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'r' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Area: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'area' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    r: { default: 7.0, min: 1, max: 50, label: 'r (radius)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rVal = Number(vars.r ?? 7.0);
    const areaVal = Math.round(3.14159 * rVal * rVal * 100000) / 100000;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare double r = ${rVal}.`,
        explanationHinglish: `Radius r = ${rVal} store hua.`,
        memorySnapshot: { r: `${rVal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'r', value: rVal }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Calculate area formula: 3.14159 * ${rVal} * ${rVal} -> Result ${areaVal}.`,
        explanationHinglish: `Radius (${rVal}) substitute karke circle area calculate kiya: 3.14159 * ${rVal} * ${rVal} = ${areaVal}.`,
        memorySnapshot: { r: `${rVal} [double]`, area: `${areaVal} [double]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['3.14159', 'r', 'r'],
          operator: '* *',
          storeIn: 'area',
          result: areaVal
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Area: ${areaVal}.`,
        explanationHinglish: `Console pe "Area: ${areaVal}" print hua.`,
        memorySnapshot: { r: `${rVal} [double]`, area: `${areaVal} [double]` },
        consoleOutput: `Area: ${areaVal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Area: ${areaVal}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { r: `${rVal} [double]`, area: `${areaVal} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
  editableVariables: {
    a: { default: 10, min: 1, max: 100, label: 'a (int)' },
    b: { default: 20, min: 1, max: 100, label: 'b (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const aVal = Number(vars.a ?? 10);
    const bVal = Number(vars.b ?? 20);

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int a = ${aVal}, b = ${bVal}.`,
        explanationHinglish: `a = ${aVal} aur b = ${bVal} declare hue.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]` },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: aVal }, { name: 'b', value: bVal }] }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Backup a value into temp: temp = a (${aVal}).`,
        explanationHinglish: `a ki value (${aVal}) temp variable me store ki.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, temp: `${aVal} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'temp', value: aVal }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Assign b to a: a = b (${bVal}).`,
        explanationHinglish: `b (${bVal}) ki value a me copy hui -> a = ${bVal}.`,
        memorySnapshot: { a: `${bVal} [int]`, b: `${bVal} [int]`, temp: `${aVal} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: aVal, newValue: bVal }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `Assign temp to b: b = temp (${aVal}). Swapping complete!`,
        explanationHinglish: `temp (${aVal}) ki value b me copy hui -> b = ${aVal}. Swapping complete!`,
        memorySnapshot: { a: `${bVal} [int]`, b: `${aVal} [int]`, temp: `${aVal} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'b', oldValue: bVal, newValue: aVal }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: `System.out.println prints a: ${bVal}, b: ${aVal}.`,
        explanationHinglish: `Console pe "a: ${bVal}, b: ${aVal}" print hua.`,
        memorySnapshot: { a: `${bVal} [int]`, b: `${aVal} [int]`, temp: `${aVal} [int]` },
        consoleOutput: `a: ${bVal}, b: ${aVal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `a: ${bVal}, b: ${aVal}` }
      },
      {
        step: 6, lineNum: 8,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { a: `${bVal} [int]`, b: `${aVal} [int]`, temp: `${aVal} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
        explanationEnglish: `Evaluate condition ${num} % 2 == 0 -> ${isEven ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check ${num} % 2 == 0 -> ${isEven ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { num: `${num} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'num', variableValue: num, operator: '% 2 == 0', result: isEven }
      },
      isEven ? {
        step: 3, lineNum: 5,
        explanationEnglish: 'Condition true, execute if block: System.out.println("Even").',
        explanationHinglish: 'Condition true hui, "Even" print hua.',
        memorySnapshot: { num: `${num} [int]` },
        consoleOutput: 'Even',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Even' }
      } : {
        step: 3, lineNum: 7,
        explanationEnglish: 'Condition false, execute else block: System.out.println("Odd").',
        explanationHinglish: 'Condition false hui, "Odd" print hua.',
        memorySnapshot: { num: `${num} [int]` },
        consoleOutput: 'Odd',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Odd' }
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '45', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '89', paramId: 'b' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'c' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '23', paramId: 'c' }, { type: 'punctuation', value: ';' }] },
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
  editableVariables: {
    a: { default: 45, min: 1, max: 100, label: 'a (int)' },
    b: { default: 89, min: 1, max: 100, label: 'b (int)' },
    c: { default: 23, min: 1, max: 100, label: 'c (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const aVal = Number(vars.a ?? 45);
    const bVal = Number(vars.b ?? 89);
    const cVal = Number(vars.c ?? 23);

    const aIsLargest = aVal >= bVal && aVal >= cVal;
    const bIsLargest = !aIsLargest && bVal >= cVal;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int a=${aVal}, b=${bVal}, c=${cVal}.`,
        explanationHinglish: `Variables a=${aVal}, b=${bVal}, c=${cVal} initialize hue.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: aVal }, { name: 'b', value: bVal }, { name: 'c', value: cVal }] }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check (a >= b && a >= c): ${aVal} >= ${bVal} && ${aVal} >= ${cVal} -> ${aIsLargest ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check: ${aVal} >= ${bVal} && ${aVal} >= ${cVal} -> ${aIsLargest ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, formula: 'a >= b && a >= c', inputs: ['a', 'b', 'c'], result: aIsLargest }
      },
      ...(aIsLargest ? [
        {
          step: 3, lineNum: 5,
          explanationEnglish: 'a is largest, execute if block: System.out.println("a is largest").',
          explanationHinglish: 'a sabse bada hai, "a is largest" print hua.',
          memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
          consoleOutput: 'a is largest',
          animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'a is largest' }
        }
      ] : [
        {
          step: 3, lineNum: 6,
          explanationEnglish: `Check else if (b >= c): ${bVal} >= ${cVal} -> ${bIsLargest ? 'TRUE' : 'FALSE'}.`,
          explanationHinglish: `Condition check: ${bVal} >= ${cVal} -> ${bIsLargest ? 'TRUE' : 'FALSE'}.`,
          memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
          animationEvent: { type: 'EVALUATE_CONDITION' as const, formula: 'b >= c', inputs: ['b', 'c'], result: bIsLargest }
        },
        ...(bIsLargest ? [
          {
            step: 4, lineNum: 7,
            explanationEnglish: 'b is largest, execute branch: System.out.println("b is largest").',
            explanationHinglish: 'b sabse bada hai, "b is largest" print hua.',
            memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
            consoleOutput: 'b is largest',
            animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'b is largest' }
          }
        ] : [
          {
            step: 4, lineNum: 9,
            explanationEnglish: 'c is largest, execute else block: System.out.println("c is largest").',
            explanationHinglish: 'c sabse bada hai, "c is largest" print hua.',
            memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
            consoleOutput: 'c is largest',
            animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'c is largest' }
          }
        ])
      ]),
      {
        step: 5, lineNum: 11,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, c: `${cVal} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
    return steps;
  },
  executionSteps: []
};

export const javaLeapYear: LessonProgram = {
  id: 'java_leap_year',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 3,
  friendlyName: 'Leap Year Checker',
  learningObjective: 'Check leap year condition: divisible by 400 OR (divisible by 4 and not divisible by 100).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2024', paramId: 'year' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'text', value: ' ' }, { type: 'operator', value: '&&' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'text', value: ' ' }, { type: 'operator', value: '!=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'year' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '400' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Leap Year"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Not a Leap Year"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    year: { default: 2024, min: 1600, max: 2400, label: 'year (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const yr = Number(vars.year ?? 2024);
    const isLeap = (yr % 4 === 0 && yr % 100 !== 0) || (yr % 400 === 0);

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int year = ${yr}.`,
        explanationHinglish: `Variable year = ${yr} declare hua.`,
        memorySnapshot: { year: `${yr} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'year', value: yr }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Evaluate (${yr} % 4 == 0 && ${yr} % 100 != 0) || (${yr} % 400 == 0) -> ${isLeap ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Leap year condition check: (${yr} % 4 == 0 && ${yr} % 100 != 0) || (${yr} % 400 == 0) -> ${isLeap ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { year: `${yr} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'year', variableValue: yr, operator: `% 4==0 && %100!=0 || %400==0`, result: isLeap }
      },
      isLeap ? {
        step: 3, lineNum: 5,
        explanationEnglish: `Condition TRUE: System.out.println("Leap Year").`,
        explanationHinglish: `Condition TRUE hui, console pe "Leap Year" print hua.`,
        memorySnapshot: { year: `${yr} [int]` },
        consoleOutput: 'Leap Year',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Leap Year' }
      } : {
        step: 3, lineNum: 7,
        explanationEnglish: `Condition FALSE: System.out.println("Not a Leap Year").`,
        explanationHinglish: `Condition FALSE hui, console pe "Not a Leap Year" print hua.`,
        memorySnapshot: { year: `${yr} [int]` },
        consoleOutput: 'Not a Leap Year',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Not a Leap Year' }
      },
      {
        step: 4, lineNum: 9,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { year: `${yr} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'marks', variableValue: marks, operator: '>= 90', result: marks >= 90 }
      },
      ...(marks < 90 ? [{
        step: 3, lineNum: 6,
        explanationEnglish: `Check second condition: ${marks} >= 75 is ${marks >= 75 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusri condition check: ${marks} >= 75 -> ${marks >= 75 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { marks: `${marks} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'marks', variableValue: marks, operator: '>= 75', result: marks >= 75 }
      }] : []),
      {
        step: 4, lineNum: lineToExec,
        explanationEnglish: `Execute selected branch: System.out.println("${grade}").`,
        explanationHinglish: `Matching branch execute hoke "${grade}" print hua.`,
        memorySnapshot: { marks: `${marks} [int]` },
        consoleOutput: grade,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: grade }
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
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '1000000' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.30' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '500000' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'income' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '0.20' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'tax' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Tax: ₹"' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'tax' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    income: { default: 600000, min: 100000, max: 2000000, label: 'income (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const income = Number(vars.income ?? 600000);
    let tax = 0;
    if (income > 1000000) tax = income * 0.30;
    else if (income > 500000) tax = income * 0.20;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare double income = ${income}.`,
        explanationHinglish: `Variable income = ${income} store hua.`,
        memorySnapshot: { income: `${income} [double]`, tax: '0.0 [double]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'income', value: income }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: 'Declare double tax = 0.0.',
        explanationHinglish: 'Variable tax = 0.0 initialize hua.',
        memorySnapshot: { income: `${income} [double]`, tax: '0.0 [double]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'tax', value: '0.0' }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Check (income > 1000000): ${income} > 1000000 -> ${income > 1000000 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check: ${income} > 1000000 -> ${income > 1000000 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { income: `${income} [double]`, tax: '0.0 [double]' },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'income', variableValue: income, operator: '> 1000000', result: income > 1000000 }
      },
      ...(income > 1000000 ? [
        {
          step: 4, lineNum: 6,
          explanationEnglish: `Calculate 30% tax: ${income} * 0.30 = ${tax}.`,
          explanationHinglish: `30% slab me tax = ${tax} calculate hua.`,
          memorySnapshot: { income: `${income} [double]`, tax: `${tax} [double]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'tax', oldValue: 0, newValue: tax }
        }
      ] : [
        {
          step: 4, lineNum: 7,
          explanationEnglish: `Check else if (income > 500000): ${income} > 500000 -> ${income > 500000 ? 'TRUE' : 'FALSE'}.`,
          explanationHinglish: `Condition check: ${income} > 500000 -> ${income > 500000 ? 'TRUE' : 'FALSE'}.`,
          memorySnapshot: { income: `${income} [double]`, tax: '0.0 [double]' },
          animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'income', variableValue: income, operator: '> 500000', result: income > 500000 }
        },
        ...(income > 500000 ? [
          {
            step: 5, lineNum: 8,
            explanationEnglish: `Calculate 20% tax: ${income} * 0.20 = ${tax}.`,
            explanationHinglish: `20% slab me tax = ${tax} calculate hua.`,
            memorySnapshot: { income: `${income} [double]`, tax: `${tax} [double]` },
            animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'tax', oldValue: 0, newValue: tax }
          }
        ] : [
          {
            step: 5, lineNum: 10,
            explanationEnglish: 'No tax applicable (tax = 0).',
            explanationHinglish: '0% slab, tax = 0.',
            memorySnapshot: { income: `${income} [double]`, tax: '0.0 [double]' },
            animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'tax', oldValue: 0, newValue: 0 }
          }
        ])
      ]),
      {
        step: 6, lineNum: 12,
        explanationEnglish: `System.out.println prints Tax: ₹${tax}.`,
        explanationHinglish: `Console pe "Tax: ₹${tax}" print hua.`,
        memorySnapshot: { income: `${income} [double]`, tax: `${tax} [double]` },
        consoleOutput: `Tax: ₹${tax}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Tax: ₹${tax}` }
      },
      {
        step: 7, lineNum: 13,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { income: `${income} [double]`, tax: `${tax} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaVowelIf: LessonProgram = {
  id: 'java_vowel_if',
  language: 'java',
  topic: 'if_else',
  lessonNumber: 5,
  friendlyName: 'Vowel or Consonant Checker',
  learningObjective: 'Check whether a given character is a Vowel (a,e,i,o,u) or Consonant using if-else.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'", paramId: 'ch' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'text', value: ' ' }, { type: 'operator', value: '||' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Vowel"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Consonant"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    ch: { default: 'e', type: 'text', label: 'ch (char)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawCh = String(vars.ch ?? 'e').replace(/['"]/g, '');
    const ch = rawCh.length > 0 ? rawCh[0].toLowerCase() : 'e';
    const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(ch);

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare char ch = '${ch}'.`,
        explanationHinglish: `Character variable ch = '${ch}' declare hua.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: `'${ch}'` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check if '${ch}' is a vowel -> ${isVowel ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check: '${ch}' vowel ('a','e','i','o','u') hai? -> ${isVowel ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'ch', variableValue: `'${ch}'`, operator: `== 'a'||'e'||'i'||'o'||'u'`, result: isVowel }
      },
      isVowel ? {
        step: 3, lineNum: 5,
        explanationEnglish: `Condition TRUE: System.out.println("Vowel").`,
        explanationHinglish: `Condition TRUE hui, console pe "Vowel" print hua.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        consoleOutput: 'Vowel',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Vowel' }
      } : {
        step: 3, lineNum: 7,
        explanationEnglish: `Condition FALSE: System.out.println("Consonant").`,
        explanationHinglish: `Condition FALSE hui, console pe "Consonant" print hua.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        consoleOutput: 'Consonant',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Consonant' }
      },
      {
        step: 4, lineNum: 8,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Tuesday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Wednesday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Thursday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Friday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Saturday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sunday"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Invalid Day"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    day: { default: 3, min: 1, max: 7, label: 'day (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const day = Number(vars.day ?? 3);
    const dayNames: Record<number, string> = { 
      1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' 
    };
    const dayName = dayNames[day] || 'Invalid Day';
    const lineToExec = day >= 1 && day <= 7 ? day + 4 : 12;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int day = ${day}.`,
        explanationHinglish: `Variable day = ${day} store hua.`,
        memorySnapshot: { day: `${day} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'day', value: day }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Switch selector evaluates day = ${day} and jumps directly to matching case.`,
        explanationHinglish: `Switch selector day = ${day} ko evaluate karke direct matching case par jump karta hai.`,
        memorySnapshot: { day: `${day} [int]` },
        animationEvent: { type: 'MATCH_START' as const, variableName: 'day', value: day }
      },
      {
        step: 3, lineNum: lineToExec,
        explanationEnglish: `Direct jump to matching case ${day}: System.out.println("${dayName}").`,
        explanationHinglish: `Direct jump matching case ${day} par, "${dayName}" print hua.`,
        memorySnapshot: { day: `${day} [int]` },
        consoleOutput: dayName,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: dayName }
      },
      {
        step: 4, lineNum: lineToExec,
        explanationEnglish: 'Break execution: Exiting switch block.',
        explanationHinglish: 'Break execution: Switch block se bahar nikal rahe hain.',
        memorySnapshot: { day: `${day} [int]` },
        consoleOutput: dayName,
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
      },
      {
        step: 5, lineNum: 14,
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'ch' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'", paramId: 'ch' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'ch' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'a'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'e'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'i'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'o'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'u'" }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '                ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Vowel"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Consonant"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    ch: { default: 'e', type: 'text', label: 'ch (char)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawCh = String(vars.ch ?? 'e').replace(/['"]/g, '');
    const ch = rawCh.length > 0 ? rawCh[0].toLowerCase() : 'e';
    const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(ch);
    const output = isVowel ? 'Vowel' : 'Consonant';
    const lineToExec = isVowel ? 6 : 7;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare char ch = '${ch}'.`,
        explanationHinglish: `Character variable ch = '${ch}' store hua.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'ch', value: `'${ch}'` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Switch evaluates ch = '${ch}' and jumps directly to matching case.`,
        explanationHinglish: `Switch '${ch}' ko evaluate karke direct matching case par jump karta hai.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'MATCH_START' as const, variableName: 'ch', value: `'${ch}'` }
      },
      {
        step: 3, lineNum: lineToExec,
        explanationEnglish: `Execute case: System.out.println("${output}").`,
        explanationHinglish: `Console pe "${output}" print hua.`,
        memorySnapshot: { ch: `'${ch}' [char]` },
        consoleOutput: output,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: output }
      },
      ...(isVowel ? [
        {
          step: 4, lineNum: 6,
          explanationEnglish: 'Break execution: Exiting switch block.',
          explanationHinglish: 'Break execution: Switch block se bahar nikal rahe hain.',
          memorySnapshot: { ch: `'${ch}' [char]` },
          consoleOutput: output,
          animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
        }
      ] : []),
      {
        step: isVowel ? 5 : 4, lineNum: 9,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { ch: `'${ch}' [char]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '20', paramId: 'a' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'b' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'op' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'", paramId: 'op' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'op' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'+'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'-'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'*'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'/'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'a' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'b' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Result: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'res' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    a: { default: 20, min: 1, max: 100, label: 'a (int)' },
    b: { default: 5, min: 1, max: 100, label: 'b (int)' },
    op: { default: '*', type: 'text', label: 'op (char)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const aVal = Number(vars.a ?? 20);
    const bVal = Number(vars.b ?? 5);
    const rawOp = String(vars.op ?? '*').replace(/['"]/g, '');
    const op = rawOp.length > 0 ? rawOp[0] : '*';

    let res = 0;
    let lineToExec = 9;
    if (op === '+') { res = aVal + bVal; lineToExec = 7; }
    else if (op === '-') { res = aVal - bVal; lineToExec = 8; }
    else if (op === '*') { res = aVal * bVal; lineToExec = 9; }
    else if (op === '/') { res = bVal !== 0 ? Math.floor(aVal / bVal) : 0; lineToExec = 10; }

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize int a = ${aVal}, b = ${bVal}.`,
        explanationHinglish: `Variables a = ${aVal}, b = ${bVal} store hue.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]` },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: aVal }, { name: 'b', value: bVal }] }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Set char op = '${op}'.`,
        explanationHinglish: `Operator op = '${op}' set hua.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'op', value: `'${op}'` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: 'Initialize int res = 0.',
        explanationHinglish: 'Result variable res = 0 initialize hua.',
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]`, res: '0 [int]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'res', value: 0 }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `Switch evaluates op = '${op}' and jumps directly to matching case.`,
        explanationHinglish: `Switch op = '${op}' ko evaluate karke direct matching case par jump karta hai.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]`, res: '0 [int]' },
        animationEvent: { type: 'MATCH_START' as const, variableName: 'op', value: `'${op}'` }
      },
      {
        step: 5, lineNum: lineToExec,
        explanationEnglish: `Execute case '${op}': compute res = ${res}.`,
        explanationHinglish: `Case '${op}' execute hoke res = ${res} update hua.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]`, res: `${res} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'res', oldValue: 0, newValue: res }
      },
      {
        step: 6, lineNum: lineToExec,
        explanationEnglish: 'Break execution: Exiting switch block.',
        explanationHinglish: 'Break execution: Switch block se bahar nikal rahe hain.',
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]`, res: `${res} [int]` },
        animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
      },
      {
        step: 7, lineNum: 12,
        explanationEnglish: `System.out.println prints Result: ${res}.`,
        explanationHinglish: `Console pe "Result: ${res}" print hua.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]`, res: `${res} [int]` },
        consoleOutput: `Result: ${res}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Result: ${res}` }
      },
      {
        step: 8, lineNum: 13,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]`, op: `'${op}' [char]`, res: `${res} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'month' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'month' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'month' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '12' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Winter"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Summer"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '7' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'number', value: '8' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Monsoon"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Autumn"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    month: { default: 7, min: 1, max: 12, label: 'month (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const m = Number(vars.month ?? 7);
    let season = 'Autumn';
    let lineToExec = 8;
    const isBreakCase = [12, 1, 2, 3, 4, 5, 6, 7, 8].includes(m);
    if ([12, 1, 2].includes(m)) { season = 'Winter'; lineToExec = 5; }
    else if ([3, 4, 5].includes(m)) { season = 'Summer'; lineToExec = 6; }
    else if ([6, 7, 8].includes(m)) { season = 'Monsoon'; lineToExec = 7; }

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int month = ${m}.`,
        explanationHinglish: `Variable month = ${m} store hua.`,
        memorySnapshot: { month: `${m} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'month', value: m }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Switch evaluates month = ${m} and jumps directly to matching case.`,
        explanationHinglish: `Switch month = ${m} ko evaluate karke direct season case par jump karta hai.`,
        memorySnapshot: { month: `${m} [int]` },
        animationEvent: { type: 'MATCH_START' as const, variableName: 'month', value: m }
      },
      {
        step: 3, lineNum: lineToExec,
        explanationEnglish: `System.out.println prints "${season}".`,
        explanationHinglish: `Console pe "${season}" print hua.`,
        memorySnapshot: { month: `${m} [int]` },
        consoleOutput: season,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: season }
      },
      ...(isBreakCase ? [
        {
          step: 4, lineNum: lineToExec,
          explanationEnglish: 'Break execution: Exiting switch block.',
          explanationHinglish: 'Break execution: Switch block se bahar nikal rahe hain.',
          memorySnapshot: { month: `${m} [int]` },
          consoleOutput: season,
          animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
        }
      ] : []),
      {
        step: isBreakCase ? 5 : 4, lineNum: 10,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { month: `${m} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'char' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'g' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'", paramId: 'g' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'switch' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'g' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'A'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Excellent"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'B'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Good Job"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'case' }, { type: 'text', value: ' ' }, { type: 'string', value: "'C'" }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Fair"' }, { type: 'punctuation', value: ');' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'default' }, { type: 'punctuation', value: ':' }, { type: 'text', value: ' ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Keep Trying"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    g: { default: 'A', type: 'text', label: 'g (char)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const rawG = String(vars.g ?? 'A').replace(/['"]/g, '');
    const g = rawG.length > 0 ? rawG[0].toUpperCase() : 'A';
    const comments: Record<string, string> = { A: 'Excellent', B: 'Good Job', C: 'Fair' };
    const comment = comments[g] || 'Keep Trying';
    const isBreakCase = ['A', 'B', 'C'].includes(g);
    const lineToExec = g === 'A' ? 5 : g === 'B' ? 6 : g === 'C' ? 7 : 8;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare char g = '${g}'.`,
        explanationHinglish: `Character variable g = '${g}' store hua.`,
        memorySnapshot: { g: `'${g}' [char]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'g', value: `'${g}'` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Switch evaluates g = '${g}' and jumps directly to matching case.`,
        explanationHinglish: `Switch g = '${g}' ko evaluate karke direct matching case par jump karta hai.`,
        memorySnapshot: { g: `'${g}' [char]` },
        animationEvent: { type: 'MATCH_START' as const, variableName: 'g', value: `'${g}'` }
      },
      {
        step: 3, lineNum: lineToExec,
        explanationEnglish: `Execute case '${g}': System.out.println("${comment}").`,
        explanationHinglish: `Console pe "${comment}" print hua.`,
        memorySnapshot: { g: `'${g}' [char]` },
        consoleOutput: comment,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: comment }
      },
      ...(isBreakCase ? [
        {
          step: 4, lineNum: lineToExec,
          explanationEnglish: 'Break execution: Exiting switch block.',
          explanationHinglish: 'Break execution: Switch block se bahar nikal rahe hain.',
          memorySnapshot: { g: `'${g}' [char]` },
          consoleOutput: comment,
          animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
        }
      ] : []),
      {
        step: isBreakCase ? 5 : 4, lineNum: 10,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { g: `'${g}' [char]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
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
  learningObjective: 'Learn accumulator variable accumulation in Java for loop with init, condition, and increment cycles.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Sum: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 4, min: 1, max: 10, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const nVal = Number(vars?.n ?? 4);
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let currentSum = 0;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${nVal}, initialize sum = 0.`,
      explanationHinglish: `n = ${nVal} aur sum = 0 initialize hua.`,
      memorySnapshot: { n: `${nVal} [int]`, sum: '0 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: nVal }, { name: 'sum', value: 0 }] }
    });

    // Loop initialization: int i = 1
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Loop Initialization: set counter i = 1.',
      explanationHinglish: 'Loop Init: counter variable i = 1 set hua.',
      memorySnapshot: { n: `${nVal} [int]`, sum: '0 [int]', i: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    for (let i = 1; i <= nVal; i++) {
      // 1. Condition Check
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Condition check: i (${i}) <= n (${nVal}) is TRUE. Entering loop body.`,
        explanationHinglish: `Condition check: ${i} <= ${nVal} is TRUE. Loop body execute hogi.`,
        memorySnapshot: { n: `${nVal} [int]`, sum: `${currentSum} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i <= n`,
          formula: `i <= n`,
          inputs: ['i', 'n'],
          result: true,
          explanation: `${i} <= ${nVal} is True`
        }
      });

      // 2. Loop Body Execution: COMPUTE then UPDATE
      const oldSum = currentSum;
      currentSum += i;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration ${i}: Compute sum (${oldSum}) + i (${i}) = ${currentSum}.`,
        explanationHinglish: `Iteration ${i}: Compute sum (${oldSum}) + i (${i}) = ${currentSum}.`,
        memorySnapshot: { n: `${nVal} [int]`, sum: `${oldSum} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: [`sum (${oldSum})`, `i (${i})`],
          operator: '+',
          storeIn: 'sum',
          result: currentSum
        }
      });

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration ${i}: Update sum to ${currentSum}.`,
        explanationHinglish: `Iteration ${i}: sum me new value ${currentSum} store hui.`,
        memorySnapshot: { n: `${nVal} [int]`, sum: `${currentSum} [int]`, i: `${i} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: currentSum }
      });

      // 3. Increment / Process Repeat: i++
      if (i < nVal) {
        steps.push({
          step: stepNum++, lineNum: 4,
          explanationEnglish: `Increment i++: i changes from ${i} to ${i + 1}. Repeating loop.`,
          explanationHinglish: `Increment i++: i = ${i + 1} hua. Repeat loop arrow se next iteration condition check.`,
          memorySnapshot: { n: `${nVal} [int]`, sum: `${currentSum} [int]`, i: `${i + 1} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: i + 1 }
        });
      }
    }

    // Loop Exit Condition FALSE
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Condition check: i (${nVal + 1}) <= n (${nVal}) is FALSE. Loop terminated.`,
      explanationHinglish: `Condition check: ${nVal + 1} <= ${nVal} is FALSE. Loop exit ho gaya.`,
      memorySnapshot: { n: `${nVal} [int]`, sum: `${currentSum} [int]`, i: `${nVal + 1} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `i <= n`,
        formula: `i <= n`,
        inputs: ['i', 'n'],
        result: false,
        explanation: `${nVal + 1} <= ${nVal} is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: `System.out.println prints Sum: ${currentSum}.`,
      explanationHinglish: `Console pe "Sum: ${currentSum}" print hua.`,
      memorySnapshot: { n: `${nVal} [int]`, sum: `${currentSum} [int]` },
      consoleOutput: `Sum: ${currentSum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Sum: ${currentSum}` }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: `${nVal} [int]`, sum: `${currentSum} [int]` },
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
  learningObjective: 'Learn digit extraction using % 10 and / 10 inside a while loop with condition checks.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '432', paramId: 'num' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'num' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Digit Sum: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    num: { default: 432, min: 1, max: 9999, label: 'num (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let n = Math.abs(Number(vars?.num ?? 432));
    let sum = 0;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Initialize num = ${n}, sum = 0.`,
      explanationHinglish: `num = ${n} aur sum = 0 initialize hua.`,
      memorySnapshot: { num: `${n} [int]`, sum: '0 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'num', value: n }, { name: 'sum', value: 0 }] }
    });

    while (n > 0) {
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `While condition: num (${n}) > 0 is TRUE. Continuing loop.`,
        explanationHinglish: `While condition: num (${n}) > 0 is TRUE. Loop body execute hogi.`,
        memorySnapshot: { num: `${n} [int]`, sum: `${sum} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `num > 0`,
          formula: `num > 0`,
          inputs: ['num'],
          result: true,
          explanation: `${n} > 0 is True`
        }
      });

      const oldN = n;
      const digit = n % 10;
      const oldSum = sum;
      sum += digit;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Extract digit ${oldN} % 10 = ${digit}. sum += ${digit} -> sum = ${sum}.`,
        explanationHinglish: `Digit ${digit} add kiya: ${oldSum} + ${digit} = ${sum}.`,
        memorySnapshot: { num: `${n} [int]`, sum: `${sum} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['sum', String(digit)],
          operator: '+',
          storeIn: 'sum',
          result: sum
        }
      });

      n = Math.floor(n / 10);
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Divide num by 10: ${oldN} / 10 = ${n}. Loop process repeat arrow.`,
        explanationHinglish: `num /= 10 -> ${oldN} / 10 = ${n} hua. Loop repeat arrow se while condition re-check.`,
        memorySnapshot: { num: `${n} [int]`, sum: `${sum} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['num', '10'],
          operator: '/',
          storeIn: 'num',
          result: n
        }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `While condition: num (0) > 0 is FALSE. Loop exit.`,
      explanationHinglish: `While condition: num (0) > 0 is FALSE. Loop exit ho gaya.`,
      memorySnapshot: { num: '0 [int]', sum: `${sum} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `num > 0`,
        formula: `num > 0`,
        inputs: ['num'],
        result: false,
        explanation: `0 > 0 is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `System.out.println prints Digit Sum: ${sum}.`,
      explanationHinglish: `Console pe "Digit Sum: ${sum}" print hua.`,
      memorySnapshot: { num: '0 [int]', sum: `${sum} [int]` },
      consoleOutput: `Digit Sum: ${sum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Digit Sum: ${sum}` }
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
  topic: 'while_loop',
  lessonNumber: 3,
  friendlyName: 'Factorial Calculation',
  learningObjective: 'Learn multiplicative accumulation in while loops with step evaluation.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'long' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'fact' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Factorial: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fact' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 10, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const nVal = Number(vars?.n ?? 5);
    let fact = 1;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${nVal}.`,
      explanationHinglish: `n = ${nVal} set hua.`,
      memorySnapshot: { n: `${nVal} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: nVal }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Set long fact = 1.',
      explanationHinglish: 'fact = 1 set hua.',
      memorySnapshot: { n: `${nVal} [int]`, fact: '1 [long]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'fact', value: 1 }
    });

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Set counter i = 1.',
      explanationHinglish: 'i = 1 set hua.',
      memorySnapshot: { n: `${nVal} [int]`, fact: '1 [long]', i: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    let i = 1;
    while (i <= nVal) {
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `While condition: i (${i}) <= n (${nVal}) is TRUE.`,
        explanationHinglish: `While condition: ${i} <= ${nVal} is TRUE. Loop body execute hogi.`,
        memorySnapshot: { n: `${nVal} [int]`, fact: `${fact} [long]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i <= n`,
          formula: `i <= n`,
          inputs: ['i', 'n'],
          result: true,
          explanation: `${i} <= ${nVal} is True`
        }
      });

      const oldFact = fact;
      fact *= i;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Iteration ${i}: Multiply fact by i: ${oldFact} * ${i} = ${fact}.`,
        explanationHinglish: `Iteration ${i}: fact ko i se multiply kiya: ${oldFact} * ${i} = ${fact}.`,
        memorySnapshot: { n: `${nVal} [int]`, i: `${i} [int]`, fact: `${fact} [long]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['fact', 'i'],
          operator: '*',
          storeIn: 'fact',
          result: fact
        }
      });

      const oldI = i;
      i++;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Increment counter: i + 1: ${oldI} + 1 = ${i}. Repeat loop arrow.`,
        explanationHinglish: `Increment counter: ${oldI} + 1 = ${i}. Repeat loop arrow se while condition re-check.`,
        memorySnapshot: { n: `${nVal} [int]`, fact: `${fact} [long]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['i', '1'],
          operator: '+',
          storeIn: 'i',
          result: i
        }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 6,
      explanationEnglish: `While condition: i (${i}) <= n (${nVal}) is FALSE. Loop exit.`,
      explanationHinglish: `While condition: ${i} <= ${nVal} is FALSE. Loop exit ho gaya.`,
      memorySnapshot: { n: `${nVal} [int]`, fact: `${fact} [long]`, i: `${i} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `i <= n`,
        formula: `i <= n`,
        inputs: ['i', 'n'],
        result: false,
        explanation: `${i} <= ${nVal} is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `System.out.println prints Factorial: ${fact}.`,
      explanationHinglish: `Console pe "Factorial: ${fact}" print hua.`,
      memorySnapshot: { n: `${nVal} [int]`, fact: `${fact} [long]` },
      consoleOutput: `Factorial: ${fact}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Factorial: ${fact}` }
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: `${nVal} [int]`, fact: `${fact} [long]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaDoWhile: LessonProgram = {
  id: 'java_do_while',
  language: 'java',
  topic: 'do_while_loop',
  lessonNumber: 1,
  friendlyName: 'Do-While Guaranteed Execution',
  learningObjective: 'Learn exit-controlled do-while loops in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1', paramId: 'count' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'do' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Count: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'count' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    count: { default: 1, min: 1, max: 5, label: 'count (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let count = Number(vars?.count ?? 1);
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let consoleText = '';

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set count = ${count}.`,
      explanationHinglish: `count = ${count} set hua.`,
      memorySnapshot: { count: `${count} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'count', value: count }
    });

    // Run do-while loop
    let iteration = 1;
    while (true) {
      consoleText += (consoleText ? '\n' : '') + `Count: ${count}`;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration ${iteration}: Execute body first -> print Count: ${count}.`,
        explanationHinglish: `Iteration ${iteration}: Guaranteed body run -> "Count: ${count}" print hua.`,
        memorySnapshot: { count: `${count} [int]` },
        consoleOutput: consoleText,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Count: ${count}` }
      });

      const oldCount = count;
      count++;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Increment count++ -> count = ${count}.`,
        explanationHinglish: `count++ hoke ${count} hua.`,
        memorySnapshot: { count: `${count} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'count', oldValue: oldCount, newValue: count }
      });

      const isKeepLooping = count <= 2;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Exit-check condition: count (${count}) <= 2 is ${isKeepLooping ? 'TRUE (Looping back)' : 'FALSE (Loop exit)'}.`,
        explanationHinglish: `Bottom condition check: count (${count}) <= 2 is ${isKeepLooping ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { count: `${count} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `count <= 2`,
          formula: `count <= 2`,
          inputs: ['count'],
          result: isKeepLooping,
          explanation: `${count} <= 2 is ${isKeepLooping}`
        }
      });

      if (!isKeepLooping) break;
      iteration++;
    }

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { count: `${count} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '" x "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '" = "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '));' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 5, min: 1, max: 20, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const nVal = Number(vars?.n ?? 5);
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let out = '';

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${nVal}.`,
      explanationHinglish: `n = ${nVal} initialize hua.`,
      memorySnapshot: { n: `${nVal} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: nVal }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Loop Initialization: counter i = 1.',
      explanationHinglish: 'Loop Init: counter i = 1 initialize hua.',
      memorySnapshot: { n: `${nVal} [int]`, i: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    for (let i = 1; i <= 3; i++) {
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Condition check: i (${i}) <= 3 is TRUE.`,
        explanationHinglish: `Condition check: ${i} <= 3 is TRUE.`,
        memorySnapshot: { n: `${nVal} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i <= 3`,
          formula: `i <= 3`,
          inputs: ['i'],
          result: true,
          explanation: `${i} <= 3 is True`
        }
      });

      const prod = nVal * i;
      out += (out ? '\n' : '') + `${nVal} x ${i} = ${prod}`;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration ${i}: Compute ${nVal} * ${i} = ${prod}.`,
        explanationHinglish: `Iteration ${i}: Compute ${nVal} * ${i} = ${prod}.`,
        memorySnapshot: { n: `${nVal} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: [`n (${nVal})`, `i (${i})`],
          operator: '*',
          storeIn: 'product',
          result: prod
        }
      });
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Print ${nVal} x ${i} = ${prod}.`,
        explanationHinglish: `Console pe "${nVal} x ${i} = ${prod}" print hua.`,
        memorySnapshot: { n: `${nVal} [int]`, i: `${i} [int]` },
        consoleOutput: out,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `${nVal} x ${i} = ${prod}` }
      });

      if (i < 3) {
        steps.push({
          step: stepNum++, lineNum: 4,
          explanationEnglish: `Increment i++ -> i = ${i + 1}. Loop repeat arrow.`,
          explanationHinglish: `Increment i++ -> i = ${i + 1}. Loop repeat arrow se next iteration.`,
          memorySnapshot: { n: `${nVal} [int]`, i: `${i + 1} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: i + 1 }
        });
      }
    }

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Condition check: i (4) <= 3 is FALSE. Loop finished.',
      explanationHinglish: 'Condition check: 4 <= 3 is FALSE. Loop exit hua.',
      memorySnapshot: { n: `${nVal} [int]`, i: '4 [int]' },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `i <= 3`,
        formula: `i <= 3`,
        inputs: ['i'],
        result: false,
        explanation: `4 <= 3 is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: `${nVal} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaReverseNum: LessonProgram = {
  id: 'java_reverse_num',
  language: 'java',
  topic: 'while_loop',
  lessonNumber: 6,
  friendlyName: 'Reverse an Integer Number',
  learningObjective: 'Learn math digit shifting (rev = rev * 10 + digit) in loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '123', paramId: 'n' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 123, min: 1, max: 9999, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let n = Math.abs(Number(vars?.n ?? 123));
    let rev = 0;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${n}, rev = 0.`,
      explanationHinglish: `n = ${n} aur rev = 0 initialize hua.`,
      memorySnapshot: { n: `${n} [int]`, rev: '0 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: n }, { name: 'rev', value: 0 }] }
    });

    while (n > 0) {
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `While condition: n (${n}) > 0 is TRUE.`,
        explanationHinglish: `While condition: n (${n}) > 0 is TRUE.`,
        memorySnapshot: { n: `${n} [int]`, rev: `${rev} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `n > 0`,
          formula: `n > 0`,
          inputs: ['n'],
          result: true,
          explanation: `${n} > 0 is True`
        }
      });

      const digit = n % 10;
      const oldRev = rev;
      rev = rev * 10 + digit;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Extract and shift: rev = (${oldRev} * 10) + ${digit} = ${rev}.`,
        explanationHinglish: `Digit shift karke rev = (${oldRev} * 10) + ${digit} = ${rev} hua.`,
        memorySnapshot: { n: `${n} [int]`, rev: `${rev} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['rev', '10', String(digit)],
          operator: '* +',
          storeIn: 'rev',
          result: rev
        }
      });

      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Divide n by 10: ${oldN} / 10 = ${n}. Repeat loop arrow.`,
        explanationHinglish: `n ko 10 se divide kiya: ${oldN} / 10 = ${n}. Repeat loop arrow se next iteration.`,
        memorySnapshot: { n: `${n} [int]`, rev: `${rev} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['n', '10'],
          operator: '/',
          storeIn: 'n',
          result: n
        }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'While condition: n (0) > 0 is FALSE. Loop exit.',
      explanationHinglish: 'While condition: n (0) > 0 is FALSE. Loop exit.',
      memorySnapshot: { n: '0 [int]', rev: `${rev} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `n > 0`,
        formula: `n > 0`,
        inputs: ['n'],
        result: false,
        explanation: `0 > 0 is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `System.out.println prints Reversed: ${rev}.`,
      explanationHinglish: `Console pe "Reversed: ${rev}" print hua.`,
      memorySnapshot: { n: '0 [int]', rev: `${rev} [int]` },
      consoleOutput: `Reversed: ${rev}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Reversed: ${rev}` }
    });

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '0 [int]', rev: `${rev} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaPrimeCheck: LessonProgram = {
  id: 'java_prime_check',
  language: 'java',
  topic: 'while_loop',
  lessonNumber: 7,
  friendlyName: 'Prime Number Checker',
  learningObjective: 'Learn divisor testing using boolean flags in while loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'boolean' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'true' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '                ' }, { type: 'variable', value: 'isPrime' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'false' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '                ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '            ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Is Prime: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPrime' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 14, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 15, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 7, min: 2, max: 100, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const nVal = Math.abs(Number(vars?.n ?? 7));
    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let isPrime = true;
    const limit = Math.floor(nVal / 2);

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${nVal}.`,
      explanationHinglish: `n = ${nVal} set hua.`,
      memorySnapshot: { n: `${nVal} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: nVal }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Set boolean isPrime = true.',
      explanationHinglish: 'isPrime = true set hua.',
      memorySnapshot: { n: `${nVal} [int]`, isPrime: 'true [boolean]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'isPrime', value: 'true' }
    });

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Set loop counter i = 2.',
      explanationHinglish: 'Counter i = 2 initialize hua.',
      memorySnapshot: { n: `${nVal} [int]`, isPrime: 'true [boolean]', i: '2 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 2 }
    });

    let i = 2;
    let divisorFound = false;

    while (i <= limit) {
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `While condition: i (${i}) <= n/2 (${limit}) is TRUE.`,
        explanationHinglish: `While condition: ${i} <= ${limit} is TRUE. Divisor test.`,
        memorySnapshot: { n: `${nVal} [int]`, isPrime: `${isPrime} [boolean]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i <= n / 2`,
          formula: `i <= n / 2`,
          inputs: ['i', 'n'],
          result: true,
          explanation: `${i} <= ${limit} is True`
        }
      });

      const isDivisible = nVal % i === 0;

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Check divisor: n (${nVal}) % i (${i}) == 0 -> ${isDivisible ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Divisor check: ${nVal} % ${i} == 0 -> ${isDivisible ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { n: `${nVal} [int]`, isPrime: `${isPrime} [boolean]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `n % i == 0`,
          formula: `n % i == 0`,
          inputs: ['n', 'i'],
          result: isDivisible,
          explanation: `${nVal} % ${i} == 0 is ${isDivisible ? 'True' : 'False'}`
        }
      });

      if (isDivisible) {
        isPrime = false;
        divisorFound = true;
        steps.push({
          step: stepNum++, lineNum: 8,
          explanationEnglish: `Divisor ${i} found! isPrime = false.`,
          explanationHinglish: `Divisor ${i} mila: isPrime = false set hua.`,
          memorySnapshot: { n: `${nVal} [int]`, isPrime: 'false [boolean]', i: `${i} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'isPrime', oldValue: 'true', newValue: 'false' }
        });
        steps.push({
          step: stepNum++, lineNum: 9,
          explanationEnglish: 'Break execution: Exiting loop.',
          explanationHinglish: 'Break execution: Divisor milte hi loop se exit.',
          memorySnapshot: { n: `${nVal} [int]`, isPrime: 'false [boolean]', i: `${i} [int]` },
          animationEvent: { type: 'BREAK_EXECUTION' as const, explanation: 'Break Execution' }
        });
        break;
      }

      const oldI = i;
      i++;
      steps.push({
        step: stepNum++, lineNum: 11,
        explanationEnglish: `Increment counter: i++ -> i = ${i}. Repeat loop arrow.`,
        explanationHinglish: `Increment counter: i++ -> i = ${i}. Repeat loop arrow.`,
        memorySnapshot: { n: `${nVal} [int]`, isPrime: 'true [boolean]', i: `${i} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: oldI, newValue: i }
      });
    }

    if (!divisorFound) {
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `While condition: i (${i}) <= n/2 (${limit}) is FALSE. Loop exit.`,
        explanationHinglish: `While condition: ${i} <= ${limit} is FALSE. Loop finish ho gaya.`,
        memorySnapshot: { n: `${nVal} [int]`, isPrime: 'true [boolean]', i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i <= n / 2`,
          formula: `i <= n / 2`,
          inputs: ['i', 'n'],
          result: false,
          explanation: `${i} <= ${limit} is False`
        }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: `System.out.println prints Is Prime: ${isPrime}.`,
      explanationHinglish: `Console pe "Is Prime: ${isPrime}" print hua.`,
      memorySnapshot: { n: `${nVal} [int]`, isPrime: `${isPrime} [boolean]` },
      consoleOutput: `Is Prime: ${isPrime}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Is Prime: ${isPrime}` }
    });

    steps.push({
      step: stepNum++, lineNum: 14,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: `${nVal} [int]`, isPrime: `${isPrime} [boolean]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaPalindromeNum: LessonProgram = {
  id: 'java_palindrome_num',
  language: 'java',
  topic: 'while_loop',
  lessonNumber: 8,
  friendlyName: 'Palindrome Number Checker',
  learningObjective: 'Learn number reversal and equality checking in while loops.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '121', paramId: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '%' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'digit' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'n' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'boolean' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPalindrome' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'original' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Is Palindrome: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'isPalindrome' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 13, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 14, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    n: { default: 121, min: 1, max: 9999, label: 'n (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let n = Math.abs(Number(vars?.n ?? 121));
    const original = n;
    let rev = 0;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${n}.`,
      explanationHinglish: `n = ${n} set hua.`,
      memorySnapshot: { n: `${n} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: n }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Store original = n (${original}).`,
      explanationHinglish: `original = ${original} save hua.`,
      memorySnapshot: { n: `${n} [int]`, original: `${original} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'original', value: original }
    });

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Set rev = 0.',
      explanationHinglish: 'rev = 0 set hua.',
      memorySnapshot: { n: `${n} [int]`, original: `${original} [int]`, rev: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'rev', value: 0 }
    });

    while (n > 0) {
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `While condition: n (${n}) > 0 is TRUE.`,
        explanationHinglish: `While condition: n (${n}) > 0 is TRUE.`,
        memorySnapshot: { n: `${n} [int]`, original: `${original} [int]`, rev: `${rev} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `n > 0`,
          formula: `n > 0`,
          inputs: ['n'],
          result: true,
          explanation: `${n} > 0 is True`
        }
      });

      const digit = n % 10;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Extract digit: digit = n (${n}) % 10 = ${digit}.`,
        explanationHinglish: `digit = ${n} % 10 = ${digit} extract hua.`,
        memorySnapshot: { n: `${n} [int]`, original: `${original} [int]`, rev: `${rev} [int]`, digit: `${digit} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'digit', value: digit }
      });

      const oldRev = rev;
      rev = rev * 10 + digit;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Iteration step: rev = ${oldRev} * 10 + ${digit} = ${rev}.`,
        explanationHinglish: `Compute rev = ${oldRev} * 10 + ${digit} = ${rev}.`,
        memorySnapshot: { n: `${n} [int]`, original: `${original} [int]`, rev: `${oldRev} [int]`, digit: `${digit} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: [`rev (${oldRev})`, `digit (${digit})`],
          operator: '*10+',
          storeIn: 'rev',
          result: rev
        }
      });

      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Update rev = ${rev}.`,
        explanationHinglish: `rev = ${rev} update hua.`,
        memorySnapshot: { n: `${n} [int]`, original: `${original} [int]`, rev: `${rev} [int]`, digit: `${digit} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'rev', oldValue: oldRev, newValue: rev }
      });

      const oldN = n;
      n = Math.floor(n / 10);
      steps.push({
        step: stepNum++, lineNum: 9,
        explanationEnglish: `Remove last digit: n /= 10 -> n = ${n}. Repeat loop arrow.`,
        explanationHinglish: `n /= 10 -> n = ${n}. Repeat loop arrow.`,
        memorySnapshot: { n: `${n} [int]`, original: `${original} [int]`, rev: `${rev} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'n', oldValue: oldN, newValue: n }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 6,
      explanationEnglish: 'While condition: n (0) > 0 is FALSE. Loop exit.',
      explanationHinglish: 'While condition: n (0) > 0 is FALSE. Loop exit ho gaya.',
      memorySnapshot: { n: '0 [int]', original: `${original} [int]`, rev: `${rev} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `n > 0`,
        formula: `n > 0`,
        inputs: ['n'],
        result: false,
        explanation: `0 > 0 is False`
      }
    });

    const isPalindrome = (original === rev);
    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: `Check palindrome equality: original (${original}) == rev (${rev}) -> ${isPalindrome}.`,
      explanationHinglish: `Palindrome check: original (${original}) == rev (${rev}) -> ${isPalindrome}.`,
      memorySnapshot: { n: '0 [int]', original: `${original} [int]`, rev: `${rev} [int]`, isPalindrome: `${isPalindrome} [boolean]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: `original == rev`,
        formula: `original == rev`,
        inputs: ['original', 'rev'],
        result: isPalindrome,
        explanation: `${original} == ${rev} is ${isPalindrome ? 'True' : 'False'}`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 12,
      explanationEnglish: `System.out.println prints Is Palindrome: ${isPalindrome}.`,
      explanationHinglish: `Console pe "Is Palindrome: ${isPalindrome}" print hua.`,
      memorySnapshot: { n: '0 [int]', original: `${original} [int]`, rev: `${rev} [int]`, isPalindrome: `${isPalindrome} [boolean]` },
      consoleOutput: `Is Palindrome: ${isPalindrome}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Is Palindrome: ${isPalindrome}` }
    });

    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: '0 [int]', original: `${original} [int]`, rev: `${rev} [int]`, isPalindrome: `${isPalindrome} [boolean]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

// ==============================================================================
// TOPIC 5: ARRAYS (1D & 2D ARRAYS) (7 Programs)

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
      explanationHinglish: 'Heap memory me 1D array object int[] arr = {12, 25, 37, 48} allocate hua.',
      memorySnapshot: { arr: '[12, 25, 37, 48]', 'arr[0]': '12 [int]', 'arr[1]': '25 [int]', 'arr[2]': '37 [int]', 'arr[3]': '48 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: '[12, 25, 37, 48]' }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Initialize accumulator variable sum = 0.',
      explanationHinglish: 'Accumulator variable sum = 0 initialize hua.',
      memorySnapshot: { arr: '[12, 25, 37, 48]', sum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const oldSum = sum;
      sum += val;

      // 1. Foreach loop element extraction: val = arr[i]
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Foreach Iteration ${i + 1}: Extract element arr[${i}] (${val}) into variable 'val'.`,
        explanationHinglish: `Enhanced for loop: arr[${i}] se value ${val} variable 'val' me aayi.`,
        memorySnapshot: { arr: '[12, 25, 37, 48]', sum: `${oldSum} [int]`, val: `${val} [int]` },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      // 2. Accumulate sum += val calculation step
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Compute sum: sum (${oldSum}) + val (${val}) = ${sum}.`,
        explanationHinglish: `Calculation: sum (${oldSum}) + val (${val}) = ${sum} calculate hoke sum update hua.`,
        memorySnapshot: { arr: '[12, 25, 37, 48]', sum: `${sum} [int]`, val: `${val} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['sum', 'val'],
          operator: '+',
          storeIn: 'sum',
          result: sum
        }
      });
    }

    const avg = sum / arr.length;
    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `Compute average = (double) sum (${sum}) / arr.length (${arr.length}) = ${avg}.`,
      explanationHinglish: `Average formula calculate hua: (double) ${sum} / 4 = ${avg}.`,
      memorySnapshot: { arr: '[12, 25, 37, 48]', sum: `${sum} [int]`, avg: `${avg} [double]` },
      animationEvent: {
        type: 'COMPUTE' as const,
        inputs: ['sum', '4'],
        operator: '/',
        storeIn: 'avg',
        result: avg
      }
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '34', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '89', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '15', paramId: 'v3' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'min' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'min' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'min' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Max: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'max' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '", Min: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'min' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    v1: { default: 34, label: 'arr[0]' },
    v2: { default: 89, label: 'arr[1]' },
    v3: { default: 15, label: 'arr[2]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const val1 = Number(vars?.v1 ?? 34);
    const val2 = Number(vars?.v2 ?? 89);
    const val3 = Number(vars?.v3 ?? 15);
    const arr = [val1, val2, val3];

    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let max = arr[0];
    let min = arr[0];

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Allocate arr = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr = {${arr.join(', ')}} memory me allocate hua.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, 'arr[0]': `${arr[0]} [int]`, 'arr[1]': `${arr[1]} [int]`, 'arr[2]': `${arr[2]} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: `[${arr.join(', ')}]` }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Initialize max = arr[0] (${max}) and min = arr[0] (${min}).`,
      explanationHinglish: `max aur min dono ko pehle element arr[0] (${max}) se initialize kiya.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]` },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'max', value: max }, { name: 'min', value: min }] }
    });

    for (let i = 1; i < arr.length; i++) {
      const cur = arr[i];
      const oldMax = max;
      const oldMin = min;

      // Check for loop condition
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Loop condition: i (${i}) < arr.length (${arr.length}) is TRUE.`,
        explanationHinglish: `For loop check: i (${i}) < ${arr.length} is TRUE.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i < ${arr.length}`,
          formula: `i < ${arr.length}`,
          inputs: ['i'],
          result: true,
          explanation: `${i} < ${arr.length} is True`
        }
      });

      // Max condition check
      const isMaxGreater = cur > max;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Check max: arr[${i}] (${cur}) > max (${max}) is ${isMaxGreater ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check: arr[${i}] (${cur}) > max (${max}) is ${isMaxGreater ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `arr[${i}] > max`,
          formula: `${cur} > ${max}`,
          inputs: [`arr[${i}]`, 'max'],
          result: isMaxGreater,
          explanation: `${cur} > ${max} is ${isMaxGreater ? 'True' : 'False'}`
        }
      });

      if (isMaxGreater) {
        max = cur;
        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Update max: max = ${max}.`,
          explanationHinglish: `max variable update hua: ${oldMax} ➔ ${max}.`,
          memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]`, i: `${i} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'max', oldValue: oldMax, newValue: max }
        });
      }

      // Min condition check
      const isMinSmaller = cur < min;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Check min: arr[${i}] (${cur}) < min (${min}) is ${isMinSmaller ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Condition check: arr[${i}] (${cur}) < min (${min}) is ${isMinSmaller ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `arr[${i}] < min`,
          formula: `${cur} < ${min}`,
          inputs: [`arr[${i}]`, 'min'],
          result: isMinSmaller,
          explanation: `${cur} < ${min} is ${isMinSmaller ? 'True' : 'False'}`
        }
      });

      if (isMinSmaller) {
        min = cur;
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Update min: min = ${min}.`,
          explanationHinglish: `min variable update hua: ${oldMin} ➔ ${min}.`,
          memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]`, i: `${i} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'min', oldValue: oldMin, newValue: min }
        });
      }
    }

    const outputStr = `Max: ${max}, Min: ${min}`;
    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: `System.out.println prints ${outputStr}.`,
      explanationHinglish: `Console pe "${outputStr}" print hua.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]` },
      consoleOutput: outputStr,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: outputStr }
    });

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { arr: `[${arr.join(', ')}]`, max: `${max} [int]`, min: `${min} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '10', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '25', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '38', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '50', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '25', paramId: 'target' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'foundIdx' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '-1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '==' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'target' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '                ' }, { type: 'variable', value: 'foundIdx' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'break' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Found Index: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'foundIdx' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    target: { default: 25, label: 'target value' },
    v1: { default: 10, label: 'arr[0]' },
    v2: { default: 25, label: 'arr[1]' },
    v3: { default: 38, label: 'arr[2]' },
    v4: { default: 50, label: 'arr[3]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const target = Number(vars?.target ?? 25);
    const arr = [
      Number(vars?.v1 ?? 10),
      Number(vars?.v2 ?? 25),
      Number(vars?.v3 ?? 38),
      Number(vars?.v4 ?? 50)
    ];

    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let foundIdx = -1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Allocate arr = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr = {${arr.join(', ')}} memory me allocate hua.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, 'arr[0]': `${arr[0]} [int]`, 'arr[1]': `${arr[1]} [int]`, 'arr[2]': `${arr[2]} [int]`, 'arr[3]': `${arr[3]} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: `[${arr.join(', ')}]` }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Initialize target = ${target} and foundIdx = -1.`,
      explanationHinglish: `target = ${target} aur foundIdx = -1 initialize hue.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: '-1 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'target', value: target }, { name: 'foundIdx', value: -1 }] }
    });

    for (let i = 0; i < arr.length; i++) {
      const cur = arr[i];
      const isMatch = cur === target;

      // 1. Loop check
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Loop condition: i (${i}) < arr.length (${arr.length}) is TRUE.`,
        explanationHinglish: `For loop check: i (${i}) < ${arr.length} is TRUE.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: `${foundIdx} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `i < ${arr.length}`,
          formula: `i < ${arr.length}`,
          inputs: ['i'],
          result: true,
          explanation: `${i} < ${arr.length} is True`
        }
      });

      // 2. Inspect element
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Inspect arr[${i}] (${cur}): Check if arr[${i}] == target (${target}).`,
        explanationHinglish: `Index ${i} check: arr[${i}] (${cur}) == target (${target})?`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: `${foundIdx} [int]`, i: `${i} [int]` },
        animationEvent: { type: 'HIGHLIGHT_ARRAY_INDEX' as const, arrayName: 'arr', index: i }
      });

      // 3. Condition check
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Condition: arr[${i}] (${cur}) == target (${target}) is ${isMatch ? 'TRUE! Match Found!' : 'FALSE.'}`,
        explanationHinglish: `Condition check: ${cur} == ${target} is ${isMatch ? 'TRUE! Target element mil gaya!' : 'FALSE.'}`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: `${foundIdx} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `arr[${i}] == target`,
          formula: `${cur} == ${target}`,
          inputs: [`arr[${i}]`, 'target'],
          result: isMatch,
          explanation: `${cur} == ${target} is ${isMatch ? 'True' : 'False'}`
        }
      });

      if (isMatch) {
        foundIdx = i;
        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Match found at index ${i}! Set foundIdx = ${i} and break loop.`,
          explanationHinglish: `Match mil gaya! foundIdx = ${i} set hoke break execute hua.`,
          memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: `${foundIdx} [int]`, i: `${i} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'foundIdx', oldValue: -1, newValue: foundIdx }
        });
        break;
      }
    }

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `System.out.println prints Found Index: ${foundIdx}.`,
      explanationHinglish: `Console pe "Found Index: ${foundIdx}" print hua.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: `${foundIdx} [int]` },
      consoleOutput: `Found Index: ${foundIdx}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'foundIdx', outputValue: `Found Index: ${foundIdx}` }
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { arr: `[${arr.join(', ')}]`, target: `${target} [int]`, foundIdx: `${foundIdx} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '1', paramId: 'v1' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'v2' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '3', paramId: 'v3' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'v4' }, { type: 'punctuation', value: '};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '.' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'start' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'start' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'arr' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'end' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'temp' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'start' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'end' }, { type: 'operator', value: '--' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed done."' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 12, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 13, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    v1: { default: 1, label: 'arr[0]' },
    v2: { default: 2, label: 'arr[1]' },
    v3: { default: 3, label: 'arr[2]' },
    v4: { default: 4, label: 'arr[3]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const arr = [
      Number(vars?.v1 ?? 1),
      Number(vars?.v2 ?? 2),
      Number(vars?.v3 ?? 3),
      Number(vars?.v4 ?? 4)
    ];

    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let start = 0;
    let end = arr.length - 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Allocate 1D array arr = {${arr.join(', ')}}.`,
      explanationHinglish: `Array arr = {${arr.join(', ')}} allocate hua.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, 'arr[0]': `${arr[0]} [int]`, 'arr[1]': `${arr[1]} [int]`, 'arr[2]': `${arr[2]} [int]`, 'arr[3]': `${arr[3]} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'arr', value: `[${arr.join(', ')}]` }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Set two pointers: start = 0, end = ${end}.`,
      explanationHinglish: `Pointers set hue: start = 0 aur end = ${end}.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, start: '0 [int]', end: `${end} [int]` },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'start', value: 0 }, { name: 'end', value: end }] }
    });

    while (start < end) {
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Condition check: start (${start}) < end (${end}) is TRUE.`,
        explanationHinglish: `While condition: start (${start}) < end (${end}) is TRUE. Swapping continue.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, start: `${start} [int]`, end: `${end} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'start < end',
          formula: `${start} < ${end}`,
          inputs: ['start', 'end'],
          result: true,
          explanation: `${start} < ${end} is True`
        }
      });

      const tempVal = arr[start];
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Backup arr[${start}] (${tempVal}) into temp.`,
        explanationHinglish: `arr[${start}] (${tempVal}) ko temp variable me store kiya.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, start: `${start} [int]`, end: `${end} [int]`, temp: `${tempVal} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'temp', value: tempVal }
      });

      const oldStart = arr[start];
      const oldEnd = arr[end];
      arr[start] = oldEnd;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Copy arr[${end}] (${oldEnd}) into arr[${start}].`,
        explanationHinglish: `arr[${end}] (${oldEnd}) ko arr[${start}] me copy kiya.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, start: `${start} [int]`, end: `${end} [int]`, temp: `${tempVal} [int]` },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'arr', index: start, oldValue: oldStart, newValue: oldEnd }
      });

      arr[end] = tempVal;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Copy temp (${tempVal}) into arr[${end}]. Swapped elements at index ${start} & ${end}.`,
        explanationHinglish: `temp (${tempVal}) ko arr[${end}] me write kiya. Index ${start} aur ${end} swap ho gaye!`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, start: `${start} [int]`, end: `${end} [int]` },
        animationEvent: { type: 'UPDATE_ARRAY_INDEX' as const, arrayName: 'arr', index: end, oldValue: oldEnd, newValue: tempVal }
      });

      const nextStart = start + 1;
      const nextEnd = end - 1;
      steps.push({
        step: stepNum++, lineNum: 9,
        explanationEnglish: `Move pointers: start++ (${nextStart}), end-- (${nextEnd}).`,
        explanationHinglish: `Pointers aage badhe: start = ${nextStart}, end = ${nextEnd}.`,
        memorySnapshot: { arr: `[${arr.join(', ')}]`, start: `${nextStart} [int]`, end: `${nextEnd} [int]` },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'start', value: nextStart }, { name: 'end', value: nextEnd }] }
      });

      start = nextStart;
      end = nextEnd;
    }

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: `Condition check: start (${start}) < end (${end}) is FALSE. Reversal complete!`,
      explanationHinglish: `While condition: start (${start}) < end (${end}) is FALSE. Array successfully reversed!`,
      memorySnapshot: { arr: `[${arr.join(', ')}]`, start: `${start} [int]`, end: `${end} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: 'start < end',
        formula: `${start} < ${end}`,
        inputs: ['start', 'end'],
        result: false,
        explanation: `${start} < ${end} is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: `System.out.println: Array reversed -> [${arr.join(', ')}].`,
      explanationHinglish: `Console pe final reversed array [${arr.join(', ')}] print hua.`,
      memorySnapshot: { arr: `[${arr.join(', ')}]` },
      consoleOutput: `[${arr.join(', ')}]`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'arr', outputValue: `[${arr.join(', ')}]` }
    });

    steps.push({
      step: stepNum++, lineNum: 12,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { arr: `[${arr.join(', ')}]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'matrix' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1', paramId: 'm00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 'm01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 'm10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 'm11' }, { type: 'punctuation', value: '}};' }] },
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
  editableVariables: {
    m00: { default: 1, label: 'matrix[0][0]' },
    m01: { default: 2, label: 'matrix[0][1]' },
    m10: { default: 3, label: 'matrix[1][0]' },
    m11: { default: 4, label: 'matrix[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const m00 = Number(vars?.m00 ?? 1);
    const m01 = Number(vars?.m01 ?? 2);
    const m10 = Number(vars?.m10 ?? 3);
    const m11 = Number(vars?.m11 ?? 4);
    const matrix = [[m00, m01], [m10, m11]];

    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let sum = 0;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Allocate 2D Matrix int[][] matrix = {{${m00}, ${m01}}, {${m10}, ${m11}}}.`,
      explanationHinglish: `Heap memory me 2x2 Matrix grid allocate hua.`,
      memorySnapshot: { 'matrix[0][0]': `${m00} [int]`, 'matrix[0][1]': `${m01} [int]`, 'matrix[1][0]': `${m10} [int]`, 'matrix[1][1]': `${m11} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'matrix', value: `[[${m00}, ${m01}], [${m10}, ${m11}]]` }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Initialize sum = 0.',
      explanationHinglish: 'sum = 0 initialize hua.',
      memorySnapshot: { 'matrix[0][0]': `${m00} [int]`, 'matrix[0][1]': `${m01} [int]`, 'matrix[1][0]': `${m10} [int]`, 'matrix[1][1]': `${m11} [int]`, sum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    for (let r = 0; r < 2; r++) {
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Outer row loop: r (${r}) < 2 is TRUE.`,
        explanationHinglish: `Outer loop check: r (${r}) < 2 is TRUE.`,
        memorySnapshot: { matrix: `[[${m00}, ${m01}], [${m10}, ${m11}]]`, sum: `${sum} [int]`, r: `${r} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'r < 2',
          formula: `${r} < 2`,
          inputs: ['r'],
          result: true,
          explanation: `${r} < 2 is True`
        }
      });

      for (let c = 0; c < 2; c++) {
        const val = matrix[r][c];
        const oldSum = sum;
        sum += val;

        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Inner col loop: c (${c}) < 2 is TRUE.`,
          explanationHinglish: `Inner loop check: c (${c}) < 2 is TRUE.`,
          memorySnapshot: { matrix: `[[${m00}, ${m01}], [${m10}, ${m11}]]`, sum: `${oldSum} [int]`, r: `${r} [int]`, c: `${c} [int]` },
          animationEvent: {
            type: 'EVALUATE_CONDITION' as const,
            condition: 'c < 2',
            formula: `${c} < 2`,
            inputs: ['c'],
            result: true,
            explanation: `${c} < 2 is True`
          }
        });

        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Traverse matrix[${r}][${c}] (${val}): sum (${oldSum}) + ${val} = ${sum}.`,
          explanationHinglish: `Matrix element matrix[${r}][${c}]=${val} sum me add hua -> sum = ${sum}.`,
          memorySnapshot: { matrix: `[[${m00}, ${m01}], [${m10}, ${m11}]]`, sum: `${sum} [int]`, r: `${r} [int]`, c: `${c} [int]` },
          animationEvent: {
            type: 'COMPUTE' as const,
            inputs: ['sum', `matrix[${r}][${c}]`],
            operator: '+',
            storeIn: 'sum',
            result: sum
          }
        });
      }
    }

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `System.out.println prints Matrix Sum = ${sum}.`,
      explanationHinglish: `Console pe "Matrix Sum = ${sum}" print hua.`,
      memorySnapshot: { sum: `${sum} [int]` },
      consoleOutput: `Matrix Sum = ${sum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'sum', outputValue: sum }
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { sum: `${sum} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '5', paramId: 'd00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '8', paramId: 'd01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 'd10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '9', paramId: 'd11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'diagSum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Diagonal Sum = "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'diagSum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    d00: { default: 5, label: 'mat[0][0]' },
    d01: { default: 8, label: 'mat[0][1]' },
    d10: { default: 3, label: 'mat[1][0]' },
    d11: { default: 9, label: 'mat[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const d00 = Number(vars?.d00 ?? 5);
    const d01 = Number(vars?.d01 ?? 8);
    const d10 = Number(vars?.d10 ?? 3);
    const d11 = Number(vars?.d11 ?? 9);
    const mat = [[d00, d01], [d10, d11]];

    const steps: ExecutionStep[] = [];
    let stepNum = 1;
    let diagSum = 0;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Allocate 2x2 Matrix mat = {{${d00}, ${d01}}, {${d10}, ${d11}}}.`,
      explanationHinglish: `2x2 Matrix mat allocate hua.`,
      memorySnapshot: { 'mat[0][0]': `${d00} [int]`, 'mat[0][1]': `${d01} [int]`, 'mat[1][0]': `${d10} [int]`, 'mat[1][1]': `${d11} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: `[[${d00}, ${d01}], [${d10}, ${d11}]]` }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Initialize diagSum = 0.',
      explanationHinglish: 'diagSum = 0 initialize hua.',
      memorySnapshot: { diagSum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'diagSum', value: 0 }
    });

    for (let i = 0; i < 2; i++) {
      const val = mat[i][i];
      const oldDiag = diagSum;
      diagSum += val;

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Loop condition: i (${i}) < 2 is TRUE.`,
        explanationHinglish: `Loop check: i (${i}) < 2 is TRUE.`,
        memorySnapshot: { diagSum: `${oldDiag} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'i < 2',
          formula: `${i} < 2`,
          inputs: ['i'],
          result: true,
          explanation: `${i} < 2 is True`
        }
      });

      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Primary diagonal mat[${i}][${i}] (${val}): diagSum (${oldDiag}) + ${val} = ${diagSum}.`,
        explanationHinglish: `Diagonal element mat[${i}][${i}]=${val} diagSum me add hua -> ${diagSum}.`,
        memorySnapshot: { mat: `[[${d00}, ${d01}], [${d10}, ${d11}]]`, diagSum: `${diagSum} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['diagSum', `mat[${i}][${i}]`],
          operator: '+',
          storeIn: 'diagSum',
          result: diagSum
        }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `System.out.println prints Diagonal Sum = ${diagSum}.`,
      explanationHinglish: `Console pe "Diagonal Sum = ${diagSum}" print hua.`,
      memorySnapshot: { mat: `[[${d00}, ${d01}], [${d10}, ${d11}]]`, diagSum: `${diagSum} [int]` },
      consoleOutput: `Diagonal Sum = ${diagSum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'diagSum', outputValue: diagSum }
    });

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { mat: `[[${d00}, ${d01}], [${d10}, ${d11}]]`, diagSum: `${diagSum} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaMatrixTranspose: LessonProgram = {
  id: 'java_matrix_transpose',
  language: 'java',
  topic: 'arrays',
  lessonNumber: 7,
  friendlyName: '2D Matrix Transpose using Nested Loops',
  learningObjective: 'Learn matrix transposition (t[j][i] = mat[i][j]) using nested loops in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{{' }, { type: 'number', value: '1', paramId: 't00' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '2', paramId: 't01' }, { type: 'punctuation', value: '},' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'number', value: '3', paramId: 't10' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'number', value: '4', paramId: 't11' }, { type: 'punctuation', value: '}};' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[][]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 't' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'new' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'int' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '][' }, { type: 'number', value: '2' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'j' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '                ' }, { type: 'variable', value: 't' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ']' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'mat' }, { type: 'punctuation', value: '[' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: '][' }, { type: 'variable', value: 'j' }, { type: 'punctuation', value: '];' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '            ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Transposed Matrix Done"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    t00: { default: 1, label: 'mat[0][0]' },
    t01: { default: 2, label: 'mat[0][1]' },
    t10: { default: 3, label: 'mat[1][0]' },
    t11: { default: 4, label: 'mat[1][1]' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const t00 = Number(vars?.t00 ?? 1);
    const t01 = Number(vars?.t01 ?? 2);
    const t10 = Number(vars?.t10 ?? 3);
    const t11 = Number(vars?.t11 ?? 4);
    const mat = [[t00, t01], [t10, t11]];
    const t = [[0, 0], [0, 0]];

    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Allocate 2x2 original matrix mat = {{${t00}, ${t01}}, {${t10}, ${t11}}}.`,
      explanationHinglish: `Original Matrix mat = {{${t00}, ${t01}}, {${t10}, ${t11}}} allocate hua.`,
      memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'mat', value: `[[${t00}, ${t01}], [${t10}, ${t11}]]` }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Allocate empty 2x2 transpose matrix t = new int[2][2].',
      explanationHinglish: 'Khali 2x2 transpose matrix t allocate hua.',
      memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]`, t: '[[0, 0], [0, 0]]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 't', value: '[[0, 0], [0, 0]]' }
    });

    for (let i = 0; i < 2; i++) {
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Outer loop check: i (${i}) < 2 is TRUE.`,
        explanationHinglish: `Outer row loop check: i (${i}) < 2 is TRUE.`,
        memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]`, t: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'i < 2',
          formula: `${i} < 2`,
          inputs: ['i'],
          result: true,
          explanation: `${i} < 2 is True`
        }
      });

      for (let j = 0; j < 2; j++) {
        const val = mat[i][j];
        t[j][i] = val;

        steps.push({
          step: stepNum++, lineNum: 6,
          explanationEnglish: `Inner loop check: j (${j}) < 2 is TRUE.`,
          explanationHinglish: `Inner col loop check: j (${j}) < 2 is TRUE.`,
          memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]`, t: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]`, i: `${i} [int]`, j: `${j} [int]` },
          animationEvent: {
            type: 'EVALUATE_CONDITION' as const,
            condition: 'j < 2',
            formula: `${j} < 2`,
            inputs: ['j'],
            result: true,
            explanation: `${j} < 2 is True`
          }
        });

        steps.push({
          step: stepNum++, lineNum: 7,
          explanationEnglish: `Transpose copy: t[${j}][${i}] = mat[${i}][${j}] (${val}).`,
          explanationHinglish: `Row-column transpose: t[${j}][${i}] me mat[${i}][${j}] (${val}) copy hua.`,
          memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]`, t: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]`, i: `${i} [int]`, j: `${j} [int]` },
          animationEvent: {
            type: 'COMPUTE' as const,
            inputs: [`mat[${i}][${j}]`],
            operator: '=',
            storeIn: `t[${j}][${i}]`,
            result: val
          }
        });
      }
    }

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: `System.out.println prints Transposed Matrix -> [[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]].`,
      explanationHinglish: `Console pe Transposed Matrix print hua.`,
      memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]`, t: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]` },
      consoleOutput: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 't', outputValue: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]` }
    });

    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { mat: `[[${t00}, ${t01}], [${t10}, ${t11}]]`, t: `[[${t[0][0]}, ${t[0][1]}], [${t[1][0]}, ${t[1][1]}]]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
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
        explanationEnglish: `Declare int a = ${aVal}, b = ${bVal}.`,
        explanationHinglish: `a = ${aVal} aur b = ${bVal} declare hua.`,
        memorySnapshot: { a: `${aVal} [int]`, b: `${bVal} [int]` },
        animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'a', value: aVal }, { name: 'b', value: bVal }] }
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
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `a: ${newA}, b: ${newB}` }
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
        explanationEnglish: `Declare double P = ${p}, R = ${r}%, T = ${t} years.`,
        explanationHinglish: `P = ${p}, R = ${r}%, T = ${t} years memory me store hue.`,
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]` },
        animationEvent: {
          type: 'MULTI_CREATE_VARIABLES' as const,
          variables: [
            { name: 'P', value: p },
            { name: 'R', value: r },
            { name: 'T', value: t }
          ]
        }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Evaluate Simple Interest formula: (${p} * ${r} * ${t}) / 100 -> Result ${si}.`,
        explanationHinglish: `Values substitute karke SI calculate kiya: (${p} * ${r} * ${t}) / 100 = ${si}.`,
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]`, SI: `${si} [double]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['P', 'R', 'T'],
          operator: '* / 100',
          storeIn: 'SI',
          result: si
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Interest: ${si}.`,
        explanationHinglish: `Console pe "Interest: ${si}" print hua.`,
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]`, SI: `${si} [double]` },
        consoleOutput: `Interest: ${si}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Interest: ${si}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { P: `${p} [double]`, R: `${r} [double]`, T: `${t} [double]`, SI: `${si} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
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
    const isPos = val > 0;
    const isNeg = val < 0;
    const result = isPos ? 'Positive' : isNeg ? 'Negative' : 'Zero';
    const lineToExec = isPos ? 5 : isNeg ? 7 : 9;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int num = ${val}.`,
        explanationHinglish: `Variable num = ${val} declare hua.`,
        memorySnapshot: { num: `${val} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'num', value: val }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check first condition: ${val} > 0 -> ${isPos ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla check: ${val} > 0 -> ${isPos ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { num: `${val} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'num', variableValue: val, operator: '> 0', result: isPos }
      }
    ];

    if (!isPos) {
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Check second condition: ${val} < 0 -> ${isNeg ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusra check: ${val} < 0 -> ${isNeg ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { num: `${val} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'num', variableValue: val, operator: '< 0', result: isNeg }
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: lineToExec,
      explanationEnglish: `Execute selected branch: System.out.println("${result}").`,
      explanationHinglish: `Matching branch execute hoke "${result}" print hua.`,
      memorySnapshot: { num: `${val} [int]` },
      consoleOutput: result,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: result }
    });

    steps.push({
      step: steps.length + 1, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { num: `${val} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaBmiCalc: LessonProgram = {
  id: 'java_bmi_calc',
  language: 'java',
  topic: 'if_elif_else',
  lessonNumber: 4,
  friendlyName: 'BMI Category Ladder',
  learningObjective: 'Categorize BMI value using an if-else if decision ladder in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'bmi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '22.5', paramId: 'bmi' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'bmi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '18.5' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Underweight"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'bmi' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<' }, { type: 'text', value: ' ' }, { type: 'number', value: '25.0' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Normal Weight"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Overweight"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    bmi: { default: 22.5, min: 10.0, max: 45.0, label: 'bmi (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const bmiVal = Number(vars.bmi ?? 22.5);
    const isUnder = bmiVal < 18.5;
    const isNormal = bmiVal < 25.0;
    const category = isUnder ? 'Underweight' : isNormal ? 'Normal Weight' : 'Overweight';
    const lineToExec = isUnder ? 5 : isNormal ? 7 : 9;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare double bmi = ${bmiVal}.`,
        explanationHinglish: `Variable bmi = ${bmiVal} declare hua.`,
        memorySnapshot: { bmi: `${bmiVal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'bmi', value: bmiVal }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check first condition: ${bmiVal} < 18.5 -> ${isUnder ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla check: ${bmiVal} < 18.5 -> ${isUnder ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { bmi: `${bmiVal} [double]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'bmi', variableValue: bmiVal, operator: '< 18.5', result: isUnder }
      }
    ];

    if (!isUnder) {
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Check second condition: ${bmiVal} < 25.0 -> ${isNormal ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusra check: ${bmiVal} < 25.0 -> ${isNormal ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { bmi: `${bmiVal} [double]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'bmi', variableValue: bmiVal, operator: '< 25.0', result: isNormal }
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: lineToExec,
      explanationEnglish: `Execute selected branch: System.out.println("${category}").`,
      explanationHinglish: `Matching branch execute hoke "${category}" print hua.`,
      memorySnapshot: { bmi: `${bmiVal} [double]` },
      consoleOutput: category,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: category }
    });

    steps.push({
      step: steps.length + 1, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { bmi: `${bmiVal} [double]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

export const javaElectricityBill: LessonProgram = {
  id: 'java_electricity_bill',
  language: 'java',
  topic: 'if_elif_else',
  lessonNumber: 5,
  friendlyName: 'Electricity Tariff Slab Ladder',
  learningObjective: 'Calculate tariff rate per unit using an if-else if tier structure in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '150', paramId: 'units' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"₹3.5 per unit"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'units' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '200' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"₹5.0 per unit"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'else' }, { type: 'text', value: ' {' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '            ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"₹7.0 per unit"' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 12, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    units: { default: 150, min: 10, max: 1000, label: 'units (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const u = Number(vars.units ?? 150);
    const isTier1 = u <= 100;
    const isTier2 = u <= 200;
    const slab = isTier1 ? '₹3.5 per unit' : isTier2 ? '₹5.0 per unit' : '₹7.0 per unit';
    const lineToExec = isTier1 ? 5 : isTier2 ? 7 : 9;

    const steps: ExecutionStep[] = [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int units = ${u}.`,
        explanationHinglish: `Variable units = ${u} declare hua.`,
        memorySnapshot: { units: `${u} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'units', value: u }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Check first tier: ${u} <= 100 -> ${isTier1 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Pehla tier check: ${u} <= 100 -> ${isTier1 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { units: `${u} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'units', variableValue: u, operator: '<= 100', result: isTier1 }
      }
    ];

    if (!isTier1) {
      steps.push({
        step: steps.length + 1, lineNum: 6,
        explanationEnglish: `Check second tier: ${u} <= 200 -> ${isTier2 ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Dusra tier check: ${u} <= 200 -> ${isTier2 ? 'TRUE' : 'FALSE'}.`,
        memorySnapshot: { units: `${u} [int]` },
        animationEvent: { type: 'EVALUATE_CONDITION' as const, variableName: 'units', variableValue: u, operator: '<= 200', result: isTier2 }
      });
    }

    steps.push({
      step: steps.length + 1, lineNum: lineToExec,
      explanationEnglish: `Execute selected branch: System.out.println("${slab}").`,
      explanationHinglish: `Matching branch execute hoke "${slab}" print hua.`,
      memorySnapshot: { units: `${u} [int]` },
      consoleOutput: slab,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: slab }
    });

    steps.push({
      step: steps.length + 1, lineNum: 11,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { units: `${u} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
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
    n: { default: 5, min: 2, max: 10, label: 'n terms (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const limit = Math.abs(Number(vars?.n ?? 5));
    let a = 0;
    let b = 1;
    let consoleOut = '';
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set n = ${limit}, a = 0, b = 1.`,
      explanationHinglish: `n = ${limit}, a = 0, b = 1 declare hua.`,
      memorySnapshot: { n: `${limit} [int]`, a: '0 [int]', b: '1 [int]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'n', value: limit }, { name: 'a', value: 0 }, { name: 'b', value: 1 }] }
    });

    consoleOut = 'Fibonacci Series:';
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Print header "Fibonacci Series:".',
      explanationHinglish: 'Console pe "Fibonacci Series:" print hua.',
      memorySnapshot: { n: `${limit} [int]`, a: '0 [int]', b: '1 [int]' },
      consoleOutput: consoleOut,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Fibonacci Series:' }
    });

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Loop Initialization: set counter i = 1.',
      explanationHinglish: 'Loop Init: counter variable i = 1 set hua.',
      memorySnapshot: { n: `${limit} [int]`, a: '0 [int]', b: '1 [int]', i: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    for (let i = 1; i <= limit; i++) {
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Condition check: i (${i}) <= n (${limit}) is TRUE.`,
        explanationHinglish: `Condition check: ${i} <= ${limit} is TRUE. Loop body execute hogi.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'i <= n',
          formula: 'i <= n',
          inputs: ['i', 'n'],
          result: true,
          explanation: `${i} <= ${limit} is True`
        }
      });

      consoleOut += (consoleOut ? ' ' : '') + `${a}`;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Iteration ${i}: Print current term a (${a}).`,
        explanationHinglish: `Iteration ${i}: Term a = ${a} print hua.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, i: `${i} [int]` },
        consoleOutput: consoleOut,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'a', outputValue: String(a) }
      });

      const c = a + b;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Compute next term c = a (${a}) + b (${b}) = ${c}.`,
        explanationHinglish: `Compute next term c = a (${a}) + b (${b}) = ${c}.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: [`a (${a})`, `b (${b})`],
          operator: '+',
          storeIn: 'c',
          result: c
        }
      });

      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Update variable c = ${c}.`,
        explanationHinglish: `Variable c me value ${c} store hui.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]`, i: `${i} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'c', value: c }
      });

      const oldA = a;
      a = b;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Shift: a = b -> a = ${a}.`,
        explanationHinglish: `Shift: a = b -> a = ${a}.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]`, i: `${i} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'a', oldValue: oldA, newValue: a }
      });

      const oldB = b;
      b = c;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Shift: b = c -> b = ${b}.`,
        explanationHinglish: `Shift: b = c -> b = ${b}.`,
        memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, c: `${c} [int]`, i: `${i} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'b', oldValue: oldB, newValue: b }
      });

      if (i < limit) {
        steps.push({
          step: stepNum++, lineNum: 5,
          explanationEnglish: `Increment i++ -> i = ${i + 1}. Loop process repeat arrow.`,
          explanationHinglish: `Increment i++ -> i = ${i + 1}. Repeat loop arrow se next term iteration.`,
          memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, i: `${i + 1} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: i + 1 }
        });
      }
    }

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: `Condition check: i (${limit + 1}) <= n (${limit}) is FALSE. Loop exit.`,
      explanationHinglish: `Condition check: ${limit + 1} <= ${limit} is FALSE. Loop finish ho gaya.`,
      memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]`, i: `${limit + 1} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: 'i <= n',
        formula: 'i <= n',
        inputs: ['i', 'n'],
        result: false,
        explanation: `${limit + 1} <= ${limit} is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: `${limit} [int]`, a: `${a} [int]`, b: `${b} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

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
    const limit = Math.abs(Number(vars?.n ?? 10));
    let consoleOut = '';
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set limit n = ${limit}.`,
      explanationHinglish: `n = ${limit} set hua.`,
      memorySnapshot: { n: `${limit} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'n', value: limit }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Loop Initialization: counter i = 2.',
      explanationHinglish: 'Loop Init: counter variable i = 2 set hua.',
      memorySnapshot: { n: `${limit} [int]`, i: '2 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 2 }
    });

    for (let i = 2; i <= limit; i += 2) {
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Condition check: i (${i}) <= n (${limit}) is TRUE.`,
        explanationHinglish: `Condition check: ${i} <= ${limit} is TRUE. Loop body execute hogi.`,
        memorySnapshot: { n: `${limit} [int]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'i <= n',
          formula: 'i <= n',
          inputs: ['i', 'n'],
          result: true,
          explanation: `${i} <= ${limit} is True`
        }
      });

      consoleOut += (consoleOut ? '\n' : '') + `${i}`;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Iteration: Print even number i = ${i}.`,
        explanationHinglish: `Console pe even number ${i} print hua.`,
        memorySnapshot: { n: `${limit} [int]`, i: `${i} [int]` },
        consoleOutput: consoleOut,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'i', outputValue: String(i) }
      });

      if (i + 2 <= limit) {
        steps.push({
          step: stepNum++, lineNum: 4,
          explanationEnglish: `Step Increment i += 2 -> i = ${i + 2}. Loop process repeat arrow.`,
          explanationHinglish: `Step Increment i += 2 -> i = ${i + 2}. Repeat loop arrow se next condition check.`,
          memorySnapshot: { n: `${limit} [int]`, i: `${i + 2} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: i + 2 }
        });
      }
    }

    const nextI = Math.floor(limit / 2) * 2 + 2;
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Condition check: i (${nextI}) <= n (${limit}) is FALSE. Loop exit.`,
      explanationHinglish: `Condition check: ${nextI} <= ${limit} is FALSE. Loop finish ho gaya.`,
      memorySnapshot: { n: `${limit} [int]`, i: `${nextI} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: 'i <= n',
        formula: 'i <= n',
        inputs: ['i', 'n'],
        result: false,
        explanation: `${nextI} <= ${limit} is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { n: `${limit} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

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
    const b = Math.abs(Number(vars?.base ?? 2));
    const e = Math.abs(Number(vars?.exp ?? 5));
    let res = 1;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set base = ${b}, exp = ${e}.`,
      explanationHinglish: `base = ${b}, exp = ${e} set hua.`,
      memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]` },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'base', value: b }, { name: 'exp', value: e }] }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Initialize result = 1.',
      explanationHinglish: 'result = 1 initialize hua.',
      memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: '1 [long]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'result', value: 1 }
    });

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: 'Loop Initialization: counter i = 1.',
      explanationHinglish: 'Loop Init: counter variable i = 1 set hua.',
      memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: '1 [long]', i: '1 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'i', value: 1 }
    });

    for (let i = 1; i <= e; i++) {
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Condition check: i (${i}) <= exp (${e}) is TRUE.`,
        explanationHinglish: `Condition check: ${i} <= ${e} is TRUE. Loop body execute hogi.`,
        memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${res} [long]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'i <= exp',
          formula: 'i <= exp',
          inputs: ['i', 'exp'],
          result: true,
          explanation: `${i} <= ${e} is True`
        }
      });

      const oldRes = res;
      res *= b;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Iteration ${i}: Compute result (${oldRes}) * base (${b}) = ${res}.`,
        explanationHinglish: `Iteration ${i}: Compute result (${oldRes}) * base (${b}) = ${res}.`,
        memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${oldRes} [long]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: [`result (${oldRes})`, `base (${b})`],
          operator: '*',
          storeIn: 'result',
          result: res
        }
      });

      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Iteration ${i}: Update result to ${res}.`,
        explanationHinglish: `Iteration ${i}: result me new value ${res} store hui.`,
        memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${res} [long]`, i: `${i} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'result', oldValue: oldRes, newValue: res }
      });

      if (i < e) {
        steps.push({
          step: stepNum++, lineNum: 5,
          explanationEnglish: `Increment i++ -> i = ${i + 1}. Loop process repeat arrow.`,
          explanationHinglish: `Increment i++ -> i = ${i + 1}. Repeat loop arrow se next iteration condition check.`,
          memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${res} [long]`, i: `${i + 1} [int]` },
          animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'i', oldValue: i, newValue: i + 1 }
        });
      }
    }

    steps.push({
      step: stepNum++, lineNum: 5,
      explanationEnglish: `Condition check: i (${e + 1}) <= exp (${e}) is FALSE. Loop exit.`,
      explanationHinglish: `Condition check: ${e + 1} <= ${e} is FALSE. Loop finish ho gaya.`,
      memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${res} [long]`, i: `${e + 1} [int]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: 'i <= exp',
        formula: 'i <= exp',
        inputs: ['i', 'exp'],
        result: false,
        explanation: `${e + 1} <= ${e} is False`
      }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: `System.out.println prints Result: ${res}.`,
      explanationHinglish: `Console pe "Result: ${res}" print hua.`,
      memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${res} [long]` },
      consoleOutput: `Result: ${res}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Result: ${res}` }
    });

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { base: `${b} [int]`, exp: `${e} [int]`, result: `${res} [long]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1', paramId: 'count' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'do' }, { type: 'text', value: ' {' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'sum' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'count' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'count' }, { type: 'operator', value: '++' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'while' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '<=' }, { type: 'text', value: ' ' }, { type: 'number', value: '5' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Total Sum: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'sum' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 11, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    count: { default: 1, min: 1, max: 5, label: 'count (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    let count = Math.abs(Number(vars?.count ?? 1));
    let sum = 0;
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Set count = ${count}.`,
      explanationHinglish: `count = ${count} set hua.`,
      memorySnapshot: { count: `${count} [int]` },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'count', value: count }
    });

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'Set sum = 0.',
      explanationHinglish: 'sum = 0 set hua.',
      memorySnapshot: { count: `${count} [int]`, sum: '0 [int]' },
      animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sum', value: 0 }
    });

    do {
      const oldSum = sum;
      sum += count;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Compute sum (${oldSum}) + count (${count}) = ${sum}.`,
        explanationHinglish: `Compute sum (${oldSum}) + count (${count}) = ${sum}.`,
        memorySnapshot: { count: `${count} [int]`, sum: `${oldSum} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: [`sum (${oldSum})`, `count (${count})`],
          operator: '+',
          storeIn: 'sum',
          result: sum
        }
      });

      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Update sum = ${sum}.`,
        explanationHinglish: `sum = ${sum} update hua.`,
        memorySnapshot: { count: `${count} [int]`, sum: `${sum} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'sum', oldValue: oldSum, newValue: sum }
      });

      const oldCount = count;
      count++;
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Increment counter: count++ -> count = ${count}.`,
        explanationHinglish: `Increment count++ -> count = ${count}.`,
        memorySnapshot: { count: `${count} [int]`, sum: `${sum} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'count', oldValue: oldCount, newValue: count }
      });

      const cond = count <= 5;
      steps.push({
        step: stepNum++, lineNum: 8,
        explanationEnglish: `Do-while condition: count (${count}) <= 5 is ${cond ? 'TRUE' : 'FALSE'}.`,
        explanationHinglish: `Do-while condition: ${count} <= 5 is ${cond ? 'TRUE. Loop repeat.' : 'FALSE. Loop exit.'}`,
        memorySnapshot: { count: `${count} [int]`, sum: `${sum} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: `count <= 5`,
          formula: `count <= 5`,
          inputs: ['count'],
          result: cond,
          explanation: `${count} <= 5 is ${cond ? 'True' : 'False'}`
        }
      });
    } while (count <= 5);

    steps.push({
      step: stepNum++, lineNum: 9,
      explanationEnglish: `System.out.println prints Total Sum: ${sum}.`,
      explanationHinglish: `Console pe "Total Sum: ${sum}" print hua.`,
      memorySnapshot: { count: `${count} [int]`, sum: `${sum} [int]` },
      consoleOutput: `Total Sum: ${sum}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Total Sum: ${sum}` }
    });

    steps.push({
      step: stepNum++, lineNum: 10,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { count: `${count} [int]`, sum: `${sum} [int]` },
      animationEvent: { type: 'COMPLETE' as const }
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
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'greeting' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Hello"', paramId: 'greeting' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"Java"', paramId: 'name' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'fullMsg' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'greeting' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'string', value: '", "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'name' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'fullMsg' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    greeting: { default: '"Hello"', type: 'text', label: 'greeting (String)' },
    name: { default: '"Java"', type: 'text', label: 'name (String)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const greetingVal = String(vars?.greeting ?? 'Hello').replace(/['"]/g, '') || 'Hello';
    const nameVal = String(vars?.name ?? 'Java').replace(/['"]/g, '') || 'Java';
    const fullMsgVal = `${greetingVal}, ${nameVal}`;

    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize String greeting = "${greetingVal}".`,
        explanationHinglish: `greeting = "${greetingVal}" initialize hua.`,
        memorySnapshot: { greeting: `"${greetingVal}" [String]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'greeting', value: `"${greetingVal}"` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Initialize String name = "${nameVal}".`,
        explanationHinglish: `name = "${nameVal}" initialize hua.`,
        memorySnapshot: { greeting: `"${greetingVal}" [String]`, name: `"${nameVal}" [String]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'name', value: `"${nameVal}"` }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Concatenate: "${greetingVal}" + ", " + "${nameVal}" -> "${fullMsgVal}".`,
        explanationHinglish: `Strings concatenate hoke fullMsg = "${fullMsgVal}" bana.`,
        memorySnapshot: { greeting: `"${greetingVal}" [String]`, name: `"${nameVal}" [String]`, fullMsg: `"${fullMsgVal}" [String]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['greeting', '", "', 'name'],
          operator: '+ +',
          storeIn: 'fullMsg',
          result: `"${fullMsgVal}"`
        }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `System.out.println prints "${fullMsgVal}".`,
        explanationHinglish: `Console pe "${fullMsgVal}" print hua.`,
        memorySnapshot: { greeting: `"${greetingVal}" [String]`, name: `"${nameVal}" [String]`, fullMsg: `"${fullMsgVal}" [String]` },
        consoleOutput: fullMsgVal,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'fullMsg', outputValue: fullMsgVal }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { greeting: `"${greetingVal}" [String]`, name: `"${nameVal}" [String]`, fullMsg: `"${fullMsgVal}" [String]` },
        animationEvent: { type: 'COMPLETE' as const }
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
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Enter age: ' }
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
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Your age is: ${userAge}` }
      },
      {
        step: 5, lineNum: 8,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { sc: 'Scanner [Obj]', age: `${userAge} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
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
        step: 2, lineNum: 5,
        explanationEnglish: 'System.out.print prompt: "Enter salary: ".',
        explanationHinglish: 'Console pe prompt: "Enter salary: " print hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        consoleOutput: 'Enter salary: ',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Enter salary: ' }
      },
      {
        step: 3, lineNum: 6,
        explanationEnglish: `sc.nextDouble() reads decimal input -> ${sal}.`,
        explanationHinglish: `sc.nextDouble() ne decimal input ${sal} read kiya. salary = ${sal} store hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', salary: `${sal} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'salary', value: sal }
      },
      {
        step: 4, lineNum: 7,
        explanationEnglish: `System.out.println prints Salary: ₹${sal}.`,
        explanationHinglish: `Console pe "Salary: ₹${sal}" print hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', salary: `${sal} [double]` },
        consoleOutput: `Enter salary: \nSalary: ₹${sal}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Salary: ₹${sal}` }
      },
      {
        step: 5, lineNum: 8,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { sc: 'Scanner [Obj]', salary: `${sal} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
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
  editableVariables: {
    name: { default: 'Rahul Sharma', label: 'sc.nextLine() text' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const strName = String(vars.name ?? 'Rahul Sharma');
    return [
      {
        step: 1, lineNum: 4,
        explanationEnglish: 'Initialize Scanner object sc.',
        explanationHinglish: 'Scanner object sc initialize hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'sc', value: 'Scanner' }
      },
      {
        step: 2, lineNum: 5,
        explanationEnglish: 'System.out.print prompt: "Enter full name: ".',
        explanationHinglish: 'Console pe prompt: "Enter full name: " print hua.',
        memorySnapshot: { sc: 'Scanner [Obj]' },
        consoleOutput: 'Enter full name: ',
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: 'Enter full name: ' }
      },
      {
        step: 3, lineNum: 6,
        explanationEnglish: `sc.nextLine() reads string line input -> "${strName}".`,
        explanationHinglish: `sc.nextLine() ne string line "${strName}" read ki. name = "${strName}" store hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', name: `"${strName}" [String]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'name', value: `"${strName}"` }
      },
      {
        step: 4, lineNum: 7,
        explanationEnglish: `System.out.println prints Welcome, ${strName}.`,
        explanationHinglish: `Console pe "Welcome, ${strName}" print hua.`,
        memorySnapshot: { sc: 'Scanner [Obj]', name: `"${strName}" [String]` },
        consoleOutput: `Enter full name: \nWelcome, ${strName}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: '', outputValue: `Welcome, ${strName}` }
      },
      {
        step: 5, lineNum: 8,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { sc: 'Scanner [Obj]', name: `"${strName}" [String]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

// ==============================================================================
// NEW VARIABLE PROGRAMS: Reassignment, Multiple Declarations, Final Constants
// ==============================================================================

export const javaVarReassign: LessonProgram = {
  id: 'java_var_reassign',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 4,
  friendlyName: 'Variable Value Reassignment',
  learningObjective: 'Observe how variable memory cell values are updated and overwritten over time.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'counter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '10', paramId: 'startVal' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'counter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'counter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'number', value: '15' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'counter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '100' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Final Counter: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'counter' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    startVal: { default: 10, min: 0, max: 1000, label: 'counter start value' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const v1 = Number(vars?.startVal ?? 10);
    const v2 = v1 + 15;
    const v3 = 100;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare int counter = ${v1}.`,
        explanationHinglish: `Variable 'counter' initialize hua with value ${v1}.`,
        memorySnapshot: { counter: `${v1} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'counter', value: v1 }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Add 15: counter = ${v1} + 15 -> ${v2}.`,
        explanationHinglish: `Calculation: ${v1} + 15 = ${v2}. counter update hua.`,
        memorySnapshot: { counter: `${v2} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['counter', '15'],
          operator: '+',
          storeIn: 'counter',
          result: v2
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Overwrite counter with direct value ${v3}.`,
        explanationHinglish: `counter ki purani value overwrite hoke ${v3} ban gayi.`,
        memorySnapshot: { counter: `${v3} [int]` },
        animationEvent: { type: 'UPDATE_VARIABLE' as const, name: 'counter', oldValue: v2, newValue: v3 }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `System.out.println prints Final Counter: ${v3}.`,
        explanationHinglish: `Console pe "Final Counter: ${v3}" print hua.`,
        memorySnapshot: { counter: `${v3} [int]` },
        consoleOutput: `Final Counter: ${v3}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'counter', outputValue: `Final Counter: ${v3}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { counter: `${v3} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaMultiVars: LessonProgram = {
  id: 'java_multi_vars',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 5,
  friendlyName: 'Multiple Variables Initialization',
  learningObjective: 'Learn declaring multiple variables of same type and performing cross calculations.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '12', paramId: 'len' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'width' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '8', paramId: 'wid' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'perimeter' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'length' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'width' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Perimeter: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'perimeter' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    len: { default: 12, min: 1, max: 100, label: 'length (int)' },
    wid: { default: 8, min: 1, max: 100, label: 'width (int)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const l = Number(vars?.len ?? 12);
    const w = Number(vars?.wid ?? 8);
    const p = 2 * (l + w);
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Declare length = ${l}.`,
        explanationHinglish: `Variable length = ${l} memory me store hua.`,
        memorySnapshot: { length: `${l} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'length', value: l }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare width = ${w}.`,
        explanationHinglish: `Variable width = ${w} memory me store hua.`,
        memorySnapshot: { length: `${l} [int]`, width: `${w} [int]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'width', value: w }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Compute Perimeter: 2 * (${l} + ${w}) = ${p}.`,
        explanationHinglish: `Formula 2 * (${l} + ${w}) calculate karke perimeter = ${p} bana.`,
        memorySnapshot: { length: `${l} [int]`, width: `${w} [int]`, perimeter: `${p} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['2', 'length', 'width'],
          operator: '* +',
          storeIn: 'perimeter',
          result: p
        }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `System.out.println prints Perimeter: ${p}.`,
        explanationHinglish: `Console pe "Perimeter: ${p}" print hua.`,
        memorySnapshot: { length: `${l} [int]`, width: `${w} [int]`, perimeter: `${p} [int]` },
        consoleOutput: `Perimeter: ${p}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'perimeter', outputValue: `Perimeter: ${p}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { length: `${l} [int]`, width: `${w} [int]`, perimeter: `${p} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaConstants: LessonProgram = {
  id: 'java_constants',
  language: 'java',
  topic: 'data_types',
  lessonNumber: 6,
  friendlyName: 'Constants with final Keyword',
  learningObjective: 'Learn immutable memory slots declared with final keyword in Java.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'final' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'PI' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '3.14159' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '7.0', paramId: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'double' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'circumference' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '2' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'PI' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'radius' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Circumference: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'circumference' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 8, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    radius: { default: 7.0, label: 'radius (double)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const r = Number(vars?.radius ?? 7.0);
    const pi = 3.14159;
    const circ = parseFloat((2 * pi * r).toFixed(2));
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: 'Declare constant final double PI = 3.14159.',
        explanationHinglish: 'final keyword se constant PI = 3.14159 lock ho gaya.',
        memorySnapshot: { PI: '3.14159 [const]' },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'PI', value: 3.14159 }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Declare double radius = ${r}.`,
        explanationHinglish: `Variable radius = ${r} store hua.`,
        memorySnapshot: { PI: '3.14159 [const]', radius: `${r} [double]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'radius', value: r }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `Compute Circumference: 2 * 3.14159 * ${r} = ${circ}.`,
        explanationHinglish: `Circumference formula 2 * PI * radius calculate hua = ${circ}.`,
        memorySnapshot: { PI: '3.14159 [const]', radius: `${r} [double]`, circumference: `${circ} [double]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['2', 'PI', 'radius'],
          operator: '* *',
          storeIn: 'circumference',
          result: circ
        }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: `System.out.println prints Circumference: ${circ}.`,
        explanationHinglish: `Console pe "Circumference: ${circ}" print hua.`,
        memorySnapshot: { PI: '3.14159 [const]', radius: `${r} [double]`, circumference: `${circ} [double]` },
        consoleOutput: `Circumference: ${circ}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'circumference', outputValue: `Circumference: ${circ}` }
      },
      {
        step: 5, lineNum: 7,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { PI: '3.14159 [const]', radius: `${r} [double]`, circumference: `${circ} [double]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

// ==============================================================================
// NEW STRING PROGRAMS: Length, Uppercase/Lowercase, Reverse, Palindrome
// ==============================================================================

export const javaStringLength: LessonProgram = {
  id: 'java_string_length',
  language: 'java',
  topic: 'strings',
  lessonNumber: 3,
  friendlyName: 'String .length() Method',
  learningObjective: 'Inspect String character length using .length() method.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'text' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"TreadCode"', paramId: 'str' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'len' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'text' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'length' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Length: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'len' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    str: { default: '"TreadCode"', type: 'text', label: 'text (String)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = String(vars?.str ?? 'TreadCode').replace(/['"]/g, '') || 'TreadCode';
    const len = raw.length;
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize String text = "${raw}".`,
        explanationHinglish: `String text = "${raw}" memory me create hua.`,
        memorySnapshot: { text: `"${raw}" [String]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'text', value: `"${raw}"` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `Call text.length() -> Counts ${len} characters.`,
        explanationHinglish: `text.length() ne character count calculate kiya = ${len}.`,
        memorySnapshot: { text: `"${raw}" [String]`, len: `${len} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['text'],
          operator: 'len()',
          storeIn: 'len',
          result: len
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Length: ${len}.`,
        explanationHinglish: `Console pe "Length: ${len}" print hua.`,
        memorySnapshot: { text: `"${raw}" [String]`, len: `${len} [int]` },
        consoleOutput: `Length: ${len}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'len', outputValue: `Length: ${len}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { text: `"${raw}" [String]`, len: `${len} [int]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaStringCase: LessonProgram = {
  id: 'java_string_case',
  language: 'java',
  topic: 'strings',
  lessonNumber: 4,
  friendlyName: 'String toUpperCase() Transformation',
  learningObjective: 'Learn uppercase casing transformation using .toUpperCase().',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'word' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"java"', paramId: 'word' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'upper' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'word' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'toUpperCase' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Upper: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'upper' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    word: { default: '"java"', type: 'text', label: 'word (String)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = String(vars?.word ?? 'java').replace(/['"]/g, '') || 'java';
    const upper = raw.toUpperCase();
    return [
      {
        step: 1, lineNum: 3,
        explanationEnglish: `Initialize word = "${raw}".`,
        explanationHinglish: `word = "${raw}" memory me store hua.`,
        memorySnapshot: { word: `"${raw}" [String]` },
        animationEvent: { type: 'CREATE_VARIABLE' as const, name: 'word', value: `"${raw}"` }
      },
      {
        step: 2, lineNum: 4,
        explanationEnglish: `word.toUpperCase() transforms characters to "${upper}".`,
        explanationHinglish: `word.toUpperCase() ne characters ko UPPERCASE "${upper}" me transform kiya.`,
        memorySnapshot: { word: `"${raw}" [String]`, upper: `"${upper}" [String]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['word'],
          operator: 'upper()',
          storeIn: 'upper',
          result: `"${upper}"`
        }
      },
      {
        step: 3, lineNum: 5,
        explanationEnglish: `System.out.println prints Upper: ${upper}.`,
        explanationHinglish: `Console pe "Upper: ${upper}" print hua.`,
        memorySnapshot: { word: `"${raw}" [String]`, upper: `"${upper}" [String]` },
        consoleOutput: `Upper: ${upper}`,
        animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'upper', outputValue: `Upper: ${upper}` }
      },
      {
        step: 4, lineNum: 6,
        explanationEnglish: 'Program finished.',
        explanationHinglish: 'Program finish hua.',
        memorySnapshot: { word: `"${raw}" [String]`, upper: `"${upper}" [String]` },
        animationEvent: { type: 'COMPLETE' as const }
      }
    ];
  },
  executionSteps: []
};

export const javaStringReverse: LessonProgram = {
  id: 'java_string_reverse',
  language: 'java',
  topic: 'strings',
  lessonNumber: 5,
  friendlyName: 'Reverse String with charAt() Loop',
  learningObjective: 'Iterate String backwards and build reversed String using .charAt(i).',
  lines: [
    { lineNum: 1, tokens: [{ type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'class' }, { type: 'text', value: ' ' }, { type: 'function', value: 'Main' }, { type: 'text', value: ' {' }] },
    { lineNum: 2, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'public' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'static' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'void' }, { type: 'text', value: ' ' }, { type: 'function', value: 'main' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'String' }, { type: 'punctuation', value: '[]' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'args' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '"code"', paramId: 'str' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'String' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'string', value: '""' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 4, tokens: [{ type: 'text', value: '        ' }, { type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '(' }, { type: 'keyword', value: 'int' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'length' }, { type: 'punctuation', value: '()' }, { type: 'text', value: ' ' }, { type: 'operator', value: '-' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }, { type: 'punctuation', value: ';' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'i' }, { type: 'operator', value: '--' }, { type: 'punctuation', value: ')' }, { type: 'text', value: ' {' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '            ' }, { type: 'variable', value: 'rev' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'str' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'charAt' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'i' }, { type: 'punctuation', value: ')' }, { type: 'punctuation', value: ';' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '        ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '        ' }, { type: 'function', value: 'System.out.println' }, { type: 'punctuation', value: '(' }, { type: 'string', value: '"Reversed: "' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'rev' }, { type: 'punctuation', value: ');' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '    ' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 9, tokens: [{ type: 'punctuation', value: '}' }] },
  ],
  editableVariables: {
    str: { default: '"code"', type: 'text', label: 'str (String)' }
  },
  generateSteps: (vars): ExecutionStep[] => {
    const raw = String(vars?.str ?? 'code').replace(/['"]/g, '') || 'code';
    let rev = '';
    const steps: ExecutionStep[] = [];
    let stepNum = 1;

    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Initialize str = "${raw}", rev = "".`,
      explanationHinglish: `str = "${raw}" aur rev = "" initialize hua.`,
      memorySnapshot: { str: `"${raw}" [String]`, rev: '"" [String]' },
      animationEvent: { type: 'MULTI_CREATE_VARIABLES' as const, variables: [{ name: 'str', value: `"${raw}"` }, { name: 'rev', value: '""' }] }
    });

    for (let i = raw.length - 1; i >= 0; i--) {
      const ch = raw[i];
      const oldRev = rev;
      rev += ch;

      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `For loop check: i (${i}) >= 0 is TRUE.`,
        explanationHinglish: `Loop condition: i (${i}) >= 0 is TRUE.`,
        memorySnapshot: { str: `"${raw}" [String]`, rev: `"${oldRev}" [String]`, i: `${i} [int]` },
        animationEvent: {
          type: 'EVALUATE_CONDITION' as const,
          condition: 'i >= 0',
          formula: 'i >= 0',
          inputs: ['i'],
          result: true,
          explanation: `${i} >= 0 is True`
        }
      });

      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Extract str.charAt(${i}) = '${ch}'. rev += '${ch}' -> "${rev}".`,
        explanationHinglish: `str.charAt(${i}) = '${ch}' nikalke rev me add kiya -> "${rev}".`,
        memorySnapshot: { str: `"${raw}" [String]`, rev: `"${rev}" [String]`, i: `${i} [int]` },
        animationEvent: {
          type: 'COMPUTE' as const,
          inputs: ['rev', `'${ch}'`],
          operator: '+',
          storeIn: 'rev',
          result: `"${rev}"`
        }
      });
    }

    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: 'For loop check: i (-1) >= 0 is FALSE. Loop finishes.',
      explanationHinglish: 'Loop finish hua (i < 0).',
      memorySnapshot: { str: `"${raw}" [String]`, rev: `"${rev}" [String]` },
      animationEvent: {
        type: 'EVALUATE_CONDITION' as const,
        condition: 'i >= 0',
        formula: 'i >= 0',
        inputs: ['i'],
        result: false,
        explanation: '-1 >= 0 is False'
      }
    });

    steps.push({
      step: stepNum++, lineNum: 7,
      explanationEnglish: `System.out.println prints Reversed: ${rev}.`,
      explanationHinglish: `Console pe "Reversed: ${rev}" print hua.`,
      memorySnapshot: { str: `"${raw}" [String]`, rev: `"${rev}" [String]` },
      consoleOutput: `Reversed: ${rev}`,
      animationEvent: { type: 'PRINT_VALUE' as const, variableName: 'rev', outputValue: `Reversed: ${rev}` }
    });

    steps.push({
      step: stepNum++, lineNum: 8,
      explanationEnglish: 'Program finished.',
      explanationHinglish: 'Program finish hua.',
      memorySnapshot: { str: `"${raw}" [String]`, rev: `"${rev}" [String]` },
      animationEvent: { type: 'COMPLETE' as const }
    });

    return steps;
  },
  executionSteps: []
};

// Export all Java lessons map
export const javaLessons = {
  java_types: javaTypes,
  java_casting: javaCasting,
  java_ascii: javaAscii,
  java_var_reassign: javaVarReassign,
  java_multi_vars: javaMultiVars,
  java_constants: javaConstants,
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
  java_string_length: javaStringLength,
  java_string_case: javaStringCase,
  java_string_reverse: javaStringReverse,
  java_array_sum_1d: javaArraySum1D,
  java_array_max_1d: javaArrayMax1D,
  java_linear_search: javaLinearSearch,
  java_array_reverse: javaArrayReverse,
  java_matrix_2d: javaMatrix2D,
  java_diagonal_sum_2d: javaDiagonalSum2D,
  java_matrix_transpose: javaMatrixTranspose,
};

