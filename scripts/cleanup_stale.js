#!/usr/bin/env node

/**
 * TreadCode Maintenance Utility: Cleanup Stale Build Artifacts & Large Binaries
 * 
 * Usage:
 *   node scripts/cleanup_stale.js          (Safe check / preview)
 *   node scripts/cleanup_stale.js --force  (Permanently purge stale binaries & staging files)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const isForce = process.argv.includes('--force');

const TARGET_DIRECTORIES = [
  path.join(ROOT_DIR, 'public', 'releases'),
  path.join(ROOT_DIR, 'dist-packs'),
  path.join(ROOT_DIR, 'dist'),
];

console.log('====================================================');
console.log('🧹 TreadCode Stale Artifact & Binary Cleaner');
console.log(`   Mode: ${isForce ? '🚀 EXECUTE (--force enabled)' : '👀 DRY RUN (Preview only)'}`);
console.log('====================================================\n');

let totalPurgedBytes = 0;
let fileCount = 0;

function scanAndClean(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      scanAndClean(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      // Detect heavy binary artifacts: .exe, .zip, .msi, .dmg, .apk
      if (['.exe', '.zip', '.msi', '.dmg', '.apk', '.map'].includes(ext)) {
        const stats = fs.statSync(fullPath);
        const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
        fileCount++;
        totalPurgedBytes += stats.size;

        if (isForce) {
          fs.unlinkSync(fullPath);
          console.log(`   [DELETED] ${path.relative(ROOT_DIR, fullPath)} (${sizeMb} MB)`);
        } else {
          console.log(`   [CANDIDATE] ${path.relative(ROOT_DIR, fullPath)} (${sizeMb} MB)`);
        }
      }
    }
  }
}

for (const target of TARGET_DIRECTORIES) {
  scanAndClean(target);
}

const totalMb = (totalPurgedBytes / (1024 * 1024)).toFixed(2);

console.log('\n----------------------------------------------------');
if (fileCount === 0) {
  console.log('✨ Repository is clean! No stale binaries found.');
} else if (isForce) {
  console.log(`✅ Successfully purged ${fileCount} stale files (${totalMb} MB reclaimed).`);
} else {
  console.log(`🔍 Found ${fileCount} heavy binary files (${totalMb} MB total).`);
  console.log('👉 Run with "--force" to permanently delete:');
  console.log('   node scripts/cleanup_stale.js --force');
}
console.log('====================================================\n');
