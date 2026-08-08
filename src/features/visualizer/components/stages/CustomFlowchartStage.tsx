import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Expand, Shrink } from 'lucide-react';
import { useLesson } from '../../../../lessons/LessonContext';
import { usePinchZoom } from '../../../../shared/hooks/usePinchZoom';

import { VariableBox } from '../elements/VariableBox';
import { PrintBox } from '../elements/PrintBox';
import { ComputeBlock } from '../elements/ComputeBlock';
import { ConditionBox } from '../elements/ConditionBox';
import { MatchBlock } from '../elements/MatchBlock';
import { FunctionBlock } from '../elements/FunctionBlock';
import { FunctionStatementRow } from '../elements/FunctionStatementRow';
import { DataStructureBox } from '../elements/DataStructureBox';

const SVGConnector: React.FC<{ isActive: boolean; isReturning: boolean; isExecuting: boolean; isVisible: boolean }> = ({ isActive, isReturning, isExecuting, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="absolute top-0 bottom-0 left-1/2 w-48 -translate-x-1/2 pointer-events-none z-0" style={{ height: '300px', marginTop: '100px' }}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 0,10 C 50,10 50,50 100,50"
          fill="none"
          stroke={isExecuting ? 'rgba(245, 158, 11, 0.4)' : isReturning ? 'rgba(20, 184, 166, 0.2)' : 'rgba(245, 158, 11, 0.2)'}
          strokeWidth="2"
          strokeDasharray={isExecuting ? undefined : "4 4"}
          className={isExecuting ? "animate-pulse" : undefined}
          vectorEffect="non-scaling-stroke"
        />
        {isActive && (
          <motion.path
            d={isReturning ? "M 100,50 C 50,50 50,10 0,10" : "M 0,10 C 50,10 50,50 100,50"}
            fill="none"
            stroke={isReturning ? '#14b8a6' : '#f59e0b'}
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1, 1, 0] }}
          />
        )}
      </svg>
    </div>
  );
};

const isDataStructure = (val: any) => {
  if (typeof val !== 'string') return false;
  let cleaned = val.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
  return (cleaned.startsWith('[') && cleaned.endsWith(']')) || 
         (cleaned.startsWith('{') && cleaned.endsWith('}')) ||
         (cleaned.startsWith('(') && cleaned.endsWith(')'));
};

const parseDataStructure = (val: any) => {
  let cleaned = String(val).trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
  const isTuple = cleaned.startsWith('(') && cleaned.endsWith(')');
  
  if (cleaned.startsWith('[') || isTuple) {
    try {
      const jsonStr = isTuple ? `[${cleaned.slice(1, -1)}]` : cleaned;
      const formattedJson = jsonStr.replace(/'/g, '"');
      return {
        variant: isTuple ? ('tuple' as const) : ('array' as const),
        items: JSON.parse(formattedJson) as Array<string | number>
      };
    } catch {
      const items = cleaned.slice(1, -1).split(',').map(s => {
        const v = s.trim();
        return isNaN(Number(v)) ? v.replace(/['"]/g, '') : Number(v);
      });
      return { variant: isTuple ? ('tuple' as const) : ('array' as const), items };
    }
  } else {
    try {
      const formattedJson = cleaned.replace(/'/g, '"');
      return {
        variant: 'table' as const,
        items: JSON.parse(formattedJson) as Record<string, string | number>
      };
    } catch {
      const items: Record<string, string | number> = {};
      const pairs = cleaned.slice(1, -1).split(',');
      pairs.forEach(p => {
        const parts = p.split(':');
        if (parts.length === 2) {
          const k = parts[0].trim().replace(/['"]/g, '');
          const v = parts[1].trim();
          items[k] = isNaN(Number(v)) ? v.replace(/['"]/g, '') : Number(v);
        }
      });
      return { variant: 'table' as const, items };
    }
  }
};

const getVarTypeForLanguage = (varName: string, lessonLines: any[]) => {
  if (!varName || !lessonLines) return undefined;
  for (const line of lessonLines) {
    const tokens = line?.tokens || [];
    const varIdx = tokens.findIndex((t: any) => t.value === varName);
    if (varIdx > 0) {
      const kwToken = tokens.slice(0, varIdx).reverse().find((t: any) => 
        t.type === 'keyword' && ['int', 'double', 'float', 'bool', 'char', 'void', 'long', 'string', 'short', 'auto', 'struct', 'const'].includes(t.value)
      );
      if (kwToken) return kwToken.value;
    }
  }
  return undefined;
};

const getPointersAndRange = (memSnapshot: Record<string, any>) => {
  if (!memSnapshot) return { pointers: undefined, searchRange: undefined };
  const low = typeof memSnapshot.low === 'number' ? memSnapshot.low : undefined;
  const mid = typeof memSnapshot.mid === 'number' ? memSnapshot.mid : undefined;
  const high = typeof memSnapshot.high === 'number' ? memSnapshot.high : undefined;

  const pointers = (low !== undefined || mid !== undefined || high !== undefined)
    ? { low, mid, high }
    : undefined;

  const searchRange = (low !== undefined && high !== undefined && low <= high)
    ? ([low, high] as [number, number])
    : undefined;

  return { pointers, searchRange };
};

export const CustomFlowchartStage: React.FC = () => {
  const { lesson, currentStepIndex, zoom, setZoom, isFullScreen, toggleFullScreen, editableValues } = useLesson();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = usePinchZoom(setZoom, 0.2, 2.5);

  if (!lesson) return null;

  // Derive active steps: use generateSteps (dynamic) or fallback to static executionSteps
  const activeSteps = lesson.generateSteps
    ? lesson.generateSteps(editableValues)
    : lesson.executionSteps;

  // Global rule: step 0 = empty canvas (program not yet started).
  // currentStepIndex 1 shows step 0 of activeSteps, index 2 shows steps 0-1, etc.
  const visibleSteps = currentStepIndex === 0 ? [] : activeSteps.slice(0, currentStepIndex);

  // Auto-scroll to the active element, or bottom if not found
  useEffect(() => {
    // Add a slight delay to allow the active step to render first
    setTimeout(() => {
      const activeEl = document.getElementById('active-flowchart-step');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 50);
  }, [visibleSteps.length]);

  const isMatchTopic = lesson.topic === 'match_case';
  const hasLoopKeyword = lesson.lines.some(l => l.tokens.some(t => t.type === 'keyword' && (t.value === 'for' || t.value === 'while')));
  const isLoopTopic = (['for_loop', 'while_loop', 'nested_loop', 'loop_control'].includes(lesson.topic) || hasLoopKeyword) && lesson.topic !== 'searching_sorting';

  // Parse cases from lesson lines dynamically (for match_case)
  const casesList: { value: string; displayValue: string }[] = [];
  if (isMatchTopic) {
    lesson.lines.forEach(line => {
      const caseIdx = line.tokens.findIndex(t => t.type === 'keyword' && t.value === 'case');
      if (caseIdx !== -1) {
        const valToken = line.tokens.find((t, idx) => idx > caseIdx && (t.type === 'number' || t.type === 'string' || (t.type === 'keyword' && t.value === '_')));
        if (valToken) {
          casesList.push({
            value: valToken.value.replace(/['"]/g, ''),
            displayValue: valToken.value
          });
        }
      }
    });
  }

  // Get status of a specific case value from visibleSteps
  const getCaseStatus = (caseVal: string) => {
    const computeStep = visibleSteps.find(step => {
      const ev = step.animationEvent;
      if (ev?.type === 'COMPUTE' && ev.storeIn === 'Condition') {
        const op = ev.operator.replace(/['"]/g, '');
        if (caseVal === '_' && op.includes('default')) return true;
        if (op.includes(caseVal)) return true;
      }
      return false;
    });

    if (!computeStep) return 'pending';
    const ev = computeStep.animationEvent;
    if (ev?.type === 'COMPUTE' && (ev.result === 'True' || String(ev.result) === 'true')) {
      return 'matched';
    }
    return 'failed';
  };

  // Find index of MATCH_START in visibleSteps
  const matchStartIdx = visibleSteps.findIndex(s => s.animationEvent?.type === 'MATCH_START');
  const hasMatchStarted = matchStartIdx !== -1;

  // Separate steps for rendering match_case
  const initialSteps = hasMatchStarted ? visibleSteps.slice(0, matchStartIdx) : visibleSteps;
  const matchStep = hasMatchStarted ? visibleSteps[matchStartIdx] : null;

  // Find the index of the successfully matched condition to group subsequent branch steps
  const matchedConditionIdx = visibleSteps.findIndex(s => 
    s.animationEvent?.type === 'COMPUTE' && 
    s.animationEvent.storeIn === 'Condition' && 
    (s.animationEvent.result === 'True' || String(s.animationEvent.result) === 'true')
  );
  const branchSteps = matchedConditionIdx !== -1 ? visibleSteps.slice(matchedConditionIdx + 1) : [];
  
  const isFunctionTopic = lesson.topic === 'functions';
  let currentActiveLine = -1;

  // Variables for loop topic parsing
  let preLoopLines: typeof lesson.lines = [];
  let loopLines: typeof lesson.lines = [];
  let postLoopLines: typeof lesson.lines = [];
  let activeLines: typeof lesson.lines = [];
  interface LoopSegment {
    type: 'line' | 'inner_loop';
    line?: any;
    headerLineNum?: number;
    lines?: any[];
  }

  let loopHeaderLineNum = -1;
  let innerLoopHeaderLineNums: number[] = [];
  let innerLoopLines: any[] = [];
  let loopSegments: LoopSegment[] = [];

  // Variables for function topic parsing
  let functionLines: typeof lesson.lines = [];
  let mainFlowLines: typeof lesson.lines = [];

  if (isFunctionTopic) {
    activeLines = lesson.lines;
    currentActiveLine = visibleSteps.length > 0 ? visibleSteps[visibleSteps.length - 1].lineNum : -1;
    
    let inFunctionDef = false;
    for (const line of lesson.lines) {
      const firstToken = line.tokens[0];
      const indent = (firstToken?.type === 'text' && firstToken.value.trim() === '') ? firstToken.value.length : 0;
      
      const hasContent = line.tokens.some(t => t.value.trim() !== '');
      const isDef = line.tokens.some(t => t.type === 'keyword' && t.value === 'def');
      
      if (isDef) {
        inFunctionDef = true;
        mainFlowLines.push(line);
      } else if (inFunctionDef && hasContent && indent === 0) {
        inFunctionDef = false;
        mainFlowLines.push(line);
      } else if (inFunctionDef) {
        functionLines.push(line);
      } else if (hasContent) {
        mainFlowLines.push(line);
      }
    }
  } else if (isLoopTopic) {
    // Show ALL lines from the start for loop topics
    activeLines = lesson.lines;
    currentActiveLine = visibleSteps.length > 0 ? visibleSteps[visibleSteps.length - 1].lineNum : -1;

    // Detect loop header
    const loopHeaders = lesson.lines.filter(l => l.tokens.some(t => t.type === 'keyword' && (t.value === 'for' || t.value === 'while')));
    const loopHeaderLine = loopHeaders[0];
    const innerLoopHeaders = loopHeaders.slice(1);
    
    if (loopHeaderLine) {
      loopHeaderLineNum = loopHeaderLine.lineNum;
      const headerIdx = activeLines.findIndex(l => l.lineNum === loopHeaderLine.lineNum);
      if (headerIdx !== -1) {
        preLoopLines = activeLines.slice(0, headerIdx);
        
        // Find where the loop ends (first line after header with same or less indentation)
        const headerIndentStr = loopHeaderLine.tokens.find(t => t.type === 'text' && t.value.trim() === '')?.value || '';
        const headerIndent = headerIndentStr.length;
        
        let loopEndIdx = activeLines.length;
        for (let i = headerIdx + 1; i < activeLines.length; i++) {
          const line = activeLines[i];
          const indentToken = line.tokens[0];
          const indent = (indentToken?.type === 'text' && indentToken.value.trim() === '') ? indentToken.value.length : 0;
          if (indent <= headerIndent) {
            loopEndIdx = i;
            break;
          }
        }
        
        loopLines = activeLines.slice(headerIdx, loopEndIdx);
        postLoopLines = activeLines.slice(loopEndIdx);

        // Partition loopLines into multiple segments (outer lines and inner loop boxes)
        if (loopLines.length > 0) {
          // The first line is always the outer loop header
          loopSegments.push({ type: 'line', line: loopLines[0] });
          
          let i = 1;
          while (i < loopLines.length) {
            const line = loopLines[i];
            const isInnerHeader = innerLoopHeaders.some(h => h.lineNum === line.lineNum);
            
            if (isInnerHeader) {
              // Find where this inner loop ends
              const innerIndentStr = line.tokens.find(t => t.type === 'text' && t.value.trim() === '')?.value || '';
              const innerIndent = innerIndentStr.length;
              
              let endIdx = loopLines.length;
              for (let j = i + 1; j < loopLines.length; j++) {
                const nextLine = loopLines[j];
                const indentToken = nextLine.tokens[0];
                const indent = (indentToken?.type === 'text' && indentToken.value.trim() === '') ? indentToken.value.length : 0;
                if (indent <= innerIndent) {
                  endIdx = j;
                  break;
                }
              }
              
              const blockLines = loopLines.slice(i, endIdx);
              loopSegments.push({
                type: 'inner_loop',
                headerLineNum: line.lineNum,
                lines: blockLines
              });
              innerLoopHeaderLineNums.push(line.lineNum);
              innerLoopLines.push(...blockLines);
              
              i = endIdx; // skip past this inner loop block
            } else {
              loopSegments.push({ type: 'line', line });
              i++;
            }
          }
        } else {
          loopSegments = loopLines.map(line => ({ type: 'line', line }));
        }
      } else {
        preLoopLines = activeLines;
      }
    } else {
      preLoopLines = activeLines;
    }
  }

  const renderFixedLineBlock = (line: any) => {
    const latestStep = [...visibleSteps].reverse().find(s => s.lineNum === line.lineNum);
    const isLatest = line.lineNum === currentActiveLine;
    const hasExecuted = !!latestStep;
    const isPrintLine = line.tokens.some((t: any) => t.type === 'function' && t.value === 'print');
    const funcToken = line.tokens.find((t: any) => t.type === 'function' && t.value !== 'print');

    // Find the caller line in mainFlowLines
    const isFunctionExecuting = isFunctionTopic && visibleSteps.length > 0 && functionLines.some(l => l.lineNum === currentActiveLine);
    let callerLineNum = -1;
    if (isFunctionExecuting) {
      const callerLine = mainFlowLines.find(l => 
        !l.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def') &&
        l.tokens.some((t: any) => t.type === 'function' && t.value !== 'print')
      );
      if (callerLine) {
        callerLineNum = callerLine.lineNum;
      }
    } else {
      const lastCallStep = [...visibleSteps].reverse().find(s => s.animationEvent?.type === 'FUNCTION_CALL');
      callerLineNum = lastCallStep ? lastCallStep.lineNum : -1;
    }

    let elementId: string | undefined = undefined;
    if (isLatest) {
      elementId = 'active-flowchart-step';
    } else if (line.lineNum === callerLineNum) {
      elementId = 'function-caller';
    }

    // Determine Theme
    let colorTheme: 'default' | 'grey' | 'orange' | 'fuchsia' | 'teal' = 'default';
    if (isLoopTopic) {
      if (line.lineNum === loopHeaderLineNum) {
        colorTheme = 'orange'; // Main loop block
      } else if (innerLoopHeaderLineNums.includes(line.lineNum)) {
        colorTheme = 'fuchsia'; // Inner loop block
      } else if (innerLoopLines.some(l => l.lineNum === line.lineNum)) {
        colorTheme = isPrintLine ? 'default' : 'grey'; // Inner loop body is greyish!
      } else if (loopLines.some(l => l.lineNum === line.lineNum)) {
        colorTheme = isPrintLine ? 'default' : 'grey'; // Outer loop body is greyish!
      }
    } else if (isFunctionTopic) {
      if (functionLines.some(l => l.lineNum === line.lineNum)) {
        const isHeader = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def');
        colorTheme = isHeader ? 'orange' : (isPrintLine ? 'default' : 'grey');
      } else {
        colorTheme = 'default'; // Main flow lines
      }
    }

    const isFunctionLine = isFunctionTopic && functionLines.some(l => l.lineNum === line.lineNum);
    const isHeader = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def');
    const isFunctionBody = isFunctionLine && !isHeader;

    if (!hasExecuted) {
      // Pending state (not yet reached)
      const codeText = line.tokens.map((t: any) => t.value).join('');
      let borderClass = isPrintLine ? 'border-green-500/30 text-green-400/70 bg-green-950/10' : 'border-slate-700/50 text-slate-500 bg-slate-800/40';
      let paddingClass = 'px-5 py-3';
      let textClass = 'text-sm rounded-xl';
      
      if (isFunctionLine) {
        if (isHeader) {
          borderClass = 'border-yellow-500/30 text-yellow-400/70 bg-yellow-950/10 rounded-none';
        } else {
          borderClass = isPrintLine ? 'border-green-900/30 text-green-500/50 bg-green-950/5' : 'border-slate-700/50 text-slate-500 bg-slate-800/40';
          paddingClass = 'px-3 py-1';
          textClass = 'text-[11px] rounded-md border';
        }
      }

      return (
        <motion.div
          key={line.lineNum}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 relative shrink-0 min-w-max transition-all duration-300 opacity-60"
          id={elementId}
        >
          {line.lineNum !== activeLines[0]?.lineNum && line.lineNum !== functionLines[0]?.lineNum && line.lineNum !== mainFlowLines[0]?.lineNum && (
            <div className={`absolute ${isFunctionBody ? '-top-7' : '-top-9'} left-1/2 w-0.5 ${isFunctionBody ? 'h-4' : 'h-6'} bg-slate-500/30 -translate-x-1/2`} />
          )}
          <div className={`${paddingClass} ${isFunctionBody ? '' : 'border-2'} font-mono whitespace-pre ${textClass} ${borderClass}`}>
            {codeText.trim()}
          </div>
        </motion.div>
      );
    }
    
    const ev = latestStep.animationEvent;

    // Compute dynamic oldValue for in-place loop updates
    let oldValue = (ev as any)?.oldValue;
    if (oldValue === undefined && (ev?.type === 'CREATE_VARIABLE' || ev?.type === 'UPDATE_VARIABLE')) {
      const prevStep = [...visibleSteps].reverse().find(s => 
        s.step < latestStep.step && 
        (s.animationEvent?.type === 'CREATE_VARIABLE' || s.animationEvent?.type === 'UPDATE_VARIABLE') && 
        (s.animationEvent as any).name === (ev as any).name
      );
      if (prevStep) {
        oldValue = (prevStep.animationEvent as any).value ?? (prevStep.animationEvent as any).newValue;
      }
    }

    const defLine = functionLines[0];
    const functionNameToken = defLine?.tokens.find((t: any) => t.type === 'function');
    const functionName = functionNameToken ? `${functionNameToken.value}()` : 'Function';

    return (
      <motion.div
        key={line.lineNum}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col items-center gap-4 relative shrink-0 min-w-max transition-all duration-300 ${isLatest ? 'scale-[1.03] z-10' : 'scale-100 opacity-90'}`}
      >
        {line.lineNum !== activeLines[0]?.lineNum && line.lineNum !== functionLines[0]?.lineNum && line.lineNum !== mainFlowLines[0]?.lineNum && (
          <div className={`absolute ${isFunctionBody ? '-top-7' : '-top-9'} left-1/2 w-0.5 ${isFunctionBody ? 'h-4' : 'h-6'} bg-indigo-500/30 -translate-x-1/2`} />
        )}

        <div id={elementId} className="w-fit flex flex-col items-center gap-4">
          {/* For function body, render small text block only if there is no visual component rendering */}
          {isFunctionBody && !['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'UPDATE_ARRAY_INDEX', 'MULTI_CREATE_VARIABLES', 'PRINT_VALUE', 'COMPUTE'].includes(ev?.type || '') && (
            <div className={`px-3 py-1 border rounded-md font-mono text-[11px] whitespace-pre transition-all duration-300 ${
              isLatest 
                ? (isPrintLine 
                    ? 'border-green-400 text-green-200 bg-green-950/30 shadow-[0_0_10px_rgba(34,197,94,0.3)] scale-105' 
                    : 'border-yellow-400 text-yellow-200 bg-yellow-900/30 shadow-[0_0_10px_rgba(234,179,8,0.3)] scale-105') 
                : (isPrintLine 
                    ? 'border-green-900/50 text-green-400/80 bg-green-950/10' 
                    : 'border-slate-700/50 text-slate-400 bg-slate-800/40')
            }`}>
              {line.tokens.map((t: any) => t.value).join('').trim()}
            </div>
          )}
          
          {ev?.type === 'CREATE_VARIABLE' && (
            isDataStructure(ev.value) ? (() => {
              const { variant, items } = parseDataStructure(ev.value);
              return <DataStructureBox name={ev.name} variant={variant} items={items} isActive={isLatest} />;
            })() : (
              <div className="flex flex-col items-center gap-2">
                <VariableBox name={ev.name} value={ev.value} oldValue={oldValue} isActive={isLatest} colorTheme={colorTheme} isSmall={isFunctionBody} varType={getVarTypeForLanguage(ev.name, lesson.lines)} />
                {ev.formula && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow-md shadow-amber-950/30"
                  >
                    {ev.formula}
                  </motion.div>
                )}
              </div>
            )
          )}

          {ev?.type === 'MULTI_CREATE_VARIABLES' && (
            <div className="flex gap-4 items-center">
              {ev.variables.map((v, idx) => (
                isDataStructure(v.value) ? (() => {
                  const { variant, items } = parseDataStructure(v.value);
                  return <DataStructureBox key={idx} name={v.name} variant={variant} items={items} isActive={isLatest} />;
                })() : (
                  <VariableBox key={idx} name={v.name} value={v.value} isActive={isLatest} colorTheme={colorTheme} isSmall={isFunctionBody} varType={getVarTypeForLanguage(v.name, lesson.lines)} />
                )
              ))}
            </div>
          )}

          {ev?.type === 'UPDATE_VARIABLE' && (
            isDataStructure(ev.newValue) ? (() => {
              const { variant, items } = parseDataStructure(ev.newValue);
              return <DataStructureBox name={ev.name} variant={variant} items={items} isActive={isLatest} />;
            })() : (
              <div className="flex flex-col items-center gap-2">
                <VariableBox name={ev.name} value={ev.newValue} oldValue={oldValue} isActive={isLatest} colorTheme={colorTheme} isSmall={isFunctionBody} varType={getVarTypeForLanguage(ev.name, lesson.lines)} />
                {ev.formula && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow-md shadow-amber-950/30"
                  >
                    {ev.formula}
                  </motion.div>
                )}
              </div>
            )
          )}

          {ev?.type === 'COMPUTE' && (
            <ComputeBlock
              inputs={ev.inputs}
              operator={ev.operator || '+'}
              storeIn={ev.storeIn}
              result={ev.result}
              memorySnapshot={latestStep.memorySnapshot}
              prevMemorySnapshot={visibleSteps[visibleSteps.length - 2]?.memorySnapshot || {}}
              isActive={isLatest}
              colorTheme={colorTheme}
              isSmall={isFunctionBody}
            />
          )}

           {ev?.type === 'UPDATE_ARRAY_INDEX' && (
            (() => {
              const { variant, items } = parseDataStructure(latestStep.memorySnapshot[ev.arrayName]);
              return (
                <div className="flex flex-col items-center gap-3">
                  <DataStructureBox 
                    name={ev.arrayName} 
                    variant={variant} 
                    items={items} 
                    isActive={isLatest} 
                    highlightedIndex={ev.index} 
                  />
                  {isLatest && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl shadow-md"
                    >
                      Updated index {ev.index}: {ev.oldValue} → {ev.newValue}
                    </motion.div>
                  )}
                </div>
              );
            })()
          )}

          {ev?.type === 'HIGHLIGHT_ARRAY_INDEX' && (
            (() => {
              const { variant, items } = parseDataStructure(latestStep.memorySnapshot[ev.arrayName]);
              return (
                <div className="flex flex-col items-center gap-3">
                  <DataStructureBox 
                    name={ev.arrayName} 
                    variant={variant} 
                    items={items} 
                    isActive={isLatest} 
                    highlightedIndex={ev.index} 
                  />
                  {isLatest && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl shadow-md"
                    >
                      Target index: {ev.index}
                    </motion.div>
                  )}
                </div>
              );
            })()
          )}

          {ev?.type === 'PRINT_VALUE' && (
            isDataStructure(ev.outputValue) ? (() => {
              const { variant, items } = parseDataStructure(ev.outputValue);
              return (
                <div className="flex flex-col items-center gap-1.5">
                  <DataStructureBox name={ev.variableName || 'output'} variant={variant} items={items} isActive={isLatest} />
                  <span className="text-[10px] font-black tracking-wider font-mono leading-none text-green-400 uppercase">
                    PRINT
                  </span>
                </div>
              );
            })() : (
              <PrintBox variableName={ev.variableName} value={ev.outputValue} isActive={isLatest} colorTheme={isPrintLine ? 'default' : colorTheme} isSmall={isFunctionBody} />
            )
          )}

        {ev?.type === 'COMPUTE' && (
          ev.storeIn === 'Condition' ? (() => {
            const currentLine = lesson.lines.find(l => l.lineNum === latestStep.lineNum);
            const isLoopHeader = !!currentLine?.tokens.some(t => t.type === 'keyword' && (t.value === 'while' || t.value === 'for'));
            const isForLoop = !!currentLine?.tokens.some(t => t.type === 'keyword' && t.value === 'for');
            
            let labelText = 'CONDITION';
            if (isLoopTopic && isLoopHeader) {
              if (innerLoopHeaderLineNums.includes(latestStep.lineNum)) {
                labelText = isForLoop ? 'INNER FOR LOOP' : 'INNER WHILE LOOP';
              } else if (latestStep.lineNum === loopHeaderLineNum) {
                labelText = isForLoop ? 'OUTER FOR LOOP' : 'OUTER WHILE LOOP';
              } else {
                labelText = isForLoop ? 'FOR LOOP' : 'WHILE LOOP';
              }
            }

            return (
              <ConditionBox
                condition={ev.inputs.length === 2
                  ? `${ev.inputs[0]} ${ev.operator} ${ev.inputs[1]}`
                  : `${ev.inputs[0] || ''} ${ev.operator || ''}`
                }
                inputs={ev.inputs}
                memorySnapshot={latestStep.memorySnapshot}
                isTrue={ev.result === 'True' || String(ev.result) === 'true'}
                isActive={isLatest}
                label={labelText}
                colorTheme={isLoopTopic && isLoopHeader ? (innerLoopHeaderLineNums.includes(latestStep.lineNum) ? 'fuchsia' : 'orange') : 'default'}
              />
            );
          })() : (() => {
            const prevStep = activeSteps.find((s: any) => s.step === latestStep.step - 1);
            const prevMemorySnapshot = prevStep ? prevStep.memorySnapshot : {};
            return (
              <ComputeBlock
                inputs={ev.inputs}
                operator={ev.operator || '+'}
                storeIn={ev.storeIn}
                result={ev.result}
                memorySnapshot={latestStep.memorySnapshot}
                prevMemorySnapshot={prevMemorySnapshot}
                isActive={isLatest}
                colorTheme={colorTheme}
                isSmall={isFunctionBody}
              />
            );
          })()
        )}
        
        {ev?.type === 'NONE' && !(isFunctionTopic && functionLines[0]?.lineNum === line.lineNum) && !isFunctionBody && (
          <div className={`px-4 py-2 bg-slate-900 border rounded-xl text-center select-none shadow-sm transition-all duration-300 ${
            isLatest 
              ? 'border-orange-500/50 scale-105' 
              : (isFunctionTopic && funcToken && line.lineNum === callerLineNum
                  ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-pulse'
                  : 'border-slate-700/60')
          }`}>
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              {isFunctionTopic && funcToken && !line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def')
                ? `Calling ${funcToken.value}()`
                : (isFunctionTopic && (functionLines.some(l => l.lineNum === latestStep.lineNum) || line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def'))
                    ? (line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'def') ? 'Function Created' : 'Executing Function')
                    : (() => {
                        const isElse = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'else');
                        const isElif = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'elif');
                        const isIf = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'if');
                        const isPass = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'pass');
                        if (isPass) return 'Pass Statement';
                        if (isElse) return 'Else Block';
                        if (isElif) return 'Elif Block';
                        if (isIf) return 'If Block';
                        if (isLoopTopic && line.lineNum === loopHeaderLineNum) return 'Loop Header';
                        return 'Step Executed';
                      })())}
            </span>
          </div>
        )}

        {isFunctionTopic && functionLines[0]?.lineNum === line.lineNum && ev?.type === 'NONE' && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`px-5 py-2.5 bg-yellow-950/30 border border-yellow-500/50 rounded-none text-center select-none shadow-[0_0_10px_rgba(234,179,8,0.15)] transition-all duration-300 ${isLatest ? 'scale-105 border-yellow-400 ring-1 ring-yellow-500/30' : ''}`}
          >
            <span className="text-[10px] font-mono font-black tracking-widest text-yellow-400/80 uppercase block mb-0.5">
              FUNCTION CREATED
            </span>
            <span className="text-xs font-mono font-bold text-yellow-200">
              {functionName}
            </span>
          </motion.div>
        )}
        
        {ev?.type === 'FUNCTION_CALL' && (
          <div className={`px-6 py-3 bg-yellow-950/20 border-2 rounded-xl text-center select-none transition-all duration-300 ${
            isLatest ? 'scale-105 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
            (isFunctionTopic && functionLines.some(l => l.lineNum === currentActiveLine) && line.lineNum === callerLineNum 
              ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-pulse' 
              : 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]')
          }`}>
            <span className="text-sm font-mono font-bold tracking-wider text-yellow-300">
              Calling {ev.functionName}()
            </span>
          </div>
        )}

        {ev?.type === 'FUNCTION_RETURN' && (
          <div className={`px-6 py-3 bg-teal-950/20 border-2 border-teal-500/50 rounded-xl text-center select-none shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-all duration-300 ${isLatest ? 'scale-105' : ''}`}>
            <span className="text-sm font-mono font-bold tracking-wider text-teal-300">
              Returning from {ev.functionName}()
            </span>
            {ev.returnValue !== undefined && (
              <div className="mt-2 text-xs text-teal-400/80 font-mono">
                value: {ev.returnValue}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

  return (
    <div className="flex-1 relative w-full h-full bg-[#060814]">
      {/* Fixed Full Screen Toggle Button at bottom-left */}
      <button
        onClick={toggleFullScreen}
        className="absolute bottom-4 left-4 z-50 p-2 bg-[#0d1126]/80 backdrop-blur-md border border-indigo-500/20 rounded-xl text-indigo-300 hover:bg-indigo-500/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] flex items-center justify-center"
        title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
      >
        {isFullScreen ? <Shrink size={16} /> : <Expand size={16} />}
      </button>

      {/* Scrollable Container */}
      <div ref={containerRef} id="flowchart-container" className="w-full h-full overflow-auto custom-scrollbar">
        {/* Zoomable Canvas Area */}
        <div
          id="flowchart-content"
          className="relative p-12 flex flex-col items-center gap-10 min-w-max min-h-max transition-transform duration-300 origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Pen Layer Target */}
          <div id="canvas-pen-layer" className="absolute inset-0 z-50 pointer-events-none" />

          <AnimatePresence mode="wait">
            {isFunctionTopic ? (() => {
              let functionPhase: 'idle' | 'defined' | 'calling' | 'executing' | 'returning' = 'idle';
              const defLineNum = functionLines[0]?.lineNum;
              const defStep = visibleSteps.find(s => s.lineNum === defLineNum);
              
              if (defStep) functionPhase = 'defined';
              
              let currentActiveLine = -1;
              if (visibleSteps.length > 0) {
                const latestStep = visibleSteps[visibleSteps.length - 1];
                currentActiveLine = latestStep.lineNum;
                const latestEvent = latestStep.animationEvent;
                if (latestEvent?.type === 'FUNCTION_CALL') {
                  functionPhase = 'calling';
                } else if (latestEvent?.type === 'FUNCTION_RETURN') {
                  functionPhase = 'returning';
                } else if (functionLines.some(l => l.lineNum === currentActiveLine) && currentActiveLine !== defLineNum) {
                  functionPhase = 'executing';
                }
              }



              return (
                <motion.div
                  key="function-split-canvas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center gap-24 shrink-0 w-full px-10 relative mt-24"
                >
                  {/* Fixed Top Headers for Split Layout */}
                  <div className="absolute -top-20 left-0 right-0 flex justify-center gap-24 px-10">
                    <div className="w-1/2 min-w-75 flex flex-col items-center">
                      <span className="text-indigo-400 text-xs font-bold tracking-[0.25em] uppercase opacity-90 select-none">
                        MAIN PROGRAM FLOW
                      </span>
                      <div className="w-24 h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent mt-1.5" />
                    </div>
                    <div className="w-1/2 min-w-87.5 flex flex-col items-center">
                      <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase opacity-90 select-none">
                        FUNCTION SPACE
                      </span>
                      <div className="w-24 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent mt-1.5" />
                    </div>
                  </div>

                  {/* SVG Connector linking the columns */}
                  <SVGConnector
                    isVisible={visibleSteps.length > 0 && functionLines.length > 0}
                    isActive={functionPhase === 'calling' || functionPhase === 'returning'}
                    isReturning={functionPhase === 'returning'}
                    isExecuting={functionPhase === 'executing'}
                  />

                  {/* Left Column: MAIN PROGRAM FLOW */}
                  <div className={`flex flex-col items-center gap-10 w-1/2 min-w-75 z-10 pt-4 transition-all duration-700 ease-in-out ${
                    functionPhase === 'executing' 
                      ? 'opacity-35 scale-95 blur-[2px]' 
                      : 'opacity-100 scale-100'
                  }`}>
                    {mainFlowLines.map(renderFixedLineBlock)}
                  </div>

                  {/* Right Column: FUNCTION SPACE */}
                  <div className={`flex flex-col items-center pt-20 w-1/2 min-w-87.5 relative z-10 transition-all duration-700 ease-in-out ${
                    functionPhase === 'executing' 
                      ? 'opacity-100 scale-105 filter-none' 
                      : functionPhase === 'calling' || functionPhase === 'returning' 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-50 scale-95 grayscale-50'
                  }`}>
                    {functionLines.length > 0 && (
                      <AnimatePresence mode="wait">
                        {functionPhase === 'idle' ? (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-77.5 h-45 border-2 border-dashed border-slate-800/60 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-2 backdrop-blur-xs select-none"
                          >
                            <svg className="w-6 h-6 opacity-30 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] font-mono tracking-wider">Awaiting Function Creation...</span>
                          </motion.div>
                        ) : (
                          <FunctionBlock 
                            key="func-block"
                            functionName={functionLines[0]?.tokens.find((t: any) => t.type === 'function')?.value || 'Function'} 
                            phase={functionPhase}
                          >
                        {functionLines.slice(1).map(line => {
                          const isLineLatest = line.lineNum === currentActiveLine;
                          const hasExecuted = visibleSteps.some(s => s.lineNum === line.lineNum);
                          const isPrint = line.tokens.some((t: any) => t.type === 'function' && t.value === 'print');
                          const isReturn = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'return');
                          const isCompute = line.tokens.some((t: any) => t.type === 'operator' && t.value === '=');
                          let stmtType = isPrint ? 'print' : isReturn ? 'return' : isCompute ? 'compute' : 'other';
                          
                          let activeComponent = null;
                          if (hasExecuted && visibleSteps.length > 0) {
                            const lineLatestStep = [...visibleSteps].reverse().find(s => s.lineNum === line.lineNum);
                            if (lineLatestStep) {
                              const ev = lineLatestStep.animationEvent;
                              if (ev?.type === 'PRINT_VALUE') activeComponent = <PrintBox variableName={ev.variableName} value={ev.outputValue} isActive={isLineLatest} isSmall />;
                              if (ev?.type === 'CREATE_VARIABLE') {
                                activeComponent = isDataStructure(ev.value) ? (() => {
                                  const { variant, items } = parseDataStructure(ev.value);
                                  return <DataStructureBox name={ev.name} variant={variant} items={items} isActive={isLineLatest} />;
                                })() : <VariableBox name={ev.name} value={ev.value} isActive={isLineLatest} isSmall />;
                              }
                              if (ev?.type === 'UPDATE_VARIABLE') {
                                activeComponent = isDataStructure(ev.newValue) ? (() => {
                                  const { variant, items } = parseDataStructure(ev.newValue);
                                  return <DataStructureBox name={ev.name} variant={variant} items={items} isActive={isLineLatest} />;
                                })() : <VariableBox name={ev.name} value={ev.newValue} oldValue={ev.oldValue} isActive={isLineLatest} isSmall />;
                              }
                              if (ev?.type === 'COMPUTE' && ev.storeIn !== 'Condition') activeComponent = <ComputeBlock inputs={ev.inputs} operator={ev.operator || '+'} storeIn={ev.storeIn} result={ev.result} memorySnapshot={lineLatestStep.memorySnapshot} isActive={isLineLatest} isSmall />;
                            }
                          }

                          return (
                            <FunctionStatementRow
                              key={line.lineNum}
                              code={line.tokens.map((t: any) => t.value).join('').trim()}
                              statementType={stmtType as any}
                              isActive={isLineLatest}
                              hasExecuted={hasExecuted}
                              activeComponent={activeComponent}
                            />
                          );
                        })}
                      </FunctionBlock>
                    )}
                  </AnimatePresence>
                )}
                  </div>
                </motion.div>
              );
            })() : visibleSteps.length === 0 && !isLoopTopic ? (
              /* ── Step 0: blank canvas ── program hasn't started yet */
              <motion.div
                key="empty-canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-20 px-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-indigo-500/30 flex items-center justify-center mb-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/40">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-mono">
                  Press <span className="text-indigo-400 font-semibold">Next</span> to start executing
                </p>
                <p className="text-slate-600 text-xs">Visualizer will build here step by step</p>
              </motion.div>
            ) : isMatchTopic ? (
              /* ── Switch / Match-Case Branching Tree Layout ── */
              <motion.div
                key="match-tree-canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-8 shrink-0 w-full"
              >
                {/* 1. Initial Variable Setup Steps */}
                {initialSteps.map((step, idx) => {
                  const ev = step.animationEvent;
                  const isLatest = idx === visibleSteps.length - 1;
                  return (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4 relative"
                    >
                      {idx > 0 && <div className="absolute -top-7 left-1/2 w-0.5 h-6 bg-indigo-500/20 -translate-x-1/2" />}
                      {ev?.type === 'CREATE_VARIABLE' && (
                        <VariableBox name={ev.name} value={ev.value} isActive={isLatest} />
                      )}
                      {ev?.type === 'UPDATE_VARIABLE' && (
                        <VariableBox name={ev.name} value={ev.newValue} oldValue={ev.oldValue} isActive={isLatest} />
                      )}
                    </motion.div>
                  );
                })}

                {/* Connector to MatchBlock */}
                {hasMatchStarted && initialSteps.length > 0 && (
                  <div className="w-0.5 h-8 bg-indigo-500/30" />
                )}

                {/* 2. MatchBlock */}
                {matchStep && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex flex-col items-center"
                  >
                    <MatchBlock 
                      variableName={(matchStep.animationEvent as any).variableName} 
                      value={(matchStep.animationEvent as any).value} 
                      isActive={currentStepIndex - 1 === matchStartIdx} 
                    />

                    {/* Connector line system down to cases */}
                    <div className="w-0.5 h-8 bg-fuchsia-500/30" />
                  </motion.div>
                )}

                {/* 3. Horizontal Cases Row */}
                {hasMatchStarted && (
                  <div className="flex flex-col items-center w-full">
                    <div className="flex justify-center gap-8 relative px-4">
                      {casesList.map((c, idx) => {
                        const status = getCaseStatus(c.value);
                        
                        // Style connector lines
                        let lineStyle = 'border-slate-800 border-dashed';
                        let cardStyle = 'border-slate-800/80 bg-slate-900/40 text-slate-500';
                        let badgeColor = 'bg-slate-800 text-slate-600';
                        let badgeText = '?';

                        if (status === 'matched') {
                          lineStyle = 'border-green-500 border-solid';
                          cardStyle = 'border-green-500 bg-green-500/10 text-green-300';
                          badgeColor = 'bg-green-500 text-white';
                          badgeText = '✓';
                        } else if (status === 'failed') {
                          lineStyle = 'border-red-500/50 border-dashed';
                          cardStyle = 'border-red-500/30 bg-red-500/5 text-red-400/70';
                          badgeColor = 'bg-red-500/20 text-red-400';
                          badgeText = '✗';
                        }

                        return (
                          <div key={idx} className="flex flex-col items-center relative">
                            {/* Branch Connector Line */}
                            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 border-l-2 ${lineStyle}`} />
                            
                            {/* Case Card */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${cardStyle}`}
                            >
                              <div className="flex flex-col font-mono">
                                <span className="text-[10px] tracking-wider font-bold opacity-60">CASE</span>
                                <span className="text-base font-bold">{c.displayValue}</span>
                              </div>

                              {/* Status Badge */}
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${badgeColor}`}>
                                {badgeText}
                              </div>
                            </motion.div>

                            {/* If matched, render branch execution steps inside this column! */}
                            {status === 'matched' && branchSteps.length > 0 && (
                              <div className="flex flex-col items-center mt-8 relative">
                                {/* Connector line down to branch actions */}
                                <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-green-500" />
                                
                                <div className="flex flex-col items-center gap-6">
                                  {branchSteps.map((bStep, bIdx) => {
                                    const bEv = bStep.animationEvent;
                                    const isLatest = matchedConditionIdx + 1 + bIdx === visibleSteps.length - 1;

                                    return (
                                      <motion.div
                                        key={bStep.step}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative flex flex-col items-center"
                                      >
                                        {bIdx > 0 && <div className="absolute -top-7 left-1/2 w-0.5 h-6 bg-green-500/40 -translate-x-1/2" />}
                                        {bEv?.type === 'PRINT_VALUE' && (
                                          <PrintBox variableName={bEv.variableName} value={bEv.outputValue} isActive={isLatest} />
                                        )}
                                        {bEv?.type === 'UPDATE_VARIABLE' && (
                                          <VariableBox name={bEv.name} value={bEv.newValue} oldValue={bEv.oldValue} isActive={isLatest} />
                                        )}
                                        {bEv?.type === 'COMPUTE' && bEv.storeIn !== 'Condition' && (() => {
                                          const prevStep = activeSteps.find((s: any) => s.step === bStep.step - 1);
                                          const prevMemorySnapshot = prevStep ? prevStep.memorySnapshot : {};
                                          return (
                                            <ComputeBlock
                                              inputs={bEv.inputs}
                                              operator={bEv.operator || '+'}
                                              storeIn={bEv.storeIn}
                                              result={bEv.result}
                                              memorySnapshot={bStep.memorySnapshot}
                                              prevMemorySnapshot={prevMemorySnapshot}
                                              isActive={isLatest}
                                            />
                                          );
                                        })()}
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : isLoopTopic ? (
              /* ── Cyclic Loop Hybrid Layout ── */
              <motion.div
                key="loop-tree-canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-10 shrink-0 w-full"
              >
                {/* Pre-loop blocks */}
                {preLoopLines.map(renderFixedLineBlock)}

                {/* Loop Body block with cyclic back-connector */}
                {loopLines.length > 0 && (
                  <div className="relative flex flex-col items-center gap-10">
                    {/* Back-Loop curve */}
                    {loopLines.length > 1 && (() => {
                      // Detect if we just looped back
                      const isLoopingBack = (() => {
                        if (visibleSteps.length < 2) return false;
                        const currentStep = visibleSteps[visibleSteps.length - 1];
                        const prevStep = visibleSteps[visibleSteps.length - 2];
                        const isHeader = currentStep.lineNum === loopHeaderLineNum;
                        const wasInBody = loopLines.some(l => l.lineNum === prevStep.lineNum) && prevStep.lineNum !== loopHeaderLineNum;
                        return isHeader && wasInBody;
                      })();

                      return (
                        <div 
                          className="absolute -left-20 w-20 pointer-events-none" 
                          style={{ top: '3rem', bottom: '3rem', height: 'calc(100% - 6rem)' }}
                        >
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Static dashed path */}
                            <path 
                              d="M 100,100 C 0,100 0,0 100,0" 
                              fill="none" 
                              stroke="rgba(249, 115, 22, 0.4)" 
                              strokeWidth="2" 
                              strokeDasharray="4 4"
                              vectorEffect="non-scaling-stroke"
                            />
                            {/* Animated flow path when looping back */}
                            {isLoopingBack && (
                              <motion.path
                                key={`loop-back-flow-${currentStepIndex}`}
                                d="M 100,100 C 0,100 0,0 100,0"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="3"
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 1], opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                              />
                            )}
                          </svg>
                          {/* Arrow head pointing up/right into the loop header */}
                          <div className="absolute -top-1.25 right-0 w-0 h-0 border-y-4 border-y-transparent border-l-[6px] border-l-orange-500/60" />
                        </div>
                      );
                    })()}
                    
                    {loopSegments.map((seg, sIdx) => {
                      if (seg.type === 'line') {
                        return renderFixedLineBlock(seg.line);
                      }
                      
                      const innerLoopBlockLines = seg.lines || [];
                      const innerHeaderLineNum = seg.headerLineNum || -1;
                      
                      return (
                        <div key={sIdx} className="relative border-2 border-dashed border-fuchsia-500/30 bg-fuchsia-950/5 p-6 rounded-2xl ml-8 flex flex-col items-center gap-10">
                          {/* Label tag for Inner Loop container */}
                          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-[#060814] text-[10px] font-black tracking-widest text-fuchsia-400 border border-fuchsia-500/20 rounded uppercase">
                            Inner Loop Box
                          </div>

                          {/* Inner Back-Loop curve */}
                          {innerLoopBlockLines.length > 1 && (() => {
                            const isInnerLoopingBack = (() => {
                              if (visibleSteps.length < 2) return false;
                              const currentStep = visibleSteps[visibleSteps.length - 1];
                              const prevStep = visibleSteps[visibleSteps.length - 2];
                              const isHeader = currentStep.lineNum === innerHeaderLineNum;
                              const wasInBody = innerLoopBlockLines.some(l => l.lineNum === prevStep.lineNum) && prevStep.lineNum !== innerHeaderLineNum;
                              return isHeader && wasInBody;
                            })();

                            return (
                              <div 
                                className="absolute -right-20 w-20 pointer-events-none" 
                                style={{ top: '2.5rem', bottom: '2.5rem', height: 'calc(100% - 5rem)' }}
                              >
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <path 
                                    d="M 0,100 C 100,100 100,0 0,0" 
                                    fill="none" 
                                    stroke="rgba(217, 70, 239, 0.4)" 
                                    strokeWidth="2" 
                                    strokeDasharray="4 4"
                                    vectorEffect="non-scaling-stroke"
                                  />
                                  {isInnerLoopingBack && (
                                    <motion.path
                                      key={`inner-loop-back-flow-${currentStepIndex}-${innerHeaderLineNum}`}
                                      d="M 0,100 C 100,100 100,0 0,0"
                                      fill="none"
                                      stroke="#d946ef"
                                      strokeWidth="3"
                                      vectorEffect="non-scaling-stroke"
                                      initial={{ pathLength: 0, opacity: 0 }}
                                      animate={{ pathLength: [0, 1], opacity: [0, 1, 1, 0] }}
                                      transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                  )}
                                </svg>
                                <div className="absolute -top-1.25 left-0 w-0 h-0 border-y-4 border-y-transparent border-r-[6px] border-r-fuchsia-500/60" />
                              </div>
                            );
                          })()}

                          {innerLoopBlockLines.map(renderFixedLineBlock)}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Post-loop blocks */}
                {postLoopLines.map(renderFixedLineBlock)}
              </motion.div>
            ) : isFunctionTopic ? (() => {
              let functionPhase: 'idle' | 'defined' | 'calling' | 'executing' | 'returning' = 'idle';
              const defLineNum = functionLines[0]?.lineNum;
              const defStep = visibleSteps.find(s => s.lineNum === defLineNum);
              
              if (defStep) functionPhase = 'defined';
              
              if (visibleSteps.length > 0) {
                const latestEvent = visibleSteps[visibleSteps.length - 1].animationEvent;
                if (latestEvent?.type === 'FUNCTION_CALL') {
                  functionPhase = 'calling';
                } else if (latestEvent?.type === 'FUNCTION_RETURN') {
                  functionPhase = 'returning';
                } else if (functionLines.some(l => l.lineNum === currentActiveLine) && currentActiveLine !== defLineNum) {
                  functionPhase = 'executing';
                }
              }

              return (
                <motion.div
                  key="function-split-canvas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center gap-24 shrink-0 w-full px-10 relative mt-24"
                >
                  {/* Fixed Top Headers for Split Layout */}
                  <div className="absolute -top-20 left-0 right-0 flex justify-center gap-24 px-10">
                    <div className="w-1/2 min-w-75 flex flex-col items-center">
                      <span className="text-indigo-400 text-xs font-bold tracking-[0.25em] uppercase opacity-90 select-none">
                        MAIN PROGRAM FLOW
                      </span>
                      <div className="w-24 h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent mt-1.5" />
                    </div>
                    <div className="w-1/2 min-w-87.5 flex flex-col items-center">
                      <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase opacity-90 select-none">
                        FUNCTION SPACE
                      </span>
                      <div className="w-24 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent mt-1.5" />
                    </div>
                  </div>

                  {/* SVG Connector linking the columns */}
                  <SVGConnector
                    isVisible={visibleSteps.length > 0 && functionLines.length > 0}
                    isActive={functionPhase === 'calling' || functionPhase === 'returning'}
                    isReturning={functionPhase === 'returning'}
                    isExecuting={functionPhase === 'executing'}
                  />

                  {/* Left Column: MAIN PROGRAM FLOW */}
                  <div className={`flex flex-col items-center gap-10 w-1/2 min-w-75 z-10 pt-4 transition-all duration-700 ease-in-out ${
                    functionPhase === 'executing' 
                      ? 'opacity-30 scale-95 blur-[2px]' 
                      : 'opacity-100 scale-100'
                  }`}>
                    {mainFlowLines.map(renderFixedLineBlock)}
                  </div>

                  {/* Right Column: FUNCTION SPACE */}
                  <div className={`flex flex-col items-center pt-20 w-1/2 min-w-87.5 relative z-10 transition-all duration-700 ease-in-out ${
                    functionPhase === 'executing' 
                      ? 'opacity-100 scale-105 filter-none' 
                      : functionPhase === 'calling' || functionPhase === 'returning' 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-50 scale-95 grayscale-50'
                  }`}>
                    {functionLines.length > 0 && (
                      <AnimatePresence mode="wait">
                        {functionPhase === 'idle' ? (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-77.5 h-45 border-2 border-dashed border-slate-800/60 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-2 backdrop-blur-xs select-none"
                          >
                            <svg className="w-6 h-6 opacity-30 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] font-mono tracking-wider">Awaiting Function Creation...</span>
                          </motion.div>
                        ) : (
                          <FunctionBlock 
                            key="func-block"
                            functionName={functionLines[0]?.tokens.find((t: any) => t.type === 'function')?.value || 'Function'} 
                            phase={functionPhase}
                          >
                        {functionLines.slice(1).map(line => {
                          const isLatest = line.lineNum === currentActiveLine;
                          const hasExecuted = visibleSteps.some(s => s.lineNum === line.lineNum);
                          const isPrint = line.tokens.some((t: any) => t.type === 'function' && t.value === 'print');
                          const isReturn = line.tokens.some((t: any) => t.type === 'keyword' && t.value === 'return');
                          const isCompute = line.tokens.some((t: any) => t.type === 'operator' && t.value === '=');
                          let stmtType = isPrint ? 'print' : isReturn ? 'return' : isCompute ? 'compute' : 'other';
                          
                          let activeComponent = null;
                          if (hasExecuted && visibleSteps.length > 0) {
                            const lineLatestStep = [...visibleSteps].reverse().find(s => s.lineNum === line.lineNum);
                            if (lineLatestStep) {
                              const ev = lineLatestStep.animationEvent;
                              if (ev?.type === 'PRINT_VALUE') activeComponent = <PrintBox variableName={ev.variableName} value={ev.outputValue} isActive={isLatest} isSmall />;
                              if (ev?.type === 'CREATE_VARIABLE') {
                                activeComponent = isDataStructure(ev.value) ? (() => {
                                  const { variant, items } = parseDataStructure(ev.value);
                                  return <DataStructureBox name={ev.name} variant={variant} items={items} isActive={isLatest} />;
                                })() : <VariableBox name={ev.name} value={ev.value} isActive={isLatest} isSmall />;
                              }
                              if (ev?.type === 'UPDATE_VARIABLE') {
                                activeComponent = isDataStructure(ev.newValue) ? (() => {
                                  const { variant, items } = parseDataStructure(ev.newValue);
                                  return <DataStructureBox name={ev.name} variant={variant} items={items} isActive={isLatest} />;
                                })() : <VariableBox name={ev.name} value={ev.newValue} oldValue={ev.oldValue} isActive={isLatest} isSmall />;
                              }
                              if (ev?.type === 'COMPUTE' && ev.storeIn !== 'Condition') activeComponent = <ComputeBlock inputs={ev.inputs} operator={ev.operator || '+'} storeIn={ev.storeIn} result={ev.result} memorySnapshot={lineLatestStep.memorySnapshot} isActive={isLatest} isSmall />;
                            }
                          }

                          return (
                            <FunctionStatementRow
                              key={line.lineNum}
                              code={line.tokens.map((t: any) => t.value).join('').trim()}
                              statementType={stmtType as any}
                              isActive={isLatest}
                              hasExecuted={hasExecuted}
                              activeComponent={activeComponent}
                            />
                          );
                        })}
                      </FunctionBlock>
                    )}
                  </AnimatePresence>
                )}
                </div>
              </motion.div>
            );
          })() : (
              /* ── Standard Linear Flowchart Layout (Variables, If, If-Else, If-Elif) ── */
              <motion.div
                key="steps-canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-row items-start justify-start gap-24 shrink-0 min-w-max pl-4 pr-32 pb-16"
              >
                {/* Left Column: Flowchart Nodes Chain */}
                <div className="flex flex-col items-center gap-12 shrink-0">
                {visibleSteps.map((step, index) => {
                  const isLatest = index === visibleSteps.length - 1;
                  const ev = step.animationEvent;
                  const isMatchBranch = lesson.topic === 'match_case' && ev?.type !== 'CREATE_VARIABLE' && ev?.type !== 'MATCH_START';

                  return (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex flex-col items-center gap-4 relative shrink-0 min-w-max ${isMatchBranch ? 'ml-32' : ''}`}
                      id={isLatest ? 'active-flowchart-step' : undefined}
                    >
                      {/* Connector line from previous step */}
                      {index > 0 && !isMatchBranch && (
                        <div className="absolute -top-9 left-1/2 w-0.5 h-6 bg-indigo-500/30 -translate-x-1/2" />
                      )}
                      {index > 0 && isMatchBranch && (
                        <div className="absolute -top-8 -left-32 w-32 h-8 border-l-2 border-b-2 border-fuchsia-500/40 rounded-bl-xl border-dashed" />
                      )}

                      {(ev?.type === 'STACK_PUSH' || ev?.type === 'STACK_POP' || ev?.type === 'SET_POINTERS' || ev?.type === 'COMPARE_INDICES' || (ev?.type === 'NONE' && step.memorySnapshot?.stack !== undefined)) && (() => {
                        const rawStack = step.memorySnapshot?.stack !== undefined ? step.memorySnapshot.stack : (ev as any)?.stackState;
                        const stackItems: Array<string | number> = Array.isArray(rawStack) 
                          ? rawStack 
                          : typeof rawStack === 'string'
                            ? (() => { try { return JSON.parse(rawStack); } catch { return []; } })()
                            : [];

                        const capacity = 6;
                        const highlightedIdx = ev?.type === 'COMPARE_INDICES' ? (ev as any).indexA : (ev as any)?.pointers?.curr ?? (typeof step.memorySnapshot?.i === 'number' ? step.memorySnapshot.i : undefined);

                        return (
                          <div className="flex flex-col items-center gap-4 py-4 px-6 rounded-2xl bg-slate-950/80 border-2 border-indigo-500/20 shadow-2xl backdrop-blur-md min-w-75">
                            <div className="flex items-center justify-between w-full border-b border-indigo-500/10 pb-2">
                              <span className="text-xs font-mono font-black uppercase tracking-widest text-purple-400">
                                STACK CONTAINER (LIFO)
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                Capacity: {capacity}
                              </span>
                            </div>

                            {/* Vertical Stack Frame */}
                            <div className="flex flex-col gap-2 w-full">
                              {Array.from({ length: capacity }).map((_, i) => {
                                const idx = capacity - 1 - i; // Render from top index [5] down to [0]
                                const hasVal = idx < stackItems.length;
                                const val = hasVal ? stackItems[idx] : null;
                                const isTop = idx === stackItems.length - 1 && hasVal;
                                const isHighlighted = idx === highlightedIdx;

                                return (
                                  <div key={idx} className="flex items-center gap-3 w-full">
                                    {/* Index label on left */}
                                    <span className="text-xs font-mono text-slate-500 w-8 text-right font-bold">[{idx}]</span>
                                    
                                    {/* Slot Box */}
                                    <motion.div
                                      layout
                                      initial={{ scale: 0.9, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      className={`flex-1 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm border-2 transition-all duration-300 ${
                                        isHighlighted
                                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-[1.03]'
                                          : isTop
                                          ? 'border-purple-400 bg-purple-500/25 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.35)] scale-[1.02]'
                                          : hasVal
                                          ? 'border-indigo-500/40 bg-indigo-950/70 text-slate-200 shadow-md'
                                          : 'border-dashed border-slate-800/80 bg-slate-900/30 text-slate-700'
                                      }`}
                                    >
                                      {hasVal ? val : <span className="text-[10px] text-slate-700 tracking-widest font-sans font-normal uppercase select-none">Empty</span>}
                                    </motion.div>

                                    {/* Pointer Badge on right */}
                                    <div className="w-16 flex justify-start">
                                      {isTop && (
                                        <motion.span
                                          initial={{ x: -5, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400 text-purple-300 text-[10px] font-mono font-black tracking-wider shadow-sm"
                                        >
                                          TOP ←
                                        </motion.span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {ev?.type === 'MATCH_START' && (
                        <MatchBlock variableName={ev.variableName} value={ev.value} isActive={isLatest} />
                      )}

                      {ev?.type === 'CREATE_VARIABLE' && (
                        isDataStructure(ev.value) ? (() => {
                          const { variant, items } = parseDataStructure(ev.value);
                          const { pointers, searchRange } = getPointersAndRange(step.memorySnapshot);
                          const sortedIndices = Array.isArray(step.memorySnapshot?.sortedIndices) ? (step.memorySnapshot.sortedIndices as number[]) : undefined;
                          const comparingIndices = Array.isArray(step.memorySnapshot?.comparingIndices) ? (step.memorySnapshot.comparingIndices as [number, number]) : undefined;
                          const swappingIndices = Array.isArray(step.memorySnapshot?.swappingIndices) ? (step.memorySnapshot.swappingIndices as [number, number]) : undefined;
                          const minIdx = typeof step.memorySnapshot?.min_idx === 'number' ? step.memorySnapshot.min_idx : undefined;
                          const keyIndex = step.memorySnapshot?.key !== undefined && typeof step.memorySnapshot?.i === 'number' ? step.memorySnapshot.i : undefined;

                          return (
                            <DataStructureBox 
                              name={ev.name} 
                              variant={variant} 
                              items={items} 
                              isActive={isLatest} 
                              pointers={pointers} 
                              searchRange={searchRange} 
                              sortedIndices={sortedIndices}
                              comparingIndices={comparingIndices}
                              swappingIndices={swappingIndices}
                              minIdx={minIdx}
                              keyIndex={keyIndex}
                            />
                          );
                        })() : (
                          <div className="flex flex-col items-center gap-2">
                            <VariableBox name={ev.name} value={ev.value} isActive={isLatest} varType={getVarTypeForLanguage(ev.name, lesson.lines)} />
                            {ev.formula && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow-md shadow-amber-950/30"
                              >
                                {ev.formula}
                              </motion.div>
                            )}
                          </div>
                        )
                      )}

                      {ev?.type === 'UPDATE_VARIABLE' && (
                        isDataStructure(ev.newValue) ? (() => {
                          const { variant, items } = parseDataStructure(ev.newValue);
                          const { pointers, searchRange } = getPointersAndRange(step.memorySnapshot);
                          const sortedIndices = Array.isArray(step.memorySnapshot?.sortedIndices) ? (step.memorySnapshot.sortedIndices as number[]) : undefined;
                          const comparingIndices = Array.isArray(step.memorySnapshot?.comparingIndices) ? (step.memorySnapshot.comparingIndices as [number, number]) : undefined;
                          const swappingIndices = Array.isArray(step.memorySnapshot?.swappingIndices) ? (step.memorySnapshot.swappingIndices as [number, number]) : undefined;
                          const minIdx = typeof step.memorySnapshot?.min_idx === 'number' ? step.memorySnapshot.min_idx : undefined;
                          const keyIndex = step.memorySnapshot?.key !== undefined && typeof step.memorySnapshot?.i === 'number' ? step.memorySnapshot.i : undefined;

                          return (
                            <DataStructureBox 
                              name={ev.name} 
                              variant={variant} 
                              items={items} 
                              isActive={isLatest} 
                              pointers={pointers} 
                              searchRange={searchRange} 
                              sortedIndices={sortedIndices}
                              comparingIndices={comparingIndices}
                              swappingIndices={swappingIndices}
                              minIdx={minIdx}
                              keyIndex={keyIndex}
                            />
                          );
                        })() : (
                          <div className="flex flex-col items-center gap-3">
                            <VariableBox name={ev.name} value={ev.newValue} oldValue={ev.oldValue} isActive={isLatest} varType={getVarTypeForLanguage(ev.name, lesson.lines)} />
                            {ev.formula && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow-md shadow-amber-950/30"
                              >
                                {ev.formula}
                              </motion.div>
                            )}
                            {step.memorySnapshot?.arr && typeof step.memorySnapshot?.low === 'number' && typeof step.memorySnapshot?.high === 'number' && ev.name !== 'arr' && (() => {
                              const { variant, items } = parseDataStructure(step.memorySnapshot.arr);
                              const { pointers, searchRange } = getPointersAndRange(step.memorySnapshot);
                              return (
                                <DataStructureBox 
                                  name="arr" 
                                  variant={variant} 
                                  items={items} 
                                  isActive={isLatest} 
                                  pointers={pointers} 
                                  searchRange={searchRange} 
                                />
                              );
                            })()}
                          </div>
                        )
                      )}


                      {ev?.type === 'PRINT_VALUE' && (() => {
                        const match = ev.variableName?.match(/^([a-zA-Z_]\w*)\[(-?\d+)\]$/);
                        if (match) {
                          const varName = match[1];
                          const rawIdx = parseInt(match[2], 10);
                          const rawDS = step.memorySnapshot[varName];
                          if (rawDS && isDataStructure(rawDS)) {
                            const { variant, items } = parseDataStructure(rawDS);
                            const itemsArr = Array.isArray(items) ? items : [];
                            const actualIdx = rawIdx < 0 ? itemsArr.length + rawIdx : rawIdx;
                            return (
                              <div className="flex flex-col items-center gap-2">
                                <DataStructureBox
                                  name={varName}
                                  variant={variant}
                                  items={items}
                                  isActive={isLatest}
                                  highlightedIndex={actualIdx}
                                />
                                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl shadow-md font-mono text-xs text-amber-300 font-bold">
                                  <span>Index [{rawIdx}]{rawIdx < 0 ? ` (pos ${actualIdx})` : ''}</span>
                                  <span>➡</span>
                                  <span className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{ev.outputValue}</span>
                                </div>
                                <span className="text-[10px] font-black tracking-widest font-mono text-green-400 uppercase">
                                  PRINT OUTPUT
                                </span>
                              </div>
                            );
                          }
                        }

                        const matchDict = ev.variableName?.match(/^([a-zA-Z_]\w*)\[['"]([^'"]+)['"]\]$/);
                        if (matchDict) {
                          const varName = matchDict[1];
                          const dictKey = matchDict[2];
                          const rawDS = step.memorySnapshot[varName];
                          if (rawDS && isDataStructure(rawDS)) {
                            const { variant, items } = parseDataStructure(rawDS);
                            return (
                              <div className="flex flex-col items-center gap-2">
                                <DataStructureBox
                                  name={varName}
                                  variant={variant}
                                  items={items}
                                  isActive={isLatest}
                                  highlightedKey={dictKey}
                                />
                                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl shadow-md font-mono text-xs text-amber-300 font-bold">
                                  <span>Key ["{dictKey}"]</span>
                                  <span>➡</span>
                                  <span className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{ev.outputValue}</span>
                                </div>
                                <span className="text-[10px] font-black tracking-widest font-mono text-green-400 uppercase">
                                  PRINT OUTPUT
                                </span>
                              </div>
                            );
                          }
                        }
                        
                        return isDataStructure(ev.outputValue) ? (() => {
                          const { variant, items } = parseDataStructure(ev.outputValue);
                          return (
                            <div className="flex flex-col items-center gap-1.5">
                              <DataStructureBox name={ev.variableName || 'output'} variant={variant} items={items} isActive={isLatest} />
                              <span className="text-[10px] font-black tracking-wider font-mono leading-none text-green-400 uppercase">
                                PRINT
                              </span>
                            </div>
                          );
                        })() : (
                          <PrintBox variableName={ev.variableName} value={ev.outputValue} isActive={isLatest} />
                        );
                      })()}

                      {ev?.type === 'HIGHLIGHT_ARRAY_INDEX' && (
                        (() => {
                          const { variant, items } = parseDataStructure(step.memorySnapshot[ev.arrayName]);
                          const itemsArr = Array.isArray(items) ? items : [];
                          const itemVal = itemsArr[ev.index];
                          return (
                            <div className="flex flex-col items-center gap-3">
                              <DataStructureBox 
                                name={ev.arrayName} 
                                variant={variant} 
                                items={items} 
                                isActive={isLatest} 
                                highlightedIndex={ev.index} 
                              />
                              {isLatest && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl shadow-md flex items-center gap-2"
                                >
                                  <span>Inspecting Index [{ev.index}]</span>
                                  <span>➡</span>
                                  <span className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{itemVal !== undefined ? (typeof itemVal === 'string' ? `"${itemVal}"` : itemVal) : ev.index}</span>
                                </motion.div>
                              )}
                            </div>
                          );
                        })()
                      )}

                      {ev?.type === 'COMPUTE' && (
                        ev.storeIn === 'Condition' ? (
                          <div className="flex flex-col items-center gap-3">
                            <ConditionBox
                              condition={ev.inputs.length === 2
                                ? `${ev.inputs[0]} ${ev.operator} ${ev.inputs[1]}`
                                : `${ev.inputs[0] || ''} ${ev.operator || ''}`
                              }
                              inputs={ev.inputs}
                              memorySnapshot={step.memorySnapshot}
                              isTrue={ev.result === 'True' || String(ev.result) === 'true'}
                              isActive={isLatest}
                            />
                            {step.memorySnapshot?.arr && typeof step.memorySnapshot?.low === 'number' && typeof step.memorySnapshot?.high === 'number' && (() => {
                              const { variant, items } = parseDataStructure(step.memorySnapshot.arr);
                              const { pointers, searchRange } = getPointersAndRange(step.memorySnapshot);
                              return (
                                <DataStructureBox 
                                  name="arr" 
                                  variant={variant} 
                                  items={items} 
                                  isActive={isLatest} 
                                  pointers={pointers} 
                                  searchRange={searchRange} 
                                />
                              );
                            })()}
                          </div>
                        ) : (() => {
                          const prevStep = index > 0 ? visibleSteps[index - 1] : undefined;
                          const prevMemorySnapshot = prevStep ? prevStep.memorySnapshot : {};
                          return (
                            <ComputeBlock
                              inputs={ev.inputs}
                              operator={ev.operator || '+'}
                              storeIn={ev.storeIn}
                              result={ev.result}
                              memorySnapshot={step.memorySnapshot}
                              prevMemorySnapshot={prevMemorySnapshot}
                              isActive={isLatest}
                            />
                          );
                        })()
                      )}

                      {ev?.type === 'NONE' && (
                        <div className={`px-4 py-2 bg-slate-900 border border-slate-700/60 rounded-xl text-center select-none shadow-sm transition-all duration-300 ${isLatest ? 'border-orange-500/50 scale-105' : ''}`}>
                          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                            ➡ Branch Executed
                          </span>
                        </div>
                      )}

                      {!['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'PRINT_VALUE', 'COMPUTE', 'NONE', 'MATCH_START'].includes(ev?.type || '') && (
                        <div className="text-slate-500 font-mono text-sm border border-slate-700 p-2 rounded">
                          [Step {step.step} Executed]
                        </div>
                      )}

                      {!['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'PRINT_VALUE', 'COMPUTE', 'NONE', 'MATCH_START'].includes(ev?.type || '') && (
                        <div className="text-slate-500 font-mono text-sm border border-slate-700 p-2 rounded">
                          [Step {step.step} Executed]
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                </div>

                {/* Right Column: Clean Sorting Progress Tracker Panel */}
                {visibleSteps.length > 0 && (() => {
                  const latestStep = visibleSteps[visibleSteps.length - 1];
                  const mem = latestStep.memorySnapshot;
                  if (!mem?.sortedIndices || !Array.isArray(mem.sortedIndices)) return null;

                  const arrItems = parseDataStructure(mem.arr || '[]').items;
                  const totalCount = Array.isArray(arrItems) ? arrItems.length : 1;
                  const lockedCount = mem.sortedIndices.length;
                  const percent = Math.min(100, Math.round((lockedCount / totalCount) * 100));

                  return (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="w-96 border border-emerald-500/40 bg-slate-950/95 backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] sticky top-8 shrink-0"
                    >
                      {/* Header & Progress Bar */}
                      <div className="flex flex-col gap-2 border-b border-emerald-500/20 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            SORTING PROGRESS TRACKER
                          </span>
                          <span className="text-xs font-mono font-extrabold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                            {percent}% SORTED
                          </span>
                        </div>
                        
                        {/* Animated Progress Bar */}
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                          <motion.div 
                            className="h-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Current Action Indicator */}
                      {mem.swappingIndices ? (
                        <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-amber-200 font-bold animate-pulse">
                          <span>⇄ Swapping:</span>
                          <span className="text-white font-black bg-amber-950 px-1.5 py-0.5 rounded border border-amber-400">
                            {Array.isArray(arrItems) ? arrItems[mem.swappingIndices[0]] : ''} ⇄ {Array.isArray(arrItems) ? arrItems[mem.swappingIndices[1]] : ''}
                          </span>
                        </div>
                      ) : mem.comparingIndices ? (
                        <div className="flex items-center gap-2 bg-cyan-500/15 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-200 font-bold">
                          <span>🔍 Comparing:</span>
                          <span className="text-white font-black bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-400">
                            arr[{mem.comparingIndices[0]}] & arr[{mem.comparingIndices[1]}]
                          </span>
                        </div>
                      ) : null}

                      {/* Pass Snapshots Log (Clean Pill Rows) */}
                      {mem.passSnapshots && Array.isArray(mem.passSnapshots) && mem.passSnapshots.length > 0 && (
                        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                            COMPLETED PASS SNAPSHOTS:
                          </span>
                          {mem.passSnapshots.map((pSnap: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-900/90 border border-emerald-500/25 rounded-xl px-3 py-2 text-xs font-mono shadow-sm">
                              <span className="text-emerald-400 font-bold">Pass {pSnap.pass}:</span>
                              <div className="flex gap-1.5 items-center font-bold">
                                {pSnap.array.map((val: any, cellIdx: number) => {
                                  const isLocked = cellIdx >= pSnap.array.length - pSnap.pass;
                                  return (
                                    <span 
                                      key={cellIdx} 
                                      className={`px-2 py-0.5 rounded ${
                                        isLocked ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-black shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'text-slate-300'
                                      }`}
                                    >
                                      {val}
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                                <span>🔒</span>
                                <span>Locked: {pSnap.lockedValue}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invisible element to anchor the scroll */}
          <div ref={bottomRef} className="h-4 w-full" />

          {/* Spacer at the bottom so we can scroll past the last item */}
          <div className="h-48 shrink-0" />
        </div>
      </div>
    </div>
  );
};
