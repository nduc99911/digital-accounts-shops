'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react'

interface Category {
  slug: string
  name: string
}

interface FilterSidebarProps {
  categories: Category[]
  totalProducts: number
}

const sortOptions = [
  { value: 'new', label: 'Mới nhất', icon: Clock },
  { value: 'sold_desc', label: 'Bán chạy', icon: TrendingUp },
  { value: 'price_asc', label: 'Giá tăng dần', icon: ArrowUp },
  { value: 'price_desc', label: 'Giá giảm dần', icon: ArrowDown },
]

const priceRanges = [
  { min: 0, max: 50000, label: 'Dưới 50K' },
  { min: 50000, max: 100000, label: '50K - 100K' },
  { min: 100000, max: 200000, label: '100K - 200K' },
  { min: 200000, max: 500000, label: '200K - 500K' },
  { min: 500000, max: null, label: 'Trên 500K' },
]

export default function FilterSidebar({ categories, totalProducts }: FilterSidebarProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  
  const currentSort = searchParams.get('sort') || 'new'
  const currentCat = searchParams.get('cat') || ''
  const currentMin = searchParams.get('min') || ''
  const currentMax = searchParams.get('max') || ''
  const currentQ = searchParams.get('q') || ''
  
  const currentSortOption = sortOptions.find(o => o.value === currentSort) || sortOptions[0]
  
  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })
    // Reset page when filter changes
    newParams.delete('page')
    return newParams.toString()
  }
  
  const handleSortChange = (sortValue: string) => {
    const query = createQueryString({ sort: sortValue })
    router.push(`${pathname}?${query}`)
    setIsSortOpen(false)
  }
  
  const handleCategoryChange = (catSlug: string | null) => {
    const query = createQueryString({ cat: catSlug })
    router.push(`${pathname}?${query}`)
  }
  
  const handlePriceChange = (min: string | null, max: string | null) => {
    const query = createQueryString({ min, max })
    router.push(`${pathname}?${query}`)
  }
  
  const clearFilters = () => {
    const params = new URLSearchParams()
    if (currentQ) params.set('q', currentQ)
    router.push(`${pathname}?${params.toString()}`)
    setIsMobileOpen(false)
  }
  
  const hasActiveFilters = currentCat || currentMin || currentMax

  return (
    <>
      {/* Mobile Filter Button & Sort */}
      <div className="flex items-center gap-2 lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Lọc
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 rounded-full bg-violet-500 text-xs flex items-center justify-center">
              {(currentCat ? 1 : 0) + (currentMin ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-xl text-white"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {currentSortOption.label}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
              <div
                className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl p-1 shadow-xl"
                style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {sortOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = currentSort === option.value
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        isActive ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div
          className="rounded-2xl p-5 sticky top-24"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Sort */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-3">Sắp xếp</h3>
            <div className="space-y-1">
              {sortOptions.map((option) => {
                const Icon = option.icon
                const isActive = currentSort === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-3">Danh mục</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !currentCat ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    currentCat === cat.slug ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-3">Khoảng giá</h3>
            <div className="space-y-1">
              {priceRanges.map((range) => {
                const isActive = currentMin === String(range.min) && (range.max ? currentMax === String(range.max) : !currentMax)
                return (
                  <button
                    key={range.label}
                    onClick={() => handlePriceChange(String(range.min), range.max ? String(range.max) : null)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {range.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-rose-400 hover:text-rose-300 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div
            className="fixed left-0 top-0 z-50 h-full w-80 p-5 overflow-y-auto"
            style={{ background: 'rgba(15, 23, 42, 0.98)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Bộ lọc</h3>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-3">Danh mục</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      currentCat === cat.slug ? 'bg-violet-500/20 text-violet-400' : 'text-slate-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-3">Khoảng giá</h3>
              <div className="space-y-1">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceChange(String(range.min), range.max ? String(range.max) : null)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      currentMin === String(range.min) && (range.max ? currentMax === String(range.max) : !currentMax)
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
            >
              Áp dụng ({totalProducts})
            </button>
          </div>
        </>
      )}
    </>
  )
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Lọc
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs text-white">
              {(currentCat ? 1 : 0) + (currentMin ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">{currentSortOption.label}</span>
          <span className="sm:hidden">Sắp xếp</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isSortOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsSortOpen(false)}
            />
            <div 
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl p-1 shadow-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
              }}
            >
              {sortOptions.map((option) => {
                const Icon = option.icon
                const isActive = currentSort === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      isActive 
                        ? 'bg-violet-100 text-violet-700' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                    {isActive && (
                      <span className="ml-auto text-violet-500">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div 
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-violet-600" />
              <span className="font-bold text-slate-800">Bộ lọc</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="mb-4 text-sm text-slate-500">
            {totalProducts} sản phẩm
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-slate-700">Danh mục</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                  !currentCat 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Tất cả</span>
                {!currentCat && <span className="text-violet-500">✓</span>}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    currentCat === cat.slug 
                      ? 'bg-violet-100 text-violet-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  {currentCat === cat.slug && <span className="text-violet-500">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-slate-700">Khoảng giá</h3>
            <div className="space-y-1">
              <button
                onClick={() => handlePriceChange(null, null)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                  !currentMin && !currentMax 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Tất cả giá</span>
                {!currentMin && !currentMax && <span className="text-violet-500">✓</span>}
              </button>
              {priceRanges.map((range) => {
                const isActive = currentMin === String(range.min) && 
                  (range.max ? currentMax === String(range.max) : !currentMax)
                return (
                  <button
                    key={range.label}
                    onClick={() => handlePriceChange(String(range.min), range.max ? String(range.max) : null)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      isActive 
                        ? 'bg-violet-100 text-violet-700' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{range.label}</span>
                    {isActive && <span className="text-violet-500">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="border-t border-slate-200 pt-4">
              <h3 className="mb-2 text-sm font-bold text-slate-700">Đang lọc</h3>
              <div className="flex flex-wrap gap-2">
                {currentCat && (
                  <span 
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                  >
                    {categories.find(c => c.slug === currentCat)?.name || currentCat}
                    <button 
                      onClick={() => handleCategoryChange(null)}
                      className="ml-1 hover:text-violet-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentMin && (
                  <span 
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                  >
                    {priceRanges.find(r => String(r.min) === currentMin)?.label || `${currentMin}-${currentMax || 'max'}`}
                    <button 
                      onClick={() => handlePriceChange(null, null)}
                      className="ml-1 hover:text-violet-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div 
            className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto p-5"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Same content as desktop but with close button */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-violet-600" />
                <span className="font-bold text-slate-800">Bộ lọc</span>
              </div>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-slate-700">Danh mục</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                    !currentCat ? 'bg-violet-100 text-violet-700' : 'text-slate-600'
                  }`}
                >
                  <span>Tất cả</span>
                  {!currentCat && <span>✓</span>}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      currentCat === cat.slug ? 'bg-violet-100 text-violet-700' : 'text-slate-600'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {currentCat === cat.slug && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-slate-700">Khoảng giá</h3>
              <div className="space-y-1">
                {priceRanges.map((range) => {
                  const isActive = currentMin === String(range.min) && 
                    (range.max ? currentMax === String(range.max) : !currentMax)
                  return (
                    <button
                      key={range.label}
                      onClick={() => handlePriceChange(String(range.min), range.max ? String(range.max) : null)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                        isActive ? 'bg-violet-100 text-violet-700' : 'text-slate-600'
                      }`}
                    >
                      <span>{range.label}</span>
                      {isActive && <span>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full rounded-xl py-3 font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
              }}
            >
              Áp dụng ({totalProducts} sản phẩm)
            </button>
          </div>
        </>
      )}
    </>
  )
}
