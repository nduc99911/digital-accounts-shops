import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, verifyPassword } from '@/lib/customerAuth'

export async function POST(req: Request) {
  const form = await req.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()
  const password = String(form.get('password') || '').trim()

  const user = await prisma.customerUser.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Sai email hoặc mật khẩu' }, { status: 400 })
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: 'Sai email hoặc mật khẩu' }, { status: 400 })
  }

  await createSession(user.id)
  return NextResponse.redirect(new URL('/account/orders', req.url))
}
