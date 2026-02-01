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

  const catA = await prisma.category.upsert({
    where: { slug: 'ai-tools' },
    update: { name: 'AI Tools', sortOrder: 10 },
    create: { name: 'AI Tools', slug: 'ai-tools', sortOrder: 10 },
  })
  const catB = await prisma.category.upsert({
    where: { slug: 'streaming' },
    update: { name: 'Streaming', sortOrder: 20 },
    create: { name: 'Streaming', slug: 'streaming', sortOrder: 20 },
  })

  const samples = [
    {
      name: 'ChatGPT Plus 1 tháng',
      slug: 'chatgpt-plus-1m',
      listPriceVnd: 249000,
      salePriceVnd: 199000,
      stockQty: 50,
      soldQty: 0,
      duration: '1 tháng',
      categoryId: catA.id,
      shortDesc: 'Tài khoản dùng ngay • Bảo hành full',
      imageUrl: 'https://picsum.photos/seed/chatgpt/800/600',
      active: true,
    },
    {
      name: 'Netflix Premium 1 tháng',
      slug: 'netflix-premium-1m',
      listPriceVnd: 109000,
      salePriceVnd: 89000,
      stockQty: 100,
      soldQty: 0,
      duration: '1 tháng',
      categoryId: catB.id,
      shortDesc: 'Profile riêng • 4K',
      imageUrl: 'https://picsum.photos/seed/netflix/800/600',
      active: true,
    },
    {
      name: 'Spotify Premium 3 tháng',
      slug: 'spotify-premium-3m',
      listPriceVnd: 129000,
      salePriceVnd: 99000,
      stockQty: 100,
      soldQty: 0,
      duration: '3 tháng',
      categoryId: catB.id,
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
        listPriceVnd: p.listPriceVnd,
        salePriceVnd: p.salePriceVnd,
        stockQty: p.stockQty,
        soldQty: p.soldQty,
        duration: p.duration,
        shortDesc: p.shortDesc,
        imageUrl: p.imageUrl,
        active: p.active,
      },
      create: p,
    })
  }

  return NextResponse.json({ ok: true, seeded: samples.length })
}
