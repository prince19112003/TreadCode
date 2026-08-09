import React, { useState, useEffect, useContext } from 'react';
import { Monitor, Info, ChevronRight, Volume2, ArrowLeft, Key, ShieldCheck, Copy, Check, RefreshCw, Sun, Tv, Sparkles, Sliders } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion } from 'motion/react';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';
import { useNavigate } from 'react-router-dom';
import { LicenseContext } from '../app/App';

export const applyDisplayTuning = (contrast: number, brightness: number, saturate: number) => {
  const filterStr = `contrast(${contrast}%) brightness(${brightness}%) saturate(${saturate}%)`;
  document.documentElement.style.filter = filterStr;
  localStorage.setItem('flowtrace_display_tuning', JSON.stringify({ contrast, brightness, saturate }));
};

/* =========================================================
   SETTINGS PAGE
   ========================================================= */
export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const licenseContext = useContext(LicenseContext);
  
  const [fontSizeVal, setFontSizeVal] = useState(() => {
    const saved = localStorage.getItem('flowtrace_font_size');
    return saved ? Number(saved) : 16;
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [policyDoc, setPolicyDoc] = useState<'privacy' | 'terms' | null>(null);
  const { hasUpdate, latestVersion, currentVersion } = useUpdateChecker();

  // Display Tuning States
  const [contrastVal, setContrastVal] = useState(100);
  const [brightnessVal, setBrightnessVal] = useState(100);
  const [saturateVal, setSaturateVal] = useState(100);
  const [activePreset, setActivePreset] = useState<'default' | 'projector' | 'smartboard' | 'daylight'>('default');

  // Copy states
  const [copiedHwid, setCopiedHwid] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showChangeKeyInput, setShowChangeKeyInput] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  // Voice States
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedEnVoice, setSelectedEnVoice] = useState<string>(
    () => localStorage.getItem('flowtrace_voice_en') || ''
  );
  const [selectedHiVoice, setSelectedHiVoice] = useState<string>(
    () => localStorage.getItem('flowtrace_voice_hi') || ''
  );

  // Load Display Tuning on mount
  useEffect(() => {
    const saved = localStorage.getItem('flowtrace_display_tuning');
    if (saved) {
      try {
        const { contrast, brightness, saturate } = JSON.parse(saved);
        setContrastVal(contrast || 100);
        setBrightnessVal(brightness || 100);
        setSaturateVal(saturate || 100);
        applyDisplayTuning(contrast || 100, brightness || 100, saturate || 100);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleTuneChange = (c: number, b: number, s: number, preset: 'default' | 'projector' | 'smartboard' | 'daylight' = 'default') => {
    setContrastVal(c);
    setBrightnessVal(b);
    setSaturateVal(s);
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

  const handleKeySubmit = async () => {
    if (!newKeyInput.trim() || !licenseContext) return;
    setIsActivating(true);
    setKeyError('');
    const success = await licenseContext.handleActivate(newKeyInput.trim());
    setIsActivating(false);
    if (success) {
      setShowChangeKeyInput(false);
      setNewKeyInput('');
    } else {
      setKeyError('Invalid or exhausted license key.');
    }
  };

  const rawKey = localStorage.getItem('flowtrace_license_key') || '';
  const maskedKey = rawKey ? `${rawKey.slice(0, 4)}-****-****-${rawKey.slice(-4)}` : 'No License Active';

  const sections = [
    {
      id: 'licensing',
      label: 'Licensing & Account',
      icon: Key,
      iconColor: '#10b981',
      content: (
        <div className="space-y-4 text-xs font-mono">
          {/* Status & Tier Row */}
          <SettingRow
            label="Activation Status"
            description={`Current Status: ${licenseContext?.activated ? 'Activated & Verified' : 'Unregistered / Limited'}`}
          >
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                licenseContext?.activated
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
              }`}>
                <ShieldCheck size={14} />
                <span>{licenseContext?.activated ? 'ACTIVE LICENSE' : 'UNREGISTERED'}</span>
              </span>

              {licenseContext?.licenseDetails?.tier && (
                <span className="px-2.5 py-1 rounded-full border border-indigo-500/40 bg-indigo-950/50 text-indigo-300 font-bold uppercase text-[10px]">
                  {licenseContext.licenseDetails.tier} EDITION
                </span>
              )}
            </div>
          </SettingRow>

          {/* License Key */}
          {licenseContext?.activated && (
            <SettingRow label="License Key" description="Your registered license serial">
              <div className="flex items-center gap-2">
                <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 text-xs">
                  {maskedKey}
                </span>
                <button
                  onClick={() => copyToClipboard(rawKey, 'key')}
                  className="p-1.5 bg-slate-900 border border-slate-700/60 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                  title="Copy License Key"
                >
                  {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </SettingRow>
          )}

          {/* Custom Institution Co-Branding Info */}
          {licenseContext?.licenseDetails?.customBranding?.institutionName && (
            <SettingRow label="Institution Co-Branding" description="Associated Institution & Tier Badge">
              <span className="px-3 py-1 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-300 text-xs font-bold">
                🏛️ {licenseContext.licenseDetails.customBranding.institutionName}
              </span>
            </SettingRow>
          )}

          {/* Hardware Signature (HWID) */}
          <SettingRow label="Device Signature (HWID)" description="Unique hardware signature bound to this system">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 text-[11px] max-w-40 truncate">
                {licenseContext?.hwid}
              </span>
              <button
                onClick={() => copyToClipboard(licenseContext?.hwid || '', 'hwid')}
                className="p-1.5 bg-slate-900 border border-slate-700/60 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
                title="Copy HWID Signature"
              >
                {copiedHwid ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </SettingRow>

          {/* Seat Capacity */}
          {licenseContext?.activated && (
            <SettingRow label="Seat Capacity" description="Device installation limits on this license">
              <span className="text-slate-300 text-xs font-bold">
                {licenseContext.licenseDetails.activeDevicesCount || 1} / {licenseContext.licenseDetails.maxDevices || 1} Devices Registered
              </span>
            </SettingRow>
          )}

          {/* Action: Change Key */}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            {!showChangeKeyInput ? (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono">Manage License Activation</span>
                <button
                  onClick={() => setShowChangeKeyInput(true)}
                  className="px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={13} />
                  <span>{licenseContext?.activated ? 'Change License Key' : 'Activate License'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 bg-slate-950/80 border border-indigo-500/30 p-3 rounded-xl">
                <span className="text-slate-300 text-xs font-bold">Enter New License Key:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="FT-XXXX-XXXX-XXXX"
                    className="flex-1 bg-slate-900 border border-indigo-500/40 text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400 font-mono"
                  />
                  <button
                    onClick={handleKeySubmit}
                    disabled={isActivating}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    {isActivating ? 'Verifying...' : 'Submit'}
                  </button>
                  <button
                    onClick={() => { setShowChangeKeyInput(false); setKeyError(''); }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
                {keyError && <p className="text-rose-400 text-[11px]">{keyError}</p>}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'appearance',
      label: 'Display & Projector Tuning (Faculty)',
      icon: Monitor,
      iconColor: '#6366f1',
      content: (
        <div className="space-y-6">
          {/* Preset Display Modes */}
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              📺 Faculty Classroom Presets
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleTuneChange(100, 100, 100, 'default')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                  activePreset === 'default'
                    ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor size={18} className="text-indigo-400" />
                <span>Studio Dark</span>
              </button>

              <button
                onClick={() => handleTuneChange(130, 115, 110, 'projector')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                  activePreset === 'projector'
                    ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tv size={18} className="text-sky-400" />
                <span>Classroom Projector</span>
              </button>

              <button
                onClick={() => handleTuneChange(115, 105, 140, 'smartboard')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                  activePreset === 'smartboard'
                    ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles size={18} className="text-purple-400" />
                <span>Smartboard Neon</span>
              </button>

              <button
                onClick={() => handleTuneChange(140, 125, 120, 'daylight')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                  activePreset === 'daylight'
                    ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun size={18} className="text-amber-400" />
                <span>Daylight Visibility</span>
              </button>
            </div>
          </div>

          {/* Fine Tuning Sliders */}
          <div className="space-y-4 pt-3 border-t border-white/5">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders size={14} className="text-indigo-400" />
              <span>Fine-Tune Contrast & Brightness</span>
            </p>

            <SettingRow label="Contrast Booster" description={`Screen Contrast: ${contrastVal}%`}>
              <input
                type="range"
                min={80}
                max={160}
                step={5}
                value={contrastVal}
                onChange={e => handleTuneChange(Number(e.target.value), brightnessVal, saturateVal, 'default')}
                className="w-32 accent-indigo-500"
              />
            </SettingRow>

            <SettingRow label="Brightness Level" description={`Screen Brightness: ${brightnessVal}%`}>
              <input
                type="range"
                min={80}
                max={140}
                step={5}
                value={brightnessVal}
                onChange={e => handleTuneChange(contrastVal, Number(e.target.value), saturateVal, 'default')}
                className="w-32 accent-indigo-500"
              />
            </SettingRow>

            <SettingRow label="Color Vividness (Saturation)" description={`Color Saturation: ${saturateVal}%`}>
              <input
                type="range"
                min={80}
                max={160}
                step={5}
                value={saturateVal}
                onChange={e => handleTuneChange(contrastVal, brightnessVal, Number(e.target.value), 'default')}
                className="w-32 accent-indigo-500"
              />
            </SettingRow>

            {/* Font Size */}
            <SettingRow label="Code Display Font Size" description={`Code display size: ${fontSizeVal}px`}>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-bold">Aa</span>
                <input
                  type="range"
                  min={12}
                  max={26}
                  step={1}
                  value={fontSizeVal}
                  onChange={e => {
                    const size = Number(e.target.value);
                    setFontSizeVal(size);
                    localStorage.setItem('flowtrace_font_size', `${size}`);
                    document.documentElement.style.setProperty('--code-font-size', `${size}px`);
                  }}
                  className="w-32 accent-indigo-500"
                />
                <span className="text-sm font-bold text-slate-300">Aa</span>
              </div>
            </SettingRow>
          </div>
        </div>
      ),
    },
    {
      id: 'voice',
      label: 'AI Audio & Voice',
      icon: Volume2,
      iconColor: '#f59e0b',
      content: (
        <div className="space-y-4">
          <SettingRow label="English Voice (Default: Liam)" description="Select voice speaker for English explanations">
            <select
              value={selectedEnVoice}
              onChange={e => handleEnVoiceChange(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-500 max-w-50"
            >
              {availableVoices
                .filter(v => v.lang.includes('en'))
                .map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
            </select>
          </SettingRow>

          <SettingRow label="Hindi Voice (Default: Emily)" description="Select voice speaker for Hindi explanations">
            <select
              value={selectedHiVoice}
              onChange={e => handleHiVoiceChange(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-indigo-500 max-w-50"
            >
              {availableVoices
                .filter(v => v.lang.includes('hi') || v.lang.includes('en'))
                .map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
            </select>
          </SettingRow>
        </div>
      ),
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      iconColor: '#8b5cf6',
      content: (
        <div className="space-y-4 text-sm" style={{ color: '#8b92a8' }}>
          <SettingRow label="FlowTrace Version" description={`Current version: v${currentVersion}`}>
            <div className="flex items-center gap-2">
              {hasUpdate ? (
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shadow-[0_0_12px_rgba(244,63,94,0.3)] bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                >
                  Update Available (v{latestVersion}) 🚀
                </button>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
                  v{currentVersion} (Latest)
                </span>
              )}
            </div>
          </SettingRow>
          <p style={{ color: '#525870', fontSize: '13px' }}>
            FlowTrace — An animation-first learning & teaching platform for professors, faculty, school students, BCA, DCA, and B.Tech classrooms.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setPolicyDoc('privacy')}
              className="text-xs font-medium transition-colors text-indigo-400 hover:text-indigo-300"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setPolicyDoc('terms')}
              className="text-xs font-medium transition-colors text-indigo-400 hover:text-indigo-300"
            >
              Terms of Service
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full">
      <div className="flex flex-col py-8 md:py-10 px-4 max-w-2xl mx-auto w-full min-h-full">

        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1
              className="text-3xl md:text-4xl font-black mb-2 tracking-tight"
              style={{ color: '#f0f2f8', letterSpacing: '-1px' }}
            >
              Settings
            </h1>
            <p style={{ color: '#8b92a8', fontSize: '15px' }}>
              Customize your classroom presentation experience & manage account details.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-600/30 text-indigo-200 text-sm font-semibold transition-all shadow-md"
            title="Back to previous page"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-4 pb-12">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(15, 17, 23, 0.70)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* Section Header */}
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  style={{
                    background: 'rgba(0,0,0,0.20)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${section.iconColor}14`, border: `1px solid ${section.iconColor}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: section.iconColor }} />
                  </div>
                  <h2 className="font-bold text-sm" style={{ color: '#f0f2f8' }}>
                    {section.label}
                  </h2>
                  <ChevronRight className="w-4 h-4 ml-auto" style={{ color: '#373a4f' }} />
                </div>

                {/* Section Content */}
                <div className="px-5 py-5">
                  {section.content}
                </div>
              </motion.div>
            );
          })}
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
                  <p>At FlowTrace, we take your privacy seriously. This Privacy Policy details how we process user data within the desktop application.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">1. Information Collection</h3>
                  <p>We do not collect personal identify information. The app reads your network hardware interface signature (HWID) purely to bind license key credentials securely on our licensing server database.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">2. Licensing Data Protection</h3>
                  <p>All verification requests are processed securely using standard secure database nodes. No usage history, code scripts, or execution flows are tracked or stored externally.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-slate-200">Last updated: August 2026</p>
                  <p>By using the FlowTrace visualizer platform, you agree to comply with these terms.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">1. Software License</h3>
                  <p>FlowTrace grants you a non-exclusive, non-transferable internal license to access the algorithm visualization platform according to the limits authorized by your institution.</p>
                  <h3 className="font-semibold text-slate-200 mt-2">2. Hardware Key Binding</h3>
                  <p>Each license key is securely bound to the hardware signature of the target system. Sharing verification keys beyond the designated limits will result in key blockage.</p>
                </>
              )}
            </div>

            <button
              onClick={() => setPolicyDoc(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Accept & Close
            </button>
          </motion.div>
        </div>
      )}

      {showPreviewModal && (
        <UpdateModal forceShow={true} onClosePreview={() => setShowPreviewModal(false)} />
      )}
    </PageTransition>
  );
};

/* =========================================================
   HELPER COMPONENTS
   ========================================================= */
function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium mb-0.5" style={{ color: '#f0f2f8' }}>{label}</p>
        <p className="text-xs" style={{ color: '#525870' }}>{description}</p>
      </div>
      {children}
    </div>
  );
}
