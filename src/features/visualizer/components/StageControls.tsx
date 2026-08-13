import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize, Gauge, BookOpen } from 'lucide-react';
import { useLessonStore } from '../../../lessons/useLessonStore';

export const StageControls: React.FC = () => {
  const lesson = useLessonStore(s => s.lesson);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);
  const totalSteps = useLessonStore(s => s.totalSteps);
  const isPlaying = useLessonStore(s => s.isPlaying);
  const isComplete = useLessonStore(s => s.isComplete);
  const goNext = useLessonStore(s => s.goNext);
  const goPrev = useLessonStore(s => s.goPrev);
  const togglePlay = useLessonStore(s => s.togglePlay);
  const reset = useLessonStore(s => s.reset);
  const goToStep = useLessonStore(s => s.goToStep);
  const setZoom = useLessonStore(s => s.setZoom);
  const zoom = useLessonStore(s => s.zoom);
  const hasEdited = useLessonStore(s => s.hasEdited);
  const playSpeed = useLessonStore(s => s.playSpeed);
  const setPlaySpeed = useLessonStore(s => s.setPlaySpeed);
  const showCheatSheet = useLessonStore(s => s.showCheatSheet);
  const toggleCheatSheet = useLessonStore(s => s.toggleCheatSheet);

  const isDsa = lesson?.language === 'dsa';
  const [showHint, setShowHint] = useState(false);

  // Trigger subtle open hint gesture animation whenever a DSA lesson loads
  useEffect(() => {
    if (isDsa && lesson?.id) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [lesson?.id, isDsa]);

  const canPrev = currentStepIndex > 0;
  const canNext = currentStepIndex < totalSteps - 1;
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  const handleResetZoom = () => {
    if (zoom === 1) {
      // Try to fit the flowchart/stage to the screen
      const container = document.getElementById('flowchart-container');
      const content = document.getElementById('flowchart-content');
      
      if (container && content) {
        const containerHeight = container.clientHeight;
        const unscaledHeight = content.getBoundingClientRect().height / zoom;
        // Leave a little padding
        const targetZoom = Math.min(1, (containerHeight - 80) / unscaledHeight);
        setZoom(Math.max(0.1, targetZoom));
      }
    } else {
      setZoom(1);
    }
  };

  return (
    <div className="flex md:flex-col flex-row items-center justify-between py-1.5 md:py-5 px-3 md:px-0 h-12 md:h-full w-full md:w-14 shrink-0 bg-[#0d1126]/90 backdrop-blur-xl border-y md:border-y-0 md:border-x border-indigo-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-20 overflow-x-auto md:overflow-visible">
      {/* Step counter / DSA badge & CheatSheet button */}
      <div className="flex md:flex-col flex-row items-center gap-2 md:gap-3 shrink-0">
        <div className="flex flex-col items-center gap-1.5 select-none text-center relative">
          {isDsa ? (
            <>
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                DSA
              </span>
              
              <div className="relative">
                {/* Pulsing Ring Indicator when DSA lesson opens */}
                {showHint && !showCheatSheet && (
                  <span className="absolute -inset-1 rounded-xl bg-amber-400/40 animate-ping pointer-events-none" />
                )}

                <motion.button
                  onClick={() => {
                    toggleCheatSheet();
                    setShowHint(false);
                  }}
                  animate={showHint && !showCheatSheet ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                  transition={{ repeat: showHint ? 3 : 0, duration: 0.8 }}
                  className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer active:scale-95 border relative z-10 ${
                    showCheatSheet
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : showHint
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.7)]'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}
                  title="Toggle DSA CheatSheet Notes"
                >
                  <BookOpen size={14} className="text-amber-400" />
                  <span className="text-[7px] font-black tracking-tighter uppercase text-amber-200 leading-none">NOTES</span>
                </motion.button>

                {/* Floating Micro Tooltip Hint */}
                <AnimatePresence>
                  {showHint && !showCheatSheet && (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -8, scale: 0.9 }}
                      className="absolute left-12 top-0 z-30 whitespace-nowrap px-2 py-1 rounded-md bg-amber-950/95 border border-amber-400/80 text-amber-200 font-mono text-[9px] font-bold shadow-xl flex items-center gap-1.5 pointer-events-none"
                    >
                      <span>📝 Notes Here!</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <span className="text-[10px] md:text-[11px] font-black text-indigo-300 drop-shadow-md tracking-wider">
              {currentStepIndex}/{totalSteps - 1}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar (Desktop: Vertical fill, Mobile: Horizontal fill) */}
      {!isDsa ? (
        <div
          className="hidden md:flex flex-1 flex-col items-center py-4 w-full relative group cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const percentage = Math.max(0, Math.min(1, y / rect.height));
            const targetStep = Math.round(percentage * (totalSteps - 1));
            goToStep(targetStep);
          }}
        >
          <div className="w-1.5 h-full bg-indigo-950 rounded-full overflow-hidden relative shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)] rounded-full"
              initial={false}
              animate={{ height: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="w-px h-full bg-linear-to-b from-transparent via-purple-500/20 to-transparent" />
        </div>
      )}

      {/* Mobile Horizontal Progress Track */}
      {!isDsa && (
        <div
          className="flex md:hidden flex-1 items-center px-2 cursor-pointer h-full"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            const targetStep = Math.round(percentage * (totalSteps - 1));
            goToStep(targetStep);
          }}
        >
          <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden relative shadow-inner">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)] rounded-full"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      )}

      {/* Bottom/Right Area: Retry, Zoom, Playback */}
      <div className="flex md:flex-col flex-row items-center gap-1.5 md:gap-3 shrink-0">
        {/* Reset button */}
        <motion.button
          onClick={reset}
          animate={hasEdited ? {
            color: "#f97316",
            borderColor: "rgba(249, 115, 22, 0.4)",
            backgroundColor: "rgba(249, 115, 22, 0.1)"
          } : {
            color: "#cbd5e1",
            borderColor: "rgba(255, 255, 255, 0.05)",
            backgroundColor: "rgba(0, 0, 0, 0)"
          }}
          transition={{ duration: 0.3 }}
          className="p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-white transition-all border shrink-0"
          title="Reset Stage"
        >
          <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </motion.button>

        {/* Zoom Controls */}
        <div className="flex md:flex-col flex-row items-center gap-1 md:gap-2 bg-black/20 p-1 rounded-full border border-indigo-500/10 shrink-0">
          <button 
            onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))} 
            className="p-1 hover:bg-indigo-500/30 rounded-full text-indigo-300 transition-colors"
            title="Zoom In"
          >
             <ZoomIn size={13} />
          </button>
          <button 
            onClick={handleResetZoom} 
            className="p-1 hover:bg-indigo-500/30 rounded-full text-indigo-400/70 transition-colors"
            title="Fit to Screen / Reset Zoom"
          >
             <Maximize size={11} />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.3))} 
            className="p-1 hover:bg-indigo-500/30 rounded-full text-indigo-300 transition-colors"
            title="Zoom Out"
          >
             <ZoomOut size={13} />
          </button>
        </div>

        {/* Playback controls */}
        {!isDsa && (
          <div className="flex md:flex-col flex-row items-center gap-1.5 md:gap-3 shrink-0">
            <motion.button
              onClick={goPrev}
              disabled={!canPrev}
              whileTap={canPrev ? { scale: 0.85 } : {}}
              className="p-1 md:p-2 rounded-xl text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-indigo-500/20 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            <div className="relative">
              {isPlaying && (
                <motion.div 
                  className="absolute inset-0 bg-indigo-500 rounded-full blur-md"
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.85 }}
                disabled={isComplete}
                className={`relative w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                  isComplete
                    ? 'bg-green-500/20 text-green-300 cursor-not-allowed border border-green-500/30'
                    : isPlaying
                    ? 'bg-indigo-900 text-indigo-200 border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-indigo-400/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.8)]'
                }`}
                title={isPlaying ? "Pause" : "Auto Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5 md:ml-1" />}
              </motion.button>
            </div>

            <motion.button
              onClick={goNext}
              disabled={!canNext}
              whileTap={canNext ? { scale: 0.85 } : {}}
              className="p-1 md:p-2 rounded-xl text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-indigo-500/20 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            <button
              onClick={() => {
                const speeds = [1.0, 2.0, 3.0, 4.0];
                const nextIdx = (speeds.indexOf(playSpeed) + 1) % speeds.length;
                setPlaySpeed(speeds[nextIdx]);
              }}
              className={`px-1 py-0.5 text-[9px] md:text-[10px] font-black font-mono tracking-wider border rounded transition-all duration-300 shrink-0 select-none shadow-sm flex items-center justify-center gap-0.5 ${
                playSpeed === 1.0
                  ? 'border-indigo-500/20 text-indigo-300 bg-[#0b0c16]'
                  : playSpeed === 2.0
                  ? 'border-indigo-400 text-indigo-200 bg-indigo-500/10'
                  : playSpeed === 3.0
                  ? 'border-orange-500 text-orange-300 bg-orange-500/10'
                  : 'border-red-500 text-red-400 bg-red-500/15 animate-pulse'
              }`}
              title="Cycling playback speed (1x, 2x, 3x, 4x)"
            >
              <Gauge className="w-3 h-3" />
              <span>{Math.round(playSpeed)}x</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

