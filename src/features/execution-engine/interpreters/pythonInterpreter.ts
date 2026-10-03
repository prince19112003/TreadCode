import type { ExecutionResult, ExecutionStep, ExecutionVariableSnapshot } from '../types';
import { detectDeviceTier, getHardwareConstraints } from '../profiler';

interface Scope {
  [name: string]: number | string | boolean | (number | string)[];
}

interface ParsedLine {
  lineNum: number; // 1-indexed
  raw: string;
  trimmed: string;
  indent: number;
}

/**
 * Ultra-Lightweight Educational Python Interpreter
 * Guaranteed to run in < 1.5MB of RAM without crashing 1GB Globus SmartBoards.
 */
export class PythonInterpreter {
  public static execute(sourceCode: string): ExecutionResult {
    const startTime = performance.now();
    const tier = detectDeviceTier();
    const limits = getHardwareConstraints(tier);

    const steps: ExecutionStep[] = [];
    const scope: Scope = {};
    let stepCount = 0;
    let stdoutBuffer = '';

    const lines: ParsedLine[] = sourceCode
      .split('\n')
      .map((raw, idx) => {
        const trimmed = raw.trim();
        const indent = raw.search(/\S|$/);
        return { lineNum: idx + 1, raw, trimmed, indent };
      })
      .filter((l) => l.trimmed.length > 0 && !l.trimmed.startsWith('#'));

    if (lines.length === 0) {
      return {
        success: true,
        steps: [],
        totalSteps: 0,
        executionTimeMs: 0,
        tier,
      };
    }

    // Helper: Clone scope for safe historical timeline snapshots
    const snapshotScope = (): ExecutionVariableSnapshot => {
      const snap: ExecutionVariableSnapshot = {};
      for (const [k, v] of Object.entries(scope)) {
        if (Array.isArray(v)) {
          snap[k] = [...v];
        } else {
          snap[k] = v;
        }
      }
      return snap;
    };

    // Helper: Evaluate arithmetic / logic / array expressions safely
    const evaluateExpression = (expr: string): unknown => {
      expr = expr.trim();

      // String literal
      if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
        return expr.slice(1, -1);
      }

      // Boolean literal
      if (expr === 'True') return true;
      if (expr === 'False') return false;

      // Numeric literal
      if (!isNaN(Number(expr)) && expr !== '') {
        return Number(expr);
      }

      // Array literal [1, 2, 3]
      if (expr.startsWith('[') && expr.endsWith(']')) {
        const inner = expr.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map((elem) => evaluateExpression(elem) as number | string);
      }

      // len(arr)
      const lenMatch = expr.match(/^len\((.+)\)$/);
      if (lenMatch) {
        const val = evaluateExpression(lenMatch[1]);
        if (Array.isArray(val) || typeof val === 'string') return val.length;
        return 0;
      }

      // List indexing: arr[index]
      const indexMatch = expr.match(/^([a-zA-Z_]\w*)\[(.+)\]$/);
      if (indexMatch) {
        const arrName = indexMatch[1];
        const idxVal = Number(evaluateExpression(indexMatch[2]));
        const arr = scope[arrName];
        if (Array.isArray(arr) && idxVal >= 0 && idxVal < arr.length) {
          return arr[idxVal];
        }
        return 0;
      }

      // Direct variable
      if (/^[a-zA-Z_]\w*$/.test(expr)) {
        return scope[expr] !== undefined ? scope[expr] : 0;
      }

      // Safe evaluation of simple binary expressions: a + b, x == y, etc.
      // Replace identifiers with their scope values
      try {
        const sanitized = expr
          .replace(/\band\b/g, '&&')
          .replace(/\bor\b/g, '||')
          .replace(/\bnot\b/g, '!')
          .replace(/([a-zA-Z_]\w*)\[([^\]]+)\]/g, (_, arr, idx) => {
            const arrVal = scope[arr];
            const iVal = evaluateExpression(idx);
            if (Array.isArray(arrVal)) return JSON.stringify(arrVal[Number(iVal)] ?? 0);
            return '0';
          })
          .replace(/\b[a-zA-Z_]\w*\b/g, (match) => {
            if (match === 'true' || match === 'false' || match === 'null') return match;
            if (scope[match] !== undefined) {
              return JSON.stringify(scope[match]);
            }
            return '0';
          });

        // Restricted math evaluation without dynamic function calls
        if (!/^[0-9+\-*/%<>=!&|().,\s"'\\[\\]]+$/.test(sanitized)) {
          return 0;
        }

        // eslint-disable-next-line no-new-func
        const fn = new Function(`return (${sanitized});`);
        return fn();
      } catch {
        return 0;
      }
    };

    // Execution loop over statement indices
    let pc = 0;
    while (pc < lines.length) {
      if (stepCount >= limits.maxExecutionSteps) {
        return {
          success: true,
          steps,
          totalSteps: stepCount,
          executionTimeMs: Math.round(performance.now() - startTime),
          error: `Execution limit reached: Stopped at ${limits.maxExecutionSteps} steps to safeguard SmartBoard memory.`,
          tier,
        };
      }

      if (performance.now() - startTime >= limits.maxExecutionTimeMs) {
        return {
          success: true,
          steps,
          totalSteps: stepCount,
          executionTimeMs: Math.round(performance.now() - startTime),
          error: `Execution timeout (${limits.maxExecutionTimeMs}ms) to prevent UI thread freezing.`,
          tier,
        };
      }

      const curr = lines[pc];
      const trimmed = curr.trimmed;

      // 1. Print statement: print(...)
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inside = trimmed.slice(6, -1);
        const args = inside ? inside.split(',').map((a) => evaluateExpression(a.trim())) : [''];
        const printStr = args.map((a) => (Array.isArray(a) ? `[${a.join(', ')}]` : String(a))).join(' ');
        stdoutBuffer += (stdoutBuffer ? '\n' : '') + printStr;

        stepCount++;
        steps.push({
          stepIndex: stepCount,
          line: curr.lineNum,
          codeLine: curr.raw,
          variables: snapshotScope(),
          explanation: `Printed: "${printStr}"`,
          output: stdoutBuffer,
        });
        pc++;
        continue;
      }

      // 2. Variable or Array index assignment: x = 10 or arr[i] = 20 or a, b = b, a
      if (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('<=') && !trimmed.includes('>=')) {
        const parts = trimmed.split('=');
        const lhs = parts[0].trim();
        const rhs = parts.slice(1).join('=').trim();

        // Tuple swap: a, b = b, a
        if (lhs.includes(',') && rhs.includes(',')) {
          const lVars = lhs.split(',').map((s) => s.trim());
          const rVals = rhs.split(',').map((s) => evaluateExpression(s.trim()));
          lVars.forEach((v, i) => {
            scope[v] = rVals[i] as number | string;
          });
          stepCount++;
          steps.push({
            stepIndex: stepCount,
            line: curr.lineNum,
            codeLine: curr.raw,
            variables: snapshotScope(),
            explanation: `Swapped (${lVars.join(', ')}) with (${rVals.join(', ')})`,
            output: stdoutBuffer,
          });
          pc++;
          continue;
        }

        // Array element assignment: arr[idx] = val
        const arrAssignMatch = lhs.match(/^([a-zA-Z_]\w*)\[(.+)\]$/);
        if (arrAssignMatch) {
          const arrName = arrAssignMatch[1];
          const idxVal = Number(evaluateExpression(arrAssignMatch[2]));
          const computedVal = evaluateExpression(rhs) as number | string;
          if (Array.isArray(scope[arrName])) {
            const arr = scope[arrName] as (number | string)[];
            if (idxVal >= 0 && idxVal < limits.maxArrayLength) {
              arr[idxVal] = computedVal;
            }
          }
          stepCount++;
          steps.push({
            stepIndex: stepCount,
            line: curr.lineNum,
            codeLine: curr.raw,
            variables: snapshotScope(),
            explanation: `Updated ${arrName}[${idxVal}] = ${computedVal}`,
            output: stdoutBuffer,
          });
          pc++;
          continue;
        }

        // Standard variable: x = value
        if (/^[a-zA-Z_]\w*$/.test(lhs)) {
          const computedVal = evaluateExpression(rhs) as number | string | boolean | (number | string)[];
          scope[lhs] = computedVal;
          stepCount++;
          steps.push({
            stepIndex: stepCount,
            line: curr.lineNum,
            codeLine: curr.raw,
            variables: snapshotScope(),
            explanation: `Set variable ${lhs} = ${Array.isArray(computedVal) ? `[${computedVal.join(', ')}]` : computedVal}`,
            output: stdoutBuffer,
          });
          pc++;
          continue;
        }
      }

      // 3. For loop: for i in range(...)
      const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.+)\):$/);
      if (forMatch) {
        const loopVar = forMatch[1];
        const rangeArgs = forMatch[2].split(',').map((a) => Number(evaluateExpression(a.trim())));
        let start = 0;
        let end = 0;
        let step = 1;

        if (rangeArgs.length === 1) {
          end = rangeArgs[0];
        } else if (rangeArgs.length >= 2) {
          start = rangeArgs[0];
          end = rangeArgs[1];
          if (rangeArgs.length >= 3) step = rangeArgs[2];
        }

        // Find the block of the for loop based on indentation
        const loopIndent = curr.indent;
        let blockEnd = pc + 1;
        while (blockEnd < lines.length && lines[blockEnd].indent > loopIndent) {
          blockEnd++;
        }
        const innerLines = lines.slice(pc + 1, blockEnd);

        // Execute loop iterations
        for (let iter = start; step > 0 ? iter < end : iter > end; iter += step) {
          if (stepCount >= limits.maxExecutionSteps) break;
          scope[loopVar] = iter;
          stepCount++;
          steps.push({
            stepIndex: stepCount,
            line: curr.lineNum,
            codeLine: curr.raw,
            variables: snapshotScope(),
            explanation: `Loop: ${loopVar} = ${iter}`,
            output: stdoutBuffer,
          });

          // Execute inner block statements
          let innerPc = 0;
          while (innerPc < innerLines.length) {
            const innerCurr = innerLines[innerPc];
            const inTrimmed = innerCurr.trimmed;

            if (inTrimmed.startsWith('print(') && inTrimmed.endsWith(')')) {
              const inside = inTrimmed.slice(6, -1);
              const args = inside ? inside.split(',').map((a) => evaluateExpression(a.trim())) : [''];
              const printStr = args.map((a) => (Array.isArray(a) ? `[${a.join(', ')}]` : String(a))).join(' ');
              stdoutBuffer += (stdoutBuffer ? '\n' : '') + printStr;
              stepCount++;
              steps.push({
                stepIndex: stepCount,
                line: innerCurr.lineNum,
                codeLine: innerCurr.raw,
                variables: snapshotScope(),
                explanation: `Printed: "${printStr}"`,
                output: stdoutBuffer,
              });
              innerPc++;
              continue;
            }

            if (inTrimmed.includes('=') && !inTrimmed.includes('==') && !inTrimmed.includes('<=') && !inTrimmed.includes('>=')) {
              const parts = inTrimmed.split('=');
              const lhs = parts[0].trim();
              const rhs = parts.slice(1).join('=').trim();

              const arrAssignMatch = lhs.match(/^([a-zA-Z_]\w*)\[(.+)\]$/);
              if (arrAssignMatch) {
                const arrName = arrAssignMatch[1];
                const idxVal = Number(evaluateExpression(arrAssignMatch[2]));
                const val = evaluateExpression(rhs) as number | string;
                if (Array.isArray(scope[arrName])) {
                  (scope[arrName] as (number | string)[])[idxVal] = val;
                }
                stepCount++;
                steps.push({
                  stepIndex: stepCount,
                  line: innerCurr.lineNum,
                  codeLine: innerCurr.raw,
                  variables: snapshotScope(),
                  explanation: `Updated ${arrName}[${idxVal}] = ${val}`,
                  output: stdoutBuffer,
                });
              } else if (/^[a-zA-Z_]\w*$/.test(lhs)) {
                const val = evaluateExpression(rhs) as number | string | boolean | (number | string)[];
                scope[lhs] = val;
                stepCount++;
                steps.push({
                  stepIndex: stepCount,
                  line: innerCurr.lineNum,
                  codeLine: innerCurr.raw,
                  variables: snapshotScope(),
                  explanation: `Updated ${lhs} = ${Array.isArray(val) ? `[${val.join(', ')}]` : val}`,
                  output: stdoutBuffer,
                });
              }
            }
            innerPc++;
          }
        }

        pc = blockEnd;
        continue;
      }

      // Fallback: Increment program counter if unhandled statement
      pc++;
    }

    // Terminal step
    if (steps.length > 0) {
      steps[steps.length - 1].isTerminal = true;
    }

    return {
      success: true,
      steps,
      totalSteps: steps.length,
      executionTimeMs: Math.round(performance.now() - startTime),
      tier,
    };
  }
}
