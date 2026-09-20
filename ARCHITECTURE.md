# CopySet ERP — locked clean architecture

## Protected baselines

The exact pre-cleanup application is preserved on branch `locked-working-2026-09-18`.
Never rewrite or force-update that branch.

The final working prototype before the v1.0 handover pass is preserved on branch
`backup/copyset-v1-working-2026-09-20`.

## Active clean branch

Branch: `clean-core-v1`

Runtime entry points:

- `index.html`
- `runtime/copyset-runtime.js`
- `runtime/copyset-runtime.css`

The HTML must load only the two runtime bundle files above. Their internal section order is intentional because the application is a browser-based IIFE system with shared `window.CopySet` APIs.

Canonical product data:

- `products[].extras[]` always uses `{ name, price }` objects.
- Legacy string extras are normalized once at startup and before persistence.
- Production editing may change task names, but must preserve the matching invoice price.
- Empty extra-work rows are never persisted or rendered.

## Behavioural contract

The clean branch must preserve:

- Tilaukset as the opening view
- Tarjous → approved → order workflow
- Vahvistettu → Tuotannossa → Valmis → Laskutusvalmis → Laskutettu
- A4 order view in Vahvistettu and Valmis
- editable production work card without prices
- colour previews for Työkortti, Lähete and Lähetyslappu before printing
- A4 invoice review
- CRM, subcontractors, pricing, dashboard, archive and marketing views
- ability to close or return from every workflow view

## Change rule

Make changes in the appropriate marked section inside the runtime bundle. After every change:

1. Parse the complete JavaScript bundle.
2. Confirm `index.html` has only the two runtime references.
3. Deploy the clean branch.
4. Verify Vercel reports `READY`.
5. Exercise the affected workflow before promotion.

## Release validation

Run `node scripts/validate.mjs` before every deployment. The release validator checks
the complete runtime bundles and prevents truncated CSS, duplicate runtime references
and missing workflow contracts from being published unnoticed.
