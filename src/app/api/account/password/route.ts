import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentCustomer, verifyPassword, hashPassword } from '@/lib/customerAuth'

export async function POST(req: Request) {
  const user = await getCurrentCustomer()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const currentPassword = String(form.get('currentPassword') || '')
  const newPassword = String(form.get('newPassword') || '')

  // Validate input
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 })
  }

  try {
    // Get user with password hash
    const customer = await prisma.customerUser.findUnique({
      where: { id: user.id },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Không tìm thấy ngưởi dùng' }, { status: 404 })
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, customer.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await prisma.customerUser.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Có lỗi xảy ra khi đổi mật khẩu' }, { status: 500 })
  }
}
