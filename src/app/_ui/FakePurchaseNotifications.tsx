'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { formatVnd } from '@/lib/shop'

interface FakeNotification {
  id: string
  productName: string
  productSlug: string
  price: number
  customerName: string
  timeAgo: string
  imageUrl: string
}

const fakeNames = [
  'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 
  'Hoàng Văn E', 'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H',
  'Đỗ Văn I', 'Ngô Thị K', 'Dương Văn L', 'Lý Thị M',
  'Mai Văn N', 'Trịnh Thị O', 'Phan Văn P'
]

const fakeProducts = [
  { name: 'Netflix Premium 4K', price: 79000 },
  { name: 'Spotify Premium', price: 35000 },
  { name: 'ChatGPT Plus', price: 450000 },
  { name: 'Canva Pro', price: 29000 },
  { name: 'YouTube Premium', price: 59000 },
  { name: 'Windows 11 Pro', price: 450000 },
  { name: 'Office 365', price: 290000 },
  { name: 'Adobe Creative Cloud', price: 950000 },
  { name: 'Disney+ Hotstar', price: 45000 },
  { name: 'Apple Music', price: 39000 },
]

const timeOptions = ['1 phút trước', '3 phút trước', '5 phút trước', '10 phút trước', '15 phút trước']

function generateFakeNotification(): FakeNotification {
  const product = fakeProducts[Math.floor(Math.random() * fakeProducts.length)]
  const name = fakeNames[Math.floor(Math.random() * fakeNames.length)]
  const time = timeOptions[Math.floor(Math.random() * timeOptions.length)]
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    productName: product.name,
    productSlug: product.name.toLowerCase().replace(/\s+/g, '-'),
    price: product.price,
    customerName: name,
    timeAgo: time,
    imageUrl: `https://picsum.photos/seed/${product.name}/100/100`,
  }
}

export default function FakePurchaseNotifications() {
  const [notifications, setNotifications] = useState<FakeNotification[]>([])
  const [isClient, setIsClient] = useState(false)

  const addNotification = useCallback(() => {
    const newNotification = generateFakeNotification()
    setNotifications(prev => [newNotification, ...prev].slice(0, 3))
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
    }, 5000)
  }, [])

  useEffect(() => {
    setIsClient(true)
    
    // Show first notification after 3 seconds
    const firstTimer = setTimeout(() => {
      addNotification()
    }, 3000)

    // Then show every 8-15 seconds
    const interval = setInterval(() => {
      addNotification()
    }, 8000 + Math.random() * 7000)

    return () => {
      clearTimeout(firstTimer)
      clearInterval(interval)
    }
  }, [addNotification])

  if (!isClient) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-3">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-xl p-3 pr-5 shadow-2xl shadow-slate-400/30 border border-white/50 animate-in slide-in-from-left-full fade-in duration-500"
          style={{
            animationDelay: `${index * 100}ms`,
            maxWidth: '360px',
          }}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {notification.customerName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900 truncate">
                {notification.customerName}
              </span>
              <span className="text-xs text-emerald-600 font-semibold whitespace-nowrap">
                vừa mua
              </span>
            </div>
            <Link 
              href={`/product/${notification.productSlug}`}
              className="block text-sm font-medium text-violet-600 hover:text-violet-700 truncate transition-colors"
            >
              {notification.productName}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-rose-600">
                {formatVnd(notification.price)}
              </span>
              <span className="text-[10px] text-slate-400">
                • {notification.timeAgo}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            className="shrink-0 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
