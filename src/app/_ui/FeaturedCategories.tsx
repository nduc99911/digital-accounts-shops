'use client'

import Link from 'next/link'
import { 
  Film, 
  Music, 
  Gamepad2, 
  BookOpen, 
  Zap, 
  ShoppingBag,
  Tv,
  Headphones,
  Code,
  CreditCard
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface FeaturedCategoriesProps {
  categories: Category[]
}

// Map category names to icons
const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('netflix') || lower.includes('phim') || lower.includes('movie') || lower.includes('video')) {
    return Film
  }
  if (lower.includes('spotify') || lower.includes('nhạc') || lower.includes('music')) {
    return Music
  }
  if (lower.includes('game') || lower.includes('steam') || lower.includes('play')) {
    return Gamepad2
  }
  if (lower.includes('sách') || lower.includes('book') || lower.includes('kindle')) {
    return BookOpen
  }
  if (lower.includes('app') || lower.includes('ứng dụng') || lower.includes('software')) {
    return Zap
  }
  if (lower.includes('tv') || lower.includes('television') || lower.includes('youtube')) {
    return Tv
  }
  if (lower.includes('chatgpt') || lower.includes('ai') || lower.includes('code')) {
    return Code
  }
  if (lower.includes('thẻ') || lower.includes('card') || lower.includes('nạp')) {
    return CreditCard
  }
  if (lower.includes('tai nghe') || lower.includes('headphone') || lower.includes('earphone')) {
    return Headphones
  }
  return ShoppingBag
}

// Color mapping for futuristic look
const getCategoryColor = (index: number) => {
  const colors = [
    { bg: 'from-violet-500/20 to-fuchsia-500/10', border: 'violet-500/30', glow: 'violet-500', icon: 'text-violet-400' },
    { bg: 'from-cyan-500/20 to-blue-500/10', border: 'cyan-500/30', glow: 'cyan-500', icon: 'text-cyan-400' },
    { bg: 'from-pink-500/20 to-rose-500/10', border: 'pink-500/30', glow: 'pink-500', icon: 'text-pink-400' },
    { bg: 'from-amber-500/20 to-orange-500/10', border: 'amber-500/30', glow: 'amber-500', icon: 'text-amber-400' },
    { bg: 'from-emerald-500/20 to-teal-500/10', border: 'emerald-500/30', glow: 'emerald-500', icon: 'text-emerald-400' },
    { bg: 'from-indigo-500/20 to-purple-500/10', border: 'indigo-500/30', glow: 'indigo-500', icon: 'text-indigo-400' },
    { bg: 'from-rose-500/20 to-red-500/10', border: 'rose-500/30', glow: 'rose-500', icon: 'text-rose-400' },
    { bg: 'from-sky-500/20 to-blue-500/10', border: 'sky-500/30', glow: 'sky-500', icon: 'text-sky-400' },
  ]
  return colors[index % colors.length]
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  // Take first 8 categories as featured
  const featuredCats = categories.slice(0, 8)

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Danh mục nổi bật
          </h2>
          <p className="mt-1 text-sm text-slate-500">Khám phá các dịch vụ phổ biến nhất</p>
        </div>
        <Link 
          href="/search"
          className="flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors hover:text-violet-700"
        >
          Xem tất cả
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {featuredCats.map((cat, index) => {
          const Icon = getCategoryIcon(cat.name)
          const colors = getCategoryColor(index)
          
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))`,
                borderColor: `rgba(139, 92, 246, 0.15)`,
              }}
            >
              {/* Gradient background on hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              
              {/* Glow effect */}
              <div 
                className="absolute -inset-1 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30"
                style={{
                  background: `radial-gradient(circle, var(--tw-colors-${colors.glow}) 0%, transparent 70%)`,
                }}
              />

              <div className="relative flex flex-col items-center gap-3">
                {/* Icon container */}
                <div 
                  className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colors.bg} transition-transform duration-300 group-hover:scale-110`}
                  style={{
                    border: `1px solid rgba(139, 92, 246, 0.2)`,
                  }}
                >
                  <Icon className={`h-7 w-7 ${colors.icon}`} />
                </div>

                {/* Category name */}
                <span className="text-center text-sm font-medium text-slate-700 transition-colors group-hover:text-violet-700 line-clamp-2">
                  {cat.name}
                </span>
              </div>

              {/* Corner accent */}
              <div 
                className="absolute right-0 top-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, rgba(139, 92, 246, 0.1) 50%)`,
                }}
              />
            </Link>
          )
        })}
      </div>

      {/* Quick access pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {['Netflix', 'Spotify', 'ChatGPT', 'Canva Pro', 'YouTube Premium'].map((tag, i) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="group relative overflow-hidden rounded-full px-4 py-2 text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(217, 70, 239, 0.05))',
              border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
          >
            <span className="relative z-10 text-slate-600 transition-colors group-hover:text-violet-600">
              {tag}
            </span>
            <div 
              className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
