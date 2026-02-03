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
  const [testResult, setTestResult] = useState<string | null>(null)

  async function setStatus(next: 'PENDING_PAYMENT' | 'SUCCESS') {
    setErr(null)
    setTestResult(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/god/orders/${id}`, {
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

  async function testPayment() {
    setErr(null)
    setTestResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/god/test-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId: id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((data as { error?: string })?.error || 'Test failed')
      setTestResult(`✅ Test OK: ${data.fulfillments} items fulfilled`)
      setTimeout(() => window.location.reload(), 1500)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Có lỗi'
      setErr(msg)
    } finally {
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

      {status === 'PENDING_PAYMENT' && (
        <button
          disabled={loading}
          onClick={testPayment}
          className="rounded-md border border-violet-500/50 bg-violet-500/20 px-2 py-1 text-xs text-violet-200 hover:bg-violet-500/30 disabled:opacity-50"
          title="Test thanh toán giả (dev only)"
        >
          🧪 Test Pay
        </button>
      )}

      {err ? <span className="text-xs text-rose-400">{err}</span> : null}
      {testResult ? <span className="text-xs text-emerald-400">{testResult}</span> : null}
    </div>
  )
}
