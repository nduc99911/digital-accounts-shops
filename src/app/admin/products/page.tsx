import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminProducts() {
  if (!(await isAuthed())) redirect('/admin/login')

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sản phẩm</h2>
        <Link className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white" href="/admin/products/new">
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Tên</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Kho / Đã bán</th>
              <th className="p-3">Hiển thị</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">/{p.slug}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-rose-600">{p.salePriceVnd.toLocaleString('vi-VN')}</div>
                  <div className="text-xs text-slate-500 line-through">{p.listPriceVnd.toLocaleString('vi-VN')}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{p.stockQty}</div>
                  <div className="text-xs text-slate-500">Đã bán: {p.soldQty}</div>
                </td>
                <td className="p-3">{p.active ? 'ON' : 'OFF'}</td>
                <td className="p-3 text-right">
                  <Link className="text-blue-600 hover:underline" href={`/admin/products/${p.id}`}>Sửa</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
