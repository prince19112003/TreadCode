import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import {
  Send, Check, AlertCircle, HelpCircle, Bug, Lightbulb,
  Clock, ShieldCheck, Laptop
} from 'lucide-react';
import { Codicon } from './Codicon';
import { LicenseContext } from '@app/App';
import { submitFeedback, type FeedbackItem, db } from '@shared/config/firebase';
import { ref, onValue } from 'firebase/database';
import { useThemeStore } from '@shared/hooks/useThemeStore';

type TicketCategory = 'complaint' | 'query' | 'bug' | 'feature';

const CATEGORIES: { id: TicketCategory; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'complaint', label: 'Complaint', icon: AlertCircle },
  { id: 'query', label: 'Query & Help', icon: HelpCircle },
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb },
];

const PRESET_QUERIES: Record<TicketCategory, { label: string; text: string }[]> = {
  complaint: [
    { label: 'License Activation Failing', text: 'My license key is failing to activate on this machine. Please verify key status or reset binding.' },
    { label: 'Device Limit Exceeded', text: 'I am getting a device limit exceeded error and need to reset or unbind older devices.' },
    { label: 'Payment Done, Key Pending', text: 'I completed the UPI payment and submitted my request, but have not received my activation key yet.' },
    { label: 'Modules Locked After Update', text: 'My course modules were unlocked earlier, but are currently showing locked.' },
  ],
  query: [
    { label: 'Transfer to Another PC', text: 'How do I transfer my active license from this computer to another device?' },
    { label: 'Offline Course Packs', text: 'How can I download and unpack the offline course packs for air-gapped lab computers?' },
    { label: 'DSA Syllabus Coverage', text: 'Which data structures and algorithms are visualized in the Professional/Enterprise tier?' },
    { label: 'Projector / SmartBoard Setup', text: 'How do I tune display settings and calibrate SmartBoard overlays for classroom projectors?' },
  ],
  bug: [
    { label: 'Stepper Frozen', text: 'The code execution stepper is frozen on this program and does not advance to the next line.' },
    { label: 'Hindi Audio Issue', text: 'The Hindi audio voice explanation is not speaking or cuts off midway.' },
    { label: 'High CPU / Memory Spike', text: 'Noticeable CPU or memory spike occurs during recursion or large array visualizations.' },
  ],
  feature: [
    { label: 'New Language Support', text: 'I would like to request visualization support for Rust / Go / SQL databases.' },
    { label: 'Additional Algorithm', text: 'Please add visualization support for AVL Trees, Red-Black Trees, and A* Pathfinding.' },
  ],
};

export const FeedbackTab: React.FC = () => {
  const licenseContext = useContext(LicenseContext);
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  const [activeSubTab, setActiveSubTab] = useState<'submit' | 'history'>('submit');

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>('complaint');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tickets List State
  const [tickets, setTickets] = useState<FeedbackItem[]>([]);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const hwid = licenseContext?.hwid || 'N/A';
  const isActivated = Boolean(licenseContext?.activated);
  const activeKey = isActivated ? (licenseContext?.licenseDetails?.licenseKey || localStorage.getItem('flowtrace_license_key') || '') : '';
  const activeTier = isActivated ? (licenseContext?.licenseDetails?.tier || 'community') : 'community';

  const tierDisplayName = activeTier === 'community' || activeTier === 'free'
    ? 'Community'
    : activeTier === 'professional' || activeTier === 'developer'
    ? 'Professional'
    : activeTier === 'enterprise' || activeTier === 'ultimate'
    ? 'Enterprise'
    : activeTier;

  // Listen to feedbacks in real time
  useEffect(() => {
    const feedbackRef = ref(db, 'feedbacks');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: FeedbackItem[] = Object.keys(data)
          .map(k => ({ id: k, ...data[k] }))
          .filter(item => {
            if (item.hwid && item.hwid === hwid) return true;
            if (activeKey && item.systemDetails?.licenseKey === activeKey) return true;
            return false;
          })
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTickets(items);
      } else {
        setTickets([]);
      }
    });

    return () => unsubscribe();
  }, [hwid, activeKey]);

  const handleSelectPreset = (preset: { label: string; text: string }) => {
    setSubject(preset.label);
    setMessage(preset.text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setSubmitError('Please enter a description for your ticket.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const success = await submitFeedback({
      category: selectedCategory,
      subject: subject.trim() || undefined,
      message: message.trim(),
      hwid,
      systemDetails: {
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'Windows',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Desktop',
        screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
        language: typeof navigator !== 'undefined' ? navigator.language : 'en',
        licenseKey: activeKey || undefined,
        tier: tierDisplayName,
      },
    });

    setSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveSubTab('history');
      }, 1500);
    } else {
      setSubmitError('Failed to send ticket. Please check your internet connection.');
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (ticketFilter === 'all') return true;
    return t.status === ticketFilter;
  });

  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const pendingCount = tickets.filter(t => t.status === 'pending').length;

  return (
    <motion.div
      key="feedback-tab"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg p-5 sm:p-6 space-y-5 border transition-colors"
      style={{
        background: isLight ? '#ffffff' : '#0b0d13',
        borderColor: isLight ? '#cbd5e1' : '#1e2433',
        boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
      }}
    >
      {/* Clean Minimal Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
        <div>
          <h2 className={`text-base font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Codicon name="feedback" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
            <span>Support & Feedback</span>
          </h2>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Submit a query, report an issue, or track status.
          </p>
        </div>

        {/* Minimal Sub-tab Switcher */}
        <div className={`flex items-center p-0.5 rounded-md border text-xs ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#151923] border-[#252e40]'
        }`}>
          <button
            type="button"
            onClick={() => setActiveSubTab('submit')}
            className={`px-3 py-1 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'submit'
                ? isLight ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'bg-[#222938] text-white shadow-xs border border-slate-600/40'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            New Ticket
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1 rounded-[4px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? isLight ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'bg-[#222938] text-white shadow-xs border border-slate-600/40'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>My Tickets</span>
            {tickets.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : isLight ? 'bg-slate-200 text-slate-700' : 'bg-[#252e40] text-slate-300'
              }`}>
                {tickets.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === 'submit' ? (
        /* ── CLEAN MINIMAL SUBMIT FORM ───────────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Category Chips */}
          <div>
            <span className={`text-xs font-medium block mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSubject('');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border ${
                      isSelected
                        ? isLight
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-blue-950/40 border-blue-500/50 text-blue-300 font-semibold'
                        : isLight
                        ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        : 'bg-[#151923] border-[#252e40] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? (isLight ? 'text-blue-600' : 'text-blue-400') : (isLight ? 'text-slate-400' : 'text-slate-500')} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Quick Suggestions */}
          <div>
            <span className={`text-xs font-medium block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUERIES[selectedCategory].map((preset, idx) => {
                const isChosen = subject === preset.label;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer border ${
                      isChosen
                        ? isLight
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-medium'
                          : 'bg-blue-950/40 border-blue-500/50 text-blue-300 font-medium'
                        : isLight
                        ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        : 'bg-[#151923] border-[#252e40] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Subject */}
          <div>
            <label className={`text-xs font-medium block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Subject <span className={`font-normal ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Brief summary..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-xs outline-none focus:border-blue-500 ${
                isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-[#151923] border-[#252e40] text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* 4. Description */}
          <div>
            <label className={`text-xs font-medium block mb-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Description <span className="text-amber-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your issue or query..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className={`w-full border rounded-md p-3 text-xs outline-none focus:border-blue-500 leading-relaxed resize-none ${
                isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-[#151923] border-[#252e40] text-white placeholder-slate-500'
              }`}
            />
          </div>

          {/* Feedback banners */}
          {submitError && (
            <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 p-2.5 rounded-md">
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Ticket submitted successfully! Opening tickets...</span>
            </div>
          )}

          {/* 5. Minimal Bottom Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="flex items-center gap-1.5">
                <Laptop size={13} />
                <span className="font-mono">{hwid.slice(0, 10)}...</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span className={isLight ? 'text-emerald-700 font-medium' : 'text-emerald-400 font-medium'}>{tierDisplayName}</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Send size={13} />
              <span>{submitting ? 'Submitting...' : 'Submit Ticket'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* ── MY TICKETS & RESOLUTIONS ───────────────────────────── */
        <div className="space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className={`flex items-center p-0.5 rounded-md border text-xs ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#151923] border-[#252e40]'
            }`}>
              <button
                type="button"
                onClick={() => setTicketFilter('all')}
                className={`px-2.5 py-1 rounded-[4px] text-xs cursor-pointer ${
                  ticketFilter === 'all'
                    ? isLight ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'bg-[#222938] text-white font-semibold shadow-xs'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilter('pending')}
                className={`px-2.5 py-1 rounded-[4px] text-xs cursor-pointer ${
                  ticketFilter === 'pending'
                    ? isLight ? 'bg-white text-amber-700 font-semibold shadow-xs' : 'bg-[#222938] text-amber-300 font-semibold shadow-xs'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilter('resolved')}
                className={`px-2.5 py-1 rounded-[4px] text-xs cursor-pointer ${
                  ticketFilter === 'resolved'
                    ? isLight ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'bg-[#222938] text-emerald-300 font-semibold shadow-xs'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('submit')}
              className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors border ${
                isLight ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-blue-950/40 border-blue-500/30 text-blue-300 hover:bg-blue-900/50'
              }`}
            >
              + New Ticket
            </button>
          </div>

          {filteredTickets.length === 0 ? (
            <div className={`py-12 text-center border border-dashed rounded-lg flex flex-col items-center justify-center gap-1.5 ${
              isLight ? 'border-slate-300 bg-slate-50' : 'border-[#252e40] bg-[#151923]/40'
            }`}>
              <Clock size={22} className={isLight ? 'text-slate-400' : 'text-slate-500'} />
              <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>No Tickets Found</p>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                {ticketFilter === 'all'
                  ? 'No support tickets submitted yet.'
                  : `No ${ticketFilter} tickets.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map(item => {
                const isResolved = item.status === 'resolved';
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border transition-all space-y-2.5"
                    style={{
                      background: isLight ? '#ffffff' : '#0f121a',
                      borderColor: isLight ? (isResolved ? '#bbf7d0' : '#e2e8f0') : (isResolved ? '#1e3825' : '#1e2433'),
                    }}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          item.category === 'complaint'
                            ? isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : item.category === 'query'
                            ? isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                            : item.category === 'bug'
                            ? isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}>
                          {item.category}
                        </span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          isResolved
                            ? isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          {isResolved ? 'Resolved' : 'Under Review'}
                        </span>

                        <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      {item.systemDetails?.tier && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#151923] text-emerald-400 border-emerald-800/30'
                        }`}>
                          {item.systemDetails.tier}
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    {item.subject && (
                      <h4 className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {item.subject}
                      </h4>
                    )}

                    {/* Message */}
                    <p className={`text-xs p-2.5 rounded-md border leading-relaxed whitespace-pre-wrap ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#151923] border-[#252e40] text-slate-300'
                    }`}>
                      {item.message}
                    </p>

                    {/* Admin Reply */}
                    {item.adminReply ? (
                      <div className={`p-3 rounded-md border text-xs space-y-1 ${
                        isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/30 border-emerald-500/30'
                      }`}>
                        <div className={`flex items-center justify-between text-xs font-semibold ${
                          isLight ? 'text-emerald-800' : 'text-emerald-400'
                        }`}>
                          <span className="flex items-center gap-1">
                            <Check size={12} />
                            Admin Resolution
                          </span>
                          {item.resolvedAt && (
                            <span className={`text-[10px] font-normal ${isLight ? 'text-emerald-600' : 'text-emerald-400/70'}`}>
                              {new Date(item.resolvedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className={`whitespace-pre-wrap leading-relaxed text-xs ${
                          isLight ? 'text-emerald-900' : 'text-emerald-100'
                        }`}>
                          {item.adminReply}
                        </p>
                      </div>
                    ) : (
                      <p className={`text-xs italic ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        Awaiting review...
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

