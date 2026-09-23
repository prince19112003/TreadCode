# 🐧 Linux Government Schools & ICT Labs Architecture Guide

> **Document Location**: `documentation/platforms/LINUX_GOVT_SCHOOLS_ARCHITECTURE.md`  
> **Target Environments**: Central Government Schools (Kendriya Vidyalayas, Navodaya Vidyalayas), State ICT Initiatives (Kerala KITE GNU-Linux), C-DAC BOSS Linux Labs, and Engineering College Open-Source Labs  
> **Supported Distributions**: BOSS Linux 8/9, KITE GNU-Linux, Ubuntu LTS (20.04, 22.04, 24.04), Debian 11/12, Linux Mint  
> **Primary Formats**: Portable `.AppImage` (Zero-install for teachers) & Native `.deb` (Lab technician deployment)

---

## 1. Operating Environment & Institutional Constraints

In Indian government-funded educational institutions, Linux is mandated to reduce software licensing costs and promote open-source education. However, developers face unique technical hurdles in these labs:

```
┌────────────────────────────────────────────────────────────────────────┐
│              INDIAN GOVERNMENT LAB REAL-WORLD SPECIFICATIONS           │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Dominant Distributions   │ KITE GNU-Linux (45,000+ Kerala classrooms), │
│                          │ BOSS Linux (C-DAC Debian fork), Ubuntu LTS  │
│ User Privilege Model     │ Strictly Restricted (Teachers lack `sudo`)  │
│ Lab Network Access       │ Isolated offline LAN or air-gapped systems  │
│ Hardware Specifications  │ Dual-core 64-bit x86_64, 2 GB – 4 GB RAM    │
│ Graphics / Display       │ Intel GMA / Integrated HD Graphics (Mesa)   │
│ Target Memory Footprint  │ < 95 MB RAM (Ultra-low resource budget)     │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Dual-Package Distribution Strategy

To solve the conflict between locked-down school PCs and institutional IT policies, TreadCode provides two distinct Linux deployment artifacts:

### A. The `.AppImage` Format (For Classroom Teachers)
* **What it is**: A self-contained, compressed filesystem executable containing the Tauri binary, WebKitGTK runtime links, and all visualizer assets.
* **Why it is essential**:
  - **Zero Installation**: Does not require running an installer or touching system root directories.
  - **Zero Root / Sudo Required**: Teachers can insert a USB Pen-Drive into any classroom podium PC, set execution permission (`chmod +x TreadCode.AppImage`), and double-click to launch immediately.
  - **Zero Dependency Hell**: Bundles compatible libraries so it runs identically on BOSS Linux, KITE, or Ubuntu without version mismatch errors.

### B. The `.deb` Format (For Lab Administrators)
* **What it is**: The standard Debian binary package format for Debian, Ubuntu, and BOSS Linux.
* **Why it is essential**:
  - Lab technicians managing 40–80 computers can deploy TreadCode across all lab machines simultaneously via LAN or terminal script (`sudo dpkg -i treadcode_amd64.deb`).
  - Registers TreadCode in the official desktop Application Menu under `Education` and `Development`.

---

## 3. High-Performance WebKitGTK Architecture

Unlike bloated Electron applications that consume 400 MB–800 MB of RAM, TreadCode on Linux leverages **WebKitGTK** through Tauri v2:

* **Ultra-Low Memory Footprint (< 95 MB RAM)**:
  - WebKitGTK shares system rendering libraries rather than bundling an entire separate Chromium browser instance.
  - Leaves over 90% of system RAM available for the operating system on low-spec 2GB lab PCs.
* **Hardware-Accelerated Rendering (Mesa / DRI3)**:
  - Compatible with both legacy **X11** and modern **Wayland** display servers.
  - Offloads canvas animation loops to the GPU via hardware-accelerated OpenGL/WebGL pipelines, maintaining 60 FPS across all algorithm visualizations.
* **Smart Board & Touchscreen Support in Linux Classrooms**:
  - Native GTK gesture events handle optical and infrared touch frames in smart classrooms without requiring custom touch calibration drivers.

---

## 4. Offline Licensing & Storage Persistence in Linux

* **Config Directory**: License leases and module cache are securely stored adhering to the **XDG Base Directory Specification**:
  `$XDG_CONFIG_HOME/treadcode` (defaults to `~/.config/treadcode/`).
* **Offline Lease**: Once validated online via teacher hotspot for 5 seconds, the cryptographic lease allows the `.AppImage` to execute 100% offline for the full subscription period (30, 180, or 365 days).
* **Anti-Clock Tamper Defense**: The monotonic clock tracker persists the last execution timestamp in the user's config directory, preventing clock-rollback workarounds even across Linux reboots.

---

## 5. Automated Cloud CI/CD Build Pipeline (GitHub Actions)

Building Linux desktop binaries natively on a Windows development machine requires heavy virtual machines or WSL. To maintain a clean, zero-bloat local developer setup:

* **Workflow**: `.github/workflows/build-linux-release.yml`
* **Runner**: `ubuntu-latest` (Hosted by GitHub Actions).
* **Build Sequence**:
  1. Installs compilation prerequisites: `libwebkit2gtk-4.1-dev`, `build-essential`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`.
  2. Builds the frontend web bundle: `npm run build`.
  3. Executes Tauri Linux bundler: `cargo tauri build --target x86_64-unknown-linux-gnu`.
  4. Automatically outputs both `TreadCode-Linux-x86_64.AppImage` and `treadcode_1.0.8_amd64.deb`.
  5. Publishes artifacts directly to GitHub Releases, automatically synchronizing with the TreadCode Web Store!
