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
  const [zoomLevel, setZoomLevel] = useState(isDsa ? 1.2 : 0.8);
  
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
      popupTimerRef.current = setTimeout(() => {
        setShowUnderDevPopup(false);
      }, 3000);
      setIsVoiceEnabled(true);
    } else {
      synthRef.current?.cancel();
      setIsSpeaking(false);
      setIsVoiceEnabled(false);
      setShowUnderDevPopup(false);
    }
  };

  if (!lesson) return null;

  return (
    <div className="h-full flex flex-col bg-[#0b0c14] border border-indigo-500/20 rounded-2xl relative overflow-hidden">
      {/* Slim Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-indigo-500/20 shrink-0 bg-white/2 relative">
        <div className="flex items-center gap-2 relative">
          {/* TTS Voice Toggle Button - Default OFF */}
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-xs font-mono font-bold ${
              isVoiceEnabled
                ? isSpeaking
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30 animate-pulse'
                  : 'border-amber-500/60 bg-amber-950/40 text-amber-300 ring-2 ring-amber-500/30'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
            title="AI Voice Feature"
          >
            {isVoiceEnabled ? <Volume2 size={14} className={isSpeaking ? 'text-emerald-400' : 'text-amber-400'} /> : <VolumeX size={14} />}
            <span>{isVoiceEnabled ? (isSpeaking ? 'SPEAKING...' : 'VOICE ON') : 'VOICE OFF'}</span>
          </button>

          {/* Under Development Small Popup Badge */}
          <AnimatePresence>
            {showUnderDevPopup && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                className="absolute left-0 top-9 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/95 border border-amber-500/50 rounded-xl shadow-2xl backdrop-blur-xl text-[11px] font-mono text-amber-300 whitespace-nowrap"
              >
                <AlertCircle size={13} className="text-amber-400 shrink-0" />
                <span>🚧 Voice Feature Under Development</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-900/20 hover:bg-indigo-500/20 transition-all text-xs font-mono text-indigo-300/60 hover:text-white"
            title="Toggle language"
          >
            <span className={language === 'en' ? 'text-white font-black' : 'opacity-40'}>EN</span>
            <span className="opacity-30">/</span>
            <span className={language === 'hi' ? 'text-white font-black' : 'opacity-40'}>HI</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-black/40 rounded-lg border border-indigo-500/20 p-0.5">
            <button
              onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.5))}
              className="p-1 text-indigo-400/50 hover:text-white hover:bg-indigo-500/20 rounded transition-colors"
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
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {/* Event type badge */}
        {currentStep && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase ${badge.color}`}>
                {badge.label}
              </span>
              <span className="text-slate-600 font-mono text-xs">step {currentStep.step}</span>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Explanation text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep?.step ?? 0}-${language}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className={`leading-relaxed ${language === 'hi' ? 'text-white font-bold tracking-wide' : 'text-slate-100 font-medium'}`}
              style={{ fontSize: `${(language === 'hi' ? 1.05 : 0.9) * zoomLevel}rem` }}
            >
              {text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
