'use client'

import { useState } from 'react'

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

  function add() {
    const raw = localStorage.getItem('cart')
    const cart: any[] = raw ? JSON.parse(raw) : []
    const i = cart.findIndex((x) => x.productId === productId)
    if (i >= 0) cart[i].qty += 1
    else cart.push({ productId, name, priceVnd, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <button onClick={add} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
      {added ? 'Đã thêm' : 'Thêm vào giỏ'}
    </button>
  )
}
