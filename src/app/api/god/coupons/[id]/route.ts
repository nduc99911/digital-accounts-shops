import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const body = await req.json()
  
  const coupon = await prisma.coupon.update({
    where: { id },
    data: { active: body.active },
  })
  return NextResponse.json({ coupon })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  await prisma.coupon.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
