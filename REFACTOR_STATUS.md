# CopySet ERP deep-clean status

Backup before this work: `backup-before-deep-clean-2026-09-15`.

## Architecture rule
Every behavior has one authoritative owner. No new polling hotfixes or duplicate workflow overrides.

## Current owners
- `app-base.html`: legacy data/forms/CRM/dashboard compatibility layer. This is the remaining monolith to retire gradually.
- `approved-layout.js`: Tarjoukset/Tilaukset list UI plus the single integrated product pricing enhancer.
- `order-page.js`: authoritative full-page Tilaus workflow and stage-specific order views.
- `invoice-review.js`: authoritative invoice review/approval UI.
- `core-actions.js`: printable production/customer documents.
- `numbering-fix.js`: TAR/TIL numbering migration/generation.
- `approved-layout.css` + `order-page.css`: presentation.

## Removed
- `workflow-fix.js`: obsolete workflow override.
- `invoice-workflow.js`: duplicate invoice controller.
- `pricing-fix.js`: duplicate 300 ms polling pricing hotfix. Pricing is owned by `approved-layout.js`.

## Workflow contract
Tarjous -> Vahvistettu -> Tuotannossa -> Valmis -> Laskutusvalmis / Laskun tarkastus -> Laskutettu.

Order pages are stage-specific: production shows production data, ready shows delivery actions, invoice review shows invoice data, invoiced shows only completion summary.

## Non-negotiable business defaults
Finnish dates; VAT 25.5% domestic / 0% export; aloituskustannus 50 €; laskutuslisä 6 €; payment term 21 days; work card and delivery note have no prices.

## Remaining deep-clean work
The legacy `app-base.html` still contains historical generations of `orderForm`, `openOrder`, `renderAll`, `saveOrder`, `fillCustomer`, `formOrderObject`, and dashboard functions. Do not bulk-delete it: some offer/customer/form behavior still depends on those definitions. Retire each chain only after its behavior has been moved to a canonical module and verified. The production order/invoice path must not be routed back through legacy workflow overrides.