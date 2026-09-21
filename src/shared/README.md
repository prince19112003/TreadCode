# Shared UI Components & Infrastructure (`src/shared/`)

> **Architectural Layer**: Reusable Design System, Firebase Client, & Utility Hooks  
> **Primary Technology**: Firebase Realtime Database, IndexedDB, Tailwind CSS, Motion

---

## 1. Directory Purpose

The `src/shared/` directory provides common infrastructure across the application: Firebase RTDB integration, native update checkers, modular package storage, and reusable UI components.

---

## 2. Key Modules & Subdirectories

```
shared/
├── config/
│   └── firebase.ts                   # Firebase RTDB client, license validation, ticket APIs
├── hooks/
│   ├── useUpdateChecker.ts           # Dual-engine OTA update checker (Tauri + Firebase fallback)
│   └── useModuleStore.ts             # IndexedDB manager for local course pack storage
└── components/ui/
    ├── UpdateBanner.tsx              # Modal presenting Option 1 (Direct .exe) & Option 2 (Web Store)
    ├── FeedbackTab.tsx               # Sleek Support Desk with categories & ticket resolution view
    ├── PlansTab.tsx                  # Pricing plans & mandatory UPI UTR activation form
    ├── LicenseModal.tsx              # Hardware unlinking modal for managing the 6-device limit
    ├── KeyIssuedNotificationModal.tsx # Real-time popup alerting users when their key is generated
    ├── ExtensionsTab.tsx             # Course extension pack manager & offline archive importer
    └── Codicon.tsx                   # Lightweight SVG icon renderer
```

---

## 3. Core Subsystems

### 3.1 Update Detection Subsystem (`useUpdateChecker.ts`)
- Runs **only** inside native desktop/mobile builds (guarded by `isNativeApp()`).
- Checks Tauri native plugin updater first; falls back to Firebase RTDB (`/tauri_updater.json`) to guarantee zero rate-limit failures.
- Offers **Option 1** (direct background `.exe` download & launch) and **Option 2** (official web catalogue page redirect).

### 3.2 Modular Pack Storage (`useModuleStore.ts`)
- Manages an internal IndexedDB store (`flowtrace_modules`).
- Enables air-gapped lab computers to import `TreadCode_Packs_Offline.zip` and cache full course packs completely offline without internet connectivity.

### 3.3 Real-Time Firebase Subsystem (`config/firebase.ts`)
- Performs real-time HWID key validation, device concurrency tracking (6-device limit), hardware unlinking, and ticket submission/resolution.
