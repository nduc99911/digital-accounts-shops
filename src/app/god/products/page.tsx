import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminProducts() {
  if (!(await isAuthed())) redirect('/god/login')

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-white">Sản phẩm</h2>
        <Link
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
          href="/god/products/new"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-slate-900/60 shadow-sm ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-200">
            <tr>
              <th className="p-3 font-semibold">Tên</th>
              <th className="p-3 font-semibold">Giá</th>
              <th className="p-3 font-semibold">Kho / Đã bán</th>
              <th className="p-3 font-semibold">Hiển thị</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3">
                  <div className="font-medium text-slate-100">{p.name}</div>
                  <div className="text-xs text-slate-400">/{p.slug}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-rose-400">{p.salePriceVnd.toLocaleString('vi-VN')}</div>
                  <div className="text-xs text-slate-400 line-through">{p.listPriceVnd.toLocaleString('vi-VN')}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-slate-100">{p.stockQty}</div>
                  <div className="text-xs text-slate-400">Đã bán: {p.soldQty}</div>
                </td>
                <td className="p-3 text-slate-100">{p.active ? 'ON' : 'OFF'}</td>
                <td className="p-3 text-right">
                  <Link className="text-blue-400 hover:underline" href={`/god/products/${p.id}`}>
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
