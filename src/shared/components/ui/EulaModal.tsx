import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { TreadCodeLogo } from './MindTraceLogo';
import { db } from '../../config/firebase';
import { ref, set, get } from 'firebase/database';

export const EulaModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  useEffect(() => {
    const accepted = localStorage.getItem('flowtrace_eula_accepted');
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = async () => {
    const acceptedAt = new Date().toISOString();
    localStorage.setItem('flowtrace_eula_accepted', acceptedAt);

    // Fetch system HWID & send telemetry data to Firebase Admin Panel
    try {
      let hwid = 'web-browser-' + Math.random().toString(36).substring(2, 9);
      if ((window as any).__TAURI_INTERNALS__) {
        try {
          const { invoke } = await import('@tauri-apps/api/core') as any;
          hwid = await invoke('get_hwid');
        } catch (e) {
          console.error(e);
        }
      }

      const activeKey = localStorage.getItem('flowtrace_license_key') || 'Unregistered';
      const installationRef = ref(db, `installations/${hwid}`);
      
      const snap = await get(installationRef);
      if (!snap.exists()) {
        await set(installationRef, {
          hwid,
          firstInstalledAt: acceptedAt,
          lastSeen: acceptedAt,
          eulaAcceptedAt: acceptedAt,
          activeKey,
          os: typeof window !== 'undefined' ? window.navigator.platform : 'Desktop',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        });
      } else {
        await set(ref(db, `installations/${hwid}/lastSeen`), acceptedAt);
        await set(ref(db, `installations/${hwid}/eulaAcceptedAt`), acceptedAt);
      }
    } catch (e) {
      console.error('Failed to log telemetry:', e);
    }

    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0d111a]"
          >
            {/* Top Accent Line */}
            <div className="h-1 bg-indigo-600" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-slate-900 border border-slate-800">
                  <TreadCodeLogo size={28} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Terms & Privacy Policy
                  </h2>
                  <p className="text-xs text-slate-400">
                    Simple and clear guidelines for using TreadCode
                  </p>
                </div>
              </div>

              {/* Simple Tab Switcher */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => setTab("terms")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tab === "terms"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText size={14} />
                  <span>Terms of Service</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("privacy")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tab === "privacy"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Privacy Policy</span>
                </button>
              </div>

              {/* Scrollable Content (Clean & Simple) */}
              <div className="h-56 overflow-y-auto custom-scrollbar bg-[#080b12] border border-slate-800/80 rounded-xl p-4 text-xs text-slate-300 space-y-4 leading-relaxed">
                {tab === "terms" ? (
                  <>
                    <div>
                      <h4 className="font-semibold text-white">1. Permitted Use</h4>
                      <p className="text-slate-400 mt-1">
                        TreadCode is built for students, teachers, and developers. You are welcome to use it for self-study, college lectures, lab sessions, and classroom demonstrations.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">2. Single-Device License</h4>
                      <p className="text-slate-400 mt-1">
                        Each license key is securely linked to your device (HWID) to prevent unauthorized redistribution. Please keep your key private.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">3. Recording & Teaching</h4>
                      <p className="text-slate-400 mt-1">
                        You can freely use or record these visual animations in educational videos, course tutorials, or live streams with platform attribution.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">4. Fair Usage</h4>
                      <p className="text-slate-400 mt-1">
                        Do not attempt to reverse engineer, tamper with application binaries, or redistribute unauthorized modified builds.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold text-white">1. 100% Offline & Private Code</h4>
                      <p className="text-slate-400 mt-1">
                        Your source code, drawings, and whiteboard notes execute entirely on your machine. Nothing is ever uploaded or read by our servers.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">2. Zero Personal Tracking</h4>
                      <p className="text-slate-400 mt-1">
                        We do not collect names, personal files, passwords, keystrokes, or browsing activities.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">3. Anonymous Hardware ID (HWID)</h4>
                      <p className="text-slate-400 mt-1">
                        An anonymous cryptographic hardware signature is read purely to authenticate your license activation state on our licensing database.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">4. Local Device Settings</h4>
                      <p className="text-slate-400 mt-1">
                        Your font preferences, display tuning, theme settings, and speech options remain strictly stored on your own local device.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>One-time setup agreement</span>
                </span>

                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                >
                  I Agree & Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
