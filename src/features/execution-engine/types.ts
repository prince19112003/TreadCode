/**
 * Dynamic Execution Engine Types & Contracts
 * Completely decoupled from existing Visualizer stages for safe rollback.
 */

export type DeviceTier = 'LOW_SMARTBOARD' | 'MID_RANGE' | 'DESKTOP';

export interface ExecutionVariableSnapshot {
  [varName: string]: number | string | boolean | (number | string)[];
}

export interface ExecutionStep {
  stepIndex: number;
  line: number;
  codeLine: string;
  variables: ExecutionVariableSnapshot;
  explanation: string;
  output?: string;
  isTerminal?: boolean;
}

export interface ExecutionResult {
  success: boolean;
  steps: ExecutionStep[];
  error?: string;
  totalSteps: number;
  executionTimeMs: number;
  tier: DeviceTier;
}

export interface DynamicProgramDraft {
  language: 'python';
  code: string;
}
