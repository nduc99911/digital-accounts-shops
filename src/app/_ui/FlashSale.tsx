'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatVnd } from '@/lib/shop'

interface FlashProduct {
  id: string
  slug: string
  name: string
  duration: string | null
  listPriceVnd: number
  salePriceVnd: number
  soldQty: number
  imageUrl: string | null
  stockQty: number
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 }
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { hours, minutes, seconds }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-white/20 text-sm font-bold text-white">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-white/80">:</span>
        <span className="flex h-8 w-8 items-center justify-center rounded bg-white/20 text-sm font-bold text-white">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-white/80">:</span>
        <span className="flex h-8 w-8 items-center justify-center rounded bg-white/20 text-sm font-bold text-white">
          {pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  )
}

export default function FlashSale({
  products,
  endDate,
}: {
  products: FlashProduct[]
  endDate: Date
}) {
  if (products.length === 0) return null

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 p-4 shadow-lg dark:from-rose-700 dark:via-red-600 dark:to-orange-600">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-bold text-white">Flash Sale</span>
          </div>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
            Kết thúc trong
          </span>
          <CountdownTimer targetDate={endDate} />
        </div>
        <Link
          href="/search?sort=sold_desc"
          className="text-sm font-medium text-white/90 hover:text-white hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((p) => {
          const img = p.imageUrl || `https://picsum.photos/seed/${p.slug}/400/300`
          const discount =
            p.listPriceVnd > 0
              ? Math.max(0, Math.round((1 - p.salePriceVnd / p.listPriceVnd) * 100))
              : 0
          const soldPercent = Math.min(100, Math.round((p.soldQty / (p.stockQty + p.soldQty || 1)) * 100))

          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="group relative overflow-hidden rounded-lg bg-white p-2 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900"
            >
              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute left-1 top-1 z-10 rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  -{discount}%
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="mt-2">
                <div className="line-clamp-2 min-h-[36px] text-xs font-medium text-slate-900 dark:text-slate-100">
                  {p.name}
                </div>

                {/* Prices */}
                <div className="mt-1">
                  <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {formatVnd(p.salePriceVnd)}
                  </div>
                  <div className="text-[10px] text-slate-400 line-through">
                    {formatVnd(p.listPriceVnd)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    Đã bán {p.soldQty}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
