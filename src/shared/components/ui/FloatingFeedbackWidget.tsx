import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, AlertCircle, ShieldCheck, Bot } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { submitFeedback } from '../../config/firebase';

export const FloatingFeedbackWidget: React.FC = () => {
  const location = useLocation();
  const isVisualizerPage = location.pathname.includes('/visualizer');
  const isHomePage = location.pathname === '/' || location.pathname.includes('/languages');

  const [isOpen, setIsOpen] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [category, setCategory] = useState<'bug' | 'feature' | 'feedback'>('bug');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmittedToday, setHasSubmittedToday] = useState(() => {
    const lastDate = localStorage.getItem('treadcode_last_feedback_date');
    return lastDate === new Date().toDateString();
  });

  // Periodic non-annoying speech bubble timer on Home Page ONLY (Shows for 4 seconds every 20 seconds)
  useEffect(() => {
    if (!isHomePage || isOpen) return;

    // Initial popup delay 2s after landing on homepage
    const initialTimer = setTimeout(() => {
      setShowSpeechBubble(true);
      setTimeout(() => setShowSpeechBubble(false), 4000);
    }, 2000);

    // Periodic repeat every 20s
    const interval = setInterval(() => {
      setShowSpeechBubble(true);
      setTimeout(() => setShowSpeechBubble(false), 4000);
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isHomePage, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (message.trim().length < 10) {
      setErrorMessage('Please type at least 10 characters so we can understand your feedback clearly.');
      return;
    }

    setIsSubmitting(true);

    const licenseDataRaw = localStorage.getItem('flowtrace_license_cache');
    let licenseKey = 'Unlicensed / Trial';
    if (licenseDataRaw) {
      try {
        const parsed = JSON.parse(licenseDataRaw);
        if (parsed.licenseKey) licenseKey = parsed.licenseKey;
      } catch (err) {
        console.error(err);
      }
    }

    const systemDetails = {
      platform: navigator.platform || 'Unknown OS',
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      licenseKey,
    };

    const success = await submitFeedback({
      category,
      message: message.trim(),
      systemDetails,
    });

    setIsSubmitting(false);

    if (success) {
      setIsSent(true);
      const today = new Date().toDateString();
      localStorage.setItem('treadcode_last_feedback_date', today);
      setHasSubmittedToday(true);
      setTimeout(() => {
        setMessage('');
        setIsSent(false);
        setIsOpen(false);
      }, 2500);
    } else {
      setErrorMessage('Failed to send feedback. Please check your network connection.');
    }
  };

  return (
    <div className={`fixed bottom-6 z-50 flex flex-col items-end transition-all duration-500 ${isVisualizerPage ? '-right-6 hover:right-2' : 'right-6'}`}>
      {/* Cute Robot Speech Bubble Greeting (ONLY on Home Page & periodically auto-hides) */}
      <AnimatePresence>
        {!isOpen && isHomePage && showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-2 px-3 py-1.5 rounded-2xl bg-indigo-950/90 border border-indigo-500/40 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <Bot size={14} className="text-indigo-400 animate-bounce" />
            <span className="text-[11px] font-semibold text-indigo-200 group-hover:text-white transition-colors whitespace-nowrap">
              Facing any problem? Talk to me! 🤖
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            className={`group relative flex items-center justify-center p-3.5 rounded-full bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] border border-indigo-400/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] transition-all duration-300 ${isVisualizerPage ? 'opacity-60 hover:opacity-100 shadow-none' : ''}`}
            title="Report Bug / Talk to Robot Assistant"
          >
            <Bot size={24} className="group-hover:rotate-12 transition-transform duration-300 text-indigo-200" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Popup Modal Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-88 sm:w-96 rounded-2xl bg-[#090d1f]/95 border border-indigo-500/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            {/* Minimal Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-indigo-950/20">
              <div className="flex items-center gap-2.5">
                <div className="relative p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Bot size={18} />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090d1f]" />
                </div>
                <h3 className="text-xs font-bold text-white tracking-wide">Code Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-3.5 space-y-3">
              {isSent ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-400 animate-bounce" />
                  <h4 className="text-xs font-bold text-white">Feedback Sent!</h4>
                </div>
              ) : hasSubmittedToday ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                  <ShieldCheck size={32} className="text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-200">Already Submitted Today</h4>
                  <p className="text-[11px] text-slate-400 max-w-60">
                    You can send another message tomorrow.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Minimal Category Pills */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCategory('bug')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        category === 'bug'
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🐞 Bug
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('feature')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        category === 'feature'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💡 Idea
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('feedback')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        category === 'feedback'
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💬 General
                    </button>
                  </div>

                  {/* Message Input */}
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={3}
                      maxLength={500}
                      className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500/50 focus:outline-hidden text-xs text-slate-200 placeholder-slate-600 resize-none font-sans transition-all"
                    />
                    <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500 font-mono">
                      <span>Min 10 chars</span>
                      <span>{message.length}/500</span>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || message.trim().length < 10}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
