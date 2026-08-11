import React, { useState, useEffect, useContext } from 'react';
import { 
  Monitor, Info, Volume2, ArrowLeft, Key, ShieldCheck, Copy, Check, 
  Sun, Tv, Sparkles, Play, VolumeX, 
  Building2, CheckCircle2, HelpCircle, Eye, RefreshCw
} from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { LicenseModal } from '@shared/components/ui/LicenseModal';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';
import { useNavigate } from 'react-router-dom';
import { LicenseContext } from '../app/App';

export const applyDisplayTuning = (contrast: number, brightness: number, sharpness: number) => {
  const filterStr = `contrast(${contrast}%) brightness(${brightness}%) saturate(${sharpness}%)`;
  document.documentElement.style.filter = filterStr;
  localStorage.setItem('flowtrace_display_tuning', JSON.stringify({ contrast, brightness, saturate: sharpness }));
};

type SettingTab = 'display' | 'voice' | 'licensing' | 'about';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const licenseContext = useContext(LicenseContext);
  const { hasUpdate, latestVersion, currentVersion } = useUpdateChecker();

  // Dynamic version state
  const [displayVersion, setDisplayVersion] = useState(currentVersion);

  useEffect(() => {
    if (currentVersion) {
      setDisplayVersion(currentVersion);
    }
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      import('@tauri-apps/api/app').then(({ getVersion }) => {
        getVersion().then(v => {
          if (v) setDisplayVersion(v);
        });
      }).catch(() => {});
    }
  }, [currentVersion]);

  // Tab 1 (Default: Classroom Display)
  const [activeTab, setActiveTab] = useState<SettingTab>('display');

  // Display Tuning States (Sharpness replaces Saturation)
  const [contrastVal, setContrastVal] = useState(100);
  const [brightnessVal, setBrightnessVal] = useState(100);
  const [sharpnessVal, setSharpnessVal] = useState(100);
  const [activePreset, setActivePreset] = useState<'default' | 'projector' | 'smartboard' | 'daylight'>('default');

  // Copy & Activation states
  const [copiedHwid, setCopiedHwid] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showChangeKeyInput, setShowChangeKeyInput] = useState(false);

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

  // Modals
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [policyDoc, setPolicyDoc] = useState<'privacy' | 'terms' | null>(null);

  // Load Display Tuning on mount
  useEffect(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try {
        const { contrast, brightness, saturate } = JSON.parse(saved);
        setContrastVal(contrast || 100);
        setBrightnessVal(brightness || 100);
        setSharpnessVal(saturate || 100);
        applyDisplayTuning(contrast || 100, brightness || 100, saturate || 100);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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

  const copyToClipboard = (text: string, type: 'hwid' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'hwid') {
      setCopiedHwid(true);
      setTimeout(() => setCopiedHwid(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const rawKey = localStorage.getItem('flowtrace_license_key') || '';
  const maskedKey = rawKey 
    ? (rawKey.length <= 6 ? `${rawKey.slice(0, 2)}****` : `${rawKey.slice(0, 4)}-****-****-${rawKey.slice(-4)}`) 
    : 'No License Active';

  // ORDER: 1. Classroom Display, 2. AI Voice, 3. Licensing & Tier, 4. About & Updates
  const navTabs = [
    { id: 'display', label: 'Classroom Display', icon: Monitor, badge: activePreset !== 'default' ? 'Tuned' : undefined },
    { id: 'voice', label: 'AI Voice & Audio', icon: Volume2 },
    { id: 'licensing', label: 'Licensing & Tier', icon: Key, badge: licenseContext?.activated ? 'Active' : 'Unregistered' },
    { id: 'about', label: 'About & Updates', icon: Info, badge: hasUpdate ? 'Update Ready' : undefined },
  ];

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full bg-[#050510]">
      <div className="flex flex-col py-8 md:py-10 px-4 md:px-8 max-w-6xl mx-auto w-full min-h-full">

        {/* ── Page Header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Settings & Classroom Setup
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                v{displayVersion}
              </span>
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

        {/* ── Persistent Update Banner Row (Shows until user updates!) ── */}
        {hasUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-linear-to-r from-rose-950/80 via-indigo-950/80 to-purple-950/80 border border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <Sparkles size={20} className="text-rose-400 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">Software Update Available</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                    v{latestVersion}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  A new TreadCode release is ready. Update to receive latest algorithm visualizer features and bug fixes.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 bg-linear-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all shrink-0 cursor-pointer flex items-center gap-2 animate-pulse"
            >
              <RefreshCw size={14} />
              <span>Update Now (v{latestVersion})</span>
            </button>
          </motion.div>
        )}

        {/* ── Main 2-Column Dashboard Layout ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12">
          
          {/* Left Tab Navigation Sidebar (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-2 bg-[#090b15] border border-white/10 rounded-2xl p-3 backdrop-blur-xl">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 px-3 py-2">
              NAVIGATION
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
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : tab.badge === 'Update Ready' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Smartboard Tip Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <HelpCircle size={13} />
                <span>Classroom Tip</span>
              </div>
              <p className="leading-relaxed">
                Use <strong className="text-slate-200">Classroom Projector</strong> preset when presenting on high-lumens smartboards to boost node visibility.
              </p>
            </div>
          </div>

          {/* Right Content Panel (8 cols) */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: CLASSROOM DISPLAY TUNING */}
              {activeTab === 'display' && (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#090b15] border border-white/10 rounded-2xl p-6 space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Monitor size={18} className="text-indigo-400" />
                      <span>Classroom & Projector Display Tuning</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Boost contrast, brightness, and sharpness for projectors, smartboards, and daylight classrooms.
                    </p>
                  </div>

                  {/* Presets Grid with Boosted Presets */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 block">
                      📺 Faculty Presentation Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      
                      <button
                        onClick={() => handleTuneChange(100, 100, 100, 'default')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'default'
                            ? 'border-indigo-500 bg-indigo-950/80 text-white shadow-lg ring-2 ring-indigo-500/40'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Monitor size={20} className="text-indigo-400" />
                        <span>Studio Dark</span>
                      </button>

                      <button
                        onClick={() => handleTuneChange(140, 120, 130, 'projector')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'projector'
                            ? 'border-indigo-500 bg-indigo-950/80 text-white shadow-lg ring-2 ring-indigo-500/40'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Tv size={20} className="text-sky-400" />
                        <span>Classroom Projector</span>
                      </button>

                      <button
                        onClick={() => handleTuneChange(125, 110, 150, 'smartboard')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'smartboard'
                            ? 'border-indigo-500 bg-indigo-950/80 text-white shadow-lg ring-2 ring-indigo-500/40'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles size={20} className="text-purple-400" />
                        <span>Smartboard Neon</span>
                      </button>

                      <button
                        onClick={() => handleTuneChange(160, 130, 140, 'daylight')}
                        className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          activePreset === 'daylight'
                            ? 'border-indigo-500 bg-indigo-950/80 text-white shadow-lg ring-2 ring-indigo-500/40'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sun size={20} className="text-amber-400" />
                        <span>Daylight Visibility</span>
                      </button>

                    </div>
                  </div>

                  {/* Sliders (Sharpness replaces Saturation) */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Contrast Level</span>
                        <span className="text-[11px] text-slate-400">Current: {contrastVal}%</span>
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
                        <span className="text-xs font-bold text-white block">Brightness Level</span>
                        <span className="text-[11px] text-slate-400">Current: {brightnessVal}%</span>
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
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Eye size={13} className="text-indigo-400" />
                          <span>Clarity & Sharpness</span>
                        </span>
                        <span className="text-[11px] text-slate-400">Current: {sharpnessVal}%</span>
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

                  </div>
                </motion.div>
              )}

              {/* TAB 2: AI VOICE & AUDIO */}
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
                      <span>AI Audio & Voice Configuration</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose TTS speech synthesis voices for step-by-step English and Hindi audio narration.
                    </p>
                  </div>

                  {/* Voice Mode Main Enable Switch */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Enable Voice Explanation Mode</span>
                      <span className="text-[11px] text-slate-400">
                        When enabled, the Voice toggle icon will appear in the explanation bar during execution.
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
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Audio Speaker Test</span>
                      <span className="text-[11px] text-slate-400">Listen to a sample audio explanation sentence.</span>
                    </div>

                    <button
                      onClick={playTestVoice}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isPlayingTestAudio
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      {isPlayingTestAudio ? <VolumeX size={14} /> : <Play size={14} />}
                      <span>{isPlayingTestAudio ? 'Stop Testing' : 'Test Audio'}</span>
                    </button>
                  </div>

                  {/* Speaker Selectors */}
                  <div className="space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block">English Voice Speaker</span>
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

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block">Hindi / Hinglish Voice Speaker</span>
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



              {/* TAB 4: LICENSING & TIER (Moved above About & Updates) */}
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
                      <span>Licensing & Account Verification</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage your TreadCode system license key, device bindings, and institutional tier.
                    </p>
                  </div>

                  {/* Status Card Banner */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    licenseContext?.activated
                      ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-rose-950/40 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
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
                          {licenseContext?.activated ? 'Full unlimited access to all algorithms & flowchart generators.' : 'Please enter your institutional license key to unlock features.'}
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
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">INSTITUTION LICENSE BINDING</span>
                        <span className="text-sm font-bold text-amber-200">
                          {licenseContext.licenseDetails.customBranding.institutionName}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* License Key Box */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Registered License Serial</span>
                      <div className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-3 py-2">
                        <span className="font-mono text-xs text-slate-200">{maskedKey}</span>
                        {licenseContext?.activated && (
                          <button
                            onClick={() => copyToClipboard(rawKey, 'key')}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Copy License Key"
                          >
                            {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* HWID Hardware Signature Box */}
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">System HWID Signature</span>
                      <div className="flex items-center justify-between bg-black/60 border border-slate-800 rounded-lg px-3 py-2">
                        <span className="font-mono text-xs text-slate-300 truncate max-w-40">{licenseContext?.hwid || 'N/A'}</span>
                        <button
                          onClick={() => copyToClipboard(licenseContext?.hwid || '', 'hwid')}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title="Copy HWID"
                        >
                          {copiedHwid ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Seat Capacity Progress */}
                  {licenseContext?.activated && (
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Device Seat Capacity</span>
                        <span className="text-indigo-300 font-bold">
                          {licenseContext.licenseDetails.activeDevicesCount || 1} / {licenseContext.licenseDetails.maxDevices || 1} Registered
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((licenseContext.licenseDetails.activeDevicesCount || 1) / (licenseContext.licenseDetails.maxDevices || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: ABOUT & UPDATES (TreadCode branding) */}
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
                      <span>About TreadCode & Updates</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Software version information, release updates, and legal privacy policies.
                    </p>
                  </div>

                  {/* Software Version Card */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Installed Version</span>
                      <span className="text-[11px] text-slate-400">TreadCode v{displayVersion}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasUpdate ? (
                        <button
                          onClick={() => setShowPreviewModal(true)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 bg-rose-500 hover:bg-rose-600 text-white animate-pulse cursor-pointer"
                        >
                          Update Ready (v{latestVersion}) 🚀
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 size={13} />
                          Up to Date
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    TreadCode is an animation-first code visualizer & algorithm teaching platform designed for faculty, professors, school computer labs, BCA, DCA, and B.Tech classrooms.
                  </p>

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
