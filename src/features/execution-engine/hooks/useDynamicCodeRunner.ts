import { useState, useCallback } from 'react';
import type { ExecutionResult, ExecutionStep } from '../types';
import { PythonInterpreter } from '../interpreters/pythonInterpreter';

export function useDynamicCodeRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const runCode = useCallback((code: string) => {
    setIsRunning(true);
    // Defer execution slightly to allow React state transition
    setTimeout(() => {
      try {
        const execResult = PythonInterpreter.execute(code);
        setResult(execResult);
        setCurrentStepIdx(0);
      } catch (err: unknown) {
        setResult({
          success: false,
          steps: [],
          totalSteps: 0,
          executionTimeMs: 0,
          error: (err as Error)?.message || 'Syntax or runtime error in snippet.',
          tier: 'LOW_SMARTBOARD',
        });
      } finally {
        setIsRunning(false);
      }
    }, 10);
  }, []);

  const nextStep = useCallback(() => {
    if (!result || result.steps.length === 0) return;
    setCurrentStepIdx((prev) => Math.min(prev + 1, result.steps.length - 1));
  }, [result]);

  const prevStep = useCallback(() => {
    if (!result || result.steps.length === 0) return;
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
  }, [result]);

  const reset = useCallback(() => {
    setCurrentStepIdx(0);
  }, []);

  const currentStep: ExecutionStep | null =
    result && result.steps.length > 0 ? result.steps[currentStepIdx] : null;

  return {
    runCode,
    isRunning,
    result,
    currentStep,
    currentStepIdx,
    nextStep,
    prevStep,
    reset,
  };
}
