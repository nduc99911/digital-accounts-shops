import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer, hashPassword, verifyPassword } from '@/lib/customerAuth'

export async function PUT(request: NextRequest) {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { currentPassword, newPassword } = await request.json()
  
  // Verify current password
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || !await verifyPassword(currentPassword, dbUser.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
  }
  
  // Update password
  const hashedPassword = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })
  
  return NextResponse.json({ success: true })
}
