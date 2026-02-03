import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatVnd } from '@/lib/shop'
import AddToCartButton from './ui'
import BuyNowButton from './BuyNowButton'
import SiteHeader from '@/app/_ui/SiteHeader'
import ProductCard from '@/app/_ui/ProductCard'
import RecentlyViewed from '@/app/_ui/RecentlyViewed'
import ProductReviews from '@/app/_ui/ProductReviews'
import TrackProductView from './TrackProductView'
import { generateProductMetadata } from '@/lib/metadata'
import { getCurrentCustomer } from '@/lib/customerAuth'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      shortDesc: true,
      description: true,
      imageUrl: true,
      salePriceVnd: true,
    },
  })

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm',
    }
  }

  return generateProductMetadata({
    name: product.name,
    description: product.shortDesc || product.description || product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    price: product.salePriceVnd,
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug }, include: { category: true } })
  if (!p || !p.active) notFound()
  
  const user = await getCurrentCustomer()
  const isLoggedIn = !!user

  const related = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: p.categoryId,
      NOT: { id: p.id },
    },
    orderBy: [{ soldQty: 'desc' }, { createdAt: 'desc' }],
    take: 8,
  })

  const inStock = p.stockQty > 0

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <TrackProductView product={{
        id: p.id,
        slug: p.slug,
        name: p.name,
        salePriceVnd: p.salePriceVnd,
        listPriceVnd: p.listPriceVnd,
        imageUrl: p.imageUrl,
      }} />
      <SiteHeader />

      <main className="mx-auto max-w-6xl p-4">
        {/* Breadcrumb */}
        <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          {p.category ? (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${p.category.slug}`} className="hover:underline">{p.category.name}</Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-100">{p.name}</span>
        </div>

        {/* Top section: image + buy box */}
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="aspect-[16/10] w-full bg-slate-100 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl || 'https://picsum.photos/seed/' + p.slug + '/1200/800'}
                alt={p.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{p.name}</h1>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{p.shortDesc || ''}</div>

            <div className="mt-4">
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{formatVnd(p.salePriceVnd)}</div>
              <div className="mt-1 flex items-center gap-3">
                <div className="text-sm text-slate-500 line-through dark:text-slate-400">{formatVnd(p.listPriceVnd)}</div>
                {p.listPriceVnd > p.salePriceVnd ? (
                  <div className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
                    -{Math.round((1 - p.salePriceVnd / p.listPriceVnd) * 100)}%
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tình trạng</span>
                <span className={inStock ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'font-semibold text-rose-700 dark:text-rose-400'}>
                  {inStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Thời hạn</span>
                <span className="font-medium">{p.duration || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Bảo hành</span>
                <span className="font-medium">{p.warranty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tồn kho / Đã bán</span>
                <span className="font-medium">{p.stockQty} / {p.soldQty}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {inStock ? (
                <BuyNowButton productId={p.id} name={p.name} priceVnd={p.salePriceVnd} />
              ) : (
                <button disabled className="w-full rounded-md bg-slate-300 px-4 py-3 text-sm font-semibold text-white dark:bg-slate-800">
                  Hết hàng
                </button>
              )}
              <div className="w-full">
                <AddToCartButton productId={p.id} name={p.name} priceVnd={p.salePriceVnd} />
              </div>
            </div>

            <div className="mt-4 grid gap-2 rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-900">
              <div className="font-semibold text-slate-900 dark:text-slate-100">Thông tin nhanh</div>
              <div className="text-slate-600 dark:text-slate-300">• Giao tự động sau khi thanh toán thành công</div>
              <div className="text-slate-600 dark:text-slate-300">• Hỗ trợ 1-1 nếu gặp lỗi đăng nhập</div>
              <div className="text-slate-600 dark:text-slate-300">• Có thể đổi key khác nếu key lỗi (tuỳ gói)</div>
            </div>
          </div>
        </div>

        {/* Description sections */}
        <div className="mt-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Thông tin sản phẩm</h2>
          {p.description ? (
            <div className="prose prose-slate mt-4 max-w-none whitespace-pre-wrap dark:prose-invert">{p.description}</div>
          ) : (
            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">(Chưa có mô tả chi tiết)</div>
          )}
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={p.id} isLoggedIn={isLoggedIn} />
          )}
        </div>

        {/* Related */}
        {related.length > 0 ? (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Sản phẩm liên quan</h3>
              {p.category ? (
                <Link className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300" href={`/category/${p.category.slug}`}>
                  Xem thêm
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {related.map((rp) => (
                <ProductCard
                  key={rp.id}
                  p={{
                    id: rp.id,
                    slug: rp.slug,
                    name: rp.name,
                    duration: rp.duration,
                    listPriceVnd: rp.listPriceVnd,
                    salePriceVnd: rp.salePriceVnd,
                    soldQty: rp.soldQty,
                    imageUrl: rp.imageUrl ?? null,
                    stockQty: rp.stockQty,
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Recently Viewed */}
        <RecentlyViewed excludeId={p.id} />
      </main>
    </div>
  )
}
