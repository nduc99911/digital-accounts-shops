import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/customerAuth'

const sampleCategories = [
  { name: 'Netflix', slug: 'netflix', sortOrder: 1 },
  { name: 'Spotify', slug: 'spotify', sortOrder: 2 },
  { name: 'ChatGPT', slug: 'chatgpt', sortOrder: 3 },
  { name: 'Canva Pro', slug: 'canva-pro', sortOrder: 4 },
  { name: 'YouTube Premium', slug: 'youtube-premium', sortOrder: 5 },
  { name: 'Steam Wallet', slug: 'steam-wallet', sortOrder: 6 },
  { name: 'Google One', slug: 'google-one', sortOrder: 7 },
  { name: 'Discord Nitro', slug: 'discord-nitro', sortOrder: 8 },
]

const sampleProducts = [
  {
    name: 'Netflix Premium 4K - 1 tháng',
    slug: 'netflix-premium-4k-1-thang',
    shortDesc: 'Tài khoản Netflix Premium 4K, xem không giới hạn',
    description: '✓ Chất lượng 4K Ultra HD\n✓ Xem trên 4 thiết hạn\n✓ Không quảng cáo\n✓ Bảo hành 30 ngày',
    listPriceVnd: 260000,
    salePriceVnd: 79000,
    duration: '1 tháng',
    categorySlug: 'netflix',
    soldQty: 1250,
    stockQty: 50,
  },
  {
    name: 'Netflix Premium 4K - 3 tháng',
    slug: 'netflix-premium-4k-3-thang',
    shortDesc: 'Tiết kiệm hơn với gói 3 tháng',
    description: '✓ Chất lượng 4K Ultra HD\n✓ Xem trên 4 thiết hạn\n✓ Tiết kiệm 30%\n✓ Bảo hành 90 ngày',
    listPriceVnd: 780000,
    salePriceVnd: 199000,
    duration: '3 tháng',
    categorySlug: 'netflix',
    soldQty: 890,
    stockQty: 35,
  },
  {
    name: 'Spotify Premium - 1 tháng',
    slug: 'spotify-premium-1-thang',
    shortDesc: 'Nghe nhạc không quảng cáo, chất lượng cao',
    description: '✓ Không quảng cáo\n✓ Chất lượng cao 320kbps\n✓ Tải về offline\n✓ Bảo hành 30 ngày',
    listPriceVnd: 59000,
    salePriceVnd: 29000,
    duration: '1 tháng',
    categorySlug: 'spotify',
    soldQty: 2100,
    stockQty: 100,
  },
  {
    name: 'Spotify Premium - 1 năm',
    slug: 'spotify-premium-1-nam',
    shortDesc: 'Gói cả năm tiết kiệm 60%',
    description: '✓ Không quảng cáo cả năm\n✓ Tiết kiệm 60%\n✓ Chuyển playlist dễ dàng\n✓ Bảo hành 365 ngày',
    listPriceVnd: 708000,
    salePriceVnd: 279000,
    duration: '1 năm',
    categorySlug: 'spotify',
    soldQty: 560,
    stockQty: 20,
  },
  {
    name: 'ChatGPT Plus - 1 tháng',
    slug: 'chatgpt-plus-1-thang',
    shortDesc: 'Truy cập GPT-4, không giới hạn',
    description: '✓ Truy cập GPT-4\n✓ Không giới hạn tin nhắn\n✓ Tốc độ phản hồi nhanh\n✓ Plugin & DALL-E',
    listPriceVnd: 500000,
    salePriceVnd: 99000,
    duration: '1 tháng',
    categorySlug: 'chatgpt',
    soldQty: 3200,
    stockQty: 75,
  },
  {
    name: 'Canva Pro - 1 năm',
    slug: 'canva-pro-1-nam',
    shortDesc: 'Thiết kế đồ họa chuyên nghiệp',
    description: '✓ 100+ triệu stock photo\n✓ 600k+ templates\n✓ Brand Kit\n✓ Background Remover',
    listPriceVnd: 1800000,
    salePriceVnd: 349000,
    duration: '1 năm',
    categorySlug: 'canva-pro',
    soldQty: 890,
    stockQty: 30,
  },
  {
    name: 'YouTube Premium - 1 tháng',
    slug: 'youtube-premium-1-thang',
    shortDesc: 'Xem YouTube không quảng cáo',
    description: '✓ Không quảng cáo\n✓ Phát nền & offline\n✓ YouTube Music Premium\n✓ Bảo hành 30 ngày',
    listPriceVnd: 89000,
    salePriceVnd: 39000,
    duration: '1 tháng',
    categorySlug: 'youtube-premium',
    soldQty: 1500,
    stockQty: 60,
  },
  {
    name: 'Steam Wallet Code 100K',
    slug: 'steam-wallet-100k',
    shortDesc: 'Nạp tiền vào ví Steam',
    description: '✓ Code chính hãng\n✓ Nạp ngay tức thì\n✓ Không giới hạn sử dụng\n✓ Mua game DLC thoải mái',
    listPriceVnd: 100000,
    salePriceVnd: 95000,
    duration: 'Vĩnh viễn',
    categorySlug: 'steam-wallet',
    soldQty: 450,
    stockQty: 200,
  },
  {
    name: 'Google One 2TB - 1 năm',
    slug: 'google-one-2tb-1-nam',
    shortDesc: 'Lưu trữ đám mây 2TB',
    description: '✓ 2TB lưu trữ\n✓ Chia sẻ với 5 ngườI\n✓ VPN miễn phí\n✓ Hỗ trợ ưu tiên',
    listPriceVnd: 2400000,
    salePriceVnd: 449000,
    duration: '1 năm',
    categorySlug: 'google-one',
    soldQty: 230,
    stockQty: 15,
  },
  {
    name: 'Discord Nitro - 1 tháng',
    slug: 'discord-nitro-1-thang',
    shortDesc: 'Trải nghiệm Discord cao cấp',
    description: '✓ Upload file 100MB\n✓ Emoji tùy chỉnh\n✓ HD Video\n✓ 2 Server Boosts',
    listPriceVnd: 280000,
    salePriceVnd: 79000,
    duration: '1 tháng',
    categorySlug: 'discord-nitro',
    soldQty: 670,
    stockQty: 40,
  },
]

const sampleStock = [
  'email1@gmail.com:password123',
  'email2@gmail.com:password456',
  'email3@gmail.com:password789',
  'email4@gmail.com:password101',
  'email5@gmail.com:password202',
]

export async function seedSampleData() {
  console.log('🌱 Seeding sample data...')

  // Create categories
  for (const cat of sampleCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created')

  // Create products
  for (const prod of sampleProducts) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    })

    if (category) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: {
          name: prod.name,
          slug: prod.slug,
          shortDesc: prod.shortDesc,
          description: prod.description,
          listPriceVnd: prod.listPriceVnd,
          salePriceVnd: prod.salePriceVnd,
          duration: prod.duration,
          categoryId: category.id,
          soldQty: prod.soldQty,
          stockQty: prod.stockQty,
          active: true,
        },
      })
    }
  }
  console.log('✅ Products created')

  // Add sample stock to first product
  const firstProduct = await prisma.product.findFirst({
    where: { slug: 'netflix-premium-4k-1-thang' },
  })

  if (firstProduct && firstProduct.stockQty === 0) {
    for (const value of sampleStock) {
      await prisma.stockItem.create({
        data: {
          productId: firstProduct.id,
          value,
        },
      }).catch(() => {}) // Ignore duplicates
    }
    
    await prisma.product.update({
      where: { id: firstProduct.id },
      data: { stockQty: sampleStock.length },
    })
    console.log('✅ Sample stock added')
  }

  // Create sample admin user
  const adminExists = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  })

  if (!adminExists) {
    await prisma.adminUser.create({
      data: {
        name: 'Administrator',
        username: 'admin',
        passwordHash: await hashPassword('admin12345'),
      },
    })
    console.log('✅ Admin user created')
  }

  // Create sample payment settings
  const paymentExists = await prisma.paymentSetting.findFirst()
  if (!paymentExists) {
    await prisma.paymentSetting.create({
      data: {
        bankName: 'MB Bank',
        accountNumber: '1234567890',
        accountName: 'TA KHOAN SO',
        note: 'Vui lòng ghi nội dung chuyển khoản theo mã đơn hàng',
        active: true,
      },
    })
    console.log('✅ Payment settings created')
  }

  console.log('🎉 Seed completed!')
}
