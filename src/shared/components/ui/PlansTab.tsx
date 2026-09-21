import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, CreditCard, ShieldCheck,
  X, Laptop, Send, Clock
} from 'lucide-react';
import { LicenseContext } from '@app/App';
import { submitKeyRequest } from '@shared/config/firebase';

export type PlanDuration = '1m' | '3m' | '6m' | '1y';

interface DurationOption {
  id: PlanDuration;
  label: string;
  badge?: string;
}

const DURATION_OPTIONS: DurationOption[] = [
  { id: '1m', label: '1 Month' },
  { id: '3m', label: '3 Months', badge: 'Save 15%' },
  { id: '6m', label: '6 Months', badge: 'Save 28%' },
  { id: '1y', label: '1 Year', badge: 'Save 40%' },
];

const PRICING_DATA: Record<string, Record<PlanDuration, { price: string; period: string; monthly?: string; savings?: string }>> = {
  community: {
    '1m': { price: '₹0', period: '/ Free Forever' },
    '3m': { price: '₹0', period: '/ Free Forever' },
    '6m': { price: '₹0', period: '/ Free Forever' },
    '1y': { price: '₹0', period: '/ Free Forever' },
  },
  professional: {
    '1m': { price: '₹69', period: '/ 1 Month', monthly: '₹69 / mo' },
    '3m': { price: '₹179', period: '/ 3 Months', monthly: '~₹59 / mo', savings: 'Save 15%' },
    '6m': { price: '₹299', period: '/ 6 Months', monthly: '~₹49 / mo', savings: 'Save 28%' },
    '1y': { price: '₹499', period: '/ 1 Year', monthly: '~₹41 / mo', savings: 'Save 40% • Best Value' },
  },
  enterprise: {
    '1m': { price: '₹99', period: '/ 1 Month', monthly: '₹99 / mo' },
    '3m': { price: '₹249', period: '/ 3 Months', monthly: '~₹83 / mo', savings: 'Save 16%' },
    '6m': { price: '₹449', period: '/ 6 Months', monthly: '~₹74 / mo', savings: 'Save 25%' },
    '1y': { price: '₹699', period: '/ 1 Year', monthly: '~₹58 / mo', savings: 'Save 41% • Best Value' },
  },
};

const BASE_TIERS = [
  {
    id: 'community' as const,
    name: 'Community',
    features: [
      'Python Visualizer (100+ Programs)',
      'Interactive SmartBoard Canvas',
      'Step-by-Step Code Stepper',
      'Single Device (Free Forever)',
    ],
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    features: [
      'Everything in Community',
      'Up to 6 Devices / PCs Supported',
      'C, C++ & Java Visualizers',
      'Complete DSA Suite (Trees, Graphs)',
      'Dynamic Memory & Pointer Tracing',
      'Offline Storage Packs',
    ],
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise',
    features: [
      'Everything in Professional',
      'Up to 20 Devices / PCs Supported',
      'Machine Learning Lab & Neural Nets',
      'Computer Networks & Packet Flow',
      'Advanced Algorithms & Custom Visualizers',
      'Classroom Display & Projector Calibration',
      'Full Offline Module Packs',
      'Priority Module Updates',
    ],
  },
];

interface SelectedTierInfo {
  id: 'community' | 'professional' | 'enterprise';
  name: string;
  price: string;
  period: string;
  durationLabel: string;
}

export const PlansTab: React.FC = () => {
  const licenseContext = useContext(LicenseContext);
  const [selectedDuration, setSelectedDuration] = useState<PlanDuration>('1m');
  const [selectedTier, setSelectedTier] = useState<SelectedTierInfo | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hwid = licenseContext?.hwid || 'N/A';
  const isActivated = Boolean(licenseContext?.activated);
  const rawKey = isActivated ? (licenseContext?.licenseDetails?.licenseKey || '') : '';
  const maskedKey = isActivated && rawKey
    ? (rawKey.length <= 6 ? `${rawKey.slice(0, 2)}****` : `${rawKey.slice(0, 4)}-****-****-${rawKey.slice(-4)}`)
    : '';

  const activeTier = isActivated
    ? (licenseContext?.licenseDetails?.tier?.toLowerCase() || '')
    : '';

  // Determine if a tier is active/owned (supports both new & legacy tier names)
  const isTierOwned = (tierId: string) => {
    if (tierId === 'community' || tierId === 'free') return true;
    if (!licenseContext?.activated) return false;
    
    // Exact match
    if (activeTier === tierId) return true;

    // Professional tier aliases
    if (tierId === 'professional' && (activeTier === 'professional' || activeTier === 'developer' || activeTier === 'standard')) {
      return true;
    }

    // Enterprise / Ultimate / Custom unlocks everything
    if (activeTier === 'enterprise' || activeTier === 'ultimate') return true;
    if (activeTier && !['professional', 'developer', 'standard', 'community', 'free'].includes(activeTier)) {
      return true;
    }

    return false;
  };

  const expiryDateFormatted = useMemo(() => {
    const rawExpires = isActivated ? licenseContext?.licenseDetails?.expiresAt : undefined;
    if (rawExpires) {
      try {
        const d = new Date(rawExpires);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      } catch {}
    }
    return 'Lifetime';
  }, [isActivated, licenseContext?.licenseDetails?.expiresAt]);

  const handleOpenRequest = (tierId: 'community' | 'professional' | 'enterprise', tierName: string) => {
    if (tierId === 'community' || isTierOwned(tierId)) return;
    const pricing = PRICING_DATA[tierId][selectedDuration];
    const durationOpt = DURATION_OPTIONS.find(d => d.id === selectedDuration);
    setSelectedTier({
      id: tierId,
      name: tierName,
      price: pricing.price,
      period: pricing.period,
      durationLabel: durationOpt?.label || '1 Month',
    });
    setMessage('');
    setSubmitted(false);
    setSubmitError(null);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || !selectedTier) {
      setSubmitError('Please fill in all mandatory fields (Name, Email/WhatsApp, UPI UTR).');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const success = await submitKeyRequest({
      name: name.trim(),
      email: email.trim(),
      tier: selectedTier.id,
      tierName: selectedTier.name,
      price: selectedTier.price,
      duration: selectedTier.durationLabel,
      hwid,
      college: college.trim() || undefined,
      note: message.trim() || undefined,
    });

    setSubmitting(false);

    if (success) {
      setSubmitted(true);
    } else {
      setSubmitError('Unable to send request online. Please verify connection.');
    }
  };

  return (
    <motion.div
      key="plans"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="bg-[#090b15] border border-white/10 rounded-2xl p-6 shadow-xl">
        {/* Minimal Clean Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <CreditCard size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white font-mono">Plans & Access</h2>
          </div>

          {/* Duration Selector Pill */}
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 gap-1 select-none">
            {DURATION_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedDuration(opt.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDuration === opt.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{opt.label}</span>
                {opt.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-extrabold ${
                    selectedDuration === opt.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {opt.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Day Keyless Desktop Trial Active Banner (if active & not paid key) */}
        {!licenseContext?.activated && licenseContext?.trialInfo?.isTrialActive && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-amber-950/60 via-slate-900/80 to-amber-950/40 border border-amber-500/40 shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                <Clock size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 uppercase tracking-wider">
                    3-DAY DESKTOP TRIAL ACTIVE
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {licenseContext.trialInfo.daysRemaining > 0 
                      ? `${licenseContext.trialInfo.daysRemaining} Days Left`
                      : `${licenseContext.trialInfo.hoursRemaining} Hours Left`}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-300 mt-1.5">
                  All 287 programs across all 7 domains unlocked on this PC. Select any plan below to lock in uninterrupted access.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto shadow-sm">
              Trial Active
            </span>
          </div>
        )}

        {/* Purchased Key Status Banner (if active) */}
        {licenseContext?.activated && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-950/70 via-slate-900/90 to-indigo-950/40 border border-emerald-500/40 shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/40 uppercase tracking-wider">
                    {licenseContext.licenseDetails?.tier || 'ACTIVE'} EDITION
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-200 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    {maskedKey || 'ACTIVE'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400 mt-1.5">
                  {licenseContext.licenseDetails?.customBranding?.institutionName && (
                    <span>Licensed to: <span className="text-white font-semibold">{licenseContext.licenseDetails.customBranding.institutionName}</span></span>
                  )}
                  <span>HWID: <span className="text-cyan-300 font-medium">{hwid}</span></span>
                  <span>Expires: <span className="text-emerald-300 font-semibold">{expiryDateFormatted}</span></span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto shadow-sm">
              Active
            </span>
          </div>
        )}

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 items-stretch">
          {BASE_TIERS.map(tier => {
            const isOwned = isTierOwned(tier.id);
            const pricing = PRICING_DATA[tier.id][selectedDuration];

            return (
              <div
                key={tier.id}
                className="flex flex-col justify-between rounded-2xl p-5 bg-white/2 border border-white/10 hover:border-white/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-white font-mono">{tier.name}</h3>
                    {pricing.savings && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold shrink-0">
                        {pricing.savings}
                      </span>
                    )}
                  </div>

                  <div className="my-3 pt-3 border-t border-white/5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white font-mono">{pricing.price}</span>
                      {pricing.period && (
                        <span className="text-xs font-mono text-slate-400">{pricing.period}</span>
                      )}
                    </div>
                    {pricing.monthly && (
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Effective rate: <span className="text-slate-200 font-medium">{pricing.monthly}</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6 text-xs text-slate-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={13} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div>
                  {isOwned ? (
                    <div className="w-full py-2.5 rounded-xl text-xs font-mono font-medium text-center text-slate-500 bg-white/5 border border-white/5 cursor-default select-none">
                      Owned
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenRequest(tier.id, tier.name)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wide transition-all bg-white/10 hover:bg-white/15 text-white border border-white/15 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Request Plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Request Modal Dialog */}
      <AnimatePresence>
        {selectedTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0b0e1b] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedTier(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X size={16} />
              </button>

              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h3 className="text-lg font-black text-white font-mono">Request Received</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto font-mono">
                    Logged request for <strong className="text-white">{selectedTier.name}</strong> ({selectedTier.price} {selectedTier.period}).
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Activation key will be delivered to <span className="text-indigo-300">{email}</span>.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => setSelectedTier(null)}
                      className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Request Activation Key
                    </span>
                    <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                      <span>{selectedTier.name}</span>
                      <span className="text-sm font-mono text-emerald-400 font-semibold">({selectedTier.price} {selectedTier.period})</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Selected Duration: <span className="text-white font-bold">{selectedTier.durationLabel}</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRequest} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-300 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-300 block mb-1">Email or WhatsApp Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. student@college.edu or 9876543210"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-300 block mb-1">College / Institution (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Delhi or Personal"
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-300 block mb-1">
                        UPI UTR / Transaction ID <span className="text-amber-400 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 12-digit UPI UTR / Transaction Reference"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Laptop size={12} />
                        Device HWID
                      </span>
                      <span className="text-slate-300 font-bold font-mono">
                        {hwid ? `${hwid.slice(0, 16)}...` : 'Auto-detected'}
                      </span>
                    </div>

                    {submitError && (
                      <p className="text-xs text-rose-400 font-mono">{submitError}</p>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold font-mono tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                      >
                        <Send size={12} />
                        <span>{submitting ? 'Submitting...' : `Submit Request (${selectedTier.price})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier(null)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
