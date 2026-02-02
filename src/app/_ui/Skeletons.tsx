export function ProductCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10"
        >
          {/* Image skeleton */}
          <div className="relative aspect-[4/3] w-full animate-pulse bg-slate-200 dark:bg-slate-800">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 skeleton-shimmer" />
          </div>

          {/* Content skeleton */}
          <div className="p-3">
            {/* Title */}
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            {/* Duration */}
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            {/* Price section */}
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="h-5 w-24 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      <ProductCardSkeleton count={count} />
    </div>
  )
}

export function FlashSaleSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-slate-300 via-slate-300 to-slate-300 p-4 shadow-lg dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-6 w-32 animate-pulse rounded bg-white/30" />
        <div className="h-6 w-24 animate-pulse rounded bg-white/30" />
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
            <div className="aspect-square animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-1.5 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      )}
      <ProductGridSkeleton count={8} />
    </div>
  )
}
