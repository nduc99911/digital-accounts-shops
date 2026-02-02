import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { parseViettelPayText } from '@/lib/viettelpay'

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const text = String(body?.text || '')
  if (!text.trim()) return NextResponse.json({ saved: 0 })

  const parsed = parseViettelPayText(text)
  if (parsed.length === 0) return NextResponse.json({ error: 'Không parse được dòng nào' }, { status: 400 })

  const created = await prisma.paymentTransaction.createMany({
    data: parsed.map((p) => ({
      provider: p.provider,
      txId: p.txId ?? null,
      occurredAt: p.occurredAt,
      amountInVnd: p.amountInVnd,
      balanceVnd: p.balanceVnd ?? null,
      description: p.description,
      raw: p.raw,
    })),
    skipDuplicates: true,
  })

  return NextResponse.json({ ok: true, saved: created.count })
}
