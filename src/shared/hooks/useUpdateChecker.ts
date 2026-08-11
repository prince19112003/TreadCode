import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VersionInfo {
  version: string;
  buildDate: string;
  changelog: string[];
  releaseUrl: string;
  downloadUrl: string;
}

export interface UpdateStatus {
  hasUpdate: boolean;
  latestVersion: string | null;
  currentVersion: string;
  changelog: string[];
  releaseUrl: string;
  downloadUrl: string;
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

// Current App Version built into this .exe (patched by npm run release <version>)
const CURRENT_VERSION = '1.0.3';

// 100% FREE Firebase RTDB version check URL (works reliably even if GitHub repo is private)
const VERSION_CHECK_URL =
  'https://flowtrace-licensing-default-rtdb.firebaseio.com/global_update.json';

// ─── Semver Compare ───────────────────────────────────────────────────────────

function isNewerVersion(local: string, remote: string): boolean {
  const parse = (v: string) => v.split('.').map((n) => parseInt(n, 10) || 0);
  const [lMaj, lMin, lPat] = parse(local);
  const [rMaj, rMin, rPat] = parse(remote);
  if (rMaj !== lMaj) return rMaj > lMaj;
  if (rMin !== lMin) return rMin > lMin;
  return rPat > lPat;
}

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
    releaseUrl: 'https://github.com/prince19112003/TreadCode/releases/latest',
    downloadUrl: 'https://github.com/prince19112003/TreadCode/releases/latest',
    isChecking: false,
    lastChecked: null,
    error: null,
  });

  const checkedRef = useRef(false);

  const checkForUpdate = useCallback(async (_force = false) => {
    setStatus((s) => ({ ...s, isChecking: true, error: null }));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      // Fetch directly from GitHub main branch with cache-buster
      const res = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeout);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: VersionInfo = await res.json();

      const newer = isNewerVersion(CURRENT_VERSION, data.version);

      setStatus({
        hasUpdate: newer,
        latestVersion: data.version,
        currentVersion: CURRENT_VERSION,
        changelog: data.changelog || [],
        releaseUrl: data.releaseUrl || 'https://github.com/prince19112003/TreadCode/releases/latest',
        downloadUrl: data.downloadUrl || 'https://github.com/prince19112003/TreadCode/releases/latest',
        isChecking: false,
        lastChecked: new Date(),
        error: null,
      });
    } catch (err) {
      setStatus((s) => ({
        ...s,
        isChecking: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, []);

  const dismiss = useCallback(() => {
    setStatus((s) => ({ ...s, hasUpdate: false }));
  }, []);

  const checkNow = useCallback(() => checkForUpdate(true), [checkForUpdate]);

  // Check directly 1.2s after app startup (after splash screen)
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    const t = setTimeout(() => checkForUpdate(true), 1200);
    return () => clearTimeout(t);
  }, [checkForUpdate]);

  return { ...status, dismiss, checkNow };
}
