# Top-Level Page Controllers (`src/pages/`)

> **Architectural Layer**: Application Views & Route Endpoints  
> **Primary Technology**: React 19, Motion Page Transitions, Lucide Icons, Tailwind CSS

---

## 1. Directory Purpose

The `src/pages/` directory houses the primary view controllers routed by `src/app/App.tsx`. Each file represents a discrete screen in the user journey.

---

## 2. Key Pages & Routes

| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/languages` | `LanguageSelectionPage.tsx` | Main course hub. Students select from Python, C, C++, Java, DSA, ML, or Networks. Shows tier badges and pack status. |
| `/topics/:lang` | `TopicSelectionPage.tsx` | Topic index for a selected language. Shows lesson cards, difficulty, progress badges, and search filter. |
| `/visualizer/:lang/:topicId/:lessonId` | `VisualizerPage.tsx` | Full-screen visualizer stage wrapper embedding `VisualizerWorkspace`. |
| `/settings` | `SettingsPage.tsx` | Central control hub with tabs for Display Tuning, Plans & Pricing, Support Desk, Licensing, Extensions, and About. |

---

## 3. Settings Hub Sub-tabs (`SettingsPage.tsx`)

`SettingsPage.tsx` is an extensive, multi-tab configuration center:
1. **Display Tuning**: Real-time CSS filter adjustments for classroom projectors (Contrast, Brightness, Saturation).
2. **Plans & Pricing (`PlansTab.tsx`)**: Compares Community, Professional, and Enterprise tiers. Mandatory UPI UTR activation request form.
3. **Support Desk (`FeedbackTab.tsx`)**: Minimal, sleek complaints and queries portal with live status tracking.
4. **Licensing & Devices (`LicenseModal.tsx`)**: View active bound HWIDs and disconnect devices when the 6-device limit is reached.
5. **Extensions (`ExtensionsTab.tsx`)**: Download or import modular offline course bundles.
6. **About & Updates**: Software version card with **Option 1 (Direct Setup .exe)** and **Option 2 (Web Store Section)**.
