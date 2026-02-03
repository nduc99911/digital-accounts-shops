import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    const user = await prisma.customerUser.findUnique({ where: { email } })
    if (!user) {
      // Return success even if user not found (security best practice)
      return NextResponse.json({ success: true })
    }
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    
    // Save token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })
    
    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password/${token}`
    
    // Send email
    const { subject, html, text } = getPasswordResetEmailTemplate(resetUrl)
    const emailResult = await sendEmail({
      to: email,
      subject,
      html,
      text,
    })
    
    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error)
      // Still return success to user, but log error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
