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
    applyFrontmatter();

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
  // Upstream still lists the old placeholder Resend sender; the real domain is
  // no-reply@msc-qcu.tech (see backend email.service.ts).
  [
    path.join('guides', 'workflows', 'email-notifications.md'),
    '| `RESEND_FROM_EMAIL` | No | `no-reply@anonimi.cloud` | Verified Resend sender address |',
    '| `RESEND_FROM_EMAIL` | No | `no-reply@msc-qcu.tech` | Verified Resend sender address |',
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

/**
 * Curated titles/order for the docs site sidebar. Upstream files keep their
 * folder names (which would otherwise leak into the sidebar as labels like
 * "README" or H1-derived "Workflow — User Authentication"). This map injects
 * clean frontmatter after sync so the docs site presents a real IA while the
 * backend repo stays the source of truth for content.
 *
 * When upstream adds a new file, add it here or the sidebar (sidebars.ts)
 * must reference it explicitly — missing entries fall back to H1 titles.
 */
const FRONTMATTER = {
  [path.join('api', 'README.md')]: { title: 'API Reference Overview', sidebar_position: 1 },
  [path.join('api', 'versioning.md')]: { title: 'Versioning', sidebar_position: 3 },
  [path.join('api', 'deprecation-template.md')]: { title: 'Deprecation Policy', sidebar_position: 4 },
  [path.join('api', 'v2', 'README.md')]: { title: 'v2 (Next)', sidebar_position: 1 },

  [path.join('guides', 'workflows.md')]: { title: 'Core Workflows', sidebar_position: 1 },
  [path.join('guides', 'workflows', 'applicant-tracking.md')]: { title: 'Applicant Pipeline', sidebar_position: 2 },
  [path.join('guides', 'workflows', 'auth-workflow.md')]: { title: 'Authentication', sidebar_position: 3 },
  [path.join('guides', 'workflows', 'rbac.md')]: { title: 'RBAC & Authorization', sidebar_position: 4 },
  [path.join('guides', 'workflows', 'event-management.md')]: { title: 'Event Management', sidebar_position: 5 },
  [path.join('guides', 'workflows', 'email-notifications.md')]: { title: 'Email Notifications', sidebar_position: 6 },

  [path.join('specs', 'data-models', 'overview.md')]: { title: 'Data Models Overview', sidebar_position: 1 },
  [path.join('specs', 'data-models', 'user.md')]: { title: 'User', sidebar_position: 2 },
  [path.join('specs', 'data-models', 'applicant.md')]: { title: 'Applicant', sidebar_position: 3 },
  [path.join('specs', 'data-models', 'event.md')]: { title: 'Event', sidebar_position: 4 },
  [path.join('specs', 'data-models', 'registration.md')]: { title: 'Registration', sidebar_position: 5 },
  [path.join('specs', 'data-models', 'sponsorship-inquiry.md')]: { title: 'Sponsorship Inquiry', sidebar_position: 6 },

  [path.join('specs', 'PRD-V1.md')]: { title: 'Product Requirements (PRD)', sidebar_position: 1 },
  [path.join('specs', 'DTM.md')]: { title: 'Development Timeline', sidebar_position: 2 },
};

function applyFrontmatter() {
  let count = 0;
  for (const [relative, meta] of Object.entries(FRONTMATTER)) {
    const file = path.join(localDocsDir, relative);

    if (!existsSync(file)) {
      console.warn(`[sync-docs] Frontmatter target missing (upstream removed it?): ${relative}`);
      continue;
    }

    const content = readFileSync(file, 'utf8');
    const extra = Object.entries(meta).map(([key, value]) => `${key}: ${value}`).join('\n');

    let next;
    if (content.startsWith('---\n')) {
      // Merge into an existing frontmatter block.
      const close = content.indexOf('\n---', 4);
      if (close === -1) {
        throw new Error(`[sync-docs] Unterminated frontmatter in ${relative}.`);
      }
      const rest = content.slice(close + 4);
      next = `---\n${content.slice(4, close)}\n${extra}${rest}`;
    } else {
      next = `---\n${extra}\n---\n${content}`;
    }

    writeFileSync(file, next);
    count += 1;
  }

  console.log(`[sync-docs] Injected frontmatter into ${count} files.`);
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
