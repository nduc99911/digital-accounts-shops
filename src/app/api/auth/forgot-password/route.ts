import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const form = await req.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'Vui lòng nhập email' }, { status: 400 })
  }

  // Find user
  const user = await prisma.customerUser.findUnique({
    where: { email },
  })

  // Always return success to prevent email enumeration
  // But only actually send email if user exists
  if (!user) {
    return NextResponse.json({ 
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu.' 
    })
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  // Delete any existing tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  })

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  // Generate reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

  // In production, you would send an email here
  // For now, we'll just log the URL to console
  console.log('========================================')
  console.log('Password Reset URL:')
  console.log(resetUrl)
  console.log('========================================')

  // TODO: Implement email sending with your preferred provider
  // Examples: SendGrid, AWS SES, Resend, etc.
  // await sendPasswordResetEmail(user.email, resetUrl)

  return NextResponse.json({ 
    success: true,
    message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.' 
  })
}
