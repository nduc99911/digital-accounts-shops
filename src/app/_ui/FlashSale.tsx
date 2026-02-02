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
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
        {pad(timeLeft.hours)}
      </div>
      <span className="text-white/60 text-xl">:</span>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
        {pad(timeLeft.minutes)}
      </div>
      <span className="text-white/60 text-xl">:</span>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-sm">
        {pad(timeLeft.seconds)}
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
    <div 
      className="relative overflow-hidden rounded-3xl p-5 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 25%, #f97316 50%, #f43f5e 75%, #e11d48 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradient-shift 8s ease infinite',
        boxShadow: '0 25px 50px -12px rgba(244, 63, 94, 0.4)',
      }}
    >
      {/* Animated background elements */}
      <div 
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      
      {/* Lightning effect */}
      <div 
        className="absolute right-1/4 top-0 h-full w-px opacity-20"
        style={{
          background: 'linear-gradient(to bottom, transparent, white, transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <svg className="h-7 w-7 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">Flash Sale</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                ⚡ Hot nhất hôm nay
              </span>
            </div>
            <div className="mt-1 text-sm font-medium text-white/80">
              Kết thúc sau
            </div>
          </div>
          <CountdownTimer targetDate={endDate} />
        </div>
        <Link
          href="/search?sort=sold_desc"
          className="group flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          Xem tất cả
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Products grid */}
      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
              className="group relative overflow-hidden rounded-2xl bg-white p-3 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
            >
              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute left-2 top-2 z-10 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg shadow-rose-500/30">
                  -{discount}%
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Info */}
              <div className="mt-3">
                <div className="line-clamp-2 min-h-[36px] text-xs font-bold text-slate-800 dark:text-slate-100">
                  {p.name}
                </div>

                {/* Prices */}
                <div className="mt-2">
                  <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
                    {formatVnd(p.salePriceVnd)}
                  </div>
                  <div className="text-[10px] text-slate-400 line-through">
                    {formatVnd(p.listPriceVnd)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-rose-500">
                      Đã bán {p.soldQty}
                    </span>
                    <span className="text-slate-400">
                      {soldPercent}%
                    </span>
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
