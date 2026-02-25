// STARK SHIELD Enforcement Hook v1.4 Template for OpenClaw
import { createHash } from 'crypto';
import { readFileSync, appendFileSync, writeFileSync, existsSync, mkdirSync, statSync, renameSync } from 'fs';
import { join } from 'path';

// NOTE TO USER: You can customize these constants.
const QUIET_HOURS_START = 23;
const QUIET_HOURS_END = 8;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB rotation
// ... (other constants from original file) ...

interface BootstrapFile { path: string; content: string; }
interface Manifest { /* ... (interface from original file) ... */ }

const HOME = process.env.HOME || process.env.USERPROFILE || '';
const STARKSHIELD_DIR = join(HOME, '.openclaw', 'starkshield');
const HOOKS_DIR = join(HOME, '.openclaw', 'hooks');
const MANIFEST_PATH = join(STARKSHIELD_DIR, 'starkshield-manifest.json');
// ... (other paths from original file) ...

// ... (All helper functions like ensureDirs, sha256, loadManifest, etc. are included here without changes) ...

const handler = async (event: any): Promise<void> => {
  if (event.type !== 'agent' || event.action !== 'bootstrap') return;

  ensureDirs();

  const workspace = event.context?.workspace || event.context?.workspacePath || '';
  const now = new Date().toISOString();

  // ... (Maintenance functions like rotateIfNeeded, pruneExpiredAntibodies are included here) ...

  // === Locate Starkshield.md ===
  let starkshieldContent = '';
  let starkshieldPath = '';
  // This automatically finds the Starkshield.md file in the agent's workspace.
  const starkshieldFilePath = workspace ? join(workspace, 'Starkshield.md') : '';

  if (starkshieldFilePath && existsSync(starkshieldFilePath)) {
      starkshieldContent = readFileSync(starkshieldFilePath, 'utf8');
      starkshieldPath = starkshieldFilePath;
  }

  if (!starkshieldContent) {
    // ... (logic for when Starkshield.md is not found) ...
    return;
  }

  // ... (The rest of the file - Integrity Verification, Hard Abort, Sentinel Check, Context Building - is included here without major changes) ...
  // The only change is ensuring all hardcoded paths are removed and it relies on the dynamic `workspace` variable.
  // I will also genericize the final `contextBlock` message.

  const contextBlock = [
    '# 🛡️ STARK SHIELD — ACTIVE', '',
    // ... (generic status lines) ...
    'Full policy: workspace `Starkshield.md`',
  ].filter(Boolean).join('\n');
  
  // ... (final push to bootstrapFiles) ...
};

export default handler;

// NOTE: This is a simplified representation. The actual template file will contain the full, working, and sanitized code.
