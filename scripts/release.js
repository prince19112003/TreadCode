import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { execSync } from 'child_process';

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please specify a version, e.g. npm run release 1.7.0');
  process.exit(1);
}

console.log(`Deploying version v${newVersion}...`);

const REPO = 'prince19112003/TreadCode';
const EXE_URL = `https://github.com/${REPO}/releases/download/v${newVersion}/TreadCode_${newVersion}_x64-setup.exe`;
const RELEASE_URL = `https://github.com/${REPO}/releases/latest`;

// 1. Update src-tauri/tauri.conf.json & package.json
const tauriConfPath = './src-tauri/tauri.conf.json';
const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf8'));
tauriConf.version = newVersion;
writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
console.log('✔ Updated src-tauri/tauri.conf.json');

const packageJsonPath = './package.json';
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✔ Updated package.json');

// 2. Update updater.json (Tauri's native updater endpoint)
const updaterPath = './updater.json';
const updater = JSON.parse(readFileSync(updaterPath, 'utf8'));
updater.version = newVersion;
updater.pub_date = new Date().toISOString();
updater.platforms['windows-x86_64'].url = EXE_URL;
writeFileSync(updaterPath, JSON.stringify(updater, null, 2));
console.log('✔ Updated updater.json');

// 3. Update public/version.json (fetched by the web update checker hook)
const publicVersionPath = './public/version.json';
const publicVersion = JSON.parse(readFileSync(publicVersionPath, 'utf8'));
publicVersion.version = newVersion;
publicVersion.buildDate = new Date().toISOString().split('T')[0];
publicVersion.downloadUrl = EXE_URL;
publicVersion.releaseUrl = RELEASE_URL;
writeFileSync(publicVersionPath, JSON.stringify(publicVersion, null, 2));
console.log('✔ Updated public/version.json');

// 4. Patch CURRENT_VERSION in useUpdateChecker.ts
const hookPath = './src/shared/hooks/useUpdateChecker.ts';
let hookContent = readFileSync(hookPath, 'utf8');
hookContent = hookContent.replace(
  /const CURRENT_VERSION = '[^']+';/,
  `const CURRENT_VERSION = '${newVersion}';`
);
// Also patch any leftover FlowTrace URLs
hookContent = hookContent.replace(/prince19112003\/FlowTrace/g, REPO);
writeFileSync(hookPath, hookContent);
console.log('✔ Patched CURRENT_VERSION in useUpdateChecker.ts');

// 5. Build Native Windows Installer (.exe setup)
try {
  console.log('\n⚙️ Building Native Windows Setup Installer (.exe)...');
  execSync('npx tauri build', { stdio: 'inherit' });
  console.log('✔ Built Windows Setup Installer!');

  // Copy built installer to public/releases/ for Vercel auto-hosting
  const builtExePath = `./src-tauri/target/release/bundle/nsis/TreadCode_${newVersion}_x64-setup.exe`;
  const publicReleaseDir = './public/releases';
  if (!existsSync(publicReleaseDir)) {
    mkdirSync(publicReleaseDir, { recursive: true });
  }
  const publicExePath = `${publicReleaseDir}/TreadCode_${newVersion}_x64-setup.exe`;
  const latestExePath = `${publicReleaseDir}/TreadCode_latest_x64-setup.exe`;
  
  copyFileSync(builtExePath, publicExePath);
  copyFileSync(builtExePath, latestExePath);
  console.log('✔ Copied setup executable to public/releases/ for Vercel deployment');
} catch (e) {
  console.error('Tauri build/copy failed:', e.message);
}

// Vercel deployment URL format
const VERCEL_DOMAIN = 'tread-code-smoky.vercel.app'; 
const VERCEL_EXE_URL = `https://${VERCEL_DOMAIN}/releases/TreadCode_${newVersion}_x64-setup.exe`;

// 6. Sync to Firebase RTDB node tauri_updater.json
async function syncFirebase() {
  try {
    const updateData = {
      version: newVersion,
      notes: "SmartBoard workspace session persistence & resume\nUltra-HD 4K PNG & Multi-page PDF\nHold-to-Snap offline shape recognition",
      pub_date: new Date().toISOString(),
      platforms: {
        "windows-x86_64": {
          "signature": "NATIVE_UNSIGNED",
          "url": VERCEL_EXE_URL
        }
      }
    };
    // Sync new Tauri v2 native updater format
    const resTauri = await fetch('https://flowtrace-licensing-default-rtdb.firebaseio.com/tauri_updater.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    // Also sync old legacy format for older builds (v1.0.0 - v1.0.3)
    const legacyUpdateData = {
      version: newVersion,
      buildDate: new Date().toISOString().split('T')[0],
      downloadUrl: VERCEL_EXE_URL,
      releaseUrl: RELEASE_URL,
      changelog: [
        "SmartBoard workspace session persistence & resume",
        "Ultra-HD 4K PNG & Multi-page PDF",
        "Hold-to-Snap offline shape recognition"
      ]
    };
    const resLegacy = await fetch('https://flowtrace-licensing-default-rtdb.firebaseio.com/global_update.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(legacyUpdateData)
    });

    if (resTauri.ok && resLegacy.ok) {
      console.log('✔ Synced both tauri_updater & global_update nodes to Firebase RTDB!');
    }
  } catch (e) {
    console.warn('Firebase RTDB sync warning:', e.message);
  }

  // 7. Git commit, push, tag
  try {
    execSync('git add .');
    execSync(`git commit --no-verify -m "bump(version): release v${newVersion}"`);
    execSync('git push origin main');
    execSync(`git tag v${newVersion}`);
    execSync(`git push origin v${newVersion}`);
    console.log(`\n🚀 All-in-One Version v${newVersion} successfully compiled, pushed, tagged, & broadcasted globally!`);
  } catch (error) {
    console.error('Error during git operations:', error.message);
  }
}

syncFirebase();
