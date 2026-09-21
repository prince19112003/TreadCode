# TreadCode Security, Licensing & Safety Blueprint

> **Proprietary & Confidential**  
> Copyright (c) July 23, 2026 – Present Prince (`prince19112003`). All Rights Reserved.  
> Licensed under Proprietary EULA.

---

## 1. Executive Security Philosophy

**TreadCode** is designed with a **Defense-in-Depth, Zero-Trust Offline Architecture**. Because the application is deployed in educational computer labs, universities, and student personal laptops, it satisfies two fundamental requirements:

1. **Air-Gapped Safety**: Complete offline usability with zero requirement for internet access during programming instruction.
2. **Hardware-Bound Tamper Resistance**: Cryptographic binding to physical workstation hardware signatures, preventing unauthorized license cloning, key leakage, or arbitrary remote code execution.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       Security Subsystem Layers                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Hardware Fingerprinting (Tauri Rust Machine GUID + CPU SHA-256)      │
│ 2. Cryptographic Licensing (Firebase RTDB + 6-Device Concurrency)      │
│ 3. Deterministic Sandboxed Execution (Zero `eval`, Zero WebAssembly)    │
│ 4. Ed25519 Public Key Signature Verification (OTA Updates)             │
│ 5. Air-Gapped Network Isolation (Zero telemetry in offline mode)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hardware Identification (HWID) Architecture

### 2.1 Native Hardware Fingerprinting
TreadCode does not rely on easily spoofed browser fingerprints (such as canvas hashes, audio context, or IP addresses). In native desktop mode, the Rust backend (`src-tauri/src/lib.rs`) interrogates deep Windows operating system interfaces:

1. **Machine GUID**: Fetched directly from the Windows Registry:
   ```
   HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Cryptography\MachineGuid
   ```
2. **Processor Identity**: Fetched via Windows native system architecture interfaces (`PROCESSOR_IDENTIFIER`, CPU core architecture, hardware thread counts).
3. **Cryptographic Hashing**: The combined identifiers are normalized and hashed using **SHA-256**:
   ```
   HWID = SHA256( MachineGuid + "::" + ProcessorIdentifier )
   ```

### 2.2 Anti-Cloning & VM Protections
- If a student copies the installed program directory to a flash drive or another PC, the new machine computes a completely different HWID.
- The licensing engine immediately detects that the hardware signature does not match the active license key’s authorized device registry, blocking access to paid tiers.

---

## 3. Cryptographic Licensing & Concurrency Control

### 3.1 The 6-Device Concurrency Standard
To accommodate multi-device workflows (e.g. student desktop, laptop, lab PC) while preventing mass key sharing:
- Every **Professional** and **Enterprise** license supports a strict maximum of **6 concurrent hardware devices** (`maxDevices: 6`).
- When a client enters a license key:
  1. The client queries `/licenses/{KEY}` in Firebase Realtime Database.
  2. If the current HWID already exists in `devices[hwid]`, activation proceeds instantly.
  3. If the HWID is new and `Object.keys(devices).length < maxDevices`, the HWID is appended with an `activatedAt` timestamp.
  4. If the device count has reached 6, the client is blocked with a **Device Limit Exceeded** alert.

### 3.2 Hardware Unlinking & Remote Logout
If a user replaces a laptop, upgrades hardware, or formats a drive:
- **Client-Side Self-Service**: From `Settings > Licensing`, the user can view all bound HWIDs with activation timestamps and click **Logout Device** next to any older machine.
- **Admin Panel Control**: Lab administrators can remotely disconnect any device from the Admin Panel, immediately freeing a seat for another workstation.
- **Cryptographic Revocation**: The function `unlinkDeviceFromLicense(key, hwid)` removes the specific hardware node from the database, instantly de-authorizing that machine.

---

## 4. Execution Sandbox & Code Safety

### 4.1 Zero Arbitrary Code Evaluation
A major vulnerability in educational software is the use of `eval()` or unconstrained runtime interpreters that could allow student-submitted code to access local files or spawn shell processes.

TreadCode eliminates this risk entirely:
- **Pre-Compiled Deterministic Timelines**: All lessons are stored as structured `ExecutionStep` data arrays.
- **No `eval()` or `Function()` Constructors**: The frontend code execution visualizer steps through pre-validated snapshots. It never executes untrusted JavaScript or shell commands.
- **Virtual Memory Isolation**: The virtual Stack, Heap, and Variable Symbol Table exist purely in memory inside the Zustand store (`src/lessons/useLessonStore.ts`) and have zero access to the host operating system's RAM.

### 4.2 Network Whitelisting & IPC Capabilities
Tauri v2 enforces granular capability permissions defined in `src-tauri/capabilities/`:
- **Shell Plugin**: Restricted strictly to opening whitelisted HTTP/HTTPS URLs in the user's default browser. Subprocess execution is disabled.
- **Network Boundaries**: Outbound network requests are limited exclusively to:
  - `https://flowtrace-licensing-default-rtdb.firebaseio.com/` (Licensing & Support)
  - `https://github.com/prince19112003/` (Certified binary downloads)
  - `https://tread-code-smoky.vercel.app/` (Web Store catalogue)

---

## 5. OTA Auto-Update Integrity & Ed25519 Signatures

When native updates are downloaded via the Tauri Updater:
1. **Public-Key Cryptography**: All release archives are signed with an Ed25519 private key during the release build pipeline.
2. **Signature Verification**: The public key is hardcoded in `src-tauri/tauri.conf.json`. Before running any downloaded updater binary, Tauri verifies the cryptographic signature against the remote payload.
3. **Tamper Prevention**: If a malicious third party attempts a Man-in-the-Middle (MitM) attack or alters even a single byte of the `.exe` installer, signature verification fails and the update is rejected automatically.

---

## 6. Security Source Mapping

| Security Responsibility | Source File | Implementation Details |
| :--- | :--- | :--- |
| **Native HWID Derivation** | `src-tauri/src/lib.rs` | Windows Registry Machine GUID + CPU string SHA-256 derivation. |
| **License Verification** | `src/shared/config/firebase.ts` | Real-time Firebase RTDB validation, device binding, and seat checks. |
| **Device Limit Unlinking** | `src/shared/config/firebase.ts` | `unlinkDeviceFromLicense()` removing target HWID from active seats. |
| **Capability Sandbox** | `src-tauri/capabilities/default.json` | Tauri v2 permission lockdown for updater, process, and shell plugins. |
| **Updater Public Key** | `src-tauri/tauri.conf.json` | Hardcoded Ed25519 public key verifying binary integrity. |
| **Client Gatekeeper** | `src/app/App.tsx` | Enforces tier boundaries (Community vs Professional vs Enterprise). |
