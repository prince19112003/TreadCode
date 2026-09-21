# TreadCode Commands & Developer Operations Guide

> **Authoritative Operational Reference for Developers, Maintainers & DevOps**  
> Covers development workflows, build commands, pack generation, store catalog synchronization, release procedures, and desktop shortcuts.

---

## 1. Prerequisites & Environment Setup

Before working with the codebase, ensure your local development workstation has the following installed:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Rust Toolchain**: `v1.77+` (`rustup default stable`)
- **Package Manager**: `npm` (v10+)
- **Windows Build Tools**: Visual Studio Build Tools (C++ x64/x86 build tools and Windows 10/11 SDK)

---

## 2. Core Development Commands

### 2.1 Web Development Server
Launches the frontend inside your default browser with Vite Hot Module Replacement (HMR):
```powershell
npm run dev
```
- **Local URL**: `http://localhost:5173`
- *Note*: In browser mode, native Tauri APIs (e.g. system HWID, process exit) safely fall back to web mocks.

### 2.2 Native Desktop Development Mode
Launches the full native Tauri v2 desktop application window with live Rust and frontend reloading:
```powershell
npm run dev:tauri
```
- Compiles the Rust backend in debug mode.
- Enables native hardware interface calls (HWID, native auto-updater simulation, window decorations).

### 2.3 TypeScript Type Verification
Validates strict type-safety across all 280+ lesson modules, visualizer stages, and UI components without emitting files:
```powershell
npx tsc --noEmit
```
- **Target**: Zero errors or warnings. Run this before committing any code changes.

---

## 3. Automation Scripts & Build Tooling

All developer automation scripts are located in the `scripts/` directory and can be executed using Node.js:

### 3.1 Course Pack Exporter (`export_packs.js`)
Compiles the raw lesson source directories (`src/lessons/{c,cpp,java,dsa,ml,networks}`) into standalone `.json` packs and creates the offline distribution archive:
```powershell
node scripts/export_packs.js
```
- **Output Directory**: `dist-packs/`
- **Generated Artifacts**:
  - `c-pack.json`
  - `cpp-pack.json`
  - `java-pack.json`
  - `dsa-pack.json`
  - `ml-pack.json`
  - `networks-pack.json`
  - `TreadCode_Packs_Offline.zip` (air-gapped lab archive)

### 3.2 Web Store Catalogue Synchronization (`sync_store_catalogue.js`)
Calculates active program counts and topic totals across all language packs and automatically updates the sibling web repository (`web/src/lib/catalogueData.ts`):
```powershell
node scripts/sync_store_catalogue.js
```
- Ensures public web catalogue descriptions, pricing tiers, and course program stats match the live client codebase.

### 3.3 Release Version Bumper (`release.js`)
Synchronizes application version tags across all configuration manifests in a single command:
```powershell
node scripts/release.js 1.0.9
```
- Updates:
  1. `package.json` (`version`)
  2. `src-tauri/tauri.conf.json` (`version`)
  3. `public/version.json` (`version` and `releaseDate`)

### 3.4 Stale Binary Cleaner (`cleanup_stale.js`)
Scans build staging folders (`public/releases/`, `dist-packs/`, `dist/`) and cleans heavy binary files (`.exe`, `.zip`, `.dmg`, `.apk`):
```powershell
# Preview files (Dry run)
node scripts/cleanup_stale.js

# Permanently delete heavy binaries
node scripts/cleanup_stale.js --force
```

---

## 4. In-App Keyboard Shortcuts

TreadCode includes built-in keyboard shortcuts designed for smooth classroom presentation and rapid debugging:

| Key Binding | Scope | Action Performed |
| :--- | :--- | :--- |
| `Space` | Visualizer | **Play / Pause** auto-stepping execution |
| `Right Arrow` (`→`) | Visualizer | **Step Forward** one execution line |
| `Left Arrow` (`←`) | Visualizer | **Step Backward** one execution line |
| `Home` | Visualizer | **Reset** execution back to Step 1 |
| `End` | Visualizer | Jump immediately to the **Final Step** |
| `B` | Global | **Toggle SmartBoard** whiteboard canvas overlay |
| `Ctrl + F` / `Cmd + F` | Global | Open **Global Search Modal** (Lessons, topics, keywords) |
| `Escape` (`Esc`) | Global | Close active modal, search palette, or SmartBoard |

---

## 5. Troubleshooting & Gotchas

### 1. `tauri` command not recognized
- Ensure the Rust cargo bin path is in your environment variables:
  ```powershell
  $env:Path += ";$env:USERPROFILE\.cargo\bin"
  ```

### 2. Browser Mode HWID Display
- When running in a standard web browser (`npm run dev`), the app does not have direct access to Windows registry machine GUIDs. It automatically generates a persistent mock ID stored in `localStorage` under `flowtrace_browser_hwid`.
- In desktop mode (`npm run dev:tauri`), the real SHA-256 hardware hash is calculated by `src-tauri/src/lib.rs`.

### 3. IndexedDB Quotas & Modular Packs
- When downloading modular packs in private/incognito browser sessions, IndexedDB storage may be restricted. Always test offline pack downloads in native desktop mode or standard browser sessions.

### 4. Git Large File Warning
- Never commit `.exe` setup installers or `.zip` archives directly to the Git repository. Always use `node scripts/cleanup_stale.js --force` prior to committing to ensure the working tree remains lightweight.
