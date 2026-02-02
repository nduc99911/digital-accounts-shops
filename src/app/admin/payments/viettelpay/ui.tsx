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
        className="min-h-[160px] rounded-md border bg-white p-3 font-mono text-xs"
        placeholder="Dán tin nhắn ViettelPay (mỗi dòng 1 tin)…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving || !text.trim()}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Đang lưu…' : 'Lưu vào DB'}
        </button>
        {saved != null ? <span className="text-sm text-emerald-700">Đã lưu: {saved} dòng</span> : null}
        {err ? <span className="text-sm text-red-600">{err}</span> : null}
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Số tiền vào</th>
              <th className="p-3">Nội dung</th>
              <th className="p-3">Mã GD</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={4}>
                  Chưa parse được dòng nào (hãy dán đúng format ViettelPay).
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="border-t align-top">
                  <td className="p-3 whitespace-nowrap">{r.occurredAt}</td>
                  <td className="p-3 whitespace-nowrap font-semibold text-emerald-700">
                    {r.amountInVnd.toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3">{r.description}</td>
                  <td className="p-3 whitespace-nowrap font-mono text-xs">{r.txId || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
