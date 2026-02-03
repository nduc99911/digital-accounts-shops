import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json().catch(() => null)
  const nextStatus = String(body?.status || '')

  if (nextStatus !== 'PENDING_PAYMENT' && nextStatus !== 'SUCCESS') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Do not allow reverting if already fulfilled
  if (nextStatus === 'PENDING_PAYMENT') {
    const existingFulfill = await prisma.orderFulfillment.count({ where: { orderId: id } })
    if (existingFulfill > 0) {
      return NextResponse.json({ error: 'Order already fulfilled; cannot revert.' }, { status: 400 })
    }
    const order = await prisma.order.update({ where: { id }, data: { status: 'PENDING_PAYMENT' } })
    return NextResponse.json({ ok: true, id: order.id, status: order.status })
  }

  // SUCCESS: allocate stock items for each order item
  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      })
      if (!order) throw new Error('Order not found')
      if (order.status === 'SUCCESS') return order

      // ensure enough stock for each product
      for (const it of order.items) {
        const available = await tx.stockItem.count({ where: { productId: it.productId, usedAt: null } })
        if (available < it.qty) {
          const p = await tx.product.findUnique({ where: { id: it.productId } })
          throw new Error(`Không đủ kho cho sản phẩm: ${p?.name || it.productId}`)
        }
      }

      // allocate
      for (const it of order.items) {
        const stocks = await tx.stockItem.findMany({
          where: { productId: it.productId, usedAt: null },
          take: it.qty,
          orderBy: { createdAt: 'asc' },
        })

        for (const s of stocks) {
          await tx.stockItem.update({ where: { id: s.id }, data: { usedAt: new Date() } })
          await tx.orderFulfillment.create({
            data: {
              orderId: order.id,
              productId: it.productId,
              stockItemId: s.id,
              value: s.value,
            },
          })
        }

        await tx.product.update({
          where: { id: it.productId },
          data: {
            stockQty: { decrement: it.qty },
            soldQty: { increment: it.qty },
          },
        })
      }

      return tx.order.update({ where: { id: order.id }, data: { status: 'SUCCESS' } })
    })

    return NextResponse.json({ ok: true, id: result.id, status: result.status })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Fulfillment failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
