# CopySet ERP — customer handover

## Current delivery

Version: **1.0 front-end prototype**

The current system is suitable for demonstration, workflow approval and continued development. It is not yet a multi-user production backend.

## Ownership transfer checklist

1. Create a GitHub organization owned by Copy-Set Oy.
2. Add at least two Copy-Set administrators.
3. Transfer or mirror the repository into that organization.
4. Create a Copy-Set-owned Vercel team.
5. Import the transferred GitHub repository into the Vercel team.
6. Set `clean-core-v1` or a dedicated `main` branch as the production branch.
7. Add the customer domain only after the imported deployment passes `TEST_PLAN.md`.
8. Document every environment variable and integration credential in the customer's password manager, never in Git.
9. Keep the recovery branches until the production backend has been accepted.

## Production work still required

- shared database instead of browser-only `localStorage`
- authentication and role permissions
- server-side validation and audit log
- durable attachment storage
- scheduled backups and restore test
- transactional email provider
- Netvisor and shipping integrations
- privacy, retention and access policies
- monitoring and error reporting

## Safe update procedure

1. Create a feature branch.
2. Run `node scripts/validate.mjs`.
3. Test every affected path in desktop and mobile layouts.
4. Deploy a preview.
5. Verify the preview before changing the production alias.
6. Keep the previous READY deployment available for rollback.
