import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setAuthCookie, verifyPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const username = String(body.username || '')
  const password = String(body.password || '')

  const user = await prisma.adminUser.findUnique({ where: { username } })
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 })

  setAuthCookie()
  return NextResponse.json({ ok: true })
}
