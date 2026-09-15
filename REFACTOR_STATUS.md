# CopySet ERP refactor baseline

Production remains pinned to the last user-verified working main deployment while this branch is cleaned.

## Completed on this branch
- Backup branch created before refactor.
- Removed obsolete `pricing-fix.js` file and its loader from `index.html`.
- Pricing remains available through the integrated pricing implementation in `approved-layout.js`.
- Preview deployment builds successfully on Vercel.

## Refactor rules
1. Do not change the approved Tarjoukset/Tilaukset visual layout.
2. Do not remove a legacy override until every behavior it contributes is accounted for.
3. Keep Hintalaskuri available from offer/order product editing.
4. Preserve Finnish dates, VAT 25.5/0, 50 € start fee, 6 € invoice fee and 21-day payment term.
5. Preserve quote → order → production → ready → invoice review → invoiced workflow.
6. Production is updated only after preview verification.

## Remaining technical debt
`app-base.html` still contains accumulated legacy override chains for core functions. These must be consolidated incrementally because later wrappers capture earlier function references; bulk deletion would break behavior.
