import React, { useState } from 'react';
import { Monitor, Zap, Globe, Info, Moon, Sun, Laptop, ChevronRight } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion } from 'motion/react';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';

/* =========================================================
   SETTINGS PAGE
   ========================================================= */
export const SettingsPage: React.FC = () => {
  const [speed, setSpeed] = useState('1x');
  const [fontSizeVal, setFontSizeVal] = useState(16);
  const [themeVal, setThemeVal] = useState<'dark' | 'light' | 'system'>('dark');
  const [langVal, setLangVal] = useState('English');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { hasUpdate, latestVersion, currentVersion } = useUpdateChecker();

  const sections = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Monitor,
      iconColor: '#6366f1',
      content: (
        <>
          {/* Theme */}
          <SettingRow label="Theme" description="Choose your preferred color scheme.">
            <div className="flex gap-2">
              {(['dark', 'light', 'system'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setThemeVal(t)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150"
                  style={{
                    color: themeVal === t ? '#f0f2f8' : '#8b92a8',
                    background: themeVal === t ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${themeVal === t ? 'rgba(99,102,241,0.40)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {t === 'dark' && <Moon className="w-3.5 h-3.5" />}
                  {t === 'light' && <Sun className="w-3.5 h-3.5" />}
                  {t === 'system' && <Laptop className="w-3.5 h-3.5" />}
                  {t}
                </button>
              ))}
            </div>
          </SettingRow>

          <Divider />

          {/* Font Size */}
          <SettingRow label="Font Size" description={`Code display size: ${fontSizeVal}px`}>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: '#525870' }}>Aa</span>
              <input
                type="range"
                min={12}
                max={24}
                step={1}
                value={fontSizeVal}
                onChange={e => setFontSizeVal(Number(e.target.value))}
                className="w-28"
                style={{ accentColor: '#6366f1' }}
              />
              <span className="text-sm font-bold" style={{ color: '#525870' }}>Aa</span>
            </div>
          </SettingRow>
        </>
      ),
    },
    {
      id: 'playback',
      label: 'Playback',
      icon: Zap,
      iconColor: '#f59e0b',
      content: (
        <SettingRow label="Default Animation Speed" description="Set how fast visualizations play automatically.">
          <div className="flex gap-2">
            {['0.5x', '1x', '1.5x', '2x'].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: speed === s ? '#f59e0b' : '#8b92a8',
                  background: speed === s ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${speed === s ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </SettingRow>
      ),
    },
    {
      id: 'language',
      label: 'Localization',
      icon: Globe,
      iconColor: '#22c55e',
      content: (
        <SettingRow label="App Language" description="Change the language of the application interface.">
          <select
            value={langVal}
            onChange={e => setLangVal(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-medium outline-none transition-colors"
            style={{
              color: '#f0f2f8',
              background: '#141620',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {['English', 'Hindi', 'Spanish', 'French'].map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </SettingRow>
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
            FlowTrace — An animation-first learning platform for school students, BCA, DCA, and B.Tech students.
          </p>
          <div className="flex gap-3 pt-2">
            {['Privacy Policy', 'Terms of Service'].map(link => (
              <button
                key={link}
                className="text-xs font-medium transition-colors"
                style={{ color: '#6366f1' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#818cf8')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#6366f1')}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageTransition className="flex flex-col flex-1 overflow-y-auto w-full">
      <div className="flex flex-col py-10 md:py-14 px-4 max-w-2xl mx-auto w-full min-h-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1
            className="text-3xl md:text-4xl font-black mb-2 tracking-tight"
            style={{ color: '#f0f2f8', letterSpacing: '-1px' }}
          >
            Settings
          </h1>
          <p style={{ color: '#8b92a8', fontSize: '15px' }}>
            Customize your learning experience.
          </p>
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

function Divider() {
  return <div className="my-5" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />;
}
