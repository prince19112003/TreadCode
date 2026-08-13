import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUpdateChecker, isNativeApp } from '@shared/hooks/useUpdateChecker';

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
    updateObj,
    downloadUrl: realDownloadUrl,
    apkUrl: realApkUrl,
    macUrl: realMacUrl,
    dismiss: realDismiss,
  } = useUpdateChecker();

  const isNative = isNativeApp();
  const isPreview = Boolean(forceShow);

  // STRICT GUARD: Only allow showing if running inside native app OR explicitly previewed in settings
  const hasUpdate = (isNative && realHasUpdate) || isPreview;
  const latestVersion = isPreview ? '1.2.0' : (realLatestVersion || currentVersion);
  const changelog = isPreview
    ? [
        'Added Graphs (DFS & BFS Animations)',
        'Polyglot Code Switcher (Python, C++, Java, C)',
        'New High-Performance Desktop Visualizer Stage',
        'Offline Auto-Updater Support',
        'Android Remote Desktop Support',
      ]
    : realChangelog;

  // Download URLs — GitHub Releases fallback instead of non-existent Vercel setup path
  const fallbackWinUrl = `https://github.com/prince19112003/FlowTrace/releases/latest`;
  const downloadUrl = isPreview ? fallbackWinUrl : (realDownloadUrl || fallbackWinUrl);
  const apkUrl = isPreview ? null : realApkUrl;
  const macUrl = isPreview ? null : realMacUrl;

  const dismiss = () => {
    if (onClosePreview) onClosePreview();
    realDismiss(); // persists dismissed version to localStorage
  };

  const [phase, setPhase] = useState<'idle' | 'downloading' | 'done' | 'opened'>('idle');
  const [progress, setProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Detect current OS hint
  const isWindows = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('win');
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');
  const platformHint = isWindows ? 'Windows x64' : isMac ? 'macOS' : 'Windows x64';

  // Reset phase when modal appears for new update
  useEffect(() => {
    if (hasUpdate) {
      setPhase('idle');
      setProgress(0);
      setCopiedLink(false);
    }
  }, [hasUpdate]);

  // ── Action: Tauri native auto-update ────────────────────────────────────────
  const handleAutoUpdate = async () => {
    setPhase('downloading');
    setProgress(0);

    if (isPreview) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPhase('done');
            return 100;
          }
          return p + 10;
        });
      }, 300);
      return;
    }

    try {
      let downloaded = 0;
      let contentLength = 0;

      if (updateObj) {
        // Native Tauri Updater available with verified public key signature
        await updateObj.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              contentLength = event.data.contentLength || 0;
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              if (contentLength > 0) {
                setProgress(Math.round((downloaded / contentLength) * 100));
              }
              break;
            case 'Finished':
              setProgress(100);
              break;
          }
        });
        setPhase('done');
      } else {
        // Fallback: open installer directly
        await openUrl(downloadUrl);
        setProgress(100);
        setPhase('opened');
      }
    } catch (e) {
      console.error('Auto-update install error, opening direct installer:', e);
      await openUrl(downloadUrl);
      setProgress(100);
      setPhase('opened');
    }
  };

  // ── Action: Open a URL via Tauri shell or browser ───────────────────────────
  const openUrl = async (url: string) => {
    if (!url) return;
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(url);
    } catch {
      window.open(url, '_blank');
    }
  };

  // ── Action: Open Windows .exe installer ─────────────────────────────────────
  const handleOpenExe = async () => {
    await openUrl(downloadUrl);
    setPhase('opened');
  };

  // ── Action: Open Android APK ────────────────────────────────────────────────
  const handleOpenApk = async () => {
    if (!apkUrl) return;
    await openUrl(apkUrl);
    setPhase('opened');
  };

  // ── Action: Copy download link to clipboard ──────────────────────────────────
  const handleCopyLink = () => {
    const link = downloadUrl;
    if (!link) return;
    try {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      /* silent */
    }
  };

  // ── Action: Restart / relaunch (native Tauri auto-update done) ───────────────
  const handleRestart = async () => {
    try {
      // Try native relaunch first (this works after native Tauri auto-update)
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    } catch (e) {
      console.warn('Native relaunch failed, trying exit so installer can finish:', e);
      try {
        // Exit cleanly so user can run the installer that was opened
        const { exit } = await import('@tauri-apps/plugin-process');
        await exit(0);
      } catch {
        window.location.reload();
      }
    }
  };

  // ── Action: Close app so installer can run (manual download flow) ───────────
  const handleExitForInstaller = async () => {
    try {
      const { exit } = await import('@tauri-apps/plugin-process');
      await exit(0);
    } catch {
      // If exit fails, just dismiss modal — user can close manually
      handleDismiss();
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
                width: 'min(540px, 100%)',
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
                            🚀 New Update Available
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
                        {/* Platform hint */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '2px 8px', borderRadius: '6px',
                          background: 'rgba(99,102,241,0.08)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          fontSize: '10px', color: 'rgba(148,163,184,0.7)', fontFamily: 'monospace',
                        }}>
                          <span style={{ color: '#6366f1' }}>◉</span>
                          Detected: {platformHint}
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
                          {changelog.filter(Boolean).map((item, i) => (
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

                    {/* ── Multiple Download Options ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>

                      {/* Row 1: Auto-Update + Dismiss */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {/* Dismiss */}
                        <button
                          onClick={handleDismiss}
                          style={{
                            padding: '10px 12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(148,163,184,0.8)',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                            fontFamily: 'system-ui',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Later
                        </button>

                        {/* Auto-Update & Restart — native Tauri, only useful for signed builds */}
                        <motion.button
                          onClick={handleAutoUpdate}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            flex: 2, padding: '10px 12px',
                            border: 'none', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            color: 'white',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                            fontFamily: 'system-ui',
                            boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M12 3v11M8 10l4 4 4-4M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Auto-Update & Restart
                        </motion.button>
                      </div>

                      {/* Row 2: Manual download options */}
                      <div style={{
                        padding: '10px 12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '10px',
                      }}>
                        <p style={{
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)',
                          fontFamily: 'system-ui', marginBottom: '8px',
                        }}>
                          Manual Download Options
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>

                          {/* Windows .exe */}
                          <button
                            onClick={handleOpenExe}
                            style={{
                              flex: 1, minWidth: '130px',
                              padding: '8px 10px',
                              border: '1px solid rgba(56,189,248,0.3)',
                              borderRadius: '8px',
                              background: 'rgba(56,189,248,0.08)',
                              color: '#7dd3fc',
                              cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                              fontFamily: 'system-ui',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                              transition: 'all 0.15s',
                            }}
                            title={`Download Windows installer: ${downloadUrl}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            🖥️ Windows .exe
                          </button>

                          {/* Android APK — only shown if URL is set */}
                          {apkUrl && (
                            <button
                              onClick={handleOpenApk}
                              style={{
                                flex: 1, minWidth: '130px',
                                padding: '8px 10px',
                                border: '1px solid rgba(74,222,128,0.3)',
                                borderRadius: '8px',
                                background: 'rgba(74,222,128,0.08)',
                                color: '#86efac',
                                cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                                fontFamily: 'system-ui',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                transition: 'all 0.15s',
                              }}
                              title={`Download Android APK: ${apkUrl}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                <line x1="12" y1="18" x2="12" y2="18"/>
                              </svg>
                              📱 Android APK
                            </button>
                          )}

                          {/* macOS — only shown if URL is set */}
                          {macUrl && (
                            <button
                              onClick={() => openUrl(macUrl).then(() => setPhase('opened'))}
                              style={{
                                flex: 1, minWidth: '130px',
                                padding: '8px 10px',
                                border: '1px solid rgba(192,132,252,0.3)',
                                borderRadius: '8px',
                                background: 'rgba(192,132,252,0.08)',
                                color: '#d8b4fe',
                                cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                                fontFamily: 'system-ui',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                transition: 'all 0.15s',
                              }}
                              title={`Download macOS: ${macUrl}`}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 9c-.64.64-1.521.954-2.402 1.165A6.301 6.301 0 0 0 2 16c0 3.314 2.686 6 6 6h8c3.314 0 6-2.686 6-6a6.301 6.301 0 0 0-4.599-6.065C16.52 9.954 15.64 9.64 15 9"/>
                                <path d="M12 2v7"/>
                              </svg>
                              🍎 macOS
                            </button>
                          )}

                          {/* Copy Link */}
                          <button
                            onClick={handleCopyLink}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '8px',
                              background: copiedLink ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                              color: copiedLink ? '#86efac' : 'rgba(148,163,184,0.7)',
                              cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                              fontFamily: 'system-ui',
                              display: 'flex', alignItems: 'center', gap: '4px',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap',
                            }}
                            title="Copy Windows installer download link to clipboard"
                          >
                            {copiedLink ? '✓ Copied!' : (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <p style={{
                      textAlign: 'center',
                      fontSize: '10.5px', color: 'rgba(100,116,139,0.7)',
                      fontFamily: 'system-ui',
                    }}>
                      Run the installer file after download — your settings and license are preserved.
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
                      Downloading TreadCode v{latestVersion}
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
                        TreadCode-v{latestVersion}-setup.exe
                      </span>
                      <span style={{ fontSize: '10px', color: '#818cf8', fontFamily: 'monospace' }}>
                        {progress < 100 ? 'Downloading...' : 'Complete!'}
                      </span>
                    </div>
                  </div>
                )}

                {/* ── OPENED PHASE (manual installer opened) ─────────────── */}
                {phase === 'opened' && (
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        width: '72px', height: '72px', margin: '0 auto 18px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))',
                        border: '2px solid rgba(56,189,248,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(56,189,248,0.2)',
                        fontSize: '28px',
                      }}
                    >
                      ↗
                    </motion.div>

                    <p style={{
                      fontSize: '16px', fontWeight: 700, color: '#f1f5f9',
                      marginBottom: '8px', fontFamily: 'system-ui',
                    }}>
                      Installer Opened!
                    </p>
                    <p style={{
                      fontSize: '12.5px', color: 'rgba(148,163,184,0.75)',
                      marginBottom: '22px', fontFamily: 'system-ui', lineHeight: '1.6',
                    }}>
                      The setup file has opened in your browser/downloads.<br />
                      <strong style={{ color: '#a5b4fc' }}>Close this app first</strong>, then run the installer.<br />
                      Your license key and settings will be preserved.
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleDismiss}
                        style={{
                          flex: 1, padding: '11px',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(148,163,184,0.8)', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 600,
                          fontFamily: 'system-ui',
                        }}
                      >
                        Keep App Open
                      </button>
                      <button
                        onClick={handleExitForInstaller}
                        style={{
                          flex: 1.5, padding: '11px',
                          border: 'none', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                          color: 'white', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 700,
                          fontFamily: 'system-ui',
                          boxShadow: '0 0 20px rgba(14,165,233,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                      >
                        🔒 Close App & Run Installer
                      </button>
                    </div>
                  </div>
                )}


                {/* ── DONE PHASE (native auto-update complete) ───────────── */}
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
                      Update Installed!
                    </p>
                    <p style={{
                      fontSize: '12.5px', color: 'rgba(148,163,184,0.75)',
                      marginBottom: '22px', fontFamily: 'system-ui', lineHeight: '1.6',
                    }}>
                      <strong style={{ color: '#4ade80' }}>TreadCode v{latestVersion} is ready.</strong><br />
                      Restart the app to apply the latest features and improvements.
                    </p>

                    <motion.button
                      onClick={handleRestart}
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
                      Restart App Now
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
