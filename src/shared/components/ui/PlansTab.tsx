import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  X, Laptop, Send, Clock
} from 'lucide-react';
import { Codicon } from './Codicon';
import { LicenseContext } from '@app/App';
import { submitKeyRequest } from '@shared/config/firebase';
import { useThemeStore } from '@shared/hooks/useThemeStore';

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

const PRICING_DATA: Record<string, Record<PlanDuration, { price: string; originalPrice?: string; period: string; monthly?: string; savings?: string }>> = {
  community: {
    '1m': { price: '₹0', period: '/ Free Forever' },
    '3m': { price: '₹0', period: '/ Free Forever' },
    '6m': { price: '₹0', period: '/ Free Forever' },
    '1y': { price: '₹0', period: '/ Free Forever' },
  },
  professional: {
    '1m': { price: '₹69', originalPrice: '₹99', period: '/ 1 Month', monthly: '₹69 / mo' },
    '3m': { price: '₹179', originalPrice: '₹249', period: '/ 3 Months', monthly: '~₹59 / mo', savings: 'Save 15%' },
    '6m': { price: '₹299', originalPrice: '₹399', period: '/ 6 Months', monthly: '~₹49 / mo', savings: 'Save 28%' },
    '1y': { price: '₹499', originalPrice: '₹799', period: '/ 1 Year', monthly: '~₹41 / mo', savings: 'Save 40% • Best Value' },
  },
  enterprise: {
    '1m': { price: '₹99', originalPrice: '₹149', period: '/ 1 Month', monthly: '₹99 / mo' },
    '3m': { price: '₹249', originalPrice: '₹349', period: '/ 3 Months', monthly: '~₹83 / mo', savings: 'Save 16%' },
    '6m': { price: '₹449', originalPrice: '₹599', period: '/ 6 Months', monthly: '~₹74 / mo', savings: 'Save 25%' },
    '1y': { price: '₹699', originalPrice: '₹999', period: '/ 1 Year', monthly: '~₹58 / mo', savings: 'Save 41% • Best Value' },
  },
};

const BASE_TIERS = [
  {
    id: 'community' as const,
    name: 'Community',
    features: [
      'Python Visualizer (100+ programs)',
      'Interactive SmartBoard canvas',
      'Step-by-step code stepper',
      'Single device (Free forever)',
    ],
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    features: [
      'Everything in Community',
      'Up to 6 devices supported',
      'C, C++ & Java visualizers',
      'Complete DSA Suite (Trees, Graphs)',
      'Memory & pointer inspector',
    ],
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise',
    features: [
      'Everything in Professional',
      'Up to 20 devices supported',
      'Machine Learning & Neural Nets',
      'Computer Networks & Packet Flow',
      'Lab offline batch deployment',
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
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

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

  const isTierOwned = (tierId: string) => {
    if (tierId === 'community' || tierId === 'free') return true;
    if (!licenseContext?.activated) return false;
    if (activeTier === tierId) return true;
    if (tierId === 'professional' && (activeTier === 'professional' || activeTier === 'developer' || activeTier === 'standard')) {
      return true;
    }
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
      <div
        className="rounded-lg p-6 transition-colors"
        style={{
          background: isLight ? '#ffffff' : '#0b0d13',
          border: `1px solid ${isLight ? '#cbd5e1' : '#1e2433'}`,
          boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
        }}
      >
        {/* Minimal Clean Header */}
        <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-3" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
          <div className="flex items-center gap-2.5">
            <Codicon name="credit-card" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
            <h2 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Plans & Access
            </h2>
          </div>

          {/* Duration Selector Pill with Smooth Sliding Microanimation */}
          <div
            className="inline-flex p-1 rounded-lg gap-1 select-none border relative"
            style={{
              background: isLight ? '#f1f5f9' : '#151923',
              borderColor: isLight ? '#e2e8f0' : '#252e40',
            }}
          >
            {DURATION_OPTIONS.map(opt => {
              const isSelected = selectedDuration === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedDuration(opt.id)}
                  className={`relative px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200 flex items-center gap-1.5 cursor-pointer z-10 ${
                    isSelected
                      ? isLight ? 'text-slate-900' : 'text-white'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeDurationPill"
                      className={`absolute inset-0 rounded-md border shadow-xs -z-10 ${
                        isLight
                          ? 'bg-white border-slate-200/80 shadow-slate-200/50'
                          : 'bg-[#222938] border-slate-600/40 shadow-black/40'
                      }`}
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>{opt.label}</span>
                  {opt.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[3px] font-bold ${
                      isSelected
                        ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                        : isLight ? 'bg-slate-200/70 text-slate-700' : 'bg-white/10 text-slate-300'
                    }`}>
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Day Desktop Trial Active Banner */}
        {!licenseContext?.activated && licenseContext?.trialInfo?.isTrialActive && (
          <div
            className="mt-4 p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
            style={{
              background: isLight ? '#fffbeb' : '#14120a',
              borderColor: isLight ? '#fde68a' : '#3a2e16',
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border ${
                isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}>
                <Clock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>
                    3-Day Desktop Trial Active
                  </span>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {licenseContext.trialInfo.daysRemaining > 0 
                      ? `${licenseContext.trialInfo.daysRemaining} Days Left`
                      : `${licenseContext.trialInfo.hoursRemaining} Hours Left`}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  All 287 programs across all 7 domains unlocked. Select a plan below for permanent access.
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-semibold shrink-0 self-start sm:self-auto border ${
              isLight ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              Trial Active
            </span>
          </div>
        )}

        {/* Purchased Key Status Banner - Clean, Minimal & Uncluttered */}
        {licenseContext?.activated && (
          <div
            className="mt-4 px-4 py-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            style={{
              background: isLight ? '#f8fafc' : '#0f121a',
              borderColor: isLight ? '#e2e8f0' : '#1e2433',
            }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {licenseContext.licenseDetails?.tier || 'VIP Pass'} Edition
              </span>
              <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded border ${
                isLight ? 'bg-white border-slate-300 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
                {maskedKey}
              </span>
              {licenseContext.licenseDetails?.customBranding?.institutionName && (
                <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  · {licenseContext.licenseDetails.customBranding.institutionName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Expires {expiryDateFormatted}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                Active
              </span>
            </div>
          </div>
        )}

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 items-stretch">
          {BASE_TIERS.map(tier => {
            const isOwned = isTierOwned(tier.id);
            const pricing = PRICING_DATA[tier.id][selectedDuration];
            const isPro = tier.id === 'professional';

            return (
              <div
                key={tier.id}
                className="flex flex-col justify-between rounded-lg p-4 sm:p-5 border transition-all duration-200 relative"
                style={{
                  background: isLight ? '#f8fafc' : '#0f121a',
                  borderColor: isPro
                    ? (isLight ? '#3b82f6' : '#2563eb')
                    : (isLight ? '#cbd5e1' : '#1e2433'),
                  boxShadow: isPro ? (isLight ? '0 2px 8px 0 rgba(59, 130, 246, 0.12)' : '0 2px 8px 0 rgba(0, 0, 0, 0.4)') : 'none',
                }}
              >
                <div>
                  <div className="text-center mb-1">
                    <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {tier.name}
                    </h3>
                  </div>

                  <div className="my-4 py-3.5 border-y text-center" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                    {pricing.originalPrice ? (
                      <div className={`text-xs font-mono line-through mb-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {pricing.originalPrice}
                      </div>
                    ) : (
                      <div className="text-xs font-mono opacity-0 mb-0.5 select-none">-</div>
                    )}

                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className={`text-4xl font-extrabold tracking-tight font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {pricing.price}
                      </span>
                      {pricing.period && (
                        <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {pricing.period}
                        </span>
                      )}
                    </div>

                    <div className={`text-[11px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {pricing.monthly ? `Effective ${pricing.monthly}` : 'Always Free'}
                    </div>
                  </div>

                  <ul className={`space-y-2 mb-6 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className={`shrink-0 mt-0.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div>
                  {isOwned ? (
                    <div className={`w-full py-2 rounded-md text-xs font-semibold text-center border select-none ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-[#151923] border-[#252e40] text-slate-500'
                    }`}>
                      Current Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenRequest(tier.id, tier.name)}
                      className={`w-full py-2 px-4 rounded-md text-xs font-bold tracking-wide transition-all border cursor-pointer ${
                        tier.id === 'enterprise'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
                          : isPro
                          ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
                          : isLight
                          ? 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300 shadow-xs'
                          : 'bg-[#1a202c] hover:bg-[#222a3a] text-white border-[#2d3748]'
                      }`}
                    >
                      {tier.id === 'enterprise' ? 'Request Enterprise' : 'Select Plan'}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="rounded-lg p-6 max-w-md w-full shadow-xl relative border"
              style={{
                background: isLight ? '#ffffff' : '#0b0d13',
                borderColor: isLight ? '#cbd5e1' : '#1e2433',
              }}
            >
              <button
                onClick={() => setSelectedTier(null)}
                className={`absolute top-4 right-4 p-1 rounded-md cursor-pointer transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-[#151923]'
                }`}
              >
                <X size={16} />
              </button>

              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center mx-auto border ${
                    isLight ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    <Check size={20} />
                  </div>
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Request Received</h3>
                  <p className={`text-xs leading-relaxed max-w-xs mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Logged request for <strong className={isLight ? 'text-slate-900' : 'text-white'}>{selectedTier.name}</strong> ({selectedTier.price} {selectedTier.period}).
                  </p>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Activation key will be delivered to <span className={isLight ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold'}>{email}</span>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedTier(null)}
                      className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mb-1 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      Request Activation Key
                    </span>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <span>{selectedTier.name}</span>
                      <span className={`text-sm font-mono font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        ({selectedTier.price} {selectedTier.period})
                      </span>
                    </h3>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Selected Duration: <strong className={isLight ? 'text-slate-800' : 'text-white'}>{selectedTier.durationLabel}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRequest} className="space-y-3">
                    <div>
                      <label className={`text-xs font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-xs outline-none focus:border-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-[#151923] border-[#252e40] text-white placeholder-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-xs font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Email or WhatsApp Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. student@college.edu or 9876543210"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-xs outline-none focus:border-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-[#151923] border-[#252e40] text-white placeholder-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-xs font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>College / Institution (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. IIT Delhi or Personal"
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-xs outline-none focus:border-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-[#151923] border-[#252e40] text-white placeholder-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-xs font-medium block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        UPI UTR / Transaction ID <span className="text-amber-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 12-digit UPI UTR / Transaction Reference"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-xs outline-none focus:border-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-[#151923] border-[#252e40] text-white placeholder-slate-500'
                        }`}
                      />
                    </div>

                    <div className={`flex items-center justify-between text-xs border rounded-md px-3 py-2 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#151923] border-[#252e40] text-slate-400'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <Laptop size={13} />
                        Device HWID
                      </span>
                      <span className={`font-mono font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                        {hwid ? `${hwid.slice(0, 16)}...` : 'Auto-detected'}
                      </span>
                    </div>

                    {submitError && (
                      <p className="text-xs text-rose-500 font-medium">{submitError}</p>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <Send size={12} />
                        <span>{submitting ? 'Submitting...' : `Submit Request (${selectedTier.price})`}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTier(null)}
                        className={`px-4 py-2 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
                          isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-[#151923] border-[#252e40] text-slate-300 hover:bg-[#1a202c]'
                        }`}
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
