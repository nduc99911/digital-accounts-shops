import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })
  const { id } = await ctx.params

  const url = new URL(req.url)
  const methodOverride = url.searchParams.get('_method')

  if (methodOverride === 'delete') {
    await prisma.category.delete({ where: { id } })
    return NextResponse.redirect(new URL('/admin/categories', req.url))
  }

  const form = await req.formData()
  const name = String(form.get('name') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const sortOrder = Number(String(form.get('sortOrder') || '0').trim())

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  return NextResponse.redirect(new URL('/admin/categories', req.url))
}
