# CopySet ERP — locked clean architecture

## Protected baseline

The exact pre-cleanup application is preserved on branch `locked-working-2026-09-18`.
Never rewrite or force-update that branch.

## Active clean branch

Branch: `clean-core-v1`

Runtime entry points:

- `index.html`
- `runtime/copyset-runtime.js`
- `runtime/copyset-runtime.css`

The HTML must load only the two runtime bundle files above. Their internal section order is intentional because the application is a browser-based IIFE system with shared `window.CopySet` APIs.

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
