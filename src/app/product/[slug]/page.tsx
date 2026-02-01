import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatVnd } from '@/lib/shop'
import AddToCartButton from './ui'
import SiteHeader from '@/app/_ui/SiteHeader'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug } })
  if (!p || !p.active) notFound()

  return (
    <div className="min-h-screen bg-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-4xl p-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="aspect-[16/9] w-full bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.imageUrl || 'https://picsum.photos/seed/' + p.slug + '/1200/675'}
              alt={p.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-semibold">{p.name}</h1>
            <div className="mt-2 text-sm text-slate-600">{p.shortDesc || ''}</div>

          <div className="mt-4 grid gap-2 text-sm">
            <div><span className="text-slate-500">Thời hạn:</span> {p.duration || '—'}</div>
            <div><span className="text-slate-500">Bảo hành:</span> {p.warranty}</div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold text-rose-600">{formatVnd(p.salePriceVnd)}</div>
              <div className="mt-1 text-sm text-slate-500 line-through">{formatVnd(p.listPriceVnd)}</div>
              <div className="mt-1 text-xs text-slate-500">
                Tồn kho: <b>{p.stockQty}</b> • Đã bán: <b>{p.soldQty}</b>
              </div>
            </div>
            <AddToCartButton productId={p.id} name={p.name} priceVnd={p.salePriceVnd} />
          </div>

            {p.description && (
              <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap">
                {p.description}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
