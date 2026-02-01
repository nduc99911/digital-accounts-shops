import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { makeOrderCode } from '@/lib/shop'
import { getCurrentCustomer } from '@/lib/customerAuth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const customerName = String(body.customerName || '').trim()
  if (!customerName) return NextResponse.json({ error: 'Thiếu tên khách' }, { status: 400 })

  const items = Array.isArray(body.items) ? body.items : []
  if (items.length === 0) return NextResponse.json({ error: 'Giỏ hàng trống' }, { status: 400 })

  // Re-price from DB to avoid tampering
  const rawIds: string[] = items
    .map((it: unknown) => String((it as { productId?: unknown })?.productId || ''))
    .filter((s): s is string => Boolean(s))

  const productIds: string[] = Array.from(new Set(rawIds))
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } })
  const byId = new Map(products.map((p) => [p.id, p]))

  const orderItems: { productId: string; qty: number; unitVnd: number }[] = []
  for (const it of items as unknown[]) {
    const obj = it as { productId?: unknown; qty?: unknown }
    const pid = String(obj.productId || '')
    const qty = Math.max(1, Math.min(99, Number(obj.qty || 1)))
    const p = byId.get(pid)
    if (!p) continue
    orderItems.push({ productId: pid, qty, unitVnd: p.salePriceVnd })
  }

  if (orderItems.length === 0) return NextResponse.json({ error: 'Sản phẩm không hợp lệ' }, { status: 400 })

  // Inventory/stock guard (avoid creating orders that cannot be fulfilled).
  // Fulfillment uses StockItem allocation, so validate against StockItem too.
  for (const it of orderItems) {
    const p = byId.get(it.productId)
    if (!p) return NextResponse.json({ error: 'Sản phẩm không hợp lệ' }, { status: 400 })

    if (p.stockQty < it.qty) {
      return NextResponse.json({ error: `Sản phẩm tạm hết hàng: ${p.name}` }, { status: 400 })
    }

    const availableKeys = await prisma.stockItem.count({ where: { productId: it.productId, usedAt: null } })
    if (availableKeys < it.qty) {
      return NextResponse.json({ error: `Sản phẩm tạm hết kho: ${p.name}` }, { status: 400 })
    }
  }

  const totalVnd = orderItems.reduce((sum, it) => sum + it.unitVnd * it.qty, 0)

  // make unique-ish code (retry on collision)
  let code = makeOrderCode()
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.order.findUnique({ where: { code } })
    if (!exists) break
    code = makeOrderCode()
  }

  const user = await getCurrentCustomer()

  const order = await prisma.order.create({
    data: {
      code,
      userId: user?.id ?? null,
      customerName,
      phone: body.phone ? String(body.phone).trim() : null,
      zalo: body.zalo ? String(body.zalo).trim() : null,
      email: body.email ? String(body.email).trim() : null,
      note: body.note ? String(body.note).trim() : null,
      totalVnd,
      status: 'PENDING_PAYMENT',
      items: {
        create: orderItems.map((it) => ({
          productId: it.productId,
          qty: it.qty,
          unitVnd: it.unitVnd,
        })),
      },
    },
  })

  return NextResponse.json({ id: order.id, code: order.code })
}
