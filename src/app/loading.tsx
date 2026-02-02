import { SectionSkeleton, FlashSaleSkeleton } from '@/app/_ui/Skeletons'
import SiteHeader from '@/app/_ui/SiteHeader'

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <SiteHeader />

      {/* Category chips skeleton */}
      <div className="border-b bg-white dark:border-white/10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[240px_1fr]">
        {/* Sidebar skeleton */}
        <aside className="hidden md:block">
          <div className="sticky top-[72px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="h-10 animate-pulse bg-slate-200 dark:bg-slate-800" />
            <div className="p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="my-1 h-8 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
              ))}
            </div>
          </div>
        </aside>

        <section className="grid gap-4">
          {/* Banner skeleton */}
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="h-48 animate-pulse rounded-lg bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-800 dark:to-slate-700" />
            <div className="grid gap-3">
              <div className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Flash Sale skeleton */}
          <FlashSaleSkeleton />

          {/* Featured skeleton */}
          <SectionSkeleton />

          {/* Category sections skeleton */}
          <SectionSkeleton />
          <SectionSkeleton />
        </section>
      </main>
    </div>
  )
}
