'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Copy, CreditCard, Loader2, ShoppingBag, Zap } from 'lucide-react'
import { cartTotal, clearCart, readCart, type CartItem } from '@/lib/cart'
import { formatVnd } from '@/lib/shop'
import SiteHeader from '@/app/_ui/SiteHeader'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
      }`}
    >
      <Copy className="w-3 h-3" />
      {copied ? 'Đã copy' : label}
    </button>
  )
}

export default function CheckoutClient({ couponCode }: { couponCode?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<{ id: string; code: string; totalVnd: number } | null>(null)

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
          couponCode,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Tạo đơn thất bại')

      setOrder({ id: data.id, code: data.code, totalVnd: data.totalVnd || total })
      clearCart()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Có lỗi xảy ra'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-violet-500/50'

  const transferContent = order ? `Thanh toan don ${order.code}` : ''

  if (order) {
    return (
      <div className="min-h-screen bg-slate-950">
        <SiteHeader />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}
            >
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Đặt hàng thành công!</h1>
            <p className="text-slate-400">Vui lòng chuyển khoản để hoàn tất đơn hàng</p>
          </div>

          {/* Order Code */}
          <div
            className="p-6 rounded-2xl mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-slate-400 mb-2">Mã đơn hàng</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-white">{order.code}</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium text-amber-400 bg-amber-400/10">
                Chờ thanh toán
              </span>
            </div>
          </div>

          {/* Payment Info */}
          {payment && payment.active && (
            <div
              className="p-6 rounded-2xl mb-6"
              style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-violet-400" />
                <h2 className="text-xl font-bold text-white">Thông tin chuyển khoản</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code */}
                {payment.qrImageUrl && (
                  <div className="flex flex-col items-center">
                    <div
                      className="p-4 rounded-xl mb-4"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <img
                        src={payment.qrImageUrl}
                        alt="QR Code"
                        className="w-48 h-48 object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-slate-400">Quét mã để thanh toán</p>
                  </div>
                )}

                {/* Bank Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Ngân hàng</p>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-white">{payment.bankName}</span>
                      <CopyButton text={payment.bankName} label="Copy" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400 mb-1">Số tài khoản</p>
                    <div className="flex items-center">
                      <span className="text-lg font-mono text-white">{payment.accountNumber}</span>
                      <CopyButton text={payment.accountNumber} label="Copy" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400 mb-1">Chủ tài khoản</p>
                    <span className="text-lg text-white">{payment.accountName}</span>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400 mb-1">Số tiền</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-white">{formatVnd(order.totalVnd)}</span>
                      <CopyButton text={String(order.totalVnd)} label="Copy" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400 mb-1">Nội dung CK</p>
                    <div className="flex items-center">
                      <span className="text-lg font-mono text-violet-400">{transferContent}</span>
                      <CopyButton text={transferContent} label="Copy" />
                    </div>
                    <p className="text-xs text-amber-400 mt-1">* Vui lòng ghi đúng nội dung chuyển khoản</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/account/orders"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              Xem đơn hàng
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
            >
              <Zap className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại giỏ hàng
        </Link>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Left: Form */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Thông tin thanh toán</h1>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                {error}
              </div>
            )}

            <div
              className="p-6 rounded-2xl space-y-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div>
                <label className="block text-sm text-slate-400 mb-2">Họ và tên *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Zalo</label>
                  <input
                    type="text"
                    value={zalo}
                    onChange={(e) => setZalo(e.target.value)}
                    className={inputClass}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Ghi chú</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.05)', minHeight: '100px' }}
                  placeholder="Ghi chú về đơn hàng (tùy chọn)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Đơn hàng</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(139, 92, 246, 0.1)' }}
                    >
                      <ShoppingBag className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{item.name}</p>
                      <p className="text-sm text-slate-400">x{item.qty}</p>
                    </div>
                    <span className="text-white">{formatVnd(item.priceVnd * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                className="border-t pt-4 mb-6"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tổng cộng</span>
                  <span className="text-3xl font-bold text-white">{formatVnd(total)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={submit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Đặt hàng
                  </>
                )}
              </button>

              {/* Trust */}
              <div className="mt-6 text-center text-sm text-slate-500">
                <p>🔒 Thanh toán an toàn • Bảo hành 100%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
