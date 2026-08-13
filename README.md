# TreadCode (Code Visualizer & SmartBoard) — Developer Manual & Architecture Guide

> **Internal Developer Manual**: This document is a complete technical guide for software engineers, maintainers, and contributors working on the **TreadCode** codebase. It covers architecture, state management, adding new programs/languages, building and testing, licensing, and the update pipeline.

---

## Table of Contents

1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [Technology Stack](#2-technology-stack)
3. [Directory & Module Structure](#3-directory--module-structure)
4. [State Management (Zustand Architecture)](#4-state-management-zustand-architecture)
5. [Lesson Program System (How to Add/Edit Lessons)](#5-lesson-program-system-how-to-addedit-lessons)
6. [SmartBoard & Ink Engine Architecture](#6-smartboard--ink-engine-architecture)
7. [Licensing, Telemetry & Security Engine](#7-licensing-telemetry--security-engine)
8. [Multi-Channel Update & Release Pipeline](#8-multi-channel-update--release-pipeline)
9. [Development, Build & Verification Commands](#9-development-build--verification-commands)
10. [Troubleshooting & Gotchas](#10-troubleshooting--gotchas)

---

## 1. Project Overview & Architecture

TreadCode is a dual-target application:
- **Desktop Application**: Built with **Tauri v2 + Rust** (Windows `.exe`, Android APK, macOS `.dmg`).
- **Web Application**: Static Single-Page App (SPA) deployable on **Vercel** / CDN.

It combines an **animation-first code execution visualizer** for polyglot programming (Python, C, C++, Java, DSA) with a **low-latency interactive teaching whiteboard (SmartBoard)** and an integrated **remote licensing / telemetry system**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TreadCode Client Layer                          │
│                                                                        │
│   ┌──────────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│   │ Visualizer Workspace │  │ SmartBoard (Ink) │  │ Licensing/EULA │  │
│   │ (Zustand Store)      │  │ (Dual-Layer RAF) │  │ (Firebase RTDB)│  │
│   └──────────┬───────────┘  └────────┬─────────┘  └───────┬────────┘  │
└──────────────┼───────────────────────┼────────────────────┼───────────┘
               │                       │                    │
┌──────────────▼───────────────────────▼────────────────────▼───────────┐
│                      Tauri v2 Native Rust Backend                     │
│  - HWID Generation (Machine GUID / CPU Hash)                          │
│  - Native Auto-Updater & Shell Invocation                             │
│  - Window Management & Native Process Exit/Relaunch                   │
└──────────────────────────────────────┬────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼────────────────────────────────┐
│                         Cloud Infrastructure                           │
│  - Firebase Realtime Database: Licensing, Telemetry, OTA Config       │
│  - Vercel CDN: Web Deployment & Binaries Hosting                      │
│  - GitHub Releases: Installer Binaries & Source Tracking              │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion (Framer Motion v12)
- **State Management**: Zustand v5 (with isolated component selectors)
- **Native Wrapper**: Tauri v2, Rust 1.77+, `@tauri-apps/api`, `@tauri-apps/plugin-updater`, `@tauri-apps/plugin-shell`, `@tauri-apps/plugin-process`
- **Database & Sync**: Firebase Realtime Database (RTDB v12)
- **Audio / Canvas**: HTML5 2D Context (`desynchronized: true`, Chaikin smoothing, Douglas-Peucker point decimation), Howler.js

---

## 3. Directory & Module Structure

```
Code Visualizer/
├── public/                       # Static public assets, favicon, version.json
│   ├── releases/                 # Local staging directory for built setup binaries
│   └── version.json              # Public version metadata
├── src/
│   ├── app/                      # Main application entry, routes, GlobalAppShell
│   │   ├── App.tsx               # Root component with routing and license gatekeeper
│   │   └── layout/
│   │       └── GlobalAppShell.tsx # Top navigation bar, search modal, update trigger
│   ├── features/
│   │   ├── smartboard/           # SmartBoard modal and rendering engine
│   │   │   ├── components/       # Toolbars, PageDrawer, RadialMenu, InspectorPanel
│   │   │   ├── engine/           # inkEngine.ts, eraserEngine.ts, shapeSnap.ts
│   │   │   └── SmartBoardModal.tsx # Dual-layer canvas coordinator
│   │   └── visualizer/           # Visualizer Workspace & Animation Stages
│   │       ├── components/       # CodeStepPanel, StageControls, ExplanationBar, OutputConsole
│   │       │   └── stages/       # CustomFlowchartStage, DsaAlgoStage, StackVisualStage, etc.
│   │       └── VisualizerWorkspace.tsx # Visualizer layout container
│   ├── lessons/                  # Lesson Registry and language data
│   │   ├── types.ts              # CodeLine, ExecutionStep, AnimationEvent definitions
│   │   ├── registry.ts           # Dynamic import chunk loader & statistics
│   │   ├── useLessonStore.ts     # Global Zustand store for playback & execution
│   │   ├── LessonContext.tsx     # Backward-compatible initialization wrapper
│   │   ├── python/               # Python topics & registry chunk
│   │   ├── c/                    # C topics & registry chunk
│   │   ├── cpp/                  # C++ topics & registry chunk
│   │   ├── java/                 # Java topics & registry chunk
│   │   └── dsa/                  # DSA structures & registry chunk
│   └── shared/                   # Shared UI, hooks, and Firebase client
│       ├── config/firebase.ts    # Firebase client instance, license validation, offline cache
│       ├── hooks/
│       │   ├── useUpdateChecker.ts # Multi-channel update polling & detection
│       │   └── usePinchZoom.ts   # Gesture zooming hook
│       └── components/ui/        # LicenseModal, EulaModal, UpdateBanner
├── src-tauri/                    # Tauri v2 native desktop source
│   ├── src/main.rs               # Rust entry point (HWID, commands)
│   ├── tauri.conf.json           # Window setup, bundle identifiers, updater endpoints
│   └── Cargo.toml                # Rust dependencies
├── scripts/
│   └── release.js                # One-command release and deployment broadcaster
├── updater.json                  # Native Tauri updater manifest endpoint
└── package.json
```

---

## 4. State Management (Zustand Architecture)

To ensure smooth 60 FPS playback on low-end devices, the visualizer uses **Zustand** (`src/lessons/useLessonStore.ts`).

### Key Store State & Actions

```typescript
// Accessing store in components: ALWAYS use selectors for render isolation!
import { useLessonStore } from '../../lessons/useLessonStore';

// GOOD: Only re-renders when currentStep changes
const currentStep = useLessonStore((s) => s.currentStep);

// AVOID in heavy visual components: Subscribes to full store
const { currentStep, isPlaying, zoom } = useLessonStore();
```

### Store Capabilities:
- `currentStepIndex`: 0-indexed step counter (`0` is initial setup before line 1).
- `activeSteps`: Array of `ExecutionStep` objects (either pre-calculated or dynamically generated via `generateSteps`).
- `editableValues`: Key-value pairs for user-customizable input variables.
- `goNext()`, `goPrev()`, `goToStep(n)`, `togglePlay()`, `reset()`.
- `initLesson(lesson)`: Resets step pointer and generates active steps.

---

## 5. Lesson Program System (How to Add/Edit Lessons)

All lesson content is statically defined with structured tokens and deterministic animation events.

### Step 1: Define the Program Data Structure

Every program must implement `LessonProgram` (`src/lessons/types.ts`):

```typescript
import type { LessonProgram } from '../../types';

export const myNewProgram: LessonProgram = {
  id: 'my_program_id',
  language: 'python', // 'python' | 'c' | 'cpp' | 'java' | 'dsa'
  topic: 'variables',
  lessonNumber: 1,
  friendlyName: 'Calculate Compound Interest',
  learningObjective: 'Understand multi-variable computation and power operators.',
  learningObjectiveHinglish: 'Samjhein multi-variable computation kaise execute hota hai.',
  
  // Syntax-highlighted tokenized code lines
  lines: [
    {
      lineNum: 1,
      tokens: [
        { type: 'variable', value: 'principal' },
        { type: 'operator', value: ' = ' },
        { type: 'number', value: '1000' }
      ]
    },
    {
      lineNum: 2,
      tokens: [
        { type: 'function', value: 'print' },
        { type: 'punctuation', value: '(' },
        { type: 'variable', value: 'principal' },
        { type: 'punctuation', value: ')' }
      ]
    }
  ],

  // Step-by-step memory, animation events, and bilingual explanations
  executionSteps: [
    {
      step: 1,
      lineNum: 1,
      explanationEnglish: 'Create variable principal and assign 1000.',
      explanationHinglish: 'Principal variable bana aur usme 1000 store kiya.',
      memorySnapshot: { principal: 1000 },
      animationEvent: {
        type: 'CREATE_VARIABLE',
        name: 'principal',
        value: 1000
      }
    },
    {
      step: 2,
      lineNum: 2,
      explanationEnglish: 'Print principal value to console.',
      explanationHinglish: 'Console screen par 1000 print kiya.',
      memorySnapshot: { principal: 1000 },
      consoleOutput: '1000\n',
      animationEvent: {
        type: 'PRINT_VALUE',
        variableName: 'principal',
        outputValue: 1000
      }
    }
  ],

  // (Optional) Dynamic Interactive Variables
  editableVariables: {
    principal: { default: 1000, min: 100, max: 100000, type: 'number' }
  },

  // (Optional) Pure function generating steps when user edits input values
  generateSteps: (vars) => {
    const p = vars.principal ?? 1000;
    return [
      {
        step: 1,
        lineNum: 1,
        explanationEnglish: `Create variable principal with ${p}.`,
        explanationHinglish: `Principal variable bana aur value ${p} store hui.`,
        memorySnapshot: { principal: p },
        animationEvent: { type: 'CREATE_VARIABLE', name: 'principal', value: p }
      }
    ];
  }
};
```

### Step 2: Register the Program in Language Chunk

Open the corresponding language chunk (e.g. `src/lessons/python/registry.ts`) and export the program:

```typescript
export const pythonRegistry = {
  variables: {
    single_variable: singleVariableLesson,
    my_program_id: myNewProgram, // <-- Add here
  },
  // ...
};
```

Because `src/lessons/registry.ts` uses dynamic chunking (`getLessonAsync`), Vite automatically splits the new program into its language bundle without bloating the main bundle!

---

## 6. SmartBoard & Ink Engine Architecture

The SmartBoard (`src/features/smartboard/`) is engineered for iPad-level low-latency stylus drawing and large session memory retention.

### Key Architectural Pillars:
1. **Dual-Layer Canvas (`SmartBoardModal.tsx`)**:
   - `cvCommitted` (Bottom canvas): Holds completed, permanent strokes. Only redrawn when undo/redo/page switch occurs.
   - `cvLive` (Top canvas): Renders active stroke under the stylus on every `requestAnimationFrame`. Completely decoupled from React render cycle (`liveRef`).
   - Both canvases use `{ desynchronized: true }` context to bypass browser compositor V-Sync wait times.
2. **Ink Math Engine (`src/features/smartboard/engine/inkEngine.ts`)**:
   - **Chaikin Smoothing**: 2-pass corner cutting removes jitter from low-cost pen digitizers.
   - **Midpoint Quadratic Bezier**: Creates single continuous smooth paths without overlapping circle artifact seams.
   - **Douglas-Peucker Compression (`simplifyStroke`)**: On pointer up, automatically removes redundant collinear points (80% RAM reduction per stroke).
3. **Shape Recognition (`shapeSnap.ts`)**:
   - Hold-to-snap: If user pauses pen movement for >300ms, automatically classifies line into Circle, Rectangle, Arrow, or Straight Line.

---

## 7. Licensing, Telemetry & Security Engine

TreadCode includes a hardware-locked licensing client (`src/shared/config/firebase.ts`) connected to Firebase Realtime Database.

### Validation Pipeline:
1. **HWID Generation**: On desktop, calls Tauri command `get_hwid` (retrieving Machine GUID/Motherboard hash). On web, uses persistent browser token.
2. **Blacklist Check**: Queries `blacklisted_hwids/{hwid}`. If `true`, revokes cache and locks workspace.
3. **License Verification**: Checks `licenses/{licenseKey}`:
   - Verifies `blocked` status.
   - Verifies `expiresAt` ISO date (Admin can extend anytime).
   - Atomic device slot counter registration (`runTransaction`).
4. **Offline Grace Cache**: On successful verification, writes payload to `localStorage['flowtrace_license_cache']`. If user goes offline, app continues working until admin revokes access or expiry date passes.
5. **Heartbeat Telemetry**: Sends ping every 25 seconds to `installations/{hwid}` with `appVersion`, `lastSeen`, `activeKey`, and `currentPath`.

---

## 8. Multi-Channel Update & Release Pipeline

The update detection engine (`src/shared/hooks/useUpdateChecker.ts`) uses 3 fallback mechanisms:

```
Channel 1: Tauri Native Plugin check()
            │ (If fails or unverified signature)
            ▼
Channel 2: Direct HTTP Fetch to Firebase RTDB (/tauri_updater.json)
            │ (If offline or background instant push)
            ▼
Channel 3: Realtime Firebase onValue Listener (/global_settings/forceUpdate)
```

### Performing an Official App Release

To release a new version globally:

```bash
# Example: Deploy version 1.0.8
npm run release 1.0.8
```

### What `scripts/release.js` Does Automatically:
1. Updates `package.json` to `1.0.8`.
2. Updates `src-tauri/tauri.conf.json` to `1.0.8`.
3. Updates `updater.json` with timestamp and binary URLs.
4. Updates `public/version.json` with build date and changelog.
5. Patches `CURRENT_VERSION` in `useUpdateChecker.ts`.
6. Executes `npx tauri build` to compile the Windows `.exe` setup installer.
7. Copies setup installer to `public/releases/` for Vercel deployment.
8. Writes update payload directly to Firebase RTDB (`tauri_updater` and `global_update`).
9. Commits, tags `v1.0.8`, and pushes to GitHub.

---

## 9. Development, Build & Verification Commands

### Development Server
```bash
# Start Vite development server
npm run dev

# Run desktop app in Tauri window (Hot Reload enabled)
npm run tauri dev
```

### Code Quality & Type Checks
```bash
# Verify TypeScript types across entire repository without emit
npx tsc -b --noEmit

# Run ESLint & Oxlint
npm run lint

# Format code with Prettier
npm run format
```

### Production Builds
```bash
# Build web production bundle (outputs to /dist)
npm run build

# Build Windows desktop installer (.exe)
npx tauri build
```

---

## 10. Troubleshooting & Gotchas

| Symptom | Cause | Solution |
|---|---|---|
| Large bundle size (>800KB main chunk) | Synchronous imports in `registry.ts` | Use `getLessonAsync()` and place programs in their respective language chunk folders. |
| Whiteboard pen input lagging on high zoom | Canvas redrawing entire stroke history in React state | Ensure live drawing writes to `liveRef` and only committed strokes go to `setStrokes`. |
| "License Expired" showing offline | Stored cache passed `expiresAt` date | Admin panel must update `expiresAt` or remove expiry constraint in Firebase console. |
| Update banner appearing in web browser | `isNativeApp()` check bypassed | Ensure `useUpdateChecker()` checks `isNativeApp()` before toggling update UI. |
| Re-render drops frames on Step change | Component consuming full `useLesson()` object | Refactor to `useLessonStore(s => s.myValue)` with targeted selector. |

---

*Documentation maintained by Prince Thakur & Core Development Team.*
