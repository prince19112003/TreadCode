# 🌐 Universal USB Plug & Play & Offline Web Architecture Guide

> **Document Location**: `documentation/platforms/UNIVERSAL_USB_OFFLINE_WEB_ARCHITECTURE.md`  
> **Target Scenarios**: Locked-Down Computer Labs, Visiting Guest Faculty, Institutional Air-Gapped PCs, Smart TVs, and Unidentified Operating Systems  
> **Supported Browsers**: Google Chrome (v75+), Microsoft Edge (v79+), Mozilla Firefox (v68+), Apple Safari (v13+), Brave, Opera  
> **Privilege Requirement**: **0% Administrator / Root Rights Required** (Runs in user space)  
> **Installation Footprint**: **0 MB on Host PC** (100% contained within USB Pen Drive)  
> **Current Version**: `v1.0.8` (Compressed Bundle: **~4.12 MB**)

---

## 1. The Real-World Classroom Challenge & Problem Statement

Visiting teachers, guest lecturers, and students frequently encounter host computers where:
1. **Administrative Lockdown**: Group Policy or DeepFreeze prevents running `.exe` installers, entering administrator passwords, or writing to `C:\Program Files` or the Windows Registry.
2. **CORS & Module Security Restriction**:
   - Modern browsers strictly enforce the **Same-Origin Policy** on local files.
   - If a teacher attempts to double-click an offline `index.html` via `file:///E:/index.html`, modern browsers block JavaScript ES modules (`<script type="module">`), Web Workers, and Canvas texture loading with CORS security errors.
3. **No Internet Access**: The classroom PC is completely air-gapped or restricted to internal college intranet.

---

## 2. The 1-Click Zero-Install Architecture

To make TreadCode run **with a single double-click in every scenario without any permissions**, TreadCode implements a **Micro-Listener Architecture**:

```
[Teacher USB Pen Drive]
 ├── Launch-TreadCode.bat         <── Double-click on Windows (7, 8, 10, 11)
 ├── Launch-TreadCode.sh          <── Double-click on Linux (BOSS / KITE / Ubuntu)
 ├── Launch-TreadCode.command     <── Double-click on macOS (Intel / Apple Silicon)
 ├── README-INSTRUCTIONS.txt      <── Plain-text quick guide for teachers
 └── app/                         <── Standalone optimized web distribution
      ├── index.html
      ├── favicon.ico / favicon.png
      └── assets/ (JS, CSS, SVGs, Audio, Fonts)
```

### How the Windows 1-Click Launcher Works (`Launch-TreadCode.bat`):
* **Zero Runtime Needed**: Does NOT require Node.js, Python, or Java.
* **Built-in Windows Subsystem**: Utilizes `.NET Framework`'s `System.Net.HttpListener` via Windows PowerShell (pre-installed on 100% of Windows 7 SP1, 8.1, 10, and 11 systems).
* **Zero Admin Rights**: Binding an ephemeral port on loopback (`http://127.0.0.1:5183/`) is permitted by Windows kernel network security for standard non-administrator user accounts.
* **Port Discovery**: Automatically increments from 5183 upwards if the default port is occupied.
* **Comprehensive MIME Types**: Supplies correct `Content-Type` headers for `.html`, `.js`, `.mjs`, `.css`, `.json`, `.wasm`, `.svg`, `.png`, `.jpg`, `.mp3`, `.woff`, `.woff2`, etc.
* **One-Click Experience**:
  1. Teacher plugs in USB drive and double-clicks `Launch-TreadCode.bat`.
  2. The script finds an available local port and binds to `127.0.0.1`.
  3. Automatically opens the teacher's default browser (Chrome / Edge / Firefox) directly to `http://127.0.0.1:5183/`.
  4. TreadCode loads at full 60 FPS speed with 100% feature parity (visualizers, SmartBoard, sound, and search).
  5. Closing the launcher terminal instantly terminates the listener cleanly without leaving background services.

### How the Linux 1-Click Launcher Works (`Launch-TreadCode.sh`):
* Tested and compatible with **BOSS Linux (C-DAC)**, **KITE GNU-Linux (Kerala Govt Schools)**, Ubuntu LTS, Debian, and Linux Mint.
* Checks for `python3 -m http.server`, `python -m SimpleHTTPServer`, `php -S`, or `busybox httpd`.
* Automatically launches the default browser via `xdg-open`, `sensible-browser`, `x-www-browser`, `google-chrome`, or `firefox`.
* Zero sudo/root rights required.

### How the macOS 1-Click Launcher Works (`Launch-TreadCode.command`):
* macOS recognizes `.command` files in Finder as double-clickable scripts that automatically open Terminal.
* Sets working directory to the USB mount point and opens default browser with `open http://localhost:$PORT/`.

---

## 3. Offline Licensing & Anti-Clock Tampering in Browsers

* **Storage Engine**: Offline license tokens, module permissions, and progress are stored in the browser's persistent `localStorage` and `IndexedDB`.
* **30-Day Offline Lease**: Once activated online (or pre-authorized via license key), the lease remains fully functional offline for the purchased duration (30, 180, or 365 days).
* **Monotonic Clock Defense**: Validates against the highest recorded timestamp stored in browser storage (`flowtrace_last_recorded_ts`), preventing clock rollback bypasses.
* **Session Continuity**: SmartBoard state, drawn shapes, and flowchart nodes persist in local storage across browser re-launches.

---

## 4. Packaging & Automated Cloud Distribution

* **Local Packaging Command**:
  ```bash
  npm run export-usb
  ```
  Automates building the frontend, creating the staging directory, injecting launchers, and generating `TreadCode-USB-Portable-v1.0.8.zip` and `TreadCode_USB_Portable.zip`.
* **Output Archive**:
  - Location: `release-usb/TreadCode-USB-Portable-v1.0.8.zip` (~4.12 MB)
  - Hosted at: `public/releases/TreadCode_USB_Portable.zip`
* **GitHub Actions CI/CD Pipeline**:
  - Workflow: `.github/workflows/build-usb-bundle.yml`
  - Triggers automatically on push tags `v*` and manual `workflow_dispatch`.
  - Compiles frontend and attaches the portable zip archive directly to GitHub Releases.
* **In-App Integration**:
  - Download banner in `UpdateBanner.tsx` displays **"USB Portable (.zip) · Zero Install"** with 1-click download.
