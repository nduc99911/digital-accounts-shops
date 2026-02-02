import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatusActions from './StatusActions'

export default async function AdminOrders() {
  if (!(await isAuthed())) redirect('/admin/login')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
    take: 200,
  })

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-white">Đơn hàng</h2>

      <div className="overflow-hidden rounded-lg bg-slate-900/60 shadow-sm ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-200">
            <tr>
              <th className="p-3 font-semibold">Mã</th>
              <th className="p-3 font-semibold">Khách</th>
              <th className="p-3 font-semibold">Tổng</th>
              <th className="p-3 font-semibold">Trạng thái</th>
              <th className="p-3 font-semibold">Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/10 align-top hover:bg-white/5">
                <td className="p-3 font-medium">
                  <Link href={`/admin/orders/${o.id}`} className="text-blue-400 hover:underline">
                    {o.code}
                  </Link>
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-100">{o.customerName}</div>
                  <div className="text-xs text-slate-400">{o.zalo || o.phone || o.email || ''}</div>
                  {o.note ? <div className="mt-2 text-xs text-slate-300">Note: {o.note}</div> : null}
                  <div className="mt-2 text-xs text-slate-400">
                    {o.items.map((it) => (
                      <div key={it.id}>
                        • {it.product.name} x{it.qty}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-slate-100">{o.totalVnd.toLocaleString('vi-VN')}</td>
                <td className="p-3">
                  <StatusActions id={o.id} status={o.status} />
                </td>
                <td className="p-3 text-slate-200">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400">
        Flow MVP: khách tạo đơn → trạng thái PENDING_PAYMENT → admin check bank và mark SUCCESS.
      </div>
    </div>
  )
}
