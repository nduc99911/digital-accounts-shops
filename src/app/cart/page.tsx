'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { cartTotal, readCart, writeCart, type CartItem } from '@/lib/cart'
import { formatVnd } from '@/lib/shop'
import { useToast } from '@/app/_ui/ToastProvider'

// Animated number component for price updates
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true)
      const startValue = displayValue
      const endValue = value
      const duration = 300
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress)
        setDisplayValue(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [value, displayValue])

  return (
    <span className={`transition-all duration-300 ${isAnimating ? 'scale-110 text-violet-600' : ''}`}>
      {formatVnd(displayValue)}
    </span>
  )
}

// Cart item card component with animations
function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  index,
}: {
  item: CartItem
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
  index: number
}) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => onRemove(item.productId), 300)
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 ${
        isRemoving ? 'animate-slide-out-left opacity-0' : 'animate-fade-in-up'
      }`}
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center gap-5">
          {/* Product icon/placeholder */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30">
            <svg className="h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>

          {/* Product info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {item.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Đơn giá: <span className="font-medium text-slate-700 dark:text-slate-300">{formatVnd(item.priceVnd)}</span>
            </p>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => onDecrease(item.productId)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition-all hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-violet-900/30 dark:hover:text-violet-400"
                aria-label="Giảm số lượng"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="min-w-[2rem] text-center font-semibold text-slate-900 dark:text-slate-100">
                {item.qty}
              </span>
              <button
                onClick={() => onIncrease(item.productId)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition-all hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-violet-900/30 dark:hover:text-violet-400"
                aria-label="Tăng số lượng"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Line total */}
            <div className="hidden min-w-[100px] text-right sm:block">
              <div className="font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {formatVnd(item.priceVnd * item.qty)}
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
              aria-label="Xóa sản phẩm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile line total */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:hidden dark:border-slate-800">
          <span className="text-sm text-slate-500">Tạm tính</span>
          <span className="font-bold text-violet-600 dark:text-violet-400">
            {formatVnd(item.priceVnd * item.qty)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Empty state component with illustration
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Animated illustration */}
      <div className="relative mb-8">
        {/* Background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-violet-200/50 to-fuchsia-200/50 animate-pulse-glow" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-300/30 to-fuchsia-300/30 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Shopping cart icon */}
        <div className="relative animate-float-slow">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-2xl shadow-violet-500/30">
            <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          {/* Floating elements */}
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-lg">
            <span className="text-sm font-bold text-white">0</span>
          </div>
        </div>
      </div>

      {/* Text content */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Giỏ hàng đang trống
      </h2>
      <p className="mt-3 max-w-sm text-center text-slate-500 dark:text-slate-400">
        Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng để thanh toán
      </p>

      {/* CTA Button */}
      <Link
        href="/"
        className="mt-8 btn-gradient inline-flex items-center gap-2 group"
      >
        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Tiếp tục mua sắm
      </Link>
    </div>
  )
}

// Summary card component
function OrderSummary({ total, itemCount }: { total: number; itemCount: number }) {
  return (
    <div className="sticky top-24 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
      <div className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
          <div className="absolute right-1/4 bottom-0 h-12 w-12 rounded-full bg-white/10 blur-lg" />
          <h2 className="relative flex items-center gap-2 text-lg font-bold text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tóm tắt đơn hàng
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Số lượng sản phẩm</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Phí vận chuyển</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Miễn phí</span>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Tổng cộng</span>
                <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  <AnimatedPrice value={total} />
                </span>
              </div>
              <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                Đã bao gồm VAT
              </p>
            </div>
          </div>

          {/* Checkout button */}
          <Link
            href="/checkout"
            className="mt-6 btn-gradient-emerald btn-gradient flex w-full items-center justify-center gap-2 group"
          >
            <span>Tiến hành thanh toán</span>
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Continue shopping link */}
          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Trust badges */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Bảo mật SSL
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Bảo hành đầy đủ
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  // Load cart on client side
  useEffect(() => {
    setItems(readCart())
    setIsLoading(false)
  }, [])

  const total = useMemo(() => cartTotal(items), [items])
  const itemCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items])

  const inc = useCallback((productId: string) => {
    const item = items.find((it) => it.productId === productId)
    const next = items.map((it) => (it.productId === productId ? { ...it, qty: it.qty + 1 } : it))
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã tăng số lượng "${item.name}"`, 'info', 1500)
    }
  }, [items, showToast])

  const dec = useCallback((productId: string) => {
    const item = items.find((it) => it.productId === productId)
    const next = items
      .map((it) => (it.productId === productId ? { ...it, qty: Math.max(1, it.qty - 1) } : it))
      .filter((it) => it.qty > 0)
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã giảm số lượng "${item.name}"`, 'info', 1500)
    }
  }, [items, showToast])

  const remove = useCallback((productId: string) => {
    const item = items.find((it) => it.productId === productId)
    const next = items.filter((it) => it.productId !== productId)
    setItems(next)
    writeCart(next)
    if (item) {
      showToast(`Đã xóa "${item.name}" khỏi giỏ hàng`, 'success', 2000)
    }
  }, [items, showToast])

  // Simple cart header for client component
  const CartHeader = () => (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0 group">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="hidden text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent sm:block">
              Shop
            </span>
          </div>
        </Link>
        <div className="flex-1" />
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-violet-100 hover:text-violet-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tiếp tục mua sắm
        </Link>
      </div>
    </header>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <CartHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="text-sm text-slate-500">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CartHeader />

      {/* Page header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-cyan-600/5" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Giỏ hàng</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {itemCount > 0 ? `${itemCount} sản phẩm trong giỏ hàng` : 'Khám phá sản phẩm của chúng tôi'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl dark:bg-slate-900/60 dark:border-white/10">
            <EmptyCart />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  onIncrease={inc}
                  onDecrease={dec}
                  onRemove={remove}
                  index={index}
                />
              ))}
            </div>

            {/* Order summary */}
            <OrderSummary total={total} itemCount={itemCount} />
          </div>
        )}
      </main>
    </div>
  )
}
