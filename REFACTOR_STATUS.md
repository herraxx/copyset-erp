# CopySet ERP deep-clean status

Safety branches exist before the structural cleanup. Production remains on `main`; all work below is on `perfect-clean-2026-09-16`.

## Architecture rule
Every behavior has one authoritative owner. No new polling hotfixes, duplicate workflow overrides or hidden pricing implementations.

## Extracted clean modules
- `config.js`: canonical business defaults, workflow constants, Finnish date/money helpers and VAT rule.
- `app-core.js`: explicit state access, persistence bridge and canonical status transition API.
- `app-shell.html`: extracted static ERP shell target.
- `styles/base.css`: extracted shared legacy base styles.
- `styles/documents.css`: extracted document/quote print styles.
- `quotes-list.js`: canonical Tarjoukset list renderer.
- `orders-list.js`: canonical Tilaukset list renderer.
- `pricing.js`: the only pricing calculator. No MutationObserver/polling. Setup fee is explicitly separate from product pricing.
- `order-page.js`: authoritative full-page Tilaus workflow and stage-specific order views.
- `invoice-review.js`: authoritative invoice review/approval UI.
- `core-actions.js`: printable production/customer documents.
- `numbering-fix.js`: TAR/TIL numbering compatibility.

## Compatibility layer still active
- `app-base.html`: legacy data initialization, forms, CRM, dashboard and secondary views. This remains the main monolith to retire gradually.
- `approved-layout.js`: temporary legacy list renderer compatibility. Clean list renderers are loaded after it and take ownership on the clean branch; delete this file only after its remaining dependencies are verified absent.
- `approved-layout.css` + `order-page.css`: current customer-visible presentation overrides.

## Removed earlier
- `workflow-fix.js`: obsolete workflow override.
- `invoice-workflow.js`: duplicate invoice controller.
- `pricing-fix.js`: duplicate polling pricing hotfix.
- Embedded duplicate pricing implementation previously inside `approved-layout.js`.

## Workflow contract
Tarjous -> Vahvistettu -> Tuotannossa -> Valmis -> Laskutusvalmis / Laskun tarkastus -> Laskutettu.

Order pages are stage-specific: production shows production data, ready shows delivery actions, invoice review shows invoice data, invoiced shows only completion summary.

## Non-negotiable business defaults
Finnish dates; VAT 25.5% domestic / 0% export; aloituskustannus 50 € as a separate order line; laskutuslisä 6 €; payment term 21 days; work card and delivery note have no prices.

## Migration progress
- Gate A — duplicate controllers: substantially complete; pricing/invoice/order workflow have canonical owners.
- Gate B — shell/CSS extraction: extracted target files exist; runtime still uses `app-base.html` until safe cutover.
- Gate C — state/data: started with `config.js` and `app-core.js`; seed data and legacy normalization remain in monolith.
- Gate D — forms/CRM: next major extraction. Move `orderForm`, `fillCustomer`, `formOrderObject`, customer creation/search and `saveOrder` only after each dependency is mapped.
- Gate E — dashboard/secondary views: not yet extracted.
- Gate F — retire `app-base.html`: blocked until C-E are complete and manually verified.

## Safety rule
Do not bulk-delete `app-base.html`. Historical generations of `orderForm`, `openOrder`, `renderAll`, `saveOrder`, `fillCustomer`, `formOrderObject`, dashboard and customer helpers remain intertwined. Extract a complete behavior chain first, wire it on the clean branch, verify it, then remove its legacy implementation. Production order/invoice paths must never be routed back through legacy workflow overrides.