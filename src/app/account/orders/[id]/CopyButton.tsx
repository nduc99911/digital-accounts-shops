'use client'

export default function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        // Show a simple toast notification
        const toast = document.createElement('div')
        toast.className = 'fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg animate-fade-in-up'
        toast.innerHTML = `
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Đã sao chép ${label}
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          toast.style.opacity = '0'
          toast.style.transform = 'translateY(10px)'
          setTimeout(() => toast.remove(), 300)
        }, 2000)
      }}
      className="group flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-violet-100 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-violet-500/20 dark:hover:text-violet-400"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span className="hidden sm:inline">Sao chép</span>
    </button>
  )
}
