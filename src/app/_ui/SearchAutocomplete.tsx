'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatVnd } from '@/lib/shop'

interface Suggestion {
  id: string
  slug: string
  name: string
  salePriceVnd: number
  listPriceVnd: number
  imageUrl: string | null
  soldQty: number
}

export default function SearchAutocomplete({
  initialQuery = '',
}: {
  initialQuery?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
    } catch {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query)
      } else {
        setSuggestions([])
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query, fetchSuggestions])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > -1 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        router.push(`/product/${suggestions[highlightedIndex].slug}`)
        setIsOpen(false)
        setQuery('')
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setIsOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (slug: string) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/product/${slug}`)
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div 
          className="flex w-full overflow-hidden rounded-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="flex items-center pl-4 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            name="q"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              setHighlightedIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent px-3 py-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            placeholder="Tìm kiếm sản phẩm..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-bold text-white transition-all hover:from-violet-700 hover:to-fuchsia-700"
          >
            Tìm
          </button>
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {isOpen && query.length >= 2 && (
        <div 
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[420px] overflow-auto">
              {suggestions.map((s, index) => {
                const discount =
                  s.listPriceVnd > 0
                    ? Math.max(0, Math.round((1 - s.salePriceVnd / s.listPriceVnd) * 100))
                    : 0
                const isHighlighted = index === highlightedIndex

                return (
                  <button
                    key={s.id}
                    onClick={() => handleSuggestionClick(s.slug)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full items-center gap-4 p-4 text-left transition-all duration-200 ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageUrl || `https://picsum.photos/seed/${s.slug}/100/100`}
                        alt={s.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-800">
                        {s.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
                          {formatVnd(s.salePriceVnd)}
                        </span>
                        {discount > 0 && (
                          <span className="rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Đã bán {s.soldQty.toLocaleString()}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="h-5 w-5 shrink-0 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              })}

              {/* View all results */}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 border-t border-slate-100 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50 p-4 text-sm font-bold text-violet-600 transition-all hover:from-violet-100 hover:to-fuchsia-100"
              >
                Xem tất cả kết quả cho &quot;{query}&quot;
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mb-2 flex justify-center">
                <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-slate-500">
                Không tìm thấy sản phẩm nào
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Thử tìm kiếm với từ khóa khác
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
