# TreadCode (Code Visualizer & SmartBoard)

> **A native, offline-first educational desktop environment that shows you exactly what your code does, step by step.**  
> Powered by Tauri v2, Rust, React 19, and HTML5 Canvas.

[![Target OS](https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011%20(x64)-blue.svg)](#)
[![License](https://img.shields.io/badge/License-Proprietary%20EULA-purple.svg)](#)
[![Architecture](https://img.shields.io/badge/Engine-Tauri%20v2%20%2B%20Rust-red.svg)](#)
[![Offline Mode](https://img.shields.io/badge/Internet-100%25%20Offline-emerald.svg)](#)

---

## 🌟 What is TreadCode?

**TreadCode** is an animation-first visual programming platform and teaching tool designed for computer science classrooms, university lecture halls, BCA/MCA/B.Tech students, and coding faculty. 

Instead of struggling with static textbook diagrams or pre-recorded videos, TreadCode allows students and instructors to watch program execution unfold **step by step with synchronized virtual memory**, dynamic call stack frames, variable symbol tables, and visual algorithm animations — with zero cloud latency and **no internet connection required**.

---

## ✨ Core Features

### 1. 🔍 Step-by-Step Code Execution Visualizer
- **Synchronized Virtual Memory**: Watch variable states mutate, stack frames push/pop, and pointers dereference dynamically as each line of code executes.
- **Polyglot Curriculum**: Over 280+ interactive visual programs across **Python 3**, **C**, **C++**, **Java**, **Data Structures & Algorithms**, **Machine Learning**, and **Computer Networks**.
- **Interactive DSA Stages**: Real-time visualizers for Sorting algorithms (Bubble, Selection, Merge, Quick), Binary Search Trees, Graphs (BFS, DFS), and Dijkstra shortest pathfinding.
- **Dynamic Speed & Scrubber**: Scrub backwards and forwards through program execution seamlessly with instant time-travel state reconstruction.

### 2. 🎨 Dual-Layer SmartBoard Drawing Canvas
- **Integrated Classroom Blackboard**: Trigger an instant drawing canvas directly over live executing code with a single click or keyboard shortcut (`B`).
- **Low-Latency Ink Engine**: Built on HTML5 2D Canvas with `desynchronized: true`, Chaikin corner-cutting curve smoothing, and Douglas-Peucker point decimation.
- **Smart Shape Snapping**: Automatically snaps freehand sketches into clean rectangles, circles, triangles, and flow arrows.
- **Export & Share**: Save high-resolution whiteboard annotations directly to disk for student distribution.

### 3. 🌐 Bilingual Step Guidance (Hindi & English)
- Features both textual and audio step-by-step explanations in **Hindi** and **English**, ensuring complex algorithmic logic is accessible to all learners.

### 4. 📦 Modular Offline Course Extension Packs
- A compact core Windows installer (~70 MB) with an on-demand course pack architecture.
- Advanced packs can be downloaded in-app or deployed via the **Offline Course Packs Archive** for air-gapped university labs.

---

## 🏷️ Editions & Licensing Tiers

| Tier | Price / Term | Included Courses | Device Limit | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Community** | **Free Forever** | Complete Python 3 Visualizer (100 Programs) | Unlimited | 100% Offline, No Registration Required |
| **Professional** | ₹499 / 6 Months | Python, C, C++, Java, and DSA Algorithms | Up to **6 Devices** | Core Engineering Syllabus, Memory Visualizers |
| **Enterprise** | ₹799 / 6 Months | Everything in Professional + ML & Networks | Up to **20 Devices** | SmartBoard Priority Tools, High-Performance Stages |
| **Institutional** | Custom Quote | All Courses + Custom University Branding | Scalable Seats | College Logo/Name on Shell, Lab-Wide Locks |

---

## 🚀 Multi-Channel Update Mechanism

TreadCode provides **two distinct update options** so users can always stay current:
1. **Option 1: Instant Direct Setup (`.exe`)**: Download and run the latest Windows installer directly from within the desktop application.
2. **Option 2: Official Web Store Section**: Visit TreadCode's dedicated web catalogue page ([treadcode on Web Store](https://fadewyng.pages.dev/items/treadcode)) to check release notes, screenshots, and download setup files from your browser.

---

## 📦 Platform Distribution Formats & Storage Locations

TreadCode provides pre-compiled, optimized binaries tailored for each classroom hardware ecosystem:

| Target Platform | Package Format | Local Staging / Build Location | Build Command / Workflow | Production Hosting (Direct Download) |
| :--- | :--- | :--- | :--- | :--- |
| **Windows 10 / 11 (64-bit)** | `.exe` (NSIS Setup) | `src-tauri/target/release/bundle/nsis/` | `npm run tauri build` | [Download Windows Setup](https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_1.0.8_x64-setup.exe) |
| **Android Smart Boards (IFP)** | `.apk` (Release) | `android/app/build/outputs/apk/release/` | `.github/workflows/build-android-apk.yml` | [Download Android APK](https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_1.0.8.apk) |
| **Linux Govt Schools (BOSS / KITE)** | `.AppImage` / `.deb` | `src-tauri/target/release/bundle/appimage/` | `.github/workflows/build-linux-release.yml` | [Download Linux AppImage](https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_1.0.8_amd64.AppImage) |
| **Universal USB Zero-Install** | `.zip` (Portable) | `release-usb/` & `public/releases/` | `npm run export-usb` | [Download USB Portable](https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_USB_Portable.zip) |
| **Offline Course Content Packs** | `.zip` (Curriculum) | `dist-packs/` | `npm run export-packs` | [Download Course Packs](https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_Packs_Offline_v1.0.8.zip) |

### 📁 USB Zero-Install Bundle Structure:
The standalone portable package contains zero-dependency launchers and native OS icons:
```text
[TreadCode-USB-Portable]
 ├── Launch-TreadCode.bat        <── Windows 1-Click launcher (PowerShell Micro-Listener)
 ├── Launch-TreadCode.sh         <── Linux 1-Click launcher (KITE / BOSS / Ubuntu)
 ├── Launch-TreadCode.command    <── macOS 1-Click launcher
 ├── TreadCode.desktop           <── Linux desktop shortcut with icon
 ├── autorun.inf                 <── Windows USB drive auto-label & icon
 ├── app.ico / app.icns / app.png<── Native OS icons for all systems
 ├── README-INSTRUCTIONS.txt     <── Plain-text educator guide
 └── app/                        <── 100% self-contained offline application
```

---

## 📚 Complete Documentation Suite

All detailed architectural, security, algorithmic, curriculum, and operational manuals are organized in the [`documentation/`](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation) directory:

| Document | Description |
| :--- | :--- |
| 🏗️ [**System Architecture Guide**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/ARCHITECTURE.md) | Deep technical breakdown of the memory model, execution stepper, ink engine, update pipeline, and source code mapping. |
| 🎨 [**Design System & Interface Hierarchy**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/DESIGN.md) | Complete UI design tokens, component hierarchy tree, data interfaces, state machine models, and 3-pane layout architecture. |
| 🛡️ [**Security & Safety Blueprint**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/SECURITY_AND_SAFETY.md) | Zero-to-hundred security specs: HWID derivation, 6-device unlinking, sandboxed execution, and Ed25519 signatures. |
| ⚡ [**Algorithms & Performance**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/ALGORITHMS_AND_PERFORMANCE.md) | Mathematical inking (Douglas-Peucker & Chaikin), virtual memory algorithms, BST positioning, and sub-80MB RAM optimization. |
| 📖 [**Curriculum & Syllabus**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/CURRICULUM_AND_SYLLABUS.md) | Complete course catalog of all 287 interactive visual lessons across all 7 subject domains. |
| 🔄 [**Update Pipeline Guide**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/UPDATE_GUIDE.md) | Modern dual-channel update operations: Option 1 (.exe setup), Option 2 (Web Store), and release checklists. |
| 💻 [**Commands & Operations Guide**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/COMMANDS_AND_OPERATIONS.md) | Developer guide covering all CLI commands, pack exporting, store syncing, and in-app keyboard shortcuts. |
| 🎛️ [**Admin Panel Power Guide**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/ADMIN_PANEL_GUIDE.md) | Complete manual for the Firebase Admin Panel: license creation, 6-device limits, complaints triage, and OTA broadcasts. |
| 📋 [**Repository & File Inventory**](file:///c:/Users/princ/Desktop/Code%20Visualizer/documentation/FILE_INVENTORY.md) | Complete audit of active production files, scripts, build outputs, and git hygiene policies. |

---

## ⚖️ Intellectual Property & Copyright

```
Copyright (c) July 23, 2026 – Present Prince (prince19112003). All Rights Reserved.
Repository Initial Commit: July 23, 2026 at 01:11:21 +0530 (IST)
Licensed under Proprietary EULA. Unauthorized copying, decompilation, or redistribution is strictly prohibited.
```
