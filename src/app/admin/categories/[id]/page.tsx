import { notFound, redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/admin/login')

  const { id } = await params
  const c = await prisma.category.findUnique({ where: { id } })
  if (!c) notFound()

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Sửa danh mục</h2>
      <form action={`/api/admin/categories/${c.id}`} method="post" className="grid gap-3">
        <input className="rounded-md border px-3 py-2" name="name" defaultValue={c.name} required />
        <input className="rounded-md border px-3 py-2" name="slug" defaultValue={c.slug} required />
        <input className="rounded-md border px-3 py-2" name="sortOrder" defaultValue={String(c.sortOrder)} />
        <div className="mt-2 flex gap-2">
          <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Lưu</button>
          <button
            formAction={`/api/admin/categories/${c.id}?_method=delete`}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  )
}
