import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminOrders() {
  if (!isAuthed()) redirect('/admin/login')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
    take: 100,
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
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">{o.code}</td>
                <td className="p-3">
                  <div>{o.customerName}</div>
                  <div className="text-xs text-slate-500">{o.zalo || o.phone || o.email || ''}</div>
                </td>
                <td className="p-3">{o.totalVnd.toLocaleString('vi-VN')}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">
        Gợi ý: bản MVP hiện dùng chuyển khoản QR và admin tự xử lý/giao hàng.
      </div>
    </div>
  )
}
