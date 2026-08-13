export type TokenType =
  | 'keyword'
  | 'function'
  | 'variable'
  | 'string'
  | 'number'
  | 'operator'
  | 'punctuation'
  | 'comment'
  | 'parameter'
  | 'text';

export interface CodeToken {
  type: TokenType;
  value: string;
  paramId?: string;
}

export interface CodeLine {
  lineNum: number;
  tokens: CodeToken[];
}

// ─── Animation Event Types ────────────────────────────────────────────────────

export type AnimationEvent =
  | { type: 'CREATE_VARIABLE'; name: string; value: string | number; formula?: string }
  | { type: 'UPDATE_VARIABLE'; name: string; oldValue: string | number; newValue: string | number; formula?: string }
  | { type: 'COPY_VALUE'; from: string; to: string; value: string | number }
  | { type: 'PRINT_VALUE'; variableName: string; outputValue: string | number }
  | { type: 'COMPUTE'; inputs: string[]; operator: string; result: string | number; storeIn: string; formula?: string }
  | { type: 'SWAP'; varA: string; varB: string }
  | { type: 'MATCH_START'; variableName: string; value: string | number }
  | { type: 'FUNCTION_CALL'; functionName: string; args: Record<string, string | number> }
  | { type: 'FUNCTION_RETURN'; functionName: string; returnValue?: string | number }
  | { type: 'UPDATE_ARRAY_INDEX'; arrayName: string; index: number; oldValue: string | number; newValue: string | number }
  | { type: 'MULTI_CREATE_VARIABLES'; variables: Array<{ name: string; value: string | number }> }
  | { type: 'HIGHLIGHT_ARRAY_INDEX'; arrayName: string; index: number }
  | { type: 'USER_INPUT_PROMPT'; prompt: string; variableName: string; value: string | number }
  | { type: 'TYPE_CAST_TRANSFORM'; fromType: string; toType: string; fromValue: string | number; toValue: string | number; variableName: string }
  | { type: 'COMPLETE' }
  | { type: 'NONE' }
  // ── DSA-Specific Events (language-independent) ──────────────────────────────
  | { type: 'STACK_PUSH'; value: string | number; stackState: (string | number)[] }
  | { type: 'STACK_POP'; poppedValue: string | number; stackState: (string | number)[] }
  | { type: 'ENQUEUE'; value: string | number; queueState: (string | number)[] }
  | { type: 'DEQUEUE'; dequeuedValue: string | number; queueState: (string | number)[] }
  | { type: 'QUEUE_ENQUEUE'; value: string | number; queueState: (string | number | null)[] }
  | { type: 'QUEUE_DEQUEUE'; dequeuedValue: string | number; queueState: (string | number | null)[] }
  | { type: 'QUEUE_PEEK'; peekValue: string | number; peekIndex: number }
  | { type: 'SET_POINTERS'; pointers: Record<string, number | null> }
  | { type: 'COMPARE_INDICES'; arrayName: string; indexA: number; indexB: number; result: 'swap' | 'no-swap' | 'found' | 'not-found' }
  | { type: 'NODE_TRAVERSE'; nodeId: string | number; fromId?: string | number }
  | { type: 'TREE_VISIT'; nodeValue: string | number; traversalOrder: (string | number)[] }
  | { type: 'LINKED_LIST_UPDATE'; nodes: Array<{ id: number; value: string | number; next: number | null }> };

// ─── Execution Step ───────────────────────────────────────────────────────────

export interface ExecutionStep {
  step: number;
  lineNum: number;
  explanationEnglish: string;
  explanationHinglish: string;
  memorySnapshot: Record<string, any>;
  consoleOutput?: string;
  animationEvent: AnimationEvent;
}

// ─── Editable Variable Definition ────────────────────────────────────────────

export interface EditableVariableDef {
  default: number | string;
  min?: number;
  max?: number;
  label?: string;
  type?: 'number' | 'text';
  noQuotes?: boolean;
}

// ─── Lesson Program ───────────────────────────────────────────────────────────

export interface LessonProgram {
  id: string;
  language: string;
  topic: string;
  lessonNumber: number;
  friendlyName: string;
  learningObjective: string;
  learningObjectiveHinglish?: string;
  lines: CodeLine[];
  executionSteps: ExecutionStep[];
  /** Defines which initial variables are user-editable */
  editableVariables?: Record<string, EditableVariableDef>;
  /** Pure function: given seed values, returns a fresh set of execution steps */
  generateSteps?: (vars: Record<string, any>) => ExecutionStep[];
}

