import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await _req.json().catch(() => null)
  const status = String(body?.status || '')

  if (status !== 'PENDING_PAYMENT' && status !== 'SUCCESS') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const order = await prisma.order.update({ where: { id }, data: { status } })
  return NextResponse.json({ ok: true, id: order.id, status: order.status })
}
