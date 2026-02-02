import Link from 'next/link'

interface PaginationProps {
  basePath: string
  /** Back-compat: older pages pass `searchParams` directly (Record<string, string|string[]|undefined>). */
  searchParams?: Record<string, string | string[] | undefined>
  /** Newer usage: pass a flat set of params (same shape). */
  params?: Record<string, string | string[] | undefined>
  page: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  onPageSizeChange?: (size: number) => void
}

export default function Pagination({
  basePath,
  searchParams,
  params,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageSizeChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const toParams = (overrides: Record<string, string | undefined>) => {
    const sp = new URLSearchParams()

    const source = params || searchParams || {}

    for (const [k, v] of Object.entries(source)) {
      if (v == null) continue
      if (Array.isArray(v)) {
        if (v[0] != null) sp.set(k, v[0])
      } else {
        sp.set(k, v)
      }
    }

    for (const [k, v] of Object.entries(overrides)) {
      if (!v) sp.delete(k)
      else sp.set(k, v)
    }

    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  const pages = [] as number[]
  for (let i = start; i <= end; i++) pages.push(i)

  const startItem = totalItems ? (page - 1) * (pageSize || 12) + 1 : null
  const endItem = totalItems ? Math.min(page * (pageSize || 12), totalItems) : null

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
      {/* Left: Results info */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {totalItems != null && (
          <span>
            Hiển thị <span className="font-medium text-slate-900 dark:text-slate-200">{startItem}-{endItem}</span> của <span className="font-medium text-slate-900 dark:text-slate-200">{totalItems}</span> sản phẩm
          </span>
        )}
      </div>

      {/* Center: Page numbers */}
      <div className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href={toParams({ page: page > 1 ? String(page - 1) : undefined })}
        aria-disabled={page <= 1}
        className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 transition ${
          page <= 1
            ? 'pointer-events-none bg-slate-50 text-slate-400 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-500 dark:ring-white/10'
            : 'bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800'
        }`}
      >
        Trước
      </Link>

      {start > 1 ? (
        <>
          <Link
            href={toParams({ page: '1' })}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800"
          >
            1
          </Link>
          <span className="px-1 text-sm text-slate-500">…</span>
        </>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={toParams({ page: String(p) })}
          className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 transition ${
            p === page
              ? 'bg-slate-900 text-white ring-slate-900 dark:bg-blue-600 dark:ring-blue-500/60'
              : 'bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800'
          }`}
        >
          {p}
        </Link>
      ))}

      {end < totalPages ? (
        <>
          <span className="px-1 text-sm text-slate-500">…</span>
          <Link
            href={toParams({ page: String(totalPages) })}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800"
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      <Link
        href={toParams({ page: page < totalPages ? String(page + 1) : undefined })}
        aria-disabled={page >= totalPages}
        className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 transition ${
          page >= totalPages
            ? 'pointer-events-none bg-slate-50 text-slate-400 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-500 dark:ring-white/10'
            : 'bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800'
        }`}
      >
        Sau
      </Link>
      </div>

      {/* Right: Page size selector */}
      {onPageSizeChange && pageSize && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Hiển thị:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md bg-white px-2 py-1.5 text-sm text-slate-900 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:focus:ring-blue-500"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
            <option value={96}>96</option>
          </select>
        </div>
      )}
    </div>
  )
}
