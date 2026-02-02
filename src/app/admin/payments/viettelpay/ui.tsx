'use client'

import { useMemo, useState } from 'react'

type Row = {
  occurredAt: string
  amountInVnd: number
  balanceVnd?: number
  description: string
  txId?: string
  raw: string
}

export default function ViettelPayImportClient() {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const rows = useMemo<Row[]>(() => {
    // light client parse (server will re-parse on save)
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    const parsed: Row[] = []
    const re = /GD\s*([+\-]?[0-9.,]+)\s*VND\s*luc\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s*So\s*du\s*([0-9.,]+)\s*VND\s*ND:\s*(.*)$/i

    const parseVnd = (s: string) => {
      const cleaned = s.replace(/[+\-]/g, '').replace(/\./g, '').replace(/,/g, '').trim()
      return Math.trunc(Number(cleaned))
    }

    for (const raw of lines) {
      const m = raw.match(re)
      if (!m) continue
      const amountInVnd = parseVnd(m[1])
      const occurredAt = m[2]
      const balanceVnd = parseVnd(m[3])
      const tail = (m[4] || '').trim()
      const parts = tail.split(/\s+/).filter(Boolean)
      let txId: string | undefined
      if (parts.length) {
        const last = parts[parts.length - 1]
        if (/^[A-Z0-9]{10,}$/i.test(last)) txId = last
      }
      const description = txId ? tail.replace(new RegExp(`${txId}$`), '').trim() : tail
      parsed.push({ occurredAt, amountInVnd, balanceVnd, description, txId, raw })
    }

    return parsed
  }, [text])

  async function save() {
    setErr(null)
    setSaved(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/payments/viettelpay/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Save failed')
      setSaved(data?.saved ?? 0)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-3">
      <textarea
        className="min-h-[160px] rounded-md border border-white/10 bg-slate-950/40 p-3 font-mono text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30"
        placeholder="Dán tin nhắn ViettelPay (mỗi dòng 1 tin)…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={save}
          disabled={saving || !text.trim()}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {saving ? 'Đang lưu…' : 'Lưu vào DB'}
        </button>
        {saved != null ? <span className="text-sm text-emerald-200">Đã lưu: {saved} dòng</span> : null}
        {err ? <span className="text-sm text-rose-400">{err}</span> : null}
      </div>

      <div className="overflow-hidden rounded-lg bg-slate-900/60 shadow-sm ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-left text-slate-200">
            <tr>
              <th className="p-3 font-semibold">Thời gian</th>
              <th className="p-3 font-semibold">Số tiền vào</th>
              <th className="p-3 font-semibold">Nội dung</th>
              <th className="p-3 font-semibold">Mã GD</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-400" colSpan={4}>
                  Chưa parse được dòng nào (hãy dán đúng format ViettelPay).
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="border-t border-white/10 align-top hover:bg-white/5">
                  <td className="p-3 whitespace-nowrap text-slate-200">{r.occurredAt}</td>
                  <td className="p-3 whitespace-nowrap font-semibold text-emerald-200">
                    {r.amountInVnd.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3 text-slate-100">{r.description}</td>
                  <td className="p-3 whitespace-nowrap font-mono text-xs text-slate-200">{r.txId || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
