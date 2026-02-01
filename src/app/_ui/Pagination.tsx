import Link from 'next/link'

export default function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
}: {
  basePath: string
  searchParams: Record<string, string | string[] | undefined>
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const toParams = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()

    for (const [k, v] of Object.entries(searchParams)) {
      if (v == null) continue
      if (Array.isArray(v)) {
        if (v[0] != null) params.set(k, v[0])
      } else {
        params.set(k, v)
      }
    }

    for (const [k, v] of Object.entries(overrides)) {
      if (!v) params.delete(k)
      else params.set(k, v)
    }

    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <Link
        href={toParams({ page: page > 1 ? String(page - 1) : undefined })}
        aria-disabled={page <= 1}
        className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 ${page <= 1 ? 'pointer-events-none bg-slate-50 text-slate-400' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
      >
        Trước
      </Link>

      {start > 1 ? (
        <>
          <Link href={toParams({ page: '1' })} className="rounded-md bg-white px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 hover:bg-slate-50">
            1
          </Link>
          <span className="px-1 text-sm text-slate-500">…</span>
        </>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={toParams({ page: String(p) })}
          className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 ${p === page ? 'bg-blue-700 text-white ring-blue-700' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
        >
          {p}
        </Link>
      ))}

      {end < totalPages ? (
        <>
          <span className="px-1 text-sm text-slate-500">…</span>
          <Link
            href={toParams({ page: String(totalPages) })}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 hover:bg-slate-50"
          >
            {totalPages}
          </Link>
        </>
      ) : null}

      <Link
        href={toParams({ page: page < totalPages ? String(page + 1) : undefined })}
        aria-disabled={page >= totalPages}
        className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 ring-slate-200 ${page >= totalPages ? 'pointer-events-none bg-slate-50 text-slate-400' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
      >
        Sau
      </Link>
    </div>
  )
}
