import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer } from '@/lib/customerAuth'
import { formatVnd } from '@/lib/shop'
import SiteHeader from '../../../_ui/SiteHeader'

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    SUCCESS: {
      label: 'Thành công',
      className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    PENDING_PAYMENT: {
      label: 'Chờ thanh toán',
      className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    CANCELLED: {
      label: 'Đã hủy',
      className: 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    PROCESSING: {
      label: 'Đang xử lý',
      className: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30',
      icon: (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  }

  const config = configs[status] || configs.PENDING_PAYMENT

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

// Timeline component for order progress
function OrderTimeline({ status }: { status: string }) {
  const steps = [
    {
      id: 'created',
      label: 'Đơn hàng đã tạo',
      description: 'Đơn hàng của bạn đã được ghi nhận',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'payment',
      label: 'Thanh toán',
      description: 'Chờ xác nhận thanh toán',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: 'processing',
      label: 'Xử lý',
      description: 'Đang chuẩn bị đơn hàng',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 'completed',
      label: 'Hoàn thành',
      description: 'Đơn hàng đã được giao',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ]

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId)
    const statusMap: Record<string, number> = {
      PENDING_PAYMENT: 1,
      PROCESSING: 2,
      SUCCESS: 3,
      CANCELLED: -1,
    }
    const currentIndex = statusMap[status] ?? 0

    if (status === 'CANCELLED') return 'cancelled'
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700" />
      <div
        className="absolute left-5 top-8 w-0.5 bg-gradient-to-b from-emerald-500 to-emerald-400 transition-all duration-1000"
        style={{
          height: status === 'SUCCESS' ? '100%' : status === 'PROCESSING' ? '66%' : status === 'PENDING_PAYMENT' ? '33%' : '0%',
        }}
      />

      {/* Steps */}
      <div className="relative space-y-6">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.id)
          const isCompleted = stepStatus === 'completed'
          const isCurrent = stepStatus === 'current'
          const isCancelled = stepStatus === 'cancelled'

          return (
            <div
              key={step.id}
              className={`flex gap-4 transition-all duration-500 ${isCurrent ? 'scale-[1.02]' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isCurrent
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30 animate-pulse'
                    : isCancelled && step.id === 'payment'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h4
                  className={`font-semibold transition-colors ${
                    isCompleted || isCurrent
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {step.label}
                </h4>
                <p
                  className={`text-sm transition-colors ${
                    isCompleted || isCurrent
                      ? 'text-slate-600 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Copy button component
function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        // Show a simple toast notification
        const toast = document.createElement('div')
        toast.className = 'fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg animate-fade-in-up'
        toast.innerHTML = `
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Đã sao chép ${label}
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          toast.style.opacity = '0'
          toast.style.transform = 'translateY(10px)'
          setTimeout(() => toast.remove(), 300)
        }, 2000)
      }}
      className="group flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-violet-100 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-400"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span className="hidden sm:inline">Sao chép</span>
    </button>
  )
}

// Product card component
function ProductCard({
  item,
  index,
}: {
  item: {
    id: string
    qty: number
    unitVnd: number
    product: { name: string; imageUrl: string | null; slug: string }
  }
  index: number
}) {
  return (
    <div
      className="group flex gap-4 rounded-2xl bg-white/60 p-4 transition-all duration-300 hover:bg-white hover:shadow-lg dark:bg-slate-800/60 dark:hover:bg-slate-800 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      {/* Product image */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
        {item.product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>

      {/* Product info */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${item.product.slug}`}
          className="block font-semibold text-slate-900 transition-colors hover:text-violet-600 dark:text-slate-100 dark:hover:text-violet-400"
        >
          {item.product.name}
        </Link>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Số lượng: <span className="font-medium text-slate-700 dark:text-slate-300">{item.qty}</span>
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Đơn giá: <span className="font-medium text-slate-700 dark:text-slate-300">{formatVnd(item.unitVnd)}</span>
        </p>
      </div>

      {/* Line total */}
      <div className="text-right">
        <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
          {formatVnd(item.unitVnd * item.qty)}
        </p>
      </div>
    </div>
  )
}

// Deliverable card with copy functionality
function DeliverableCard({
  fulfillment,
  index,
}: {
  fulfillment: {
    id: string
    value: string
    product: { name: string }
  }
  index: number
}) {
  return (
    <div
      className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 dark:from-emerald-900/20 dark:to-teal-900/20 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          {fulfillment.product.name}
        </span>
        <CopyButton text={fulfillment.value} label="thông tin" />
      </div>
      <div className="rounded-xl bg-white/80 p-4 font-mono text-sm text-slate-700 break-all dark:bg-slate-900/50 dark:text-slate-300">
        {fulfillment.value}
      </div>
    </div>
  )
}

// Payment info component
async function PaymentInfo({ totalVnd }: { totalVnd: number }) {
  const paymentSetting = await prisma.paymentSetting.findFirst({
    where: { active: true },
  })

  if (!paymentSetting) {
    return (
      <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-900/20">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Vui lòng liên hệ admin để biết thông tin thanh toán.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bank info cards */}
      <div className="grid gap-3">
        <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 dark:bg-slate-800/60">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ngân hàng</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{paymentSetting.bankName}</p>
          </div>
          <CopyButton text={paymentSetting.bankName} label="tên ngân hàng" />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 dark:bg-slate-800/60">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Số tài khoản</p>
            <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">{paymentSetting.accountNumber}</p>
          </div>
          <CopyButton text={paymentSetting.accountNumber} label="số tài khoản" />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 dark:bg-slate-800/60">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Chủ tài khoản</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{paymentSetting.accountName}</p>
          </div>
          <CopyButton text={paymentSetting.accountName} label="tên chủ TK" />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/60 p-4 dark:bg-slate-800/60">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Số tiền</p>
            <p className="font-mono font-bold text-lg text-violet-600 dark:text-violet-400">
              {formatVnd(totalVnd)}
            </p>
          </div>
          <CopyButton text={String(totalVnd)} label="số tiền" />
        </div>
      </div>

      {/* QR Code if available */}
      {paymentSetting.qrImageUrl && (
        <div className="rounded-2xl bg-white/60 p-5 text-center dark:bg-slate-800/60">
          <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">Quét mã QR để thanh toán</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paymentSetting.qrImageUrl}
            alt="QR Code thanh toán"
            className="mx-auto h-48 w-48 rounded-xl object-contain"
          />
        </div>
      )}

      {/* Note */}
      {paymentSetting.note && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{paymentSetting.note}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentCustomer()
  if (!user) redirect('/login')

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: {
      items: { include: { product: { select: { name: true, imageUrl: true, slug: true } } } },
      fulfillments: { include: { product: { select: { name: true } } } },
    },
  })

  if (!order) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />

      {/* Page header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-fuchsia-600/5 to-cyan-600/5" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500 animate-fade-in dark:text-slate-400">
            <Link href="/" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Trang chủ</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/account/orders" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Đơn hàng</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 dark:text-slate-100">Chi tiết</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{order.code}</h1>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Đặt ngày {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Order Timeline */}
            <div
              className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/50 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                <h2 className="relative flex items-center gap-2 text-lg font-bold text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Trạng thái đơn hàng
                </h2>
              </div>
              <div className="p-6">
                <OrderTimeline status={order.status} />
              </div>
            </div>

            {/* Products */}
            <div
              className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/50 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                <h2 className="relative flex items-center gap-2 text-lg font-bold text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Sản phẩm đã đặt
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {order.items.map((item, index) => (
                  <ProductCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>

            {/* Deliverables for completed orders */}
            {order.status === 'SUCCESS' && order.fulfillments.length > 0 && (
              <div
                className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-200/60 shadow-lg dark:border-emerald-800/60 dark:from-emerald-900/20 dark:to-teal-900/20 animate-fade-in-up"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                  <h2 className="relative flex items-center gap-2 text-lg font-bold text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Thông tin đã cấp
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    Vui lòng lưu lại thông tin bên dưới. Bạn có thể sao chép bằng cách nhấn nút bên cạnh.
                  </p>
                  {order.fulfillments.map((fulfillment, index) => (
                    <DeliverableCard key={fulfillment.id} fulfillment={fulfillment} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div
              className="sticky top-24 overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-5">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                <h2 className="relative flex items-center gap-2 text-lg font-bold text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Chi tiết thanh toán
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Order code with copy */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mã đơn hàng</p>
                    <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">{order.code}</p>
                  </div>
                  <CopyButton text={order.code} label="mã đơn hàng" />
                </div>

                {/* Customer info */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Khách hàng</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{order.customerName}</span>
                  </div>
                  {order.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Số điện thoại</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{order.phone}</span>
                    </div>
                  )}
                  {order.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Email</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{order.email}</span>
                    </div>
                  )}
                  {order.zalo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Zalo</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{order.zalo}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tổng tiền</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {formatVnd(order.totalVnd)}
                    </span>
                  </div>
                </div>

                {/* Payment action for pending orders */}
                {order.status === 'PENDING_PAYMENT' && (
                  <Link
                    href={`/checkout?order=${order.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Thanh toán ngay
                  </Link>
                )}
              </div>
            </div>

            {/* Payment Info for pending orders */}
            {order.status === 'PENDING_PAYMENT' && (
              <div
                className="overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-slate-200/50 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 animate-fade-in-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-5">
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                  <h2 className="relative flex items-center gap-2 text-lg font-bold text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Thông tin thanh toán
                  </h2>
                </div>
                <div className="p-6">
                  <PaymentInfo totalVnd={order.totalVnd} />
                </div>
              </div>
            )}

            {/* Support card */}
            <div
              className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 text-white shadow-xl shadow-violet-500/30 animate-fade-in-up"
              style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
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
      </main>
    </div>
  )
}
