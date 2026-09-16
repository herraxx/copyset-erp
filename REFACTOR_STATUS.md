# CopySet ERP deep-clean status

Safety branches exist before the structural cleanup. Production remains on `main`; all work below is on `perfect-clean-2026-09-16`.

## Architecture rule
Every behavior has one authoritative owner. No new polling hotfixes, duplicate workflow overrides, hidden pricing implementations or load-time data mutations.

## Extracted and active clean modules
- `config.js`: canonical business defaults, workflow constants, Finnish date/money helpers and VAT rule.
- `app-core.js`: explicit state access, persistence bridge and canonical status transition API.
- `customers.js`: canonical customer normalization/search/add/update API; UI wiring still belongs to Gate D.
- `quotes-list.js`: canonical Tarjoukset list renderer with local UI state; no legacy filter/formatting dependencies.
- `orders-list.js`: canonical Tilaukset list renderer with local UI state and clean workflow actions; no `v2*` list dependencies.
- `pricing.js`: the only pricing calculator. No MutationObserver/polling. Setup fee is explicitly separate from product pricing.
- `order-page.js`: authoritative full-page Tilaus workflow and stage-specific order views using the core API.
- `invoice-review.js`: authoritative invoice review/approval UI using the core API.
- `core-actions.js`: canonical order actions and production work card; legacy monkey-patches removed.
- `numbering-fix.js`: canonical TAR/TIL numbering. Migration is explicit and no longer mutates data during script load.
- `styles/base.css`: extracted shared base styles, loaded by the clean entrypoint.
- `styles/documents.css`: extracted document/quote print styles, loaded by the clean entrypoint.

## Clean entrypoint
`index.html` is now an explicit bootstrap. It loads clean modules in a fixed order, renders Tarjoukset/Tilaukset, initializes pricing and emits `copyset:clean-ready`. The compatibility monolith is still fetched first because forms/data/dashboard have not yet been extracted.

## Extracted target
- `app-shell.html`: static ERP shell target for the final cutover away from the monolith.

## Compatibility layer still active
- `app-base.html`: legacy state/data initialization, offer/order forms, CRM UI, dashboard, secondary views and duplicated inline CSS. This is now the main blocker.
- `approved-layout.css` + `order-page.css`: current presentation overrides; `approved-layout.css` still needs ownership mapping before retirement.
- Legacy offer actions (`openQuoteWork`, `showPreflight`, `showQuote`, `quoteAcceptMenu`, `rejectQuote`) are still called by the clean Tarjoukset list until the offer workflow is extracted.

## Retired
- `approved-layout.js`: deleted.
- `workflow-fix.js`: obsolete workflow override.
- `invoice-workflow.js`: duplicate invoice controller.
- `pricing-fix.js`: duplicate polling pricing hotfix.
- Embedded duplicate pricing implementation previously inside `approved-layout.js`.
- Orders-list dependencies on `v2EnsureProducts`, `v2OrderMatch`, `v2OrderLate`, `v2NextLabel`, `v2Advance`, global `q` and `v2OrderFilter`.
- Core-actions monkey-patches of `createOrderFromQuote` and `v2Advance`.
- Automatic numbering migration during page load.

## Workflow contract
Tarjous -> Vahvistettu -> Tuotannossa -> Valmis -> Laskutusvalmis / Laskun tarkastus -> Laskutettu.

Order pages are stage-specific: production shows production data, ready shows delivery actions, invoice review shows invoice data, invoiced shows only completion summary.

## Non-negotiable business defaults
Finnish dates; VAT 25.5% domestic / 0% export; aloituskustannus 50 € as a separate order line; laskutuslisä 6 €; payment term 21 days; work card and delivery note have no prices.

## Migration progress
- Gate A — duplicate controllers: substantially complete. Pricing, invoice, order workflow, actions and list renderers now have canonical owners.
- Gate B — shell/CSS extraction: CSS is extracted and loaded externally; static shell target exists. Inline copies remain inside `app-base.html` until safe full-file retirement.
- Gate C — state/data: materially advanced. Config, state bridge, workflow transitions, customer data API and numbering are external. Seed data, persistence initialization and legacy order normalization remain in the monolith.
- Gate D — forms/CRM: active next target. Map and extract the complete chain around `orderForm`, customer search/fill, customer creation, `formOrderObject` and `saveOrder`. Pricing must be triggered explicitly after form rendering.
- Gate E — dashboard/secondary views: not yet extracted.
- Gate F — retire `app-base.html`: blocked until C-E are complete and manually verified.

## Next safe extraction sequence
1. Map exact offer/order form field IDs and the current save chain without editing `app-base.html`.
2. Create a clean form adapter that emits `copyset:order-form-rendered` after each form render so pricing enhancement has an explicit lifecycle hook.
3. Wire customer search/fill to `CopySet.customerApi` while preserving the current form schema.
4. Move order object construction/save ownership out of the monolith only after steps 1-3 are verified.
5. Extract dashboard and remaining secondary views.
6. Replace the compatibility fetch with `app-shell.html`, then delete the monolith only after manual regression testing.

## Safety rule
Do not bulk-delete or partially overwrite `app-base.html`. It is still a ~260 KB compatibility monolith and its JavaScript is heavily compressed into very long lines. Historical generations of `orderForm`, `openOrder`, `renderAll`, `saveOrder`, `fillCustomer`, `formOrderObject`, dashboard and customer helpers remain intertwined. Extract a complete behavior chain first, wire it on the clean branch, verify it, then remove its legacy implementation. Production order/invoice paths must never be routed back through legacy workflow overrides.

## Verification status
Structural changes are committed on the clean branch, but browser interaction has not been verified in this environment. Do not merge to `main` until the critical paths have been manually tested: create/edit offer, customer search/create, pricing, accept offer -> order, production -> ready -> invoice review -> invoiced, work card, delivery note and mobile order list.