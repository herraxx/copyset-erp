# CopySet ERP deep-clean status

Production remains on `main`; structural cleanup is isolated on `perfect-clean-2026-09-16` with safety branches available.

## Architecture rule
Every behavior has one authoritative owner. No new polling hotfixes, duplicate workflow overrides, hidden pricing implementations or load-time data mutations.

## Active clean modules
- `config.js`: canonical business defaults plus Finnish date, number, money and VAT helpers. Parses ISO and `dd.mm.yyyy` dates and common Finnish/English number formats.
- `app-core.js`: state/persistence bridge and guarded workflow transitions. Normal transitions are only `Vahvistettu -> Tuotannossa -> Valmis -> Laskutusvalmis -> Laskutettu`.
- `customers.js`: canonical customer normalization/search/add/update API plus conservative exact form read/fill aliases.
- `customer-form.js`: continuous customer search/fill controller. It does not rerender the form while typing.
- `form-lifecycle.js`: temporary explicit lifecycle bridge that emits `copyset:order-form-rendered` for legacy forms.
- `quotes.js`: canonical offer acceptance/conversion controller. Accepted offers create a new `Tilaus`, preserve the source quote link and use canonical TIL numbering.
- `quotes-list.js`: canonical Tarjoukset list renderer with local filter/search state; acceptance routes through `CopySet.quotes`.
- `orders-list.js`: canonical Tilaukset list renderer with local filter/search state, canonical Finnish deadline parsing and workflow actions.
- `pricing.js`: the only pricing calculator. No MutationObserver/polling. Order setup fee is explicitly separate from product production cost.
- `core-actions.js`: canonical order/production actions and no-price production work card. Production steps are forward-only and require `Tuotannossa`.
- `order-page.js`: authoritative stage-specific Tilaus UI. Production, work-card and invoice actions route through canonical controllers.
- `invoice-review.js`: authoritative invoice review/approval UI. Supports legacy/new payment-term fields and canonical VAT fallback.
- `numbering-fix.js`: canonical TAR/TIL numbering. Migration is explicit and side-effect-free at startup.
- `styles/base.css` and `styles/documents.css`: extracted shared/document styles.

## Clean entrypoint
`index.html` is an explicit bootstrap with deterministic script order. Numbering loads before quote conversion. The compatibility monolith is still fetched first because form rendering, seed/persistence initialization, CRM UI, dashboard and some document/edit actions have not yet been extracted.

## Extracted target
- `app-shell.html`: static ERP shell target for the final cutover away from the monolith.

## Compatibility layer still active
- `app-base.html`: legacy state/data initialization, offer/order form renderer/save chain, CRM UI, dashboard, secondary views and duplicated inline CSS. This is the main blocker.
- `approved-layout.css` + `order-page.css`: presentation overrides still need ownership mapping before retirement.
- Order page still uses legacy confirmation, copy and edit entrypoints until those complete behavior chains are extracted.
- Quote list still uses legacy open/work/preflight/send/reject entrypoints. Acceptance/conversion is no longer legacy-owned.
- Production work card still resolves subcontractor names through legacy supplier helper `V()`.

## Retired or bypassed
- `approved-layout.js`, `workflow-fix.js`, `invoice-workflow.js`, `pricing-fix.js` and the duplicate pricing implementation formerly embedded in `approved-layout.js`.
- Orders-list `v2*` dependencies and global list filter state.
- Core-actions monkey-patches of quote conversion / order advance.
- Automatic numbering migration during page load.
- Order-page legacy `invoiceTotals/normalizeOrder` dependency for invoice totals.
- Order-page direct workflow mutation for starting production.

## Workflow contract
`Tarjous -> Vahvistettu -> Tuotannossa -> Valmis -> Laskutusvalmis (Laskun tarkastus) -> Laskutettu`.

Order pages are stage-specific: production shows production data, ready shows delivery actions, invoice review shows invoice data, invoiced shows completion summary. Work card and delivery note contain no prices.

## Non-negotiable business defaults
Finnish dates; VAT 25.5% domestic / 0% export; aloituskustannus 50 € as a separate order line; laskutuslisä 6 €; payment term 21 days; work card and delivery note have no prices.

## Migration progress
- Gate A — duplicate controllers: substantially complete. Pricing, invoice, order workflow, production actions, quote acceptance and list renderers have canonical owners.
- Gate B — shell/CSS extraction: external base/document CSS and static shell target exist. Inline copies remain in `app-base.html`.
- Gate C — state/data: materially advanced. Config, parsing, state bridge, guarded transitions, customer API and numbering are external. Seed data, persistence initialization, supplier data and some normalization remain legacy-owned.
- Gate D — forms/CRM: in progress. Lifecycle bridge, customer form read/fill and continuous search exist. Exact order/offer form construction, customer creation UI, `formOrderObject` and `saveOrder` still need extraction and verification.
- Gate E — dashboard/secondary views: not yet extracted.
- Gate F — retire `app-base.html`: blocked until C-E are complete and manually verified.

## Next safe extraction sequence
1. Map the exact current `orderForm -> formOrderObject -> saveOrder` chain and field IDs without partially rewriting the monolith.
2. Move order/offer object construction into a clean form controller while preserving existing data shape.
3. Extract customer creation UI and remove remaining customer-form legacy ownership.
4. Extract order confirmation/copy/edit and supplier lookup so `order-page.js` and `core-actions.js` no longer call legacy helpers.
5. Extract dashboard and secondary views.
6. Replace the compatibility fetch with `app-shell.html`; retire `app-base.html` only after regression testing.

## Safety rule
Do not bulk-delete or partially overwrite `app-base.html`. It is still a ~260 KB compatibility monolith with heavily compressed JavaScript and historical generations of form/order/customer/dashboard helpers intertwined. Extract a complete behavior chain first, wire it on the clean branch, verify it, then retire its legacy implementation.

## Verification status
Structural changes are committed on the clean branch, but browser interaction has not been verified in this environment. Do not merge to `main` until these critical paths are manually tested: create/edit offer, customer search/create, pricing, accept offer -> order, production steps -> ready -> invoice review -> invoiced, work card, delivery note/shipping label, numbering and mobile order list.

## Continuation pass — clean43

Completed on `perfect-clean-2026-09-16`:

- Canonical offer/order form now owns creation and editing entrypoints.
- Form serialization includes editable TAR/TIL number, customer data, Finnish dates, delivery rows, production selection, VAT, 50 € setup fee, 6 € billing fee, 21-day payment terms, order reference and e-invoice fields.
- Continuous customer search and inline customer creation use `customerApi`; postal code and city remain separate fields.
- Canonical order commands own copy-to-new and delete actions. Copies receive a new TIL number and cleared production/invoice state.
- Dashboard/BI, invoiced-order archive, CRM, products, suppliers and marketing are external canonical modules.
- Dashboard supports day, week, month, year and custom date ranges plus product/customer sales analysis.
- `index.html` clean bundle is now `20260916-clean43`.
- All 23 referenced JavaScript modules exist and pass syntax compilation.
- No clean module contains `v2EnsureProducts`, `MutationObserver`, `setInterval` polling or legacy controller monkey-patch declarations.
- Latest Vercel branch deployment builds successfully.

### Compatibility boundary still intentionally retained

`app-base.html` is still loaded for the static shell, demo seed data, local persistence initialization, product presets and the remaining legacy quote document actions (open/preflight/send/reject). It must not be deleted until those final ownership chains are extracted and the protected preview has been interactively verified. The clean modules now own the customer-visible creation/editing, list, workflow, pricing, CRM, archive, dashboard and secondary-view entrypoints.
