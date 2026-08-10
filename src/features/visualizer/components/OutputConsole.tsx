import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Expand, Shrink, ChevronDown, ChevronUp } from 'lucide-react';
import { useLesson } from '../../../lessons/LessonContext';

interface OutputConsoleProps {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  isFullScreen = false,
  onToggleFullScreen,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { currentStep, currentStepIndex, activeSteps } = useLesson();
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [displayedChars, setDisplayedChars] = useState<Record<number, number>>({});
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const prevStepRef = useRef<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStepIndex === 0 || !activeSteps || activeSteps.length === 0) {
      setOutputLines([]);
      setDisplayedChars({});
      prevStepRef.current = -1;
      return;
    }

    const currentStepNum = currentStep?.step ?? 0;
    if (currentStepNum === prevStepRef.current) return;
    prevStepRef.current = currentStepNum;

    // Find the latest step that has consoleOutput defined up to the current index
    const visibleSteps = activeSteps.slice(0, currentStepIndex);
    const lastStepWithOutput = [...visibleSteps].reverse().find(
      s => s.consoleOutput !== undefined && s.consoleOutput !== null
    );

    if (lastStepWithOutput && lastStepWithOutput.consoleOutput) {
      const lines = lastStepWithOutput.consoleOutput.split('\n');
      setOutputLines(lines);
      // Reset displayed chars for typewriter
      const chars: Record<number, number> = {};
      lines.forEach((_, i) => { chars[i] = 0; });
      setDisplayedChars(chars);
    } else {
      setOutputLines([]);
      setDisplayedChars({});
    }
  }, [currentStep, currentStepIndex, activeSteps]);

  // Typewriter effect per line
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    outputLines.forEach((line, lineIdx) => {
      for (let charIdx = 0; charIdx <= line.length; charIdx++) {
        const delay = lineIdx * 200 + charIdx * 30;
        timers.push(
          setTimeout(() => {
            setDisplayedChars(prev => ({ ...prev, [lineIdx]: charIdx }));
          }, delay)
        );
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [outputLines]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedChars]);

  return (
    <div className="h-full bg-[#0a0f0a] border border-green-500/30 rounded-lg flex flex-col overflow-hidden relative transition-all duration-300">
      {/* Slim Console Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-green-500/20 shrink-0 bg-white/2">
        <div className="flex items-center gap-2">
          {/* macOS style traffic lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-green-500/70 font-mono tracking-widest uppercase font-bold">Console Output</span>
        </div>

        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="flex items-center gap-1 bg-black/40 rounded-lg border border-green-500/20 p-0.5">
              <button
                onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.5))}
                className="p-1 text-green-500/50 hover:text-green-400 hover:bg-green-500/20 rounded transition-colors"
                title="Zoom Out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
              </button>
              <div className="w-px bg-green-500/20 h-4" />
              <button
                onClick={() => setZoomLevel(z => Math.min(z + 0.2, 2.5))}
                className="p-1 text-green-500/50 hover:text-green-400 hover:bg-green-500/20 rounded transition-colors"
                title="Zoom In"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          )}

          {/* Full Screen Toggle */}
          {onToggleFullScreen && !isCollapsed && (
            <button
              onClick={onToggleFullScreen}
              className="p-1 text-green-500/50 hover:text-green-400 hover:bg-green-500/20 rounded transition-colors border border-green-500/20 bg-black/40 flex items-center justify-center"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <Shrink size={14} /> : <Expand size={14} />}
            </button>
          )}

          {/* Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/30 bg-green-950/40 flex items-center justify-center gap-1 px-2"
              title={isCollapsed ? "Expand Console Output" : "Collapse Console Output"}
            >
              <span className="text-[10px] font-mono font-bold tracking-wider">{isCollapsed ? "EXPAND" : "COLLAPSE"}</span>
              {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Output Console Body */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-5 py-4 font-mono" style={{ fontSize: `${0.875 * zoomLevel}rem` }}>
          <AnimatePresence>
            {outputLines.length === 0 ? (
              <span className="text-green-900/50 italic">No output yet...</span>
            ) : (
              outputLines.map((line, lineIdx) => (
                <motion.div
                  key={`${lineIdx}-${line}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-green-400 leading-relaxed drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] flex whitespace-pre-wrap"
                >
                  <span className="text-green-600 mr-3 select-none">{'>'}</span>
                  <span>
                    {line.slice(0, displayedChars[lineIdx] ?? 0)}
                    {(displayedChars[lineIdx] ?? 0) < line.length && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="text-green-400"
                      >▌</motion.span>
                    )}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
