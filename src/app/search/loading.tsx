import { ProductGridSkeleton } from '@/app/_ui/Skeletons'
import SiteHeader from '@/app/_ui/SiteHeader'

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <SiteHeader />

      <main className="mx-auto grid max-w-6xl gap-4 p-4">
        {/* Header skeleton */}
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Toolbar skeleton */}
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
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
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <ProductGridSkeleton count={12} />
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </main>
    </div>
  )
}
