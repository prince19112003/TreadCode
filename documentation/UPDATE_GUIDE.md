# TreadCode Modern Multi-Channel Update Pipeline Guide

> **Authoritative Operational Reference for Software Releases & OTA Updates**  
> Covers native Tauri auto-updates, Firebase RTDB fallback, Option 1 (.exe setup), Option 2 (Web Store), and release publishing procedures.

---

## 1. How Update Detection Works

TreadCode uses an enterprise-grade **Dual-Engine Update Detection Pipeline** that guarantees updates reach users even under strict network firewalls or GitHub API rate limits.

```
Desktop App Starts (or User clicks "Check for Updates")
                         │
                         ▼
             [ isNativeApp() Guard ] ──► (Web browser preview? Exit immediately)
                         │
                         ▼
        1. Query Tauri Native Updater Plugin
           (Checks GitHub Releases & verifies Ed25519 signature)
                         │
        ┌────────────────┴────────────────┐
        ▼ Available?                      ▼ Failed / Skipped?
  Use Native Update              2. Query Firebase RTDB Fallback
  Payload (`updateObj`)             (`/tauri_updater.json`)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
             Update Detected (v1.0.9 > v1.0.8)?
                         │
                         ▼
     Present In-App Modal Dialog (`UpdateModal`)
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
 Option 1: Instant Direct Setup    Option 2: Web Store Page
 - In-app download & progress bar  - Opens web catalogue
 - Silent installer execution      - Review release notes
 - Auto-exit / relaunch            - URL: `/items/treadcode`
```

---

## 2. The Two User Update Options

When a new update is announced, the user is presented with two clear options:

### Option 1: Instant Direct Setup (`.exe`)
- **Best For**: Fast, frictionless classroom updates without leaving the application.
- **Workflow**:
  1. User clicks **"⚡ Download & Install .exe"**.
  2. If running native Tauri with signature, it streams chunks with a real-time percentage progress bar.
  3. If running fallback mode, it opens the direct installer binary from GitHub Releases.
  4. Prompts the user to click **Restart App Now**, exiting the client so the installer can seamlessly replace the executable.

### Option 2: Download from Official Web Store
- **Best For**: Users who want to inspect screenshots, review extensive changelogs, or download from a browser.
- **Workflow**:
  1. User clicks **"🌐 Open Web Store Release Page ↗"**.
  2. The system shell opens `https://tread-code-smoky.vercel.app/items/treadcode`.
  3. Users can download the Windows installer, inspect SHA-256 checksums, or download the `TreadCode_Packs_Offline.zip` archive for air-gapped lab computers.

---

## 3. Developer Release Procedure (Step-by-Step)

Follow this checklist whenever releasing a new patch, minor, or major version:

### Step 1: Bump Versions Across Manifests
Run the release version bumper to update `package.json`, `src-tauri/tauri.conf.json`, and `public/version.json` in one atomic operation:
```powershell
node scripts/release.js 1.0.9
```

### Step 2: Export Modular Course Packs
Ensure all course modules are compiled into the latest distribution packs:
```powershell
node scripts/export_packs.js
```

### Step 3: Synchronize Web Store Catalogue
Update program counts and syllabus statistics in the sibling web store:
```powershell
node scripts/sync_store_catalogue.js
```

### Step 4: Build Desktop Installer
Run the Tauri desktop build pipeline:
```powershell
npm run build:tauri
```
- Output setup binary: `src-tauri/target/release/bundle/nsis/TreadCode_1.0.9_x64-setup.exe`
- Output updater signature: `src-tauri/target/release/bundle/nsis/TreadCode_1.0.9_x64-setup.exe.sig`

### Step 5: Publish Release on GitHub
1. Create a new Release on GitHub: `https://github.com/prince19112003/TreadCode/releases/new`
2. Set Tag: `v1.0.9`
3. Upload `TreadCode_1.0.9_x64-setup.exe` and `TreadCode_Packs_Offline.zip`.

### Step 6: Publish OTA Update Payload to Firebase
Update the `/tauri_updater.json` node in Firebase Realtime Database:
```json
{
  "version": "1.0.9",
  "notes": "### What's New in v1.0.9\n- Performance improvements\n- Added Graph visualizers",
  "pub_date": "2026-09-22T00:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "url": "https://github.com/prince19112003/TreadCode/releases/download/v1.0.9/TreadCode_1.0.9_x64-setup.exe",
      "signature": "<PASTE_SIGNATURE_FROM_SIG_FILE>"
    }
  }
}
```
As soon as this JSON is saved in Firebase, all active desktop clients worldwide will receive the update notification on their next check!
