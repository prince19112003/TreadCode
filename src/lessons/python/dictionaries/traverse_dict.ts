import type { LessonProgram, ExecutionStep } from '../../types';

export const traverse_dict: LessonProgram = {
  id: 'traverse_dict', language: 'python', topic: 'dictionaries', lessonNumber: 3,
  friendlyName: 'Dictionary Traversal',
  learningObjective: 'Learn how to loop through a dictionary to access keys, values, and key-value pairs.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'user' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '{' }, { type: 'string', value: '"Name": "Rahul", "Age": 20' }, { type: 'punctuation', value: '}' }] },
    { lineNum: 2, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'k' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'user' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'keys' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 3, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'k' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'v' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'user' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'values' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 5, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'v' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 6, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'k' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'v' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'user' }, { type: 'punctuation', value: '.' }, { type: 'function', value: 'items' }, { type: 'punctuation', value: '()' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'k' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'string', value: '"-"' }, { type: 'punctuation', value: ',' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'v' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    user: { default: '"Name": "Rahul", "Age": 20', type: 'text', label: 'Dictionary Pairs', noQuotes: true }
  },
  generateSteps: ({ user }): ExecutionStep[] => {
    let dictObj: Record<string, string | number> = { Name: 'Rahul', Age: 20 };
    const rawVal = String(user).trim();
    const cleaned = rawVal.replace(/[\{\}]/g, '').trim();
    if (cleaned) {
      const parsed: Record<string, string | number> = {};
      const pairs = cleaned.split(',');
      pairs.forEach(p => {
        const parts = p.split(':');
        if (parts.length === 2) {
          const k = parts[0].trim().replace(/['"]/g, '');
          const v = parts[1].trim();
          parsed[k] = isNaN(Number(v)) ? v.replace(/['"]/g, '') : Number(v);
        }
      });
      if (Object.keys(parsed).length > 0) {
        dictObj = parsed;
      }
    }

    const formatDictStr = (obj: Record<string, string | number>) => {
      const entries = Object.entries(obj).map(([k, v]) => `'${k}': ${typeof v === 'string' ? `'${v}'` : v}`);
      return "{" + entries.join(', ') + "}";
    };

    const dictStr = formatDictStr(dictObj);
    const keysList = Object.keys(dictObj);
    const valuesList = Object.values(dictObj);
    const consoleOutputs: string[] = [];

    let stepNum = 1;
    const steps: ExecutionStep[] = [];
    let mem: Record<string, string | number> = { user: dictStr };

    // Step 1: Create dict
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `Create dictionary user: ${dictStr}.`,
      explanationHinglish: `Dictionary user banayi: ${dictStr}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'user', value: dictStr },
    });

    // Loop 1: keys()
    for (let i = 0; i < keysList.length; i++) {
      const k = keysList[i];
      const prevK = mem.k;
      mem.k = k;
      steps.push({
        step: stepNum++, lineNum: 2,
        explanationEnglish: `Loop over keys using .keys(): Read key "${k}".`,
        explanationHinglish: `.keys() par loop execute kiya: "${k}" key padhi.`,
        memorySnapshot: { ...mem },
        animationEvent: prevK !== undefined 
          ? { type: 'UPDATE_VARIABLE', name: 'k', oldValue: prevK, newValue: `"${k}"` }
          : { type: 'CREATE_VARIABLE', name: 'k', value: `"${k}"` },
      });

      consoleOutputs.push(k);
      steps.push({
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Print key "${k}".`,
        explanationHinglish: `Key "${k}" print kiya.`,
        memorySnapshot: { ...mem },
        consoleOutput: consoleOutputs.join('\n'),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'k', outputValue: `"${k}"` },
      });
    }

    // Loop 2: values()
    for (let i = 0; i < valuesList.length; i++) {
      const v = valuesList[i];
      const prevV = mem.v;
      mem.v = v;
      const vOut = typeof v === 'string' ? `"${v}"` : String(v);
      steps.push({
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Loop over values using .values(): Read value ${vOut}.`,
        explanationHinglish: `.values() par loop execute kiya: Value ${vOut} padhi.`,
        memorySnapshot: { ...mem },
        animationEvent: prevV !== undefined 
          ? { type: 'UPDATE_VARIABLE', name: 'v', oldValue: prevV, newValue: vOut }
          : { type: 'CREATE_VARIABLE', name: 'v', value: vOut },
      });

      consoleOutputs.push(String(v));
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Print value ${vOut}.`,
        explanationHinglish: `Value ${vOut} print kiya.`,
        memorySnapshot: { ...mem },
        consoleOutput: consoleOutputs.join('\n'),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'v', outputValue: vOut },
      });
    }

    // Loop 3: items()
    for (let i = 0; i < keysList.length; i++) {
      const k = keysList[i];
      const v = dictObj[k];
      mem.k = k;
      mem.v = v;
      const vOut = typeof v === 'string' ? `"${v}"` : String(v);
      
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Loop over key-value pairs using .items(): Read key "${k}" and value ${vOut}.`,
        explanationHinglish: `.items() par loop execute kiya: Key "${k}" aur value ${vOut} padhi.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'UPDATE_VARIABLE', name: 'k', oldValue: mem.k || '', newValue: `"${k}"` },
      });

      const lineOut = `${k} - ${v}`;
      consoleOutputs.push(lineOut);
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Print key-value pair: "${lineOut}".`,
        explanationHinglish: `Key-value pair print kiya: "${lineOut}".`,
        memorySnapshot: { ...mem },
        consoleOutput: consoleOutputs.join('\n'),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'output', outputValue: `"${lineOut}"` },
      });
    }

    return steps;
  },
  executionSteps: [],
};