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

To deploy a new software version (e.g. updating from `1.0.3` to `1.0.4`):

```bash
# Auto-patches tauri.conf.json, package.json, builds native .exe, and updates Firebase RTDB
npm run release 1.0.4
```

---

## 📡 Remote System Auto-Update Push Guide (Private Repo & Firebase)

TreadCode uses **Tauri Native Auto-Updater** combined with **Firebase Storage**. Since the repository is **Private**, release `.exe` files are served via Firebase Storage.

### How to Push an Update (Step-by-Step):

1. **Build & Release Script Run Karein**:
   ```bash
   npm run release 1.0.4
   ```
   Ye command `tauri.conf.json`, `package.json`, aur `useUpdateChecker.ts` ko auto-update karegi, native installer build karegi, aur Firebase RTDB ke `tauri_updater` node ko sync karegi.

2. **Upload .exe to Firebase Storage**:
   - Built installer location: `src-tauri/target/release/bundle/nsis/TreadCode_1.0.4_x64-setup.exe`
   - [Firebase Console](https://console.firebase.google.com/) -> Storage me jayein.
   - Installer file ko upload karein aur uska **Public Download URL** copy karein.

3. **Paste URL in Firebase RTDB (`tauri_updater`)**:
   - [Firebase Console](https://console.firebase.google.com/) -> Realtime Database -> `tauri_updater` -> `platforms` -> `windows-x86_64` me jayein.
   - `"url"` field me copy kiya gaya **Firebase Storage Download URL** paste kar dein.

---

### 🔄 Remote App User Flow (Automatic)
1. **Detection**: Desktop App open hote hi background me Firebase check karti hai.
2. **Seamless Download**: App ke andar hi **Real Download Progress Bar** chalta hai (Tauri native byte streaming).
3. **1-Click Restart**: Download complete hote hi **"Restart App Now"** button aata hai. Click karte hi app restart hoti hai aur nayi features ke sath load ho jati hai!


---

## 🔑 Licensing & Hardware Access Security

- **6-Digit Alphanumeric Serials**: License keys are formatted as clean 6-character uppercase serials (e.g. `K9P2X8`).
- **Surgical Device Seat Inspector**: Each key tracks bound device hardware signatures (`HWID`).
- **Access Revocation Superpower**: Blacklist any computer signature in 1-click from the Admin Panel. Blacklisted machines are immediately blocked from running TreadCode on their next sync or startup.
