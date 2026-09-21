import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, runTransaction, onValue } from 'firebase/database';

// Firebase Web Config Setup targeting licensing database
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flowtrace-licensing.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://flowtrace-licensing-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flowtrace-licensing",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flowtrace-licensing.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "54812800974",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:54812800974:web:46f3294f029da000f4dd9f"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export interface CustomBranding {
  institutionName?: string;
  badgeText?: string;
  themeColor?: string;
  logoUrl?: string;
}

export interface FeedbackItem {
  id?: string;
  category: 'complaint' | 'query' | 'bug' | 'feature' | 'feedback' | string;
  subject?: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  adminReply?: string;
  resolvedAt?: string;
  hwid?: string;
  systemDetails: {
    platform: string;
    userAgent: string;
    screenResolution: string;
    language: string;
    licenseKey?: string;
    tier?: string;
  };
}

export interface LicenseValidationResult {
  isValid: boolean;
  licenseKey?: string;
  tier?: 'developer' | 'ultimate' | 'custom' | 'super' | string;
  maxDevices?: number;
  activeDevicesCount?: number;
  devices?: Record<string, { activatedAt?: string; deviceName?: string }>;
  customBranding?: CustomBranding;
  features?: Record<string, boolean>;
  blocked?: boolean;
  limitReached?: boolean;
  /** ISO date string — if set, license expires on this date. Admin can extend anytime. */
  expiresAt?: string;
  /** True if license is expired based on expiresAt */
  expired?: boolean;
}

// ─── Offline License Cache ────────────────────────────────────────────────────
// Stores last successful validation so offline app keeps working
// until admin explicitly revokes or blocks via real-time listener.

const CACHE_KEY = 'flowtrace_license_cache';

export function saveLicenseCache(result: LicenseValidationResult): void {
  try {
    const payload = {
      ...result,
      _cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch { /* silent */ }
}

export function loadLicenseCache(): LicenseValidationResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Remove internal cache metadata before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _cachedAt: _, ...result } = parsed;

    // Even from cache, honour expiry date — admin controls this
    if (result.expiresAt) {
      const expiry = new Date(result.expiresAt);
      if (!isNaN(expiry.getTime()) && new Date() > expiry) {
        return { isValid: false, expired: true };
      }
    }

    return result as LicenseValidationResult;
  } catch {
    return null;
  }
}

export function clearLicenseCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch { /* silent */ }
}

// ─── License Validation ───────────────────────────────────────────────────────

export function getStoredOrGeneratedHwid(): string {
  if (typeof window === 'undefined') return 'DEVICE-DESKTOP';
  
  const existing = localStorage.getItem('flowtrace_device_hwid');
  if (existing && existing.trim() && existing !== 'N/A' && existing !== 'fallback-device-id-xxxx') {
    return existing.trim();
  }

  // Generate a persistent, clean alphanumeric device ID
  const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const newHwid = `TC-${rand1}-${rand2}`;
  
  localStorage.setItem('flowtrace_device_hwid', newHwid);
  return newHwid;
}

export async function resolveSystemHwid(): Promise<string> {
  const current = getStoredOrGeneratedHwid();
  
  if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
    try {
      const { invoke } = await import('@tauri-apps/api/core') as any;
      const raw = await invoke('get_hwid');
      if (typeof raw === 'string') {
        const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '').trim();
        if (cleaned && cleaned.length >= 3 && cleaned !== 'fallback-device-id-xxxx') {
          localStorage.setItem('flowtrace_device_hwid', cleaned);
          return cleaned;
        }
      }
    } catch (e) {
      console.warn('Tauri get_hwid fallback used:', e);
    }
  }

  return current;
}

/**
 * Validate License Key, record HWID registration, and return rich custom branding & tier details
 */
export async function validateLicenseKey(licenseKey: string, hwid?: string): Promise<boolean> {
  const res = await fetchLicenseDetails(licenseKey, hwid);
  return res.isValid;
}

export async function fetchLicenseDetails(
  licenseKey: string,
  hwid?: string,
  registerIfMissing: boolean = false
): Promise<LicenseValidationResult> {
  if (!licenseKey || !licenseKey.trim()) return { isValid: false };
  const cleanKey = licenseKey.trim().toUpperCase();
  const safeHwid = (hwid && hwid.trim() && hwid !== 'N/A') ? hwid.trim() : getStoredOrGeneratedHwid();

  // Check global HWID blacklist first
  try {
    const blacklistRef = ref(db, `blacklisted_hwids/${safeHwid}`);
    const blacklistSnap = await get(blacklistRef);
    if (blacklistSnap.exists() && blacklistSnap.val()) {
      clearLicenseCache();
      return { isValid: false, blocked: true };
    }

    // Log / update system installation telemetry
    const installationRef = ref(db, `installations/${safeHwid}`);
    get(installationRef).then(snap => {
      if (!snap.exists()) {
        set(installationRef, {
          hwid: safeHwid,
          firstInstalledAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          activeKey: cleanKey,
          os: typeof window !== 'undefined' ? window.navigator.platform : 'Desktop',
        });
      } else {
        set(ref(db, `installations/${safeHwid}/lastSeen`), new Date().toISOString());
        set(ref(db, `installations/${safeHwid}/activeKey`), cleanKey);
      }
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }

  const licenseRef = ref(db, `licenses/${cleanKey}`);
  try {
    const snapshot = await get(licenseRef);
    if (!snapshot.exists()) return { isValid: false };
    
    const licenseData = snapshot.val();
    if (licenseData.blocked) {
      clearLicenseCache();
      return { isValid: false, blocked: true };
    }

    // ── Expiry Date Check (Admin Panel extendable anytime) ──────────────────
    if (licenseData.expiresAt) {
      const expiry = new Date(licenseData.expiresAt);
      if (!isNaN(expiry.getTime()) && new Date() > expiry) {
        clearLicenseCache();
        return { isValid: false, expired: true, expiresAt: licenseData.expiresAt };
      }
    }

    let devices = licenseData.devices || {};
    let activeDevicesCount = Object.keys(devices).length;
    let isAlreadyRegistered = Boolean(devices[safeHwid]);

    if (!isAlreadyRegistered) {
      // If verifying an existing license, DO NOT auto-register a device that was unlinked by the admin!
      if (!registerIfMissing) {
        clearLicenseCache();
        return {
          isValid: false,
          licenseKey: cleanKey,
          maxDevices: licenseData.maxDevices || 1,
          activeDevicesCount,
          devices: licenseData.devices || {},
        };
      }

      const maxAllowed = licenseData.maxDevices || 1;
      if (activeDevicesCount >= maxAllowed) {
        return {
          isValid: false,
          limitReached: true,
          licenseKey: cleanKey,
          maxDevices: maxAllowed,
          activeDevicesCount,
          devices: licenseData.devices || {},
        };
      }

      // Register new device HWID explicitly during activation
      try {
        await runTransaction(licenseRef, (currentData: any) => {
          if (currentData) {
            if (!currentData.devices) currentData.devices = {};
            currentData.devices[safeHwid] = { activatedAt: new Date().toISOString() };
          }
          return currentData;
        });
        activeDevicesCount += 1;
        if (!devices[safeHwid]) {
          devices[safeHwid] = { activatedAt: new Date().toISOString() };
        }
      } catch (txErr) {
        console.warn('Atomic transaction failed, registering directly on node:', txErr);
        try {
          await set(ref(db, `licenses/${cleanKey}/devices/${safeHwid}`), { activatedAt: new Date().toISOString() });
          activeDevicesCount += 1;
          if (!devices[safeHwid]) {
            devices[safeHwid] = { activatedAt: new Date().toISOString() };
          }
        } catch { /* silent */ }
      }
    }

    const result: LicenseValidationResult = {
      isValid: true,
      licenseKey: cleanKey,
      tier: licenseData.tier || 'standard',
      maxDevices: licenseData.maxDevices || 1,
      activeDevicesCount,
      devices: licenseData.devices || {},
      customBranding: licenseData.customBranding || {},
      features: licenseData.features || {},
      expiresAt: licenseData.expiresAt || undefined,
    };

    // Save successful validation to offline cache
    saveLicenseCache(result);
    return result;
  } catch (err) {
    console.warn('License validation failed (network issue?), checking offline cache:', err);

    // ── Offline Fallback: Use cached license if available ───────────────────
    const cached = loadLicenseCache();
    if (cached && cached.isValid && cached.licenseKey === cleanKey) {
      console.info('Using offline license cache — app will re-validate when online.');
      return cached;
    }

    return { isValid: false };
  }
}

export async function unlinkDeviceFromLicense(licenseKey: string, targetHwid: string): Promise<boolean> {
  if (!licenseKey || !targetHwid) return false;
  try {
    const { remove, ref: dbRef } = await import('firebase/database');
    await remove(dbRef(db, `licenses/${licenseKey.trim().toUpperCase()}/devices/${targetHwid}`));
    return true;
  } catch (err) {
    console.error('Failed to unlink device from license:', err);
    return false;
  }
}

// ─── Feedback & Bug Reporting Service ─────────────────────────────────────────

export async function submitFeedback(item: Omit<FeedbackItem, 'id' | 'timestamp' | 'status'>): Promise<boolean> {
  try {
    const feedbackRef = ref(db, `feedbacks/${Date.now()}`);
    const payload: FeedbackItem = {
      ...item,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    await set(feedbackRef, payload);
    return true;
  } catch (err) {
    console.error('Failed to submit feedback to Firebase:', err);
    return false;
  }
}

// ─── Key Request Service ───────────────────────────────────────────────────────

export interface KeyRequestItem {
  id?: string;
  name: string;
  email: string;
  tier: 'professional' | 'enterprise' | 'developer' | 'ultimate' | string;
  tierName: string;
  price: string;
  duration: string;
  hwid: string;
  college?: string;
  note?: string;
  timestamp: string;
  status: 'pending' | 'fulfilled';
  assignedKey?: string;
  fulfilledAt?: string;
  notifyDismissed?: boolean;
}

export async function submitKeyRequest(item: Omit<KeyRequestItem, 'id' | 'timestamp' | 'status'>): Promise<boolean> {
  try {
    const reqRef = ref(db, `key_requests/${Date.now()}`);
    const payload: KeyRequestItem = {
      ...item,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    await set(reqRef, payload);
    return true;
  } catch (err) {
    console.error('Failed to submit key request to Firebase:', err);
    return false;
  }
}

export function subscribeToDeviceKeyRequests(
  hwid: string,
  onUpdate: (requests: KeyRequestItem[]) => void
): () => void {
  const reqsRef = ref(db, 'key_requests');
  return onValue(reqsRef, (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate([]);
      return;
    }
    const data = snapshot.val();
    const matches: KeyRequestItem[] = Object.keys(data)
      .map(k => ({ id: k, ...data[k] }))
      .filter(r => r.hwid === hwid);
    onUpdate(matches);
  });
}

// ─── 3-Day Keyless Native Desktop Trial Engine ────────────────────────────────
export interface DeviceTrialInfo {
  isTrialActive: boolean;
  hoursRemaining: number;
  daysRemaining: number;
  expiresAt: number | null;
  startedAt: number | null;
}

const TRIAL_HOURS = 72; // 3 Days (72 Hours)
const TRIAL_DURATION_MS = TRIAL_HOURS * 60 * 60 * 1000;

export async function checkOrStartDeviceTrial(hwid: string): Promise<DeviceTrialInfo> {
  // STRICT DESKTOP ONLY GUARD: Never start or grant trial on Web / Vercel cloud
  const isNative = typeof window !== 'undefined' && (
    '__TAURI_INTERNALS__' in window ||
    '__TAURI__' in window ||
    '__TAURI_METADATA__' in window ||
    Boolean((window as any).Capacitor) ||
    Boolean((window as any).AndroidBridge) ||
    navigator.userAgent.includes('TreadCodeNative') ||
    navigator.userAgent.includes('Tauri')
  );

  if (!isNative) {
    return {
      isTrialActive: false,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: null,
      startedAt: null,
    };
  }

  const cleanHwid = (hwid || getStoredOrGeneratedHwid()).replace(/[^a-zA-Z0-9_-]/g, '_');
  const localStartedStr = typeof window !== 'undefined' ? localStorage.getItem('flowtrace_trial_started_at') : null;
  const localExpiresStr = typeof window !== 'undefined' ? localStorage.getItem('flowtrace_trial_expires_at') : null;

  let startedAt: number | null = localStartedStr ? Number(localStartedStr) : null;
  let expiresAt: number | null = localExpiresStr ? Number(localExpiresStr) : null;

  try {
    const trialRef = ref(db, `trial_devices/${cleanHwid}`);
    const snap = await get(trialRef);

    if (snap.exists()) {
      const data = snap.val();
      startedAt = data.startedAt || startedAt || Date.now();
      expiresAt = data.expiresAt || (startedAt ? startedAt + TRIAL_DURATION_MS : Date.now() + TRIAL_DURATION_MS);
    } else {
      // First time on native desktop: automatically grant 72 hours trial
      const now = Date.now();
      startedAt = startedAt || now;
      expiresAt = expiresAt || (startedAt + TRIAL_DURATION_MS);

      await set(trialRef, {
        hwid: cleanHwid,
        startedAt,
        expiresAt,
        platform: 'desktop',
        createdAt: new Date().toISOString(),
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('flowtrace_trial_started_at', String(startedAt));
      localStorage.setItem('flowtrace_trial_expires_at', String(expiresAt));
    }
  } catch (err) {
    console.warn('Firebase trial lookup offline/failed, using local fallback:', err);
    if (!startedAt || !expiresAt) {
      const now = Date.now();
      startedAt = now;
      expiresAt = now + TRIAL_DURATION_MS;
      if (typeof window !== 'undefined') {
        localStorage.setItem('flowtrace_trial_started_at', String(startedAt));
        localStorage.setItem('flowtrace_trial_expires_at', String(expiresAt));
      }
    }
  }

  const now = Date.now();
  const remainingMs = (expiresAt || 0) - now;
  const isTrialActive = remainingMs > 0;
  const hoursRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60)));
  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

  return {
    isTrialActive,
    hoursRemaining,
    daysRemaining,
    expiresAt,
    startedAt,
  };
}
