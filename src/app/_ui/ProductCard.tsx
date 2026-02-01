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
    priceVnd: number
    imageUrl: string | null
  }
}) {
  const img = p.imageUrl || `https://picsum.photos/seed/${p.slug}/600/450`

  return (
    <Link href={`/product/${p.slug}`} className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white">
          HOT
        </div>
      </div>
      <div className="p-3">
        <div className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 group-hover:text-blue-700">{p.name}</div>
        <div className="mt-1 text-xs text-slate-500">{p.duration || 'Gói'}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-base font-bold text-rose-600">{formatVnd(p.priceVnd)}</div>
          <div className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white">Mua</div>
        </div>
      </div>
    </Link>
  )
}
