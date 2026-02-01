import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Categories
  const catAI = await prisma.category.upsert({
    where: { slug: 'ai-tools' },
    update: { name: 'AI Tools', sortOrder: 10 },
    create: { name: 'AI Tools', slug: 'ai-tools', sortOrder: 10 },
  })
  const catStreaming = await prisma.category.upsert({
    where: { slug: 'streaming' },
    update: { name: 'Streaming', sortOrder: 20 },
    create: { name: 'Streaming', slug: 'streaming', sortOrder: 20 },
  })
  const catDesign = await prisma.category.upsert({
    where: { slug: 'design' },
    update: { name: 'Design', sortOrder: 30 },
    create: { name: 'Design', slug: 'design', sortOrder: 30 },
  })

  const products = [
    {
      name: 'ChatGPT Plus 1 tháng',
      slug: 'chatgpt-plus-1m',
      categoryId: catAI.id,
      listPriceVnd: 249000,
      salePriceVnd: 199000,
      stockQty: 0,
      soldQty: 0,
      duration: '1 tháng',
      shortDesc: 'Tài khoản dùng ngay • Bảo hành full',
      imageUrl: 'https://picsum.photos/seed/chatgpt/800/600',
      active: true,
    },
    {
      name: 'Netflix Premium 1 tháng',
      slug: 'netflix-premium-1m',
      categoryId: catStreaming.id,
      listPriceVnd: 109000,
      salePriceVnd: 89000,
      stockQty: 0,
      soldQty: 0,
      duration: '1 tháng',
      shortDesc: 'Profile riêng • 4K',
      imageUrl: 'https://picsum.photos/seed/netflix/800/600',
      active: true,
    },
    {
      name: 'Spotify Premium 3 tháng',
      slug: 'spotify-premium-3m',
      categoryId: catStreaming.id,
      listPriceVnd: 129000,
      salePriceVnd: 99000,
      stockQty: 0,
      soldQty: 0,
      duration: '3 tháng',
      shortDesc: 'Nghe nhạc không quảng cáo',
      imageUrl: 'https://picsum.photos/seed/spotify/800/600',
      active: true,
    },
    {
      name: 'Canva Pro 1 năm',
      slug: 'canva-pro-1y',
      categoryId: catDesign.id,
      listPriceVnd: 299000,
      salePriceVnd: 249000,
      stockQty: 0,
      soldQty: 0,
      duration: '1 năm',
      shortDesc: 'Thiết kế không giới hạn',
      imageUrl: 'https://picsum.photos/seed/canva/800/600',
      active: true,
    },
  ]

  // Products + stock items
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId: p.categoryId,
        listPriceVnd: p.listPriceVnd,
        salePriceVnd: p.salePriceVnd,
        duration: p.duration,
        shortDesc: p.shortDesc,
        imageUrl: p.imageUrl,
        active: p.active,
      },
      create: p,
    })

    // Create some demo stock items (5) if none exist
    const existing = await prisma.stockItem.count({ where: { productId: product.id } })
    if (existing === 0) {
      const lines = Array.from({ length: 5 }).map((_, i) => `${p.slug.toUpperCase()}_DEMO_${String(i + 1).padStart(2, '0')}`)
      await prisma.stockItem.createMany({
        data: lines.map((value) => ({ productId: product.id, value })),
        skipDuplicates: true,
      })

      // sync stockQty to 5
      await prisma.product.update({
        where: { id: product.id },
        data: { stockQty: 5 },
      })
    }
  }

  // Payment setting sample
  const existingPay = await prisma.paymentSetting.findFirst({ orderBy: { createdAt: 'desc' } })
  if (!existingPay) {
    await prisma.paymentSetting.create({
      data: {
        bankName: 'MB Bank',
        accountNumber: '0123456789',
        accountName: 'BUI LE DIGITAL',
        note: 'Noi dung: <MA DON> (VD: BL240201-ABCD)',
        qrImageUrl: null,
        active: true,
      },
    })
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
