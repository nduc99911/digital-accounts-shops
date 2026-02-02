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

  // Flash sale products: significant discounts, sorted by discount %
  const flashProducts = await prisma.product.findMany({
    where: {
      active: true,
      stockQty: { gt: 0 },
      listPriceVnd: { gt: 0 },
      salePriceVnd: { lt: prisma.$queryRaw`"listPriceVnd" * 0.8` },
    },
    orderBy: [{ soldQty: 'desc' }, { createdAt: 'desc' }],
    take: 8,
  })

  // Filter products with actual discount >= 20%
  const discountedFlashProducts = flashProducts.filter(
    (p) => p.listPriceVnd > 0 && (1 - p.salePriceVnd / p.listPriceVnd) >= 0.2
  )

  // Flash sale ends at midnight
  const flashSaleEnd = new Date()
  flashSaleEnd.setHours(23, 59, 59, 999)

  return (
    <div id="top" className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <SiteHeader />

      {/* Category chips (mobile + desktop) */}
      <div className="border-b bg-white dark:border-white/10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1 text-sm">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-[72px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100">Danh mục</div>
            <div className="p-2">
              {categories.length === 0 ? (
                <div className="p-3 text-sm text-slate-500 dark:text-slate-400">Chưa có danh mục. Vào Admin → Danh mục để tạo.</div>
              ) : (
                <div className="grid">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="grid gap-4">
          {/* Banner */}
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <div className="text-2xl font-extrabold">Tài khoản số • Giá tốt • Dùng ngay</div>
              <div className="mt-2 text-sm text-white/90">
                Chuyển khoản nhanh • Admin xác nhận thủ công • Bảo hành tuỳ gói
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Netflix</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Spotify</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">ChatGPT</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Canva</span>
              </div>
              {/* Promo badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-amber-400/90 px-2 py-1 text-xs font-bold text-slate-900">🔥 Giảm đến 70%</span>
                <span className="rounded-md bg-emerald-400/90 px-2 py-1 text-xs font-bold text-slate-900">⚡ Giao tự động</span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hỗ trợ</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Xác nhận thanh toán & giao hàng nhanh</div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">(sẽ thêm Zalo/Hotline trong Settings)</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ưu đãi</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Giảm giá theo combo / mua nhiều</div>
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

          {/* Featured */}
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Sản phẩm nổi bật</h2>
              <Link href="/search" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
                Xem tất cả
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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

          {/* Sections by category */}
          {sections.map((c) => (
            <div key={c.id} id={`cat-${c.slug}`} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <Link href={`/category/${c.slug}`} className="text-blue-700 hover:underline dark:text-blue-300">
                    Xem tất cả
                  </Link>
                  <a href="#top" className="text-blue-700 hover:underline dark:text-blue-300">
                    Lên đầu
                  </a>
                </div>
              </div>
              {c.products.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">Chưa có sản phẩm trong danh mục này.</div>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
          ))}
        </section>
      </main>

      <footer className="mt-10 border-t bg-white dark:border-white/10 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-4">
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{shopName}</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">Shop tài khoản số • Thanh toán chuyển khoản • Xác nhận thủ công</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hướng dẫn</div>
            <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-400">
              <div>• Cách mua hàng</div>
              <div>• Cách thanh toán</div>
              <div>• Nhận hàng</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Chính sách</div>
            <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-400">
              <div>• Bảo hành</div>
              <div>• Đổi trả</div>
              <div>• Bảo mật</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Liên hệ</div>
            <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-400">
              <div>• Zalo/Hotline: (sắp có)</div>
              <div>• Telegram: (sắp có)</div>
            </div>
          </div>
        </div>
        <div className="border-t dark:border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} {shopName}</div>
        </div>
      </footer>
    </div>
  )
}
