'use client'

import { useMemo, useRef, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type CategoryOption = { slug: string; name: string }

function buildUrl(path: string, params: URLSearchParams) {
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export default function ProductSearchControls({
  basePath,
  categories,
  showCategory,
}: {
  basePath?: string
  categories?: CategoryOption[]
  showCategory?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const path = basePath || pathname

  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'new'
  const cat = searchParams.get('cat') || ''
  const min = searchParams.get('min') || ''
  const max = searchParams.get('max') || ''

  const qRef = useRef<HTMLInputElement>(null)
  const minRef = useRef<HTMLInputElement>(null)
  const maxRef = useRef<HTMLInputElement>(null)

  const sortOptions = useMemo(
    () => [
      { value: 'new', label: 'Mới nhất' },
      { value: 'price_asc', label: 'Giá thấp → cao' },
      { value: 'price_desc', label: 'Giá cao → thấp' },
      { value: 'sold_desc', label: 'Bán chạy' },
    ],
    [],
  )

  function readInputs() {
    return {
      q: (qRef.current?.value ?? q).trim(),
      min: (minRef.current?.value ?? min).trim(),
      max: (maxRef.current?.value ?? max).trim(),
    }
  }

  function push(next: { q?: string; sort?: string; cat?: string; min?: string; max?: string }, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString())

    const setOrDelete = (key: string, value?: string) => {
      const v = (value ?? '').trim()
      if (!v) params.delete(key)
      else params.set(key, v)
    }

    setOrDelete('q', next.q)
    setOrDelete('sort', next.sort)
    if (showCategory) setOrDelete('cat', next.cat)
    setOrDelete('min', next.min)
    setOrDelete('max', next.max)

    if (resetPage) params.delete('page')

    startTransition(() => {
      router.push(buildUrl(path, params))
    })
  }

  return (
    <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className={`grid gap-3 ${showCategory ? 'lg:grid-cols-[1fr_220px_220px_220px]' : 'lg:grid-cols-[1fr_240px_240px]'}`}>
        <div>
          <div className="text-xs font-semibold text-slate-600">Tìm kiếm</div>
          <input
            ref={qRef}
            defaultValue={q}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = readInputs()
                push({ q: v.q, sort, cat, min: v.min, max: v.max })
              }
            }}
            placeholder="Nhập tên sản phẩm..."
            className="mt-1 w-full rounded-md bg-white px-3 py-2 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                const v = readInputs()
                push({ q: v.q, sort, cat, min: v.min, max: v.max })
              }}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Tìm
            </button>
            <button
              onClick={() => {
                if (qRef.current) qRef.current.value = ''
                if (minRef.current) minRef.current.value = ''
                if (maxRef.current) maxRef.current.value = ''
                startTransition(() => router.push(path))
              }}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600">Sắp xếp</div>
          <select
            value={sort}
            onChange={(e) => {
              const v = e.target.value
              const inputs = readInputs()
              push({ q: inputs.q, sort: v, cat, min: inputs.min, max: inputs.max })
            }}
            className="mt-1 w-full rounded-md bg-white px-3 py-2 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {showCategory ? (
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-600">Danh mục</div>
              <select
                value={cat}
                onChange={(e) => {
                  const v = e.target.value
                  const inputs = readInputs()
                  push({ q: inputs.q, sort, cat: v, min: inputs.min, max: inputs.max })
                }}
                className="mt-1 w-full rounded-md bg-white px-3 py-2 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Tất cả</option>
                {(categories || []).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-600">Khoảng giá (VND)</div>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              ref={minRef}
              defaultValue={min}
              onBlur={() => {
                const v = readInputs()
                push({ q: v.q, sort, cat, min: v.min, max: v.max })
              }}
              placeholder="Min"
              inputMode="numeric"
              className="w-full rounded-md bg-white px-3 py-2 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              ref={maxRef}
              defaultValue={max}
              onBlur={() => {
                const v = readInputs()
                push({ q: v.q, sort, cat, min: v.min, max: v.max })
              }}
              placeholder="Max"
              inputMode="numeric"
              className="w-full rounded-md bg-white px-3 py-2 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mt-1 text-xs text-slate-500">Nhập số rồi click ra ngoài để áp dụng.</div>
        </div>
      </div>
    </div>
  )
}
