import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatVnd } from '@/lib/shop'
import { ArrowLeft, ShoppingCart, Zap, Shield, Clock, CheckCircle } from 'lucide-react'
import AddToCartButton from './ui'
import SiteHeader from '@/app/_ui/SiteHeader'
import ProductCard from '@/app/_ui/ProductCard'
import ProductImageGallery from '@/app/_ui/ProductImageGallery'
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
    return { title: 'Không tìm thấy sản phẩm' }
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
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })
  if (!p || !p.active) notFound()

  const related = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: p.categoryId,
      NOT: { id: p.id },
    },
    orderBy: [{ soldQty: 'desc' }, { createdAt: 'desc' }],
    take: 4,
  })

  const inStock = p.stockQty > 0
  const discount = p.listPriceVnd > p.salePriceVnd
    ? Math.round((1 - p.salePriceVnd / p.listPriceVnd) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-950">
      <TrackProductView
        product={{
          id: p.id,
          slug: p.slug,
          name: p.name,
          salePriceVnd: p.salePriceVnd,
          listPriceVnd: p.listPriceVnd,
          imageUrl: p.imageUrl,
        }}
      />
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div>
            <ProductImageGallery
              mainImage={p.imageUrl}
              images={p.images}
              productName={p.name}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {p.category && (
              <Link
                href={`/category/${p.category.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-violet-300"
                style={{ background: 'rgba(139, 92, 246, 0.1)' }}
              >
                {p.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{p.name}</h1>

            {/* Short Desc */}
            {p.shortDesc && (
              <p className="text-lg text-slate-400">{p.shortDesc}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-white">
                {formatVnd(p.salePriceVnd)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-slate-500 line-through">
                    {formatVnd(p.listPriceVnd)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                  >
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Info Grid */}
            <div
              className="grid grid-cols-2 gap-4 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(139, 92, 246, 0.1)' }}
                >
                  <CheckCircle className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tình trạng</p>
                  <p className={inStock ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                    {inStock ? 'Còn hàng' : 'Hết hàng'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(6, 182, 212, 0.1)' }}
                >
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Thở hạn</p>
                  <p className="text-white font-medium">{p.duration || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(236, 72, 153, 0.1)' }}
                >
                  <Shield className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bảo hành</p>
                  <p className="text-white font-medium">{p.warranty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                >
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Đã bán</p>
                  <p className="text-white font-medium">{p.soldQty}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {inStock ? (
                <>
                  <AddToCartButton
                    product={{
                      id: p.id,
                      slug: p.slug,
                      name: p.name,
                      salePriceVnd: p.salePriceVnd,
                      imageUrl: p.imageUrl ?? undefined,
                    }}
                  />
                  <Link
                    href={`/checkout?product=${p.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
                    }}
                  >
                    <Zap className="w-5 h-5" />
                    Mua ngay
                  </Link>
                </>
              ) : (
                <button
                  disabled
                  className="w-full px-6 py-4 rounded-xl font-semibold text-slate-500 bg-slate-800 cursor-not-allowed"
                >
                  Hết hàng
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                Bảo hành 100%
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />
                Giao tự động
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-400" />
                Hỗ trợ 24/7
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {p.description && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Mô tả sản phẩm</h2>
            <div
              className="p-6 rounded-2xl prose prose-invert max-w-none"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <pre className="whitespace-pre-wrap font-sans text-slate-300">
                {p.description}
              </pre>
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((product) => (
                <ProductCard
                  key={product.id}
                  p={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    duration: product.duration,
                    listPriceVnd: product.listPriceVnd,
                    salePriceVnd: product.salePriceVnd,
                    soldQty: product.soldQty,
                    imageUrl: product.imageUrl ?? null,
                    stockQty: product.stockQty,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
