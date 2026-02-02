import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'
import { formatVnd } from '@/lib/shop'
import SiteHeader from '../../_ui/SiteHeader'

// Status badge component with gradient colors
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    SUCCESS: {
      label: 'Thành công',
      className: 'status-success',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    PENDING_PAYMENT: {
      label: 'Chờ thanh toán',
      className: 'status-pending',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    CANCELLED: {
      label: 'Đã hủy',
      className: 'status-cancelled',
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    PROCESSING: {
      label: 'Đang xử lý',
      className: 'status-processing',
      icon: (
        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  }

  const config = configs[status] || configs.PENDING_PAYMENT

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

// Empty state component
function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Animated illustration */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-violet-200/50 to-cyan-200/50 animate-pulse-glow" />
        </div>
        <div className="relative animate-float-slow">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-2xl shadow-violet-500/30">
            <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Bạn chưa có đơn hàng
      </h2>
      <p className="mt-3 max-w-sm text-center text-slate-500 dark:text-slate-400">
        Hãy khám phá các sản phẩm tuyệt vờii và đặt hàng ngay để nhận ưu đãi đặc biệt
      </p>

      <Link
        href="/"
        className="mt-8 btn-gradient inline-flex items-center gap-2 group"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Mua sắm ngay
      </Link>
    </div>
  )
}

// Order card component with animations
function OrderCard({
  order,
  index,
}: {
  order: {
    id: string
    code: string
    status: string
    createdAt: Date
    totalVnd: number
    items: {
      id: string
      qty: number
      unitVnd: number
      product: { name: string; imageUrl: string | null }
    }[]
    fulfillments: { id: string; value: string; product: { name: string } }[]
  }
  index: number
}) {
  const hasDeliverables = order.status === 'SUCCESS' && order.fulfillments.length > 0

  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent pointer-events-none" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Order icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30">
              <svg className="h-7 w-7 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{order.code}</h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {new Date(order.createdAt).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Total price */}
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Tổng tiền</p>
            <p className="text-xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {formatVnd(order.totalVnd)}
            </p>
          </div>
        </div>

        {/* Products list */}
        <div className="mt-6 space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl bg-slate-50/80 p-4 dark:bg-slate-800/50"
            >
              {/* Product image placeholder */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                {item.product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {item.product.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  SL: {item.qty} × {formatVnd(item.unitVnd)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatVnd(item.unitVnd * item.qty)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/account/orders/${order.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:bg-violet-100 hover:scale-105 active:scale-95 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem chi tiết
          </Link>

          {order.status === 'PENDING_PAYMENT' && (
            <Link
              href={`/checkout?order=${order.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-105 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Thanh toán ngay
            </Link>
          )}
        </div>

        {/* Deliverables section for completed orders */}
        {hasDeliverables && (
          <div className="mt-6 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-5 dark:border-emerald-800/60 dark:from-emerald-900/20 dark:to-teal-900/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Thông tin đã cấp</h4>
            </div>
            <div className="grid gap-3">
              {order.fulfillments.slice(0, 2).map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl bg-white/80 p-4 shadow-sm dark:bg-slate-900/50"
                >
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {f.product.name}
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-700 break-all dark:text-slate-300">
                    {f.value}
                  </p>
                </div>
              ))}
              {order.fulfillments.length > 2 && (
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-center text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  +{order.fulfillments.length - 2} sản phẩm khác →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Stats card component
function StatCard({
  label,
  value,
  icon,
  gradient,
  delay,
}: {
  label: string
  value: string
  icon: React.ReactNode
  gradient: string
  delay: number
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/30 p-5 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full ${gradient} opacity-20 blur-xl`} />
      <div className="relative flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default async function AccountOrders() {
  const user = await getCurrentCustomer()
  if (!user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { name: true, imageUrl: true } } } },
      fulfillments: { include: { product: { select: { name: true } } } },
    },
    take: 50,
  })

  // Calculate stats
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === 'SUCCESS').length
  const pendingOrders = orders.filter((o) => o.status === 'PENDING_PAYMENT').length
  const totalSpent = orders
    .filter((o) => o.status === 'SUCCESS')
    .reduce((sum, o) => sum + o.totalVnd, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />

      {/* Page header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-cyan-600/5" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Đơn hàng của tôi</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>

            <form action="/api/auth/logout" method="post" className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {orders.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl dark:bg-slate-900/60 dark:border-white/10">
            <EmptyOrders />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Orders list */}
            <div className="space-y-5">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>

            {/* Sidebar with stats */}
            <div className="space-y-5">
              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <StatCard
                  label="Tổng đơn hàng"
                  value={String(totalOrders)}
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-violet-500 to-fuchsia-600"
                  delay={0.1}
                />
                <StatCard
                  label="Hoàn thành"
                  value={String(completedOrders)}
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                  delay={0.2}
                />
                <StatCard
                  label="Chờ thanh toán"
                  value={String(pendingOrders)}
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
                  delay={0.3}
                />
                <StatCard
                  label="Tổng chi tiêu"
                  value={formatVnd(totalSpent)}
                  icon={
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                  delay={0.4}
                />
              </div>

              {/* Quick actions */}
              <div
                className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/50 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
                style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-4">
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />
                  <h3 className="relative font-bold text-white">Liên kết nhanh</h3>
                </div>
                <div className="p-4 space-y-2">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl p-3 text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="font-medium">Về trang chủ</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 rounded-xl p-3 text-slate-700 transition-all hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">Giỏ hàng</span>
                  </Link>
                </div>
              </div>

              {/* Support info */}
              <div
                className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 text-white shadow-xl shadow-violet-500/30 animate-fade-in-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">Cần hỗ trợ?</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, đừng ngần ngại liên hệ với chúng tôi.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/30"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  Liên hệ Zalo
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
