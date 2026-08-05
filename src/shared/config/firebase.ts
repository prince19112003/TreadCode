import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, runTransaction } from 'firebase/database';

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
