# Developer Automation & Build Tooling (`scripts/`)

> **Architectural Layer**: DevOps, Content Compilers, & Release Tooling  
> **Primary Technology**: Node.js (ES Modules), fs-extra, archiver

---

## 1. Directory Purpose

The `scripts/` directory contains developer automation tools for compiling modular course extension packs, synchronizing web store catalogues, bumping release versions, and maintaining repository hygiene.

---

## 2. Tooling Inventory

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `export_packs.js` | `node scripts/export_packs.js` | Compiles raw lesson code from `src/lessons/{c,cpp,java,dsa,ml,networks}` into standalone `.json` packs and creates `TreadCode_Packs_Offline.zip` in `dist-packs/`. |
| `sync_store_catalogue.js` | `node scripts/sync_store_catalogue.js` | Dynamically parses active program counts and updates the public web store catalogue (`web/src/lib/catalogueData.ts`). |
| `release.js` | `node scripts/release.js <version>` | Atomically updates the application version across `package.json`, `src-tauri/tauri.conf.json`, and `public/version.json`. |
| `cleanup_stale.js` | `node scripts/cleanup_stale.js [--force]` | Scans and safely purges heavy binary test builds (`.exe`, `.zip`) from `public/releases/` and staging directories. |

---

## 3. Workflow Integration

```
1. Add / Edit Lessons in `src/lessons/`
          │
          ▼
2. Export Modular Packs:
   `node scripts/export_packs.js` ──► Output in `dist-packs/`
          │
          ▼
3. Synchronize Web Catalogue:
   `node scripts/sync_store_catalogue.js` ──► Updates `web/`
          │
          ▼
4. Bump Release Version:
   `node scripts/release.js 1.0.9`
          │
          ▼
5. Clean Heavy Binaries Before Git Commit:
   `node scripts/cleanup_stale.js --force`
```
