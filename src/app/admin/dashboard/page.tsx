'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    totalOrders: number
    totalRevenue: number
    todayOrders: number
    todayRevenue: number
    monthOrders: number
    monthRevenue: number
    pendingOrders: number
    totalProducts: number
    lowStockProducts: number
    totalCustomers: number
  }
  topProducts: { name: string; imageUrl: string | null; sold: number }[]
  recentOrders: any[]
  dailyRevenue: { date: string; revenue: number }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-white">Đang tải...</div>
  }

  if (!data) {
    return <div className="p-6 text-center text-red-400">Lỗi tải dữ liệu</div>
  }

  const formatVnd = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold text-white">📊 Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatVnd(data.stats.totalRevenue)}
          change="Từ trước đến nay"
          color="from-emerald-500 to-teal-500"
          icon="💰"
        />
        <StatCard
          title="Đơn hàng hôm nay"
          value={data.stats.todayOrders}
          value2={formatVnd(data.stats.todayRevenue)}
          change="Hôm nay"
          color="from-blue-500 to-cyan-500"
          icon="📦"
        />
        <StatCard
          title="Chờ thanh toán"
          value={data.stats.pendingOrders}
          change="Cần xử lý"
          color="from-amber-500 to-orange-500"
          icon="⏳"
          href="/admin/orders"
        />
        <StatCard
          title="Tồn kho thấp"
          value={data.stats.lowStockProducts}
          change="Cần nhập thêm"
          color="from-rose-500 to-pink-500"
          icon="⚠️"
          href="/admin/products"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">🔥 Sản phẩm bán chạy</h3>
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-slate-800/50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 font-bold text-white">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-slate-400">Đã bán: {p.sold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">⚡ Thao tác nhanh</h3>
            <div className="grid gap-2">
              <QuickLink href="/admin/products" label="➕ Thêm sản phẩm" />
              <QuickLink href="/admin/orders" label="📋 Xem đơn hàng" />
              <QuickLink href="/admin/settings/payment" label="💳 Cài đặt thanh toán" />
              <QuickLink href="/admin/settings" label="⚙️ Cài đặt website" />
            </div>
          </div>

          {/* Month Stats */}
          <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
            <h3 className="mb-4 text-lg font-semibold text-white">📅 Tháng này</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Đơn hàng</span>
                <span className="font-semibold text-white">{data.stats.monthOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Doanh thu</span>
                <span className="font-semibold text-emerald-400">{formatVnd(data.stats.monthRevenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Khách hàng</span>
                <span className="font-semibold text-white">{data.stats.totalCustomers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-slate-900/60 p-5 ring-1 ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">🛒 Đơn hàng gần đây</h3>
          <Link href="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300">
            Xem tất cả →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Mã đơn</th>
                <th className="pb-3 font-medium">Khách</th>
                <th className="pb-3 font-medium">Tổng</th>
                <th className="pb-3 font-medium">Trạng thái</th>
                <th className="pb-3 font-medium">Thờii gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="py-3 font-medium text-white">{o.code}</td>
                  <td className="py-3 text-slate-300">{o.customerName}</td>
                  <td className="py-3 font-medium text-emerald-400">{formatVnd(o.totalVnd)}</td>
                  <td className="py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-3 text-slate-400">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  value2,
  change,
  color,
  icon,
  href,
}: {
  title: string
  value: string | number
  value2?: string
  change: string
  color: string
  icon: string
  href?: string
}) {
  const content = (
    <div className={`rounded-xl bg-gradient-to-br ${color} p-5 text-white transition-transform hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {value2 && <p className="text-sm opacity-90">{value2}</p>}
          <p className="mt-2 text-xs opacity-70">{change}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20"
    >
      {label}
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string }> = {
    SUCCESS: { label: 'Thành công', className: 'bg-emerald-500/20 text-emerald-300' },
    PENDING_PAYMENT: { label: 'Chờ TT', className: 'bg-amber-500/20 text-amber-300' },
  }
  const config = configs[status] || { label: status, className: 'bg-slate-500/20 text-slate-300' }
  return <span className={`rounded-full px-2 py-1 text-xs ${config.className}`}>{config.label}</span>
}
