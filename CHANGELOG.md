# Changelog

## 1.0.1 — 2026-09-21

- added printable A4 `Käteiskuitti` with cash, card and MobilePay payment methods
- ensured receipt printing never changes the order workflow status
- fixed the receipt payment dialog stacking behind the full-page order view
- moved ready, invoice-review and invoiced status labels away from document headings
- extended release validation and acceptance tests for the receipt workflow

## 1.0.0 — 2026-09-20

- consolidated the active application into one JavaScript and one CSS runtime bundle
- stabilized offer editing, extra-work prices and customer selection
- separated customer order confirmation from internal order documents
- standardized A4 offer, order, production, delivery and invoice views
- restored the complete mobile stylesheet and phone card layouts
- preserved back/close behavior and list scroll position
- added release validation and customer handover documentation
