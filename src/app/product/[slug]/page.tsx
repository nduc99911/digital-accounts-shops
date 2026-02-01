import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatVnd } from '@/lib/shop'
import AddToCartButton from './ui'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug } })
  if (!p || !p.active) notFound()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href="/" className="text-lg font-bold">{process.env.SHOP_NAME || 'Bùi Lê Digital'}</Link>
          <Link href="/cart" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Giỏ hàng</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          <div className="mt-2 text-sm text-slate-600">{p.shortDesc || ''}</div>

          <div className="mt-4 grid gap-2 text-sm">
            <div><span className="text-slate-500">Thời hạn:</span> {p.duration || '—'}</div>
            <div><span className="text-slate-500">Bảo hành:</span> {p.warranty}</div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">{formatVnd(p.priceVnd)}</div>
            <AddToCartButton productId={p.id} name={p.name} priceVnd={p.priceVnd} />
          </div>

          {p.description && (
            <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap">
              {p.description}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
