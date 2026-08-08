import React, { useState } from 'react';
import { Monitor, Info, ChevronRight } from 'lucide-react';
import { PageTransition } from '@shared/components/ui/PageTransition';
import { motion } from 'motion/react';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';

/* =========================================================
   SETTINGS PAGE
   ========================================================= */
export const SettingsPage: React.FC = () => {
  const [fontSizeVal, setFontSizeVal] = useState(16);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [policyDoc, setPolicyDoc] = useState<'privacy' | 'terms' | null>(null);
  const { hasUpdate, latestVersion, currentVersion } = useUpdateChecker();

  const sections = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Monitor,
      iconColor: '#6366f1',
      content: (
        <>
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
                onChange={e => {
                  const size = Number(e.target.value);
                  setFontSizeVal(size);
                  document.documentElement.style.setProperty('--code-font-size', `${size}px`);
                }}
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


