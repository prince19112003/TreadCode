# TreadCode Admin Panel & Cloud Operations Guide

> **Authoritative Operational Manual for System Administrators & Support Operations**  
> Covers cloud licensing, cryptographic key generation, 6-device concurrency enforcement, complaints triage, and OTA broadcast management.

---

## 1. Executive Overview

The **TreadCode Admin Panel** (`My-GitHub-CleanUp/admin panel`) is the centralized mission control dashboard for managing the TreadCode desktop ecosystem. Built with React and connected directly to **Firebase Realtime Database (RTDB)**, it provides instant, real-time control over:

1. **Activation Key Generation**: Manual key specification or 1-click 6-character cryptographic key generation.
2. **Device Concurrency Management**: Enforcing the **6-device limit** per license, viewing bound hardware signatures (HWIDs), and performing remote unlinking.
3. **Support & Complaints Desk Triage**: Reviewing user tickets, filtering by license tier (**Community**, **Professional**, **Enterprise**), and responding with resolution presets.
4. **Global Announcements & Updates**: Broadcasting real-time ticker banners to all active desktop instances and updating OTA version payloads.

---

## 2. Firebase Database Schema Reference

The Admin Panel interfaces with the following primary RTDB nodes:

```
flowtrace-licensing-default-rtdb/
├── licenses/
│   └── {LICENSE_KEY}/
│       ├── status: "active" | "revoked" | "expired"
│       ├── tier: "community" | "professional" | "enterprise"
│       ├── maxDevices: 6
│       ├── createdAt: ISO_STRING
│       ├── expiresAt: ISO_STRING
│       └── devices/
│           └── {HWID}: { activatedAt: ISO_STRING, label: "Windows PC" }
│
├── keyRequests/
│   └── {REQUEST_ID}/
│       ├── name: string
│       ├── email: string (WhatsApp or Email)
│       ├── upiUtr: string (Mandatory transaction ref)
│       ├── tier: "community" | "professional" | "enterprise"
│       ├── status: "pending" | "approved" | "rejected"
│       ├── hwid: string
│       ├── generatedKey?: string
│       └── timestamp: ISO_STRING
│
├── feedbacks/
│   └── {TICKET_ID}/
│       ├── category: "complaint" | "query" | "bug" | "feature"
│       ├── subject: string
│       ├── message: string
│       ├── status: "pending" | "resolved"
│       ├── adminReply?: string
│       ├── resolvedAt?: ISO_STRING
│       ├── hwid: string
│       └── systemDetails: { tier: string, licenseKey?: string, platform: string }
│
├── settings/
│   └── announcementText: string (Global broadcast message)
│
└── tauri_updater.json/
    ├── version: "1.0.8"
    ├── notes: string
    └── platforms: { "windows-x86_64": { url, signature } }
```

---

## 3. Key Generation & Issuance Workflow

When a user submits an activation request via the in-app **Plans & Pricing** tab, their request appears in the Admin Panel’s **Key Requests** dashboard.

### 3.1 Verification & Approval Steps
1. **Verify UPI Transaction**: Inspect the prominent **UPI UTR** box. Cross-reference the UTR number in your banking/merchant app.
2. **Click "Approve & Issue Key"**:
   - Opens the dedicated Key Issuance Modal.
3. **Choose Key Generation Mode**:
   - **Auto-Generate (Recommended)**: Generates a cryptographically randomized, high-entropy **6-character uppercase key** (e.g., `TC-9X4K2A`).
   - **Manual Key Input**: Allows typing a custom organizational key (e.g., `IIT-DELHI-LAB-2026`).
4. **Set Tier & Device Limit**:
   - Tier defaults to the user’s selected plan (`Community`, `Professional`, `Enterprise`).
   - Device limit defaults to **6 devices** for Professional and **20 devices** for Enterprise (can be adjusted up or down for institutional bulk keys).
5. **Click "Issue & Publish Key"**:
   - Creates the active key record in `/licenses/{KEY}`.
   - Updates the request record status to `approved`.
   - Copies a pre-formatted **WhatsApp / Email Delivery Template** to your clipboard.

### 3.2 Real-Time Client Notification
The desktop client listens to `/keyRequests` filtered by machine HWID:
- As soon as the admin clicks **Issue & Publish Key**, the user’s computer immediately displays the **Key Issued Alert Popup**.
- The user can click **1-Click Activate** to instantly bind their device without manually retyping the key.

---

## 4. Multi-Device Concurrency & Remote Unlinking

Every license key in TreadCode supports up to **6 hardware devices** by default:

### 4.1 How Concurrency Works
1. When a client activates a key, their SHA-256 machine HWID is written to `/licenses/{KEY}/devices/{HWID}`.
2. If the total number of bound devices reaches the `maxDevices` limit (6), subsequent machines will see a **Device Limit Exceeded** prompt.

### 4.2 Admin Controls
- **Adjust Device Limit**: Admins can increase the limit (e.g. to 50 for a college computer lab) directly from the License Detail view.
- **Remote Device Logout**: If a student loses a laptop or reformats their drive, the admin can click **Disconnect Device** next to any older HWID, instantly freeing a seat for another machine.
- **Revoke / Block License**: Instantly marks the key as `revoked`, immediately locking all connected desktop clients upon their next heartbeat.

---

## 5. Support & Complaints Desk Triage

The Admin Panel includes a dedicated **Support Desk** management console:

### 5.1 Categorization & Tier Awareness
Each submitted ticket displays the user's active license tier badge:
- `Community (Free)`
- `Professional`
- `Enterprise` (Prioritized with gold accents)

### 5.2 Resolving Tickets
1. Select any pending ticket from the queue.
2. Review the user's detailed description, subject, and attached machine diagnostics (HWID, OS platform).
3. Select a **Resolution Preset** or type a custom resolution message:
   - *Preset 1: Device Limit Reset* — "Your older devices have been unlinked. You may now activate this machine."
   - *Preset 2: Key Re-Sent* — "Your key has been verified and re-sent to your registered contact."
   - *Preset 3: Bug Logged* — "This issue has been forwarded to our visualizer engineering team for patch release."
4. Click **Resolve & Send Reply**:
   - Marks the ticket status as `resolved`.
   - Writes `adminReply` and `resolvedAt` timestamp.
   - The user’s desktop app immediately updates in the **My Tickets** tab with the green resolution banner.

---

## 6. Global Announcements & OTA Update Management

### 6.1 Broadcasting In-App Announcements
- Admins can type an urgent message into the **Broadcast Ticker** input on the Admin Panel (e.g., *"Scheduled lab server maintenance at 6:00 PM IST"*).
- The message is written to `/settings/announcementText`.
- All running TreadCode desktop instances immediately render a sleek announcement banner across the top navigation bar.

### 6.2 Managing OTA Updates
- When a new version is built, update the `/tauri_updater.json` node with:
  - New semver tag (e.g. `1.0.9`)
  - Markdown release notes
  - Windows x64 binary URL & Ed25519 signature
- Desktop clients automatically detect the update on launch or when clicking **Check Updates** in `Settings > About`.
