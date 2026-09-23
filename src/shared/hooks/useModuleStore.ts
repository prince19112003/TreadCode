/**
 * useModuleStore.ts
 * Zustand store for managing downloadable extension packs.
 * Stores packs in IndexedDB for offline access after first install.
 */

import { create } from 'zustand';

// ─── Constants ───────────────────────────────────────────────────────────────

const CDN_BASE_URL = 'https://treadcode-cdn.princedev1911-io.workers.dev';
const DB_NAME = 'treadcode_modules';
const DB_VERSION = 1;
const STORE_NAME = 'packs';
const META_KEY = 'treadcode_module_meta';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModuleStatus = 'not_installed' | 'downloading' | 'installed' | 'error';

export interface ModuleMeta {
  id: string;
  name: string;
  topics: number;
  programs: number;
  sizeKB: number;
  version: string;
  /** If true, pack is just a small unlock marker — actual renderer is compiled in the binary */
  isMarkerOnly?: boolean;
}

export const MODULE_SIZE_MAP: Record<string, string> = {
  c: '164 KB',
  cpp: '157 KB',
  java: '405 KB',
  dsa: '357 KB',
  ml: '8 KB',
  networking: '6 KB',
};

export const MODULE_CATALOG: ModuleMeta[] = [
  { id: 'c',          name: 'C Programming',                     topics: 13, programs: 48,  sizeKB: 164,  version: '1.0.0' },
  { id: 'cpp',        name: 'C++ Programming',                   topics: 14, programs: 48,  sizeKB: 157,  version: '1.0.0' },
  { id: 'java',       name: 'Java Programming',                  topics: 15, programs: 60,  sizeKB: 405,  version: '1.0.0' },
  { id: 'dsa',        name: 'Data Structures & Algorithms',      topics: 26, programs: 30,  sizeKB: 357,  version: '1.0.0' },
  { id: 'ml',         name: 'Machine Learning',                  topics: 11, programs: 11,  sizeKB: 8,    version: '1.0.0', isMarkerOnly: true },
  { id: 'networking', name: 'Computer Networks',                 topics: 8,  programs: 8,   sizeKB: 6,    version: '1.0.0', isMarkerOnly: true },
];

export interface ModuleStoreState {
  // Installed status map — loaded from IndexedDB on init
  installedVersions: Record<string, string>;   // { c: '1.0.0', cpp: '1.0.0' }
  downloadProgress: Record<string, number>;    // 0–100
  moduleStatus: Record<string, ModuleStatus>;
  storageUsedKB: number;
  isInitialized: boolean;

  // Actions
  init: () => Promise<void>;
  installModule: (moduleId: string, targetVersion?: string) => Promise<void>;
  uninstallModule: (moduleId: string) => Promise<void>;
  getPackRegistry: (moduleId: string) => Promise<Record<string, any> | null>;
  recalcStorage: () => Promise<void>;
}

// ─── IndexedDB Helpers ────────────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet(key: string): Promise<any> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: any): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGetAllKeys(): Promise<string[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror = () => reject(req.error);
  });
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useModuleStore = create<ModuleStoreState>((set, get) => ({
  installedVersions: {},
  downloadProgress: {},
  moduleStatus: {},
  storageUsedKB: 0,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return;
    try {
      const savedMeta = localStorage.getItem(META_KEY);
      const installedVersions: Record<string, string> = savedMeta ? JSON.parse(savedMeta) : {};
      const moduleStatus: Record<string, ModuleStatus> = {};

      for (const mod of MODULE_CATALOG) {
        moduleStatus[mod.id] = installedVersions[mod.id] ? 'installed' : 'not_installed';
      }

      set({ installedVersions, moduleStatus, isInitialized: true });
      await get().recalcStorage();
    } catch {
      set({ isInitialized: true });
    }
  },

  installModule: async (moduleId: string, targetVersion?: string) => {
    const mod = MODULE_CATALOG.find(m => m.id === moduleId);
    if (!mod) return;

    set(s => ({
      moduleStatus: { ...s.moduleStatus, [moduleId]: 'downloading' },
      downloadProgress: { ...s.downloadProgress, [moduleId]: 5 },
    }));

    try {
      const cacheBust = `?t=${Date.now()}`;
      const cdnUrl = `${CDN_BASE_URL}/visualizer/packs/${moduleId}.json${cacheBust}`;
      const localUrl = `/visualizer/packs/${moduleId}.json${cacheBust}`;
      let packData: any = null;

      // 1. Try CDN first; fallback to local public asset if CDN fails (e.g. CORS, offline, or 404)
      let response = await fetch(cdnUrl).catch(() => null);
      if (!response || !response.ok) {
        response = await fetch(localUrl).catch(() => null);
      }

      if (response && response.ok) {
        const contentLength = response.headers.get('content-length');
        const total = (contentLength && parseInt(contentLength, 10) > 0)
          ? parseInt(contentLength, 10)
          : mod.sizeKB * 1024;

        const reader = response.body?.getReader();
        if (reader) {
          const chunks: Uint8Array[] = [];
          let received = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            const pct = Math.min(Math.round((received / total) * 100), 92);
            set(s => ({
              downloadProgress: { ...s.downloadProgress, [moduleId]: Math.max(pct, 15) },
            }));
            if (chunks.length <= 4) {
              await new Promise(r => setTimeout(r, 40));
            }
          }

          const blob = new Blob(chunks as any);
          const text = await blob.text();
          packData = JSON.parse(text);
        }
      } else if (mod.isMarkerOnly) {
        // Simulated progress for marker packs if not yet deployed on CDN
        for (let pct = 25; pct <= 90; pct += 25) {
          await new Promise(r => setTimeout(r, 60));
          set(s => ({ downloadProgress: { ...s.downloadProgress, [moduleId]: pct } }));
        }
        packData = {
          id: mod.id,
          name: mod.name,
          version: mod.version,
          exportedAt: new Date().toISOString(),
          topicsCount: mod.topics,
          programsCount: mod.programs,
          isMarkerOnly: true,
          registry: {},
        };
      } else {
        throw new Error(`HTTP ${response?.status || 500}`);
      }

      if (!packData || (!packData.registry && !packData.isMarkerOnly)) {
        throw new Error('Invalid pack format');
      }

      // Smooth step to 98% before finalizing
      set(s => ({
        downloadProgress: { ...s.downloadProgress, [moduleId]: 98 },
      }));
      await new Promise(r => setTimeout(r, 60));

      // Save to IndexedDB
      await idbSet(`pack_${moduleId}`, packData);

      // Update meta in localStorage with target/new version
      const finalVersion = targetVersion || packData.version || mod.version;
      const installedVersions = { ...get().installedVersions, [moduleId]: finalVersion };
      localStorage.setItem(META_KEY, JSON.stringify(installedVersions));

      set(s => ({
        installedVersions,
        moduleStatus: { ...s.moduleStatus, [moduleId]: 'installed' },
        downloadProgress: { ...s.downloadProgress, [moduleId]: 100 },
      }));

      await get().recalcStorage();
    } catch (err) {
      console.error(`[ModuleStore] Failed to install ${moduleId}:`, err);
      set(s => ({
        moduleStatus: { ...s.moduleStatus, [moduleId]: 'error' },
        downloadProgress: { ...s.downloadProgress, [moduleId]: 0 },
      }));
    }
  },

  uninstallModule: async (moduleId: string) => {
    await idbDelete(`pack_${moduleId}`);
    const installedVersions = { ...get().installedVersions };
    delete installedVersions[moduleId];
    localStorage.setItem(META_KEY, JSON.stringify(installedVersions));

    set(s => ({
      installedVersions,
      moduleStatus: { ...s.moduleStatus, [moduleId]: 'not_installed' },
      downloadProgress: { ...s.downloadProgress, [moduleId]: 0 },
    }));

    await get().recalcStorage();
  },

  getPackRegistry: async (moduleId: string): Promise<Record<string, any> | null> => {
    try {
      const packData = await idbGet(`pack_${moduleId}`);
      if (!packData?.registry) return null;
      return packData.registry;
    } catch {
      return null;
    }
  },

  recalcStorage: async () => {
    try {
      const keys = await idbGetAllKeys();
      const packKeys = keys.filter(k => typeof k === 'string' && (k as string).startsWith('pack_'));
      let totalKB = 0;
      for (const key of packKeys) {
        const data = await idbGet(key as string);
        if (data) {
          const bytes = new Blob([JSON.stringify(data)]).size;
          totalKB += Math.round(bytes / 1024);
        }
      }
      set({ storageUsedKB: totalKB });
    } catch {
      // ignore
    }
  },
}));
