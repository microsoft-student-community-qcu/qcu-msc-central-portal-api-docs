/**
 * Syncs the `docs/` tree from the backend repository into this site.
 *
 * The backend repo (microsoft-student-community-qcu/qcu-msc-central-portal-backend)
 * is the single source of truth for API documentation. This script pulls the
 * latest `docs/` folder from its default branch so the frontend team always
 * reads current docs without manual copying.
 *
 * Runs automatically before `npm start` and `npm run build` (see package.json),
 * and in CI via `.github/workflows/deploy.yml`.
 *
 * Requires: git on PATH and network access to github.com (the backend repo is public).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKEND_REPO = 'https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal-backend.git';
const BACKEND_DOCS_DIR = 'docs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const localDocsDir = path.join(repoRoot, 'docs');

// Folders synced from the backend docs tree. Kept local files (intro.md) untouched.
const SYNCED_SUBFOLDERS = ['api', 'guides', 'specs'];

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'pipe', env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
}

function git(args, cwd) {
  run('git', args, cwd);
}

function main() {
  const workDir = path.join(tmpdir(), `qcu-api-docs-sync-${process.pid}`);
  mkdirSync(workDir, { recursive: true });

  try {
    console.log('[sync-docs] Cloning backend docs (sparse)...');
    git(['clone', '--depth', '1', '--filter=blob:none', '--sparse', '--single-branch', BACKEND_REPO, workDir]);
    git(['sparse-checkout', 'set', BACKEND_DOCS_DIR], workDir);

    const sourceDocsDir = path.join(workDir, BACKEND_DOCS_DIR);
    if (!existsSync(sourceDocsDir)) {
      throw new Error(`Backend repo has no "${BACKEND_DOCS_DIR}" folder to sync.`);
    }

    for (const sub of SYNCED_SUBFOLDERS) {
      const source = path.join(sourceDocsDir, sub);
      const target = path.join(localDocsDir, sub);

      rmSync(target, { recursive: true, force: true });

      if (!existsSync(source)) {
        console.log(`[sync-docs] Skipping ${sub} (not present upstream)`);
        continue;
      }

      mkdirSync(path.dirname(target), { recursive: true });
      cpSync(source, target, { recursive: true });

      const count = countFiles(target);
      console.log(`[sync-docs] Synced ${sub}/ (${count} files)`);
    }

    applyPatches();

    console.log('[sync-docs] Done.');
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

/**
 * Patches known upstream markdown quirks that break Docusaurus/MDX rendering.
 * These compensate for bugs in the backend repo's docs; once upstream is fixed,
 * the corresponding patch no longer matches and the script fails loudly so the
 * patch can be removed.
 *
 * Patch format: [relativePath, search, replacement]
 */
const PATCHES = [
  // {event title} inside table cells is parsed by MDX as a JS expression.
  // Backtick it so it renders as literal text.
  [
    path.join('guides', 'workflows', 'email-notifications.md'),
    '| Guest event registration (auto-approved) | `sendRegistrationConfirmedEmail` | Registration Confirmed — {event title} | Guest email |',
    '| Guest event registration (auto-approved) | `sendRegistrationConfirmedEmail` | Registration Confirmed — `{event title}` | Guest email |',
  ],
  [
    path.join('guides', 'workflows', 'email-notifications.md'),
    '| Guest event registration (manual review) | `sendRegistrationPendingReviewEmail` | Registration Pending Review — {event title} | Guest email |',
    '| Guest event registration (manual review) | `sendRegistrationPendingReviewEmail` | Registration Pending Review — `{event title}` | Guest email |',
  ],
  [
    path.join('guides', 'workflows', 'email-notifications.md'),
    '| Registration approved (by admin) | `sendRegistrationApprovedEmail` | Registration Approved — {event title} | Registrant email |',
    '| Registration approved (by admin) | `sendRegistrationApprovedEmail` | Registration Approved — `{event title}` | Registrant email |',
  ],
  [
    path.join('guides', 'workflows', 'email-notifications.md'),
    '| Registration rejected (by admin) | `sendRegistrationRejectedEmail` | Registration Rejected — {event title} | Registrant email |',
    '| Registration rejected (by admin) | `sendRegistrationRejectedEmail` | Registration Rejected — `{event title}` | Registrant email |',
  ],
  // Broken relative link in users.md: docs/api/v1 -> docs/guides requires "../..".
  [
    path.join('api', 'v1', 'users.md'),
    '../guides/workflows/auth-workflow.md#applicant-account-activation-flow',
    '../../guides/workflows/auth-workflow.md#applicant-account-activation-flow',
  ],
];

function applyPatches() {
  for (const [relative, search, replacement] of PATCHES) {
    const file = path.join(localDocsDir, relative);

    if (!existsSync(file)) {
      console.warn(`[sync-docs] Patch target missing (upstream removed it?): ${relative}`);
      continue;
    }

    const content = readFileSync(file, 'utf8');

    if (!content.includes(search)) {
      throw new Error(
        `[sync-docs] Patch no longer matches in ${relative}. ` +
          'Upstream docs changed — update or remove this patch in scripts/sync-docs.mjs.',
      );
    }

    writeFileSync(file, content.replace(search, replacement));
  }

  console.log(`[sync-docs] Applied ${PATCHES.length} patches.`);
}

function countFiles(dir) {
  let count = 0;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      count += countFiles(full);
    } else {
      count += 1;
    }
  }
  return count;
}

main();
