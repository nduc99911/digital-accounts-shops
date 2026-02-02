'use client'

import { useState } from 'react'

export default function StatusActions({
  id,
  status,
}: {
  id: string
  status: 'PENDING_PAYMENT' | 'SUCCESS'
}) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function setStatus(next: 'PENDING_PAYMENT' | 'SUCCESS') {
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Update failed')
      // simplest: refresh page
      window.location.reload()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Có lỗi'
      setErr(msg)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={
          'rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ' +
          (status === 'SUCCESS'
            ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30'
            : 'bg-amber-500/15 text-amber-200 ring-amber-500/30')
        }
      >
        {status === 'SUCCESS' ? 'SUCCESS' : 'PENDING'}
      </span>

      <button
        disabled={loading || status === 'SUCCESS'}
        onClick={() => setStatus('SUCCESS')}
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100 hover:bg-white/10 disabled:opacity-50"
      >
        Mark SUCCESS
      </button>

      <button
        disabled={loading || status === 'PENDING_PAYMENT'}
        onClick={() => setStatus('PENDING_PAYMENT')}
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100 hover:bg-white/10 disabled:opacity-50"
      >
        Mark PENDING
      </button>

      {err ? <span className="text-xs text-rose-400">{err}</span> : null}
    </div>
  )
}
