import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatusActions from './StatusActions'

export default async function AdminOrders() {
  if (!isAuthed()) redirect('/admin/login')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
    take: 200,
  })

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Đơn hàng</h2>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Khách</th>
              <th className="p-3">Tổng</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t align-top">
                <td className="p-3 font-medium">{o.code}</td>
                <td className="p-3">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-slate-500">{o.zalo || o.phone || o.email || ''}</div>
                  {o.note ? <div className="mt-2 text-xs text-slate-600">Note: {o.note}</div> : null}
                  <div className="mt-2 text-xs text-slate-500">
                    {o.items.map((it) => (
                      <div key={it.id}>
                        • {it.product.name} x{it.qty}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-3">{o.totalVnd.toLocaleString('vi-VN')}</td>
                <td className="p-3">
                  <StatusActions id={o.id} status={o.status as any} />
                </td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        Flow MVP: khách tạo đơn → trạng thái PENDING_PAYMENT → admin check bank và mark SUCCESS.
      </div>
    </div>
  )
}
