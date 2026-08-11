# TreadCode Visualizer 💻

> **Classroom Animation & Code Visualization Platform for Colleges & Universities**

TreadCode is an animation-first, interactive code visualizer built for computer science faculty, classroom projectors, and beginner students. It converts abstract programming code (Python, C/C++, Java, DSA) into step-by-step visual execution flows—showing variable allocations, loop iterations, memory arrays, function call stacks, and flowchart logic in real time.

---

## 🏗️ System Architecture

The platform consists of two integrated components:

1. **TreadCode Desktop Application** (`Code Visualizer`):
   - **Stack**: React 19, TypeScript, Vite, Tailwind CSS, Tauri v2 (Native Windows Desktop `.exe`).
   - **Features**: Step-by-step visualizer, inline code parameter editor, classroom projector display presets, AI voice narration, and 6-digit license verification.
2. **Standalone Admin Control Panel** (`admin panel`):
   - **Stack**: React, TypeScript, Tailwind CSS, Firebase Realtime Database.
   - **Features**: Issue 6-digit serial keys, track installed desktop computers, 1-click computer access revocation (`HWID` blacklisting), broadcast live announcements, and remote course feature locks.

---

## ⚡ Essential Development Commands

### 1. TreadCode Desktop Application (`Code Visualizer`)

Run all commands inside the main project directory:

```bash
# Install dependencies
npm install

# Start local web development server (React + Vite)
npm run dev

# Start local Tauri Desktop App in development mode
npm run tauri dev

# Test TypeScript compilation & build production web bundle
npm run build

# Build Native Windows Installer (.exe setup package)
npx tauri build
```
> *Output Installer Location*: `src-tauri/target/release/bundle/nsis/TreadCode_1.0.0_x64-setup.exe`

---

### 2. Standalone Admin Control Panel (`admin panel`)

Run commands inside the `c:\Users\princ\Desktop\admin panel` folder:

```bash
# Navigate to Admin Panel folder
cd "..\admin panel"

# Install dependencies
npm install

# Start local Admin Panel server (Runs on http://localhost:5178)
npm run dev

# Test TypeScript compilation & build production bundle
npm run build
```

---

### 3. Releasing a New Version Update

To deploy a new software version (e.g. updating from `1.0.0` to `1.0.1`):

```bash
# Auto-patches tauri.conf.json, version.json, and updater.json in 1-click
npm run release 1.0.1
```

---

## 📡 Remote System Auto-Update Push Guide

To push an over-the-air (OTA) software update to all installed remote systems so users receive an on-screen update pop-up:

### Step 1: Update `global_update.json` in Firebase RTDB
Navigate to [Firebase Realtime Database](https://console.firebase.google.com/) -> Data -> `global_update` node and set the following JSON structure:

```json
{
  "version": "1.1.0",
  "buildDate": "2026-08-11",
  "changelog": [
    "Added Graph Animations (DFS & BFS)",
    "New High-Performance Visualizer Stage",
    "Optimized Pen & Touch Drawing Response"
  ],
  "downloadUrl": "https://github.com/prince19112003/FlowTrace/releases/download/v1.1.0/TreadCode_Setup.exe",
  "releaseUrl": "https://github.com/prince19112003/FlowTrace/releases/latest"
}
```

### Step 2: How Remote Systems Receive the Update
1. **Instant On-Screen Pop-Up**: Within 1.2 seconds of launching the desktop app, all remote systems automatically detect `remoteVersion > currentVersion` and display an **On-Screen Update Modal** with release notes and a 1-click **Update Now** button.
2. **If User Skips ("Remind Me Later")**: The pop-up dismisses to avoid interrupting ongoing classroom lectures, but a persistent **"Software Update Available"** banner remains pinned at the top of **Settings Page** so users can update whenever they wish later.

---

## 🔑 Licensing & Hardware Access Security

- **6-Digit Alphanumeric Serials**: License keys are formatted as clean 6-character uppercase serials (e.g. `K9P2X8`).
- **Surgical Device Seat Inspector**: Each key tracks bound device hardware signatures (`HWID`).
- **Access Revocation Superpower**: Blacklist any computer signature in 1-click from the Admin Panel. Blacklisted machines are immediately blocked from running TreadCode on their next sync or startup.
