# Application Shell & Core Infrastructure (`src/app/`)

> **Architectural Layer**: Application Root, Routing, & State Providers  
> **Primary Technology**: React 19, React Router v7, Lucide Icons, Tailwind CSS v4

---

## 1. Directory Purpose

The `src/app/` directory houses the top-level application skeleton, global context providers, client-side routing, and persistent shell navigation bars that wrap every view in TreadCode.

---

## 2. Key Files & Components

| File | Primary Role |
| :--- | :--- |
| `App.tsx` | Root component. Mounts `BrowserRouter`, provides `LicenseContext`, manages hardware signature (HWID) detection, handles key validation, and registers global modal dialogs (`EulaModal`, `KeyIssuedNotificationModal`). |
| `layout/GlobalAppShell.tsx` | The persistent top application bar. Renders the brand identity, dynamic breadcrumbs, quick course navigation, global search trigger, SmartBoard launch button, and remote broadcast announcements. |

---

## 3. Security & Gatekeeping Lifecycle

1. **Hardware ID (HWID) Initialization**: On mount, `App.tsx` calls the Tauri Rust backend to retrieve the machine GUID and CPU hash. In browser mode, it generates a persistent local identifier.
2. **License Status Hydration**: Queries `localStorage` and validates credentials against Firebase Realtime Database (`/licenses/{KEY}`).
3. **Gatekeeper Behavior**:
   - `Community` tier: Pre-activated with 100 Python visual lessons.
   - `Professional` / `Enterprise` tiers: Validates that current HWID is registered in `devices[hwid]` before granting access to C, C++, Java, and DSA packs.
   - If device limits are exceeded, prompts user to unbind older machines or upgrade.

---

## 4. Dependencies & Impact

- **Consumes**: `src/shared/config/firebase.ts`, `src/shared/hooks/useUpdateChecker.ts`, `src-tauri/` bindings.
- **Injected Into**: All route views in `src/pages/`.
