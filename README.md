# CopySet ERP

CopySet ERP is a Finnish-language workflow prototype for a print company. It covers offers, confirmed orders, production, delivery documents, invoice review, CRM, subcontractors, pricing and dashboard reporting.

## Start locally

The application is static and has no build step:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Runtime files

- `index.html` — application shell and view containers
- `runtime/copyset-runtime.js` — business logic and UI controllers
- `runtime/copyset-runtime.css` — desktop, mobile and A4 document styles
- `scripts/validate.mjs` — release validation

The marked section order inside both runtime bundles is intentional. Do not rearrange sections without testing the complete workflow.

## Validate a release

```bash
node scripts/validate.mjs
```

## Data and production readiness

This v1.0 release is a working front-end prototype. Data is stored in the browser's `localStorage`. Before daily production use, add authenticated users, a shared database, durable attachment storage, automatic backups and server-side email/integration handling.

## Protected versions

- Active branch: `clean-core-v1`
- Recovery branch: `backup/copyset-v1-working-2026-09-20`
- Earlier recovery branch: `locked-working-2026-09-18`

See `HANDOVER.md`, `TEST_PLAN.md` and `ARCHITECTURE.md` before transferring or extending the system.
