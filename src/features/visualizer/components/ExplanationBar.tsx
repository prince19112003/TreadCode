import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useLesson } from '../../../lessons/LessonContext';

// Map event type to a short human label + color
const EVENT_LABEL: Record<string, { label: string; color: string }> = {
  CREATE_VARIABLE: { label: '📦 Declare', color: 'bg-blue-500 text-white' },
  UPDATE_VARIABLE: { label: '✏️ Assign', color: 'bg-amber-500 text-black' },
  COMPUTE:         { label: '⚡ Compute', color: 'bg-violet-500 text-white' },
  PRINT_VALUE:     { label: '🖨️ Output', color: 'bg-green-500 text-black' },
  COPY_VALUE:      { label: '📋 Copy', color: 'bg-cyan-500 text-black' },
  SWAP:            { label: '🔄 Swap', color: 'bg-orange-500 text-black' },
  COMPLETE:        { label: '✅ Done', color: 'bg-emerald-500 text-black' },
  NONE:            { label: '▶ Run', color: 'bg-slate-600 text-white' },
  // ── DSA Specific ────────────────────────────────────────────────────────
  STACK_PUSH:      { label: '⬆ Push', color: 'bg-fuchsia-500 text-white' },
  STACK_POP:       { label: '⬇ Pop', color: 'bg-rose-500 text-white' },
  ENQUEUE:         { label: '↩ Enqueue', color: 'bg-cyan-500 text-black' },
  DEQUEUE:         { label: '↪ Dequeue', color: 'bg-orange-500 text-black' },
  SET_POINTERS:    { label: '🎯 Pointers', color: 'bg-indigo-500 text-white' },
  COMPARE_INDICES: { label: '🔍 Compare', color: 'bg-blue-500 text-white' },
  NODE_TRAVERSE:   { label: '→ Traverse', color: 'bg-purple-500 text-white' },
  TREE_VISIT:      { label: '🌳 Visit', color: 'bg-green-600 text-white' },
  LINKED_LIST_UPDATE: { label: '🔗 Link', color: 'bg-purple-600 text-white' }
};

export const ExplanationBar: React.FC = () => {
  const { currentStep, lesson, language, toggleLanguage } = useLesson();
  const isDsa = lesson?.language === 'dsa';
  const [zoomLevel, setZoomLevel] = useState(isDsa ? 0.95 : 0.85);

  // Always default to Voice OFF on app restart / mount
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showUnderDevPopup, setShowUnderDevPopup] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const text = currentStep
    ? (language === 'en' ? currentStep.explanationEnglish : currentStep.explanationHinglish)
    : (language === 'en'
        ? lesson?.learningObjective
        : (lesson?.learningObjectiveHinglish || `Samjhein kaise Python ${lesson?.friendlyName || ''} execute karta hai.`)) || '';

  const evType = currentStep?.animationEvent?.type ?? 'NONE';
  const badge = EVENT_LABEL[evType] ?? EVENT_LABEL.NONE;

  // Speak explanation text automatically on step change when voice enabled
  useEffect(() => {
    if (!isVoiceEnabled || !synthRef.current || !text) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const customEnVoice = localStorage.getItem('flowtrace_voice_en');
    const customHiVoice = localStorage.getItem('flowtrace_voice_hi');

    if (language === 'hi') {
      utterance.lang = 'hi-IN';
      const emilyVoice = (customHiVoice && voices.find(v => v.name === customHiVoice)) ||
                         voices.find(v => v.name.includes('Emily')) ||
                         voices.find(v => v.lang.includes('hi')) ||
                         voices.find(v => v.name.toLowerCase().includes('hindi'));
      if (emilyVoice) utterance.voice = emilyVoice;
    } else {
      utterance.lang = 'en-US';
      const liamVoice = (customEnVoice && voices.find(v => v.name === customEnVoice)) ||
                        voices.find(v => v.name.includes('Liam')) ||
                        voices.find(v => v.name.includes('Google US English')) ||
                        voices.find(v => v.lang.includes('en-US')) ||
                        voices.find(v => v.lang.includes('en'));
      if (liamVoice) utterance.voice = liamVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);

    return () => {
      synthRef.current?.cancel();
    };
  }, [currentStep?.step, language, isVoiceEnabled, text]);

  const toggleVoice = () => {
    if (!isVoiceEnabled) {
      // Show "Under Development" popup briefly when turning ON
      setShowUnderDevPopup(true);
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => setShowUnderDevPopup(false), 2500);
    } else {
      setShowUnderDevPopup(false);
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  if (!lesson) return null;

  const isVoiceModeConfigured = localStorage.getItem('treadcode_voice_enabled') === 'true';

  return (
    <div className="flex-1 h-full flex flex-col bg-[#080914] rounded-lg border border-slate-800/60 overflow-hidden shadow-lg">
      
      {/* Header controls */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="relative flex items-center">
          {/* Voice Toggle: Only shown when enabled in Settings Page */}
          {isVoiceModeConfigured && (
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isVoiceEnabled
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                  : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:bg-slate-700/40 hover:text-slate-200'
              }`}
              title="Toggle Audio Explanation"
            >
              {isVoiceEnabled ? (
                <>
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-indigo-400' : 'text-indigo-400'}`} />
                  <span className="font-mono text-[11px] font-bold">VOICE ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">VOICE OFF</span>
                </>
              )}
            </button>
          )}

          {/* Under Development Toast Popup */}
          <AnimatePresence>
            {showUnderDevPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1.5 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/95 border border-indigo-500/50 text-indigo-200 text-xs shadow-xl backdrop-blur-md whitespace-nowrap pointer-events-none"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Voice explanation is currently under development</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 transition-all text-[11px] font-mono text-indigo-300"
            title="Toggle language"
          >
            <span className={language === 'en' ? 'text-white font-black' : 'opacity-40'}>EN</span>
            <span className="opacity-30">/</span>
            <span className={language === 'hi' ? 'text-white font-black' : 'opacity-40'}>HI</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-black/40 rounded-md border border-slate-800 p-0.5">
            <button
              onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.6))}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
            </button>
            <div className="w-px bg-slate-800 h-3.5" />
            <button
              onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.8))}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom In"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-2 flex flex-col gap-1.5">
        {/* Event type badge */}
        {currentStep && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 shrink-0"
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${badge.color}`}>
                {badge.label}
              </span>
              <span className="text-slate-500 font-mono text-[10px] font-semibold">step {currentStep.step}</span>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Explanation text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep?.step ?? 0}-${language}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <p
              className="leading-relaxed text-slate-100 font-medium tracking-normal"
              style={{ fontSize: `${(language === 'hi' ? 0.95 : 0.9) * zoomLevel}rem` }}
            >
              {text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
