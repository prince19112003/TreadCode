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

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_VERSION = '2.1.0';

// GitHub raw content URL — directly reads your public/version.json from main branch
const VERSION_CHECK_URL =
  'https://raw.githubusercontent.com/prince19112003/FlowTrace/main/public/version.json';

// On startup always do a fresh check (no cache delay)
const CACHE_DURATION_MS = 0;
const STORAGE_KEY = 'flowtrace_update_check';
const DISMISSED_KEY = 'flowtrace_dismissed_version';

// ─── Semver Compare ───────────────────────────────────────────────────────────

function isNewerVersion(local: string, remote: string): boolean {
  const parse = (v: string) => v.split('.').map((n) => parseInt(n, 10));
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
    releaseUrl: 'https://github.com/prince19112003/FlowTrace/releases/latest',
    downloadUrl: 'https://github.com/prince19112003/FlowTrace/archive/refs/heads/main.zip',
    isChecking: false,
    lastChecked: null,
    error: null,
  });

  const checkedRef = useRef(false);

  const checkForUpdate = useCallback(async (force = false) => {
    const dismissedVersion = localStorage.getItem(DISMISSED_KEY);

    if (!force) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached) as { data: VersionInfo; timestamp: number };
          if (Date.now() - timestamp < CACHE_DURATION_MS) {
            const newer = isNewerVersion(CURRENT_VERSION, data.version);
            const dismissed = dismissedVersion === data.version;
            setStatus((s) => ({
              ...s,
              hasUpdate: newer && !dismissed,
              latestVersion: data.version,
              changelog: data.changelog,
              releaseUrl: data.releaseUrl,
              downloadUrl: data.downloadUrl,
              lastChecked: new Date(timestamp),
            }));
            return;
          }
        } catch {
          // stale cache, proceed
        }
      }
    }

    setStatus((s) => ({ ...s, isChecking: true, error: null }));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(VERSION_CHECK_URL, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: VersionInfo = await res.json();

      const newer = isNewerVersion(CURRENT_VERSION, data.version);
      const dismissed = dismissedVersion === data.version;

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp: Date.now() }));

      setStatus({
        hasUpdate: newer && !dismissed,
        latestVersion: data.version,
        currentVersion: CURRENT_VERSION,
        changelog: data.changelog,
        releaseUrl: data.releaseUrl,
        downloadUrl: data.downloadUrl,
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
    if (status.latestVersion) localStorage.setItem(DISMISSED_KEY, status.latestVersion);
    setStatus((s) => ({ ...s, hasUpdate: false }));
  }, [status.latestVersion]);

  const checkNow = useCallback(() => checkForUpdate(true), [checkForUpdate]);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    // Delay 4s so splash screen finishes first, runs fresh check ignoring cache
    const t = setTimeout(() => checkForUpdate(true), 4000);
    return () => clearTimeout(t);
  }, [checkForUpdate]);

  return { ...status, dismiss, checkNow };
}
