# 📱 Android Smart Board & IFP Architecture Guide

> **Document Location**: `documentation/platforms/ANDROID_SMARTBOARD_ARCHITECTURE.md`  
> **Target Hardware**: Interactive Flat Panels (IFP) & Classroom Smart Boards (Maxhub, ViewSonic, Senses, BenQ, Promethean, Smart TVs)  
> **Supported OS Range**: Android 8.0 (Oreo / API 26) through Android 14 (API 34)  
> **Orientation**: Strictly Locked Landscape (`sensorLandscape` / 16:9 & 16:10)

---

## 1. Hardware Environment & Real-World Constraints

Indian educational institutions (schools, colleges, coaching institutes) predominantly deploy Android-based interactive panels without dedicated Windows OPS slot-in PCs due to cost considerations. Developers must build for the following hardware constraints:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CLASSROOM SMART BOARD HARDWARE PROFILE               │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Processor                │ Quad-Core ARM (Cortex-A53 / A55, quad A73)  │
│ Total RAM                │ 2 GB – 4 GB (Shared with 4K Framebuffer)    │
│ Usable Free RAM for App  │ ~600 MB – 900 MB max                        │
│ Graphics / GPU           │ ARM Mali-G31 / G51 / G52 (Thermal throttled)│
│ Touch Technology         │ Optical or High-Speed Infrared (IR) Frame   │
│ Touch Event Frequency    │ 120 Hz – 200 Hz continuous event flood      │
│ Display Dimensions       │ 55", 65", 75", 86", 98" (1080p / 2K / 4K)  │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### A. Zero-Overhead "Scale-to-Fit" Viewport Engine
Smart boards range from 55-inch budget boards up to 98-inch 4K university screens. Instead of writing hundreds of brittle CSS media queries, TreadCode utilizes a **Reference Resolution Scale-to-Fit Engine**:
* **Baseline Canvas**: `1920 × 1080` (Standard 16:9 classroom geometry).
* **Scaling Transform**:
  $$\text{Scale Factor} = \min\left(\frac{\text{Viewport Width}}{1920}, \frac{\text{Viewport Height}}{1080}\right)$$
* **Why this matters**:
  - Touch targets (buttons, scrubber handles, toolbars) maintain **identical physical proportions** on an 86" board as designed on a 24" monitor.
  - Zero layout reflow or text wrap bugs across any screen size.
  - Teachers standing 2-3 feet away can comfortably tap any UI element.

### B. Sub-8ms Touch & Inking Optimization
* **Hardware Acceleration**: Explicitly enabled via `android:hardwareAccelerated="true"` in `AndroidManifest.xml`.
* **Low-Latency Inking**: SmartBoard drawing context initialized with `{ desynchronized: true }`, allowing direct scan-out to the display compositor and bypassing normal browser paint delays.
* **Point Decimation & Smoothing**: IR touch frames generate hundreds of noisy micro-events per second. A Douglas-Peucker point filtering pass removes redundant coordinate points before bezier smoothing, keeping CPU load below 12% during vigorous handwriting.
* **Hardware Palm Rejection**: Coordinates with large contact bounding boxes (`event.width > 28` or `pointerType === 'touch'` with multi-point cluster) are discarded so educators can naturally rest their hand on the screen while writing with a stylus.

### C. Legacy Android WebView Compatibility (Android 8 to 11)
* Older boards run frozen Android System WebViews (Chrome 65 – 80).
* Build target transpiles down to `es2018` / `chrome75` with core polyfills.
* No unsupported modern Web APIs are invoked without defensive fallback checks.

---

## 3. Storage, Offline Licensing & USB Pen Drive Sideloading

```
[Pen Drive (USB)] ──> Insert into Smart Board USB Slot
                            │
                            ▼
[File Manager]    ──> Tap `TreadCode-SmartBoard.apk` ──> Install
                            │
                            ▼
[1-Time Setup]    ──> Connect mobile hotspot for 5 seconds to activate license key
                            │
                            ▼
[30-Day Lease]    ──> Cached cryptographically in IndexedDB
                            │
                            ▼
[Classroom Use]   ──> Runs 100% OFFLINE for full term with anti-clock rollback security
```

* **Storage Access Framework (SAF)**: Android manifest grants `READ_EXTERNAL_STORAGE` and modern media permissions so course packs stored on teacher USB pen drives can be loaded directly into TreadCode without copying to limited internal flash memory.
* **HWID on Android**: Fingerprint is computed from `android.os.Build.SERIAL` / secure Android ID hash stored in encrypted app storage, ensuring license device limits (e.g., 6 devices or 20 devices) are honored.

---

## 4. Automated Cloud CI/CD Build Pipeline (GitHub Actions)

To avoid requiring developers or operators to maintain a 15–20 GB local Android Studio / NDK environment on personal machines, production APKs are compiled via GitHub Actions:

* **Trigger**: Git tags (`v*.*.*`) or manual workflow dispatch.
* **Environment**: `ubuntu-latest` with pre-cached Java 17 and Android SDK build-tools.
* **Build Steps**:
  1. `npm run build`: Compiles production React 19 bundle into `dist/`.
  2. `npx cap sync android`: Injects web assets into native Android wrapper.
  3. `./gradlew assembleRelease`: Compiles optimized, zipalined `.apk`.
  4. Automatically attaches the `.apk` to the GitHub Release, which directly synchronizes with the TreadCode Web Store and Admin Panel!

---

## 5. Maintenance & Developer Checklist

When modifying frontend components or adding visualizers:
1. Always test with the **Reference Resolution Scaler** enabled. Do not write hardcoded pixel dimensions for full-screen overlays.
2. Keep canvas redraw loops bounded by `requestAnimationFrame`. Never run unthrottled interval timers for animations.
3. Keep memory footprint under **150 MB RAM** by ensuring canvas textures are destroyed (`destroy({ children: true })`) when leaving visualizer stages.
