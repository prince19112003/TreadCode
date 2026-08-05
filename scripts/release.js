import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please specify a version, e.g. npm run release 0.3.0');
  process.exit(1);
}

console.log(`Deploying version v${newVersion}...`);

// 1. Update tauri.conf.json
const tauriConfPath = './src-tauri/tauri.conf.json';
const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf8'));
tauriConf.version = newVersion;
writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
console.log('✔ Updated src-tauri/tauri.conf.json');

// 2. Update updater.json
const updaterPath = './updater.json';
const updater = JSON.parse(readFileSync(updaterPath, 'utf8'));
updater.version = newVersion;
updater.platforms['windows-x86_64'].url = `https://github.com/prince19112003/FlowTrace/releases/latest/download/FlowTrace_${newVersion}_x64-setup.nsis.zip`;
writeFileSync(updaterPath, JSON.stringify(updater, null, 2));
console.log('✔ Updated updater.json');

// 2.5. Update public/version.json
const publicVersionPath = './public/version.json';
const publicVersion = JSON.parse(readFileSync(publicVersionPath, 'utf8'));
publicVersion.version = newVersion;
writeFileSync(publicVersionPath, JSON.stringify(publicVersion, null, 2));
console.log('✔ Updated public/version.json');

// 3. Git commands
try {
  execSync('git add .');
  execSync(`git commit --no-verify -m "bump(version): release v${newVersion}"`);
  execSync('git push origin main');
  execSync(`git tag v${newVersion}`);
  execSync(`git push origin v${newVersion}`);
  console.log(`\n🚀 Version v${newVersion} successfully pushed and tagged! GitHub Actions is building the release.`);
} catch (error) {
  console.error('Error during git push:', error);
}
