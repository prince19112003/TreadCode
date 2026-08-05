import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { GlobalAppShell } from './layout/GlobalAppShell';
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { SplashPage } from '../pages/SplashPage';

// Lazy loaded routes for scalability
const LanguageSelectionPage = lazy(() => import('@pages/LanguageSelectionPage').then(m => ({ default: m.LanguageSelectionPage })));
const TopicSelectionPage = lazy(() => import('@pages/TopicSelectionPage').then(m => ({ default: m.TopicSelectionPage })));
const ProgramSelectionPage = lazy(() => import('@pages/ProgramSelectionPage').then(m => ({ default: m.ProgramSelectionPage })));
const VisualizerPage = lazy(() => import('@pages/VisualizerPage').then(m => ({ default: m.VisualizerPage })));
const SettingsPage = lazy(() => import('@pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Context hook values to expose activation states globally
export const LicenseContext = React.createContext<{
  activated: boolean;
  hwid: string;
  handleActivate: (key: string) => Promise<boolean>;
} | null>(null);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const context = React.useContext(LicenseContext);
  
  if (!context) return <>{children}</>;

  // Check if current route matches unlocked path
  const isPython = location.pathname.includes('/python');
  const isLanguages = location.pathname === '/languages';

  // If app is not activated and user tries to access C, C++, Java, or DSA sections, intercept and lock
  if (!context.activated && !isPython && !isLanguages) {
    return <LicenseModal onActivate={context.handleActivate} />;
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
import { validateLicenseKey } from '../shared/config/firebase';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);
  const [activated, setActivated] = React.useState<boolean | null>(null);
  const [hwid, setHwid] = React.useState('fallback-device-id-xxxx');

  // Verify license key status at startup
  React.useEffect(() => {
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

      // 2. Check local key
      const cachedKey = localStorage.getItem('flowtrace_license_key');
      if (cachedKey) {
        const isValid = await validateLicenseKey(cachedKey, currentHwid);
        setActivated(isValid);
      } else {
        setActivated(false);
      }
    }
    checkLicense();
  }, []);

  const handleActivate = async (key: string): Promise<boolean> => {
    const isValid = await validateLicenseKey(key, hwid);
    if (isValid) {
      localStorage.setItem('flowtrace_license_key', key);
      setActivated(true);
    }
    return isValid;
  };

  if (activated === null) {
    return <div style={{ background: '#020205', height: '100vh', width: '100vw' }} />;
  }

  return (
    <LicenseContext.Provider value={{ activated: !!activated, hwid, handleActivate }}>
      <BrowserRouter>
        {/* Global in-app update modal — renders above everything */}
        <UpdateModal />

        {showSplash ? (
          <SplashPage onComplete={() => setShowSplash(false)} />
        ) : (
          <AnimatedRoutes />
        )}
      </BrowserRouter>
    </LicenseContext.Provider>
  );
};
