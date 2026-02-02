'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { cartTotal, readCart, writeCart, type CartItem } from '@/lib/cart'
import { formatVnd } from '@/lib/shop'
import { useToast } from '@/app/_ui/ToastProvider'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(() => readCart())
  const { showToast } = useToast()

  const total = useMemo(() => cartTotal(items), [items])

  function inc(productId: string) {
    const item = items.find((it) => it.productId === productId)
    const next = items.map((it) => (it.productId === productId ? { ...it, qty: it.qty + 1 } : it))
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã tăng số lượng "${item.name}"`, 'info', 1500)
    }
  }

  function dec(productId: string) {
    const item = items.find((it) => it.productId === productId)
    const next = items
      .map((it) => (it.productId === productId ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
      .filter((it) => it.qty > 0)
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã giảm số lượng "${item.name}"`, 'info', 1500)
    }
  }

  function remove(productId: string) {
    const item = items.find((it) => it.productId === productId)
    const next = items.filter((it) => it.productId !== productId)
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã xóa "${item.name}" khỏi giỏ hàng`, 'success', 2000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <Link href="/" className="text-lg font-bold">Giỏ hàng</Link>
          <Link href="/" className="text-sm text-slate-600 hover:underline">← Tiếp tục mua</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        {items.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="font-medium">Giỏ hàng đang trống</div>
            <div className="mt-2 text-sm text-slate-600">Chọn sản phẩm rồi quay lại đây để thanh toán.</div>
            <Link href="/" className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-left">
                  <tr>
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3">Giá</th>
                    <th className="p-3">SL</th>
                    <th className="p-3">Tạm tính</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.productId} className="border-t">
                      <td className="p-3 font-medium">{it.name}</td>
                      <td className="p-3">{formatVnd(it.priceVnd)}</td>
                      <td className="p-3">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => dec(it.productId)} className="h-8 w-8 rounded-md border">-</button>
                          <span className="min-w-6 text-center">{it.qty}</span>
                          <button onClick={() => inc(it.productId)} className="h-8 w-8 rounded-md border">+</button>
                        </div>
                      </td>
                      <td className="p-3">{formatVnd(it.priceVnd * it.qty)}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => remove(it.productId)} className="text-xs text-red-600 hover:underline">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
              <div className="text-sm text-slate-600">Tổng cộng</div>
              <div className="text-lg font-semibold text-slate-900">{formatVnd(total)}</div>
            </div>

            <div className="flex justify-end">
              <Link href="/checkout" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                Tiến hành thanh toán
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
