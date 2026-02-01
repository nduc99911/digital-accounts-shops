import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })

  const { id: productId } = await ctx.params
  const form = await req.formData()
  const raw = String(form.get('lines') || '')

  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return NextResponse.redirect(new URL(`/admin/products/${productId}/stock`, req.url))
  }

  // createMany with skipDuplicates uses the @@unique([productId,value])
  const created = await prisma.stockItem.createMany({
    data: lines.map((value) => ({ productId, value })),
    skipDuplicates: true,
  })

  if (created.count > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        stockQty: { increment: created.count },
      },
    })
  }

  return NextResponse.redirect(new URL(`/admin/products/${productId}/stock`, req.url))
}
