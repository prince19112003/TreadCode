import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { GlobalAppShell } from './layout/GlobalAppShell';
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner';
import { EulaModal } from '@shared/components/ui/EulaModal';
import { SplashPage } from '../pages/SplashPage';
import { fetchLicenseDetails, clearLicenseCache, type LicenseValidationResult } from '../shared/config/firebase';

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
  handleActivate: (key: string) => Promise<boolean>;
  deactivateLicense: () => void;
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

  // Retrieve locking states for each course module
  const lockPython = !!context.settings.lockPython;
  const lockC = !!context.settings.lockC;
  const lockCpp = !!context.settings.lockCpp;
  const lockJava = !!context.settings.lockJava;
  const lockDsa = !!context.settings.lockDsa;
  const lockMl = !!context.settings.lockMl;
  const lockNetworking = !!context.settings.lockNetworking;
  const lockOops = !!context.settings.lockOops;
  const lockSql = !!context.settings.lockSql;
  const lockJs = !!context.settings.lockJs;

  // Intercept locked path routes if license is not activated yet
  if (!context.activated && !isLanguages) {
    if (path.includes('/python') && lockPython) return <LicenseModal onActivate={context.handleActivate} />;
    if ((path.includes('/c/') || path.endsWith('/c')) && (lockC || lockCpp)) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/cpp') && lockCpp) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/java') && lockJava) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/dsa') && lockDsa) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/ml') && lockMl) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/networking') && lockNetworking) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/oops') && lockOops) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/sql') && lockSql) return <LicenseModal onActivate={context.handleActivate} />;
    if (path.includes('/javascript') && lockJs) return <LicenseModal onActivate={context.handleActivate} />;
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
  const [activated, setActivated] = React.useState<boolean | null>(null);
  const [hwid, setHwid] = React.useState('fallback-device-id-xxxx');
  const [settings, setSettings] = React.useState<Record<string, any>>({});
  const [licenseDetails, setLicenseDetails] = React.useState<LicenseValidationResult>({ isValid: false });

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
        const { contrast, brightness, saturate } = JSON.parse(savedTuning);
        const c = contrast || 100;
        const b = brightness || 100;
        const s = saturate || 100;
        if (c === 100 && b === 100 && s === 100) {
          document.documentElement.style.filter = 'none';
        } else {
          document.documentElement.style.filter = `contrast(${c}%) brightness(${b}%) saturate(${s}%)`;
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

  // Verify license key status at startup & real-time sync with Admin Panel
  React.useEffect(() => {
    let unsubscribeLicense: (() => void) | null = null;
    let unsubscribeBlacklist: (() => void) | null = null;

    async function checkLicense() {
      // 1. Fetch HWID from Tauri
      let currentHwid = 'fallback-device-id-xxxx';
      if ((window as any).__TAURI_INTERNALS__) {
        try {
          const { invoke } = await import('@tauri-apps/api/core') as any;
          currentHwid = await invoke('get_hwid');
        } catch (e) {
          console.error('Failed to get HWID:', e);
        }
      }
      setHwid(currentHwid);

      // Real-time HWID Blacklist listener: Auto-logout immediately if Admin blacklists this device HWID
      const blacklistRef = ref(db, `blacklisted_hwids/${currentHwid}`);
      unsubscribeBlacklist = onValue(blacklistRef, (snap) => {
        if (snap.exists() && snap.val()) {
          localStorage.removeItem('flowtrace_license_key');
          setActivated(false);
          setLicenseDetails({ isValid: false, blocked: true });
        }
      });

      // 2. Check local key
      const cachedKey = localStorage.getItem('flowtrace_license_key');
      if (cachedKey) {
        const details = await fetchLicenseDetails(cachedKey, currentHwid);
        setLicenseDetails(details);
        setActivated(details.isValid);

        // Real-time listener: Auto-logout immediately if Admin cancels license, removes device, blocks, or license expires
        const licenseRef = ref(db, `licenses/${cachedKey}`);
        unsubscribeLicense = onValue(licenseRef, (snapshot) => {
          if (!snapshot.exists()) {
            // License key was deleted by admin
            localStorage.removeItem('flowtrace_license_key');
            clearLicenseCache();
            setActivated(false);
            setLicenseDetails({ isValid: false });
            return;
          }

          const val = snapshot.val() || {};
          const isBlocked = !!val.blocked;
          const isDeviceRegistered = val.devices && val.devices[currentHwid];

          // Expiry date check — admin can extend this anytime to re-activate
          let isExpired = false;
          if (val.expiresAt) {
            const expiry = new Date(val.expiresAt);
            if (!isNaN(expiry.getTime()) && new Date() > expiry) {
              isExpired = true;
            }
          }

          if (isBlocked || !isDeviceRegistered || isExpired) {
            // License blocked, device removed, or expired — clear offline cache immediately
            localStorage.removeItem('flowtrace_license_key');
            clearLicenseCache();
            setActivated(false);
            setLicenseDetails({ isValid: false, blocked: isBlocked, expired: isExpired, expiresAt: val.expiresAt });
          } else if (val.expiresAt) {
            // License is valid and has expiry — update local state with latest expiry info
            setLicenseDetails(prev => ({ ...prev, expiresAt: val.expiresAt }));
          }
        });
      } else {
        setActivated(false);
        setLicenseDetails({ isValid: false });
      }
    }

    checkLicense();

    return () => {
      if (unsubscribeLicense) unsubscribeLicense();
      if (unsubscribeBlacklist) unsubscribeBlacklist();
    };
  }, []);

  const handleActivate = async (key: string): Promise<boolean> => {
    const details = await fetchLicenseDetails(key, hwid);
    if (details.isValid) {
      localStorage.setItem('flowtrace_license_key', key);
      setLicenseDetails(details);
      setActivated(true);
      return true;
    }
    return false;
  };

  const deactivateLicense = () => {
    localStorage.removeItem('flowtrace_license_key');
    clearLicenseCache();
    setActivated(false);
    setLicenseDetails({ isValid: false });
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
        handleActivate,
        deactivateLicense,
      }}
    >
      <BrowserRouter>
        {/* EULA agreement modal — runs once on first launch */}
        {!showSplash && <EulaModal />}

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
