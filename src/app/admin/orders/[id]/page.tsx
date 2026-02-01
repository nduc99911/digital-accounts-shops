import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatVnd } from '@/lib/shop'

export default async function AdminOrderDetail(props: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/admin/login')

  const { id } = await props.params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
      fulfillments: { include: { product: true } },
    },
  })

  if (!order) return notFound()

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">Chi tiết đơn</div>
          <h2 className="text-lg font-semibold">{order.code}</h2>
        </div>

        <Link href="/admin/orders" className="text-sm text-slate-600 hover:underline">
          ← Quay lại
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Thông tin khách</div>
          <div className="mt-2 grid gap-1 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">Tên:</span> {order.customerName}
            </div>
            {order.phone ? (
              <div>
                <span className="text-slate-500">Phone:</span> {order.phone}
              </div>
            ) : null}
            {order.zalo ? (
              <div>
                <span className="text-slate-500">Zalo:</span> {order.zalo}
              </div>
            ) : null}
            {order.email ? (
              <div>
                <span className="text-slate-500">Email:</span> {order.email}
              </div>
            ) : null}
            {order.user?.email ? (
              <div>
                <span className="text-slate-500">User:</span> {order.user.email}
              </div>
            ) : null}
            {order.note ? (
              <div className="pt-2 text-xs text-slate-600">
                <span className="font-medium">Note:</span> {order.note}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Trạng thái</div>
          <div className="mt-2 grid gap-1 text-sm text-slate-700">
            <div>
              <span className="text-slate-500">Status:</span> {order.status}
            </div>
            <div>
              <span className="text-slate-500">Tổng:</span> {formatVnd(order.totalVnd)}
            </div>
            <div>
              <span className="text-slate-500">Tạo lúc:</span> {new Date(order.createdAt).toLocaleString('vi-VN')}
            </div>
            <div>
              <span className="text-slate-500">Cập nhật:</span> {new Date(order.updatedAt).toLocaleString('vi-VN')}
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Trang này hiện read-only (skeleton) để dễ kiểm tra đơn và nội dung đã giao.
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="border-b bg-slate-50 p-3 text-sm font-semibold">Sản phẩm</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">SL</th>
              <th className="p-3">Đơn giá</th>
              <th className="p-3">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-t align-top">
                <td className="p-3">
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-xs text-slate-500">{it.product.duration || ''}</div>
                </td>
                <td className="p-3">x{it.qty}</td>
                <td className="p-3">{formatVnd(it.unitVnd)}</td>
                <td className="p-3">{formatVnd(it.unitVnd * it.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="border-b bg-slate-50 p-3 text-sm font-semibold">Fulfillment (nội dung đã giao)</div>
        {order.fulfillments.length === 0 ? (
          <div className="p-4 text-sm text-slate-600">Chưa có fulfillment.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Value</th>
                <th className="p-3">Tạo lúc</th>
              </tr>
            </thead>
            <tbody>
              {order.fulfillments.map((f) => (
                <tr key={f.id} className="border-t align-top">
                  <td className="p-3 font-medium">{f.product.name}</td>
                  <td className="p-3">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs">{f.value}</code>
                  </td>
                  <td className="p-3 text-xs text-slate-600">{new Date(f.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
