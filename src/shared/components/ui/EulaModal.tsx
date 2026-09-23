import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Codicon } from './Codicon';
import { TreadCodeLogo } from './MindTraceLogo';
import { db, resolveSystemHwid } from '../../config/firebase';
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

    // Fetch safe HWID & send telemetry data to Firebase Admin Panel
    try {
      const hwid = await resolveSystemHwid();

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
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl rounded-lg overflow-hidden shadow-2xl border border-slate-700/80 bg-[#0c0e14] text-slate-200"
          >
            {/* Modal Header & Segmented Tab Switcher */}
            <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#090b10]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <TreadCodeLogo size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    TreadCode Software Agreement
                  </h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Terms of Service & Privacy Protection
                  </p>
                </div>
              </div>

              {/* Segmented Switcher matching Settings */}
              <div className="inline-flex p-1 rounded-lg border bg-[#151923] border-slate-800 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTab("terms")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    tab === "terms"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Codicon name="law" size={13} />
                  <span>Terms of Service</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("privacy")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    tab === "privacy"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Codicon name="shield" size={13} />
                  <span>Privacy Policy</span>
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="px-6 py-4 max-h-87.5 overflow-y-auto space-y-3 text-xs leading-relaxed custom-scrollbar">
              {tab === "terms" ? (
                <>
                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      1. Software License & Usage
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      TreadCode is built to help you understand algorithms, memory behavior, and code flow visually. You are granted a personal license to use all visualizers, practice lessons, and diagnostics for self-learning, teaching, and study in accordance with your plan tier.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      2. Device Limits & Hardware Binding (HWID)
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      Your access key binds to your computer's hardware ID to activate your seat. Please keep your key safe and do not share or distribute keys across unauthorized devices to avoid automatic license locking.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      3. Respect the Work & Code
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      All visualizers, animation engines, themes, and application assets are created and owned by Prince (prince19112003). Please do not reverse-engineer, decompile, or repackage and resell the software.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      4. Classroom & Content Creation Rights
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      You are 100% welcome to use TreadCode in your YouTube tutorials, coding streams, college lectures, and classroom presentations. We only ask that you give a friendly shoutout to TreadCode.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      5. Updates & Direct Support
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      We continuously work on performance improvements, bug fixes, and new visual modules. If you ever run into an issue or need help, reach out anytime through the in-app Feedback tab.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      1. 100% Local-First Execution
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      All your code snippets, execution traces, variable states, and memory diagrams run directly on your own computer. None of your code or scripts are ever uploaded to cloud servers.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      2. Zero Personal Tracking
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      We never collect personal identity details, email addresses, student records, browsing histories, or keystrokes. Your work and study sessions remain completely private.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      3. Anonymous Hardware ID (HWID)
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      When activating a key or checking for updates, only an anonymous hashed hardware identifier is used to verify that your license seat limit is respected on the licensing server.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      4. Local Settings & Sandbox Storage
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      Your screen preferences, dark/light theme, narration voices, and offline tokens are stored locally on your device in standard system app storage.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border bg-[#11141c] border-slate-800/80">
                    <h4 className="font-semibold text-slate-100 text-xs mb-1">
                      5. Direct Help & Seat Transfers
                    </h4>
                    <p className="text-slate-400 text-[11.5px] leading-relaxed">
                      If you ever need to transfer your license to a new computer or have questions about how data is handled, feel free to reach out via the in-app Feedback tab or directly to Prince.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-[#090b10] flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-mono">
                Effective: August 2026 · Software License Agreement
              </span>

              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Accept & Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
