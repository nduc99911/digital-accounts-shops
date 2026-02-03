# BA Status — digital-accounts-shops (DivineShop-like)

## Completed
- Rà soát trạng thái repo hiện tại (Storefront, Customer auth, Admin CRUD, Orders, Payment settings, StockItem + auto-fulfillment khi SUCCESS).
- Lập backlog ưu tiên (Epics → User stories → Acceptance criteria) bao phủ: UI parity, pricing/stock/sold, customer auth & orders, checkout/bank transfer UX, auto-confirm payment (planned), auto-fulfillment, admin ops, deploy VPS + Postgres, NFR (security/logging/backups).

## In-progress
- Chuẩn hoá scope “UI parity DivineShop”: xác định checklist màn hình/luồng chi tiết (Home/Category/Product/Cart/Checkout/Order detail/Admin screens).

## Blockers (max 1–2)
- ✅ Đã có mẫu tham chiếu DivineShop: http://divineshop.vn — cần audit và lập checklist UI parity chi tiết.
- ✅ Đã tích hợp SePay (webhook auto-confirm, payment settings, auto-fulfillment).

## Next 3
1. Chốt checklist UI parity theo màn hình + component (bao gồm search thật, listing + pagination/sort, product detail parity).
2. Đặc tả luồng checkout chuyển khoản: nội dung CK theo mã đơn, copy actions, order detail page cho khách.
3. Đặc tả admin ops nâng cấp: order detail + audit log, quản lý stock import/export + reconcile stock.

## ETA
- Backlog ưu tiên (phiên bản v1): Hoàn tất.
- Đặc tả UI parity checklist + luồng checkout chi tiết: 1–2 ngày làm việc sau khi nhận link/mẫu DivineShop.
- Đặc tả auto-confirm payment (planned) theo provider: 1–2 ngày làm việc sau khi chốt provider/API.
