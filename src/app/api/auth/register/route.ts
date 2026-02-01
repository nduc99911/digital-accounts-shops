import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, hashPassword } from '@/lib/customerAuth'

export async function POST(req: Request) {
  const form = await req.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()
  const password = String(form.get('password') || '').trim()
  const name = String(form.get('name') || '').trim() || null

  if (!email || !email.includes('@') || password.length < 6) {
    return NextResponse.json({ error: 'Email/mật khẩu không hợp lệ (mật khẩu >= 6 ký tự)' }, { status: 400 })
  }

  const exists = await prisma.customerUser.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 })
  }

  const user = await prisma.customerUser.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      name,
    },
  })

  await createSession(user.id)
  return NextResponse.redirect(new URL('/account/orders', req.url))
}
