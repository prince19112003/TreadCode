import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { TreadCodeLogo } from './MindTraceLogo';

export const EulaModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  useEffect(() => {
    const accepted = localStorage.getItem('flowtrace_eula_accepted');
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('flowtrace_eula_accepted', new Date().toISOString());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30"
          style={{ background: 'rgba(9, 11, 20, 0.97)' }}
        >
          {/* Header Accent Line */}
          <div className="h-1 bg-linear-to-r from-sky-400 via-indigo-500 to-purple-500" />

          <div className="p-6 md:p-7">
            {/* Logo + Title */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <TreadCodeLogo size={40} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">
                  Welcome to <span className="text-white">Tread</span><span className="text-indigo-400">Code</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Please review & accept the agreement to continue
                </p>
              </div>
            </div>

            {/* Document Switcher Tabs */}
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-4">
              <button
                onClick={() => setTab('terms')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'terms'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={13} />
                <span>Terms of Service</span>
              </button>
              <button
                onClick={() => setTab('privacy')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'privacy'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck size={13} />
                <span>Privacy Policy</span>
              </button>
            </div>

            {/* Scrollable Document Text */}
            <div className="h-52 overflow-y-auto custom-scrollbar bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 space-y-3 leading-relaxed font-sans">
              {tab === 'terms' ? (
                <>
                  <p className="font-bold text-slate-100">End User License Agreement (EULA)</p>
                  <p>By using the FlowTrace algorithm visualization & teaching platform, you agree to comply with these terms.</p>
                  <h4 className="font-semibold text-indigo-300 pt-1">1. Educational & Classroom License</h4>
                  <p>FlowTrace grants you a non-exclusive license to operate the visualization platform in classrooms, laboratories, online lectures, and personal academic study.</p>
                  <h4 className="font-semibold text-indigo-300 pt-1">2. Hardware Key Verification</h4>
                  <p>Each license key is securely bound to the system hardware signature (HWID). Redistribution or unauthorized sharing beyond authorized seat limits is strictly prohibited.</p>
                  <h4 className="font-semibold text-indigo-300 pt-1">3. Content Usage</h4>
                  <p>Visual animations and algorithm execution flows may be presented in educational lectures and academic video courseware with proper platform attribution.</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-100">Privacy & Security Commitment</p>
                  <p>Your privacy and data security are fundamental to FlowTrace. Here is how your data is handled:</p>
                  <h4 className="font-semibold text-indigo-300 pt-1">1. Zero Personal Data Tracking</h4>
                  <p>We do not track or store personal user accounts, code scripts, or browsing history externally.</p>
                  <h4 className="font-semibold text-indigo-300 pt-1">2. Hardware Signature (HWID) Processing</h4>
                  <p>The application reads your system network hardware interface signature purely to bind license key credentials securely on our licensing server database.</p>
                  <h4 className="font-semibold text-indigo-300 pt-1">3. Local State Persistence</h4>
                  <p>All display tuning, font preferences, and application settings remain stored locally on your device.</p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>One-time agreement on initial setup</span>
              </span>

              <button
                onClick={handleAccept}
                className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 shrink-0"
              >
                I Agree & Accept
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
