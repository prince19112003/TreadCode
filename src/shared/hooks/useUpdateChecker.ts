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
}

// Current App Version built into this .exe (patched by npm run release <version>)
const CURRENT_VERSION = '1.0.5';

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
  });

  const checkedRef = useRef(false);

  const checkForUpdate = useCallback(async (_force = false) => {
    setStatus((s) => ({ ...s, isChecking: true, error: null }));

    try {
      // Use Tauri native updater
      const update = await check();

      if (update && update.available) {
        setStatus({
          hasUpdate: true,
          latestVersion: update.version,
          currentVersion: update.currentVersion || CURRENT_VERSION,
          changelog: update.body ? update.body.split('\n') : [],
          isChecking: false,
          lastChecked: new Date(),
          error: null,
          updateObj: update,
        });
      } else {
        setStatus((s) => ({
          ...s,
          hasUpdate: false,
          isChecking: false,
          lastChecked: new Date(),
          error: null,
          updateObj: null,
        }));
      }
    } catch (err) {
      console.error('Update check failed:', err);
      setStatus((s) => ({
        ...s,
        isChecking: false,
        error: err instanceof Error ? err.message : 'Unknown error checking for updates',
      }));
    }
  }, []);

  const dismiss = useCallback(() => {
    setStatus((s) => ({ ...s, hasUpdate: false }));
  }, []);

  const checkNow = useCallback(() => checkForUpdate(true), [checkForUpdate]);

  // Check directly 1.2s after app startup & listen to Firebase RTDB for manual Admin Panel forceUpdate toggles
  useEffect(() => {
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
              setStatus((s) => ({
                ...s,
                hasUpdate: true,
                latestVersion: data.targetVersion || s.latestVersion || CURRENT_VERSION,
              }));
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
