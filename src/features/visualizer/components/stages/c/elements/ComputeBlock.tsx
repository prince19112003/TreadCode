import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VariableBox } from './VariableBox';
import { Operator } from './Operator';
import { DataStructureBox } from './DataStructureBox';

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

const cleanValueAndType = (raw: any) => {
  if (raw === undefined || raw === null) return { value: raw, varType: undefined };
  const str = String(raw);
  let varType: string | undefined = undefined;
  
  if (str.includes('[const]')) varType = 'const';
  else if (str.includes('[4B]')) varType = 'float';
  else if (str.includes('[8B]')) varType = 'double';
  else if (str.includes('[1B]')) varType = 'bool';

  const cleanedVal = str.replace(/\s*\[(4B|8B|1B|const|short|long)\]/gi, '').trim();

  return { value: cleanedVal, varType };
};

interface ComputeBlockProps {
  inputs: string[];
  operator: string;
  storeIn: string;
  result: string | number;
  memorySnapshot: Record<string, string | number>;
  prevMemorySnapshot?: Record<string, string | number>;
  isActive?: boolean;
  colorTheme?: 'default' | 'grey' | 'orange' | 'fuchsia' | 'teal';
  isSmall?: boolean;
}

export const ComputeBlock: React.FC<ComputeBlockProps> = ({
  inputs,
  operator,
  storeIn,
  result,
  memorySnapshot,
  prevMemorySnapshot = {},
  isActive,
  colorTheme = 'default',
  isSmall,
}) => {
  const [calcState, setCalcState] = useState<'inputs' | 'calculating' | 'done'>('inputs');

  const isLenCalc = operator === 'len()' && inputs.length === 1;
  const isCaseCalc = (operator === 'upper()' || operator === 'lower()') && inputs.length === 1;
  const isStringCalc = isLenCalc || isCaseCalc;

  const rawVal = String(prevMemorySnapshot[inputs[0]] ?? memorySnapshot[inputs[0]] ?? inputs[0]);
  const isListVal = rawVal.replace(/['"]/g, '').trim().startsWith('[') && rawVal.replace(/['"]/g, '').trim().endsWith(']');
  
  const itemsList: Array<string | number> = isListVal 
    ? (() => {
        const cleaned = rawVal.replace(/['"]/g, '').trim();
        try {
          return JSON.parse(cleaned) as Array<string | number>;
        } catch {
          return cleaned.slice(1, -1).split(',').map(s => {
            const v = s.trim();
            return isNaN(Number(v)) ? v : Number(v);
          });
        }
      })()
    : rawVal.replace(/['"]/g, '').split('');

  const [activeCountIdx, setActiveCountIdx] = useState(-1);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setCalcState('done');
      return;
    }
    
    // Reset animation state when it becomes active
    setCalcState('inputs');
    
    // Step 1: Show inputs for 600ms, then show calculating spark
    const t1 = setTimeout(() => {
      setCalcState('calculating');
    }, 600);
    
    // Step 2: Show result flowing into box after 1.8s
    const t2 = setTimeout(() => {
      setCalcState('done');
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive, result]); // depend on result to re-trigger if same step updates

  useEffect(() => {
    if (isStringCalc && calcState === 'calculating') {
      setActiveCountIdx(0);
      const intervalMs = Math.max(100, Math.min(250, 1000 / Math.max(1, itemsList.length)));
      const timer = setInterval(() => {
        setActiveCountIdx(prev => {
          if (prev < itemsList.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            return itemsList.length; // finished counting/converting
          }
        });
      }, intervalMs);
      return () => clearInterval(timer);
    } else if (calcState === 'done') {
      setActiveCountIdx(itemsList.length);
    } else {
      setActiveCountIdx(-1);
    }
  }, [calcState, isStringCalc, itemsList.length]);

  const sliceMatch = operator ? operator.match(/^\[(-?\d*):(-?\d*)\]$/) : null;

  useEffect(() => {
    if (sliceMatch) {
      const len = itemsList.length;
      const startRaw = sliceMatch[1] !== '' ? parseInt(sliceMatch[1], 10) : 0;
      const endRaw = sliceMatch[2] !== '' ? parseInt(sliceMatch[2], 10) : len;
      const start = startRaw < 0 ? Math.max(0, len + startRaw) : Math.min(len, startRaw);
      const end = endRaw < 0 ? Math.max(0, len + endRaw) : Math.min(len, endRaw);
      
      const sliceIndices: number[] = [];
      for (let i = start; i < end; i++) {
        sliceIndices.push(i);
      }
      setHighlightedIndices(sliceIndices);
      return;
    }

    if (calcState !== 'calculating') {
      setHighlightedIndices([]);
      return;
    }

    if (operator === 'index()' && inputs.length >= 2) {
      const targetVal = String(inputs[1]).replace(/['"]/g, '').trim();
      const foundIdx = itemsList.findIndex(x => String(x).replace(/['"]/g, '').trim() === targetVal);
      if (foundIdx !== -1) {
        setHighlightedIndices([foundIdx]);
        return;
      }
    }

    if (operator === 'sort()') {
      let step = 0;
      const len = itemsList.length;
      if (len <= 1) return;

      const timer = setInterval(() => {
        const i = step % (len - 1);
        setHighlightedIndices([i, i + 1]);
        step++;
      }, 300);

      return () => clearInterval(timer);
    }

    setCalcState('inputs');
    const timer1 = setTimeout(() => {
      setCalcState('calculating');
    }, 600);

    const timer2 = setTimeout(() => {
      setCalcState('done');
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isActive, isStringCalc, itemsList.length, operator, inputs]);

  useEffect(() => {
    if ((operator === 'index()' || operator === 'sort()' || operator === 'reverse()') && isActive && calcState === 'calculating') {
      let step = 0;
      const totalSteps = itemsList.length;
      const timer = setInterval(() => {
        if (step >= totalSteps) {
          clearInterval(timer);
          setHighlightedIndices([]);
          return;
        }

        const left = step;
        const right = totalSteps - 1 - step;
        if (left >= right) {
          clearInterval(timer);
          setHighlightedIndices([]);
        } else {
          setHighlightedIndices([left, right]);
          step++;
        }
      }, 400);

      return () => clearInterval(timer);
    }
  }, [calcState, operator, isActive, itemsList.length]);

  return (
    <div className="flex items-center gap-3 relative">
      {/* 1. Left side: The inputs being calculated */}
      {isStringCalc ? (
        <div className="flex flex-col items-center p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl gap-3 min-w-60 shadow-lg backdrop-blur-xs relative overflow-hidden">
          {/* Function badge */}
          <div className="text-[9px] font-black tracking-widest text-indigo-400 font-mono uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {operator === 'len()' ? 'len() function' : operator === 'upper()' ? '.upper() function' : '.lower() function'}
          </div>

          {/* Letter/Element by letter/element boxes */}
          <div className="flex gap-2.5 pb-1 pt-1 flex-wrap justify-center">
            {itemsList.map((item, i) => {
              let displayVal = String(item);
              if (isCaseCalc) {
                if (calcState === 'done' || i < activeCountIdx) {
                  displayVal = operator === 'upper()' ? displayVal.toUpperCase() : displayVal.toLowerCase();
                }
              }
              const isConverted = isCaseCalc && (calcState === 'done' || i < activeCountIdx);

              return (
                <div 
                  key={i}
                  className={`relative min-w-8 h-8 px-2 flex items-center justify-center border font-mono rounded-lg font-bold text-sm transition-all duration-300 ${
                    calcState === 'inputs'
                      ? 'border-slate-800 bg-slate-900/50 text-slate-400'
                      : i === activeCountIdx 
                        ? 'border-amber-400 bg-amber-500/20 text-white scale-110 shadow-[0_0_12px_rgba(245,158,11,0.6)] ring-1 ring-amber-400/40' 
                        : isConverted
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-sm scale-105'
                          : i < activeCountIdx 
                            ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-200 shadow-sm' 
                            : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  {displayVal}
                </div>
              );
            })}
          </div>

          {/* Dynamic counter text */}
          <div className="text-[10px] font-bold font-mono text-slate-400 h-4 flex items-center">
            {calcState === 'inputs' && (
              <span>
                {operator === 'len()' 
                  ? (isListVal ? 'Awaiting list size calculation...' : 'Awaiting Length calculation...') 
                  : 'Awaiting Case transformation...'}
              </span>
            )}
            {calcState === 'calculating' && activeCountIdx < itemsList.length && (
              <span className="text-amber-400 animate-pulse">
                {operator === 'len()' 
                  ? (isListVal ? `Counting list element ${activeCountIdx + 1}...` : `Counting character ${activeCountIdx + 1}...`) 
                  : `Converting character ${activeCountIdx + 1}...`}
              </span>
            )}
            {(calcState === 'done' || (calcState === 'calculating' && activeCountIdx >= itemsList.length)) && (
              <span className="text-indigo-400 font-extrabold">
                {operator === 'len()' 
                  ? (isListVal ? `Total elements counted = ${itemsList.length}` : `Total characters counted = ${itemsList.length}`) 
                  : 'Transformation Complete!'}
              </span>
            )}
          </div>
        </div>
      ) : (
        (() => {
          const operatorSymbols = operator.split(' ');
          const highlightIdx = (operator === 'insert' || operator === 'del') ? Number(inputs[1]) : undefined;
          return (
            <>
              {inputs.map((inp, i) => {
                const match = String(inp).match(/^([a-zA-Z_]\w*)\s*\((.*)\)$/);
                const varName = match ? match[1] : inp;
                const inlineVal = match ? match[2] : undefined;

                const rawVal = inlineVal ?? prevMemorySnapshot[varName] ?? memorySnapshot[varName] ?? prevMemorySnapshot[inp] ?? memorySnapshot[inp] ?? inp;
                const { value: cleanVal, varType } = cleanValueAndType(rawVal);
                return (
                  <React.Fragment key={i}>
                    {isDataStructure(cleanVal) ? (() => {
                      const { variant, items } = parseDataStructure(cleanVal);
                      return <DataStructureBox name={varName} variant={variant} items={items} isActive={isActive && calcState === 'inputs'} highlightedIndex={highlightIdx} highlightedIndices={highlightedIndices} />;
                    })() : (
                      <VariableBox 
                        name={varName} 
                        value={cleanVal} 
                        isActive={isActive && calcState === 'inputs'} 
                        colorTheme={colorTheme} 
                        isSmall={isSmall}
                        varType={varType}
                      />
                    )}
                    {i < inputs.length - 1 && <Operator symbol={operatorSymbols[i] || operatorSymbols[0] || '+'} isSmall={isSmall} />}
                  </React.Fragment>
                );
              })}
              {inputs.length === 1 && operator && <Operator symbol={operator} isSmall={isSmall} />}
            </>
          );
        })()
      )}
      
      <Operator symbol="=" isSmall={isSmall} />
      
      {/* 2. Right side: The Assignment Box */}
      <div className="relative flex items-center justify-center">
        {(() => {
          const rawVal = calcState === 'done' ? result : (prevMemorySnapshot[storeIn] ?? '');
          const { value: cleanVal, varType } = cleanValueAndType(rawVal);
          const showOutput = calcState === 'done';
          const outHighlightIdx = (operator === 'insert' && showOutput) ? Number(inputs[1]) : undefined;
          
          return isDataStructure(cleanVal) ? (() => {
            const { variant, items } = parseDataStructure(cleanVal);
            return <DataStructureBox name={storeIn} variant={variant} items={items} isActive={isActive && showOutput} highlightedIndex={outHighlightIdx} />;
          })() : (
            <VariableBox 
              name={storeIn} 
              value={showOutput ? cleanVal : undefined} 
              oldValue={cleanValueAndType(prevMemorySnapshot[storeIn]).value}
              isActive={isActive && showOutput} 
              colorTheme={colorTheme}
              isSmall={isSmall}
              varType={varType}
            />
          );
        })()}
        
        {/* Floating calculation result animation */}
        <AnimatePresence>
          {calcState === 'calculating' && !isDataStructure(result) && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -20, x: -30 }}
              animate={{ opacity: 1, scale: 1.2, y: -30, x: -10 }}
              exit={{ opacity: 0, scale: 0.5, y: 0, x: 20 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="absolute z-10 font-mono font-black text-2xl text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]"
            >
              {result}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
