import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

function parseWarranty(s: string) {
  const v = (s || '').toUpperCase()
  if (v === 'FULL' || v === 'LIMITED' || v === 'NONE') return v
  return 'FULL'
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 })

  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const priceVnd = Number(String(form.get('priceVnd') || '0').trim())
  const duration = String(form.get('duration') || '').trim() || null
  const warranty = parseWarranty(String(form.get('warranty') || 'FULL'))
  const shortDesc = String(form.get('shortDesc') || '').trim() || null
  const description = String(form.get('description') || '').trim() || null
  const active = form.get('active') === 'on'

  if (!name || !slug || !Number.isFinite(priceVnd)) {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
  }

  await prisma.product.create({
    data: {
      name,
      slug,
      priceVnd,
      duration,
      warranty: warranty as any,
      shortDesc,
      description,
      active,
    },
  })

  return NextResponse.redirect(new URL('/admin/products', req.url))
}
