import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, Key, Laptop, ArrowRight, X } from 'lucide-react';
import type { KeyRequestItem } from '@shared/config/firebase';

interface KeyIssuedNotificationModalProps {
  request: KeyRequestItem | null;
  onActivate: (key: string) => Promise<boolean>;
  onDismiss: () => void;
}

export const KeyIssuedNotificationModal: React.FC<KeyIssuedNotificationModalProps> = ({
  request,
  onActivate,
  onDismiss,
}) => {
  const [copied, setCopied] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  if (!request || !request.assignedKey) return null;

  const handleCopyKey = () => {
    if (request.assignedKey) {
      navigator.clipboard.writeText(request.assignedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleActivateClick = async () => {
    if (!request.assignedKey) return;
    setActivating(true);
    setActivateError(null);
    const success = await onActivate(request.assignedKey);
    setActivating(false);
    if (!success) {
      setActivateError('Activation failed. Please verify your internet connection or key status.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-zinc-950 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-emerald-950/30 relative text-left"
        >
          {/* Top Close Button (Dismiss for current session) */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Remind me later"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Key size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  Key Issued
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {request.tierName || request.tier}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono mt-0.5">
                Your Activation Key is Ready!
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-300 font-mono leading-relaxed mb-4">
            Your key request has been approved! The activation key was delivered to{' '}
            <strong className="text-white underline decoration-emerald-500/50">{request.email}</strong>.
          </p>

          {/* Key Display Card */}
          <div className="bg-black border border-zinc-800 rounded-xl p-3.5 space-y-2 mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>License Key</span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Laptop size={11} />
                Bound to HWID
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-700/60">
              <span className="font-mono text-base font-black tracking-widest text-emerald-300 select-all">
                {request.assignedKey}
              </span>
              <button
                onClick={handleCopyKey}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {activateError && (
            <p className="text-xs text-rose-400 font-mono mb-3 bg-rose-950/40 border border-rose-800/50 p-2 rounded-lg">
              {activateError}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleActivateClick}
              disabled={activating}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50"
            >
              <span>{activating ? 'Activating...' : 'Activate On This Device Now'}</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-xs cursor-pointer transition-colors"
            >
              Later
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 font-mono text-center mt-3">
            This alert will reappear until this key is activated on your machine.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
