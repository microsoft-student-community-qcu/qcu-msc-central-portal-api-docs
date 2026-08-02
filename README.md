# QCU MSC Central Portal — API Docs

Documentation site for the QCU Microsoft Student Community Central Portal backend.
Built with [Docusaurus](https://docusaurus.io/) and deployed to GitHub Pages.

## What's inside

- **API Reference** — versioned endpoint docs (`v1` stable, `v2` next), versioning policy, deprecation template
- **Guides & Workflows** — applicant tracking, auth flow, RBAC, email notifications, event management
- **Specs & Data Models** — Prisma-backed data models (user, applicant, event, registration, sponsorship inquiry)
- **API Basics** — hand-written quickstart: base URL, auth, response envelope, error formats, rate limits

## How docs stay in sync

The backend repo (`microsoft-student-community-qcu/qcu-msc-central-portal-backend`)
is the **single source of truth** for documentation. This site never holds a copy —
`scripts/sync-docs.mjs` sparse-clones the backend's `docs/` tree into `docs/`
(`api/`, `guides/`, `specs/`) before every build.

- Local: `npm start` and `npm run build` run the sync automatically (`prestart` / `prebuild`).
- CI: `.github/workflows/deploy.yml` runs the sync, builds, and deploys to GitHub Pages.
- Manual: `npm run sync:docs`

Do not edit files inside `docs/api/`, `docs/guides/`, or `docs/specs/` — they are
overwritten on every sync. Edit the backend repo instead. Only `docs/intro.md`
(API Basics) is authored here.

## Local development

```bash
npm install
npm run start
```

## Build & serve

```bash
npm run build
npm run serve
```

## Deployment

Pushes to `main` deploy automatically via the GitHub Actions workflow
(`.github/workflows/deploy.yml`) to GitHub Pages.

One-time setup: in the repo settings, enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Stack

- [Docusaurus 3](https://docusaurus.io/) (React 19, TypeScript)
- [docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local) for offline full-text search
