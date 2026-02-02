'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { cartTotal, clearCart, readCart, type CartItem } from '@/lib/cart'
import { formatVnd } from '@/lib/shop'

export default function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<{ code: string } | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [zalo, setZalo] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  const [payment, setPayment] = useState<
    | {
        active: true
        bankName: string
        accountNumber: string
        accountName: string
        note?: string | null
        qrImageUrl?: string | null
      }
    | { active: false }
    | null
  >(null)

  useEffect(() => {
    setItems(readCart())
    fetch('/api/settings/payment')
      .then((r) => r.json())
      .then((d) => setPayment(d))
      .catch(() => setPayment({ active: false }))
  }, [])

  const total = useMemo(() => cartTotal(items), [items])

  async function submit() {
    setError(null)
    if (!customerName.trim()) return setError('Vui lòng nhập tên')
    if (items.length === 0) return setError('Giỏ hàng trống')

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          zalo,
          email,
          note,
          items,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Tạo đơn thất bại')

      setOrder({ code: data.code })
      clearCart()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Có lỗi xảy ra'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'rounded-md bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 ' +
    'dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:focus:ring-blue-500'

  if (order) {
    return (
      <main className="mx-auto grid max-w-4xl gap-4 p-4">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Đặt hàng thành công</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Vui lòng chuyển khoản để shop xác nhận.</div>
            </div>
            <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
              Về trang chủ
            </Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <div className="text-sm text-slate-600 dark:text-slate-300">Mã đơn của bạn:</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{order.code}</div>
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Trạng thái hiện tại: <span className="font-semibold text-amber-700 dark:text-amber-400">Chờ thanh toán</span>
          </div>
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Gợi ý: chuyển khoản theo thông tin/QR trên trang (sẽ được thêm ở bước Payment Settings trong Admin).
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-4 p-4">
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Checkout</h1>
          <Link href="/cart" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
            ← Quay lại giỏ
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <div className="font-medium text-slate-900 dark:text-slate-100">Giỏ hàng trống</div>
          <Link
            href="/"
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Chọn sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Thông tin khách</div>

            <div className="grid gap-3">
              <label className="grid gap-1">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Họ tên *</div>
                <input className={inputClass} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </label>

              <label className="grid gap-1">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">SĐT</div>
                <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>

              <label className="grid gap-1">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Zalo</div>
                <input className={inputClass} value={zalo} onChange={(e) => setZalo(e.target.value)} />
              </label>

              <label className="grid gap-1">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email</div>
                <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label className="grid gap-1">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Ghi chú</div>
                <textarea className={inputClass} rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>

              {error ? <div className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</div> : null}

              <button
                disabled={loading}
                onClick={submit}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? 'Đang tạo đơn...' : 'Tạo đơn hàng'}
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Lưu ý: phần hiển thị QR/chuyển khoản sẽ lấy từ Admin (Payment Settings).
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
              <div className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Tóm tắt</div>
              <div className="grid gap-2 text-sm">
                {items.map((it) => (
                  <div key={it.productId} className="flex items-center justify-between">
                    <div className="text-slate-700 dark:text-slate-200">
                      {it.name} <span className="text-xs text-slate-500 dark:text-slate-400">x{it.qty}</span>
                    </div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{formatVnd(it.priceVnd * it.qty)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-white/10">
                <div className="text-sm text-slate-600 dark:text-slate-300">Tổng</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatVnd(total)}</div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
              <div className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Thanh toán chuyển khoản</div>

              {payment === null ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">Đang tải thông tin thanh toán...</div>
              ) : payment.active === false ? (
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Chưa cấu hình thanh toán. Vui lòng liên hệ shop hoặc quay lại sau.
                </div>
              ) : (
                <div className="grid gap-3">
                  {payment.qrImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={payment.qrImageUrl}
                      alt="QR"
                      className="w-full max-w-[320px] rounded-md border border-slate-200 dark:border-white/10"
                    />
                  ) : (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                      (Chưa có ảnh QR — admin có thể thêm link QR trong Admin → Thanh toán)
                    </div>
                  )}

                  <div className="text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Ngân hàng:</span>{' '}
                      <span className="font-medium text-slate-900 dark:text-slate-100">{payment.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Số tài khoản:</span>{' '}
                      <span className="font-medium text-slate-900 dark:text-slate-100">{payment.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Chủ tài khoản:</span>{' '}
                      <span className="font-medium text-slate-900 dark:text-slate-100">{payment.accountName}</span>
                    </div>
                  </div>

                  {payment.note ? <div className="text-xs text-slate-500 dark:text-slate-400">Ghi chú: {payment.note}</div> : null}

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Sau khi chuyển khoản, đơn sẽ ở trạng thái <b>Chờ thanh toán</b>. Admin sẽ kiểm tra và chuyển sang <b>Thành công</b>.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
