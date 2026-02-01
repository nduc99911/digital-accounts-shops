import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const s = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })
  if (!s || !s.active) {
    return NextResponse.json({ active: false })
  }

  return NextResponse.json({
    active: true,
    bankName: s.bankName,
    accountNumber: s.accountNumber,
    accountName: s.accountName,
    note: s.note,
    qrImageUrl: s.qrImageUrl,
  })
}
