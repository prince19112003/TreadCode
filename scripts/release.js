import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please specify a version, e.g. npm run release 1.7.0');
  process.exit(1);
}

console.log(`Deploying version v${newVersion}...`);

const EXE_URL = `https://github.com/prince19112003/FlowTrace/releases/download/v${newVersion}/FlowTrace_${newVersion}_x64-setup.exe`;

// 1. Update src-tauri/tauri.conf.json
const tauriConfPath = './src-tauri/tauri.conf.json';
const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf8'));
tauriConf.version = newVersion;
writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
console.log('✔ Updated src-tauri/tauri.conf.json');

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

// 4. Patch CURRENT_VERSION in useUpdateChecker.ts (so app knows its own installed version)
const hookPath = './src/shared/hooks/useUpdateChecker.ts';
let hookContent = readFileSync(hookPath, 'utf8');
hookContent = hookContent.replace(
  /const CURRENT_VERSION = '[^']+';/,
  `const CURRENT_VERSION = '${newVersion}';`
);
writeFileSync(hookPath, hookContent);
console.log('✔ Patched CURRENT_VERSION in useUpdateChecker.ts');

// 5. Git commit, push, tag
try {
  execSync('git add .');
  execSync(`git commit --no-verify -m "bump(version): release v${newVersion}"`);
  execSync('git push origin main');
  execSync(`git tag v${newVersion}`);
  execSync(`git push origin v${newVersion}`);
  console.log(`\n🚀 Version v${newVersion} successfully pushed and tagged! GitHub Actions is building the release.`);
} catch (error) {
  console.error('Error during git operations:', error.message);
}
