import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from './_ui/ProductCard'
import SiteHeader from './_ui/SiteHeader'
import FlashSale from './_ui/FlashSale'

export default async function Home() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || process.env.SHOP_NAME || 'Divine Style Shop'

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  const featured = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })

  const sections = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
      },
    },
  })

  // Flash sale products: products with discount >= 20%
  const flashProducts = await prisma.product.findMany({
    where: {
      active: true,
      stockQty: { gt: 0 },
      listPriceVnd: { gt: 0 },
    },
    orderBy: [{ soldQty: 'desc' }, { createdAt: 'desc' }],
    take: 20,
  })

  // Filter products with actual discount >= 20%
  const discountedFlashProducts = flashProducts.filter(
    (p) => p.listPriceVnd > 0 && (1 - p.salePriceVnd / p.listPriceVnd) >= 0.2
  ).slice(0, 8)

  // Flash sale ends at midnight
  const flashSaleEnd = new Date()
  flashSaleEnd.setHours(23, 59, 59, 999)

  return (
    <div id="top" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />

      {/* Category chips - Modern floating pills */}
      <div 
        className="sticky top-[72px] z-40 border-b border-white/20 backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1 text-sm scrollbar-hide">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="group relative rounded-full px-4 py-2 font-medium text-slate-600 transition-all duration-300 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(217, 70, 239, 0.05))',
                }}
              >
                <span className="relative z-10">{c.name}</span>
                <div className="absolute inset-0 -z-0 rounded-full bg-gradient-to-r from-violet-500/0 via-fuchsia-500/0 to-cyan-500/0 opacity-0 transition-all duration-300 group-hover:from-violet-500/10 group-hover:via-fuchsia-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <main className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[260px_1fr] md:p-6">
        {/* Sidebar - Glassmorphism */}
        <aside className="hidden md:block">
          <div 
            className="sticky top-[140px] overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-4">
              <div className="relative z-10 text-sm font-bold text-white">Danh mục</div>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />
            </div>
            <div className="p-3">
              {categories.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Chưa có danh mục. Vào Admin → Danh mục để tạo.</div>
              ) : (
                <div className="grid gap-1">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600 dark:text-slate-200 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                    >
                      <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="-ml-5 transition-all group-hover:ml-0">{c.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="grid gap-6">
          {/* Hero Banner - Animated gradient */}
          <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* Main banner */}
            <div 
              className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 25%, #0891b2 50%, #7c3aed 75%, #c026d3 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradient-shift 12s ease infinite',
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.35)',
              }}
            >
              {/* Animated background blobs */}
              <div 
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                  animation: 'float 8s ease-in-out infinite',
                }}
              />
              <div 
                className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  animation: 'float 10s ease-in-out infinite reverse',
                }}
              />
              <div 
                className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full opacity-20"
                style={{
                  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)',
                  animation: 'float 6s ease-in-out infinite 1s',
                }}
              />
              
              {/* Grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Đang hoạt động
                </div>
                
                <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Tài khoản số{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                    Premium
                  </span>
                </h1>
                
                <p className="mt-3 max-w-lg text-base font-medium text-white/90">
                  Giá tốt nhất • Dùng ngay • Bảo hành đầy đủ
                </p>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20">
                    <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Netflix
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20">
                    <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Spotify
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20">
                    <svg className="h-4 w-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    ChatGPT
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/20">
                    <svg className="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Canva
                  </span>
                </div>
                
                {/* Promo badges */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    Giảm đến 70%
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Giao tự động
                  </span>
                </div>
              </div>
            </div>

            {/* Side cards */}
            <div className="grid gap-4">
              <div 
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Hỗ trợ 24/7
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                    Xác nhận thanh toán & giao hàng nhanh chóng
                  </p>
                </div>
              </div>
              
              <div 
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                }}
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-500/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Ưu đãi đặc biệt
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                    Giảm giá theo combo / mua nhiều giảm thêm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sale */}
          {discountedFlashProducts.length > 0 && (
            <FlashSale
              products={discountedFlashProducts.map((p) => ({
                id: p.id,
                slug: p.slug,
                name: p.name,
                duration: p.duration,
                listPriceVnd: p.listPriceVnd,
                salePriceVnd: p.salePriceVnd,
                soldQty: p.soldQty,
                imageUrl: p.imageUrl ?? null,
                stockQty: p.stockQty,
              }))}
              endDate={flashSaleEnd}
            />
          )}

          {/* Featured Products */}
          <div 
            className="overflow-hidden rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Sản phẩm nổi bật</h2>
                  <p className="text-xs text-slate-500">Top sản phẩm được yêu thích</p>
                </div>
              </div>
              <Link 
                href="/search" 
                className="group flex items-center gap-1 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 transition-all hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
              >
                Xem tất cả
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sections by category */}
          {sections.map((c) => (
            <div 
              key={c.id} 
              id={`cat-${c.slug}`} 
              className="overflow-hidden rounded-3xl"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/category/${c.slug}`} 
                    className="text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    Xem tất cả
                  </Link>
                  <a 
                    href="#top" 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-violet-100 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="p-5">
                {c.products.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Chưa có sản phẩm trong danh mục này.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {c.products.map((p) => (
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
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Footer - Modern */}
      <footer className="mt-12 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-xl font-black text-transparent">
              {shopName}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Shop tài khoản số hàng đầu • Thanh toán chuyển khoản • Xác nhận thủ công • Bảo hành đầy đủ
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-violet-100 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-violet-100 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Hướng dẫn</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/huong-dan" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Cách mua hàng</Link>
              <Link href="/huong-dan" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Cách thanh toán</Link>
              <Link href="/huong-dan" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Nhận hàng</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Chính sách</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <a href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Bảo hành</a>
              <a href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Đổi trả</a>
              <a href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">Bảo mật</a>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Liên hệ</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Zalo/Hotline: (sắp có)
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Telegram: (sắp có)
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200/60 dark:border-slate-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} {shopName}. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Made with</span>
              <svg className="h-4 w-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
