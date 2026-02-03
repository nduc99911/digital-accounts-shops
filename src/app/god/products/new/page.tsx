import { redirect } from 'next/navigation'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function NewProduct() {
  if (!(await isAuthed())) redirect('/god/login')

  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })

  return (
    <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-white">Thêm sản phẩm</h2>
      <form action="/api/god/products" method="post" className="grid gap-3">
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="name"
          placeholder="Tên sản phẩm"
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="slug"
          placeholder="Slug (vd: chatgpt-plus)"
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="listPriceVnd"
          placeholder="Giá gốc VND (vd: 120000)"
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="salePriceVnd"
          placeholder="Giá sale VND (vd: 99000)"
          required
        />
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="stockQty"
          placeholder="Tồn kho (vd: 100)"
          defaultValue="0"
        />

        <select
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="categoryId"
          defaultValue=""
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
          placeholder="Thời hạn (vd: 1 tháng)"
        />
        <select
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="warranty"
          defaultValue="FULL"
        >
          <option value="FULL">Full BH</option>
          <option value="LIMITED">BH giới hạn</option>
          <option value="NONE">Không BH</option>
        </select>
        <input
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="imageUrl"
          placeholder="Link ảnh (tạm)"
        />
        <textarea
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="shortDesc"
          placeholder="Mô tả ngắn"
          rows={2}
        />
        <textarea
          className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
          name="description"
          placeholder="Mô tả chi tiết"
          rows={5}
        />
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input type="checkbox" name="active" defaultChecked />
          Hiển thị sản phẩm
        </label>
        <button className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Lưu</button>
      </form>
    </div>
  )
}
