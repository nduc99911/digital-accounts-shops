import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthed } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ProductStockPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) redirect('/admin/login')

  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  const available = await prisma.stockItem.count({ where: { productId: id, usedAt: null } })
  const used = await prisma.stockItem.count({ where: { productId: id, usedAt: { not: null } } })

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400">Kho sản phẩm</div>
          <h2 className="text-lg font-semibold tracking-tight text-white">{product.name}</h2>
        </div>
        <Link href={`/admin/products/${product.id}`} className="text-sm text-blue-400 hover:underline">
          ← Quay lại
        </Link>
      </div>

      <div className="rounded-lg bg-slate-900/60 p-5 shadow-sm ring-1 ring-white/10">
        <div className="mb-3 text-sm">
          <div>
            Kho còn lại: <b className="text-white">{available}</b>
          </div>
          <div className="text-xs text-slate-400">Đã cấp: {used}</div>
        </div>

        <form action={`/api/admin/products/${product.id}/stock`} method="post" className="grid gap-3">
          <textarea
            className="min-h-[160px] rounded-md border border-white/10 bg-slate-950/40 p-3 font-mono text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
            name="lines"
            placeholder="Dán danh sách account/key, mỗi dòng 1 cái\nVD:\nemail1|pass1\nemail2|pass2"
          />
          <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">Thêm vào kho</button>
          <div className="text-xs text-slate-400">Hệ thống sẽ tự loại dòng trống và tránh trùng (unique theo sản phẩm).</div>
        </form>
      </div>
    </div>
  )
}
