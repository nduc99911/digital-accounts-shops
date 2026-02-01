import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminCategories() {
  if (!isAuthed()) redirect('/admin/login')

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 200,
  })

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh mục</h2>
        <Link href="/admin/categories/new" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">
          Thêm danh mục
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Tên</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-slate-600">{c.slug}</td>
                <td className="p-3">{c.sortOrder}</td>
                <td className="p-3">
                  <Link className="text-blue-600 hover:underline" href={`/admin/categories/${c.id}`}>
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500">Danh mục dùng để hiển thị sidebar và chia section ngoài trang chủ.</div>
    </div>
  )
}
