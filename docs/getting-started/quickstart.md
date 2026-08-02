---
sidebar_position: 1
---

# Quickstart

Make your first API call in a few minutes — no account required.

## 1. Base URL

```
https://<deployed-backend-host>/api/v1
```

The backend is deployed as Azure Functions. The exact host depends on the environment
(development, staging, production) — ask the backend team or check your deployment
configuration. Every public route is versioned under `/api/v1`; breaking changes move
to `/api/v2` (see [Versioning](/api/versioning)).

## 2. Try a public endpoint

The [OCR Verification API](/api/v1/ocr) is fully public — it verifies a QCU
Student ID image. Grab an ID photo and send it as multipart form data:

```bash
curl -X POST https://<deployed-backend-host>/api/v1/ocr/verify \
  -F "image=@student-id.jpg"
```

A successful verification returns:

```json
{
  "success": true,
  "data": {
    "ocrSessionId": "990e8400-e29b-41d4-a716-446655440004",
    "studentId": "23-5678",
    "lastName": "Bustillo",
    "firstName": "Mark Ian",
    "middleInitial": "B",
    "manualRequired": false,
    "attemptsRemaining": 3,
    "digitCorrectedInName": true
  },
  "message": "Student ID verified successfully"
}
```

Public endpoints are rate limited per IP (OCR: 10 requests/minute) — see
[Rate Limiting](/intro#rate-limiting).

## 3. Read the response envelope

Every endpoint uses the same JSON contract:

- **Success** — `{ "success": true, "data": { ... }, "message": "..." }`
- **Error** — `{ "success": false, "message": "..." }` (the key is always `message`, never `error`)
- **Validation error** — the above plus `errors: { "fieldName": ["..."] }` for Zod field-level details

Full details in [API Basics — Response Envelope](/intro#response-envelope).

## 4. Authenticate for protected routes

Most endpoints require a session via **Better Auth**:

- **Bearer token** — `Authorization: Bearer <session-token>` for API calls.
- **Cookie session** — browser clients may use the session cookie issued at sign-in.

Roles gate the routes (`APPLICANT`, `MEMBER`, `ADMIN_HR`, `ADMIN_LOGISTICS`) — read
[Authentication](/getting-started/authentication) before calling protected
endpoints.

## Next steps

- Browse the [API Reference](/api/) for every v1 endpoint
- Follow a [workflow guide](/guides/workflows) for multi-step flows like the applicant pipeline
- Check the [Setup Token Validation API](/api/v1/setup-token) for device/setup authentication
