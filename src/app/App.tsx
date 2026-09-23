import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { GlobalAppShell } from './layout/GlobalAppShell';
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner';
import { EulaModal } from '@shared/components/ui/EulaModal';
import { KeyIssuedNotificationModal } from '@shared/components/ui/KeyIssuedNotificationModal';
import { SplashPage } from '../pages/SplashPage';
import {
  fetchLicenseDetails,
  clearLicenseCache,
  loadLicenseCache,
  getStoredOrGeneratedHwid,
  resolveSystemHwid,
  subscribeToDeviceKeyRequests,
  checkOrStartDeviceTrial,
  type LicenseValidationResult,
  type KeyRequestItem,
  type DeviceTrialInfo,
} from '../shared/config/firebase';

// Lazy loaded routes for scalability
const LanguageSelectionPage = lazy(() => import('@pages/LanguageSelectionPage').then(m => ({ default: m.LanguageSelectionPage })));
const TopicSelectionPage = lazy(() => import('@pages/TopicSelectionPage').then(m => ({ default: m.TopicSelectionPage })));
const ProgramSelectionPage = lazy(() => import('@pages/ProgramSelectionPage').then(m => ({ default: m.ProgramSelectionPage })));
const VisualizerPage = lazy(() => import('@pages/VisualizerPage').then(m => ({ default: m.VisualizerPage })));
const SettingsPage = lazy(() => import('@pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const LicenseContext = React.createContext<{
  activated: boolean;
  hwid: string;
  settings: Record<string, any>;
  licenseDetails: LicenseValidationResult;
  trialInfo?: DeviceTrialInfo;
  handleActivate: (key: string) => Promise<boolean>;
  deactivateLicense: () => Promise<void> | void;
} | null>(null);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const context = React.useContext(LicenseContext);
  
  if (!context) return <>{children}</>;

  const path = location.pathname;
  const isLanguages = path === '/languages';

  // Global Maintenance Mode check
  if (context.settings.maintenanceMode) {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#05070f] text-white p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400 font-bold text-xl font-mono">
          !
        </div>
        <h2 className="text-xl font-bold mb-1 tracking-tight font-mono">System Maintenance</h2>
        <p className="text-xs text-slate-400 max-w-sm font-mono">
          {context.settings.maintenanceMessage || 'TreadCode is currently offline for scheduled updates. Please try again shortly.'}
        </p>
      </div>
    );
  }

  // Determine user's active tier (normalized to community | professional | enterprise)
  const rawTier = context.activated
    ? (context.licenseDetails?.tier?.toLowerCase() || 'professional')
    : (context.trialInfo?.isTrialActive ? 'enterprise' : 'community');
  const activeTier = (rawTier === 'developer' || rawTier === 'standard' || rawTier === 'professional')
    ? 'professional'
    : (rawTier === 'ultimate' || rawTier === 'enterprise')
      ? 'enterprise'
      : (rawTier === 'free' || rawTier === 'starter' || rawTier === 'community')
        ? 'community'
        : rawTier;

  // Tier module permissions:
  // - community (free): only Python is unlocked (all others require key activation)
  // - professional (developer): all coding languages & DSA unlocked (ML & Networking require Enterprise)
  // - enterprise (ultimate, custom): ALL courses unlocked
  const isModuleLockedForTier = (moduleKey: string) => {
    // 1. Dynamic override from Admin Settings if configured (check both new & legacy tier keys)
    const tierAccess = context.settings?.tierAccess?.[activeTier] 
      || (activeTier === 'professional' ? context.settings?.tierAccess?.['developer'] : undefined)
      || (activeTier === 'enterprise' ? context.settings?.tierAccess?.['ultimate'] : undefined)
      || (activeTier === 'community' ? context.settings?.tierAccess?.['free'] : undefined);

    if (tierAccess) {
      const key = moduleKey === 'javascript' ? ('js' in tierAccess ? 'js' : 'javascript') : moduleKey;
      if (typeof tierAccess[key] === 'boolean') {
        return !tierAccess[key];
      }
    }

    // 2. Default fallbacks
    if (activeTier === 'community') {
      return moduleKey !== 'python';
    }
    if (activeTier === 'professional') {
      if (moduleKey === 'ml' || moduleKey === 'networking') return true;
      return false;
    }
    // Enterprise, Custom, or any other institution-named key: everything unlocked
    return false;
  };

  // Intercept locked path routes based on tier or maintenance/admin overrides
  if (!isLanguages) {
    let currentModule = '';
    if (path.includes('/python')) currentModule = 'python';
    else if (path.includes('/c/') || path.endsWith('/c')) currentModule = 'c';
    else if (path.includes('/cpp')) currentModule = 'cpp';
    else if (path.includes('/java')) currentModule = 'java';
    else if (path.includes('/dsa')) currentModule = 'dsa';
    else if (path.includes('/ml')) currentModule = 'ml';
    else if (path.includes('/networking')) currentModule = 'networking';
    else if (path.includes('/oops')) currentModule = 'oops';
    else if (path.includes('/sql')) currentModule = 'sql';
    else if (path.includes('/javascript')) currentModule = 'javascript';

    if (currentModule && isModuleLockedForTier(currentModule)) {
      return <LicenseModal onActivate={context.handleActivate} />;
    }
  }

  return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Redirect root to languages */}
        <Route path="/" element={<Navigate to="/languages" replace />} />

        {/* Protected layout routes */}
        <Route element={<GlobalAppShell />}>
          <Route path="/languages" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <LanguageSelectionPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/topics/:languageId" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <TopicSelectionPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/topics/:languageId/programs" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ProgramSelectionPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/topics/:languageId/programs/:topicId" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ProgramSelectionPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/visualizer/:languageId/:topicId/:programId" element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <VisualizerPage />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SettingsPage />
            </Suspense>
          } />

          {/* 404 Catch-all */}
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

import { LicenseModal } from '@shared/components/ui/LicenseModal';
import { FloatingFeedbackWidget } from '@shared/components/ui/FloatingFeedbackWidget';
import { db } from '../shared/config/firebase';
import { ref, onValue } from 'firebase/database';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);
  const [hwid, setHwid] = React.useState<string>(() => getStoredOrGeneratedHwid());
  const [activated, setActivated] = React.useState<boolean | null>(() => {
    const cached = loadLicenseCache();
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('flowtrace_license_key') : null;
    if (storedKey && cached && cached.isValid && cached.licenseKey === storedKey) {
      return true;
    }
    return null;
  });
  const [settings, setSettings] = React.useState<Record<string, any>>({});
  const [licenseDetails, setLicenseDetails] = React.useState<LicenseValidationResult>(() => {
    const cached = loadLicenseCache();
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('flowtrace_license_key') : null;
    if (storedKey && cached && cached.isValid && cached.licenseKey === storedKey) {
      return cached;
    }
    return { isValid: false };
  });
  const [pendingIssuedKey, setPendingIssuedKey] = React.useState<KeyRequestItem | null>(null);
  const [dismissedNoticeKey, setDismissedNoticeKey] = React.useState<string | null>(() => typeof window !== 'undefined' ? localStorage.getItem('flowtrace_dismissed_notice_key') : null);
  const [trialInfo, setTrialInfo] = React.useState<DeviceTrialInfo | null>(null);

  // Sync global settings from firebase database
  React.useEffect(() => {
    const settingsRef = ref(db, 'global_settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSettings(data);
    });

    // Apply saved display tuning for projectors/smartboards & font size
    const savedTuning = localStorage.getItem('flowtrace_display_tuning');
    if (savedTuning) {
      try {
        const { contrast, brightness, saturate, sharpness, warmth, tint } = JSON.parse(savedTuning);
        const c = contrast ?? 100;
        const b = brightness ?? 100;
        const s = saturate ?? 100;
        const sh = sharpness ?? 100;
        const w = warmth ?? 0;
        const t = tint ?? 0;
        if (c === 100 && b === 100 && s === 100 && sh === 100 && w === 0 && t === 0) {
          document.documentElement.style.filter = 'none';
        } else {
          let filterStr = `contrast(${c}%) brightness(${b}%) saturate(${s}%)`;
          if (w > 0) filterStr += ` sepia(${w}%)`;
          if (t !== 0) filterStr += ` hue-rotate(${t}deg)`;
          if (sh !== 100) {
            if (sh < 100) {
              filterStr += ` blur(${(100 - sh) * 0.012}px)`;
            } else {
              const edgeAmt = ((sh - 100) / 100) * 0.6;
              filterStr += ` drop-shadow(0 0 ${edgeAmt}px rgba(0,0,0,0.5))`;
            }
          }
          document.documentElement.style.filter = filterStr;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const savedFontSize = localStorage.getItem('flowtrace_font_size');
    if (savedFontSize) {
      document.documentElement.style.setProperty('--code-font-size', `${savedFontSize}px`);
    }

    return () => unsubscribe();
  }, []);

  const unsubscribeLicenseRef = React.useRef<(() => void) | null>(null);

  const deactivateLicense = async () => {
    if (unsubscribeLicenseRef.current) {
      unsubscribeLicenseRef.current();
      unsubscribeLicenseRef.current = null;
    }
    const cachedKey = localStorage.getItem('flowtrace_license_key');
    const currentHwid = hwid || getStoredOrGeneratedHwid();
    if (cachedKey && currentHwid) {
      try {
        const { remove, ref: dbRef } = await import('firebase/database');
        await remove(dbRef(db, `licenses/${cachedKey}/devices/${currentHwid}`));
      } catch (e) {
        console.warn('Failed to unbind device on server:', e);
      }
    }
    localStorage.removeItem('flowtrace_license_key');
    clearLicenseCache();
    setActivated(false);
    setLicenseDetails({ isValid: false });
  };

  const attachLicenseListener = (key: string, currentHwid: string) => {
    if (unsubscribeLicenseRef.current) {
      unsubscribeLicenseRef.current();
      unsubscribeLicenseRef.current = null;
    }

    const licenseRef = ref(db, `licenses/${key}`);
    unsubscribeLicenseRef.current = onValue(licenseRef, (snapshot) => {
      if (!snapshot.exists()) {
        deactivateLicense();
        return;
      }

      const val = snapshot.val() || {};
      const isBlocked = !!val.blocked;

      // Expiry date check
      let isExpired = false;
      if (val.expiresAt) {
        const expiry = new Date(val.expiresAt);
        if (!isNaN(expiry.getTime()) && new Date() > expiry) {
          isExpired = true;
        }
      }

      const devices = val.devices || {};
      const isDevicePresent = Boolean(devices[currentHwid]);

      if (isBlocked || isExpired || !isDevicePresent) {
        // Admin explicitly unlinked this device from the server, blocked, or expired
        deactivateLicense();
      } else {
        setLicenseDetails(prev => ({
          ...prev,
          isValid: true,
          tier: val.tier || prev.tier,
          customBranding: val.customBranding || prev.customBranding,
          expiresAt: val.expiresAt,
          activeDevicesCount: Object.keys(devices).length,
          maxDevices: val.maxDevices || prev.maxDevices,
          devices: devices,
          licenseKey: key,
        }));
        setActivated(true);
      }
    });
  };

  // Verify license key status at startup & real-time sync with Admin Panel
  React.useEffect(() => {
    let unsubscribeBlacklist: (() => void) | null = null;
    let unsubscribeKeyRequests: (() => void) | null = null;

    async function checkLicense() {
      // 1. Resolve safe HWID
      const currentHwid = await resolveSystemHwid();
      setHwid(currentHwid);

      // Real-time HWID Blacklist listener
      const blacklistRef = ref(db, `blacklisted_hwids/${currentHwid}`);
      unsubscribeBlacklist = onValue(blacklistRef, (snap) => {
        if (snap.exists() && snap.val()) {
          deactivateLicense();
        }
      });

      // 2. Check local key
      const cachedKey = localStorage.getItem('flowtrace_license_key');
      if (cachedKey) {
        const details = await fetchLicenseDetails(cachedKey, currentHwid, false);
        if (details.isValid) {
          setLicenseDetails(details);
          setActivated(true);
          attachLicenseListener(cachedKey, currentHwid);
        } else {
          deactivateLicense();
        }
      } else {
        setActivated(false);
        setLicenseDetails({ isValid: false });
      }

      // 3. Real-time Device Key Request listener (Check if admin issued a key for this device)
      unsubscribeKeyRequests = subscribeToDeviceKeyRequests(currentHwid, async (requests) => {
        const fulfilled = requests.find(r => r.status === 'fulfilled' && r.assignedKey && !r.notifyDismissed);
        if (fulfilled && fulfilled.assignedKey) {
          const currentActiveKey = localStorage.getItem('flowtrace_license_key');
          if (!currentActiveKey || currentActiveKey !== fulfilled.assignedKey) {
            // Check if user dismissed this key on this machine
            const localDismissed = typeof window !== 'undefined' ? localStorage.getItem('flowtrace_dismissed_notice_key') : null;
            if (localDismissed === fulfilled.assignedKey) {
              setPendingIssuedKey(null);
              return;
            }

            // CRITICAL CHECK: Verify key actually exists and is active on Firebase server (not deleted by admin)
            try {
              const { get, ref: dbRef } = await import('firebase/database');
              const licSnap = await get(dbRef(db, `licenses/${fulfilled.assignedKey}`));
              if (licSnap.exists() && !licSnap.val()?.blocked) {
                setPendingIssuedKey(fulfilled);
              } else {
                // Key was deleted or blocked by admin on server — NEVER show alert!
                setPendingIssuedKey(null);
              }
            } catch {
              setPendingIssuedKey(null);
            }
          } else {
            setPendingIssuedKey(null);
          }
        } else {
          setPendingIssuedKey(null);
        }
      });

      // 4. Native Desktop 3-Day Keyless Trial check
      try {
        const trial = await checkOrStartDeviceTrial(currentHwid);
        setTrialInfo(trial);
      } catch (err) {
        console.warn('Trial check failed:', err);
      }
    }

    checkLicense();

    return () => {
      if (unsubscribeLicenseRef.current) {
        unsubscribeLicenseRef.current();
        unsubscribeLicenseRef.current = null;
      }
      if (unsubscribeBlacklist) unsubscribeBlacklist();
      if (unsubscribeKeyRequests) unsubscribeKeyRequests();
    };
  }, []);

  const handleActivate = async (key: string): Promise<boolean> => {
    const currentHwid = hwid || getStoredOrGeneratedHwid();
    const details = await fetchLicenseDetails(key, currentHwid, true);
    if (details.isValid) {
      localStorage.setItem('flowtrace_license_key', key);
      setLicenseDetails(details);
      setActivated(true);
      setPendingIssuedKey(null);
      attachLicenseListener(key, currentHwid);
      return true;
    }
    return false;
  };

  if (activated === null) {
    return <div style={{ background: '#020205', height: '100vh', width: '100vw' }} />;
  }

  return (
    <LicenseContext.Provider
      value={{
        activated: !!activated,
        hwid,
        settings,
        licenseDetails,
        trialInfo: trialInfo || undefined,
        handleActivate,
        deactivateLicense,
      }}
    >
      <BrowserRouter>
        {/* EULA agreement modal — runs once on first launch */}
        {!showSplash && <EulaModal />}

        {/* Real-time In-App Key Ready Alert (Shown until user activates this license) */}
        {!showSplash && pendingIssuedKey && dismissedNoticeKey !== pendingIssuedKey.assignedKey && (
          <KeyIssuedNotificationModal
            request={pendingIssuedKey}
            onActivate={async (k) => {
              const success = await handleActivate(k);
              if (success) {
                setPendingIssuedKey(null);
              }
              return success;
            }}
            onDismiss={() => {
              if (pendingIssuedKey?.assignedKey) {
                setDismissedNoticeKey(pendingIssuedKey.assignedKey);
                localStorage.setItem('flowtrace_dismissed_notice_key', pendingIssuedKey.assignedKey);
              }
              setPendingIssuedKey(null);
            }}
          />
        )}

        {/* Floating Chatbot-Style Bug / Feedback Widget (Shown after splash screen) */}
        {!showSplash && !settings.disableFeedbackWidget && <FloatingFeedbackWidget />}

        {showSplash ? (
          <SplashPage onComplete={() => setShowSplash(false)} />
        ) : (
          <AnimatedRoutes />
        )}
      </BrowserRouter>
    </LicenseContext.Provider>
  );
};
