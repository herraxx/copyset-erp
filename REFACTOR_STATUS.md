# CopySet ERP clean-runtime status

The clean runtime is the only active application path on branch `clean-runtime-2026-09-18`.

## Runtime ownership

- `index.html` — one static shell and deterministic module order.
- `data.js` — demo seed data, product catalogue and local persistence.
- `shell.js` — navigation, view activation, shared rendering and modal close.
- `quote-actions.js` / `quotes.js` / `quotes-list.js` — offer workflow and conversion.
- `orders-list.js` / `orders.js` / `order-page.js` — order workflow and editable work order.
- `pricing-admin.js` / `pricing.js` — central defaults and calculator.
- Remaining feature files each own the view named by the file.

The historical `app-base.html` compatibility monolith and unused `app-shell.html` target have been removed. No fetched HTML, `document.write`, MutationObserver or runtime renderer replacement is used.

## Verified flows

- Tarjoukset and Tilaukset use the same header and group navigation contract.
- Uusi tarjous and Uusi tilaus both contain section 2, Tuote ja hinta, and Laske hinta.
- Hintalaskuri opens from both forms and uses the correct tarjous/tilaus action text.
- Hinnoittelu is available under Työkalut with 20 editable product defaults.
- New order save completes and returns to the order list.
- Offer flow completes Luonnos → Valmis lähetettäväksi → Lähetetty → Hyväksytty → new Vahvistettu order.
- Production opens a professional editable Työmääräys containing products, work steps and lisätyöt without prices.
- Työmääräys edits persist and Finnish dates remain dd.mm.yyyy.
- The responsive layout fits a 375 px viewport without horizontal overflow.

Production is not promoted automatically; promote the verified preview only after approval.

