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
import { useThemeStore } from '@shared/hooks/useThemeStore';

export const applyDisplayTuning = (
  contrast: number = 100,
  brightness: number = 100,
  saturate: number = 100,
  sharpness: number = 100,
  warmth: number = 0,
  tint: number = 0
) => {
  if (
    contrast === 100 &&
    brightness === 100 &&
    saturate === 100 &&
    sharpness === 100 &&
    warmth === 0 &&
    tint === 0
  ) {
    document.documentElement.style.filter = 'none';
  } else {
    let filterStr = `contrast(${contrast}%) brightness(${brightness}%) saturate(${saturate}%)`;
    if (warmth > 0) {
      filterStr += ` sepia(${warmth}%)`;
    }
    if (tint !== 0) {
      filterStr += ` hue-rotate(${tint}deg)`;
    }
    if (sharpness !== 100) {
      if (sharpness < 100) {
        filterStr += ` blur(${(100 - sharpness) * 0.012}px)`;
      } else {
        const edgeAmt = ((sharpness - 100) / 100) * 0.6;
        filterStr += ` drop-shadow(0 0 ${edgeAmt}px rgba(0,0,0,0.5))`;
      }
    }
    document.documentElement.style.filter = filterStr;
  }
  localStorage.setItem(
    'flowtrace_display_tuning',
    JSON.stringify({ contrast, brightness, saturate, sharpness, warmth, tint })
  );
};

type SettingTab = 'display' | 'voice' | 'licensing' | 'feedback' | 'about' | 'extensions' | 'plans';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const licenseContext = useContext(LicenseContext);
  const { hasUpdate, latestVersion, currentVersion, checkNow, isChecking, downloadUrl } = useUpdateChecker();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

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

  // Display Tuning States (Contrast, Brightness, Saturation, Sharpness, Warmth, Tint)
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
  const [saturateVal, setSaturateVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).saturate || 100; } catch (e) { console.error(e); }
    }
    return 100;
  });
  const [sharpnessVal, setSharpnessVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).sharpness || 100; } catch (e) { console.error(e); }
    }
    return 100;
  });
  const [warmthVal, setWarmthVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).warmth ?? 0; } catch (e) { console.error(e); }
    }
    return 0;
  });
  const [tintVal, setTintVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try { return JSON.parse(saved).tint ?? 0; } catch (e) { console.error(e); }
    }
    return 0;
  });

  type PresetId = 'default' | 'projector' | 'high_contrast' | 'daylight' | 'eye_comfort' | 'vivid' | 'custom';
  const [activePreset, setActivePreset] = useState<PresetId>('default');

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
  const [testingVoiceLang, setTestingVoiceLang] = useState<'en' | 'hi' | null>(null);

  const toggleVoiceMode = () => {
    setIsVoiceModeEnabled(prev => {
      const next = !prev;
      localStorage.setItem('treadcode_voice_enabled', String(next));
      return next;
    });
  };

  // Load Display Tuning filter on mount & state updates
  useEffect(() => {
    applyDisplayTuning(contrastVal, brightnessVal, saturateVal, sharpnessVal, warmthVal, tintVal);
  }, [contrastVal, brightnessVal, saturateVal, sharpnessVal, warmthVal, tintVal]);

  const handleTuneChange = (
    c: number,
    b: number,
    s: number,
    sh: number = 100,
    w: number = 0,
    t: number = 0,
    preset: PresetId = 'custom'
  ) => {
    setContrastVal(c);
    setBrightnessVal(b);
    setSaturateVal(s);
    setSharpnessVal(sh);
    setWarmthVal(w);
    setTintVal(t);
    setActivePreset(preset);
    applyDisplayTuning(c, b, s, sh, w, t);
  };

  const colorPresets: {
    id: PresetId;
    name: string;
    subtitle: string;
    c: number;
    b: number;
    s: number;
    sh: number;
    w: number;
    t: number;
  }[] = [
    {
      id: 'default',
      name: 'Standard',
      subtitle: 'Natural Balance',
      c: 100,
      b: 100,
      s: 100,
      sh: 100,
      w: 0,
      t: 0,
    },
    {
      id: 'projector',
      name: 'Projector',
      subtitle: 'Classroom Lumens',
      c: 125,
      b: 115,
      s: 115,
      sh: 115,
      w: 5,
      t: 0,
    },
    {
      id: 'high_contrast',
      name: 'High Contrast',
      subtitle: 'Max Text Clarity',
      c: 145,
      b: 105,
      s: 110,
      sh: 125,
      w: 0,
      t: 0,
    },
    {
      id: 'daylight',
      name: 'Daylight',
      subtitle: 'Bright Room & Glare',
      c: 115,
      b: 125,
      s: 110,
      sh: 110,
      w: 0,
      t: 0,
    },
    {
      id: 'eye_comfort',
      name: 'Eye Comfort',
      subtitle: 'Blue Light Filter',
      c: 95,
      b: 92,
      s: 90,
      sh: 100,
      w: 35,
      t: 0,
    },
    {
      id: 'vivid',
      name: 'Vivid Studio',
      subtitle: 'High Dynamic Color',
      c: 120,
      b: 105,
      s: 135,
      sh: 110,
      w: 0,
      t: 0,
    },
  ];

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

  const playTestVoice = (lang: 'en' | 'hi' = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (testingVoiceLang === lang) {
      setTestingVoiceLang(null);
      return;
    }

    const isEn = lang === 'en';
    const text = isEn
      ? "Hello! TreadCode is ready for your classroom presentation."
      : "नमस्ते! ट्रेडकोड आपकी कक्षा प्रस्तुति के लिए तैयार है।";
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = isEn
      ? (availableVoices.find(v => v.name === selectedEnVoice) || availableVoices[0])
      : (availableVoices.find(v => v.name === selectedHiVoice) || availableVoices.find(v => v.lang.includes('hi')) || availableVoices[0]);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setTestingVoiceLang(lang);
    utterance.onend = () => setTestingVoiceLang(null);
    utterance.onerror = () => setTestingVoiceLang(null);

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
    { id: 'display', label: 'Display & Projection', iconName: 'vm' },
    { id: 'voice', label: 'Voice & Narration', iconName: 'unmute' },
    { id: 'extensions', label: 'Module Extensions', iconName: 'package' },
    { id: 'plans', label: 'Plans & Access', iconName: 'credit-card' },
    { id: 'licensing', label: 'License & Device', iconName: 'key' },
    { id: 'feedback', label: 'Support & Feedback', iconName: 'feedback' },
    { id: 'about', label: 'About & Updates', iconName: 'info', badge: hasUpdate ? 'Update' : undefined },
  ];

  return (
    <PageTransition className={`flex flex-col flex-1 overflow-y-auto w-full transition-colors duration-150 ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#050510] text-white'}`}>
      <div className="flex flex-col py-6 md:py-8 px-4 md:px-8 max-w-6xl mx-auto w-full min-h-full">

        {/* Page Header */}
        <div className={`mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className={`text-xl md:text-2xl font-bold tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Settings
              </h1>
              <span className={`text-[11px] font-mono mt-1 font-medium tracking-wide ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                v{displayVersion}
              </span>
            </div>

            {/* Web Cloud Edition Link - Highlighted Yellow */}
            <button
              onClick={async () => {
                const webUrl = "https://tread-code-smoky.vercel.app/";
                try {
                  const { open } = await import('@tauri-apps/plugin-shell');
                  await open(webUrl);
                } catch {
                  window.open(webUrl, "_blank", "noopener,noreferrer");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 shadow-xs hover:shadow transition-all cursor-pointer border border-amber-300"
              title="Open TreadCode Web Cloud Edition"
            >
              <span>Launch Cloud Edition</span>
              <Codicon name="link-external" size={11} className="text-slate-900" />
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors shrink-0 self-start sm:self-auto cursor-pointer ${isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs' : 'bg-[#0f121a] hover:bg-[#151924] border-slate-800 text-slate-200'
              }`}
          >
            <Codicon name="arrow-left" size={14} />
            <span>Back</span>
          </button>
        </div>

        {/* Update Banner */}
        {hasUpdate && (
          <div className={`mb-6 p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-[#0f1422] border-blue-500/20'
          }`}>
            <div className="flex items-center gap-2.5">
              <Codicon name="refresh" size={14} className="text-blue-500" />
              <span className={`text-xs font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                A new version (v{latestVersion}) is ready to install.
              </span>
            </div>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              View Update
            </button>
          </div>
        )}

        {/* Main 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6">

          {/* Left Navigation Sidebar */}
          <div
            className="md:col-span-4 flex flex-col gap-2 rounded-xl p-3 transition-colors border"
            style={{
              background: isLight ? '#ffffff' : '#0b0d13',
              borderColor: isLight ? '#cbd5e1' : '#1e2433',
              boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
            }}
          >
            {navTabs.map(tab => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingTab)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-150 text-sm font-semibold text-left cursor-pointer ${isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-[#151924]'
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Codicon name={tab.iconName} size={19} className={isActive ? 'text-white' : (isLight ? 'text-slate-500' : 'text-slate-400')} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${isActive
                      ? 'bg-white/20 border-white/30 text-white'
                      : isLight
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-blue-900/40 border-blue-700 text-blue-300'
                      }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
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
                  className="rounded-lg p-6 space-y-6 transition-colors border"
                  style={{
                    background: isLight ? '#ffffff' : '#0b0d13',
                    borderColor: isLight ? '#cbd5e1' : '#1e2433',
                    boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  <div className="border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                    <h2 className={`text-base font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Codicon name="vm" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
                      <span>Display & Projection Tuning</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Calibrate contrast, brightness, color saturation, and sharpness for projectors and external displays.
                    </p>
                  </div>

                  {/* Presets Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Color Presets
                      </label>
                      <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {activePreset === 'custom' ? 'Custom Tuned' : colorPresets.find(p => p.id === activePreset)?.name || 'Standard'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {colorPresets.map((preset) => {
                        const isActive = activePreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleTuneChange(preset.c, preset.b, preset.s, preset.sh, preset.w, preset.t, preset.id)}
                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative ${
                              isActive
                                ? isLight
                                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs ring-1 ring-blue-600/30'
                                  : 'border-blue-500 bg-blue-950/40 text-white ring-1 ring-blue-500/40'
                                : isLight
                                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                  : 'border-slate-800 bg-[#0f121a] hover:bg-[#151924] text-slate-300'
                            }`}
                          >
                            <div className="font-bold text-xs">{preset.name}</div>
                            <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              {preset.subtitle}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Workable Calibration Sliders */}
                  <div className="space-y-3.5 pt-4 border-t" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                    <div>
                      <label className={`text-xs font-semibold uppercase tracking-wider block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Adjustments
                      </label>
                    </div>

                    {/* 1. Screen Contrast */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-md hover:bg-slate-500/5 transition-colors">
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Screen Contrast</div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Text-to-background edge distinction</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min={80}
                          max={180}
                          step={5}
                          value={contrastVal}
                          onChange={e => handleTuneChange(Number(e.target.value), brightnessVal, saturateVal, sharpnessVal, warmthVal, tintVal, 'custom')}
                          className="w-36 sm:w-44 accent-blue-600 cursor-pointer"
                        />
                        <span className={`text-xs font-mono w-12 text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{contrastVal}%</span>
                      </div>
                    </div>

                    {/* 2. Screen Brightness */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-md hover:bg-slate-500/5 transition-colors">
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Screen Brightness</div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Overall lumen output for daylight classrooms</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min={80}
                          max={150}
                          step={5}
                          value={brightnessVal}
                          onChange={e => handleTuneChange(contrastVal, Number(e.target.value), saturateVal, sharpnessVal, warmthVal, tintVal, 'custom')}
                          className="w-36 sm:w-44 accent-blue-600 cursor-pointer"
                        />
                        <span className={`text-xs font-mono w-12 text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{brightnessVal}%</span>
                      </div>
                    </div>

                    {/* 3. Color Saturation */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-md hover:bg-slate-500/5 transition-colors">
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Color Saturation</div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Vibrancy of syntax highlights and diagram tokens</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min={50}
                          max={180}
                          step={5}
                          value={saturateVal}
                          onChange={e => handleTuneChange(contrastVal, brightnessVal, Number(e.target.value), sharpnessVal, warmthVal, tintVal, 'custom')}
                          className="w-36 sm:w-44 accent-blue-600 cursor-pointer"
                        />
                        <span className={`text-xs font-mono w-12 text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{saturateVal}%</span>
                      </div>
                    </div>

                    {/* 4. Screen Sharpness */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-md hover:bg-slate-500/5 transition-colors">
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Screen Sharpness</div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Font edge acuity for low-resolution 720p/1080p projectors</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min={80}
                          max={140}
                          step={5}
                          value={sharpnessVal}
                          onChange={e => handleTuneChange(contrastVal, brightnessVal, saturateVal, Number(e.target.value), warmthVal, tintVal, 'custom')}
                          className="w-36 sm:w-44 accent-blue-600 cursor-pointer"
                        />
                        <span className={`text-xs font-mono w-12 text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{sharpnessVal}%</span>
                      </div>
                    </div>

                    {/* 5. Eye Comfort / Warmth (Blue Light Filter) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-md hover:bg-slate-500/5 transition-colors">
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Eye Comfort (Warmth)</div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Softens harsh blue light emission to reduce eye fatigue</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min={0}
                          max={60}
                          step={2}
                          value={warmthVal}
                          onChange={e => handleTuneChange(contrastVal, brightnessVal, saturateVal, sharpnessVal, Number(e.target.value), tintVal, 'custom')}
                          className="w-36 sm:w-44 accent-amber-500 cursor-pointer"
                        />
                        <span className={`text-xs font-mono w-12 text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{warmthVal}%</span>
                      </div>
                    </div>

                    {/* 6. Color Tint (Lamp Correction) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 p-2 rounded-md hover:bg-slate-500/5 transition-colors">
                      <div className="min-w-0">
                        <div className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Color Tint (Lamp Correction)</div>
                        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Neutralizes green or magenta discoloration from aging projector lamps</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <input
                          type="range"
                          min={-30}
                          max={30}
                          step={2}
                          value={tintVal}
                          onChange={e => handleTuneChange(contrastVal, brightnessVal, saturateVal, sharpnessVal, warmthVal, Number(e.target.value), 'custom')}
                          className="w-36 sm:w-44 accent-emerald-500 cursor-pointer"
                        />
                        <span className={`text-xs font-mono w-12 text-right ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {tintVal > 0 ? `+${tintVal}` : tintVal}°
                        </span>
                      </div>
                    </div>

                    {/* Footer / Reset Action */}
                    <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: isLight ? '#f1f5f9' : '#141824' }}>
                      <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Settings auto-save and persist across sessions.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTuneChange(100, 100, 100, 100, 0, 0, 'default')}
                        className={`text-xs font-medium cursor-pointer px-3.5 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 ${isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          : 'bg-[#0f121a] hover:bg-[#151924] text-slate-300 border-slate-800'
                          }`}
                      >
                        <Codicon name="refresh" size={13} />
                        <span>Reset to Defaults</span>
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
                  className="rounded-lg p-6 space-y-5 transition-colors border"
                  style={{
                    background: isLight ? '#ffffff' : '#0b0d13',
                    borderColor: isLight ? '#cbd5e1' : '#1e2433',
                    boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  <div className="border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                    <h2 className={`text-base font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Codicon name="unmute" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
                      <span>Voice & Narration</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Speech synthesis settings for step-by-step code execution.
                    </p>
                  </div>

                  {/* Narration Toggle */}
                  <div
                    className="p-4 rounded-lg border flex items-center justify-between"
                    style={{
                      background: isLight ? '#f8fafc' : '#0f121a',
                      borderColor: isLight ? '#e2e8f0' : '#1e2433',
                    }}
                  >
                    <div>
                      <span className={`text-xs font-semibold block ${isLight ? 'text-slate-900' : 'text-white'}`}>Audio Narration</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Enable voice explanations during visual step execution
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={toggleVoiceMode}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isVoiceModeEnabled ? 'bg-blue-600' : (isLight ? 'bg-slate-300' : 'bg-slate-700')
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${isVoiceModeEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Voice Selectors with Inline Test Buttons */}
                  <div className="space-y-3">

                    {/* English Voice */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border"
                      style={{
                        background: isLight ? '#f8fafc' : '#0f121a',
                        borderColor: isLight ? '#e2e8f0' : '#1e2433',
                      }}
                    >
                      <div>
                        <span className={`text-xs font-semibold block ${isLight ? 'text-slate-900' : 'text-white'}`}>English Voice</span>
                        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Primary speaker for English narration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedEnVoice}
                          onChange={e => handleEnVoiceChange(e.target.value)}
                          className={`rounded-md px-2.5 py-1.5 text-xs outline-none max-w-56 cursor-pointer border ${isLight
                            ? 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
                            : 'bg-[#0b0d13] border-slate-700 text-slate-200 focus:border-blue-500'
                            }`}
                        >
                          {availableVoices
                            .filter(v => v.lang.includes('en'))
                            .map(v => (
                              <option key={v.name} value={v.name}>
                                {v.name} ({v.lang})
                              </option>
                            ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => playTestVoice('en')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0 border ${testingVoiceLang === 'en'
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : isLight
                              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                              : 'bg-[#0b0d13] hover:bg-[#151924] border-slate-700 text-slate-200'
                            }`}
                        >
                          {testingVoiceLang === 'en' ? 'Stop' : 'Test'}
                        </button>
                      </div>
                    </div>

                    {/* Hindi Voice */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border"
                      style={{
                        background: isLight ? '#f8fafc' : '#0f121a',
                        borderColor: isLight ? '#e2e8f0' : '#1e2433',
                      }}
                    >
                      <div>
                        <span className={`text-xs font-semibold block ${isLight ? 'text-slate-900' : 'text-white'}`}>Hindi Voice</span>
                        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Primary speaker for Hindi narration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedHiVoice}
                          onChange={e => handleHiVoiceChange(e.target.value)}
                          className={`rounded-md px-2.5 py-1.5 text-xs outline-none max-w-56 cursor-pointer border ${isLight
                            ? 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
                            : 'bg-[#0b0d13] border-slate-700 text-slate-200 focus:border-blue-500'
                            }`}
                        >
                          {availableVoices
                            .filter(v => v.lang.includes('hi') || v.lang.includes('en'))
                            .map(v => (
                              <option key={v.name} value={v.name}>
                                {v.name} ({v.lang})
                              </option>
                            ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => playTestVoice('hi')}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0 border ${testingVoiceLang === 'hi'
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : isLight
                              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                              : 'bg-[#0b0d13] hover:bg-[#151924] border-slate-700 text-slate-200'
                            }`}
                        >
                          {testingVoiceLang === 'hi' ? 'Stop' : 'Test'}
                        </button>
                      </div>
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
                  className="rounded-lg p-6 space-y-6 transition-colors border"
                  style={{
                    background: isLight ? '#ffffff' : '#0b0d13',
                    borderColor: isLight ? '#cbd5e1' : '#1e2433',
                    boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  <div className="border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                    <h2 className={`text-base font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Codicon name="key" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
                      <span>License & Device</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Manage license status, hardware signature binding, and device seat allocation.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ${
                    isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#0f121a] border-[#1e2433]'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {isActivated 
                            ? `${licenseContext?.licenseDetails?.tier || 'VIP Pass'} Edition`
                            : 'Unregistered Software'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-bold uppercase tracking-wider border ${
                          isActivated
                            ? isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          {isActivated ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {isActivated 
                          ? 'All visualizer modules unlocked on this hardware signature' 
                          : 'Activate a valid license key to unlock all modules'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isActivated ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowChangeKeyInput(true)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                              isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#0f121a] hover:bg-[#151924] border-slate-700 text-slate-200'
                            }`}
                          >
                            Change Key
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to deactivate and remove this license key from this device?')) {
                                await licenseContext?.deactivateLicense();
                              }
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                              isLight ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700' : 'bg-rose-950/30 hover:bg-rose-950/50 border-rose-800/60 text-rose-300'
                            }`}
                          >
                            Remove Key
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowChangeKeyInput(true)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Activate License
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Institution Co-Branding */}
                  {isActivated && licenseContext?.licenseDetails?.customBranding?.institutionName && (
                    <div
                      className="p-3.5 rounded-lg border flex items-center justify-between"
                      style={{
                        background: isLight ? '#f8fafc' : '#0f121a',
                        borderColor: isLight ? '#e2e8f0' : '#1e2433',
                      }}
                    >
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Licensed Organization</span>
                        <span className={`text-xs font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {licenseContext.licenseDetails.customBranding.institutionName}
                        </span>
                      </div>
                      {licenseContext.licenseDetails.customBranding.badgeText && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] border font-bold ${
                          isLight ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        }`}>
                          {licenseContext.licenseDetails.customBranding.badgeText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Clean 2x2 Specifications Grid */}
                  <div
                    className="border rounded-lg overflow-hidden divide-y"
                    style={{
                      background: isLight ? '#ffffff' : '#0f121a',
                      borderColor: isLight ? '#cbd5e1' : '#1e2433',
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                      {/* 1. License Key */}
                      <div className="p-4 flex flex-col justify-center gap-1.5">
                        <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          License Key
                        </span>
                        <span className={`font-mono text-xs font-semibold tracking-wider select-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {isActivated ? maskedKey : 'No Active License'}
                        </span>
                      </div>

                      {/* 2. Hardware Signature */}
                      <div className="p-4 flex flex-col justify-center gap-1.5">
                        <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Hardware Signature (HWID)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs truncate max-w-56 select-none ${isLight ? 'text-slate-900' : 'text-white'}`} title={licenseContext?.hwid || 'TC-DEVICE-AUTO'}>
                            {licenseContext?.hwid || 'TC-DEVICE-AUTO'}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                            isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            This Device
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                      {/* 3. Validity */}
                      <div className="p-4 flex flex-col justify-center gap-1.5">
                        <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Validity & Expiry
                        </span>
                        <span className={`font-mono text-xs select-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {isActivated ? formattedExpiry : 'Perpetual / Lifetime'}
                        </span>
                      </div>

                      {/* 4. Plan Edition */}
                      <div className="p-4 flex flex-col justify-center gap-1.5">
                        <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Plan Tier
                        </span>
                        <span className={`font-mono text-xs select-none font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {isActivated 
                            ? `${licenseContext?.licenseDetails?.tier || 'VIP Pass'} Edition`
                            : 'Community Edition'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Devices Section */}
                  {licenseContext?.activated && (
                    <div
                      className="p-4 sm:p-5 rounded-lg border space-y-3.5"
                      style={{
                        background: isLight ? '#ffffff' : '#0f121a',
                        borderColor: isLight ? '#cbd5e1' : '#1e2433',
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className={`text-sm font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            Registered Devices
                          </h3>
                          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {licenseContext.licenseDetails.activeDevicesCount || 1} of {licenseContext.licenseDetails.maxDevices || 1} seats bound
                          </span>
                        </div>

                        {/* Toggle Collapsible Devices Button */}
                        <button
                          type="button"
                          onClick={() => setShowDevicesList(prev => !prev)}
                          className={`px-3 py-1.5 rounded-md border text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto ${
                            isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          <span>{showDevicesList ? 'Hide Devices' : 'Manage Connected Devices'}</span>
                          {showDevicesList ? <Codicon name="chevron-up" size={13} /> : <Codicon name="chevron-down" size={13} />}
                        </button>
                      </div>

                      {/* Clean Progress Bar with Dynamic Green -> Yellow -> Red Status */}
                      {(() => {
                        const activeCount = licenseContext.licenseDetails.activeDevicesCount || 1;
                        const maxCount = licenseContext.licenseDetails.maxDevices || 1;
                        const usageRatio = activeCount / maxCount;
                        const usagePct = Math.min(100, Math.max(8, usageRatio * 100));
                        const freeSlots = Math.max(0, maxCount - activeCount);
                        
                        // Dynamic progression: Green (<60%) -> Yellow (60-85%) -> Red (>85% / Full)
                        const barColor = usageRatio >= 0.85
                          ? 'bg-rose-500'
                          : usageRatio >= 0.6
                            ? 'bg-amber-500'
                            : 'bg-emerald-500';

                        const freeSlotsColor = freeSlots === 0
                          ? (isLight ? 'text-rose-600' : 'text-rose-400')
                          : freeSlots <= 1
                            ? (isLight ? 'text-amber-600' : 'text-amber-400')
                            : (isLight ? 'text-emerald-600' : 'text-emerald-400');

                        return (
                          <div className="space-y-1.5">
                            <div className={`w-full h-2 rounded-full overflow-hidden border p-0.5 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                              <div 
                                className={`${barColor} h-full rounded-full transition-all duration-500`}
                                style={{ width: `${usagePct}%` }}
                              />
                            </div>
                            <div className={`flex items-center justify-between text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              <span>{activeCount} of {maxCount} devices active</span>
                              <span className={`${freeSlotsColor} font-semibold`}>
                                {freeSlots === 0 ? 'Seat limit reached (0 slots free)' : `${freeSlots} ${freeSlots === 1 ? 'slot' : 'slots'} free`}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Collapsible Device List */}
                      <AnimatePresence>
                        {showDevicesList && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t pt-3.5 space-y-2"
                            style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}
                          >
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Connected Hardware Devices</span>
                              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Unlink a device to free up seats</span>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {(() => {
                                const devicesMap = licenseContext.licenseDetails.devices || {};
                                const deviceKeys = Object.keys(devicesMap);
                                const currentHwid = licenseContext.hwid || 'TC-DEVICE-AUTO';

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
                                    className={`flex items-center justify-between p-2.5 rounded-md border transition-all ${
                                      isCurrent
                                        ? isLight ? 'bg-blue-50/70 border-blue-300' : 'bg-blue-950/20 border-blue-500/40'
                                        : isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f121a] border-slate-800'
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={`font-mono text-xs font-semibold truncate max-w-44 sm:max-w-xs ${isLight ? 'text-slate-900' : 'text-white'}`} title={devHwid}>
                                          {devHwid}
                                        </span>
                                        {isCurrent && (
                                          <span className={`px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold shrink-0 ${
                                            isLight ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                          }`}>
                                            This Device
                                          </span>
                                        )}
                                      </div>
                                      <span className={`text-[10px] font-mono block truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {activatedAt ? `Activated: ${new Date(activatedAt).toLocaleDateString('en-GB')}` : 'Hardware Bound'}
                                      </span>
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
                                      className={`px-2 py-1 rounded text-xs font-mono font-semibold border transition-colors flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50 ${
                                        isLight ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700' : 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/40 text-rose-200'
                                      }`}
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
                  className="rounded-lg p-6 space-y-5 transition-colors border"
                  style={{
                    background: isLight ? '#ffffff' : '#0b0d13',
                    borderColor: isLight ? '#cbd5e1' : '#1e2433',
                    boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
                  }}
                >
                  <div className="border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                    <h2 className={`text-base font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      <Codicon name="info" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
                      <span>About & Updates</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Software version information, release updates, and legal policies.
                    </p>
                  </div>

                  {/* Software Version Card */}
                  <div
                    className="p-5 rounded-lg border space-y-4"
                    style={{
                      background: isLight ? '#f8fafc' : '#0f121a',
                      borderColor: isLight ? '#e2e8f0' : '#1e2433',
                    }}
                  >
                    {/* Software Identity & Status Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
                      <div>
                        <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          TreadCode Desktop
                        </h3>
                        <p className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Version {displayVersion}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {hasUpdate ? (
                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(true)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#fa5a3f] hover:bg-[#ea4f34] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Codicon name="refresh" size={13} />
                            <span>Update Ready (v{latestVersion})</span>
                          </button>
                        ) : (
                          <span className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          }`}>
                            <Codicon name="pass" size={13} />
                            <span>Up to Date</span>
                          </span>
                        )}

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
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                            isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs' : 'bg-[#151924] hover:bg-[#1d2332] border-slate-700/60 text-slate-200'
                          }`}
                          title="Check server for updates"
                        >
                          <Codicon name="refresh" size={13} className={isChecking ? "animate-spin text-[#fa5a3f]" : "text-[#fa5a3f]"} />
                          <span>{isChecking ? "Checking..." : "Check for Updates"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Distribution & Store Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Option 1: Direct Windows Setup */}
                      <div
                        className="p-4 rounded-lg border flex flex-col justify-between gap-3"
                        style={{
                          background: isLight ? '#f1f5f9' : '#141822',
                          borderColor: isLight ? '#cbd5e1' : '#222a3a',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-semibold tracking-wide block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                              Windows Installer (.exe)
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                              v{displayVersion}
                            </span>
                          </div>
                          <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            Offline setup package for Windows 10 and 11 with automatic start menu integration.
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
                          className="w-full py-2 px-3 rounded-lg bg-[#fa5a3f] hover:bg-[#ea4f34] active:bg-[#d84429] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Codicon name="cloud-download" size={13} />
                          <span>Download .exe Setup</span>
                        </button>
                      </div>

                      {/* Option 2: Official Web Store */}
                      <div
                        className="p-4 rounded-lg border flex flex-col justify-between gap-3"
                        style={{
                          background: isLight ? '#f1f5f9' : '#141822',
                          borderColor: isLight ? '#cbd5e1' : '#222a3a',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-semibold tracking-wide block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                              Web Store
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
                              All Platforms
                            </span>
                          </div>
                          <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            Android SmartBoard (.apk), Linux (.AppImage), and direct Plug &amp; Play (USB portable) packages are available on the official store.
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
                          className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isLight ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs' : 'bg-[#0f121a] hover:bg-[#181d29] border-slate-700/80 text-slate-200'
                          }`}
                        >
                          <Codicon name="globe" size={13} className={isLight ? 'text-[#fa5a3f]' : 'text-[#ff7e66]'} />
                          <span>Open Web Store</span>
                          <Codicon name="link-external" size={11} className={isLight ? 'text-slate-400' : 'text-slate-500'} />
                        </button>
                      </div>
                    </div>

                    {/* Status Feedback Toast */}
                    {checkToast && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-[11px] font-mono px-3.5 py-2 rounded-lg border flex items-center gap-2 mt-1 ${
                          hasUpdate
                            ? isLight
                              ? 'bg-[#fff5f3] border-[#fa5a3f]/30 text-[#c73820]'
                              : 'bg-[#181112] border-[#fa5a3f]/40 text-[#ff8a75]'
                            : isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-[#131722] border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${hasUpdate ? 'bg-[#fa5a3f]' : 'bg-emerald-500'}`} />
                        <span>{hasUpdate ? `Update Available: Version v${latestVersion} is ready to install.` : `Server Checked: You are running the latest version (v${displayVersion}).`}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Clean Legal & Compliance Section */}
                  <div
                    className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{
                      background: isLight ? '#f8fafc' : '#0f121a',
                      borderColor: isLight ? '#e2e8f0' : '#1e2433',
                    }}
                  >
                    <div className="space-y-0.5">
                      <span className={`text-xs font-semibold block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        Legal & Compliance
                      </span>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Licensed under Software Agreement · Copyright © 2026 Prince (prince19112003).
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPolicyDoc('terms')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isLight
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
                            : 'bg-[#141822] hover:bg-[#1a202c] border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <Codicon name="law" size={13} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
                        <span>Terms of Service</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPolicyDoc('privacy')}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isLight
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
                            : 'bg-[#141822] hover:bg-[#1a202c] border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <Codicon name="shield" size={13} className={isLight ? 'text-slate-500' : 'text-slate-400'} />
                        <span>Privacy Policy</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Settings Footer */}
          <footer className={`md:col-span-12 mt-6 pt-4 pb-2 border-t text-center shrink-0 space-y-1 ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <p className={`text-[11px] font-mono tracking-wider uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Copyright © July 23, 2026 – Present Prince (prince19112003) · All Rights Reserved
            </p>
            <p className={`text-[10px] font-mono tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              Licensed under Software Agreement · Unauthorized copying, decompilation, or distribution is strictly prohibited
            </p>
          </footer>

        </div>
      </div>

      {/* Modern, Minimal Professional Privacy Policy & Terms of Service Modal */}
      {policyDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`w-full max-w-xl rounded-xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
              isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#0d1017] border-slate-800 text-slate-200'
            }`}
          >
            {/* Modal Header with Segmented Switcher and Close button */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b shrink-0"
              style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}
            >
              <div className={`inline-flex p-1 rounded-lg border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#151923] border-slate-800'}`}>
                <button
                  type="button"
                  onClick={() => setPolicyDoc('terms')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    policyDoc === 'terms'
                      ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Codicon name="law" size={13} />
                  <span>Terms of Service</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPolicyDoc('privacy')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    policyDoc === 'privacy'
                      ? isLight ? 'bg-white text-slate-900 shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Codicon name="shield" size={13} />
                  <span>Privacy Policy</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPolicyDoc(null)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
                    : 'bg-[#151923] hover:bg-[#1f2636] border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Close"
              >
                <Codicon name="close" size={14} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto px-6 py-5 space-y-4 text-xs leading-relaxed">
              {policyDoc === 'privacy' ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: isLight ? '#f1f5f9' : '#1e2433' }}>
                    <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Privacy & Data Protection
                    </span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Effective: August 2026
                    </span>
                  </div>

                  <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    TreadCode is built with a local-first privacy mindset. We believe learning tools should never track you or get in your way.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        1. 100% Local-First Execution
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        All your code snippets, execution traces, variable states, and memory diagrams run directly on your own computer. None of your code or scripts are ever uploaded to cloud servers.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        2. Zero Personal Tracking
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        We never collect personal identity details, email addresses, student records, browsing histories, or keystrokes. Your work and study sessions remain completely private.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        3. Anonymous Hardware ID (HWID)
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        When activating a key or checking for updates, only an anonymous hashed hardware identifier is used to verify that your license seat limit is respected on the licensing server.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        4. Local Settings & Sandbox Storage
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        Your screen preferences, dark/light theme, narration voices, and offline tokens are stored locally on your device in standard system app storage.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        5. Direct Help & Support
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        If you ever need to transfer your license to a new computer or have questions, feel free to reach out via the in-app Feedback tab or directly to Prince.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: isLight ? '#f1f5f9' : '#1e2433' }}>
                    <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Terms of Service & License Agreement
                    </span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Effective: August 2026
                    </span>
                  </div>

                  <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    By using TreadCode, you agree to these simple and fair terms designed to protect the software while keeping your experience smooth and transparent.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        1. Software License & Usage
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        TreadCode is built to help you understand algorithms, memory behavior, and code flow visually. You are granted a personal license to use all visualizers, practice lessons, and diagnostics for self-learning, teaching, and study.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        2. Device Limits & Hardware Binding (HWID)
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        Your access key binds to your computer's hardware ID to activate your seat. Please keep your key safe and do not share or distribute keys across unauthorized devices to avoid automatic license locking.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        3. Respect the Work & Code
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        All visualizers, animation engines, themes, and application assets are created and owned by Prince (prince19112003). Please do not reverse-engineer, decompile, or repackage and resell the software.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        4. Classroom & Content Creation Rights
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        You are 100% welcome to use TreadCode in your YouTube tutorials, coding streams, college lectures, and classroom presentations. We only ask that you give a friendly shoutout to TreadCode.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#131722] border-slate-800/80'}`}>
                      <h4 className={`font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        5. Updates & Direct Support
                      </h4>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                        We continuously work on performance improvements, bug fixes, and new visual modules. If you ever run into an issue or need help, reach out anytime through the in-app Feedback tab.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-between px-6 py-3.5 border-t shrink-0"
              style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}
            >
              <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                TreadCode Desktop · Legal Document
              </span>

              <button
                type="button"
                onClick={() => setPolicyDoc(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
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
