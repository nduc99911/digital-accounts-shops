'use client'

import { useState } from 'react'
import { useToast } from '@/app/_ui/ToastProvider'

export default function AddToCartButton({
  productId,
  name,
  priceVnd,
}: {
  productId: string
  name: string
  priceVnd: number
}) {
  const [added, setAdded] = useState(false)
  const { showToast } = useToast()

  function add() {
    const raw = localStorage.getItem('cart')
    const cart: Array<{ productId: string; name: string; priceVnd: number; qty: number }> = raw ? JSON.parse(raw) : []
    const i = cart.findIndex((x) => x.productId === productId)
    const isNewItem = i < 0
    if (i >= 0) {
      cart[i].qty += 1
    } else {
      cart.push({ productId, name, priceVnd, qty: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)

    // Show toast notification
    showToast(
      isNewItem ? `Đã thêm "${name}" vào giỏ hàng` : `Đã tăng số lượng "${name}" trong giỏ`,
      'success',
      2500
    )

    // Dispatch custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <button onClick={add} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
      {added ? 'Đã thêm ✓' : 'Thêm vào giỏ'}
    </button>
  )
}
