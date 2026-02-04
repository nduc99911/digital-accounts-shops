'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Shield, Zap } from 'lucide-react'
import { cartTotal, readCart, writeCart, type CartItem } from '@/lib/cart'
import { formatVnd } from '@/lib/shop'
import { useToast } from '@/app/_ui/ToastProvider'
import SiteHeader from '@/app/_ui/SiteHeader'

function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div
      className="flex gap-4 p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(139, 92, 246, 0.1)' }}
      >
        <ShoppingBag className="w-8 h-8 text-violet-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{item.name}</h3>
        <p className="text-sm text-slate-400">{formatVnd(item.priceVnd)} / sản phẩm</p>

        <div className="flex items-center gap-4 mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrease(item.productId)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium text-white">{item.qty}</span>
            <button
              onClick={() => onIncrease(item.productId)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.productId)}
            className="text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-bold text-white">{formatVnd(item.priceVnd * item.qty)}</p>
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div
        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ background: 'rgba(139, 92, 246, 0.1)' }}
      >
        <ShoppingBag className="w-12 h-12 text-violet-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng trống</h2>
      <p className="text-slate-400 mb-8">Hãy thêm sản phẩm vào giỏ hàng để thanh toán</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Tiếp tục mua sắm
      </Link>
    </div>
  )
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    setItems(readCart())
    setIsLoading(false)
  }, [])

  const total = useMemo(() => cartTotal(items), [items])
  const itemCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items])

  const inc = useCallback((productId: string) => {
    const next = items.map((it) =>
      it.productId === productId ? { ...it, qty: it.qty + 1 } : it
    )
    setItems(next)
    writeCart(next)
  }, [items])

  const dec = useCallback((productId: string) => {
    const next = items
      .map((it) =>
        it.productId === productId ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
      .filter((it) => it.qty > 0)
    setItems(next)
    writeCart(next)
  }, [items])

  const remove = useCallback((productId: string) => {
    const item = items.find((it) => it.productId === productId)
    const next = items.filter((it) => it.productId !== productId)
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã xóa "${item.name}"`, 'success', 1500)
    }
  }, [items, showToast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <SiteHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Tiếp tục mua sắm
        </Link>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Items */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white mb-6">
                Giỏ hàng ({itemCount})
              </h1>
              {items.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  onIncrease={inc}
                  onDecrease={dec}
                  onRemove={remove}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-400">
                    <span>Tạm tính</span>
                    <span>{formatVnd(total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Phí vận chuyển</span>
                    <span className="text-emerald-400">Miễn phí</span>
                  </div>
                  <div
                    className="border-t pt-4 flex justify-between"
                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <span className="text-white font-medium">Tổng cộng</span>
                    <span className="text-2xl font-bold text-white">{formatVnd(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
                >
                  <Zap className="w-5 h-5" />
                  Thanh toán ngay
                </Link>

                {/* Trust */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Bảo mật
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Giao ngay
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
