import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, runTransaction } from 'firebase/database';

// Firebase Web Config Setup targeting licensing database
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCR9JqBrN1jfTuopPAvb8fbqSxjbOcilmc",
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
  category: 'bug' | 'feature' | 'feedback';
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  systemDetails: {
    platform: string;
    userAgent: string;
    screenResolution: string;
    language: string;
    licenseKey?: string;
  };
}

export interface LicenseValidationResult {
  isValid: boolean;
  licenseKey?: string;
  tier?: 'standard' | 'pro' | 'enterprise';
  maxDevices?: number;
  activeDevicesCount?: number;
  customBranding?: CustomBranding;
  features?: Record<string, boolean>;
  blocked?: boolean;
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

/**
 * Validate License Key, record HWID registration, and return rich custom branding & tier details
 */
export async function validateLicenseKey(licenseKey: string, hwid: string): Promise<boolean> {
  const res = await fetchLicenseDetails(licenseKey, hwid);
  return res.isValid;
}

export async function fetchLicenseDetails(licenseKey: string, hwid: string): Promise<LicenseValidationResult> {
  // Check global HWID blacklist first
  try {
    const blacklistRef = ref(db, `blacklisted_hwids/${hwid}`);
    const blacklistSnap = await get(blacklistRef);
    if (blacklistSnap.exists() && blacklistSnap.val()) {
      clearLicenseCache();
      return { isValid: false, blocked: true };
    }

    // Log / update system installation telemetry
    const installationRef = ref(db, `installations/${hwid}`);
    get(installationRef).then(snap => {
      if (!snap.exists()) {
        set(installationRef, {
          hwid,
          firstInstalledAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          activeKey: licenseKey || 'Unregistered',
          os: typeof window !== 'undefined' ? window.navigator.platform : 'Desktop',
        });
      } else {
        set(ref(db, `installations/${hwid}/lastSeen`), new Date().toISOString());
        set(ref(db, `installations/${hwid}/activeKey`), licenseKey || 'Unregistered');
      }
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }

  const licenseRef = ref(db, `licenses/${licenseKey}`);
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
    let isAlreadyRegistered = Boolean(devices[hwid]);

    if (!isAlreadyRegistered) {
      if (activeDevicesCount >= (licenseData.maxDevices || 1)) {
        return { isValid: false, maxDevices: licenseData.maxDevices, activeDevicesCount };
      }

      // Register new device HWID atomic transaction
      await runTransaction(licenseRef, (currentData: any) => {
        if (currentData) {
          if (!currentData.devices) currentData.devices = {};
          currentData.devices[hwid] = { activatedAt: new Date().toISOString() };
        }
        return currentData;
      });
      activeDevicesCount += 1;
    }

    const result: LicenseValidationResult = {
      isValid: true,
      licenseKey,
      tier: licenseData.tier || 'standard',
      maxDevices: licenseData.maxDevices || 1,
      activeDevicesCount,
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
    if (cached && cached.isValid) {
      console.info('Using offline license cache — app will re-validate when online.');
      return cached;
    }

    return { isValid: false };
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

