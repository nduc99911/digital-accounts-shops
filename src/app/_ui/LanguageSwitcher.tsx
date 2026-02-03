'use client'

import { useI18n } from './i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()

  return (
    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <button
        onClick={() => setLang('vi')}
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
          lang === 'vi'
            ? 'bg-white text-violet-600 shadow-sm dark:bg-slate-700'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
          lang === 'en'
            ? 'bg-white text-violet-600 shadow-sm dark:bg-slate-700'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  )
}
