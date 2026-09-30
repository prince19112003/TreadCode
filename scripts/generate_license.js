import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { createSecureOfflineLicense, verifySecureOfflineLicense } from '../src/shared/utils/licenseCrypto.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function generateRandomKey(tier = 'ULTIMATE') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `TC-${tier.toUpperCase()}-${rand}-${year}`;
}

function calculateExpiry(days) {
  if (days === 'lifetime' || !days || Number(days) >= 25000) {
    return '2099-12-31T23:59:59.000Z';
  }
  const d = new Date();
  d.setDate(d.getDate() + Number(days));
  return d.toISOString();
}

async function main() {
  const args = process.argv.slice(2);
  let key = '';
  let tier = 'Ultimate';
  let holder = 'Institutional Client';
  let organization = '';
  let description = 'Offline Laboratory License (Full Pass)';
  let days = 'lifetime';
  let boundHwid = '';
  let outputFile = './license.json';

  // Parse CLI args: --key, --tier, --holder, --org, --desc, --days, --hwid, --output
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--key' && args[i + 1]) key = args[++i];
    else if (args[i] === '--tier' && args[i + 1]) tier = args[++i];
    else if (args[i] === '--holder' && args[i + 1]) holder = args[++i];
    else if (args[i] === '--org' && args[i + 1]) organization = args[++i];
    else if (args[i] === '--desc' && args[i + 1]) description = args[++i];
    else if (args[i] === '--days' && args[i + 1]) days = args[++i];
    else if (args[i] === '--hwid' && args[i + 1]) boundHwid = args[++i];
    else if (args[i] === '--output' && args[i + 1]) outputFile = args[++i];
  }

  // Interactive mode if no key passed
  if (!key) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const ask = (q, def) =>
      new Promise((resolve) => {
        rl.question(`${q} [${def}]: `, (ans) => resolve(ans.trim() || def));
      });

    console.log('========================================================================');
    console.log('     TREADCODE CRYPTOGRAPHIC OFFLINE LICENSE GENERATOR (ADMIN)          ');
    console.log('========================================================================');
    console.log('Generating tamper-proof offline licenses for air-gapped / lab systems.\n');

    tier = await ask('1. Select Tier (Ultimate / Enterprise / Professional)', 'Ultimate');
    const autoKey = generateRandomKey(tier);
    key = await ask('2. Enter License Key (or press Enter for auto-gen)', autoKey);
    holder = await ask('3. Client / School / Institution Name', 'Delhi Public School');
    organization = await ask('4. Department / Organization Name', holder);
    description = await ask('5. License Description / Notes', 'Offline Computer Lab License (50 Units)');
    days = await ask('6. Validity in Days (30, 90, 180, 365, or lifetime)', 'lifetime');
    boundHwid = await ask('7. Hardware Lock HWID (Optional - leave blank for all lab PCs)', '');
    outputFile = await ask('8. Output File Path', './license.json');
    rl.close();
  }

  const expiresAt = calculateExpiry(days);

  // Generate cryptographically signed, encrypted offline license file
  const secureLicense = createSecureOfflineLicense({
    licenseKey: key,
    tier: tier,
    holderName: holder,
    organization: organization || holder,
    description: description,
    expiresAt: expiresAt,
    boundHwid: boundHwid || null,
  });

  // Verify certificate immediately to ensure cryptographic validity
  const verification = verifySecureOfflineLicense(secureLicense);
  if (!verification.isValid) {
    throw new Error(`Self-check verification failed: ${verification.error}`);
  }

  const resolvedOut = path.resolve(process.cwd(), outputFile);
  fs.writeFileSync(resolvedOut, JSON.stringify(secureLicense, null, 2), 'utf8');

  console.log('\n========================================================================');
  console.log('✔ CRYPTOGRAPHIC OFFLINE LICENSE GENERATED & VERIFIED!');
  console.log('========================================================================');
  console.log(` File Path   : ${resolvedOut}`);
  console.log(` License Key : ${secureLicense.licenseKey}`);
  console.log(` Tier        : ${secureLicense.tier}`);
  console.log(` Client/Org  : ${secureLicense.holderName} (${secureLicense.organization})`);
  console.log(` Expires At  : ${secureLicense.expiresAt}`);
  console.log(` Security    : ${secureLicense.security.algorithm} (Tamper-Proof)`);
  console.log(` Signature   : ${secureLicense.security.integritySignature.substring(0, 24)}...`);
  console.log('========================================================================');
  console.log('👉 CLIENT DELIVERY INSTRUCTIONS:');
  console.log('   Simply deliver this "license.json" file to the client.');
  console.log('   The client replaces the default "license.json" in their TreadCode folder.');
  console.log('   TreadCode will auto-activate without requiring ANY network or internet access.\n');
}

main().catch((err) => {
  console.error('Generator error:', err);
  process.exit(1);
});
