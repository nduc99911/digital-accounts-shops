import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public API to get site settings
export async function GET() {
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
