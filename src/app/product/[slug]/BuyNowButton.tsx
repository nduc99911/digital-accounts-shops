'use client'

export default function BuyNowButton({
  productId,
  name,
  priceVnd,
}: {
  productId: string
  name: string
  priceVnd: number
}) {
  function buyNow() {
    const raw = localStorage.getItem('cart')
    const cart: Array<{ productId: string; name: string; priceVnd: number; qty: number }> = raw ? JSON.parse(raw) : []
    const i = cart.findIndex((x) => x.productId === productId)
    if (i >= 0) cart[i].qty += 1
    else cart.push({ productId, name, priceVnd, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    window.location.href = '/checkout'
  }

  return (
    <button
      onClick={buyNow}
      className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
    >
      Mua ngay
    </button>
  )
}
