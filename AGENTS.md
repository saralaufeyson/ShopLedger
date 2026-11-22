# Repository Guidelines

## Stack

- Node.js using CommonJS modules (`require` / `module.exports`).
- Express 4 with `body-parser` for JSON requests.
- Static HTML, CSS, and browser JavaScript in `public/`.
- Synchronous JSON persistence in `data/db.json` through `lib/store.js`.

## Module map

- `routes/customers.js` lists customers and records Khata settlements.
- `routes/orders.js` lists, reads, creates, and cancels orders.
- `routes/products.js` lists products and active coupons.
- `routes/reports.js` serves the dashboard, GST reconciliation, pricing preview, and admin export.
- `lib/coupons.js` normalizes, validates, lists, and calculates coupon discounts.
- `lib/dates.js` formats dates, normalizes date keys, and derives fiscal years.
- `lib/inventory.js` finds products, checks/reserves/releases stock, and summarizes inventory.
- `lib/invoice.js` recomputes invoice figures and renders printable invoice HTML.
- `lib/ledger.js` reads customer balances and records Khata charges, reversals, and settlements.
- `lib/orders.js` adds, finds, cancels, and filters orders.
- `lib/pricing.js` calculates subtotal, coupon discount, GST, and checkout totals.
- `lib/reports.js` builds dashboard summaries and invoice-versus-ledger reconciliation.
- `lib/store.js` reads/writes `data/db.json` and appends audit entries.
- `lib/tax.js` resolves GST rates and splits tax into CGST and SGST.

## Commands

- Start the app: `npm start`
- Run tests: `node --test`

## Rules

1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; they use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket

Invoice total and GST breakdown do not match what the customer was billed.

Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
