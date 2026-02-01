# Assistant setup / memory (no secrets)

Mục tiêu: lưu lại các ghi chú vận hành + quyết định kỹ thuật để người khác pull repo là hiểu ngay.

> Không commit secrets: token, password thật, `.env` thật, key API…

## Repo / Branch
- Repo: `nduc99911/digital-accounts-shops`
- Branch chính: `main`

## Tech stack
- Next.js (App Router)
- Prisma
- Database: **Postgres** (theo yêu cầu)

## ENV (mẫu)
Xem `.env.example`.
Các biến quan trọng:
- `DATABASE_URL=postgresql://...`
- `ADMIN_USERNAME=...`
- `ADMIN_PASSWORD=...`

## Admin
- URL: `/admin/login`
- Admin được bootstrap khi gọi `/api/admin/bootstrap` (trang login gọi sẵn).
- Nếu đổi `ADMIN_PASSWORD` nhưng DB đã có admin cũ: dùng endpoint dev reset
  - `POST /api/admin/reset?key=dev`

## Payment settings (bank transfer)
- Admin config tại: `/admin/settings/payment`
- Checkout đọc public endpoint: `GET /api/settings/payment`

## Orders status
- `PENDING_PAYMENT` → `SUCCESS`
- Khi order chuyển `SUCCESS` sẽ chạy auto-fulfillment (nếu đủ kho).

## Auto-fulfillment (giao tự động)
- Admin nhập kho theo sản phẩm: `/admin/products/[id]/stock`
  - Paste nhiều dòng, mỗi dòng 1 account/key
- Khi admin mark order `SUCCESS`:
  - hệ thống allocate StockItem theo FIFO
  - tạo OrderFulfillment
  - giảm `stockQty`, tăng `soldQty`
- Customer xem hàng đã cấp tại: `/account/orders`

## QA/BA status files
- `qa_status.md`
- `ba_status.md`

## Planned (tomorrow)
- Auto-confirm payment (đối soát giao dịch / webhook). Cần chốt provider.

## Notes
- Khi làm tính năng mới: commit nhỏ, push ngay, kèm cách test.
