'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatVnd } from '@/lib/shop'
import { useToast } from '@/app/_ui/ToastProvider'

interface WishlistItem {
  id: string
  slug: string
  name: string
  salePriceVnd: number
  listPriceVnd: number
  imageUrl: string | null
  duration: string | null
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isClient, setIsClient] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id)
    setItems(newItems)
    localStorage.setItem('wishlist', JSON.stringify(newItems))
    showToast('Đã xóa khỏi yêu thích', 'success')
  }

  const addToCart = (item: WishlistItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((c: any) => c.productId === item.id)
    
    if (existing) {
      existing.qty += 1
    } else {
      cart.push({
        productId: item.id,
        name: item.name,
        priceVnd: item.salePriceVnd,
        qty: 1,
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    showToast('Đã thêm vào giỏ hàng!', 'success')
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const moveAllToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    items.forEach(item => {
      const existing = cart.find((c: any) => c.productId === item.id)
      if (existing) {
        existing.qty += 1
      } else {
        cart.push({
          productId: item.id,
          name: item.name,
          priceVnd: item.salePriceVnd,
          qty: 1,
        })
      }
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.removeItem('wishlist')
    setItems([])
    showToast('Đã thêm tất cả vào giỏ!', 'success')
    window.dispatchEvent(new Event('cartUpdated'))
  }

  if (!isClient) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-8xl mb-6">💝</div>
          <h1 className="text-3xl font-bold text-slate-900">Danh sách yêu thích trống</h1>
          <p className="mt-4 text-slate-600">Bạn chưa có sản phẩm yêu thích nào</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white shadow-lg"
          >
            🛒 Khám phá sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            💝 Danh sách yêu thích ({items.length})
          </h1>
          <button
            onClick={moveAllToCart}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all"
          >
            Thêm tất cả vào giỏ
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-white/80 backdrop-blur-xl p-4 shadow-lg border border-white/50 transition-all hover:shadow-xl"
            >
              <Link href={`/product/${item.slug}`}>
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={item.imageUrl || `https://picsum.photos/seed/${item.slug}/400/300`}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              
              <div className="mt-4">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-bold text-slate-900 hover:text-violet-600 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-violet-600">
                    {formatVnd(item.salePriceVnd)}
                  </span>
                  {item.listPriceVnd > item.salePriceVnd && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatVnd(item.listPriceVnd)}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 font-semibold text-white text-sm"
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-xl bg-rose-100 px-4 py-2 text-rose-600 hover:bg-rose-200"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
