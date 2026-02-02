import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/customerAuth'

export async function POST(req: Request) {
  const form = await req.formData()
  const token = String(form.get('token') || '')
  const password = String(form.get('password') || '')

  if (!token || !password) {
    return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 })
  }

  // Find valid token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!resetToken) {
    return NextResponse.json({ error: 'Liên kết không hợp lệ' }, { status: 400 })
  }

  if (resetToken.usedAt) {
    return NextResponse.json({ error: 'Liên kết đã được sử dụng' }, { status: 400 })
  }

  if (resetToken.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Liên kết đã hết hạn' }, { status: 400 })
  }

  try {
    // Hash new password
    const passwordHash = await hashPassword(password)

    // Update user password
    await prisma.customerUser.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    })

    // Delete all sessions for this user for security
    await prisma.customerSession.deleteMany({
      where: { userId: resetToken.userId },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Đặt lại mật khẩu thành công' 
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Có lỗi xảy ra, vui lòng thử lại' }, { status: 500 })
  }
}
