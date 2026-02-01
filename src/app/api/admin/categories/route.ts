import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })

  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const sortOrder = Number(String(form.get('sortOrder') || '0').trim())

  if (!name || !slug || !Number.isFinite(sortOrder)) {
    return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
  }

  await prisma.category.create({
    data: { name, slug, sortOrder },
  })

  return NextResponse.redirect(new URL('/admin/categories', req.url))
}
