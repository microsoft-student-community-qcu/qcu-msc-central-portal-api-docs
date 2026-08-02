---
sidebar_position: 2
---

# Authentication

The backend uses **Better Auth** for sessions and role-based access control (RBAC).

## How requests authenticate

Two mechanisms are supported:

- **Bearer token** — send `Authorization: Bearer <session-token>` on API calls.
  This is the recommended approach for non-browser clients.
- **Cookie session** — browser clients can authenticate with the session cookie
  issued at sign-in.

## Roles

A strict 4-role model gates every protected route:

| Role | Description |
|------|-------------|
| `APPLICANT` | Post-account-creation, pending membership approval |
| `MEMBER` | Active QCU MSC member |
| `ADMIN_HR` | Management & Dev — applicant pipeline only |
| `ADMIN_LOGISTICS` | Logistics — event management only |

Guests have no `User` record (behavioral role only). There is **no** bare `ADMIN`
or `STUDENT` role.

## Route guards

Endpoints are guarded by middleware:

| Guard | Allows |
|-------|--------|
| `requireAuth` | Any authenticated user |
| `requireAdminHR` | `ADMIN_HR` only |
| `requireAdminLogistics` | `ADMIN_LOGISTICS` only |
| `requireAnyAdmin` | Either admin role |
| `requireMemberOrAdmin` | `MEMBER` and admins |

Each endpoint doc page states which guard applies. Public endpoints (e.g.
[OCR verification](/docs/api/v1/ocr), applicant submission) need no authentication.

## Error semantics

- **401 Not Authenticated** — missing or invalid session/token
- **403 Forbidden** — authenticated but the role doesn't match the guard

Both return the standard `{ "success": false, "message": "..." }` envelope.

## Account lifecycle

- Applicants get accounts via the application pipeline and set their password
  through an emailed activation link — see
  [Applicant Account Activation Flow](/docs/guides/workflows/auth-workflow#applicant-account-activation-flow).
- Admins can also grant access via
  [Setup Tokens](/docs/api/v1/setup-token) for managed devices/setup flows.

## Also read

- [Introduction — Authentication](/docs/intro#authentication) — same facts, more context
- [Workflow — User Authentication](/docs/guides/workflows/auth-workflow) — full flow
- [RBAC & Authorization](/docs/guides/workflows/rbac) — guard and role design
