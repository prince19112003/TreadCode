import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function exportMasterPack() {
  console.log('========================================================================');
  console.log('       BUILDING TREADCODE MASTER DISTRIBUTION PACKAGE                   ');
  console.log('========================================================================');

  const pkgPath = path.join(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version || '1.0.8';
  console.log(`Target Version: v${version}`);

  const releaseMasterDir = path.join(ROOT_DIR, 'release-master');
  const stagingRoot = path.join(releaseMasterDir, 'staging');
  const packFolder = path.join(stagingRoot, `TreadCode_Master_Package_v${version}`);

  if (fs.existsSync(stagingRoot)) {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
  }

  const folderInstallers = path.join(packFolder, '01_Standalone_Installers');
  const folderUsb = path.join(packFolder, '02_Zero_Install_Portable_USB');
  fs.mkdirSync(folderInstallers, { recursive: true });
  fs.mkdirSync(folderUsb, { recursive: true });

  // 1. Copy Installers
  console.log('\n📁 [1/4] Preparing Standalone Installers...');

  // Windows Setup EXE
  const winSetupPath = path.join(ROOT_DIR, 'src-tauri', 'target', 'release', 'bundle', 'nsis', `TreadCode_${version}_x64-setup.exe`);
  if (fs.existsSync(winSetupPath)) {
    fs.copyFileSync(winSetupPath, path.join(folderInstallers, `TreadCode_${version}_x64-setup.exe`));
    console.log(`  ✔ Copied Windows Installer: TreadCode_${version}_x64-setup.exe`);
  } else {
    console.warn(`  ⚠️ Windows setup exe not found at: ${winSetupPath}`);
  }

  // Android APK
  const apkSrc = path.join(ROOT_DIR, 'release-apk', 'TreadCode_Android_SmartBoard.apk');
  const fallbackApk = path.join(ROOT_DIR, 'release-apk', `TreadCode_${version}.apk`);
  if (fs.existsSync(apkSrc)) {
    fs.copyFileSync(apkSrc, path.join(folderInstallers, `TreadCode_${version}.apk`));
    console.log(`  ✔ Copied Android APK: TreadCode_${version}.apk`);
  } else if (fs.existsSync(fallbackApk)) {
    fs.copyFileSync(fallbackApk, path.join(folderInstallers, `TreadCode_${version}.apk`));
    console.log(`  ✔ Copied Android APK: TreadCode_${version}.apk`);
  }

  // Installer Readme
  const installerReadme = `========================================================================
TREADCODE STANDALONE INSTALLERS (v${version})
========================================================================

Choose your operating system:

1. WINDOWS (PC / Laptop / SmartBoard OPS slot):
   - Run "TreadCode_${version}_x64-setup.exe"
   - Standard Windows setup wizard with desktop shortcut.

2. ANDROID (Interactive Flat Panels, SmartBoards, Tablets):
   - Copy "TreadCode_${version}.apk" to the device.
   - Tap in File Manager to install.
   - Optimized for touch, pen stylus, and 4K displays.

3. LINUX (Ubuntu, Debian, BOSS Linux, KITE GNU-Linux):
   - Use the standalone AppImage or .deb package.
   - You can also run directly without installation via "02_Zero_Install_Portable_USB".
========================================================================
`;
  fs.writeFileSync(path.join(folderInstallers, 'README_INSTALLERS.txt'), installerReadme, 'utf8');

  // 2. Prepare Zero-Install Portable USB folder
  console.log('\n📁 [2/4] Preparing Zero-Install Portable USB Suite...');
  const usbStagingDir = path.join(ROOT_DIR, 'release-usb', 'staging', 'TreadCode-USB-Portable');
  if (!fs.existsSync(usbStagingDir)) {
    console.log('⚙️ USB staging not found. Generating USB bundle first...');
    execSync('node scripts/export_usb_bundle.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  }

  if (fs.existsSync(usbStagingDir)) {
    fs.cpSync(usbStagingDir, folderUsb, { recursive: true });
    console.log('  ✔ Successfully synchronized Zero-Install USB suite.');
  }

  // 3. Root offline license template & main readme
  console.log('\n📁 [3/4] Adding Root Offline License & Instructions...');
  const licenseTemplate = {
    _instructions: "To activate TreadCode offline, enter your purchased license key below and save this file. You can also activate online inside TreadCode > Settings > License.",
    licenseKey: "",
    tier: "Community",
    holderName: "Unregistered",
    organization: "",
    expiresAt: "",
    offline: false
  };
  fs.writeFileSync(path.join(packFolder, 'license.json'), JSON.stringify(licenseTemplate, null, 2), 'utf8');

  const mainReadme = `========================================================================
TREADCODE MASTER DISTRIBUTION PACKAGE (v${version})
========================================================================

Complete all-in-one package for educational institutions, lab administrators,
and multi-device deployments.

PACKAGE CONTENTS:
------------------------------------------------------------------------
📁 01_Standalone_Installers/
   Native setup installers for permanent installation on Windows,
   Android SmartBoards, and Linux.

📁 02_Zero_Install_Portable_USB/
   Complete plug-and-play offline engine. Copy this entire folder to any
   USB flash drive to run on any computer or SmartBoard with 0% installation
   and zero administrator privileges required.

📄 license.json
   Editable offline license file. Open in Notepad, edit "licenseKey"
   with your issued key, and save. TreadCode auto-activates on launch
   without requiring internet connectivity or server verification.

------------------------------------------------------------------------
QUICK START:
------------------------------------------------------------------------
- To run immediately without installing:
  Open folder "02_Zero_Install_Portable_USB" and double-click "1_CLICK_WINDOWS.bat"
  (or "1_CLICK_LINUX.sh" on Linux).

- To permanently install:
  Open folder "01_Standalone_Installers" and run the setup for your OS.

- To configure offline license:
  Open "license.json", set your license key, and save. Both the portable
  and installed editions will read it automatically.

========================================================================
Developed by Prince Thakur • TreadCode Universal Edition
========================================================================
`;
  fs.writeFileSync(path.join(packFolder, 'README_FIRST.txt'), mainReadme, 'utf8');

  // 4. Compress into ZIP archive
  console.log('\n📦 [4/4] Compressing Master Distribution Package into ZIP archive...');
  const zipName = `TreadCode_Master_Package_v${version}.zip`;
  const zipPath = path.join(releaseMasterDir, zipName);

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  if (process.platform === 'win32') {
    const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${packFolder}\\*' -DestinationPath '${zipPath}' -Force"`;
    execSync(psCmd, { stdio: 'inherit' });
  } else {
    execSync(`cd "${packFolder}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  }

  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n========================================================================');
  console.log('🎉 MASTER DISTRIBUTION PACKAGE COMPILED SUCCESSFULLY!');
  console.log('========================================================================');
  console.log(` Archive Name : ${zipName}`);
  console.log(` Archive Size : ${sizeMB} MB`);
  console.log(` File Path    : ${zipPath}`);
  console.log('========================================================================\n');
}

exportMasterPack().catch((err) => {
  console.error('Fatal master pack error:', err);
  process.exit(1);
});
