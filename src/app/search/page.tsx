import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/app/_ui/ProductCard'
import FilterSidebar from './FilterSidebar'
import Pagination from '@/app/_ui/Pagination'
import SiteHeader from '@/app/_ui/SiteHeader'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { Search } from 'lucide-react'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  
  return genMeta({
    title: q ? `Kết quả: ${q}` : 'Tìm kiếm',
    description: q 
      ? `Tìm kiếm "${q}" - taikhoanso.com`
      : 'Tìm kiếm Netflix, Spotify, ChatGPT, Canva...',
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
          ],
        }
      : {}),
    ...(cat ? { category: { slug: cat } } : {}),
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
      ? [{ salePriceVnd: 'asc' as const }]
      : sort === 'price_desc'
        ? [{ salePriceVnd: 'desc' as const }]
        : sort === 'sold_desc'
          ? [{ soldQty: 'desc' as const }]
          : [{ createdAt: 'desc' as const }]

  const take = 12
  const skip = (page - 1) * take

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, orderBy, take, skip }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / take))

  return (
    <div className="min-h-screen bg-slate-950">
      <SiteHeader initialQuery={q} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {q ? `Kết quả: "${q}"` : 'Tất cả sản phẩm'}
          </h1>
          <p className="text-slate-400">
            {total} sản phẩm{cat && ` • ${categories.find(c => c.slug === cat)?.name}`}
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar categories={categories} totalProducts={total} />

          {/* Main Content */}
          <div>
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <Search className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Không tìm thấy sản phẩm</h2>
                <p className="text-slate-400">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                
                <div className="mt-8">
                  <Pagination basePath="/search" searchParams={sp} page={page} totalPages={totalPages} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
