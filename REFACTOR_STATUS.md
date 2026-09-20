# Refactor status

Completed on 2026-09-18:

- Created immutable recovery branch `locked-working-2026-09-18`.
- Created clean development branch `clean-core-v1`.
- Consolidated 28 JavaScript runtime files into `runtime/copyset-runtime.js`.
- Consolidated 10 stylesheets into `runtime/copyset-runtime.css`.
- Updated printable documents to use the clean visual runtime.
- Removed the 28 obsolete JavaScript source files from the clean branch.
- Removed the 10 obsolete stylesheet files from the clean branch.
- Updated `index.html` to load only the clean runtime bundles.
- Validated JavaScript syntax after consolidation.
- Confirmed the final Vercel deployment is READY.

Recovery point: `locked-working-2026-09-18`
Clean runtime branch: `clean-core-v1`

Final cleanup on 2026-09-19:

- Normalized legacy and demo `lisätyö` data to one `{ name, price }` schema.
- Removed empty extra-work rows from persisted data during startup/save migration.
- Preserved extra-work prices when the price-free production card is edited.
- Bumped runtime cache keys so the corrected bundle loads immediately.
- Removed the obsolete layout preview from the active branch.

Handover pass on 2026-09-20:

- Preserved the working application on `backup/copyset-v1-working-2026-09-20`.
- Restored and hardened the canonical mobile stylesheet.
- Added automated release validation.
- Added README, acceptance test plan, changelog and customer handover instructions.
- Classified v1.0 accurately as a front-end prototype pending database, authentication,
  durable file storage, backups and production integrations.
