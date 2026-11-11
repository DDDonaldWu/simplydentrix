# Equipment & consumables

Open `equipment-consumables.html` using the existing static-site preview command. No build step or new runtime dependencies are required.

## Included

- Sixteen supplied product images stored locally, with product names derived from source filenames.
- Search, category filter, alphabetical sort, product review/details dialogs, and an honest empty customer-review state.
- Inquiry cart with quantities (1–99), removal, browser persistence, cross-tab synchronization, and recovery from invalid/unavailable storage.
- Payment information dialog and a product inquiry that opens the visitor’s email application. The visitor must send it themselves. Nothing is submitted automatically.
- Links from all sixteen existing pages.

## Launch inputs still needed

The owner selected **Decide later** for the payment provider. Online payment is intentionally disabled. This page does not create orders or charge customers.

Confirm names, descriptions, implant compatibility, dimensions, SKUs/variants, pack quantities, prices/currency, stock, and shipping/tax/return policies. The Drive folder supplied photos only. Catalog prices are null, rather than fictitious or zero; cart totals say “Pricing pending.” Category assignments are organizational drafts for review.

Once a provider is chosen, implement a backend checkout endpoint that accepts product identifiers and quantities, obtains authoritative prices and stock server-side, creates a hosted checkout session, and verifies signed payment webhooks before marking orders paid. Keep private keys off GitHub and out of browser scripts. GitHub Pages alone cannot run this backend. Use the provider’s sandbox to test successful, cancelled, and failed payments, tax/shipping totals, duplicate webhook delivery, and order confirmation before launch. Do not replace this with a browser-generated “paid” message.

Customer review collection and moderation also need a backend/provider. No fictional reviews or ratings are included. Product details are available for product review now.

## Validation

- `node --check assets/js/equipment-consumables.js`
- `node --test tests/equipment-logic.test.cjs` — 4 passing tests covering catalog/filter logic, cart quantities/removal/persistence, payment inquiry text, corrupt storage, storage errors, and cross-tab changes. Uses a small DOM stub; this does not validate visual layout or browser focus behavior.
- Static check: all sixteen original pages link to the new page; local page assets exist; HTML IDs are unique.
- Product contact sheet inspected against supplied files.
- Browser test: `node tests/equipment.spec.cjs` with Playwright installed and the site served on port 8000. Set `CHROMIUM_PATH` for a local Chromium executable if needed. Browser execution in this workspace was blocked by its Unix-socket restriction, so responsive screenshots, browser interactions, and visual layout remain to be checked on a normal browser before merge.

Changes belong on the feature branch for review. Do not merge or deploy until the owner reviews the page and remaining launch requirements.
