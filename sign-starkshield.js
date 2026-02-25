// STARK SHIELD Signing Script
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// NOTE TO USER: Run this script from the root of the Starkshield-kit directory.
// It assumes the manifest and hooks are in their standard locations relative to this script.

const MANIFEST_PATH = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'starkshield', 'starkshield-manifest.json');
const STARKSHIELD_PATH = path.join(process.cwd(), 'Starkshield.md');
const SENTINEL_PATH = path.join(process.cwd(), 'starkshield-sentinel', 'handler.ts');

const h = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`ERROR: Manifest file not found at ${MANIFEST_PATH}`);
    console.error("Please create it first. A template is available as starkshield-manifest.template.json");
    process.exit(1);
}

if (!fs.existsSync(STARKSHIELD_PATH)) {
    console.error(`ERROR: Starkshield.md not found at ${STARKSHIELD_PATH}`);
    process.exit(1);
}

if (!fs.existsSync(SENTINEL_PATH)) {
    console.error(`ERROR: Sentinel hook not found at ${SENTINEL_PATH}`);
    process.exit(1);
}

const policy = fs.readFileSync(STARKSHIELD_PATH, 'utf8');
const sent = fs.readFileSync(SENTINEL_PATH, 'utf8');

let mRaw = fs.readFileSync(MANIFEST_PATH, 'utf8');
if (mRaw.charCodeAt(0) === 0xFEFF) mRaw = mRaw.slice(1);
const m = JSON.parse(mRaw);

m.integrity_hash = h(policy);
m.sentinel_hash = h(sent);
m.version = '1.4';
m.signed_at = new Date().toISOString();

const core = {
  blocked_domains: m.blocked_domains,
  canary_keywords: m.canary_keywords,
  canary_paths: m.canary_paths,
  immutable_core: m.immutable_core,
};
m.manifest_hash = h(JSON.stringify(core, Object.keys(core).sort()));

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));

console.log('Starkshield hash:  ', m.integrity_hash);
console.log('Sentinel hash:', m.sentinel_hash);
console.log('Manifest hash:', m.manifest_hash);
console.log('Signed at:    ', m.signed_at);
console.log('\n✅ STARK SHIELD v1.4 SIGNED');
console.log(`Successfully updated ${MANIFEST_PATH}`);
