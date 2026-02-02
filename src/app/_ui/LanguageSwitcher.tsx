'use client'

import { useEffect, useState } from 'react'

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<'vi' | 'en'>('vi')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as 'vi' | 'en'
    if (saved) setLocale(saved)
  }, [])

  const switchLang = (newLocale: 'vi' | 'en') => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <button
        onClick={() => switchLang('vi')}
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
          locale === 'vi'
            ? 'bg-white text-violet-600 shadow-sm dark:bg-slate-700'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => switchLang('en')}
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
          locale === 'en'
            ? 'bg-white text-violet-600 shadow-sm dark:bg-slate-700'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}
