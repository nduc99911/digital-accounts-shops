import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'

export default async function NewCategory() {
  if (!(await isAuthed())) redirect('/admin/login')

  return (
    <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">Thêm danh mục</h2>
      <form action="/api/admin/categories" method="post" className="grid gap-3">
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="name"
          placeholder="Tên danh mục"
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="slug"
          placeholder="Slug (vd: netflix)"
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="sortOrder"
          placeholder="Thứ tự (vd: 0)"
          defaultValue="0"
        />
        <button className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Lưu</button>
      </form>
    </div>
  )
}
