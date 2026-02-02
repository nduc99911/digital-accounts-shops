import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Thiếu token' }, { status: 400 })
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
    return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 400 })
  }

  if (resetToken.usedAt) {
    return NextResponse.json({ error: 'Token đã được sử dụng' }, { status: 400 })
  }

  if (resetToken.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Token đã hết hạn' }, { status: 400 })
  }

  return NextResponse.json({ valid: true })
}
