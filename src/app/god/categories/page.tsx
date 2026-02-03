import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminCategories() {
  if (!(await isAuthed())) redirect('/god/login')

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 200,
  })

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-white">Danh mục</h2>
        <Link
          href="/god/categories/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Thêm danh mục
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-slate-900/60 shadow-sm ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-200">
            <tr>
              <th className="p-3 font-semibold">Tên</th>
              <th className="p-3 font-semibold">Slug</th>
              <th className="p-3 font-semibold">Sort</th>
              <th className="p-3 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3 font-medium text-slate-100">{c.name}</td>
                <td className="p-3 text-slate-300">{c.slug}</td>
                <td className="p-3 text-slate-100">{c.sortOrder}</td>
                <td className="p-3">
                  <Link className="text-blue-400 hover:underline" href={`/god/categories/${c.id}`}>
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400">Danh mục dùng để hiển thị sidebar và chia section ngoài trang chủ.</div>
    </div>
  )
}
