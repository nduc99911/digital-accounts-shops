import { notFound, redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/admin/login')

  const { id } = await params
  const c = await prisma.category.findUnique({ where: { id } })
  if (!c) notFound()

  return (
    <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">Sửa danh mục</h2>
      <form action={`/api/admin/categories/${c.id}`} method="post" className="grid gap-3">
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="name"
          defaultValue={c.name}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="slug"
          defaultValue={c.slug}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="sortOrder"
          defaultValue={String(c.sortOrder)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Lưu</button>
          <button
            formAction={`/api/admin/categories/${c.id}?_method=delete`}
            className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  )
}
