# CopySet ERP — clean architecture

This branch is the structural-clean workspace. Production remains on `main` until each migration gate is verified.

## One owner per responsibility

- `app-shell.html` — static application shell only: navigation, views, modals. No business logic.
- `styles/base.css` — shared layout/forms/tables/modal styles.
- `styles/documents.css` — work card, delivery note, labels, invoice preview.
- `data.js` — demo seed data and persistence/state initialization only.
- `app-core.js` — shared helpers, normalization and state access.
- `customers.js` — CRM/customer creation/search/fill.
- `quotes.js` — tarjous form/list/approval/conversion.
- `orders.js` — order form/list/save/copy.
- `pricing.js` — the only pricing calculator implementation.
- `order-page.js` — the only stage-specific order workflow UI.
- `production.js` — production state/actions.
- `core-actions.js` — printable production/shipping/customer documents.
- `invoice-review.js` — the only invoice review/approval implementation.
- `dashboard.js` — KPI and analytics.
- `numbering-fix.js` — numbering compatibility; later folded into core numbering.

## Rules

1. A named behavior/function has one authoritative implementation.
2. No monkey-patching (`const oldX=X; X=function...`) in final architecture.
3. No MutationObserver/polling for business behavior. DOM enhancement must be called by the renderer that owns the view.
4. No reliance on browser-created globals from element IDs.
5. State is accessed through one explicit state API; no split lexical `st` / `window.st` ownership.
6. Finnish dates are `dd.mm.yyyy` in UI.
7. Domestic VAT default 25.5%, export 0%; setup fee 50 €, billing fee 6 €, payment term 21 days.
8. Work card and delivery note never contain prices.
9. Workflow contract: Tarjous -> Vahvistettu -> Tuotannossa -> Valmis -> Laskutusvalmis -> Laskutettu.

## Migration gates

### Gate A — remove duplicate controllers
- Pricing only in `pricing.js`.
- Invoice review only in `invoice-review.js`.
- Order workflow only in `order-page.js`.

### Gate B — extract shell and CSS
Move inline CSS and static HTML out of `app-base.html` without changing behavior.

### Gate C — extract state/data
Move FLOW, product presets, demo seed data, persistence and shared normalization into explicit modules.

### Gate D — extract forms/CRM
Move `orderForm`, `fillCustomer`, `formOrderObject`, customer creation/search and `saveOrder` to canonical modules.

### Gate E — extract dashboard/secondary views
Move dashboard, products, suppliers, marketing and archive renderers.

### Gate F — retire `app-base.html`
Replace the 260 KB compatibility monolith with a small static shell that imports the canonical modules.

## Merge requirement
Do not merge this branch into `main` until the existing customer-visible flows are manually verified: create tarjous, create tilaus, pricing, customer creation, production start, work card, ready/shipping docs, invoice review/approval, invoiced view, copy order, search/filter, mobile form scrolling.