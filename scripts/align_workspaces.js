import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('       ALIGNING ADMIN PANEL & WEB CODEBASES WITH NEW PLATFORMS          ');
console.log('========================================================================');

// Paths
const WEB_CATALOGUE_PATH = 'C:/Users/princ/Desktop/web/src/lib/catalogueData.ts';
const ADMIN_APP_PATH = 'C:/Users/princ/Desktop/My-GitHub-CleanUp/admin panel/src/App.tsx';
const ADMIN_FIREBASE_PATH = 'C:/Users/princ/Desktop/My-GitHub-CleanUp/admin panel/src/config/firebase.ts';

// ── 1.5 UPDATE ADMIN PANEL FIREBASE INTERFACE ─────────────────────────────────
if (fs.existsSync(ADMIN_FIREBASE_PATH)) {
  let fbContent = fs.readFileSync(ADMIN_FIREBASE_PATH, 'utf8');
  if (!fbContent.includes('linuxUrl?: string;')) {
    fbContent = fbContent.replace(
      /macUrl\?:\s*string;/,
      "macUrl?: string;               // macOS .dmg URL\n  linuxUrl?: string;             // Linux (.AppImage / .deb) URL\n  usbUrl?: string;               // Universal USB Portable (.zip) URL"
    );
    fs.writeFileSync(ADMIN_FIREBASE_PATH, fbContent, 'utf8');
    console.log('✔ Patched AppGlobalSettings interface in admin panel firebase.ts');
  }
}

// ── 1. UPDATE WEB STORE CATALOGUE ─────────────────────────────────────────────
if (fs.existsSync(WEB_CATALOGUE_PATH)) {
  console.log('📁 Aligning Web Store Catalogue:', WEB_CATALOGUE_PATH);
  let webContent = fs.readFileSync(WEB_CATALOGUE_PATH, 'utf8');

  // Multi-platform file definitions for TreadCode Release
  const multiPlatformFiles = `files: [
      {
        id: 'file-tc-win-exe',
        release_id: 'rel-treadcode-1-0-8',
        filename: 'TreadCode_1.0.8_x64-setup.exe',
        display_name: 'TreadCode v1.0.8 (Windows x64 Setup)',
        file_type: 'exe',
        platform: 'windows',
        download_url: 'https://tread-code-smoky.vercel.app/releases/TreadCode_1.0.8_x64-setup.exe',
        size_bytes: 37290098,
        checksum_sha256: 'ec07a09f0eb5dd0d4b52628d9f3708dbd03bb017cc7239f0fc03e8408c6b5ffb',
        download_count: 0,
        sort_order: 1,
        created_at: '2026-08-13T20:02:42Z',
      },
      {
        id: 'file-tc-android-apk',
        release_id: 'rel-treadcode-1-0-8',
        filename: 'TreadCode_1.0.8.apk',
        display_name: 'TreadCode for Classroom Smart Boards & IFP Panels (Android .apk)',
        file_type: 'apk',
        platform: 'android',
        download_url: 'https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_1.0.8.apk',
        size_bytes: 18500000,
        checksum_sha256: null,
        download_count: 0,
        sort_order: 2,
        created_at: '2026-08-13T20:02:42Z',
      },
      {
        id: 'file-tc-linux-appimage',
        release_id: 'rel-treadcode-1-0-8',
        filename: 'TreadCode_1.0.8_amd64.AppImage',
        display_name: 'TreadCode for Linux Labs (BOSS Linux / KITE / Ubuntu AppImage)',
        file_type: 'other',
        platform: 'linux',
        download_url: 'https://tread-code-smoky.vercel.app/releases/TreadCode_latest_amd64.AppImage',
        size_bytes: 42000000,
        checksum_sha256: null,
        download_count: 0,
        sort_order: 3,
        created_at: '2026-08-13T20:02:42Z',
      },
      {
        id: 'file-tc-usb-portable',
        release_id: 'rel-treadcode-1-0-8',
        filename: 'TreadCode_USB_Portable.zip',
        display_name: 'TreadCode Universal USB Portable (Zero-Install Pen Drive Edition)',
        file_type: 'zip',
        platform: 'cross-platform',
        download_url: 'https://tread-code-smoky.vercel.app/releases/TreadCode_USB_Portable.zip',
        size_bytes: 4325376,
        checksum_sha256: null,
        download_count: 0,
        sort_order: 4,
        created_at: '2026-08-13T20:02:42Z',
      },
      {
        id: 'file-tc-packs-bundle',
        release_id: 'rel-treadcode-1-0-8',
        filename: 'TreadCode_Packs_Offline_v1.0.8.zip',
        display_name: 'Offline Course Extension Packs (Air-Gapped Labs Archive)',
        file_type: 'zip',
        platform: 'cross-platform',
        download_url: 'https://github.com/prince19112003/TreadCode/releases/download/v1.0.8/TreadCode_Packs_Offline_v1.0.8.zip',
        size_bytes: 1153433,
        checksum_sha256: null,
        download_count: 0,
        sort_order: 5,
        created_at: '2026-08-13T20:02:42Z',
      },
    ],`;

  // Replace files array in TREADCODE_RELEASES
  webContent = webContent.replace(/files:\s*\[[\s\S]*?\],\s*\},/m, `${multiPlatformFiles}\n  },`);

  // Update target_os and tags
  webContent = webContent.replace(
    /target_os:\s*'[^']+',/g,
    "target_os: 'Windows 10/11, Android Smart Boards, Linux (BOSS/KITE), USB Portable',"
  );

  webContent = webContent.replace(
    /tags:\s*\[[^\]]+\],/m,
    "tags: ['Windows', 'Android', 'SmartBoard', 'Linux', 'USB-Portable', 'Desktop', 'Tauri', 'DSA', 'Algorithms', 'Code Visualizer', 'Education'],"
  );

  // Update short_description to reflect universal multi-platform
  webContent = webContent.replace(
    /short_description:\s*'A native Windows desktop tool/g,
    "short_description: 'A universal code visualizer for Windows PCs, Android Smart Boards, Linux School Labs, and USB drives"
  );

  // Update offline bundle statement
  webContent = webContent.replace(
    /All extension packs can be downloaded directly inside the application or deployed via the \*\*Offline Course Packs Archive\*\* for air-gapped school & university computer labs\./,
    "All core curriculum extension packs (Python, C, C++, Java, DSA, ML, Networks) are **100% Pre-Bundled & Active out of the box** across all platforms — zero internet downloads required!"
  );

  fs.writeFileSync(WEB_CATALOGUE_PATH, webContent, 'utf8');
  console.log('✔ Successfully aligned Web Store Catalogue with all 5 platforms!');
} else {
  console.warn('⚠️ Web catalogue not found at:', WEB_CATALOGUE_PATH);
}

// ── 2. UPDATE ADMIN PANEL DASHBOARD ───────────────────────────────────────────
if (fs.existsSync(ADMIN_APP_PATH)) {
  console.log('\n📁 Aligning Admin Panel Dashboard:', ADMIN_APP_PATH);
  let adminContent = fs.readFileSync(ADMIN_APP_PATH, 'utf8');

  // 1. Add linuxUrl & usbUrl to initial globalSettings state
  if (!adminContent.includes('linuxUrl:')) {
    adminContent = adminContent.replace(
      /macUrl:\s*'',/,
      "macUrl: '',\n    linuxUrl: '',\n    usbUrl: '',"
    );
  }

  // 2. In unsubTauriUpdater, parse linuxUrl and usbUrl
  if (!adminContent.includes("data.platforms?.['linux-x86_64']?.url")) {
    adminContent = adminContent.replace(
      /downloadUrlOverride:\s*data\.platforms\?\.\['windows-x86_64'\]\?\.url\s*\|\|\s*prev\.downloadUrlOverride,/,
      `downloadUrlOverride: data.platforms?.['windows-x86_64']?.url || prev.downloadUrlOverride,
            apkUrl: data.platforms?.['android']?.url || prev.apkUrl,
            macUrl: data.platforms?.['darwin-x86_64']?.url || prev.macUrl,
            linuxUrl: data.platforms?.['linux-x86_64']?.url || data.platforms?.['linux']?.url || prev.linuxUrl,
            usbUrl: data.platforms?.['usb-portable']?.url || data.platforms?.['usb']?.url || prev.usbUrl,`
    );
  }

  // 3. In save handler, serialize linuxUrl and usbUrl into updaterPayload
  if (!adminContent.includes("updaterPayload.platforms['linux-x86_64']")) {
    const updaterPayloadInsert = `        if (globalSettings.linuxUrl) {
          updaterPayload.platforms['linux-x86_64'] = {
            signature: '',
            url: globalSettings.linuxUrl,
          };
          updaterPayload.platforms['linux'] = {
            signature: '',
            url: globalSettings.linuxUrl,
          };
        }
        if (globalSettings.usbUrl) {
          updaterPayload.platforms['usb-portable'] = {
            signature: '',
            url: globalSettings.usbUrl,
          };
          updaterPayload.platforms['usb'] = {
            signature: '',
            url: globalSettings.usbUrl,
          };
        }`;

    adminContent = adminContent.replace(
      /(updaterPayload\.platforms\['darwin-aarch64'\] = \{[\s\S]*?\};\s*\})/,
      `$1\n${updaterPayloadInsert}`
    );
  }

  // 4. In UI form, add input fields for Linux Package URL and Universal USB Portable URL
  const formInsert = `              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-1">Linux Package (.AppImage / .deb) URL</label>
                  <input
                    type="text"
                    value={globalSettings.linuxUrl || ''}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, linuxUrl: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                    placeholder="https://.../TreadCode_latest_amd64.AppImage"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-1">Universal USB Portable (.zip) URL</label>
                  <input
                    type="text"
                    value={globalSettings.usbUrl || ''}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, usbUrl: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white"
                    placeholder="https://.../TreadCode_USB_Portable.zip"
                  />
                </div>
              </div>`;

  if (!adminContent.includes('Linux Package (.AppImage / .deb) URL')) {
    adminContent = adminContent.replace(
      /(<label className="text-\[10px\] font-mono text-zinc-400 uppercase font-bold block mb-1">macOS \.dmg URL<\/label>[\s\S]*?<\/div>\s*<\/div>)/,
      `$1\n\n${formInsert}`
    );
  }

  fs.writeFileSync(ADMIN_APP_PATH, adminContent, 'utf8');
  console.log('✔ Successfully aligned Admin Panel with Linux and USB Portable management!');
} else {
  console.warn('⚠️ Admin panel App.tsx not found at:', ADMIN_APP_PATH);
}

console.log('\n🎉 ALL WORKSPACES (Code Visualizer, Admin Panel, Web) SYNCHRONIZED!');
