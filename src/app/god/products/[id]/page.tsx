import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/god/login')

  const { id } = await params
  const p = await prisma.product.findUnique({ where: { id } })
  if (!p) notFound()

  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })

  return (
    <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">Sửa sản phẩm</h2>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-slate-400">Quản lý kho auto-giao:</div>
        <Link className="text-sm text-blue-400 hover:underline" href={`/god/products/${p.id}/stock`}>
          Kho sản phẩm
        </Link>
      </div>
      <form action={`/api/god/products/${p.id}`} method="post" className="grid gap-3">
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="name"
          defaultValue={p.name}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="slug"
          defaultValue={p.slug}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="listPriceVnd"
          defaultValue={String(p.listPriceVnd)}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="salePriceVnd"
          defaultValue={String(p.salePriceVnd)}
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="stockQty"
          defaultValue={String(p.stockQty)}
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="soldQty"
          defaultValue={String(p.soldQty)}
        />
        <select
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="categoryId"
          defaultValue={p.categoryId ?? ''}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="duration"
          defaultValue={p.duration ?? ''}
        />
        <select
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="warranty"
          defaultValue={p.warranty}
        >
          <option value="FULL">Full BH</option>
          <option value="LIMITED">BH giới hạn</option>
          <option value="NONE">Không BH</option>
        </select>
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="imageUrl"
          defaultValue={p.imageUrl ?? ''}
          placeholder="Link ảnh (tạm)"
        />
        <textarea
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="shortDesc"
          defaultValue={p.shortDesc ?? ''}
          rows={2}
        />
        <textarea
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="description"
          defaultValue={p.description ?? ''}
          rows={5}
        />
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input type="checkbox" name="active" defaultChecked={p.active} />
          Hiển thị sản phẩm
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Lưu</button>
          <button
            formAction={`/api/god/products/${p.id}?_method=delete`}
            className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  )
}
