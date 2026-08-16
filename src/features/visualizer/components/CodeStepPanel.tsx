import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useLessonStore } from '../../../lessons/useLessonStore';
import type { CodeLine } from '../../../lessons/types';
import { usePinchZoom } from '../../../shared/hooks/usePinchZoom';

const TOKEN_COLORS: Record<string, string> = {
  keyword: 'text-purple-300 font-extrabold tracking-wide',
  function: 'text-yellow-300 font-extrabold',
  variable: 'text-sky-200 font-bold',
  string: 'text-emerald-300 font-bold',
  number: 'text-amber-300 font-black',
  operator: 'text-pink-300 font-extrabold',
  punctuation: 'text-white font-black',
  comment: 'text-slate-400 font-bold italic',
  parameter: 'text-cyan-200 font-extrabold',
  text: 'text-white font-bold',
};

/**
 * EditableVariableToken — renders an inline input inside a depth box (inset styled).
 * Supports both text (strings) and numbers.
 */
const EditableVariableToken = React.memo<{
  value: any;
  defaultValue: any;
  min?: number;
  max?: number;
  type?: 'number' | 'text';
  noQuotes?: boolean;
  onCommit: (val: any) => void;
}>(({ value, defaultValue, min, max, type = 'number', noQuotes = false, onCommit }) => {
  const [draft, setDraft] = useState(String(value).replace(/['"]/g, '')); // Strip quotes for editing
  const inputRef = useRef<HTMLInputElement>(null);
  const reset = useLessonStore(s => s.reset);
  const hasEdited = useLessonStore(s => s.hasEdited);

  // Sync draft if external value changes
  React.useEffect(() => {
    setDraft(String(value).replace(/['"]/g, ''));
  }, [value]);

  const commit = () => {
    if (type === 'text') {
      const finalVal = draft.trim() === '' ? String(defaultValue) : draft.trim();
      setDraft(finalVal);
      // Re-add quotes if it's a string token type (unless noQuotes is true)
      onCommit(noQuotes ? finalVal : `"${finalVal}"`);
    } else {
      const parsed = parseFloat(draft);
      if (draft.trim() === '' || isNaN(parsed)) {
        setDraft(String(defaultValue));
        onCommit(defaultValue);
      } else {
        const clamped = min !== undefined && max !== undefined
          ? Math.min(Math.max(parsed, min), max)
          : parsed;
        setDraft(String(clamped));
        onCommit(clamped);
      }
    }
  };

  // Show apply button only if user edited and values are different from current active state
  const cleanVal = String(value).replace(/['"]/g, '');
  const isChanged = cleanVal !== draft;

  return (
    <span className="relative inline-flex items-center mx-1 gap-1">
      {type === 'text' && !noQuotes && <span className="text-amber-400 font-bold font-mono">"</span>}
      <input
        ref={inputRef}
        type={type === 'text' ? 'text' : 'number'}
        value={draft}
        placeholder={String(defaultValue)}
        maxLength={type === 'text' ? 20 : undefined}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') { commit(); inputRef.current?.blur(); }
          if (e.key === 'Escape') { setDraft(cleanVal); inputRef.current?.blur(); }
        }}
        className={`font-mono bg-slate-950 font-bold outline-none border border-slate-700 hover:border-orange-500/50 focus:border-orange-500 rounded px-1.5 py-0.5 transition-all text-center shadow-md focus:shadow-[0_0_8px_rgba(249,115,22,0.15)] cursor-text ${
          type === 'text' ? 'text-amber-400 border-amber-500/30 focus:border-amber-400' : 'text-orange-400'
        }`}
        style={{
          width: `${Math.max(type === 'text' ? 4 : 5, (draft || String(defaultValue)).length + 2.5)}ch`,
          minWidth: type === 'text' ? '4.5rem' : '4.5rem',
          fontFeatureSettings: '"liga" 0',
          MozAppearance: 'textfield',
          fontSize: '0.9em',
        }}
        title="Click to edit value"
      />
      {type === 'text' && !noQuotes && <span className="text-amber-400 font-bold font-mono">"</span>}
      
      {/* Show dynamic Apply button next to editable value block */}
      <AnimatePresence>
        {(hasEdited || isChanged) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            onClick={(e) => {
              e.stopPropagation();
              commit();
              reset(); // Run dynamic pipeline and restart visualization
            }}
            className={`px-2 py-0.5 text-white text-[10px] font-extrabold uppercase rounded shadow transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
              type === 'text' 
                ? 'bg-amber-600 hover:bg-amber-500 border border-amber-400/30' 
                : 'bg-orange-600 hover:bg-orange-500 border border-orange-400/30'
            }`}
            title="Apply changes & Restart"
          >
            <span>Apply</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          </motion.button>
        )}
      </AnimatePresence>
    </span>
  );
});

const CodeLineRow = React.memo<{
  line: CodeLine;
  isActive: boolean;
  zoomLevel: number;
  editableValues: Record<string, any>;
  editableVariables: Record<string, { default: any; min?: number; max?: number; type?: 'number' | 'text'; noQuotes?: boolean }>;
  setEditableValue: (name: string, val: any) => void;
  /** Map of "lineNum -> tokenIndex -> variableName" for the editable variables */
  editableTokenMapping: Record<number, Record<number, string>>;
}>(({ line, isActive, zoomLevel, editableValues, editableVariables, setEditableValue, editableTokenMapping }) => {
  const rowRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isActive && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isActive]);

  return (
    <div 
      ref={rowRef}
      className={`relative flex items-center transition-all duration-300 min-w-full w-max ${isActive ? 'bg-indigo-500/20 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]' : 'hover:bg-white/5'}`}
    >
      {/* Active line indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="active-line-bar"
            className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r shadow-[0_0_10px_rgba(99,102,241,1)]"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </AnimatePresence>

      {/* Line number */}
      <span
        className={`select-none w-10 shrink-0 text-right pr-4 ${isActive ? 'text-indigo-300 font-black' : 'text-slate-400 font-bold'}`}
        style={{ fontSize: `${0.85 * zoomLevel}rem` }}
      >
        {line.lineNum}
      </span>

      {/* Tokens */}
      <span
        className={`font-mono py-1.5 pr-6 whitespace-pre flex items-center flex-nowrap shrink-0`}
        style={{ fontSize: `${0.9 * zoomLevel}rem`, fontFeatureSettings: '"liga" 0', fontVariantLigatures: 'none' }}
      >
        {line.tokens.map((token, i) => {
          // Check if this is the editable number or string on this line
          const varName = editableTokenMapping[line.lineNum]?.[i];
          const isEditableToken = varName && editableValues[varName] !== undefined;

          if (isEditableToken) {
            const def = editableVariables[varName];
            return (
              <EditableVariableToken
                key={i}
                value={editableValues[varName]}
                defaultValue={def.default}
                min={def.min}
                max={def.max}
                type={def.type}
                noQuotes={def.noQuotes}
                onCommit={val => setEditableValue(varName, val)}
              />
            );
          }
          return (
            <span key={i} className={TOKEN_COLORS[token.type] ?? 'text-slate-300'}>
              {token.value}
            </span>
          );
        })}
      </span>
    </div>
  );
});

export const CodeStepPanel = React.memo(() => {
  const lesson = useLessonStore(s => s.lesson);
  const activeLine = useLessonStore(s => s.currentStep?.lineNum ?? -1);
  const editableValues = useLessonStore(s => s.editableValues);
  const setEditableValue = useLessonStore(s => s.setEditableValue);
  const isCodeFullScreen = useLessonStore(s => s.isCodeFullScreen);
  const toggleCodeFullScreen = useLessonStore(s => s.toggleCodeFullScreen);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const containerRef = usePinchZoom(setZoomLevel, 0.4, 2.5);

  if (!lesson) return null;

  const editableVariables = lesson.editableVariables ?? {};

  // Build a map of lineNum -> tokenIndex -> varName for specific tokens
  const editableTokenMapping = React.useMemo(() => {
    const mapping: Record<number, Record<number, string>> = {};
  if (Object.keys(editableVariables).length > 0) {
    if (lesson.id === 'basic_list') {
      mapping[1] = { 5: 'numbers' };
      mapping[2] = { 4: 'index_access' };
      mapping[3] = { 2: 'index_update', 7: 'val_update' };
    } else if (lesson.id === 'list_search') {
      mapping[1] = { 5: 'items' };
      mapping[2] = { 4: 'search_target' };
    } else if (lesson.id === 'list_modify') {
      mapping[1] = { 5: 'data' };
      mapping[2] = { 4: 'insert_index', 7: 'insert_value' };
      mapping[4] = { 4: 'delete_index' };
    } else if (lesson.id === 'update_variable') {
      lesson.lines.forEach(line => {
        if (line.lineNum === 1) {
          const idx = line.tokens.findIndex(t => t.type === 'number');
          if (idx !== -1) mapping[1] = { [idx]: 'points_initial' };
        }
        if (line.lineNum === 3) {
          const idx = line.tokens.findIndex(t => t.type === 'number');
          if (idx !== -1) mapping[3] = { [idx]: 'points_updated' };
        }
      });
    } else {
      lesson.lines.forEach(line => {
        line.tokens.forEach((t, idx) => {
          const pId = (t as any).paramId;
          if (pId && editableVariables[pId]) {
            if (!mapping[line.lineNum]) mapping[line.lineNum] = {};
            mapping[line.lineNum][idx] = pId;
          }
        });

        const varIdx = line.tokens.findIndex(t => t.type === 'variable');
        if (varIdx !== -1) {
          const varToken = line.tokens[varIdx];
          const nextToken = line.tokens[varIdx + 1];
          const isIndexed = nextToken && nextToken.type === 'punctuation' && nextToken.value === '[';
          
          const hasAssignment = line.tokens.some(t => t.type === 'operator' && t.value === '=');
          const valTokenIdx = line.tokens.findIndex(t => t.type === 'number' || t.type === 'string' || t.type === 'parameter');
          
          if (varToken && hasAssignment && valTokenIdx !== -1 && !isIndexed && editableVariables[varToken.value]) {
            if (!mapping[line.lineNum]) mapping[line.lineNum] = {};
            mapping[line.lineNum][valTokenIdx] = varToken.value;
          }
        }
      });
    }
  }
  return mapping;
}, [lesson?.id, lesson?.lines, editableVariables]);

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-[#050510] border border-white/10 rounded-lg overflow-hidden relative">
      {/* Slim header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 shrink-0 bg-white/2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono font-bold tracking-widest uppercase">
            {lesson?.language === 'java' ? 'Main.java' : lesson?.language === 'cpp' ? 'main.cpp' : lesson?.language === 'c' ? 'main.c' : 'main.py'}
          </span>
          {Object.keys(editableVariables).length > 0 && (
            <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded px-1.5 py-0.5 font-bold tracking-wider uppercase shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
              ✏ editable
            </span>
          )}
          {lesson?.language !== 'python' && lesson?.language !== 'dsa' && (
            <span className="text-[10px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-2 py-0.5 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Under Development
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-black/40 rounded-lg border border-white/10 p-0.5">
          <button
            onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.5))}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Zoom Out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
          </button>
          <div className="w-px bg-indigo-500/20 h-4" />
          <button
            onClick={() => setZoomLevel(z => Math.min(z + 0.2, 2.5))}
            className="p-1 text-indigo-400/50 hover:text-white hover:bg-indigo-500/20 rounded transition-colors"
            title="Zoom In"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          {lesson?.language === 'dsa' && (
            <>
              <div className="w-px bg-indigo-500/20 h-4" />
              <button
                onClick={toggleCodeFullScreen}
                className={`p-1 rounded transition-colors ${
                  isCodeFullScreen ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={isCodeFullScreen ? "Exit Fullscreen Code" : "Fullscreen Code View"}
              >
                {isCodeFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Under Development Polite Banner for all In-Progress Languages */}
      {lesson?.language !== 'python' && lesson?.language !== 'dsa' && (
        <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400">ℹ️</span>
            <span><strong className="text-indigo-300">Under Development:</strong> This topic is under active development and requires prior coding knowledge to best understand its visual execution.</span>
          </div>
        </div>
      )}

      {/* Code lines */}
      <div className="flex-1 overflow-auto custom-scrollbar py-3 relative">
        {lesson.lines.map(line => (
          <CodeLineRow
            key={line.lineNum}
            line={line}
            isActive={line.lineNum === activeLine}
            zoomLevel={zoomLevel}
            editableValues={editableValues}
            editableVariables={editableVariables}
            setEditableValue={setEditableValue}
            editableTokenMapping={editableTokenMapping}
          />
        ))}
      </div>

      {/* Hide number input arrows globally */}
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
    </div>
  );
});

