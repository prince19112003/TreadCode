import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export function syncStoreCatalogue(customVersion) {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = customVersion || pkg.version;

  // Possible locations for the store website
  const possibleWebPaths = [
    path.resolve(ROOT_DIR, '../web'),
    'C:/Users/princ/Desktop/web'
  ];

  let webCataloguePath = null;
  for (const p of possibleWebPaths) {
    const target = path.join(p, 'src/lib/catalogueData.ts');
    if (fs.existsSync(target)) {
      webCataloguePath = target;
      break;
    }
  }

  if (!webCataloguePath) {
    console.warn('[SYNC] Store website directory (web/src/lib/catalogueData.ts) not found. Skipping store sync.');
    return false;
  }

  console.log(`[SYNC] Synchronizing Store Catalogue with TreadCode v${version}...`);

  let content = fs.readFileSync(webCataloguePath, 'utf8');
  const [major, minor, patch] = version.split('.').map(Number);
  const exeUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_${version}_x64-setup.exe`;
  const packsUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_Packs_Offline_v${version}.zip`;

  // 1. Update version tags and semver
  content = content.replace(/version_tag:\s*'v[^']+'/, `version_tag: 'v${version}'`);
  content = content.replace(/semver_major:\s*\d+/, `semver_major: ${major || 1}`);
  content = content.replace(/semver_minor:\s*\d+/, `semver_minor: ${minor || 0}`);
  content = content.replace(/semver_patch:\s*\d+/, `semver_patch: ${patch || 0}`);
  content = content.replace(/title:\s*'TreadCode v[^—]+— Native Desktop Release'/, `title: 'TreadCode v${version} — Native Desktop Release'`);

  // 2. Update Windows installer setup filename and URL
  content = content.replace(
    /filename:\s*'TreadCode_[^']+_x64-setup\.exe'/,
    `filename: 'TreadCode_${version}_x64-setup.exe'`
  );
  content = content.replace(
    /display_name:\s*'TreadCode v[^']+\(Windows x64 Setup\)'/,
    `display_name: 'TreadCode v${version} (Windows x64 Setup)'`
  );
  content = content.replace(
    /download_url:\s*'https:\/\/github\.com\/prince19112003\/TreadCode\/releases\/download\/v[^\/]+\/TreadCode_[^']+_x64-setup\.exe'/,
    `download_url: '${exeUrl}'`
  );

  // 3. Update offline extension packs archive filename and URL
  content = content.replace(
    /filename:\s*'TreadCode_Packs_Offline_[^']+\.zip'/,
    `filename: 'TreadCode_Packs_Offline_v${version}.zip'`
  );
  content = content.replace(
    /download_url:\s*'https:\/\/github\.com\/prince19112003\/TreadCode\/releases\/download\/v[^\/]+\/TreadCode_Packs_Offline_[^']+\.zip'/,
    `download_url: '${packsUrl}'`
  );

  // 4. Ensure demo_url is present and github_repo is strictly null
  if (!content.includes("demo_url: 'https://tread-code-smoky.vercel.app'")) {
    content = content.replace(
      /license:\s*'[^']+',/,
      "license: 'Starter Edition (Free Forever) • Developer & Ultimate Available',\n  demo_url: 'https://tread-code-smoky.vercel.app',"
    );
  }
  content = content.replace(/github_repo:\s*[^,\n]+/, 'github_repo: null');

  fs.writeFileSync(webCataloguePath, content, 'utf8');
  console.log(`✔ [SYNC] Store Catalogue (${webCataloguePath}) successfully synchronized to v${version}!`);
  return true;
}

// Allow direct CLI execution: node scripts/sync_store_catalogue.js [optional_version]
if (process.argv[1] && process.argv[1].endsWith('sync_store_catalogue.js')) {
  const argVer = process.argv[2];
  syncStoreCatalogue(argVer);
}
