import type { LessonProgram, ExecutionStep } from '../../types';

export const multiplication: LessonProgram = {
  id: 'multiplication', language: 'python', topic: 'variables', lessonNumber: 6,
  friendlyName: 'Multiplication Using Variables',
  learningObjective: 'Learn how to multiply values stored in variables.',
  lines: [
    { lineNum: 1, tokens: [{ type: 'variable', value: 'boxes' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '4' }] },
    { lineNum: 2, tokens: [{ type: 'variable', value: 'items_per_box' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'number', value: '6' }] },
    { lineNum: 3, tokens: [{ type: 'variable', value: 'total_items' }, { type: 'text', value: ' ' }, { type: 'operator', value: '=' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'boxes' }, { type: 'text', value: ' ' }, { type: 'operator', value: '*' }, { type: 'text', value: ' ' }, { type: 'variable', value: 'items_per_box' }] },
    { lineNum: 4, tokens: [{ type: 'function', value: 'print' }, { type: 'punctuation', value: '(' }, { type: 'variable', value: 'total_items' }, { type: 'punctuation', value: ')' }] },
  ],
  editableVariables: {
    boxes:        { default: 4, min: 1, max: 999, label: 'Boxes' },
    items_per_box: { default: 6, min: 1, max: 999, label: 'Items per Box' },
  },
  generateSteps: ({ boxes, items_per_box }): ExecutionStep[] => {
    const total_items = boxes * items_per_box;
    return [
      {
        step: 1, lineNum: 1,
        explanationEnglish: `Create a box "boxes" and store ${boxes}.`,
        explanationHinglish: `"boxes" naam ka variable declare kiya aur ${boxes} store kiya.`,
        memorySnapshot: { boxes },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'boxes', value: boxes },
      },
      {
        step: 2, lineNum: 2,
        explanationEnglish: `Create a box "items_per_box" and store ${items_per_box}.`,
        explanationHinglish: `"items_per_box" banaya aur usme ${items_per_box} store kar diya.`,
        memorySnapshot: { boxes, items_per_box },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'items_per_box', value: items_per_box },
      },
      {
        step: 3, lineNum: 3,
        explanationEnglish: `Multiply the values (${boxes} * ${items_per_box} = ${total_items}) and store in "total_items".`,
        explanationHinglish: `Dono ka guna kiya aur result ${total_items} ko "total_items" me store kiya.`,
        memorySnapshot: { boxes, items_per_box, total_items },
        animationEvent: { type: 'COMPUTE', inputs: ['boxes', 'items_per_box'], operator: '*', result: total_items, storeIn: 'total_items' },
      },
      {
        step: 4, lineNum: 4,
        explanationEnglish: `Print the value of "total_items".`,
        explanationHinglish: `"total_items" ka value screen par dikhaya.`,
        memorySnapshot: { boxes, items_per_box, total_items },
        consoleOutput: String(total_items),
        animationEvent: { type: 'PRINT_VALUE', variableName: 'total_items', outputValue: total_items },
      },
    ];
  },
  executionSteps: [
    {
      step: 1, lineNum: 1,
      explanationEnglish: 'Create a box "boxes" and store 4.',
      explanationHinglish: '"boxes" naam ka variable declare kiya aur 4 store kiya.',
      memorySnapshot: { boxes: 4 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'boxes', value: 4 },
    },
    {
      step: 2, lineNum: 2,
      explanationEnglish: 'Create a box "items_per_box" and store 6.',
      explanationHinglish: '"items_per_box" banaya aur usme 6 store kar diya.',
      memorySnapshot: { boxes: 4, items_per_box: 6 },
      animationEvent: { type: 'CREATE_VARIABLE', name: 'items_per_box', value: 6 },
    },
    {
      step: 3, lineNum: 3,
      explanationEnglish: 'Multiply the values (4 * 6) and store the result (24) in "total_items".',
      explanationHinglish: 'Dono ka guna (multiply) kiya aur result 24 ko "total_items" me store kiya.',
      memorySnapshot: { boxes: 4, items_per_box: 6, total_items: 24 },
      animationEvent: { type: 'COMPUTE', inputs: ['boxes', 'items_per_box'], operator: '*', result: 24, storeIn: 'total_items' },
    },
    {
      step: 4, lineNum: 4,
      explanationEnglish: 'Print the value of "total_items".',
      explanationHinglish: '"total_items" ka value screen par dikhaya.',
      memorySnapshot: { boxes: 4, items_per_box: 6, total_items: 24 },
      consoleOutput: '24',
      animationEvent: { type: 'PRINT_VALUE', variableName: 'total_items', outputValue: 24 },
    },
  ],
};
