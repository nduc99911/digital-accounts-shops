import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/app/_ui/ProductCard'
import ProductSearchControls from '@/app/_ui/ProductSearchControls'
import Pagination from '@/app/_ui/Pagination'
import SiteHeader from '@/app/_ui/SiteHeader'

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

      <main className="mx-auto grid max-w-6xl gap-4 p-4">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Tìm kiếm sản phẩm</h1>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Nhập từ khoá, lọc theo danh mục, giá và sắp xếp.</div>
        </div>

        <div className="sticky top-[72px] z-40">
          <ProductSearchControls basePath="/search" showCategory categories={categories} />
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {total} sản phẩm
              {q ? (
                <span>
                  {' '}
                  • từ khoá: <span className="font-bold">{q}</span>
                </span>
              ) : null}
              {cat ? (
                <span>
                  {' '}
                  • danh mục: <span className="font-bold">{cat}</span>
                </span>
              ) : null}
            </div>
            <div className="flex gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
                >
                  {c.name}
                </Link>
              ))}
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
        </div>

        <Pagination basePath="/search" searchParams={sp} page={page} totalPages={totalPages} />
      </main>
    </div>
  )
}
