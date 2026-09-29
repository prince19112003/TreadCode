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
  const usbUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode-USB-Portable.zip`;
  const packsUrl = `/releases/TreadCode_Packs_Offline_v${version}.zip`;

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

  // 5. Update USB Portable filename, URL, size and availability
  content = content.replace(
    /(id:\s*'file-tc-usb-portable'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${usbUrl}'`
  );
  content = content.replace(
    /(id:\s*'file-tc-usb-portable'[\s\S]*?)size_bytes:\s*\d+/,
    `$1size_bytes: 31112575`
  );
  content = content.replace(
    /display_name:\s*'USB Portable'/,
    "display_name: 'Zero Install (USB)'"
  );

  // 6. Ensure Master Distribution Package entry exists in TREADCODE_RELEASES[0].files
  const masterUrl = `https://github.com/prince19112003/TreadCode/releases/download/v${version}/TreadCode_Master_Package_v${version}.zip`;
  const masterFileEntry = `      {
        id: 'file-tc-master-bundle',
        release_id: 'rel-treadcode-${major || 1}-${minor || 0}-${patch || 8}',
        filename: 'TreadCode_Master_Package_v${version}.zip',
        display_name: 'Master Distribution Package',
        file_type: 'zip',
        platform: 'cross-platform',
        download_url: '${masterUrl}',
        size_bytes: 136112809,
        checksum_sha256: null,
        download_count: 0,
        sort_order: 5,
        created_at: '2026-08-13T20:02:42Z',
      },`;

  if (!content.includes('file-tc-master-bundle')) {
    // Insert before file-tc-packs-bundle
    content = content.replace(
      /(\s*\{\s*id:\s*'file-tc-packs-bundle')/,
      `\n${masterFileEntry}\n$1`
    );
    // adjust packs sort_order to 6
    content = content.replace(
      /(id:\s*'file-tc-packs-bundle'[\s\S]*?)sort_order:\s*\d+/,
      '$1sort_order: 6'
    );
  } else {
    // Update existing master bundle URL, filename, and exact size
    content = content.replace(
      /(id:\s*'file-tc-master-bundle'[\s\S]*?)filename:\s*'[^']+'/,
      `$1filename: 'TreadCode_Master_Package_v${version}.zip'`
    );
    content = content.replace(
      /(id:\s*'file-tc-master-bundle'[\s\S]*?)download_url:\s*'[^']+'/,
      `$1download_url: '${masterUrl}'`
    );
    content = content.replace(
      /(id:\s*'file-tc-master-bundle'[\s\S]*?)size_bytes:\s*\d+/,
      `$1size_bytes: 136112809`
    );
  }

  // 7. Update offline extension packs archive filename, URL, size and availability
  content = content.replace(
    /filename:\s*'TreadCode_Packs_Offline_[^']+\.zip'/,
    `filename: 'TreadCode_Packs_Offline_v${version}.zip'`
  );
  content = content.replace(
    /(id:\s*'file-tc-packs-bundle'[\s\S]*?)download_url:\s*'[^']+'/,
    `$1download_url: '${packsUrl}'`
  );
  content = content.replace(
    /(id:\s*'file-tc-packs-bundle'[\s\S]*?)size_bytes:\s*\d+/,
    `$1size_bytes: 85254`
  );

  content = content.replace(
    /(id:\s*'file-tc-android-apk'[\s\S]*?)size_bytes:\s*\d+/,
    `$1size_bytes: 8844798`
  );
  content = content.replace(
    /(id:\s*'file-tc-linux-appimage'[\s\S]*?)size_bytes:\s*\d+/,
    `$1size_bytes: 83038208`
  );

  // Ensure all release download buttons are fully active
  content = content.replace(/\s+is_available:\s*false,/g, '');

  // 8. Update platforms section in description with genuine, simple description
  const cleanFormatsDesc = `## Distribution Formats

TreadCode is available in several formats depending on where you need to run it:

- **Windows**: Native installer (.exe) for Windows 10 and 11.
- **Android**: APK package formatted for touch displays, interactive smart boards, and tablets.
- **Linux**: Standalone AppImage that runs on standard Linux distributions without requiring administrator privileges.
- **Zero Install (USB)**: A self-contained zip archive that can be extracted to a USB flash drive and launched without installation.
- **Master Distribution Package**: Comprehensive all-in-one archive containing all platform binaries (.exe, .apk, .AppImage), the portable USB engine, offline course packs, and a customizable 'license.json' configuration file for offline institutional activation.`;

  if (content.includes('## Platforms')) {
    content = content.replace(/## Platforms[\s\S]*?(?=\n  publisher:)/, `${cleanFormatsDesc}\`,`);
  } else if (content.includes('## Distribution Formats')) {
    content = content.replace(/## Distribution Formats[\s\S]*?(?=\n  publisher:)/, `${cleanFormatsDesc}\`,`);
  }

  // Ensure demo_url is present and github_repo is strictly null
  if (!content.includes("demo_url: 'https://tread-code-smoky.vercel.app'")) {
    content = content.replace(
      /license:\s*'[^']+',/,
      "license: 'Starter Edition (Free Forever) • Developer & Ultimate Available',\n  demo_url: 'https://tread-code-smoky.vercel.app',"
    );
  }
  content = content.replace(/github_repo:\s*[^,\n]+/, 'github_repo: null');

  fs.writeFileSync(webCataloguePath, content, 'utf8');
  console.log(`✔ [SYNC] Store Catalogue (${webCataloguePath}) successfully synchronized to v${version}!`);

  // Update types/index.ts to support is_available
  const typesPath = path.resolve(path.dirname(webCataloguePath), '../types/index.ts');
  if (fs.existsSync(typesPath)) {
    let typesContent = fs.readFileSync(typesPath, 'utf8');
    if (!typesContent.includes('is_available?: boolean;')) {
      typesContent = typesContent.replace(
        '  created_at: string;\n}',
        '  created_at: string;\n  is_available?: boolean;\n}'
      );
      fs.writeFileSync(typesPath, typesContent, 'utf8');
      console.log(`✔ [SYNC] Added is_available to types/index.ts!`);
    }
  }

  // 9. Update ItemDetailClient.tsx if found
  const itemDetailClientPath = path.resolve(path.dirname(webCataloguePath), '../app/items/[slug]/ItemDetailClient.tsx');
  if (fs.existsSync(itemDetailClientPath)) {
    let clientContent = fs.readFileSync(itemDetailClientPath, 'utf8');
    
    // Update getPlatformMeta
    if (!clientContent.includes("name: 'Master Distribution Package'")) {
      clientContent = clientContent.replace(
        /if \(fid\.includes\('usb'\) \|\| fn\.includes\('usb'\)\) \{[\s\S]*?return \{ name: 'USB Portable', icon: UsbIcon, ext: '\.zip' \};\s*\}/,
        `if (fid.includes('master') || fn.includes('master')) {
      return { name: 'Master Distribution Package', icon: HardDrive, ext: '.zip' };
    }
    if (fid.includes('usb') || fn.includes('usb')) {
      return { name: 'Zero Install (USB)', icon: UsbIcon, ext: '.zip' };
    }`
      );
    }

    // Add Master Distribution Package callout if not present
    if (!clientContent.includes('Master Distribution Package Highlight')) {
      const masterCallout = `
            {/* Master Distribution Package Highlight */}
            {files.some((f) => f.id.includes('master') || f.filename.toLowerCase().includes('master')) && (
              <div className="mt-4 rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 text-xs">Master Distribution Package</span>
                    <span className="text-[10px] bg-zinc-200 text-zinc-700 font-medium px-1.5 py-0.5 rounded">All Platforms & Offline USB</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Complete standalone bundle for educational institutions and multi-device labs. Includes Windows installer, Android APK, Linux standalone, portable USB engine with auto-fullscreen, and customizable <code className="text-zinc-700 bg-zinc-100 px-1 py-0.5 rounded text-[11px] font-mono">license.json</code> for offline activation.
                  </p>
                </div>
                {(() => {
                  const masterFile = files.find((f) => f.id.includes('master') || f.filename.toLowerCase().includes('master'));
                  if (!masterFile) return null;
                  return (
                    <a
                      href={masterFile.download_url}
                      download={masterFile.filename}
                      target={masterFile.download_url.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shrink-0 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Master Package</span>
                    </a>
                  );
                })()}
              </div>
            )}
`;
      clientContent = clientContent.replace(
        /(\s*\{\/\* Quiet Checksum verification note \*\/)/,
        `${masterCallout}$1`
      );
    }

    fs.writeFileSync(itemDetailClientPath, clientContent, 'utf8');
    console.log(`✔ [SYNC] ItemDetailClient Master Distribution Package callout & platform meta updated!`);
  }

  return true;
}

// Allow direct CLI execution: node scripts/sync_store_catalogue.js [optional_version]
if (process.argv[1] && process.argv[1].endsWith('sync_store_catalogue.js')) {
  const argVer = process.argv[2];
  syncStoreCatalogue(argVer);
}
