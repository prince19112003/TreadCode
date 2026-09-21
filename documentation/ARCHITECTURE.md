# TreadCode System Architecture & Technical Blueprint

> **Proprietary & Confidential**  
> Copyright (c) July 23, 2026 – Present Prince (`prince19112003`). All Rights Reserved.  
> Licensed under Proprietary EULA.

---

## 1. Executive Architecture Overview

**TreadCode** is a high-performance, offline-first educational desktop environment and code execution visualizer engineered for computer science classrooms, university lecture halls, school computer labs, and independent students.

The system combines three tightly coupled engines:
1. **Interactive Polyglot Code Visualizer**: Live line-by-line code stepping with synchronized memory models (Stack, Heap, Variable Symbol Table, and DSA graphs/trees).
2. **Dual-Layer SmartBoard Drawing Canvas**: Low-latency, hardware-accelerated blackboard and annotation system that can overlay directly over active program execution.
3. **Hardware-Bound Licensing & Multi-Channel Update Subsystem**: A distributed, cryptographically validated licensing framework bound to machine hardware signatures (HWID) with automated real-time cloud updates and air-gapped offline support.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            TreadCode Desktop Client                              │
│                                                                                  │
│   ┌────────────────────────┐  ┌───────────────────────┐  ┌───────────────────┐   │
│   │  Visualizer Workspace  │  │ SmartBoard Ink Canvas │  │ License & Support │   │
│   │  (Zustand + React 19)  │  │ (Dual-Layer 2D Canvas)│  │ (Firebase RTDB)   │   │
│   └───────────┬────────────┘  └───────────┬───────────┘  └─────────┬─────────┘   │
└───────────────┼───────────────────────────┼────────────────────────┼─────────────┘
                │                           │                        │
┌───────────────▼───────────────────────────▼────────────────────────▼─────────────┐
│                           Tauri v2 Native Rust Core                              │
│  - System Hardware Identification (Machine GUID, CPU Hash)                       │
│  - Ed25519 Cryptographic Auto-Updater & Shell Subprocess Delegation              │
│  - Window Decoration, Native Process Lifecycle, & Air-Gapped Sandbox             │
└───────────────────────────────────────────┬──────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼──────────────────────────────────────┐
│                            Cloud Infrastructure & Web                            │
│  - Firebase RTDB: Real-time licensing, telemetry, OTA updates, & support desk    │
│  - GitHub Releases: Certified binary hosting (x64 setup, Android APK, macOS)     │
│  - Web Store Catalogue: Public product showcase, changelogs, and direct browser  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Execution & Stepper Engine

### 2.1 The Execution Lifecycle
Unlike standard web code sandboxes that interpret code arbitrarily at runtime, TreadCode utilizes a **Deterministic Step Engine**. Each lesson program is compiled into a sequence of discrete `ExecutionStep` structures. This ensures 100% repeatable, glitch-free visual execution across all target platforms.

```
Program Registry (Topic Chunk)
        │
        ▼ (Dynamic Load)
Active Lesson Selection ──► Parse `ExecutionStep[]`
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │  useLessonStore (Zustand) │
                      │  - currentStepIndex       │
                      │  - isPlaying / speedMs    │
                      │  - highlightedLineNumber  │
                      │  - stepSnapshots (Delta)  │
                      └─────────────┬─────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
CodeStepPanel               MemoryInspectorStage         AudioExplanation
(Active line highlight)    (Stack/Heap visual sync)   (Bilingual TTS playback)
```

### 2.2 Playback Control Loop
- **Stepper Model**: Stepping forward or backward moves the `currentStepIndex` pointer. The UI recalculates the active line, updates the explanation text, and renders the current memory delta.
- **Auto-Play Loop**: Implemented with precise `requestAnimationFrame` pacing backed by configurable intervals (from 0.25x speed up to 4.0x speed). When reaching the terminal step, auto-play cleanly transitions to an idle completed state.
- **Audio Synchronization**: When stepping or auto-playing, the audio engine queries the current step’s audio cues. If Hindi or English voice guidance is enabled, the appropriate speech or sound effect is dispatched without blocking the visual renderer.

### 2.3 Key Source Mapping

| Component / Subsystem | Source Path | Primary Role |
| :--- | :--- | :--- |
| **Lesson Store** | `src/lessons/useLessonStore.ts` | Global Zustand store controlling execution step index, playback state, and speed. |
| **Lesson Schema** | `src/lessons/types.ts` | TypeScript interfaces for `CodeLine`, `ExecutionStep`, `MemorySnapshot`, and `AnimationEvent`. |
| **Registry & Chunks** | `src/lessons/registry.ts` | Dynamic asynchronous chunk loader that lazy-loads language packs on demand. |
| **Visualizer Shell** | `src/features/visualizer/VisualizerWorkspace.tsx` | Main split-pane workspace orchestrating code view, stages, and execution controls. |
| **Code Display** | `src/features/visualizer/components/CodeStepPanel.tsx` | Syntax-highlighted code viewer with dynamic active-line indicators. |

---

## 3. Memory Architecture & State Snapshots

### 3.1 Simulated Virtual Memory Model
TreadCode simulates real machine memory architecture to help students understand foundational low-level programming concepts:

```
┌─────────────────────────────────────────────────────────────┐
│                    TreadCode Virtual RAM                    │
├──────────────────────────────┬──────────────────────────────┤
│         Stack Frames         │             Heap             │
│  ┌────────────────────────┐  │  ┌────────────────────────┐  │
│  │ main() Frame           │  │  │ Dynamic Arrays / Alloc │  │
│  │ - int a = 10           │  │  │ 0x00408A: [1, 2, 3, 4] │  │
│  │ - char* ptr = 0x00408A ├──┼──►                        │  │
│  └────────────────────────┘  │  └────────────────────────┘  │
│  ┌────────────────────────┐  │  ┌────────────────────────┐  │
│  │ swap(x, y) Frame       │  │  │ Object Instances       │  │
│  │ - int* pX = &a         │  │  │ Node { val: 42, next } │  │
│  └────────────────────────┘  │  └────────────────────────┘  │
├──────────────────────────────┴──────────────────────────────┤
│                    Variable Symbol Table                    │
│      Key: 'a'  | Type: int  | Value: 10 | Address: 0x7FFE   │
│      Key: 'ptr'| Type: ptr  | Value: 0x00408A               │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Snapshot Delta Engine
To allow users to scrub backward and forward through program execution without latency:
1. **Pre-computed State**: Every step in a lesson defines a complete, immutable snapshot of variables, call stack frames, and active pointer links.
2. **Deterministic Time-Travel**: Scrubbing backward does not require re-executing previous lines; the store simply updates its pointer to index `N - 1`, instantly restoring the exact memory state.
3. **Animated Transitions**: When stepping forward, UI elements that changed value or position trigger smooth spring animations via Motion, drawing the student's eye to the exact mutated variable.

### 3.3 Key Source Mapping

| Component / Subsystem | Source Path | Primary Role |
| :--- | :--- | :--- |
| **Stack Visualizer** | `src/features/visualizer/components/stages/StackVisualStage.tsx` | Renders function call stack frames, return addresses, and local scope variables. |
| **Variable Inspector** | `src/features/visualizer/components/stages/VariableInspectorStage.tsx` | Grid table displaying names, data types, current values, and memory addresses. |
| **DSA Visualizer** | `src/features/visualizer/components/stages/DsaAlgoStage.tsx` | Renders tree nodes, graphs, Dijkstra paths, and array swap animations. |
| **Pointer Links** | `src/features/visualizer/components/stages/PointerStage.tsx` | Visual pointer arrows connecting stack references to heap allocations. |

---

## 4. Dual-Layer SmartBoard & Ink Engine

The SmartBoard is a specialized drawing and teaching blackboard designed for classroom projectors, interactive touchscreens, and desktop graphics tablets.

### 4.1 Dual-Layer Canvas Coordinator
To deliver 60 FPS drawing without stuttering during live code animation:
- **Base Canvas (Committed Layer)**: Stores permanently committed strokes, shapes, and background grid patterns.
- **Active Canvas (Overlay Layer)**: Dedicated to the active in-progress stroke. Runs on a direct `requestAnimationFrame` loop with `desynchronized: true` enabled on the HTML5 2D rendering context to bypass browser compositor lag.

```
User Input (Mouse / Stylus / Touch)
               │
               ▼
      [Point Decimation] ──► Douglas-Peucker reduction (< 1.5px variance)
               │
               ▼
      [Curve Smoothing]  ──► Chaikin algorithm (3-point subdivision)
               │
               ▼
      [Active Canvas]    ──► Rendered immediately to top RAF layer
               │
          (On PointerUp)
               ▼
      [Commit to Base]   ──► Merged into permanent stroke history stack (Undo/Redo)
```

### 4.2 Ink Engine Capabilities
- **Chaikin Curve Smoothing**: Raw pointer coordinates are decimated and smoothed using Chaikin's corner-cutting algorithm to produce organic handwriting.
- **Shape Snapping**: Automatically detects geometric primitives (circles, rectangles, arrows, straight lines) and converts freehand sketches into crisp mathematical vectors when paused.
- **Color Palettes & Backgrounds**: Supports blackboard dark mode, whiteboard light mode, blueprint grids, and dot matrices.
- **Exporting**: Instant PNG export with automatic watermark, preserving classroom notes directly to local disk.

### 4.3 Key Source Mapping

| Component / Subsystem | Source Path | Primary Role |
| :--- | :--- | :--- |
| **SmartBoard Modal** | `src/features/smartboard/SmartBoardModal.tsx` | Main overlay coordinator managing canvas visibility, resizing, and keyboard shortcuts. |
| **Ink Engine** | `src/features/smartboard/engine/inkEngine.ts` | Mathematical curve interpolation, Chaikin smoothing, and point decimation. |
| **Eraser Engine** | `src/features/smartboard/engine/eraserEngine.ts` | Vector collision detection for stroke-based and point-based erasing. |
| **Shape Snapping** | `src/features/smartboard/engine/shapeSnap.ts` | Geometric recognition for rectangles, ellipses, triangles, and arrows. |
| **Toolbar UI** | `src/features/smartboard/components/SmartBoardToolbar.tsx` | Floating tool palette for pen selection, colors, widths, and background modes. |

---

## 5. Modular On-Demand Extension Pack Architecture

To keep the core Windows installer lightweight (~70 MB), TreadCode adopts a modular extension pack architecture. Advanced courses are isolated into decoupled bundles.

```
                 TreadCode Core App
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
Built-in Courses                 Modular Extension Packs
(Python 100 Programs)            (C, C++, Java, DSA, ML, Networks)
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
             Online Flow                                 Air-Gapped Flow
   Download JSON from CDN / Vercel             Extract `TreadCode_Packs_Offline.zip`
                    │                                           │
                    ▼                                           ▼
         Store into IndexedDB                        Local Pack Importer
         (`flowtrace_modules`)                      (File drag-and-drop / auto-scan)
                    │                                           │
                    └─────────────────────┬─────────────────────┘
                                          ▼
                             Registered into Lesson Registry
```

### 5.1 Extension Pack Hierarchy

| Pack ID | Course Title | Programs & Topics | Primary Tier |
| :--- | :--- | :--- | :--- |
| `python` | Core Python 3 Visualizer | 100 Programs (16 Topics) | **Community (Built-in Free)** |
| `c` | C Programming & Pointers | 45 Programs (13 Topics) | **Professional** |
| `cpp` | C++ Object-Oriented & STL | 50 Programs (14 Topics) | **Professional** |
| `java` | Java JVM & OOP Visualizer | 52 Programs (13 Topics) | **Professional** |
| `dsa` | Data Structures & Algorithms | 21 Programs (19 Topics) | **Professional** |
| `ml` | Machine Learning Visualizer | 11 Programs (11 Topics) | **Enterprise** |
| `networks` | Computer Networks & Packets | 8 Programs (8 Topics) | **Enterprise** |

### 5.2 Key Source Mapping

| Component / Subsystem | Source Path | Primary Role |
| :--- | :--- | :--- |
| **Module Store** | `src/shared/hooks/useModuleStore.ts` | IndexedDB manager handling downloading, caching, and state verification of packs. |
| **Extensions Tab** | `src/shared/components/ui/ExtensionsTab.tsx` | Settings UI for browsing available packs, downloading, or importing offline archives. |
| **Pack Exporter** | `scripts/export_packs.js` | Build automation compiling source lesson folders into distribution JSON bundles. |
| **Pack Archive** | `dist-packs/` | Output staging directory containing compiled standalone `.json` packs and `.zip` archives. |

---

## 6. Multi-Channel Update & Delivery Pipeline

TreadCode guarantees that users across online and offline environments always have access to updates through **two distinct, prominent channels**:

```
                              Firebase Realtime Database
                           `tauri_updater.json` & RTDB Nodes
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
        Option 1: Direct .exe Setup                Option 2: Web Store Release Page
  - Download binary directly via app         - Redirects to official web catalogue
  - Background download with progress bar    - View release notes, screenshots, & web
  - Relaunch app with installer execution    - URL: `/items/treadcode`
```

### 6.1 Native Tauri Auto-Updater (Ed25519 Signed)
- **Signature Verification**: Every native binary published to GitHub Releases is cryptographically signed with a private Ed25519 key. The public key is embedded in `src-tauri/tauri.conf.json`.
- **Zero-Failure RTDB Fallback**: If GitHub API rate limits occur, `useUpdateChecker` queries Firebase Realtime Database (`/tauri_updater.json`) directly, ensuring update availability is always broadcast instantly.

### 6.2 The Two User Update Options
1. **Option 1: Instant Direct Setup (`.exe`)**:
   - Downloads the latest executable installer directly inside the application.
   - Automatically guides the user to exit and run the installer without requiring manual browser navigation.
2. **Option 2: Official Web Store Section**:
   - Opens the official web catalogue product page: `https://tread-code-smoky.vercel.app/items/treadcode`.
   - Allows users to review changelogs, inspect screenshots, and download setup files or offline packs via their browser.

### 6.3 Key Source Mapping

| Component / Subsystem | Source Path | Primary Role |
| :--- | :--- | :--- |
| **Update Checker Hook** | `src/shared/hooks/useUpdateChecker.ts` | Dual-engine update detector querying Tauri native updater and Firebase RTDB fallback. |
| **Update Modal UI** | `src/shared/components/ui/UpdateBanner.tsx` | Modal dialog presenting the two update choices with download progress indicators. |
| **Settings About Section** | `src/pages/SettingsPage.tsx` | In-app version inspector, channel switcher, and update trigger. |
| **Release Automation** | `scripts/release.js` | Automated script bumping versions across `package.json`, `tauri.conf.json`, and `version.json`. |

---

## 7. Security, Hardware Binding & Licensing Subsystem

TreadCode enforces a strictly managed licensing architecture designed to prevent unauthorized key sharing while providing seamless activation for students and institutional computer labs.

```
Client Machine
      │
      ▼
Generate Machine HWID ──► Tauri Rust: SHA-256(Machine GUID + CPU Processor ID)
      │
      ▼
User Enters License Key ──► Firebase RTDB Query: `/licenses/{KEY}`
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
         Key Validated?                            Key Blocked / Expired?
         - Check expiration date                   - Show error alert in app
         - Check device limit (Max 6)              - Prompt support ticket
               │
               ▼
     Bind Machine HWID
     Add to `devices[hwid]` node
               │
               ▼
     Activate Client Shell
     Unlock Tier Modules (Community, Professional, Enterprise)
```

### 7.1 Tier Features & Device Limits
- **Community Edition**: Pre-activated for all users. Includes full Python core curriculum. 100% offline.
- **Professional Edition**: ₹499 / 6 Months. Unlocks C, C++, Java, and DSA visualizers. Supports up to **6 bound devices** per key.
- **Enterprise Edition**: ₹799 / 6 Months. Unlocks all Professional courses + Machine Learning, Networks, and priority SmartBoard overlays. Supports up to **6 bound devices** per key.

### 7.2 Remote Device Unlinking & Logout
Users or lab administrators can view all hardware devices bound to an active license key from `Settings > Licensing`. If a user reaches their 6-device limit:
- They can click **Logout Device** next to any older HWID.
- The client calls `unlinkDeviceFromLicense()` in Firebase, removing that HWID from the license's active device list and immediately freeing a seat.

### 7.3 Real-Time Key Issuance Popups
When an activation request is approved on the Admin Panel:
- A listener (`subscribeToDeviceKeyRequests`) in `KeyIssuedNotificationModal.tsx` detects that the key status changed to `approved`.
- The desktop app immediately displays a prominent popup alerting the user that their key has been generated and is ready for 1-click activation.

### 7.4 Key Source Mapping

| Component / Subsystem | Source Path | Primary Role |
| :--- | :--- | :--- |
| **Firebase Integration** | `src/shared/config/firebase.ts` | Real-time database endpoints for license validation, device binding, and tickets. |
| **License Gatekeeper** | `src/app/App.tsx` | Top-level context provider managing license validation, HWID detection, and tier access. |
| **License Modal** | `src/shared/components/ui/LicenseModal.tsx` | Activation dialog for entering keys, checking device limits, and unlinking hardware. |
| **Key Issued Popup** | `src/shared/components/ui/KeyIssuedNotificationModal.tsx` | Real-time notification popup alerting users when their requested key is issued. |
| **Native HWID Provider** | `src-tauri/src/lib.rs` | Rust backend function calculating hardware GUID and system fingerprints. |

---

## 8. Directory & Responsibility Matrix

| Directory | Primary Architectural Responsibility | Key Technologies |
| :--- | :--- | :--- |
| `src/app/` | Root routing, global context providers, application shell, and global navigation. | React Router v7, React 19, Lucide icons |
| `src/features/visualizer/` | Split-pane code visualizer, stepper timeline, and animated execution stages. | Zustand, Motion, Tailwind CSS |
| `src/features/smartboard/` | Dual-layer ink canvas, vector smoothing, shape snapping, and toolbars. | HTML5 2D Canvas, RAF loop, Chaikin algorithms |
| `src/lessons/` | Lesson registry, curriculum definitions, dynamic chunk loading, and topic catalogs. | TypeScript, dynamic ES imports |
| `src/shared/` | Reusable UI components, Firebase client, update hooks, and module storage. | Firebase RTDB, IndexedDB, Tauri plugins |
| `src/pages/` | Top-level views: Language Selection, Topic Selection, Visualizer, and Settings. | React, Motion, PageTransition |
| `src-tauri/` | Rust desktop backend, HWID generation, native updater, and window management. | Rust 2021, Tauri v2, Windows API |
| `scripts/` | Developer automation: pack compiling, web store syncing, release versioning. | Node.js, fs-extra, archiver |
| `public/` | Static media, icons, sound effects, and web manifest assets. | WebP, SVG, MP3 |
