import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'motion/react';
import {
  Send, Check, AlertCircle, HelpCircle, Bug, Lightbulb,
  MessageSquare, Clock, ShieldCheck, Laptop
} from 'lucide-react';
import { LicenseContext } from '@app/App';
import { submitFeedback, type FeedbackItem, db } from '@shared/config/firebase';
import { ref, onValue } from 'firebase/database';

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

  // Format tier name for display
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
      className="bg-[#090b15]/90 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5"
    >
      {/* Clean Minimal Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare size={17} className="text-sky-400 shrink-0" />
            <span>Support Desk</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Submit a query, report an issue, or track status.
          </p>
        </div>

        {/* Minimal Sub-tab Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-black/50 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('submit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSubTab === 'submit'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Ticket
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-sky-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>My Tickets</span>
            {tickets.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeSubTab === 'history' ? 'bg-white/25 text-white' : 'bg-sky-500/20 text-sky-300'
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
            <span className="text-[11px] font-medium text-slate-400 block mb-2">
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/20 border border-sky-400/60 text-sky-200 font-semibold shadow-sm shadow-sky-500/10'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-sky-400' : 'text-slate-400'} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Quick Suggestions */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      isChosen
                        ? 'bg-sky-500/25 border border-sky-400/60 text-sky-200 font-medium'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
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
            <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Subject <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Brief summary..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400/80 transition-colors"
            />
          </div>

          {/* 4. Description */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Description <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your issue or query..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400/80 leading-relaxed resize-none transition-colors"
            />
          </div>

          {/* Feedback banners */}
          {submitError && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl">
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check size={14} className="text-emerald-400 shrink-0" />
              <span>Ticket submitted successfully! Opening tickets...</span>
            </div>
          )}

          {/* 5. Minimal Bottom Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Laptop size={12} className="text-slate-500" />
                <span className="font-mono text-slate-400">{hwid.slice(0, 10)}...</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-emerald-300">{tierDisplayName}</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
            <div className="flex items-center p-0.5 rounded-xl bg-black/50 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setTicketFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer ${
                  ticketFilter === 'all' ? 'bg-white text-black font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer ${
                  ticketFilter === 'pending' ? 'bg-amber-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setTicketFilter('resolved')}
                className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer ${
                  ticketFilter === 'resolved' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('submit')}
              className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-medium cursor-pointer"
            >
              + New Ticket
            </button>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-black/30 flex flex-col items-center justify-center gap-1.5">
              <Clock size={24} className="text-slate-500 mb-1" />
              <p className="text-xs font-semibold text-slate-300">No Tickets Found</p>
              <p className="text-[11px] text-slate-500">
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
                    className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                      isResolved
                        ? 'bg-black/40 border-emerald-500/30'
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          item.category === 'complaint'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : item.category === 'query'
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : item.category === 'bug'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}>
                          {item.category}
                        </span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          isResolved
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          {isResolved ? 'Resolved' : 'Under Review'}
                        </span>

                        <span className="text-[10px] text-slate-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      {item.systemDetails?.tier && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded">
                          {item.systemDetails.tier}
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    {item.subject && (
                      <h4 className="text-xs font-semibold text-white">
                        {item.subject}
                      </h4>
                    )}

                    {/* Message */}
                    <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </p>

                    {/* Admin Reply */}
                    {item.adminReply ? (
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                          <span className="flex items-center gap-1">
                            <Check size={12} />
                            Admin Resolution
                          </span>
                          {item.resolvedAt && (
                            <span className="text-[10px] text-emerald-400/70 font-normal">
                              {new Date(item.resolvedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-100 whitespace-pre-wrap leading-relaxed text-xs">
                          {item.adminReply}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
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
