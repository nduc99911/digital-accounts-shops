'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { cartTotal, clearCart, readCart, type CartItem } from '@/lib/cart'
import { formatVnd } from '@/lib/shop'

export default function CheckoutPage() {
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
    } catch (e: any) {
      setError(e?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
            <div className="text-lg font-bold">Đặt hàng thành công</div>
            <Link href="/" className="text-sm text-slate-600 hover:underline">Về trang chủ</Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl p-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-600">Mã đơn của bạn:</div>
            <div className="mt-2 text-2xl font-bold">{order.code}</div>
            <div className="mt-4 text-sm text-slate-600">
              Trạng thái hiện tại: <span className="font-medium">Chờ thanh toán</span>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Gợi ý: chuyển khoản theo thông tin/QR trên trang (sẽ được thêm ở bước Payment Settings trong Admin).
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <div className="text-lg font-bold">Checkout</div>
          <Link href="/cart" className="text-sm text-slate-600 hover:underline">← Quay lại giỏ</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        {items.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="font-medium">Giỏ hàng trống</div>
            <Link href="/" className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Chọn sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-3 font-semibold">Thông tin khách</div>

              <div className="grid gap-3">
                <label className="grid gap-1">
                  <div className="text-xs text-slate-600">Họ tên *</div>
                  <input className="rounded-md border p-2" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                </label>

                <label className="grid gap-1">
                  <div className="text-xs text-slate-600">SĐT</div>
                  <input className="rounded-md border p-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>

                <label className="grid gap-1">
                  <div className="text-xs text-slate-600">Zalo</div>
                  <input className="rounded-md border p-2" value={zalo} onChange={(e) => setZalo(e.target.value)} />
                </label>

                <label className="grid gap-1">
                  <div className="text-xs text-slate-600">Email</div>
                  <input className="rounded-md border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label className="grid gap-1">
                  <div className="text-xs text-slate-600">Ghi chú</div>
                  <textarea className="rounded-md border p-2" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                </label>

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                  disabled={loading}
                  onClick={submit}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loading ? 'Đang tạo đơn...' : 'Tạo đơn hàng'}
                </button>

                <div className="text-xs text-slate-500">
                  Lưu ý: phần hiển thị QR/chuyển khoản sẽ lấy từ Admin (Payment Settings) — mình sẽ làm tiếp ở commit sau.
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 font-semibold">Tóm tắt</div>
                <div className="grid gap-2 text-sm">
                  {items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between">
                      <div className="text-slate-700">
                        {it.name} <span className="text-xs text-slate-500">x{it.qty}</span>
                      </div>
                      <div className="font-medium">{formatVnd(it.priceVnd * it.qty)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <div className="text-sm text-slate-600">Tổng</div>
                  <div className="text-lg font-semibold">{formatVnd(total)}</div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 font-semibold">Thanh toán chuyển khoản</div>

                {payment === null ? (
                  <div className="text-sm text-slate-500">Đang tải thông tin thanh toán...</div>
                ) : payment.active === false ? (
                  <div className="text-sm text-amber-700">
                    Chưa cấu hình thanh toán. Vui lòng liên hệ shop hoặc quay lại sau.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {payment.qrImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={payment.qrImageUrl} alt="QR" className="w-full max-w-[320px] rounded-md border" />
                    ) : (
                      <div className="rounded-md border bg-slate-50 p-3 text-sm text-slate-600">
                        (Chưa có ảnh QR — admin có thể thêm link QR trong Admin → Thanh toán)
                      </div>
                    )}

                    <div className="text-sm">
                      <div><span className="text-slate-500">Ngân hàng:</span> <span className="font-medium">{payment.bankName}</span></div>
                      <div><span className="text-slate-500">Số tài khoản:</span> <span className="font-medium">{payment.accountNumber}</span></div>
                      <div><span className="text-slate-500">Chủ tài khoản:</span> <span className="font-medium">{payment.accountName}</span></div>
                    </div>

                    {payment.note ? <div className="text-xs text-slate-500">Ghi chú: {payment.note}</div> : null}

                    <div className="text-xs text-slate-500">
                      Sau khi chuyển khoản, đơn sẽ ở trạng thái <b>Chờ thanh toán</b>. Admin sẽ kiểm tra và chuyển sang <b>Thành công</b>.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
