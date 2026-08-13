import { useState, useEffect, useCallback, useRef } from 'react';
import { check, Update } from '@tauri-apps/plugin-updater';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpdateStatus {
  hasUpdate: boolean;
  latestVersion: string | null;
  currentVersion: string;
  changelog: string[];
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
  updateObj: Update | null;
  /** Windows .exe download URL from Firebase (overrides hardcoded fallback) */
  downloadUrl: string | null;
  /** Android APK download URL from Firebase */
  apkUrl: string | null;
  /** macOS .dmg download URL from Firebase */
  macUrl: string | null;
}

// Current App Version built into this .exe (patched by npm run release <version>)
const CURRENT_VERSION = '1.0.8';

// ── Native Desktop / Mobile context guard ─────────────────────────────────────
// Only show update UI when running inside native desktop app (Tauri) or Android APK. Never in web browsers (Vercel).
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    '__TAURI_INTERNALS__' in window ||
    '__TAURI__' in window ||
    '__TAURI_METADATA__' in window ||
    !!(window as any).Capacitor ||
    !!(window as any).AndroidBridge ||
    navigator.userAgent.includes('TreadCodeNative') ||
    navigator.userAgent.includes('Tauri')
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUpdateChecker(): UpdateStatus & {
  dismiss: () => void;
  checkNow: () => void;
} {
  const [status, setStatus] = useState<UpdateStatus>({
    hasUpdate: false,
    latestVersion: null,
    currentVersion: CURRENT_VERSION,
    changelog: [],
    isChecking: false,
    lastChecked: null,
    error: null,
    updateObj: null,
    downloadUrl: null,
    apkUrl: null,
    macUrl: null,
  });

  const checkedRef = useRef(false);

  const checkForUpdate = useCallback(async (_force = false) => {
    // GUARD: Never run in web browser — only in native desktop / mobile app
    if (!isNativeApp()) return;

    setStatus((s) => ({ ...s, isChecking: true, error: null }));

    let updateFound = false;

    // 1. Try Tauri native plugin updater
    try {
      const update = await check();
      if (update && update.available) {
        // Check if user already dismissed this specific version
        const dismissedVer = localStorage.getItem('flowtrace_dismissed_update_ver');
        if (dismissedVer === update.version) {
          setStatus((s) => ({ ...s, isChecking: false, lastChecked: new Date() }));
          return;
        }

        updateFound = true;
        setStatus({
          hasUpdate: true,
          latestVersion: update.version,
          currentVersion: update.currentVersion || CURRENT_VERSION,
          changelog: update.body ? update.body.split('\n') : [],
          isChecking: false,
          lastChecked: new Date(),
          error: null,
          updateObj: update,
          downloadUrl: null,
          apkUrl: null,
          macUrl: null,
        });
        return;
      }
    } catch (err) {
      console.warn('Native Tauri updater check failed/skipped, trying direct RTDB fallback:', err);
    }

    // 2. Direct Fallback to Firebase RTDB (Zero Failure Guaranteed!)
    try {
      const res = await fetch('https://flowtrace-licensing-default-rtdb.firebaseio.com/tauri_updater.json');
      if (res.ok) {
        const data = await res.json();
        if (data && data.version && data.version !== CURRENT_VERSION) {
          // Check if user already dismissed this specific version
          const dismissedVer = localStorage.getItem('flowtrace_dismissed_update_ver');
          if (dismissedVer === data.version) {
            setStatus((s) => ({ ...s, isChecking: false, lastChecked: new Date() }));
            return;
          }

          const notesStr = data.notes || '';
          const platforms = data.platforms || {};

          // Extract per-platform download URLs from Firebase
          const winUrl: string | null =
            platforms['windows-x86_64']?.url || null;
          const apkUrl: string | null =
            platforms['android']?.url || platforms['android-aarch64']?.url || null;
          const macUrl: string | null =
            platforms['darwin-aarch64']?.url || platforms['darwin-x86_64']?.url || null;

          setStatus({
            hasUpdate: true,
            latestVersion: data.version,
            currentVersion: CURRENT_VERSION,
            changelog: notesStr ? notesStr.split('\n') : ['New Features & Enhancements Available'],
            isChecking: false,
            lastChecked: new Date(),
            error: null,
            updateObj: null,
            downloadUrl: winUrl,
            apkUrl,
            macUrl,
          });
          updateFound = true;
          return;
        }
      }
    } catch (rtdbErr) {
      console.error('RTDB update fetch error:', rtdbErr);
    }

    if (!updateFound) {
      setStatus((s) => ({
        ...s,
        hasUpdate: false,
        isChecking: false,
        lastChecked: new Date(),
        error: null,
        updateObj: null,
      }));
    }
  }, []);

  // Dismiss: stores dismissed version in localStorage so it never re-triggers for same version
  const dismiss = useCallback(() => {
    setStatus((s) => {
      if (s.latestVersion) {
        localStorage.setItem('flowtrace_dismissed_update_ver', s.latestVersion);
      }
      return { ...s, hasUpdate: false };
    });
  }, []);

  const checkNow = useCallback(() => checkForUpdate(true), [checkForUpdate]);

  // Check directly 1.2s after app startup & listen to Firebase RTDB for manual Admin Panel forceUpdate toggles
  useEffect(() => {
    // GUARD: Never run in web browser — only in native desktop/mobile app
    if (!isNativeApp()) return;

    if (checkedRef.current) return;
    checkedRef.current = true;
    const t = setTimeout(() => checkForUpdate(true), 1200);

    // Fallback Firebase listener for Admin Panel "Show Update Banner" toggle
    let unsubSettings: (() => void) | null = null;
    import('@shared/config/firebase').then(({ db }) => {
      import('firebase/database').then(({ ref, onValue }) => {
        const settingsRef = ref(db, 'global_settings');
        unsubSettings = onValue(settingsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data.forceUpdate) {
              const targetVer = data.targetVersion || CURRENT_VERSION;
              // Don't re-show if user already dismissed this version
              const dismissedVer = localStorage.getItem('flowtrace_dismissed_update_ver');
              if (dismissedVer === targetVer) return;

              // Fetch full tauri_updater data so we have real per-platform URLs
              import('firebase/database').then(({ get }) => {
                const updaterRef = ref(db, 'tauri_updater');
                get(updaterRef).then((updaterSnap) => {
                  if (updaterSnap.exists()) {
                    const ud = updaterSnap.val();
                    const platforms = ud.platforms || {};
                    const winUrl: string | null = platforms['windows-x86_64']?.url || null;
                    const apkUrl: string | null =
                      platforms['android']?.url || platforms['android-aarch64']?.url || null;
                    const macUrl: string | null =
                      platforms['darwin-aarch64']?.url || platforms['darwin-x86_64']?.url || null;

                    setStatus((s) => ({
                      ...s,
                      hasUpdate: true,
                      latestVersion: targetVer,
                      changelog: ud.notes ? ud.notes.split('\n') : s.changelog,
                      downloadUrl: winUrl || s.downloadUrl,
                      apkUrl: apkUrl || s.apkUrl,
                      macUrl: macUrl || s.macUrl,
                    }));
                  } else {
                    setStatus((s) => ({
                      ...s,
                      hasUpdate: true,
                      latestVersion: targetVer,
                    }));
                  }
                }).catch(() => {
                  setStatus((s) => ({
                    ...s,
                    hasUpdate: true,
                    latestVersion: targetVer,
                  }));
                });
              });
            }
          }
        });
      });
    });

    return () => {
      clearTimeout(t);
      if (unsubSettings) unsubSettings();
    };
  }, [checkForUpdate]);

  return { ...status, dismiss, checkNow };
}
