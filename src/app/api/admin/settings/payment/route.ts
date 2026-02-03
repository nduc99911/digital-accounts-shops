import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false }, { status: 401 })

  const form = await req.formData()
  const bankName = String(form.get('bankName') || '').trim()
  const accountNumber = String(form.get('accountNumber') || '').trim()
  const accountName = String(form.get('accountName') || '').trim()
  const note = String(form.get('note') || '').trim() || null
  const active = form.get('active') === 'on'

  if (!bankName || !accountNumber || !accountName) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  }

  // Handle QR image upload
  let qrImageUrl: string | null = null
  const qrFile = form.get('qrImage') as File | null
  
  if (qrFile && qrFile.size > 0) {
    const bytes = await qrFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create uploads directory if not exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Generate unique filename
    const ext = qrFile.name.split('.').pop() || 'png'
    const filename = `qr-${Date.now()}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)
    qrImageUrl = `/uploads/${filename}`
  }

  const existing = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })

  if (existing) {
    const updateData: any = { bankName, accountNumber, accountName, note, active }
    if (qrImageUrl) updateData.qrImageUrl = qrImageUrl  // Only update if new file uploaded
    
    await prisma.paymentSetting.update({
      where: { id: existing.id },
      data: updateData,
    })
  } else {
    await prisma.paymentSetting.create({
      data: { bankName, accountNumber, accountName, qrImageUrl, note, active },
    })
  }

  return NextResponse.json({ ok: true })
}
