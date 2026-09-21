# TreadCode Complete File & Repository Inventory

> **Internal Maintenance & Architecture Audit**  
> Tracks active production files, developer scripts, build outputs, and git hygiene policies.

---

## 1. Executive Summary

This inventory provides an authoritative classification of all files and folders in the `Code Visualizer` repository. It distinguishes between:
1. **Core Production Files**: Essential source code tracked in Git and compiled into the desktop/web bundles.
2. **Native Runtime & Build Configs**: Tauri v2, Rust backend, and Vite configuration files.
3. **Developer & Automation Scripts**: Tooling for offline course pack generation, web store catalogue syncing, and version bumping.
4. **Stale / Build Outputs**: Binary staging directories (`public/releases/`, `dist-packs/`) that should **not** be committed to Git.

---

## 2. Core Production Source Tree (`src/`)

### 2.1 Application Core (`src/app/`)
| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `src/main.tsx` | Active | React application entry point, mounts DOM root, loads global CSS. |
| `src/app/App.tsx` | Active | Root routing orchestrator, `LicenseContext` provider, HWID detector, and activation gatekeeper. |
| `src/app/layout/GlobalAppShell.tsx` | Active | Global navigation header, breadcrumbs, search modal trigger, and announcement banner. |

### 2.2 Visualizer Feature (`src/features/visualizer/`)
| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `VisualizerWorkspace.tsx` | Active | Main split-pane visualizer shell orchestrating code pane, controls, and stages. |
| `components/CodeStepPanel.tsx` | Active | Syntax-highlighted code editor rendering active line highlights and breakpoints. |
| `components/StageControls.tsx` | Active | Play/pause, step forward/backward, speed slider, and timeline scrubber. |
| `components/ExplanationBar.tsx` | Active | Bilingual (Hindi/English) textual step explanation bar with audio trigger. |
| `components/OutputConsole.tsx` | Active | Virtual terminal rendering program stdout and input prompts. |
| `components/stages/StackVisualStage.tsx` | Active | Function call stack visualizer showing frames, return addresses, and local scope. |
| `components/stages/VariableInspectorStage.tsx` | Active | Variable symbol table showing names, types, current values, and memory addresses. |
| `components/stages/DsaAlgoStage.tsx` | Active | Data structure visualizer for Binary Search Trees, Graphs, Sorting, and Dijkstra. |
| `components/stages/CustomFlowchartStage.tsx` | Active | Dynamic visual flowchart highlighting corresponding block during line execution. |
| `components/stages/PointerStage.tsx` | Active | Visual pointer dereferencing arrows connecting stack variables to heap allocations. |

### 2.3 SmartBoard Feature (`src/features/smartboard/`)
| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `SmartBoardModal.tsx` | Active | Dual-layer canvas modal with window resize coordination and keyboard shortcuts. |
| `engine/inkEngine.ts` | Active | Mathematical stroke rendering, Chaikin corner-cutting smoothing, and Douglas-Peucker reduction. |
| `engine/eraserEngine.ts` | Active | Vector collision detection for stroke-based and precision point-based erasing. |
| `engine/shapeSnap.ts` | Active | Geometric recognition converting freehand sketches into rectangles, circles, and arrows. |
| `components/SmartBoardToolbar.tsx` | Active | Floating toolbar for pen styles, colors, line widths, laser pointer, and export. |

### 2.4 Curriculum & Lesson Engine (`src/lessons/`)
| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `types.ts` | Active | Core TypeScript schema: `CodeLine`, `ExecutionStep`, `MemorySnapshot`, `Lesson`. |
| `registry.ts` | Active | Dynamic chunk loader that asynchronously imports language modules on demand. |
| `useLessonStore.ts` | Active | Global Zustand store controlling execution step pointer, timeline, and playback state. |
| `python/` | Active | Built-in Python 3 curriculum containing 100 step-by-step visual lessons (16 topics). |
| `c/` | Active | C Programming lesson pack (45 programs, pointers, structs, memory allocation). |
| `cpp/` | Active | C++ Programming lesson pack (50 programs, STL, OOP, inheritance, templates). |
| `java/` | Active | Java Programming lesson pack (52 programs, JVM stack/heap, methods, classes). |
| `dsa/` | Active | Data Structures & Algorithms pack (21 programs, sorting, trees, graphs, pathfinding). |
| `ml/` | Active | Machine Learning visualizer pack (11 programs, regression, weights, neural basics). |
| `networks/` | Active | Computer Networks pack (8 programs, OSI model, packet routing, TCP handshakes). |

### 2.5 Page Controllers (`src/pages/`)
| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `LanguageSelectionPage.tsx` | Active | Modern course hub for choosing Python, C, C++, Java, DSA, ML, or Networks. |
| `TopicSelectionPage.tsx` | Active | Topic and program index with progress badges and curriculum search. |
| `VisualizerPage.tsx` | Active | Top-level route wrapper embedding `VisualizerWorkspace`. |
| `SettingsPage.tsx` | Active | Comprehensive hub: Display Tuning, Plans & Pricing, Support Desk, Licensing, and About. |

### 2.6 Shared UI & Infrastructure (`src/shared/`)
| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `config/firebase.ts` | Active | Firebase RTDB client: license validation, device unlinking, ticket submission. |
| `hooks/useUpdateChecker.ts` | Active | Update detection querying Tauri native updater and Firebase RTDB fallback. |
| `hooks/useModuleStore.ts` | Active | IndexedDB manager for downloading, caching, and loading modular course packs. |
| `components/ui/FeedbackTab.tsx` | Active | Support & Complaints Desk with category selection, presets, and real-time ticket tracking. |
| `components/ui/PlansTab.tsx` | Active | Activation request form with mandatory UPI UTR validation and 6-device tier info. |
| `components/ui/LicenseModal.tsx` | Active | Hardware unlinking dialog for disconnecting devices when seat limits are reached. |
| `components/ui/KeyIssuedNotificationModal.tsx`| Active | Real-time popup alerting users when their requested key is generated by admin. |
| `components/ui/UpdateBanner.tsx` | Active | Modal dialog offering **Option 1 (Direct .exe)** and **Option 2 (Web Store Section)**. |
| `components/ui/ExtensionsTab.tsx`| Active | In-app course pack manager for downloading or importing offline zip archives. |
| `components/ui/Codicon.tsx` | Active | Lightweight VS Code Codicon SVG icon renderer. |

---

## 3. Native Desktop Layer (`src-tauri/`)

| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `src-tauri/Cargo.toml` | Active | Rust dependencies: `tauri`, `tauri-plugin-updater`, `tauri-plugin-shell`, `tauri-plugin-process`. |
| `src-tauri/tauri.conf.json` | Active | Window boundaries, Ed25519 updater public key, permissions, and app identity. |
| `src-tauri/src/main.rs` | Active | Native executable entry point invoking `lib::run()`. |
| `src-tauri/src/lib.rs` | Active | HWID generation (Machine GUID / CPU hash), plugin registration, process exit. |
| `src-tauri/capabilities/` | Active | Tauri v2 permission sets granting safe access to updater and shell plugins. |

---

## 4. Automation & Developer Tooling (`scripts/`)

| File Path | Status | Primary Responsibility |
| :--- | :--- | :--- |
| `scripts/export_packs.js` | Active | Compiles `src/lessons/{c,cpp,java,dsa,ml,networks}` into standalone JSON files and `.zip` archive. |
| `scripts/sync_store_catalogue.js` | Active | Synchronizes lesson counts and tier pricing with the sibling web store catalogue (`web`). |
| `scripts/release.js` | Active | Automates version bumping across `package.json`, `tauri.conf.json`, and `public/version.json`. |
| `scripts/cleanup_stale.js` | Active | Maintenance script to detect and purge stale binary files (`.exe`, `.zip`) from build staging. |

---

## 5. Stale / Build Output Directories (Never Commit to Git)

The following directories contain generated or large binary artifacts that must be excluded from Git:

```
Code Visualizer/
├── public/releases/          # ⚠️ STALE: Test installer .exe files (Must NOT be in Git)
├── dist-packs/               # ⚠️ BUILD ARTIFACT: Compiled course packs generated by export_packs.js
├── dist/                     # ⚠️ BUILD ARTIFACT: Vite web production bundle
└── src-tauri/target/         # ⚠️ BUILD ARTIFACT: Rust compilation objects
```

### 5.1 Cleaning Stale Artifacts
Run the dedicated cleaner to inspect and purge heavy binaries:
```powershell
# 1. Preview candidates (Dry run)
node scripts/cleanup_stale.js

# 2. Permanently purge heavy binaries
node scripts/cleanup_stale.js --force
```

---

## 6. Recommended `.gitignore` Rules

Ensure your `.gitignore` contains the following to prevent accidental binary commits:

```gitignore
# Build outputs
dist/
dist-packs/
src-tauri/target/

# Local binary test builds
public/releases/*.exe
public/releases/*.zip
public/releases/*.msi

# Dependency folders
node_modules/
```
