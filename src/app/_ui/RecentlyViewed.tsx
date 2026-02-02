'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatVnd } from '@/lib/shop'

interface ViewedProduct {
  id: string
  slug: string
  name: string
  salePriceVnd: number
  listPriceVnd: number
  imageUrl: string | null
  viewedAt: number
}

const STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS = 12

export function addToRecentlyViewed(product: Omit<ViewedProduct, 'viewedAt'>) {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem(STORAGE_KEY)
  const existing: ViewedProduct[] = stored ? JSON.parse(stored) : []

  // Remove if already exists
  const filtered = existing.filter((p) => p.id !== product.id)

  // Add to beginning with timestamp
  const updated = [
    { ...product, viewedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_ITEMS)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getRecentlyViewed(excludeId?: string): ViewedProduct[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed: ViewedProduct[] = JSON.parse(stored)
    return excludeId ? parsed.filter((p) => p.id !== excludeId) : parsed
  } catch {
    return []
  }
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [products, setProducts] = useState<ViewedProduct[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setProducts(getRecentlyViewed(excludeId))
  }, [excludeId])

  if (!isClient || products.length === 0) return null

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Sản phẩm đã xem</h3>
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY)
            setProducts([])
          }}
          className="text-sm text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
        >
          Xóa lịch sử
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((p) => {
          const discount =
            p.listPriceVnd > 0
              ? Math.max(0, Math.round((1 - p.salePriceVnd / p.listPriceVnd) * 100))
              : 0

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:shadow-md dark:bg-slate-950 dark:ring-white/10"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl || `https://picsum.photos/seed/${p.slug}/400/300`}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {discount > 0 && (
                  <div className="absolute left-2 top-2 rounded-full bg-amber-400/95 px-2 py-1 text-[11px] font-semibold text-slate-950 shadow-sm">
                    -{discount}%
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="line-clamp-2 min-h-[36px] text-xs font-semibold text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                  {p.name}
                </div>

                <div className="mt-2">
                  <div className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    {formatVnd(p.salePriceVnd)}
                  </div>
                  {discount > 0 && (
                    <div className="text-xs text-slate-500 line-through dark:text-slate-500">
                      {formatVnd(p.listPriceVnd)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
