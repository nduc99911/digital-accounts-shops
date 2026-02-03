import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

// Get all settings
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.siteSetting.findMany()
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return NextResponse.json({
    shopName: settingsMap.shopName || 'taikhoanso.com',
    shopDescription: settingsMap.shopDescription || '',
    contactPhone: settingsMap.contactPhone || '',
    contactZalo: settingsMap.contactZalo || '',
    contactEmail: settingsMap.contactEmail || '',
    facebookPage: settingsMap.facebookPage || '',
    facebookMessenger: settingsMap.facebookMessenger || '',
    telegram: settingsMap.telegram || '',
    bannerText: settingsMap.bannerText || '',
    bannerImage: settingsMap.bannerImage || '',
    footerText: settingsMap.footerText || '',
  })
}

// Update settings
export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()

    // Handle banner image upload
    let bannerImageUrl = formData.get('bannerImageUrl') as string | null
    const bannerFile = formData.get('bannerImage') as File | null

    if (bannerFile && bannerFile.size > 0) {
      const bytes = await bannerFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true })
      }

      const ext = bannerFile.name.split('.').pop() || 'jpg'
      const filename = `banner-${Date.now()}.${ext}`
      const filepath = path.join(uploadsDir, filename)

      await writeFile(filepath, buffer)
      bannerImageUrl = `/uploads/${filename}`
    }

    // Settings to update
    const settings = [
      { key: 'shopName', value: String(formData.get('shopName') || 'taikhoanso.com') },
      { key: 'shopDescription', value: String(formData.get('shopDescription') || '') },
      { key: 'contactPhone', value: String(formData.get('contactPhone') || '') },
      { key: 'contactZalo', value: String(formData.get('contactZalo') || '') },
      { key: 'contactEmail', value: String(formData.get('contactEmail') || '') },
      { key: 'facebookPage', value: String(formData.get('facebookPage') || '') },
      { key: 'facebookMessenger', value: String(formData.get('facebookMessenger') || '') },
      { key: 'telegram', value: String(formData.get('telegram') || '') },
      { key: 'bannerText', value: String(formData.get('bannerText') || '') },
      { key: 'footerText', value: String(formData.get('footerText') || '') },
    ]

    if (bannerImageUrl) {
      settings.push({ key: 'bannerImage', value: bannerImageUrl })
    }

    // Upsert all settings
    for (const { key, value } of settings) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
