import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/customerAuth'

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()
  
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  })
  
  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }
  
  // Update password
  const hashedPassword = await hashPassword(password)
  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { password: hashedPassword },
  })
  
  // Delete used token
  await prisma.passwordReset.delete({ where: { id: resetRecord.id } })
  
  return NextResponse.json({ success: true })
}
