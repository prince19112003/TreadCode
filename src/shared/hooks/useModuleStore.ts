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
      const parsedSaved: Record<string, string> = savedMeta ? JSON.parse(savedMeta) : {};

      // Universal Pre-bundled: All core modules (C, C++, Java, DSA, ML, Networking)
      // are active and ready out-of-the-box on every platform!
      const defaultVersions: Record<string, string> = {};
      for (const mod of MODULE_CATALOG) {
        defaultVersions[mod.id] = mod.version;
      }

      const installedVersions: Record<string, string> = {
        ...defaultVersions,
        ...parsedSaved,
      };

      const moduleStatus: Record<string, ModuleStatus> = {};
      for (const mod of MODULE_CATALOG) {
        // If explicitly uninstalled by user, honour that; otherwise default to installed!
        moduleStatus[mod.id] = parsedSaved[mod.id] === 'uninstalled' ? 'not_installed' : 'installed';
      }

      set({ installedVersions, moduleStatus, isInitialized: true });
      await get().recalcStorage();

      // Silent background pre-seed into IndexedDB for instant sub-millisecond execution
      setTimeout(async () => {
        for (const mod of MODULE_CATALOG) {
          if (mod.isMarkerOnly || moduleStatus[mod.id] !== 'installed') continue;
          try {
            const existing = await idbGet(`pack_${mod.id}`);
            if (!existing) {
              const res = await fetch(`/visualizer/packs/${mod.id}.json`).catch(() => null);
              if (res && res.ok) {
                const data = await res.json();
                if (data?.registry) {
                  await idbSet(`pack_${mod.id}`, data);
                }
              }
            }
          } catch {}
        }
        await get().recalcStorage();
      }, 500);
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
    installedVersions[moduleId] = 'uninstalled';
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
      // 1. Fast path: load from IndexedDB cache
      let packData = await idbGet(`pack_${moduleId}`);
      if (packData?.registry && Object.keys(packData.registry).length > 0) {
        return packData.registry;
      }

      // 2. Offline fallback: read directly from local pre-bundled assets
      try {
        const localUrl = `/visualizer/packs/${moduleId}.json`;
        const res = await fetch(localUrl);
        if (res.ok) {
          packData = await res.json();
          if (packData?.registry) {
            // Seed into IndexedDB in background so future reads are instantaneous
            await idbSet(`pack_${moduleId}`, packData).catch(() => {});
            return packData.registry;
          }
        }
      } catch (e) {
        console.warn(`[ModuleStore] Local bundled pack fetch failed for ${moduleId}:`, e);
      }

      return null;
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
