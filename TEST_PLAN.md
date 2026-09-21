# CopySet ERP — release test plan

## Automated validation

Run:

```bash
node scripts/validate.mjs
```

The command checks JavaScript syntax, CSS integrity, runtime references, required workflow labels and accidental debug markers.

## Manual acceptance paths

### Offer

1. Create an offer with an existing customer.
2. Add at least two products and two `lisätyö` rows.
3. Calculate a price and save.
4. Verify the A4 preview contains products, extra work and totals.
5. Close, reopen, edit and save again.
6. Send the offer and return to the list.
7. Mark customer approval manually and create the order.

### Order and production

1. Open a `Vahvistettu` order.
2. Verify only this stage offers `Tilausvahvistus`.
3. Start production and edit the work card.
4. Print `Työkortti`; verify no prices are shown.
5. Mark production ready.
6. Open `Lähete` and `Lähetyslappu`.
7. Open `Käteiskuitti`, select each payment method and verify the A4 receipt. Confirm that printing a receipt does not change the order status.
8. Move to invoice review and approve the invoice.
9. Verify the final status is `Laskutettu` and no confirmation button is shown.
10. Reopen one order in each completed state: `Valmis`, `Laskutusvalmis` and `Laskutettu`.
11. Verify `Käteiskuitti` remains available in all three states and printing it does not change the order status.

### Navigation and persistence

1. Close every modal without saving.
2. Return from every full-page view.
3. Verify the list returns to the previous scroll position.
4. Refresh the browser and confirm saved demo data remains.

### Responsive layouts

Test at 360, 390, 430, 768 and 1366 pixel widths:

- no page-level horizontal scrolling
- navigation remains reachable
- lists become cards on phones
- buttons are at least 40 pixels high
- A4 previews fit the viewport on screen
- printed documents remain physical A4
- fixed action bars do not cover content
- document status labels never cover the logo or title
