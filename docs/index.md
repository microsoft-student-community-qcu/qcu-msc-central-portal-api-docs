---
sidebar_position: 0
hide_table_of_contents: true
---

# Central Portal API Docs

Reference, workflows, and data models for the **QCU Microsoft Student Community Central Portal** backend — an Azure Functions API (Better Auth, Prisma, Express) that powers membership applications, event management, and more.

<div className="row margin-top--lg">
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h3>🚀 Getting Started</h3>
      </div>
      <div className="card__body">
        <p>Make your first API call in minutes — no account required for the public endpoints.</p>
        <ul>
          <li><a href="/docs/getting-started/quickstart">Quickstart</a></li>
          <li><a href="/docs/getting-started/authentication">Authentication</a></li>
          <li><a href="/docs/intro">API Basics</a> — response envelope, status codes, rate limits</li>
        </ul>
      </div>
    </div>
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h3>🧭 Guides</h3>
      </div>
      <div className="card__body">
        <p>End-to-end workflows before you code against the endpoints.</p>
        <ul>
          <li><a href="/docs/guides/workflows">Core Workflows</a></li>
          <li><a href="/docs/guides/workflows/applicant-tracking">Applicant Pipeline</a></li>
          <li><a href="/docs/guides/workflows/auth-workflow">Authentication</a></li>
          <li><a href="/docs/guides/workflows/rbac">RBAC &amp; Authorization</a></li>
          <li><a href="/docs/guides/workflows/event-management">Event Management</a></li>
          <li><a href="/docs/guides/workflows/email-notifications">Email Notifications</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h3>📚 API Reference</h3>
      </div>
      <div className="card__body">
        <p>Every endpoint, request shape, and response for <strong>v1</strong> (stable) — v2 is on the way.</p>
        <ul>
          <li><a href="/docs/api/">API Reference Overview</a></li>
          <li><a href="/docs/api/v1/applicants">Applicant Tracking</a></li>
          <li><a href="/docs/api/v1/users">User Management</a></li>
          <li><a href="/docs/api/v1/events">Events &amp; Registration</a></li>
          <li><a href="/docs/api/v1/ocr">OCR Verification</a></li>
          <li><a href="/docs/api/v1/setup-token">Setup Tokens</a></li>
          <li><a href="/docs/api/versioning">Versioning</a> · <a href="/docs/api/deprecation-template">Deprecation Policy</a></li>
        </ul>
      </div>
    </div>
    <div className="card margin-bottom--md">
      <div className="card__header">
        <h3>🗄️ Data Models</h3>
      </div>
      <div className="card__body">
        <p>The Prisma-backed entities behind every endpoint.</p>
        <ul>
          <li><a href="/docs/specs/data-models/overview">Overview</a> · <a href="/docs/specs/data-models/user">User</a> · <a href="/docs/specs/data-models/applicant">Applicant</a></li>
          <li><a href="/docs/specs/data-models/event">Event</a> · <a href="/docs/specs/data-models/registration">Registration</a> · <a href="/docs/specs/data-models/sponsorship-inquiry">Sponsorship Inquiry</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

:::tip Docs stay in sync
Pages under **API Reference**, **Guides**, and **Data Models** are pulled straight from the [backend repository](https://github.com/microsoft-student-community-qcu/qcu-msc-central-portal-backend) on every build — no manual copying.
:::
