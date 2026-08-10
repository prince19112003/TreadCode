import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, runTransaction } from 'firebase/database';

// Firebase Web Config Setup targeting licensing database
const firebaseConfig = {
  apiKey: "AIzaSyCR9JqBrN1jfTuopPAvb8fbqSxjbOcilmc",
  authDomain: "flowtrace-licensing.firebaseapp.com",
  databaseURL: "https://flowtrace-licensing-default-rtdb.firebaseio.com",
  projectId: "flowtrace-licensing",
  storageBucket: "flowtrace-licensing.firebasestorage.app",
  messagingSenderId: "54812800974",
  appId: "1:54812800974:web:46f3294f029da000f4dd9f"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export interface CustomBranding {
  institutionName?: string;
  badgeText?: string;
  themeColor?: string;
  logoUrl?: string;
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
}

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
    if (licenseData.blocked) return { isValid: false, blocked: true };

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

    return {
      isValid: true,
      licenseKey,
      tier: licenseData.tier || 'standard',
      maxDevices: licenseData.maxDevices || 1,
      activeDevicesCount,
      customBranding: licenseData.customBranding || {},
      features: licenseData.features || {},
    };
  } catch (err) {
    console.error('License validation failed:', err);
    return { isValid: false };
  }
}
