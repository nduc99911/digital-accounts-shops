import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/customerAuth'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })
    
    if (!resetRecord || resetRecord.expiresAt < new Date() || resetRecord.usedAt) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }
    
    // Update password
    const hashedPassword = await hashPassword(password)
    await prisma.customerUser.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: hashedPassword },
    })
    
    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
