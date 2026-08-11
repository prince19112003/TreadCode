import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please specify a version, e.g. npm run release 1.7.0');
  process.exit(1);
}

console.log(`Deploying version v${newVersion}...`);

const EXE_URL = `https://github.com/prince19112003/FlowTrace/releases/download/v${newVersion}/FlowTrace_${newVersion}_x64-setup.exe`;

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
publicVersion.releaseUrl = 'https://github.com/prince19112003/FlowTrace/releases/latest';
writeFileSync(publicVersionPath, JSON.stringify(publicVersion, null, 2));
console.log('✔ Updated public/version.json');

// 4. Patch CURRENT_VERSION in useUpdateChecker.ts
const hookPath = './src/shared/hooks/useUpdateChecker.ts';
let hookContent = readFileSync(hookPath, 'utf8');
hookContent = hookContent.replace(
  /const CURRENT_VERSION = '[^']+';/,
  `const CURRENT_VERSION = '${newVersion}';`
);
writeFileSync(hookPath, hookContent);
console.log('✔ Patched CURRENT_VERSION in useUpdateChecker.ts');

// 5. Sync to Firebase RTDB node global_update.json
async function syncFirebase() {
  try {
    const updateData = {
      version: newVersion,
      buildDate: new Date().toISOString().split('T')[0],
      downloadUrl: EXE_URL,
      releaseUrl: 'https://github.com/prince19112003/FlowTrace/releases/latest',
      changelog: [
        "New 3D MindTrace execution tree logo across all platforms",
        "Display & Projector Tuning with 1-click Faculty Presets",
        "First-launch EULA & Privacy Policy agreement modal",
        "Slim compact headers across all 3 visualizer panels",
        "Futuristic Glass Window Control Capsule"
      ]
    };
    const res = await fetch('https://flowtrace-licensing-default-rtdb.firebaseio.com/global_update.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (res.ok) {
      console.log('✔ Synced global_update to Firebase RTDB');
    }
  } catch (e) {
    console.warn('Firebase RTDB sync warning:', e.message);
  }

  // 6. Git commit, push, tag
  try {
    execSync('git add .');
    execSync(`git commit --no-verify -m "bump(version): release v${newVersion}"`);
    execSync('git push origin main');
    execSync(`git tag v${newVersion}`);
    execSync(`git push origin v${newVersion}`);
    console.log(`\n🚀 Version v${newVersion} successfully pushed and tagged! Remote apps will receive update immediately.`);
  } catch (error) {
    console.error('Error during git operations:', error.message);
  }
}

syncFirebase();
