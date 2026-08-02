---
sidebar_position: 1
slug: /intro
---

# API Basics

Everything the frontend team needs before touching the QCU MSC Central Portal backend API.

## Base URL

```
https://<deployed-backend-host>/api/v1
```

The backend is deployed as Azure Functions. The exact host depends on the environment
(development, staging, production). Every public route is versioned under `/api/v1` —
breaking changes move to `/api/v2`.

## Authentication

The backend uses **Better Auth**. Most endpoints require an authenticated session:

- **Bearer token** — `Authorization: Bearer <session-token>` for API calls.
- **Cookie session** — browser clients may also authenticate via the session cookie
  issued at sign-in.

Guests (unauthenticated visitors) can only reach the public endpoints — e.g. OCR
verification and the applicant submission flow.

## Role-Based Access Control (RBAC)

The system uses a strict 4-role model:

| Role | Description |
|------|-------------|
| `APPLICANT` | Post-account-creation, pending membership approval |
| `MEMBER` | Active QCU MSC member |
| `ADMIN_HR` | Management & Dev — applicant pipeline only |
| `ADMIN_LOGISTICS` | Logistics — event management only |

Guests have no `User` record (behavioral role only). There is **no** bare `ADMIN` or
`STUDENT` role.

Endpoints are guarded by middleware: `requireAuth` (any authenticated user),
`requireAdminHR`, `requireAdminLogistics`, `requireAnyAdmin`, and
`requireMemberOrAdmin`. When a route is restricted, its doc page states which guard
applies.

## Response Envelope

All endpoints follow a consistent JSON response contract.

### Success

```json
{ "success": true, "data": { ... }, "message": "Human-readable summary (optional)" }
```

### Simple Error (not found, auth failure, business logic, 500)

```json
{ "success": false, "message": "Human-readable error description" }
```

### Validation Error (Zod field-level)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": { "fieldName": ["Error message"] }
}
```

Rules:

- The key is always `message` — never `error`.
- `errors` appears only for field-level Zod validation details.
- Every Zod field error is human-readable and safe to display directly in the UI.

## Status Codes

| Code | Meaning |
|------|---------|
| `200` / `201` | Success |
| `400` | Validation error (Zod) |
| `401` | Not authenticated |
| `403` | Authenticated but forbidden (wrong role) |
| `404` | Not found |
| `429` | Rate limited |
| `500` | Server error |

## Rate Limiting

Public POST endpoints are rate limited per IP (`express-rate-limit`):

- **OCR verification** — 10 requests / minute
- **Applicant submission** — 5 requests / minute

Rate limiter responses also use the `message` key.

## Multi-Step Flows

Some flows span multiple calls — read the workflow docs before coding against them:

- **OCR applicant flow** — `POST /api/v1/ocr/verify` first, then forward the returned
  `ocrSessionId` to the submission endpoint. If OCR fails, the API responds with
  `manualRequired: true` and the UI must fall back to manual entry.
- **Multi-step application draft** — batch endpoints under `/api/v1/applicants/draft`
  with a TTL and a resume link flow.
- **Applicant account activation** — accounts are created via the application
  pipeline; the applicant sets their password through an emailed link.

## File Uploads

Uploads use `multipart/form-data`. Accepted formats and size limits are documented
per endpoint (e.g. Certificate of Registration: PDF/JPEG/PNG/DOCX, max 10MB).

## Conventions

- Timestamps are ISO 8601 strings.
- IDs are UUIDs unless stated otherwise.
- Enums are `SCREAMING_SNAKE_CASE` (e.g. `SAN_BARTOLOME_MAIN`, `PREFER_NOT_TO_SAY`).
- Never hardcode an enum value the API doesn't document — validate against the
  per-endpoint docs.
