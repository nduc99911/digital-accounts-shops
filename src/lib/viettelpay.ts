export type ViettelPayParsed = {
  provider: 'viettelpay'
  occurredAt: Date
  amountInVnd: number
  balanceVnd?: number
  description: string
  txId?: string
  raw: string
}

function parseVndAmount(s: string) {
  // supports: +1.500.000, -750.000, 1500000
  const cleaned = s.replace(/[+\-]/g, '').replace(/\./g, '').replace(/,/g, '').trim()
  const n = Number(cleaned)
  return Number.isFinite(n) ? Math.trunc(n) : NaN
}

export function parseViettelPayLine(line: string): ViettelPayParsed | null {
  const raw = line.trim()
  if (!raw) return null

  // Example:
  // TK ViettelPay 9704...5654 GD +1.500.000 VND luc 2026-01-29 19:08:30 So du 3.188.175 VND ND: ... 6029ASCBJ28FJDAW
  // Another:
  // TK ViettelPay ... GD +750.000 VND luc 2026-01-29 17:48:37 So du 1.688.175 VND ND: hung

  const re = /GD\s*([+\-]?[0-9.,]+)\s*VND\s*luc\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s*So\s*du\s*([0-9.,]+)\s*VND\s*ND:\s*(.*)$/i
  const m = raw.match(re)
  if (!m) return null

  const amount = parseVndAmount(m[1])
  const occurredAt = new Date(m[2].replace(' ', 'T') + '+07:00')
  const balance = parseVndAmount(m[3])
  const tail = (m[4] || '').trim()

  // txId: last token if it looks like an alphanumeric id length >= 10
  const parts = tail.split(/\s+/).filter(Boolean)
  let txId: string | undefined
  if (parts.length > 0) {
    const last = parts[parts.length - 1]
    if (/^[A-Z0-9]{10,}$/i.test(last)) {
      txId = last
    }
  }

  const description = txId ? tail.replace(new RegExp(`${txId}$`), '').trim() : tail

  if (!Number.isFinite(amount) || !Number.isFinite(occurredAt.getTime())) return null

  return {
    provider: 'viettelpay',
    occurredAt,
    amountInVnd: amount,
    balanceVnd: Number.isFinite(balance) ? balance : undefined,
    description,
    txId,
    raw,
  }
}

export function parseViettelPayText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  return lines.map(parseViettelPayLine).filter((x): x is ViettelPayParsed => Boolean(x))
}
