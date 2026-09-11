import React, { useState, useEffect, useContext } from 'react';
import { 
  Monitor, Info, Volume2, ArrowLeft, Key, ShieldCheck, 
  Sun, Tv, Play, VolumeX, MessageSquarePlus, Laptop,
  Building2, CheckCircle2, HelpCircle, Eye, RefreshCw, ExternalLink, Globe
} from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { LicenseModal } from '@shared/components/ui/LicenseModal';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';
import { useNavigate } from 'react-router-dom';
import { LicenseContext } from '../app/App';
import { db } from '../shared/config/firebase';
import type { FeedbackItem } from '../shared/config/firebase';
import { ref, onValue } from 'firebase/database';

export const applyDisplayTuning = (contrast: number, brightness: number, sharpness: number) => {
  if (contrast === 100 && brightness === 100 && sharpness === 100) {
    document.documentElement.style.filter = 'none';
  } else {
    document.documentElement.style.filter = `contrast(${contrast}%) brightness(${brightness}%) saturate(${sharpness}%)`;
  }
  localStorage.setItem('flowtrace_display_tuning', JSON.stringify({ contrast, brightness, saturate: sharpness }));
};

type SettingTab = 'display' | 'voice' | 'licensing' | 'feedback' | 'about';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const licenseContext = useContext(LicenseContext);
  const { hasUpdate, latestVersion, currentVersion, checkNow, isChecking } = useUpdateChecker();

  // Dynamic version state
  const [displayVersion, setDisplayVersion] = useState(currentVersion);

  useEffect(() => {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      import('@tauri-apps/api/app').then(({ getVersion }) => {
        getVersion().then(v => {
          if (v) setDisplayVersion(v);
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }, []);

  // Tab 1 (Default: Classroom Display)
  const [activeTab, setActiveTab] = useState<SettingTab>('display');

  // Display Tuning States (Sharpness replaces Saturation)
  const [contrastVal, setContrastVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).contrast || 100; } catch (e) { console.error(e); }
    }
    return 100;
  });
  const [brightnessVal, setBrightnessVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).brightness || 100; } catch (e) { console.error(e); }
    }
    return 100;
  });
  const [sharpnessVal, setSharpnessVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).saturate || 100; } catch (e) { console.error(e); }
    }
    return 100;
  });
  const [activePreset, setActivePreset] = useState<'default' | 'projector' | 'smartboard' | 'daylight'>('default');

  // Activation & Modal states
  const [showChangeKeyInput, setShowChangeKeyInput] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [policyDoc, setPolicyDoc] = useState<'privacy' | 'terms' | null>(null);
  const [checkToast, setCheckToast] = useState<string | null>(null);

  // Voice States
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(
    () => localStorage.getItem('treadcode_voice_enabled') === 'true'
  );
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedEnVoice, setSelectedEnVoice] = useState<string>(
    () => localStorage.getItem('flowtrace_voice_en') || ''
  );
  const [selectedHiVoice, setSelectedHiVoice] = useState<string>(
    () => localStorage.getItem('flowtrace_voice_hi') || ''
  );
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);

  const toggleVoiceMode = () => {
    setIsVoiceModeEnabled(prev => {
      const next = !prev;
      localStorage.setItem('treadcode_voice_enabled', String(next));
      return next;
    });
  };

  // Feedback Submissions Real-Time Listener
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const feedbackRef = ref(db, 'feedbacks');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: FeedbackItem[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setFeedbackList(items);
      } else {
        setFeedbackList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load Display Tuning filter on mount
  useEffect(() => {
    applyDisplayTuning(contrastVal, brightnessVal, sharpnessVal);
  }, [contrastVal, brightnessVal, sharpnessVal]);

  const handleTuneChange = (c: number, b: number, s: number, preset: 'default' | 'projector' | 'smartboard' | 'daylight' = 'default') => {
    setContrastVal(c);
    setBrightnessVal(b);
    setSharpnessVal(s);
    setActivePreset(preset);
    applyDisplayTuning(c, b, s);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        if (!selectedEnVoice) {
          const liam = voices.find(v => v.name.includes('Liam')) ||
                       voices.find(v => v.name.includes('Google US English')) ||
                       voices.find(v => v.lang.includes('en-US')) ||
                       voices.find(v => v.lang.includes('en'));
          if (liam) setSelectedEnVoice(liam.name);
        }

        if (!selectedHiVoice) {
          const emily = voices.find(v => v.name.includes('Emily')) ||
                        voices.find(v => v.lang.includes('hi')) ||
                        voices.find(v => v.name.toLowerCase().includes('hindi'));
          if (emily) setSelectedHiVoice(emily.name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedEnVoice, selectedHiVoice]);

  const handleEnVoiceChange = (voiceName: string) => {
    setSelectedEnVoice(voiceName);
    localStorage.setItem('flowtrace_voice_en', voiceName);
  };

  const handleHiVoiceChange = (voiceName: string) => {
    setSelectedHiVoice(voiceName);
    localStorage.setItem('flowtrace_voice_hi', voiceName);
  };

  const playTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlayingTestAudio) {
      setIsPlayingTestAudio(false);
      return;
    }

    const text = "Hello! TreadCode is ready for your classroom presentation.";
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = availableVoices.find(v => v.name === selectedEnVoice) || availableVoices[0];
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsPlayingTestAudio(true);
    utterance.onend = () => setIsPlayingTestAudio(false);
    utterance.onerror = () => setIsPlayingTestAudio(false);

    window.speechSynthesis.speak(utterance);
  };



  const rawKey = localStorage.getItem('flowtrace_license_key') || '';
  const maskedKey = rawKey 
    ? (rawKey.length <= 6 ? `${rawKey.slice(0, 2)}****` : `${rawKey.slice(0, 4)}-****-****-${rawKey.slice(-4)}`) 
    : 'No License Active';

  // ORDER: 1. Display & Projection, 2. Voice & Audio, 3. License & Device, 4. Feedback, 5. About & Updates
  const navTabs = [
    { id: 'display', label: 'Display & Projection', icon: Monitor, iconColor: 'text-indigo-400', badge: activePreset !== 'default' ? 'Tuned' : undefined },
    { id: 'voice', label: 'Voice & Audio', icon: Volume2, iconColor: 'text-amber-400' },
    { id: 'licensing', label: 'License & Device', icon: Key, iconColor: 'text-emerald-400', badge: licenseContext?.activated ? 'Active' : 'Unregistered' },
    { id: 'feedback', label: 'Feedback & Reports', icon: MessageSquarePlus, iconColor: 'text-sky-400' },
    { id: 'about', label: 'About & Updates', icon: Info, iconColor: 'text-purple-400', badge: hasUpdate ? 'Update Ready' : undefined },
  ];

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full bg-[#050510]">
      <div className="flex flex-col py-8 md:py-10 px-4 md:px-8 max-w-6xl mx-auto w-full min-h-full">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Settings
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                v{displayVersion}
              </span>

              {/* Web Cloud Edition Link */}
              <button
                onClick={async () => {
                  const webUrl = "https://tread-code-smoky.vercel.app/";
                  try {
                    const { open } = await import('@tauri-apps/plugin-shell');
                    await open(webUrl);
                  } catch (err) {
                    window.open(webUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer border ${
                  hasUpdate
                    ? 'bg-indigo-900/60 hover:bg-indigo-900 border-indigo-400/60 text-indigo-200'
                    : 'bg-indigo-950/50 hover:bg-indigo-900/80 border-indigo-500/30 text-indigo-300 hover:text-white'
                }`}
                title={hasUpdate ? `Try Latest Release v${latestVersion} Instantly on Web` : "Open TreadCode Web Cloud Edition"}
              >
                <Globe size={13} className="text-indigo-400" />
                <span>{hasUpdate ? `Try v${latestVersion} Web` : "Launch Cloud Edition"}</span>
                <ExternalLink size={11} />
              </button>
            </div>
            <p className="text-slate-400 text-sm">
              Configure display contrast for projectors, voice output, code font size, and license keys.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all shadow-md shrink-0 self-start md:self-auto cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Visualizer</span>
          </button>
        </motion.div>

        {/* Update Banner */}
        {hasUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <RefreshCw size={18} className="text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">Software Update Available</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold">
                    v{latestVersion}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  A new release of TreadCode is ready to install with visualizer enhancements.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span>Update Now (v{latestVersion})</span>
            </button>
          </motion.div>
        )}

        {/* Main 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6">
          
          {/* Left Navigation Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-2 bg-[#090b15] border border-white/10 rounded-2xl p-3 backdrop-blur-xl">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 px-3 py-2">
              SETTINGS
            </span>

            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingTab)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-xs font-bold text-left cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-white' : tab.iconColor} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : tab.badge === 'Update Ready' 
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Classroom Tip Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] text-slate-300 font-mono space-y-1.5 shadow-md">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <HelpCircle size={13} />
                <span>Classroom Tip</span>
              </div>
              <p className="leading-relaxed">
                Use <strong className="text-white">Classroom Projector</strong> preset when presenting on high-lumens smartboards to boost node visibility.
              </p>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: DISPLAY & PROJECTION */}
              {activeTab === 'display' && (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#090b15] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Monitor size={18} className="text-indigo-400" />
                      <span>Classroom & Projector Display Tuning</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Boost contrast, brightness, and color saturation for projectors, smartboards, and daylight classrooms.
                    </p>
                  </div>

                  {/* Presets Grid with Rich Colors & High Contrast */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 block">
                      Presentation Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      
                      {/* Standard Dark */}
                      <button
                        onClick={() => handleTuneChange(100, 100, 100, 'default')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'default'
                            ? 'border-indigo-500 bg-indigo-950/80 text-white shadow-lg ring-2 ring-indigo-500/40 shadow-indigo-500/25'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          activePreset === 'default' ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-500/15 text-indigo-400'
                        }`}>
                          <Monitor size={18} />
                        </div>
                        <span className="font-extrabold text-white">Standard Dark</span>
                        <span className="text-[10px] font-mono text-indigo-300/80 font-medium">True Color · 100%</span>
                      </button>

                      {/* Classroom Projector */}
                      <button
                        onClick={() => handleTuneChange(140, 120, 130, 'projector')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'projector'
                            ? 'border-sky-500 bg-sky-950/80 text-white shadow-lg ring-2 ring-sky-500/40 shadow-sky-500/25'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-sky-500/40 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          activePreset === 'projector' ? 'bg-sky-500/30 text-sky-300' : 'bg-sky-500/15 text-sky-400'
                        }`}>
                          <Tv size={18} />
                        </div>
                        <span className="font-extrabold text-white">Classroom Projector</span>
                        <span className="text-[10px] font-mono text-sky-300/80 font-medium">Boosted · 130% Sat</span>
                      </button>

                      {/* High Contrast */}
                      <button
                        onClick={() => handleTuneChange(125, 110, 150, 'smartboard')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'smartboard'
                            ? 'border-purple-500 bg-purple-950/80 text-white shadow-lg ring-2 ring-purple-500/40 shadow-purple-500/25'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          activePreset === 'smartboard' ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-500/15 text-purple-400'
                        }`}>
                          <Eye size={18} />
                        </div>
                        <span className="font-extrabold text-white">High Contrast</span>
                        <span className="text-[10px] font-mono text-purple-300/80 font-medium">Vivid · 150% Sat</span>
                      </button>

                      {/* Daylight Visibility */}
                      <button
                        onClick={() => handleTuneChange(160, 130, 140, 'daylight')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'daylight'
                            ? 'border-amber-500 bg-amber-950/80 text-white shadow-lg ring-2 ring-amber-500/40 shadow-amber-500/25'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-amber-500/40 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          activePreset === 'daylight' ? 'bg-amber-500/30 text-amber-300' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          <Sun size={18} />
                        </div>
                        <span className="font-extrabold text-white">Daylight Visibility</span>
                        <span className="text-[10px] font-mono text-amber-300/80 font-medium">Bright · 140% Sat</span>
                      </button>

                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Screen Contrast</span>
                        <span className="text-[11px] text-slate-400">Level: {contrastVal}%</span>
                      </div>
                      <input
                        type="range"
                        min={80}
                        max={180}
                        step={5}
                        value={contrastVal}
                        onChange={e => handleTuneChange(Number(e.target.value), brightnessVal, sharpnessVal, 'default')}
                        className="w-44 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Screen Brightness</span>
                        <span className="text-[11px] text-slate-400">Level: {brightnessVal}%</span>
                      </div>
                      <input
                        type="range"
                        min={80}
                        max={150}
                        step={5}
                        value={brightnessVal}
                        onChange={e => handleTuneChange(contrastVal, Number(e.target.value), sharpnessVal, 'default')}
                        className="w-44 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Eye size={14} className="text-indigo-400" />
                          <span>Color Vividness & Saturation</span>
                        </span>
                        <span className="text-[11px] text-slate-400">Level: {sharpnessVal}%</span>
                      </div>
                      <input
                        type="range"
                        min={80}
                        max={180}
                        step={5}
                        value={sharpnessVal}
                        onChange={e => handleTuneChange(contrastVal, brightnessVal, Number(e.target.value), 'default')}
                        className="w-44 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        {activePreset === 'default' ? 'Standard Dark (True native gamut)' : `Active Preset: ${activePreset}`}
                      </span>
                      <button
                        onClick={() => handleTuneChange(100, 100, 100, 'default')}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20"
                      >
                        Reset to Standard Dark
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 2: VOICE & AUDIO */}
              {activeTab === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#090b15] border border-white/10 rounded-2xl p-6 space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Volume2 size={18} className="text-amber-400" />
                      <span>Voice & Narration</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure speech voices for English and Hindi step-by-step narration.
                    </p>
                  </div>

                  {/* Narration Toggle */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-xs font-bold text-white block">Audio Narration</span>
                      <span className="text-[11px] text-slate-400">
                        Show the voice toggle icon in the explanation bar during execution.
                      </span>
                    </div>

                    <button
                      onClick={toggleVoiceMode}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isVoiceModeEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isVoiceModeEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Audio Test Bar */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-xs font-bold text-white block">Speaker Test</span>
                      <span className="text-[11px] text-slate-400">Play a sample sentence to test the selected voice.</span>
                    </div>

                    <button
                      onClick={playTestVoice}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isPlayingTestAudio
                          ? 'bg-rose-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      {isPlayingTestAudio ? <VolumeX size={14} /> : <Play size={14} />}
                      <span>{isPlayingTestAudio ? 'Stop' : 'Test Voice'}</span>
                    </button>
                  </div>

                  {/* Voice Selectors */}
                  <div className="space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-slate-900/60 border border-white/10 shadow-md">
                      <div>
                        <span className="text-xs font-bold text-white block">English Voice</span>
                        <span className="text-[11px] text-slate-400">Default speaker for English explanation lines.</span>
                      </div>
                      <select
                        value={selectedEnVoice}
                        onChange={e => handleEnVoiceChange(e.target.value)}
                        className="bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 max-w-60 cursor-pointer"
                      >
                        {availableVoices
                          .filter(v => v.lang.includes('en'))
                          .map(v => (
                            <option key={v.name} value={v.name}>
                              {v.name} ({v.lang})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-slate-900/60 border border-white/10 shadow-md">
                      <div>
                        <span className="text-xs font-bold text-white block">Hindi Voice</span>
                        <span className="text-[11px] text-slate-400">Default speaker for Hindi explanation lines.</span>
                      </div>
                      <select
                        value={selectedHiVoice}
                        onChange={e => handleHiVoiceChange(e.target.value)}
                        className="bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 max-w-60 cursor-pointer"
                      >
                        {availableVoices
                          .filter(v => v.lang.includes('hi') || v.lang.includes('en'))
                          .map(v => (
                            <option key={v.name} value={v.name}>
                              {v.name} ({v.lang})
                            </option>
                          ))}
                      </select>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 3: LICENSE & DEVICE */}
              {activeTab === 'licensing' && (
                <motion.div
                  key="licensing"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#090b15] border border-white/10 rounded-2xl p-6 space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Key size={18} className="text-emerald-400" />
                      <span>License & Device Binding</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage your institutional license key, seat allocation, and device hardware signature.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    licenseContext?.activated
                      ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg'
                      : 'bg-rose-950/40 border-rose-500/40 shadow-lg'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        licenseContext?.activated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            {licenseContext?.activated ? 'Verified License Active' : 'Unregistered Software'}
                          </span>
                          {licenseContext?.licenseDetails?.tier && (
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-[10px] font-black uppercase">
                              {licenseContext.licenseDetails.tier} EDITION
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {licenseContext?.activated ? 'Full unlimited access to all algorithm visualizers.' : 'Please enter your institutional license key to unlock features.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowChangeKeyInput(true)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer"
                    >
                      {licenseContext?.activated ? 'Change Key' : 'Activate License'}
                    </button>
                  </div>

                  {/* Institution Co-Branding */}
                  {licenseContext?.licenseDetails?.customBranding?.institutionName && (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center gap-3">
                      <Building2 size={20} className="text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">INSTITUTION LICENSE</span>
                        <span className="text-sm font-bold text-amber-200">
                          {licenseContext.licenseDetails.customBranding.institutionName}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* License Key Box (Protected / Non-Copyable) */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2 shadow-md select-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider font-bold">License Key</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Protected</span>
                      </div>
                      <div className="flex items-center justify-between bg-black/70 border border-white/10 rounded-lg px-3 py-2.5">
                        <span className="font-mono text-xs text-white font-semibold tracking-wider select-none pointer-events-none">{maskedKey}</span>
                        <ShieldCheck size={14} className="text-indigo-400/70 shrink-0" />
                      </div>
                    </div>

                    {/* HWID Hardware Signature Box (Protected / Non-Copyable) */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2 shadow-md select-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Device ID (HWID)</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Non-Exportable</span>
                      </div>
                      <div className="flex items-center justify-between bg-black/70 border border-white/10 rounded-lg px-3 py-2.5">
                        <span className="font-mono text-xs text-slate-300 truncate max-w-44 select-none pointer-events-none">{licenseContext?.hwid || 'N/A'}</span>
                        <ShieldCheck size={14} className="text-emerald-400/70 shrink-0" />
                      </div>
                    </div>

                  </div>

                  {/* Seat Capacity Progress */}
                  {licenseContext?.activated && (
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2 shadow-md">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">Registered Devices</span>
                        <span className="text-indigo-300 font-bold">
                          {licenseContext.licenseDetails.activeDevicesCount || 1} / {licenseContext.licenseDetails.maxDevices || 1} Registered
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                        <div 
                          className="bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, ((licenseContext.licenseDetails.activeDevicesCount || 1) / (licenseContext.licenseDetails.maxDevices || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: FEEDBACK & REPORTS */}
              {activeTab === 'feedback' && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#090b15] border border-white/10 rounded-2xl p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <MessageSquarePlus className="text-indigo-400" size={20} />
                        <span>Feedback & Diagnostic Reports</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Submitted bug reports, feature suggestions, and system telemetry.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                      {feedbackList.length} Submissions
                    </span>
                  </div>

                  {feedbackList.length === 0 ? (
                    <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-2xl bg-slate-950/40 flex flex-col items-center justify-center gap-2">
                      <MessageSquarePlus size={32} className="text-slate-600 mb-1" />
                      <p className="text-xs font-bold text-slate-400">No Feedback Submitted Yet</p>
                      <p className="text-[11px] text-slate-600">Submissions from the floating feedback tool will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbackList.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3 shadow-lg hover:border-indigo-500/30 transition-all"
                        >
                          {/* Card Top Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                item.category === 'bug'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : item.category === 'feature'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              }`}>
                                {item.category === 'bug' ? 'Bug Report' : item.category === 'feature' ? 'Feature Request' : 'Feedback'}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                              Key: {item.systemDetails?.licenseKey || 'N/A'}
                            </span>
                          </div>

                          {/* Message Body */}
                          <p className="text-xs font-medium text-slate-200 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed whitespace-pre-wrap">
                            "{item.message}"
                          </p>

                          {/* System Diagnostic Spec Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-slate-400">
                            <div className="p-2 rounded-lg bg-white/2 border border-white/5 flex items-center gap-1.5 truncate">
                              <Laptop size={12} className="text-slate-500 shrink-0" />
                              <span className="truncate">{item.systemDetails?.platform || 'Unknown OS'}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white/2 border border-white/5 flex items-center gap-1.5 truncate">
                              <span className="text-slate-500 font-bold shrink-0">Res:</span>
                              <span className="truncate">{item.systemDetails?.screenResolution || 'N/A'}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white/2 border border-white/5 flex items-center gap-1.5 truncate">
                              <Globe size={12} className="text-slate-500 shrink-0" />
                              <span className="truncate">{item.systemDetails?.language || 'en'}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white/2 border border-white/5 flex items-center gap-1.5 truncate" title={item.systemDetails?.userAgent}>
                              <span className="text-slate-500 font-bold shrink-0">Agent:</span>
                              <span className="truncate">{item.systemDetails?.userAgent ? item.systemDetails.userAgent.slice(0, 20) + '...' : 'Browser'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: ABOUT & UPDATES */}
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#090b15] border border-white/10 rounded-2xl p-6 space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Info size={18} className="text-purple-400" />
                      <span>About & Updates</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Software version information, release updates, and legal policies.
                    </p>
                  </div>

                  {/* Software Version Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col gap-4 shadow-md">
                    {/* Top Row */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <Monitor size={18} className="text-indigo-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Installed Software Version</span>
                          <span className="text-xs font-mono font-semibold text-slate-300">TreadCode Desktop v{displayVersion}</span>
                        </div>
                      </div>

                      {hasUpdate ? (
                        <button
                          onClick={() => setShowPreviewModal(true)}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                        >
                          <RefreshCw size={13} />
                          <span>Update Ready (v{latestVersion})</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 size={13} />
                          <span>Up to Date</span>
                        </span>
                      )}
                    </div>

                    {/* Channels & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-[11px] font-mono text-slate-400 font-medium">Update Channels:</span>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={async () => {
                            setCheckToast("Checking server for updates...");
                            await checkNow();
                            setTimeout(() => {
                              setCheckToast(null);
                            }, 4000);
                          }}
                          disabled={isChecking}
                          className="px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Check server for updates"
                        >
                          <RefreshCw size={13} className={isChecking ? "animate-spin text-indigo-400" : "text-indigo-400"} />
                          <span>{isChecking ? "Checking..." : "Check Updates"}</span>
                        </button>

                        <button
                          onClick={async () => {
                            const exeUrl = 'https://tread-code-smoky.vercel.app/releases/TreadCode_latest_x64-setup.exe';
                            try {
                              const { open } = await import('@tauri-apps/plugin-shell');
                              await open(exeUrl);
                            } catch (err) {
                              window.open(exeUrl, '_blank');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/60 text-sky-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Direct installer link"
                        >
                          <Monitor size={13} className="text-sky-400" />
                          <span>Direct .exe Link</span>
                        </button>

                        <button
                          onClick={async () => {
                            const webUrl = 'https://tread-code-smoky.vercel.app/';
                            try {
                              const { open } = await import('@tauri-apps/plugin-shell');
                              await open(webUrl);
                            } catch (err) {
                              window.open(webUrl, '_blank');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Open web edition"
                        >
                          <Globe size={13} className="text-purple-400" />
                          <span>Open Web App</span>
                          <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Status Feedback Toast */}
                    {checkToast && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] font-mono px-3.5 py-2 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 flex items-center gap-2 mt-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{hasUpdate ? `Update Available: Version v${latestVersion} is ready to install.` : `Server Checked: You are running the latest version (v${displayVersion}).`}</span>
                      </motion.div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    TreadCode is an animation-first code visualizer & algorithm teaching platform designed for faculty, professors, school computer labs, BCA, DCA, and B.Tech classrooms.
                  </p>

                  {/* Intellectual Property & Licensing Card */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2.5 shadow-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <ShieldCheck size={16} className="text-purple-400 shrink-0" />
                      <span className="text-xs font-bold text-white">Intellectual Property & Licensing</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 space-y-1 leading-relaxed">
                      <p className="text-white font-medium">
                        Copyright (c) July 23, 2026 – Present Prince (prince19112003). All Rights Reserved.
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        Repository Initial Commit: July 23, 2026 at 01:11:21 +0530 (IST)
                      </p>
                      <p className="text-amber-300/90 text-[10px] pt-0.5">
                        Licensed under Proprietary EULA. Unauthorized copying, decompilation, or distribution is strictly prohibited.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setPolicyDoc('privacy')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                    <span className="text-slate-700">•</span>
                    <button
                      onClick={() => setPolicyDoc('terms')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Terms of Service
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Settings Footer */}
          <footer className="md:col-span-12 mt-6 pt-4 pb-2 border-t border-slate-800/80 text-center shrink-0 space-y-1">
            <p className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-medium">
              Copyright © July 23, 2026 – Present Prince (prince19112003) · All Rights Reserved
            </p>
            <p className="text-[10px] font-mono tracking-wider text-slate-400">
              Licensed under Proprietary EULA · Unauthorized copying, decompilation, or distribution is strictly prohibited
            </p>
          </footer>

        </div>
      </div>

      {/* Dynamic Privacy Policy / Terms Modal */}
      {policyDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            style={{ background: 'rgba(10, 11, 18, 0.95)' }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">
              {policyDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h2>
            
            <div className="text-xs text-slate-400 space-y-3 leading-relaxed mb-6">
              {policyDoc === 'privacy' ? (
                <>
                  <p className="font-semibold text-slate-200">Last updated: August 2026</p>
                  <p>At TreadCode, we take your privacy seriously. This Privacy Policy details how we process user data within the desktop application.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">1. Information Collection</h3>
                  <p>We do not collect personal identify information. The app reads your network hardware interface signature (HWID) purely to bind license key credentials securely on our licensing server database.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">2. Licensing Data Protection</h3>
                  <p>All verification requests are processed securely using standard secure database nodes. No usage history, code scripts, or execution flows are tracked or stored externally.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-200">Last updated: August 2026</p>
                  <p>By using the TreadCode visualizer platform, you agree to comply with these terms.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">1. Software License</h3>
                  <p>TreadCode grants you a non-exclusive, non-transferable internal license to access the algorithm visualization platform according to the limits authorized by your institution.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">2. Hardware Key Binding</h3>
                  <p>Each license key is securely bound to the hardware signature of the target system. Sharing verification keys beyond the designated limits will result in key blockage.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setPolicyDoc(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Accept & Close
            </button>
          </motion.div>
        </div>
      )}


      {showPreviewModal && (
        <UpdateModal forceShow={true} onClosePreview={() => setShowPreviewModal(false)} />
      )}

      {showChangeKeyInput && licenseContext && (
        <LicenseModal
          onActivate={licenseContext.handleActivate}
          onClose={() => setShowChangeKeyInput(false)}
        />
      )}
    </PageTransition>
  );
};
