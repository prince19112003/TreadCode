import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, runTransaction } from 'firebase/database';

// Firebase Web Config Setup targeting licensing database
const firebaseConfig = {
  apiKey: "AIzaSyAsf-DummyKeyForCompilationChecksOnly",
  authDomain: "flowtrace-license.firebaseapp.com",
  databaseURL: "https://flowtrace-license-default-rtdb.firebaseio.com",
  projectId: "flowtrace-license",
  storageBucket: "flowtrace-license.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * Validate License Key and HWID locking mapping
 */
export async function validateLicenseKey(licenseKey: string, hwid: string): Promise<boolean> {
  const licenseRef = ref(db, `licenses/${licenseKey}`);
  try {
    const snapshot = await get(licenseRef);
    if (!snapshot.exists()) return false;
    const licenseData = snapshot.val();
    if (licenseData.blocked) return false;

    let devices = licenseData.devices || {};
    // Device already registered on this key
    if (devices[hwid]) return true;

    // Check if new device registration exceeds capacity limits
    const activeDevicesCount = Object.keys(devices).length;
    if (activeDevicesCount >= licenseData.maxDevices) return false;

    // Register new device HWID atomic transaction
    await runTransaction(licenseRef, (currentData: any) => {
      if (currentData) {
        if (!currentData.devices) currentData.devices = {};
        currentData.devices[hwid] = { activatedAt: new Date().toISOString() };
      }
      return currentData;
    });

    return true;
  } catch (err) {
    console.error('License validation failed:', err);
    return false;
  }
}
