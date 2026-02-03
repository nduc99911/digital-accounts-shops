import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/adminAuth'

// Get SePay settings
export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const setting = await prisma.paymentSetting.findFirst({
    where: { active: true },
  })

  return NextResponse.json({
    enabled: !!process.env.SEPAY_SECRET,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/sepay`,
    bankAccount: setting?.accountNumber || '',
    bankName: setting?.bankName || '',
  })
}

// Update SePay settings
export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sepaySecret, bankAccount, bankName, accountName } = await request.json()

  // Update environment variable (in production, use proper secret management)
  // For now, we'll save to database

  await prisma.paymentSetting.upsert({
    where: { id: 'sepay' },
    update: {
      bankName,
      accountNumber: bankAccount,
      accountName,
      active: true,
    },
    create: {
      id: 'sepay',
      bankName,
      accountNumber: bankAccount,
      accountName,
      note: `SePay Webhook: ${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/sepay`,
      active: true,
    },
  })

  return NextResponse.json({ success: true })
}
