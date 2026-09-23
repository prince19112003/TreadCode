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
  const apkUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_${version}.apk`;
  const appimageUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_${version}_amd64.AppImage`;
  const usbUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_USB_Portable.zip`;
  const packsUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_Packs_Offline_v${version}.zip`;

  // 1. Update version tags and semver
  content = content.replace(/version_tag:\s*'v[^']+'/, `version_tag: 'v${version}'`);
  content = content.replace(/semver_major:\s*\d+/, `semver_major: ${major || 1}`);
  content = content.replace(/semver_minor:\s*\d+/, `semver_minor: ${minor || 0}`);
  content = content.replace(/semver_patch:\s*\d+/, `semver_patch: ${patch || 0}`);
  content = content.replace(/title:\s*'TreadCode v[^—]+— Native Desktop Release'/, `title: 'TreadCode v${version} — Multi-Platform Release'`);

  // 2. Update Windows installer setup filename and URL
  content = content.replace(
    /filename:\s*'TreadCode_[^']+_x64-setup\.exe'/,
    `filename: 'TreadCode_${version}_x64-setup.exe'`
  );
  content = content.replace(
    /(id:\s*'file-tc-win-exe'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${exeUrl}'`
  );

  // 3. Update Android Smart Board APK filename and URL
  content = content.replace(
    /filename:\s*'TreadCode_[^']+\.apk'/,
    `filename: 'TreadCode_${version}.apk'`
  );
  content = content.replace(
    /(id:\s*'file-tc-android-apk'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${apkUrl}'`
  );

  // 4. Update Linux AppImage filename and URL
  content = content.replace(
    /filename:\s*'TreadCode_[^']+_amd64\.AppImage'/,
    `filename: 'TreadCode_${version}_amd64.AppImage'`
  );
  content = content.replace(
    /(id:\s*'file-tc-linux-appimage'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${appimageUrl}'`
  );

  // 5. Update USB Portable filename and URL
  content = content.replace(
    /(id:\s*'file-tc-usb-portable'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${usbUrl}'`
  );
  content = content.replace(
    /display_name:\s*'USB Portable'/,
    "display_name: 'Zero Install (USB)'"
  );

  // 6. Update offline extension packs archive filename and URL
  content = content.replace(
    /filename:\s*'TreadCode_Packs_Offline_[^']+\.zip'/,
    `filename: 'TreadCode_Packs_Offline_v${version}.zip'`
  );
  content = content.replace(
    /(id:\s*'file-tc-packs-bundle'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${packsUrl}'`
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

  // 7. Update ItemDetailClient.tsx if found
  const itemDetailClientPath = path.resolve(path.dirname(webCataloguePath), '../app/items/[slug]/ItemDetailClient.tsx');
  if (fs.existsSync(itemDetailClientPath)) {
    let clientContent = fs.readFileSync(itemDetailClientPath, 'utf8');
    clientContent = clientContent.replace(
      "return { name: 'USB Portable', icon: HardDrive, ext: '.zip' };",
      "return { name: 'Zero Install (USB)', icon: HardDrive, ext: '.zip' };"
    );
    fs.writeFileSync(itemDetailClientPath, clientContent, 'utf8');
    console.log(`✔ [SYNC] ItemDetailClient updated with 'Zero Install (USB)'!`);
  }

  return true;
}

// Allow direct CLI execution: node scripts/sync_store_catalogue.js [optional_version]
if (process.argv[1] && process.argv[1].endsWith('sync_store_catalogue.js')) {
  const argVer = process.argv[2];
  syncStoreCatalogue(argVer);
}
