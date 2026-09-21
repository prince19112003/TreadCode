import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Codicon } from '@shared/components/ui/Codicon';
import { ExtensionsTab } from '@shared/components/ui/ExtensionsTab';
import { PlansTab } from '@shared/components/ui/PlansTab';
import { FeedbackTab } from '@shared/components/ui/FeedbackTab';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion, AnimatePresence } from 'motion/react';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { LicenseModal } from '@shared/components/ui/LicenseModal';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';
import { useNavigate, useLocation } from 'react-router-dom';
import { LicenseContext } from '../app/App';
import { unlinkDeviceFromLicense } from '../shared/config/firebase';

export const applyDisplayTuning = (contrast: number, brightness: number, sharpness: number) => {
  if (contrast === 100 && brightness === 100 && sharpness === 100) {
    document.documentElement.style.filter = 'none';
  } else {
    document.documentElement.style.filter = `contrast(${contrast}%) brightness(${brightness}%) saturate(${sharpness}%)`;
  }
  localStorage.setItem('flowtrace_display_tuning', JSON.stringify({ contrast, brightness, saturate: sharpness }));
};

type SettingTab = 'display' | 'voice' | 'licensing' | 'feedback' | 'about' | 'extensions' | 'plans';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const licenseContext = useContext(LicenseContext);
  const { hasUpdate, latestVersion, currentVersion, checkNow, isChecking, downloadUrl } = useUpdateChecker();

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

  // Tab initialization (respects ?tab= query parameter, e.g. /settings?tab=plans)
  const [activeTab, setActiveTab] = useState<SettingTab>(() => {
    if (typeof window !== 'undefined') {
      const paramTab = new URLSearchParams(window.location.search).get('tab');
      if (paramTab && ['display', 'voice', 'licensing', 'feedback', 'about', 'extensions', 'plans'].includes(paramTab)) {
        return paramTab as SettingTab;
      }
    }
    return 'display';
  });

  useEffect(() => {
    const paramTab = new URLSearchParams(location.search).get('tab');
    if (paramTab && ['display', 'voice', 'licensing', 'feedback', 'about', 'extensions', 'plans'].includes(paramTab)) {
      setActiveTab(paramTab as SettingTab);
    }
  }, [location.search]);

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
  const [showDevicesList, setShowDevicesList] = useState(false);
  const [unlinkingHwid, setUnlinkingHwid] = useState<string | null>(null);

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



  const isActivated = Boolean(licenseContext?.activated);
  const activeKeyStr = isActivated 
    ? (licenseContext?.licenseDetails?.licenseKey || localStorage.getItem('flowtrace_license_key') || '')
    : '';
  const maskedKey = isActivated && activeKeyStr 
    ? (activeKeyStr.length <= 6 ? `${activeKeyStr.slice(0, 2)}****` : `${activeKeyStr.slice(0, 4)}-****-****-${activeKeyStr.slice(-4)}`) 
    : 'No Active License';

  const rawExpiry = isActivated ? licenseContext?.licenseDetails?.expiresAt : undefined;
  const formattedExpiry = useMemo(() => {
    if (!rawExpiry) return 'Perpetual / Lifetime';
    try {
      const d = new Date(rawExpiry);
      if (isNaN(d.getTime())) return rawExpiry;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return rawExpiry;
    }
  }, [rawExpiry]);

  // ORDER: 1. Display & Projection, 2. Voice & Audio, 3. Extensions, 4. Plans & Access, 5. License & Device, 6. Feedback, 7. About & Updates
  const navTabs = [
    { id: 'display', label: 'Display & Projection', iconName: 'vm', iconColor: 'text-indigo-400', badge: activePreset !== 'default' ? 'Tuned' : undefined },
    { id: 'voice', label: 'Voice & Audio', iconName: 'unmute', iconColor: 'text-amber-400' },
    { id: 'extensions', label: 'Module Extensions', iconName: 'package', iconColor: 'text-violet-400' },
    { id: 'plans', label: 'Plans & Access', iconName: 'credit-card', iconColor: 'text-indigo-400' },
    { id: 'licensing', label: 'License & Device', iconName: 'key', iconColor: 'text-emerald-400', badge: licenseContext?.activated ? 'Active' : 'Unregistered' },
    { id: 'feedback', label: 'Support & Complaints', iconName: 'feedback', iconColor: 'text-sky-400' },
    { id: 'about', label: 'About & Updates', iconName: 'info', iconColor: 'text-purple-400', badge: hasUpdate ? 'Update Ready' : undefined },
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
                <Codicon name="globe" size={13} className="text-indigo-400" />
                <span>{hasUpdate ? `Try v${latestVersion} Web` : "Launch Cloud Edition"}</span>
                <Codicon name="link-external" size={11} />
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
            <Codicon name="arrow-left" size={16} />
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
                <Codicon name="refresh" size={18} className="text-indigo-400" />
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
              <Codicon name="refresh" size={14} />
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
                    <Codicon name={tab.iconName} size={16} className={isActive ? 'text-white' : tab.iconColor} />
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
                <Codicon name="question" size={13} />
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
              
              {/* TAB: EXTENSIONS */}
              {activeTab === 'extensions' && <ExtensionsTab />}

              {/* TAB: PLANS & ACCESS */}
              {activeTab === 'plans' && <PlansTab />}

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
                      <Codicon name="vm" size={18} className="text-indigo-400" />
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
                          <Codicon name="vm" size={18} />
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
                          <Codicon name="screen-normal" size={18} />
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
                          <Codicon name="eye" size={18} />
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
                          <Codicon name="color-mode" size={18} />
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
                          <Codicon name="eye" size={14} className="text-indigo-400" />
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
                      <Codicon name="unmute" size={18} className="text-amber-400" />
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
                      {isPlayingTestAudio ? <Codicon name="mute" size={14} /> : <Codicon name="play" size={14} />}
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
                      <Codicon name="key" size={18} className="text-emerald-400" />
                      <span>License & Device Binding</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage your institutional license key, seat allocation, and device hardware signature.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isActivated
                      ? 'bg-linear-to-r from-emerald-950/70 via-slate-900/90 to-emerald-950/40 border-emerald-500/40 shadow-[0_0_25px_-5px_rgba(16,185,129,0.18)]'
                      : 'bg-linear-to-r from-rose-950/50 via-slate-900/90 to-amber-950/30 border-rose-500/30 shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)]'
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isActivated 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-inner' 
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        <Codicon name="shield" size={20} className={isActivated ? 'text-emerald-400' : 'text-rose-400'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white font-mono tracking-wide">
                            {isActivated 
                              ? `${licenseContext?.licenseDetails?.tier || 'VIP Pass'} Edition`
                              : 'Unregistered Software'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border ${
                            isActivated
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          }`}>
                            {isActivated ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          {isActivated 
                            ? 'All visualizer modules unlocked on this device' 
                            : 'Enter an institutional license key to unlock modules'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
                      {isActivated ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowChangeKeyInput(true)}
                            className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 hover:border-indigo-400 text-indigo-200 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Codicon name="key" size={13} className="text-indigo-400" />
                            <span>Change Key</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to deactivate and remove this license key from this device?')) {
                                await licenseContext?.deactivateLicense();
                              }
                            }}
                            className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 hover:border-rose-400 text-rose-200 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            title="Unlink and remove key from this device"
                          >
                            <Codicon name="log-out" size={13} className="text-rose-400" />
                            <span>Remove Key</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowChangeKeyInput(true)}
                          className="px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 rounded-xl text-xs font-bold font-mono shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Codicon name="key" size={14} />
                          <span>Activate License</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Institution Co-Branding */}
                  {isActivated && licenseContext?.licenseDetails?.customBranding?.institutionName && (
                    <div className="p-3.5 rounded-xl bg-linear-to-r from-indigo-950/40 via-slate-900/80 to-purple-950/40 border border-indigo-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Codicon name="organization" size={16} className="text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">Licensed To</span>
                          <span className="text-xs font-bold font-mono text-white">
                            {licenseContext.licenseDetails.customBranding.institutionName}
                          </span>
                        </div>
                      </div>
                      {licenseContext.licenseDetails.customBranding.badgeText && (
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/40 font-bold">
                          {licenseContext.licenseDetails.customBranding.badgeText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Unified 4-in-1 Table Panel for Key Details */}
                  <div className="bg-[#0b0e1b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
                      {/* 1. License Key */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between gap-2.5 hover:bg-white/2 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                            <Codicon name="key" size={13} className="text-indigo-400" />
                            License Key
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isActivated
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                              : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                          }`}>
                            {isActivated ? 'Protected' : 'Unregistered'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#070a14] border border-white/5 rounded-xl px-3.5 py-2.5">
                          <span className="font-mono text-xs text-white font-semibold tracking-wider select-none pointer-events-none">
                            {isActivated ? maskedKey : 'No Active License'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {isActivated ? 'Verified' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* 2. Hardware Signature (HWID) */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between gap-2.5 hover:bg-white/2 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                            <Codicon name="chip" size={13} className="text-cyan-400" />
                            Hardware Signature (HWID)
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isActivated
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                          }`}>
                            {isActivated ? 'Bound' : 'Unbound'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#070a14] border border-white/5 rounded-xl px-3.5 py-2.5">
                          <span className="font-mono text-xs text-cyan-200 truncate max-w-55 select-none pointer-events-none" title={licenseContext?.hwid || 'TC-DEVICE-AUTO'}>
                            {licenseContext?.hwid || 'TC-DEVICE-AUTO'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                            This Device
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                      {/* 3. Expiry & Validity */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between gap-2.5 hover:bg-white/2 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                            <Codicon name="calendar" size={13} className="text-emerald-400" />
                            Expiry & Validity
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isActivated
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                          }`}>
                            {isActivated ? 'Active' : 'Unregistered'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#070a14] border border-white/5 rounded-xl px-3.5 py-2.5">
                          <span className="font-mono text-xs text-slate-200 select-none">
                            {isActivated ? formattedExpiry : 'Perpetual / Lifetime'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {isActivated ? 'Licensed' : 'No Expiry'}
                          </span>
                        </div>
                      </div>

                      {/* 4. Plan Edition */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between gap-2.5 hover:bg-white/2 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                            <Codicon name="shield" size={13} className="text-purple-400" />
                            Plan Edition
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isActivated
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                          }`}>
                            {isActivated ? 'Active' : 'Free'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#070a14] border border-white/5 rounded-xl px-3.5 py-2.5">
                          <span className="font-mono text-xs text-purple-200 select-none font-semibold">
                            {isActivated 
                              ? `${licenseContext?.licenseDetails?.tier || 'VIP Pass'} Edition`
                              : 'Community Edition'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {isActivated ? 'Full Access' : 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registered Devices Section with Gradient Bar & Collapsible Logout List */}
                  {licenseContext?.activated && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e1b] border border-white/10 space-y-3.5 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                            <Codicon name="vm" size={16} />
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white font-mono">
                              Registered Devices
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold font-mono">
                              {licenseContext.licenseDetails.activeDevicesCount || 1} of {licenseContext.licenseDetails.maxDevices || 1} Bound
                            </span>
                          </div>
                        </div>

                        {/* Toggle Collapsible Devices Button */}
                        <button
                          type="button"
                          onClick={() => setShowDevicesList(prev => !prev)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                        >
                          <span>{showDevicesList ? 'Hide Devices' : 'Manage Connected Devices'}</span>
                          {showDevicesList ? <Codicon name="chevron-up" size={14} /> : <Codicon name="chevron-down" size={14} />}
                        </button>
                      </div>

                      {/* Colorful Gradient Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/10 p-0.5">
                          <div 
                            className="bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
                            style={{ width: `${Math.min(100, Math.max(8, ((licenseContext.licenseDetails.activeDevicesCount || 1) / (licenseContext.licenseDetails.maxDevices || 1)) * 100))}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{licenseContext.licenseDetails.activeDevicesCount || 1} Active</span>
                          <span className="text-emerald-400 font-medium">
                            {Math.max(0, (licenseContext.licenseDetails.maxDevices || 1) - (licenseContext.licenseDetails.activeDevicesCount || 1))} slots free
                          </span>
                        </div>
                      </div>

                      {/* Collapsible Device List with Remote Logout / Disconnect */}
                      <AnimatePresence>
                        {showDevicesList && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-white/10 pt-3.5 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                              <span className="font-bold text-slate-300">Connected Hardware Devices</span>
                              <span className="text-[10px] text-slate-500">Logout to unlink a device</span>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {(() => {
                                const devicesMap = licenseContext.licenseDetails.devices || {};
                                const deviceKeys = Object.keys(devicesMap);
                                const currentHwid = licenseContext.hwid || 'TC-DEVICE-AUTO';

                                // If devices map is empty, show at least current device
                                const list = deviceKeys.length > 0
                                  ? deviceKeys.map(devHwid => ({
                                      hwid: devHwid,
                                      activatedAt: devicesMap[devHwid]?.activatedAt,
                                      isCurrent: devHwid === currentHwid
                                    }))
                                  : [{ hwid: currentHwid, activatedAt: undefined, isCurrent: true }];

                                return list.map(({ hwid: devHwid, activatedAt, isCurrent }) => (
                                  <div
                                    key={devHwid}
                                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                                      isCurrent
                                        ? 'bg-indigo-950/30 border-indigo-500/40'
                                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                        isCurrent
                                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                                          : 'bg-slate-800 text-slate-400 border-slate-700'
                                      }`}>
                                        <Codicon name="chip" size={13} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-xs font-bold text-white truncate max-w-42.5 sm:max-w-xs" title={devHwid}>
                                            {devHwid}
                                          </span>
                                          {isCurrent && (
                                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold shrink-0">
                                              This Device
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                                          {activatedAt ? `Activated: ${new Date(activatedAt).toLocaleDateString('en-GB')}` : 'Hardware Bound'}
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      disabled={unlinkingHwid === devHwid}
                                      onClick={async () => {
                                        if (window.confirm(`Are you sure you want to disconnect and logout device: ${devHwid}?`)) {
                                          setUnlinkingHwid(devHwid);
                                          try {
                                            await unlinkDeviceFromLicense(activeKeyStr, devHwid);
                                            if (isCurrent) {
                                              await licenseContext.deactivateLicense();
                                            }
                                          } catch (err) {
                                            console.error('Failed to unlink device:', err);
                                          } finally {
                                            setUnlinkingHwid(null);
                                          }
                                        }
                                      }}
                                      className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 hover:border-rose-400 text-rose-200 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                                      title="Logout and disconnect this device"
                                    >
                                      <Codicon name="log-out" size={12} />
                                      <span>{unlinkingHwid === devHwid ? 'Logging out...' : 'Logout Device'}</span>
                                    </button>
                                  </div>
                                ));
                              })()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: SUPPORT & COMPLAINTS */}
              {activeTab === 'feedback' && <FeedbackTab />}

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
                      <Codicon name="info" size={18} className="text-purple-400" />
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
                          <Codicon name="vm" size={18} className="text-indigo-400" />
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
                          <Codicon name="refresh" size={13} />
                          <span>Update Ready (v{latestVersion})</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                          <Codicon name="pass" size={13} />
                          <span>Up to Date</span>
                        </span>
                      )}
                    </div>

                    {/* Action Toolbar & Channels */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400 font-medium">Update Channel:</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                          Production Stable
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          setCheckToast("Checking server for updates...");
                          await checkNow();
                          setTimeout(() => {
                            setCheckToast(null);
                          }, 4000);
                        }}
                        disabled={isChecking}
                        className="px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                        title="Check server for updates"
                      >
                        <Codicon name="refresh" size={13} className={isChecking ? "animate-spin text-indigo-400" : "text-indigo-400"} />
                        <span>{isChecking ? "Checking..." : "Check for Updates"}</span>
                      </button>
                    </div>

                    {/* ── 2 Update Options ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Option 1: Instant Direct Setup */}
                      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex flex-col justify-between gap-3 hover:border-indigo-500/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-extrabold text-indigo-400 tracking-wider">
                              Option 1: Instant Setup (.exe)
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                              Fastest
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium mt-1.5 leading-snug">
                            Directly download & run the latest Windows installer setup without opening a browser.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const target = downloadUrl || 'https://tread-code-smoky.vercel.app/releases/TreadCode_latest_x64-setup.exe';
                            try {
                              const { open } = await import('@tauri-apps/plugin-shell');
                              await open(target);
                            } catch (err) {
                              const a = document.createElement('a');
                              a.href = target;
                              a.download = 'TreadCode_latest_x64-setup.exe';
                              a.target = '_blank';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                        >
                          <Codicon name="cloud-download" size={14} />
                          <span>⚡ Download .exe Installer</span>
                        </button>
                      </div>

                      {/* Option 2: Official Web Store Section */}
                      <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/25 flex flex-col justify-between gap-3 hover:border-sky-500/40 transition-colors">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-extrabold text-sky-400 tracking-wider">
                              Option 2: Web Store Page
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                              Catalogue Section
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium mt-1.5 leading-snug">
                            Visit TreadCode's official catalogue page to check release notes, changelog & download from web.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const webUrl = 'https://fadewyng.pages.dev/items/treadcode';
                            try {
                              const { open } = await import('@tauri-apps/plugin-shell');
                              await open(webUrl);
                            } catch {
                              window.open(webUrl, '_blank');
                            }
                          }}
                          className="w-full py-2 px-3 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Codicon name="globe" size={14} className="text-sky-300" />
                          <span>🌐 Open Web Store Section</span>
                          <Codicon name="link-external" size={11} className="text-sky-400" />
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
                      <Codicon name="shield" size={16} className="text-purple-400 shrink-0" />
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
