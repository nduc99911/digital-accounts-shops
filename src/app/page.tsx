import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from './_ui/ProductCard'
import { getCurrentCustomer } from '@/lib/customerAuth'

export default async function Home() {
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || process.env.SHOP_NAME || 'Divine Style Shop'

  const customer = await getCurrentCustomer()

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

  return (
    <div id="top" className="min-h-screen bg-slate-100">
      {/* Top header */}
      <header className="sticky top-0 z-50 bg-blue-700 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            {shopName}
          </Link>

          <div className="flex-1">
            <div className="flex overflow-hidden rounded-md bg-white">
              <input
                className="w-full px-3 py-2 text-sm text-slate-900 outline-none"
                placeholder="Tìm kiếm sản phẩm..."
              />
              <button className="bg-slate-900 px-4 text-sm font-semibold">Tìm</button>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <Link href="/cart" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
              Giỏ hàng
            </Link>

            {customer ? (
              <>
                <Link href="/account/orders" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
                  Đơn hàng
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">Đăng xuất</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
                Đăng nhập
              </Link>
            )}

            <Link href="/admin" className="rounded-md bg-white/15 px-3 py-2 font-semibold hover:bg-white/20">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Category chips (mobile + desktop) */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1 text-sm">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.slug}`}
                className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-[72px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
            <div className="bg-slate-50 px-4 py-3 text-sm font-semibold">Danh mục</div>
            <div className="p-2">
              {categories.length === 0 ? (
                <div className="p-3 text-sm text-slate-500">Chưa có danh mục. Vào Admin → Danh mục để tạo.</div>
              ) : (
                <div className="grid">
                  {categories.map((c) => (
                    <a
                      key={c.id}
                      href={`#cat-${c.slug}`}
                      className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {c.name}
                    </a>
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
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Hỗ trợ</div>
                <div className="mt-1 text-xs text-slate-600">Xác nhận thanh toán & giao hàng nhanh</div>
                <div className="mt-3 text-xs text-slate-500">(sẽ thêm Zalo/Hotline trong Settings)</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Ưu đãi</div>
                <div className="mt-1 text-xs text-slate-600">Giảm giá theo combo / mua nhiều</div>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">Sản phẩm nổi bật</h2>
              <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
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
            <div key={c.id} id={`cat-${c.slug}`} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold">{c.name}</h3>
                <a href="#top" className="text-sm font-semibold text-blue-700 hover:underline">
                  Lên đầu
                </a>
              </div>
              {c.products.length === 0 ? (
                <div className="text-sm text-slate-500">Chưa có sản phẩm trong danh mục này.</div>
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

      <footer className="mt-10 border-t bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-4">
          <div>
            <div className="font-bold">{shopName}</div>
            <div className="mt-2 text-sm text-slate-600">Shop tài khoản số • Thanh toán chuyển khoản • Xác nhận thủ công</div>
          </div>
          <div>
            <div className="text-sm font-semibold">Hướng dẫn</div>
            <div className="mt-2 grid gap-1 text-sm text-slate-600">
              <div>• Cách mua hàng</div>
              <div>• Cách thanh toán</div>
              <div>• Nhận hàng</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Chính sách</div>
            <div className="mt-2 grid gap-1 text-sm text-slate-600">
              <div>• Bảo hành</div>
              <div>• Đổi trả</div>
              <div>• Bảo mật</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold">Liên hệ</div>
            <div className="mt-2 grid gap-1 text-sm text-slate-600">
              <div>• Zalo/Hotline: (sắp có)</div>
              <div>• Telegram: (sắp có)</div>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">© {new Date().getFullYear()} {shopName}</div>
        </div>
      </footer>
    </div>
  )
}
