import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { cache, cacheKeys } from '@/lib/cache'
import ProductCard from './_ui/ProductCard'
import SiteHeader from './_ui/SiteHeader'
import ModernHero from './_ui/ModernHero'
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react'

async function getHomepageData() {
  const cached = await cache.get(cacheKeys.homepage())
  if (cached) return cached

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 8,
  })

  const featured = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  const bestSellers = await prisma.product.findMany({
    where: { active: true, soldQty: { gt: 0 } },
    orderBy: { soldQty: 'desc' },
    take: 4,
  })

  const data = { categories, featured, bestSellers }
  await cache.set(cacheKeys.homepage(), data, 300)
  return data
}

export default async function Home() {
  const { categories, featured, bestSellers } = await getHomepageData()

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteHeader />
      
      {/* Hero Section */}
      <ModernHero />

      {/* Categories Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Danh mục phổ biến</h2>
            <p className="text-slate-400">Chọn dịch vụ bạn cần</p>
          </div>
          <Link 
            href="/search" 
            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${[
                    'rgba(139, 92, 246, 0.2)',
                    'rgba(6, 182, 212, 0.2)',
                    'rgba(236, 72, 153, 0.2)',
                    'rgba(245, 158, 11, 0.2)',
                  ][i % 4]} 0%, transparent 70%)`,
                }}
              />
              <h3 className="relative text-lg font-semibold text-white mb-1">{cat.name}</h3>
              <p className="relative text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                Xem sản phẩm
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Bán chạy nhất</h2>
              <p className="text-slate-400">Được mua nhiều nhất tuần này</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard
                key={p.id}
                p={{
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  duration: p.duration,
                  listPriceVnd: p.listPriceVnd,
                  salePriceVnd: p.salePriceVnd,
                  soldQty: p.soldQty,
                  imageUrl: p.imageUrl ?? null,
                  stockQty: p.stockQty,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Sparkles className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Sản phẩm mới</h2>
            <p className="text-slate-400">Cập nhật liên tục mỗi ngày</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              p={{
                id: p.id,
                slug: p.slug,
                name: p.name,
                duration: p.duration,
                listPriceVnd: p.listPriceVnd,
                salePriceVnd: p.salePriceVnd,
                soldQty: p.soldQty,
                imageUrl: p.imageUrl ?? null,
                stockQty: p.stockQty,
              }}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Giao hàng tự động',
              desc: 'Nhận tài khoản ngay sau khi thanh toán, không cần chờ đợi',
              icon: '⚡',
            },
            {
              title: 'Bảo hành 100%',
              desc: 'Hoàn tiền hoặc đổi mới nếu có bất kỳ vấn đề gì',
              icon: '🛡️',
            },
            {
              title: 'Hỗ trợ 24/7',
              desc: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc',
              icon: '💬',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div 
          className="max-w-4xl mx-auto p-12 rounded-3xl text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Hàng nghìn khách hàng đã tin dùng. Tham gia ngay hôm nay!
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-slate-950 bg-white hover:bg-slate-200 transition-colors"
          >
            Bắt đầu mua sắm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500">
            © 2025 taikhoanso.com. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/contact" className="text-slate-500 hover:text-white transition-colors">
              Liên hệ
            </Link>
            <Link href="/about" className="text-slate-500 hover:text-white transition-colors">
              Giới thiệu
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
