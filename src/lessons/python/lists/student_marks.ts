import type { LessonProgram, ExecutionStep } from '../../types';

export const student_marks: LessonProgram = {
  id: 'student_marks', language: 'python', topic: 'lists', lessonNumber: 6,
  friendlyName: 'Student Marks Management',
  learningObjective: 'Learn to combine iteration, arithmetic and conditionals to process a list of data.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'marks' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'punctuation', value: '[' }, { type: 'number', value: '45, 80, 25, 90' }, { type: 'punctuation', value: ']' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'p_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 4, tokens: [{ type: 'variable', value: 'f_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '0' }] },
    { lineNum: 5, tokens: [{ type: 'keyword', value: 'for' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'm' }, { type: 'text', value: ' ' }, { type: 'keyword', value: 'in' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 6, tokens: [{ type: 'text', value: '    ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'm' }] },
    { lineNum: 7, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'if' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'm' }, { type: 'text', value: ' ' }, { type: 'operator', value: '>=' }, { type: 'text', value: ' ' }, { type: 'number', value: '35' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 8, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'p_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 9, tokens: [{ type: 'text', value: '    ' }, { type: 'keyword', value: 'else' }, { type: 'punctuation', value: ':' }] },
    { lineNum: 10, tokens: [{ type: 'text', value: '        ' }, { type: 'variable', value: 'f_count' }, { type: 'text', value: ' ' }, { type: 'operator', value: '+=' }, { type: 'text', value: ' ' }, { type: 'number', value: '1' }] },
    { lineNum: 11, tokens: [{ type: 'variable', value: 'avg' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'total' }, { type: 'text', value: ' ' }, { type: 'operator', value: '/' }, { type: 'text', value: ' ' }, { type: 'function', value: 'len' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'marks' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 12, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'avg' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 13, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'p_count' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    marks: { default: '45, 80, 25, 90', type: 'text', label: 'Marks List', noQuotes: true }
  },
  generateSteps: ({ marks }): ExecutionStep[] => {
    let listItems: Array<number> = [45, 80, 25, 90];
    const rawVal = String(marks).trim();
    const cleaned = rawVal.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      listItems = cleaned.split(',').map(s => {
        const n = Number(s.trim());
        return isNaN(n) ? 0 : n;
      });
    }

    const formatPythonList = (items: Array<number>) => {
      return "[" + items.join(', ') + "]";
    };

    const firstListStr = formatPythonList(listItems);
    
    let total = 0;
    let p_count = 0;
    let f_count = 0;
    let stepNum = 1;
    const steps: ExecutionStep[] = [];

    // Step 1: Create list marks
    let mem: Record<string, string | number> = { marks: firstListStr };
    steps.push({
      step: stepNum++, lineNum: 1,
      explanationEnglish: `Create list marks containing: ${firstListStr}.`,
      explanationHinglish: `marks naam ka list banaya jisme elements hain: ${firstListStr}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'marks', value: firstListStr },
    });

    // Step 2: total = 0
    mem.total = total;
    steps.push({
      step: stepNum++, lineNum: 2,
      explanationEnglish: `Initialize total = 0.`,
      explanationHinglish: `total ko 0 se start kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'total', value: total },
    });

    // Step 3: p_count = 0
    mem.p_count = p_count;
    steps.push({
      step: stepNum++, lineNum: 3,
      explanationEnglish: `Initialize pass count p_count = 0.`,
      explanationHinglish: `Pass count p_count ko 0 se start kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'p_count', value: p_count },
    });

    // Step 4: f_count = 0
    mem.f_count = f_count;
    steps.push({
      step: stepNum++, lineNum: 4,
      explanationEnglish: `Initialize fail count f_count = 0.`,
      explanationHinglish: `Fail count f_count ko 0 se start kiya.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'f_count', value: f_count },
    });

    // Loop through listItems
    for (let idx = 0; idx < listItems.length; idx++) {
      const m = listItems[idx];
      
      // Step 5: read element m
      const prevM = mem.m;
      mem.m = m;
      steps.push({
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Loop iteration: Read mark ${m} at index ${idx} from the list.`,
        explanationHinglish: `Loop iteration: List ke index ${idx} se mark ${m} padha.`,
        memorySnapshot: { ...mem },
        animationEvent: prevM !== undefined 
          ? { type: 'UPDATE_VARIABLE', name: 'm', oldValue: prevM, newValue: m }
          : { type: 'CREATE_VARIABLE', name: 'm', value: m },
      });

      // Step 6: total += m
      const oldTotal = total;
      total += m;
      mem.total = total;
      steps.push({
        step: stepNum++, lineNum: 6,
        explanationEnglish: `Add m (${m}) to total: ${oldTotal} + ${m} = ${total}.`,
        explanationHinglish: `total mein m (${m}) joda: ${oldTotal} + ${m} = ${total}.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['total', 'm'], operator: '+=', result: total, storeIn: 'total' },
      });

      // Step 7: check m >= 35
      steps.push({
        step: stepNum++, lineNum: 7,
        explanationEnglish: `Check if mark ${m} >= 35. This is ${m >= 35 ? 'True' : 'False'}.`,
        explanationHinglish: `Check kiya kya mark ${m} >= 35 hai. Yeh ${m >= 35 ? 'True' : 'False'} hai.`,
        memorySnapshot: { ...mem },
        animationEvent: { type: 'COMPUTE', inputs: ['m', '35'], operator: '>=', result: m >= 35 ? 'True' : 'False', storeIn: 'Condition' },
      });

      if (m >= 35) {
        // Step 8: p_count += 1
        const oldP = p_count;
        p_count += 1;
        mem.p_count = p_count;
        steps.push({
          step: stepNum++, lineNum: 8,
          explanationEnglish: `Passed! Increment p_count: ${oldP} + 1 = ${p_count}.`,
          explanationHinglish: `Pass hua! p_count ko 1 se badhaya: ${oldP} + 1 = ${p_count}.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'COMPUTE', inputs: ['p_count', '1'], operator: '+=', result: p_count, storeIn: 'p_count' },
        });
      } else {
        // Step 9: Go to else block
        steps.push({
          step: stepNum++, lineNum: 9,
          explanationEnglish: `Failed (marks < 35). Enter the else block.`,
          explanationHinglish: `Fail hua (marks < 35). else block mein move hua.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'NONE' },
        });

        // Step 10: f_count += 1
        const oldF = f_count;
        f_count += 1;
        mem.f_count = f_count;
        steps.push({
          step: stepNum++, lineNum: 10,
          explanationEnglish: `Increment f_count: ${oldF} + 1 = ${f_count}.`,
          explanationHinglish: `f_count ko 1 se badhaya: ${oldF} + 1 = ${f_count}.`,
          memorySnapshot: { ...mem },
          animationEvent: { type: 'COMPUTE', inputs: ['f_count', '1'], operator: '+=', result: f_count, storeIn: 'f_count' },
        });
      }
    }

    // Step 11: Calculate average
    const avg = parseFloat((total / listItems.length).toFixed(1));
    mem.avg = avg;
    steps.push({
      step: stepNum++, lineNum: 11,
      explanationEnglish: `Calculate average avg = total / len(marks) = ${total} / ${listItems.length} = ${avg}.`,
      explanationHinglish: `Average calculate kiya: avg = total / len(marks) = ${total} / ${listItems.length} = ${avg}.`,
      memorySnapshot: { ...mem },
      animationEvent: { type: 'COMPUTE', inputs: ['total', 'marks'], operator: '/', result: avg, storeIn: 'avg' },
    });

    // Step 12: Print average
    let outputs = [String(avg)];
    steps.push({
      step: stepNum++, lineNum: 12,
      explanationEnglish: `Print the average marks: ${avg}.`,
      explanationHinglish: `Average marks print kiya: ${avg}.`,
      memorySnapshot: { ...mem },
      consoleOutput: outputs.join('\n'),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'avg', outputValue: avg },
    });

    // Step 13: Print p_count
    outputs.push(String(p_count));
    steps.push({
      step: stepNum++, lineNum: 13,
      explanationEnglish: `Print the total pass count: ${p_count}.`,
      explanationHinglish: `Kul pass count print kiya: ${p_count}.`,
      memorySnapshot: { ...mem },
      consoleOutput: outputs.join('\n'),
      animationEvent: { type: 'PRINT_VALUE', variableName: 'p_count', outputValue: p_count },
    });

    return steps;
  },
  executionSteps: [],
};