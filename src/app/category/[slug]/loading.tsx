import { ProductGridSkeleton } from '@/app/_ui/Skeletons'
import SiteHeader from '@/app/_ui/SiteHeader'

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-4">
        {/* Header skeleton */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="h-7 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Toolbar skeleton */}
        <div className="grid gap-4">
          <div className="sticky top-[72px] z-40 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <div className="h-16 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
              <div className="h-16 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
              <div className="flex gap-2">
                <div className="h-10 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Results skeleton */}
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <ProductGridSkeleton count={24} />

            {/* Pagination skeleton */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
