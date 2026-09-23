import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const targetPath = path.resolve(ROOT_DIR, '../web/src/app/items/[slug]/ItemDetailClient.tsx');

if (!fs.existsSync(targetPath)) {
  console.error(`Target not found: ${targetPath}`);
  process.exit(1);
}

let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add SVG icon components if not present
if (!content.includes('const WindowsIcon =')) {
  const iconDefinitions = `
// Authentic Platform Icons
const WindowsIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Windows">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4h-13.051M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" />
  </svg>
);

const LinuxPenguinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Linux">
    <path d="M12.012 0c-3.518 0-4.484 2.92-4.484 5.348 0 .89.156 2.09.438 3.125-1.57.734-2.844 2.297-2.844 4.156 0 1.344.625 2.656 1.625 3.563-.375 1.5-.594 3.094-.594 4.688 0 1.25.75 2.125 1.875 2.125 1.156 0 2.219-.781 3.984-2.031 1.766 1.25 2.828 2.031 3.984 2.031 1.125 0 1.875-.875 1.875-2.125 0-1.594-.219-3.188-.594-4.688 1-.906 1.625-2.219 1.625-3.563 0-1.859-1.281-3.422-2.844-4.156.281-1.031.438-2.234.438-3.125C16.496 2.92 15.53 0 12.012 0zm-1.625 4.313c.438 0 .781.438.781.969 0 .531-.344.969-.781.969-.438 0-.813-.438-.813-.969 0-.531.375-.969.813-.969zm3.25 0c.438 0 .781.438.781.969 0 .531-.344.969-.781.969-.438 0-.813-.438-.813-.969 0-.531.375-.969.813-.969z" />
  </svg>
);

const AndroidIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Android">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.1 12 8.1s-3.5902.3116-5.1367.8497L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9974 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
  </svg>
);

const UsbIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-label="USB">
    <rect x="7" y="2" width="10" height="7" rx="1" />
    <path d="M10 2v4" />
    <path d="M14 2v4" />
    <rect x="5" y="9" width="14" height="13" rx="2" />
    <path d="M9 16h6" />
  </svg>
);
`;
  content = content.replace('export const ItemDetailPage', `${iconDefinitions}\nexport const ItemDetailPage`);
}

// 2. Update getPlatformMeta to use the authentic icons
const oldPlatformMeta = `  const getPlatformMeta = (file: ReleaseFile) => {
    const fn = file.filename.toLowerCase();
    const fid = file.id.toLowerCase();
    if (file.platform === 'android' || file.file_type === 'apk' || fn.endsWith('.apk')) {
      return { name: 'Android', icon: Tv, ext: '.apk' };
    }
    if (file.platform === 'linux' || fn.endsWith('.appimage') || fn.endsWith('.deb')) {
      return { name: 'Linux', icon: Terminal, ext: '.AppImage' };
    }
    if (fid.includes('usb') || fn.includes('usb')) {
      return { name: 'Zero Install (USB)', icon: HardDrive, ext: '.zip' };
    }
    if (fid.includes('pack') || fn.includes('pack')) {
      return { name: 'Course Content', icon: Package, ext: '.zip' };
    }
    return { name: 'Windows', icon: Laptop, ext: '.exe' };
  };`;

const newPlatformMeta = `  const getPlatformMeta = (file: ReleaseFile) => {
    const fn = file.filename.toLowerCase();
    const fid = file.id.toLowerCase();
    if (file.platform === 'android' || file.file_type === 'apk' || fn.endsWith('.apk')) {
      return { name: 'Android', icon: AndroidIcon, ext: '.apk' };
    }
    if (file.platform === 'linux' || fn.endsWith('.appimage') || fn.endsWith('.deb')) {
      return { name: 'Linux', icon: LinuxPenguinIcon, ext: '.AppImage' };
    }
    if (fid.includes('usb') || fn.includes('usb')) {
      return { name: 'USB Portable', icon: UsbIcon, ext: '.zip' };
    }
    if (fid.includes('pack') || fn.includes('pack')) {
      return { name: 'Course Content', icon: Package, ext: '.zip' };
    }
    return { name: 'Windows', icon: WindowsIcon, ext: '.exe' };
  };`;

if (content.includes(oldPlatformMeta)) {
  content = content.replace(oldPlatformMeta, newPlatformMeta);
} else {
  // Try matching more loosely
  content = content.replace(/const getPlatformMeta = \(file: ReleaseFile\) => \{[\s\S]*?return \{ name: 'Windows', icon: [^,]+, ext: '\.exe' \};\s*\};/, newPlatformMeta.trim());
}

// 3. Fix double 'vv' in version badge
content = content.replace(
  /v\{latestRelease\.version_tag\}/g,
  "{latestRelease.version_tag.startsWith('v') ? latestRelease.version_tag : `v${latestRelease.version_tag}`}"
);

// 4. Update the hero meta row: replace device text and online/offline with platform icons and size only
const oldHeroMeta = `          {/* Quiet meta row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="font-medium text-zinc-700">{targetOs}</span>
            {primaryDownload && (
              <>
                <span>•</span>
                <span className="font-mono">{formatBytes(primaryDownload.size_bytes)}</span>
              </>
            )}
            <span>•</span>
            <span>{runtimeMode}</span>
          </div>`;

const newHeroMeta = `          {/* Device icons & size (clean minimal row) */}
          <div className="flex items-center gap-2.5 text-xs text-zinc-500">
            <div className="flex items-center gap-2 text-zinc-600 bg-zinc-100/90 border border-zinc-200/60 px-2 py-1 rounded-lg">
              <span title="Windows" className="hover:text-zinc-900 transition-colors"><WindowsIcon className="w-3.5 h-3.5" /></span>
              <span title="Android" className="hover:text-zinc-900 transition-colors"><AndroidIcon className="w-3.5 h-3.5" /></span>
              <span title="Linux" className="hover:text-zinc-900 transition-colors"><LinuxPenguinIcon className="w-3.5 h-3.5" /></span>
              <span title="USB Portable" className="hover:text-zinc-900 transition-colors"><UsbIcon className="w-3.5 h-3.5" /></span>
            </div>
            {primaryDownload && (
              <>
                <span className="text-zinc-300">•</span>
                <span className="font-mono font-medium text-zinc-700">{formatBytes(primaryDownload.size_bytes)}</span>
              </>
            )}
          </div>`;

if (content.includes(oldHeroMeta)) {
  content = content.replace(oldHeroMeta, newHeroMeta);
} else {
  // Regex replacement
  content = content.replace(
    /\{\/\* Quiet meta row \*\/\}[\s\S]*?<span>\{runtimeMode\}<\/span>\s*<\/div>/,
    newHeroMeta.trim()
  );
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✔ Successfully updated ItemDetailClient.tsx with authentic platform icons and minimal device-icon size header!');
