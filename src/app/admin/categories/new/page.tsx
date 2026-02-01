import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'

export default function NewCategory() {
  if (!isAuthed()) redirect('/admin/login')

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Thêm danh mục</h2>
      <form action="/api/admin/categories" method="post" className="grid gap-3">
        <input className="rounded-md border px-3 py-2" name="name" placeholder="Tên danh mục" required />
        <input className="rounded-md border px-3 py-2" name="slug" placeholder="Slug (vd: netflix)" required />
        <input className="rounded-md border px-3 py-2" name="sortOrder" placeholder="Thứ tự (vd: 0)" defaultValue="0" />
        <button className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Lưu</button>
      </form>
    </div>
  )
}
