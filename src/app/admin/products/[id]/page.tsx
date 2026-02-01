import { notFound, redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed()) redirect('/admin/login')

  const { id } = await params
  const p = await prisma.product.findUnique({ where: { id } })
  if (!p) notFound()

  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Sửa sản phẩm</h2>
      <form action={`/api/admin/products/${p.id}`} method="post" className="grid gap-3">
        <input className="rounded-md border px-3 py-2" name="name" defaultValue={p.name} required />
        <input className="rounded-md border px-3 py-2" name="slug" defaultValue={p.slug} required />
        <input className="rounded-md border px-3 py-2" name="priceVnd" defaultValue={String(p.priceVnd)} required />
        <select className="rounded-md border px-3 py-2" name="categoryId" defaultValue={(p as any).categoryId ?? ''}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input className="rounded-md border px-3 py-2" name="duration" defaultValue={p.duration ?? ''} />
        <select className="rounded-md border px-3 py-2" name="warranty" defaultValue={p.warranty}>
          <option value="FULL">Full BH</option>
          <option value="LIMITED">BH giới hạn</option>
          <option value="NONE">Không BH</option>
        </select>
        <input className="rounded-md border px-3 py-2" name="imageUrl" defaultValue={(p as any).imageUrl ?? ''} placeholder="Link ảnh (tạm)" />
        <textarea className="rounded-md border px-3 py-2" name="shortDesc" defaultValue={p.shortDesc ?? ''} rows={2} />
        <textarea className="rounded-md border px-3 py-2" name="description" defaultValue={p.description ?? ''} rows={5} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={p.active} />
          Hiển thị sản phẩm
        </label>
        <div className="mt-2 flex gap-2">
          <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white">Lưu</button>
          <button formAction={`/api/admin/products/${p.id}?_method=delete`} className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white">
            Xóa
          </button>
        </div>
      </form>
    </div>
  )
}
