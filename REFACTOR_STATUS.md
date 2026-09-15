# CopySet ERP refactor baseline

Production remains pinned to the last user-verified working main deployment while this branch is cleaned.

## Completed on this branch
- Backup branch created before refactor.
- Removed obsolete `pricing-fix.js` file and its loader from `index.html`.
- Pricing remains available through the integrated pricing implementation in `approved-layout.js`.
- Pricing launcher is integrated with the pricing module instead of a second polling hotfix.
- Preview deployment builds successfully on Vercel.

## Refactor rules
1. Do not change the approved Tarjoukset/Tilaukset visual layout.
2. Do not remove a legacy override until every behavior it contributes is accounted for.
3. Keep Hintalaskuri available from offer/order product editing.
4. Preserve Finnish dates, VAT 25.5/0, 50 € start fee, 6 € invoice fee and 21-day payment term.
5. Preserve quote → order → production → ready → invoice review → invoiced workflow.
6. Production is updated only after preview verification.

## Dependency map
The monolithic `app-base.html` contains accumulated generations of the same core functions. Later generations capture earlier functions through aliases/wrappers, so deleting the first definition is unsafe even when a newer definition exists.

High-risk chains to consolidate last:
- `orderForm` → captured by later order-form wrappers and product-form enhancements.
- `openOrder` → captured by later order-detail/profit/action wrappers.
- `renderAll` → accumulated refresh hooks and dependent renderers.

Medium-risk chains:
- `saveOrder`, `fillCustomer`, `formOrderObject`, `renderDashboard`.

Lower-risk presentation layer:
- final `renderQuotes` and `renderOrders` are already centralized in `approved-layout.js`; the approved UI therefore stays outside the monolith during core cleanup.

## Safe consolidation order
1. Keep final list rendering in `approved-layout.js` and remove no list behavior until the core no longer depends on legacy render side effects.
2. Consolidate product/pricing hooks so one explicit refresh path replaces polling/DOM rescans.
3. Consolidate order form serialization (`formOrderObject`, `saveOrder`, `fillCustomer`).
4. Consolidate `orderForm` only after all captured wrapper behavior has been copied into one canonical implementation.
5. Consolidate `openOrder` actions and production/invoice hooks.
6. Consolidate `renderAll` last, then remove dead aliases and legacy generations.
7. Run static regression checks and Vercel preview verification before any production merge.

## Remaining technical debt
`app-base.html` is still the 260 KB legacy monolith. It is intentionally unchanged at this checkpoint because bulk deletion would risk working ERP behavior. The next code-changing phase is canonical form serialization and product/pricing refresh, followed by the high-risk UI/action chains above.
