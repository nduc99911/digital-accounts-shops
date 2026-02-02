'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatVnd } from '@/lib/shop'
import { useToast } from '@/app/_ui/ToastProvider'

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
  const [isInWishlist, setIsInWishlist] = useState(false)
  const { showToast } = useToast()
  const img = p.imageUrl || `https://picsum.photos/seed/${p.slug}/600/450`
  const discount = p.listPriceVnd > 0 ? Math.max(0, Math.round((1 - p.salePriceVnd / p.listPriceVnd) * 100)) : 0
  const outOfStock = typeof p.stockQty === 'number' ? p.stockQty <= 0 : false
  const bestSeller = p.soldQty >= 50

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setIsInWishlist(wishlist.some((item: any) => item.id === p.id))
  }, [p.id])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    
    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: any) => item.id !== p.id)
      localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      setIsInWishlist(false)
      showToast('Đã xóa khỏi yêu thích', 'success')
    } else {
      wishlist.push({
        id: p.id,
        slug: p.slug,
        name: p.name,
        salePriceVnd: p.salePriceVnd,
        listPriceVnd: p.listPriceVnd,
        imageUrl: p.imageUrl,
        duration: p.duration,
      })
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
      setIsInWishlist(true)
      showToast('Đã thêm vào yêu thích', 'success')
    }
  }

  return (
    <Link
      href={`/product/${p.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-black/20 dark:hover:shadow-violet-500/20"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-transparent pointer-events-none" />
      
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={p.name}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${outOfStock ? 'opacity-60 grayscale' : ''}`}
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all ${
            isInWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:bg-rose-100 hover:text-rose-600'
          }`}
        >
          <svg className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {outOfStock ? (
            <span className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30">Hết hàng</span>
          ) : bestSeller ? (
            <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-amber-500/30">
              ⭐ Bán chạy
            </span>
          ) : discount >= 30 ? (
            <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30">
              🔥 Hot
            </span>
          ) : null}

          {discount > 0 ? (
            <span className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30">
              -{discount}%
            </span>
          ) : null}
        </div>

        {/* Quick action button */}
        <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-violet-600 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 dark:bg-slate-800/90 dark:text-violet-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative p-4">
        {/* Duration tag */}
        {p.duration && (
          <div className="mb-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
            {p.duration}
          </div>
        )}
        
        <h3 className="line-clamp-2 min-h-[48px] text-sm font-semibold text-slate-800 transition-colors group-hover:text-violet-600 dark:text-slate-100 dark:group-hover:text-violet-400">
          {p.name}
        </h3>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {formatVnd(p.salePriceVnd)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatVnd(p.listPriceVnd)}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Đã bán {p.soldQty.toLocaleString()}
            </div>
          </div>

          <button
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              outOfStock
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95'
            }`}
            disabled={outOfStock}
          >
            {outOfStock ? 'Hết hàng' : 'Mua ngay'}
          </button>
        </div>
      </div>
    </Link>
  )
}
