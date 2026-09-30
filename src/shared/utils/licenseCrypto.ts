/**
 * TreadCode Cryptographic Offline License Engine
 * 
 * Provides tamper-proof HMAC-SHA256 signing and symmetric encryption
 * for offline and air-gapped institutional deployments.
 * 
 * Zero dependencies — runs reliably in Node.js, modern browsers, and
 * embedded Android WebViews (SmartBoards) without requiring Web Crypto.
 */

const TC_SECRET_KEY = 'TC_MASTER_SIGNING_OFFLINE_SECRET_2026_@PRINCE#TREADCODE$';

// ─── Pure JavaScript SHA-256 Implementation ──────────────────────────────────
function sha256(str: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = str[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let compositeStr = str;
  compositeStr += '\x80';
  while (compositeStr[lengthProperty] % 64 - 56) compositeStr += '\x00';
  for (i = 0; i < compositeStr[lengthProperty]; i++) {
    j = compositeStr.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];

      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);

      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// ─── HMAC-SHA256 Implementation ──────────────────────────────────────────────
export function hmacSha256(key: string, message: string): string {
  let k = key;
  const blockSize = 64;

  if (k.length > blockSize) {
    k = sha256(k);
  }
  while (k.length < blockSize) {
    k += '\x00';
  }

  let oKeyPad = '';
  let iKeyPad = '';
  for (let i = 0; i < blockSize; i++) {
    oKeyPad += String.fromCharCode(k.charCodeAt(i) ^ 0x5c);
    iKeyPad += String.fromCharCode(k.charCodeAt(i) ^ 0x36);
  }

  const innerHashHex = sha256(iKeyPad + message);
  let innerBinary = '';
  for (let i = 0; i < innerHashHex.length; i += 2) {
    innerBinary += String.fromCharCode(parseInt(innerHashHex.substr(i, 2), 16));
  }

  return sha256(oKeyPad + innerBinary);
}

// ─── Reversible Symmetric Stream Cipher for Obfuscation ───────────────────────
function xorCipher(text: string, key: string): string {
  let output = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    output += String.fromCharCode(charCode);
  }
  return output;
}

function base64Encode(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)));
  }
  const g = globalThis as any;
  if (g && g.Buffer) {
    return g.Buffer.from(str, 'utf8').toString('base64');
  }
  return '';
}

function base64Decode(b64: string): string {
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(escape(atob(b64)));
  }
  const g = globalThis as any;
  if (g && g.Buffer) {
    return g.Buffer.from(b64, 'base64').toString('utf8');
  }
  return '';
}

export function encryptPayload(payloadObj: any, secretKey: string = TC_SECRET_KEY): string {
  const jsonStr = JSON.stringify(payloadObj);
  const ciphered = xorCipher(jsonStr, secretKey);
  return base64Encode(ciphered);
}

export function decryptPayload<T = any>(encryptedB64: string, secretKey: string = TC_SECRET_KEY): T | null {
  try {
    const rawCiphered = base64Decode(encryptedB64);
    const decryptedJson = xorCipher(rawCiphered, secretKey);
    return JSON.parse(decryptedJson) as T;
  } catch {
    return null;
  }
}

// ─── Types & Interfaces ───────────────────────────────────────────────────────
export interface GenerateLicenseOptions {
  licenseKey: string;
  tier: 'Ultimate' | 'Enterprise' | 'Professional' | 'Community' | string;
  holderName: string;
  organization?: string;
  description?: string;
  expiresAt: string; // ISO String or '2099-12-31T23:59:59.000Z'
  maxDevices?: number;
  boundHwid?: string | null;
}

export interface SecureOfflineLicenseFile {
  _header: string;
  _notice: string;
  _instructions: string;
  licenseKey: string;
  tier: string;
  holderName: string;
  organization: string;
  description: string;
  expiresAt: string;
  offline: boolean;
  security: {
    version: number;
    algorithm: string;
    payloadToken: string;
    integritySignature: string;
  };
}

export interface LicenseVerificationResult {
  isValid: boolean;
  isTemplate?: boolean;
  tampered?: boolean;
  expired?: boolean;
  hwidMismatch?: boolean;
  licenseKey?: string;
  tier?: string;
  holderName?: string;
  organization?: string;
  description?: string;
  expiresAt?: string;
  error?: string;
}

// ─── License Generation ───────────────────────────────────────────────────────
export function createSecureOfflineLicense(options: GenerateLicenseOptions): SecureOfflineLicenseFile {
  const cleanKey = options.licenseKey.trim().toUpperCase();
  const cleanTier = options.tier.trim() || 'Ultimate';
  const cleanHolder = options.holderName.trim() || 'Institutional Partner';
  const cleanOrg = (options.organization || options.holderName).trim();
  const cleanDesc = options.description?.trim() || 'Offline Institutional Laboratory License (Full Pass)';
  const cleanExpiry = options.expiresAt || '2099-12-31T23:59:59.000Z';
  const cleanMaxDevices = options.maxDevices && options.maxDevices > 0 ? options.maxDevices : 9999;
  const boundHwid = options.boundHwid ? options.boundHwid.trim() : null;

  // The tamper-proof internal payload
  const internalPayload = {
    key: cleanKey,
    tier: cleanTier,
    holder: cleanHolder,
    org: cleanOrg,
    desc: cleanDesc,
    exp: cleanExpiry,
    maxDev: cleanMaxDevices,
    hwid: boundHwid,
    issuedAt: new Date().toISOString(),
    v: 2
  };

  const payloadToken = encryptPayload(internalPayload, TC_SECRET_KEY);
  const integritySignature = hmacSha256(TC_SECRET_KEY, `${payloadToken}::${cleanKey}::${cleanTier}::${cleanExpiry}`);

  return {
    _header: "========================================================================",
    _notice: "TREADCODE CRYPTOGRAPHIC OFFLINE LICENSE CERTIFICATE",
    _instructions: "To activate TreadCode on any offline, air-gapped, or lab computer: place this 'license.json' file directly in the TreadCode root folder next to START_HERE.html. Do not modify any fields in this file or the cryptographic integrity certificate will be permanently invalidated.",
    licenseKey: cleanKey,
    tier: cleanTier,
    holderName: cleanHolder,
    organization: cleanOrg,
    description: cleanDesc,
    expiresAt: cleanExpiry,
    offline: true,
    security: {
      version: 2,
      algorithm: "TC-HMAC-SHA256-V2",
      payloadToken: payloadToken,
      integritySignature: integritySignature
    }
  };
}

// ─── License Verification (Zero Network / 100% Offline) ───────────────────────
export function verifySecureOfflineLicense(
  licenseData: any,
  currentHwid?: string
): LicenseVerificationResult {
  if (!licenseData || typeof licenseData !== 'object') {
    return { isValid: false, error: 'Empty or invalid JSON file' };
  }

  // Check if unactivated template
  if (!licenseData.licenseKey || !licenseData.licenseKey.trim()) {
    return { isValid: false, isTemplate: true, error: 'Unactivated template file' };
  }

  const rawKey = String(licenseData.licenseKey).trim().toUpperCase();
  const rawTier = String(licenseData.tier || '').trim();
  const rawExpiry = String(licenseData.expiresAt || '').trim();

  // If no security block, file is either an unverified legacy or tampered
  if (!licenseData.security || !licenseData.security.payloadToken || !licenseData.security.integritySignature) {
    return {
      isValid: false,
      tampered: true,
      error: 'TAMPERED: Missing cryptographic security block. File modification detected.'
    };
  }

  const { payloadToken, integritySignature } = licenseData.security;

  // 1. Verify cryptographic signature over payload and key parameters
  const expectedSig = hmacSha256(TC_SECRET_KEY, `${payloadToken}::${rawKey}::${rawTier}::${rawExpiry}`);
  if (expectedSig !== integritySignature) {
    return {
      isValid: false,
      tampered: true,
      error: 'TAMPERED: Cryptographic signature mismatch! The license data has been altered.'
    };
  }

  // 2. Decrypt internal payload
  const payload = decryptPayload<any>(payloadToken, TC_SECRET_KEY);
  if (!payload || !payload.key) {
    return {
      isValid: false,
      tampered: true,
      error: 'CORRUPTED: Failed to decrypt security payload token.'
    };
  }

  // 3. Ensure outer editable fields strictly match signed internal token
  if (
    payload.key !== rawKey ||
    payload.tier !== rawTier ||
    payload.exp !== rawExpiry
  ) {
    return {
      isValid: false,
      tampered: true,
      error: 'TAMPERED: License file attributes do not match cryptographic token payload.'
    };
  }

  // 4. Expiry Date Check against local system clock
  if (payload.exp && payload.exp !== 'lifetime' && !payload.exp.startsWith('2099')) {
    const expDate = new Date(payload.exp);
    if (!isNaN(expDate.getTime()) && new Date() > expDate) {
      return {
        isValid: false,
        expired: true,
        expiresAt: payload.exp,
        licenseKey: payload.key,
        tier: payload.tier,
        error: `Offline license expired on ${expDate.toLocaleDateString()}`
      };
    }
  }

  // 5. Optional Device HWID Binding Check
  if (payload.hwid && payload.hwid !== 'ANY' && currentHwid) {
    const cleanCurrent = currentHwid.trim().toUpperCase();
    const cleanTarget = payload.hwid.trim().toUpperCase();
    if (cleanCurrent !== cleanTarget) {
      return {
        isValid: false,
        hwidMismatch: true,
        licenseKey: payload.key,
        error: `Hardware lock mismatch (Registered: ${cleanTarget}, Current: ${cleanCurrent})`
      };
    }
  }

  // Verified & Genuine
  return {
    isValid: true,
    licenseKey: payload.key,
    tier: payload.tier,
    holderName: payload.holder,
    organization: payload.org,
    description: payload.desc,
    expiresAt: payload.exp
  };
}
