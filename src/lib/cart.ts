export type CartItem = {
  productId: string
  name: string
  priceVnd: number
  qty: number
}

const KEY = 'cart'

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function clearCart() {
  localStorage.removeItem(KEY)
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, it) => sum + it.priceVnd * it.qty, 0)
}
