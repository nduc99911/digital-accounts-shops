import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })

  const form = await req.formData()
  const bankName = String(form.get('bankName') || '').trim()
  const accountNumber = String(form.get('accountNumber') || '').trim()
  const accountName = String(form.get('accountName') || '').trim()
  const qrImageUrl = String(form.get('qrImageUrl') || '').trim() || null
  const note = String(form.get('note') || '').trim() || null
  const active = form.get('active') === 'on'

  if (!bankName || !accountNumber || !accountName) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  }

  const existing = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })

  if (existing) {
    await prisma.paymentSetting.update({
      where: { id: existing.id },
      data: { bankName, accountNumber, accountName, qrImageUrl, note, active },
    })
  } else {
    await prisma.paymentSetting.create({
      data: { bankName, accountNumber, accountName, qrImageUrl, note, active },
    })
  }

  return NextResponse.redirect(new URL('/admin/settings/payment', req.url))
}
