import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUpdateChecker, isNativeApp } from '@shared/hooks/useUpdateChecker';

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
    linuxUrl: realLinuxUrl,
    usbUrl: realUsbUrl,
    dismiss: realDismiss,
  } = useUpdateChecker();

  const isNative = isNativeApp();
  const isPreview = Boolean(forceShow);

  const hasUpdate = (isNative && realHasUpdate) || isPreview;
  const latestVersion = realLatestVersion || currentVersion;

  // Real changelog only — never dummy placeholder text
  const changelog = realChangelog && realChangelog.length > 0 ? realChangelog.filter(Boolean) : [];

  const fallbackWinUrl = 'https://tread-code-smoky.vercel.app/releases/TreadCode_latest_x64-setup.exe';
  const downloadUrl = realDownloadUrl || fallbackWinUrl;
  const apkUrl = realApkUrl;
  const macUrl = realMacUrl;
  const linuxUrl = realLinuxUrl || 'https://tread-code-smoky.vercel.app/releases/TreadCode_latest_amd64.AppImage';
  const usbUrl = realUsbUrl || 'https://tread-code-smoky.vercel.app/releases/TreadCode_USB_Portable.zip';

  const dismiss = () => {
    if (onClosePreview) onClosePreview();
    realDismiss();
  };

  const [phase, setPhase] = useState<'idle' | 'downloading' | 'done' | 'opened'>('idle');
  const [progress, setProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAndroid = typeof navigator !== 'undefined' && (
    navigator.userAgent.toLowerCase().includes('android') ||
    !!(window as any).Capacitor ||
    !!(window as any).AndroidBridge
  );
  const isLinux = typeof navigator !== 'undefined' && (
    navigator.platform.toLowerCase().includes('linux') &&
    !navigator.userAgent.toLowerCase().includes('android')
  );
  const isWindows = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('win');
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');
  const platformHint = isAndroid
    ? 'Smart Board (Android)'
    : isLinux
      ? 'Linux (BOSS / Ubuntu / KITE)'
      : isWindows
        ? 'Windows x64'
        : isMac
          ? 'macOS'
          : 'Windows x64';

  useEffect(() => {
    if (hasUpdate) {
      setPhase('idle');
      setProgress(0);
      setCopiedLink(false);
    }
  }, [hasUpdate]);

  const handleAutoUpdate = async () => {
    setPhase('downloading');
    setProgress(0);

    if (isPreview && !updateObj) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setPhase('done');
            return 100;
          }
          return p + 10;
        });
      }, 250);
      return;
    }

    try {
      let downloaded = 0;
      let contentLength = 0;
      if (updateObj) {
        await updateObj.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              contentLength = event.data.contentLength || 0;
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              if (contentLength > 0) setProgress(Math.round((downloaded / contentLength) * 100));
              break;
            case 'Finished':
              setProgress(100);
              break;
          }
        });
        setPhase('done');
      } else {
        const targetUrl = isAndroid ? (apkUrl || downloadUrl) : isLinux ? linuxUrl : downloadUrl;
        await openUrl(targetUrl);
        setProgress(100);
        setPhase('opened');
      }
    } catch (e) {
      console.error('Update install error:', e);
      const targetUrl = isAndroid ? (apkUrl || downloadUrl) : isLinux ? linuxUrl : downloadUrl;
      await openUrl(targetUrl);
      setProgress(100);
      setPhase('opened');
    }
  };

  const openUrl = async (url: string) => {
    if (!url) return;
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open(url);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleOpenApk = async () => {
    if (!apkUrl) return;
    await openUrl(apkUrl);
    setPhase('opened');
  };

  const handleCopyLink = () => {
    if (!downloadUrl) return;
    try {
      navigator.clipboard.writeText(downloadUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      /* silent */
    }
  };

  const handleRestart = async () => {
    try {
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    } catch {
      try {
        const { exit } = await import('@tauri-apps/plugin-process');
        await exit(0);
      } catch {
        window.location.reload();
      }
    }
  };

  const handleExitForInstaller = async () => {
    try {
      const { exit } = await import('@tauri-apps/plugin-process');
      await exit(0);
    } catch {
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
            transition={{ duration: 0.15 }}
            onClick={phase === 'idle' ? handleDismiss : undefined}
            className="fixed inset-0 z-9998 bg-black/60 cursor-pointer backdrop-blur-[1px]"
          />

          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none select-none">
            <motion.div
              key="update-modal"
              initial={{ opacity: 0, scale: 0.98, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-97.5 pointer-events-auto rounded-lg border border-slate-800 bg-[#0d1017] text-slate-200 overflow-hidden shadow-2xl"
            >
              {/* Minimal pinkish-orange top accent bar */}
              <div className="h-0.5 w-full bg-[#fa5a3f]" />

              <div className="p-5">
                {/* ── IDLE PHASE ─────────────────────────────────────── */}
                {phase === 'idle' && (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#fa5a3f]" />
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e66]">
                            Software Update
                          </p>
                        </div>
                        <h3 className="text-sm font-semibold text-white leading-tight">
                          TreadCode {latestVersion ? `v${latestVersion}` : ''}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {currentVersion && latestVersion && currentVersion !== latestVersion
                            ? `v${currentVersion} → v${latestVersion}`
                            : latestVersion ? `v${latestVersion}` : ''}
                          {platformHint ? ` · ${platformHint}` : ''}
                        </p>
                      </div>

                      <button
                        onClick={handleDismiss}
                        className="p-1 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer mt-0.5 rounded-md hover:bg-slate-800/60"
                        title="Dismiss"
                        aria-label="Dismiss"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Changelog — rendered only if real changelog entries exist */}
                    {changelog.length > 0 && (
                      <div className="border border-slate-800/90 rounded-md p-3 mb-4 bg-[#080b11]">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                          Changes in this release
                        </p>
                        <div className="space-y-1.5">
                          {changelog.map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-[12px] text-slate-300 leading-snug">
                              <span className="text-[#fa5a3f] mt-0.5 shrink-0">–</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary CTA — minimal, solid pinkish-orange button */}
                    <button
                      onClick={handleAutoUpdate}
                      className="w-full py-2 px-4 rounded-md bg-[#fa5a3f] hover:bg-[#ea4f34] active:bg-[#d84429] text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mb-2 shadow-sm"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {isAndroid ? 'Update Smart Board (.apk)' : isLinux ? 'Download Linux (.AppImage)' : 'Download & Install'}
                    </button>

                    {/* USB Zero-Install Pen Drive Portable Option */}
                    <button
                      onClick={() => openUrl(usbUrl).then(() => setPhase('opened'))}
                      className="w-full py-1.5 px-3 rounded-md border border-slate-800/90 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer mb-2.5"
                      title="Run directly from USB drive with zero installation and zero administrator privileges"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 19v2" />
                        <path d="M10 19v2" />
                        <path d="M14 19v2" />
                        <path d="M18 19v2" />
                        <rect x="4" y="3" width="16" height="16" rx="2" />
                        <path d="M8 7h8" />
                        <path d="M8 11h8" />
                      </svg>
                      <span>USB Portable (.zip) · Zero Install</span>
                    </button>

                    {/* Minimal Secondary Actions */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <button
                        onClick={() => openUrl('https://fadewyng.pages.dev/items/treadcode')}
                        className="flex-1 py-1.5 px-2 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer text-center"
                      >
                        Web Store
                      </button>

                      {apkUrl && !isAndroid && (
                        <button
                          onClick={handleOpenApk}
                          className="flex-1 py-1.5 px-2 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer text-center"
                          title="Download APK for Classroom Smart Boards / TV"
                        >
                          Smart Board (.apk)
                        </button>
                      )}

                      {macUrl && (
                        <button
                          onClick={() => openUrl(macUrl).then(() => setPhase('opened'))}
                          className="flex-1 py-1.5 px-2 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer text-center"
                        >
                          macOS
                        </button>
                      )}

                      <button
                        onClick={handleCopyLink}
                        className="py-1.5 px-2.5 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                        title="Copy direct download link"
                      >
                        {copiedLink ? 'Copied' : 'Copy Link'}
                      </button>

                      <button
                        onClick={handleDismiss}
                        className="py-1.5 px-2 text-slate-500 hover:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Later
                      </button>
                    </div>
                  </>
                )}

                {/* ── DOWNLOADING PHASE ──────────────────────────────── */}
                {phase === 'downloading' && (
                  <div className="py-1 space-y-3.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa5a3f] animate-pulse" />
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e66]">
                          Downloading
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        TreadCode {latestVersion ? `v${latestVersion}` : ''}
                      </p>
                    </div>

                    {/* Non-fancy minimal 2px pinkish-orange progress bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-slate-800 h-0.75 rounded-full overflow-hidden">
                        <div
                          className="bg-[#fa5a3f] h-full transition-all duration-200 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                        <span>Downloading package...</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── OPENED PHASE ───────────────────────────────────── */}
                {phase === 'opened' && (
                  <div className="py-1 space-y-3.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa5a3f]" />
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e66]">
                          Setup Launched
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-white">Installer is ready</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        The installer has been opened. Close TreadCode to complete the installation.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDismiss}
                        className="flex-1 py-2 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                      >
                        Keep Open
                      </button>
                      <button
                        onClick={handleExitForInstaller}
                        className="flex-1 py-2 rounded-md bg-[#fa5a3f] hover:bg-[#ea4f34] text-white font-medium text-xs transition-colors cursor-pointer"
                      >
                        Close & Install
                      </button>
                    </div>
                  </div>
                )}

                {/* ── DONE PHASE ─────────────────────────────────────── */}
                {phase === 'done' && (
                  <div className="py-1 space-y-3.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fa5a3f]" />
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e66]">
                          Ready
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-white">Update verified</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Restart TreadCode to complete the update to {latestVersion ? `v${latestVersion}` : 'latest'}.
                      </p>
                    </div>

                    <button
                      onClick={handleRestart}
                      className="w-full py-2 bg-[#fa5a3f] hover:bg-[#ea4f34] text-white font-medium text-xs rounded-md transition-colors cursor-pointer"
                    >
                      Restart Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
