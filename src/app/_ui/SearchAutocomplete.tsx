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
    <div ref={containerRef} className="relative flex-1">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="flex w-full overflow-hidden rounded-md bg-white ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
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
            className="w-full px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Tìm kiếm sản phẩm…"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Tìm
          </button>
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[400px] overflow-auto">
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
                    className={`flex w-full items-center gap-3 p-3 text-left transition-colors ${
                      isHighlighted
                        ? 'bg-blue-50 dark:bg-blue-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageUrl || `https://picsum.photos/seed/${s.slug}/100/100`}
                        alt={s.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {s.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                          {formatVnd(s.salePriceVnd)}
                        </span>
                        {discount > 0 && (
                          <span className="rounded bg-rose-100 px-1 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Đã bán {s.soldQty}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="h-4 w-4 shrink-0 text-slate-400"
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
                className="flex w-full items-center justify-center gap-1 border-t border-slate-100 bg-slate-50 p-2 text-sm font-medium text-blue-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
              >
                Xem tất cả kết quả cho &quot;{query}&quot;
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      )}
    </div>
  )
}
