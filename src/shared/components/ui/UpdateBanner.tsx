import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUpdateChecker } from '@shared/hooks/useUpdateChecker';

// ─── Update Modal ─────────────────────────────────────────────────────────────

export interface UpdateModalProps {
  forceShow?: boolean;
  onClosePreview?: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ forceShow, onClosePreview }) => {
  const {
    hasUpdate: realHasUpdate,
    latestVersion: realLatestVersion,
    currentVersion,
    changelog: realChangelog,
    downloadUrl: realDownloadUrl,
    dismiss: realDismiss,
  } = useUpdateChecker();

  const isPreview = Boolean(forceShow);
  const hasUpdate = isPreview || realHasUpdate;
  const latestVersion = isPreview ? '1.2.0' : (realLatestVersion || '1.2.0');
  const changelog = isPreview
    ? [
        'Added Graphs (DFS & BFS Animations)',
        'Polyglot Code Switcher (Python, C++, Java, C)',
        'New High-Performance Desktop Visualizer Stage',
        'Offline Auto-Updater Support'
      ]
    : realChangelog;
  const downloadUrl = isPreview ? 'https://github.com/prince19112003/FlowTrace/archive/refs/heads/main.zip' : realDownloadUrl;
  const dismiss = () => {
    if (onClosePreview) onClosePreview();
    realDismiss();
  };

  const [phase, setPhase] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  // Reset phase when modal appears for new update
  useEffect(() => {
    if (hasUpdate) {
      setPhase('idle');
      setProgress(0);
    }
  }, [hasUpdate]);

  const handleUpdate = async () => {
    setPhase('downloading');
    setProgress(0);

    // Smooth in-app progress bar simulation while binary downloads directly
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          return 95;
        }
        return p + 5;
      });
    }, 120);

    try {
      try {
        const { open } = await import('@tauri-apps/plugin-shell');
        await open(downloadUrl);
      } catch (err) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.download = `TreadCode_Setup.exe`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setPhase('done');
      }, 2500);
    } catch (e) {
      console.error('Direct download error:', e);
      clearInterval(interval);
    }
  };

  const handleDismiss = () => {
    setPhase('idle');
    setProgress(0);
    dismiss();
  };

  return (
    <AnimatePresence>
      {hasUpdate && (
        <>
          {/* Backdrop */}
          <motion.div
            key="update-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={phase === 'idle' ? handleDismiss : undefined}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0, 0, 8, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 9998,
              cursor: phase === 'idle' ? 'pointer' : 'default',
            }}
          />

          {/* Centering Wrapper */}
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            padding: '16px',
          }}>
            {/* Modal */}
            <motion.div
              key="update-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                width: 'min(500px, 100%)',
                maxHeight: '90vh',
                overflowY: 'auto',
                pointerEvents: 'auto',
              }}
            >
            <div style={{
              background: 'rgba(5, 5, 18, 0.96)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 0 60px rgba(99,102,241,0.18), 0 24px 64px rgba(0,0,0,0.7)',
            }}>
              {/* Rainbow top line */}
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 33%, #22d3ee 66%, #f472b6 100%)',
              }} />

              <div style={{ padding: '28px 28px 24px' }}>

                {/* ── IDLE PHASE ─────────────────────────────────────────── */}
                {phase === 'idle' && (
                  <>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '22px' }}>
                      {/* Animated icon */}
                      <motion.div
                        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        style={{
                          width: '52px', height: '52px', flexShrink: 0,
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25))',
                          border: '1px solid rgba(99,102,241,0.4)',
                          borderRadius: '14px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 24px rgba(99,102,241,0.3)',
                        }}
                      >
                        {/* Download arrow icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <motion.path
                            d="M12 3v11"
                            stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          />
                          <motion.path
                            d="M8 10l4 4 4-4"
                            stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ delay: 0.6, duration: 0.35 }}
                          />
                          <motion.path
                            d="M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1"
                            stroke="#a855f7" strokeWidth="2" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ delay: 0.9, duration: 0.4 }}
                          />
                        </svg>
                      </motion.div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '18px', fontWeight: 700, color: '#f1f5f9',
                            fontFamily: 'system-ui, sans-serif',
                          }}>
                            Update Available
                          </span>
                          {/* Pulse badge */}
                          <motion.div
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{
                              padding: '3px 10px', borderRadius: '100px',
                              background: 'rgba(99,102,241,0.2)',
                              border: '1px solid rgba(99,102,241,0.4)',
                              fontSize: '11px', fontWeight: 700,
                              color: '#a5b4fc', letterSpacing: '0.05em',
                            }}
                          >
                            NEW
                          </motion.div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.7)', fontFamily: 'monospace' }}>
                            v{currentVersion}
                          </span>
                          <span style={{ color: 'rgba(99,102,241,0.6)', fontSize: '14px' }}>→</span>
                          <span style={{
                            fontSize: '12px', fontFamily: 'monospace', fontWeight: 600,
                            background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                          }}>
                            v{latestVersion}
                          </span>
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        onClick={handleDismiss}
                        style={{
                          width: '30px', height: '30px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.04)',
                          color: 'rgba(148,163,184,0.7)',
                          cursor: 'pointer', fontSize: '14px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s',
                        }}
                        title="Remind me later"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Changelog */}
                    {changelog.length > 0 && (
                      <div style={{
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(99,102,241,0.15)',
                        borderRadius: '12px',
                        padding: '16px 18px',
                        marginBottom: '22px',
                      }}>
                        <p style={{
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                          textTransform: 'uppercase', color: '#818cf8',
                          marginBottom: '12px', fontFamily: 'system-ui',
                        }}>
                          ✦ &nbsp;What's New in v{latestVersion}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {changelog.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + i * 0.08 }}
                              style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                            >
                              <span style={{
                                width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '9px',
                              }}>✓</span>
                              <span style={{
                                fontSize: '12.5px', color: 'rgba(203,213,225,0.9)',
                                fontFamily: 'system-ui', lineHeight: '1.5',
                              }}>
                                {item}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={handleDismiss}
                        style={{
                          flex: 1, padding: '11px',
                          border: '1px solid rgba(99,102,241,0.2)',
                          borderRadius: '10px',
                          background: 'rgba(99,102,241,0.06)',
                          color: 'rgba(148,163,184,0.8)',
                          cursor: 'pointer', fontSize: '13px',
                          fontFamily: 'system-ui',
                          transition: 'all 0.2s',
                        }}
                      >
                        Later
                      </button>
                      <motion.button
                        onClick={handleUpdate}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          flex: 2.5, padding: '11px',
                          border: 'none', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                          color: 'white',
                          cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                          fontFamily: 'system-ui',
                          boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3v11M8 10l4 4 4-4M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download & Update
                      </motion.button>
                    </div>

                    <p style={{
                      textAlign: 'center', marginTop: '12px',
                      fontSize: '10.5px', color: 'rgba(100,116,139,0.8)',
                      fontFamily: 'system-ui',
                    }}>
                      A .zip file will be downloaded. Extract and replace your current folder.
                    </p>
                  </>
                )}

                {/* ── DOWNLOADING PHASE ──────────────────────────────────── */}
                {phase === 'downloading' && (
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    {/* Animated rings */}
                    <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 20px' }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        style={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          border: '3px solid transparent',
                          borderTopColor: '#6366f1',
                          borderRightColor: 'rgba(99,102,241,0.2)',
                        }}
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                        style={{
                          position: 'absolute', inset: '10px', borderRadius: '50%',
                          border: '2px solid transparent',
                          borderTopColor: '#a855f7',
                          borderLeftColor: 'rgba(168,85,247,0.2)',
                        }}
                      />
                      <div style={{
                        position: 'absolute', inset: '20px', borderRadius: '50%',
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#a5b4fc' }}>
                          {progress}%
                        </span>
                      </div>
                    </div>

                    <p style={{
                      fontSize: '15px', fontWeight: 600, color: '#f1f5f9',
                      marginBottom: '6px', fontFamily: 'system-ui',
                    }}>
                      Preparing Update...
                    </p>
                    <p style={{
                      fontSize: '12px', color: 'rgba(148,163,184,0.7)',
                      marginBottom: '20px', fontFamily: 'system-ui',
                    }}>
                      Downloading FlowTrace v{latestVersion}
                    </p>

                    {/* Progress bar */}
                    <div style={{
                      height: '6px', background: 'rgba(99,102,241,0.12)',
                      borderRadius: '100px', overflow: 'hidden',
                    }}>
                      <motion.div
                        style={{
                          height: '100%', borderRadius: '100px',
                          background: 'linear-gradient(90deg, #6366f1, #a855f7, #22d3ee)',
                          width: `${progress}%`,
                          boxShadow: '0 0 12px rgba(99,102,241,0.8)',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(100,116,139,0.7)', fontFamily: 'monospace' }}>
                        FlowTrace-latest.zip
                      </span>
                      <span style={{ fontSize: '10px', color: '#818cf8', fontFamily: 'monospace' }}>
                        {progress < 100 ? 'Downloading...' : 'Complete!'}
                      </span>
                    </div>
                  </div>
                )}

                {/* ── DONE PHASE ─────────────────────────────────────────── */}
                {phase === 'done' && (
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        width: '72px', height: '72px', margin: '0 auto 18px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.25))',
                        border: '2px solid rgba(34,197,94,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(34,197,94,0.2)',
                      }}
                    >
                      <motion.svg
                        width="32" height="32" viewBox="0 0 24 24" fill="none"
                        initial={{ pathLength: 0 }}
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        />
                      </motion.svg>
                    </motion.div>

                    <p style={{
                      fontSize: '16px', fontWeight: 700, color: '#f1f5f9',
                      marginBottom: '8px', fontFamily: 'system-ui',
                    }}>
                      Download Complete!
                    </p>
                    <p style={{
                      fontSize: '12.5px', color: 'rgba(148,163,184,0.75)',
                      marginBottom: '22px', fontFamily: 'system-ui', lineHeight: '1.6',
                    }}>
                      <strong style={{ color: '#a5b4fc' }}>FlowTrace_Setup.exe</strong> has been downloaded directly inside your downloads.<br />
                      Run the downloaded installer to instantly apply the update without losing any data.
                    </p>

                    <div style={{
                      background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
                      border: '1px solid rgba(99,102,241,0.15)',
                      padding: '14px 16px', marginBottom: '20px', textAlign: 'left',
                    }}>
                      {[
                        '1. Open your downloaded FlowTrace_Setup.exe',
                        '2. Click Install / Next',
                        '3. The app will update seamlessly',
                      ].map((step, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          style={{
                            fontSize: '12px', color: 'rgba(203,213,225,0.85)',
                            padding: '3px 0', fontFamily: 'system-ui',
                          }}
                        >
                          {step}
                        </motion.p>
                      ))}
                    </div>

                    <motion.button
                      onClick={handleDismiss}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%', padding: '12px',
                        border: 'none', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600,
                        fontFamily: 'system-ui',
                        boxShadow: '0 0 20px rgba(34,197,94,0.3)',
                      }}
                    >
                      Got it! Close
                    </motion.button>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
  );
};
