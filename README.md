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

```bash
git add .
git commit -m "fix: your commit message here" --no-verify
git push origin main
```

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

To deploy a new software version (e.g. updating from `1.0.3` to `1.0.4`):

```bash
# Auto-patches tauri.conf.json, package.json, builds native .exe, and updates Firebase RTDB
npm run release 1.0.4
```

---

---

## 📡 Software Auto-Update Guide (Private Repo & Vercel CDN)

TreadCode uses **Tauri Native Auto-Updater** combined with **Vercel CDN + Firebase RTDB**. Your repository remains **100% Private**.

There are **2 Simple Ways** to push software updates to all installed remote devices globally:

---

### ⚡ Method 1: Automatic 1-Command Push (Recommended for Developers)

Whenever you make code changes and want to release a new version (e.g. `1.0.5`):

1. **Run 1-Click Release Command**:
   ```bash
   npm run release 1.0.5
   ```
   *What this does automatically:*
   - Auto-patches `tauri.conf.json`, `package.json`, and `useUpdateChecker.ts`
   - Compiles native `.exe` installer
   - Copies `.exe` to `public/releases/` folder for Vercel CDN hosting
   - Syncs version details to Firebase RTDB

2. **Push to Vercel (Deploys Installer Live)**:
   ```bash
   git push origin main --tags
   ```

---

### 🎛️ Method 2: Admin Panel Live Broadcast (No CLI Required)

If your installer `.exe` is already hosted on Vercel, Firebase Storage, or any custom CDN:

1. Open **Admin Panel** -> **TreadCode** -> **Controls (App Settings)**.
2. Under **🚀 Remote Software OTA Update Dispatcher**:
   - Enter **Target Version** (e.g. `1.0.5`).
   - Enter **Download URL** (e.g. `https://tread-code-smoky.vercel.app/releases/TreadCode_1.0.5_x64-setup.exe`).
3. Click **"Broadcast Update Now"**.

---

### 🔄 How Remote Client Apps Update Automatically
1. **Background Check**: Desktop App detects new version from Firebase RTDB within 1.2s of startup.
2. **In-App Byte Download**: Real-time progress bar streams the installer package directly inside the app.
3. **1-Click Restart**: User clicks **"Restart App Now"**, app relaunches seamlessly with new features applied!


---

## 🔑 Licensing & Hardware Access Security

- **6-Digit Alphanumeric Serials**: License keys are formatted as clean 6-character uppercase serials (e.g. `K9P2X8`).
- **Surgical Device Seat Inspector**: Each key tracks bound device hardware signatures (`HWID`).
- **Access Revocation Superpower**: Blacklist any computer signature in 1-click from the Admin Panel. Blacklisted machines are immediately blocked from running TreadCode on their next sync or startup.
