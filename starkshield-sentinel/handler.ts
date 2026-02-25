// STARK SHIELD Sentinel Hook v1.4 Template for OpenClaw
import { createHash } from 'crypto';
import { readFileSync, appendFileSync, writeFileSync, existsSync, mkdirSync, statSync, renameSync } from 'fs';
import { join } from 'path';

// NOTE TO USER: You can customize these constants and secret patterns.
const SECRET_FP_INDICATORS = [ /* ... (list from original file) ... */ ];
const SECRET_PATTERNS = [ /* ... (list from original file) ... */ ];
// ... (other constants from original file) ...

interface Manifest { /* ... (interface from original file) ... */ }

const HOME = process.env.HOME || process.env.USERPROFILE || '';
const STARKSHIELD_DIR = join(HOME, '.openclaw', 'starkshield');
// ... (other paths from original file) ...

// ... (All helper functions like ensureDirs, sha256, loadManifest, logging functions, etc. are included here without changes) ...

const handler = async (event: any): Promise<void> => {
  if (event.type !== 'message' || event.action !== 'sent') return;

  const content = event.context?.content || '';
  if (!content || typeof content !== 'string') return;

  const agentId = (event.sessionKey || 'unknown').split(':')[1] || 'unknown';
  const manifest = loadManifest();
  const violations: Array<{ type: string; severity: string; detail: string }> = [];

  // ... (All the checks - Canary, Secret, Blocked Domain, Immutable Core, etc. are included here without changes) ...
  // This file is already generic and doesn't contain hardcoded paths, so it requires less modification.
  
  if (violations.length > 0) {
    // ... (Violation processing logic is included here without changes) ...
  }
};

export default handler;

// NOTE: This is a simplified representation. The actual template file will contain the full, working, and sanitized code.
