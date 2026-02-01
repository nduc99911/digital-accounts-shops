# Project decisions (no secrets)

## Goal
- Mimic DivineShop UI/UX as close as possible.

## Key requirements
- Product: list price + sale price + stock + sold.
- Delivery: auto-fulfillment for digital goods (account/key) after payment success.
- Payment: bank transfer now; auto-confirm planned.
- Database: Postgres.

## Security baseline
- Do not commit secrets.
- Admin/customer auth uses cookies; Next.js 16 requires async cookies().

## Next focus
- Category listing + search/filter/sort/pagination.
- UI parity improvements for listing/product/cart/checkout.
