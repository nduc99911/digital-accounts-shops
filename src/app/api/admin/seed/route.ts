import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// DEV ONLY helper: seed sample products + admin
// Call: POST /api/admin/seed
export async function POST(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 })
  }
  if (!key || key !== (process.env.ADMIN_SEED_KEY || 'dev')) {
    return NextResponse.json({ error: 'Missing/invalid key' }, { status: 401 })
  }

  const existingAdmin = await prisma.adminUser.findFirst()
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        name: 'Admin',
        username: 'admin',
        passwordHash: await hashPassword('admin123'),
      },
    })
  }

  const samples = [
    {
      name: 'ChatGPT Plus 1 tháng',
      slug: 'chatgpt-plus-1m',
      priceVnd: 199000,
      duration: '1 tháng',
      shortDesc: 'Tài khoản dùng ngay • Bảo hành full',
      imageUrl: 'https://picsum.photos/seed/chatgpt/800/600',
      active: true,
    },
    {
      name: 'Netflix Premium 1 tháng',
      slug: 'netflix-premium-1m',
      priceVnd: 89000,
      duration: '1 tháng',
      shortDesc: 'Profile riêng • 4K',
      imageUrl: 'https://picsum.photos/seed/netflix/800/600',
      active: true,
    },
    {
      name: 'Spotify Premium 3 tháng',
      slug: 'spotify-premium-3m',
      priceVnd: 99000,
      duration: '3 tháng',
      shortDesc: 'Nghe nhạc không quảng cáo',
      imageUrl: 'https://picsum.photos/seed/spotify/800/600',
      active: true,
    },
  ]

  for (const p of samples) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        priceVnd: p.priceVnd,
        duration: p.duration,
        shortDesc: p.shortDesc,
        imageUrl: p.imageUrl,
        active: p.active,
      },
      create: p as any,
    })
  }

  return NextResponse.json({ ok: true, seeded: samples.length })
}
