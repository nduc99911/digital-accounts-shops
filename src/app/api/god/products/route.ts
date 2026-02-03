import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

function parseWarranty(s: string) {
  const v = (s || '').toUpperCase()
  if (v === 'FULL' || v === 'LIMITED' || v === 'NONE') return v
  return 'FULL'
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })

  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const listPriceVnd = Number(String(form.get('listPriceVnd') || '0').trim())
  const salePriceVnd = Number(String(form.get('salePriceVnd') || '0').trim())
  const stockQty = Number(String(form.get('stockQty') || '0').trim())

  const categoryIdRaw = String(form.get('categoryId') || '').trim()
  const categoryId = categoryIdRaw || null
  const duration = String(form.get('duration') || '').trim() || null
  const warranty = parseWarranty(String(form.get('warranty') || 'FULL')) as 'FULL' | 'LIMITED' | 'NONE'
  const imageUrl = String(form.get('imageUrl') || '').trim() || null
  const shortDesc = String(form.get('shortDesc') || '').trim() || null
  const description = String(form.get('description') || '').trim() || null
  const active = form.get('active') === 'on'

  if (
    !name ||
    !slug ||
    !Number.isFinite(listPriceVnd) ||
    !Number.isFinite(salePriceVnd) ||
    !Number.isFinite(stockQty)
  ) {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
  }

  await prisma.product.create({
    data: {
      name,
      slug,
      listPriceVnd,
      salePriceVnd,
      stockQty: Math.max(0, Math.trunc(stockQty)),
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
