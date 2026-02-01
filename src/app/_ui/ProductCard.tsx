import Link from 'next/link'
import { formatVnd } from '@/lib/shop'

export default function ProductCard({
  p,
}: {
  p: {
    id: string
    slug: string
    name: string
    duration: string | null
    listPriceVnd: number
    salePriceVnd: number
    soldQty: number
    imageUrl: string | null
    stockQty?: number
  }
}) {
  const img = p.imageUrl || `https://picsum.photos/seed/${p.slug}/600/450`
  const discount = p.listPriceVnd > 0 ? Math.max(0, Math.round((1 - p.salePriceVnd / p.listPriceVnd) * 100)) : 0
  const outOfStock = typeof p.stockQty === 'number' ? p.stockQty <= 0 : false
  const bestSeller = p.soldQty >= 50

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={p.name}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${outOfStock ? 'opacity-70' : ''}`}
          loading="lazy"
        />

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {outOfStock ? (
            <span className="rounded-full bg-rose-600/95 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">Hết hàng</span>
          ) : bestSeller ? (
            <span className="rounded-full bg-blue-600/95 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">Bán chạy</span>
          ) : (
            <span className="rounded-full bg-slate-900/90 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">Hot</span>
          )}

          {discount > 0 ? (
            <span className="rounded-full bg-amber-500/95 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">-{discount}%</span>
          ) : null}
        </div>
      </div>

      <div className="p-3">
        <div className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 group-hover:text-blue-700">
          {p.name}
        </div>
        <div className="mt-1 text-xs text-slate-500">{p.duration || 'Gói'}</div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-extrabold text-rose-600">{formatVnd(p.salePriceVnd)}</div>
            <div className="text-xs text-slate-500 line-through">{formatVnd(p.listPriceVnd)}</div>
            <div className="mt-1 text-[11px] text-slate-500">Đã bán: {p.soldQty}</div>
          </div>

          <div
            className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-white ${
              outOfStock ? 'bg-slate-400' : 'bg-slate-900'
            }`}
          >
            {outOfStock ? 'Xem' : 'Mua ngay'}
          </div>
        </div>
      </div>
    </Link>
  )
}
