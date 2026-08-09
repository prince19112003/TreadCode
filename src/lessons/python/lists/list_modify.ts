import type { LessonProgram, ExecutionStep } from '../../types';

export const list_modify: LessonProgram = {
  id: 'list_modify', language: 'python', topic: 'lists', lessonNumber: 4,
  friendlyName: 'Insert and Delete Elements',
  learningObjective: 'Learn how to add elements to a specific position and remove them using list methods.',
  lines: [
    { lineNum: 1, tokens: [
      { type: 'variable', value: 'data' }, 
      { type: 'text', value: ' ' }, 
      { type: 'operator', value: '=' }, 
      { type: 'text', value: ' ' }, 
      { type: 'punctuation', value: '[' }, 
      { type: 'number', value: 'A, B, C' }, 
      { type: 'punctuation', value: ']' }
    ] },
    { lineNum: 2, tokens: [
      { type: 'variable', value: 'data' }, 
      { type: 'punctuation', value: '.' }, 
      { type: 'function', value: 'insert' }, 
      { type: 'punctuation', value: '(' }, 
      { type: 'number', value: '1' }, 
      { type: 'punctuation', value: ',' }, 
      { type: 'text', value: ' ' }, 
      { type: 'string', value: '"X"' }, 
      { type: 'punctuation', value: ')' }
    ] },
    { lineNum: 3, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'data' }, { type: 'punctuation', value: ')' }] },
    { lineNum: 4, tokens: [
      { type: 'keyword', value: 'del' }, 
      { type: 'text', value: ' ' }, 
      { type: 'variable', value: 'data' }, 
      { type: 'punctuation', value: '[' }, 
      { type: 'number', value: '2' }, 
      { type: 'punctuation', value: ']' }
    ] },
    { lineNum: 5, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'data' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    data: { default: 'A, B, C', type: 'text', label: 'Data List', noQuotes: true },
    insert_index: { default: 1, min: 0, max: 20, type: 'number', label: 'Insert Index' },
    insert_value: { default: '"X"', type: 'text', label: 'Insert Value' },
    delete_index: { default: 2, min: 0, max: 20, type: 'number', label: 'Delete Index' },
  },
  generateSteps: ({ data, insert_index, insert_value, delete_index }): ExecutionStep[] => {
    let listItems: Array<string | number> = ['A', 'B', 'C'];
    const rawVal = String(data).trim();
    const cleaned = rawVal.replace(/[\[\]]/g, '').trim();
    if (cleaned) {
      listItems = cleaned.split(',').map(s => {
        const v = s.trim();
        return isNaN(Number(v)) ? v.replace(/['"]/g, '') : Number(v);
      });
    }

    const formatPythonList = (arr: Array<string | number>) => {
      return "[" + arr.map(x => typeof x === 'string' ? `'${x}'` : x).join(', ') + "]";
    };

    const insIdx = Math.max(0, Math.min(listItems.length, Number(insert_index) ?? 1));
    const insVal = String(insert_value).replace(/['"]/g, '').trim() || 'X';
    const fInsVal = `'${insVal}'`;

    const firstListStr = formatPythonList(listItems);

    // Perform Insert
    const listAfterInsert = [...listItems];
    listAfterInsert.splice(insIdx, 0, insVal);
    const insertListStr = formatPythonList(listAfterInsert);

    // Perform Delete
    const delIdx = Math.max(0, Math.min(listAfterInsert.length - 1, Number(delete_index) ?? 2));
    const deletedVal = listAfterInsert[delIdx];
    const listAfterDelete = [...listAfterInsert];
    listAfterDelete.splice(delIdx, 1);
    const deleteListStr = formatPythonList(listAfterDelete);

    let stepNum = 1;
    return [
      {
        step: stepNum++, lineNum: 1,
        explanationEnglish: `Create list data containing: [${listItems.join(', ')}].`,
        explanationHinglish: `data naam ka list banaya jisme elements hain: [${listItems.join(', ')}].`,
        memorySnapshot: { data: firstListStr },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'data', value: firstListStr },
      },
      {
        step: stepNum++, lineNum: 2,
        explanationEnglish: `Insert "${insVal}" at index ${insIdx}. Elements shift right.`,
        explanationHinglish: `Index ${insIdx} par "${insVal}" insert kiya. Baaki elements right shift ho move hua.`,
        memorySnapshot: { data: insertListStr },
        animationEvent: { type: 'COMPUTE', inputs: ['data', String(insIdx), fInsVal], operator: 'insert', result: insertListStr, storeIn: 'data' },
      },
      {
        step: stepNum++, lineNum: 3,
        explanationEnglish: `Print the list contents after insertion.`,
        explanationHinglish: `Insertion ke baad list ke contents print kiye.`,
        memorySnapshot: { data: insertListStr },
        consoleOutput: `['${listAfterInsert.join("', '")}']`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'data', outputValue: insertListStr },
      },
      {
        step: stepNum++, lineNum: 4,
        explanationEnglish: `Delete element "${deletedVal}" at index ${delIdx}. Elements shift left.`,
        explanationHinglish: `Index ${delIdx} ke element "${deletedVal}" ko delete kiya. Baaki elements left shift ho move hua.`,
        memorySnapshot: { data: deleteListStr },
        animationEvent: { type: 'COMPUTE', inputs: ['data', String(delIdx)], operator: 'del', result: deleteListStr, storeIn: 'data' },
      },
      {
        step: stepNum++, lineNum: 5,
        explanationEnglish: `Print the list contents after deletion.`,
        explanationHinglish: `Deletion ke baad list ke contents print kiye.`,
        memorySnapshot: { data: deleteListStr },
        consoleOutput: `['${listAfterInsert.join("', '")}']\n['${listAfterDelete.join("', '")}']`,
        animationEvent: { type: 'PRINT_VALUE', variableName: 'data', outputValue: deleteListStr },
      }
    ];
  },
  executionSteps: [],
};