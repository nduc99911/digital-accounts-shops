import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/app/_ui/ProductCard'
import Pagination from '@/app/_ui/Pagination'
import SiteHeader from '@/app/_ui/SiteHeader'

const PAGE_SIZE = 24

type SearchParams = {
  q?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sold_desc'
  page?: string
}

function toInt(s: string | undefined, fallback: number) {
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const sp = await searchParams

  const q = (sp.q || '').trim()
  const sort = (sp.sort || 'newest') as NonNullable<SearchParams['sort']>
  const page = toInt(sp.page, 1)

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const where = {
    active: true,
    category: { slug },
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { shortDesc: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const orderBy =
    sort === 'price_asc'
      ? { salePriceVnd: 'asc' as const }
      : sort === 'price_desc'
        ? { salePriceVnd: 'desc' as const }
        : sort === 'sold_desc'
          ? [{ soldQty: 'desc' as const }, { createdAt: 'desc' as const }]
          : { createdAt: 'desc' as const }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        name: true,
        duration: true,
        listPriceVnd: true,
        salePriceVnd: true,
        soldQty: true,
        imageUrl: true,
        stockQty: true,
      },
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <SiteHeader initialQuery={q} />

      <main className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{category.name}</h1>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{total} sản phẩm</div>
          </div>
          <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
            ← Trang chủ
          </Link>
        </div>

        <div className="grid gap-4">
          {/* Toolbar */}
          <div className="sticky top-[72px] z-40 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <form method="get" className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Từ khoá trong danh mục</div>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder={`Tìm trong ${category.name}…`}
                  className="mt-1 w-full rounded-md bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sắp xếp</div>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="mt-1 w-full rounded-md bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="sold_desc">Bán chạy</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 md:w-auto dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Lọc
                </button>
                <Link
                  href={`/category/${slug}`}
                  className="w-full rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 md:w-auto dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800"
                >
                  Xoá
                </Link>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div>Trang {Math.min(page, totalPages)} / {totalPages}</div>
              <div>
                <Link href="/search" className="font-semibold text-blue-700 hover:underline dark:text-blue-300">
                  Tìm kiếm nâng cao
                </Link>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
              <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Không có sản phẩm</div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Thử đổi từ khoá.</div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
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

              <div className="mt-6">
                <Pagination
                  basePath={`/category/${slug}`}
                  searchParams={{ q: q || undefined, sort: sort || undefined }}
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
