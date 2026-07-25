import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize, Gauge } from 'lucide-react';
import { useLesson } from '../../../lessons/LessonContext';

export const StageControls: React.FC = () => {
  const { lesson, currentStepIndex, totalSteps, isPlaying, isComplete, goNext, goPrev, togglePlay, reset, goToStep, setZoom, zoom, hasEdited, playSpeed, setPlaySpeed } = useLesson();

  const isDsa = lesson?.language === 'dsa';

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
    <div className="flex flex-col items-center justify-between py-5 h-full w-14 shrink-0 bg-[#0d1126]/80 backdrop-blur-xl border-x border-indigo-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-20">
      {/* Top: Progress text / DSA indicator */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="flex flex-col items-center select-none text-center">
          {isDsa ? (
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest px-1 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              DSA
            </span>
          ) : (
            <span className="text-[11px] font-black text-indigo-300 drop-shadow-md tracking-wider">
              {currentStepIndex}/{totalSteps - 1}
            </span>
          )}
        </div>
      </div>

      {/* Center: Vertical Progress Bar (Hidden in DSA mode) */}
      {!isDsa ? (
        <div
          className="flex-1 flex flex-col items-center py-4 w-full relative group cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const percentage = Math.max(0, Math.min(1, y / rect.height));
            const targetStep = Math.round(percentage * (totalSteps - 1));
            goToStep(targetStep);
          }}
        >
          {/* Track background */}
          <div className="w-1.5 h-full bg-indigo-950 rounded-full overflow-hidden relative shadow-inner">
            {/* Fill indicator */}
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)] rounded-full"
              initial={false}
              animate={{ height: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          
          {/* Hover hint thumb */}
          <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div 
              className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] absolute left-0 -ml-0.5 -mt-2 pointer-events-none"
              initial={false}
              animate={{ top: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        </div>
      )}

      {/* Bottom Area: Retry, Zoom, Playback */}
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Retry */}
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
          className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-400 hover:text-white transition-all group mb-1 border`}
          title="Reset Stage"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        {/* Zoom Controls for Visual Panel */}
        <div className="flex flex-col items-center gap-2 mb-2 bg-black/20 p-1.5 rounded-full border border-indigo-500/10">
          <button 
            onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))} 
            className="p-1.5 hover:bg-indigo-500/30 rounded-full text-indigo-300 transition-colors"
            title="Zoom In"
          >
             <ZoomIn size={14} />
          </button>
          <button 
            onClick={handleResetZoom} 
            className="p-1.5 hover:bg-indigo-500/30 rounded-full text-indigo-400/70 transition-colors"
            title="Fit to Screen / Reset Zoom"
          >
             <Maximize size={12} />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.3))} 
            className="p-1.5 hover:bg-indigo-500/30 rounded-full text-indigo-300 transition-colors"
            title="Zoom Out"
          >
             <ZoomOut size={14} />
          </button>
        </div>

        {/* Playback step buttons (Only shown for standard code lessons, hidden in DSA mode) */}
        {!isDsa && (
          <div className="flex flex-col items-center gap-3 mb-2">
            {/* Prev */}
            <motion.button
              onClick={goPrev}
              disabled={!canPrev}
              whileTap={canPrev ? { scale: 0.85 } : {}}
              className="p-2 rounded-xl text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-indigo-500/20 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Play/Pause */}
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
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isComplete
                    ? 'bg-green-500/20 text-green-300 cursor-not-allowed border border-green-500/30'
                    : isPlaying
                    ? 'bg-indigo-900 text-indigo-200 border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-indigo-400/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.8)]'
                }`}
                title={isPlaying ? "Pause" : "Auto Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </motion.button>
            </div>

            {/* Next */}
            <motion.button
              onClick={goNext}
              disabled={!canNext}
              whileTap={canNext ? { scale: 0.85 } : {}}
              className="p-2 rounded-xl text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-indigo-500/20 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Playback speed toggle */}
            <button
              onClick={() => {
                const speeds = [1.0, 2.0, 3.0, 4.0];
                const nextIdx = (speeds.indexOf(playSpeed) + 1) % speeds.length;
                setPlaySpeed(speeds[nextIdx]);
              }}
              className={`px-1.5 py-1 text-[10px] font-black font-mono tracking-wider border rounded transition-all duration-300 shrink-0 select-none shadow-sm flex flex-col items-center gap-0.5 min-w-10 ${
                playSpeed === 1.0
                  ? 'border-indigo-500/20 text-indigo-300 bg-[#0b0c16] hover:bg-indigo-500/10'
                  : playSpeed === 2.0
                  ? 'border-indigo-400 text-indigo-200 bg-indigo-500/10 shadow-[0_0_8px_rgba(99,102,241,0.25)] hover:bg-indigo-500/20'
                  : playSpeed === 3.0
                  ? 'border-orange-500 text-orange-300 bg-orange-500/10 shadow-[0_0_8px_rgba(249,115,22,0.25)] hover:bg-orange-500/20'
                  : 'border-red-500 text-red-400 bg-red-500/15 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse hover:bg-red-500/20'
              }`}
              title="Cycling playback speed (1x, 2x, 3x, 4x)"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{Math.round(playSpeed)}x</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

