import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/app/_ui/ProductCard'
import FilterSidebar from './FilterSidebar'
import Pagination from '@/app/_ui/Pagination'
import SiteHeader from '@/app/_ui/SiteHeader'
import { generateMetadata as genMeta } from '@/lib/metadata'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  
  return genMeta({
    title: q ? `Kết quả tìm kiếm: ${q}` : 'Tìm kiếm sản phẩm',
    description: q 
      ? `Tìm kiếm "${q}" - Khám phá hàng trăm tài khoản premium giá tốt tại taikhoanso.com.`
      : 'Tìm kiếm Netflix, Spotify, ChatGPT, Canva và hơn 100+ dịch vụ premium. Giá tốt nhất, giao hàng tự động.',
    path: '/search',
  })
}

function toInt(v: string | undefined, fallback: number) {
  const n = Number(v)
  if (!Number.isFinite(n)) return fallback
  return Math.max(1, Math.floor(n))
}

function toPriceInt(v: string | undefined) {
  if (!v) return undefined
  const n = Number(v)
  if (!Number.isFinite(n)) return undefined
  return Math.max(0, Math.floor(n))
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const q = typeof sp.q === 'string' ? sp.q : ''
  const sort = typeof sp.sort === 'string' ? sp.sort : 'new'
  const cat = typeof sp.cat === 'string' ? sp.cat : ''
  const page = toInt(typeof sp.page === 'string' ? sp.page : undefined, 1)
  const min = toPriceInt(typeof sp.min === 'string' ? sp.min : undefined)
  const max = toPriceInt(typeof sp.max === 'string' ? sp.max : undefined)

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { slug: true, name: true },
  })

  const where = {
    active: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { shortDesc: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(cat
      ? {
          category: {
            slug: cat,
          },
        }
      : {}),
    ...(min != null || max != null
      ? {
          salePriceVnd: {
            ...(min != null ? { gte: min } : {}),
            ...(max != null ? { lte: max } : {}),
          },
        }
      : {}),
  }

  const orderBy =
    sort === 'price_asc'
      ? [{ salePriceVnd: 'asc' as const }, { createdAt: 'desc' as const }]
      : sort === 'price_desc'
        ? [{ salePriceVnd: 'desc' as const }, { createdAt: 'desc' as const }]
        : sort === 'sold_desc'
          ? [{ soldQty: 'desc' as const }, { createdAt: 'desc' as const }]
          : [{ createdAt: 'desc' as const }]

  const take = 12
  const skip = (page - 1) * take

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / take))

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <SiteHeader initialQuery={q} />

      <main className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[280px_1fr]">
        {/* Filter Sidebar */}
        <FilterSidebar categories={categories} totalProducts={total} />

        {/* Main Content */}
        <div>
          {/* Header with Sort */}
          <div 
            className="mb-4 rounded-2xl p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-extrabold text-slate-900">
                  {q ? `Kết quả: "${q}"` : 'Tất cả sản phẩm'}
                </h1>
                <div className="mt-1 text-sm text-slate-500">
                  {total} sản phẩm
                  {cat && (
                    <span> • Danh mục: <span className="font-medium text-violet-600">{categories.find(c => c.slug === cat)?.name || cat}</span></span>
                  )}
                </div>
              </div>
              
              {/* Sort Dropdown - integrated in FilterSidebar for mobile, shown here for desktop */}
              <div className="hidden lg:block">
                {/* Sort is in FilterSidebar */}
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-sm text-slate-500 dark:text-slate-400">Không có sản phẩm phù hợp.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
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
          )}
          
          {/* Pagination */}
          <div className="mt-6">
            <Pagination basePath="/search" searchParams={sp} page={page} totalPages={totalPages} />
          </div>
        </div>
      </main>
    </div>
  )
}
