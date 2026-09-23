import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function exportUsbBundle() {
  console.log('========================================================================');
  console.log('       BUILDING TREADCODE UNIVERSAL USB PORTABLE BUNDLE                 ');
  console.log('========================================================================');

  // 1. Read app version
  const pkgPath = path.join(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version || '1.0.0';
  console.log(`Target Version: v${version}`);

  // 2. Ensure dist/ exists (build if missing)
  const distDir = path.join(ROOT_DIR, 'dist');
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.log('⚙️ Dist bundle not found. Building web frontend (npm run build)...');
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
  } else {
    console.log('✔ Found existing production dist/ directory.');
  }

  // 3. Staging directories
  const releaseUsbDir = path.join(ROOT_DIR, 'release-usb');
  const stagingRoot = path.join(releaseUsbDir, 'staging');
  const portableAppFolder = path.join(stagingRoot, 'TreadCode-USB-Portable');
  const appTargetDir = path.join(portableAppFolder, 'app');

  if (fs.existsSync(stagingRoot)) {
    fs.rmSync(stagingRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(appTargetDir, { recursive: true });

  // 4. Copy dist/ into portable/app/
  console.log('📁 Copying optimized web app to portable staging directory...');
  fs.cpSync(distDir, appTargetDir, { recursive: true });

  // 5. Copy 1-click launchers & instructions into root of portable folder
  const launchersSrc = path.join(ROOT_DIR, 'scripts', 'usb-launchers');
  const launcherFiles = [
    'Launch-TreadCode.bat',
    'Launch-TreadCode.sh',
    'Launch-TreadCode.command',
    'TreadCode.desktop',
    'autorun.inf',
    'README-INSTRUCTIONS.txt'
  ];

  for (const file of launcherFiles) {
    const srcFile = path.join(launchersSrc, file);
    const destFile = path.join(portableAppFolder, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      // Ensure execute permission for shell scripts
      if (file.endsWith('.sh') || file.endsWith('.command')) {
        try {
          fs.chmodSync(destFile, 0o755);
        } catch {}
      }
      console.log(`  ✔ Copied ${file}`);
    } else {
      console.warn(`  ⚠️ Missing launcher file: ${file}`);
    }
  }

  // 5b. Copy OS icons into root of portable folder for Windows, Mac, and Linux
  const iconsSrc = path.join(ROOT_DIR, 'src-tauri', 'icons');
  const iconMappings = [
    { src: 'icon.ico', dest: 'app.ico' },       // Windows icon
    { src: 'icon.icns', dest: 'app.icns' },     // macOS icon
    { src: 'icon.png', dest: 'app.png' },       // Linux PNG icon
  ];

  for (const { src, dest } of iconMappings) {
    const srcFile = path.join(iconsSrc, src);
    const destFile = path.join(portableAppFolder, dest);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`  ✔ Copied OS Icon: ${dest}`);
    } else {
      console.warn(`  ⚠️ Missing icon file: ${src}`);
    }
  }

  // 6. Zip compression
  const versionedZipName = `TreadCode-USB-Portable-v${version}.zip`;
  const latestZipName = 'TreadCode-USB-Portable.zip';
  const versionedZipPath = path.join(releaseUsbDir, versionedZipName);
  const latestZipPath = path.join(releaseUsbDir, latestZipName);

  // Remove existing zips if any
  if (fs.existsSync(versionedZipPath)) fs.unlinkSync(versionedZipPath);
  if (fs.existsSync(latestZipPath)) fs.unlinkSync(latestZipPath);

  console.log('\n📦 Compressing 1-click portable bundle into ZIP archive...');

  if (process.platform === 'win32') {
    // Windows PowerShell Compress-Archive
    const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${portableAppFolder}\\*' -DestinationPath '${versionedZipPath}' -Force"`;
    execSync(psCmd, { stdio: 'inherit' });
  } else {
    // Linux / macOS zip utility
    execSync(`cd "${portableAppFolder}" && zip -r "${versionedZipPath}" .`, { stdio: 'inherit' });
  }

  // Copy to generic latest zip in release-usb
  fs.copyFileSync(versionedZipPath, latestZipPath);

  // 7. Copy to public/releases for Vercel / Web Store auto-hosting
  const publicReleasesDir = path.join(ROOT_DIR, 'public', 'releases');
  if (!fs.existsSync(publicReleasesDir)) {
    fs.mkdirSync(publicReleasesDir, { recursive: true });
  }
  const publicZipPath = path.join(publicReleasesDir, 'TreadCode_USB_Portable.zip');
  fs.copyFileSync(versionedZipPath, publicZipPath);
  console.log(`✔ Copied to ${publicZipPath} for web host distribution.`);

  // 8. Summary output
  const stats = fs.statSync(versionedZipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n========================================================================');
  console.log('🎉 TREADCODE UNIVERSAL USB BUNDLE READY FOR DISTRIBUTION!');
  console.log('========================================================================');
  console.log(` Archive Name: ${versionedZipName}`);
  console.log(` Archive Size: ${sizeMB} MB`);
  console.log(` Location    : ${versionedZipPath}`);
  console.log(' Contents    :');
  console.log('   ├── Launch-TreadCode.bat     (Windows 7/8/10/11 1-Click launcher)');
  console.log('   ├── Launch-TreadCode.sh      (Linux BOSS/KITE/Ubuntu 1-Click launcher)');
  console.log('   ├── Launch-TreadCode.command (macOS 1-Click launcher)');
  console.log('   ├── README-INSTRUCTIONS.txt   (Plain-text classroom guide)');
  console.log('   └── app/                     (Self-contained offline application)');
  console.log('========================================================================\n');
}

exportUsbBundle().catch((err) => {
  console.error('Fatal bundle error:', err);
  process.exit(1);
});
