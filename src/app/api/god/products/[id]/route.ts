import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

function parseWarranty(s: string) {
  const v = (s || '').toUpperCase()
  if (v === 'FULL' || v === 'LIMITED' || v === 'NONE') return v
  return 'FULL'
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })
  const { id } = await ctx.params

  const url = new URL(req.url)
  const methodOverride = url.searchParams.get('_method')

  if (methodOverride === 'delete') {
    await prisma.product.delete({ where: { id } })
    return NextResponse.redirect(new URL('/god/products', req.url))
  }

  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const listPriceVnd = Number(String(form.get('listPriceVnd') || '0').trim())
  const salePriceVnd = Number(String(form.get('salePriceVnd') || '0').trim())
  const stockQty = Number(String(form.get('stockQty') || '0').trim())
  const soldQty = Number(String(form.get('soldQty') || '0').trim())

  const categoryIdRaw = String(form.get('categoryId') || '').trim()
  const categoryId = categoryIdRaw || null
  const duration = String(form.get('duration') || '').trim() || null
  const warranty = parseWarranty(String(form.get('warranty') || 'FULL')) as 'FULL' | 'LIMITED' | 'NONE'
  const imageUrl = String(form.get('imageUrl') || '').trim() || null
  const shortDesc = String(form.get('shortDesc') || '').trim() || null
  const description = String(form.get('description') || '').trim() || null
  const active = form.get('active') === 'on'

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      listPriceVnd,
      salePriceVnd,
      stockQty: Math.max(0, Math.trunc(stockQty)),
      soldQty: Math.max(0, Math.trunc(soldQty)),
      categoryId,
      duration,
      warranty,
      imageUrl,
      shortDesc,
      description,
      active,
    },
  })

  return NextResponse.redirect(new URL('/god/products', req.url))
}
