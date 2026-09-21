# Native Desktop Core (`src-tauri/`)

> **Architectural Layer**: Native Operating System Bridge & Rust Backend  
> **Primary Technology**: Rust 2021, Tauri v2, Windows API, Ed25519 Cryptography

---

## 1. Directory Purpose

The `src-tauri/` directory implements TreadCode's native desktop core. It provides deep operating system integration, secure hardware identification (HWID), native updater signature verification, and process lifecycle management.

---

## 2. Key Files & Configuration

```
src-tauri/
├── Cargo.toml                        # Rust dependencies and package metadata
├── tauri.conf.json                   # Window size, bundle identifier, Ed25519 public key, permissions
├── capabilities/                     # Granular capability definitions for updater, process, shell
└── src/
    ├── main.rs                       # Native executable entrypoint calling lib::run()
    └── lib.rs                        # HWID calculation, plugin registration, native commands
```

---

## 3. Core Rust Capabilities

### 3.1 Hardware ID (HWID) Generation
- Computes a deterministic SHA-256 fingerprint from:
  1. Windows Machine GUID (`SOFTWARE\Microsoft\Cryptography\MachineGuid`).
  2. Processor Identifier & Architecture.
- Guarantees that student licenses cannot be spoofed or transferred without authorization.

### 3.2 Native Auto-Updater Security
- Tauri v2 uses public-key cryptography (Ed25519) to verify that any incoming update archive has not been tampered with in transit before running the installer.
- Configured via `src-tauri/tauri.conf.json` under `plugins.updater`.

### 3.3 Process Lifecycle & Sandbox
- Manages clean application exits and restarts (`plugin-process`).
- Enforces an air-gapped security sandbox that prevents unauthorized external network requests outside the whitelisted Firebase and GitHub endpoints.
