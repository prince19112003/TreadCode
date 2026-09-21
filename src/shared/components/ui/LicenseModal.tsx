import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, CreditCard, ArrowRight, Lock, CheckCircle2, AlertCircle, Laptop, LogOut } from 'lucide-react';
import { fetchLicenseDetails, unlinkDeviceFromLicense } from '../../config/firebase';

interface LicenseModalProps {
  onActivate: (key: string) => Promise<boolean>;
  onClose?: () => void;
}

type AnimPhase = 'idle' | 'revolving' | 'merged' | 'rejected';

export const LicenseModal: React.FC<LicenseModalProps> = ({ onActivate, onClose }) => {
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [limitDevices, setLimitDevices] = useState<Record<string, { activatedAt?: string }>>({});
  const [maxDevicesCount, setMaxDevicesCount] = useState(1);
  const [unlinkingHwid, setUnlinkingHwid] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyChange = (val: string) => {
    if (animPhase === 'revolving' || animPhase === 'merged') return;
    const sanitized = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setKey(sanitized);
    setError(null);
    if (animPhase === 'rejected') setAnimPhase('idle');
  };

  const handleTriggerActivation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!key.trim() || key.length < 6 || loading) return;

    setLoading(true);
    setError(null);
    setAnimPhase('revolving');

    try {
      const [success] = await Promise.all([
        onActivate(key.trim()),
        new Promise((resolve) => setTimeout(resolve, 1100)),
      ]);

      if (success) {
        setAnimPhase('merged');
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      } else {
        // Check if device limit was reached
        const checkDetails = await fetchLicenseDetails(key.trim());
        if (checkDetails.limitReached && checkDetails.devices && Object.keys(checkDetails.devices).length > 0) {
          setAnimPhase('idle');
          setLoading(false);
          setLimitDevices(checkDetails.devices);
          setMaxDevicesCount(checkDetails.maxDevices || 1);
          setShowDeviceManager(true);
          return;
        }

        setAnimPhase('rejected');
        setError(checkDetails.blocked ? 'This license key has been blocked.' : 'Invalid activation key or license expired.');
        setTimeout(() => {
          setAnimPhase('idle');
          setLoading(false);
        }, 1400);
      }
    } catch {
      setAnimPhase('rejected');
      setError('Connection error. Please check your network.');
      setTimeout(() => {
        setAnimPhase('idle');
        setLoading(false);
      }, 1400);
    }
  };

  const chars = Array.from({ length: 6 }).map((_, i) => key[i] || '');

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Subtle non-colored ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

        {showDeviceManager ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Laptop size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white font-mono tracking-tight">
                Device Limit Reached
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-xs mx-auto">
                This license allows up to {maxDevicesCount} active device(s). Logout any device below to bind this computer.
              </p>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto text-left pr-1 my-3">
              {Object.entries(limitDevices).map(([devId, devInfo]) => (
                <div
                  key={devId}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono shadow-sm"
                >
                  <div className="truncate max-w-52.5">
                    <div className="flex items-center gap-1.5 text-zinc-200 font-bold truncate">
                      <Laptop size={12} className="text-indigo-400 shrink-0" />
                      <span className="truncate">{devId}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">
                      {devInfo.activatedAt ? `Linked: ${new Date(devInfo.activatedAt).toLocaleDateString('en-GB')}` : 'Active device'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setUnlinkingHwid(devId);
                      const ok = await unlinkDeviceFromLicense(key.trim(), devId);
                      if (ok) {
                        const updated = { ...limitDevices };
                        delete updated[devId];
                        setLimitDevices(updated);
                        setShowDeviceManager(false);
                        // Re-trigger activation automatically
                        handleTriggerActivation();
                      }
                      setUnlinkingHwid(null);
                    }}
                    disabled={unlinkingHwid === devId}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[11px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <LogOut size={11} />
                    <span>{unlinkingHwid === devId ? 'Unlinking...' : 'Logout'}</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowDeviceManager(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Back to Key Input
            </button>
          </div>
        ) : (
          <>
            {/* Minimal Monochromatic Top Icon */}
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner text-zinc-300">
              {animPhase === 'merged' ? (
                <CheckCircle2 className="w-5 h-5 text-zinc-200" />
              ) : animPhase === 'rejected' ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <Lock className="w-5 h-5 text-zinc-400" />
              )}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight mb-1 font-mono">
              Activate TreadCode
            </h2>
            <p className="text-xs text-zinc-400 mb-6 font-mono leading-relaxed max-w-xs mx-auto">
              {animPhase === 'merged' ? (
                <span className="text-zinc-200 font-bold">Key Authenticated. Unlocking courses...</span>
              ) : animPhase === 'revolving' ? (
                <span className="text-zinc-300 font-bold">Verifying key...</span>
              ) : animPhase === 'rejected' ? (
                <span className="text-rose-400 font-bold">Merge failed — invalid license key</span>
              ) : (
                'Please enter the software activation license key provided by your institution.'
              )}
            </p>

            {/* Form Container */}
            <form onSubmit={handleTriggerActivation} className="space-y-6">
              <input
                ref={inputRef}
                type="text"
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                maxLength={6}
                disabled={animPhase === 'revolving' || animPhase === 'merged'}
                className="absolute opacity-0 pointer-events-none -top-9999"
                aria-label="License Key Input"
              />

              {/* Interactive 6-Key Revolving & Merging Area */}
              <div
                onClick={() => inputRef.current?.focus()}
                className="relative min-h-17.5 flex items-center justify-center cursor-text"
              >
                {/* 1. Normal Row of Slots (Idle state) */}
                {animPhase === 'idle' && (
                  <div className="flex items-center justify-center gap-2">
                    {chars.map((ch, idx) => {
                      const isCurrent = key.length === idx;
                      const isFilled = Boolean(ch);
                      return (
                        <div
                          key={idx}
                          className={`w-10 h-13 sm:w-11 sm:h-14 rounded-xl border flex items-center justify-center text-lg sm:text-xl font-mono font-bold transition-colors ${
                            isCurrent
                              ? 'border-zinc-400 bg-zinc-900 text-white shadow-sm'
                              : isFilled
                              ? 'border-zinc-700 bg-zinc-900/90 text-zinc-100'
                              : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-600'
                          }`}
                        >
                          {ch || (isCurrent ? <span className="w-1 h-4 bg-zinc-300 animate-pulse rounded-sm" /> : '•')}
                        </div>
                      );
                    })}

                    {/* Right Inline Activate Button with Icon */}
                    <button
                      type="submit"
                      disabled={loading || key.length < 6}
                      title="Activate Key"
                      className={`w-10 h-13 sm:w-11 sm:h-14 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        key.length === 6
                          ? 'bg-zinc-100 hover:bg-white border-zinc-300 text-black shadow-sm active:scale-95'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      <ArrowRight size={17} className={key.length === 6 ? 'translate-x-0.5' : ''} />
                    </button>
                  </div>
                )}

                {/* 2. Revolving Animation (Greyish Minimal Orbit) */}
                {animPhase === 'revolving' && (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Thin dashed orbit line */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-zinc-700/60 animate-spin [animation-duration:2.5s]" />

                    <motion.div
                      animate={{ rotate: 720 }}
                      transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {chars.map((ch, idx) => {
                        const angle = (idx * 60 * Math.PI) / 180;
                        const radius = 44;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        return (
                          <div
                            key={idx}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              marginLeft: '-17px',
                              marginTop: '-17px',
                              transform: `translate(${x}px, ${y}px)`,
                            }}
                            className="w-8.5 h-8.5 rounded-xl bg-zinc-900 border border-zinc-600 text-zinc-200 text-xs font-mono font-bold flex items-center justify-center shadow-md"
                          >
                            {ch || '•'}
                          </div>
                        );
                      })}
                    </motion.div>
                  </div>
                )}

                {/* 3. Merged Animation — Minimal Non-Cartoonish Greyish / Metallic Key */}
                {animPhase === 'merged' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.06, 1], opacity: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="relative flex flex-col items-center justify-center py-1"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700/90 flex items-center justify-center text-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                      <KeyRound size={24} className="stroke-[1.8] text-zinc-200" />
                    </div>
                  </motion.div>
                )}

                {/* 4. Rejected Animation (Subtle collision shake in red) */}
                {animPhase === 'rejected' && (
                  <motion.div
                    animate={{ x: [-8, 8, -6, 6, -3, 3, 0] }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center justify-center gap-2"
                  >
                    {chars.map((ch, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-13 sm:w-11 sm:h-14 rounded-xl border border-rose-900/80 bg-rose-950/40 text-rose-300 text-lg sm:text-xl font-mono font-bold flex items-center justify-center"
                      >
                        {ch}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-rose-400 font-mono"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Bottom Actions: "Get Key" with CreditCard icon and Cancel */}
              <div className="pt-2 border-t border-zinc-900 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    navigate('/settings?tab=plans');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 text-black text-xs font-bold font-mono tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <CreditCard size={15} className="text-zinc-800" />
                  <span>Get Key</span>
                </button>

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={animPhase === 'revolving' || animPhase === 'merged'}
                    className="py-3 px-5 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 active:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
