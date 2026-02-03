import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth } from '@/lib/adminAuth'
import { encrypt } from '@/lib/encryption'

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminAuth())) return NextResponse.json({ ok: false }, { status: 401 })

  const { id: productId } = await ctx.params
  const form = await req.formData()
  const raw = String(form.get('lines') || '')

  const lines = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return NextResponse.redirect(new URL(`/god/products/${productId}/stock`, req.url))
  }

  // Encrypt each stock item before saving
  const encryptedLines = lines.map((value) => encrypt(value))

  // createMany with skipDuplicates uses the @@unique([productId,value])
  const created = await prisma.stockItem.createMany({
    data: encryptedLines.map((value) => ({ productId, value })),
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

  return NextResponse.redirect(new URL(`/god/products/${productId}/stock`, req.url))
}
